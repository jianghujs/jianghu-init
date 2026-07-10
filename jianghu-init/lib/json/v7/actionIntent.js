'use strict';

const { wrapActionConditions } = require('./whenExpr');

const STRUCTURAL_TYPES = new Set(['spacer', 'slot', 'filter']);

/**
 * 读取 uiAction 值（生成兼容：uiAction > intent > id > actionId）
 */
const readUiActionValue = raw => {
  if (!raw || typeof raw !== 'object') return '';
  if (raw.uiAction != null && raw.uiAction !== '') return String(raw.uiAction).trim();
  if (raw.intent != null && raw.intent !== '') return String(raw.intent).trim();
  if (raw.id != null && raw.id !== '') return String(raw.id).trim();
  if (raw.actionId != null && raw.actionId !== '') return String(raw.actionId).trim();
  return '';
};

const isStructuralAction = raw =>
  !!(raw && raw.type && STRUCTURAL_TYPES.has(raw.type));

/**
 * 规范化 action：uiAction 为 intent 的全局替代（1:1），不拆出 id 字段。
 * 标准 token（create/delete/save…）与 doUiAction 方法名的映射在运行时 resolveDoUiActionId 完成。
 */
const normalizeAction = (raw, role, loc) => {
  if (raw == null) return raw;
  if (typeof raw === 'string') {
    throw new Error(`v7 ${loc}: action 须为对象，字符串 token 请先经 mapToolbarToken/mapRowToken 转换`);
  }
  if (typeof raw !== 'object') {
    throw new Error(`v7 ${loc}: action 须为对象`);
  }
  if (isStructuralAction(raw)) return raw;

  const uiActionRaw = readUiActionValue(raw);
  if (!uiActionRaw) {
    throw new Error(`v7 ${loc}: action 缺少 uiAction（标准 token 或 doUiAction 方法名；旧 intent 仍可读）`);
  }
  if (raw.label == null || String(raw.label).trim() === '') {
    throw new Error(`v7 ${loc}: action 缺少 label`);
  }

  const out = { ...raw };
  out.uiAction = uiActionRaw;
  delete out.intent;
  delete out.actionId;
  delete out.id;
  return wrapActionConditions(out);
};

const normalizeActionList = (list, role, loc) => {
  if (!Array.isArray(list)) return list;
  return list.map((item, i) => normalizeAction(item, role, `${loc}[${i}]`));
};

/** 收集 CRUD 语义里所有 action 项 */
const collectSemanticActions = semantic => {
  const out = [];
  const views = semantic && semantic.views;
  if (!views || typeof views !== 'object') return out;

  const pushList = (list, role, loc) => {
    if (!Array.isArray(list)) return;
    list.forEach((item, i) => {
      if (isStructuralAction(item)) return;
      out.push({ action: item, role, loc: `${loc}[${i}]` });
    });
  };

  if (views.list && typeof views.list === 'object') {
    pushList(views.list.toolbarActions, 'toolbar', 'views.list.toolbarActions');
    pushList(views.list.rowActions, 'row', 'views.list.rowActions');
  }
  if (views.create && typeof views.create === 'object') {
    pushList(views.create.actions, 'formCreate', 'views.create.actions');
  }
  if (views.update && typeof views.update === 'object') {
    pushList(views.update.actions, 'formUpdate', 'views.update.actions');
    if (Array.isArray(views.update.tabs)) {
      views.update.tabs.forEach(tab => {
        if (!tab || typeof tab !== 'object') return;
        const tabKey = tab.key || 'tab';
        pushList(tab.actions, 'formUpdate', `views.update.tabs.${tabKey}.actions`);
      });
    }
  }
  return out;
};

/**
 * 语法校验：action 必须使用 uiAction 键（禁止仅写 intent）
 * 生成仍可通过 normalizeAction 读 intent 兼容旧页
 */
const validateActionUiActionSyntax = semantic => {
  for (const { action, loc } of collectSemanticActions(semantic)) {
    if (!action || typeof action !== 'object') continue;
    const hasUiAction = Object.prototype.hasOwnProperty.call(action, 'uiAction')
      && action.uiAction != null && String(action.uiAction).trim() !== '';
    const hasIntent = Object.prototype.hasOwnProperty.call(action, 'intent');
    if (!hasUiAction && hasIntent) {
      throw new Error(
        `v7 ${loc}: 请改用 uiAction 替代 intent（intent 仅作生成兼容，语法校验不再接受）`,
      );
    }
    if (!hasUiAction) {
      throw new Error(`v7 ${loc}: action 缺少 uiAction（对应 doUiAction 的标准 token 或方法名）`);
    }
    if (!Object.prototype.hasOwnProperty.call(action, 'label') || action.label == null || String(action.label).trim() === '') {
      throw new Error(`v7 ${loc}: action 缺少 label`);
    }
  }
};

module.exports = {
  readUiActionValue,
  normalizeAction,
  normalizeActionList,
  collectSemanticActions,
  validateActionUiActionSyntax,
};
