'use strict';

const assert = require('assert');
const Module = require('module');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Validator 的纯规则函数不依赖 VSCode API；测试环境仅绕过模块加载。
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === 'vscode') return { CodeActionKind: { QuickFix: 'quickfix' } };
  return originalLoad.call(this, request, parent, isMain);
};
const { collectV7DeprecatedKeys } = require('../out/validators/jianghuSchemaValidator');
const {
  V7_PATH_DOCS,
  lookupDoc,
  scanInlineObjectAncestors,
} = require('../out/v7ConfigHoverProvider');
Module._load = originalLoad;

const canonical = {
  version: 'v7',
  mode: 'crud',
  page: { id: 'demo', template: { pc: 'jh-page-v7' } },
  dataSource: { table: 'demo' },
  fields: {
    name: { label: '名称', type: 'text', column: { width: 160 }, form: { required: true } },
  },
  views: {
    list: {
      columnList: ['name'],
      headActionList: [{ label: '新增', uiAction: 'create' }],
      rowActionList: [{ label: '编辑', uiAction: 'update' }],
      search: { fieldList: ['name'] },
    },
    create: { fieldList: ['name'], actionList: [{ label: '保存', uiAction: 'create' }] },
  },
};
assert.deepStrictEqual(collectV7DeprecatedKeys(canonical), []);

const inlineColumnAncestors = scanInlineObjectAncestors(
  "    coursewareName: { label: '教材', type: 'text', column: { ",
);
const inlineColumnWidthDoc = lookupDoc('width', [...inlineColumnAncestors, 'fields'], null);
assert.deepStrictEqual(inlineColumnAncestors, ['column', 'coursewareName']);
assert.strictEqual(inlineColumnWidthDoc, V7_PATH_DOCS['column|width']);
assert.notStrictEqual(inlineColumnWidthDoc.deprecated, true, 'column.width must not be deprecated');

const legacy = {
  ...canonical,
  page: { id: 'demo', template: 'jh-page-v7' },
  includeList: [{ type: 'html', path: 'x.html', target: 'pc' }],
  fields: { name: { label: '名称', type: 'text', width: 160, required: true } },
  views: {
    list: { columns: ['name'], toolbarActions: [], search: { fields: ['name'] } },
    create: { fields: ['name'], actions: [], sheet: { autoHeight: true } },
  },
  actionContent: [{ component: 'FormSheet', props: {
    shown: false,
    headActionList: [{ label: '保存', actionId: 'create' }],
  } }],
};
const warningKeys = collectV7DeprecatedKeys(legacy).map(item => `${item.property}->${item.replacement}`);
for (const expected of [
  'template->template.{pc,mobile}', 'target->targets', 'width->column.width',
  'required->form.required', 'columns->columnList', 'toolbarActions->headActionList',
  'fields->fieldList', 'actions->actionList', 'sheet->mobileSheet',
  'autoHeight->bodyHeightMode', 'shown->value', 'headActionList->actionList',
  'actionId->uiAction',
]) {
  assert.ok(warningKeys.includes(expected), `missing warning: ${expected}`);
}

const ajv = new Ajv({ allErrors: true, strict: false, logger: false });
addFormats(ajv);
ajv.addSchema(require('../src/schemas/components/resource-list.schema.json'));
ajv.addSchema(require('../src/schemas/components/include-list.schema.json'));
const validateV7 = ajv.compile(require('../src/schemas/v7/jianghu-config-v7.schema.json'));
assert.strictEqual(validateV7(canonical), true, JSON.stringify(validateV7.errors));

const missingLabel = JSON.parse(JSON.stringify(canonical));
missingLabel.views.list.rowActionList = [{ uiAction: 'update' }];
assert.strictEqual(validateV7(missingLabel), false, 'action without label must fail');

const missingUiAction = JSON.parse(JSON.stringify(canonical));
missingUiAction.views.list.rowActionList = [{ label: '编辑' }];
assert.strictEqual(validateV7(missingUiAction), false, 'action without uiAction must fail');

const oldContainerMissingUiAction = JSON.parse(JSON.stringify(canonical));
delete oldContainerMissingUiAction.views.list.rowActionList;
oldContainerMissingUiAction.views.list.rowActions = [{ label: '编辑' }];
assert.strictEqual(validateV7(oldContainerMissingUiAction), false, 'deprecated action container must not relax action item validation');

const requiredHoverExamplePathList = [
  'page',
  'dataSource',
  'fields',
  'fields|column',
  'fields|form',
  'views',
  'views|list',
  'views|create',
  'views|update',
  'list|columnList',
  'list|mobileColumnList',
  'list|search',
  'list|filter',
  'list|headActionList',
  'list|rowActionList',
  'list|orderBy',
  'search|keyword',
  'search|fieldList',
  'search|mobileSheet',
  'create|fieldList',
  'create|actionList',
  'create|mobileSheet',
  'update|fieldList',
  'update|tabList',
  'update|actionList',
  'update|mobileSheet',
  'interaction',
  'platform',
  'layout',
  'slots',
  'common',
  'includeList',
  'includeList|targets',
  'resourceList',
];
for (const docPath of requiredHoverExamplePathList) {
  assert.ok(V7_PATH_DOCS[docPath], `missing hover doc: ${docPath}`);
  assert.ok(V7_PATH_DOCS[docPath].example, `missing hover example: ${docPath}`);
}

const canonicalHoverExamples = requiredHoverExamplePathList
  .map(docPath => V7_PATH_DOCS[docPath].example)
  .join('\n');
for (const forbiddenPattern of [
  /\bcolumns\s*:/,
  /\bmobileColumns\s*:/,
  /\btoolbarActions\s*:/,
  /\browActions\s*:/,
  /\bactions\s*:/,
  /\btabs\s*:/,
  /\bsearchSheet\s*:/,
  /\btarget\s*:/,
  /\bautoHeight\s*:/,
  /\bviewportOffset\s*:/,
  /\bbodyHeight\s*:/,
]) {
  assert.ok(!forbiddenPattern.test(canonicalHoverExamples), `legacy key in hover example: ${forbiddenPattern}`);
}

for (const actionDocPath of [
  'list|headActionList',
  'list|rowActionList',
  'create|actionList',
  'update|actionList',
]) {
  assert.match(V7_PATH_DOCS[actionDocPath].example, /\blabel\s*:/, `${actionDocPath} example missing label`);
  assert.match(V7_PATH_DOCS[actionDocPath].example, /\buiAction\s*:/, `${actionDocPath} example missing uiAction`);
}

// Hover 只文档化 canonical key；旧 key 迁移提示由 CLI / IDE diagnostic 负责。
for (const doc of Object.values(V7_PATH_DOCS)) {
  assert.notStrictEqual(doc.deprecated, true, 'hover docs must not document deprecated keys');
}

console.log('v7 vscode migration validation ok');
