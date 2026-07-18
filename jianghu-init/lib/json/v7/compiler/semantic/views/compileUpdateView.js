'use strict';

/** views.update -> update form IR */

const { normalizeActionList } = require('../../../actionIntent');
const { fieldKeyToFormField } = require('../../../fieldFormProps');
const { applyFieldInteraction } = require('../../../whenExpr');

const applyVariants = (fieldList, layout, target) => {
  const section = layout && layout.update;
  const cols = section && section.cols != null ? Number(section.cols) : 3;
  const variants = section && section.variants;
  const variantMap = variants && variants[target === 'mobile' ? 'mobile' : 'pc'];
  return fieldList.map(field => {
    const variant = variantMap && variantMap[field.key];
    if (variant && variant.span != null) return { ...field, span: variant.span };
    return { ...field, span: target === 'mobile' ? cols : 1 };
  });
};

const compileFieldList = (keys, fields, target, interaction, layout) => {
  let fieldList = Array.isArray(keys)
    ? keys.map(key => fieldKeyToFormField(fields, key, target, 'update'))
    : [];
  if (interaction) fieldList = applyFieldInteraction(fieldList, interaction);
  return applyVariants(fieldList, layout, target);
};

const compilePayload = ({ view, fields, target, layout }) => {
  if (Array.isArray(view.tabList) && view.tabList.length) {
    return {
      mode: 'tabs',
      tabList: view.tabList.map(tab => {
        const result = {
          key: tab.key,
          title: tab.title,
          fieldList: compileFieldList(
            tab.fieldList,
            fields,
            target,
            tab.interaction,
            layout,
          ),
        };
        if (tab.actionList) {
          result.actions = normalizeActionList(
            tab.actionList,
            'formUpdate',
            `views.update.tabList.${tab.key}.actionList`,
          );
        }
        return result;
      }),
    };
  }

  const payload = {
    mode: 'fields',
    fieldList: compileFieldList(
      view.fieldList,
      fields,
      target,
      view.interaction,
      layout,
    ),
  };
  if (Array.isArray(view.actionList)) {
    payload.actions = normalizeActionList(view.actionList, 'formUpdate', 'views.update.actionList');
  }
  return payload;
};

const normalizeChildren = raw => {
  if (Array.isArray(raw)) return raw.filter(item => typeof item === 'string' && item.trim());
  if (typeof raw === 'string' && raw.trim()) return [raw.trim()];
  return [];
};

const resolveChildren = (semantic, target) => {
  const root = semantic.slots && semantic.slots.update;
  if (!root || typeof root !== 'object') return [];
  const platformKey = target === 'mobile' ? 'mobile' : 'pc';
  const resolvePlatformChildren = sliceRoot => {
    if (!sliceRoot || typeof sliceRoot !== 'object') return [];
    const slice = sliceRoot[platformKey] && typeof sliceRoot[platformKey] === 'object'
      ? sliceRoot[platformKey]
      : (platformKey === 'mobile' && sliceRoot.mobild && typeof sliceRoot.mobild === 'object'
        ? sliceRoot.mobild
        : null);
    return slice ? normalizeChildren(slice.children) : [];
  };

  const children = resolvePlatformChildren(root).slice();
  for (const [key, value] of Object.entries(root)) {
    if (['pc', 'mobile', 'mobild'].includes(key)) continue;
    children.push(...resolvePlatformChildren(value));
  }
  return children;
};

const compileUpdateView = ({ semantic, view, fields, target, layout, component }) => {
  return {
    component,
    title: view.title || '编辑',
    payload: compilePayload({ view, fields, target, layout }),
    sheet: view.mobileSheet,
    cols: layout.update && layout.update.cols,
    children: resolveChildren(semantic, target),
  };
};

module.exports = { compileUpdateView };
