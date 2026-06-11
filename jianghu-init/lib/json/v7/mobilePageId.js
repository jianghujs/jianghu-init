'use strict';

/**
 * 移动端运行时 pageId（_page 表、jhPage.pageId、SQL map）使用 mobile/{baseId}；
 * 磁盘路径仍用 baseId：app/view/page/mobile/{baseId}.html
 */

const toBasePageId = pageId => {
  if (pageId == null || pageId === '') return pageId;
  const s = String(pageId);
  return s.startsWith('mobile/') ? s.slice(7) : s;
};

const toMobileRuntimePageId = pageId => {
  const base = toBasePageId(pageId);
  if (!base) return base;
  return `mobile/${base}`;
};

/** 写入 standardConfig.page.id，供 NJK bake const pageId */
const applyMobileRuntimePageId = standardConfig => {
  if (!standardConfig || !standardConfig.page || !standardConfig.page.id) return;
  const next = toMobileRuntimePageId(standardConfig.page.id);
  if (next) standardConfig.page.id = next;
};

/**
 * v7 本次 init 实际写出了哪些端（init_page.renderVue 写入）。
 * 优先于配置里的 page.targets / v7BuildTargets，避免「只生成 PC 却同步 mobile 权限」。
 * @param {Object} jsonConfig
 * @returns {('pc'|'mobile')[]}
 */
const resolveV7GeneratedTargets = jsonConfig => {
  if (Array.isArray(jsonConfig.v7GeneratedTargets) && jsonConfig.v7GeneratedTargets.length) {
    return jsonConfig.v7GeneratedTargets.filter(t => t === 'pc' || t === 'mobile');
  }
  const bt = jsonConfig.v7BuildTargets;
  if (bt === 'mobile') return ['mobile'];
  if (bt === 'both') return ['pc', 'mobile'];
  return ['pc'];
};

/**
 * _page / _resource 同步用的 pageId 列表（与 init_page.renderVue 一致：生成哪端就同步哪端）。
 * @param {Object} jsonConfig
 * @returns {Array<{ pageId: string, pageName: string, pageType: string }>}
 */
const resolvePageSyncEntries = jsonConfig => {
  const raw = jsonConfig.pageId || (jsonConfig.page && jsonConfig.page.id);
  if (!raw) return [];
  const basePageId = toBasePageId(raw);
  const pageName = jsonConfig.pageName || (jsonConfig.page && jsonConfig.page.name) || basePageId;

  if (jsonConfig.version === 'v7') {
    const entries = [];
    for (const target of resolveV7GeneratedTargets(jsonConfig)) {
      if (target === 'pc') {
        entries.push({ pageId: basePageId, pageName, pageType: 'showInMenu' });
      } else if (target === 'mobile') {
        entries.push({
          pageId: toMobileRuntimePageId(basePageId),
          pageName,
          pageType: 'showInMenu',
        });
      }
    }
    return entries;
  }

  const pageId = String(raw).startsWith('mobile/') ? String(raw) : basePageId;
  return [{ pageId, pageName, pageType: 'showInMenu' }];
};

module.exports = {
  toBasePageId,
  toMobileRuntimePageId,
  applyMobileRuntimePageId,
  resolveV7GeneratedTargets,
  resolvePageSyncEntries,
};
