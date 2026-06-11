import * as vscode from 'vscode';
import { parseComponentTypeFromLine } from './configHoverUtils';
import { isV6ConfigDocument } from './configVersionDetect';

// ─────────────────────────────────────────────────────────────────────────────
// 文档条目
interface DocEntry {
  description: string;
  type?: string;
  example?: string;
}

/**
 * V6 配置路径感知文档表
 *
 * Key 格式：
 *   "contextKey|...|currentKey"   — 带祖先上下文匹配（越具体越优先）
 *   "currentKey"                  — 兜底，任意位置
 *
 * 特殊祖先前缀：
 *   "Table|", "Drawer|", "PageHeader|", "MobileOrder|", "MobileFilter|", "MobileAction|", "MobileSearch|", "Sheet|", "SearchSheet|", "MobileFilterBtn|", "Grid|", "VStack|", "HStack|"
 *   — 最近的 component: "XXX" 声明决定
 *
 * UI 区域：
 *   "pageContent|component" / "actionContent|component"
 *   — component 取值范围随所在树根数组不同（见 lookupDoc 内 getV6UiTreeSection）
 */
const V6_PATH_DOCS: Record<string, DocEntry> = {

  // ── 顶级 ──────────────────────────────────────────────────────────────────
  version:       { type: 'string',  description: '固定为 `"v6"`' },
  pageType:      { type: 'string',  description: '页面类型：`"jh-page"` | `"jh-mobile-page"` | `"jh-component"`' },
  template:      { type: 'string',  description: 'NJK 模板名，省略时默认 `jhTemplateV4`' },
  pageContent:   {                  description: '页面 UI 组件树，渲染到主体区域' },
  actionContent: {                  description: '操作区组件树（抽屉等），渲染到页面操作区' },
  resourceList:  {                  description: '资源列表（接口资源定义数组）。每项声明一个后端资源：`sql`（对表做 select/jhInsert/jhUpdate/jhDelete）或 `service`（调用 service/serviceFunction）。' },
  common:        {                  description: '扩展 Vue 实例：data / computed / methods / watch / doUiAction' },
  includeList:   {                  description: '引入资源列表。支持字符串或对象数组；常用于额外注入 css/js/html/include 或注册 Vue 插件/组件（vueUse/vueComponent）。' },

  // ── resourceList item（资源定义）──────────────────────────────────────────
  'resourceList|actionId':     { type: 'string', description: '资源操作唯一标识（会被 doUiAction 引用），建议用小驼峰或带路径的命名', example: '"selectItemList"' },
  'resourceList|desc':         { type: 'string', description: '资源描述信息（用于文档/可读性）' },
  'resourceList|resourceType': { type: 'string', description: '资源类型：`"sql"` | `"service"`' },
  'resourceList|resourceData': { type: 'object', description: '资源具体数据。resourceType=`sql` 时为 `{ table, operation, fieldList? }`；resourceType=`service` 时为 `{ service, serviceFunction }`' },
  'resourceList|resourceHook': { type: 'object', description: '资源钩子：`{ before?: [{ service, serviceFunction }], after?: [...] }`，在资源执行前/后插入 service 调用' },

  // resourceData(sql)
  'resourceData|table':     { type: 'string', description: 'SQL 资源操作的表名', example: '"project"' },
  'resourceData|operation': { type: 'string', description: 'SQL 操作类型：`"select"` | `"jhInsert"` | `"jhUpdate"` | `"jhDelete"`（也兼容 `"insert"`/`\"update\"`/`\"delete\"`）' },
  'resourceData|fieldList': { type: 'string[]', description: 'SQL 资源字段列表（可选；用于限定 select/写入字段）', example: '["id","name","status"]' },

  // resourceData(service)
  'resourceData|service':         { type: 'string', description: 'service 名称', example: '"projectService"' },
  'resourceData|serviceFunction': { type: 'string', description: 'service 方法名', example: '"selectProjectList"' },

  // resourceHook
  'resourceHook|before': { description: '前置钩子列表：每项 `{ service, serviceFunction }`' },
  'resourceHook|after':  { description: '后置钩子列表：每项 `{ service, serviceFunction }`' },

  // hook item
  'before|service':         { type: 'string', description: '钩子 service 名称' },
  'before|serviceFunction': { type: 'string', description: '钩子 service 方法名' },
  'after|service':          { type: 'string', description: '钩子 service 名称' },
  'after|serviceFunction':  { type: 'string', description: '钩子 service 方法名' },

  // ── includeList item（引入资源定义）───────────────────────────────────────
  'includeList|type':        { type: 'string', description: '资源类型：`\"css\"` `\"js\"` `\"html\"` `\"include\"` `\"vueUse\"` `\"vueComponent\"`' },
  'includeList|path':        { type: 'string', description: '资源路径（type 为 css/js/html/include 时必填）', example: '"component/v6/jhLayoutV6.html"' },
  'includeList|attrs':       { type: 'object', description: '资源属性（如 script/link 标签属性，或 include 的 attrs）' },
  'includeList|includeType': { type: 'string', description: '引入类型（可选；由生成器决定如何 include/插入）' },
  'includeList|component':   { type: 'string', description: '组件名称（type 为 vueUse/vueComponent 时必填）', example: '"Vuetify"' },

  // ── page ─────────────────────────────────────────────────────────────────
  'page':           {                  description: '页面元信息' },
  'page|id':        { type: 'string',  description: 'pageId / 路由标识（全局唯一）', example: '"memberManagement"' },
  'page|name':      { type: 'string',  description: '页面显示名称', example: '"成员管理"' },
  'page|hook':      { type: 'string',  description: '钩子点，用于中间件扩展' },
  'page|menu':      { type: 'boolean', description: '是否显示在导航菜单' },
  'page|vuetify':   { type: 'object',  description: '自定义主题' },
  'page|template':  { type: 'string',  description: '覆盖根级 template 的 NJK 模板名' },

  // ── dataSource ────────────────────────────────────────────────────────────
  'dataSource':                { description: '数据源（绑定数据库表与主键）' },
  'dataSource|table':          { type: 'string', description: '数据库表名', example: '"memberAManagement"' },
  'dataSource|primaryKey':     { type: 'string', description: '主键字段名，默认 `"id"`', example: '"id"' },
  'dataSource|listResource':   { type: 'string', description: '列表查询 actionId；默认 `selectItemList`；NJK bake 为 `const listResource`' },
  'dataSource|createResource': { type: 'string', description: '新增 actionId；默认 `insertItem`' },
  'dataSource|updateResource': { type: 'string', description: '编辑 actionId；默认 `updateItem`' },
  'dataSource|deleteResource': { type: 'string', description: '删除 actionId；默认 `deleteItem`' },
  'dataSource|resource':       { type: 'object', description: '嵌套写法：`{ list, create, update, delete, get }` → 扁平 *Resource（flattenDataSource）' },
  'dataSource|actions':        { type: 'object', description: '嵌套写法：同 resource，键名 list/create/update/delete' },
  'resource|list':             { type: 'string', description: '→ listResource' },
  'resource|create':           { type: 'string', description: '→ createResource' },
  'resource|update':           { type: 'string', description: '→ updateResource' },
  'resource|delete':           { type: 'string', description: '→ deleteResource' },

  // ── 组件节点通用（component 取值随 pageContent / actionContent 分支，见下两条）────────
  'pageContent|component': {
    type: 'string',
    description:
      '**pageContent**（页面主体）中的 `component`，仅允许布局与主体业务组件（与 v6 schema `pageNode` 枚举一致）：\n' +
      '- `"VStack"` / `"HStack"` — 竖向 / 横向堆叠布局\n' +
      '- `"Box"` — 基础容器\n' +
      '- `"Grid"` — 网格布局\n' +
      '- `"PageHeader"` — 页面头部（标题、搜索等）\n' +
      '- `"Table"` — 数据表格（通常需配合 `props`）\n' +
      '- **`MobileOrder` / `MobileFilter` / `MobileAction` / `MobileSearch`** — 移动端中继：解析时在正文插入 **`jh-mobile-filter-btn`** 触发器，并在 **actionContent** 末尾追加 **`Sheet` / `FormSheet` / `SearchSheet`**（详见各中继的 `props`）\n\n' +
      '新增 / 编辑等 **抽屉** 请写在 **actionContent**，不要写在 pageContent。',
  },
  'actionContent|component': {
    type: 'string',
    description:
      '**actionContent**（操作区 / 覆盖层）中的 `component`，一般为抽屉或底部叠层：\n' +
      '- `"CreateDrawer"` — 新增表单抽屉\n' +
      '- `"UpdateDrawer"` — 编辑表单抽屉\n' +
      '- `"Drawer"` — 通用抽屉（自定义主体）\n' +
      '- **`FormDrawer`** — 配置式表单抽屉\n' +
      '- **`Sheet`** — 底部 **`jh-sheet`**（排序列表 `orderList` / 操作网格 `actionList` 等）\n' +
      '- **`FormSheet`** — 底部 **`jh-form-sheet`**（对标表单抽屉）\n' +
      '- **`SearchSheet`** — 底部 **`jh-mobile-search-sheet`**（与 PageHeader 同源的综合搜索；移动端 **`MobileSearch`** 中继解析产物）\n\n' +
      '请勿在此处使用 Table、PageHeader、VStack 等主体布局组件。',
  },
  component: {
    type: 'string',
    description:
      '`component` 的合法取值取决于所在数组：写在 **pageContent** 与写在 **actionContent** 中的枚举不同。将光标悬停在对应区域内的 `component:` 键上可查看完整列表。',
  },
  key:       { type: 'string', description: '组件或字段唯一标识，用于 ref / v-model 生成' },
  attrs:     {                 description: '透传给组件根节点的 HTML 属性：`class` / `style` / `id` / `data-*`，Vue 用字符串键 `:class` `:style` `v-if` `@click` 等' },
  attrsRef:  { type: 'string', description: '从配置根路径合并 attrs 对象（与 attrs 合并，attrs 覆盖同名键）' },
  children:  {                 description: '子组件节点列表，元素为节点对象或原始 HTML 字符串（容器组件嵌套使用）' },
  props:     {                 description: '组件 props 配置对象' },

  // ── Table props ───────────────────────────────────────────────────────────
  'Table|headers':          {                   description: '表格列配置数组（Vuetify 2 格式 `{ text, value, ... }`），与 columns 二选一同义' },
  'Table|headersBinding':   { type: 'string',   description: 'Vue 列配置变量名，生成 `:headers="该名"`；存在时忽略静态 columns/headers' },
  'Table|filterList':     {                   description: '顶部筛选字段配置数组' },
  'Table|rowActionList':    {                   description: '每行右侧操作按钮配置数组' },
  'Table|headActionList':   {                   description: '表头/工具栏按钮配置数组（表格左上方）' },
  'Table|selectable':       { type: 'boolean',  description: '开启多选，选中行绑定到 `tableSelected`' },
  'Table|serverPagination': { type: 'boolean',  description: '开启服务端分页（后端返回 totalCount）' },
  'Table|pageSize':         { type: 'number',   description: '默认每页条数，默认 50', example: '50' },
  'Table|primaryKey':       { type: 'string',   description: '行主键字段名（多选 / 行操作识别），默认 `"id"`', example: '"id"' },
  'Table|orderBy':          {                   description: '默认排序配置', example: '[{ column: "operationAt", order: "desc" }]' },
  'Table|slotTemplates':    {                   description: '具名插槽集合，键为插槽名（如 `toolbar-prepend` `toolbar-append`），值为 HTML 字符串；不会作为 props 透传' },

  // ── PageHeader props ──────────────────────────────────────────────────────
  'PageHeader|title':              { type: 'string',  description: '页面标题文字，支持模板变量 `<$ ctx.xxx $>`' },
  'PageHeader|helpBtn':            { type: 'boolean', description: '是否显示右上角帮助按钮（默认 false）' },
  'PageHeader|helpSrc':            { type: 'string',  description: '帮助按钮抽屉的 iframe 内容 URL' },
  'PageHeader|pageId':             { type: 'string',  description: '帮助按钮关联的 pageId（覆盖默认）' },
  'PageHeader|searchFieldList':    {                  description: '顶部搜索字段配置数组' },
  'PageHeader|keywordHeaders':     {                  description: 'keyword 控件可选列 `{ text, value }`；省略时由生成器从同页 Table 同步' },
  'PageHeader|keywordHeadersRef':  { type: 'string',  description: '从配置根路径解析列数组并写入 keywordHeaders' },
  'PageHeader|showSearchBtn':      { type: 'boolean', description: '是否显示搜索按钮（默认 true）' },
  'PageHeader|keyword': {
    type: 'string',
    description:
      'keyword 搜索词。**字符串**时表示 Vue 变量名（生成 `:keyword.sync="该名"`）；默认绑定页面 `keyword`。\n' +
      '与 **`jh-mobile-search-sheet`（SearchSheet）** 约定一致。',
  },
  'PageHeader|keywordFieldList': {
    description:
      'keyword 已选列。**数组**为静态配置；**字符串**为变量名（生成 `:keyword-field-list.sync`）。默认绑定页面 `keywordFieldList`。\n' +
      '与 **`jh-mobile-search-sheet`** 约定一致。',
  },

  // ── MobileOrder（中继 → 触发器 + **Sheet** 排序）
  'MobileOrder|btnText': {
    type: 'string',
    description: '触发按钮文案，默认「排序」。**不传入**底部 Sheet。',
  },
  'MobileOrder|triggerText': { type: 'string', description: '同 `btnText`' },
  'MobileOrder|label':       { type: 'string', description: '同 `btnText`' },
  'MobileOrder|btnClass':    { type: 'string', description: '触发 **`jh-mobile-filter-btn`** 的 class。**不传入** Sheet。' },
  'MobileOrder|openerClass': { type: 'string', description: '同 `btnClass`' },
  'MobileOrder|showActive': {
    type: 'boolean | string',
    description: '可选：摘要块模式（与 `active` 配合）。**不传入** Sheet。',
  },
  'MobileOrder|active':      { type: 'string', description: '摘要表达式。**不传入** Sheet。' },
  'MobileOrder|title':       { type: 'string', description: '底部 **Sheet** 标题，默认「排序」。' },
  'MobileOrder|rounded':     { type: 'boolean', description: '底部 Sheet 卡片顶部圆角，默认 true。' },
  'MobileOrder|orderList': {
    description: '**必填语义**：排序选项 `[{ text, value }]`，传入 **`jh-sheet`** 的 `orderList`。',
  },

  // ── MobileFilter（中继 → 触发器 + **FormSheet**）
  'MobileFilter|btnText': {
    type: 'string',
    description: '触发按钮文案，默认「筛选」。**不传入** FormSheet。',
  },
  'MobileFilter|triggerText': { type: 'string', description: '同 `btnText`' },
  'MobileFilter|label':       { type: 'string', description: '同 `btnText`' },
  'MobileFilter|btnClass':    { type: 'string', description: '触发按钮 class。**不传入** FormSheet。' },
  'MobileFilter|openerClass': { type: 'string', description: '同 `btnClass`' },
  'MobileFilter|showActive': {
    type: 'boolean | string',
    description: '可选：摘要块模式。**不传入** FormSheet。',
  },
  'MobileFilter|active':      { type: 'string', description: '摘要表达式。**不传入** FormSheet。' },
  'MobileFilter|title':       { type: 'string', description: '底部 **FormSheet** 标题，默认「筛选」。' },
  'MobileFilter|rounded':     { type: 'boolean', description: '底部 Sheet 圆角，默认 true。' },
  'MobileFilter|hiddenBtn': {
    type: 'boolean',
    description: '隐藏标题栏「重置 / 确认」（仍可有 tab 的 `actionList`）。',
  },
  'MobileFilter|fieldList': {
    description: '表单字段（无 tab 时写在根上）。语义同 **Drawer `fieldList`**，解析至 **`jh-form-sheet`**。',
  },
  'MobileFilter|fields':      { description: '兼容名，等价 `fieldList`。' },
  'MobileFilter|tabList':     { description: '多 Tab；语义同 **Drawer `tabList`**。' },
  'MobileFilter|actionList':  { description: '工具栏/底部按钮；语义同 FormDrawer。' },
  'MobileFilter|headActionList': { description: '标题栏扩展按钮（透传 form-sheet）。' },
  'MobileFilter|beforeCloseConfirm':       { type: 'boolean', description: '关闭前脏检测。' },
  'MobileFilter|beforeCloseCompareFields': { description: '脏检测字段范围。' },
  'MobileFilter|initialData': { description: '表单初始数据（透传 jh-form）。' },
  'MobileFilter|cols':       { type: 'number', description: '表单列数。' },
  'MobileFilter|gap':        { type: 'string', description: '表单 gap。' },
  'MobileFilter|labelMode':  { type: 'string', description: '`above` | `float`。' },
  'MobileFilter|scope':      { description: '传给 `jh-form` 的 scope。' },
  'MobileFilter|formKey':    { type: 'string', description: '多表单 ref 前缀（透传 form-sheet）。' },
  'MobileFilter|autoHeight': { type: 'boolean', description: '表单区高度策略（透传 form-sheet）。' },

  // ── MobileAction（中继 → 触发器 + **Sheet** 操作网格）
  'MobileAction|btnText': {
    type: 'string',
    description: '触发按钮文案，默认「更多操作」。**不传入** Sheet。',
  },
  'MobileAction|triggerText': { type: 'string', description: '同 `btnText`' },
  'MobileAction|label':       { type: 'string', description: '同 `btnText`' },
  'MobileAction|btnClass':    { type: 'string', description: '触发按钮 class。**不传入** Sheet。' },
  'MobileAction|openerClass': { type: 'string', description: '同 `btnClass`' },
  'MobileAction|showActive': {
    type: 'boolean | string',
    description: '可选：摘要块模式。**不传入** Sheet。',
  },
  'MobileAction|active':      { type: 'string', description: '摘要表达式。**不传入** Sheet。' },
  'MobileAction|title':       { type: 'string', description: '底部 **Sheet** 标题，默认「更多操作」。' },
  'MobileAction|rounded':     { type: 'boolean', description: '底部 Sheet 圆角，默认 true。' },
  'MobileAction|actionList': {
    description: '**核心**：操作项 `[{ value, icon?, color?, tag? }]`，网格展示；点选触发 `@action`。',
  },
  'MobileAction|cols':        { type: 'number', description: '网格列数（Tailwind `grid-cols-*`）。' },
  'MobileAction|headActionList': { description: '若有透传需求时的标题区按钮（一般用不到）。' },

  // ── MobileSearch（中继 → **`jh-mobile-filter-btn`** + **`jh-mobile-search-sheet`**）
  //     弹出层仅对应 Vue 组件 props：title / rounded / searchFieldList / keywordHeaders / keyword /
  //     keywordFieldList / showSearchBtn / bodyClass（与 PageHeader 搜索同源）。无 FormSheet 的 fieldList、tabList 等；
  //     `parse_schema` 会丢弃 fieldList、fields、tabList、actionList、headActionList、initialData、jianghuSearch。
  'MobileSearch|btnText': {
    type: 'string',
    description: '触发器文案，默认「搜索」。仅 **`jh-mobile-filter-btn`**，不进 `jh-mobile-search-sheet`。',
  },
  'MobileSearch|triggerText': { type: 'string', description: '同 `btnText`。' },
  'MobileSearch|label':       { type: 'string', description: '同 `btnText`。' },
  'MobileSearch|btnClass':    { type: 'string', description: '触发器 `btn-class`。不进 Sheet。' },
  'MobileSearch|openerClass': { type: 'string', description: '同 `btnClass`。' },
  'MobileSearch|showActive': {
    type: 'boolean | string',
    description: '触发器 `:show-active`。不进 Sheet。',
  },
  'MobileSearch|active': {
    type: 'string',
    description: '触发器 `:active-display`。不进 Sheet。',
  },
  'MobileSearch|icon': {
    type: 'string',
    description: '触发器 **`jh-mobile-filter-btn`** 的 `icon`；未写时解析默认 `filter-2`。不进 Sheet。',
  },
  'MobileSearch|title': {
    type: 'string',
    description: '**`jh-mobile-search-sheet`** 的 `title`，默认「搜索」。',
  },
  'MobileSearch|rounded': {
    type: 'boolean',
    description: '**`jh-mobile-search-sheet`** 的 `rounded`，默认 true。',
  },
  'MobileSearch|searchFieldList': {
    description:
      '**`jh-mobile-search-sheet`** 的 `searchFieldList`（与 PageHeader 一致，可有 `type: "keyword"`）。省略时解析阶段可继承 PageHeader / `list.search.fields`。',
  },
  'MobileSearch|keywordHeaders': {
    description: '**`jh-mobile-search-sheet`** 的 `keywordHeaders`（数组或字符串变量名）。',
  },
  'MobileSearch|keyword': {
    type: 'string',
    description: '**`jh-mobile-search-sheet`** 的 `keyword`（字符串常为变量名 → `.sync`）。',
  },
  'MobileSearch|keywordFieldList': {
    description: '**`jh-mobile-search-sheet`** 的 `keywordFieldList`（数组或字符串变量名）。',
  },
  'MobileSearch|showSearchBtn': {
    type: 'boolean',
    description: '**`jh-mobile-search-sheet`** 的 `showSearchBtn`：是否渲染 **`jh-sheet`** `actions` 槽内的「重置 / 查询」，默认 true。',
  },
  'MobileSearch|bodyClass': {
    description: '**`jh-mobile-search-sheet`** 的 `bodyClass`，合并进底层 `jh-sheet` 内容区 class。',
  },

  // ── MobileFilterBtn（可选：手写 **`jh-mobile-filter-btn`** 时可出现在配置里；非标准中继）
  'MobileFilterBtn|labelBind': {
    type: 'string',
    description:
      '**推荐**：绑定主文案的 Vue 表达式（整段原样写入 `:label="…"`），如 `pageTitle`、`row.modeName`。与 **`label` 二选一**（同时写时本键优先并忽略 `label`）。',
  },
  'MobileFilterBtn|label': {
    type: 'string',
    description: '主文案，**始终按静态字符串**序列化；若要绑定变量请用 **`labelBind`**。',
  },
  'MobileFilterBtn|btnClass': {
    type: 'string',
    description: '默认按钮分支下的 **`v-btn`** class（圆角边框等）。',
  },
  'MobileFilterBtn|showActive': {
    type: 'boolean',
    description:
      '`true` 且第二行有内容（**`activeDisplayBind`** / **`activeDisplay`** 或 **`children`** 的 **`v-slot:active-display`**）时显示双行摘要，否则圆角按钮。',
  },
  'MobileFilterBtn|activeDisplayBind': {
    type: 'string',
    description:
      '**推荐（单行）**：摘要第二行 Vue 表达式 → `:active-display="…"`。多段 + HTML 徽章等请用 **`children`** + **`v-slot:active-display`**。',
  },
  'MobileFilterBtn|activeDisplay': {
    description: '摘要第二行**静态**；动态单行用 **`activeDisplayBind`**；富文本用 **`children` 插槽**。',
  },
  'MobileFilterBtn|children': {
    description:
      '**`string[]`**：`<template v-slot:active-display>…</template>`。与 Table/List 的 slot children 写法相同。',
  },
  'MobileFilterBtn|iconBind': {
    type: 'string',
    description:
      '**推荐**：图标名为 Vue 表达式（`:icon="…"`）。**静态**图标名（含 **`filter-2`**）请写 **`icon`**，勿写 `iconBind`，否则表达式非法。',
  },
  'MobileFilterBtn|icon': {
    type: 'string',
    description: '静态 **`jh-icon`** 名（如 `filter-2`）；动态图标请用 **`iconBind`**。',
  },
  'Sheet|title':          { type: 'string',  description: '底部卡片标题（静态）；动态用 **`titleBind`**（→ `:title`）或 `{ __expr__: \'computedTitle\' }`' },
  'Sheet|titleBind':      { type: 'string',  description: 'Vue 表达式 → `:title="…"`（与 `title` 互斥）' },
  'Sheet|shown':          { description: '显隐：解析器通常生成 `:shown.sync="is{Key}DrawerShown"`' },
  'Sheet|orderList':      { description: '排序模式（与 actionList / children 默认插槽三选一）：`[{ text, value }]`' },
  'Sheet|actionList':     {
    description:
      '**内容区**图标网格（与 orderList / children 三选一）。项 `{ value, icon?, color? }`；`cols` 控制列数。\n'
      + '点击 `@action` → `doUiAction(整项对象)`。**不支持** disabled / visible / intent。',
  },
  'Sheet|headActionList': {
    description:
      '**标题栏**按钮 → `jh-mobile-actions`（与 orderList 标题栏重置/确认互斥）。`@head-action` → `doUiAction`；或 `v-slot:head-actions` 覆盖。',
  },
  'Sheet|cols':           { description: 'actionList 网格列数（Tailwind `grid-cols-*`）' },
  'Sheet|rounded':        { type: 'boolean', description: '`true` 时卡片顶部圆角 `rounded-t-lg`' },
  'Sheet|stackZIndex':    { type: 'number', description: '叠层层级，默认高于全屏遮罩' },
  'Sheet|attach':         { description: '`false` 跟随 Vuetify 挂载；`"body"` 挂到 body' },
  'Sheet|lazy':           { type: 'boolean', description: '`false` 时首次打开前即挂载内容' },
  'Sheet|cardClass':      { description: '卡片额外 class' },
  'Sheet|bodyClass':      { description: '`v-card-text` 区域 class' },
  'Sheet|actionsClass':   { description: '底部按钮栏 class' },

  // ── SearchSheet（jh-mobile-search-sheet；亦可手写于 actionContent）
  'SearchSheet|title':          { type: 'string',  description: 'Sheet 标题，默认「搜索」' },
  'SearchSheet|shown':          { description: '显隐：`:shown.sync="is{Key}DrawerShown"`' },
  'SearchSheet|searchFieldList': {
    description:
      '与 **PageHeader `searchFieldList`** 完全一致。**数组**静态字段；**字符串**为变量名 → `:search-field-list`（勿把整段 `[...]` 写成字符串误绑）。',
  },
  'SearchSheet|keywordHeaders': {
    description:
      'keyword 可选列。**数组**或 **字符串**变量名 → `:keyword-headers`；可与 Table `headers` 同源。',
  },
  'SearchSheet|keyword': {
    type: 'string',
    description: '**字符串** → `:keyword.sync`；默认页面 `keyword`。',
  },
  'SearchSheet|keywordFieldList': {
    description: '数组或 **字符串**变量名 → `:keyword-field-list.sync`；默认 `keywordFieldList`。',
  },
  'SearchSheet|showSearchBtn': { type: 'boolean', description: '底部「重置 / 查询」是否显示' },
  'SearchSheet|rounded':      { type: 'boolean', description: '同 Sheet：`rounded-t-lg`' },
  'SearchSheet|bodyClass':    { description: '透传底层 `jh-sheet` 内容区 class' },

  // ── Layout props（VStack / HStack / Box / Grid）────────────────────────────
  'VStack|gap':         { type: 'number | string', description: 'flex 子项间距，数字会自动加 px', example: '"8px" 或 8' },
  'VStack|align':       { type: 'string',  description: '交叉轴对齐：`"start"` `"center"` `"end"` `"stretch"`，默认 `"stretch"`' },
  'VStack|justify':     { type: 'string',  description: '主轴对齐：`"start"` `"center"` `"end"` `"between"`，默认 `"start"`' },
  'VStack|padding':     { type: 'string',  description: 'CSS padding，默认空' },
  'VStack|flexFromCls': { type: 'boolean', description: 'true 时用 attrs 上的 class 控制 flex（避免覆盖 Tailwind 响应式 flex）' },

  'HStack|gap':         { type: 'number | string', description: 'HStack 子项间距，数字会自动加 px', example: '"8px" 或 8' },
  'HStack|align':       { type: 'string',  description: '交叉轴对齐：`"start"` `"center"` `"end"` `"stretch"`，默认 `"center"`' },
  'HStack|justify':     { type: 'string',  description: '主轴对齐：`"start"` `"center"` `"end"` `"between"`，默认 `"start"`' },
  'HStack|wrap':        { type: 'boolean', description: '是否允许换行' },
  'HStack|padding':     { type: 'string',  description: 'CSS padding，默认空' },
  'HStack|flexFromCls': { type: 'boolean', description: 'true 时用 attrs 上的 class 控制 flex（避免覆盖 Tailwind 响应式 flex）' },

  'Box|padding':    { type: 'string', description: 'CSS padding' },
  'Box|margin':     { type: 'string', description: 'CSS margin' },
  'Box|width':      { type: 'string', description: 'CSS width，默认 `"100%"`' },
  'Box|extraStyle': { type: 'object', description: '扩展内联样式对象（合并到 boxStyle）' },

  'Grid|cols':   { type: 'number | string', description: 'Grid 列数', example: '3' },
  'Grid|gap':    { type: 'number | string', description: 'Grid 子项间距，数字会自动加 px' },
  'Grid|colsMd': { type: 'number | string', description: '中屏（< 960px）列数' },
  'Grid|colsSm': { type: 'number | string', description: '小屏（< 600px）列数' },

  // ── Drawer props（CreateDrawer / UpdateDrawer）────────────────────────────
  'Drawer|title':                    { type: 'string',   description: '抽屉标题（静态）；动态用 **`titleBind`**' },
  'Drawer|titleBind':                { type: 'string',   description: 'Vue 表达式 → `:title`（FormSheet / Drawer 族）' },
  'Drawer|cols':                     { type: 'number',   description: '表单列数（无 tabList 时生效），默认 1', example: '2' },
  'Drawer|gap':                      { type: 'string',   description: '表单间距 CSS gap（无 tabList 时生效），默认 `"12px 16px"`' },
  'Drawer|labelMode':                { type: 'string',   description: '标签模式：`"above"` 标签在输入框上方（默认）| `"float"` Vuetify 浮动标签' },
  'Drawer|fieldList': {
    description:
      '表单字段配置数组（无 `tabList` 时写在 Drawer 根上；有 `tabList` 时每个 tab 各自一份）。\n\n'
      + '**分组 / 分割线 / 提示（不写 model，仅占位）：**\n'
      + '- `type: "section"`：小节标题，`label` 为标题文案，`key` 用占位即可（如 `_basic`）\n'
      + '- `type: "divider"`：横线分割，`label` 可省略\n'
      + '- `type: "tip"`：说明文字，用 `html` 写内容（v-html）\n\n'
      + '普通输入项见下方各 `fieldList|*` 词条（`text` / `select` / `textarea` 等）。',
    example:
      '[\n'
      + '  { key: "_basic", label: "基本信息", type: "section" },\n'
      + '  { key: "projectName", label: "项目名称", type: "text", required: true },\n'
      + '  { key: "_sep", label: "", type: "divider" },\n'
      + `  { key: '_hint', label: '', type: 'tip', html: '<span class="grey--text text-caption">以下选填</span>' },\n`
      + '  { key: "remark", label: "备注", type: "textarea" },\n'
      + ']',
  },
  'Drawer|fields':                   {                   description: '兼容旧名，等价于 fieldList（fieldList 优先）' },
  'Drawer|tabList':                  {                   description: '多 Tab 配置，每个 Tab 含独立 fieldList / cols / actionList 等' },
  'Drawer|beforeCloseConfirm':       { type: 'boolean',  description: '关闭抽屉前是否做脏检测确认（有改动时弹出保存 / 不保存 / 取消）' },
  'Drawer|beforeCloseCompareFields': { type: 'string[]', description: '脏检测只比较指定字段（默认比较全部 fieldList 字段）', example: '["projectName", "status"]' },
  'Drawer|hiddenBtn':                { type: 'boolean',  description: '**FormSheet / jh-form-sheet**：隐藏标题栏默认「重置 / 确认」（仍可有 tab 的 actionList）' },
  'Drawer|value':                    { type: 'boolean',  description: 'v-model 显隐控制（运行时由父页面控制，配置中通常不写）' },
  'Drawer|initialData':              { type: 'object',   description: '当前编辑数据（运行时由 jhPage.state 注入，配置中通常不写）' },

  // ── fieldList / fields item（jh-form 字段）────────────────────────────────
  'fieldList|key':         { type: 'string',          description: '字段唯一标识，绑定到 `createItem` / `updateItem` 对应属性', example: '"projectName"' },
  'fieldList|label':       { type: 'string',          description: '字段显示标签', example: '"项目名称"' },
  'fieldList|type':        { type: 'string',          description: '字段组件：`"text"` `"number"` `"select"` `"date"` `"textarea"` `"custom"` ｜ 结构性（不绑数据）：`"section"` `"divider"` `"tip"`' },
  'fieldList|required':    { type: 'boolean',         description: '是否必填（labelMode=`"above"` 时显示红星，未传 rules 时自动生成 required 校验）' },
  'fieldList|rules':       { type: 'array',           description: 'Vuetify 校验规则数组（未传时按 required 自动生成）' },
  'fieldList|readonly':    { type: 'boolean',         description: '是否只读' },
  'fieldList|disabled':    { type: 'boolean',         description: '是否禁用' },
  'fieldList|options':     { type: 'array | string',  description: '下拉（type=`select`）：数组或状态路径 `"constantObj.xxx"`；字符串编译为 __expr__ → NJK `options:constantObj.xxx`' },
  'fieldList|placeholder': { type: 'string',          description: '输入框占位文字' },
  'fieldList|hint':        { type: 'string',          description: '输入框下方提示文字' },
  'fieldList|cls':         { type: 'string',          description: '字段容器 CSS class，如 `"jh-col-span-full"` 跨全列、`"jh-col-span-2"` 跨 2 列', example: '"jh-col-span-full"' },
  'fieldList|span':        { type: 'number',          description: '跨列数（grid-column: span N），优先级低于 cls' },
  'fieldList|component':   { type: 'string',          description: 'type=`"custom"` 时指定 Vue 组件名（需全局注册）' },
  'fieldList|attrs':       { type: 'object',          description: 'type=`"custom"` 时传给自定义组件的额外 props' },
  'fieldList|html':        { type: 'string',          description: 'type=`"tip"` 时的 HTML 内容（v-html 渲染）' },
  'fieldList|autoId':      {
    type: 'object',
    description:
      '自动 ID 生成配置 `{ type, prefix, start }`。\n'
      + '- `type`: 生成器类型（枚举）\n'
      + '  - `"idSequence"`(需要idSequence字段) \n'
      + '  - `"bizSequence"`(不带前缀的纯序列id)\n'
      + '- `prefix`: 业务前缀（可选）\n'
      + '- `start`: 起始值（可选，默认 10000）',
  },

  // ── tabList item（drawerTab）──────────────────────────────────────────────
  'tabList|key':                     { type: 'string',   description: 'Tab 唯一标识符', example: '"basicInfo"' },
  'tabList|title':                   { type: 'string',   description: 'Tab 显示标题', example: '"基本信息"' },
  'tabList|fieldList':               {                   description: '该 Tab 内的表单字段配置' },
  'tabList|fields':                  {                   description: '兼容旧名，等价于 fieldList（fieldList 优先）' },
  'tabList|cols':                    { type: 'number',   description: '该 Tab 表单列数（覆盖 Drawer 根级 cols）' },
  'tabList|gap':                     { type: 'string',   description: '该 Tab 表单间距（覆盖 Drawer 根级 gap）' },
  'tabList|labelMode':               { type: 'string',   description: '该 Tab 标签模式（覆盖 Drawer 根级 labelMode）' },
  'tabList|actionList':              {                   description: '该 Tab 底部操作按钮（不填则使用默认取消/保存）' },
  'tabList|beforeCloseConfirm':      { type: 'boolean',  description: '该 Tab 关闭前脏检测（有 tabList 时不回退根级配置）' },
  'tabList|beforeCloseCompareFields':{ type: 'string[]', description: '该 Tab 脏检测字段范围' },

  // ── actionList item（drawerAction）────────────────────────────────────────
  'actionList|label':    { type: 'string', description: '按钮文字', example: '"保存"' },
  'actionList|color':    { type: 'string', description: '按钮颜色（Vuetify color 值）', example: '"success"' },
  'actionList|actionId': { type: 'string', description: '按钮点击触发的 doUiAction ID', example: '"updateItem"' },
  'actionList|id':       { type: 'string', description: '同 actionId（兼容名）' },
  'actionList|intent':   { type: 'string', description: '内置意图：`"cancel"` 触发关闭抽屉' },
  'actionList|visibleWhen': {
    description: '显隐条件（与 field interaction 同口径）：变量名 / 表达式；false 隐藏',
  },
  'actionList|disabledWhen': {
    description: '禁用条件：true 时按钮禁用；上下文 initialData + scope + 页面 $data',
  },

  // ── columns / headers item（Vuetify 2 v-data-table headers 项）────────────
  'columns|text':       {                          description: '列显示标题（Vuetify headers `text`），支持字符串或表达式' },
  'columns|value':      { type: 'string',          description: '列对应的数据字段名（Vuetify headers `value`）', example: '"projectName"' },
  'columns|align':      { type: 'string',          description: '对齐方式：`"start"` `"center"` `"end"`' },
  'columns|width':      { type: 'string | number', description: '列宽度', example: '"120px" 或 120' },
  'columns|sortable':   { type: 'boolean',         description: '是否可排序' },
  'columns|formatter':  {                          description: '格式化函数 / 模板字符串（生成器层面解析）' },
  'columns|class':      { type: 'string',          description: '表头单元格 class' },
  'columns|cellClass':  { type: 'string',          description: '内容单元格 class' },
  'columns|cellStyle':  {                          description: '内容单元格 style 对象 / 函数' },

  // ── searchField item（PageHeader.searchFieldList）─────────────────────────
  'searchFieldList|key':     { type: 'string', description: '搜索字段对应的数据字段名' },
  'searchFieldList|label':   { type: 'string', description: '搜索字段显示标签' },
  'searchFieldList|op':      { type: 'string', description: '匹配操作符：`"eq"` `"like"` `"in"` `"gt"` `"lt"` `"gte"` `"lte"`' },
  'searchFieldList|type':    { type: 'string', description: '搜索字段组件：`"text"` `"select"` `"date"` `"number"` `"keyword"`' },
  'searchFieldList|options': {
    description:
      'select 下拉：静态数组，或状态路径字符串 "constantObj.xxx"。\n' +
      '编译器标 __expr__，NJK 序列化为 options:constantObj.xxx（Vue 变量引用，不是带引号的字符串字面量）。\n' +
      '适用于 PageHeader / Search / SearchSheet 的 searchFieldList。',
  },

  // ── filterField item（Table.filterList）─────────────────────────────────
  'filterList|key':         { type: 'string',   description: '筛选字段对应的数据字段名' },
  'filterList|keys':        { type: 'string[]', description: '多列 OR 匹配（与 key 二选一）' },
  'filterList|label':       { type: 'string',   description: '筛选字段显示标签' },
  'filterList|type':        { type: 'string',   description: '筛选字段组件：`"text"` `"select"`' },
  'filterList|exact':       { type: 'boolean',  description: '是否精确匹配（默认模糊）' },
  'filterList|options':     {
    description:
      'select 下拉：静态数组，或状态路径字符串；PC Table 客户端 filter 用（语法同 searchFieldList.options）',
  },
  'filterList|placeholder': { type: 'string',   description: '占位文字' },
  'filterList|clearable':   { type: 'boolean',  description: '是否可清空' },
  'filterList|width':       { type: 'string',   description: '控件宽度' },

  // ── rowAction item（Table.rowActionList）──────────────────────────────────
  'rowActionList|label':    { type: 'string',  description: '行操作按钮文字', example: '"编辑"' },
  'rowActionList|intent':   { type: 'string',  description: '内置意图：`"update"` `"delete"` `"view"` `"create"`，自动绑定标准 actionId' },
  'rowActionList|id':       { type: 'string',  description: '自定义 doUiAction ID（与 intent 二选一）', example: '"startUpdateItem"' },
  'rowActionList|actionId': { type: 'string',  description: '同 id（兼容名）' },
  'rowActionList|confirm':  { type: 'boolean', description: '点击是否需要二次确认弹窗' },
  'rowActionList|color':    { type: 'string',  description: '按钮颜色（Vuetify color 值）' },
  'rowActionList|icon':     { type: 'string',  description: '按钮图标（mdi- 名称，省略 `mdi-` 前缀）' },
  'rowActionList|visible':  {                  description: '可见性：布尔值或表达式字符串（运行时按行求值）' },
  'rowActionList|disabled': {                  description: '禁用：布尔值或表达式字符串（运行时按行求值）' },

  // ── headAction item（Table.headActionList）────────────────────────────────
  'headActionList|type':     { type: 'string', description: '类型：`"button"`（默认）`"spacer"` `"filter"` `"slot"`' },
  'headActionList|label':    { type: 'string', description: '按钮文字', example: '"新增"' },
  'headActionList|intent':   { type: 'string', description: '内置意图，如 `"create"` 自动绑定 startCreateItem' },
  'headActionList|id':       { type: 'string', description: '自定义 doUiAction ID', example: '"startCreateItem"' },
  'headActionList|actionId': { type: 'string', description: '同 id（兼容名）' },
  'headActionList|color':    { type: 'string', description: '按钮颜色（Vuetify color 值）' },
  'headActionList|slotName': { type: 'string', description: 'type=`"slot"` 时使用的具名插槽名' },
  'headActionList|fields':   {                 description: 'type=`"filter"` 时的筛选字段配置' },
};

// ─────────────────────────────────────────────────────────────────────────────
// 判断是否是 v6 配置文件（排除 v7，与 v7ConfigHoverProvider 互斥）
// ─────────────────────────────────────────────────────────────────────────────
function isV6ConfigFile(document: vscode.TextDocument): boolean {
  return isV6ConfigDocument(document);
}

// ─────────────────────────────────────────────────────────────────────────────
// 获取光标所在行的缩进量（空格数）
// ─────────────────────────────────────────────────────────────────────────────
function getIndent(text: string): number {
  return text.match(/^(\s*)/)?.[1].length ?? 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 向上扫描，提取祖先 key 列表（从最近到最远）
//
// 返回结构：
//   { ancestors: string[], componentType: string | null }
//
// ancestors 是从最近祖先到最远祖先的 key 名列表。
// componentType 是最近的 component / tag 声明（用于区分 Table/Drawer 等）。
// ─────────────────────────────────────────────────────────────────────────────
function scanAncestors(
  document: vscode.TextDocument,
  position: vscode.Position
): { ancestors: string[]; componentType: string | null } {
  const ancestors: string[] = [];
  let componentType: string | null = null;

  const currentIndent = getIndent(document.lineAt(position.line).text);
  let targetIndent = currentIndent;

  for (let lineNum = position.line - 1; lineNum >= Math.max(0, position.line - 120); lineNum--) {
    const line = document.lineAt(lineNum).text;
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

    const indent = getIndent(line);
    if (indent >= targetIndent) continue; // 同级或更深，跳过

    // 找到更浅的行 — 检查是否是 property key
    const keyMatch = trimmed.match(/^([\w$]+)\s*:/);
    if (keyMatch) {
      const k = keyMatch[1];
      ancestors.push(k);
      targetIndent = indent; // 继续向上找更浅的层级

      if (!componentType) {
        const parsed = parseComponentTypeFromLine(trimmed);
        if (parsed) componentType = parsed;
      }
    }
  }

  // 如果没捕捉到 component 类型，再做一次全扫描（component 可能在 props 的兄弟行）
  if (!componentType) {
    const curIndent = getIndent(document.lineAt(position.line).text);
    for (let lineNum = position.line - 1; lineNum >= Math.max(0, position.line - 60); lineNum--) {
      const line = document.lineAt(lineNum).text;
      const trimmed = line.trim();
      const indent = getIndent(line);
      // 同级或稍浅的 component 声明
      if (Math.abs(indent - curIndent) <= 4) {
        const parsed = parseComponentTypeFromLine(trimmed);
        if (parsed) {
          componentType = parsed;
          break;
        }
      }
    }
  }

  return { ancestors, componentType };
}

// ─────────────────────────────────────────────────────────────────────────────
// 查表：按优先级从高到低尝试各种路径组合
// ─────────────────────────────────────────────────────────────────────────────
const LIST_CONTEXT_KEYS = [
  'fieldList', 'fields',          // jh-form 字段（fields 是兼容名）
  'tabList',
  'actionList',
  'columns', 'headers',           // jh-table 列（headers 是 Vuetify 同义名）
  'filterList',
  'rowActionList',
  'headActionList',
  'searchFieldList',
];

// 列表名归一化：兼容名 -> 文档表里的规范名
const LIST_ALIASES: Record<string, string> = {
  fields:  'fieldList',
  headers: 'columns',
};

const COMPONENT_ALIASES: Record<string, string> = {
  CreateDrawer: 'Drawer',
  UpdateDrawer: 'Drawer',
  FormDrawer: 'Drawer',
  /** FormSheet 与 Drawer 共用 fieldList / tabList / hiddenBtn 等表单抽屉语义 */
  FormSheet: 'Drawer',
};

/** 当前节点落在 pageContent 树还是 actionContent 树（祖先链就近匹配） */
function getV6UiTreeSection(ancestors: string[]): 'pageContent' | 'actionContent' | null {
  for (const a of ancestors) {
    if (a === 'actionContent') return 'actionContent';
    if (a === 'pageContent') return 'pageContent';
  }
  return null;
}

function lookupDoc(word: string, ancestors: string[], componentType: string | null): DocEntry | null {
  const comp = componentType ? (COMPONENT_ALIASES[componentType] || componentType) : null;

  // 最近的 list 上下文（从近到远扫 ancestors），并归一化别名
  const nearestListRaw = ancestors.find(a => LIST_CONTEXT_KEYS.includes(a)) ?? null;
  const nearestList = nearestListRaw ? (LIST_ALIASES[nearestListRaw] || nearestListRaw) : null;

  // 构造从最具体到最宽泛的候选 key
  const candidates: string[] = [];

  // UI 树根部的 component（非 fieldList 内「自定义控件 component」）
  if (word === 'component' && nearestList !== 'fieldList') {
    const section = getV6UiTreeSection(ancestors);
    if (section) candidates.push(`${section}|component`);
  }

  // 1. 完整祖先路径（最多 3 层）
  const topAncestors = ancestors.slice(0, 3);
  for (let len = topAncestors.length; len >= 1; len--) {
    candidates.push([...topAncestors.slice(0, len), word].join('|'));
  }

  // 2. component + list + word
  if (comp && nearestList) candidates.push(`${comp}|${nearestList}|${word}`);

  // 3. component + word
  if (comp) candidates.push(`${comp}|${word}`);

  // 4. nearestList + word
  if (nearestList) candidates.push(`${nearestList}|${word}`);

  // 5. 直接 key（兜底）
  candidates.push(word);

  // 去重，按顺序查表
  const seen = new Set<string>();
  for (const c of candidates) {
    if (seen.has(c)) continue;
    seen.add(c);
    if (c in V6_PATH_DOCS) return V6_PATH_DOCS[c];
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 子属性派生：从 V6_PATH_DOCS 中按 prefix 聚合出"当前 key 支持哪些子 key"
// ─────────────────────────────────────────────────────────────────────────────
type ChildEntry = {
  key: string;
  doc?: DocEntry;
  /** 当 key 是分组（自身无独立 doc，但有更深层级 path）时，将下一层 key 列出来 */
  subItems?: Array<{ key: string; doc?: DocEntry }>;
};

const collectChildren = (prefix: string): ChildEntry[] => {
  const pfx = `${prefix}|`;
  const grouped = new Map<string, { doc?: DocEntry; subKeys: Map<string, DocEntry | undefined> }>();

  for (const path of Object.keys(V6_PATH_DOCS)) {
    if (!path.startsWith(pfx)) continue;
    const rest = path.slice(pfx.length);
    const segs = rest.split('|');
    const first = segs[0];

    if (!grouped.has(first)) {
      grouped.set(first, { subKeys: new Map() });
    }
    const g = grouped.get(first)!;

    if (segs.length === 1) {
      g.doc = V6_PATH_DOCS[path];
    } else {
      // 仅取下一层 key，避免无限展开
      const nextKey = segs[1];
      if (!g.subKeys.has(nextKey)) {
        g.subKeys.set(nextKey, V6_PATH_DOCS[`${pfx}${first}|${nextKey}`]);
      }
    }
  }

  return Array.from(grouped.entries()).map(([key, val]) => ({
    key,
    doc: val.doc,
    subItems: val.subKeys.size > 0
      ? Array.from(val.subKeys.entries()).map(([k, d]) => ({ key: k, doc: d }))
      : undefined,
  }));
};

const findChildren = (
  word: string,
  ancestors: string[],
  componentType: string | null,
): ChildEntry[] => {
  const comp = componentType ? (COMPONENT_ALIASES[componentType] || componentType) : null;
  const prefixes: string[] = [];

  // 悬停在 `props` 上：用 component / tag 识别的组件类型展开 props 集合
  if (word === 'props' && comp) prefixes.push(comp);

  // 完整祖先路径（最多 3 层）
  if (ancestors.length > 0) {
    const topAncestors = ancestors.slice(0, 3).reverse();
    prefixes.push([...topAncestors, word].join('|'));
  }

  // component + word（如 Drawer|fieldList）
  if (comp) prefixes.push(`${comp}|${word}`);

  // 兜底：仅 word（如 dataSource、fieldList、tabList、actionList、columns ...）
  prefixes.push(word);

  const seen = new Set<string>();
  for (const prefix of prefixes) {
    if (seen.has(prefix)) continue;
    seen.add(prefix);
    const result = collectChildren(prefix);
    if (result.length > 0) return result;
  }
  return [];
};

const renderChildEntry = (md: vscode.MarkdownString, c: ChildEntry, indent: string = ''): void => {
  const typeStr = c.doc?.type ? ` \`${c.doc.type}\`` : '';
  const desc = c.doc?.description ? ` — ${c.doc.description}` : '';
  md.appendMarkdown(`${indent}- \`${c.key}\`${typeStr}${desc}\n`);
  if (!c.subItems) return;
  for (const s of c.subItems) {
    const stype = s.doc?.type ? ` \`${s.doc.type}\`` : '';
    const sdesc = s.doc?.description ? ` — ${s.doc.description}` : '';
    md.appendMarkdown(`${indent}  - \`${s.key}\`${stype}${sdesc}\n`);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Hover Provider
// ─────────────────────────────────────────────────────────────────────────────
export class V6ConfigHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.ProviderResult<vscode.Hover> {
    const isV6 = isV6ConfigFile(document);
    console.log('[v6Hover] file:', document.fileName, '| isV6:', isV6);
    if (!isV6) return null;

    // 只在 key 位置触发（冒号左侧的标识符）
    const range = document.getWordRangeAtPosition(position, /[a-zA-Z$_][a-zA-Z0-9$_]*/);
    if (!range) return null;

    const word = document.getText(range);

    // 确认光标在 key 侧（冒号之前）而不是 value 侧
    const lineText = document.lineAt(position.line).text;
    const charAfterWord = lineText.slice(range.end.character).trimStart()[0];
    console.log('[v6Hover] word:', word, '| charAfterWord:', JSON.stringify(charAfterWord));
    if (charAfterWord !== ':') return null;

    const { ancestors, componentType } = scanAncestors(document, position);
    const doc = lookupDoc(word, ancestors, componentType);
    const children = findChildren(word, ancestors, componentType);
    console.log('[v6Hover] ancestors:', ancestors, '| componentType:', componentType, '| doc:', !!doc, '| children:', children.length);
    if (!doc && children.length === 0) return null;

    // 构造 Markdown 内容
    const md = new vscode.MarkdownString();
    md.isTrusted = true;

    // 标题行：key (type)
    const titleParts = [`**\`${word}\`**`];
    if (doc?.type) titleParts.push(`\`${doc.type}\``);
    if (componentType) titleParts.push(`— *${componentType}*`);
    md.appendMarkdown(titleParts.join('  ') + '\n\n');

    if (doc?.description) {
      md.appendMarkdown(doc.description);
    }

    if (doc?.example) {
      md.appendMarkdown(`\n\n**示例：**\n\`\`\`js\n${word}: ${doc.example}\n\`\`\``);
    }

    if (children.length > 0) {
      md.appendMarkdown('\n\n---\n\n**支持的子属性：**\n\n');
      for (const c of children) {
        renderChildEntry(md, c);
      }
    }

    return new vscode.Hover(md, range);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 注册入口
// ─────────────────────────────────────────────────────────────────────────────
export function activateV6ConfigHover(context: vscode.ExtensionContext): void {
  console.log('[v6Hover] activate: registering V6ConfigHoverProvider');
  const provider = new V6ConfigHoverProvider();
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      [
        { scheme: 'file', language: 'javascript' },
        { scheme: 'file', language: 'javascriptreact' },
        { scheme: 'file', language: 'typescript' },
      ],
      provider,
    ),
  );
}
