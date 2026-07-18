'use strict';
const { buildPage } = require('../v7');
const { isJhComponent } = require('../v7/authoringMode');
const { normalizeBakedPageMenu } = require('../shared/resolvePageMenu');
const { dedupeDiagnostics, formatMigrationWarnings } = require('../v7/migration/diagnostics');

const bakePageMenuOnStandardConfig = standardConfig => {
  if (!standardConfig || !standardConfig.page) return;
  standardConfig.page.menu = normalizeBakedPageMenu(standardConfig.page.menu);
};

/**
 * 决定 V7 编译几端产物。
 * - 子组件：`component.targets`
 * - 页面：显式 `page.targets` **优先于** `mode:'crud'` 默认双端
 * - 未写 targets 的 CRUD：默认 `both`；UI 模式：默认 `pc`
 * @param {Object} jsonConfig
 * @returns {'pc' | 'mobile' | 'both'}
 */
const resolveV7BuildTargets = jsonConfig => {
  if (isJhComponent(jsonConfig)) {
    const t = jsonConfig.component && jsonConfig.component.targets;
    if (t === 'mobile' || t === 'both' || t === 'pc') return t;
    return 'pc';
  }
  const pageTargets = jsonConfig.page && jsonConfig.page.targets;
  if (pageTargets === 'mobile' || pageTargets === 'both' || pageTargets === 'pc') {
    return pageTargets;
  }
  if (jsonConfig.mode === 'crud') return 'both';
  return 'pc';
};

/**
 * v7 配置标准化：semantic → buildPage → standardConfig + legacyConfig（并 early return）
 * @param {Object} jsonConfig
 * @returns {boolean} true 表示已按 v7 处理并可 early return
 */
module.exports = function handleJsonConfigV7(jsonConfig) {
  const isCrud = jsonConfig && jsonConfig.mode === 'crud';
  const isUi = jsonConfig && jsonConfig.version === 'v7' && !isCrud;
  const shouldParseV7 =
    jsonConfig &&
    jsonConfig.version === 'v7' &&
    (
      isCrud ||
      isUi && (
        jsonConfig.pageContent != null ||
        jsonConfig.component != null ||
        (jsonConfig.page && jsonConfig.page.id)
      )
    );

  if (!shouldParseV7) return false;

  const buildTargets = resolveV7BuildTargets(jsonConfig);

  const runBuild = targetPlatform => {
    const semantic = Object.assign({}, jsonConfig, { targetPlatform });
    return buildPage(semantic);
  };

  let pcStandardConfig;
  let pcLegacyConfig;
  let mobileStandardConfig;
  let mobileLegacyConfig;
  const diagnostics = [];

  if (buildTargets === 'mobile') {
    const mobile = runBuild('mobile');
    diagnostics.push(...(mobile.diagnostics || []));
    pcStandardConfig = mobile.standardConfig;
    pcLegacyConfig = mobile.legacyConfig;
    // 单端 mobile：不再写第二份 mobile/ 副本；render 走 jh-mobile-page-v7
    mobileStandardConfig = null;
    mobileLegacyConfig = null;
    if (pcLegacyConfig.pageType !== 'jh-component' && pcLegacyConfig.pageType !== 'jh-mobile-page') {
      pcLegacyConfig.pageType = 'jh-mobile-page';
    }
  } else if (buildTargets === 'pc') {
    const pc = runBuild('pc');
    diagnostics.push(...(pc.diagnostics || []));
    pcStandardConfig = pc.standardConfig;
    pcLegacyConfig = pc.legacyConfig;
  } else {
    const pc = runBuild('pc');
    diagnostics.push(...(pc.diagnostics || []));
    pcStandardConfig = pc.standardConfig;
    pcLegacyConfig = pc.legacyConfig;
    const mobile = runBuild('mobile');
    diagnostics.push(...(mobile.diagnostics || []));
    mobileStandardConfig = mobile.standardConfig;
    mobileLegacyConfig = mobile.legacyConfig;
  }

  const semanticPageId = jsonConfig.page && jsonConfig.page.id;

  bakePageMenuOnStandardConfig(pcStandardConfig);
  bakePageMenuOnStandardConfig(mobileStandardConfig);

  Object.assign(jsonConfig, pcLegacyConfig, {
    standardConfig: pcStandardConfig,
    mobileStandardConfig: mobileStandardConfig || null,
    mobileLegacyConfig: mobileLegacyConfig || null,
    v7BuildTargets: buildTargets,
    v7Diagnostics: dedupeDiagnostics(diagnostics),
  });

  const migrationWarning = formatMigrationWarnings(jsonConfig.v7Diagnostics);
  if (migrationWarning) this.warning(migrationWarning);

  // 文件生成用配置 id；移动端运行时 id 在 standardConfig.page.id（mobile/ 前缀，见 buildPage）
  if (semanticPageId) {
    jsonConfig.pageId = semanticPageId;
  }

  if (jsonConfig.pageType === 'jh-component' && jsonConfig.component && jsonConfig.component.path) {
    jsonConfig.componentPath = jsonConfig.component.path;
  }

  // 补齐 render/下游 mixin 依赖的最小字段
  if (!jsonConfig.pageContent) { jsonConfig.pageContent = []; }
  if (!jsonConfig.actionContent) { jsonConfig.actionContent = []; }
  if (!jsonConfig.includeList) { jsonConfig.includeList = []; }
  if (!jsonConfig.common) { jsonConfig.common = {}; }
  if (!jsonConfig.common.doUiAction) { jsonConfig.common.doUiAction = {}; }

  // 生成 basicUiActionConfig（以 pc 端 features 为准）
  Object.assign(jsonConfig, this.getBasicConfig({
    version: 'v7',
    common: jsonConfig.common,
    hasJhTable: pcStandardConfig.features.hasTable,
    hasJhList: pcStandardConfig.features.hasList,
    hasCreateDrawer: pcStandardConfig.features.hasCreate,
    hasCreateSubmit: pcStandardConfig.features.hasCreate,
    hasUpdateDrawer: pcStandardConfig.features.hasUpdate,
    hasUpdateSubmit: pcStandardConfig.features.hasUpdate,
    hasDelete: pcStandardConfig.features.hasDelete,
  }));

  // 处理 common.doUiAction
  if (jsonConfig.common.doUiAction) {
    for (const key in jsonConfig.common.doUiAction) {
      const uiAction = jsonConfig.common.doUiAction[key];
      for (let [ index, item ] of uiAction.entries()) {
        item = this.processUiActionItem(item);
        jsonConfig.common.doUiAction[key][index] = item;
      }
    }
  }

  if (mobileStandardConfig) {
    const mobileBasicConfig = this.getBasicConfig({
      version: 'v7',
      common: jsonConfig.common,
      hasJhTable: mobileStandardConfig.features.hasTable,
      hasJhList: mobileStandardConfig.features.hasList,
      hasCreateDrawer: mobileStandardConfig.features.hasCreate,
      hasCreateSubmit: mobileStandardConfig.features.hasCreate,
      hasUpdateDrawer: mobileStandardConfig.features.hasUpdate,
      hasUpdateSubmit: mobileStandardConfig.features.hasUpdate,
      hasDelete: mobileStandardConfig.features.hasDelete,
    });
    jsonConfig.mobileBasicUiActionConfig = mobileBasicConfig.basicUiActionConfig;
  } else {
    jsonConfig.mobileBasicUiActionConfig = null;
  }

  return true;
};

module.exports.resolveV7BuildTargets = resolveV7BuildTargets;
