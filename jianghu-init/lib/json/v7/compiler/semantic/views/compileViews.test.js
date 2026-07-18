'use strict';

const assert = require('assert');
const { compileListView } = require('./compileListView');
const { compileCreateView } = require('./compileCreateView');
const { compileUpdateView } = require('./compileUpdateView');
const { expandCrudPage } = require('../expandCrudPage');

const fields = {
  name: { label: '名称', type: 'text', width: 180 },
  status: {
    label: '状态',
    type: 'select',
    options: [{ text: '启用', value: 'active' }],
  },
  remark: { label: '备注', type: 'textarea' },
};

const listView = {
  columns: ['name', 'status'],
  mobileColumns: ['name', { field: 'remark', span: 2 }],
  search: { keyword: { fields: ['name'], placeholder: '搜索名称' }, fields: ['status'] },
  filter: { fields: ['status'] },
  toolbarActions: ['add'],
  rowActions: ['edit', 'delete'],
  pageSize: 20,
  orderBy: [{ column: 'id', order: 'desc' }],
  selectable: true,
  dataTableProps: { fixedHeader: true },
  mobileItemAction: 'update',
  mobileSearchKey: 'demoSearch',
  mobileSearchBtnText: '筛选',
  mobileSearchTitle: '筛选记录',
  searchSheet: { persistent: true },
};

const pcSemantic = {
  slots: {
    list: { pc: { children: '<template v-slot:item.name="{ item }">{{ item.name }}</template>' } },
  },
};
const pcListResult = compileListView({
  semantic: pcSemantic,
  view: listView,
  fields,
  target: 'pc',
  layout: { list: {} },
  component: 'Table',
  listLayout: 'table',
});

assert.deepStrictEqual(pcListResult.collection, {
  component: 'Table',
  key: 'mainTable',
  props: {
    headers: [
      { text: '名称', value: 'name', width: 180 },
      { text: '状态', value: 'status' },
    ],
    serverPagination: false,
    pageSize: 20,
    selectable: true,
    dataTableProps: { fixedHeader: true },
    headActionList: [{ label: '新增', uiAction: 'create' }],
    rowActionList: [
      { label: '编辑', uiAction: 'update' },
      { label: '删除', uiAction: 'delete' },
    ],
    orderBy: [{ column: 'id', order: 'desc' }],
    filterList: [{
      key: 'status',
      label: '状态',
      type: 'select',
      options: [{ text: '启用', value: 'active' }],
    }],
  },
});
assert.deepStrictEqual(pcListResult.searchFieldList, [
  { key: 'keyword', type: 'keyword', label: '搜索名称' },
  {
    key: 'status',
    label: '状态',
    type: 'select',
    options: [{ text: '启用', value: 'active' }],
  },
]);
assert.deepStrictEqual(pcListResult.keywordConfig, {
  keywordFieldList: [{ text: '名称', value: 'name' }],
  keywordPlaceholder: '搜索名称',
});
assert.strictEqual(pcListResult.meta.columnsSource, 'columns');
assert.strictEqual(pcListResult.collectionChildren.length, 1);

const mobileListResult = compileListView({
  semantic: {},
  view: listView,
  fields,
  target: 'mobile',
  layout: { list: { cols: 2 } },
  component: 'List',
  listLayout: 'card',
});
assert.strictEqual(mobileListResult.collection.component, 'List');
assert.strictEqual(mobileListResult.meta.columnsSource, 'mobileColumns');
assert.deepStrictEqual(mobileListResult.collection.props.headers, [
  { text: '名称', value: 'name', width: 180, isTitle: true, isSimpleMode: true },
  { text: '备注', value: 'remark', span: 2, isSimpleMode: true },
]);
assert.strictEqual(mobileListResult.collection.props.mobileItemAction, 'update');
assert.strictEqual(mobileListResult.collection.props.cols, 2);
assert.strictEqual(mobileListResult.collection.props.headActionList, undefined);
assert.deepStrictEqual(mobileListResult.mobileToolbarActions, [{ label: '新增', uiAction: 'create' }]);
assert.deepStrictEqual(mobileListResult.mobileSearch, {
  key: 'demoSearch',
  buttonLabel: '筛选',
  buttonClass: '!rounded-xl px-2 border border-solid border-gray-300',
  icon: 'filter-2',
  title: '筛选记录',
  sheet: { persistent: true },
});

const layout = {
  create: { cols: 3, variants: { pc: { remark: { span: 2 } } } },
  update: { cols: 2, variants: { pc: { status: { span: 2 } } } },
};
const createResult = compileCreateView({
  semantic: { slots: { create: { pc: { children: '<template v-slot:append>create</template>' } } } },
  view: {
    title: '新建记录',
    fields: ['name', 'remark'],
    fieldAttrs: { remark: { rows: 4 } },
    actions: [{ label: '保存', uiAction: 'createItem' }],
    beforeCloseConfirm: true,
  },
  fields,
  target: 'pc',
  layout,
  component: 'CreateDrawer',
});
assert.deepStrictEqual(createResult, {
  component: 'CreateDrawer',
  title: '新建记录',
  fieldList: [
    { key: 'name', label: '名称', type: 'text', span: 1 },
    { key: 'remark', label: '备注', type: 'textarea', attrs: { rows: 4 }, span: 2 },
  ],
  actions: [{ label: '保存', uiAction: 'createItem' }],
  sheet: undefined,
  saveTipBeforeClose: true,
  cols: 3,
  children: ['<template v-slot:append>create</template>'],
});

const updateResult = compileUpdateView({
  semantic: {
    slots: {
      update: {
        base: { pc: { children: '<template v-slot:base>base</template>' } },
      },
    },
  },
  view: {
    title: '编辑记录',
    tabs: [{
      key: 'base',
      title: '基础信息',
      fields: ['name', 'status'],
      actions: [{ label: '保存', uiAction: 'updateItem' }],
    }],
  },
  fields,
  target: 'pc',
  layout,
  component: 'UpdateDrawer',
});
assert.strictEqual(updateResult.payload.mode, 'tabs');
assert.deepStrictEqual(updateResult.payload.tabList[0], {
  key: 'base',
  title: '基础信息',
  fieldList: [
    { key: 'name', label: '名称', type: 'text', span: 1 },
    {
      key: 'status',
      label: '状态',
      type: 'select',
      options: [{ text: '启用', value: 'active' }],
      span: 2,
    },
  ],
  actions: [{ label: '保存', uiAction: 'updateItem' }],
});
assert.deepStrictEqual(updateResult.children, ['<template v-slot:base>base</template>']);

const baseSemantic = {
  mode: 'crud',
  page: { id: 'compileViewsTest', title: '映射测试' },
  fields,
  dataSource: { table: 'demo', listResource: 'getDemoList' },
  views: {
    list: listView,
    create: { fields: ['name'] },
    update: { fields: ['name'] },
  },
};
const pcPage = expandCrudPage({ ...baseSemantic, targetPlatform: 'pc' });
const mobilePage = expandCrudPage({ ...baseSemantic, targetPlatform: 'mobile' });
assert.strictEqual(pcPage.pageContent.children.find(node => node.component === 'Table').component, 'Table');
assert.strictEqual(mobilePage.pageContent.children.find(node => node.component === 'List').component, 'List');
assert.strictEqual(pcPage.actionContent.find(node => node.key === 'create').component, 'CreateDrawer');
assert.strictEqual(mobilePage.actionContent.find(node => node.key === 'create').component, 'FormSheet');
assert.strictEqual(mobilePage.actionContent.find(node => node.component === 'SearchSheet').key, 'demoSearch');
assert.strictEqual(
  mobilePage.pageContent.children[0].children.find(node => node.component === 'MobileFilterBtn').props.label,
  '筛选',
);

console.log('v7 semantic view compilers ok');
