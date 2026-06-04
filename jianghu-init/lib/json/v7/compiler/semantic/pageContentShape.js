'use strict';

/** 纯 actionContent 配置：pageContent 留空对象 {} */
const isEmptyPageContent = input =>
  input != null
  && typeof input === 'object'
  && !Array.isArray(input)
  && Object.keys(input).length === 0;

/** 是否为 pageContent 组件树节点（V7 component / legacy tag） */
const isPageContentNode = node =>
  !!(
    node
    && typeof node === 'object'
    && !Array.isArray(node)
    && (node.component || node.tag || node.resolvedComponent)
  );

/**
 * 编译管线入口：单根对象 → [root]；legacy 多顶层仍保留数组。
 * @param {*} input
 * @returns {Array}
 */
const normalizePageContentToArray = input => {
  if (input == null) return [];
  if (Array.isArray(input)) return input;
  if (isPageContentNode(input)) return [input];
  return [];
};

/** V7 IR / policy：取 pageContent 单根（对象或 [root]） */
const getPageContentRoot = input => {
  const list = normalizePageContentToArray(input);
  return list[0] || null;
};

/**
 * pc/mobile 覆写 pageContent：接受单节点对象，或仅含一项的数组（兼容旧写法）。
 * @param {*} input
 * @returns {object}
 */
const normalizePageContentOverride = input => {
  if (input == null) {
    throw new Error('v7 expandCrudPage: pageContent 覆写不能为 null/undefined');
  }
  if (Array.isArray(input)) {
    if (input.length === 0) {
      throw new Error('v7 expandCrudPage: pageContent 覆写不能为空数组');
    }
    if (input.length > 1) {
      throw new Error(
        'v7 expandCrudPage: pageContent 覆写须为单根节点对象（或仅 1 项的数组）；多顶层请放进 VStack.children',
      );
    }
    const root = input[0];
    if (!isPageContentNode(root)) {
      throw new Error('v7 expandCrudPage: pageContent 覆写数组项须为 component 节点');
    }
    return root;
  }
  if (isPageContentNode(input)) return input;
  throw new Error('v7 expandCrudPage: pageContent 覆写须为 { component, children?, props? } 节点对象');
};

/**
 * UI 模式 pageContent：允许 {}（无主体，仅 actionContent）；否则须为单根 component 节点。
 * @param {*} input
 * @returns {object|null} 单根节点；空对象时返回 null
 */
const normalizeUiPageContent = input => {
  if (isEmptyPageContent(input)) return null;
  return normalizePageContentOverride(input);
};

module.exports = {
  isEmptyPageContent,
  isPageContentNode,
  normalizePageContentToArray,
  getPageContentRoot,
  normalizePageContentOverride,
  normalizeUiPageContent,
};
