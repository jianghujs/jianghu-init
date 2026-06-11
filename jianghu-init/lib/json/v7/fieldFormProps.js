'use strict';

/**
 * fields.{key} + fields.{key}.pc|mobile + views.*.fieldAttrs → fieldList[].attrs
 *
 * 合并顺序：
 *   1. fields 根 attrs（双端默认）
 *   2. fields.{key}.pc | .mobile — **直接为 attrs 覆写对象**（merge 进 attrs）
 *   3. views.create|update.fieldAttrs
 */

const isPlainObject = v => v && typeof v === 'object' && !Array.isArray(v);

const PLATFORM_SLICE_KEYS = new Set(['pc', 'mobile']);

const mergeFieldAttrs = (base, override) => {
  if (!isPlainObject(base) && !isPlainObject(override)) return undefined;
  return Object.assign({}, base || {}, override || {});
};

/** 解析 fields.{key}：pc/mobile 即 attrs 覆写；merge 于根 attrs 上 */
const resolveFieldDefForTarget = (raw, target) => {
  if (!raw || typeof raw !== 'object') return {};
  const platformKey = target === 'mobile' ? 'mobile' : 'pc';
  const slice = raw[platformKey];
  const base = {};
  for (const k of Object.keys(raw)) {
    if (!PLATFORM_SLICE_KEYS.has(k)) base[k] = raw[k];
  }
  const merged = { ...base };
  const baseAttrs = isPlainObject(base.attrs) ? base.attrs : undefined;
  let platformAttrsPatch = null;
  if (isPlainObject(slice)) {
    if (slice.component != null) merged.component = slice.component;
    if (slice.type != null) merged.type = slice.type;
    const sliceForAttrs = { ...slice };
    delete sliceForAttrs.component;
    delete sliceForAttrs.type;
    // pc | mobile 直接是 attrs 对象；兼容旧写法 pc: { attrs: { … } }
    platformAttrsPatch = isPlainObject(sliceForAttrs.attrs) && Object.keys(sliceForAttrs).length === 1
      ? sliceForAttrs.attrs
      : (Object.keys(sliceForAttrs).length ? sliceForAttrs : null);
  }
  const attrs = mergeFieldAttrs(baseAttrs, platformAttrsPatch);
  if (attrs) merged.attrs = attrs;
  else delete merged.attrs;
  return merged;
};

/** fields.{key} → form fieldList 项（含 attrs / placeholder / hint / quickAttrs） */
const fieldKeyToFormField = (fieldsDict, key, target = 'pc') => {
  const f = resolveFieldDefForTarget(fieldsDict && fieldsDict[key], target);
  const out = { key, label: f.label || key, type: f.type || 'text' };
  if (f.required) out.required = true;
  if (f.readonly) out.readonly = true;
  if (f.options != null) out.options = f.options;
  if (f.autoId) out.autoId = f.autoId;
  if (f.rules != null) out.rules = f.rules;
  if (f.html != null) out.html = f.html;
  if (f.cls) out.cls = f.cls;
  if (f.placeholder != null) out.placeholder = f.placeholder;
  if (f.hint != null) out.hint = f.hint;
  if (f.quickAttrs != null) out.quickAttrs = f.quickAttrs;
  if (f.component != null && String(f.component).trim()) out.component = String(f.component).trim();
  if (isPlainObject(f.attrs)) out.attrs = Object.assign({}, f.attrs);
  return out;
};

/** views.*.fieldAttrs.{fieldKey} 浅合并进 fieldList[].attrs */
const applyFieldAttrs = (fieldList, fieldAttrsMap) => {
  if (!Array.isArray(fieldList) || !isPlainObject(fieldAttrsMap)) return fieldList;
  return fieldList.map(item => {
    if (!item || !item.key) return item;
    const patch = fieldAttrsMap[item.key];
    if (!isPlainObject(patch)) return item;
    const merged = mergeFieldAttrs(item.attrs, patch);
    return merged ? { ...item, attrs: merged } : item;
  });
};

module.exports = {
  fieldKeyToFormField,
  applyFieldAttrs,
  mergeFieldAttrs,
  resolveFieldDefForTarget,
};
