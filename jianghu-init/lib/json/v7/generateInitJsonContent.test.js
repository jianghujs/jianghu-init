'use strict';

const assert = require('assert');
const v7 = require('./index');
const { buildV7CrudContent } = require('./generateInitJsonContent');

const columns = [
  { COLUMN_NAME: 'id', COLUMN_COMMENT: '自增ID', DATA_TYPE: 'bigint' },
  { COLUMN_NAME: 'projectId', COLUMN_COMMENT: '项目ID', DATA_TYPE: 'varchar' },
  { COLUMN_NAME: 'projectName', COLUMN_COMMENT: '项目名称', DATA_TYPE: 'varchar' },
  { COLUMN_NAME: 'projectType', COLUMN_COMMENT: '项目类型', DATA_TYPE: 'varchar' },
  { COLUMN_NAME: 'status', COLUMN_COMMENT: '状态', DATA_TYPE: 'varchar' },
  { COLUMN_NAME: 'sort', COLUMN_COMMENT: '排序', DATA_TYPE: 'int' },
  { COLUMN_NAME: 'operationAt', COLUMN_COMMENT: '操作时间', DATA_TYPE: 'datetime' },
];

const loadGeneratedContent = source => {
  const generatedModule = { exports: {} };
  new Function('module', source)(generatedModule);
  return generatedModule.exports;
};

const assertCanonicalActions = semantic => {
  const actionLists = [
    semantic.views.list.headActionList,
    semantic.views.list.rowActionList,
    semantic.views.create.actionList,
    semantic.views.update.actionList,
  ];
  for (const action of actionLists.flat()) {
    assert.strictEqual(typeof action.label, 'string');
    assert(action.label.trim());
    assert.strictEqual(typeof action.uiAction, 'string');
    assert(action.uiAction.trim());
    assert(!Object.prototype.hasOwnProperty.call(action, 'intent'));
    assert(!Object.prototype.hasOwnProperty.call(action, 'actionId'));
  }
};

const assertCanonicalViewKeys = semantic => {
  const list = semantic.views.list;
  assert(Array.isArray(list.columnList));
  assert(Array.isArray(list.mobileColumnList));
  assert(Array.isArray(list.headActionList));
  assert(Array.isArray(list.rowActionList));
  assert(Array.isArray(list.search.fieldList));
  assert(!Object.prototype.hasOwnProperty.call(list, 'columns'));
  assert(!Object.prototype.hasOwnProperty.call(list, 'mobileColumns'));
  assert(!Object.prototype.hasOwnProperty.call(list, 'toolbarActions'));
  assert(!Object.prototype.hasOwnProperty.call(list, 'rowActions'));

  for (const viewName of ['create', 'update']) {
    const view = semantic.views[viewName];
    assert(Array.isArray(view.fieldList));
    assert(Array.isArray(view.actionList));
    assert.strictEqual(view.beforeCloseConfirm, true);
    assert(!Object.prototype.hasOwnProperty.call(view, 'fields'));
    assert(!Object.prototype.hasOwnProperty.call(view, 'actions'));
    assert(!Object.prototype.hasOwnProperty.call(view, 'saveTipBeforeClose'));
    assert(!Object.prototype.hasOwnProperty.call(view, 'sheet'));
  }
};

const buildGenerated = pageType => {
  const source = buildV7CrudContent({
    pageType,
    pageId: 'projectManagement',
    pageName: '项目管理',
    table: 'project',
    columns,
    componentPath: 'project/projectList',
  });
  return { source, semantic: loadGeneratedContent(source) };
};

for (const pageType of ['jh-page', 'jh-component']) {
  const { source, semantic } = buildGenerated(pageType);
  assert.strictEqual(semantic.version, 'v7');
  assert.strictEqual(semantic.mode, 'crud');
  assert.strictEqual(semantic.pageType, pageType);
  assert.strictEqual(semantic.dataSource.primaryKey, 'id');
  assert(!Object.prototype.hasOwnProperty.call(semantic.fields, 'id'));
  assert(!Object.prototype.hasOwnProperty.call(semantic.fields, 'operationAt'));
  assert.deepStrictEqual(semantic.fields.projectType.form.options, 'constantObj.projectType');
  assert.strictEqual(semantic.fields.projectType.search.op, 'eq');
  assertCanonicalViewKeys(semantic);
  assertCanonicalActions(semantic);
  assert(!source.includes('startCreateItem'));
  assert(!source.includes('startUpdateItem'));
  assert(!source.includes("uiAction: 'createItem'"));

  for (const targetPlatform of ['pc', 'mobile']) {
    const result = v7.buildPage(Object.assign({}, semantic, { targetPlatform }));
    assert(result.standardConfig.pageContent, `${pageType}/${targetPlatform} pageContent missing`);
  }

  if (pageType === 'jh-page') {
    assert.strictEqual(semantic.page.targets, 'both');
    assert.strictEqual(semantic.page.menu, true);
    assert(Array.isArray(semantic.resourceList));
    assert.strictEqual(typeof semantic.common.mounted, 'function');
    assert(semantic.includeList.every(item => Object.prototype.hasOwnProperty.call(item, 'targets')));
  } else {
    assert.strictEqual(semantic.component.targets, 'both');
    assert(!Object.prototype.hasOwnProperty.call(semantic, 'resourceList'));
    assert(!Object.prototype.hasOwnProperty.call(semantic.common, 'mounted'));
    assert.deepStrictEqual(semantic.common.props, {});
  }
}

console.log('v7 init-json content generation tests passed');
