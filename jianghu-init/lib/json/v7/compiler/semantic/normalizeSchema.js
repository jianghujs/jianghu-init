'use strict';

const { getEffectiveLayout } = require('../../defaults');
const { isJhComponent } = require('../../authoringMode');

/**
 * jh-component：Vue props 统一写入 common.props（NJK 优先读 common.props）。
 * component.props 仅作兼容，合并进 common.props（common 同名键优先）。
 */
const normalizeComponentVueProps = out => {
  if (!isJhComponent(out)) return out;
  const comp = out.component && typeof out.component === 'object' ? out.component : null;
  const fromComponent = comp && comp.props && typeof comp.props === 'object' && !Array.isArray(comp.props)
    ? comp.props
    : null;
  if (!fromComponent || !Object.keys(fromComponent).length) return out;

  const common = out.common && typeof out.common === 'object' ? { ...out.common } : {};
  const fromCommon = common.props && typeof common.props === 'object' && !Array.isArray(common.props)
    ? common.props
    : {};
  common.props = Object.assign({}, fromComponent, fromCommon);
  out.common = common;
  return out;
};

/**
 * V7 semantic authoring 入口规范化（初版）
 */
const normalizeSchema = input => {
  if (!input || typeof input !== 'object') {
    throw new Error('v7 buildPage: semantic must be a non-null object');
  }
  let out = { ...input };
  if (!out.version) out.version = 'v7';
  out.layout = getEffectiveLayout(out);
  out = normalizeComponentVueProps(out);
  return out;
};

/** @deprecated 同名别名，兼容旧文档与调用方 */
const normalizeSemantic = normalizeSchema;

module.exports = { normalizeSchema, normalizeSemantic };
