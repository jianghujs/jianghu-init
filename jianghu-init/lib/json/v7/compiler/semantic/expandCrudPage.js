'use strict';

/**
 * V7 语义展开：fields / views / platform / layout → pageContent + actionContent 节点树
 *
 * 参数映射总表：lib/json/v7/docs/semantic-to-component-mapping.md
 * 常量索引：lib/json/v7/semantic-mapping.js
 *
 * 本文件职责：
 *   - platform token → 选 Table|List、CreateDrawer|FormSheet 等（见 policy.js）
 *   - 调用 views/compile*View 将 views.* + fields 字典转换为明确的 view IR
 *   - 输出 IR 后交 builders.js 组装树，再经 schemaPipeline.parseSchema 解析绑定
 *
 * 前置条件：semantic 须已由 normalizeSchema 规范化（buildPage 主入口已保证）。
 */

const { flattenDataSource } = require('./normalizeDataSource');
const { resolveIncludeList } = require('./resolveIncludeList');
const { normalizePageContentOverride } = require('./pageContentShape');
const { resolveTargetPlatform, resolvePageType } = require('../../policy');
const { resolvePageMeta } = require('../../authoringMode');
const {
  getEffectivePlatformPolicy,
  resolveListLayoutFilter,
  resolvePlatformComponentTokens,
  resolveViewListComponent,
  resolveViewFormComponent,
} = require('../../policy');
const { getEffectiveLayout } = require('../../defaults');
const { buildListRegionsPlan } = require('./buildListRegionsPlan');
const { compileListView } = require('./views/compileListView');
const { compileCreateView } = require('./views/compileCreateView');
const { compileUpdateView } = require('./views/compileUpdateView');
const {
  buildCollectionBlock,
  buildFilterBlock,
  buildFormBlock,
  composeMobileToolbar,
  BLOCK_V_SPACER,
} = require('../../builders');
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

const mergeListColumnSettingWiring = (semantic, wiring) => {
  if (!wiring) {
    return {
      common: semantic.common || {},
      includeList: Array.isArray(semantic.includeList) ? semantic.includeList : [],
    };
  }
  const common = { ...(semantic.common || {}) };
  const commonData = { ...(common.data || {}) };
  if (wiring.commonDataHeaders != null && commonData.headers == null) {
    commonData.headers = wiring.commonDataHeaders;
  }
  common.data = commonData;

  const includeList = Array.isArray(semantic.includeList) ? semantic.includeList.slice() : [];
  if (wiring.includeListEntry) {
    const hasColumnSetting = includeList.some(
      item => item && String(item.path || '').replace(/\\/g, '/').includes('tableColumnSettingBtn'),
    );
    if (!hasColumnSetting) includeList.push(wiring.includeListEntry);
  }
  return { common, includeList };
};

// ─── 主函数 ────────────────────────────────────────────────────────────────────

/**
 * V7 semantic → 平台无关 IR + 组装后的 pageContent/actionContent
 *
 * expandCrudPage 职责：
 *   1. 解析 platform policy（layout/filter/form 类型）
 *   2. 调用各 view compiler，汇总 list/create/update IR
 *   3. 调用 platform builders 组装节点树
 *
 * 调用方须先经 normalizeSchema（buildPage 主链路已保证）；本函数不再重复 key 迁移或 CRUD 校验。
 *
 * layout / platform 未写时使用 defaults.js、policy.DEFAULT_PLATFORM_TOKENS。
 */
const expandCrudPage = semanticInput => {
  const semantic = semanticInput;
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

  // ── 2. views.* → 明确的 view IR；每种 view 的 key 映射只在对应 compiler 内维护 ──
  const createView = views.create && typeof views.create === 'object' ? views.create : {};
  const updateView = views.update && typeof views.update === 'object' ? views.update : {};
  const listResult = hasListView
    ? compileListView({
      semantic,
      view: listView,
      fields: fieldsDict,
      target,
      layout,
      component: collectionComponent,
      listLayout,
    })
    : null;
  const createResult = compileCreateView({
    semantic,
    view: createView,
    fields: fieldsDict,
    target,
    layout,
    component: createFormComponent,
  });
  const updateResult = compileUpdateView({
    semantic,
    view: updateView,
    fields: fieldsDict,
    target,
    layout,
    component: updateFormComponent,
  });

  const pageTitle = (semantic.page && semantic.page.title) || (semantic.page && semantic.page.name) || (semantic.page && semantic.page.id) || '';
  const pageId = semantic.page && semantic.page.id;
  const helpDoc = (semantic.page && semantic.page.helpDoc) || null;
  const regions = buildListRegionsPlan(Object.assign({}, semantic, { layout }));

  // 3. IR（平台无关的中间表示）
  const ir = {
    pageTitle,
    pageId,
    helpDoc,
    searchFieldList: listResult ? listResult.searchFieldList : [],
    keywordConfig: listResult ? listResult.keywordConfig : null,
    searchConfig: listResult ? listResult.searchConfig : {},
    filterList: listResult ? listResult.filterList : [],
    toolbarActions: listResult ? listResult.mobileToolbarActions : [],
    mobileSearch: listResult ? listResult.mobileSearch : null,
    collection: listResult ? listResult.collection : null,
    collectionChildren: listResult ? listResult.collectionChildren : [],
    createFormChildren: createResult.children,
    updateFormChildren: updateResult.children,
    regions,
    layout,
    createFields: createResult.fieldList,
    createTitle: createResult.title,
    createSaveTipBeforeClose: createResult.saveTipBeforeClose,
    createCols: createResult.cols,
    updateCols: updateResult.cols,
    createActions: createResult.actions,
    createSheet: createResult.sheet,
    updateSheet: updateResult.sheet,
    updatePayload: updateResult.payload,
    updateTitle: updateResult.title,
    createFormComponent: createResult.component,
    updateFormComponent: updateResult.component,
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

  const listTableMeta = listResult
    ? {
      pageSize: listResult.meta.pageSize,
      orderBy: listResult.meta.orderBy,
      tableKey: listResult.meta.tableKey,
    }
    : null;

  const wiredSemantic = mergeListColumnSettingWiring(
    semantic,
    listResult && listResult.columnSettingWiring,
  );

  return {
    pageType,
    page: resolvePageMeta(semantic),
    component: semantic.component || null,
    dataSource: flattenDataSource(semantic.dataSource),
    common: wiredSemantic.common,
    includeList: resolveIncludeList(wiredSemantic.includeList, target),
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
      listColumnsSource: listResult ? listResult.meta.columnsSource : null,
      explicitMobileSearchSheet: extraActionNodes.some(n => n.component === 'SearchSheet'),
    },
  };
};

/** @deprecated 使用 expandCrudPage */
const semanticToV6Schema = expandCrudPage;

module.exports = { expandCrudPage, semanticToV6Schema };
