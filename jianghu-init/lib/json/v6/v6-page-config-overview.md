# V6 页面配置：整体样例与说明

本文描述 **v6 声明式页面**：入口 Schema JSON → `parse_schema.parseSchema()`（返回 **`{ standardConfig, legacyConfig }`**，主线模板消费 **`standardConfig`**）→ **`jh-page-v6.njk.html`** 等生成 Vue 页面。

---

## 1. 数据流（心智模型）

| 阶段 | 说明 |
|------|------|
| **编写 Schema** | 根对象以 **`page`、`pageContent`、`actionContent`、`dataSource`** 为主；可选 **`common`、`resourceList`、`includeList`** 等。**`list` / `form`** 仅解析器兼容兜底用，一般不必写在页面 JSON 里（见 §2）。 |
| **`parseSchema`** | 规范化树 → **抬升移动端中继**（正文里的中继节点变为 **触发器 HTML 字符串**，同时在 **`actionContent` 末尾追加**弹出层 **组件节点**）→ 整棵树递归 **`resolveNode`**（弹出层映射 `jh-sheet` / `jh-form-sheet` / `jh-mobile-search-sheet` 等）。 |
| **`standardConfig`** | 供 NJK 使用：`pageContent`、`actionContent` 已是解析后的节点数组；另有 `features`、`blocks`、`dataSource`。 |
| **NJK 渲染** | `jh-v6-macros.html`：`renderProps`（静态 props 序列化）+ `renderBindings`（`:prop="表达式"`）+ `renderAttrs`。 |

解析实现：`lib/json/v6/parse_schema.js`  
页面模板：`page-template-json/jh-page/jh-page-v6.njk.html`  
JSON Schema（校验 / 补全）：`vscode-extension/src/schemas/components/v6-page-tree.schema.json`

---

## 2. Schema 根对象常用字段（样例骨架）

下列为 **结构示意**，字段可按业务删减；`pageContent` 也可用 **`layout`** 兼容键（数组或单对象）。

```json
{
  "pageType": "jh-page",
  "version": "v6",

  "page": {
    "id": "demoPage",
    "name": "示例页",
    "type": "list",
    "menu": true,
    "template": "jhTemplateV6",
    "hook": null,
    "vuetify": ""
  },

  "dataSource": {
    "table": "demo_table",
    "primaryKey": "id",
    "listResource": "selectItemList",
    "createResource": "insertItem",
    "updateResource": "updateItem",
    "deleteResource": "deleteItem"
  },

  "pageContent": [],

  "actionContent": [],

  "common": {
    "data": {},
    "computed": {},
    "methods": {},
    "watch": {}
  },

  "resourceList": [],
  "includeList": []
}
```

`resourceList`、`includeList` 多为 **可选**；无自动注入组件时可留空或省略。

### 字段简述

- **`pageType`**：`jh-page`（桌面 v6）、`jh-mobile-page`（移动端 v6）、`jh-component` 等；影响默认模板名等。
- **`dataSource`**：表名、主键、CRUD 对应 `actionId`（经 `normalizeDataSource` 填默认值）。
- **`pageContent`**：页面主体 **组件树**（布局 + `PageHeader` / `Table` / 移动端中继等）。表格列、搜索字段等写在对应节点的 **`props`** 里，**不要求**根上出现扁平块。
- **`actionContent`**：叠层区——抽屉 / `Sheet` / `FormSheet` / `SearchSheet`；可为 **字符串**（整段 HTML）或 **节点数组**。
- **`common`**：合并进页面 Vue 实例的 `data` / `computed` / `methods` / `watch` 等扩展。
- **`layout`**：若未提供非空的 `pageContent`，可用 `layout` 代替主体树。

### `list` / `form`（一般不体现在「页面 Schema」根结构）

你们日常配置的 **V6 页面 JSON** 通常 **没有** 根级 `list`、`form`。解析器（`parse_schema.js`）内部仍会 **`schema.list || {}`、`schema.form || {}`**：仅在 **缺少** `PageHeader` / `Table`（或 List）节点、`CreateDrawer` / `UpdateDrawer` 等时的 **兼容兜底**（例如老数据迁移时从 `list.search.fields`、`form.create` 取字段）。新页面建议 **全部写在 `pageContent` / `actionContent` 组件树上**，文档样例也不再列出这两项。

### 解析器 vs `v6-page-tree.schema.json`（易踩坑）

| 项目 | 说明 |
|------|------|
| **`pageNode.component` 枚举** | Schema 里 **未包含** **`List`**、**`MobileFilterBtn`**；若 IDE 走严格 JSON Schema 校验，这两项会报错，但 **`COMPONENT_MAP`** 仍支持它们（与 Schema 不同步时需扩展枚举或关闭该校验分支）。 |
| **`MobileSearch`** | 与其它中继一样在正文生成 **`jh-mobile-filter-btn`**，并在 **`actionContent` 追加 `SearchSheet`**；追加节点仍会 **`resolveNode`**（映射 `jh-mobile-search-sheet`）。`COMPONENT_MAP` 注释写明：`MobileOrder` / `MobileFilter` / `MobileAction` 的中继节点 **不会再走** `resolveNode`，只有弹出层节点走完整解析。 |
| **`Table.props`** | Schema 要求 **`columns` / `headers` / `headersBinding` / `columnsBinding` / `columnsRef`** 之一；示例里使用 **`headers`** 合法。 |
| **`propsRef` 类** | 解析器支持 **`xxxRef`**（从 schema 路径取值）；是否在 Schema `additionalProperties` 里列出依分支而定，以 **`resolveProps` / `resolveAttrsObject`** 为准。 |

---

## 3. 节点通用形状（pageContent / 嵌套 children）

每个 **对象节点** 通常包含：

```json
{
  "component": "VStack",
  "key": "optionalKey",
  "props": {},
  "attrs": {},
  "attrsRef": "path.in.schema.for.attrs",
  "children": []
}
```

| 键 | 说明 |
|----|------|
| **`component`** | Schema 组件名（PascalCase），解析后映射为 **`resolvedComponent`**（如 `jh-vstack`）。 |
| **`key`** | 业务标识；抽屉 / Sheet / 中继弹出层等用于生成 **`is{Key}DrawerShown`**、`ref` 等。**布局组件可无 `key`**。 |
| **`props`** | 组件静态配置；布局 Primitive 有 **默认值**，可省略空对象；**`Table` 等**按 Schema 常 **必填**。支持 **`xxxRef`** 从配置路径解析。 |
| **`attrs` / `attrsRef`** | 写在 **组件根标签** 上的属性：`class`、`v-if`、`@click` 等。 |
| **`children`** | 子节点数组；元素可以是 **同名结构对象** 或 **HTML 字符串**。 |

解析后的节点（供 NJK 遍历）在内存中还会带有：

- **`resolvedComponent`**：Vue 标签名  
- **`resolvedProps`**：序列化到 `:prop="..."` 的静态部分  
- **`resolvedBindings`**：`:prop="变量或表达式"`、`v-model`、`@search` 等  
- **`resolvedAttrs`**：根上额外 attrs  
- **`_meta`**：如 `needsShownState`、`needsItemState`（模板生成 data / 结构用）

---

## 4. `pageContent` 常见 `component`（与 Vue 标签）

以 **`parse_schema.js` 中 `COMPONENT_MAP`** 为准（Schema 枚举可能略窄，以解析器为准）。

| Schema `component` | 典型角色 |
|--------------------|----------|
| `VStack` / `HStack` / `Box` / `Grid` | 布局 primitive |
| `PageHeader` | 标题区 + 搜索等 |
| `Table` / `List` | 表格 / 列表 |
| `MobileOrder` / `MobileFilter` / `MobileAction` / `MobileSearch` | **中继**：正文生成 `jh-mobile-filter-btn`，并在 **`actionContent` 追加** `Sheet` / `FormSheet` / `SearchSheet` |
| `MobileFilterBtn` | 手写 **`jh-mobile-filter-btn`**（非中继）；见下文 **`\*Bind`** |

新建抽屉类组件一般写在 **`actionContent`**，不要塞进 `pageContent`（中继除外）。

---

## 5. `actionContent` 常见 `component`

| Schema `component` | 说明 |
|--------------------|------|
| `CreateDrawer` / `UpdateDrawer` | 新增 / 编辑抽屉 |
| `Drawer` | 通用抽屉（自定义 `children`） |
| `FormDrawer` | 配置式表单抽屉 |
| `Sheet` | 底部 `jh-sheet`（排序 `orderList`、操作 `actionList` 等） |
| `FormSheet` | 底部 `jh-form-sheet` |
| `SearchSheet` | 底部 `jh-mobile-search-sheet`，与 PageHeader 搜索语义对齐 |

通常需要 **`key`** + **`props`**（Schema 对 action 节点多为 required）。

---

## 6. 移动端中继（简要）

配置在 **`pageContent`**：

- **`MobileOrder`** → 追加 **`Sheet`**（`orderList` 等）  
- **`MobileFilter`** → 追加 **`FormSheet`**（筛选表单）  
- **`MobileAction`** → 追加 **`Sheet`**（`actionList` / `cols`）  
- **`MobileSearch`** → 追加 **`SearchSheet`**（`jh-mobile-search-sheet`；**仅** `jh-mobile-search-sheet` 已声明的那套 props，与 **`MobileFilter` / FormSheet** 的 `fieldList` / `tabList` 等 **不同**，勿混用）

触发侧统一为 **`jh-mobile-filter-btn`**；各类型 **`props` 不同**。

**实现细节**：`MobileOrder` / `MobileFilter` / `MobileAction` 在 **`pageContent` 中被替换为触发器的 HTML 片段**（字符串）；弹出层作为 **`actionContent` 节点**追加。`MobileSearch` 同理追加 **`SearchSheet`**，并由 **`enrichSearchSheetNodes`** 等在缺省时补 **`searchFieldList`**（可与同页 **`PageHeader`** 或兜底 **`list.search.fields`** 对齐）。

中继 **`props`** 里常用触发字段：`btnText` / `label`、`btnClass`、`showActive`、`active`（写入触发器的摘要绑定）等；弹出层专用字段见各组件文档或 `v6ConfigHoverProvider.ts` / `v6-page-tree.schema.json`。

---

## 7. `MobileFilterBtn` 与 `*Bind`（推荐约定）

手写 **`component: "MobileFilterBtn"`** 时：

- **`label` / `activeDisplay` / `icon`**：**一律按静态值**参与生成（字符串不会再被当成变量名猜测）。
- 需要绑定 Vue 数据或表达式时，使用：
  - **`labelBind`** → `:label="…"`
  - **`activeDisplayBind`** → `:active-display="…"`
  - **`iconBind`** → `:icon="…"`（静态图标名如 `filter-2` 请放在 **`icon`**，不要用 `iconBind`）

若同时写了 **`xxxBind`** 与 **`xxx`**，以 **`xxxBind` 为准**，并丢弃同名 plain 字段。

**富文本第二行**（多段 `{{ }}`、内联 HTML）：用 **`children`** 写入具名插槽（与 Table 一致），组件映射 **`jh-mobile-filter-btn`** 的 **`#active-display`**。

```js
{
  component: 'MobileFilterBtn',
  props: { label: '组织', showActive: true },
  children: [
    `<template v-slot:active-display>
      {{ currentOrgInfo.orgName }}
      <span class="bg-green-500 text-white rounded px-0.5">{{ typeLabel }}</span>
    </template>`,
  ],
}
```

单行摘要仍推荐 **`activeDisplayBind`**：

```json
{
  "component": "MobileFilterBtn",
  "props": {
    "label": "模式选择",
    "showActive": true,
    "activeDisplayBind": "showModelType"
  }
}
```

> **中继**（`MobileFilter` / `MobileSearch` 等）的 **`children`** 进入弹出层，**不能**用于顶栏按钮插槽；顶栏请用手写 **`MobileFilterBtn`** 节点。

---

## 8. 紧凑型完整树示例（示意）

```json
{
  "pageType": "jh-page",
  "page": { "id": "sampleV6", "name": "V6 样例", "type": "list" },
  "dataSource": { "table": "t_sample", "primaryKey": "id" },
  "pageContent": [
    {
      "component": "VStack",
      "props": { "gap": 8 },
      "children": [
        {
          "component": "PageHeader",
          "props": {
            "title": "列表示例",
            "searchFieldList": [
              { "key": "name", "label": "名称", "type": "text" }
            ]
          }
        },
        {
          "component": "Table",
          "key": "mainTable",
          "props": {
            "headers": [{ "text": "名称", "value": "name" }],
            "serverPagination": true,
            "pageSize": 20
          }
        },
        {
          "component": "MobileFilter",
          "key": "mf",
          "props": {
            "btnText": "筛选",
            "title": "筛选条件",
            "fieldList": []
          }
        }
      ]
    }
  ],
  "actionContent": [
    {
      "component": "CreateDrawer",
      "key": "create",
      "props": {
        "fieldList": [{ "key": "name", "label": "名称", "type": "text" }]
      }
    }
  ]
}
```

上例中 **`MobileFilter`** 会在解析阶段自动追加 **`FormSheet`** 到 **`actionContent`**（若未手写同名冲突）；具体字段以当前解析器与 Schema 为准。

---

## 9. `parseSchema` 产出：`standardConfig` 顶部结构

```js
{
  meta: { version: 'v6', mode: 'compiled' },
  page: { id, name, type, hook, menu, vuetify, template, componentPath },
  dataSource: { table, primaryKey, listResource, createResource, updateResource, deleteResource },
  features: {
    hasMobileSearch,
    hasTable,       // Table 或 List 节点，或 legacy list.table
    hasPageHeader,
    hasSearch,      // 有搜索字段或 MobileSearch
    hasCreate,
    hasUpdate,
    hasPagination, // table props.serverPagination
    autoId,         // 或由 create 表单 autoId 推导；无则为 null
  },
  pageContent:   [ /* 已 resolveNode；中继处可能为 HTML 字符串 */ ],
  actionContent: [ /* 已 resolveNode */ ],
  blocks: {
    header: { title, searchFieldList } | null,
    table:  { columns, rowActionList, headActionList, filterList, selectable, serverPagination, pageSize, primaryKey, orderBy } | null,
    forms:  { create, update }  // 来自节点 props 或 form.create / form.update 兜底
  },
  common: { ... }  // 原样透传 schema.common
}
```

解析完成后会 **`syncKeywordHeadersFromTable`**：若 Table 与 **`jh-page-header` / `jh-mobile-search-sheet`** 同页，可能对 keyword 列配置做对齐（实现见 `parse_schema.js`）。

---

## 10. 延伸阅读

- 中继与 Sheet 生成：`parse_schema.js` 内 `liftMobileRelaysFromPageContent`、`buildLiftedSheetNode`、`enrichSearchSheetNodes`  
- Hover 文案：`vscode-extension/src/v6ConfigHoverProvider.ts`  
- 模板宏：`page-template-json/jh-page/jh-v6-macros.html`  
- **`pageType === 'jh-component'`** 时：`page.componentPath` 参与生成路径（见 `parse_schema.js` / `legacyConfig`）

---

## 11. 仍有意识地未展开的主题（可查代码）

- **`PageHeader` / `SearchSheet`**：部分字符串 props 仍按「变量名绑定」规则从静态 props 剥离（与 **`MobileFilterBtn` 的纯 `*Bind` 策略**不同）。  
- **`FormDrawer` / `FormSheet`**：`options` / `rules` 等字符串在解析器中会标 **`__expr__`** 再交给模板。  
- **`legacyConfig`**：`parseSchema` 双返回值之一，过渡兼容旧 NJK 链路，与 **`standardConfig`** 并行存在。
