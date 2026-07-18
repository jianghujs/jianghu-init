'use strict';

/**
 * V7 对外聚合入口
 */
const { parseSchema } = require('./compiler/runtime/schemaPipeline');
const { normalizeSchema, normalizeSemantic } = require('./compiler/semantic/normalizeSchema');
const { expandCrudPage, semanticToV6Schema } = require('./compiler/semantic/expandCrudPage');
const {
  normalizePageContentToArray,
  getPageContentRoot,
  normalizePageContentOverride,
} = require('./compiler/semantic/pageContentShape');
const { flattenDataSource, normalizeDataSource } = require('./compiler/semantic/normalizeDataSource');
const { resolveIncludeList } = require('./compiler/semantic/resolveIncludeList');
const { buildListRegionsPlan } = require('./compiler/semantic/buildListRegionsPlan');
const { buildUiPayload } = require('./buildUiPayload');
const {
  resolveAuthoringMode,
  validateCrudSemantic,
} = require('./authoringMode');
const { validateActionUiActionSyntax } = require('./actionIntent');
const {
  resolveTargetPlatform, resolvePageType,
  getEffectivePlatformPolicy, resolveListLayoutFilter,
  resolvePlatformComponentTokens,
  adaptCrudPagePc, adaptCrudPageMobile, adaptCrudComponent,
  DEFAULT_PLATFORM_TOKENS,
} = require('./policy');
const { DEFAULT_LAYOUT, getEffectiveLayout } = require('./defaults');
const { applyMobileRuntimePageId } = require('./mobilePageId');
const { dedupeDiagnostics } = require('./migration/diagnostics');

// ─── buildPage：完整编译入口 ──────────────────────────────────────────────────

const buildPage = semanticInput => {
  const diagnostics = [];
  const semantic = normalizeSchema(semanticInput, { diagnostics });
  if (semantic.version !== 'v7') {
    throw new Error(`v7 buildPage: 期望 version === 'v7'，当前为 ${JSON.stringify(semantic.version)}`);
  }

  const mode = resolveAuthoringMode(semantic);
  let payload;
  let v7Meta;

  if (mode === 'crud') {
    validateCrudSemantic(semantic);
    validateActionUiActionSyntax(semantic);
    payload = expandCrudPage(semantic);
    v7Meta = payload._v7;
    const target = v7Meta && v7Meta.target === 'mobile' ? 'mobile' : 'pc';
    if (payload.pageType === 'jh-component') {
      payload = adaptCrudComponent(payload);
    } else {
      payload = target === 'mobile' ? adaptCrudPageMobile(payload) : adaptCrudPagePc(payload);
    }
    delete payload._v7;
    v7Meta = Object.assign({}, v7Meta, { mode: 'crud' });
  } else {
    payload = buildUiPayload(semantic);
    v7Meta = payload._v7Meta;
    delete payload._v7Meta;
  }

  payload.version = 'v7';

  const result = parseSchema(payload, { diagnostics });
  if (v7Meta) result.standardConfig.v7Meta = v7Meta;

  if (v7Meta && v7Meta.target === 'mobile') {
    applyMobileRuntimePageId(result.standardConfig);
  }

  const pageId = result.standardConfig.page && result.standardConfig.page.id;
  if (!result.legacyConfig.pageId && pageId && payload.pageType !== 'jh-component') {
    result.legacyConfig.pageId = pageId;
  }
  if (payload.pageType === 'jh-component' && result.standardConfig.page.componentPath) {
    result.legacyConfig.componentPath = result.standardConfig.page.componentPath;
  }
  if (!result.legacyConfig.pageName && result.standardConfig.page.name) {
    result.legacyConfig.pageName = result.standardConfig.page.name;
  }
  if (!result.legacyConfig.table && result.standardConfig.dataSource.table) {
    result.legacyConfig.table = result.standardConfig.dataSource.table;
  }
  if (!result.legacyConfig.version) {
    result.legacyConfig.version = 'v7';
  }
  if (payload.pageType === 'jh-component') {
    result.legacyConfig.resourceList = [];
  }

  result.diagnostics = dedupeDiagnostics(diagnostics);

  return result;
};

const parsePage = schemaPayload => parseSchema(schemaPayload);

module.exports = {
  buildPage,
  parsePage,
  parseSchema,
  normalizeSchema,
  normalizeSemantic,
  expandCrudPage,
  semanticToV6Schema,
  buildUiPayload,
  flattenDataSource,
  normalizeDataSource,
  resolveIncludeList,
  resolveAuthoringMode,
  validateActionUiActionSyntax,
  resolveTargetPlatform,
  resolvePageType,
  getEffectivePlatformPolicy,
  resolveListLayoutFilter,
  resolvePlatformComponentTokens,
  buildListRegionsPlan,
  DEFAULT_LAYOUT,
  getEffectiveLayout,
  DEFAULT_PLATFORM_TOKENS,
  normalizePageContentToArray,
  getPageContentRoot,
  normalizePageContentOverride,
};
