'use strict';

const Service = require('egg').Service;
const dayjs = require('dayjs');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const hyperDiff = require('@jianghujs/jianghu/app/common/hyperDiff');
const _ = require('lodash');
const {BizError, errorInfoEnum} = require('../constant/error');
const Knex = require('knex');

const appDataSchema = Object.freeze({
  syncTable: {
    type: 'object',
    additionalProperties: true,
    required: [],
    properties: {
      sourceDatabase: {type: 'string'},
      sourceTable: {type: 'string'},
    },
  },
  deleteTableSyncConfig: {
    type: 'object',
    additionalProperties: true,
    required: ['id'],
    properties: {
      id: {type: 'number'},
    },
  },
});

async function createTableSyncLog({jianghuKnex, tableSyncConfig, syncDesc, syncAction}) {
  const syncTime = dayjs().format();
  await jianghuKnex('_table_sync_log')
    .insert({
      sourceDatabase: tableSyncConfig.sourceDatabase, sourceTable: tableSyncConfig.sourceTable,
      syncAction, syncDesc,
      syncTime,
    });
}

class UtilService extends Service {

  async selectItemList() {
    const {jianghuKnex} = this.app;
      const rows = await jianghuKnex('_table_sync_config')
        .orderBy([{column: 'sourceDatabase', order: 'asc'}, {column: 'targetTable', order: 'asc'}])
        .select();
      const allTable = await jianghuKnex('information_schema.tables').select('table_schema as database', 'table_name as tableName', 'table_type as tableType');
      const allTableMap = Object.fromEntries(allTable.map(obj => [`${obj.database}.${obj.tableName}`, obj]));
      rows.forEach(row => {
        row.tableType = allTableMap[`${row.sourceDatabase}.${row.sourceTable}`].tableType;
      })
      return { rows };
  }

  getConfig() {
    const config = this.app.config;
    const defaultTargetDatabase = config.knex.client.connection.database;
    const { triggerPrefix } = config;
    const syncTriggerPrefix = `${triggerPrefix}_sync`;
    return { defaultTargetDatabase, syncTriggerPrefix };
  }

  async selectSourceDatabase() {
    const {jianghuKnex, config} = this.app;
    const rows = await jianghuKnex('information_schema.SCHEMATA')
      .whereNotIn('schema_name', ['sys', 'information_schema'])
      .orderBy('schema_name', 'desc')
      .select('schema_name as sourceDatabase');
    const { defaultTargetDatabase } = this.getConfig();  
    return { defaultTargetDatabase, rows};
  }

  async selectSourceTable() {
    const {jianghuKnex} = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    const {sourceDatabase} = actionData;

    const tableRows = await jianghuKnex('information_schema.TABLES')
      .where({table_schema: sourceDatabase, table_type: 'BASE TABLE'})
      .orderBy('table_name', 'desc')
      .select('table_name as sourceTable', 'table_schema as sourceDatabase');
    
    const viewRows = await jianghuKnex('information_schema.TABLES')
      .where({table_schema: sourceDatabase, table_type: 'VIEW'})
      .orderBy('table_name', 'desc')
      .select('table_name as sourceTable', 'table_schema as sourceDatabase');
    return { tableRows, viewRows };
  }

  async deleteTableSyncConfig() {
    const { id } = this.ctx.request.body.appData.actionData;
    const { jianghuKnex } = this.app;
    const { syncTriggerPrefix } = this.getConfig();
    const tableSyncConfig = await jianghuKnex('_table_sync_config').where({ id }).first();
    if (!tableSyncConfig) {
      throw new BizError(errorInfoEnum.data_not_found);
    }
    const { sourceDatabase } = tableSyncConfig;
    await jianghuKnex('_table_sync_config')
      .where({id})
      .delete();

    // 如果是 json 则表明为外部数据库，不需要删除 trigger
    if (sourceDatabase.startsWith('{')) {
      return;
    }
    const targetTable = tableSyncConfig.targetTable;
    const DELETETriggerName = `${syncTriggerPrefix}_${targetTable}_DELETE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${DELETETriggerName};`);
    const INSERTTriggerName = `${syncTriggerPrefix}_${targetTable}_INSERT`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${INSERTTriggerName};`);
    const UPDATETriggerName = `${syncTriggerPrefix}_${targetTable}_UPDATE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${UPDATETriggerName};`);
    return;
  }

  /**
   *   1. 应用表检查
   *      - 应用表不存在 & 仓库表不存在 则去标注一下 syncDesc: '应用表不存在; 仓库表不存在;'
   *      - 应用表不存在 & 仓库表存在 ===> syncDesc: '应用表不存在; 仓库表存在;' ===>管理员手动删除
   *   2. 一致性检查
   *      - 不一致 ===》仓库表覆盖
   *   3. 触发器检查
   *      - 不一致 ===》触发器覆盖
   *   4. 清除无用的触发器
   * @param actionData
   * @return {Promise<void>}
   */
  async syncTable(actionData) {
    // Tip: 适配schedule调用, actionData从入参取

    validateUtil.validate(appDataSchema.syncTable, actionData);
    const {useSyncTimeSlotFilter} = actionData;
    const tableSyncConfigWhere = _.pick(actionData, ['id']);

    const {jianghuKnex, logger} = this.app;
    const lastSyncTime = dayjs().format();
    const currentMinute = dayjs().diff(dayjs().format('YYYY-MM-DD'), 'minute');
    const outsideKnexMap = {};

    let tableSyncConfigList = await jianghuKnex('_table_sync_config')
      .where(tableSyncConfigWhere)
      .select();
    const allTable = await jianghuKnex('information_schema.tables').select('table_schema as database', 'table_name as tableName', 'table_type as tableType');
    const allTableMap = Object.fromEntries(allTable.map(obj => [`${obj.database}.${obj.tableName}`, obj]));

    // 准备外部数据库 knex，并补充外部数据库表结构信息
    const validTableSyncConfigList = [];
    for (const tableSyncConfig of tableSyncConfigList) {
      const {sourceDatabase} = tableSyncConfig;
      if (sourceDatabase.startsWith('{') && !outsideKnexMap[sourceDatabase]) {
        const {name, ...knexConfig} = JSON.parse(sourceDatabase);
        try {
          outsideKnexMap[sourceDatabase] = Knex({client: 'mysql', connection: knexConfig});
          const outsideKnex = outsideKnexMap[sourceDatabase];
          const allTableOutside = await outsideKnex('information_schema.tables').select('table_schema as database', 'table_name as tableName');
          allTableOutside.forEach(obj => allTableMap[`${sourceDatabase}.${obj.tableName}`] = obj);
        } catch (err) {
          delete outsideKnexMap[sourceDatabase]
          const syncDesc = '【数据库连接】外部连接失败;' + err;
          await jianghuKnex('_table_sync_config')
            .where({id: tableSyncConfig.id})
            .update({syncDesc, lastSyncTime});
          logger.error(`[database-${name}]【数据库连接】外部连接失败`, syncDesc);
          continue;
        }
      }
      validTableSyncConfigList.push(tableSyncConfig);
    }
    tableSyncConfigList = validTableSyncConfigList;

    tableSyncConfigList = await this.tableExistCheck({tableSyncConfigList, allTableMap});
    if (useSyncTimeSlotFilter === true) {
      tableSyncConfigList = tableSyncConfigList.filter(x => x.syncTimeSlot && currentMinute % parseInt(x.syncTimeSlot) === 0);
    }
    logger.info('[syncTable] 要同步的应用表:', tableSyncConfigList.map(item => `${item.sourceDatabase}.${item.sourceTable}`));
    if (tableSyncConfigList.length === 0) {
      logger.info('[syncTable] 没有要同步应用表');
      return;
    }

    const tableSyncConfigIdList = tableSyncConfigList.map(item => item.id);
    // 标记为开始同步
    await jianghuKnex('_table_sync_config')
      .whereIn('id', tableSyncConfigIdList)
      .update({syncDesc: '同步中', lastSyncTime});

    // 筛选要创建trigger的表，使用==兼容数据库读出数据类型不一致的情况
    const tableSyncTriggerList = tableSyncConfigList
      .filter(x => x.enableMysqlTrigger !== '关闭')
      .filter(x => allTableMap[`${x.sourceDatabase}.${x.sourceTable}`].tableType === 'BASE TABLE');
    await this.tableConsistentCheckAndSync({tableSyncConfigList, allTableMap, outsideKnexMap});
    await this.tableMysqlTriggerCheckAndSync({tableSyncTriggerList});
    await this.clearUselessMysqlTrigger({allTableMap, outsideKnexMap});

    // 标记为正常
    await jianghuKnex('_table_sync_config')
      .whereIn('id', tableSyncConfigIdList)
      .update({syncDesc: '正常', lastSyncTime});
  }

  async tableExistCheck({tableSyncConfigList, allTableMap}) {
    const {jianghuKnex, logger} = this.app;
    const newTableSyncConfigList = [];
    const lastSyncTime = dayjs().format();
    for (const tableSyncConfig of tableSyncConfigList) {
      const {targetDatabase, targetTable, sourceDatabase, sourceTable} = tableSyncConfig;
      if (sourceDatabase.startsWith('{')) {
        const {name} = JSON.parse(sourceDatabase);
        targetTable = `${name.toLowerCase()}__${sourceTable}`;
      }
      const sourceTableExist = allTableMap[`${sourceDatabase}.${sourceTable}`];
      const targetTableExist = allTableMap[`${targetDatabase}.${targetTable}`];


      if (!sourceTableExist && targetTableExist) {
        await jianghuKnex('_table_sync_config')
          .where({id: tableSyncConfig.id})
          .update({syncDesc: '【表检查】应用表不存在; 仓库表存在;', lastSyncTime});
        logger.error(`[${targetTable}]`, '应用表不存在; 仓库表存在; ==> 若仓库表废弃, 请手动删除目标库中 的 仓库表');
        continue;
      }

      if (!sourceTableExist && !targetTableExist) {
        const syncDesc = '【表检查】应用表不存在;';
        await jianghuKnex('_table_sync_config')
          .where({id: tableSyncConfig.id})
          .update({syncDesc, lastSyncTime});
        logger.error(`[${targetTable}]`, syncDesc);
        continue;
      }
      newTableSyncConfigList.push(tableSyncConfig);
    }

    return newTableSyncConfigList;
  }

  // TODO: 这里优化下
  async getCreateTableSqlFromView({targetTable,columnsDefinition,viewDefinition}){
    // 构建sql语句
    let sql = `CREATE TABLE \`${targetTable}\` (\n`
    for(const index in columnsDefinition){
      const {COLUMN_NAME,IS_NULLABLE,COLUMN_TYPE,CHARACTER_SET_NAME,COLLATION_NAME,COLUMN_COMMENT} = columnsDefinition[index];
      // sql += `\`${COLUMN_NAME}\` ${COLUMN_TYPE}${CHARACTER_SET_NAME ? ` CHARACTER SET ${CHARACTER_SET_NAME}`:''}${COLLATION_NAME ? ` COLLATE ${COLLATION_NAME}`:''}${COLUMN_TYPE.includes("text") ? '' : (IS_NULLABLE==='YES'?' DEFAULT NULL':' NOT NULL')}${COLUMN_COMMENT?` COMMENT '${COLUMN_COMMENT}'`:''}`
      sql += `\`${COLUMN_NAME}\` ${COLUMN_TYPE}${COLUMN_TYPE.includes("text") ? '' : (IS_NULLABLE==='YES'?' DEFAULT NULL':' NOT NULL')}${COLUMN_COMMENT?` COMMENT '${COLUMN_COMMENT}'`:''}`
      if(index != columnsDefinition.length - 1){
        sql += ","
      } 
      sql += "\n"
    }
    const {CHARACTER_SET_CLIENT} = viewDefinition;
    // 数据表排序规则、字符定义
    sql += `) ENGINE=InnoDB DEFAULT CHARSET=${CHARACTER_SET_CLIENT}`
    return sql;
  }

  async tableConsistentCheckAndSync({tableSyncConfigList, allTableMap, outsideKnexMap}) {
    const {knex, jianghuKnex, logger} = this.app;
    for (const tableSyncConfig of tableSyncConfigList) {

      const {targetDatabase, targetTable, sourceDatabase, sourceTable} = tableSyncConfig;

      const sourceKnex = outsideKnexMap[sourceDatabase] || knex;
      const targetKnex = outsideKnexMap[targetDatabase] || knex;
      const targetConnection = {...this.app.config.knex.client.connection, database: targetDatabase};
      let sourceConnection = {...this.app.config.knex.client.connection, database: sourceDatabase};

      let outsideMode = false
      let sourceDatabaseInDb = sourceDatabase;
      if (sourceDatabase.startsWith('{')) {
        outsideMode = true
        const {name, ...knexConfig} = JSON.parse(sourceDatabase);
        sourceConnection = knexConfig;
        sourceDatabaseInDb = knexConfig.database;
      }

      const targetTableExist = allTableMap[`${targetDatabase}.${targetTable}`];
      
      // 构建的预期目标表DDL语句
      let exceptTargetTableDDL;
      // 判断取到的是VIEW还是TABLE
      const tableType = allTableMap[`${sourceDatabase}.${sourceTable}`].tableType
      if(tableType === "VIEW"){
        // 查询information_schema中视图对应的字段定义并拼接sql
        const columnsDefinition = (await sourceKnex.raw(`SELECT COLUMN_NAME,IS_NULLABLE,COLUMN_TYPE,CHARACTER_SET_NAME,COLLATION_NAME,COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = '${sourceDatabaseInDb}' AND TABLE_NAME = '${sourceTable}';`))[0]
        const viewDefinition = (await sourceKnex.raw(`SELECT CHARACTER_SET_CLIENT,COLLATION_CONNECTION FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_SCHEMA = '${sourceDatabaseInDb}' AND TABLE_NAME = '${sourceTable}';`))[0][0]
        exceptTargetTableDDL = await this.getCreateTableSqlFromView({targetTable,columnsDefinition,viewDefinition});
        exceptTargetTableDDL = exceptTargetTableDDL.replace(/AUTO_INCREMENT=\d+ ?/, '').replace(/\n\s*/g, '');
      }
      if(tableType === "BASE TABLE"){
        const sourceTableDDLResult = await sourceKnex.raw(`SHOW CREATE TABLE ${sourceDatabaseInDb}.${sourceTable};`);
        const sourceTableDDL = sourceTableDDLResult[0][0]['Create Table'];
        exceptTargetTableDDL = sourceTableDDL && sourceTableDDL
          .replace(`CREATE TABLE \`${sourceTable}\``, `CREATE TABLE \`${targetTable}\``)
          .replace(/AUTO_INCREMENT=\d+ ?/, '').replace(/\n\s*/g, '');
      }
      let targetTableDDL = null;

      if (targetTableExist) {
        const targetTableDDLResult = await targetKnex.raw(`SHOW CREATE TABLE ${targetDatabase}.${targetTable};`);
        targetTableDDL = targetTableDDLResult[0][0]['Create Table'].replace(/AUTO_INCREMENT=\d+ ?/, '').replace(/\n\s*/g, '');
      }
      // 如果目标表存在则不用创建
      if (targetTableDDL !== exceptTargetTableDDL) {
        await targetKnex.raw(`DROP TABLE IF EXISTS ${targetDatabase}.${targetTable};`);
        const excuteTargetTableDDL = exceptTargetTableDDL.replace(`CREATE TABLE \`${targetTable}\``, `CREATE TABLE \`${targetDatabase}\`.\`${targetTable}\``).replace(/AUTO_INCREMENT=\d+ ?/, '');
        // const excuteTargetTableDDL = exceptTargetTableDDL
        await targetKnex.raw(excuteTargetTableDDL);
        if (outsideMode) {
          const syncDesc = '【表覆盖】结构不一致; 由于外部库，未触发覆盖仓库表逻辑;';
          await createTableSyncLog({jianghuKnex, tableSyncConfig, syncDesc, syncAction: '外部库不触发仓库表覆盖'});
          logger.warn(`[${targetTable}]`, syncDesc);
        } else {
          await targetKnex.raw(`REPLACE INTO ${targetDatabase}.${targetTable} select * from ${sourceDatabase}.${sourceTable};`);
          const syncDesc = '【表覆盖】结构不一致; 触发覆盖仓库表逻辑;';
          await createTableSyncLog({jianghuKnex, tableSyncConfig, syncDesc, syncAction: '仓库表覆盖'});
          logger.warn(`[${targetTable}]`, syncDesc);
          continue;
        }
      }

      const hyperDiffResult = await hyperDiff({
        oldDatabaseConnectionConfig: targetConnection,
        oldTable: targetTable,
        newDatabaseConnectionConfig: sourceConnection,
        newTable: sourceTable,
        splitCount: 2,
        stopThreshold: 10,
        ignoreColumns: [],
      });
      let hyperDiffIsConsistent = hyperDiffResult.added.length === 0 && hyperDiffResult.removed.length === 0 && hyperDiffResult.changed.length === 0;
      if (!hyperDiffIsConsistent) {
        const {added, removed, changed} = hyperDiffResult;
        if (added.length > 0) {
          await knex(`${targetDatabase}.${targetTable}`).insert(added);
        }
        if (removed.length > 0) {
          const idList = removed.map(item => item.id);
          await knex(`${targetDatabase}.${targetTable}`).whereIn('id', idList).delete();
        }
        if (changed.length > 0) {
          for (const item of changed) {
            const {id, ...updateParam} = item.new;
            await knex(`${targetDatabase}.${targetTable}`).where({id}).update(updateParam);
          }
        }
        const syncDesc = '【数据同步】数据不一致; 触发数据同步逻辑;';
        await createTableSyncLog({jianghuKnex, tableSyncConfig, syncDesc, syncAction: '数据同步'});
        logger.warn(`[${targetTable}]`, syncDesc);
        continue;
      }

      logger.info(`[${targetTable}]`, '数据&结构一致; 无需覆盖;');
    }
  }

  async tableMysqlTriggerCheckAndSync({tableSyncTriggerList}) {
    const {jianghuKnex} = this.app;
    const { syncTriggerPrefix } = this.getConfig();
    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys'])
      .where('TRIGGER_NAME', 'like', `${syncTriggerPrefix}_%`)
      .select('TRIGGER_NAME as triggerName', 'ACTION_STATEMENT as triggerContent', 'TRIGGER_SCHEMA as database');

    for (const tableSyncConfig of tableSyncTriggerList) {
      // 精准查询某个数据库内的触发器、不同的数据库内触发器名字可能相同
      const allTriggerContentMap = Object.fromEntries(triggerList.filter(e => e.database === tableSyncConfig.sourceDatabase).map(obj => [obj.triggerName, obj.triggerContent]));
      await this.createMysqlTriggerForSourceTable({tableSyncConfig, allTriggerContentMap, syncTriggerPrefix});
    }

  }

  async createMysqlTriggerForSourceTable({tableSyncConfig, allTriggerContentMap, syncTriggerPrefix}) {
    const {jianghuKnex, logger} = this.app;
    const { targetDatabase, targetTable, sourceDatabase, sourceTable} = tableSyncConfig;
    // 外部数据库不需要建 trigger
    if (sourceDatabase.startsWith('{')) {
      return;
    }

    const columnListSelect = await jianghuKnex('information_schema.COLUMNS')
      .where({TABLE_SCHEMA: sourceDatabase, TABLE_NAME: sourceTable})
      .select();
    const columnList = columnListSelect.map(item => `\`${item.COLUMN_NAME}\``);
    const NEWColumnList = columnListSelect.map(item => `NEW.\`${item.COLUMN_NAME}\``);
    const updateColumnList = columnListSelect.map(item => `\`${item.COLUMN_NAME}\`=NEW.\`${item.COLUMN_NAME}\``);

    const INSERTTriggerName = `${syncTriggerPrefix}_${targetTable}_INSERT`.slice(-64);
    const INSERTTriggerContentSql = `BEGIN
            INSERT INTO \`${targetDatabase}\`.\`${targetTable}\`
            (${columnList.join(',')})
            VALUES
            (${NEWColumnList.join(',')});
        END`;
    const INSERTTriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${INSERTTriggerName}\` AFTER INSERT
        ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
        ${INSERTTriggerContentSql}`;
    if (!allTriggerContentMap[INSERTTriggerName] || allTriggerContentMap[INSERTTriggerName] !== INSERTTriggerContentSql) {
      await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${INSERTTriggerName};`);
      await jianghuKnex.raw(INSERTTriggerCreateSql);
      const syncDesc = 'insert 触发器覆盖';
      await createTableSyncLog({jianghuKnex, tableSyncConfig, syncDesc, syncAction: '触发器覆盖'});
      logger.warn(`[${targetTable}]`, syncDesc);
    } else {
      logger.info(`[${targetTable}]`, 'insert触发器已存在; 无需覆盖');
    }

    const UPDATETriggerName = `${syncTriggerPrefix}_${targetTable}_UPDATE`.slice(-64);
    const UPDATETriggerContentSql = `BEGIN
            UPDATE \`${targetDatabase}\`.\`${targetTable}\`
            SET ${updateColumnList.join(',')}
            where id=OLD.id;
        END`;
    const UPDATETriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${UPDATETriggerName}\` AFTER UPDATE
        ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
        ${UPDATETriggerContentSql}`;
    if (!allTriggerContentMap[UPDATETriggerName] || allTriggerContentMap[UPDATETriggerName] !== UPDATETriggerContentSql) {
      await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${UPDATETriggerName};`);
      await jianghuKnex.raw(UPDATETriggerCreateSql);
      const syncDesc = 'update 触发器覆盖';
      await createTableSyncLog({jianghuKnex, tableSyncConfig, syncDesc: 'insert 触发器覆盖', syncAction: '触发器覆盖'});
      logger.warn(`[${targetTable}]`, syncDesc);
    } else {
      logger.info(`[${targetTable}]`, 'update触发器已存在; 无需覆盖');
    }

    const DELETETriggerName = `${syncTriggerPrefix}_${targetTable}_DELETE`.slice(-64);
    const DELETETriggerContentSql = `BEGIN
            DELETE FROM \`${targetDatabase}\`.\`${targetTable}\` WHERE id = OLD.id;
        END`;
    const DELETETriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${DELETETriggerName}\` AFTER DELETE
        ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
        ${DELETETriggerContentSql}`;
    if (!allTriggerContentMap[DELETETriggerName] || allTriggerContentMap[DELETETriggerName] !== DELETETriggerContentSql) {
      await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${DELETETriggerName};`);
      await jianghuKnex.raw(DELETETriggerCreateSql);
      const syncDesc = 'delete 触发器覆盖';
      await createTableSyncLog({jianghuKnex, tableSyncConfig, syncDesc, syncAction: '触发器覆盖'});
      logger.warn(`[${targetTable}]`, syncDesc);
    } else {
      logger.info(`[${targetTable}]`, 'delete触发器已存在; 无需覆盖');
    }

  }


  async clearUselessMysqlTrigger({allTableMap, outsideKnexMap}) {
    const {jianghuKnex, logger} = this.app;
    const { syncTriggerPrefix } = this.getConfig();

    let tableSyncConfigList = await jianghuKnex('_table_sync_config').select();
    tableSyncConfigList = tableSyncConfigList
      // 过滤 knex 连接失败的外部表同步配置
      .filter(o => !o.sourceDatabase.startsWith('{') || outsideKnexMap[o.sourceDatabase])
      .filter(x => x.enableMysqlTrigger !== '关闭')
      .filter(x => {
        return allTableMap[`${x.sourceDatabase}.${x.sourceTable}`] && allTableMap[`${x.sourceDatabase}.${x.sourceTable}`].tableType === 'BASE TABLE'
      });
    tableSyncConfigList = await this.tableExistCheck({tableSyncConfigList, allTableMap});
    tableSyncConfigList.forEach(o => o.targetTable = o.targetTable);

    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys'])
      .where('TRIGGER_NAME', 'like', `${syncTriggerPrefix}_%`)
      .select();

    for (const trigger of triggerList) {
      const {
        TRIGGER_SCHEMA: sourceDatabase,
        TRIGGER_NAME: triggerName, EVENT_MANIPULATION: triggerEvent,
      } = trigger;
      const tableSyncConfigExist = tableSyncConfigList.find(item => triggerName === `${syncTriggerPrefix}_${item.targetTable}_${triggerEvent}`.slice(-64) || triggerName === `${syncTriggerPrefix}_${item.targetTable}_${triggerEvent}`);
      if (!tableSyncConfigExist) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${triggerName};`);
        logger.warn(`[${triggerName}]`, '无用的mysql trigger, 执行删除逻辑;');
      }
    }
  }

}

module.exports = UtilService;
