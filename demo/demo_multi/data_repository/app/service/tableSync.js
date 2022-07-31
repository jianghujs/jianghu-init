'use strict';

const Service = require('egg').Service;
const { tableEnum } = require('../constant/constant');
const dayjs = require('dayjs');
const validateUtil = require('egg-jianghu/app/common/validateUtil');
const _ = require('lodash');
const { BizError, errorInfoEnum } = require('../constant/error');
const actionDataScheme = Object.freeze({
  syncTable: {
    type: 'object',
    additionalProperties: true,
    required: [],
    properties: {
      sourceDatabase: { type: 'string' },
      sourceTable: { type: 'string' },
    },
  },
  deleteTableSyncConfig: {
    type: 'object',
    additionalProperties: true,
    required: [ 'id' ],
    properties: {
      id: { type: 'number' },
    },
  },
});

async function createTableSyncLog({ jianghuKnex, tableSyncConfig, syncDesc, syncAction }) {
  const syncTime = dayjs().format();
  await jianghuKnex(tableEnum.table_sync_log)
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
    const { database } = this.app.config.knex.client.connection;
    return database;
  }

  async selectSourceDatabase() {
    const { jianghuKnex } = this.app;

    const targetDatabase = this.getTargetDatabase();
    const rows = await jianghuKnex('information_schema.SCHEMATA')
      .whereNotIn('schema_name', [ targetDatabase, 'sys', 'information_schema' ])
      .orderBy('schema_name', 'desc')
      .select('schema_name as sourceDatabase');
    return { rows };
  }

  async selectSourceTable() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    const { sourceDatabase } = actionData;

    const rows = await jianghuKnex('information_schema.TABLES')
      .where({ table_schema: sourceDatabase, table_type: 'BASE TABLE' })
      .orderBy('table_name', 'desc')
      .select('table_name as sourceTable', 'table_schema as sourceDatabase');
    return { rows };
  }

  async deleteTableSyncConfig() {

    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.deleteTableSyncConfig, actionData);
    const { id } = actionData;

    const { jianghuKnex } = this.app;
    const tableSyncConfig = await jianghuKnex(tableEnum.table_sync_config).where({ id }).first();
    if (!tableSyncConfig) {
      throw new BizError(errorInfoEnum.data_not_found);
    }
    const { sourceDatabase, sourceTable } = tableSyncConfig;
    const targetTable = `${sourceDatabase}__${sourceTable}`;

    await jianghuKnex(tableEnum.table_sync_config)
      .where({ id })
      .delete();

    const DELETETriggerName = `${targetTable}_DELETE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${DELETETriggerName};`);
    const INSERTTriggerName = `${targetTable}_INSERT`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${INSERTTriggerName};`);
    const UPDATETriggerName = `${targetTable}_UPDATE`;
    await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${UPDATETriggerName};`);

    return;
  }

  /**
   *   1. 源表检查
   *      - 源表不存在 & 目标表不存在 则去标注一下 syncDesc: '源表不存在; 目标表不存在;'
   *      - 源表不存在 & 目标表存在 ===> syncDesc: '源表不存在; 目标表存在;' ===>管理员手动删除
   *   2. 一致性检查
   *      - 不一致 ===》目标表覆盖
   *   3. 触发器检查
   *      - 不一致 ===》触发器覆盖
   *   4. 清除无用的触发器
   * @param actionData
   * @return {Promise<void>}
   */
  async syncTable(actionData) {


    validateUtil.validate(actionDataScheme.syncTable, actionData);

    const tableSyncConfigSelectParams = _.pick(actionData, [ 'sourceDatabase', 'sourceTable' ]);

    const { jianghuKnex } = this.app;
    const targetDatabase = this.getTargetDatabase();
    const lastSyncTime = dayjs().format();

    let tableSyncConfigList = await jianghuKnex(tableEnum.table_sync_config)
      .where(tableSyncConfigSelectParams)
      .select();
    const allTable = await jianghuKnex('information_schema.tables').select('table_schema as database', 'table_name as tableName');
    const allTableMap = Object.fromEntries(allTable.map(obj => [ `${obj.database}.${obj.tableName}`, obj ]));

    tableSyncConfigList = await this.tableExistCheck({ tableSyncConfigList, allTableMap, targetDatabase });
    const tableSyncConfigIdList = tableSyncConfigList.map(item => item.id);

    // 标记为开始同步
    await jianghuKnex(tableEnum.table_sync_config)
      .whereIn('id', tableSyncConfigIdList)
      .update({ syncDesc: '同步中', lastSyncTime });

    await this.tableConsistentCheckAndSync({ tableSyncConfigList, allTableMap, targetDatabase });
    await this.tableMysqlTriggerCheckAndSync({ tableSyncConfigList, targetDatabase });
    await this.clearUselessMysqlTrigger();

    // 标记为正常
    await jianghuKnex(tableEnum.table_sync_config)
      .whereIn('id', tableSyncConfigIdList)
      .update({ syncDesc: '正常', lastSyncTime });

  }

  async tableExistCheck({ tableSyncConfigList, allTableMap, targetDatabase }) {
    const { jianghuKnex, logger } = this.app;
    const newTableSyncConfigList = [];
    const lastSyncTime = dayjs().format();
    for (const tableSyncConfig of tableSyncConfigList) {
      const { sourceDatabase, sourceTable } = tableSyncConfig;
      const targetTable = `${sourceDatabase}__${sourceTable}`;
      const sourceTableExist = allTableMap[`${sourceDatabase}.${sourceTable}`];
      const targetTableExist = allTableMap[`${targetDatabase}.${targetTable}`];


      if (!sourceTableExist && targetTableExist) {
        await jianghuKnex(tableEnum.table_sync_config)
          .where({ id: tableSyncConfig.id })
          .update({ syncDesc: '【表检查】源表不存在; 目标表存在;', lastSyncTime });
        logger.error(`[${targetTable}]`, '源表不存在; 目标表存在; ==> 若目标表废弃, 请手动删除目标库中 的 目标表');
        continue;
      }

      if (!sourceTableExist && !targetTableExist) {
        const syncDesc = '【表检查】源表不存在;';
        await jianghuKnex(tableEnum.table_sync_config)
          .where({ id: tableSyncConfig.id })
          .update({ syncDesc, lastSyncTime });
        logger.error(`[${targetTable}]`, syncDesc);
        continue;
      }
      newTableSyncConfigList.push(tableSyncConfig);
    }

    return newTableSyncConfigList;
  }

  async tableConsistentCheckAndSync({ tableSyncConfigList, allTableMap, targetDatabase }) {
    const { jianghuKnex, logger } = this.app;

    for (const tableSyncConfig of tableSyncConfigList) {
      const { sourceDatabase, sourceTable } = tableSyncConfig;
      const targetTable = `${sourceDatabase}__${sourceTable}`;
      const targetTableExist = allTableMap[`${targetDatabase}.${targetTable}`];

      const checkSumResult = await jianghuKnex.raw(`CHECKSUM TABLE ${targetDatabase}.${targetTable}, ${sourceDatabase}.${sourceTable}`);
      const checkSumIsConsistent = checkSumResult[0][0].Checksum === checkSumResult[0][1].Checksum;

      const sourceTableDDLResult = await jianghuKnex.raw(`SHOW CREATE TABLE ${sourceDatabase}.${sourceTable};`);
      const sourceTableDDL = sourceTableDDLResult[0][0]['Create Table'];
      const exceptTargetTableDDL = sourceTableDDL.replace(`CREATE TABLE \`${sourceTable}\``, `CREATE TABLE \`${targetTable}\``);
      let DDLIsConsistent = false;
      if (targetTableExist) {
        const targetTableDDLResult = await jianghuKnex.raw(`SHOW CREATE TABLE ${targetDatabase}.${targetTable};`);
        const targetTableDDL = targetTableDDLResult[0][0]['Create Table'];
        if (targetTableDDL === exceptTargetTableDDL) {
          DDLIsConsistent = true;
        }
      }

      if (!checkSumIsConsistent || !DDLIsConsistent) {
        await jianghuKnex.raw(`DROP TABLE IF EXISTS ${targetDatabase}.${targetTable};`);
        await jianghuKnex.raw(exceptTargetTableDDL);
        await jianghuKnex.raw(`REPLACE INTO ${targetDatabase}.${targetTable} select *from ${sourceDatabase}.${sourceTable};`);
        const syncDesc = checkSumIsConsistent === false ?
          '【表覆盖】数据不一致; 触发覆盖目标表逻辑;' :
          '【表覆盖】结构不一致; 触发覆盖目标表逻辑;';
        await createTableSyncLog({ jianghuKnex, tableSyncConfig, syncDesc, syncAction: '表覆盖' });
        logger.warn(`[${targetTable}]`, syncDesc);
      } else {
        logger.info(`[${targetTable}]`, '数据&结构一致; 无需覆盖;');
      }
    }


  }

  async tableMysqlTriggerCheckAndSync({ tableSyncConfigList, targetDatabase }) {
    const { jianghuKnex } = this.app;

    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', [ 'sys' ])
      .select('TRIGGER_NAME as triggerName', 'ACTION_STATEMENT as triggerContent');
    const allTriggerContentMap = Object.fromEntries(triggerList.map(obj => [ obj.triggerName, obj.triggerContent ]));

    for (const tableSyncConfig of tableSyncConfigList) {
      await this.createMysqlTriggerForSourceTable({ tableSyncConfig, targetDatabase, allTriggerContentMap });
    }

  }

  async createMysqlTriggerForSourceTable({ tableSyncConfig, targetDatabase, allTriggerContentMap }) {
    const { jianghuKnex, logger } = this.app;

    const { sourceDatabase, sourceTable } = tableSyncConfig;
    const targetTable = `${sourceDatabase}__${sourceTable}`;

    const columnListSelect = await jianghuKnex('information_schema.COLUMNS')
      .where({ TABLE_SCHEMA: sourceDatabase, TABLE_NAME: sourceTable })
      .select();
    const columnList = columnListSelect.map(item => item.COLUMN_NAME);
    const NEWColumnList = columnListSelect.map(item => 'NEW.' + item.COLUMN_NAME);
    const updateColumnList = columnListSelect.map(item => `${item.COLUMN_NAME}=NEW.${item.COLUMN_NAME}`);

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
      await createTableSyncLog({ jianghuKnex, tableSyncConfig, syncDesc, syncAction: '触发器覆盖' });
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
      await createTableSyncLog({ jianghuKnex, tableSyncConfig, syncDesc: 'insert 触发器覆盖', syncAction: '触发器覆盖' });
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
      await createTableSyncLog({ jianghuKnex, tableSyncConfig, syncDesc, syncAction: '触发器覆盖' });
      logger.warn(`[${targetTable}]`, syncDesc);
    } else {
      logger.info(`[${targetTable}]`, 'delete触发器已存在; 无需覆盖');
    }

  }


  async clearUselessMysqlTrigger() {

    const { jianghuKnex, logger } = this.app;
    const targetDatabase = this.getTargetDatabase();

    let tableSyncConfigList = await jianghuKnex(tableEnum.table_sync_config).select();
    const allTable = await jianghuKnex('information_schema.tables').select('table_schema as database', 'table_name as tableName');
    const allTableMap = Object.fromEntries(allTable.map(obj => [ `${obj.database}.${obj.tableName}`, obj ]));

    tableSyncConfigList = await this.tableExistCheck({ tableSyncConfigList, allTableMap, targetDatabase });

    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', [ 'sys' ])
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
