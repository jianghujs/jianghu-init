'use strict';

/**
 * views.*.sheet / views.list.searchSheet → Sheet 族组件 props（不含 Drawer）
 *
 * | 语义 (views.*.sheet) | → props |
 * | autoHeight | FormSheet autoHeight（create/update 默认 true） |
 * | viewportOffset | FormSheet calc(100vh - Npx) 扣减（单 tab 102，多 tab 152） |
 * | maxBodyHeight / bodyHeight | 覆盖 calc，如 '70vh' |
 * | minCardHeight | jh-sheet 卡片 min-h（默认 100px） |
 * | persistent | 点外侧不关闭 → v-bottom-sheet |
 * | rounded | 顶部圆角 |
 * | beforeCloseConfirm | FormSheet 关前脏检测（create 亦可用 saveTipBeforeClose） |
 */

const FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_SINGLE = 102;
const FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_TABS = 152;
const SEARCH_SHEET_DEFAULT_MAX_BODY_HEIGHT = '70vh';

const isPlainObject = v => v && typeof v === 'object' && !Array.isArray(v);

const resolveViewportOffset = (sheetView, tabCount) => {
  if (sheetView.viewportOffset != null && sheetView.viewportOffset !== '') {
    const n = Number(sheetView.viewportOffset);
    if (!Number.isNaN(n)) return n;
  }
  return tabCount > 1
    ? FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_TABS
    : FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_SINGLE;
};

/**
 * @param {object|null|undefined} sheetView views.create.sheet | views.update.sheet | views.list.searchSheet
 * @param {{ preset?: 'form'|'search', tabCount?: number }} opts
 * @returns {object} 合并进 actionContent 节点 props
 */
const mergeSheetOverlayProps = (sheetView, opts = {}) => {
  const { preset = 'form', tabCount = 1 } = opts;
  const view = isPlainObject(sheetView) ? sheetView : {};
  const props = {};

  if (view.persistent != null) props.persistent = !!view.persistent;
  if (view.rounded != null) props.rounded = !!view.rounded;
  if (view.minCardHeight != null && view.minCardHeight !== '') {
    props.minCardHeight = String(view.minCardHeight);
  }

  if (preset === 'form') {
    props.autoHeight = view.autoHeight != null ? !!view.autoHeight : true;
    props.viewportOffset = resolveViewportOffset(view, tabCount);
    if (view.maxBodyHeight != null && view.maxBodyHeight !== '') {
      props.maxBodyHeight = String(view.maxBodyHeight);
    }
    if (view.bodyHeight != null && view.bodyHeight !== '') {
      props.bodyHeight = String(view.bodyHeight);
    }
    if (view.beforeCloseConfirm != null) {
      props.beforeCloseConfirm = !!view.beforeCloseConfirm;
    }
    return props;
  }

  if (preset === 'search') {
    props.maxBodyHeight = (view.maxBodyHeight != null && view.maxBodyHeight !== '')
      ? String(view.maxBodyHeight)
      : SEARCH_SHEET_DEFAULT_MAX_BODY_HEIGHT;
    if (view.bodyHeight != null && view.bodyHeight !== '') {
      props.bodyHeight = String(view.bodyHeight);
    }
    return props;
  }

  if (view.maxBodyHeight != null && view.maxBodyHeight !== '') {
    props.maxBodyHeight = String(view.maxBodyHeight);
  }
  if (view.bodyHeight != null && view.bodyHeight !== '') {
    props.bodyHeight = String(view.bodyHeight);
  }
  if (view.autoHeight != null) props.autoHeight = !!view.autoHeight;
  if (view.viewportOffset != null && view.viewportOffset !== '') {
    const n = Number(view.viewportOffset);
    if (!Number.isNaN(n)) props.viewportOffset = n;
  }
  return props;
};

module.exports = {
  mergeSheetOverlayProps,
  FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_SINGLE,
  FORM_SHEET_DEFAULT_VIEWPORT_OFFSET_TABS,
  SEARCH_SHEET_DEFAULT_MAX_BODY_HEIGHT,
};
