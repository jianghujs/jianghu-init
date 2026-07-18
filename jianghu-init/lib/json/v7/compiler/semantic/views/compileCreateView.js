'use strict';

/** views.create -> create form IR */

const { normalizeActionList } = require('../../../actionIntent');
const { fieldKeyToFormField } = require('../../../fieldFormProps');
const { applyFieldInteraction } = require('../../../whenExpr');

const applyVariants = (fieldList, layout, target) => {
  const section = layout && layout.create;
  const cols = section && section.cols != null ? Number(section.cols) : 3;
  const variants = section && section.variants;
  const variantMap = variants && variants[target === 'mobile' ? 'mobile' : 'pc'];
  return fieldList.map(field => {
    const variant = variantMap && variantMap[field.key];
    if (variant && variant.span != null) return { ...field, span: variant.span };
    return { ...field, span: target === 'mobile' ? cols : 1 };
  });
};

const resolveChildren = (semantic, target) => {
  const root = semantic.slots && semantic.slots.create;
  if (!root || typeof root !== 'object') return [];
  const platformKey = target === 'mobile' ? 'mobile' : 'pc';
  const resolvePlatformChildren = sliceRoot => {
    if (!sliceRoot || typeof sliceRoot !== 'object') return [];
    const slice = sliceRoot[platformKey] && typeof sliceRoot[platformKey] === 'object'
      ? sliceRoot[platformKey]
      : (platformKey === 'mobile' && sliceRoot.mobild && typeof sliceRoot.mobild === 'object'
        ? sliceRoot.mobild
        : null);
    if (!slice) return [];
    if (Array.isArray(slice.children)) return slice.children.filter(item => typeof item === 'string' && item.trim());
    if (typeof slice.children === 'string' && slice.children.trim()) return [slice.children.trim()];
    return [];
  };

  const children = resolvePlatformChildren(root).slice();
  for (const [key, value] of Object.entries(root)) {
    if (['pc', 'mobile', 'mobild'].includes(key)) continue;
    children.push(...resolvePlatformChildren(value));
  }
  return children;
};

const compileCreateView = ({ semantic, view, fields, target, layout, component }) => {
  let fieldList = Array.isArray(view.fieldList)
    ? view.fieldList.map(key => fieldKeyToFormField(fields, key, target, 'create'))
    : [];
  if (view.interaction) fieldList = applyFieldInteraction(fieldList, view.interaction);
  fieldList = applyVariants(fieldList, layout, target);

  return {
    component,
    title: view.title || '新建',
    fieldList,
    actions: Array.isArray(view.actionList)
      ? normalizeActionList(view.actionList, 'formCreate', 'views.create.actionList')
      : null,
    sheet: view.mobileSheet,
    saveTipBeforeClose: !!view.beforeCloseConfirm,
    cols: layout.create && layout.create.cols,
    children: resolveChildren(semantic, target),
  };
};

module.exports = { compileCreateView };
