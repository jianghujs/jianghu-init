'use strict';

const assert = require('assert');
const { parseSchema } = require('./schemaPipeline');
const { COMPONENT_DESCRIPTORS, COMPONENT_TAG_MAP } = require('./componentDescriptors');
const { SCHEMA_TO_VUE_TAG } = require('../../semantic-mapping');

const parseNode = node => {
  const { standardConfig } = parseSchema({
    version: 'v7',
    page: { id: 'runtimeDescriptorTest' },
    pageContent: [node],
    actionContent: [],
  });
  return standardConfig.pageContent[0];
};

const customNode = parseNode({
  component: 'CustomWidget',
  props: {
    title: '静态标题',
    titleBind: 'dynamicTitle',
    valueBind: 'formValue',
  },
});
assert.strictEqual(customNode.resolvedBindings[':title'], 'dynamicTitle');
assert.strictEqual(customNode.resolvedBindings[':value'], 'formValue');
assert.strictEqual(customNode.resolvedProps.title, undefined);
assert.strictEqual(customNode.resolvedProps.titleBind, undefined);
assert.strictEqual(customNode.resolvedProps.valueBind, undefined);

const tableNode = parseNode({
  component: 'Table',
  props: {
    headersBinding: 'preferredHeaders',
    columnsBinding: 'legacyHeaders',
    headers: [{ text: '名称', value: 'name' }],
  },
});
assert.strictEqual(tableNode.resolvedBindings[':headers'], 'preferredHeaders');
assert.strictEqual(tableNode.resolvedProps.headersBinding, undefined);
assert.strictEqual(tableNode.resolvedProps.columnsBinding, undefined);
assert.strictEqual(tableNode.resolvedProps.headers, undefined);
assert.strictEqual(tableNode.resolvedProps.columns, undefined);

const legacyTableNode = parseNode({
  component: 'Table',
  props: { columnsBinding: 'legacyHeaders' },
});
assert.strictEqual(legacyTableNode.resolvedBindings[':headers'], 'legacyHeaders');
assert.strictEqual(legacyTableNode.resolvedProps.columnsBinding, undefined);

for (const componentName of Object.keys(COMPONENT_DESCRIPTORS)) {
  assert.strictEqual(
    SCHEMA_TO_VUE_TAG[componentName],
    COMPONENT_TAG_MAP[componentName],
    `${componentName} tag mapping should come from component descriptors`,
  );
}

console.log('runtime descriptor rule applicator tests passed');
