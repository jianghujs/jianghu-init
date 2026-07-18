'use strict';

/**
 * views.*.mobileSheet / views.list.search.mobileSheet → Sheet 族组件 props（不含 Drawer）
 *
 * | 语义 (views.*.mobileSheet) | → props |
 * | maxBodyHeight | 内容区最大高度；FormSheet 默认按端布局计算，SearchSheet 默认 70vh |
 * | bodyHeightMode | 默认 fill（填满 maxBodyHeight）；content：内容撑开。SearchSheet 默认 content |
 * | persistent | 点外侧不关闭 → v-bottom-sheet |
 * | beforeCloseConfirm | FormSheet 关前脏检测 |
 */

const FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_SINGLE = 102;
const FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_TABS = 152;
const SEARCH_SHEET_DEFAULT_MAX_BODY_HEIGHT = '70vh';

const isPlainObject = v => v && typeof v === 'object' && !Array.isArray(v);

const resolveDefaultViewportOffset = tabCount => {
  return tabCount > 1
    ? FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_TABS
    : FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_SINGLE;
};

/**
 * @param {object|null|undefined} sheetView canonical mobileSheet 配置
 * @param {{ preset?: 'form'|'search', tabCount?: number }} opts
 * @returns {object} 合并进 actionContent 节点 props
 */
const mergeSheetOverlayProps = (sheetView, opts = {}) => {
  const { preset = 'form', tabCount = 1 } = opts;
  const view = isPlainObject(sheetView) ? sheetView : {};
  const props = {};

  if (view.persistent != null) props.persistent = !!view.persistent;
  if (view.rounded != null) props.rounded = !!view.rounded;
  if (view.bodyClass != null) props.bodyClass = view.bodyClass;
  if (view.hiddenBtn != null) props.hiddenBtn = !!view.hiddenBtn;
  if (view.minCardHeight != null && view.minCardHeight !== '') {
    props.minCardHeight = String(view.minCardHeight);
  }

  if (preset === 'form') {
    const viewportOffset = resolveDefaultViewportOffset(tabCount);
    props.maxBodyHeight = (view.maxBodyHeight != null && view.maxBodyHeight !== '')
      ? String(view.maxBodyHeight)
      : `calc(100vh - ${viewportOffset}px)`;
    props.bodyHeightMode = view.bodyHeightMode === 'content' || view.bodyHeightMode === 'fill'
      ? view.bodyHeightMode
      : 'fill';
    if (view.beforeCloseConfirm != null) {
      props.beforeCloseConfirm = !!view.beforeCloseConfirm;
      if (props.persistent == null && props.beforeCloseConfirm) props.persistent = true;
    }
    return props;
  }

  if (preset === 'search') {
    props.maxBodyHeight = (view.maxBodyHeight != null && view.maxBodyHeight !== '')
      ? String(view.maxBodyHeight)
      : SEARCH_SHEET_DEFAULT_MAX_BODY_HEIGHT;
    props.bodyHeightMode = view.bodyHeightMode === 'fill' ? 'fill' : 'content';
    return props;
  }

  if (view.maxBodyHeight != null && view.maxBodyHeight !== '') {
    props.maxBodyHeight = String(view.maxBodyHeight);
  }
  if (view.bodyHeightMode === 'content' || view.bodyHeightMode === 'fill') {
    props.bodyHeightMode = view.bodyHeightMode;
  }
  return props;
};

module.exports = {
  mergeSheetOverlayProps,
  FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_SINGLE,
  FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_TABS,
  SEARCH_SHEET_DEFAULT_MAX_BODY_HEIGHT,
};
