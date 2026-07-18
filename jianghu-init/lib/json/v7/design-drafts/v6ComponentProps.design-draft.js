/**
 * V6 component props 统一设计草案。
 *
 * 用途：集中讨论 component/v6 下全部组件的 props 命名与职责；
 * 不代表当前正式规范。
 *
 * 约束：
 *   - 本文件不参与组件复制、V7 编译或页面生成。
 *   - 先统一同类组件的公共 props，再保留 PC/Mobile 专属 props。
 *   - 改名必须提供旧 key 兼容；确认前不修改现有 V6 组件。
 *
 * 注释标签：
 *   - 保持现行：名称与职责均不调整。
 *   - 草案改名：目标 canonical key，正式实施时需要 alias。
 *   - 平台专属：仅对应组件使用，不要求跨端补齐。
 *   - 待确认：尚未决定，不作为实现依据。
 */

// jh-table 与 jh-list 的公共 props。
const collectionProps = {
  // 保持现行：两端均消费标准 header 对象；不改成 columnList。
  headers: [],

  // 保持现行：行操作在 Table 操作列、List 操作区中渲染。
  rowActionList: [],

  // 草案改名：toolbarActionList -> headActionList。
  // 原因：动作位于集合头部，不把公共语义绑定到 PC toolbar 表现。
  headActionList: [],

  // 保持现行：当前结果集的前端过滤配置。
  filterList: [],

  // 保持现行：true 时翻页由外部请求；false 时组件对完整结果前端分页。
  serverPagination: false,
  pageSize: 50,
  selectable: false,
  primaryKey: 'id',

  // 待确认：items 是否改为 itemList。
  // items 与 Vuetify/列表组件习惯一致；itemList 更符合 JianghuJS 数组命名规范。
  items: [],
  loading: false,

  // 待确认：options 名称过宽，当前实际承载 page/limit/totalCount。
  // 需要先确认是保留 Vuetify 风格 options，还是收束为 pagination。
  options: {
    page: 1,
    limit: 50,
    totalCount: 0,
  },

  // 待确认：tableSelected 带有 PC Table 痕迹，可考虑 selectedItemList。
  tableSelected: [],
};

const tableOnlyProps = {
  // 平台专属：透传 v-data-table 的非托管 props。
  dataTableProps: {},
};

const listOnlyProps = {
  // 平台专属：移动端卡片字段布局。
  cols: 2,
  titleField: '',
  gap: 8,

  // 平台专属：移动端操作区与分页提示。
  actionSheetTitle: '操作',
  showPageSizeHint: true,
  rightArrow: false,
  rightArrowText: '详情',
  mobileItemAction: 'sheet',
};

// jh-form 及其 Drawer/Sheet 容器的公共表单 props。
const formProps = {
  // 草案改名：jh-form.fields -> fieldList。
  // Drawer/Sheet 已以 fieldList 为主；fields 仅保留为旧 key alias。
  fieldList: [],
  initialData: {},
  originData: null,
  showFieldChange: true,

  // 保持同名、允许平台使用不同默认值。
  cols: 3,
  gap: '12px 16px',
  labelMode: 'above',
  scope: null,
};

// jh-drawer、jh-sheet 及其业务容器的公共叠层 props。
const overlayProps = {
  // 草案统一：全部叠层对外使用 Vue 2 标准 v-model（value + input）。
  // Sheet 内部再将 value 映射给 v-bottom-sheet；shown 仅作为旧 key alias。
  value: false,
  title: '',
};

// jh-form-drawer 与 jh-form-sheet 的公共容器 props。
const formContainerProps = {
  ...overlayProps,
  formKey: '',
  initialData: {},
  tabList: [],
  fieldList: [],

  beforeCloseConfirm: false,

  // 待确认：beforeCloseCompareFields 是否改为 beforeCloseCompareFieldList。
  beforeCloseCompareFields: null,

  // 草案统一：Drawer 与 Sheet 均在标题栏渲染同一组表单动作。
  // FormSheet 不再对外暴露 headActionList；内部可映射到基础 Sheet 标题栏插槽。
  actionList: [],

  cols: 1,
  gap: '12px 16px',
  labelMode: 'above',
  scope: null,
};

const sheetOnlyProps = {
  // 平台专属：true 时禁止点击遮罩关闭 Sheet。
  persistent: false,

  // 内容区可用最大高度。
  // null 时由具体 Sheet 根据视口、menu、Sheet 标题栏和安全区计算默认值。
  // 业务覆盖可直接使用 CSS 高度，如 '70vh' 或 'calc(100vh - 120px)'。
  maxBodyHeight: null,

  // 内容区伸展方式；两种模式使用同一个 maxBodyHeight，仅最小表现不同：
  //   content：height:auto，内容较少时自然收缩，最多不超过 maxBodyHeight。
  //   fill：height:maxBodyHeight，内容较少时也撑满全部可用高度。
  bodyHeightMode: 'content',

  // 内容区附加 class，仅作为高级样式扩展入口，不参与高度模式计算。
  bodyClass: null,
};

const formSheetOnlyProps = {
  ...sheetOnlyProps,

  // FormSheet 默认 maxBodyHeight 由视口减去 menu、标题栏和安全区得到；
  // 默认撑满该可用高度，业务可显式改为 content。
  bodyHeightMode: 'fill',
};

const drawerOnlyProps = {
  // 平台专属：Drawer 宽度；支持 CSS 长度。
  width: '90%',
};

// 基础 jh-sheet 的内容模式 props；FormSheet 不直接暴露这些模式切换项。
const genericSheetContentProps = {
  // 排序模式与操作网格模式互斥；均为空时渲染默认插槽。
  orderList: [],
  actionList: [],

  // 仅基础 Sheet 使用：与内容区 actionList 是不同操作区域。
  // FormSheet 统一只使用 formContainerProps.actionList。
  headActionList: [],

  // 保持现行：基础 Sheet 独立使用 headActionList 时的条件求值上下文。
  // FormSheet 内部自行提供，不将这三个 key 暴露为表单容器公共 props。
  initialData: {},
  scope: null,
  headActionResolveScope: '',

  // 操作网格列数，仅 actionList 内容模式使用。
  cols: 2,
};

// 基础 Sheet 的高级运行参数；普通业务配置不应默认生成这些 key。
const sheetAdvancedProps = {
  stackZIndex: 340,
  attach: false,
  lazy: false,
  cardClass: null,
  actionsClass: null,
};

// 由 views.list.search 编译生成的搜索组件公共运行时 props。
// 不包含移动端触发按钮和 mobileSheet 容器配置。
const searchProps = {
  // 草案统一：views.list.search.fields / searchFieldList -> fieldList。
  fieldList: [],

  // 草案统一：keyword 始终是当前关键字字符串，不再同时承载配置对象。
  keyword: '',

  // 草案改名：jh-search.keyword(object) / SearchSheet.keywordMeta -> keywordConfig。
  // 固定搜索列和 placeholder 等元信息放在这里。
  keywordConfig: {
    fields: [],
    placeholder: '',
  },

  // 保留为公共能力：动态选择参与关键字搜索的字段；运行逻辑后续完善。
  keywordFieldList: [],

  // 保留为公共能力：动态选列依赖的 Table headers；端到端联调后再正式启用。
  keywordHeaders: [],

  // 草案统一：searchBtn / showSearchBtn -> showBtn。
  // true 为按钮提交；false 时各搜索组件都应在字段变化后立即触发搜索。
  showBtn: true,

  // 草案新增：统一 PC/Mobile 查询按钮展示内容。
  btnText: '查询',
  btnIcon: 'search',
};

// jh-mobile-search-sheet = 搜索契约 + 叠层契约 + Sheet 高度行为。
const searchSheetProps = {
  ...overlayProps,
  ...searchProps,
  ...sheetOnlyProps,

  // SearchSheet 默认随搜索字段内容自然收缩。
  bodyHeightMode: 'content',
};

const tableFilterProps = {
  // 草案改名：jh-table-filter.fields -> filterList，与 jh-table.filterList 对齐。
  filterList: [],
};

// jh-page-title 与 jh-page-header 的公共标题/帮助入口 props。
const pageTitleProps = {
  title: '',

  // 草案统一：PageTitle.helpDoc / PageHeader.helpBtn -> showHelp。
  showHelp: false,
  helpSrc: '',
  pageId: '',
};

// PageHeader 是 PageTitle + Search 的组合组件，不再定义第三套搜索 key。
const pageHeaderProps = {
  ...pageTitleProps,
  ...searchProps,
};

const mobileActionsProps = {
  actionList: [],

  // 保持现行：动作条件求值上下文；后续若统一 action context 再单独设计。
  initialData: {},
  scope: null,
  resolveScope: '',
};

const mobileFilterBtnProps = {
  label: '',
  btnClass: '!rounded-xl px-2 border border-solid border-gray-300',
  showActive: false,
  activeDisplay: undefined,
  icon: '',
};

const textBtnProps = {
  // 草案改名：text -> label，与 Action/Button 统一。
  label: '',

  // 草案改名：iconName -> icon。
  icon: '',
  iconSize: 16,
  iconStroke: 1.5,
  color: 'primary',
  fontSize: '12px',
  dashed: true,
  disabled: false,
  loading: false,

  // 草案改名：iconRight(boolean) -> iconPosition，避免布尔含义扩展困难。
  iconPosition: 'left',

  // 草案删除：alignSub 仅控制内部 class，改由组件固定样式或 attrs.class 处理。
};

// jh-vstack 与 jh-hstack 的公共布局 props。
const stackProps = {
  gap: 0,
  justify: 'start',
  padding: '',

  // 草案删除：flexFromCls；响应式布局直接通过 attrs.class 覆盖。
};

const vStackOnlyProps = {
  align: 'stretch',
};

const hStackOnlyProps = {
  align: 'center',
  wrap: false,
};

const boxProps = {
  padding: '',
  margin: '',
  width: '100%',

  // 草案删除：extraStyle；统一使用节点 attrs.style / :style。
};

const gridProps = {
  // 草案分组：colsSm / colsMd -> cols 响应式对象。
  // 数字表示固定列数；对象示例：{ xs: 1, sm: 2, md: 3 }。
  cols: 1,
  gap: 0,
};

const inputLabelProps = {
  label: '',
  required: false,
};

// 已注册但没有 props 的 Vue 组件。
const noPropsComponents = [
  'jh-field-change-dot',
];

// V6 运行时工具，不是 Vue 组件，不计入 componentCoverage。
const runtimeUtilities = [
  'jhWhenUtil',
  'jhActionWhenMixin',
];

// 组件结构层的待确认项；这里只记录方向，不作为 props 实施依据。
const componentStructureDraft = {
  // 三者公共契约完全一致，长期可由 jh-form-drawer + title/action 默认值承载。
  formDrawerFamily: ['jh-create-drawer', 'jh-update-drawer', 'jh-form-drawer'],

  // 三个标签注册的是同一个实现；目标只保留 jh-mobile-actions 为 canonical tag。
  mobileActionsAliases: ['jh-head-toolbar-actions', 'jh-mobile-toolbar-actions'],

  // PageHeader 保留为组合便利组件，但标题/帮助与搜索分别复用公共契约和实现。
  pageHeaderComposition: ['jh-page-title', 'jh-search'],

  // 仅供组件内部使用，不作为 V7 Schema 可直接选择的业务组件。
  internalComponents: ['jh-input-label', 'jh-field-change-dot'],
};

// 组件对 V7 Schema 的暴露范围草案。
// props 命名统一与“能否在 component 节点直接使用”是两件事，正式实施时需分别确认。
const componentExposureDraft = {
  // 当前已有 runtime descriptor，可稳定完成 Schema component -> Vue tag 映射。
  descriptorBacked: [
    'VStack', 'HStack', 'Box', 'Grid',
    'PageTitle', 'PageHeader', 'Search',
    'Table', 'List',
    'CreateDrawer', 'UpdateDrawer', 'FormDrawer', 'Drawer',
    'Sheet', 'FormSheet', 'SearchSheet',
    'MobileFilterBtn', 'MobileActions', 'HeadToolbarActions', 'MobileToolbarActions',
  ],

  // Vue/Vuetify 原生节点，不需要 V6 自定义组件 descriptor。
  nativeNodes: ['VSpacer'],

  // 由上层组件组合使用，不建议作为业务 Schema 的直接节点开放。
  composedInternal: ['jh-table-filter', 'jh-input-label', 'jh-field-change-dot'],

  // 已注册且具备独立使用价值，但当前没有 runtime descriptor；需确认是否正式开放。
  publicExposurePending: [
    { tag: 'jh-form', schemaComponent: 'Form' },
    { tag: 'jh-text-btn', schemaComponent: 'TextBtn' },
  ],

  // 已有 descriptor 或现行样例直接使用，但 IDE pageNode enum 尚未全部开放。
  // 正式实施时应让 Schema enum 与 runtime descriptor 使用范围保持一致。
  schemaEnumAlignmentPending: [
    'PageTitle', 'Search', 'List', 'MobileFilterBtn', 'MobileActions', 'VSpacer',
  ],

  // 仅保留旧配置识别，不再作为新配置推荐名称。
  compatibilityOnly: ['HeadToolbarActions', 'MobileToolbarActions', 'CreateSheet', 'UpdateSheet'],
};

// 旧 key 的目标去向。正式实施时集中在兼容层处理，组件内部不长期保留双 key。
const compatibilityDraft = {
  'jh-table.toolbarActionList': 'headActionList',
  'jh-list.toolbarActionList': 'headActionList',
  'jh-form.fields': 'fieldList',
  'formContainer.fields': 'fieldList',
  'formSheet.headActionList': 'actionList',
  'sheet.shown': 'value',
  'searchSheet.shown': 'value',
  'views.list.search.fields': 'fieldList',
  'search.fields': 'fieldList',
  'search.searchFieldList': 'fieldList',
  'search.keyword(object)': 'keywordConfig',
  'search.searchBtn': 'showBtn',
  'search.showSearchBtn': 'showBtn',
  'search.searchBtnText': 'btnText',
  'search.searchBtnIcon': 'btnIcon',
  'searchSheet.keywordMeta': 'keywordConfig',
  'tableFilter.fields': 'filterList',
  'pageTitle.helpDoc': 'showHelp',
  'pageHeader.helpBtn': 'showHelp',
  'textBtn.text': 'label',
  'textBtn.iconName': 'icon',
  'textBtn.iconRight': 'iconPosition',
  'grid.colsSm|colsMd': 'cols',
};

// 已确认不进入目标公共契约的历史或重复 props。
const removedProps = [
  'Sheet.autoHeight',
  'Sheet.viewportOffset',
  'Sheet.bodyHeight',
  'Sheet.minCardHeight',
  'Sheet.hiddenBtn',
  'Sheet.rounded',
  'TextBtn.alignSub',
  'VStack.flexFromCls',
  'HStack.flexFromCls',
  'Box.extraStyle',
  'Grid.colsSm',
  'Grid.colsMd',
];

// component/v6 注册组件覆盖表；用于确认草案没有遗漏组件。
// 已逐项核对源文件 props：25 个注册标签的现有 key 均已进入目标 props、compatibilityDraft
// 或 removedProps；此表只记录目标契约归属，不重复抄录旧 props 清单。
const componentCoverage = {
  'jh-table': ['collectionProps', 'tableOnlyProps'],
  'jh-list': ['collectionProps', 'listOnlyProps'],
  'jh-table-filter': ['tableFilterProps'],
  'jh-form': ['formProps'],
  'jh-create-drawer': ['formContainerProps', 'drawerOnlyProps'],
  'jh-update-drawer': ['formContainerProps', 'drawerOnlyProps'],
  'jh-form-drawer': ['formContainerProps', 'drawerOnlyProps'],
  'jh-form-sheet': ['formContainerProps', 'formSheetOnlyProps'],
  'jh-drawer': ['overlayProps', 'drawerOnlyProps'],
  'jh-sheet': ['overlayProps', 'sheetOnlyProps', 'genericSheetContentProps', 'sheetAdvancedProps'],
  'jh-search': ['searchProps'],
  'jh-mobile-search-sheet': ['searchSheetProps'],
  'jh-page-title': ['pageTitleProps'],
  'jh-page-header': ['pageHeaderProps'],
  'jh-mobile-actions': ['mobileActionsProps'],
  'jh-head-toolbar-actions': ['mobileActionsProps'],
  'jh-mobile-toolbar-actions': ['mobileActionsProps'],
  'jh-mobile-filter-btn': ['mobileFilterBtnProps'],
  'jh-text-btn': ['textBtnProps'],
  'jh-vstack': ['stackProps', 'vStackOnlyProps'],
  'jh-hstack': ['stackProps', 'hStackOnlyProps'],
  'jh-box': ['boxProps'],
  'jh-grid': ['gridProps'],
  'jh-input-label': ['inputLabelProps'],
  'jh-field-change-dot': [],
};

module.exports = {
  collectionProps,
  tableOnlyProps,
  listOnlyProps,
  formProps,
  overlayProps,
  formContainerProps,
  drawerOnlyProps,
  sheetOnlyProps,
  formSheetOnlyProps,
  genericSheetContentProps,
  sheetAdvancedProps,
  searchProps,
  searchSheetProps,
  tableFilterProps,
  pageTitleProps,
  pageHeaderProps,
  mobileActionsProps,
  mobileFilterBtnProps,
  textBtnProps,
  stackProps,
  vStackOnlyProps,
  hStackOnlyProps,
  boxProps,
  gridProps,
  inputLabelProps,
  noPropsComponents,
  runtimeUtilities,
  componentStructureDraft,
  componentExposureDraft,
  compatibilityDraft,
  removedProps,
  componentCoverage,
};
