"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateV7ConfigHover = exports.V7ConfigCompletionProvider = exports.V7ConfigSignatureHelpProvider = exports.V7ConfigHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const configHoverUtils_1 = require("./configHoverUtils");
const configVersionDetect_1 = require("./configVersionDetect");
/**
 * V7 语义配置路径文档
 * Key 格式：`祖先|...|当前键`；悬停父级 key 时由 collectChildren 聚合「支持的子属性」
 * 与 lib/json/v7/docs/semantic-to-component-mapping.md、jianghu-config-v7.schema.json 对齐
 */
const V7_PATH_DOCS = {
    // ── 顶级 ──────────────────────────────────────────────────────────────────
    version: { type: 'string', description: '固定 `"v7"`' },
    mode: { type: 'string', description: '仅 `"crud"` 时走 fields/views 语义展开；省略默认为 UI（pageContent）' },
    pageType: { type: 'string', description: '`"jh-page"` | `"jh-mobile-page"` | `"jh-component"`' },
    targetPlatform: { type: 'string', description: '`"pc"` | `"mobile"`；强制编译端，优先于 pageType' },
    component: { description: 'jh-component 元信息（替代 page；禁止 page.id / resourceList）' },
    'component|path': { type: 'string', description: '组件路径 → app/view/component/<path>.html', example: '"biz/project/TaskSubTable"' },
    'component|name': { type: 'string', description: '显示名称（IDE / 文档）' },
    'component|targets': { type: 'string', description: '`pc` | `mobile` | `both`；默认 pc' },
    'component|props': {
        type: 'object',
        description: '**兼容别名**：Vue props 声明。jh-component 请优先写 **`common.props`**（与 data/methods 同属 Vue 运行时配置）。\n'
            + '若仅写此处，`normalizeSchema` 会合并进 `common.props`；NJK 模板优先读 `common.props`。',
    },
    pageContent: {
        description: 'UI 模式（默认）/ CRUD 覆写：**页面主体 UI 树**（渲染在 v-main 内）。\n' +
            '单根节点对象 `{ component, children?, props? }`；NJK standardConfig 仍为 `[root]` 数组。\n' +
            '纯抽屉 / Sheet 组件可写 `pageContent: {}`，主体 UI 全部放在 **actionContent**。\n\n' +
            '```js\npageContent: {\n  component: "VStack",\n  props: { gap: 0 },\n  children: [blocks.pageHeader, blocks.list],\n}\n```\n\n' +
            '```js\npageContent: {},\nactionContent: [blocks.create, { component: "Drawer", key: "aiReview", ... }],\n```',
    },
    actionContent: {
        description: '**操作区 / 叠层 UI 树**（渲染在 v-main 外）。\n' +
            '抽屉、Sheet 等：`[blocks.create, blocks.update, blocks.searchSheet]`',
    },
    page: { description: '页面元信息' },
    'page|id': { type: 'string', description: 'pageId / 路由', example: '"projectManagement"' },
    'page|name': { type: 'string', description: '显示名称', example: '"项目管理"' },
    'page|title': { type: 'string', description: '页面标题（可选，覆盖 name）' },
    'page|menu': { type: 'boolean', description: '是否显示在导航菜单' },
    'page|targets': { type: 'string', description: 'UI 模式：`pc`（默认）| `mobile` | `both`；`mode:"crud"` 固定双端' },
    'page|hook': { description: '页面钩子' },
    'page|vuetify': { type: 'object', description: 'Vuetify 主题配置' },
    'page|template': { type: 'string', description: 'NJK 根模板名（可选）' },
    'page|helpDoc': { type: 'string', description: '帮助文档 URL → PageTitle.helpDoc' },
    dataSource: {
        description: '数据源：表名 + CRUD actionId。\n' +
            '流水线：`flattenDataSource` → `normalizeDataSource` → standardConfig.dataSource → NJK bake `listResource` 等。',
    },
    'dataSource|table': { type: 'string', description: '数据库表名（必填）', example: '"project"' },
    'dataSource|model': { type: 'string', description: 'table 向下兼容别名' },
    'dataSource|primaryKey': { type: 'string', description: '主键，默认 `"id"`', example: '"projectId"' },
    'dataSource|listResource': { type: 'string', description: '列表 actionId；默认 `selectItemList`', example: '"getProjectList"' },
    'dataSource|createResource': { type: 'string', description: '新增 actionId；默认 `insertItem`' },
    'dataSource|updateResource': { type: 'string', description: '编辑 actionId；默认 `updateItem`' },
    'dataSource|deleteResource': { type: 'string', description: '删除 actionId；默认 `deleteItem`' },
    'dataSource|listActionId': { type: 'string', description: 'listResource 旧别名' },
    'dataSource|createActionId': { type: 'string', description: 'createResource 旧别名' },
    'dataSource|updateActionId': { type: 'string', description: 'updateResource 旧别名' },
    'dataSource|deleteActionId': { type: 'string', description: 'deleteResource 旧别名' },
    'dataSource|getActionId': { type: 'string', description: '单条查询 actionId（可选）' },
    'dataSource|resource': { type: 'object', description: '嵌套：`{ list, create, update, delete, get }` → 扁平 *Resource' },
    'dataSource|actions': { type: 'object', description: '嵌套写法：同 resource 键名规则' },
    'resource|list': { type: 'string', description: '→ listResource' },
    'resource|create': { type: 'string', description: '→ createResource' },
    'resource|update': { type: 'string', description: '→ updateResource' },
    'resource|delete': { type: 'string', description: '→ deleteResource' },
    'resource|get': { type: 'string', description: '→ getActionId' },
    fields: {
        description: '字段字典：`{ fieldKey: { label, type, ... } }`；供 views.* 引用。\n\n'
            + '**表单分组（不绑数据，仅写在 create/update.fields 里）：**\n'
            + '- `type: "section"` + `label`：小节标题\n'
            + '- `type: "divider"`：分割线\n'
            + '- `type: "tip"`：提示文字，用 `label` 或 `html`',
    },
    'fields|label': { type: 'string', description: '展示标签；缺省为字段 key；`type:"section"` 时为分组标题' },
    'fields|type': {
        type: 'string',
        description: '控件：`text` | `select` | `number` | `textarea` | `date` | `custom`；\n'
            + '结构性（不绑数据）：`section` | `divider` | `tip`；缺省 text',
    },
    'fields|component': {
        type: 'string',
        description: '`type:"custom"` 时指定全局 Vue 组件名（须 `includeList` 引入并 `Vue.component` 注册）。\n'
            + '组件协议：`:value` + `@input`；额外 props 写 `attrs`。',
        example: '"jh-goal-picker"',
    },
    'fields|html': { type: 'string', description: '`type:"tip"` 时的 HTML 内容（v-html）' },
    'fields|cls': { type: 'string', description: '额外 CSS class（section/divider/tip 或普通字段）' },
    'fields|options': {
        type: 'array | string',
        description: 'select 选项：静态数组，或 `"constantObj.xxx"`（编译为 __expr__）',
        example: '"constantObj.projectStatus"',
    },
    'fields|required': { type: 'boolean', description: '表单必填' },
    'fields|readonly': { type: 'boolean', description: '表单只读' },
    'fields|op': { type: 'string', description: '搜索操作符：`like` / `eq` 等 → searchFieldList' },
    'fields|width': { type: 'number', description: 'PC Table 列宽 → headers[].width' },
    'fields|class': { type: 'string', description: 'PC Table 表头 class → headers[].class' },
    'fields|cellClass': { type: 'string', description: 'PC Table 单元格 class → headers[].cellClass' },
    'fields|autoId': { type: 'object', description: '自动 ID 生成配置 `{ type, prefix, start }`。\n'
            + '- `type`: 生成器类型（枚举）\n'
            + '  - `"idSequence"`(需要idSequence字段) \n'
            + '  - `"bizSequence"`(不带前缀的纯序列id)\n'
            + '- `prefix`: 业务前缀（可选）\n'
            + '- `start`: 起始值（可选，默认 10000）', },
    'fields|rules': { type: 'string | array', description: '校验规则；字符串 → __expr__' },
    'fields|placeholder': { type: 'string', description: '表单 placeholder → fieldList[].placeholder' },
    'fields|hint': { type: 'string', description: '表单 hint → fieldList[].hint' },
    'fields|quickAttrs': { description: '布尔型 Vuetify 属性：`["clearable"]` 或 `"clearable small-chips"`' },
    'fields|attrs': {
        type: 'object',
        description: '透传 jh-form → Vuetify props → `fieldList[].attrs`。\n'
            + '例 textarea：`{ rows: 5, autoGrow: false }`；select：`{ "item-text": "text" }`',
    },
    'fields|pc': {
        type: 'object',
        description: '**PC 端 attrs 覆写**（target=pc）。**直接是 attrs 对象**，merge 于 `fields.attrs`：`{ rows: 8 }`。',
    },
    'fields|mobile': {
        type: 'object',
        description: '**Mobile 端 attrs 覆写**（target=mobile）。**直接是 attrs 对象**，merge 于 `fields.attrs`。',
    },
    fieldAttrs: { description: 'views.create.fieldAttrs / views.update.fieldAttrs：按 field key 覆写 attrs（同 pc/mobile 形状）' },
    views: { description: '**mode:"crud" 专用**：视图 list / create / update（均可选组合）' },
    'views|list': {
        description: '列表视图（**可选**）：列、搜索、筛选、分页、工具栏/行操作。\n'
            + '省略则不生成 Table/List；仅有 create/update 或 pc/mobile 覆写时可不写。',
    },
    'views|create': { description: '新增表单视图' },
    'views|update': { description: '编辑表单；支持 tabs 或单 fields' },
    list: { description: 'views.list 列表视图（可选）' },
    'list|columns': { type: 'string[] | object[]', description: '列：字段 key 或 `{ field, width?, class?, cellClass?, slot?, span? }`' },
    'list|mobileColumns': { type: 'string[] | object[]', description: 'Mobile List 卡片列；省略则用 columns' },
    'list|search': { description: '服务端搜索 → PC: Search；Mobile: SearchSheet' },
    'list|filter': { description: 'PC 客户端二次筛选 → Table.filterList；Mobile 与 search 合并进 SearchSheet' },
    'list|toolbarActions': { type: 'array', description: '工具栏按钮 → PC Table.headActionList；Mobile MobileActions' },
    'list|rowActions': { type: 'array', description: '行操作 → rowActionList' },
    'list|rowSlot': { type: 'string | object', description: '行/列插槽占位 → slotTemplates' },
    'list|serverPagination': { type: 'boolean', description: '服务端分页' },
    'list|pageSize': { type: 'number', description: '默认每页条数，默认 50' },
    'list|selectable': { type: 'boolean', description: '行多选' },
    'list|orderBy': { type: 'array', description: '默认排序 `[{ column, order }]`' },
    'list|layout': { type: 'object', description: '列表 layout 提示：`{ type: "table"|"card" }`' },
    'list|mobileSearchKey': { type: 'string', description: 'SearchSheet 节点 key，默认 mobileSearch' },
    'list|mobileSearchBtnText': { type: 'string', description: 'MobileFilterBtn 文案，默认「搜索」' },
    'list|mobileSearchTitle': { type: 'string', description: 'SearchSheet 标题' },
    'list|mobileSearchIcon': { type: 'string', description: 'MobileFilterBtn 图标名' },
    'list|mobileSearchBtnClass': { type: 'string', description: 'MobileFilterBtn 按钮 class' },
    search: { description: 'list.search / list.filter 对象式配置' },
    'search|keyword': { type: 'object', description: 'keyword 控件块' },
    'search|fields': { type: 'array', description: '除 keyword 外的 field key 或字段对象' },
    keyword: { description: 'keyword 多列 OR 搜索块' },
    'keyword|fields': { type: 'string[]', description: '参与匹配的列（必填）', example: "['projectName','projectType']" },
    'keyword|placeholder': { type: 'string', description: '占位文案', example: '"搜索项目"' },
    'keyword|label': { type: 'string', description: '标签/占位别名' },
    columns: { description: 'columns[] 对象项（string 项仅写字段 key）' },
    'columns|field': { type: 'string', description: '字段 key（同 key / value）' },
    'columns|key': { type: 'string', description: '列 value' },
    'columns|value': { type: 'string', description: '列 value 别名' },
    'columns|width': { type: 'number', description: '列宽；优先于 fields.width' },
    'columns|class': { type: 'string', description: '表头 class；优先于 fields.class' },
    'columns|cellClass': { type: 'string', description: '单元格 class' },
    'columns|slot': { type: 'object', description: '列插槽配置' },
    'columns|span': { type: 'number', description: 'Mobile List 详情区跨列（2=满行）' },
    toolbarActions: { description: '工具栏按钮项' },
    'toolbarActions|label': { type: 'string', description: '按钮文案' },
    'toolbarActions|intent': { type: 'string', description: '语义：`create` 等 → doUiAction id' },
    'toolbarActions|id': { type: 'string', description: '自定义 actionId（覆盖 intent 映射）' },
    'toolbarActions|color': { type: 'string', description: '按钮颜色' },
    'toolbarActions|type': { type: 'string', description: 'PC：`spacer` | `filter` | `slot`' },
    rowActions: { description: '行操作按钮项' },
    'rowActions|label': { type: 'string', description: '按钮文案' },
    'rowActions|intent': { type: 'string', description: '`update` | `delete` 或自定义' },
    'rowActions|id': { type: 'string', description: '自定义 actionId' },
    'rowActions|key': { type: 'string', description: '行内唯一 key' },
    'rowActions|color': { type: 'string', description: '语义色或 hex' },
    'rowActions|icon': { type: 'string', description: 'jh-icon 名；省略时用 intent 默认 icon' },
    'rowActions|confirm': { type: 'boolean', description: '点击前 confirmDialog' },
    'rowActions|visible': { description: '`(item) => boolean` 条件显示' },
    'rowActions|disabled': { description: 'boolean 或 `(item) => boolean`' },
    create: { description: 'views.create 表单' },
    'create|type': { type: 'string', description: '固定 `"form"`（可选）' },
    'create|title': { type: 'string', description: '抽屉/Sheet 标题' },
    'create|fields': { type: 'string[]', description: '表单字段 key 列表' },
    'create|interaction': { type: 'object', description: '字段 key → { visibleWhen, readonlyWhen, disabledWhen }' },
    'create|actions': { type: 'array', description: '底部/头部操作 `[{ label, intent, color?, visibleWhen?, disabledWhen? }]`' },
    'create|saveTipBeforeClose': { type: 'boolean', description: '关闭前脏检测 → beforeCloseConfirm' },
    'create|fieldAttrs': {
        description: '按 field key 覆写 `fieldList[].attrs`（合并于 **fields.{key}.attrs** 之上）',
    },
    'create|sheet': {
        description: '**FormSheet 专用**（mobile create）。叠层行为 preset；省略时默认 `autoHeight: true`、`viewportOffset: 102`（满高可滚）。\n'
            + '子键见 **`sheet|*`**；Drawer 不支持这些键。',
    },
    sheet: { description: 'views.create.sheet / views.update.sheet / views.list.searchSheet 共用叠层行为块' },
    'sheet|persistent': { type: 'boolean', description: '点外侧不关闭 → v-bottom-sheet persistent（Sheet 族）' },
    'sheet|rounded': { type: 'boolean', description: '卡片顶部圆角 rounded-t-lg' },
    'sheet|autoHeight': { type: 'boolean', description: 'FormSheet：true=max-h，false=固定 h；create/update 默认 true' },
    'sheet|viewportOffset': { type: 'number', description: 'FormSheet calc(100vh-Npx)；单 tab 102，多 tab 152' },
    'sheet|maxBodyHeight': { type: 'string', description: '内容区最大高度，如 `70vh`、`400px`' },
    'sheet|bodyHeight': { type: 'string', description: '固定内容区高度；优先于 maxBodyHeight' },
    'sheet|minCardHeight': { type: 'string', description: 'jh-sheet 卡片 min-h，默认 `100px`' },
    'sheet|beforeCloseConfirm': { type: 'boolean', description: 'FormSheet 关前脏检测（亦可用 saveTipBeforeClose）' },
    'list|searchSheet': {
        description: '**SearchSheet 专用**。默认 `maxBodyHeight: 70vh`；可设 persistent / bodyHeight 等，见 **`sheet|*`**。',
    },
    update: { description: 'views.update 编辑' },
    'update|title': { type: 'string', description: '抽屉/Sheet 标题' },
    'update|tabs': { type: 'array', description: '多 Tab：`[{ key, title, fields, interaction?, actions? }]`' },
    'update|fields': { type: 'string[]', description: '无 tabs 时的单表单字段' },
    'update|interaction': { type: 'object', description: '单表单模式的字段 interaction' },
    'update|actions': { type: 'array', description: '单表单模式底部/头部操作' },
    'update|fieldAttrs': { description: '单表单模式：按 field key 覆写 attrs' },
    'update|sheet': {
        description: '**FormSheet 专用**（mobile update）。默认满高；多 tab 时 `viewportOffset: 152`。子键见 **`sheet|*`**。',
    },
    tabs: { description: 'update.tabs[] 单项' },
    'tabs|key': { type: 'string', description: 'Tab 唯一 key（必填）' },
    'tabs|title': { type: 'string', description: 'Tab 标题' },
    'tabs|type': { type: 'string', description: 'Tab 类型（可选）' },
    'tabs|fields': { type: 'string[]', description: '该 Tab 表单字段 key' },
    'tabs|interaction': { type: 'object', description: '该 Tab 字段 interaction' },
    'tabs|actions': { type: 'array', description: '该 Tab 操作按钮' },
    'tabs|fieldAttrs': { description: '该 Tab 内按 field key 覆写 attrs' },
    interaction: { description: '字段级交互（key 为 fields 中的 fieldKey）' },
    'interaction|visibleWhen': { type: 'string | object', description: '可见条件 → __expr__' },
    'interaction|readonlyWhen': { type: 'string | object', description: '只读条件 → __expr__' },
    'interaction|disabledWhen': { type: 'string | object', description: '禁用条件 → __expr__' },
    platform: { description: '端策略：`platform.desktop` / `platform.mobile`（代码中 `platform.pc` 同义）' },
    'platform|desktop': { description: 'PC 端策略切片（`platform.pc` 同义）' },
    'platform|mobile': { description: 'Mobile 端策略切片' },
    'platform|pc': { description: 'desktop 别名' },
    'platform|desktop|list': { type: 'string', description: 'Table | List；默认 Table' },
    'platform|desktop|create': { type: 'string', description: 'CreateDrawer | CreateSheet 等' },
    'platform|desktop|update': { type: 'string', description: 'UpdateDrawer | UpdateSheet 等' },
    'platform|desktop|filter': { type: 'string', description: '`inline` | `sheet`；PC 默认 inline' },
    'platform|mobile|list': { type: 'string', description: 'List | Table；mobile 默认 List' },
    'platform|mobile|create': { type: 'string', description: 'CreateSheet → FormSheet 等' },
    'platform|mobile|update': { type: 'string', description: 'UpdateSheet → FormSheet 等' },
    'platform|mobile|filter': { type: 'string', description: 'mobile 默认 sheet → SearchSheet' },
    'platform|pc|list': { type: 'string', description: '同 platform.desktop.list' },
    'platform|pc|create': { type: 'string', description: '同 platform.desktop.create' },
    'platform|pc|update': { type: 'string', description: '同 platform.desktop.update' },
    'platform|pc|filter': { type: 'string', description: '同 platform.desktop.filter' },
    layout: { description: '空间布局；可省略（DEFAULT_LAYOUT）' },
    'layout|list': { description: '列表区：regions / treeWidth / cols / variants' },
    'layout|create': { description: '新建表单 cols / variants' },
    'layout|update': { description: '编辑表单 cols / variants' },
    'layout|list|regions': { type: 'object', description: '{ regionId: { role: tree|table|collection|list } }' },
    'layout|list|treeWidth': { type: 'string', description: '树区域宽度，默认 280px' },
    'layout|list|cols': { type: 'number', description: 'Mobile List 详情 grid 列数，默认 2' },
    'layout|list|variants': { type: 'object', description: '{ pc?, mobile? } 字段 span 覆盖' },
    'layout|create|cols': { type: 'number', description: '新建表单列数，默认 3' },
    'layout|create|variants': { type: 'object', description: '字段 span：mobile 默认满行' },
    'layout|update|cols': { type: 'number', description: '编辑表单列数' },
    'layout|update|variants': { type: 'object', description: '同 create.variants' },
    slots: {
        description: '插槽 HTML 字符串。\n\n'
            + '**统一写法**：`slots.{list|create|update}.{pc|mobile}.children: string[]`，每项为完整 `<template v-slot:…>…</template>`。\n'
            + '- list → Table/List\n'
            + '- create/update → CreateDrawer|FormSheet|UpdateDrawer 子节点（field-*/label-*/after-*）',
    },
    'slots|list': { description: '列表相关插槽' },
    'slots|create': {
        description: '新增表单插槽。`pc/mobile.children` 与 list 同形；legacy：`fields: { fieldKey: \"插槽\" }` → fieldList 项 slot:true',
    },
    'slots|update': {
        description: '编辑表单插槽。`pc/mobile.children`；单表单 legacy：`fields: { fieldKey }`；多 Tab：`{tabKey}.fields` 或 `{tabKey}.pc.children`',
    },
    'slots|create|pc': {
        description: 'PC CreateDrawer 子节点：`children: string[]`，如 `<template v-slot:field-projectName=\"{ field, value, onChange }\">…</template>`',
    },
    'slots|create|mobile': { description: 'Mobile FormSheet create 插槽 children' },
    'slots|update|pc': {
        description: 'PC UpdateDrawer 子节点：`children: string[]`（field-/label-/after- 插槽，经 jh-form 转发）',
    },
    'slots|update|mobile': { description: 'Mobile FormSheet update 插槽 children' },
    'slots|update|fields': {
        description: 'views.update 单表单（无 tabs）时：字段 key → slot:true 占位；或改用 update.pc.children 写完整 template',
    },
    'slots|list|pc': {
        description: '**PC `<jh-table>` 子节点**：`children: string[]`，每项为完整 `<template v-slot:…>…</template>`。\n' +
            '例：`toolbar-append` 列设置、`item.xxx` 列插槽。不要写在顶层 `pc.children`。',
    },
    'slots|list|mobile': { description: 'Mobile List children' },
    'slots|list|columns': { description: '列插槽键（逐步废弃）' },
    'slots|list|rowActions': { description: '行操作插槽键（逐步废弃）' },
    blocks: { description: 'pc/mobile 覆盖函数第二参数：细粒度 UI 块' },
    // ── pc/mobile 箭头函数参数（悬停参数名 / SignatureHelp；非 key: 路径匹配）──
    'override|views': {
        type: 'object (readonly)',
        description: '**第一参数**：当前页 `views` 语义对象（与根级 `views` 同一引用，只读）。\n' +
            '可读 `views.list` / `views.create` / `views.update` 做条件布局；**不要**在覆写里改 views。',
    },
    'override|blocks': {
        type: 'object',
        description: '**第二参数**：`expandCrudPage` 预组装的 UI 节点与辅助函数。\n' +
            '未生成的视图（如无 create）对应键为 `null`；拼树时用 `.filter(Boolean)` 去掉空项。\n' +
            '输入 `blocks.` 可补全成员名。',
    },
    'pc|views': {
        type: 'object (readonly)',
        description: 'PC 覆写函数第一参数；同 **override|views**',
    },
    'pc|blocks': {
        type: 'object',
        description: 'PC 覆写函数第二参数；同 **override|blocks**',
    },
    'mobile|views': {
        type: 'object (readonly)',
        description: 'Mobile 覆写函数第一参数；同 **override|views**',
    },
    'mobile|blocks': {
        type: 'object',
        description: 'Mobile 覆写函数第二参数；同 **override|blocks**',
    },
    'blocks|pageHeader': { description: '默认顶栏 HStack（PC: PageTitle+Search；Mobile: Actions+FilterBtn）' },
    'blocks|pageTitle': { description: 'PC PageTitle 节点' },
    'blocks|search': { description: 'PC Search 节点' },
    'blocks|toolbarActions': { description: 'Mobile MobileActions' },
    'blocks|toolbarSpacer': { description: 'Mobile VSpacer' },
    'blocks|searchBtn': { description: 'Mobile MobileFilterBtn' },
    'blocks|filterBtn': { description: 'searchBtn 别名' },
    'blocks|searchSheet': { description: 'SearchSheet（放 actionContent）' },
    'blocks|list': { description: 'Table / List 集合块' },
    'blocks|create': { description: 'CreateDrawer / FormSheet 节点' },
    'blocks|update': { description: 'UpdateDrawer / FormSheet 节点' },
    'blocks|composeToolbar': {
        description: '(children, opts?) => HStack 顶栏容器；默认 `props.wrap: true`（jh-hstack flex-wrap），窄屏可换行；`opts.props.wrap: false` 可关闭',
    },
    common: { description: '透传 Vue 实例：data / methods / doUiAction 等；**jh-component 的 Vue props 写 common.props**' },
    'common|props': {
        type: 'object | array',
        description: 'Vue 组件 **props** 声明（jh-component / 旧版组件 init-json 惯例位置）。\n'
            + '例：`projectId: { type: String, required: true }`；宿主 Page 通过 `:project-id="..."` 传入。\n'
            + '与 `component.props` 二选一，**以 common.props 为准**（component.props 仅兼容合并）。',
    },
    'common|data': { type: 'object', description: '页面 data' },
    'common|mixins': {
        type: 'string',
        description: 'Vue mixins 数组字面量字符串，NJK bake 为 `mixins: …`。\n'
            + '例：`\'[userNameMixin]\'` → `mixins: [userNameMixin],`；mixin 须由 includeList js 挂到全局。',
    },
    'common|computed': { type: 'object', description: 'computed' },
    'common|methods': { type: 'object', description: 'methods' },
    'common|watch': { type: 'object', description: 'watch' },
    'common|doUiAction': { type: 'object', description: 'UI 动作链 `{ actionId: [...] }`' },
    includeList: {
        description: 'css/js/html/vue 引入数组；项上可选 `target: pc|mobile`，省略则两端都引',
    },
    'includeList|type': { type: 'string', description: 'css | js | html | include | vueUse | vueComponent' },
    'includeList|path': { type: 'string', description: '资源路径（css/js/html/include 必填）' },
    'includeList|target': { type: 'string | string[]', description: 'pc | mobile；省略=两端共用' },
    'includeList|attrs': { type: 'object', description: '标签属性或 include attrs' },
    'includeList|includeType': { type: 'string', description: '如 auto：模板内挂载 vue 组件' },
    'includeList|component': { type: 'string', description: 'vueUse/vueComponent 组件名' },
    resourceList: { description: '后端 resource 定义（**jh-page CRUD/UI**）；jh-component 禁止，权限归宿主 Page' },
    // ── pc / mobile 覆盖（仅 mode:"crud"）────────────────────────────────────
    pc: {
        description: '**mode:"crud" 专用**：`(views, blocks) => { pageContent?, actionContent? }` 覆盖 **PC** 编译产物 UI 树。\n' +
            '省略则使用 expandCrudPage 默认树。\n\n' +
            '**不是插槽容器**：`toolbar-append` 等 HTML 请写 **`slots.list.pc.children`**，不要写 `pc.children`。\n\n' +
            '**智能提示**：悬停 `(views, blocks)` 参数名、`blocks.xxx` 成员，或输入 `blocks.` 触发补全；`(` 内显示 SignatureHelp。',
        example: '(views, blocks) => ({\n'
            + '  pageContent: { component: "VStack", children: [blocks.pageHeader, blocks.list] },\n'
            + '  actionContent: [blocks.create, blocks.update].filter(Boolean),\n'
            + '})',
    },
    mobile: {
        description: '**mode:"crud" 专用**：`(views, blocks) => { pageContent?, actionContent? }` 覆盖 **Mobile** 编译产物 UI 树。\n\n' +
            '**智能提示**：同 `pc` — 参数名 hover、SignatureHelp、`blocks.` 成员补全。',
        example: '(views, blocks) => ({\n'
            + '  pageContent: { component: "VStack", children: [blocks.composeToolbar([...]), blocks.list] },\n'
            + '  actionContent: [blocks.create, blocks.update, blocks.searchSheet].filter(Boolean),\n'
            + '})',
    },
    'pc|pageContent': {
        description: 'PC 页面主体**单根节点对象**（推荐）。典型：`{ component: "VStack", children: [blocks.pageHeader, blocks.list] }`；兼容仅 1 项的数组写法。',
    },
    'pc|actionContent': {
        description: 'PC 叠层节点数组。典型：`[blocks.create, blocks.update]`（CreateDrawer / UpdateDrawer）',
    },
    'mobile|pageContent': { description: 'Mobile 页面主体单根节点对象；常用 VStack + composeToolbar + blocks.list' },
    'mobile|actionContent': { description: 'Mobile 叠层：`blocks.create`、`blocks.update`、`blocks.searchSheet` 等' },
    // ── UI 节点通用字段（pc/mobile 覆写与 v6 编译 IR 同形）────────────────────────
    key: { type: 'string', description: '节点唯一 key；表单/Sheet 用于生成 `isXxxDrawerShown`、`xxxItem` 等绑定' },
    props: { type: 'object', description: '组件 props；Table/List/Drawer 等业务参数' },
    children: {
        description: '子节点：`组件节点对象[]` 或 **HTML 字符串**（Table/List 的 v-slot 模板）。\n' +
            '容器：VStack / HStack / Box / Grid。',
    },
    attrs: { type: 'object', description: '根节点 HTML/Vue 属性：`class`、`:class`、`@click`、`v-if` 等' },
    attrsRef: { type: 'string', description: '从配置根路径合并 attrs（attrs 覆盖同名键）' },
    'pageContent|component': {
        type: 'string',
        description: '**pageContent** 内允许的 component：\n' +
            '- `VStack` / `HStack` / `Box` / `Grid` — 布局容器\n' +
            '- `PageTitle` / `Search` — PC 顶栏（或由 blocks.pageHeader 组合）\n' +
            '- `Table` / `List` — 列表主体（常用 blocks.list）\n' +
            '- `MobileActions` / `MobileFilterBtn` — Mobile 顶栏碎块\n\n' +
            '**抽屉 / Sheet 不要写 pageContent**，应放 actionContent。',
    },
    'actionContent|component': {
        type: 'string',
        description: '**actionContent** 内允许的 component：\n' +
            '- `CreateDrawer` / `UpdateDrawer` — PC 表单抽屉\n' +
            '- `FormSheet` — Mobile 底部表单（blocks.create / blocks.update）\n' +
            '- `SearchSheet` — Mobile 搜索 Sheet（blocks.searchSheet）\n' +
            '- `Drawer` / `FormDrawer` / `Sheet` — 通用自定义叠层',
    },
    'pageContent|key': { type: 'string', description: '节点 key；Table 默认 mainTable' },
    'pageContent|props': {
        type: 'object',
        description: '组件**静态 props**（写入生成 HTML）。同节点已写 `component` 时，悬停 **props** 展开该组件支持的子键。\n\n'
            + '前缀示例：`Table|*`、`MobileFilterBtn|*`、`MobileActions|*`、`PageHeader|*`、`VStack|*` …',
    },
    'pageContent|attrs': {
        type: 'object',
        description: '透传根节点 **Vue 绑定**（`:class`、`@click` 等）。\n'
            + '**MobileFilterBtn** 常用 `@click`: `"doUiAction(\'viewXxx\')"` 或 `"isXxxDrawerShown = true"`。',
    },
    'pageContent|children': { description: '子节点或插槽 HTML 字符串数组' },
    'actionContent|key': {
        type: 'string',
        description: '节点 key，决定运行时绑定变量前缀：\n'
            + '- `create` → `isCreateDrawerShown` / `createItem`\n'
            + '- `update` → `isUpdateDrawerShown` / `updateItem`\n'
            + '- 自定义如 `orgTree` → `isOrgTreeDrawerShown` / `orgTreeItem`（Sheet/Drawer 按 key 生成）',
    },
    'actionContent|props': {
        type: 'object',
        description: '叠层组件**静态 props**（JSON 写入模板）。响应式绑定由编译器注入，配置中通常不写：\n'
            + '- CreateDrawer / UpdateDrawer：`v-model`、`:initialData`、`@field-change`、`@action`\n'
            + '- FormSheet：`:shown.sync`、`:initialData`、`@field-change`、`@action`\n'
            + '- SearchSheet：`:shown.sync`、`:keyword.sync`、`@search` 等\n\n'
            + '同节点已写 **`component` 或 `tag`**（如 `tag: \'CreateDrawer\'`）时，悬停 **props** 会展开该组件支持的子键；词条前缀见 `Component|prop`：\n'
            + '- **CreateDrawer / UpdateDrawer / FormDrawer** → `Drawer|*`（底部 **`actionList`**）\n'
            + '- **FormSheet** → `Drawer|*` + **`headActionList`** / **`rounded`** / **`hiddenBtn`**\n'
            + '- **SearchSheet** → `SearchSheet|*`\n'
            + '- **Sheet** → `Sheet|*`（自定义内容走节点 **`children`**）\n'
            + '- **Drawer**（纯壳）→ 主要靠 **`children`**，可选 `title`',
    },
    'actionContent|children': {
        description: '默认插槽：`Sheet` / `Drawer` 的 HTML 字符串或子 UI 节点。\n'
            + '**Sheet 标题栏按钮**：`props.headActionList` → `jh-mobile-actions`；或 `<template v-slot:head-actions>` 覆盖默认。\n'
            + '配置式表单（fieldList / tabList）走 **props**，字段级插槽走 **slots.create|update** 或 `<template v-slot:field-xxx>` 子串。',
    },
    // ── actionContent：CreateDrawer / UpdateDrawer / FormDrawer / FormSheet（jh-form 族）──
    'Drawer|title': { type: 'string', description: '抽屉/Sheet 标题（静态）；动态用 **`titleBind`**（→ `:title`）或 `{ __expr__ }`' },
    'Drawer|titleBind': {
        type: 'string',
        description: 'FormSheet / Drawer 动态标题 Vue 表达式 → `:title`（与 `title` 互斥，**titleBind 优先**）',
    },
    'Drawer|cols': { type: 'number', description: '表单 grid 列数（无 tabList 时）；layout.create.cols / layout.update.cols 语义展开', example: '2' },
    'Drawer|gap': { type: 'string', description: '表单字段间距 CSS gap；FormSheet 默认 `"0"`', example: '"12px 16px"' },
    'Drawer|labelMode': { type: 'string', description: '标签模式：`above` | `float` | `inline`（FormSheet 默认 inline）' },
    'Drawer|rounded': { type: 'boolean', description: 'FormSheet 顶部圆角 `rounded-t-lg`；platform create/update=CreateSheet 时自动 true' },
    'Drawer|hiddenBtn': { type: 'boolean', description: 'FormSheet：隐藏标题栏默认「重置/确认」' },
    'Drawer|fieldList': {
        description: '单表单字段数组（无 tabList 时）。来自 **views.create.fields** / **views.update.fields** + **fields** 字典；也可手写覆写 blocks。\n\n'
            + '项形状见 **`fieldList|*`**；`type: section|divider|tip` 为分组占位。',
        example: '[{ key: "projectName", label: "项目名称", type: "text", required: true }]',
    },
    'Drawer|fields': { description: '兼容旧名，等价 fieldList（fieldList 优先）' },
    'Drawer|tabList': {
        description: '多 Tab 编辑（**views.update.tabs**）。每项：`{ key, title, fieldList, actions?, cols?, ... }`。\n'
            + 'Tab 内字段见 **`tabList|*`**；PC Drawer 用 tab **`actionList`**，FormSheet 用 tab **`headActionList`**。',
    },
    'Drawer|actionList': {
        description: '**CreateDrawer / UpdateDrawer / FormDrawer** 底部操作按钮（**views.create.actions** / **views.update.actions**）。\n'
            + 'FormSheet 不用此键，改用 **`headActionList`** 放标题栏。项见 **`actionList|*`**。',
    },
    'Drawer|headActionList': {
        description: '**FormSheet** 标题栏操作（**views.create.actions** / tab.actions 在 mobile 展开为此键）。\n'
            + '编译时 CreateDrawer 仍映射为 **`actionList`**。项见 **`actionList|*`**（含 visibleWhen / disabledWhen）。',
    },
    'Drawer|beforeCloseConfirm': {
        type: 'boolean',
        description: '关闭前脏检测确认（**views.create.saveTipBeforeClose** / beforeCloseConfirm）',
    },
    'Drawer|beforeCloseCompareFields': {
        type: 'string[]',
        description: '脏检测仅比较指定字段；默认比较全部 fieldList',
        example: '["projectName", "status"]',
    },
    'Drawer|persistent': { type: 'boolean', description: '**FormSheet / Sheet 专用**；点外侧不关闭（Drawer 无效）' },
    'Drawer|autoHeight': { type: 'boolean', description: '**FormSheet** 高度策略；v7 mobile create/update 默认 true' },
    'Drawer|viewportOffset': { type: 'number', description: '**FormSheet** calc(100vh-Npx)；编译默认 102 / 152' },
    'Drawer|maxBodyHeight': { type: 'string', description: '**FormSheet / SearchSheet / Sheet** 内容区 max-h' },
    'Drawer|bodyHeight': { type: 'string', description: '**Sheet 族** 固定内容区高度' },
    'Drawer|minCardHeight': { type: 'string', description: '**Sheet 族** 卡片 min-h，默认 100px' },
    // ── actionContent：SearchSheet（jh-mobile-search-sheet）────────────────────
    'SearchSheet|title': { type: 'string', description: 'Sheet 标题；默认「搜索」（views.list.mobileSearchTitle）' },
    'SearchSheet|rounded': { type: 'boolean', description: '卡片顶部圆角，CRUD 移动搜索默认 true' },
    'SearchSheet|searchFieldList': {
        description: '搜索字段数组，来自 **views.list.search** 展开。**数组**为静态配置；**字符串**为 Vue 变量名 → `:search-field-list`。\n'
            + '项见 **`searchFieldList|*`**；可含 `type: "keyword"`。',
    },
    'SearchSheet|keyword': {
        type: 'string | object',
        description: 'keyword 块：对象 `{ fields, placeholder }`（静态）；或字符串变量名 → `:keyword.sync`（默认页面 `keyword`）',
    },
    'SearchSheet|keywordFieldList': {
        description: 'keyword 已选列：**数组**静态；**字符串**变量名 → `:keyword-field-list.sync`',
    },
    'SearchSheet|keywordHeaders': {
        description: 'keyword 可选列 `{ text, value }[]`；字符串变量名 → `:keyword-headers`',
    },
    'SearchSheet|showSearchBtn': { type: 'boolean', description: '是否显示底部「重置 / 查询」，默认 true' },
    'SearchSheet|bodyClass': { description: '透传 jh-sheet 内容区 class（与 maxBodyHeight 合并）' },
    'SearchSheet|persistent': { type: 'boolean', description: '点外侧不关闭；**views.list.searchSheet.persistent**' },
    'SearchSheet|maxBodyHeight': { type: 'string', description: '内容区 max-h，默认 `70vh`（**views.list.searchSheet**）' },
    'SearchSheet|bodyHeight': { type: 'string', description: '固定内容区高度；优先于 maxBodyHeight' },
    'SearchSheet|minCardHeight': { type: 'string', description: '卡片 min-h，默认 100px' },
    // ── actionContent：Sheet（jh-sheet 通用底部卡片）──────────────────────────
    'Sheet|title': {
        type: 'string',
        description: '底部 Sheet 标题（静态）。动态标题优先用 **`titleBind`**（Vue 表达式 → `:title`）；或 `{ __expr__: \'computedTitle\' }` + computed',
    },
    'Sheet|titleBind': {
        type: 'string',
        description: '**通用 *Bind**：`titleBind` → `:title="Vue 表达式"`（与 plain `title` 互斥）。任意 prop 均可 `<prop>Bind`，见文档 *Bind 协议。',
    },
    'Sheet|rounded': { type: 'boolean', description: '顶部圆角 `rounded-t-lg`' },
    'Sheet|orderList': {
        description: '排序模式（与 **actionList** / **children** 默认插槽三选一）。`[{ text, value }]`；标题栏自带「重置/确认」',
    },
    'Sheet|actionList': {
        description: '**内容区**图标网格（与 orderList / children 默认插槽三选一）。`cols` 控制列数。\n'
            + '点击后 `@action` → `doUiAction(整项对象)`（非 intent 字符串）。**不支持** disabled / visible。项见 **`Sheet|actionList|*`**',
    },
    'Sheet|headActionList': {
        description: '**标题栏**按钮（`jh-mobile-actions`）；与 orderList 模式标题栏「重置/确认」互斥（有 orderList 时优先后者）。\n'
            + '点击 `@head-action` → `doUiAction(actionId)`；项格式同 **`actionList|*`**（label / intent / visibleWhen 等）。',
    },
    'Sheet|actionList|value': { type: 'string', description: '网格项展示文字（jh-sheet 用 value，不是 label）', example: '"解绑"' },
    'Sheet|actionList|icon': { type: 'string', description: 'mdi 图标名', example: '"mdi-link-off"' },
    'Sheet|actionList|color': { type: 'string', description: '图标颜色（Vuetify color）' },
    'Sheet|actionList|tag': { type: 'string', description: '有 tag 时走 custom 插槽，不渲染默认网格单元' },
    'Sheet|cols': { type: 'number', description: 'actionList 网格列数（Tailwind grid-cols-*）' },
    'Sheet|stackZIndex': { type: 'number', description: '叠层层级' },
    'Sheet|cardClass': { description: '卡片额外 class' },
    'Sheet|bodyClass': { description: 'v-card-text 区域 class' },
    'Sheet|actionsClass': { description: '底部按钮栏 class' },
    'Sheet|attach': { description: '`false` | `"body"` — Vuetify 挂载目标' },
    'Sheet|lazy': { type: 'boolean', description: 'false 时首次打开前即挂载内容' },
    'Sheet|persistent': { type: 'boolean', description: '点外侧不关闭 → v-bottom-sheet persistent' },
    'Sheet|maxBodyHeight': { type: 'string', description: '自定义 Sheet 内容区 max-h（actionContent 手写 Sheet 时用）' },
    'Sheet|bodyHeight': { type: 'string', description: '自定义 Sheet 固定内容区高度' },
    'Sheet|minCardHeight': { type: 'string', description: '卡片 min-h，默认 100px' },
    // ── pageContent：Table / List（blocks.list 常用）──────────────────────────
    'Table|headers': { description: 'Vuetify 列 `{ text, value, width?, class?, cellClass?, ... }[]`；来自 views.list.columns + fields' },
    'Table|headersBinding': { type: 'string', description: '动态列变量名 → `:headers="headers"`（如列设置按钮场景）' },
    'Table|columnsBinding': { type: 'string', description: 'headersBinding 别名' },
    'Table|serverPagination': { type: 'boolean', description: '服务端分页' },
    'Table|pageSize': { type: 'number', description: '默认每页条数' },
    'Table|selectable': { type: 'boolean', description: '行多选' },
    'Table|orderBy': { type: 'array', description: '默认排序 `[{ column, order }]`' },
    'Table|headActionList': { description: 'PC 表头工具按钮 → views.list.toolbarActions；运行时映射 toolbarActionList' },
    'Table|rowActionList': { description: '行操作 → views.list.rowActions；项见 rowActionList|*' },
    'Table|filterList': { description: 'PC 客户端二次筛选 → views.list.filter；项见 filterList|*' },
    'Table|slotTemplates': { description: '列插槽占位键（legacy）；推荐 slots.list.pc.children' },
    'List|headers': { description: '同 Table；Mobile List 卡片列，mobileColumns 优先' },
    'List|cols': { type: 'number', description: 'Mobile List 详情区 grid 列数（layout.list.cols）' },
    // ── fieldList / tabList / actionList / searchFieldList 项（表单与搜索嵌套）────
    'fieldList|key': { type: 'string', description: '字段 key，绑定 createItem/updateItem 属性', example: '"projectName"' },
    'fieldList|label': { type: 'string', description: '显示标签；section 时为分组标题' },
    'fieldList|type': {
        type: 'string',
        description: 'text | number | select | date | textarea | custom | section | divider | tip',
    },
    'fieldList|required': { type: 'boolean', description: '必填' },
    'fieldList|readonly': { type: 'boolean', description: '只读' },
    'fieldList|disabled': { type: 'boolean', description: '禁用' },
    'fieldList|options': { type: 'array | string', description: 'select 选项；字符串 `"constantObj.xxx"` → __expr__' },
    'fieldList|placeholder': { type: 'string', description: '占位文字' },
    'fieldList|span': { type: 'number', description: 'grid 跨列；layout.create.variants 语义展开' },
    'fieldList|slot': { type: 'boolean', description: 'true 时走 slots.create|update 自定义插槽' },
    'fieldList|visibleWhen': { description: 'interaction 条件 → `{ __expr__: "..." }`' },
    'fieldList|readonlyWhen': { description: 'interaction 只读条件' },
    'fieldList|disabledWhen': { description: 'interaction 禁用条件' },
    'fieldList|autoId': { type: 'object', description: '自动 ID：`{ type, prefix?, start? }`' },
    'tabList|key': { type: 'string', description: 'Tab 唯一 key', example: '"basicInfo"' },
    'tabList|title': { type: 'string', description: 'Tab 标题' },
    'tabList|fieldList': { description: 'Tab 内字段数组' },
    'tabList|actionList': { description: 'PC Drawer Tab 底部按钮' },
    'tabList|headActionList': { description: 'FormSheet Tab 标题栏按钮' },
    'tabList|cols': { type: 'number', description: '覆盖根级 cols' },
    'actionList|label': { type: 'string', description: '按钮文字', example: '"保存"' },
    'actionList|intent': { type: 'string', description: '内置：cancel | create | update | delete 等 → doUiAction' },
    'actionList|actionId': { type: 'string', description: '自定义 doUiAction ID' },
    'actionList|id': { type: 'string', description: 'actionId 别名' },
    'actionList|color': { type: 'string', description: 'Vuetify color' },
    'actionList|visibleWhen': {
        type: 'string | boolean | object',
        description: '显隐条件（与 field interaction 同口径）：变量名 / 表达式 / `{ __expr__ }` / `{ field, op, value }`；false 隐藏',
    },
    'actionList|disabledWhen': {
        type: 'string | boolean | object',
        description: '禁用条件：求值 true 时按钮禁用（仍显示）；上下文为 initialData + scope + 页面 $data',
    },
    'searchFieldList|key': { type: 'string', description: '搜索字段 data key' },
    'searchFieldList|label': { type: 'string', description: '搜索项标签' },
    'searchFieldList|op': { type: 'string', description: 'eq | like | in | gt | lt 等' },
    'searchFieldList|type': { type: 'string', description: 'text | select | date | keyword 等' },
    'searchFieldList|options': { type: 'array | string', description: 'select 选项或 constantObj 路径' },
    // ── 布局容器 props（pc/mobile 手写 VStack 时常用）────────────────────────────
    'VStack|gap': { type: 'number | string', description: '子项间距', example: '0' },
    'VStack|align': { type: 'string', description: 'start | center | end | stretch' },
    'VStack|justify': { type: 'string', description: 'start | center | end | between' },
    'VStack|padding': { type: 'string', description: 'CSS padding' },
    'HStack|gap': { type: 'number | string', description: '子项间距', example: '8' },
    'HStack|align': { type: 'string', description: '交叉轴对齐，默认 center' },
    'HStack|justify': { type: 'string', description: '主轴对齐；composeToolbar 常用 space-between' },
    'HStack|wrap': { type: 'boolean', description: '是否换行（→ jh-hstack flex-wrap）；composeToolbar / 默认 mobile 顶栏为 true' },
    'HStack|padding': { type: 'string', description: 'CSS padding，默认 8px 12px（顶栏）' },
    // ── PageHeader（PC 顶栏 / blocks.pageHeader）────────────────────────────────
    'PageHeader|title': { type: 'string', description: '页面标题' },
    'PageHeader|searchFieldList': { description: '顶部搜索字段 → searchFieldList|*' },
    'PageHeader|keyword': { type: 'string', description: '字符串 → `:keyword.sync` 变量名' },
    'PageHeader|keywordFieldList': { description: '字符串 → `:keyword-field-list.sync` 变量名' },
    'PageHeader|keywordHeaders': { description: 'keyword 可选列 `{ text, value }[]` 或变量名' },
    'PageHeader|showSearchBtn': { type: 'boolean', description: '是否显示搜索按钮，默认 true' },
    'PageHeader|helpBtn': { type: 'boolean', description: '右上角帮助按钮' },
    'PageHeader|helpSrc': { type: 'string', description: '帮助 iframe URL' },
    // ── MobileFilterBtn（jh-mobile-filter-btn；pageContent 顶栏触发器）──────────
    'MobileFilterBtn|labelBind': {
        type: 'string',
        description: '**推荐**：主文案 Vue 表达式 → `:label="…"`（如 `pageTitle`）。与 **`label` 二选一**，本键优先。',
    },
    'MobileFilterBtn|label': {
        type: 'string',
        description: '主文案**静态字符串**；绑定变量请用 **`labelBind`**。',
    },
    'MobileFilterBtn|btnClass': {
        type: 'string',
        description: '圆角按钮模式下的 `v-btn` class，默认带 border-gray-300。',
    },
    'MobileFilterBtn|showActive': {
        type: 'boolean',
        description: '`true` 且第二行有内容（**`activeDisplayBind`** / **`activeDisplay`** 或 **`children`** 内 **`v-slot:active-display`**）→ 双行摘要；否则圆角按钮。',
    },
    'MobileFilterBtn|activeDisplayBind': {
        type: 'string',
        description: '摘要第二行**单行** Vue 表达式 → `:active-display="…"`。多段 Mustache + HTML 请用 **`children`** + **`v-slot:active-display`**。',
    },
    'MobileFilterBtn|activeDisplay': {
        description: '摘要第二行**静态**文案；动态单行用 **`activeDisplayBind`**；富文本用 **`children` 插槽**。',
    },
    'MobileFilterBtn|children': {
        description: '**`string[]`**：每项为完整 `<template v-slot:active-display>…</template>`（与 Table 插槽一致）。`showActive: true` 时可替代 **`activeDisplayBind`**。',
    },
    'MobileFilterBtn|iconBind': {
        type: 'string',
        description: '图标 Vue 表达式 → `:icon="…"`。静态图标名（如 `filter-2`）请写 **`icon`**。',
    },
    'MobileFilterBtn|icon': {
        type: 'string',
        description: '静态 **jh-icon** 名（如 `filter-2`）；动态请用 **`iconBind`**。',
    },
    // ── MobileActions（jh-mobile-actions；Mobile 顶栏多按钮）────────────────────
    'MobileActions|actionList': {
        type: 'array',
        description: '顶栏按钮数组。项 `{ label, intent, id?, color?, visibleWhen?, disabledWhen? }` → `@action` → `doUiAction`。',
    },
    // ── Box / Grid（布局容器）──────────────────────────────────────────────────
    'Box|padding': { type: 'string', description: 'CSS padding' },
    'Box|margin': { type: 'string', description: 'CSS margin' },
    'Box|width': { type: 'string', description: 'CSS width，默认 100%' },
    'Grid|cols': { type: 'number | string', description: 'Grid 列数' },
    'Grid|gap': { type: 'number | string', description: '子项间距' },
    'Grid|colsMd': { type: 'number | string', description: '中屏列数' },
    'Grid|colsSm': { type: 'number | string', description: '小屏列数' },
};
/** 列表/对象上下文 key，用于 lookupDoc 路径拼接 */
const V7_LIST_CONTEXT = [
    'fields', 'views', 'list', 'search', 'filter', 'keyword', 'columns',
    'create', 'update', 'tabs', 'interaction', 'platform', 'layout', 'slots', 'blocks',
    'resource', 'toolbarActions', 'rowActions', 'includeList', 'common', 'dataSource', 'page',
    'pc', 'mobile', 'pageContent', 'actionContent',
    'fieldList', 'fields', 'tabList', 'actionList', 'searchFieldList', 'filterList', 'rowActionList', 'headActionList',
];
/** 表单 Drawer 族共用 Drawer|* 文档；Table/List 列文档共用 Table|* */
const V7_COMPONENT_ALIASES = {
    CreateDrawer: 'Drawer',
    UpdateDrawer: 'Drawer',
    FormDrawer: 'Drawer',
    FormSheet: 'Drawer',
    List: 'Table',
};
const V7_LIST_ALIASES = {
    fields: 'fieldList',
    headers: 'columns',
};
const collectChildren = (prefix) => {
    const pfx = `${prefix}|`;
    const grouped = new Map();
    for (const path of Object.keys(V7_PATH_DOCS)) {
        if (!path.startsWith(pfx))
            continue;
        const rest = path.slice(pfx.length);
        const segs = rest.split('|');
        const first = segs[0];
        if (!grouped.has(first)) {
            grouped.set(first, { subKeys: new Map() });
        }
        const g = grouped.get(first);
        if (segs.length === 1) {
            g.doc = V7_PATH_DOCS[path];
        }
        else {
            const nextKey = segs[1];
            if (!g.subKeys.has(nextKey)) {
                g.subKeys.set(nextKey, V7_PATH_DOCS[`${pfx}${first}|${nextKey}`]);
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
const findChildren = (word, ancestors, componentType) => {
    const comp = componentType ? (V7_COMPONENT_ALIASES[componentType] || componentType) : null;
    const prefixes = [];
    if (word === 'props' && comp) {
        prefixes.push(comp);
    }
    if (ancestors.length > 0) {
        const topAncestors = ancestors.slice(0, 4).reverse();
        prefixes.push([...topAncestors, word].join('|'));
    }
    const nearestCtx = ancestors.find(a => V7_LIST_CONTEXT.includes(a));
    if (nearestCtx) {
        prefixes.push(`${nearestCtx}|${word}`);
    }
    if (comp) {
        prefixes.push(`${comp}|${word}`);
    }
    prefixes.push(word);
    const seen = new Set();
    for (const prefix of prefixes) {
        if (seen.has(prefix))
            continue;
        seen.add(prefix);
        const result = collectChildren(prefix);
        if (result.length > 0)
            return result;
    }
    return [];
};
const renderChildEntry = (md, c, indent = '') => {
    const typeStr = c.doc?.type ? ` \`${c.doc.type}\`` : '';
    const desc = c.doc?.description ? ` — ${c.doc.description.split('\n')[0]}` : '';
    md.appendMarkdown(`${indent}- \`${c.key}\`${typeStr}${desc}\n`);
    if (!c.subItems)
        return;
    for (const s of c.subItems) {
        const stype = s.doc?.type ? ` \`${s.doc.type}\`` : '';
        const sdesc = s.doc?.description ? ` — ${s.doc.description.split('\n')[0]}` : '';
        md.appendMarkdown(`${indent}  - \`${s.key}\`${stype}${sdesc}\n`);
    }
};
function getIndent(text) {
    return text.match(/^(\s*)/)?.[1].length ?? 0;
}
function scanAncestors(document, position) {
    const ancestors = [];
    let componentType = null;
    const currentIndent = getIndent(document.lineAt(position.line).text);
    let targetIndent = currentIndent;
    for (let lineNum = position.line - 1; lineNum >= Math.max(0, position.line - 120); lineNum--) {
        const line = document.lineAt(lineNum).text;
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*'))
            continue;
        const indent = getIndent(line);
        if (indent >= targetIndent)
            continue;
        const keyMatch = trimmed.match(/^([\w$]+)\s*:/);
        if (keyMatch) {
            const k = keyMatch[1];
            ancestors.push(k);
            targetIndent = indent;
            if (!componentType) {
                const parsed = (0, configHoverUtils_1.parseComponentTypeFromLine)(trimmed);
                if (parsed)
                    componentType = parsed;
            }
        }
    }
    if (!componentType) {
        const curIndent = getIndent(document.lineAt(position.line).text);
        for (let lineNum = position.line; lineNum >= Math.max(0, position.line - 80); lineNum--) {
            const line = document.lineAt(lineNum).text;
            const indent = getIndent(line);
            if (indent < curIndent)
                break;
            const parsed = (0, configHoverUtils_1.parseComponentTypeFromLine)(line.trim());
            if (parsed) {
                componentType = parsed;
                break;
            }
        }
    }
    return { ancestors, componentType };
}
function lookupDoc(word, ancestors, componentType) {
    const comp = componentType ? (V7_COMPONENT_ALIASES[componentType] || componentType) : null;
    const nearestListRaw = ancestors.find(a => V7_LIST_CONTEXT.includes(a) && [
        'fieldList', 'fields', 'tabList', 'actionList', 'searchFieldList',
        'filterList', 'rowActionList', 'headActionList', 'columns', 'headers',
    ].includes(a)) ?? null;
    const nearestList = nearestListRaw ? (V7_LIST_ALIASES[nearestListRaw] || nearestListRaw) : null;
    const candidates = [];
    if (word === 'component' && nearestList !== 'fieldList') {
        if (ancestors.includes('actionContent'))
            candidates.push('actionContent|component');
        if (ancestors.includes('pageContent'))
            candidates.push('pageContent|component');
    }
    if (ancestors.length > 0) {
        const topAncestors = ancestors.slice(0, 4).reverse();
        candidates.push([...topAncestors, word].join('|'));
    }
    const nearestCtx = ancestors.find(a => V7_LIST_CONTEXT.includes(a));
    if (nearestCtx) {
        candidates.push(`${nearestCtx}|${word}`);
    }
    if (ancestors.includes('views') && word !== 'list') {
        candidates.push(`views|${word}`);
    }
    if (ancestors.includes('fields')) {
        candidates.push(`fields|${word}`);
    }
    if (comp && nearestList) {
        candidates.push(`${comp}|${nearestList}|${word}`);
    }
    if (comp) {
        candidates.push(`${comp}|${word}`);
    }
    if (nearestList) {
        candidates.push(`${nearestList}|${word}`);
    }
    const top = ancestors.slice(0, 4);
    for (let len = top.length; len >= 1; len--) {
        candidates.push([...top.slice(0, len), word].join('|'));
    }
    candidates.push(word);
    const seen = new Set();
    for (const c of candidates) {
        if (seen.has(c))
            continue;
        seen.add(c);
        if (c in V7_PATH_DOCS)
            return V7_PATH_DOCS[c];
    }
    return null;
}
const V7_DOC_LANGUAGES = [
    { scheme: 'file', language: 'javascript' },
    { scheme: 'file', language: 'javascriptreact' },
    { scheme: 'file', language: 'typescript' },
    { scheme: 'file', language: 'typescriptreact' },
];
/** 向上查找 pc/mobile 箭头函数的形参列表 `( … )` */
function findOverrideCallbackContext(document, position) {
    for (let lineNum = position.line; lineNum >= Math.max(0, position.line - 50); lineNum--) {
        const line = document.lineAt(lineNum).text;
        const startMatch = line.match(/\b(pc|mobile)\s*:\s*(?:async\s*)?\(/);
        if (!startMatch || startMatch.index === undefined)
            continue;
        const platform = startMatch[1];
        const openParenIndex = line.indexOf('(', startMatch.index);
        if (openParenIndex < 0)
            continue;
        let depth = 0;
        let paramStart = null;
        let closePos = null;
        for (let ln = lineNum; ln <= Math.min(document.lineCount - 1, lineNum + 15); ln++) {
            const text = document.lineAt(ln).text;
            const startCol = ln === lineNum ? openParenIndex : 0;
            for (let col = startCol; col < text.length; col++) {
                const ch = text[col];
                if (ch === '(') {
                    depth++;
                    if (depth === 1 && !paramStart) {
                        paramStart = new vscode.Position(ln, col + 1);
                    }
                    continue;
                }
                if (ch === ')') {
                    depth--;
                    if (depth === 0 && paramStart) {
                        closePos = new vscode.Position(ln, col);
                        break;
                    }
                }
            }
            if (closePos)
                break;
        }
        if (!paramStart || !closePos)
            continue;
        if (!hasArrowAfterParen(document, closePos))
            continue;
        const paramRange = new vscode.Range(paramStart, closePos);
        return {
            platform,
            paramRange,
            paramText: document.getText(paramRange),
        };
    }
    return null;
}
function hasArrowAfterParen(document, closePos) {
    const tail = document.lineAt(closePos.line).text.slice(closePos.character + 1);
    if (/=>/.test(tail))
        return true;
    for (let ln = closePos.line + 1; ln <= Math.min(document.lineCount - 1, closePos.line + 6); ln++) {
        const t = document.lineAt(ln).text.trim();
        if (!t || t.startsWith('//'))
            continue;
        return /=>/.test(t);
    }
    return false;
}
/** 光标是否在 pc/mobile 覆写函数体内（含形参列表与 => 之后） */
function findOverridePlatform(document, position) {
    const ctx = findOverrideCallbackContext(document, position);
    if (!ctx)
        return null;
    if (ctx.paramRange.contains(position))
        return ctx.platform;
    const { ancestors } = scanAncestors(document, position);
    if (ancestors.includes('pc'))
        return 'pc';
    if (ancestors.includes('mobile'))
        return 'mobile';
    for (let lineNum = position.line; lineNum >= Math.max(0, position.line - 50); lineNum--) {
        const line = document.lineAt(lineNum).text;
        const m = line.match(/\b(pc|mobile)\s*:\s*(?:async\s*)?\(/);
        if (m)
            return m[1];
    }
    return null;
}
function isOverrideParamName(word, paramText) {
    if (word !== 'views' && word !== 'blocks')
        return false;
    return paramText
        .split(',')
        .map(p => p.trim().split(/[=:]/)[0]?.trim())
        .filter(Boolean)
        .includes(word);
}
function getBlocksMemberWord(document, position) {
    const range = document.getWordRangeAtPosition(position, /[a-zA-Z$_][a-zA-Z0-9$_]*/);
    if (!range)
        return null;
    const word = document.getText(range);
    const before = document.lineAt(position.line).text.slice(0, range.start.character);
    if (!/\bblocks\.$/.test(before))
        return null;
    return word;
}
function computeActiveParameterIndex(paramText, offsetInParams) {
    let depth = 0;
    let segmentStart = 0;
    let index = 0;
    for (let i = 0; i <= paramText.length; i++) {
        const ch = paramText[i];
        const atEnd = i === paramText.length;
        if (!atEnd) {
            if (ch === '(' || ch === '[' || ch === '{')
                depth++;
            else if (ch === ')' || ch === ']' || ch === '}')
                depth--;
        }
        if ((atEnd || (ch === ',' && depth === 0)) && offsetInParams >= segmentStart && offsetInParams <= i) {
            return index;
        }
        if (ch === ',' && depth === 0) {
            index++;
            segmentStart = i + 1;
        }
    }
    return 0;
}
function buildHoverMarkdown(word, doc, children) {
    const md = new vscode.MarkdownString();
    md.isTrusted = true;
    const titleParts = [`**\`${word}\`**`];
    if (doc?.type)
        titleParts.push(`\`${doc.type}\``);
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
    return md;
}
class V7ConfigHoverProvider {
    provideHover(document, position) {
        if (!(0, configVersionDetect_1.isV7ConfigDocument)(document))
            return null;
        const range = document.getWordRangeAtPosition(position, /[a-zA-Z$_][a-zA-Z0-9$_]*/);
        if (!range)
            return null;
        const word = document.getText(range);
        const lineText = document.lineAt(position.line).text;
        const isKeyHover = lineText.slice(range.end.character).trimStart()[0] === ':';
        const overrideCtx = findOverrideCallbackContext(document, position);
        const isParamHover = !!overrideCtx
            && overrideCtx.paramRange.contains(position)
            && isOverrideParamName(word, overrideCtx.paramText);
        const blocksMember = getBlocksMemberWord(document, position);
        const isBlocksMemberHover = !!blocksMember && blocksMember === word && !!findOverridePlatform(document, position);
        if (!isKeyHover && !isParamHover && !isBlocksMemberHover)
            return null;
        let doc = null;
        let children = [];
        if (isParamHover && overrideCtx) {
            doc = lookupDoc(word, [overrideCtx.platform, 'override'], null) || V7_PATH_DOCS[`override|${word}`] || null;
            if (word === 'blocks') {
                children = findChildren('blocks', [overrideCtx.platform], null);
            }
            else if (word === 'views') {
                children = findChildren('views', [], null);
            }
        }
        else if (isBlocksMemberHover) {
            doc = V7_PATH_DOCS[`blocks|${word}`] || lookupDoc(word, ['blocks'], null) || null;
        }
        else {
            const { ancestors, componentType } = scanAncestors(document, position);
            doc = lookupDoc(word, ancestors, componentType);
            children = findChildren(word, ancestors, componentType);
        }
        if (!doc && children.length === 0)
            return null;
        return new vscode.Hover(buildHoverMarkdown(word, doc, children), range);
    }
}
exports.V7ConfigHoverProvider = V7ConfigHoverProvider;
class V7ConfigSignatureHelpProvider {
    provideSignatureHelp(document, position) {
        if (!(0, configVersionDetect_1.isV7ConfigDocument)(document))
            return null;
        const overrideCtx = findOverrideCallbackContext(document, position);
        if (!overrideCtx || !overrideCtx.paramRange.contains(position))
            return null;
        const viewsDoc = V7_PATH_DOCS['override|views'];
        const blocksDoc = V7_PATH_DOCS['override|blocks'];
        const signature = new vscode.SignatureInformation(`${overrideCtx.platform}: (views, blocks) => { pageContent?, actionContent? }`, `${overrideCtx.platform.toUpperCase()} 端 UI 树覆写；返回对象可含 pageContent / actionContent`);
        signature.parameters = [
            new vscode.ParameterInformation('views', viewsDoc?.description),
            new vscode.ParameterInformation('blocks', blocksDoc?.description),
        ];
        const offsetInParams = document.offsetAt(position) - document.offsetAt(overrideCtx.paramRange.start);
        const activeParameter = computeActiveParameterIndex(overrideCtx.paramText, offsetInParams);
        return {
            signatures: [signature],
            activeSignature: 0,
            activeParameter,
        };
    }
}
exports.V7ConfigSignatureHelpProvider = V7ConfigSignatureHelpProvider;
class V7ConfigCompletionProvider {
    provideCompletionItems(document, position) {
        if (!(0, configVersionDetect_1.isV7ConfigDocument)(document))
            return null;
        if (!findOverridePlatform(document, position))
            return null;
        const line = document.lineAt(position.line).text;
        const before = line.slice(0, position.character);
        if (!/\bblocks\.[a-zA-Z$_][a-zA-Z0-9$_]*$/.test(before) && !/\bblocks\.$/.test(before)) {
            return null;
        }
        return collectChildren('blocks').map(c => {
            const item = new vscode.CompletionItem(c.key, vscode.CompletionItemKind.Property);
            if (c.doc?.type)
                item.detail = c.doc.type;
            if (c.doc?.description) {
                item.documentation = new vscode.MarkdownString(c.doc.description);
            }
            return item;
        });
    }
}
exports.V7ConfigCompletionProvider = V7ConfigCompletionProvider;
function activateV7ConfigHover(context) {
    context.subscriptions.push(vscode.languages.registerHoverProvider(V7_DOC_LANGUAGES, new V7ConfigHoverProvider()), vscode.languages.registerSignatureHelpProvider(V7_DOC_LANGUAGES, new V7ConfigSignatureHelpProvider(), '(', ','), vscode.languages.registerCompletionItemProvider(V7_DOC_LANGUAGES, new V7ConfigCompletionProvider(), '.'));
}
exports.activateV7ConfigHover = activateV7ConfigHover;
//# sourceMappingURL=v7ConfigHoverProvider.js.map