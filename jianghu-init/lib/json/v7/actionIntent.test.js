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

assert(normalizeAction({ uiAction: 'create', label: '新增' }, 'toolbar', 't').id === 'startCreateItem', 'toolbar create → id');
assert(normalizeAction({ uiAction: 'update', label: '编辑' }, 'row', 'r').id === 'startUpdateItem', 'row update → id');
assert(normalizeAction({ intent: 'create', label: '新增' }, 'toolbar', 't').uiAction === 'create', 'legacy intent read');
assert(normalizeAction({ intent: 'create', label: '新增' }, 'toolbar', 't').id === 'startCreateItem', 'legacy intent → id');
assert(normalizeAction({ uiAction: 'create', label: '保存' }, 'formCreate', 'c').id === 'createItem', 'form create → id');
assert(normalizeAction({ uiAction: 'startCreateItem', label: '新增' }, 'toolbar', 'l').uiAction === 'create', 'legacy doUiAction name');
assert(normalizeAction({ uiAction: 'doBatchX', label: '批' }, 'toolbar', 'l').id === 'doBatchX', 'custom id');
assert(!normalizeAction({ intent: 'create', label: 'x' }, 'toolbar', 't').intent, 'intent stripped from output');

const rowVis = normalizeAction(
  { uiAction: 'delete', label: '删', visibleWhen: 'item.id !== -1' },
  'row',
  'row',
);
assert(rowVis.visibleWhen && rowVis.visibleWhen.__expr__ === 'item.id !== -1', 'row visibleWhen __expr__');

try {
  normalizeAction({ uiAction: 'update', label: 'x' }, 'toolbar', 'bad');
  assert(false, 'toolbar update should throw');
} catch (e) {
  assert(/不能用在 toolbar/.test(e.message), 'toolbar update error msg');
}

try {
  validateActionUiActionSyntax({
    mode: 'crud',
    views: {
      list: { toolbarActions: [{ intent: 'create', label: '新增' }] },
    },
  });
  assert(false, 'validate should reject intent-only');
} catch (e) {
  assert(/uiAction/.test(e.message), 'validate intent-only msg');
}

validateActionUiActionSyntax({
  mode: 'crud',
  views: {
    list: { toolbarActions: [{ uiAction: 'create', label: '新增' }] },
  },
});

assert(normalizeActionList([{ uiAction: 'delete', label: '删' }], 'row', 'rows').length === 1, 'list normalize');

if (failed) {
  process.exit(1);
}
console.log('actionIntent + whenExpr unit ok');
