'use strict';

const v = require('../../index');
const { expandCrudPage } = require('../../compiler/semantic/expandCrudPage');
const { normalizeAction } = require('../../actionIntent');
const { fieldKeyToFormField } = require('../../fieldFormProps');
const { resolvePageSyncEntries } = require('../../mobilePageId');
const { resolvePageMenu } = require('../../../shared/resolvePageMenu');

const desk = require('./projectManagement.v7.sample');

console.assert(resolvePageMenu(undefined, 'jh-page', false) === 'jh-menu', 'page menu default jh-menu');
console.assert(resolvePageMenu(false, 'jh-page', true) === false, 'page menu false');
console.assert(resolvePageMenu(true, 'jh-page', true) === 'jh-menu', 'page menu true');
console.assert(resolvePageMenu('jh-finance-menu', 'jh-page', true) === 'jh-finance-menu', 'page menu custom tag');
console.assert(resolvePageMenu(undefined, 'jh-component', false) === false, 'component menu default off');

// ─── 基础 PC 编译 ─────────────────────────────────────────────────────────────
const { standardConfig: pc } = v.buildPage(desk);
console.assert(pc.v7Meta.target === 'pc', 'pc target');
console.assert(pc.page && pc.page.menu === 'jh-menu', 'baked page.menu is jh-menu tag');
console.assert(pc.v7Meta.filterMode === 'inline', 'pc inline filter');
console.assert(!JSON.stringify(pc.pageContent).includes('MobileSearch'), 'no MobileSearch on pc inline');

// ─── Req 1: platform token 字符串写法 ─────────────────────────────────────────
console.assert(pc.v7Meta.listLayout === 'table', 'platform token Table → layout table');
console.assert(pc.v7Meta.filterMode === 'inline', 'platform token Table → filter inline');
console.assert(pc.v7Meta.collectionComponent === 'Table', 'platform.pc.list → Table');
console.assert(pc.v7Meta.createFormComponent === 'CreateDrawer', 'platform.pc.create → CreateDrawer');
console.assert(pc.v7Meta.updateFormComponent === 'UpdateDrawer', 'platform.pc.update → UpdateDrawer');
const desktopAlias = expandCrudPage({
  ...desk,
  targetPlatform: 'pc',
  platform: {
    desktop: { list: 'List', create: 'CreateSheet', update: 'UpdateSheet' },
  },
});
console.assert(desktopAlias._v7.collectionComponent === 'List', 'platform.desktop.list → List alias');
console.assert(desktopAlias._v7.createFormComponent === 'FormSheet', 'platform.desktop.create → FormSheet alias');

// ─── Req 2: *Resource 命名规范 ────────────────────────────────────────────────
console.assert(pc.dataSource.listResource === 'getProjectList', '*Resource → listResource');
console.assert(pc.dataSource.createResource === 'createProject', '*Resource → createResource');
console.assert(pc.dataSource.updateResource === 'updateProject', '*Resource → updateResource');
console.assert(pc.dataSource.deleteResource === 'deleteProject', '*Resource → deleteActionId');

// resource.* 旧写法经 parseSchema 也应落到 standardConfig.dataSource（→ NJK bake listResource 等）
const { parseSchema } = require('../../compiler/runtime/schemaPipeline');
const { standardConfig: legacyDs } = parseSchema({
  version: 'v7',
  page: { id: 'dsSmoke' },
  dataSource: {
    table: 'project',
    primaryKey: 'projectId',
    resource: {
      list: 'getProjectList',
      create: 'createProject',
      update: 'updateProject',
      delete: 'deleteProject',
    },
  },
  pageContent: [],
  actionContent: [],
});
console.assert(legacyDs.dataSource.listResource === 'getProjectList', 'resource.list → standardConfig.dataSource.listResource');

// ─── Req 3: keyword 搜索类型 ──────────────────────────────────────────────────
const pcPageStr = JSON.stringify(pc.pageContent);
// Search 组件应有 keyword prop（含 fields 和 placeholder）
console.assert(pcPageStr.includes('"keyword"') || pcPageStr.includes('keyword'), 'keyword config in Search component');
console.assert(pcPageStr.includes('projectName') || pcPageStr.includes('projectType'), 'keyword fields present');
// status 应在 Search 的 fields 中
console.assert(pcPageStr.includes('"key":"status"') || pcPageStr.includes('"key": "status"'), 'status in searchFieldList');

// ─── Req 4: views.update.tabs ─────────────────────────────────────────────────
const pcActionStr = JSON.stringify(pc.actionContent);
console.assert(pcActionStr.includes('tabList'), 'UpdateDrawer has tabList');
console.assert(pcActionStr.includes('basicInfo') || pcActionStr.includes('"basicInfo"'), 'tab basicInfo exists');
console.assert(pcActionStr.includes('extensionInfo') || pcActionStr.includes('"extensionInfo"'), 'tab extensionInfo exists');

const updateDrawerNode = pc.actionContent.find(n => n && n.component === 'UpdateDrawer');
console.assert(updateDrawerNode, 'UpdateDrawer exists');
const updateDrawerProps = updateDrawerNode.resolvedProps || updateDrawerNode.props || {};
console.assert(updateDrawerProps.tabList, 'UpdateDrawer has tabList');
console.assert(!updateDrawerProps.fieldList, 'UpdateDrawer.fieldList not present in tabs mode');

// ─── Req 5: interaction 条件表达式 ────────────────────────────────────────────
const createDrawerNode = pc.actionContent.find(n => n && n.component === 'CreateDrawer');
console.assert(createDrawerNode, 'CreateDrawer exists');
const createDrawerProps = createDrawerNode.resolvedProps || createDrawerNode.props || {};

// status 有 visibleWhen（字符串 → __expr__）
const statusField = createDrawerProps.fieldList && createDrawerProps.fieldList.find(f => f.key === 'status');
console.assert(statusField && statusField.visibleWhen, 'status has visibleWhen');
console.assert(statusField.visibleWhen.__expr__ === 'isOutsource', 'visibleWhen is __expr__ wrapped');

// tab interaction
const basicTab = updateDrawerProps.tabList && updateDrawerProps.tabList.find(t => t.key === 'basicInfo');
console.assert(basicTab, 'basicInfo tab exists');
const projectNameInTab = basicTab && basicTab.fieldList.find(f => f.key === 'projectName');
console.assert(projectNameInTab && projectNameInTab.readonlyWhen, 'projectName in basicInfo tab has readonlyWhen');
console.assert(projectNameInTab.readonlyWhen.__expr__ === 'isFinished', 'readonlyWhen is __expr__ wrapped');
console.assert(projectNameInTab.span === 1, 'default pc update tab field span=1');
console.assert(updateDrawerProps.cols === 3, 'default update cols=3');

const fieldsModeIr = expandCrudPage(Object.assign({}, desk, {
  pc: undefined,
  views: Object.assign({}, desk.views, {
    update: {
      title: '编辑',
      fields: ['projectId', 'projectName'],
      interaction: { projectId: { visibleWhen: false } },
    },
  }),
}));
const fieldsModeUpdate = fieldsModeIr.actionContent.find(n => n && n.key === 'update');
console.assert(fieldsModeUpdate && fieldsModeUpdate.props && fieldsModeUpdate.props.fieldList, 'update fields mode node');
const hiddenProjectId = fieldsModeUpdate.props.fieldList.find(f => f.key === 'projectId');
console.assert(hiddenProjectId && hiddenProjectId.visibleWhen === false, 'update.fields interaction merges visibleWhen:false');

// ─── Req 6: saveTipBeforeClose ────────────────────────────────────────────────
console.assert(createDrawerProps.beforeCloseConfirm === true, 'CreateDrawer has beforeCloseConfirm');

const attrsIr = expandCrudPage(Object.assign({}, desk, {
  pc: undefined,
  fields: Object.assign({}, desk.fields, {
    projectDesc: { type: 'textarea', label: '描述', attrs: { rows: 5 } },
  }),
  views: Object.assign({}, desk.views, {
    create: Object.assign({}, desk.views.create, {
      fields: [ ...(desk.views.create.fields || []), 'projectDesc' ],
      fieldAttrs: { projectDesc: { rows: 8 } },
    }),
  }),
}));
const attrsCreateNode = attrsIr.actionContent.find(n => n && n.key === 'create');
const descField = attrsCreateNode && attrsCreateNode.props.fieldList
  && attrsCreateNode.props.fieldList.find(f => f && f.key === 'projectDesc');
console.assert(descField && descField.attrs && descField.attrs.rows === 8, 'fieldAttrs overrides fields.attrs.rows');

const platformAttrsDesk = {
  mode: 'crud',
  page: { id: 'platformAttrs' },
  fields: {
    remark: {
      type: 'textarea',
      label: '备注',
      attrs: { rows: 3 },
      pc: { rows: 8 },
      mobile: { rows: 5 },
    },
  },
  dataSource: { table: 't', listResource: 'list' },
  views: { create: { fields: ['remark'] } },
};
const pcAttrsIr = expandCrudPage(Object.assign({}, platformAttrsDesk, { targetPlatform: 'pc' }));
const moAttrsIr = expandCrudPage(Object.assign({}, platformAttrsDesk, { targetPlatform: 'mobile' }));
const pcRemark = pcAttrsIr.actionContent.find(n => n && n.key === 'create').props.fieldList.find(f => f.key === 'remark');
const moRemark = moAttrsIr.actionContent.find(n => n && n.key === 'create').props.fieldList.find(f => f.key === 'remark');
console.assert(pcRemark.attrs.rows === 8, 'fields.pc rows merge into attrs on pc target');
console.assert(moRemark.attrs.rows === 5, 'fields.mobile rows merge into attrs on mobile target');

const customField = fieldKeyToFormField({
  goal: {
    label: '跟进目标',
    type: 'custom',
    component: 'jh-goal-picker',
    rules: 'validationRules.requireRules',
    attrs: { mode: 'single' },
  },
}, 'goal', 'pc');
console.assert(customField.type === 'custom', 'fields custom type preserved');
console.assert(customField.component === 'jh-goal-picker', 'fields custom component forwarded');
console.assert(customField.rules === 'validationRules.requireRules', 'fields custom rules forwarded');
console.assert(customField.attrs && customField.attrs.mode === 'single', 'fields custom attrs forwarded');

const moCustomField = fieldKeyToFormField({
  goal: { type: 'custom', component: 'jh-goal-pc', mobile: { component: 'jh-goal-mobile' } },
}, 'goal', 'mobile');
console.assert(moCustomField.component === 'jh-goal-mobile', 'fields.mobile component override');

const customCrudDesk = {
  mode: 'crud',
  page: { id: 'customFieldSmoke' },
  fields: {
    goal: {
      label: '跟进目标',
      type: 'custom',
      component: 'jh-goal-picker',
      rules: 'validationRules.requireRules',
    },
  },
  dataSource: { table: 't', listResource: 'list' },
  views: { create: { fields: ['goal'] } },
};
const customCrudIr = expandCrudPage(Object.assign({}, customCrudDesk, { targetPlatform: 'pc' }));
const customGoalField = customCrudIr.actionContent
  .find(n => n && n.key === 'create').props.fieldList.find(f => f.key === 'goal');
console.assert(customGoalField.type === 'custom' && customGoalField.component === 'jh-goal-picker', 'expandCrudPage create fieldList custom component');

// ─── Req 7: slots 声明 ────────────────────────────────────────────────────────
// 直接检查 expandCrudPage 原始输出（schemaPipeline 会把 slotTemplates 转为 children）
const deskNoOverride = Object.assign({}, desk, { pc: undefined });
const rawIr = expandCrudPage(deskNoOverride);
const rawTableNode = rawIr.pageContent.children.find(n => n && (n.component === 'Table' || n.component === 'List'));
console.assert(rawTableNode, 'raw Table/List node exists');
console.assert(rawTableNode.props && rawTableNode.props.filterList, 'PC Table has filterList');
console.assert(rawTableNode.props.filterList.some(f => f.type === 'keyword' && f.keys && f.keys.includes('projectName')), 'filter keyword keys');
console.assert(rawTableNode.props.filterList.some(f => f.key === 'status'), 'filter field status');
console.assert(Array.isArray(rawTableNode.children) && rawTableNode.children.length > 0, 'list.pc.children on Table');
console.assert(String(rawTableNode.children[0]).includes('item.projectName'), 'list slot template name');

const rawRowActions = rawTableNode.props.rowActionList || [];
console.assert(rawRowActions[0] && rawRowActions[0].uiAction === 'update', 'row update uiAction');
console.assert(rawRowActions[0] && rawRowActions[0].id === undefined, 'row action no id field');
console.assert(rawRowActions[1] && rawRowActions[1].uiAction === 'delete', 'row delete uiAction');
console.assert(rawRowActions[1] && rawRowActions[1].id === undefined, 'row delete no id field');

// uiAction 1:1 替代 intent，编译期不再做 role 误用校验
const crossRoleNorm = normalizeAction({ uiAction: 'createItem', label: '自定义' }, 'toolbar', 't');
console.assert(crossRoleNorm.uiAction === 'createItem' && crossRoleNorm.id === undefined, 'uiAction passthrough no id');

// slots.update.basicInfo.pc.children → UpdateDrawer children
const rawUpdatePayload = rawIr.actionContent.find(n => n && n.component === 'UpdateDrawer');
console.assert(rawUpdatePayload && rawUpdatePayload.children && rawUpdatePayload.children.length >= 2, 'update tab pc.children on UpdateDrawer');
console.assert(String(rawUpdatePayload.children[0]).includes('field-projectName'), 'update basicInfo slot template');

// slots.update.pc.children → UpdateDrawer children（与 list 同形）
const formSlotDesk = Object.assign({}, desk, {
  pc: undefined,
  views: Object.assign({}, desk.views, {
    update: {
      title: '编辑',
      fields: ['projectId', 'projectName', 'status'],
      interaction: { projectId: { visibleWhen: false } },
    },
  }),
  slots: Object.assign({}, desk.slots, {
    update: Object.assign({}, desk.slots && desk.slots.update, {
      pc: {
        children: [
          '<template v-slot:field-projectName="{ field, value, onChange }"><span class="text-red">custom</span></template>',
          '<template v-slot:field-status="{ field, value, onChange }"><span class="text-blue">status</span></template>',
        ],
      },
    }),
  }),
});
const formSlotIr = expandCrudPage(formSlotDesk);
const formSlotUpdate = formSlotIr.actionContent.find(n => n && n.key === 'update');
console.assert(formSlotUpdate && formSlotUpdate.children && formSlotUpdate.children.length >= 2, 'update.pc.children on UpdateDrawer');
console.assert(String(formSlotUpdate.children[0]).includes('field-projectName'), 'update slot template name');
const formSlotFieldList = formSlotUpdate.props && formSlotUpdate.props.fieldList;
const formSlotProjectId = formSlotFieldList && formSlotFieldList.find(f => f.key === 'projectId');
console.assert(formSlotProjectId && formSlotProjectId.visibleWhen === false, 'update.fields mode interaction');

// slots.create.pc.children
const createSlotIr = expandCrudPage(Object.assign({}, desk, {
  pc: undefined,
  slots: Object.assign({}, desk.slots, {
    create: {
      pc: {
        children: ['<template v-slot:label-status="{ field }">状态★</template>'],
      },
    },
  }),
}));
const createSlotNode = createSlotIr.actionContent.find(n => n && n.key === 'create');
console.assert(createSlotNode && createSlotNode.children && createSlotNode.children.length === 1, 'create.pc.children');

// ─── Req 8: layout.create 默认 cols=3，PC 字段 span=1 ─────────────────────────
const projectNameField = createDrawerProps.fieldList && createDrawerProps.fieldList.find(f => f.key === 'projectName');
console.assert(projectNameField && projectNameField.span === 1, 'default pc create: projectName span=1');
console.assert(createDrawerProps.cols === 3, 'default create cols=3');
console.assert(pc.v7Meta.componentTokens.list === 'Table', 'default platform pc list Table');
console.assert(pc.v7Meta.componentTokens.create === 'CreateDrawer', 'default platform pc create');

// ─── Req 9: pc 覆盖函数 + blocks ─────────────────────────────────────────────
console.assert(rawIr.pageContent && rawIr.pageContent.component === 'VStack', 'expandCrudPage pageContent is single root object');
console.assert(Array.isArray(pc.pageContent), 'standardConfig.pageContent is array for NJK');
console.assert(pc.pageContent[0].component === 'VStack', 'standardConfig.pageContent[0] is VStack after override');

// ─── Mobile 编译 ──────────────────────────────────────────────────────────────
const mobileBase = Object.assign({}, desk, { pageType: 'jh-mobile-page', pc: undefined });
const { standardConfig: mo } = v.buildPage(mobileBase);
console.assert(mo.v7Meta.target === 'mobile', 'mobile target');
console.assert(mo.page.id === 'mobile/projectManagement', 'mobile standardConfig.page.id has mobile/ prefix for NJK pageId');

const titleBindNode = parseSchema({
  version: 'v7',
  page: { id: 'titleBindSmoke' },
  pageContent: [],
  actionContent: [{
    component: 'FormSheet',
    key: 'bindGroup',
    props: {
      titleBind: "bindGroupItem.duoxingRoomId ? '已绑定' : '尚未绑定'",
      headActionList: [],
    },
  }],
}).standardConfig.actionContent[0];
console.assert(
  titleBindNode.resolvedBindings && titleBindNode.resolvedBindings[':title']
    === "bindGroupItem.duoxingRoomId ? '已绑定' : '尚未绑定'",
  'FormSheet titleBind → resolvedBindings :title expression',
);
console.assert(
  titleBindNode.resolvedProps.title === undefined && titleBindNode.resolvedProps.titleBind === undefined,
  'FormSheet titleBind strips static title/titleBind from resolvedProps',
);

const filterBtnNode = parseSchema({
  version: 'v7',
  page: { id: 'propBindSmoke' },
  pageContent: [{
    component: 'MobileFilterBtn',
    props: {
      label: '组织',
      labelBind: 'filterLabelText',
      activeDisplayBind: 'currentOrgInfo.orgName',
    },
  }],
  actionContent: [],
}).standardConfig.pageContent[0];
console.assert(
  filterBtnNode.resolvedBindings[':label'] === 'filterLabelText',
  'universal *Bind: MobileFilterBtn labelBind',
);
console.assert(
  filterBtnNode.resolvedBindings[':active-display'] === 'currentOrgInfo.orgName',
  'universal *Bind: activeDisplayBind → :active-display',
);
console.assert(filterBtnNode.resolvedProps.label === undefined, 'labelBind drops plain label');

const shownBindNode = parseSchema({
  version: 'v7',
  page: { id: 'shownBindSmoke' },
  pageContent: [],
  actionContent: [{
    component: 'FormSheet',
    key: 'create',
    props: { shownBind: 'true', title: '新建' },
  }],
}).standardConfig.actionContent[0];
console.assert(
  shownBindNode.resolvedBindings[':shown.sync'] === 'isCreateDrawerShown',
  'framework :shown.sync wins over shownBind',
);
console.assert(
  shownBindNode.resolvedBindings[':shown'] === undefined,
  'shownBind ignored when REACTIVE_BINDINGS_MAP owns shown',
);

const createSheetByComponent = parseSchema({
  version: 'v7',
  page: { id: 'createSheetSmoke' },
  pageContent: [],
  actionContent: [{
    component: 'CreateSheet',
    key: 'create',
    props: { title: '新建', fieldList: [{ key: 'name', label: '名称' }] },
  }],
}).standardConfig.actionContent[0];
console.assert(
  createSheetByComponent.resolvedComponent === 'jh-form-sheet',
  'CreateSheet token → jh-form-sheet',
);
console.assert(
  createSheetByComponent.resolvedBindings[':shown.sync'] === 'isCreateDrawerShown',
  'CreateSheet token → FormSheet bindings',
);

const createSheetByTag = parseSchema({
  version: 'v7',
  page: { id: 'createSheetTagSmoke' },
  pageContent: [],
  actionContent: [{
    tag: 'CreateSheet',
    key: 'create',
    props: { title: '新建', fieldList: [] },
  }],
}).standardConfig.actionContent[0];
console.assert(
  createSheetByTag.resolvedComponent === 'jh-form-sheet',
  'tag: CreateSheet → jh-form-sheet',
);

const bothSyncIds = resolvePageSyncEntries({
  version: 'v7',
  v7GeneratedTargets: ['pc', 'mobile'],
  pageId: 'projectManagement',
  pageName: '项目管理',
}).map(e => e.pageId);
console.assert(
  bothSyncIds.length === 2
  && bothSyncIds[0] === 'projectManagement'
  && bothSyncIds[1] === 'mobile/projectManagement',
  'v7 generated pc+mobile: sync entries for both pageIds',
);
const pcOnlySyncIds = resolvePageSyncEntries({
  version: 'v7',
  v7GeneratedTargets: ['pc'],
  v7BuildTargets: 'both',
  pageId: 'projectManagement',
}).map(e => e.pageId);
console.assert(
  pcOnlySyncIds.length === 1 && pcOnlySyncIds[0] === 'projectManagement',
  'v7 generated pc only: no mobile resource/page sync despite targets both in config',
);
const mobileOnlySyncIds = resolvePageSyncEntries({
  version: 'v7',
  v7GeneratedTargets: ['mobile'],
  pageId: 'projectManagement',
}).map(e => e.pageId);
console.assert(
  mobileOnlySyncIds.length === 1 && mobileOnlySyncIds[0] === 'mobile/projectManagement',
  'v7 generated mobile only: mobile/ pageId for resource sync',
);
console.assert(mo.v7Meta.filterMode === 'sheet', 'mobile sheet filter');
console.assert(mo.v7Meta.collectionComponent === 'List', 'mobile platform.list List');
console.assert(mo.v7Meta.createFormComponent === 'FormSheet', 'mobile platform.create CreateSheet→FormSheet');
console.assert(mo.v7Meta.updateFormComponent === 'FormSheet', 'mobile platform.update UpdateSheet→FormSheet');

// SearchSheet searchFieldList 内 select.options 字符串 → __expr__（NJK 序列化为 options:constantObj.xxx）
const moSearchSheet = mo.actionContent.find(n => n && n.component === 'SearchSheet');
const moKeywordMeta = moSearchSheet && (moSearchSheet.resolvedProps || moSearchSheet.props || {}).keywordMeta;
console.assert(
  moKeywordMeta && moKeywordMeta.fields && moKeywordMeta.fields.includes('projectName'),
  'SearchSheet keywordMeta.fields from views.list.search.keyword',
);
console.assert(
  mo.features.keywordFieldList && mo.features.keywordFieldList.includes('projectName'),
  'features.keywordFieldList baked for mobile page data',
);
const moStatusField = moSearchSheet && (moSearchSheet.resolvedProps || moSearchSheet.props || {}).searchFieldList
  && moSearchSheet.resolvedProps.searchFieldList.find(f => f && f.key === 'status');
console.assert(
  moStatusField && moStatusField.options && moStatusField.options.__expr__ === 'constantObj.projectStatus',
  'SearchSheet status.options → __expr__',
);

const moCreateNode = mo.actionContent.find(n => n && n.key === 'create');
const moUpdateNode = mo.actionContent.find(n => n && n.key === 'update');
console.assert(moCreateNode && moCreateNode.component === 'FormSheet', 'mobile actionContent create is FormSheet');
const moCreateProps = (moCreateNode && (moCreateNode.resolvedProps || moCreateNode.props)) || {};
console.assert(
  moCreateProps.headActionList && moCreateProps.headActionList[0] && moCreateProps.headActionList[0].uiAction === 'create',
  'mobile FormSheet create.actions → headActionList',
);
console.assert(!moCreateProps.actionList, 'mobile FormSheet create has no bottom actionList');
console.assert(moCreateProps.autoHeight === true, 'mobile FormSheet create default autoHeight');
console.assert(moCreateProps.viewportOffset === 102, 'mobile FormSheet create default viewportOffset 102');
console.assert(moCreateProps.beforeCloseConfirm === true, 'mobile FormSheet create beforeCloseConfirm');
console.assert(moCreateProps.persistent === true, 'mobile FormSheet beforeCloseConfirm → persistent');
console.assert(moSearchSheet, 'mobile SearchSheet exists');
console.assert(
  (moSearchSheet.resolvedProps || moSearchSheet.props || {}).maxBodyHeight === '70vh',
  'SearchSheet default maxBodyHeight 70vh',
);
const sheetOverrideDesk = Object.assign({}, desk, {
  targetPlatform: 'mobile',
  pc: undefined,
  views: Object.assign({}, desk.views, {
    list: Object.assign({}, desk.views.list, {
      searchSheet: { maxBodyHeight: '50vh', persistent: true },
    }),
  }),
});
const { standardConfig: moSheetOverride } = v.buildPage(sheetOverrideDesk);
const overrideSearchSheet = moSheetOverride.actionContent.find(n => n && n.component === 'SearchSheet');
const overrideSheetProps = (overrideSearchSheet && (overrideSearchSheet.resolvedProps || overrideSearchSheet.props)) || {};
console.assert(
  overrideSheetProps.maxBodyHeight === '50vh' && overrideSheetProps.persistent === true,
  'views.list.searchSheet merges overlay props',
);
console.assert(moUpdateNode && moUpdateNode.component === 'FormSheet', 'mobile actionContent update is FormSheet');
const pcCreateNode = pc.actionContent.find(n => n && n.key === 'create');
console.assert(pcCreateNode && pcCreateNode.component === 'CreateDrawer', 'pc actionContent create is CreateDrawer');
const pcCreateProps = (pcCreateNode && (pcCreateNode.resolvedProps || pcCreateNode.props)) || {};
console.assert(!pcCreateProps.autoHeight, 'pc CreateDrawer has no sheet overlay props');
console.assert(
  pcCreateProps.actionList && pcCreateProps.actionList[0] && pcCreateProps.actionList[0].uiAction === 'create',
  'pc CreateDrawer create.actions → actionList',
);
console.assert(!pcCreateProps.headActionList, 'pc CreateDrawer create has no headActionList');
const moUpdateProps = (moUpdateNode && (moUpdateNode.resolvedProps || moUpdateNode.props)) || {};
console.assert(moUpdateProps.viewportOffset === 152, 'mobile FormSheet update tabs viewportOffset 152');
const moBasicTab = moUpdateProps.tabList && moUpdateProps.tabList.find(t => t.key === 'basicInfo');
console.assert(
  moBasicTab && moBasicTab.headActionList && moBasicTab.headActionList[0] && moBasicTab.headActionList[0].uiAction === 'update',
  'mobile FormSheet update tab.actions → headActionList',
);
console.assert(!moBasicTab || !moBasicTab.actionList, 'mobile FormSheet update tab has no actionList');
const pcUpdateProps = updateDrawerProps;
const pcBasicTab = pcUpdateProps.tabList && pcUpdateProps.tabList.find(t => t.key === 'basicInfo');
console.assert(
  pcBasicTab && pcBasicTab.actionList && pcBasicTab.actionList[0] && pcBasicTab.actionList[0].uiAction === 'update',
  'pc UpdateDrawer update tab.actions → actionList',
);
console.assert(!pcBasicTab || !pcBasicTab.headActionList, 'pc UpdateDrawer update tab has no headActionList');
console.assert(mo.v7Meta.listColumnsSource === 'mobileColumns', 'mobile uses mobileColumns when set');
const moListNode = (() => {
  const walk = nodes => {
    for (const n of nodes || []) {
      if (n && n.component === 'List') return n;
      if (n && n.children) {
        const found = walk(n.children);
        if (found) return found;
      }
    }
    return null;
  };
  return walk(mo.pageContent);
})();
console.assert(moListNode, 'mobile List node exists');
const moListProps = moListNode.props || moListNode.resolvedProps || {};
console.assert(!moListProps.headActionList && !moListProps.toolbarActionList, 'mobile List has no toolbar in list body');
const moHeaderHStack = mo.pageContent[0] && mo.pageContent[0].children && mo.pageContent[0].children[0];
console.assert(moHeaderHStack && moHeaderHStack.component === 'HStack', 'mobile pageHeader is HStack');
const moToolbarNode = moHeaderHStack.children && moHeaderHStack.children.find(
  c => c && (c.component === 'MobileActions' || c.component === 'HeadToolbarActions' || c.component === 'MobileToolbarActions'),
);
console.assert(moToolbarNode, 'toolbarActions in header HStack');
const moToolbarProps = (moToolbarNode && (moToolbarNode.props || moToolbarNode.resolvedProps)) || {};
console.assert(
  moToolbarProps.actionList && moToolbarProps.actionList[0] && moToolbarProps.actionList[0].uiAction === 'create',
  'first toolbar action mapped',
);
const moFilterIdx = moHeaderHStack.children.findIndex(c => c && c.component === 'MobileFilterBtn');
const moToolbarIdx = moHeaderHStack.children.findIndex(
  c => c && (c.component === 'MobileActions' || c.component === 'HeadToolbarActions' || c.component === 'MobileToolbarActions'),
);
console.assert(moToolbarIdx >= 0 && moFilterIdx >= 0 && moFilterIdx < moToolbarIdx, 'mobile override: searchBtn left of toolbarActions');

// blocks 细粒度：toolbarActions / searchBtn / composeToolbar
let blockSnapshot = null;
expandCrudPage(Object.assign({}, desk, {
  targetPlatform: 'mobile',
  pc: undefined,
  mobile: (views, blocks) => {
    blockSnapshot = blocks;
    return {
      pageContent: { component: 'VStack', children: [blocks.pageHeader, blocks.list].filter(Boolean) },
      actionContent: [blocks.create, blocks.update, blocks.searchSheet].filter(Boolean),
    };
  },
}));
console.assert(blockSnapshot && blockSnapshot.toolbarActions && blockSnapshot.toolbarActions.component === 'MobileActions', 'blocks.toolbarActions node');
console.assert(blockSnapshot && blockSnapshot.searchBtn && blockSnapshot.searchBtn.component === 'MobileFilterBtn', 'blocks.searchBtn node');
console.assert(blockSnapshot && typeof blockSnapshot.composeToolbar === 'function', 'blocks.composeToolbar helper');
console.assert(blockSnapshot && blockSnapshot.filterBtn === blockSnapshot.searchBtn, 'filterBtn alias searchBtn');
console.assert(blockSnapshot && blockSnapshot.spacer && blockSnapshot.spacer.component === 'VSpacer', 'blocks.spacer VSpacer');
console.assert(blockSnapshot && blockSnapshot.toolbarSpacer === blockSnapshot.spacer, 'toolbarSpacer same as blocks.spacer');

const moComposeLayout = v.buildPage(Object.assign({}, desk, {
  targetPlatform: 'mobile',
  pc: undefined,
  mobile: (views, blocks) => ({
    pageContent: {
      component: 'VStack',
      children: [
        blocks.composeToolbar(
          [blocks.toolbarActions, blocks.toolbarSpacer, blocks.searchBtn],
          { props: { justify: 'space-between' } },
        ),
        blocks.list,
      ].filter(Boolean),
    },
  }),
}));
const moComposeRoot = moComposeLayout.standardConfig.pageContent[0];
const moComposeToolbar = moComposeRoot && moComposeRoot.children && moComposeRoot.children[0];
const moComposeList = moComposeRoot && moComposeRoot.children && moComposeRoot.children[1];
const readNodeClass = n => {
  const bag = (n && (n.resolvedAttrs || n.attrs)) || {};
  return bag.class ? String(bag.class) : '';
};
const moToolbarCls = readNodeClass(moComposeToolbar);
const moListCls = readNodeClass(moComposeList);
console.assert(moComposeToolbar && moComposeToolbar.component === 'HStack', 'composeToolbar → HStack');
const moComposeToolbarProps = (moComposeToolbar && (moComposeToolbar.props || moComposeToolbar.resolvedProps)) || {};
console.assert(moComposeToolbarProps.wrap === true, 'composeToolbar default wrap:true for flex-wrap');
console.assert(!/\bflex-1\b/.test(moToolbarCls), 'toolbar HStack must not have flex-1');
console.assert(/\bflex-none\b/.test(moToolbarCls), 'toolbar HStack flex-none');
console.assert(/\bflex-1\b/.test(moListCls), 'List body keeps flex-1');

const moHeaders = moListProps.headers || [];
console.assert(moHeaders[0] && moHeaders[0].value === 'projectName' && moHeaders[0].isTitle === true, 'mobileColumns[0] → title');
console.assert(moHeaders.some(h => h.value === 'status'), 'mobileColumns includes status');
console.assert(moListProps.cols === 2, 'default layout.list.cols → List.props.cols');
console.assert(mo.v7Meta.componentTokens.list === 'List', 'default platform mobile list');
console.assert(!moHeaders.some(h => h.value === 'projectId'), 'mobileColumns omits projectId');
const pcListHeaders = (() => {
  const walk = nodes => {
    for (const n of nodes || []) {
      if (n && n.component === 'Table') return (n.props || n.resolvedProps || {}).headers;
      if (n && n.children) {
        const h = walk(n.children);
        if (h) return h;
      }
    }
    return null;
  };
  return walk(pc.pageContent);
})();
console.assert(pcListHeaders && pcListHeaders[0].value === 'projectId', 'pc columns unchanged');
console.assert(pcListHeaders[0].width === 200, 'fields.width → pc headers.width');
console.assert(pcListHeaders[0].align === 'center', 'fields.align → pc headers.align');
console.assert(pcListHeaders[0].class === 'fixed', 'fields.class → pc headers.class');
console.assert(pcListHeaders[0].cellClass === 'fixed', 'fields.cellClass → pc headers.cellClass');
console.assert(mo.features.hasMobileSearch === true, 'explicit SearchSheet → feature flag');
const moPc = JSON.stringify(mo.pageContent);
console.assert(!moPc.includes('"component": "MobileSearch"'), 'no MobileSearch relay node');
console.assert(moPc.includes('jh-mobile-filter-btn'), 'mobile filter btn HTML');
console.assert(mo.actionContent.some(n => n && n.component === 'SearchSheet'), 'SearchSheet in actionContent');

// Req 8b: mobile 默认 create FormSheet，字段 span=cols（满行）
const moCreateForm = mo.actionContent.find(n => n && n.component === 'FormSheet' && n.key === 'create');
console.assert(moCreateForm, 'default mobile create FormSheet');
const moCreateFormProps = moCreateForm.resolvedProps || moCreateForm.props || {};
const moProjectName = moCreateFormProps.fieldList && moCreateFormProps.fieldList.find(f => f.key === 'projectName');
console.assert(moProjectName && moProjectName.span === 3, 'default mobile create: projectName span=cols(3)');
console.assert(moCreateFormProps.cols === 3, 'default mobile create cols=3');
console.assert(moCreateFormProps.labelMode === 'inline', 'mobile FormSheet labelMode inline');
console.assert(moCreateForm._meta && moCreateForm._meta.needsItemState === true, 'FormSheet needsItemState');
const moCreateBindings = moCreateForm.resolvedBindings || {};
console.assert(moCreateBindings[':initialData'] === 'createItem', 'FormSheet binds createItem');

// Req 8c: Sheet / FormSheet 绑定 initialData 时，页面须生成 {key}Item
const moMoreSheet = mo.actionContent.find(n => n && n.component === 'Sheet');
if (moMoreSheet) {
  console.assert(moMoreSheet._meta && moMoreSheet._meta.needsItemState === true, 'Sheet needsItemState when initialData bound');
}

// slots.list.mobile.children → jh-list 开闭标签内含 body 插槽
const moRawIr = expandCrudPage(Object.assign({}, desk, {
  pageType: 'jh-mobile-page',
  pc: undefined,
  slots: {
    list: {
      mobile: {
        children: ['<template v-slot:body="{ item }"><div class="slot-body-test">{{ item.projectName }}</div></template>'],
      },
    },
  },
}));
const moRawList = moRawIr.pageContent.children.find(n => n && n.component === 'List');
console.assert(moRawList && Array.isArray(moRawList.children) && moRawList.children.length, 'mobile List has slot children');
console.assert(String(moRawList.children[0]).includes('slot-body-test'), 'mobile body slot html preserved');

// MobileFilterBtn：children → v-slot:active-display（jh-mobile-filter-btn 具名插槽）
const { standardConfig: filterBtnSlotCfg } = parseSchema({
  version: 'v7',
  page: { id: 'filterBtnSlotSmoke' },
  dataSource: { table: 't', primaryKey: 'id' },
  pageContent: [{
    component: 'MobileFilterBtn',
    props: { label: '组织', showActive: true },
    children: [
      '<template v-slot:active-display><span class="badge-test">{{ orgName }}</span></template>',
    ],
    attrs: { '@click': 'isOrgFilterShown = true' },
  }],
  actionContent: [],
});
const filterBtnSlotNode = filterBtnSlotCfg.pageContent[0];
console.assert(filterBtnSlotNode.resolvedComponent === 'jh-mobile-filter-btn', 'MobileFilterBtn resolvedComponent');
console.assert(filterBtnSlotNode.children && filterBtnSlotNode.children.length === 1, 'MobileFilterBtn slot children');
console.assert(String(filterBtnSlotNode.children[0]).includes('v-slot:active-display'), 'active-display slot name');
console.assert(String(filterBtnSlotNode.children[0]).includes('badge-test'), 'active-display slot html');

// ─── layout regions ───────────────────────────────────────────────────────────
const layoutSemantic = Object.assign({}, desk, {
  pc: undefined,
  layout: {
    list: {
      regions: {
        treePanel: { role: 'tree' },
        mainTable: { role: 'table' },
      },
      treeWidth: '260px',
    },
  },
});
const { standardConfig: lx } = v.buildPage(layoutSemantic);
console.assert(JSON.stringify(lx.pageContent).includes('jh-hstack'), 'layout uses HStack');
console.assert(JSON.stringify(lx.pageContent).includes('treePanel'), 'tree region key');

// ─── includeList 分端（target）────────────────────────────────────────────────
const includeSemantic = Object.assign({}, desk, {
  includeList: [
    { type: 'html', path: 'common/a.html' },
    { type: 'html', path: 'pc-only/b.html', target: 'pc' },
    { type: 'html', path: 'mobile-only/c.html', target: 'mobile' },
    { type: 'html', path: 'both/d.html', target: ['pc', 'mobile'] },
  ],
});
const pcInc = v.buildPage(Object.assign({}, includeSemantic, { targetPlatform: 'pc' })).standardConfig.includeList;
const moInc = v.buildPage(Object.assign({}, includeSemantic, { targetPlatform: 'mobile' })).standardConfig.includeList;
console.assert(pcInc.length === 3 && pcInc.every(i => !i.target), 'pc includeList: common+pc+both, no target field');
console.assert(pcInc.some(i => i.path === 'pc-only/b.html'), 'pc gets pc-only item');
console.assert(!pcInc.some(i => i.path === 'mobile-only/c.html'), 'pc excludes mobile-only');
console.assert(moInc.length === 3 && moInc.every(i => !i.target), 'mobile includeList filtered');
console.assert(moInc.some(i => i.path === 'mobile-only/c.html'), 'mobile gets mobile-only item');
console.assert(!moInc.some(i => i.path === 'pc-only/b.html'), 'mobile excludes pc-only');

// ─── jh-component + mode ─────────────────────────────────────────────────────
const taskSubTable = require('./taskSubTable.v7.component.crud.sample');
const summaryCard = require('./projectSummaryCard.v7.component.ui.sample');
const compCrud = v.buildPage(taskSubTable);
console.assert(compCrud.standardConfig.v7Meta.mode === 'crud', 'component crud mode');
console.assert(compCrud.standardConfig.pageType === undefined || compCrud.standardConfig.page.componentPath, 'component path in standardConfig');
console.assert(compCrud.legacyConfig.pageType === 'jh-component', 'legacy pageType jh-component');
console.assert(!compCrud.legacyConfig.pageId, 'component legacy no pageId');
console.assert(compCrud.legacyConfig.resourceList.length === 0, 'component no resourceList');
const compUi = v.buildPage(summaryCard);
console.assert(compUi.standardConfig.v7Meta.mode === 'ui', 'component ui mode');
console.assert(compUi.standardConfig.pageContent[0].component === 'VStack', 'ui component pageContent');
const uiRootClass = compUi.standardConfig.pageContent[0].resolvedAttrs && compUi.standardConfig.pageContent[0].resolvedAttrs.class;
console.assert(!uiRootClass || !/\bh-full\b/.test(uiRootClass), 'ui jh-component VStack no h-full');
const crudRootClass = compCrud.standardConfig.pageContent[0].resolvedAttrs && compCrud.standardConfig.pageContent[0].resolvedAttrs.class;
console.assert(crudRootClass && /\bh-full\b/.test(crudRootClass), 'crud jh-component with Table keeps h-full on VStack');

console.log('v7 platform/layout smoke ok');
