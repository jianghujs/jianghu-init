'use strict';

const {
  normalizeAction,
  normalizeActionList,
  validateActionUiActionSyntax,
} = require('./actionIntent');

let failed = 0;
const assert = (cond, msg) => {
  if (!cond) {
    console.error('FAIL:', msg);
    failed += 1;
  }
};

assert(normalizeAction({ uiAction: 'create', label: '新增' }, 'toolbar', 't').uiAction === 'create', 'toolbar create uiAction');
assert(normalizeAction({ uiAction: 'create', label: '新增' }, 'toolbar', 't').id === undefined, 'no id field');
assert(normalizeAction({ uiAction: 'update', label: '编辑' }, 'row', 'r').uiAction === 'update', 'row update uiAction');
assert(normalizeAction({ intent: 'create', label: '新增' }, 'toolbar', 't').uiAction === 'create', 'legacy intent → uiAction');
assert(normalizeAction({ intent: 'createItem', label: '保存' }, 'formCreate', 'c').uiAction === 'createItem', 'createItem stays createItem');
assert(normalizeAction({ intent: 'createItem', label: '保存' }, 'formCreate', 'c').id === undefined, 'createItem not split to save+id');
assert(normalizeAction({ uiAction: 'doBatchX', label: '批' }, 'toolbar', 'l').uiAction === 'doBatchX', 'custom uiAction');
assert(!normalizeAction({ intent: 'create', label: 'x' }, 'toolbar', 't').intent, 'intent stripped from output');

const rowVis = normalizeAction(
  { uiAction: 'delete', label: '删', visibleWhen: 'item.id !== -1' },
  'row',
  'row',
);
assert(rowVis.visibleWhen && rowVis.visibleWhen.__expr__ === 'item.id !== -1', 'row visibleWhen __expr__');

validateActionUiActionSyntax({
  mode: 'crud',
  views: {
    list: { toolbarActions: [{ uiAction: 'create', label: '新增' }] },
  },
});

assert(normalizeActionList([{ uiAction: 'delete', label: '删' }], 'row', 'rows').length === 1, 'list normalize');

try {
  normalizeAction({ uiAction: 'delete' }, 'row', 'row');
  assert(false, 'missing label should throw');
} catch (err) {
  assert(/缺少 label/.test(err.message), 'missing label error');
}

try {
  validateActionUiActionSyntax({
    mode: 'crud',
    views: {
      list: { rowActions: [{ uiAction: 'delete' }] },
    },
  });
  assert(false, 'syntax missing label should throw');
} catch (err) {
  assert(/缺少 label/.test(err.message), 'syntax missing label error');
}

if (failed) {
  process.exit(1);
}
console.log('actionIntent + whenExpr unit ok');
