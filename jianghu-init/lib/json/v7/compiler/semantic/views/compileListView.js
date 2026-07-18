'use strict';

/**
 * views.list -> collection IR
 *
 * 本文件是列表语义 key 到组件 props 的唯一编译入口。builders 只消费这里产出的
 * collection IR，不再解释 views.list。
 */

const { normalizeActionList } = require('../../../actionIntent');

const pickFieldDef = (fields, key) => (fields && fields[key]) || null;

const fieldKeyToSearchField = (fieldsDict, key) => {
  const field = pickFieldDef(fieldsDict, key);
  const form = field && field.form && typeof field.form === 'object' ? field.form : {};
  const search = field && field.search && typeof field.search === 'object' ? field.search : {};
  const result = { key, label: (field && field.label) || key, type: form.type || (field && field.type) || 'text' };
  if (search.op) result.op = search.op;
  if (form.options != null) result.options = form.options;
  return result;
};

const mergeSearchFieldDef = (fieldsDict, fieldConfig) => {
  const key = fieldConfig.field || fieldConfig.key;
  if (!key) throw new Error('v7 expandCrudPage: search 项须含 field 或 key');
  const result = fieldKeyToSearchField(fieldsDict, key);
  if (fieldConfig.label) result.label = fieldConfig.label;
  if (fieldConfig.type) result.type = fieldConfig.type;
  if (fieldConfig.op) result.op = fieldConfig.op;
  if (fieldConfig.options != null) result.options = fieldConfig.options;
  return result;
};

const fieldKeyToFilterField = (fieldsDict, key) => {
  const field = pickFieldDef(fieldsDict, key);
  const form = field && field.form && typeof field.form === 'object' ? field.form : {};
  const result = { key, label: (field && field.label) || key, type: form.type || (field && field.type) || 'text' };
  if (form.options != null) result.options = form.options;
  return result;
};

const mergeFilterFieldDef = (fieldsDict, fieldConfig) => {
  const key = fieldConfig.field || fieldConfig.key;
  if (!key) throw new Error('v7 expandCrudPage: filter 项须含 field 或 key');
  if (fieldConfig.type === 'keyword') {
    const keys = fieldConfig.defaultKeys || fieldConfig.fields || fieldConfig.keys;
    if (!Array.isArray(keys) || !keys.length) {
      throw new Error('v7 expandCrudPage: filter keyword 须含 fields / defaultKeys / keys 数组');
    }
    const placeholder = fieldConfig.placeholder || fieldConfig.label || '筛选';
    return { key: 'keyword', type: 'keyword', keys, label: placeholder, placeholder };
  }
  const result = fieldKeyToFilterField(fieldsDict, key);
  if (fieldConfig.label) result.label = fieldConfig.label;
  if (fieldConfig.type) result.type = fieldConfig.type;
  if (fieldConfig.options != null) result.options = fieldConfig.options;
  if (Array.isArray(fieldConfig.keys) && fieldConfig.keys.length) result.keys = fieldConfig.keys;
  if (fieldConfig.exact != null) result.exact = fieldConfig.exact;
  if (fieldConfig.placeholder) result.placeholder = fieldConfig.placeholder;
  return result;
};

const resolveListFilterBlock = listView => {
  if (listView.tableFilter != null) return listView.tableFilter;
  if (listView.filter != null && typeof listView.filter === 'object') return listView.filter;
  if (listView.filters != null) return listView.filters;
  return null;
};

const parseListFieldBlock = (block, listKey = 'fieldList') => {
  const items = [];
  const seen = new Set();

  const pushKey = key => {
    const normalizedKey = typeof key === 'string' ? key.trim() : '';
    if (!normalizedKey || seen.has(normalizedKey)) return;
    seen.add(normalizedKey);
    items.push({ kind: 'key', def: normalizedKey });
  };

  const pushObject = definition => {
    if (!definition || typeof definition !== 'object') return;
    const key = definition.type === 'keyword' ? 'keyword' : (definition.field || definition.key);
    if (!key || seen.has(key)) return;
    seen.add(key);
    items.push({ kind: 'obj', def: definition });
  };

  if (!block) return items;
  if (Array.isArray(block)) {
    for (const entry of block) {
      if (typeof entry === 'string') pushKey(entry);
      else pushObject(entry);
    }
    return items;
  }
  if (typeof block !== 'object') return items;

  if (block.keyword && typeof block.keyword === 'object'
      && Array.isArray(block.keyword.fields) && block.keyword.fields.length) {
    pushObject({
      key: 'keyword',
      type: 'keyword',
      label: block.keyword.placeholder || '搜索',
      placeholder: block.keyword.placeholder,
      defaultKeys: block.keyword.fields,
    });
  }
  if (Array.isArray(block[listKey])) {
    for (const entry of block[listKey]) {
      if (typeof entry === 'string') pushKey(entry);
      else pushObject(entry);
    }
  }
  return items;
};

const compileSearch = (listView, fieldsDict) => {
  const searchFieldList = [];
  let keywordConfig = null;

  for (const { kind, def } of parseListFieldBlock(listView.search)) {
    if (kind === 'obj' && def.type === 'keyword') {
      const keywordFieldList = Array.isArray(def.defaultKeys)
        ? def.defaultKeys.map(key => {
            const field = pickFieldDef(fieldsDict, key);
            return { text: (field && field.label) || key, value: key };
          })
        : [];
      keywordConfig = { keywordFieldList };
      if (def.label) keywordConfig.keywordPlaceholder = def.label;
      searchFieldList.push({ key: def.key || 'keyword', type: 'keyword', label: def.label || '搜索' });
    } else if (kind === 'key') {
      searchFieldList.push(fieldKeyToSearchField(fieldsDict, def));
    } else {
      searchFieldList.push(mergeSearchFieldDef(fieldsDict, def));
    }
  }

  return { searchFieldList, keywordConfig };
};

const compileFilterList = (listView, fieldsDict) => {
  const normal = [];
  const keywords = [];
  for (const { kind, def } of parseListFieldBlock(resolveListFilterBlock(listView), 'fields')) {
    const item = kind === 'key'
      ? fieldKeyToFilterField(fieldsDict, def)
      : mergeFilterFieldDef(fieldsDict, def);
    if (item.type === 'keyword') keywords.push(item);
    else normal.push(item);
  }
  return [...normal, ...keywords];
};

const normalizeColumnEntry = column => {
  if (typeof column === 'string') {
    const key = column.trim();
    if (!key) throw new Error('v7 expandCrudPage: columns 内含空字符串');
    return { key, slot: null, width: null };
  }
  if (column && typeof column === 'object') {
    const key = column.field || column.key || column.value;
    if (!key || typeof key !== 'string') throw new Error('v7 expandCrudPage: column 对象须含 field/key/value');
    return {
      key: key.trim(),
      width: column.width != null ? column.width : null,
      class: column.class != null ? column.class : null,
      cellClass: column.cellClass != null ? column.cellClass : null,
      align: column.align != null ? column.align : null,
      span: column.span != null ? column.span : null,
    };
  }
  throw new Error('v7 expandCrudPage: columns 项须为 string 或对象');
};

const columnEntryToHeader = (fieldsDict, entry, options = {}) => {
  const field = pickFieldDef(fieldsDict, entry.key);
  const header = { text: (field && field.label) || entry.key, value: entry.key };
  for (const prop of ['width', 'align', 'class', 'cellClass']) {
    const column = field && field.column && typeof field.column === 'object' ? field.column : {};
    const value = entry[prop] != null ? entry[prop] : column[prop];
    if (value != null) header[prop] = value;
  }
  if (entry.span != null) header.span = entry.span;
  if (options.mobileListLayout) {
    if (options.isFirstColumn) header.isTitle = true;
    header.isSimpleMode = true;
  }
  return header;
};

const resolveColumns = (listView, target) => {
  const columns = Array.isArray(listView.columnList) ? listView.columnList : [];
  if (!columns.length) throw new Error('v7 expandCrudPage: 已声明 views.list 时 columnList 不能为空');
  if (target === 'mobile' && Array.isArray(listView.mobileColumnList) && listView.mobileColumnList.length) {
    return { columns: listView.mobileColumnList, source: 'mobileColumnList' };
  }
  return { columns, source: 'columnList' };
};

const applyListDetailVariants = (headers, layout, target) => {
  const variants = layout && layout.list && layout.list.variants;
  const platformVariants = variants && variants[target === 'mobile' ? 'mobile' : 'pc'];
  if (!platformVariants || typeof platformVariants !== 'object') return headers;
  return headers.map(header => {
    const variant = platformVariants[header.value];
    return variant && variant.span != null ? { ...header, span: variant.span } : header;
  });
};

const mapToolbarToken = token => {
  if (token && typeof token === 'object') return token;
  if (token === 'add') return { label: '新增', uiAction: 'create' };
  if (token === 'delete') return { label: '删除', id: 'batchDeleteItem' };
  return { label: String(token), uiAction: String(token) };
};

const mapRowToken = token => {
  if (token && typeof token === 'object') return token;
  if (token === 'edit') return { label: '编辑', uiAction: 'update' };
  if (token === 'delete') return { label: '删除', uiAction: 'delete' };
  return { label: String(token), uiAction: String(token) };
};

const resolveCollectionChildren = (semantic, target) => {
  const listSlots = semantic.slots && semantic.slots.list;
  if (!listSlots || typeof listSlots !== 'object') return [];
  const platformKey = target === 'mobile' ? 'mobile' : 'pc';
  const platformSlots = listSlots[platformKey] && typeof listSlots[platformKey] === 'object'
    ? listSlots[platformKey]
    : (platformKey === 'mobile' && listSlots.mobild && typeof listSlots.mobild === 'object'
      ? listSlots.mobild
      : null);
  if (!platformSlots || typeof platformSlots !== 'object') return [];
  const children = platformSlots.children;
  if (Array.isArray(children)) return children.filter(item => typeof item === 'string' && item.trim());
  if (typeof children === 'string' && children.trim()) return [children.trim()];
  return [];
};

const COLUMN_SETTING_INCLUDE = { type: 'html', path: 'component/tableColumnSettingBtn.html' };

/** 列设置插槽 wiring：只返回补丁，不 mutate semantic。 */
const buildColumnSettingWiring = ({ collectionProps, collectionChildren, headers, target, component }) => {
  if (target !== 'pc' || component !== 'Table') return null;
  const html = collectionChildren.filter(item => typeof item === 'string').join('\n');
  if (!/table-column-setting-btn/i.test(html)) return null;
  if (!/:headers\s*=|:headers="|@change\s*=\s*["']headers\s*=/i.test(html)) return null;

  collectionProps.headersBinding = 'headers';
  return {
    commonDataHeaders: JSON.parse(JSON.stringify(headers)),
    includeListEntry: COLUMN_SETTING_INCLUDE,
  };
};

const compileListView = ({ semantic, view, fields, target, layout, component, listLayout }) => {
  const mobileListLayout = target === 'mobile' && component === 'List';
  const { columns, source: columnsSource } = resolveColumns(view, target);
  let headers = columns
    .map(normalizeColumnEntry)
    .map((entry, index) => columnEntryToHeader(fields, entry, {
      mobileListLayout,
      isFirstColumn: index === 0,
    }));
  headers = applyListDetailVariants(headers, layout, target);

  const { searchFieldList, keywordConfig } = compileSearch(view, fields);
  const filterList = compileFilterList(view, fields);
  const toolbarActions = Array.isArray(view.headActionList)
    ? normalizeActionList(view.headActionList.map(mapToolbarToken), 'toolbar', 'views.list.headActionList')
    : [];
  const mobileCardList = target === 'mobile' && listLayout === 'card';
  const tableKey = (typeof view.tableKey === 'string' && view.tableKey.trim()) || 'mainTable';
  const props = {
    headers,
    serverPagination: !!view.serverPagination,
    pageSize: Number(view.pageSize) > 0 ? Number(view.pageSize) : 50,
    selectable: !!view.selectable,
  };

  if (view.dataTableProps && typeof view.dataTableProps === 'object') props.dataTableProps = view.dataTableProps;
  if (toolbarActions.length && !mobileCardList) props.headActionList = toolbarActions;
  if (Array.isArray(view.rowActionList) && view.rowActionList.length) {
    props.rowActionList = normalizeActionList(
      view.rowActionList.map(mapRowToken),
      'row',
      'views.list.rowActionList',
    );
  }
  if (view.orderBy != null) props.orderBy = view.orderBy;
  if (view.rowSlot && typeof view.rowSlot === 'object') props.rowSlot = view.rowSlot;
  if (target === 'mobile' && component === 'List' && view.mobileItemAction != null) {
    props.mobileItemAction = view.mobileItemAction;
  }
  if (target === 'pc' && component === 'Table' && filterList.length) props.filterList = filterList;
  const listCols = layout.list && layout.list.cols;
  if (mobileCardList && listCols != null) props.cols = listCols;

  const collectionChildren = resolveCollectionChildren(semantic, target);
  const columnSettingWiring = buildColumnSettingWiring({
    collectionProps: props,
    collectionChildren,
    headers,
    target,
    component,
  });

  return {
    collection: { component, key: tableKey, props },
    collectionChildren,
    columnSettingWiring,
    searchFieldList,
    keywordConfig,
    searchConfig: view.search && typeof view.search === 'object'
      ? {
          btnText: view.search.btnText,
          btnIcon: view.search.btnIcon,
        }
      : {},
    filterList,
    mobileToolbarActions: mobileCardList ? toolbarActions : [],
    mobileSearch: {
      key: (typeof view._legacyMobileSearchKey === 'string' && view._legacyMobileSearchKey.trim()) || 'mobileSearch',
      buttonLabel: (view.search && view.search.mobileBtnText) || '搜索',
      buttonClass: (view.search && view.search.mobileBtnClass) || '!rounded-xl px-2 border border-solid border-gray-300',
      icon: (view.search && view.search.mobileBtnIcon) || 'filter-2',
      title: (view.search && view.search.mobileSheet && view.search.mobileSheet.title) || '搜索',
      sheet: view.search && view.search.mobileSheet,
    },
    meta: {
      pageSize: props.pageSize,
      orderBy: props.orderBy != null ? props.orderBy : null,
      tableKey,
      columnsSource,
    },
  };
};

module.exports = { compileListView };
