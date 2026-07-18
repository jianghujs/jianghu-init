'use strict';

/**
 * Sheet 内容面板：排序 / 图标网格（从 jh-sheet 基座外置）
 * 供 MobileOrder / MobileAction 中继与旧 props 兼容注入共用。
 */

/** 内容区图标网格项：有 icon 且无 uiAction */
const looksLikeMenuActionList = (list) => {
  if (!Array.isArray(list) || !list.length) return false;
  return list.some(item => item && (item.icon || item.iconName) && !item.uiAction);
};

const vueAttrJson = (value) => JSON.stringify(value == null ? null : value).replace(/'/g, '&#39;');

const buildOrderPanelChildHtml = (orderList) => (
  `<jh-sheet-order-panel :order-list='${vueAttrJson(orderList || [])}'></jh-sheet-order-panel>`
);

const buildMenuGridChildHtml = (actionList, cols) => {
  const colsAttr = (cols != null && cols !== '') ? ` :cols='${vueAttrJson(cols)}'` : '';
  return `<jh-sheet-menu-grid :action-list='${vueAttrJson(actionList || [])}'${colsAttr}></jh-sheet-menu-grid>`;
};

/**
 * 从 Sheet rawProps 抽出旧内容模式 props，返回应注入的 children HTML。
 * 原地删除 orderList / menuActionList / 网格形 actionList / cols。
 */
const extractSheetContentPanelChildren = (rawProps, options = {}) => {
  const path = options.path || 'component.props';
  const injected = [];
  const record = options.recordDeprecatedKey;

  if (Object.prototype.hasOwnProperty.call(rawProps, 'orderList')) {
    injected.push(buildOrderPanelChildHtml(rawProps.orderList));
    delete rawProps.orderList;
    if (typeof record === 'function') {
      record(options.diagnostics, {
        path: `${path}.orderList`,
        replacement: `${path} children → jh-sheet-order-panel（或使用 MobileOrder 中继）`,
      });
    }
  }

  let menuList = null;
  if (Object.prototype.hasOwnProperty.call(rawProps, 'menuActionList')) {
    menuList = rawProps.menuActionList;
    delete rawProps.menuActionList;
    if (typeof record === 'function') {
      record(options.diagnostics, {
        path: `${path}.menuActionList`,
        replacement: `${path} children → jh-sheet-menu-grid（或使用 MobileAction 中继）`,
      });
    }
  } else if (
    Object.prototype.hasOwnProperty.call(rawProps, 'actionList')
    && !Object.prototype.hasOwnProperty.call(rawProps, 'headActionList')
    && looksLikeMenuActionList(rawProps.actionList)
  ) {
    menuList = rawProps.actionList;
    delete rawProps.actionList;
    if (typeof record === 'function') {
      record(options.diagnostics, {
        path: `${path}.actionList`,
        replacement: `${path} children → jh-sheet-menu-grid（或使用 MobileAction 中继）`,
      });
    }
  }

  if (menuList != null) {
    const cols = rawProps.cols;
    injected.push(buildMenuGridChildHtml(menuList, cols));
    if (Object.prototype.hasOwnProperty.call(rawProps, 'cols')) delete rawProps.cols;
  }

  return injected;
};

module.exports = {
  looksLikeMenuActionList,
  buildOrderPanelChildHtml,
  buildMenuGridChildHtml,
  extractSheetContentPanelChildren,
};
