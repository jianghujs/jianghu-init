'use strict';

const nunjucksMixin = require('./nunjucks_mixin');

const env = nunjucksMixin.handleNunjucksEnv(__dirname);
const vueBindAttrValue = env.getFilter('vueBindAttrValue');

let failed = 0;
const assert = (cond, msg) => {
  if (!cond) {
    console.error('FAIL:', msg);
    failed += 1;
  }
};

const rowActions = [{
  label: '删除',
  visibleWhen: { __expr__: 'item.id !== -1' },
  uiAction: 'delete',
}];
const serialized = vueBindAttrValue(rowActions);
assert(
  serialized.includes('visibleWhen:{__expr__:'),
  'row visibleWhen with item stays as deferred __expr__ object',
);
assert(
  !serialized.includes('visibleWhen:item.'),
  'row visibleWhen must not unwrap item into Vue bind scope',
);

const toolbarActions = [{
  label: '导出',
  visibleWhen: { __expr__: '!isProxyJournalDrawerShown' },
  uiAction: 'export',
}];
const toolbarSerialized = vueBindAttrValue(toolbarActions);
assert(
  toolbarSerialized.includes('visibleWhen:!isProxyJournalDrawerShown'),
  'toolbar visibleWhen still unwraps page-scope __expr__',
);

if (failed) process.exit(1);
console.log('nunjucks_mixin vueBindAttrValue ok');
