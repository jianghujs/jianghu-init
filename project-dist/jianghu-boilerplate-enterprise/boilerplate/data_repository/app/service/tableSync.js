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

  /**
   * 返回当前应用所在库
   * @return {Promise<*>}
   */
  getTargetDatabase() {
    const {database} = this.app.config.knex.client.connection;
    return database;
  }

  async selectSourceDatabase() {
    const {jianghuKnex, config} = this.app;
    const targetDatabase = this.getTargetDatabase();
    const rows = await jianghuKnex('information_schema.SCHEMATA')
      .where(function () {
        this.where('schema_name', 'like', 'jianghujs_enterprise' + '%')
      })
      // .whereNotIn('schema_name', [targetDatabase, 'sys', 'information_schema'])
      .orderBy('schema_name', 'desc')
      .select('schema_name as sourceDatabase');
    return {rows};
  }

  async selectSourceTable() {
    const {jianghuKnex} = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    const {sourceDatabase} = actionData;

    const rows = await jianghuKnex('information_schema.TABLES')
      .where({table_schema: sourceDatabase, table_type: 'BASE TABLE'})
      .orderBy('table_name', 'desc')
      .select('table_name as sourceTable', 'table_schema as sourceDatabase');
    return {rows};
  }

  async deleteTableSyncConfig() {
    const where = this.ctx.request.body.appData.where;
    const {id} = where;
    const {jianghuKnex} = this.app;
    const tableSyncConfig = await jianghuKnex('_table_sync_config').where({id}).first();
    if (!tableSyncConfig) {
      throw new BizError(errorInfoEnum.data_not_found);
    }
    const {sourceDatabase, sourceTable} = tableSyncConfig;

    await jianghuKnex('_table_sync_config')
      .where({id})
      .delete();

    // 如果是 json 则表明为外部数据库，不需要删除 trigger
    if (sourceDatabase.startsWith('{')) {
      return;
    }

    const targetTable = `${sourceDatabase}__${sourceTable}`;
    const DELETETriggerName = `${targetTable}_DELETE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${DELETETriggerName};`);
    const INSERTTriggerName = `${targetTable}_INSERT`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${INSERTTriggerName};`);
    const UPDATETriggerName = `${targetTable}_UPDATE`;
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
    const tableSyncConfigSelectParams = _.pick(actionData, ['sourceDatabase', 'sourceTable']);

    const {jianghuKnex, logger} = this.app;
    const targetDatabase = this.getTargetDatabase();
    const lastSyncTime = dayjs().format();
    const currentMinute = dayjs().diff(dayjs().format('YYYY-MM-DD'), 'minute');
    const outsideKnexMap = {};

    let tableSyncConfigList = await jianghuKnex('_table_sync_config')
      .where(tableSyncConfigSelectParams)
      .select();
    const allTable = await jianghuKnex('information_schema.tables').select('table_schema as database', 'table_name as tableName');
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

    tableSyncConfigList = await this.tableExistCheck({tableSyncConfigList, allTableMap, targetDatabase});
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

    await this.tableConsistentCheckAndSync({tableSyncConfigList, allTableMap, targetDatabase, outsideKnexMap});
    await this.tableMysqlTriggerCheckAndSync({tableSyncConfigList, targetDatabase});
    await this.clearUselessMysqlTrigger({allTableMap, outsideKnexMap});

    // 标记为正常
    await jianghuKnex('_table_sync_config')
      .whereIn('id', tableSyncConfigIdList)
      .update({syncDesc: '正常', lastSyncTime});

  }

  async tableExistCheck({tableSyncConfigList, allTableMap, targetDatabase}) {
    const {jianghuKnex, logger} = this.app;
    const newTableSyncConfigList = [];
    const lastSyncTime = dayjs().format();
    for (const tableSyncConfig of tableSyncConfigList) {
      const {sourceDatabase, sourceTable} = tableSyncConfig;
      let targetTable = `${sourceDatabase}__${sourceTable}`;
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

  async tableConsistentCheckAndSync({tableSyncConfigList, allTableMap, targetDatabase, outsideKnexMap}) {
    const {knex, jianghuKnex, logger} = this.app;
    for (const tableSyncConfig of tableSyncConfigList) {

      const {sourceDatabase, sourceTable} = tableSyncConfig;

      const sourceKnex = outsideKnexMap[sourceDatabase] || knex;
      const targetKnex = outsideKnexMap[targetDatabase] || knex;
      const targetConnection = {...this.app.config.knex.client.connection, database: targetDatabase};
      let sourceConnection = {...this.app.config.knex.client.connection, database: sourceDatabase};

      let outsideMode = false
      let targetTable = `${sourceDatabase}__${sourceTable}`;
      let sourceDatabaseInDb = sourceDatabase;
      if (sourceDatabase.startsWith('{')) {
        outsideMode = true
        const {name, ...knexConfig} = JSON.parse(sourceDatabase);
        sourceConnection = knexConfig;
        sourceDatabaseInDb = knexConfig.database;
        targetTable = `${name.toLowerCase()}__${sourceTable}`;
      }

      const targetTableExist = allTableMap[`${targetDatabase}.${targetTable}`];
      const sourceTableDDLResult = await sourceKnex.raw(`SHOW CREATE TABLE ${sourceDatabaseInDb}.${sourceTable};`);
      const sourceTableDDL = sourceTableDDLResult[0][0]['Create Table'];
      const exceptTargetTableDDL = sourceTableDDL
        .replace(`CREATE TABLE \`${sourceTable}\``, `CREATE TABLE \`${targetTable}\``)
        .replace(/AUTO_INCREMENT=\d+ ?/, '');
      let targetTableDDL = null;

      if (targetTableExist) {
        const targetTableDDLResult = await targetKnex.raw(`SHOW CREATE TABLE ${targetDatabase}.${targetTable};`);
        targetTableDDL = targetTableDDLResult[0][0]['Create Table'].replace(/AUTO_INCREMENT=\d+ ?/, '');
      }
      if (targetTableDDL !== exceptTargetTableDDL) {
        await targetKnex.raw(`DROP TABLE IF EXISTS ${targetDatabase}.${targetTable};`);
        await targetKnex.raw(exceptTargetTableDDL);
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

  async tableMysqlTriggerCheckAndSync({tableSyncConfigList, targetDatabase}) {
    const {jianghuKnex} = this.app;

    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys'])
      .select('TRIGGER_NAME as triggerName', 'ACTION_STATEMENT as triggerContent');
    const allTriggerContentMap = Object.fromEntries(triggerList.map(obj => [obj.triggerName, obj.triggerContent]));

    for (const tableSyncConfig of tableSyncConfigList) {
      await this.createMysqlTriggerForSourceTable({tableSyncConfig, targetDatabase, allTriggerContentMap});
    }

  }

  async createMysqlTriggerForSourceTable({tableSyncConfig, targetDatabase, allTriggerContentMap}) {
    const {jianghuKnex, logger} = this.app;

    const {sourceDatabase, sourceTable} = tableSyncConfig;
    // 外部数据库不需要建 trigger
    if (sourceDatabase.startsWith('{')) {
      return;
    }
    const targetTable = `${sourceDatabase}__${sourceTable}`;

    const columnListSelect = await jianghuKnex('information_schema.COLUMNS')
      .where({TABLE_SCHEMA: sourceDatabase, TABLE_NAME: sourceTable})
      .select();
    const columnList = columnListSelect.map(item => `\`${item.COLUMN_NAME}\``);
    const NEWColumnList = columnListSelect.map(item => `NEW.\`${item.COLUMN_NAME}\``);
    const updateColumnList = columnListSelect.map(item => `\`${item.COLUMN_NAME}\`=NEW.\`${item.COLUMN_NAME}\``);

    const INSERTTriggerName = `${targetTable}_INSERT`;
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

    const UPDATETriggerName = `${targetTable}_UPDATE`;
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

    const DELETETriggerName = `${targetTable}_DELETE`;
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
    const targetDatabase = this.getTargetDatabase();

    let tableSyncConfigList = await jianghuKnex('_table_sync_config').select();
    // 过滤 knex 连接失败的外部表同步配置
    tableSyncConfigList = tableSyncConfigList.filter(o => !o.sourceDatabase.startsWith('{') || outsideKnexMap[o.sourceDatabase])
    tableSyncConfigList = await this.tableExistCheck({tableSyncConfigList, allTableMap, targetDatabase});

    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys'])
      .select();

    for (const trigger of triggerList) {
      const {
        TRIGGER_SCHEMA: sourceDatabase,
        TRIGGER_NAME: triggerName, EVENT_MANIPULATION: triggerEvent,
      } = trigger;
      const tableSyncConfigExist = tableSyncConfigList.find(item => triggerName === `${item.sourceDatabase}__${item.sourceTable}_${triggerEvent}`);
      if (!tableSyncConfigExist) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${triggerName};`);
        logger.warn(`[${triggerName}]`, '无用的mysql trigger, 执行删除逻辑;');
      }
    }
  }

}

module.exports = UtilService;
