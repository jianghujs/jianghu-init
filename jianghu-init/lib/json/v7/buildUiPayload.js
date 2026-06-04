'use strict';

const { flattenDataSource } = require('./compiler/semantic/normalizeDataSource');
const { resolveIncludeList } = require('./compiler/semantic/resolveIncludeList');
const { normalizeUiPageContent } = require('./compiler/semantic/pageContentShape');
const { resolveTargetPlatform, resolvePageType } = require('./policy');
const {
  isJhComponent,
  resolvePageMeta,
  validateUiSemantic,
} = require('./authoringMode');

/**
 * UI 模式：pageContent 直连 parseSchema，不经过 expandCrudPage
 */
const buildUiPayload = semantic => {
  validateUiSemantic(semantic);

  const target = resolveTargetPlatform(semantic);
  const pageType = semantic.pageType || (isJhComponent(semantic) ? 'jh-component' : resolvePageType(semantic, target));
  const page = resolvePageMeta(semantic);

  const pageContentRoot = normalizeUiPageContent(semantic.pageContent);
  let pageContent = pageContentRoot == null ? [] : pageContentRoot;
  let actionContent = Array.isArray(semantic.actionContent) ? semantic.actionContent : [];

  return {
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
};

module.exports = { buildUiPayload };
