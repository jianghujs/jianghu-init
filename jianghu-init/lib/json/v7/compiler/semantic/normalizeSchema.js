'use strict';

const { isDeepStrictEqual } = require('util');
const { getEffectiveLayout } = require('../../defaults');
const { isJhComponent } = require('../../authoringMode');
const { normalizeSemanticViewKeys } = require('./views/semanticKeyAliases');
const { recordDeprecatedKey } = require('../../migration/diagnostics');
const {
  SEMANTIC_STRUCTURAL_MIGRATIONS,
  fieldStructuralGroups,
  listSearchLayoutMoves,
} = require('../../migration/keyMigrations');

const FIELD_STRUCTURAL = fieldStructuralGroups();

const isPlainObject = value => value && typeof value === 'object' && !Array.isArray(value);

const assignMovedValue = ({ target, key, value, oldPath, newPath, diagnostics }) => {
  if (Object.prototype.hasOwnProperty.call(target, key) && !isDeepStrictEqual(target[key], value)) {
    throw new Error(`v7 ${oldPath} 与 canonical key ${newPath} 同时存在且值不同，请只保留 ${newPath}`);
  }
  if (!Object.prototype.hasOwnProperty.call(target, key)) target[key] = value;
  recordDeprecatedKey(diagnostics, { path: oldPath, replacement: newPath });
};

const unwrapLegacyPlatformAttrs = value => {
  if (!isPlainObject(value)) return value;
  if (Object.keys(value).length === 1 && isPlainObject(value.attrs)) return value.attrs;
  return value;
};

const normalizeFieldDefinition = (rawField, fieldPath, diagnostics) => {
  if (!isPlainObject(rawField)) return rawField;
  const field = { ...rawField };
  const column = isPlainObject(field.column) ? { ...field.column } : {};
  const search = isPlainObject(field.search) ? { ...field.search } : {};
  const form = isPlainObject(field.form) ? { ...field.form } : {};

  for (const { from, key } of FIELD_STRUCTURAL.column) {
    if (!Object.prototype.hasOwnProperty.call(field, from)) continue;
    assignMovedValue({
      target: column,
      key,
      value: field[from],
      oldPath: `${fieldPath}.${from}`,
      newPath: `${fieldPath}.column.${key}`,
      diagnostics,
    });
    delete field[from];
  }

  for (const { from, key } of FIELD_STRUCTURAL.search) {
    if (!Object.prototype.hasOwnProperty.call(field, from)) continue;
    assignMovedValue({
      target: search,
      key,
      value: field[from],
      oldPath: `${fieldPath}.${from}`,
      newPath: `${fieldPath}.search.${key}`,
      diagnostics,
    });
    delete field[from];
  }

  for (const { from, key } of FIELD_STRUCTURAL.form) {
    if (!Object.prototype.hasOwnProperty.call(field, from)) continue;
    assignMovedValue({
      target: form,
      key,
      value: field[from],
      oldPath: `${fieldPath}.${from}`,
      newPath: `${fieldPath}.form.${key}`,
      diagnostics,
    });
    delete field[from];
  }

  for (const [oldKey, newKey] of [['pc', 'pcAttrs'], ['mobile', 'mobileAttrs']]) {
    if (!Object.prototype.hasOwnProperty.call(field, oldKey)) continue;
    const legacySlice = field[oldKey];
    const legacyFormOverride = {};
    if (isPlainObject(legacySlice)) {
      if (legacySlice.component != null) legacyFormOverride.component = legacySlice.component;
      if (legacySlice.type != null) legacyFormOverride.type = legacySlice.type;
    }
    const attrsSource = isPlainObject(legacySlice) ? { ...legacySlice } : legacySlice;
    if (isPlainObject(attrsSource)) {
      delete attrsSource.component;
      delete attrsSource.type;
    }
    const attrsValue = unwrapLegacyPlatformAttrs(attrsSource);
    if (isPlainObject(attrsValue) && Object.keys(attrsValue).length) {
      assignMovedValue({
        target: form,
        key: newKey,
        value: attrsValue,
        oldPath: `${fieldPath}.${oldKey}`,
        newPath: `${fieldPath}.form.${newKey}`,
        diagnostics,
      });
    } else {
      recordDeprecatedKey(diagnostics, {
        path: `${fieldPath}.${oldKey}`,
        replacement: `${fieldPath}.form.${newKey}`,
      });
    }
    if (Object.keys(legacyFormOverride).length) {
      field[`_legacy${oldKey === 'pc' ? 'Pc' : 'Mobile'}FormOverride`] = legacyFormOverride;
      recordDeprecatedKey(diagnostics, {
        path: `${fieldPath}.${oldKey}.{component,type}`,
        replacement: '内部兼容层（无 canonical 等价 key）',
      });
    }
    delete field[oldKey];
  }

  if (Object.keys(column).length) field.column = column;
  if (Object.keys(search).length) field.search = search;
  if (Object.keys(form).length) field.form = form;
  return field;
};

const normalizeFields = (fields, diagnostics) => {
  if (!isPlainObject(fields)) return fields;
  const result = {};
  for (const [fieldKey, field] of Object.entries(fields)) {
    result[fieldKey] = normalizeFieldDefinition(field, `fields.${fieldKey}`, diagnostics);
  }
  return result;
};

const normalizeSearchView = (rawSearch, diagnostics) => {
  if (!isPlainObject(rawSearch)) return rawSearch;
  const search = { ...rawSearch };
  for (const { from, to } of SEMANTIC_STRUCTURAL_MIGRATIONS.listSearch) {
    if (!Object.prototype.hasOwnProperty.call(search, from)) continue;
    assignMovedValue({
      target: search,
      key: to,
      value: search[from],
      oldPath: 'views.list.search.fields',
      newPath: 'views.list.search.fieldList',
      diagnostics,
    });
    delete search[from];
  }
  return search;
};

const normalizeListSearchLayout = (rawList, diagnostics) => {
  if (!isPlainObject(rawList)) return rawList;
  const list = { ...rawList };
  const search = normalizeSearchView(list.search, diagnostics) || {};
  for (const [oldKey, newKey] of listSearchLayoutMoves()) {
    if (!Object.prototype.hasOwnProperty.call(list, oldKey)) continue;
    assignMovedValue({
      target: search,
      key: newKey,
      value: list[oldKey],
      oldPath: `views.list.${oldKey}`,
      newPath: `views.list.search.${newKey}`,
      diagnostics,
    });
    delete list[oldKey];
  }

  if (Object.prototype.hasOwnProperty.call(list, 'searchSheet')) {
    assignMovedValue({
      target: search,
      key: 'mobileSheet',
      value: list.searchSheet,
      oldPath: 'views.list.searchSheet',
      newPath: 'views.list.search.mobileSheet',
      diagnostics,
    });
    delete list.searchSheet;
  }
  if (Object.prototype.hasOwnProperty.call(list, 'mobileSearchTitle')) {
    const mobileSheet = isPlainObject(search.mobileSheet) ? { ...search.mobileSheet } : {};
    assignMovedValue({
      target: mobileSheet,
      key: 'title',
      value: list.mobileSearchTitle,
      oldPath: 'views.list.mobileSearchTitle',
      newPath: 'views.list.search.mobileSheet.title',
      diagnostics,
    });
    search.mobileSheet = mobileSheet;
    delete list.mobileSearchTitle;
  }
  if (Object.prototype.hasOwnProperty.call(list, 'mobileSearchKey')) {
    list._legacyMobileSearchKey = list.mobileSearchKey;
    recordDeprecatedKey(diagnostics, {
      path: 'views.list.mobileSearchKey',
      replacement: SEMANTIC_STRUCTURAL_MIGRATIONS.listIntoSearch
        .find(item => item.from === 'mobileSearchKey').to,
    });
    delete list.mobileSearchKey;
  }
  if (Object.keys(search).length) list.search = search;
  return list;
};

const mergeViewFieldAttrs = ({ fields, view, mode, diagnostics }) => {
  if (!isPlainObject(view) || !isPlainObject(view.fieldAttrs)) return { fields, view };
  const nextFields = { ...(fields || {}) };
  for (const [fieldKey, patch] of Object.entries(view.fieldAttrs)) {
    const rawField = isPlainObject(nextFields[fieldKey]) ? nextFields[fieldKey] : {};
    const field = { ...rawField };
    const targetKey = mode === 'create' ? 'createForm' : 'updateForm';
    const targetPath = `fields.${fieldKey}.${targetKey}.attrs`;
    const canonicalPatch = { attrs: patch };
    if (isPlainObject(field[targetKey]) && !isDeepStrictEqual(field[targetKey], canonicalPatch)) {
      throw new Error(`v7 views.${mode}.fieldAttrs.${fieldKey} 与 canonical key ${targetPath} 同时存在且值不同，请只保留 ${targetPath}`);
    }
    if (!Object.prototype.hasOwnProperty.call(field, targetKey)) field[targetKey] = canonicalPatch;
    nextFields[fieldKey] = field;
    recordDeprecatedKey(diagnostics, {
      path: `views.${mode}.fieldAttrs.${fieldKey}`,
      replacement: SEMANTIC_STRUCTURAL_MIGRATIONS.formView.fieldAttrs,
    });
  }
  const nextView = { ...view };
  delete nextView.fieldAttrs;
  return { fields: nextFields, view: nextView };
};

const normalizeLegacyFormType = (rawView, path, diagnostics) => {
  if (!isPlainObject(rawView) || !Object.prototype.hasOwnProperty.call(rawView, 'type')) return rawView;
  if (rawView.type !== 'form') {
    throw new Error(`v7 ${path}.type 仅兼容旧值 "form"，其他值无法等价迁移`);
  }
  const view = { ...rawView };
  delete view.type;
  recordDeprecatedKey(diagnostics, {
    path: `${path}.type`,
    replacement: SEMANTIC_STRUCTURAL_MIGRATIONS.formView.type,
  });
  return view;
};

const normalizeSheetConfig = (rawSheet, path, diagnostics) => {
  if (!isPlainObject(rawSheet)) return rawSheet;
  const sheet = { ...rawSheet };
  const hasBodyHeight = sheet.bodyHeight != null && sheet.bodyHeight !== '';
  if (hasBodyHeight) {
    if (sheet.maxBodyHeight != null && sheet.maxBodyHeight !== sheet.bodyHeight) {
      throw new Error(`v7 ${path}.bodyHeight 与 ${path}.maxBodyHeight 同时存在且值不同`);
    }
    sheet.maxBodyHeight = sheet.bodyHeight;
    sheet.bodyHeightMode = 'fill';
    delete sheet.bodyHeight;
    recordDeprecatedKey(diagnostics, {
      path: `${path}.bodyHeight`,
      replacement: SEMANTIC_STRUCTURAL_MIGRATIONS.sheet.bodyHeight,
    });
  }
  if (sheet.viewportOffset != null && sheet.viewportOffset !== '') {
    const offset = Number(sheet.viewportOffset);
    if (!Number.isNaN(offset) && (sheet.maxBodyHeight == null || sheet.maxBodyHeight === '')) {
      sheet.maxBodyHeight = `calc(100vh - ${offset}px)`;
    }
    delete sheet.viewportOffset;
    recordDeprecatedKey(diagnostics, {
      path: `${path}.viewportOffset`,
      replacement: SEMANTIC_STRUCTURAL_MIGRATIONS.sheet.viewportOffset,
    });
  }
  if (sheet.autoHeight != null) {
    const mode = sheet.autoHeight ? 'content' : 'fill';
    if (!hasBodyHeight && sheet.bodyHeightMode != null && sheet.bodyHeightMode !== mode) {
      throw new Error(`v7 ${path}.autoHeight 与 ${path}.bodyHeightMode 同时存在且语义冲突`);
    }
    if (!hasBodyHeight && sheet.bodyHeightMode == null) sheet.bodyHeightMode = mode;
    delete sheet.autoHeight;
    recordDeprecatedKey(diagnostics, {
      path: `${path}.autoHeight`,
      replacement: SEMANTIC_STRUCTURAL_MIGRATIONS.sheet.autoHeight,
    });
  }
  return sheet;
};

const normalizeViewStructures = (semantic, diagnostics) => {
  if (!isPlainObject(semantic.views)) return semantic;
  const views = { ...semantic.views };
  let fields = normalizeFields(semantic.fields, diagnostics);
  if (views.list) views.list = normalizeListSearchLayout(views.list, diagnostics);
  if (views.list && isPlainObject(views.list.search) && views.list.search.mobileSheet) {
    views.list = {
      ...views.list,
      search: {
        ...views.list.search,
        mobileSheet: normalizeSheetConfig(
          views.list.search.mobileSheet,
          'views.list.search.mobileSheet',
          diagnostics,
        ),
      },
    };
  }

  if (views.create) {
    views.create = normalizeLegacyFormType(views.create, 'views.create', diagnostics);
    if (views.create.mobileSheet) {
      views.create = {
        ...views.create,
        mobileSheet: normalizeSheetConfig(views.create.mobileSheet, 'views.create.mobileSheet', diagnostics),
      };
    }
    const migrated = mergeViewFieldAttrs({ fields, view: views.create, mode: 'create', diagnostics });
    fields = migrated.fields;
    views.create = migrated.view;
  }
  if (views.update) {
    views.update = normalizeLegacyFormType(views.update, 'views.update', diagnostics);
    if (views.update.mobileSheet) {
      views.update = {
        ...views.update,
        mobileSheet: normalizeSheetConfig(views.update.mobileSheet, 'views.update.mobileSheet', diagnostics),
      };
    }
    if (Array.isArray(views.update.tabList)) {
      views.update = {
        ...views.update,
        tabList: views.update.tabList.map((tab, index) => normalizeLegacyFormType(
          tab,
          `views.update.tabList[${index}]`,
          diagnostics,
        )),
      };
    }
    const migrated = mergeViewFieldAttrs({ fields, view: views.update, mode: 'update', diagnostics });
    fields = migrated.fields;
    views.update = migrated.view;
  }
  return { ...semantic, fields, views };
};

const normalizePageAndIncludes = (semantic, diagnostics) => {
  const out = { ...semantic };
  if (isPlainObject(out.page) && typeof out.page.template === 'string') {
    const page = { ...out.page };
    const targets = page.targets === 'mobile' ? ['mobile'] : page.targets === 'both' ? ['pc', 'mobile'] : ['pc'];
    page.template = Object.fromEntries(targets.map(target => [target, out.page.template]));
    out.page = page;
    recordDeprecatedKey(diagnostics, {
      path: 'page.template(string)',
      replacement: SEMANTIC_STRUCTURAL_MIGRATIONS.pageTemplateString,
    });
  }
  if (Array.isArray(out.includeList)) {
    out.includeList = out.includeList.map((item, index) => {
      if (!isPlainObject(item) || !Object.prototype.hasOwnProperty.call(item, 'target')) return item;
      const result = { ...item };
      assignMovedValue({
        target: result,
        key: 'targets',
        value: result.target,
        oldPath: `includeList[${index}].target`,
        newPath: `includeList[${index}].targets`,
        diagnostics,
      });
      delete result.target;
      return result;
    });
  }
  return out;
};

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
 * V7 semantic authoring 入口规范化：兼容 key → canonical semantic → defaults
 */
const normalizeSchema = (input, options = {}) => {
  if (!input || typeof input !== 'object') {
    throw new Error('v7 buildPage: semantic must be a non-null object');
  }
  const diagnostics = Array.isArray(options) ? options : options.diagnostics;
  let out = { ...input };
  if (!out.version) out.version = 'v7';
  out = normalizeSemanticViewKeys(out, diagnostics);
  out = normalizeViewStructures(out, diagnostics);
  out = normalizePageAndIncludes(out, diagnostics);
  out.layout = getEffectiveLayout(out);
  out = normalizeComponentVueProps(out);
  return out;
};

/** @deprecated 同名别名，兼容旧文档与调用方 */
const normalizeSemantic = normalizeSchema;

module.exports = { normalizeSchema, normalizeSemantic };
