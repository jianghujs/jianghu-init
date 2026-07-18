'use strict';

/**
 * V7 旧 key -> canonical key 迁移定义（唯一来源）。
 *
 * - SEMANTIC_VIEW_KEY_MIGRATIONS：views.* 同级 rename → semanticKeyAliases
 * - SEMANTIC_STRUCTURAL_MIGRATIONS：跨路径结构迁移 → normalizeSchema + VSCode warning
 * - RUNTIME_PROP_MIGRATIONS：组件 props rename → componentDescriptors.propRenames
 */

const SEMANTIC_VIEW_KEY_MIGRATIONS = {
  list: [
    { from: 'columns', to: 'columnList' },
    { from: 'mobileColumns', to: 'mobileColumnList' },
    { from: 'toolbarActions', to: 'headActionList' },
    { from: 'toolbarList', to: 'headActionList' },
    { from: 'headActions', to: 'headActionList' },
    { from: 'rowActions', to: 'rowActionList' },
    { from: 'actionList', to: 'rowActionList' },
    { from: 'actions', to: 'rowActionList' },
  ],
  create: [
    { from: 'fields', to: 'fieldList' },
    { from: 'actions', to: 'actionList' },
    { from: 'submitActions', to: 'actionList' },
    { from: 'formActions', to: 'actionList' },
    { from: 'saveTipBeforeClose', to: 'beforeCloseConfirm' },
    { from: 'sheet', to: 'mobileSheet' },
  ],
  update: [
    { from: 'fields', to: 'fieldList' },
    { from: 'actions', to: 'actionList' },
    { from: 'submitActions', to: 'actionList' },
    { from: 'formActions', to: 'actionList' },
    { from: 'tabs', to: 'tabList' },
    { from: 'sheet', to: 'mobileSheet' },
  ],
  tab: [
    { from: 'fields', to: 'fieldList' },
    { from: 'actions', to: 'actionList' },
  ],
};

/** fields / views / page 结构迁移（非同级 rename） */
const SEMANTIC_STRUCTURAL_MIGRATIONS = {
  pageTemplateString: 'template.{pc,mobile}',
  includeListItem: [{ from: 'target', to: 'targets' }],
  field: [
    { from: 'width', to: 'column.width' },
    { from: 'align', to: 'column.align' },
    { from: 'class', to: 'column.class' },
    { from: 'cellClass', to: 'column.cellClass' },
    { from: 'op', to: 'search.op' },
    { from: 'component', to: 'form.component' },
    { from: 'options', to: 'form.options' },
    { from: 'required', to: 'form.required' },
    { from: 'readonly', to: 'form.readonly' },
    { from: 'rules', to: 'form.rules' },
    { from: 'placeholder', to: 'form.placeholder' },
    { from: 'hint', to: 'form.hint' },
    { from: 'quickAttrs', to: 'form.quickAttrs' },
    { from: 'attrs', to: 'form.attrs' },
    { from: 'pc', to: 'form.pcAttrs' },
    { from: 'mobile', to: 'form.mobileAttrs' },
  ],
  listIntoSearch: [
    { from: 'mobileSearchBtnText', to: 'search.mobileBtnText' },
    { from: 'mobileSearchIcon', to: 'search.mobileBtnIcon' },
    { from: 'mobileSearchBtnClass', to: 'search.mobileBtnClass' },
    { from: 'searchSheet', to: 'search.mobileSheet' },
    { from: 'mobileSearchTitle', to: 'search.mobileSheet.title' },
    { from: 'mobileSearchKey', to: '内部稳定 key' },
  ],
  listSearch: [{ from: 'fields', to: 'fieldList' }],
  formView: {
    fieldAttrs: 'fields.*.createForm/updateForm.attrs',
    type: '移除（结构已表示 form）',
  },
  sheet: {
    autoHeight: 'bodyHeightMode',
    viewportOffset: 'maxBodyHeight',
    bodyHeight: "maxBodyHeight + bodyHeightMode:'fill'",
    minCardHeight: '兼容保留',
    rounded: '固定组件视觉',
  },
  actionIntent: {
    intent: 'uiAction',
    id: 'uiAction',
    actionId: 'uiAction',
  },
};

const RUNTIME_PROP_MIGRATIONS = {
  Table: [
    { from: 'toolbarActionList', to: 'headActionList' },
    { from: 'columns', to: 'headers' },
  ],
  List: [
    { from: 'toolbarActionList', to: 'headActionList' },
    { from: 'columns', to: 'headers' },
  ],
  Form: [{ from: 'fields', to: 'fieldList' }],
  FormContainer: [
    { from: 'fields', to: 'fieldList' },
    { from: 'headActionList', to: 'actionList' },
  ],
  FormSheet: [{ from: 'shown', to: 'value' }],
  Sheet: [
    { from: 'shown', to: 'value' },
    { from: 'headActionList', to: 'actionList' },
  ],
  SearchSheet: [
    { from: 'shown', to: 'value' },
    { from: 'searchFieldList', to: 'fieldList' },
    { from: 'keywordMeta', to: 'keywordConfig' },
    { from: 'showSearchBtn', to: 'showBtn' },
  ],
  Search: [
    { from: 'fields', to: 'fieldList' },
    { from: 'searchFieldList', to: 'fieldList' },
    { from: 'searchBtn', to: 'showBtn' },
    { from: 'showSearchBtn', to: 'showBtn' },
    { from: 'searchBtnText', to: 'btnText' },
    { from: 'searchBtnIcon', to: 'btnIcon' },
  ],
  TableFilter: [{ from: 'fields', to: 'filterList' }],
  PageTitle: [{ from: 'helpDoc', to: 'showHelp' }],
  PageHeader: [{ from: 'helpBtn', to: 'showHelp' }],
  TextBtn: [
    { from: 'text', to: 'label' },
    { from: 'iconName', to: 'icon' },
    { from: 'iconRight', to: 'iconPosition' },
  ],
};

const SHEET_RETAINED_DEPRECATED_PROPS = [
  'minCardHeight', 'hiddenBtn', 'rounded',
];

const toAliasMap = migrations => Object.fromEntries(
  (migrations || []).map(({ from, to }) => [from, to]),
);

/** normalizeSchema：按 group.key 拆分 field 结构迁移目标（pc/mobile 由专用逻辑处理） */
const fieldStructuralGroups = () => {
  const groups = { column: [], search: [], form: [] };
  const platformKeys = new Set(['pc', 'mobile']);
  for (const { from, to } of SEMANTIC_STRUCTURAL_MIGRATIONS.field) {
    if (platformKeys.has(from)) continue;
    const [group, key] = to.split('.');
    if (groups[group]) groups[group].push({ from, key });
  }
  return groups;
};

/** normalizeSchema：views.list 平铺 key → search 子路径 */
const listSearchLayoutMoves = () => SEMANTIC_STRUCTURAL_MIGRATIONS.listIntoSearch
  .filter(item => item.from !== 'mobileSearchTitle' && item.from !== 'mobileSearchKey')
  .map(({ from, to }) => {
    const searchKey = to.replace(/^search\./, '');
    return [from, searchKey];
  });

const RUNTIME_PROP_MIGRATION_GROUPS = {
  PageHeader: ['PageHeader', 'Search'],
  SearchSheet: ['SearchSheet', 'Search'],
  CreateDrawer: ['FormContainer'],
  UpdateDrawer: ['FormContainer'],
  FormDrawer: ['FormContainer'],
  FormSheet: ['FormContainer', 'FormSheet'],
};

const resolveRuntimePropAliases = component => {
  const groups = RUNTIME_PROP_MIGRATION_GROUPS[component];
  const names = groups || (RUNTIME_PROP_MIGRATIONS[component] ? [component] : []);
  return Object.assign({}, ...names.map(name => toAliasMap(RUNTIME_PROP_MIGRATIONS[name])));
};

module.exports = {
  SEMANTIC_VIEW_KEY_MIGRATIONS,
  SEMANTIC_STRUCTURAL_MIGRATIONS,
  RUNTIME_PROP_MIGRATIONS,
  RUNTIME_PROP_MIGRATION_GROUPS,
  SHEET_RETAINED_DEPRECATED_PROPS,
  toAliasMap,
  resolveRuntimePropAliases,
  fieldStructuralGroups,
  listSearchLayoutMoves,
};
