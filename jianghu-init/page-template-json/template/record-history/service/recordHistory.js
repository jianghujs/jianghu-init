'use strict';

const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('@jianghujs/jianghu/app/constant/error');
const _ = require('lodash');
const dayjs = require('dayjs');
// ========================================常用 require end=============================================

const tableNameProperty = { type: 'string', pattern: '^[A-Za-z0-9_]+$' };
const actionDataScheme = Object.freeze({
  selectItemListByTable: {
    type: 'object',
    additionalProperties: false,
    required: [ 'table' ],
    properties: {
      table: tableNameProperty,
    },
  },
  selectItemList: {
    type: 'object',
    additionalProperties: false,
    required: [ 'table', 'recordId' ],
    properties: {
      table: tableNameProperty,
      recordId: {
        anyOf: [
          { type: 'number' },
          { type: 'string', pattern: '^\\d+$' },
        ],
      },
    },
  },
  restoreRecordByRecordHistory: {
    type: 'object',
    additionalProperties: false,
    required: [ 'recordHistoryId' ],
    properties: {
      recordHistoryId: { type: 'number' },
    },
  },
});

class recordHistoryService extends Service {

  /**
   * 获取存在历史记录的数据表，供页面选择。
   */
  async selectTableList() {
    const { jianghuKnex } = this.ctx.app;
    const rows = await jianghuKnex('_record_history')
      .whereNotNull('table')
      .whereNot('table', '')
      .select('table')
      .count('* as historyCount')
      .max('operationAt as lastOperationAt')
      .groupBy('table')
      .orderBy('table', 'asc');
    if (!rows.some(item => item.table === '_user')) {
      rows.unshift({ table: '_user', historyCount: 0, lastOperationAt: null });
    }
    return { rows, count: rows.length };
  }

  toPlainRecord(record) {
    if (record == null) return {};
    if (_.isPlainObject(record)) return record;
    if (typeof record === 'object') return { ...record };
    return {};
  }

  /**
   * 获取使用中的数据列表：业务字段来自当前表，操作元数据优先取 _record_history 最新一条。
   */
  async selectOnUseItemListByTable() {
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.selectItemListByTable, actionData);
    const { jianghuKnex, knex } = this.ctx.app;
    const { table } = actionData;
    let rows = [];
    try {
      rows = await jianghuKnex(table)
        .orderBy([{ column: 'operationAt', order: 'desc' }])
        .select();
    } catch (err) {
      rows = await jianghuKnex(table)
        .orderBy([{ column: 'id', order: 'desc' }])
        .select();
    }

    if (!rows.length) {
      return { rows: [], count: 0 };
    }

    const recordIdList = rows.map(row => row.id).filter(id => id != null);
    const recordIdCountList = recordIdList.length
      ? await knex('_record_history')
        .where({ table })
        .whereIn('recordId', recordIdList)
        .select('recordId')
        .count('* as count')
        .groupBy('recordId')
      : [];
    const recordIdCountMap = _.keyBy(recordIdCountList, obj => obj.recordId);

    const maxIdItemList = recordIdList.length
      ? await jianghuKnex('_record_history')
        .where({ table })
        .whereIn('recordId', recordIdList)
        .select('recordId')
        .max('id as id')
        .groupBy('recordId')
      : [];
    const maxIdList = maxIdItemList.map(item => item.id).filter(id => id != null);
    const latestHistoryList = maxIdList.length
      ? await jianghuKnex('_record_history')
        .whereIn('id', maxIdList)
        .select('recordId', 'operation', 'operationByUserId', 'operationByUser', 'operationAt')
      : [];
    const latestHistoryMap = _.keyBy(latestHistoryList, obj => obj.recordId);

    const safeRows = rows.map(row => {
      const plainRow = this.toPlainRecord(row);
      const recordId = plainRow.id;
      const recordIdCount = recordIdCountMap[recordId] || { count: 0 };
      const latestHistory = latestHistoryMap[recordId] || {};
      return {
        ...this.sanitizeRecord(plainRow),
        id: recordId,
        operation: latestHistory.operation ?? plainRow.operation ?? null,
        operationByUserId: latestHistory.operationByUserId ?? plainRow.operationByUserId ?? null,
        operationByUser: latestHistory.operationByUser ?? plainRow.operationByUser ?? null,
        operationAt: latestHistory.operationAt ?? plainRow.operationAt ?? null,
        recordHistoryId: null,
        count: Number(recordIdCount.count) || 0,
      };
    });

    return { rows: safeRows, count: safeRows.length };
  }

  /**
   * 获取已删除的数据列表
   */
  async selectDeletedItemListByTable() {
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.selectItemListByTable, actionData);
    const { jianghuKnex, logger } = this.ctx.app;
    const { table } = actionData;

    const maxIdItemList = await jianghuKnex('_record_history')
      .where({ table })
      .select('table', 'recordId')
      .max('id as id')
      .count('* as count')
      .groupBy('table', 'recordId');
    const recordIdMap = _.keyBy(maxIdItemList, obj => obj.recordId);
    const maxIdList = maxIdItemList.map(item => item.id);


    const recordHistoryList = await jianghuKnex('_record_history')
      .where({ operation: 'jhDelete' })
      .whereIn('id', maxIdList)
      .orderBy([{ column: 'id', order: 'desc' }])
      .select();
    const recordList = recordHistoryList.map(recordHistory => {
      const { id: recordHistoryId, recordId, recordContent } = recordHistory;
      let record = {};
      try {
        record = JSON.parse(recordContent);
      } catch (err) {
        logger.error('[selectDeleteItemListByTable]', 'JSON.parse(row) error', err);
      }
      const plainRecord = this.toPlainRecord(record);
      return {
        ...this.sanitizeRecord(plainRecord),
        id: plainRecord.id ?? recordId,
        recordId,
        operation: recordHistory.operation,
        operationByUserId: recordHistory.operationByUserId,
        operationByUser: recordHistory.operationByUser,
        operationAt: recordHistory.operationAt,
        count: Number(recordIdMap[recordId].count) || 0,
        recordHistoryId,
      };
    });

    const count = recordList.length;
    return { rows: recordList, count };
  }

  /**
   * 获取单条数据的历史版本；仅返回页面展示所需内容，不下发原始 recordContent/packageContent。
   */
  async selectItemList() {
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.selectItemList, actionData);
    const { jianghuKnex, logger } = this.ctx.app;
    const { table, recordId } = actionData;
    const historyList = await jianghuKnex('_record_history')
      .where({ table, recordId })
      .orderBy('id', 'desc')
      .select(
        'id',
        'recordContent',
        'operation',
        'operationByUserId',
        'operationByUser',
        'operationAt'
      );
    const recordList = historyList.map(item => {
      let record = {};
      try {
        record = JSON.parse(item.recordContent);
      } catch (err) {
        logger.error('[selectItemList]', 'JSON.parse(recordContent) error', err);
      }
      return {
        ...this.sanitizeRecord(record),
        recordHistoryId: item.id,
        operation: item.operation,
        operationByUserId: item.operationByUserId,
        operationByUser: item.operationByUser,
        operationAt: item.operationAt,
      };
    });
    const ignoredFieldSet = new Set([
      'operation', 'operationByUserId', 'operationByUser', 'operationAt',
      'recordHistoryId', 'changedFieldList', 'changedFieldCount', 'changedFieldText',
    ]);
    recordList.forEach((record, index) => {
      const previousRecord = recordList[index + 1] || {};
      const changedFieldList = _.uniq([
        ...Object.keys(record),
        ...Object.keys(previousRecord),
      ]).filter(field => (
        !ignoredFieldSet.has(field)
        && !_.isEqual(record[field], previousRecord[field])
      ));
      record.changedFieldList = changedFieldList;
      record.changedFieldCount = changedFieldList.length;
      record.changedFieldText = changedFieldList.join(', ');
    });
    return { rows: recordList, count: recordList.length };
  }

  sanitizeRecord(record) {
    const sensitiveFieldPattern = /(password|secret|token|salt)/i;
    const sanitizeValue = value => {
      if (Array.isArray(value)) {
        return value.map(item => sanitizeValue(item));
      }
      if (value && typeof value === 'object') {
        return Object.entries(value).reduce((result, [ key, childValue ]) => {
          if (!sensitiveFieldPattern.test(key)) {
            result[key] = sanitizeValue(childValue);
          }
          return result;
        }, {});
      }
      return value;
    };
    return sanitizeValue(this.toPlainRecord(record));
  }

  /**
   * 恢复数据
   */
  async restoreRecordByRecordHistory() {
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.restoreRecordByRecordHistory, actionData);
    const { userId, username } = this.ctx.userInfo;
    const { jianghuKnex, knex } = this.ctx.app;
    const { recordHistoryId } = actionData;
    const recordHistory = await jianghuKnex('_record_history').where({ id: recordHistoryId }).first();
    if (!recordHistory) {
      throw new BizError(errorInfoEnum.data_not_found);
    }

    const { table, recordId, recordContent } = recordHistory;
    const record = JSON.parse(recordContent);
    const tableColumnInfo = await knex(table).columnInfo();
    const restorableRecord = _.pick(record, Object.keys(tableColumnInfo));
    if (_.isEmpty(restorableRecord)) {
      throw new BizError(errorInfoEnum.data_not_found);
    }

    // Tip: jianghuKnex.insert 会覆盖 operation; 所以这里用knex
    await knex.transaction(async trx => {

      const operation = 'jhRestore';
      const operationAt = dayjs().format();
      const operationByUserId = userId;
      const operationByUser = username;
      const auditData = _.pick(
        { operation, operationAt, operationByUserId, operationByUser },
        Object.keys(tableColumnInfo)
      );
      const newData = { ...restorableRecord, ...auditData };

      // restore 操作 也要衍生出一条 recordHistory
      await trx('_record_history').insert({
        table, recordId, recordContent: JSON.stringify(newData),
        packageContent: '{}',
        operation, operationAt, operationByUserId, operationByUser,
      });

      // 先查，然后 update/insert
      const recordListTemp = await trx(table).where({ id: recordId }).select();
      if (recordListTemp.length > 0) {
        await trx(table).where({ id: recordId }).update(newData);
      } else {
        await trx(table).insert(newData);
      }

    });


    return;
  }

}
module.exports = recordHistoryService;
