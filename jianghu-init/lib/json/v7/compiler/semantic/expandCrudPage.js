'use strict';

/**
 * V7 语义展开：fields / views / platform / layout → pageContent + actionContent 节点树
 *
 * 参数映射总表：lib/json/v7/docs/semantic-to-component-mapping.md
 * 常量索引：lib/json/v7/semantic-mapping.js
 *
 * 本文件职责：
 *   - platform token → 选 Table|List、CreateDrawer|FormSheet 等（见 policy.js）
 *   - views.* + fields 字典 → 节点 props（headers、fieldList、searchFieldList…）
 *   - 输出 IR 后交 builders.js 组装树，再经 schemaPipeline.parseSchema 解析绑定
 */

const { flattenDataSource } = require('./normalizeDataSource');
const { resolveIncludeList } = require('./resolveIncludeList');
const { normalizePageContentOverride } = require('./pageContentShape');
const { resolveTargetPlatform, resolvePageType } = require('../../policy');
const { validateCrudSemantic, resolvePageMeta } = require('../../authoringMode');
const {
  getEffectivePlatformPolicy,
  resolveListLayoutFilter,
  resolvePlatformComponentTokens,
  resolveViewListComponent,
  resolveViewFormComponent,
} = require('../../policy');
const { getEffectiveLayout } = require('../../defaults');
const { buildListRegionsPlan } = require('./buildListRegionsPlan');
const {
  buildCollectionBlock,
  buildFilterBlock,
  buildFormBlock,
  composeMobileToolbar,
  BLOCK_V_SPACER,
} = require('../../builders');
const { fieldKeyToFormField, applyFieldAttrs } = require('../../fieldFormProps');

// ─── 字段工具函数 ──────────────────────────────────────────────────────────────

const pickFieldDef = (fields, key) => (fields && fields[key]) || null;

const fieldKeyToSearchField = (fieldsDict, key) => {
  const f = pickFieldDef(fieldsDict, key);
  const base = { key, label: (f && f.label) || key, type: (f && f.type) || 'text' };
  if (f && f.op) base.op = f.op;
  if (f && f.options != null) base.options = f.options;
  return base;
};

const mergeSearchFieldDef = (fieldsDict, f) => {
  const key = f.field || f.key;
  if (!key) throw new Error('v7 expandCrudPage: search 项须含 field 或 key');
  const base = fieldKeyToSearchField(fieldsDict, key);
  if (f.label) base.label = f.label;
  if (f.type) base.type = f.type;
  if (f.op) base.op = f.op;
  if (f.options != null) base.options = f.options;
  return base;
};

const fieldKeyToFilterField = (fieldsDict, key) => {
  const f = pickFieldDef(fieldsDict, key);
  const base = { key, label: (f && f.label) || key, type: (f && f.type) || 'text' };
  if (f && f.options != null) base.options = f.options;
  return base;
};

const mergeFilterFieldDef = (fieldsDict, f) => {
  const key = f.field || f.key;
  if (!key) throw new Error('v7 expandCrudPage: filter 项须含 field 或 key');
  if (f.type === 'keyword') {
    const keys = f.defaultKeys || f.fields || f.keys;
    if (!Array.isArray(keys) || !keys.length) {
      throw new Error('v7 expandCrudPage: filter keyword 须含 fields / defaultKeys / keys 数组');
    }
    const placeholder = f.placeholder || f.label || '筛选';
    return { key: 'keyword', type: 'keyword', keys, label: placeholder, placeholder };
  }
  const base = fieldKeyToFilterField(fieldsDict, key);
  if (f.label) base.label = f.label;
  if (f.type) base.type = f.type;
  if (f.options != null) base.options = f.options;
  if (Array.isArray(f.keys) && f.keys.length) base.keys = f.keys;
  if (f.exact != null) base.exact = f.exact;
  if (f.placeholder) base.placeholder = f.placeholder;
  return base;
};

/**
 * 解析表格二次筛选块（与 search 同形）
 * · filter 为对象 → 客户端 filterList
 * · filter 为字符串 → 仅布局 inline|sheet，不作为筛选字段
 * · tableFilter / filters 为别名
 */
const resolveListFilterBlock = listView => {
  if (listView.tableFilter != null) return listView.tableFilter;
  if (listView.filter != null && typeof listView.filter === 'object') return listView.filter;
  if (listView.filters != null) return listView.filters;
  return null;
};

/**
 * 与 search 同形的字段块：数组 | { keyword, fields }
 * @returns {{ kind: 'key'|'obj', def: * }[]}
 */
const parseListFieldBlock = block => {
  const items = [];
  const seen = new Set();

  const pushKey = key => {
    const k = typeof key === 'string' ? key.trim() : '';
    if (!k || seen.has(k)) return;
    seen.add(k);
    items.push({ kind: 'key', def: k });
  };

  const pushObj = def => {
    if (!def || typeof def !== 'object') return;
    const key = def.type === 'keyword' ? 'keyword' : (def.field || def.key);
    if (!key || seen.has(key)) return;
    seen.add(key);
    items.push({ kind: 'obj', def });
  };

  if (!block) return items;

  if (Array.isArray(block)) {
    for (const entry of block) {
      if (typeof entry === 'string') pushKey(entry);
      else pushObj(entry);
    }
    return items;
  }

  if (typeof block === 'object') {
    if (block.keyword && typeof block.keyword === 'object' && Array.isArray(block.keyword.fields) && block.keyword.fields.length) {
      pushObj({
        key: 'keyword',
        type: 'keyword',
        label: block.keyword.placeholder || '搜索',
        placeholder: block.keyword.placeholder,
        defaultKeys: block.keyword.fields,
      });
    }
    if (Array.isArray(block.fields)) {
      for (const entry of block.fields) {
        if (typeof entry === 'string') pushKey(entry);
        else pushObj(entry);
      }
    }
  }
  return items;
};

/**
 * views.list.search → 服务端搜索（jh-search / SearchSheet）
 *
 * @returns {{ searchFieldList: Array, keywordConfig: object|null }}
 */
const buildListSearchResult = (listView, fieldsDict) => {
  const searchFieldList = [];
  let keywordConfig = null;

  for (const { kind, def } of parseListFieldBlock(listView.search)) {
    if (kind === 'obj' && def.type === 'keyword') {
      const keywordFieldList = Array.isArray(def.defaultKeys)
        ? def.defaultKeys.map(k => {
            const f = pickFieldDef(fieldsDict, k);
            return { text: (f && f.label) || k, value: k };
          })
        : [];
      keywordConfig = { keywordFieldList };
      if (def.label) keywordConfig.keywordPlaceholder = def.label;
      searchFieldList.push({ key: def.key || 'keyword', type: 'keyword', label: def.label || '搜索' });
    } else if (kind === 'key') {
      searchFieldList.push(fieldKeyToSearchField(fieldsDict, def));
    } else if (kind === 'obj') {
      searchFieldList.push(mergeSearchFieldDef(fieldsDict, def));
    }
  }

  return { searchFieldList, keywordConfig };
};

/**
 * views.list.filter（或 filters）→ PC Table filterList（jh-table-filter，客户端二次筛选）
 *
 * 语法与 search 相同（含 keyword）；不写 op，不落 serverSearchWhere。
 *
 * @returns {Array}
 */
const buildListFilterResult = (listView, fieldsDict) => {
  const normal = [];
  const keywords = [];
  for (const { kind, def } of parseListFieldBlock(resolveListFilterBlock(listView))) {
    const item = kind === 'key'
      ? fieldKeyToFilterField(fieldsDict, def)
      : mergeFilterFieldDef(fieldsDict, def);
    if (item.type === 'keyword') keywords.push(item);
    else normal.push(item);
  }
  return [...normal, ...keywords];
};

const normalizeColumnEntry = col => {
  if (typeof col === 'string') {
    const key = col.trim();
    if (!key) throw new Error('v7 expandCrudPage: columns 内含空字符串');
    return { key, slot: null, width: null };
  }
  if (col && typeof col === 'object') {
    const key = col.field || col.key || col.value;
    if (!key || typeof key !== 'string') throw new Error('v7 expandCrudPage: column 对象须含 field/key/value');
    return {
      key: key.trim(),
      slot: col.slot && typeof col.slot === 'object' ? col.slot : null,
      width: col.width != null ? col.width : null,
      class: col.class != null ? col.class : null,
      cellClass: col.cellClass != null ? col.cellClass : null,
      align: col.align != null ? col.align : null,
      span: col.span != null ? col.span : null,
    };
  }
  throw new Error('v7 expandCrudPage: columns 项须为 string 或对象');
};

/**
 * views.list.columns | mobileColumns 每项
 *   → Table|List.props.headers[]：{ text, value, width?, align?, class?, cellClass?, isTitle?, isSimpleMode? }
 */
const pickColumnHeaderProp = (entry, f, prop) => {
  if (entry[prop] != null) return entry[prop];
  if (f && f[prop] != null) return f[prop];
  return null;
};

const columnEntryToHeader = (fieldsDict, entry, opts = {}) => {
  const f = pickFieldDef(fieldsDict, entry.key);
  const h = { text: (f && f.label) || entry.key, value: entry.key };
  if (entry.slot) h.slot = entry.slot;
  // columns 对象 > fields 字典
  for (const prop of ['width', 'align', 'class', 'cellClass']) {
    const v = pickColumnHeaderProp(entry, f, prop);
    if (v != null) h[prop] = v;
  }
  if (entry.span != null) h.span = entry.span;
  // 移动端 List：第一项标题、其余详情（对齐 jh-mobile-page-v4 + jh-list 约定）
  if (opts.mobileListLayout) {
    if (opts.isFirstColumn) {
      h.isTitle = true;
      h.isSimpleMode = true;
    } else {
      h.isSimpleMode = true;
    }
  }
  return h;
};

/**
 * 列表列：PC 用 columns；移动端优先 mobileColumns，否则回退 columns
 */
const resolveListColumns = (listView, target) => {
  const base = Array.isArray(listView.columns) ? listView.columns : [];
  if (!base.length) {
    throw new Error('v7 expandCrudPage: 已声明 views.list 时 columns 不能为空');
  }
  if (target === 'mobile') {
    const mobile = Array.isArray(listView.mobileColumns) ? listView.mobileColumns : [];
    if (mobile.length) return mobile;
  }
  return base;
};

/**
 * fields.{key} + views.create|update.fields[] 中的 key
 *   → jh-form / CreateDrawer|FormSheet 的 props.fieldList 项
 * 见 fieldFormProps.fieldKeyToFormField；interaction / fieldAttrs 在本文件合并
 */

const mapToolbarToken = t => {
  // 对象写法直接透传（与 v6 headActionList 格式一致）
  if (t && typeof t === 'object') return t;
  // 字符串 token 映射
  if (t === 'add') return { label: '新增', intent: 'create' };
  if (t === 'delete') return { label: '删除', id: 'batchDeleteItem' };
  return { label: String(t), id: String(t) };
};

const mapRowToken = t => {
  // 对象写法直接透传（与 v6 rowActionList 格式一致）
  if (t && typeof t === 'object') return t;
  // 字符串 token 映射
  if (t === 'edit') return { label: '编辑', intent: 'update' };
  if (t === 'delete') return { label: '删除', intent: 'delete' };
  return { label: String(t), id: String(t) };
};

// ─── interaction 条件表达式（Req 5）──────────────────────────────────────────

const CONDITION_KEYS = ['readonlyWhen', 'visibleWhen', 'disabledWhen'];

const wrapExpr = val => (typeof val === 'string' ? { __expr__: val } : val);

/**
 * 将 interaction 条件合并到 fieldList 项
 * 字符串值 → { __expr__: value }；对象值原样透传；不存在于 fieldList 的 key 静默跳过
 */
const applyInteraction = (fieldList, interaction) => {
  if (!interaction || typeof interaction !== 'object') return fieldList;
  return fieldList.map(item => {
    const cond = interaction[item.key];
    if (!cond || typeof cond !== 'object') return item;
    const patch = {};
    for (const k of CONDITION_KEYS) {
      if (cond[k] !== undefined) patch[k] = wrapExpr(cond[k]);
    }
    return Object.keys(patch).length ? { ...item, ...patch } : item;
  });
};

// ─── update payload（Req 4）──────────────────────────────────────────────────

/**
 * views.update → pushUpdateForm 的 props 来源
 *
 * | 语义 | → 节点 props |
 * | views.update.title | title |
 * | views.update.tabs[].{key,title,fields,actions,interaction} | tabList[]（actions 由 builders 映射） |
 * | views.update.fields[] | fieldList（mode=fields） |
 * | views.update.actions | actions（fields 模式，由 builders 映射） |
 */
const buildUpdatePayload = (updateView, fieldsDict, target = 'pc') => {
  if (Array.isArray(updateView.tabs) && updateView.tabs.length) {
    const tabList = updateView.tabs.map(tab => {
      const out = { key: tab.key, title: tab.title };
      if (tab.actions) out.actions = tab.actions;
      if (Array.isArray(tab.fields)) {
        out.fieldList = tab.fields.map(k => fieldKeyToFormField(fieldsDict, k, target));
      } else {
        out.fieldList = [];
      }
      // 应用 tab 级别的 interaction
      if (tab.interaction) {
        out.fieldList = applyInteraction(out.fieldList, tab.interaction);
      }
      if (tab.fieldAttrs) {
        out.fieldList = applyFieldAttrs(out.fieldList, tab.fieldAttrs);
      }
      return out;
    });
    return { mode: 'tabs', tabList };
  }
  const fieldList = Array.isArray(updateView.fields)
    ? updateView.fields.map(k => fieldKeyToFormField(fieldsDict, k, target))
    : [];
  const payload = { mode: 'fields', fieldList };
  if (updateView.interaction) {
    payload.fieldList = applyInteraction(payload.fieldList, updateView.interaction);
  }
  if (updateView.fieldAttrs) {
    payload.fieldList = applyFieldAttrs(payload.fieldList, updateView.fieldAttrs);
  }
  if (Array.isArray(updateView.actions)) payload.actions = updateView.actions;
  return payload;
};

// ─── layout variants（Req 8）─────────────────────────────────────────────────

/**
 * 根据 layout.{create|update}.variants 注入 fieldList[].span
 * 未在 variants 中声明的字段默认：PC span=1；移动 span=cols（满行）
 */
const applyVariants = (fieldList, layout, target, role = 'create') => {
  const section = layout && layout[role];
  const cols = section && section.cols != null ? Number(section.cols) : 3;
  const variants = section && section.variants;
  const platformKey = target === 'mobile' ? 'mobile' : 'pc';
  const variantMap = variants && variants[platformKey];
  return fieldList.map(f => {
    const v = variantMap && variantMap[f.key];
    if (v && v.span != null) return { ...f, span: v.span };
    if (target === 'mobile') return { ...f, span: cols };
    return { ...f, span: 1 };
  });
};

/**
 * layout.list.variants → List.headers[].span（移动端卡片详情区 grid 跨列）
 */
const applyListDetailVariants = (headers, layout, target) => {
  const variants = layout && layout.list && layout.list.variants;
  if (!variants || !Array.isArray(headers)) return headers;
  const platformKey = target === 'mobile' ? 'mobile' : 'pc';
  const variantMap = variants[platformKey];
  if (!variantMap || typeof variantMap !== 'object') return headers;
  return headers.map(h => {
    const v = variantMap[h.value];
    return (v && v.span != null) ? { ...h, span: v.span } : h;
  });
};

// ─── slots 声明（Req 7）──────────────────────────────────────────────────────

/** slots.list.columns | rowActions：支持 string[]、对象项数组，或 { slotName: ... } 映射（取其键） */
const collectSlotTemplateKeys = decl => {
  if (decl == null) return [];
  if (Array.isArray(decl)) {
    const keys = [];
    for (const item of decl) {
      if (typeof item === 'string' && item.trim()) keys.push(item.trim());
      else if (item && typeof item === 'object') {
        const key = item.field || item.key || item.value;
        if (key && typeof key === 'string') keys.push(key.trim());
      }
    }
    return keys;
  }
  if (typeof decl === 'object') return Object.keys(decl);
  return [];
};

/**
 * 将 slots 声明映射到 collectionProps.slotTemplates、collectionChildren 与 updatePayload
 */
const normalizeSlotHtmlChildren = raw => {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw.filter(s => typeof s === 'string' && s.trim());
  if (typeof raw === 'string' && raw.trim()) return [raw.trim()];
  return [];
};

/** slots.*.pc | slots.*.mobile（兼容 mobild）→ 当前端 template 子节点 */
const resolvePlatformSlotChildren = (sliceRoot, target) => {
  if (!sliceRoot || typeof sliceRoot !== 'object') return [];
  const pk = target === 'mobile' ? 'mobile' : 'pc';
  const slice =
    (sliceRoot[pk] && typeof sliceRoot[pk] === 'object' ? sliceRoot[pk] : null)
    || (pk === 'mobile' && sliceRoot.mobild && typeof sliceRoot.mobild === 'object' ? sliceRoot.mobild : null);
  if (!slice) return [];
  return normalizeSlotHtmlChildren(slice.children);
};

const FORM_SLOT_PLATFORM_KEYS = new Set(['pc', 'mobile', 'mobild', 'fields']);

/**
 * slots.create | slots.update → FormDrawer/FormSheet 的 children（与 list 同形：pc/mobile.children）
 * 另合并 slots.update.{tabKey}.pc.children（多 Tab 按 tab 追加）
 */
const resolveFormSlotChildren = (semantic, target, role) => {
  const root = semantic.slots && semantic.slots[role];
  if (!root || typeof root !== 'object') return [];
  const out = resolvePlatformSlotChildren(root, target).slice();
  for (const [key, val] of Object.entries(root)) {
    if (FORM_SLOT_PLATFORM_KEYS.has(key)) continue;
    if (!val || typeof val !== 'object') continue;
    out.push(...resolvePlatformSlotChildren(val, target));
  }
  return out;
};

const applyFieldSlotMarkers = (fieldList, fieldDecl) => {
  if (!Array.isArray(fieldList) || fieldDecl == null) return fieldList;
  const slotKeys = Array.isArray(fieldDecl) ? fieldDecl : Object.keys(fieldDecl);
  const slotSet = new Set(slotKeys.filter(k => typeof k === 'string' && k.trim()));
  if (!slotSet.size) return fieldList;
  return fieldList.map(f => (slotSet.has(f.key) ? { ...f, slot: true } : f));
};

/** slots.list.pc | slots.list.mobile（兼容误写 mobild）→ 当前端 List/Table 的 template 子节点 */
const assertOverrideKeyShape = (semantic, key) => {
  const val = semantic[key];
  if (val == null || typeof val === 'function') return;
  if (typeof val !== 'object') {
    throw new Error(`v7 expandCrudPage: ${key} 须为 (views, blocks) => 函数，当前为 ${typeof val}`);
  }
  if (Array.isArray(val.children) && val.children.length) {
    throw new Error(
      `v7 expandCrudPage: ${key}.children 不会生效；列表插槽写 slots.list.${key}.children，表单插槽写 slots.create|update.${key}.children（完整 <template v-slot:…> 字符串）`,
    );
  }
};

const resolveListSlotChildren = (semantic, target) => {
  const listSlots = semantic.slots && semantic.slots.list;
  return resolvePlatformSlotChildren(listSlots, target);
};

/** toolbar-append + table-column-setting-btn：自动 headersBinding、初始 headers、引入组件脚本 */
const applyColumnSettingWiring = (semantic, ctx) => {
  const { collectionProps, collectionChildren, headers, target, collectionComponent } = ctx;
  if (target !== 'pc' || collectionComponent !== 'Table') return;
  const html = (collectionChildren || []).filter(s => typeof s === 'string').join('\n');
  if (!/table-column-setting-btn/i.test(html)) return;
  if (!/:headers\s*=|:headers="|@change\s*=\s*["']headers\s*=/i.test(html)) return;

  collectionProps.headersBinding = 'headers';

  semantic.common = semantic.common || {};
  semantic.common.data = semantic.common.data || {};
  if (semantic.common.data.headers == null) {
    semantic.common.data.headers = JSON.parse(JSON.stringify(headers));
  }

  const list = Array.isArray(semantic.includeList) ? semantic.includeList.slice() : [];
  const hasBtn = list.some(
    item => item && String(item.path || '').replace(/\\/g, '/').includes('tableColumnSettingBtn'),
  );
  if (!hasBtn) {
    list.push({ type: 'html', path: 'component/tableColumnSettingBtn.html' });
    semantic.includeList = list;
  }
};

const appendListSlotTemplateChild = (collectionChildren, htmlOrTemplate) => {
  if (!Array.isArray(collectionChildren)) return;
  const s = typeof htmlOrTemplate === 'string' ? htmlOrTemplate.trim() : '';
  if (!s) return;
  const wrapped = /^\s*<template[\s>]/i.test(s)
    ? s
    : `<template v-slot:action="{ item }">${s}</template>`;
  collectionChildren.push(wrapped);
};

const applySlots = (semantic, collectionProps, updatePayload, collectionChildren, collectionComponent, slotCtx) => {
  const slots = semantic.slots;
  if (!slots || typeof slots !== 'object') return slotCtx;

  const listSlots = slots.list;
  if (listSlots) {
    if (collectionComponent === 'Table') {
      const slotTemplates = collectionProps.slotTemplates || {};
      for (const key of collectSlotTemplateKeys(listSlots.columns)) slotTemplates[key] = '';
      for (const key of collectSlotTemplateKeys(listSlots.rowActions)) slotTemplates[key] = '';
      if (Object.keys(slotTemplates).length) collectionProps.slotTemplates = slotTemplates;
    } else if (collectionComponent === 'List') {
      const actionDecl =
        listSlots.action != null
          ? listSlots.action
          : (listSlots.mobile && listSlots.mobile.action != null ? listSlots.mobile.action : null);
      if (typeof actionDecl === 'string') {
        appendListSlotTemplateChild(collectionChildren, actionDecl);
      } else if (actionDecl && typeof actionDecl === 'object' && typeof actionDecl.html === 'string') {
        appendListSlotTemplateChild(collectionChildren, actionDecl.html);
      }
      if (listSlots.rowActions && typeof listSlots.rowActions === 'object' && !Array.isArray(listSlots.rowActions)) {
        const rowActionHtml = listSlots.rowActions.action;
        if (typeof rowActionHtml === 'string' && rowActionHtml.includes('<')) {
          appendListSlotTemplateChild(collectionChildren, rowActionHtml);
        }
      }
      const slotTemplates = collectionProps.slotTemplates || {};
      if (listSlots.columns && typeof listSlots.columns === 'object' && !Array.isArray(listSlots.columns)) {
        for (const [key, val] of Object.entries(listSlots.columns)) {
          if (typeof val === 'string' && val.includes('<')) slotTemplates[`cell-${key}`] = val;
        }
      }
      if (Object.keys(slotTemplates).length) collectionProps.slotTemplates = slotTemplates;
    }
  }

  // create.fields → fieldList 项 slot: true（legacy，与 children 可并存）
  const createSlots = slots.create;
  if (createSlots && slotCtx && Array.isArray(slotCtx.createFields)) {
    slotCtx.createFields = applyFieldSlotMarkers(slotCtx.createFields, createSlots.fields);
  }

  // update.{tabKey}.fields | update.fields（单表单）→ fieldList 项 slot: true
  const updateSlots = slots.update;
  if (updateSlots && updatePayload) {
    if (updatePayload.mode === 'tabs' && Array.isArray(updatePayload.tabList)) {
      for (const tab of updatePayload.tabList) {
        const tabSlotFields = updateSlots[tab.key] && updateSlots[tab.key].fields;
        if (!tabSlotFields) continue;
        tab.fieldList = applyFieldSlotMarkers(tab.fieldList, tabSlotFields);
      }
    } else if (updatePayload.mode === 'fields' && Array.isArray(updatePayload.fieldList)) {
      updatePayload.fieldList = applyFieldSlotMarkers(updatePayload.fieldList, updateSlots.fields);
    }
  }

  return slotCtx;
};

// ─── 主函数 ────────────────────────────────────────────────────────────────────

/**
 * V7 semantic → 平台无关 IR + 组装后的 pageContent/actionContent
 *
 * expandCrudPage 职责：
 *   1. 字段字典 → headers / searchFieldList / fieldList（纯语义展开）
 *   2. 解析 platform policy（layout/filter/form 类型）
 *   3. 调用 platform builders 组装节点树
 *
 * layout / platform 未写时使用 defaults.js、policy.DEFAULT_PLATFORM_TOKENS。
 */
const expandCrudPage = semantic => {
  validateCrudSemantic(semantic);
  assertOverrideKeyShape(semantic, 'pc');
  assertOverrideKeyShape(semantic, 'mobile');

  const fieldsDict = semantic.fields && typeof semantic.fields === 'object' ? semantic.fields : {};
  const views = semantic.views && typeof semantic.views === 'object' ? semantic.views : {};
  const hasListView = !!(views.list && typeof views.list === 'object');
  const listView = hasListView ? views.list : {};
  const layout = getEffectiveLayout(semantic);

  // ── 1. platform：仅决定「用哪种组件」，见 policy.resolveView* ──
  const target = resolveTargetPlatform(semantic);
  const pageType = resolvePageType(semantic, target);
  const policy = getEffectivePlatformPolicy(semantic, target);
  const componentTokens = resolvePlatformComponentTokens(semantic, target);
  let listLayout = 'table';
  let filterType = 'inline';
  if (hasListView) {
    ({ layout: listLayout, filter: filterType } = resolveListLayoutFilter(semantic, target, listView));
  }
  const listToken = componentTokens.list;
  const createToken = componentTokens.create;
  const updateToken = componentTokens.update;
  const collectionComponent = hasListView
    ? resolveViewListComponent(listToken, listLayout)
    : 'Table';
  const createFormComponent = resolveViewFormComponent(createToken, policy.create && policy.create.layout, 'create');
  const updateFormComponent = resolveViewFormComponent(updateToken, policy.update && policy.update.layout, 'update');

  let columns = [];
  let headers = [];
  let searchFieldList = [];
  let keywordConfig = null;
  let filterList = [];
  let tableKey = 'mainTable';
  let toolbarActions = [];
  let mobileCardList = false;
  let collectionProps = {};
  let collectionChildren = [];
  const mobileListLayout = hasListView && target === 'mobile' && collectionComponent === 'List';

  // ── 2. views.list → collection.props（headers/分页/工具栏/行操作）──
  if (hasListView) {
    columns = resolveListColumns(listView, target);
    headers = columns
      .map(normalizeColumnEntry)
      .map((e, i) => columnEntryToHeader(fieldsDict, e, { mobileListLayout, isFirstColumn: i === 0 }));
    headers = applyListDetailVariants(headers, layout, target);
    ({ searchFieldList, keywordConfig } = buildListSearchResult(listView, fieldsDict));
    filterList = buildListFilterResult(listView, fieldsDict);

    tableKey = (typeof listView.tableKey === 'string' && listView.tableKey.trim()) || 'mainTable';

    toolbarActions = Array.isArray(listView.toolbarActions)
      ? listView.toolbarActions.map(mapToolbarToken)
      : [];
    mobileCardList = target === 'mobile' && listLayout === 'card';

    collectionProps = {
      headers,
      serverPagination: !!listView.serverPagination,
      pageSize: Number(listView.pageSize) > 0 ? Number(listView.pageSize) : 50,
      selectable: !!listView.selectable,
    };
    // 移动端 List 顶栏工具按钮改由 buildSheetFilter → HStack；PC Table 仍用 headActionList
    if (toolbarActions.length && !mobileCardList) {
      collectionProps.headActionList = toolbarActions;
    }
    if (Array.isArray(listView.rowActions) && listView.rowActions.length) {
      collectionProps.rowActionList = listView.rowActions.map(mapRowToken);
    }
    if (listView.orderBy != null) collectionProps.orderBy = listView.orderBy;
    if (listView.rowSlot && typeof listView.rowSlot === 'object') collectionProps.rowSlot = listView.rowSlot;
    // PC Table：客户端二次筛选（jh-table-filter）；语法同 search，含 keyword
    if (target === 'pc' && collectionComponent === 'Table' && filterList.length) {
      collectionProps.filterList = filterList;
    }
    // layout.list.cols：移动端 List 详情区 grid 列数（默认 2）
    const listCols = layout.list && layout.list.cols;
    if (mobileCardList && listCols != null) collectionProps.cols = listCols;

    collectionChildren = resolveListSlotChildren(semantic, target);
  }

  // ── 3. views.create / views.update → IR.createFields | updatePayload ──
  // create: title,fields,interaction,actions,saveTipBeforeClose + layout.create → pushCreateForm → props
  // update: title,tabs|fields,interaction + slots.update → pushUpdateForm → props
  const createView = views.create && typeof views.create === 'object' ? views.create : {};
  const updateView = views.update && typeof views.update === 'object' ? views.update : {};
  let createFields = Array.isArray(createView.fields)
    ? createView.fields.map(k => fieldKeyToFormField(fieldsDict, k, target))
    : [];
  const updatePayload = buildUpdatePayload(updateView, fieldsDict, target);

  // 应用 create interaction
  if (createView.interaction) {
    createFields = applyInteraction(createFields, createView.interaction);
  }
  if (createView.fieldAttrs) {
    createFields = applyFieldAttrs(createFields, createView.fieldAttrs);
  }

  createFields = applyVariants(createFields, layout, target, 'create');

  if (updatePayload.mode === 'tabs' && Array.isArray(updatePayload.tabList)) {
    updatePayload.tabList = updatePayload.tabList.map(tab => ({
      ...tab,
      fieldList: applyVariants(tab.fieldList || [], layout, target, 'update'),
    }));
  } else if (updatePayload.mode === 'fields' && Array.isArray(updatePayload.fieldList)) {
    updatePayload.fieldList = applyVariants(updatePayload.fieldList, layout, target, 'update');
  }

  // 应用 slots 声明
  const createFormChildren = resolveFormSlotChildren(semantic, target, 'create');
  const updateFormChildren = resolveFormSlotChildren(semantic, target, 'update');
  const slotCtx = applySlots(
    semantic,
    collectionProps,
    updatePayload,
    collectionChildren,
    collectionComponent,
    { createFields },
  );
  if (slotCtx && Array.isArray(slotCtx.createFields)) {
    createFields = slotCtx.createFields;
  }
  if (hasListView) {
    applyColumnSettingWiring(semantic, {
      collectionProps,
      collectionChildren,
      headers,
      target,
      collectionComponent,
    });
  }

  // beforeCloseConfirm
  const createSaveTipBeforeClose = !!(createView.beforeCloseConfirm || createView.saveTipBeforeClose);

  // layout.create.cols
  const createCols = layout.create && layout.create.cols;
  const updateCols = layout.update && layout.update.cols;

  const pageTitle = (semantic.page && semantic.page.title) || (semantic.page && semantic.page.name) || (semantic.page && semantic.page.id) || '';
  const helpDoc = (semantic.page && semantic.page.helpDoc) || null;
  const regions = buildListRegionsPlan(Object.assign({}, semantic, { layout }));

  // 3. IR（平台无关的中间表示）
  const ir = {
    pageTitle,
    helpDoc,
    searchFieldList,
    keywordConfig,
    filterList,
    listView,
    toolbarActions: mobileCardList ? toolbarActions : [],
    collection: hasListView
      ? { component: collectionComponent, key: tableKey, props: collectionProps }
      : null,
    collectionChildren,
    createFormChildren,
    updateFormChildren,
    regions,
    layout,
    createFields,
    createTitle: createView.title || '新建',
    createSaveTipBeforeClose,
    createCols,
    updateCols,
    createActions: Array.isArray(createView.actions) ? createView.actions : null,
    createSheet: createView.sheet,
    updateSheet: updateView.sheet,
    updatePayload,
    updateTitle: updateView.title || '编辑',
    createFormComponent,
    updateFormComponent,
  };

  // 4. 调用 builders 组装节点树
  const { pageHeaderNode, toolbarParts, extraPageNodes, extraActionNodes } = buildFilterBlock(ir, filterType);
  const collectionBlock = hasListView ? buildCollectionBlock(ir, listLayout) : null;
  const formActionNodes = buildFormBlock(ir);

  const findFormNode = (nodes, key) => {
    for (const n of nodes || []) {
      if (!n || typeof n !== 'object' || n.key !== key) continue;
      if (key === 'create' && (n.component === 'CreateDrawer' || n.component === 'FormSheet')) return n;
      if (key === 'update' && (n.component === 'UpdateDrawer' || n.component === 'FormSheet')) return n;
    }
    return null;
  };
  const createFormNode = findFormNode(formActionNodes, 'create');
  const updateFormNode = findFormNode(formActionNodes, 'update');

  let pageContent = {
    component: 'VStack',
    props: { gap: 0 },
    children: [
      pageHeaderNode,
      ...extraPageNodes,
      collectionBlock,
    ].filter(Boolean),
  };
  let actionContent = [
    ...formActionNodes,
    ...extraActionNodes,
  ];

  // 5. 构造 blocks 对象（Req 9, 10）
  // pageHeader：默认组合顶栏；toolbarParts：细粒度节点，供 pc/mobile 覆盖自定义布局
  const tp = toolbarParts || {};
  const searchBtnNode = tp.searchBtn || (extraPageNodes.length ? extraPageNodes[0] : null);

  const blocks = {
    pageHeader: pageHeaderNode,
    pageTitle: tp.pageTitle || null,
    search: tp.search || null,
    toolbarActions: tp.toolbarActions || null,
    toolbarSpacer: tp.toolbarSpacer || null,
    /** 通用 VSpacer；PC/Mobile 覆写顶栏均可用，与 toolbarSpacer 同节点形状 */
    spacer: BLOCK_V_SPACER,
    searchBtn: searchBtnNode,
    filterBtn: searchBtnNode,
    searchSheet: extraActionNodes.find(n => n && n.component === 'SearchSheet') || null,
    /** (childNodes, opts?) => HStack 顶栏容器，用于自定义 toolbarActions / searchBtn 排列 */
    composeToolbar: (children, opts) => composeMobileToolbar(children, opts),
    list: null,
  };
  blocks.list = collectionBlock;
  for (const viewKey of Object.keys(views)) {
    if (viewKey === 'list') continue;
    else if (viewKey === 'create') blocks.create = createFormNode || null;
    else if (viewKey === 'update') blocks.update = updateFormNode || null;
    else blocks[viewKey] = null;
  }

  // 6. pc/mobile 覆盖函数（Req 9）
  const overrideFn = target === 'mobile' ? semantic.mobile : semantic.pc;
  if (typeof overrideFn === 'function') {
    const overrides = overrideFn(views, blocks); // 异常向上传播
    if (overrides && overrides.pageContent !== undefined) {
      pageContent = normalizePageContentOverride(overrides.pageContent);
    }
    if (overrides && overrides.actionContent !== undefined) actionContent = overrides.actionContent;
  }

  // 过滤 actionContent 中的 null/undefined（覆盖函数可能引用了未生成的 blocks）
  actionContent = actionContent.filter(Boolean);

  const listTableMeta = hasListView
    ? {
      pageSize: collectionProps.pageSize,
      orderBy: collectionProps.orderBy != null ? collectionProps.orderBy : null,
      tableKey,
    }
    : null;

  return {
    pageType,
    page: resolvePageMeta(semantic),
    component: semantic.component || null,
    dataSource: flattenDataSource(semantic.dataSource),
    common: semantic.common || {},
    includeList: resolveIncludeList(semantic.includeList, target),
    resourceList: pageType === 'jh-component'
      ? []
      : (Array.isArray(semantic.resourceList) ? semantic.resourceList : []),
    list: listTableMeta
      ? Object.assign({}, semantic.list || {}, {
        table: Object.assign({}, (semantic.list && semantic.list.table) || {}, listTableMeta),
      })
      : (semantic.list || {}),
    pageContent,
    actionContent,
    _v7: {
      target,
      policy,
      componentTokens,
      layout,
      listLayout,
      filterMode: filterType,
      collectionComponent,
      createFormComponent,
      updateFormComponent,
      regionsPlan: regions,
      listColumnsSource: hasListView
        ? (target === 'mobile' && Array.isArray(listView.mobileColumns) && listView.mobileColumns.length
          ? 'mobileColumns'
          : 'columns')
        : null,
      explicitMobileSearchSheet: extraActionNodes.some(n => n.component === 'SearchSheet'),
    },
  };
};

/** @deprecated 使用 expandCrudPage */
const semanticToV6Schema = expandCrudPage;

module.exports = { expandCrudPage, semanticToV6Schema };
