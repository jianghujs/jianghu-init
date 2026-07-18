'use strict';

/**
 * V7 runtime schema pipeline — fork of legacy `lib/json/v6/parse_schema.js`.
 *
 * 本文件职责（映射文档 § 流水线第 3 步）：
 *   - COMPONENT_DESCRIPTORS（componentDescriptors.js）：每种组件的完整转换规则
 *   - resolveNode：通用驱动器，读描述符规则，不再包含组件名 if/else
 *   - parseSchema：组装 standardConfig / legacyConfig
 *
 * 组件规则修改、key 重命名、兼容处理：→ componentDescriptors.js
 * 规则应用逻辑：→ descriptorRuleApplicators.js
 *
 * 详见：lib/json/v7/docs/semantic-to-component-mapping.md
 */

const _ = require('lodash');
const { resolvePageMenu } = require('../../../shared/resolvePageMenu');
const { normalizeDataSource } = require('../semantic/normalizeDataSource');
const {
  resolveBlocksTablePageSize,
  resolveBlocksTableOrderBy,
} = require('../../../shared/resolveTablePageSize');
const { detectHasDelete } = require('../../../shared/detectCrudActionFeatures');
const { normalizePageContentToArray } = require('../semantic/pageContentShape');
const { resolveSchemaComponentName } = require('../../../shared/schemaComponentAlias');
const { applyPropBindOverrides } = require('../../../shared/applyPropBind');
const { markActionListConditions } = require('../../whenExpr');
const {
  resolveDescriptor,
  COMPONENT_DESCRIPTORS,
  COMPONENT_TAG_MAP,
} = require('./componentDescriptors');
const {
  applyPropPreprocess,
  applyPropPostprocess,
  applyExprMarking,
  buildResolvedBindings,
  buildChildren: buildChildrenFromDesc,
} = require('./descriptorRuleApplicators');
const {
  buildOrderPanelChildHtml,
  buildMenuGridChildHtml,
} = require('./sheetContentPanels');

// ─────────────────────────────────────────────
// COMPONENT_MAP 保持原有公开导出；运行时映射、固定绑定和布局默认值均由 descriptors 派生。
// ─────────────────────────────────────────────

const COMPONENT_MAP = { ...COMPONENT_TAG_MAP };

// REACTIVE_BINDINGS_MAP 仅保留固定绑定（无 key 依赖的），供外部兼容引用
const REACTIVE_BINDINGS_MAP = (() => {
  const map = {};
  for (const [name, desc] of Object.entries(COMPONENT_DESCRIPTORS)) {
    if (desc.aliasOf) continue;
    map[name] = desc.bindings ? { ...desc.bindings } : {};
  }
  return map;
})();

// LAYOUT_DEFAULTS 仍从 descriptors 派生
const LAYOUT_DEFAULTS = (() => {
  const map = {};
  for (const [name, desc] of Object.entries(COMPONENT_DESCRIPTORS)) {
    if (desc.defaultProps) map[name] = desc.defaultProps;
  }
  return map;
})();

// ─────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────

function getByPath(obj, path) {
  if (!obj || !path || typeof path !== 'string') return undefined;
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

/**
 * 解析单个节点的 props：
 * - 将 xxxRef（字符串路径）替换成 schema 中对应值
 * - 注入该组件类型的默认 props
 * - 原始 props 优先级最高
 */
function resolveProps(schema, component, rawProps) {
  const defaults = LAYOUT_DEFAULTS[component] || {};
  const resolved = Object.assign({}, defaults);

  const props = rawProps || {};
  for (const key of Object.keys(props)) {
    if (key.endsWith('Ref') && typeof props[key] === 'string') {
      // xxxRef → 按路径从 schema 取值
      const refKey = key.slice(0, -3);
      const refValue = getByPath(schema, props[key]);
      if (refValue !== undefined) {
        resolved[refKey] = refValue;
      }
    } else {
      resolved[key] = props[key];
    }
  }
  return resolved;
}

/**
 * 解析节点 attrs（写到生成标签根上：class、style、:class、v-if 等）
 * xxxRef 规则与 props 相同
 */
function resolveAttrsObject(schema, raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const resolved = {};
  for (const key of Object.keys(raw)) {
    const val = raw[key];
    if (key.endsWith('Ref') && typeof val === 'string') {
      const refKey = key.slice(0, -3);
      const refValue = getByPath(schema, val);
      if (refValue !== undefined) {
        resolved[refKey] = refValue;
      }
    } else {
      resolved[key] = val;
    }
  }
  return resolved;
}

/** 旧版 props.cls → 并入节点 attrs.class / :class（由 desc.hoistCls 标记的组件触发） */

function mergeHoistedClsIntoAttrs(resolvedAttrs, clsVal) {
  if (clsVal === undefined || clsVal === null || clsVal === '') return;
  if (typeof clsVal === 'object') {
    const existing = resolvedAttrs[':class'];
    if (existing === undefined) {
      resolvedAttrs[':class'] = clsVal;
    } else if (Array.isArray(existing)) {
      resolvedAttrs[':class'] = [...existing, clsVal];
    } else {
      resolvedAttrs[':class'] = [existing, clsVal];
    }
    return;
  }
  const str = String(clsVal);
  const existingClass = resolvedAttrs.class;
  if (existingClass != null && existingClass !== '') {
    resolvedAttrs.class = `${String(existingClass)} ${str}`.trim();
  } else {
    resolvedAttrs.class = str;
  }
}

function hoistPropsClsIntoAttrs(component, resolvedProps, resolvedAttrs) {
  if (!Object.prototype.hasOwnProperty.call(resolvedProps, 'cls')) return;
  mergeHoistedClsIntoAttrs(resolvedAttrs, resolvedProps.cls);
  delete resolvedProps.cls;
}

function tableNodeHasColumnConfig(props) {
  if (!props || typeof props !== 'object') return false;
  const bind =
    (typeof props.headersBinding === 'string' && props.headersBinding.trim()) ||
    (typeof props.columnsBinding === 'string' && props.columnsBinding.trim());
  if (bind) return true;
  if (props.columns != null || props.columnsRef) return true;
  if (Array.isArray(props.headers) && props.headers.length > 0) return true;
  return false;
}

// List 插槽 scope 属性（传给 descriptorRuleApplicators.buildChildren）
const listSlotScopeAttr = slotName => {
  if (slotName === 'action' || slotName === 'body') return '="{ item }"';
  if (slotName.startsWith('cell-')) return '="{ item, header }"';
  return '';
};

/**
 * 递归处理节点树：给每个节点补全 resolvedComponent / resolvedProps / resolvedBindings
 * resolveNode 现为通用描述符驱动器，不含组件名 if/else。
 * 组件规则见 componentDescriptors.js；规则应用逻辑见 descriptorRuleApplicators.js。
 */

// 字符串 options / rules → { __expr__: '...' }，序列化时不加引号，Vue 当作表达式变量引用
function markFieldItemExpr(f) {
  if (!f || typeof f !== 'object') return f;
  const out = { ...f };
  if (typeof f.options === 'string' && f.options) out.options = { __expr__: f.options };
  if (typeof f.rules === 'string' && f.rules)     out.rules   = { __expr__: f.rules };
  return out;
}

function resolveNode(schema, node, options = {}) {
  if (!node || typeof node !== 'object') return node;

  const component = resolveSchemaComponentName(node);
  const key = node.key || '';

  // ── 解析描述符（含 aliasOf）
  const { desc, resolvedTag } = resolveDescriptor(component);
  const resolvedComponent = resolvedTag || COMPONENT_MAP[component] || component;

  // ── 准备 rawProps（浅拷贝，后续原地修改）
  const rawProps = node.props && typeof node.props === 'object' ? { ...node.props } : {};

  // ── 提前取出 slotTemplates（Table/List 专用），preprocess 会删掉它
  const componentSlotTemplates =
    (desc && desc.slotTemplates && rawProps.slotTemplates)
      ? rawProps.slotTemplates
      : undefined;

  // ── 1. props 预处理（propRenames / stripProps 前置 / bindingExtractHeaders）
  //       返回 headersBinding；Sheet 旧内容模式还会注入 children HTML
  const { headersBinding, injectedChildren } = applyPropPreprocess(rawProps, desc, {
    diagnostics: options.diagnostics,
    path: `${options.path || 'component'}.props`,
  });

  // ── 2. resolveProps（xxxRef 路径展开 + 默认值注入）
  const resolvedProps = resolveProps(schema, component, rawProps);

  // ── 3. props 后处理（propRenames2 / stripProps）
  applyPropPostprocess(resolvedProps, desc);

  // ── 4. expr 标记（options/rules/visibleWhen 等加 __expr__）
  const markExprFields = fields =>
    Array.isArray(fields) ? fields.map(markFieldItemExpr) : fields;
  const markExprActions = markActionListConditions;
  applyExprMarking(resolvedProps, desc, markExprFields, markExprActions);

  // ── 5. 构建 resolvedBindings
  const resolvedBindings = buildResolvedBindings(
    resolvedProps,
    desc,
    key,
    headersBinding,
    applyPropBindOverrides,
    component,           // ← 传入组件名，保护 PageHeader/SearchSheet reserved props
  );

  // ── 6. resolvedAttrs（attrs + attrsRef）
  let rawAttrs = {};
  if (node.attrsRef && typeof node.attrsRef === 'string') {
    const ext = getByPath(schema, node.attrsRef);
    if (ext && typeof ext === 'object' && !Array.isArray(ext)) {
      Object.assign(rawAttrs, ext);
    }
  }
  if (node.attrs && typeof node.attrs === 'object' && !Array.isArray(node.attrs)) {
    Object.assign(rawAttrs, node.attrs);
  }
  const resolvedAttrs = resolveAttrsObject(schema, rawAttrs);

  // hoistCls：props.cls → resolvedAttrs.class
  if (desc && desc.hoistCls) {
    hoistPropsClsIntoAttrs(component, resolvedProps, resolvedAttrs);
  }

  // ── 7. _meta（供 NJK 消费的结构化标志）
  const _meta = (desc && desc.meta)
    ? { ...desc.meta }
    : {
        needsShownState: false,
        needsItemState: false,
      };

  // ── 8. children + slotTemplates；Sheet 兼容注入的 panel HTML 前置
  const nodeForChildren = (injectedChildren && injectedChildren.length)
    ? {
      ...node,
      children: [
        ...injectedChildren,
        ...(Array.isArray(node.children) ? node.children : []),
      ],
    }
    : node;
  const children = buildChildrenFromDesc(
    schema,
    nodeForChildren,
    desc,
    componentSlotTemplates,
    (_schema, child, childIndex) => resolveNode(schema, child, {
      ...options,
      path: `${options.path || 'component'}.children[${childIndex}]`,
    }),
    listSlotScopeAttr,
    component,
  );

  // ── 组装结果
  const result = {
    component,
    resolvedComponent,
    resolvedProps,
    resolvedBindings,
    _meta,
  };
  if (Object.keys(resolvedAttrs).length > 0) result.resolvedAttrs = resolvedAttrs;
  if (key) result.key = key;
  if (children.length > 0) result.children = children;

  return result;
}

// ─────────────────────────────────────────────
// 树遍历工具（用于从树中提取特定节点）
// ─────────────────────────────────────────────

function walkTree(nodeOrList, callback) {
  if (!nodeOrList) return;
  if (Array.isArray(nodeOrList)) {
    nodeOrList.forEach(item => walkTree(item, callback));
    return;
  }
  if (typeof nodeOrList !== 'object') return;
  callback(nodeOrList);
  if (Array.isArray(nodeOrList.children)) {
    nodeOrList.children.forEach(child => walkTree(child, callback));
  }
}

function findComponent(nodeOrList, component) {
  let found = null;
  walkTree(nodeOrList, node => {
    if (!found && node.component === component) found = node;
  });
  return found;
}

/** 按 tableKey 优先查找 Table / List */
function findCollectionNode(nodeOrList, { component, preferredKey } = {}) {
  const matches = [];
  walkTree(nodeOrList, node => {
    if (!node || typeof node !== 'object') return;
    if (node.component === 'Table' || node.component === 'List') matches.push(node);
  });
  if (preferredKey) {
    const byKey = matches.find(n => n.key === preferredKey);
    if (byKey) return byKey;
  }
  if (component === 'List') return matches.find(n => n.component === 'List') || null;
  if (component === 'Table') return matches.find(n => n.component === 'Table') || null;
  return matches[0] || null;
}

/** 按 component + key 查找表单节点（CreateSheet / UpdateSheet → FormSheet） */
function findFormNodeByKey(nodeOrList, key) {
  let found = null;
  walkTree(nodeOrList, node => {
    if (found || !node || typeof node !== 'object' || node.key !== key) return;
    const comp = resolveSchemaComponentName(node);
    if (key === 'create' && (comp === 'CreateDrawer' || comp === 'FormSheet')) found = node;
    if (key === 'update' && (comp === 'UpdateDrawer' || comp === 'FormSheet')) found = node;
  });
  return found;
}

/** 从 pageContent 解析树中找出首片 jh-table（深度优先） */
function findFirstResolvedTable(nodeList) {
  let found = null;
  walkTree(nodeList, node => {
    if (found || !node || typeof node !== 'object') return;
    if (node.resolvedComponent === 'jh-table' || node.resolvedComponent === 'jh-list') found = node;
  });
  return found;
}

function searchableUsesKeywordWidget(node) {
  const list = (node.resolvedProps && node.resolvedProps.fieldList) || [];
  return list.some(f => f && (f.type === 'keyword'));
}

/**
 * keyword 控件：从 Table 注入 keywordHeaders 到 jh-page-header / jh-mobile-search-sheet
 */
function syncKeywordHeadersFromTable(resolvedPageContent, resolvedActionContent) {
  const tableNode = findFirstResolvedTable(resolvedPageContent);
  const staticHeaders =
    tableNode && tableNode.resolvedProps
      ? tableNode.resolvedProps.headers || []
      : [];
  const headersBind =
    tableNode && tableNode.resolvedBindings
      ? tableNode.resolvedBindings[':headers']
      : null;

  const apply = node => {
    if (!node || !searchableUsesKeywordWidget(node)) return;
    if (node.resolvedComponent !== 'jh-page-header' && node.resolvedComponent !== 'jh-mobile-search-sheet') return;

    const rp = node.resolvedProps || {};
    const rb = node.resolvedBindings || {};
    const hasStatic = Array.isArray(rp.keywordHeaders) && rp.keywordHeaders.length > 0;
    const hasBind = typeof rb[':keyword-headers'] === 'string' && rb[':keyword-headers'].trim();
    if (hasStatic || hasBind) return;

    if (headersBind) {
      node.resolvedBindings = Object.assign({}, rb, {
        ':keyword-headers': headersBind,
      });
    } else if (staticHeaders.length) {
      node.resolvedProps = Object.assign({}, rp, {
        keywordHeaders: staticHeaders.filter(h => h && h.value !== 'action'),
      });
    }
  };

  walkTree(resolvedPageContent, apply);
  walkTree(resolvedActionContent || [], apply);
}

/** MobileSearch 生成的 SearchSheet：未配置 fieldList 时继承 PageHeader / list.search.fields */
function enrichSearchSheetNodes(actionNodes, fallbackSearchFieldList) {
  if (!Array.isArray(actionNodes) || !Array.isArray(fallbackSearchFieldList) || !fallbackSearchFieldList.length) return;
  for (const n of actionNodes) {
    if (!n || typeof n !== 'object' || n.component !== 'SearchSheet') continue;
    const p = n.props || {};
    const sf = p.fieldList != null ? p.fieldList : p.searchFieldList;
    if (typeof sf === 'string' && sf.trim()) continue;
    if (Array.isArray(sf) && sf.length > 0) continue;
    n.props = Object.assign({}, p, { fieldList: fallbackSearchFieldList });
  }
}

// ─────────────────────────────────────────────
// 兼容性：从节点 props 或 schema 取值
// ─────────────────────────────────────────────

function resolveBlockProps(schema, node, key, fallback) {
  const props = (node || {}).props || {};
  if (props[key] !== undefined) return props[key];
  const refKey = `${key}Ref`;
  if (props[refKey] && typeof props[refKey] === 'string') {
    const val = getByPath(schema, props[refKey]);
    if (val !== undefined) return val;
  }
  return fallback;
}

/** Drawer 字段列表：新键 fieldList 优先，兼容旧键 fields */
function resolveDrawerFieldList(schema, node) {
  const props = (node || {}).props || {};
  const tabList = props.tabList;
  if (Array.isArray(tabList) && tabList.length) {
    const hasAnyTabFields = tabList.some(tab => {
      if (!tab || typeof tab !== 'object') return false;
      if (Array.isArray(tab.fieldList) && tab.fieldList.length) return true;
      if (Array.isArray(tab.fields) && tab.fields.length) return true;
      return false;
    });
    if (hasAnyTabFields) return tabList;
  }
  const fieldList = resolveBlockProps(schema, node, 'fieldList', undefined);
  if (Array.isArray(fieldList)) return fieldList;
  const fields = resolveBlockProps(schema, node, 'fields', undefined);
  if (Array.isArray(fields)) return fields;
  return null;
}

// ─────────────────────────────────────────────
// 规范化 pageContent
// ─────────────────────────────────────────────

function defaultPageContent() {
  return [];
}

function normalizePageContent(schema) {
  const raw = schema.pageContent;
  const fromRoot = normalizePageContentToArray(raw);
  if (fromRoot.length > 0) return fromRoot;
  if (schema.layout) {
    return Array.isArray(schema.layout) ? schema.layout : [schema.layout];
  }
  return defaultPageContent();
}

/** actionContent：支持 string（整段 HTML）或 节点数组（元素可为 string | component 节点） */
function normalizeActionContent(schema) {
  const ac = schema.actionContent;
  if (ac == null || ac === '') return [];
  if (typeof ac === 'string') return [ac];
  if (Array.isArray(ac)) return ac;
  return [];
}

const resolveRootNodePath = (schema, rootKey, index) => {
  const raw = schema[rootKey];
  if (Array.isArray(raw)) return `${rootKey}[${index}]`;
  if (raw && typeof raw === 'object') return rootKey;
  if (rootKey === 'pageContent' && schema.layout) {
    return Array.isArray(schema.layout) ? `layout[${index}]` : 'layout';
  }
  return `${rootKey}[${index}]`;
};

/**
 * pageContent 内的「移动端中继」组件：解析阶段剥离为
 *   - 页面上的触发 UI（统一生成 `<jh-mobile-filter-btn>`，@click 打开 is{Key}DrawerShown）
 *   - actionContent 末尾追加的真实弹出层（Sheet / FormSheet / SearchSheet）
 * 这样配置侧只在 pageContent 声明一次，无需手写 actionContent 对联。
 *
 * 中继类型：
 *   MobileOrder  → Sheet + children jh-sheet-order-panel（props.orderList）
 *   MobileFilter → FormSheet（筛选：children 进插槽，props.hiddenBtn 等）
 *   MobileSearch → SearchSheet（搜索：与 PageHeader 同源 searchFieldList / keyword / keywordFieldList）
 *   MobileAction → Sheet + children jh-sheet-menu-grid（中继仍可写 actionList / cols）
 *
 * 触发按钮：`jh-mobile-filter-btn`（四类中继共用）；文案 btnText | triggerText | label 或各类型默认中文；
 * showActive | active 等与 opener 相关的字段不会传给弹出层。
 */
const MOBILE_RELAY_COMPONENTS = new Set(['MobileOrder', 'MobileFilter', 'MobileAction', 'MobileSearch']);

const MOBILE_RELAY_DEFAULT_KEY = {
  MobileOrder: 'mobileOrder',
  MobileFilter: 'mobileFilter',
  MobileAction: 'mobileAction',
  MobileSearch: 'mobileSearch',
};

const MOBILE_RELAY_DEFAULT_BTN = {
  MobileOrder: '排序',
  MobileFilter: '筛选',
  MobileAction: '更多操作',
  MobileSearch: '搜索',
};

/** 仅用于触发按钮，不落入弹出层 props */
const MOBILE_RELAY_PROP_BLACKLIST = [
  'btnText', 'triggerText', 'label', 'btnClass', 'openerClass',
  /** 触发侧专用（jh-mobile-filter-btn），不进 Sheet / FormSheet */
  'showActive', 'active',
];

function collectUsedKeysFromNodes(nodes, intoSet) {
  if (!Array.isArray(nodes)) return;
  for (const n of nodes) {
    if (!n || typeof n !== 'object') continue;
    if (typeof n.key === 'string' && n.key.trim()) intoSet.add(_.camelCase(n.key.trim()));
    if (Array.isArray(n.children)) collectUsedKeysFromNodes(n.children, intoSet);
  }
}

function allocateRelayKey(requestedKey, component, usedKeys) {
  let base =
    (requestedKey && String(requestedKey).trim())
      ? _.camelCase(String(requestedKey).trim())
      : MOBILE_RELAY_DEFAULT_KEY[component] || 'mobileRelay';
  let key = base;
  let suffix = 2;
  while (usedKeys.has(key)) {
    key = `${base}${suffix++}`;
  }
  usedKeys.add(key);
  return key;
}

function sheetPropsFromRelayProps(relayProps) {
  const out = { ...(relayProps || {}) };
  for (const k of MOBILE_RELAY_PROP_BLACKLIST) delete out[k];
  return out;
}

function buildLiftedSheetNode(relayComponent, sheetKey, relayProps, relayChildren) {
  const sp = sheetPropsFromRelayProps(relayProps);
  const childArr = Array.isArray(relayChildren) && relayChildren.length ? [...relayChildren] : [];

  if (relayComponent === 'MobileOrder') {
    const orderList = sp.orderList;
    delete sp.orderList;
    if (orderList != null) {
      childArr.unshift(buildOrderPanelChildHtml(orderList));
    }
    return {
      component: 'Sheet',
      key: sheetKey,
      props: Object.assign({ title: '排序', rounded: true }, sp),
      ...(childArr.length ? { children: childArr } : {}),
    };
  }
  if (relayComponent === 'MobileFilter') {
    return {
      component: 'FormSheet',
      key: sheetKey,
      props: Object.assign({ title: '筛选', rounded: true }, sp),
      ...(childArr.length ? { children: childArr } : {}),
    };
  }
  if (relayComponent === 'MobileSearch') {
    const searchProps = sheetPropsFromRelayProps(relayProps);
    for (const k of ['fieldList', 'fields', 'tabList', 'actionList', 'headActionList', 'initialData', 'jianghuSearch', 'icon']) {
      if (Object.prototype.hasOwnProperty.call(searchProps, k)) delete searchProps[k];
    }
    return {
      component: 'SearchSheet',
      key: sheetKey,
      props: Object.assign({ title: '搜索', rounded: true }, searchProps),
      ...(childArr.length ? { children: childArr } : {}),
    };
  }
  // MobileAction：图标网格进 children，不写 Sheet.menuActionList
  const menuList = sp.menuActionList != null ? sp.menuActionList : sp.actionList;
  const cols = sp.cols;
  delete sp.menuActionList;
  delete sp.actionList;
  delete sp.cols;
  if (menuList != null) {
    childArr.unshift(buildMenuGridChildHtml(menuList, cols));
  }
  return {
    component: 'Sheet',
    key: sheetKey,
    props: Object.assign({ title: '更多操作', rounded: true }, sp),
    ...(childArr.length ? { children: childArr } : {}),
  };
}

function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** MobileOrder / MobileFilter / MobileAction / MobileSearch 共用：触发 UI 一律为 jh-mobile-filter-btn */
function openerRelayBtnHtml(sheetKey, relayProps, relayComponent) {
  const ku = _.upperFirst(sheetKey);
  const rp = relayProps || {};
  const text =
    (rp.btnText ?? rp.triggerText ?? rp.label)
    ?? MOBILE_RELAY_DEFAULT_BTN[relayComponent];
  const btnClass =
    (rp.btnClass ?? rp.openerClass) || '!rounded-xl px-2 border border-solid border-gray-300';
  const parts = [
    '<jh-mobile-filter-btn',
    `label="${escapeHtmlAttr(text)}"`,
    `btn-class="${escapeHtmlAttr(btnClass)}"`,
  ];
  if (rp.showActive != null && rp.showActive !== '') {
    parts.push(`:show-active="${rp.showActive}"`);
  }
  if (rp.active != null && rp.active !== '') {
    parts.push(`:active-display="${rp.active}"`);
  }

  if (relayComponent === 'MobileSearch') {
    rp.icon = rp.icon || 'filter-2';
  }

  if (rp.icon != null && rp.icon !== '') {
    parts.push(`icon="${escapeHtmlAttr(rp.icon)}"`);
  }
  parts.push(`@click="is${ku}DrawerShown = true"`);
  parts.push('></jh-mobile-filter-btn>');
  return `\n  ${parts.join('\n  ')}\n  `;
}

function transformMobileRelayNode(node, ctx) {
  if (typeof node === 'string') return [node];
  if (!node || typeof node !== 'object') return [node];

  const comp = node.component;
  if (MOBILE_RELAY_COMPONENTS.has(comp)) {
    const relayProps = node.props && typeof node.props === 'object' ? node.props : {};
    const sheetKey = allocateRelayKey(node.key, comp, ctx.usedKeys);
    const resNode = buildLiftedSheetNode(comp, sheetKey, relayProps, node.children);
    ctx.extraActions.push(resNode);
    return [openerRelayBtnHtml(sheetKey, relayProps, comp)];
  }

  if (Array.isArray(node.children) && node.children.length > 0) {
    const newChildren = node.children.flatMap(ch => transformMobileRelayNode(ch, ctx));
    return [{ ...node, children: newChildren }];
  }

  return [node];
}

/**
 * @returns {{ pageContent: Array, extraActionNodes: Array }}
 */
function liftMobileRelaysFromPageContent(rawPageContent, rawActionContent) {
  const usedKeys = new Set();
  collectUsedKeysFromNodes(rawActionContent, usedKeys);
  const ctx = { extraActions: [], usedKeys };
  const pageContent = rawPageContent.flatMap(n => transformMobileRelayNode(n, ctx));
  return { pageContent, extraActionNodes: ctx.extraActions };
}

// ─────────────────────────────────────────────
// legacyConfig 构建辅助（过渡期使用）
// ─────────────────────────────────────────────

function buildSearchNode(searchFieldList) {
  if (!searchFieldList || !searchFieldList.length) return [];
  return [{
    tag: 'jh-search',
    value: searchFieldList.map(field => {
      if (field.type === 'select') {
        return {
          tag: 'v-select',
          model: `serverSearchWhere.${field.key}`,
          attrs: { prefix: field.label || field.key, ':items': JSON.stringify(field.options || []) },
        };
      }
      return {
        tag: 'v-text-field',
        model: `serverSearchWhereLike.${field.key}`,
        attrs: { prefix: field.label || field.key },
      };
    }),
    searchBtn: true,
  }];
}

function buildTableNode(tableProps) {
  const columns = (tableProps || {}).columns  || (tableProps || {}).headers  || [];
  const rowActionList = (tableProps || {}).rowActionList || [];
  const headActionList = (tableProps || {}).headActionList || [];
  const serverPagination = !!(tableProps || {}).serverPagination;
  const selectable = !!(tableProps || {}).selectable;

  return {
    tag: 'jh-table',
    props: { serverPagination },
    headers: [
      ...columns.map(col => Object.assign({}, col)),
      { text: '操作', value: 'action', width: 120, align: 'center' },
    ],
    rowActionList: rowActionList.map(action => {
      const token = action.uiAction || action.intent;
      return {
      text:  action.label,
      color: token === 'delete' ? 'error' : 'success',
      click: token === 'update'
        ? 'doUiAction("startUpdateItem", item)'
        : token === 'delete'
          ? 'doUiAction("deleteItem", item)'
          : `doUiAction("${action.id || token}", item)`,
    };
    }),
    headActionList: [
      ...headActionList.map(action => {
        const token = action.uiAction || action.intent;
        return {
        tag: 'v-btn',
        value: action.label,
        attrs: {
          color: 'success', small: true, class: 'mr-2',
          '@click': token === 'create'
            ? "doUiAction('startCreateItem')"
            : `doUiAction('${action.id || token}')`,
        },
      };
      }),
      { tag: 'v-spacer' },
    ],
    ...(selectable ? { attrs: { ':show-select': 'true', 'v-model': 'tableSelected' } } : {}),
    value: [],
  };
}

function buildDrawerByForm(formKey, formSchema) {
  const formFieldList =
    (formSchema && Array.isArray(formSchema.fieldList) && formSchema.fieldList.length)
      ? formSchema.fieldList
      : (formSchema && Array.isArray(formSchema.fields) ? formSchema.fields : null);
  if (!formSchema || !Array.isArray(formFieldList)) return null;
  const isCreate = formKey === 'create';
  const key = isCreate ? 'create' : 'update';
  return {
    tag: isCreate ? 'jh-create-drawer' : 'jh-update-drawer',
    key,
    title: formSchema.title || (isCreate ? '新增' : '编辑'),
    attrs: {},
    contentList: [{
      label: formSchema.title || (isCreate ? '新增' : '编辑'),
      type: 'form',
      formItemList: formFieldList.map(field => ({
        label:    field.label || field.key,
        model:    field.key,
        tag:      field.type === 'select' ? 'v-select' : 'v-text-field',
        required: !!field.required,
        rules:    field.required ? 'validationRules.requireRules' : undefined,
        idGenerate: field.autoId ? {
          prefix:     field.autoId.prefix,
          startValue: field.autoId.start,
          bizId:      field.key,
        } : undefined,
        attrs: {
          ...(field.readonly ? { disabled: true } : {}),
          ...(field.type === 'select' ? { ':items': JSON.stringify(field.options || []) } : {}),
        },
      })),
      action: {
        tag: 'v-btn',
        value: isCreate ? '新增' : '编辑',
        attrs: {
          color: 'success',
          ':small': true,
          '@click': isCreate ? "doUiAction('createItem')" : "doUiAction('updateItem')",
        },
      },
    }],
  };
}

// ─────────────────────────────────────────────
// dataSource 规范化
// ─────────────────────────────────────────────

/**
 * 规范化 dataSource 配置，统一处理别名与默认值。
 *
 * 字段说明：
 *   table         {string}  数据库表名（必填）；model 为向下兼容别名
 *   primaryKey    {string}  主键字段名，默认 'id'
 *   listResource  {string}  列表查询 actionId，默认 'selectItemList'
 *   createResource{string}  新增 actionId，默认 'insertItem'
 *   updateResource{string}  编辑 actionId，默认 'updateItem'
 *   deleteResource{string}  删除 actionId，默认 'deleteItem'
 *
 * 实现：lib/json/v7/compiler/semantic/normalizeDataSource.js（flatten + 默认值 → standardConfig.dataSource → NJK bake）
 */

// ─────────────────────────────────────────────
// 主函数
// ─────────────────────────────────────────────

function parseSchema(schema, options = {}) {
  const pageType = schema.pageType || 'jh-page';
  const page   = schema.page   || {};
  const ds     = normalizeDataSource(schema.dataSource || {});
  const list   = schema.list   || {};
  const form   = schema.form   || {};
  const common = schema.common || {};

  // 1. 规范化原始 pageContent / actionContent 树
  const rawPageContent   = normalizePageContent(schema);
  const rawActionContent = normalizeActionContent(schema);

  // 1b. v7 路径：跳过中继处理（expandCrudPage 已显式生成 SearchSheet）
  //     v6 路径：pageContent 内的 MobileOrder/MobileFilter/MobileAction 中继 → 触发按钮 + 追加 actionContent 弹出层
  const isV7 = schema.version === 'v7' || (schema._v7Meta && schema._v7Meta.explicitMobileSearchSheet);
  let mergedPageContentForResolve;
  let mergedActionContentForResolve;
  
  if (isV7) {
    // v7：不做中继转换，直接使用原始树
    mergedPageContentForResolve = rawPageContent;
    mergedActionContentForResolve = rawActionContent;
  } else {
    // v6：执行中继转换
    const liftedMobile = liftMobileRelaysFromPageContent(rawPageContent, rawActionContent);
    mergedPageContentForResolve = liftedMobile.pageContent;
    mergedActionContentForResolve = [...rawActionContent, ...liftedMobile.extraActionNodes];
  }

  const pageHeaderNodeForSearchSheet = findComponent(rawPageContent, 'PageHeader');
  const fallbackSearchFieldListForSheet = resolveBlockProps(
    schema,
    pageHeaderNodeForSearchSheet,
    'searchFieldList',
    (list.search || {}).fields || [],
  );
  enrichSearchSheetNodes(mergedActionContentForResolve, fallbackSearchFieldListForSheet);

  // 2. 递归解析节点（补全 resolvedComponent / resolvedProps）
  const resolvedPageContent = mergedPageContentForResolve.map((node, index) => resolveNode(schema, node, {
    ...options,
    path: resolveRootNodePath(schema, 'pageContent', index),
  }));
  const resolvedActionContent = mergedActionContentForResolve.map((node, index) => resolveNode(schema, node, {
    ...options,
    path: resolveRootNodePath(schema, 'actionContent', index),
  }));
  syncKeywordHeadersFromTable(resolvedPageContent, resolvedActionContent);

  // 3. 从原始树中提取业务配置（用于 features / legacyConfig）
  const mobileSearchNode = findComponent(rawPageContent, 'MobileSearch');
  const explicitSearchSheetNode = findComponent(rawActionContent, 'SearchSheet');
  const pageHeaderNode   = findComponent(rawPageContent, 'PageHeader');
  const listTableMeta    = (list.table && typeof list.table === 'object') ? list.table : {};
  const preferredTableKey = listTableMeta.tableKey;
  const tableBlockNode   = findCollectionNode(rawPageContent, { component: 'Table', preferredKey: preferredTableKey });
  const listBlockNode    = findCollectionNode(rawPageContent, { component: 'List', preferredKey: preferredTableKey });
  const createFormNode   = findFormNodeByKey(rawActionContent, 'create') || findFormNodeByKey(rawPageContent, 'create');
  const updateFormNode   = findFormNodeByKey(rawActionContent, 'update') || findFormNodeByKey(rawPageContent, 'update');

  const hasTable = tableNodeHasColumnConfig((tableBlockNode || {}).props) || Object.keys(list.table || {}).length > 0;
  const hasList = tableNodeHasColumnConfig((listBlockNode || {}).props) || Object.keys(list.table || {}).length > 0;
  const hasMobileSearch = !!(mobileSearchNode || explicitSearchSheetNode);

  // Table：有 columns / columnsRef / headers / columnsBinding 任一即视为声明了 Table，否则回退 list.table
  const tableProps =
    hasTable
      ? (tableBlockNode || {}).props || {}
      : hasList ? (listBlockNode || {}).props || {} : {};

  const searchFieldList = resolveBlockProps(schema, pageHeaderNode, 'searchFieldList', (list.search || {}).fields || []);

  const resolveConfiguredKeywordFieldList = () => {
    const sheetNode = findComponent(resolvedActionContent, 'SearchSheet');
    const km = sheetNode && (sheetNode.resolvedProps || {}).keywordConfig;
    if (km && Array.isArray(km.fields) && km.fields.length) {
      return km.fields.slice();
    }
    const searchNode = findComponent(resolvedPageContent, 'Search');
    const kw = searchNode && (searchNode.resolvedProps || {}).keywordConfig;
    if (kw && Array.isArray(kw.fields) && kw.fields.length) {
      return kw.fields.slice();
    }
    return [];
  };
  const configuredKeywordFieldList = resolveConfiguredKeywordFieldList();
  const createFormConfig = resolveDrawerFieldList(schema, createFormNode)
    ? (createFormNode || {}).props || null
    : (form.create || null);
  const updateFormConfig = resolveDrawerFieldList(schema, updateFormNode)
    ? (updateFormNode || {}).props || null
    : (form.update || null);

  const hasPageHeader = findComponent(schema.pageContent, 'PageHeader');
  const hasSearchComponent = findComponent(rawPageContent, 'Search');

  // 4. Feature flags
  const createFields = (
    (createFormConfig && (createFormConfig.fieldList || createFormConfig.fields)) || []
  );
  const autoIdField  = createFields.find(f => f.autoId);
  const autoId       = autoIdField ? {
    type:       autoIdField.autoId.type || 'idSequence',
    prefix:     autoIdField.autoId.prefix || '',
    bizId:      autoIdField.key,
    tableName:  ds.table,
    startValue: autoIdField.autoId.start || 1,
  } : null;
  
  const features = {
    hasMobileSearch,
    hasTable: hasTable || hasList,
    hasList: !!hasList,
    hasPageHeader,
    hasSearch:     !!(searchFieldList || []).length || hasMobileSearch || !!hasSearchComponent,
    hasCreate:     !!createFormConfig,
    hasUpdate:     !!updateFormConfig,
    hasDelete:     detectHasDelete(tableProps),
    hasPagination: !!(tableProps.serverPagination),
    autoId,
    /** views.list.search.keyword.fields → 页面 keywordFieldList 初值（与 PC jh-search 一致，固定列） */
    keywordFieldList: configuredKeywordFieldList,
  };
  let defaultTemplate = '';
  if (pageType === 'jh-page') {
    defaultTemplate = 'jhTemplateV6';
  } else if (pageType === 'jh-mobile-page') {
    defaultTemplate = 'jhMobileTemplateV6';
  } else {
    defaultTemplate = 'jhTemplateV6';
  }

  const v7Meta = schema._v7Meta || null;
  const authoringMode = (v7Meta && v7Meta.mode) || (schema.version === 'v7' ? 'ui' : null);

  // 5. standardConfig（供 v6/v7 模板消费）
  const standardConfig = {
    meta: {
      version: schema.version === 'v7' ? 'v7' : 'v6',
      mode: authoringMode || 'compiled',
    },
    page: {
      id:   page.id,
      name: page.name || page.id,
      title: page.title || page.name || page.id,
      // jh-component：用于生成组件文件路径（app/view/component/<componentPath>.html）
      // 以及决定 Vue.component 的组件名（取最后一段）
      type: page.type || 'list',
      hook: page.hook || null,
      menu: resolvePageMenu(
        page.menu,
        pageType,
        Object.prototype.hasOwnProperty.call(page, 'menu'),
      ),
      vuetify: page.vuetify || '',
      template: page.template || defaultTemplate,
      componentPath: page.componentPath,
      componentProps: page.componentProps || {},
      targets: page.targets || 'pc',
    },
    component: schema.component || (pageType === 'jh-component' && page.componentPath ? {
      path: page.componentPath,
      name: page.name || page.id,
      props: page.componentProps || {},
      targets: page.targets || 'pc',
    } : null),
    // ds 已经过 normalizeDataSource 处理，直接展开即可
    dataSource: { ...ds },
    features,
    // 已解析的节点树（含 resolvedComponent / resolvedProps）
    pageContent:   resolvedPageContent,
    actionContent: resolvedActionContent,
    // 扁平化摘要（供模板快速访问，无需遍历树）
    blocks: {
      header: hasPageHeader ? {
        title:           page.name || page.id,
        searchFieldList,
      } : null,
      table: hasTable || hasList ? {
        columns:         (tableProps).columns || (tableProps).headers || [],
        rowActionList:   (tableProps).rowActionList   || [],
        headActionList:  (tableProps).headActionList  || [],
        filterList:    (tableProps).filterList    || [],
        selectable:      !!(tableProps).selectable,
        serverPagination: !!(tableProps).serverPagination,
        pageSize: resolveBlocksTablePageSize(listTableMeta, tableProps, (listBlockNode || {}).props),
        primaryKey:      ds.primaryKey || 'id',
        orderBy:         resolveBlocksTableOrderBy(listTableMeta, tableProps),
      } : null,
      forms: {
        create: createFormConfig,
        update: updateFormConfig,
      },
    },
    common: common,
    includeList: schema.includeList || [],
  };

  // 6. legacyConfig（过渡兼容旧链路，后续逐步下线）
  const commonData = Object.assign({
  }, common.data || {});

  const legacyConfig = {
    version:      schema.version || 'v6',
    pageType:     schema.pageType || 'jh-page',
    ...(schema.pageType === 'jh-component'
      ? {
        componentPath: page.componentPath || page.id,
        pageName: page.name || page.id,
      }
      : {
        pageId: page.id,
        pageName: page.name || page.id,
      }),
    table:        ds.table || ds.model || '',
    pageHook:     page.hook || null,
    primaryKey:   ds.primaryKey || 'id',
    resourceList: pageType === 'jh-component' ? [] : (schema.resourceList || []),
    headContent: [
      { tag: 'jh-page-title', value: page.name || page.id, attrs: {}, helpBtn: true, slot: [] },
      ...buildSearchNode(searchFieldList),
    ],
    pageContent: [buildTableNode(tableProps)],
    actionContent: [
      buildDrawerByForm('create', createFormConfig),
      buildDrawerByForm('update', updateFormConfig),
    ].filter(Boolean),
    includeList: schema.includeList || [],
    common: common,
  };

  return { standardConfig, legacyConfig };
}

module.exports = { parseSchema, COMPONENT_MAP, MOBILE_RELAY_COMPONENTS };
