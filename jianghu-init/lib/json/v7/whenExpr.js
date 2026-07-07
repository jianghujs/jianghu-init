'use strict';

/** 字段 interaction */
const CONDITION_KEYS = ['readonlyWhen', 'visibleWhen', 'disabledWhen'];

/** 按钮 action 条件（含 loadingWhen） */
const ACTION_CONDITION_KEYS = ['visibleWhen', 'disabledWhen', 'loadingWhen'];

const wrapConditionExpr = val => (typeof val === 'string' ? { __expr__: val } : val);

/**
 * 将字符串条件包装为 __expr__（与 field interaction 同口径）
 */
const wrapActionConditions = action => {
  if (!action || typeof action !== 'object') return action;
  if (action.type === 'spacer' || action.type === 'slot' || action.type === 'filter') return action;
  const out = { ...action };
  for (const k of ACTION_CONDITION_KEYS) {
    if (out[k] !== undefined && typeof out[k] === 'string') {
      out[k] = wrapConditionExpr(out[k]);
    }
  }
  return out;
};

const applyFieldInteraction = (fieldList, interaction) => {
  if (!interaction || typeof interaction !== 'object') return fieldList;
  return fieldList.map(item => {
    const cond = interaction[item.key];
    if (!cond || typeof cond !== 'object') return item;
    const patch = {};
    for (const k of CONDITION_KEYS) {
      if (cond[k] !== undefined) patch[k] = wrapConditionExpr(cond[k]);
    }
    return Object.keys(patch).length ? { ...item, ...patch } : item;
  });
};

const markActionConditionsInPipeline = action => {
  if (!action || typeof action !== 'object') return action;
  const out = { ...action };
  for (const k of ACTION_CONDITION_KEYS) {
    const v = out[k];
    if (typeof v === 'string' && v.trim()) {
      out[k] = wrapConditionExpr(v);
    }
  }
  return out;
};

const markActionListConditions = list =>
  Array.isArray(list) ? list.map(markActionConditionsInPipeline) : list;

module.exports = {
  CONDITION_KEYS,
  ACTION_CONDITION_KEYS,
  wrapConditionExpr,
  wrapActionConditions,
  applyFieldInteraction,
  markActionConditionsInPipeline,
  markActionListConditions,
};
