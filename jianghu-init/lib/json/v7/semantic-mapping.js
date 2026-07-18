'use strict';

const { COMPONENT_TAG_MAP } = require('./compiler/runtime/componentDescriptors');

/**
 * V7 语义 → 组件参数映射（文档常量，供 IDE 跳转与注释引用）
 *
 * 完整说明见：docs/semantic-to-component-mapping.md
 * views.* 转换入口：compiler/semantic/views/compileListView.js、compileCreateView.js、compileUpdateView.js
 * 后续节点组装与渲染转换：builders.js → compiler/runtime/schemaPipeline.js
 */

/** platform token → Schema 组件名（views 容器选型） */
const PLATFORM_COMPONENT = {
  list: {
    Table: 'Table',
    List: 'List',
  },
  create: {
    CreateDrawer: 'CreateDrawer',
    CreateSheet: 'FormSheet',
  },
  update: {
    UpdateDrawer: 'UpdateDrawer',
    UpdateSheet: 'FormSheet',
  },
};

/** Schema 组件名 → Vue 标签；唯一来源为 runtime component descriptors。 */
const SCHEMA_TO_VUE_TAG = { ...COMPONENT_TAG_MAP };

/**
 * views.create 语义键 → 节点 props 键（compileCreateView + pushCreateForm）
 * 运行时绑定见 componentDescriptors 中 CreateDrawer / FormSheet 的 bindings 规则
 */
const VIEWS_CREATE_TO_PROPS = {
  'views.create.title': 'props.title',
  'views.create.fields + fields.*': 'props.fieldList[]',
  'views.create.interaction': 'props.fieldList[].visibleWhen|readonlyWhen|disabledWhen',
  'views.create.saveTipBeforeClose': 'props.beforeCloseConfirm',
  'fields.{key}.attrs': 'props.fieldList[].attrs → jh-form extraAttrs',
  'fields.{key}.pc|mobile': '分端 attrs 覆写对象（非 pc.attrs 嵌套）；merge 于 fields.attrs',
  'views.create.fieldAttrs': 'fieldList[].attrs 覆写（merge 于 fields 解析结果上）',
  'views.create.sheet': 'props.persistent|autoHeight|viewportOffset|maxBodyHeight|bodyHeight|minCardHeight (FormSheet only)',
  'layout.create.cols': 'props.cols',
  'layout.create.variants': 'props.fieldList[].span',
  'views.create.actions': 'props.actionList (CreateDrawer) | props.headActionList (FormSheet)',
  'platform.*.create': 'node.component (CreateDrawer|FormSheet)',
};

/**
 * views.list 语义键 → 集合组件 props（compileListView → collection.props）
 */
const VIEWS_LIST_TO_PROPS = {
  'views.list.columns': 'props.headers',
  'views.list.mobileColumns': 'props.headers (mobile only)',
  'views.list.serverPagination': 'props.serverPagination',
  'views.list.pageSize': 'blocks.table.pageSize',
  'views.list.selectable': 'props.selectable',
  'views.list.orderBy': 'blocks.table.orderBy → prepareTableParams（API 请求，非 jh-table prop）',
  'views.list.toolbarActions': 'props.headActionList (PC) | MobileActions.actionList (mobile)',
  'views.list.rowActions': 'props.rowActionList',
  'views.list.search': 'Search / SearchSheet via searchFieldList + keywordConfig',
  'views.list.filter|filters': 'Table.filterList → jh-table-filter (PC only)',
  'views.list.searchSheet': 'SearchSheet props.persistent|maxBodyHeight|bodyHeight|minCardHeight',
  'views.list.mobileItemAction': 'props.mobileItemAction (mobile List only)：\'sheet\'|false|\'none\'|doUiAction 名',
};

/**
 * views.update 语义键 → 节点 props
 */
const VIEWS_UPDATE_TO_PROPS = {
  'views.update.title': 'props.title',
  'views.update.tabs': 'props.tabList',
  'views.update.fields': 'props.fieldList',
  'views.update.actions': 'props.actionList (UpdateDrawer) | props.headActionList (FormSheet)',
  'views.update.tabs[].actions': 'props.tabList[].actionList (UpdateDrawer) | props.tabList[].headActionList (FormSheet)',
  'views.update.tabs[].interaction': 'props.tabList[].fieldList[]',
  'views.update.sheet': 'props.persistent|autoHeight|viewportOffset|maxBodyHeight|bodyHeight|minCardHeight (FormSheet only)',
  'views.update.fieldAttrs': 'fieldList[].attrs 覆写（fields 模式）',
  'views.update.tabs[].fieldAttrs': 'tabList[].fieldList[].attrs 覆写',
  'platform.*.update': 'node.component (UpdateDrawer|FormSheet)',
};

/**
 * 表单类组件 node.key → 页面 Vue 绑定（schemaPipeline，非 props）
 */
const FORM_NODE_KEY_TO_PAGE_STATE = {
  create: {
    shown: 'isCreateDrawerShown',
    data: 'createItem',
    dataOrigin: 'createItemOrigin',
  },
  update: {
    shown: 'isUpdateDrawerShown',
    data: 'updateItem',
    dataOrigin: 'updateItemOrigin',
  },
};

module.exports = {
  PLATFORM_COMPONENT,
  SCHEMA_TO_VUE_TAG,
  VIEWS_CREATE_TO_PROPS,
  VIEWS_LIST_TO_PROPS,
  VIEWS_UPDATE_TO_PROPS,
  FORM_NODE_KEY_TO_PAGE_STATE,
};
