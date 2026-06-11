'use strict';

/**
 * Schema 组件名规范化：platform token / legacy tag → 解析流水线使用的 canonical 名
 *
 * | 输入 | → canonical |
 * | CreateSheet / UpdateSheet | FormSheet |
 * | tag: jh-form-sheet | FormSheet |
 * | component / tag 二选一 | 与 expandCrudPage resolveViewFormComponent 对齐 |
 */

const LEGACY_TAG_TO_COMPONENT = {
  'jh-create-drawer': 'CreateDrawer',
  'jh-update-drawer': 'UpdateDrawer',
  'jh-form-sheet': 'FormSheet',
  'jh-sheet': 'Sheet',
  'jh-mobile-search-sheet': 'SearchSheet',
  'jh-form-drawer': 'FormDrawer',
  'jh-drawer': 'Drawer',
};

/** platform token → Schema 组件名（与 policy.js FORM_COMPONENT_TOKEN 一致） */
const SCHEMA_COMPONENT_ALIASES = {
  CreateSheet: 'FormSheet',
  UpdateSheet: 'FormSheet',
};

const normalizeSchemaComponentName = raw => {
  if (!raw || typeof raw !== 'string') return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  const fromTag = LEGACY_TAG_TO_COMPONENT[trimmed] || trimmed;
  return SCHEMA_COMPONENT_ALIASES[fromTag] || fromTag;
};

/** 从 pageContent / actionContent 节点读取并规范化 component */
const resolveSchemaComponentName = node => {
  if (!node || typeof node !== 'object') return '';
  const raw = node.component || node.tag || '';
  return normalizeSchemaComponentName(raw);
};

module.exports = {
  LEGACY_TAG_TO_COMPONENT,
  SCHEMA_COMPONENT_ALIASES,
  normalizeSchemaComponentName,
  resolveSchemaComponentName,
};
