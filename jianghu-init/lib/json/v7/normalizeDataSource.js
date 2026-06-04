'use strict';

/**
 * 将多种业务写法收敛为 parse_schema.normalizeDataSource 可用的扁平字段
 */
function flattenDataSource(ds) {
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

  return raw;
}

module.exports = { flattenDataSource };
