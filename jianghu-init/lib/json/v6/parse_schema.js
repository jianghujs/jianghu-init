'use strict';

const _ = require('lodash');
const { resolvePageMenu } = require('../shared/resolvePageMenu');
const {
  resolveBlocksTablePageSize,
  resolveBlocksTableOrderBy,
} = require('../shared/resolveTablePageSize');
const { detectHasDelete } = require('../shared/detectCrudActionFeatures');
const { normalizeDataSource } = require('../v7/compiler/semantic/normalizeDataSource');
const { resolveSchemaComponentName } = require('../shared/schemaComponentAlias');
const {
  buildOrderPanelChildHtml,
  buildMenuGridChildHtml,
} = require('../v7/compiler/runtime/sheetContentPanels');
// ─────────────────────────────────────────────
// Component 注册表：schema component 名 → Vue 组件标签名
// 命名规则：Schema 名 = Vue tag 去掉 jh- 前缀后做 PascalCase 转换，无额外后缀
// 新增组件只需在此加一行，NJK 不需要修改
// ─────────────────────────────────────────────
/**
 * Schema component → Vue 标签（jh-*）。
 *
 * 下列名刻意不入表：仅在 parseSchema 前期由 liftMobileRelaysFromPageContent 消费，
 * 转换为「v-btn 字符串 + actionContent 里的 Sheet | FormSheet | SearchSheet」（Vue：`jh-sheet` | `jh-form-sheet` | `jh-mobile-search-sheet`），不会再走 resolveNode：
 *   MobileOrder、MobileFilter、MobileAction
 * MobileSearch → actionContent 中为 SearchSheet（走 resolveNode）
 */
const COMPONENT_MAP = {
  // 布局 Primitive：VStack → jh-vstack，其余同理
  VStack:          'jh-vstack',
  HStack:          'jh-hstack',
  Box:             'jh-box',
  Grid:            'jh-grid',
  // 业务组件（pageContent）
  PageHeader:      'jh-page-header',
  Table:           'jh-table',
  List:            'jh-list',
  // 业务组件（actionContent）
  CreateDrawer:    'jh-create-drawer',
  UpdateDrawer:    'jh-update-drawer',
  // Drawer      ：纯容器壳，用 children 写插槽内容（向下兼容原有用法）
  // FormDrawer  ：tabList/fieldList 配置式通用表单抽屉（无 inject 依赖）
  Drawer:          'jh-drawer',
  FormDrawer:      'jh-form-drawer',
  // Sheet 族（对标 Drawer 族）：jh-sheet ≈ jh-drawer；jh-form-sheet ≈ jh-form-drawer
  Sheet:     'jh-sheet',
  FormSheet: 'jh-form-sheet',
  CreateSheet: 'jh-form-sheet',
  UpdateSheet: 'jh-form-sheet',
  SearchSheet: 'jh-mobile-search-sheet',
  MobileFilterBtn: 'jh-mobile-filter-btn',
};

// ─────────────────────────────────────────────
// 响应式绑定注册表：每种业务 Block 需要绑定的 Vue 响应式变量
// key   = Vue prop/directive 名（含冒号或 v-xxx 前缀）
// value = 父组件 Vue data/computed 变量名（字符串，原样输出到模板）
// NJK 直接把这些当作 `:prop="varName"` 输出，不需要做任何判断
// ─────────────────────────────────────────────
const REACTIVE_BINDINGS_MAP = {
  // 布局 Primitive：无需响应式绑定
  VStack:  {},
  HStack:  {},
  Box:     {},
  Grid:    {},
  // PageHeader：@search 事件由 handleSearch 统一处理（更新搜索状态并触发 getTableData）
  // keyword / keywordFieldList：.sync 双向绑定，使父页面状态与组件本地状态同步
  PageHeader: {
    ':keyword.sync':          'keyword',
    ':keywordFieldList.sync': 'keywordFieldList',
    '@search':                'handleSearch',
  },
  // Table：静态配置通过 resolvedProps，响应式数据单独绑定
  Table: {
    ':items':                'tableDataComputed',
    ':loading':              'isTableLoading',
    ':options.sync':         'tableOptions',
    ':tableSelected.sync':   'tableSelected',
    '@action':               'doUiAction',
  },
  // List：与 Table 复用同一套响应式数据与 action 分发
  List: {
    ':items':                'tableDataComputed',
    ':loading':              'isTableLoading',
    ':options.sync':         'tableOptions',
    ':tableSelected.sync':   'tableSelected',
    '@action':               'doUiAction',
  },
  // Sheet / FormSheet：由 BINDINGS_MAP 按 key 动态生成；SearchSheet 同 Sheet 的 shown + PageHeader 风格 keyword
  Sheet:     {},
  FormSheet: {},
  SearchSheet: {
    ':keyword.sync':          'keyword',
    ':keywordFieldList.sync': 'keywordFieldList',
    '@search':                'handleSearch',
  },
  // 抽屉类：v-model 控制显隐，initialData 绑定当前编辑项，事件写回与触发
  CreateDrawer: {
    'v-model':              'isCreateDrawerShown',
    ':initialData':         'createItem',
    '@field-change':        '(val) => { createItem[val.key] = val.value }',
    '@action':              'doUiAction',
  },
  UpdateDrawer: {
    'v-model':              'isUpdateDrawerShown',
    ':initialData':         'updateItem',
    '@field-change':        '(val) => { updateItem[val.key] = val.value }',
    '@action':              'doUiAction',
  },
};

// 布局 Primitive 各自的默认 props
const LAYOUT_DEFAULTS = {
  VStack: { gap: 0, align: 'stretch', justify: 'start' },
  HStack: { gap: 0, align: 'center',  justify: 'start', wrap: false },
  Box:    { padding: '', margin: '', width: '100%' },
  Grid:   { cols: 1, gap: 0 },
};

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

/** 旧版 props.cls → 并入节点 attrs.class / :class（根组件已改为仅 v-bind="$attrs"） */
const CLS_HOIST_FROM_PROPS_COMPONENTS = new Set([
  'VStack',
  'HStack',
  'Box',
  'Grid',
  'Table',
]);

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
  if (!CLS_HOIST_FROM_PROPS_COMPONENTS.has(component)) return;
  if (!Object.prototype.hasOwnProperty.call(resolvedProps, 'cls')) return;
  mergeHoistedClsIntoAttrs(resolvedAttrs, resolvedProps.cls);
  delete resolvedProps.cls;
}

/**
 * 递归处理节点树：给每个节点补全 resolvedComponent / resolvedProps / resolvedBindings
 * - resolvedComponent：Vue 组件标签名（kebab-case，含 jh- 前缀）
 * - resolvedProps：静态配置 props（JSON 可序列化，绑定为 :prop="JSON"）
 * - resolvedBindings：响应式变量绑定（原样输出为 :prop="varName" 或 v-model="varName"）
 * - resolvedAttrs：根标签 HTML / Vue 属性（class、:class、v-if 等，见 jh-page-v6 renderAttrs）
 * - 兼容：布局 VStack/HStack/Box/Grid 与 Table 的 props.cls（旧约定）并入 resolvedAttrs 后从 props 移除
 *
 * Table.props.slotTemplates：生成 <template v-slot:name>...</template> 子节点（见 TABLE_SLOT_NAME_RE）
 * Table.props.headersBinding（推荐）或 columnsBinding：生成 :headers="变量名"，并忽略静态列数组
 * Table.props.headers / columns（数组键名）：每项须为 Vuetify 2 headers 形状 { text, value, ... }
 */
const TABLE_SLOT_NAME_RE = /^[A-Za-z0-9_-]+$/;

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

function resolveNode(schema, node) {
  if (!node || typeof node !== 'object') return node;

  const component = resolveSchemaComponentName(node);
  const key = node.key || '';
  const resolvedComponent = COMPONENT_MAP[component] || component;

  const rawProps =
    node.props && typeof node.props === 'object' ? { ...node.props } : {};
  const tableSlotTemplates =
    component === 'Table' ? rawProps.slotTemplates : undefined;
  let headersBinding = null;

  if (component === 'Table' || component === 'List') {
    // Table 才支持 slotTemplates
    if (component === 'Table') {
      delete rawProps.slotTemplates;
    }
    // v6 配置规范：headActionList → 组件实际 props：toolbarActionList
    if (rawProps.headActionList != null) {
      rawProps.toolbarActionList = rawProps.headActionList;
      delete rawProps.headActionList;
    }
    const hb =
      (typeof rawProps.headersBinding === 'string' && rawProps.headersBinding.trim())
        ? rawProps.headersBinding.trim()
        : (typeof rawProps.columnsBinding === 'string' && rawProps.columnsBinding.trim())
          ? rawProps.columnsBinding.trim()
          : null;
    if (hb) {
      headersBinding = hb;
      delete rawProps.headersBinding;
      delete rawProps.columnsBinding;
      delete rawProps.headers;
      delete rawProps.columns;
    } else {
      if (Array.isArray(rawProps.columns) && rawProps.headers == null) {
        rawProps.headers = rawProps.columns;
        delete rawProps.columns;
      }
    }
  }

  const resolvedProps = resolveProps(schema, component, rawProps);
  if ((component === 'Table' || component === 'List') && resolvedProps.columns != null) {
    if (resolvedProps.headers == null) {
      resolvedProps.headers = resolvedProps.columns;
    }
    delete resolvedProps.columns;
  }
  // orderBy 仅用于页面 prepareTableParams → API，不作为 jh-table / jh-list 组件 prop
  // pageSize 仅用于页面 tableOptions.itemsPerPage 初值（standardConfig.blocks.table），不作为组件 prop
  if (component === 'Table' || component === 'List') {
    delete resolvedProps.orderBy;
    delete resolvedProps.pageSize;
  }

  // 字符串 options / rules → { __expr__: '...' }，序列化时不加引号，Vue 当作表达式变量引用。
  const markFieldItemExpr = f => {
    if (!f || typeof f !== 'object') return f;
    const out = { ...f };
    if (typeof f.options === 'string' && f.options) out.options = { __expr__: f.options };
    if (typeof f.rules === 'string' && f.rules)     out.rules   = { __expr__: f.rules };
    return out;
  };
  const markExprFields = fields =>
    Array.isArray(fields) ? fields.map(markFieldItemExpr) : fields;

  const markActionItemExpr = action => {
    if (!action || typeof action !== 'object') return action;
    const out = { ...action };
    for (const k of ['visibleWhen', 'disabledWhen']) {
      const v = out[k];
      if (typeof v === 'string' && v && /[=<>!]|&&|\|\||'|"|\./.test(v)) {
        out[k] = { __expr__: v };
      }
    }
    return out;
  };
  const markExprActions = list =>
    Array.isArray(list) ? list.map(markActionItemExpr) : list;

  // drawer 类：fieldList / tabList / actionList / headActionList
  if (['CreateDrawer', 'UpdateDrawer', 'FormDrawer', 'FormSheet', 'Sheet'].includes(component)) {
    if (Array.isArray(resolvedProps.fieldList)) {
      resolvedProps.fieldList = markExprFields(resolvedProps.fieldList);
    }
    if (Array.isArray(resolvedProps.fields)) {
      resolvedProps.fields = markExprFields(resolvedProps.fields);
    }
    if (Array.isArray(resolvedProps.actionList)) {
      resolvedProps.actionList = markExprActions(resolvedProps.actionList);
    }
    if (Array.isArray(resolvedProps.headActionList)) {
      resolvedProps.headActionList = markExprActions(resolvedProps.headActionList);
    }
    if (Array.isArray(resolvedProps.tabList)) {
      resolvedProps.tabList = resolvedProps.tabList.map(tab => {
        if (!tab || typeof tab !== 'object') return tab;
        const t = { ...tab };
        if (Array.isArray(t.fieldList)) t.fieldList = markExprFields(t.fieldList);
        if (Array.isArray(t.fields))    t.fields    = markExprFields(t.fields);
        if (Array.isArray(t.actionList)) t.actionList = markExprActions(t.actionList);
        if (Array.isArray(t.headActionList)) t.headActionList = markExprActions(t.headActionList);
        return t;
      });
    }
  }

  // Table / List：toolbarActionList（由 headActionList 映射）同样支持 visibleWhen / disabledWhen
  if (component === 'Table' || component === 'List') {
    if (Array.isArray(resolvedProps.toolbarActionList)) {
      resolvedProps.toolbarActionList = markExprActions(resolvedProps.toolbarActionList);
    }
  }

  // 搜索类：searchFieldList / fields（含 SearchSheet 内 select.options 变量路径）
  if (['PageHeader', 'Search', 'SearchSheet'].includes(component)) {
    if (Array.isArray(resolvedProps.searchFieldList)) {
      resolvedProps.searchFieldList = markExprFields(resolvedProps.searchFieldList);
    }
    if (Array.isArray(resolvedProps.fields)) {
      resolvedProps.fields = markExprFields(resolvedProps.fields);
    }
  }

  const BINDINGS_MAP = ({component, key}) => {
    if (component === 'FormDrawer') {
      const stateKey = _.lowerFirst(key);
      const stateKeyU = _.upperFirst(key);
      return {
        'v-model':          `is${stateKeyU}DrawerShown`,
        ':initialData':     `${stateKey}Item`,
        '@field-change':    `(val) => { ${stateKey}Item[val.key] = val.value }`,
        '@action':          'doUiAction',
      };
    } else if (component === 'SearchSheet') {
      const ku = _.upperFirst(key);
      return Object.assign({}, REACTIVE_BINDINGS_MAP.SearchSheet || {}, {
        ':shown.sync': `is${ku}DrawerShown`,
      });
    } else if (component === 'Sheet') {
      const ku = _.upperFirst(key);
      const sk = _.lowerFirst(key);
      return {
        ':shown.sync':     `is${ku}DrawerShown`,
        ':initialData':    `${sk}Item`,
        '@confirm':        "doUiAction('getTableData')",
        '@action':         'doUiAction',
        '@head-action':    'doUiAction',
      };
    } else if (component === 'FormSheet') {
      const ku = _.upperFirst(key);
      return {
        ':shown.sync': `is${ku}DrawerShown`,
        '@confirm':    "doUiAction('getTableData')",
        '@action':     'doUiAction',
      };
    } else if (component === 'Drawer') {
      return {
        'v-model':          `is${_.upperFirst(key)}DrawerShown`,
        ':initialData':     `${_.lowerFirst(key)}Item`,
      };
    } else {
      return REACTIVE_BINDINGS_MAP[component] || {};
    }
  }

  // PageHeader：props 里若声明了 keyword / keywordFieldList 字符串，视为绑定变量名，
  // 提取为 .sync binding 并从 resolvedProps 移除，避免被序列化为静态字符串。
  const pageHeaderBindingOverrides = {};
  if (component === 'PageHeader') {
    for (const [propKey, bindingKey] of [
      ['keyword',          ':keyword.sync'],
      ['keywordFieldList', ':keywordFieldList.sync'],
    ]) {
      if (typeof resolvedProps[propKey] === 'string' && resolvedProps[propKey].trim()) {
        pageHeaderBindingOverrides[bindingKey] = resolvedProps[propKey].trim();
        delete resolvedProps[propKey];
      }
    }
  }

  // SearchSheet：与 PageHeader 一致——keyword / keywordFieldList / keywordHeaders / searchFieldList
  // 若为「非 JSON」的普通字符串，视为 Vue 变量名，生成绑定并从静态 props 剔除。
  const searchSheetBindingOverrides = {};
  if (component === 'SearchSheet') {
    for (const [propKey, bindingKey] of [
      ['keyword',          ':keyword.sync'],
      ['keywordFieldList', ':keywordFieldList.sync'],
      ['keywordHeaders',   ':keyword-headers'],
      ['searchFieldList',  ':search-field-list'],
    ]) {
      const rawVal = resolvedProps[propKey];
      if (typeof rawVal !== 'string' || !rawVal.trim()) continue;
      const trimmed = rawVal.trim();
      // 排除误把 JSON 数组字符串当变量名：以 [ 或 { 开头的不提取为绑定
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) continue;
      searchSheetBindingOverrides[bindingKey] = trimmed;
      delete resolvedProps[propKey];
    }
  }

  const { applyPropBindOverrides } = require('../shared/applyPropBind');
  const frameworkBindingOverrides = Object.assign(
    {},
    BINDINGS_MAP({ component, key }),
    headersBinding ? { ':headers': headersBinding } : {},
    pageHeaderBindingOverrides,
    searchSheetBindingOverrides,
  );
  const propBindOverrides = applyPropBindOverrides(resolvedProps, {
    component,
    bindingOverrides: frameworkBindingOverrides,
  });

  const resolvedBindings = Object.assign(
    {},
    frameworkBindingOverrides,
    propBindOverrides,
  );

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
  hoistPropsClsIntoAttrs(component, resolvedProps, resolvedAttrs);

  // _meta：供 NJK 模板消费的结构化标志，避免模板里出现 component 名字判断
  const NEEDS_SHOWN_STATE = new Set(['Drawer', 'FormDrawer', 'Sheet', 'FormSheet', 'SearchSheet']);
  const NEEDS_ITEM_STATE  = new Set(['Drawer', 'FormDrawer', 'Sheet', 'FormSheet']);
  const _meta = {
    needsShownState: NEEDS_SHOWN_STATE.has(component),  // 是否需要 is{Key}DrawerShown: false
    needsItemState:  NEEDS_ITEM_STATE.has(component),   // 是否需要 {key}Item / {key}ItemOrigin
  };

  const result = {
    component,
    resolvedComponent,
    resolvedProps,
    resolvedBindings,
    _meta,
  };

  if (Object.keys(resolvedAttrs).length > 0) {
    result.resolvedAttrs = resolvedAttrs;
  }

  if (node.key) {
    result.key = node.key;
  }

  let childrenResolved = [];
  if (Array.isArray(node.children) && node.children.length > 0) {
    childrenResolved = node.children.map(child => resolveNode(schema, child));
  }

  if (
    component === 'Table' &&
    tableSlotTemplates &&
    typeof tableSlotTemplates === 'object' &&
    !Array.isArray(tableSlotTemplates)
  ) {
    for (const [slotName, html] of Object.entries(tableSlotTemplates)) {
      if (typeof html !== 'string' || !html.trim()) continue;
      const safeName = String(slotName).trim();
      if (!safeName || !TABLE_SLOT_NAME_RE.test(safeName)) continue;
      childrenResolved.push(
        `<template v-slot:${safeName}>${html}</template>`,
      );
    }
  }

  if (childrenResolved.length > 0) {
    result.children = childrenResolved;
  }

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
  const list = (node.resolvedProps && node.resolvedProps.searchFieldList) || [];
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

/** MobileSearch 生成的 SearchSheet：未配置 searchFieldList 时继承 PageHeader / list.search.fields */
function enrichSearchSheetNodes(actionNodes, fallbackSearchFieldList) {
  if (!Array.isArray(actionNodes) || !Array.isArray(fallbackSearchFieldList) || !fallbackSearchFieldList.length) return;
  for (const n of actionNodes) {
    if (!n || typeof n !== 'object' || n.component !== 'SearchSheet') continue;
    const p = n.props || {};
    const sf = p.searchFieldList;
    if (typeof sf === 'string' && sf.trim()) continue;
    if (Array.isArray(sf) && sf.length > 0) continue;
    n.props = Object.assign({}, p, { searchFieldList: fallbackSearchFieldList });
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
  if (Array.isArray(schema.pageContent) && schema.pageContent.length > 0) {
    return schema.pageContent;
  }
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

/**
 * pageContent 内的「移动端中继」组件：解析阶段剥离为
 *   - 页面上的触发 UI（统一生成 `<jh-mobile-filter-btn>`，@click 打开 is{Key}DrawerShown）
 *   - actionContent 末尾追加的真实弹出层（Sheet / FormSheet / SearchSheet）
 * 这样配置侧只在 pageContent 声明一次，无需手写 actionContent 对联。
 *
 * 中继类型：
 *   MobileOrder  → Sheet（排序：props.orderList）
 *   MobileFilter → FormSheet（筛选：children 进插槽，props.hiddenBtn 等）
 *   MobileSearch → SearchSheet（搜索：与 PageHeader 同源 searchFieldList / keyword / keywordFieldList）
 *   MobileAction → Sheet（更多操作：props.actionList / cols）
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
  // MobileAction：图标网格进 children
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
    (rp.btnClass ?? rp.openerClass) || 'rounded-full border border-solid border-gray-300';
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
    rowActionList: rowActionList.map(action => ({
      text:  action.label,
      color: action.intent === 'delete' ? 'error' : 'success',
      click: action.intent === 'update'
        ? 'doUiAction("startUpdateItem", item)'
        : action.intent === 'delete'
          ? 'doUiAction("deleteItem", item)'
          : `doUiAction("${action.id}", item)`,
    })),
    headActionList: [
      ...headActionList.map(action => ({
        tag: 'v-btn',
        value: action.label,
        attrs: {
          color: 'success', small: true, class: 'mr-2',
          '@click': action.intent === 'create'
            ? "doUiAction('startCreateItem')"
            : `doUiAction('${action.id}')`,
        },
      })),
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
// dataSource 规范化（v6 直接引用 v7 实现）
// ─────────────────────────────────────────────
// flattenDataSource 已从 v7/compiler/semantic/normalizeDataSource 引入
// 保留此注释以说明来源，不再维护本地实现

// ─────────────────────────────────────────────
// 主函数
// ─────────────────────────────────────────────

function parseSchema(schema) {
  const pageType = schema.pageType || 'jh-page';
  const page   = schema.page   || {};
  const ds     = normalizeDataSource(schema.dataSource || {});
  const list   = schema.list   || {};
  const form   = schema.form   || {};
  const common = schema.common || {};

  // 1. 规范化原始 pageContent / actionContent 树
  const rawPageContent   = normalizePageContent(schema);
  const rawActionContent = normalizeActionContent(schema);

  // 1b. pageContent 内的 MobileOrder/MobileFilter/MobileAction 中继 → 触发按钮 + 追加 actionContent 弹出层
  const liftedMobile = liftMobileRelaysFromPageContent(rawPageContent, rawActionContent);
  const mergedPageContentForResolve   = liftedMobile.pageContent;
  const mergedActionContentForResolve = [...rawActionContent, ...liftedMobile.extraActionNodes];

  const pageHeaderNodeForSearchSheet = findComponent(rawPageContent, 'PageHeader');
  const fallbackSearchFieldListForSheet = resolveBlockProps(
    schema,
    pageHeaderNodeForSearchSheet,
    'searchFieldList',
    (list.search || {}).fields || [],
  );
  enrichSearchSheetNodes(mergedActionContentForResolve, fallbackSearchFieldListForSheet);

  // 2. 递归解析节点（补全 resolvedComponent / resolvedProps）
  const resolvedPageContent = mergedPageContentForResolve.map(node => resolveNode(schema, node));
  const resolvedActionContent = mergedActionContentForResolve.map(node => resolveNode(schema, node));
  syncKeywordHeadersFromTable(resolvedPageContent, resolvedActionContent);

  // 3. 从原始树中提取业务配置（用于 features / legacyConfig）
  const mobileSearchNode = findComponent(rawPageContent, 'MobileSearch');
  const pageHeaderNode   = findComponent(rawPageContent, 'PageHeader');
  const listTableMeta    = (list.table && typeof list.table === 'object') ? list.table : {};
  const preferredTableKey = listTableMeta.tableKey;
  const tableBlockNode   = findCollectionNode(rawPageContent, { component: 'Table', preferredKey: preferredTableKey });
  const listBlockNode    = findCollectionNode(rawPageContent, { component: 'List', preferredKey: preferredTableKey });
  const createFormNode   = findComponent(rawActionContent, 'CreateDrawer') || findComponent(rawPageContent, 'CreateDrawer');
  const updateFormNode   = findComponent(rawActionContent, 'UpdateDrawer') || findComponent(rawPageContent, 'UpdateDrawer');

  const hasTable = tableNodeHasColumnConfig((tableBlockNode || {}).props) || Object.keys(list.table || {}).length > 0;
  const hasList = tableNodeHasColumnConfig((listBlockNode || {}).props) || Object.keys(list.table || {}).length > 0;
  const hasMobileSearch = !!mobileSearchNode;

  // Table：有 columns / columnsRef / headers / columnsBinding 任一即视为声明了 Table，否则回退 list.table
  const tableProps =
    hasTable
      ? (tableBlockNode || {}).props || {}
      : hasList ? (listBlockNode || {}).props || {} : {};

  const searchFieldList = resolveBlockProps(schema, pageHeaderNode, 'searchFieldList', (list.search || {}).fields || []);
  const createFormConfig = resolveDrawerFieldList(schema, createFormNode)
    ? (createFormNode || {}).props || null
    : (form.create || null);
  const updateFormConfig = resolveDrawerFieldList(schema, updateFormNode)
    ? (updateFormNode || {}).props || null
    : (form.update || null);

  const hasPageHeader = findComponent(schema.pageContent, 'PageHeader');

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
    hasSearch:     !!(searchFieldList || []).length || hasMobileSearch,
    hasCreate:     !!createFormConfig,
    hasUpdate:     !!updateFormConfig,
    hasDelete:     detectHasDelete(tableProps),
    hasPagination: !!(tableProps.serverPagination),
    autoId,
  };
  let defaultTemplate = '';
  if (pageType === 'jh-page') {
    defaultTemplate = 'jhTemplateV6';
  } else if (pageType === 'jh-mobile-page') {
    defaultTemplate = 'jhMobileTemplateV6';
  } else {
    defaultTemplate = 'jhTemplateV6';
  }

  // 5. standardConfig（供 v6 模板消费）
  const standardConfig = {
    meta: { version: 'v6', mode: 'compiled' },
    page: {
      id:   page.id,
      name: page.name || page.id,
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
    },
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
  };

  // 6. legacyConfig（过渡兼容旧链路，后续逐步下线）
  const commonData = Object.assign({
  }, common.data || {});

  const legacyConfig = {
    version:      schema.version || 'v6',
    pageType:     schema.pageType || 'jh-page',
    pageId:       page.id,
    pageName:     page.name || page.id,
    ...(schema.pageType === 'jh-component'
      ? { componentPath: page.componentPath || page.id }
      : {}),
    table:        ds.table || ds.model || '',
    pageHook:     page.hook || null,
    primaryKey:   ds.primaryKey || 'id',
    resourceList: schema.resourceList || [],
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

module.exports = { parseSchema };
