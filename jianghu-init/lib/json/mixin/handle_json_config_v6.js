'use strict';
const { parseSchema } = require('../v6/parse_schema');

/**
 * v6 配置标准化：parseSchema + minimal defaults（并 early return）
 * 注意：此函数依赖 this.readJhIdFromEggConfig（可选）
 * @param {Object} jsonConfig
 * @returns {boolean} true 表示已按 v6 处理并可 early return
 */
module.exports = function handleJsonConfigV6(jsonConfig) {
  const shouldParseV6 =
    jsonConfig &&
    jsonConfig.version === 'v6' &&
    jsonConfig.page &&
    (jsonConfig.list ||
      jsonConfig.form ||
      jsonConfig.dataSource ||
      (Array.isArray(jsonConfig.pageContent) && jsonConfig.pageContent.length > 0));

  if (!shouldParseV6) return false;

  const { standardConfig, legacyConfig } = parseSchema(jsonConfig);
  Object.assign(jsonConfig, legacyConfig, { standardConfig });

  // v6：仅补齐 render/下游 mixin 依赖的最小字段，不做旧版 tag 扫描
  if (!jsonConfig.pageContent) { jsonConfig.pageContent = []; }
  if (!jsonConfig.actionContent) { jsonConfig.actionContent = []; }
  if (!jsonConfig.includeList) { jsonConfig.includeList = []; }
  if (!jsonConfig.common) { jsonConfig.common = {}; }
  if (!jsonConfig.common.doUiAction) { jsonConfig.common.doUiAction = {}; }
  // if (!jsonConfig.hasOwnProperty('jhMenu')) { jsonConfig.jhMenu = true; }
  // if (!jsonConfig.hasOwnProperty('vuetify')) { jsonConfig.vuetify = ''; }
  // basicUiAction({ version, common, hasJhTable, hasJhList, hasCreateDrawer, hasCreateSubmit, hasUpdateDrawer, hasDelete, hasUpdateSubmit, hasDetailDrawer })
  Object.assign(jsonConfig, this.getBasicConfig({
    version: 'v6',
    common: jsonConfig.common,
    hasJhTable: standardConfig.features.hasTable,
    hasJhList: standardConfig.features.hasList,
    hasCreateDrawer: standardConfig.features.hasCreate,
    hasCreateSubmit: standardConfig.features.hasCreate,
    hasUpdateDrawer: standardConfig.features.hasUpdate,
    hasUpdateSubmit: standardConfig.features.hasUpdate,
    hasDelete: standardConfig.features.hasDelete,
  }));

  if (jsonConfig.common.doUiAction) {
    for (const key in jsonConfig.common.doUiAction) {
      const uiAction = jsonConfig.common.doUiAction[key];
      for (let [ index, item ] of uiAction.entries()) {
        item = this.processUiActionItem(item);
        jsonConfig.common.doUiAction[key][index] = item;
      }
    }
  }

  return true;
};

