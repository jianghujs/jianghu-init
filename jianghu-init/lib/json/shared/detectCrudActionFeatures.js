'use strict';

/** rowActionList / headActionList / toolbarActionList 项是否触发 deleteItem 流程 */
const isDeleteAction = action => {
  if (!action || typeof action !== 'object') return false;
  if (action.intent === 'delete') return true;
  const id = action.id || action.actionId || action.intent;
  if (id === 'deleteItem' || id === 'batchDeleteItem') return true;
  const click = action.click || (action.attrs && action.attrs['@click']);
  if (typeof click === 'string' && /doUiAction\(['"]deleteItem['"]/.test(click)) return true;
  return false;
};

/** 从 Table / List props 推断是否需要生成 deleteItem 原子方法与 doUiAction 链 */
const detectHasDelete = tableProps => {
  if (!tableProps || typeof tableProps !== 'object') return false;
  const lists = [
    tableProps.rowActionList,
    tableProps.headActionList,
    tableProps.toolbarActionList,
  ];
  return lists.some(list => Array.isArray(list) && list.some(isDeleteAction));
};

module.exports = { isDeleteAction, detectHasDelete };
