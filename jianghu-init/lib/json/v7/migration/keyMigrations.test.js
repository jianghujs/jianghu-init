'use strict';

const assert = require('assert');
const { normalizeSchema } = require('../compiler/semantic/normalizeSchema');
const {
  resolveRuntimePropAliases,
  SEMANTIC_STRUCTURAL_MIGRATIONS,
  fieldStructuralGroups,
} = require('./keyMigrations');

const groups = fieldStructuralGroups();
assert.ok(groups.column.some(item => item.from === 'width'));
assert.ok(groups.form.some(item => item.from === 'required'));
assert.ok(!groups.form.some(item => item.from === 'pc'), 'pc/mobile handled separately');

const normalized = normalizeSchema({
  version: 'v7',
  views: { list: { columnList: ['name'] } },
  fields: { name: { label: '名称', width: 100, required: true } },
});
assert.ok(normalized.fields.name.column.width === 100);
assert.ok(normalized.fields.name.form.required === true);

assert.deepStrictEqual(resolveRuntimePropAliases('FormSheet'), {
  fields: 'fieldList',
  headActionList: 'actionList',
  shown: 'value',
});
assert.deepStrictEqual(resolveRuntimePropAliases('Table'), {
  toolbarActionList: 'headActionList',
  columns: 'headers',
});

const { applyPropPreprocess } = require('../compiler/runtime/descriptorRuleApplicators');
const { resolveDescriptor } = require('../compiler/runtime/componentDescriptors');

const diagnostics = [];
const rawProps = {
  columns: [{ text: '名称', value: 'name' }],
  toolbarActionList: [{ label: '新增', uiAction: 'create' }],
};
const { desc } = resolveDescriptor('Table');
applyPropPreprocess(rawProps, desc, { diagnostics, path: 'pageContent[0].props' });

assert.deepStrictEqual(rawProps.headers, [{ text: '名称', value: 'name' }]);
assert.strictEqual(rawProps.columns, undefined);
assert.ok(Array.isArray(rawProps.headActionList));
assert.strictEqual(rawProps.toolbarActionList, undefined);
assert.ok(diagnostics.some(item => item.path.endsWith('.columns')));
assert.ok(diagnostics.some(item => item.path.endsWith('.toolbarActionList')));

assert.strictEqual(
  SEMANTIC_STRUCTURAL_MIGRATIONS.listIntoSearch.find(item => item.from === 'mobileSearchKey').to,
  '内部稳定 key',
);

console.log('v7 key migrations consolidation ok');
