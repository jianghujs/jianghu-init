'use strict';

const { isDeleteAction, detectHasDelete } = require('./detectCrudActionFeatures');

let failed = 0;
const assert = (cond, msg) => {
  if (!cond) { console.error('FAIL:', msg); failed += 1; }
};

assert(isDeleteAction({ uiAction: 'delete' }), 'uiAction delete');
assert(isDeleteAction({ intent: 'delete' }), 'intent delete');
assert(isDeleteAction({ uiAction: 'deleteItem' }), 'uiAction deleteItem');
assert(!isDeleteAction({ uiAction: 'update' }), 'update not delete');
assert(detectHasDelete({ rowActionList: [{ uiAction: 'delete', label: '删' }] }), 'detect row uiAction delete');
assert(!detectHasDelete({ rowActionList: [{ uiAction: 'update' }] }), 'no delete action');

if (failed) process.exit(1);
console.log('detectCrudActionFeatures ok');
