'use strict';

const Service = require('egg').Service;
const dayjs = require('dayjs');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const _ = require('lodash');
const {BizError, errorInfoEnum} = require('../constant/error');
const Knex = require('knex');
const hyperDiffMerge = require('../common/hyperDiffMerge');

const appDataSchema = Object.freeze({
  mergeTable: {
    type: 'object',
    additionalProperties: true,
    required: [],
    properties: {
      targetDatabase: {type: 'string'},
      targetTable: {type: 'string'},
    },
  },
  deleteTableMergeConfig: {
    type: 'object',
    additionalProperties: true,
    required: ['id'],
    properties: {
      id: {type: 'number'},
    },
  },
});

function compareTableForMerge(sql1, sql2) {
  // 使用正则表达式提取列定义
  const columnDefRegex = /\((.*)\)/s;

  // 将列定义分割为单独的列
  let table1Columns = [];
  let table2Columns = [];
  const match1 = columnDefRegex.exec(sql1);
  const match2 = columnDefRegex.exec(sql2);
  if (match1) {
    table1Columns = match1[1]
      .split(',')
      .map(s => s.trim())
      .filter(s => !s.startsWith('PRIMARY KEY')) // 排除主键定义
      .filter(s => !s.startsWith('`id`'))        // 排除指定的列
      .filter(s => !s.startsWith('`incrementId`'))
      .filter(s => !s.startsWith('`appId`'));
  };
  if (match2) {
    table2Columns = match2[1]
      .split(',')
      .map(s => s.trim())
      .filter(s => !s.startsWith('PRIMARY KEY')) // 排除主键定义
      .filter(s => !s.startsWith('`id`'))        // 排除指定的列
      .filter(s => !s.startsWith('`incrementId`'))
      .filter(s => !s.startsWith('`appId`'));
  };
  // 比较差异
  const uniqueToTable1 = table1Columns.filter(col => !table2Columns.includes(col));
  const uniqueToTable2 = table2Columns.filter(col => !table1Columns.includes(col));
  const isDiff = uniqueToTable1.length > 0 || uniqueToTable2.length > 0;
  return isDiff;
}

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

  getConfig() {
    const config = this.app.config;
    const defaultTargetDatabase = config.knex.client.connection.database;
    const { triggerPrefix } = config;
    const mergeTriggerPrefix = `${triggerPrefix}_merge`;
    return { defaultTargetDatabase, mergeTriggerPrefix };
  }

  async deleteTableMergeConfig() {
  }


  async doTableMerge(actionData) {
    // Tip: 适配schedule调用, actionData从入参取
    validateUtil.validate(appDataSchema.mergeTable, actionData);
    const {useSyncTimeSlotFilter} = actionData;
    const tableMergeConfigWhere= _.pick(actionData, ['id']);
    
    const {jianghuKnex, logger} = this.app;

    const allTable = await jianghuKnex('information_schema.tables').select('table_schema as database', 'table_name as tableName');
    const allTableMap = Object.fromEntries(allTable.map(obj => [`${obj.database}.${obj.tableName}`, obj]));

    let tableMergeConfigList = await jianghuKnex('_table_merge_config')
      .where(tableMergeConfigWhere)
      .select();
    tableMergeConfigList.forEach(item => { item.sourceList = JSON.parse(item.sourceList || '[]');})
    tableMergeConfigList = tableMergeConfigList.filter(item => item.sourceList.length > 0);
    tableMergeConfigList = await this.tableMergeCheck({tableMergeConfigList, allTableMap});
    await this.tableConsistentCheckAndSync({tableMergeConfigList, allTableMap});
    await this.tableMysqlTriggerCheckAndSync({tableMergeConfigList});
    await this.clearUselessMysqlTrigger({allTableMap});
  }

  async tableMergeCheck({tableMergeConfigList, allTableMap}) {
    const {jianghuKnex, logger} = this.app;

    tableMergeConfigList.forEach(item => item.sourceList=item.sourceList.filter(source => allTableMap[`${source.database}.${source.tableName}`]));
    tableMergeConfigList = tableMergeConfigList.filter(item => item.sourceList.length > 0);
    const tableMergeConfigListNew = [];
    for (const tableConfig of tableMergeConfigList) {
      const sourceList = tableConfig.sourceList;
      if (sourceList.length == 1) { continue; }
      const masterSource = sourceList[0];
      const masterSourceDDLResult = await jianghuKnex.raw(`SHOW CREATE TABLE ${masterSource.database}.${masterSource.tableName};`);
      let masterSourceDDL = masterSourceDDLResult[0][0]['Create Table'];
      masterSourceDDL = masterSourceDDL.replace(/AUTO_INCREMENT=\d+ ?/, '');
      let mergeDesc = '';
      for (let i = 1; i < sourceList.length; i++) {
        const currentSource = sourceList[i];
        const currentSourceDDLResult = await jianghuKnex.raw(`SHOW CREATE TABLE ${currentSource.database}.${currentSource.tableName};`);
        let currentSourceDDL = currentSourceDDLResult[0][0]['Create Table'];
        currentSourceDDL = currentSourceDDL
          .replace(`CREATE TABLE \`${currentSource.tableName}\``, `CREATE TABLE \`${masterSource.tableName}\``)
          .replace(/AUTO_INCREMENT=\d+ ?/, '');
        if (masterSourceDDL != currentSourceDDL) {
          mergeDesc += `${currentSource.database}.${currentSource.tableName}和主表结构不一致; `;
        }
      }
      if (mergeDesc) {
        await jianghuKnex('_table_merge_config').update({ mergeDesc }).where({ id: tableConfig.id });
      }
      if (!mergeDesc) {
        tableMergeConfigListNew.push(tableConfig);
      }
    }
    return tableMergeConfigListNew;
  }

  async tableConsistentCheckAndSync({tableMergeConfigList, allTableMap}) {
    const {knex, logger} = this.app;
    const lastMergeTime = dayjs().format();
    for (const tableConfig of tableMergeConfigList) {
      if (tableConfig.sourceList.length === 0) { continue; }
      await knex('_table_merge_config').where({ id: tableConfig.id }).update({ lastMergeTime, mergeDesc: '开始' });
      const { targetDatabase, targetTable } = tableConfig;
      const sourceDatabase = tableConfig.sourceList[0].database;
      const sourceTable = tableConfig.sourceList[0].tableName;
      const targetTableExist = allTableMap[`${targetDatabase}.${targetTable}`];
      const sourceTableDDLResult = await knex.raw(`SHOW CREATE TABLE ${sourceDatabase}.${sourceTable};`);
      const sourceTableDDL = sourceTableDDLResult[0][0]['Create Table'];
      const exceptTargetTableDDL = sourceTableDDL
        .replace(`CREATE TABLE \`${sourceTable}\``, `CREATE TABLE \`${targetDatabase}\`.\`${targetTable}\``)
        .replace(/AUTO_INCREMENT=\d+ ?/, '');
      let targetTableDDL = null;
      if (targetTableExist) {
        const targetTableDDLResult = await knex.raw(`SHOW CREATE TABLE ${targetDatabase}.${targetTable};`);
        targetTableDDL = targetTableDDLResult[0][0]['Create Table'].replace(/AUTO_INCREMENT=\d+ ?/, '');
      }
      const isDiff = compareTableForMerge(targetTableDDL, exceptTargetTableDDL);
      if (isDiff) {
        await knex.raw(`DROP TABLE IF EXISTS \`${targetDatabase}\`.\`${targetTable}\`;`);
        await knex.raw(exceptTargetTableDDL);
        await knex.raw(`ALTER TABLE \`${targetDatabase}\`.\`${targetTable}\`
          ADD COLUMN \`incrementId\` int(11) NOT NULL AUTO_INCREMENT FIRST,
          ADD COLUMN \`appId\` varchar(255) DEFAULT NULL AFTER \`incrementId\`,
          MODIFY COLUMN \`id\` int(11) NULL DEFAULT NULL AFTER \`appId\`,
          DROP PRIMARY KEY,
          ADD PRIMARY KEY (\`incrementId\`) USING BTREE;`);
        const selectDataSql = tableConfig.sourceList
          .map(source => `select null as incrementId, '${source.appId}' as appId, a.* from \`${source.database}\`.\`${source.tableName}\` as a`)
          .join(' UNION ');
        await knex.raw(`REPLACE INTO \`${targetDatabase}\`.\`${targetTable}\` ${selectDataSql};`);
        logger.info(`[merge][${targetTable}]`, '结构不一致; 创建成功;');
      }

      const targetConnection = {...this.app.config.knex.client.connection, database: targetDatabase};
      let hasHyperDiff = false;
      const appIdList = tableConfig.sourceList.map(source => source.appId);
      for (const source of tableConfig.sourceList) {
        const { appId } = source; 
        const sourceConnection = {...this.app.config.knex.client.connection, database: source.database};
        const hyperDiffResult = await hyperDiffMerge({
          oldDatabaseConnectionConfig: targetConnection,
          oldTable: targetTable, oldDataWhere: { appId },
          newDatabaseConnectionConfig: sourceConnection,
          newTable: source.tableName,
          splitCount: 2,
          stopThreshold: 10,
          ignoreColumns: ['incrementId', 'appId'],
        });
        let hyperDiffIsConsistent = hyperDiffResult.added.length === 0 && hyperDiffResult.removed.length === 0 && hyperDiffResult.changed.length === 0;
        if (!hyperDiffIsConsistent) {
          hasHyperDiff = true;
          const {added, removed, changed} = hyperDiffResult;
          added.forEach(item => { item.appId = appId; })
          changed.forEach(item => { item.appId = appId; })
          if (added.length > 0) {
            await knex(`${targetDatabase}.${targetTable}`).insert(added);
          }
          if (removed.length > 0) {
            const idList = removed.map(item => item.id);
            await knex(`${targetDatabase}.${targetTable}`).where({ appId }).whereIn('id', idList).delete();
          }
          if (changed.length > 0) {
            for (const item of changed) {
              const {id, ...updateParam} = item.new;
              await knex(`${targetDatabase}.${targetTable}`).where({ appId }).where({id}).update(updateParam);
            }
          }
        }  
      }    
      await knex(`${targetDatabase}.${targetTable}`).whereNotIn('appId', appIdList).delete();
      if (hasHyperDiff) {
        logger.info(`[merge][${targetTable}]`, '数据不一致; 同步成功;');
      } 
      if (!hasHyperDiff) {
        logger.info(`[merge][${targetTable}]`, '数据一致; 无需同步;');
      } 
    
      await knex('_table_merge_config').where({ id: tableConfig.id }).update({ mergeDesc: '正常' });
    }
  }

  async tableMysqlTriggerCheckAndSync({tableMergeConfigList}) {
    const {jianghuKnex} = this.app;
    const { mergeTriggerPrefix } = this.getConfig();
    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys'])
      .where('TRIGGER_NAME', 'like', `${mergeTriggerPrefix}_%`)
      .select('TRIGGER_NAME as triggerName', 'ACTION_STATEMENT as triggerContent');
    const allTriggerContentMap = Object.fromEntries(triggerList.map(obj => [obj.triggerName, obj.triggerContent]));

    for (const tableConfig of tableMergeConfigList) {
      if (tableConfig.sourceList.length === 0) { continue; }
      await this.createMysqlTriggerForSourceTable({tableConfig, allTriggerContentMap, mergeTriggerPrefix});
    }
  }

  async createMysqlTriggerForSourceTable({tableConfig, allTriggerContentMap, mergeTriggerPrefix}) {
    const {jianghuKnex, logger} = this.app;
    const { targetDatabase, targetTable, sourceList } = tableConfig;
    for (const source of sourceList) {
      const sourceDatabase = source.database;
      const sourceTable = source.tableName;
      const appId = source.appId;

      const columnListSelect = await jianghuKnex('information_schema.COLUMNS')
        .where({TABLE_SCHEMA: sourceDatabase, TABLE_NAME: sourceTable})
        .select();
      const columnList = columnListSelect.map(item => `\`${item.COLUMN_NAME}\``);
      const NEWColumnList = columnListSelect.map(item => `NEW.\`${item.COLUMN_NAME}\``);
      const updateColumnList = columnListSelect.map(item => `\`${item.COLUMN_NAME}\`=NEW.\`${item.COLUMN_NAME}\``);
      const INSERTTriggerName = `${mergeTriggerPrefix}_${appId}_${targetDatabase}_${targetTable}_INSERT`;
      const INSERTTriggerContentSql = `BEGIN
              INSERT INTO \`${targetDatabase}\`.\`${targetTable}\`
              (\`appId\`,${columnList.join(',')})
              VALUES
              ("${appId}",${NEWColumnList.join(',')});
          END`;
      const INSERTTriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${INSERTTriggerName}\` AFTER INSERT
          ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
          ${INSERTTriggerContentSql}`;
      if (!allTriggerContentMap[INSERTTriggerName] || allTriggerContentMap[INSERTTriggerName] !== INSERTTriggerContentSql) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${INSERTTriggerName};`);
        await jianghuKnex.raw(INSERTTriggerCreateSql);
        const syncDesc = 'insert 触发器覆盖';
        logger.warn(`[merge][${targetTable}]`, syncDesc);
      } else {
        logger.info(`[merge][${targetTable}]`, 'insert触发器已存在; 无需覆盖');
      }

      const UPDATETriggerName = `${mergeTriggerPrefix}_${appId}_${targetDatabase}_${targetTable}_UPDATE`;
      const UPDATETriggerContentSql = `BEGIN
              UPDATE \`${targetDatabase}\`.\`${targetTable}\`
              SET ${updateColumnList.join(',')}
              where id=OLD.id and appId="${appId}";
          END`;
      const UPDATETriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${UPDATETriggerName}\` AFTER UPDATE
          ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
          ${UPDATETriggerContentSql}`;
      if (!allTriggerContentMap[UPDATETriggerName] || allTriggerContentMap[UPDATETriggerName] !== UPDATETriggerContentSql) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${UPDATETriggerName};`);
        await jianghuKnex.raw(UPDATETriggerCreateSql);
        const syncDesc = 'update 触发器覆盖';
        logger.warn(`[merge][${targetTable}]`, syncDesc);
      } else {
        logger.info(`[merge][${targetTable}]`, 'update触发器已存在; 无需覆盖');
      }


      const DELETETriggerName = `${mergeTriggerPrefix}_${appId}_${targetDatabase}_${targetTable}_DELETE`;
      const DELETETriggerContentSql = `BEGIN
              DELETE FROM \`${targetDatabase}\`.\`${targetTable}\` WHERE id = OLD.id and appId="${appId}";
          END`;
      const DELETETriggerCreateSql = `CREATE TRIGGER \`${sourceDatabase}\`.\`${DELETETriggerName}\` AFTER DELETE
          ON \`${sourceDatabase}\`.\`${sourceTable}\` FOR EACH ROW
          ${DELETETriggerContentSql}`;
      if (!allTriggerContentMap[DELETETriggerName] || allTriggerContentMap[DELETETriggerName] !== DELETETriggerContentSql) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${DELETETriggerName};`);
        await jianghuKnex.raw(DELETETriggerCreateSql);
        const syncDesc = 'delete 触发器覆盖';
        logger.warn(`[merge][${targetTable}]`, syncDesc);
      } else {
        logger.info(`[merge][${targetTable}]`, 'delete触发器已存在; 无需覆盖');
      }
    }
    
  }

  async clearUselessMysqlTrigger({allTableMap}) {
    const {jianghuKnex, logger} = this.app;
    const { mergeTriggerPrefix } = this.getConfig();

    const tableConfigList = await jianghuKnex('_table_merge_config').select();
    tableConfigList.forEach(item => { item.sourceList = JSON.parse(item.sourceList || '[]');})
    const triggerCheckMap = {};
    tableConfigList.forEach(tableConfig => {
      const { sourceList, targetDatabase, targetTable } = tableConfig;
      for (const source of sourceList) {
        const appId = source.appId;
        triggerCheckMap[`${mergeTriggerPrefix}_${appId}_${targetDatabase}_${targetTable}_INSERT`] = true;
        triggerCheckMap[`${mergeTriggerPrefix}_${appId}_${targetDatabase}_${targetTable}_UPDATE`] = true;
        triggerCheckMap[`${mergeTriggerPrefix}_${appId}_${targetDatabase}_${targetTable}_DELETE`] = true;
      }
    })

    const triggerList = await jianghuKnex('information_schema.triggers')
      .whereNotIn('TRIGGER_SCHEMA', ['sys'])
      .where('TRIGGER_NAME', 'like', `${mergeTriggerPrefix}_%`)
      .select();

    for (const trigger of triggerList) {
      const {
        TRIGGER_SCHEMA: sourceDatabase,
        TRIGGER_NAME: triggerName, EVENT_MANIPULATION: triggerEvent,
      } = trigger;
      if (!triggerCheckMap[triggerName]) {
        await jianghuKnex.raw(`DROP TRIGGER IF EXISTS ${sourceDatabase}.${triggerName};`);
        logger.warn(`[merge][${triggerName}]`, '无用的mysql trigger, 执行删除逻辑;');
      }
    }
  }

}

module.exports = UtilService;
