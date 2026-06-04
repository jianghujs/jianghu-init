'use strict';

/**
 * V7 builders：IR → pageContent / actionContent 节点树
 *
 * 映射文档：docs/semantic-to-component-mapping.md
 * 输入为 expandCrudPage 产出的 IR；本文件只做「节点形状」组装，不做 fields 字典展开。
 *
 * | IR / 来源 | 输出节点 | 主要 props |
 * | ir.collection | Table/List @ pageContent | ir.collection.props（headers 等） |
 * | ir + filterType inline | HStack[PageTitle, Search] | pageTitle, searchFieldList, keyword |
 * | ir + filterType sheet | HStack[MobileActions, MobileFilterBtn] + SearchSheet | toolbarActions→actionList |
 * | ir.createFormComponent + createFields | actionContent key:create | title, fieldList, beforeCloseConfirm, cols |
 * | ir.updateFormComponent + updatePayload | actionContent key:update | title, tabList|fieldList |
 */

// ═══════════════════════════════════════════════════════════════════════════════
// LIST LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

const attachCollectionSlotChildren = (node, ir) => {
  const ch = ir.collectionChildren;
  if (!node || !Array.isArray(ch) || !ch.length) return node;
  if (node.component !== 'Table' && node.component !== 'List') return node;
  return Object.assign({}, node, { children: ch.slice() });
};

const FORM_SLOT_COMPONENTS = new Set(['CreateDrawer', 'UpdateDrawer', 'FormDrawer', 'FormSheet']);

const { mergeSheetOverlayProps } = require('./sheetOverlay');

const attachFormSlotChildren = (node, children) => {
  if (!node || !Array.isArray(children) || !children.length) return node;
  if (!FORM_SLOT_COMPONENTS.has(node.component)) return node;
  return Object.assign({}, node, { children: children.slice() });
};

const buildTableLayout = ir => attachCollectionSlotChildren({
  component: 'Table',
  key: ir.collection.key || 'mainTable',
  props: ir.collection.props,
  attrs: { class: 'flex-1 min-w-0' },
}, ir);

const buildCardLayout = ir => attachCollectionSlotChildren({
  component: 'List',
  key: ir.collection.key || 'mainTable',
  props: ir.collection.props,
  attrs: { class: 'flex-1 min-h-0 flex flex-col' },
}, ir);

const buildTreeTableLayout = ir => {
  const treeWidth = (ir.layout && ir.layout.list && ir.layout.list.treeWidth) || '280px';
  const rowChildren = [];
  for (const r of ir.regions) {
    if (r.role === 'tree') {
      rowChildren.push({ component: 'Box', key: r.id, props: { width: treeWidth }, children: [] });
    } else if (['table', 'collection', 'list'].includes(r.role)) {
      const isList = (ir.collection.component || 'Table') === 'List';
      rowChildren.push(attachCollectionSlotChildren({
        component: ir.collection.component || 'Table',
        key: ir.collection.key || r.id,
        props: ir.collection.props,
        attrs: {
          class: isList ? 'flex-1 min-h-0 min-w-0 flex flex-col' : 'flex-1 min-w-0',
        },
      }, ir));
    } else {
      rowChildren.push({ component: 'Box', key: r.id, props: {}, children: [] });
    }
  }
  return { component: 'HStack', props: { gap: 8, align: 'stretch' }, children: rowChildren };
};

const buildCollectionBlock = (ir, layoutType) => {
  const regions = ir.regions || [{ id: 'collection', role: 'collection' }];
  const isSingle = regions.length === 1 && ['collection', 'table', 'list'].includes(regions[0].role);
  if (!isSingle) return buildTreeTableLayout(ir);
  switch (layoutType) {
    case 'card': return buildCardLayout(ir);
    case 'table':
    default: return buildTableLayout(ir);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// FILTER LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

const escapeHtmlAttr = value =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const upperFirst = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

const buildInlineFilter = ir => {
  // PC 端：HStack 容器，左边 PageTitle，右边 Search
  const pageTitleProps = { title: ir.pageTitle };
  if (ir.helpDoc) pageTitleProps.helpDoc = ir.helpDoc;
  const pageTitleNode = { component: 'PageTitle', props: pageTitleProps };

  const searchProps = {};
  if (ir.searchFieldList && ir.searchFieldList.length) {
    searchProps.fields = ir.searchFieldList;
  }
  if (ir.keywordConfig) {
    searchProps.keyword = {
      fields: ir.keywordConfig.keywordFieldList.map(f => f.value),
      placeholder: ir.keywordConfig.keywordPlaceholder || '搜索',
    };
  }
  const searchNode = Object.keys(searchProps).length
    ? { component: 'Search', props: searchProps }
    : null;

  const headerChildren = [pageTitleNode, searchNode].filter(Boolean);
  const pageHeaderNode = headerChildren.length
    ? {
        component: 'HStack',
        props: { gap: 0, align: 'center', justify: 'space-between' },
        children: headerChildren,
      }
    : null;

  return {
    pageHeaderProps: null,
    pageHeaderNode,
    toolbarParts: {
      pageTitle: pageTitleNode,
      search: searchNode,
      toolbarActions: null,
      toolbarSpacer: null,
      searchBtn: null,
    },
    extraPageNodes: [],
    extraActionNodes: [],
  };
};

const buildSheetFilter = ir => {
  // Mobile 端：顶栏拆分为 toolbarActions + toolbarSpacer + searchBtn，由 blocks 或 pageHeader 组合
  const extraActionNodes = [];
  const hstackChildren = [];
  const toolbarParts = {
    pageTitle: null,
    search: null,
    toolbarActions: null,
    toolbarSpacer: null,
    searchBtn: null,
  };

  const toolbarActions = Array.isArray(ir.toolbarActions) ? ir.toolbarActions : [];
  if (toolbarActions.length) {
    toolbarParts.toolbarActions = {
      component: 'MobileActions',
      props: { actionList: toolbarActions },
    };
    toolbarParts.toolbarSpacer = { component: 'VSpacer' };
    hstackChildren.push(toolbarParts.toolbarActions, toolbarParts.toolbarSpacer);
  }

  if (ir.searchFieldList && ir.searchFieldList.length) {
    const listView = ir.listView || {};
    const sheetKey = (typeof listView.mobileSearchKey === 'string' && listView.mobileSearchKey.trim()) || 'mobileSearch';
    const ku = upperFirst(sheetKey);
    const text = listView.mobileSearchBtnText || '搜索';
    const btnClass = listView.mobileSearchBtnClass || '!rounded-xl px-2 border border-solid border-gray-300';
    const icon = listView.mobileSearchIcon || 'filter-2';

    toolbarParts.searchBtn = {
      component: 'MobileFilterBtn',
      props: { label: text, btnClass, icon },
      attrs: { '@click': `is${ku}DrawerShown = true` },
    };
    hstackChildren.push(toolbarParts.searchBtn);

    const searchSheetProps = {
      title: listView.mobileSearchTitle || '搜索',
      rounded: true,
      searchFieldList: ir.searchFieldList,
    };
    if (ir.keywordConfig) {
      searchSheetProps.keywordMeta = {
        fields: ir.keywordConfig.keywordFieldList.map(f => f.value),
        placeholder: ir.keywordConfig.keywordPlaceholder || '搜索',
      };
    }
    Object.assign(
      searchSheetProps,
      mergeSheetOverlayProps(listView.searchSheet, { preset: 'search' }),
    );
    extraActionNodes.push({
      component: 'SearchSheet', key: sheetKey,
      props: searchSheetProps,
    });
  }

  const pageHeaderNode = hstackChildren.length
    ? {
        component: 'HStack',
        attrs: { class: 'border-b flex-none' },
        props: { gap: 8, align: 'center', justify: 'flex-start', wrap: false, padding: '8px 12px' },
        children: hstackChildren,
      }
    : null;

  return { pageHeaderProps: null, pageHeaderNode, toolbarParts, extraPageNodes: [], extraActionNodes };
};

const buildFilterBlock = (ir, filterType) => {
  switch (filterType) {
    case 'sheet': return buildSheetFilter(ir);
    case 'inline':
    default: return buildInlineFilter(ir);
  }
};

/** 将 toolbar 子节点包成默认样式的 HStack（mobile 顶栏容器） */
const composeMobileToolbar = (children, opts = {}) => {
  const nodes = (Array.isArray(children) ? children : []).filter(Boolean);
  if (!nodes.length) return null;
  return {
    component: 'HStack',
    attrs: { class: opts.class != null ? opts.class : 'border-b flex-none' },
    props: Object.assign(
      { gap: 8, align: 'center', justify: 'flex-start', wrap: false, padding: '8px 12px' },
      opts.props || {},
    ),
    children: nodes,
  };
};

// ═══════════════════════════════════════════════════════════════════════════════
// FORM LAYOUT
// ═══════════════════════════════════════════════════════════════════════════════

/** FormSheet 默认使用 v4 移动端 inline 表单布局 */
const applyFormSheetLayout = (props, formComp) => {
  if (formComp !== 'FormSheet') return;
  if (props.labelMode == null) props.labelMode = 'inline';
  if (props.gap == null) props.gap = '0';
  if (props.cols == null) props.cols = 1;
};

/** 语义 actions[] → FormSheet: headActionList；Drawer: actionList */
const assignFormActions = (props, actions, formComp) => {
  if (!Array.isArray(actions) || !actions.length) return;
  if (formComp === 'FormSheet') props.headActionList = actions;
  else props.actionList = actions;
};

/** views.update.tabs[].actions → 各 tab 的 headActionList | actionList */
const mapTabListActions = (tabList, formComp) => {
  if (!Array.isArray(tabList)) return tabList;
  return tabList.map(tab => {
    if (!tab || typeof tab !== 'object') return tab;
    const { actions, ...rest } = tab;
    const out = { ...rest };
    assignFormActions(out, actions, formComp);
    return out;
  });
};

/**
 * views.create → actionContent 节点（key 固定 create，供 isCreateDrawerShown / createItem 绑定）
 *
 * | 语义 | → props |
 * | views.create.title | title |
 * | views.create.fields + fields.* | fieldList |
 * | saveTipBeforeClose | beforeCloseConfirm |
 * | layout.create.cols / layout.update.cols | cols |
 * | layout.create.variants / layout.update.variants | fieldList[].span（pc 默认 1，mobile 默认 cols） |
 * | views.create.actions | CreateDrawer: actionList；FormSheet: headActionList（标题栏） |
 * | platform create=CreateSheet | component=FormSheet, rounded=true |
 */
const applyFormSheetOverlay = (props, sheetView, tabCount) => {
  if (props.rounded == null) props.rounded = true;
  Object.assign(props, mergeSheetOverlayProps(sheetView, { preset: 'form', tabCount }));
};

const pushCreateForm = (actionContent, ir) => {
  if (!ir.createFields || !ir.createFields.length) return;
  const createComp = ir.createFormComponent || 'CreateDrawer';
  const createProps = { title: ir.createTitle || '新建', fieldList: ir.createFields };
  if (ir.createSaveTipBeforeClose) createProps.beforeCloseConfirm = true;
  if (ir.createCols != null) createProps.cols = ir.createCols;
  assignFormActions(createProps, ir.createActions, createComp);
  if (createComp === 'FormSheet') applyFormSheetOverlay(createProps, ir.createSheet, 1);
  applyFormSheetLayout(createProps, createComp);
  actionContent.push({ component: createComp, key: 'create', props: createProps });
};

/**
 * views.update → actionContent 节点（key 固定 update）
 *
 * | 语义 | → props |
 * | views.update.title | title |
 * | views.update.tabs[].actions | tabList[].headActionList (FormSheet) | actionList (Drawer) |
 * | views.update.actions | headActionList | actionList（fields 模式） |
 * | views.update.fields | fieldList |
 * | layout.update.cols | cols |
 * | platform update=UpdateSheet | component=FormSheet, rounded=true |
 */
const pushUpdateForm = (actionContent, ir) => {
  const updateComp = ir.updateFormComponent || 'UpdateDrawer';
  const up = ir.updatePayload;
  const colsProp = ir.updateCols != null ? { cols: ir.updateCols } : {};
  const finishUpdateNode = (updateProps, tabCount) => {
    if (updateComp === 'FormSheet') applyFormSheetOverlay(updateProps, ir.updateSheet, tabCount);
    actionContent.push({ component: updateComp, key: 'update', props: updateProps });
    applyFormSheetLayout(actionContent[actionContent.length - 1].props, updateComp);
  };
  if (up) {
    if (up.mode === 'tabs' && up.tabList && up.tabList.length) {
      finishUpdateNode({
        title: ir.updateTitle || '编辑',
        tabList: mapTabListActions(up.tabList, updateComp),
        ...colsProp,
      }, up.tabList.length);
    } else if (up.mode === 'fields' && up.fieldList && up.fieldList.length) {
      const updateProps = { title: ir.updateTitle || '编辑', fieldList: up.fieldList, ...colsProp };
      assignFormActions(updateProps, up.actions, updateComp);
      finishUpdateNode(updateProps, 1);
    }
  } else if (ir.updateFields && ir.updateFields.length) {
    const updateProps = { title: ir.updateTitle || '编辑', fieldList: ir.updateFields, ...colsProp };
    assignFormActions(updateProps, ir.updateActions, updateComp);
    finishUpdateNode(updateProps, 1);
  }
};

const buildFormBlock = ir => {
  const actionContent = [];
  pushCreateForm(actionContent, ir);
  pushUpdateForm(actionContent, ir);
  return actionContent.map(node => {
    if (!node) return node;
    if (node.key === 'create' && ir.createFormChildren && ir.createFormChildren.length) {
      return attachFormSlotChildren(node, ir.createFormChildren);
    }
    if (node.key === 'update' && ir.updateFormChildren && ir.updateFormChildren.length) {
      return attachFormSlotChildren(node, ir.updateFormChildren);
    }
    return node;
  });
};

module.exports = {
  buildCollectionBlock, buildTableLayout, buildCardLayout, buildTreeTableLayout,
  buildFilterBlock, buildInlineFilter, buildSheetFilter, composeMobileToolbar,
  buildFormBlock, pushCreateForm, pushUpdateForm,
};
