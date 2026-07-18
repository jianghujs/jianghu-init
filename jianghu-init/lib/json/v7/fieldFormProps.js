'use strict';

/** fields.* 表单配置 → runtime fieldList 项。 */

const isPlainObject = v => v && typeof v === 'object' && !Array.isArray(v);

const mergeFieldAttrs = (base, override) => {
  if (!isPlainObject(base) && !isPlainObject(override)) return undefined;
  return Object.assign({}, base || {}, override || {});
};

const mergeFormConfig = (base, override) => {
  const merged = Object.assign({}, base || {}, override || {});
  const attrs = mergeFieldAttrs(base && base.attrs, override && override.attrs);
  if (attrs) merged.attrs = attrs;
  return merged;
};

/**
 * 合并顺序：字段根级展示信息 < form < createForm/updateForm < pcAttrs/mobileAttrs。
 * pcAttrs/mobileAttrs 只进入 attrs，不污染 fieldList 项的一级结构。
 */
const resolveFieldDefForTarget = (raw, target, mode) => {
  if (!raw || typeof raw !== 'object') return {};
  const platformKey = target === 'mobile' ? 'mobile' : 'pc';
  const platformAttrsKey = target === 'mobile' ? 'mobileAttrs' : 'pcAttrs';
  const root = {};
  for (const key of ['label', 'type', 'html', 'cls', 'autoId']) {
    if (raw[key] != null) root[key] = raw[key];
  }

  // 未经 normalizeSchema 的直接调用仍兼容旧 fields.attrs/pc/mobile 结构。
  const legacyForm = isPlainObject(raw.form) ? raw.form : raw;
  const modeForm = mode === 'create'
    ? raw.createForm
    : (mode === 'update' ? raw.updateForm : null);
  const form = mergeFormConfig(legacyForm, isPlainObject(modeForm) ? modeForm : null);
  const legacyPlatformSlice = isPlainObject(raw[platformKey]) ? raw[platformKey] : null;
  const internalPlatformOverride = raw[target === 'mobile'
    ? '_legacyMobileFormOverride'
    : '_legacyPcFormOverride'];
  const platformFormOverride = isPlainObject(internalPlatformOverride)
    ? internalPlatformOverride
    : legacyPlatformSlice;
  if (isPlainObject(platformFormOverride)) {
    if (platformFormOverride.component != null) form.component = platformFormOverride.component;
    if (platformFormOverride.type != null) form.type = platformFormOverride.type;
  }
  const legacyPlatformAttrs = legacyPlatformSlice
    ? (isPlainObject(legacyPlatformSlice.attrs) && Object.keys(legacyPlatformSlice).length === 1
      ? legacyPlatformSlice.attrs
      : Object.fromEntries(Object.entries(legacyPlatformSlice).filter(([key]) => !['component', 'type'].includes(key))))
    : null;
  const platformAttrs = isPlainObject(form[platformAttrsKey]) ? form[platformAttrsKey] : legacyPlatformAttrs;
  form.attrs = mergeFieldAttrs(form.attrs, platformAttrs);
  delete form.pcAttrs;
  delete form.mobileAttrs;
  delete form.pc;
  delete form.mobile;
  delete form.column;
  delete form.search;
  delete form.form;
  delete form.createForm;
  delete form.updateForm;
  delete form._legacyPcFormOverride;
  delete form._legacyMobileFormOverride;

  return Object.assign(root, form, {
    type: form.type || root.type || 'text',
  });
};

/** fields.{key} → form fieldList 项（含 attrs / placeholder / hint / quickAttrs） */
const fieldKeyToFormField = (fieldsDict, key, target = 'pc', mode) => {
  const f = resolveFieldDefForTarget(fieldsDict && fieldsDict[key], target, mode);
  const out = { key, label: f.label || key, type: f.type || 'text' };
  if (f.required) out.required = true;
  if (f.labelRequired != null) out.labelRequired = !!f.labelRequired;
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
  mergeFormConfig,
  resolveFieldDefForTarget,
};
