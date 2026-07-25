'use strict';

const { flattenDataSource } = require('./compiler/semantic/normalizeDataSource');
const { resolveIncludeList } = require('./compiler/semantic/resolveIncludeList');
const { normalizeUiPageContent } = require('./compiler/semantic/pageContentShape');
const { resolveTargetPlatform, resolvePageType, applyMobilePageFlexLayout } = require('./policy');
const {
  isJhComponent,
  resolvePageMeta,
  validateUiSemantic,
} = require('./authoringMode');

/**
 * UI 模式：pageContent 直连 parseSchema，不经过 expandCrudPage
 *
 * targets:both 时每次 build 会带 targetPlatform；mobile 端必须切到
 * jh-mobile-page + jhMobileTemplateV6，模板才会 include 移动端 jh-menu 实现
 * （jhMenuMobileV4），否则会误用 PC 的 jhTemplateV6 / jhMenuDesktopV4。
 */
const buildUiPayload = semantic => {
  validateUiSemantic(semantic);

  const target = resolveTargetPlatform(semantic);
  let pageType = semantic.pageType || (isJhComponent(semantic) ? 'jh-component' : resolvePageType(semantic, target));
  let page = resolvePageMeta(semantic);

  const pageContentRoot = normalizeUiPageContent(semantic.pageContent);
  let pageContent = pageContentRoot == null ? [] : pageContentRoot;
  let actionContent = Array.isArray(semantic.actionContent) ? semantic.actionContent : [];

  // UI 双端：mobile 编译端对齐 CRUD 的 adaptCrudPageMobile 壳层策略
  if (target === 'mobile' && pageType !== 'jh-component') {
    pageType = 'jh-mobile-page';
    if (!page.template) {
      page = Object.assign({}, page, { template: 'jhMobileTemplateV6' });
    }
  }

  const payload = {
    version: 'v7',
    pageType,
    page,
    component: isJhComponent(semantic) ? semantic.component : null,
    dataSource: semantic.dataSource ? flattenDataSource(semantic.dataSource) : {},
    common: semantic.common || {},
    includeList: resolveIncludeList(semantic.includeList, target),
    resourceList: isJhComponent(semantic) ? [] : (Array.isArray(semantic.resourceList) ? semantic.resourceList : []),
    pageContent,
    actionContent,
    _v7Meta: { mode: 'ui', target },
  };

  if (target === 'mobile' && pageType === 'jh-mobile-page') {
    applyMobilePageFlexLayout(payload);
  }

  return payload;
};

module.exports = { buildUiPayload };
