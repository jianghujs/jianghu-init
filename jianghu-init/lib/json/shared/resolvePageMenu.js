'use strict';

/** 未显式配置 menu 时，jh-page / jh-mobile-page 默认顶栏组件 */
const DEFAULT_PAGE_MENU_COMPONENT = 'jh-menu';

const MENU_TAG_RE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

/**
 * 解析 page.menu → standardConfig.page.menu（供 NJK / policy 消费）
 *
 * | 配置 page.menu | 结果 page.menu（bake 后） |
 * |----------------|---------------------------|
 * | 省略 + jh-page | `'jh-menu'` |
 * | 省略 + jh-component | `false` |
 * | `false` | `false`（不渲染顶栏） |
 * | `true` | `'jh-menu'` |
 * | `'my-menu'` | `'my-menu'`（自定义 Vue 组件标签，须 kebab-case） |
 *
 * @param {*} rawMenu
 * @param {string} pageType
 * @param {boolean} hasOwnMenu 配置是否显式写了 menu
 * @returns {false|string}
 */
function resolvePageMenu(rawMenu, pageType, hasOwnMenu) {
  const omittedDefault = pageType === 'jh-component' ? false : DEFAULT_PAGE_MENU_COMPONENT;
  const menu = hasOwnMenu ? rawMenu : omittedDefault;

  if (menu === false || menu === null || menu === undefined || menu === '') {
    return false;
  }
  if (menu === true) {
    return DEFAULT_PAGE_MENU_COMPONENT;
  }
  if (typeof menu === 'string') {
    const tag = menu.trim();
    if (!tag) return false;
    if (!MENU_TAG_RE.test(tag)) {
      throw new Error(
        `page.menu 无效组件名 "${menu}"：须为 kebab-case 字符串（如 "jh-menu"），或 false 关闭顶栏`,
      );
    }
    return tag;
  }
  throw new Error('page.menu 须为 false | true | kebab-case 组件名字符串');
}

module.exports = {
  DEFAULT_PAGE_MENU_COMPONENT,
  resolvePageMenu,
};
