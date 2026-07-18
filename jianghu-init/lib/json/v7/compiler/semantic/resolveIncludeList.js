'use strict';

/**
 * includeList 按编译端过滤（与 targetPlatform / _v7.target 对齐）
 *
 * 扁平数组 + 项上可选 targets：
 *   { type: 'html', path: '...', targets: 'pc' }
 *   { type: 'html', path: '...', targets: ['pc', 'mobile'] }
 *   省略 targets → PC / Mobile 各编译一次时都会引入
 */

const VALID_TARGETS = new Set(['pc', 'mobile']);

const normalizeTargetFilter = raw => {
  if (raw == null || raw === '') return null;
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (t === 'both') return ['pc', 'mobile'];
    if (!VALID_TARGETS.has(t)) {
      throw new Error(`v7 resolveIncludeList: targets 须为 'pc' | 'mobile' | 'both'，当前为 ${JSON.stringify(raw)}`);
    }
    return [t];
  }
  if (Array.isArray(raw)) {
    const list = [];
    for (const entry of raw) {
      if (typeof entry !== 'string') {
        throw new Error('v7 resolveIncludeList: target 数组项须为 string');
      }
      const t = entry.trim();
      if (!VALID_TARGETS.has(t)) {
        throw new Error(`v7 resolveIncludeList: target 数组项须为 'pc' | 'mobile'，当前为 ${JSON.stringify(entry)}`);
      }
      list.push(t);
    }
    return list.length ? list : null;
  }
  throw new Error('v7 resolveIncludeList: target 须为 string | string[]');
};

const stripTargetField = item => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return item;
  const { target, targets, ...rest } = item;
  return rest;
};

const includeItemMatchesTarget = (item, compileTarget) => {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return true;
  const filter = normalizeTargetFilter(item.targets != null ? item.targets : item.target);
  if (!filter) return true;
  return filter.includes(compileTarget);
};

/**
 * @param {Array} includeList authoring 配置（须为数组）
 * @param {'pc'|'mobile'} compileTarget 当前编译端
 * @returns {Array} 已剔除 target 字段、仅含当前端需要的项
 */
const resolveIncludeList = (includeList, compileTarget) => {
  if (!VALID_TARGETS.has(compileTarget)) {
    throw new Error(`v7 resolveIncludeList: compileTarget 须为 'pc' | 'mobile'，当前为 ${JSON.stringify(compileTarget)}`);
  }
  if (!Array.isArray(includeList)) return [];

  const result = [];
  for (const item of includeList) {
    if (typeof item === 'string') {
      result.push(item);
      continue;
    }
    if (!item || typeof item !== 'object') continue;
    if (!includeItemMatchesTarget(item, compileTarget)) continue;
    result.push(stripTargetField(item));
  }
  return result;
};

module.exports = { resolveIncludeList };
