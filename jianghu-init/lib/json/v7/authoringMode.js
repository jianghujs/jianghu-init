'use strict';

const { getPageContentRoot, isEmptyPageContent } = require('./compiler/semantic/pageContentShape');

/** @typedef {'ui' | 'crud'} AuthoringMode */

/**
 * 默认 ui；仅 mode === 'crud' 时走 CRUD 语义展开。
 * @param {object} semantic
 * @returns {AuthoringMode}
 */
const resolveAuthoringMode = semantic => (
  semantic && semantic.mode === 'crud' ? 'crud' : 'ui'
);

const isJhComponent = semantic => semantic.pageType === 'jh-component';

/** jh-component Vue props：以 common.props 为准，component.props 为兼容别名 */
const resolveComponentVueProps = semantic => {
  const commonProps = semantic.common && semantic.common.props;
  if (commonProps && typeof commonProps === 'object' && !Array.isArray(commonProps)) {
    return commonProps;
  }
  const comp = semantic.component;
  if (comp && comp.props && typeof comp.props === 'object' && !Array.isArray(comp.props)) {
    return comp.props;
  }
  return {};
};

const buildComponentPageMeta = semantic => {
  const comp = semantic.component;
  if (!comp || typeof comp !== 'object' || !comp.path) {
    throw new Error('v7 jh-component: component.path 必填');
  }
  const leaf = String(comp.path).split('/').filter(Boolean).pop();
  return {
    id: leaf,
    name: comp.name || leaf,
    componentPath: comp.path,
    menu: false,
    hook: null,
    componentProps: resolveComponentVueProps(semantic),
    targets: comp.targets || 'pc',
  };
};

const resolvePageTemplate = semantic => {
  const template = semantic.page && semantic.page.template;
  if (!template || typeof template !== 'object' || Array.isArray(template)) return template;
  const target = semantic.targetPlatform === 'mobile' || semantic.pageType === 'jh-mobile-page'
    ? 'mobile'
    : 'pc';
  return template[target] || template.pc || template.mobile || '';
};

/**
 * CRUD / UI 共用的 page 元信息（jh-component 用 component，jh-page 用 page）
 */
const resolvePageMeta = semantic => {
  if (isJhComponent(semantic)) return buildComponentPageMeta(semantic);
  const page = semantic.page || {};
  const template = resolvePageTemplate(semantic);
  return template === page.template ? page : { ...page, template };
};

const validateCrudSemantic = semantic => {
  if (semantic.mode !== 'crud') {
    throw new Error('v7 CRUD: 须显式设置 mode: "crud"');
  }
  if (semantic.pageContent != null) {
    throw new Error('v7 CRUD: 禁止顶层 pageContent，请用 pc/mobile 覆写或删除 pageContent');
  }
  if (isJhComponent(semantic)) {
    if (semantic.resourceList && semantic.resourceList.length) {
      throw new Error('v7 jh-component: 禁止 resourceList，权限由宿主 Page 注册');
    }
    if (semantic.page && semantic.page.id) {
      throw new Error('v7 jh-component: 禁止 page.id，请使用 component.path');
    }
  } else if (!semantic.page || !semantic.page.id) {
    throw new Error('v7 CRUD Page: page.id 必填');
  }
  if (!semantic.fields || typeof semantic.fields !== 'object') {
    throw new Error('v7 CRUD: fields 必填');
  }
  const ds = semantic.dataSource || {};
  if (!ds.table && !ds.model) {
    throw new Error('v7 CRUD: dataSource.table 必填');
  }
};

const validateUiSemantic = semantic => {
  if (semantic.mode === 'crud') return;
  if (semantic.pc != null || semantic.mobile != null) {
    throw new Error('v7 UI: 禁止 pc/mobile 函数覆写，仅 mode:"crud" 时可用');
  }
  if (semantic.views != null || semantic.fields != null) {
    throw new Error('v7 UI: 禁止 fields/views，CRUD 语义须显式 mode:"crud"');
  }
  if (isJhComponent(semantic)) {
    if (semantic.resourceList && semantic.resourceList.length) {
      throw new Error('v7 jh-component: 禁止 resourceList');
    }
    if (semantic.page && semantic.page.id) {
      throw new Error('v7 jh-component: 禁止 page.id，请使用 component.path');
    }
  }
  const root = getPageContentRoot(semantic.pageContent);
  if (!root && !isEmptyPageContent(semantic.pageContent)) {
    throw new Error('v7 UI: pageContent 须为单根节点对象，或留空对象 {}（纯 actionContent）');
  }
};

module.exports = {
  resolveAuthoringMode,
  isJhComponent,
  resolveComponentVueProps,
  buildComponentPageMeta,
  resolvePageMeta,
  validateCrudSemantic,
  validateUiSemantic,
};
