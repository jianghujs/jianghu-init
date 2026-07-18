'use strict';

const { isDeepStrictEqual } = require('util');
const {
  SEMANTIC_VIEW_KEY_MIGRATIONS,
  toAliasMap,
} = require('../../../migration/keyMigrations');
const { recordDeprecatedKey } = require('../../../migration/diagnostics');

/**
 * semanticKeyAliases.js
 *
 * semantic 层 views.* 配置 key 的兼容映射表。
 *
 * 与 runtime/componentDescriptors.js 的 propRenames 对称：
 *   propRenames        → 组件 prop 名兼容（toolbarActionList → headActionList）
 *   semanticKeyAliases → 用户配置 key 名兼容（views.list.rowActions → views.list.rowActionList）
 *
 * 规则：{ 旧 key: 新 key }
 *   - 旧 key 在进入校验和 compile*View 前统一转成 canonical key
 *   - 新旧 key 同时存在且值不同时报错，避免静默覆盖
 *   - compile*View 只读取 canonical key
 *
 * 新增兼容规则：只改这张表和对应测试，compile*View 函数体不需要动。
 */

const LIST_VIEW_ALIASES = toAliasMap(SEMANTIC_VIEW_KEY_MIGRATIONS.list);
const CREATE_VIEW_ALIASES = toAliasMap(SEMANTIC_VIEW_KEY_MIGRATIONS.create);
const UPDATE_VIEW_ALIASES = toAliasMap(SEMANTIC_VIEW_KEY_MIGRATIONS.update);
const TAB_VIEW_ALIASES = toAliasMap(SEMANTIC_VIEW_KEY_MIGRATIONS.tab);

// ─── 执行函数 ─────────────────────────────────────────────────────────────────

/**
 * 把 view 对象上的旧 key 规范化为新 key（返回浅拷贝，不修改原对象）
 *
 * @param {object} view     - views.list / views.create / views.update
 * @param {object} aliases  - { 旧key: 新key }
 * @param {string} path     - 报错使用的配置路径
 * @returns {object}        - 规范化后的 view（浅拷贝）
 */
function normalizeViewKeys(view, aliases, path = 'views', diagnostics) {
  if (!view || typeof view !== 'object' || !aliases) return view;
  let result = view;
  for (const [oldKey, newKey] of Object.entries(aliases)) {
    const hasOldKey = Object.prototype.hasOwnProperty.call(result, oldKey);
    if (!hasOldKey) continue;

    const hasNewKey = Object.prototype.hasOwnProperty.call(result, newKey);
    if (hasNewKey && !isDeepStrictEqual(result[oldKey], result[newKey])) {
      throw new Error(
        `v7 ${path}: 兼容 key ${oldKey} 与 canonical key ${newKey} 同时存在且值不同，请只保留 ${newKey}`,
      );
    }

    if (result === view) result = { ...view };
    if (!hasNewKey) {
      result[newKey] = result[oldKey];
    }
    delete result[oldKey];
    recordDeprecatedKey(diagnostics, {
      path: `${path}.${oldKey}`,
      replacement: `${path}.${newKey}`,
    });
  }
  return result;
}

/** 在结构校验前统一 views.list/create/update key，返回按需浅拷贝后的 semantic。 */
function normalizeSemanticViewKeys(semantic, diagnostics) {
  if (!semantic || typeof semantic !== 'object') return semantic;
  const rawViews = semantic.views;
  if (!rawViews || typeof rawViews !== 'object' || Array.isArray(rawViews)) return semantic;

  const list = normalizeViewKeys(rawViews.list, LIST_VIEW_ALIASES, 'views.list', diagnostics);
  const create = normalizeViewKeys(rawViews.create, CREATE_VIEW_ALIASES, 'views.create', diagnostics);
  let update = normalizeViewKeys(rawViews.update, UPDATE_VIEW_ALIASES, 'views.update', diagnostics);
  if (update && Array.isArray(update.tabList)) {
    const tabList = update.tabList.map((tab, index) => normalizeViewKeys(
      tab,
      TAB_VIEW_ALIASES,
      `views.update.tabList[${index}]`,
      diagnostics,
    ));
    if (tabList.some((tab, index) => tab !== update.tabList[index])) {
      update = { ...update, tabList };
    }
  }
  if (list === rawViews.list && create === rawViews.create && update === rawViews.update) return semantic;

  const views = { ...rawViews };
  if (rawViews.list != null) views.list = list;
  if (rawViews.create != null) views.create = create;
  if (rawViews.update != null) views.update = update;
  return { ...semantic, views };
}

module.exports = {
  LIST_VIEW_ALIASES,
  CREATE_VIEW_ALIASES,
  UPDATE_VIEW_ALIASES,
  TAB_VIEW_ALIASES,
  normalizeViewKeys,
  normalizeSemanticViewKeys,
};
