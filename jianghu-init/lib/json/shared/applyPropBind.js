'use strict';

const _ = require('lodash');

/** `*Binding` 协议（变量名），勿与 `*Bind`（表达式）混淆 */
const PROP_BIND_SUFFIX = 'Bind';
const PROP_BIND_KEY_RE = /^(.+)Bind$/;

/** 仅 *Binding 占用的 base prop，永不走 *Bind */
const RESERVED_BINDING_BASE_PROPS = new Set(['headers', 'columns']);

/** PageHeader / SearchSheet：plain 字符串走「变量名」协议，不用 *Bind 覆盖 */
const RESERVED_BY_COMPONENT = {
  PageHeader: ['keyword', 'keywordFieldList'],
  SearchSheet: ['keyword', 'keywordFieldList', 'keywordHeaders', 'fieldList', 'searchFieldList', 'shown', 'value'],
  Sheet: ['shown', 'value'],
  FormSheet: ['shown', 'value'],
};

const bindingAttrToBaseProp = attr => {
  if (!attr || typeof attr !== 'string' || attr[0] !== ':') return null;
  const name = attr.slice(1).replace(/\.(sync|prop|attr|camel|native)$/i, '');
  return _.camelCase(name);
};

/**
 * 从已有 resolvedBindings 提取已占用的 prop base 名（REACTIVE_BINDINGS_MAP 等优先于 *Bind）
 * @param {Record<string, string>} bindingOverrides
 * @returns {Set<string>}
 */
const collectReservedBaseProps = (component, bindingOverrides = {}) => {
  const reserved = new Set(RESERVED_BINDING_BASE_PROPS);
  const list = RESERVED_BY_COMPONENT[component];
  if (Array.isArray(list)) {
    list.forEach(k => reserved.add(k));
  }
  for (const attr of Object.keys(bindingOverrides || {})) {
    const base = bindingAttrToBaseProp(attr);
    if (base) reserved.add(base);
  }
  return reserved;
};

const basePropToBindingAttr = baseProp => `:${_.kebabCase(baseProp)}`;

/**
 * 通用 *Bind：`<prop>Bind` → `:prop="Vue 表达式"`，并剔除 `<prop>Bind` 与 plain `<prop>`。
 * @param {Object} resolvedProps
 * @param {{ component?: string, bindingOverrides?: Record<string, string> }} opts
 * @returns {Record<string, string>}
 */
const applyPropBindOverrides = (resolvedProps, opts = {}) => {
  const overrides = {};
  if (!resolvedProps || typeof resolvedProps !== 'object') return overrides;

  const reserved = collectReservedBaseProps(opts.component, opts.bindingOverrides);
  const existing = opts.bindingOverrides || {};

  for (const key of Object.keys(resolvedProps)) {
    const m = key.match(PROP_BIND_KEY_RE);
    if (!m || !m[1]) continue;

    const baseProp = m[1];
    if (reserved.has(baseProp)) continue;

    const rawBind = resolvedProps[key];
    if (typeof rawBind !== 'string' || !rawBind.trim()) continue;

    const bindingAttr = basePropToBindingAttr(baseProp);
    if (existing[bindingAttr]) continue;

    overrides[bindingAttr] = rawBind.trim();
    delete resolvedProps[key];
    if (Object.prototype.hasOwnProperty.call(resolvedProps, baseProp)) {
      delete resolvedProps[baseProp];
    }
  }

  return overrides;
};

module.exports = {
  PROP_BIND_SUFFIX,
  PROP_BIND_KEY_RE,
  collectReservedBaseProps,
  applyPropBindOverrides,
};
