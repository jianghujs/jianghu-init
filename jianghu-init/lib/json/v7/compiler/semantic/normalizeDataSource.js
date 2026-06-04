'use strict';

/**
 * 将多种业务写法收敛为 schemaPipeline.normalizeDataSource 可用的扁平字段
 */
const flattenDataSource = ds => {
  const raw = ds && typeof ds === 'object' ? { ...ds } : {};

  const resource = raw.resource && typeof raw.resource === 'object' ? raw.resource : null;
  const actions = raw.actions && typeof raw.actions === 'object' ? raw.actions : null;

  if (resource) {
    if (resource.list && raw.listResource == null) raw.listResource = resource.list;
    if (resource.create && raw.createResource == null) raw.createResource = resource.create;
    if (resource.update && raw.updateResource == null) raw.updateResource = resource.update;
    if (resource.delete && raw.deleteResource == null) raw.deleteResource = resource.delete;
    if (resource.get && raw.getActionId == null) raw.getActionId = resource.get;
  }

  if (actions) {
    if (actions.list && raw.listResource == null) raw.listResource = actions.list;
    if (actions.create && raw.createResource == null) raw.createResource = actions.create;
    if (actions.update && raw.updateResource == null) raw.updateResource = actions.update;
    if (actions.delete && raw.deleteResource == null) raw.deleteResource = actions.delete;
  }

  // *Resource 优先级最高：无条件覆盖 *ActionId（新规范）
  const RESOURCE_KEYS = ['list', 'create', 'update', 'delete', 'get'];
  for (const k of RESOURCE_KEYS) {
    const rk = `${k}Resource`;
    if (raw[rk] != null) raw[`${k}ActionId`] = raw[rk];
  }

  return raw;
};

/**
 * flatten + 默认值，供 standardConfig.dataSource → NJK bake listResource 等常量
 */
const normalizeDataSource = raw => {
  const flat = flattenDataSource(raw && typeof raw === 'object' ? raw : {});

  const listResource = flat.listResource || flat.listActionId || 'selectItemList';
  const createResource = flat.createResource || flat.createActionId || 'insertItem';
  const updateResource = flat.updateResource || flat.updateActionId || 'updateItem';
  const deleteResource = flat.deleteResource || flat.deleteActionId || 'deleteItem';

  return {
    table: flat.table || flat.model || '',
    primaryKey: flat.primaryKey || 'id',
    listResource,
    createResource,
    updateResource,
    deleteResource,
    listActionId: listResource,
    createActionId: createResource,
    updateActionId: updateResource,
    deleteActionId: deleteResource,
    ...(flat.getActionId != null ? { getActionId: flat.getActionId } : {}),
  };
};

module.exports = { flattenDataSource, normalizeDataSource };
