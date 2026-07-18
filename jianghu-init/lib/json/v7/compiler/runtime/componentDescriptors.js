'use strict';

/**
 * componentDescriptors.js
 *
 * 每种 Schema 组件的完整转换规则描述符。
 * resolveNode 作为通用驱动器，只读这张表，不再包含任何组件名判断。
 *
 * 字段说明：
 *   tag              {string}   Vue 组件标签名（jh-*），必填
 *   aliasOf          {string}   指向另一个 descriptor key，tag/规则全部继承（platform token 别名用）
 *   defaultProps     {object}   默认 props（布局 Primitive；SearchSheet 等也可声明）
 *   hoistCls         {boolean}  props.cls → resolvedAttrs.class（旧约定，VStack/HStack/Box/Grid/Table 有）
 *   propRenames      {object}   props key 重命名：{ 旧key: 新key }（在 resolveProps 前执行）
 *   stripProps       {string[]} 从 rawProps 中剔除的 key（不传给组件的配置项，如 orderBy/pageSize）
 *   bindingExtract   {object}   字符串型 prop → binding：{ propKey: bindingKey }
 *                               仅当值为非空字符串且不以 '[' '{' 开头时，生成 `:bindingKey="value"` 并从 resolvedProps 剔除
 *                               用于 headersBinding→:headers、PageHeader keyword 等
 *   slotTemplates    {boolean}  Table/List 的 slotTemplates → <template v-slot:…> children 字符串
 *   exprFieldProps   {string[]} 需要 markExprFields 的 prop 名（options/rules 加 __expr__）
 *   exprActionProps  {string[]} 需要 markExprActions 的 prop 名（visibleWhen/disabledWhen 加 __expr__）
 *   exprTabList      {boolean}  tabList 内每 tab 的 fieldList/fields/actionList/headActionList 也做 expr 标记
 *   bindings         {object}   固定响应式绑定（直接输出为 :prop="varName"），无需 key
 *   keyedBindings    {function} (key) => object，key 驱动的动态绑定（FormDrawer/FormSheet/Sheet/Drawer/SearchSheet）
 *   searchBindings   {object}   PageHeader 专用：有搜索配置时追加的额外绑定
 *   meta             {object}   { needsShownState, needsItemState }，供 NJK 模板消费
 *
 * compat 字段（未来扩展用，驱动器会在 propRenames 之前处理）：
 *   compat           {object}   旧 key → 新 key（兼容旧版配置，比 propRenames 更早执行，仅在旧 key 存在且新 key 不存在时生效）
 */

const _ = require('lodash');
const {
  RUNTIME_PROP_MIGRATIONS,
  SHEET_RETAINED_DEPRECATED_PROPS,
  toAliasMap,
} = require('../../migration/keyMigrations');

// ─── 工具 ──────────────────────────────────────────────────────────────────────
const upperFirst = s => _.upperFirst(s);
const lowerFirst = s => _.lowerFirst(s);
const aliasesFor = (...names) => Object.assign({}, ...names.map(name => toAliasMap(RUNTIME_PROP_MIGRATIONS[name])));

// ─── Descriptor 表 ─────────────────────────────────────────────────────────────
const COMPONENT_DESCRIPTORS = {

  // ════════════════════════════════════════════════════════
  // 布局 Primitive
  // ════════════════════════════════════════════════════════
  VStack: {
    tag: 'jh-vstack',
    defaultProps: { gap: 0, align: 'stretch', justify: 'start' },
    hoistCls: true,
    retainedDeprecatedProps: ['flexFromCls'],
    bindings: {},
    meta: { needsShownState: false, needsItemState: false },
  },

  HStack: {
    tag: 'jh-hstack',
    defaultProps: { gap: 0, align: 'center', justify: 'start', wrap: false },
    hoistCls: true,
    retainedDeprecatedProps: ['flexFromCls'],
    bindings: {},
    meta: { needsShownState: false, needsItemState: false },
  },

  Box: {
    tag: 'jh-box',
    defaultProps: { padding: '', margin: '', width: '100%' },
    hoistCls: true,
    retainedDeprecatedProps: ['extraStyle'],
    bindings: {},
    meta: { needsShownState: false, needsItemState: false },
  },

  Grid: {
    tag: 'jh-grid',
    defaultProps: { cols: 1, gap: 0 },
    gridColsCompat: true,
    hoistCls: true,
    bindings: {},
    meta: { needsShownState: false, needsItemState: false },
  },

  // ════════════════════════════════════════════════════════
  // 页头 / 标题
  // ════════════════════════════════════════════════════════
  PageTitle: {
    tag: 'jh-page-title',
    propRenames: aliasesFor('PageTitle'),
    bindings: {},
    meta: { needsShownState: false, needsItemState: false },
  },

  PageHeader: {
    tag: 'jh-page-header',
    propRenames: aliasesFor('PageHeader', 'Search'),
    exprFieldProps: ['fieldList'],
    // 值为字符串时视为变量名，提取为 .sync binding 并从 resolvedProps 剔除
    bindingExtract: {
      keyword:          ':keyword.sync',
      keywordFieldList: ':keywordFieldList.sync',
    },
    // 有搜索配置（keyword/keywordFieldList/searchFieldList 非空）时追加的固定绑定
    searchBindings: {
      ':keyword.sync':          'keyword',
      ':keywordFieldList.sync': 'keywordFieldList',
      '@search':                'handleSearch',
    },
    bindings: {},
    meta: { needsShownState: false, needsItemState: false },
  },

  // ════════════════════════════════════════════════════════
  // 搜索
  // ════════════════════════════════════════════════════════
  Search: {
    tag: 'jh-search',
    propRenames: aliasesFor('Search'),
    exprFieldProps: ['fieldList'],
    bindings: {
      '@search': 'handleSearch',
    },
    meta: { needsShownState: false, needsItemState: false },
  },

  SearchSheet: {
    tag: 'jh-mobile-search-sheet',
    propRenames: aliasesFor('SearchSheet', 'Search'),
    exprFieldProps: ['fieldList'],
    // 与 jh-mobile-search-sheet Vue 默认一致；Sheet/FormSheet 默认 fill，SearchSheet 例外为 content
    defaultProps: {
      maxBodyHeight: '70vh',
      bodyHeightMode: 'content',
    },
    sheetHeightCompat: true,
    retainedDeprecatedProps: SHEET_RETAINED_DEPRECATED_PROPS,
    // 字符串型 props 提取为 binding
    bindingExtract: {
      keyword:          ':keyword.sync',
      keywordFieldList: ':keywordFieldList.sync',
      keywordHeaders:   ':keyword-headers',
      fieldList:        ':field-list',
    },
    // key 驱动绑定：:shown.sync 用 key 决定变量名，其余固定
    keyedBindings: (key) => ({
      ':keyword.sync':          'keyword',
      ':keywordFieldList.sync': 'keywordFieldList',
      '@search':                'handleSearch',
      'v-model':                `is${upperFirst(key)}DrawerShown`,
    }),
    meta: { needsShownState: true, needsItemState: true },
  },

  // ════════════════════════════════════════════════════════
  // 列表 / 表格
  // ════════════════════════════════════════════════════════
  Table: {
    tag: 'jh-table',
    hoistCls: true,
    propRenames: aliasesFor('Table'),
    // 这些字段只用于页面层（prepareTableParams / tableOptions 初值），不传给组件
    stripProps: ['orderBy', 'pageSize'],
    // 字符串型 headersBinding / columnsBinding → :headers="varName"，并剔除静态 headers/columns
    bindingExtractHeaders: ['headersBinding', 'columnsBinding'],
    slotTemplates: true,
    exprActionProps: ['headActionList', 'rowActionList'],
    bindings: {
      ':items':              'tableDataComputed',
      ':loading':            'isTableLoading',
      ':options.sync':       'tableOptions',
      ':tableSelected.sync': 'tableSelected',
      '@action':             'doUiAction',
    },
    meta: { needsShownState: false, needsItemState: false },
  },

  List: {
    tag: 'jh-list',
    propRenames: aliasesFor('List'),
    stripProps: ['orderBy', 'pageSize'],
    bindingExtractHeaders: ['headersBinding', 'columnsBinding'],
    slotTemplates: true,
    exprActionProps: ['headActionList', 'rowActionList'],
    bindings: {
      ':items':              'tableDataComputed',
      ':loading':            'isTableLoading',
      ':options.sync':       'tableOptions',
      ':tableSelected.sync': 'tableSelected',
      '@action':             'doUiAction',
    },
    meta: { needsShownState: false, needsItemState: false },
  },

  // ════════════════════════════════════════════════════════
  // 抽屉族（固定 key=create/update）
  // ════════════════════════════════════════════════════════
  CreateDrawer: {
    tag: 'jh-create-drawer',
    propRenames: aliasesFor('FormContainer'),
    exprFieldProps: ['fieldList'],
    exprActionProps: ['actionList'],
    exprTabList: true,
    bindings: {
      'v-model':       'isCreateDrawerShown',
      ':initialData':  'createItem',
      '@field-change': '(val) => { createItem[val.key] = val.value }',
      '@action':       'doUiAction',
    },
    meta: { needsShownState: true, needsItemState: true },
  },

  UpdateDrawer: {
    tag: 'jh-update-drawer',
    propRenames: aliasesFor('FormContainer'),
    exprFieldProps: ['fieldList'],
    exprActionProps: ['actionList'],
    exprTabList: true,
    bindings: {
      'v-model':       'isUpdateDrawerShown',
      ':initialData':  'updateItem',
      '@field-change': '(val) => { updateItem[val.key] = val.value }',
      '@action':       'doUiAction',
    },
    meta: { needsShownState: true, needsItemState: true },
  },

  // ════════════════════════════════════════════════════════
  // 通用容器 Drawer / FormDrawer（key 动态）
  // ════════════════════════════════════════════════════════
  Drawer: {
    tag: 'jh-drawer',
    exprActionProps: ['actionList'],
    keyedBindings: (key) => ({
      'v-model':      `is${upperFirst(key)}DrawerShown`,
      ':initialData': `${lowerFirst(key)}Item`,
      '@action':      'doUiAction',
    }),
    meta: { needsShownState: true, needsItemState: true },
  },

  FormDrawer: {
    tag: 'jh-form-drawer',
    propRenames: aliasesFor('FormContainer'),
    exprFieldProps: ['fieldList'],
    exprActionProps: ['actionList'],
    exprTabList: true,
    keyedBindings: (key) => ({
      'v-model':       `is${upperFirst(key)}DrawerShown`,
      ':initialData':  `${lowerFirst(key)}Item`,
      '@field-change': `(val) => { ${lowerFirst(key)}Item[val.key] = val.value }`,
      '@action':       'doUiAction',
    }),
    meta: { needsShownState: true, needsItemState: true },
  },

  // ════════════════════════════════════════════════════════
  // Sheet 族
  // ════════════════════════════════════════════════════════
  Sheet: {
    tag: 'jh-sheet',
    propRenames: aliasesFor('Sheet'),
    exprFieldProps: ['fieldList'],
    // actionList = 标题栏（与 FormSheet/Drawer 一致）；内容网格已外置为 jh-sheet-menu-grid
    exprActionProps: ['actionList'],
    exprTabList: true,
    sheetHeightCompat: true,
    sheetActionCompat: true,
    retainedDeprecatedProps: SHEET_RETAINED_DEPRECATED_PROPS,
    keyedBindings: (key) => ({
      'v-model':      `is${upperFirst(key)}DrawerShown`,
      ':initialData': `${lowerFirst(key)}Item`,
      '@confirm':     "doUiAction('getTableData')",
      '@action':      'doUiAction',
    }),
    meta: { needsShownState: true, needsItemState: true },
  },

  FormSheet: {
    tag: 'jh-form-sheet',
    propRenames: aliasesFor('FormContainer', 'FormSheet'),
    exprFieldProps: ['fieldList'],
    exprActionProps: ['actionList'],
    exprTabList: true,
    sheetHeightCompat: true,
    retainedDeprecatedProps: SHEET_RETAINED_DEPRECATED_PROPS,
    keyedBindings: (key) => ({
      'v-model':       `is${upperFirst(key)}DrawerShown`,
      ':initialData':  `${lowerFirst(key)}Item`,
      '@field-change': `(val) => { ${lowerFirst(key)}Item[val.key] = val.value }`,
      '@action':       'doUiAction',
    }),
    meta: { needsShownState: true, needsItemState: true },
  },

  // platform token 别名（tag 与规则均继承 FormSheet）
  CreateSheet: { aliasOf: 'FormSheet' },
  UpdateSheet: { aliasOf: 'FormSheet' },

  // ════════════════════════════════════════════════════════
  // 移动端工具
  // ════════════════════════════════════════════════════════
  MobileFilterBtn: {
    tag: 'jh-mobile-filter-btn',
    bindings: {},
    meta: { needsShownState: false, needsItemState: false },
  },

  MobileActions: {
    tag: 'jh-mobile-actions',
    bindings: { '@action': 'doUiAction' },
    meta: { needsShownState: false, needsItemState: false },
  },

  HeadToolbarActions: {
    tag: 'jh-mobile-actions',
    bindings: { '@action': 'doUiAction' },
    meta: { needsShownState: false, needsItemState: false },
  },

  MobileToolbarActions: {
    tag: 'jh-mobile-actions',
    bindings: { '@action': 'doUiAction' },
    meta: { needsShownState: false, needsItemState: false },
  },

  Form: {
    tag: 'jh-form',
    propRenames: aliasesFor('Form'),
    exprFieldProps: ['fieldList'],
    bindings: {},
    meta: { needsShownState: false, needsItemState: false },
  },

  TextBtn: {
    tag: 'jh-text-btn',
    propRenames: aliasesFor('TextBtn'),
    retainedDeprecatedProps: ['alignSub'],
    bindings: {},
    meta: { needsShownState: false, needsItemState: false },
  },
};

/**
 * 解析 alias：找到最终的 descriptor（支持一级 aliasOf）
 * 返回 { desc, resolvedTag }
 */
function resolveDescriptor(componentName) {
  const raw = COMPONENT_DESCRIPTORS[componentName];
  if (!raw) return { desc: null, resolvedTag: componentName };
  if (raw.aliasOf) {
    const target = COMPONENT_DESCRIPTORS[raw.aliasOf];
    if (!target) return { desc: raw, resolvedTag: componentName };
    return { desc: target, resolvedTag: target.tag };
  }
  return { desc: raw, resolvedTag: raw.tag };
}

const COMPONENT_TAG_MAP = Object.fromEntries(
  Object.keys(COMPONENT_DESCRIPTORS).map(componentName => [
    componentName,
    resolveDescriptor(componentName).resolvedTag,
  ]),
);

module.exports = { COMPONENT_DESCRIPTORS, COMPONENT_TAG_MAP, resolveDescriptor };
