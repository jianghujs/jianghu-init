'use strict';

/**
 * 列表区域编排（layout.list.regions）
 * 例：{ treePanel: { role: 'tree' }, table: { role: 'table' } }
 * → [{ id: 'treePanel', role: 'tree' }, ...] 保持插入顺序
 */
const buildListRegionsPlan = semantic => {
  const regionsRoot =
    semantic.layout &&
    semantic.layout.list &&
    semantic.layout.list.regions &&
    typeof semantic.layout.list.regions === 'object'
      ? semantic.layout.list.regions
      : null;

  if (!regionsRoot || !Object.keys(regionsRoot).length) {
    return [{ id: 'collection', role: 'collection' }];
  }

  return Object.entries(regionsRoot).map(([id, region]) => ({
    id,
    role: region && typeof region === 'object' && region.role ? String(region.role) : id,
  }));
};

module.exports = { buildListRegionsPlan };
