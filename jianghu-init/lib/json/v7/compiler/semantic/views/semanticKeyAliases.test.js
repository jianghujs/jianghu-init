'use strict';

const assert = require('assert');
const { normalizeSchema } = require('../normalizeSchema');
const { normalizeSemanticViewKeys } = require('./semanticKeyAliases');
const { buildPage } = require('../../../index');

const rowActionList = [{ label: '编辑', uiAction: 'update' }];
const input = {
  version: 'v7',
  mode: 'crud',
  page: { id: 'semanticAliasTest' },
  fields: { name: { label: '名称' } },
  dataSource: { table: 'demo' },
  views: {
    list: {
      columns: ['name'],
      actionList: rowActionList,
      toolbarList: [{ label: '新增', uiAction: 'create' }],
    },
    create: {
      fieldList: ['name'],
      submitActions: [{ label: '保存', uiAction: 'createItem' }],
    },
    update: {
      fieldList: ['name'],
      formActions: [{ label: '保存', uiAction: 'updateItem' }],
    },
  },
};

const normalized = normalizeSchema(input);
assert.notStrictEqual(normalized, input, 'normalizeSchema returns a new semantic object');
assert.deepStrictEqual(input.views.list.actionList, rowActionList, 'normalization does not mutate source views');
assert.strictEqual(normalized.views.list.actionList, undefined, 'list alias is removed');
assert.deepStrictEqual(normalized.views.list.rowActions, rowActionList, 'list alias maps to canonical key');
assert.strictEqual(normalized.views.create.fieldList, undefined, 'create alias is removed');
assert.deepStrictEqual(normalized.views.create.fields, ['name'], 'create fieldList maps to fields');
assert.deepStrictEqual(normalized.views.update.actions, [{ label: '保存', uiAction: 'updateItem' }]);

const sameValue = normalizeSemanticViewKeys({
  views: {
    create: {
      fields: ['name'],
      fieldList: ['name'],
    },
  },
});
assert.deepStrictEqual(sameValue.views.create, { fields: ['name'] }, 'equal alias is collapsed');

assert.throws(
  () => normalizeSemanticViewKeys({
    views: {
      create: {
        fields: ['name'],
        fieldList: ['status'],
      },
    },
  }),
  /views\.create.*fieldList.*fields.*值不同/,
  'different alias and canonical values must fail',
);

assert.doesNotThrow(() => buildPage(input), 'valid alias actions compile after normalization');

const invalidAliasAction = {
  ...input,
  views: {
    ...input.views,
    list: {
      columns: ['name'],
      actionList: [{ label: '编辑', intent: 'update' }],
    },
  },
};
assert.throws(
  () => buildPage(invalidAliasAction),
  /views\.list\.rowActions\[0\].*uiAction 替代 intent/,
  'alias actions must not bypass canonical action validation',
);

console.log('v7 semantic key aliases ok');
