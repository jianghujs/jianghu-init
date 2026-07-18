'use strict';

const { isDeepStrictEqual } = require('util');
const { recordDeprecatedKey } = require('../../migration/diagnostics');
const {
  extractSheetContentPanelChildren,
} = require('./sheetContentPanels');

/**
 * descriptorRuleApplicators.js
 *
 * 根据 componentDescriptors 中的描述符规则，对 rawProps / resolvedProps 做变换。
 * resolveNode 中原来散落的各个 if 块，全部收归到这里的纯函数中。
 *
 * 对外导出：
 *   applyPropPreprocess(rawProps, desc)          → { headersBinding, injectedChildren }
 *   applyPropPostprocess(resolvedProps, desc)     → void
 *   applyExprMarking(resolvedProps, desc, markExprFields, markExprActions)  → void
 *   buildResolvedBindings(resolvedProps, desc, key, headersBinding, applyPropBindOverrides)  → object
 *   buildChildren(schema, node, desc, componentSlotTemplates, resolveNodeFn, listSlotScopeAttr, componentName)  → Array
 */

/**
 * Sheet：旧内容模式 props（orderList / menuActionList / 网格形 actionList）
 * 外置为 children HTML；须在 headActionList→actionList 的 propRenames 之前执行。
 * 同时处理「headActionList + actionList」旧语义（actionList 为网格）。
 */
const applySheetActionCompat = (rawProps, options = {}) => {
  const hasHead = Object.prototype.hasOwnProperty.call(rawProps, 'headActionList');
  const hasAction = Object.prototype.hasOwnProperty.call(rawProps, 'actionList');
  const hasMenu = Object.prototype.hasOwnProperty.call(rawProps, 'menuActionList');

  // 同时存在 headActionList + actionList → 旧语义下 actionList 是内容网格
  if (hasHead && hasAction && !hasMenu) {
    rawProps.menuActionList = rawProps.actionList;
    delete rawProps.actionList;
  }

  return extractSheetContentPanelChildren(rawProps, {
    ...options,
    recordDeprecatedKey,
  });
};

// ─────────────────────────────────────────────────────────────
// 1. props 预处理（resolveProps 之前执行，原地修改 rawProps）
//    返回 { headersBinding, injectedChildren }
// ─────────────────────────────────────────────────────────────

/**
 * @param {object} rawProps  - 原地修改
 * @param {object} desc      - 组件描述符
 * @returns {{ headersBinding: string|null, injectedChildren: string[] }}
 */
function applyPropPreprocess(rawProps, desc, options = {}) {
  const empty = { headersBinding: null, injectedChildren: [] };
  if (!desc) return empty;

  let injectedChildren = [];

  const applyRenameMap = renameMap => {
    for (const [oldKey, newKey] of Object.entries(renameMap || {})) {
      if (!Object.prototype.hasOwnProperty.call(rawProps, oldKey)) continue;
      if (Object.prototype.hasOwnProperty.call(rawProps, newKey)
          && !isDeepStrictEqual(rawProps[oldKey], rawProps[newKey])) {
        throw new Error(`v7 ${options.path || 'component.props'}: 旧 key ${oldKey} 与 canonical key ${newKey} 同时存在且值不同，请只保留 ${newKey}`);
      }
      if (!Object.prototype.hasOwnProperty.call(rawProps, newKey)) rawProps[newKey] = rawProps[oldKey];
      delete rawProps[oldKey];
      recordDeprecatedKey(options.diagnostics, {
        path: `${options.path || 'component.props'}.${oldKey}`,
        replacement: `${options.path || 'component.props'}.${newKey}`,
      });
    }
  };

  // ── compat：旧 key 兼容（早于 propRenames，仅在旧 key 存在且新 key 不存在时生效）
  applyRenameMap(desc.compat);

  // ── Sheet：内容模式外置为 children（须早于 headActionList→actionList）
  if (desc.sheetActionCompat) {
    injectedChildren = applySheetActionCompat(rawProps, options);
  }

  // ── propRenames：key 重命名（原地）
  applyRenameMap(desc.propRenames);

  if (desc.sheetHeightCompat) {
    const hasLegacyBodyHeight = rawProps.bodyHeight != null && rawProps.bodyHeight !== '';
    if (hasLegacyBodyHeight) {
      if (rawProps.maxBodyHeight != null && rawProps.maxBodyHeight !== rawProps.bodyHeight) {
        throw new Error(`v7 ${options.path || 'component.props'}: bodyHeight 与 maxBodyHeight 同时存在且值不同`);
      }
      rawProps.maxBodyHeight = rawProps.bodyHeight;
      rawProps.bodyHeightMode = 'fill';
      delete rawProps.bodyHeight;
      recordDeprecatedKey(options.diagnostics, {
        path: `${options.path || 'component.props'}.bodyHeight`,
        replacement: `${options.path || 'component.props'}.maxBodyHeight + bodyHeightMode`,
      });
    }
    if (rawProps.viewportOffset != null && rawProps.viewportOffset !== '') {
      const offset = Number(rawProps.viewportOffset);
      if (!Number.isNaN(offset) && (rawProps.maxBodyHeight == null || rawProps.maxBodyHeight === '')) {
        rawProps.maxBodyHeight = `calc(100vh - ${offset}px)`;
      }
      delete rawProps.viewportOffset;
      recordDeprecatedKey(options.diagnostics, {
        path: `${options.path || 'component.props'}.viewportOffset`,
        replacement: `${options.path || 'component.props'}.maxBodyHeight`,
      });
    }
    if (rawProps.autoHeight != null) {
      const mode = rawProps.autoHeight ? 'content' : 'fill';
      if (!hasLegacyBodyHeight && rawProps.bodyHeightMode != null && rawProps.bodyHeightMode !== mode) {
        throw new Error(`v7 ${options.path || 'component.props'}: autoHeight 与 bodyHeightMode 同时存在且语义冲突`);
      }
      if (!hasLegacyBodyHeight && rawProps.bodyHeightMode == null) rawProps.bodyHeightMode = mode;
      delete rawProps.autoHeight;
      recordDeprecatedKey(options.diagnostics, {
        path: `${options.path || 'component.props'}.autoHeight`,
        replacement: `${options.path || 'component.props'}.bodyHeightMode`,
      });
    }
  }

  if (desc.gridColsCompat && (rawProps.colsSm != null || rawProps.colsMd != null)) {
    if (rawProps.cols && typeof rawProps.cols === 'object') {
      throw new Error(`v7 ${options.path || 'component.props'}: colsSm/colsMd 与 canonical cols 对象不能同时使用`);
    }
    const base = rawProps.cols != null ? rawProps.cols : 1;
    rawProps.cols = {
      xs: rawProps.colsSm != null ? rawProps.colsSm : base,
      sm: rawProps.colsMd != null ? rawProps.colsMd : base,
      md: base,
    };
    if (rawProps.colsSm != null) {
      recordDeprecatedKey(options.diagnostics, {
        path: `${options.path || 'component.props'}.colsSm`,
        replacement: `${options.path || 'component.props'}.cols.xs`,
      });
    }
    if (rawProps.colsMd != null) {
      recordDeprecatedKey(options.diagnostics, {
        path: `${options.path || 'component.props'}.colsMd`,
        replacement: `${options.path || 'component.props'}.cols.sm`,
      });
    }
    delete rawProps.colsSm;
    delete rawProps.colsMd;
  }

  for (const key of desc.retainedDeprecatedProps || []) {
    if (!Object.prototype.hasOwnProperty.call(rawProps, key)) continue;
    recordDeprecatedKey(options.diagnostics, {
      path: `${options.path || 'component.props'}.${key}`,
      replacement: '兼容保留（新配置不再生成）',
    });
  }

  // ── slotTemplates：先提取，后续由 buildChildren 处理；从 rawProps 移除避免序列化
  // （由调用方在 preprocess 前单独提取 rawProps.slotTemplates，这里只做 delete）
  if (desc.slotTemplates && Object.prototype.hasOwnProperty.call(rawProps, 'slotTemplates')) {
    delete rawProps.slotTemplates;
  }

  // ── bindingExtractHeaders（Table/List 专用）：headersBinding / columnsBinding → :headers
  //    提取后删除 binding key 和静态 headers/columns，返回 headersBinding 字符串
  let headersBinding = null;
  if (desc.bindingExtractHeaders) {
    for (const propKey of desc.bindingExtractHeaders) {
      const val = rawProps[propKey];
      if (headersBinding == null && typeof val === 'string' && val.trim()) {
        headersBinding = val.trim();
      }
      delete rawProps[propKey];
    }
    if (headersBinding != null) {
      // 动态 headers 优先，并清理所有兼容键，避免旧 columnsBinding 泄漏为组件 prop。
      delete rawProps.headers;
      delete rawProps.columns;
    }
  }

  return { headersBinding, injectedChildren };
}

// ─────────────────────────────────────────────────────────────
// 2. props 后处理（resolveProps 之后执行，原地修改 resolvedProps）
// ─────────────────────────────────────────────────────────────

/**
 * @param {object} resolvedProps - 原地修改
 * @param {object} desc
 */
function applyPropPostprocess(resolvedProps, desc) {
  if (!desc) return;

  // ── propRenames2：resolveProps 之后执行的重命名（如 columns→headers）
  //    resolveProps 可能已经处理了 xxxRef，所以要在之后再做一次统一化
  if (desc.propRenames2) {
    for (const [oldKey, newKey] of Object.entries(desc.propRenames2)) {
      if (Object.prototype.hasOwnProperty.call(resolvedProps, oldKey)) {
        if (!Object.prototype.hasOwnProperty.call(resolvedProps, newKey)) {
          resolvedProps[newKey] = resolvedProps[oldKey];
        }
        delete resolvedProps[oldKey];
      }
    }
  }

  // ── stripProps：剔除不传给组件的配置项
  if (desc.stripProps) {
    for (const key of desc.stripProps) {
      delete resolvedProps[key];
    }
  }
}

// ─────────────────────────────────────────────────────────────
// 3. expr 标记
// ─────────────────────────────────────────────────────────────

/**
 * @param {object}   resolvedProps    - 原地修改
 * @param {object}   desc
 * @param {function} markExprFields   - (fields) => fields
 * @param {function} markExprActions  - (actions) => actions
 */
function applyExprMarking(resolvedProps, desc, markExprFields, markExprActions) {
  if (!desc) return;

  // exprFieldProps：options/rules 字符串加 __expr__
  if (desc.exprFieldProps) {
    for (const propKey of desc.exprFieldProps) {
      if (Array.isArray(resolvedProps[propKey])) {
        resolvedProps[propKey] = markExprFields(resolvedProps[propKey]);
      }
    }
  }

  // exprActionProps：visibleWhen/disabledWhen/loadingWhen 字符串加 __expr__
  if (desc.exprActionProps) {
    for (const propKey of desc.exprActionProps) {
      if (Array.isArray(resolvedProps[propKey])) {
        resolvedProps[propKey] = markExprActions(resolvedProps[propKey]);
      }
    }
  }

  // exprTabList：tabList 内每个 tab 的 fieldList/fields/actionList/menuActionList
  if (desc.exprTabList && Array.isArray(resolvedProps.tabList)) {
    resolvedProps.tabList = resolvedProps.tabList.map(tab => {
      if (!tab || typeof tab !== 'object') return tab;
      const t = { ...tab };
      if (Array.isArray(t.fieldList))      t.fieldList      = markExprFields(t.fieldList);
      if (Array.isArray(t.fields))         t.fields         = markExprFields(t.fields);
      if (Array.isArray(t.actionList))     t.actionList     = markExprActions(t.actionList);
      if (Array.isArray(t.menuActionList)) t.menuActionList = markExprActions(t.menuActionList);
      if (Array.isArray(t.headActionList)) t.headActionList = markExprActions(t.headActionList);
      return t;
    });
  }
}

// ─────────────────────────────────────────────────────────────
// 4. 构建 resolvedBindings
// ─────────────────────────────────────────────────────────────

/**
 * PageHeader 是否有搜索配置：keyword/keywordFieldList/searchFieldList 任一非空
 */
function pageHeaderHasSearch(resolvedProps) {
  if (resolvedProps.keyword != null) return true;
  if (resolvedProps.keywordFieldList != null) return true;
  if (Array.isArray(resolvedProps.fieldList) && resolvedProps.fieldList.length > 0) return true;
  if (typeof resolvedProps.fieldList === 'string' && resolvedProps.fieldList.trim()) return true;
  return false;
}

/**
 * bindingExtract：字符串型 prop → 提取为 binding，从 resolvedProps 中删除
 * 规则：值为非空字符串且不以 [ 或 { 开头时，视为 Vue 变量名
 *
 * @param {object} resolvedProps - 原地修改
 * @param {object} desc
 * @returns {object}             - 提取出的 binding 键值对
 */
function extractBindingsFromProps(resolvedProps, desc) {
  const extracted = {};
  if (!desc || !desc.bindingExtract) return extracted;

  for (const [propKey, bindingKey] of Object.entries(desc.bindingExtract)) {
    const val = resolvedProps[propKey];
    if (typeof val !== 'string' || !val.trim()) continue;
    const trimmed = val.trim();
    // 排除 JSON 数组/对象字符串
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) continue;
    extracted[bindingKey] = trimmed;
    delete resolvedProps[propKey];
  }
  return extracted;
}

/**
 * 构建最终 resolvedBindings
 *
 * 优先级（后者覆盖前者）：
 *   desc.bindings（固定）
 *   → desc.keyedBindings(key)（动态，含 key 驱动）
 *   → desc.searchBindings（PageHeader 专用，条件追加）
 *   → headersBinding（Table/List :headers 动态绑定）
 *   → bindingExtract 提取的绑定（PageHeader keyword / SearchSheet keyword 等）
 *   → applyPropBindOverrides 的 *Bind 通用绑定（最高优先级）
 *
 * @param {object}   resolvedProps
 * @param {object}   desc
 * @param {string}   key                    节点 key（FormDrawer/Sheet 等用）
 * @param {string|null} headersBinding      Table/List 动态 headers 变量名
 * @param {function} applyPropBindOverrides  来自 applyPropBind.js
 * @param {string}   component              原始 Schema 组件名，供 applyPropBind 保护 reserved props
 * @returns {object}
 */
function buildResolvedBindings(resolvedProps, desc, key, headersBinding, applyPropBindOverrides, component) {
  // ── 固定绑定
  const fixed = desc && desc.bindings ? { ...desc.bindings } : {};

  // ── key 驱动绑定
  const keyed = (desc && desc.keyedBindings && key) ? desc.keyedBindings(key) : {};

  // ── PageHeader 搜索绑定（条件追加）
  const search = (desc && desc.searchBindings && pageHeaderHasSearch(resolvedProps))
    ? { ...desc.searchBindings }
    : {};

  // ── headers 动态绑定（Table/List）
  const headers = headersBinding ? { ':headers': headersBinding } : {};

  // ── bindingExtract 提取（会同时从 resolvedProps 删除对应 prop）
  const extracted = extractBindingsFromProps(resolvedProps, desc);

  // 组合框架绑定（优先级从低到高）
  const frameworkBindings = Object.assign({}, fixed, keyed, search, headers, extracted);
  if (frameworkBindings['v-model']) {
    delete resolvedProps.value;
    delete resolvedProps.shown;
  }

  // ── *Bind 通用绑定（最高优先级，覆盖同名框架绑定）
  // 传入 component 名，让 applyPropBind 正确保护 PageHeader/SearchSheet 的 reserved props
  const propBindOverrides = applyPropBindOverrides(resolvedProps, {
    component,
    bindingOverrides: frameworkBindings,
  });

  return Object.assign({}, frameworkBindings, propBindOverrides);
}

// ─────────────────────────────────────────────────────────────
// 5. 构建 children（含 slotTemplates → <template v-slot:…> 字符串）
// ─────────────────────────────────────────────────────────────

const TABLE_SLOT_NAME_RE_LOCAL = /^[A-Za-z0-9_-]+$/;

/**
 * @param {object}   schema
 * @param {object}   node               原始节点
 * @param {object}   desc
 * @param {object|undefined} componentSlotTemplates  提前从 rawProps 中取出的 slotTemplates
 * @param {function} resolveNodeFn      递归解析子节点
 * @param {function} listSlotScopeAttr  List 插槽 scope 属性
 * @param {string}   componentName      用于判断 List 的 scope 格式
 * @returns {Array}
 */
function buildChildren(schema, node, desc, componentSlotTemplates, resolveNodeFn, listSlotScopeAttr, componentName) {
  let childrenResolved = [];

  // 递归子节点
  if (Array.isArray(node.children) && node.children.length > 0) {
    childrenResolved = node.children.map((child, index) => resolveNodeFn(schema, child, index));
  }

  // slotTemplates → <template v-slot:…> 字符串
  if (
    desc && desc.slotTemplates &&
    componentSlotTemplates &&
    typeof componentSlotTemplates === 'object' &&
    !Array.isArray(componentSlotTemplates)
  ) {
    for (const [slotName, html] of Object.entries(componentSlotTemplates)) {
      if (typeof html !== 'string' || !html.trim()) continue;
      const safeName = String(slotName).trim();
      if (!safeName || !TABLE_SLOT_NAME_RE_LOCAL.test(safeName)) continue;
      const scopeAttr = (componentName === 'List') ? listSlotScopeAttr(safeName) : '';
      childrenResolved.push(
        `<template v-slot:${safeName}${scopeAttr}>${html}</template>`,
      );
    }
  }

  return childrenResolved;
}

module.exports = {
  applyPropPreprocess,
  applyPropPostprocess,
  applyExprMarking,
  buildResolvedBindings,
  buildChildren,
};
