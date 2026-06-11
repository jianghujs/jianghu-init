'use strict';
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

/** page.hook / pageHook → _page.pageHook 存库字符串；空对象视为 null */
const serializePageHook = pageHook => {
  if (pageHook == null) return null;
  if (typeof pageHook === 'string') {
    const trimmed = pageHook.trim();
    if (!trimmed || trimmed === '{}') return null;
    return trimmed;
  }
  if (typeof pageHook === 'object') {
    if (!Object.keys(pageHook).length) return null;
    return JSON.stringify(pageHook);
  }
  return null;
};

/** 规范化后比较 pageHook（忽略 JSON 格式差异） */
const normalizePageHookValue = value => {
  if (value == null || value === '') return null;
  if (typeof value === 'object') {
    if (!Object.keys(value).length) return null;
    return JSON.stringify(value);
  }
  const str = String(value).trim();
  if (!str || str === '{}') return null;
  try {
    return JSON.stringify(JSON.parse(str));
  } catch (e) {
    return str;
  }
};

const resolvePageHook = jsonConfig => {
  const raw = jsonConfig.pageHook != null
    ? jsonConfig.pageHook
    : (jsonConfig.page && jsonConfig.page.hook);
  return serializePageHook(raw);
};

/**
 * 待同步的 _page / _resource 记录列表（resolvePageSyncEntries）。
 * v7：仅同步 renderVue 本次写出的端（jsonConfig.v7GeneratedTargets）。
 */
const { resolvePageSyncEntries } = require('../v7/mobilePageId');

const dbMixin = {
  /**
   * 检查并同步 _page 表记录（pageId 不存在则插入；pageName / pageHook 变更则更新）
   * v7：按 v7GeneratedTargets 同步（生成 PC 则 base pageId，生成 mobile 则 mobile/{pageId}）
   * @param {Object} jsonConfig
   */
  async checkPage(jsonConfig) {
    const { jhId } = jsonConfig;
    const entries = resolvePageSyncEntries(jsonConfig);
    if (!entries.length) return;

    const pageHookStr = resolvePageHook(jsonConfig);
    const knex = await this.getKnex();
    const pageColumnInfo = await knex('_page').columnInfo();
    const hasPageHookColumn = !!pageColumnInfo.pageHook;

    for (const entry of entries) {
      await this.syncOnePageRecord(knex, {
        ...entry,
        jhId,
        pageHookStr,
        hasPageHookColumn,
      });
    }
  },

  /**
   * 同步单条 _page 记录
   * @param {import('knex').Knex} knex
   * @param {Object} opts
   */
  async syncOnePageRecord(knex, opts) {
    const { pageId, pageName, pageType, jhId, pageHookStr, hasPageHookColumn } = opts;
    const operationByUserId = `jianghu-init/${pageId}`;
    const where = { pageId };
    if (jhId) { where.jhId = jhId; }

    const existPage = await knex('_page').where(where).first();
    const pageData = { pageId, pageName, operationByUserId };
    if (jhId) { pageData.jhId = jhId; }
    if (hasPageHookColumn) { pageData.pageHook = pageHookStr; }

    if (existPage) {
      const nameChanged = existPage.pageName !== pageName;
      const opChanged = existPage.operationByUserId !== operationByUserId;
      const hookChanged = hasPageHookColumn
        && normalizePageHookValue(existPage.pageHook) !== normalizePageHookValue(pageHookStr);
      if (!nameChanged && !opChanged && !hookChanged) return;

      const changes = [];
      if (nameChanged) changes.push(`pageName ${existPage.pageName} => ${pageName}`);
      if (hookChanged) changes.push('pageHook');
      this.notice(`更新页面 [${pageId}]${changes.length ? ': ' + changes.join(', ') : ''}`);
      await knex('_page').where({ id: existPage.id }).update(pageData);
      return;
    }

    this.notice(`新增页面 [${pageId}] ${pageName}`);
    await knex('_page').insert({ ...pageData, pageType: pageType || 'showInMenu' });
  },

  /**
   * 同步 _resource 表：对比 resourceList 中的每条记录，有则更新、无则插入。
   * 与 checkPage 相同：生成哪端就对哪端的 pageId 跑 resourceList。
   * @param {Object} jsonConfig
   */
  async handleOtherResource(jsonConfig) {
    const { resourceList, jhId } = jsonConfig;
    if (!Array.isArray(resourceList) || !resourceList.length) return;

    const pageEntries = resolvePageSyncEntries(jsonConfig);
    if (!pageEntries.length) return;

    for (const { pageId } of pageEntries) {
      await this.syncResourceListForPageId({ pageId, resourceList, jhId });
    }
  },

  /**
   * @param {{ pageId: string, resourceList: Array, jhId?: * }} opts
   */
  async syncResourceListForPageId(opts) {
    const { pageId, resourceList, jhId } = opts;
    if (!pageId || !Array.isArray(resourceList) || !resourceList.length) return;

    const knex = this.knex;
    const where = { pageId };
    if (jhId) { where.jhId = jhId; }
    const existResourceList = await knex('_resource').where(where);
    for (const { actionId, resourceType, desc = null, resourceData, resourceHook = null, operationByUserId = `jianghu-init/${pageId}` } of resourceList) {
      const resourceDataStr = _.isObject(resourceData) ? JSON.stringify(resourceData) : resourceData;
      const resourceHookStr = _.isObject(resourceHook) ? JSON.stringify(resourceHook) : resourceHook;
      // eslint-disable-next-line eqeqeq
      const resourceItem = existResourceList.find(e => e.actionId == actionId);
      if (resourceItem) {
        let isDiff = false;
        const updateData = { actionId, pageId, resourceType, desc, resourceData: resourceDataStr, resourceHook: resourceHookStr, operationByUserId };
        _.forEach(updateData, (value, key) => {
          if ((value || null) !== (resourceItem[key] || null)) {
            isDiff = true;
            updateData[key] = updateData[key] || null;
          }
        });
        if (!isDiff) continue;
        await knex('_resource').where({ id: resourceItem.id }).update(updateData);
      }
      if (!resourceItem) {
        const data = { pageId, actionId, desc, resourceType, resourceData: resourceDataStr, resourceHook: resourceHookStr, operationByUserId };
        if (jhId) { data.jhId = jhId; }
        await knex('_resource').insert(data);
      }
    }
  },

  /**
   * 读取数据库表原生字段列表（COLUMN_NAME / COLUMN_COMMENT）
   * @param {Object} jsonConfig
   * @returns {Promise<Array>}
   */
  async getTableFields(jsonConfig) {
    const { table } = jsonConfig;
    const knex = await this.getKnex();
    const result = await knex.select('COLUMN_NAME', 'COLUMN_COMMENT').from('INFORMATION_SCHEMA.COLUMNS').where({
      TABLE_SCHEMA: this.dbSetting.database,
      TABLE_NAME: table,
    });
    await this.initTableFields(jsonConfig);
    return result.map(column => ({
      COLUMN_NAME: column.COLUMN_NAME,
      COLUMN_COMMENT: (column.COLUMN_COMMENT || column.COLUMN_NAME || '').split(';')[0].split('；')[0].split(':')[0],
    }));
  },

  /**
   * 检测 table 依赖字段是否存在，不存在则自动创建（operation / operationByUserId 等）
   * @param {String} table
   * @param {Object} idGenerate
   */
  async checkTableFields(table, idGenerate) {
    const knex = await this.getKnex();
    const tableInfo = await knex('information_schema.tables').where({ table_name: table, table_schema: this.dbSetting.database }).first();
    if (!tableInfo || tableInfo.TABLE_TYPE === 'VIEW') { return; }
    const columnList = await knex(table).columnInfo();
    const defaultColumn = [ 'operation', 'operationByUserId', 'operationByUser', 'operationAt' ];
    if (idGenerate && idGenerate.type === 'idSequence') defaultColumn.push('idSequence');
    const noticeFieldList = [];
    for (const column of defaultColumn) {
      if (!columnList[column]) {
        return knex.schema.table(table, t => {
          this.info(`创建依赖字段：${column}`);
          noticeFieldList.push(column);
          if (column === 'idSequence') {
            t.integer(column).after('id');
          } else {
            t.string(column);
          }
        });
      }
    }
    noticeFieldList.length && this.success(`创建依赖字段：${noticeFieldList.join('、')}`);
  },

  /**
   * 批量处理组件 resource（已废弃，保留兼容）
   * @param {Object} jsonConfig
   */
  async modifyComponentResource(jsonConfig) {
    if (this.argv.devModel) return;
    const templatePath = `${path.join(__dirname, '../../../')}page-template-json/component`;
    const componentList = this.getConfigComponentList(jsonConfig);
    for (const component of componentList) {
      await this.modifyComponentResourceItem(templatePath, component);
    }
  },

  /**
   * 处理单个组件 resource：读取 .sql 文件并逐行执行
   * @param {String} templatePath
   * @param {Object} component
   */
  async modifyComponentResourceItem(templatePath, component) {
    const knex = await this.getKnex();
    if (component.type === 'component' && ![ 'tableRecordHistory', 'jhFile' ].includes(component.componentPath)) return;
    if (!fs.existsSync(`${templatePath}/${component.componentPath}.sql`)) return;
    let resourceSql = fs.readFileSync(`${templatePath}/${component.componentPath}.sql`).toString();
    _.forEach(component.sqlMap, (value, key) => {
      resourceSql = resourceSql.replace(new RegExp(`\{\{${key}\}\}`, 'g'), value || '');
    });
    for (const line of resourceSql.split('\n')) {
      if (!line) continue;
      if (line.startsWith('--')) {
        this.notice(`[4/5]正在执行 ${component.componentPath} ${line}`);
      } else {
        await knex.raw(line);
      }
    }
  },
};

module.exports = dbMixin;
