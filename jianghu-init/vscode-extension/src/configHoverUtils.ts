/**
 * 从配置行解析 UI 组件类型（hover / completion 共用）。
 * 支持 v7 `component` 与 legacy `tag`（含 jh-create-drawer 等 Vue 标签名）。
 */
const COMPONENT_LINE_RE = /^(?:component|tag)\s*:\s*['"]([^'"]+)['"]/;

/** legacy pageContent / actionContent 的 tag → Schema component 名 */
const LEGACY_TAG_TO_COMPONENT: Record<string, string> = {
  'jh-create-drawer': 'CreateDrawer',
  'jh-update-drawer': 'UpdateDrawer',
  'jh-form-drawer': 'FormDrawer',
  'jh-sheet': 'Sheet',
  'jh-form-sheet': 'FormSheet',
  'jh-mobile-search-sheet': 'SearchSheet',
  'jh-table': 'Table',
  'jh-list': 'List',
  'jh-page-header': 'PageHeader',
  'jh-mobile-filter-btn': 'MobileFilterBtn',
  'jh-mobile-actions': 'MobileActions',
};

export const parseComponentTypeFromLine = (trimmed: string): string | null => {
  const m = trimmed.match(COMPONENT_LINE_RE);
  if (!m) return null;
  const raw = m[1];
  return LEGACY_TAG_TO_COMPONENT[raw] || raw;
};
