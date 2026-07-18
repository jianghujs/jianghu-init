# V7 语义配置 → 组件参数映射表

> 实现位置：`views/compile*View.js` → `expandCrudPage.js` → `builders.js` → `schemaPipeline.parseSchema` → NJK 页面模板。
> 维护原则：**改映射逻辑时同步改本文档与对应文件头注释**。

## 流水线

```text
fields / views / platform / layout / dataSource  (authoring)
  → normalizeSemanticViewKeys (兼容 key → canonical key)
  → validateCrudSemantic / validateActionUiActionSyntax
  → compileListView / compileCreateView / compileUpdateView (语义 key → view IR)
  → expandCrudPage (选组件 + 汇总 IR)
  → builders (组装 pageContent / actionContent 节点)
  → parseSchema (resolvedComponent / resolvedProps / resolvedBindings)
  → jh-page-v7.njk / jh-mobile-page-v7.njk (Vue 页面 data + 模板)
```

---

## 1. platform：选「哪种容器组件」

配置键：`platform.pc`、`platform.mobile`；`platform.desktop` 仅作 PC 端兼容别名。

| platform token | 语义块 | Schema 组件 | Vue 标签 | 默认 layout 副作用 |
|----------------|--------|-------------|----------|-------------------|
| `Table` | views.list | `Table` | `jh-table` | list.layout=table, filter=inline |
| `List` | views.list | `List` | `jh-list` | list.layout=card, filter=sheet |
| `CreateDrawer` | views.create | `CreateDrawer` | `jh-create-drawer` | create.layout=drawer |
| `UpdateDrawer` | views.update | `UpdateDrawer` | `jh-update-drawer` | update.layout=drawer |
| `CreateSheet` | views.create | `FormSheet` | `jh-form-sheet` | create.layout=sheet |
| `UpdateSheet` | views.update | `FormSheet` | `jh-form-sheet` | update.layout=sheet |

实现：`policy.js` → `resolveViewListComponent` / `resolveViewFormComponent`。

---

## 2. fields 字典 → 表单项 / 列 / 搜索项

`fields.{fieldKey}` 不直接生成组件，被 `views.*` 引用后展开。

| fields 键 | 展开函数 | 输出形状 | 用于 |
|-----------|----------|----------|------|
| `label` | fieldKeyToFormField / columnEntryToHeader | `text`（列）/ 表单项 `label` | list / create / update / search |
| `type` | 同上 | `text`/`select`/… | 控件类型 |
| `options` | 同上 | 字符串路径或数组 | select |
| `required` / `readonly` | fieldKeyToFormField | boolean | 表单 |
| `autoId` | fieldKeyToFormField | object | 自动生成 ID |
| `width` | columnEntryToHeader | number | 列宽（可被 columns 覆盖） |
| `align` | columnEntryToHeader | string | 列对齐 `start` / `center` / `end`（可被 columns 覆盖）→ `headers[].align` |
| `class` | columnEntryToHeader | string | 表头 th class（固定列等；可被 columns 覆盖） |
| `cellClass` | columnEntryToHeader | string | 单元格 td class（可被 columns 覆盖） |

---

## 3. views.list → Table / List

节点位置：`pageContent` → `VStack` → `Table`|`List`（`key` 默认 `mainTable`）。
映射入口：`compiler/semantic/views/compileListView.js`。该文件负责解释所有 `views.list` key，并输出 `collection`、搜索及移动顶栏 IR；`builders.js` 不读取原始 `views.list`。

### 3.1 列

| 语义配置 | 处理 | 组件 props |
|----------|------|------------|
| `views.list.columns[]` | PC 及移动 fallback | `headers[]`（Vuetify 列） |
| `views.list.mobileColumns[]` | 仅 mobile，有则替代 columns | 同上；首列 `isTitle`+`isSimpleMode`（List） |
| columns 项 `string` | normalizeColumnEntry | `{ value: key }` |
| columns 项 `{ field, width, class, cellClass, slot }` | normalizeColumnEntry | 合并 fields 字典 label → `text` |

`columnEntryToHeader`：`fields[key].label` → `header.text`，`key` → `header.value`。

### 3.2 列表行为

| 语义配置 | 组件 props | 备注 |
|----------|------------|------|
| `views.list.serverPagination` | `serverPagination` | |
| `views.list.pageSize` | `blocks.table.pageSize` → 页面 `tableOptions.itemsPerPage`（非 jh-table prop） | |
| `views.list.selectable` | `selectable` | |
| `views.list.orderBy` | `blocks.table.orderBy` → `prepareTableParams`（API 请求参数，非 jh-table prop） | |
| `views.list.toolbarActions[]` | PC:`headActionList`；移动:顶栏 `MobileActions`（`jh-mobile-actions`） | 见 builders |
| `views.list.rowActions[]` | `rowActionList` | `uiAction` 1:1 输出；运行时解析 doUiAction |
| `views.list.rowSlot` | `slotTemplates` | 列/行插槽 |
| `slots.list.pc` / `slots.list.mobile` | `collectionChildren` | `Table` / `List` 节点 `children`（`<template v-slot>` HTML 字符串） |
| `slots.create.pc` / `slots.create.mobile` | `createFormChildren` | `CreateDrawer` / `FormSheet` 节点 `children` |
| `slots.update.pc` / `slots.update.mobile` | `updateFormChildren` | `UpdateDrawer` / `FormSheet` 节点 `children` |
| `slots.update.{tabKey}.pc/mobile` | 合并进 `updateFormChildren` | 多 Tab 按 tab 追加 template |

### 3.3 搜索（list 区）

| 语义配置 | 中间结果 | PC 组件 | 移动组件 |
|----------|----------|---------|----------|
| `views.list.search` | `searchFieldList` + `keywordConfig` | `Search`（inline） | `SearchSheet` |
| `views.list.filter`（或 `filters` 别名） | `filterList` | `Table.props.filterList` → `jh-table-filter` | （移动不生成） |
| `search` / `filter` 语法 | 同形：`{ keyword: { fields, placeholder }, fields: [...] }` 或数组 | search→API；filter→`inlineFilterValues` |
| `keyword.fields` | search：`serverSearchWhereOrOptions`；filter：`inlineFilterValues.keyword` + 行内 OR 匹配 `keys[]` |
| `views.list.mobileSearchBtnText` 等 | — | — | `MobileFilterBtn` + `SearchSheet` |
| `views.list.searchSheet` | mergeSheetOverlay | — | SearchSheet: `maxBodyHeight`（默认 70vh）、`persistent` 等 |

筛选布局：`platform.list` token 或 policy → `filter: inline|sheet` → `buildInlineFilter` / `buildSheetFilter`。

### 3.4 `pc` / `mobile` 覆盖与 `blocks`（细粒度顶栏）

| blocks 键 | Mobile (sheet) | PC (inline) |
|-----------|----------------|-------------|
| `pageHeader` | 默认 HStack：`MobileActions` + `VSpacer` + `MobileFilterBtn` | 默认 HStack：`PageTitle` + `Search` |
| `toolbarActions` | `MobileActions` 节点 | `null`（操作用 `Table.headActionList`） |
| `toolbarSpacer` | `VSpacer` 节点（有 toolbarActions 时） | `null` |
| `spacer` | `{ component: 'VSpacer' }`，PC/Mobile 通用 | 同上 |
| `searchBtn` / `filterBtn` | `MobileFilterBtn` 节点 | `null` |
| `searchSheet` | `SearchSheet`（放 `actionContent`） | `null` |
| `pageTitle` / `search` | `null` | `PageTitle` / `Search` 节点 |
| `composeToolbar(children, opts?)` | 辅助：包成默认样式 HStack | 同上 |

示例（搜索左、操作右）：

```js
mobile: (views, blocks) => ({
  pageContent: {
    component: 'VStack',
    children: [
      blocks.composeToolbar([blocks.searchBtn, blocks.toolbarSpacer, blocks.toolbarActions]),
      blocks.list,
    ].filter(Boolean),
  },
  actionContent: [blocks.create, blocks.update, blocks.searchSheet].filter(Boolean),
}),
```

**pageContent 形状（V7）**：`expandCrudPage` / `pc|mobile` 覆写为**单根节点对象**；`parseSchema` 出口 `standardConfig.pageContent` 仍为 **`[root]` 数组**（NJK `for` 循环兼容）。覆写也可写仅 1 项的数组（旧写法等价）。

---

## 4. views.create → CreateDrawer / FormSheet

节点位置：`actionContent`，`key: 'create'`（固定，供绑定变量名）。
映射入口：`compiler/semantic/views/compileCreateView.js`。

| 语义配置 | IR 字段 | 节点 props | Vue 运行时绑定（parseSchema） |
|----------|---------|------------|-------------------------------|
| `platform.*.create` token | `createFormComponent` | `component` 名 | — |
| `views.create.title` | `createTitle` | `title` | — |
| `views.create.fields[]` + `fields` 字典 | `createFields` | `fieldList` | — |
| `views.create.interaction` | 合并进 `createFields[]` | `visibleWhen` 等 `__expr__` | — |
| `views.create.saveTipBeforeClose` | `createSaveTipBeforeClose` | `beforeCloseConfirm` | — |
| `views.create.sheet` | `createSheet` → mergeSheetOverlay | FormSheet: `autoHeight`（默认 true）、`viewportOffset`（102）、`persistent`、`maxBodyHeight` 等 | — |
| `layout.create.cols` | `createCols` | `cols` | — |
| `layout.create.variants.pc/mobile` | span 写入 fieldList 项 | `fieldList[].span` | — |
| `views.create.actions` | `createActions` | PC `CreateDrawer`: `actionList`；移动 `FormSheet`: `headActionList` → `jh-mobile-actions` | — |
| FormSheet 时 | — | `rounded: true` | — |
| — | — | — | `v-model` → `isCreateDrawerShown` |
| — | — | — | `:initialData` → `createItem` |
| — | — | — | `@field-change` → 写回 `createItem` |
| — | — | — | `@action` → `doUiAction` |

---

## 5. views.update → UpdateDrawer / FormSheet

节点位置：`actionContent`，`key: 'update'`。
映射入口：`compiler/semantic/views/compileUpdateView.js`。

| 语义配置 | 中间结构 | 节点 props | 绑定（key=update） |
|----------|----------|------------|-------------------|
| `views.update.title` | `updateTitle` | `title` | — |
| `views.update.tabs[]` | `{ mode:'tabs', tabList }` | `tabList` | 每 tab `fieldList` 来自 fields+interaction |
| `views.update.tabs[].actions` | tab `actions` | PC tab `actionList`；移动 tab `headActionList` | |
| `views.update.actions` | `actions`（fields 模式） | PC `actionList`；移动 `headActionList` | |
| `views.update.fields[]` | `{ mode:'fields', fieldList }` | `fieldList` | |
| `views.update.tabs[].interaction` | 合并到 tab.fieldList | 同上 | |
| `views.update.sheet` | `updateSheet` → mergeSheetOverlay | FormSheet 叠层行为；多 tab 默认 `viewportOffset: 152` | |
| `slots.update.tabs[].interaction` | 合并到 tab.fieldList | 同上 | |
| `slots.create.pc/mobile.children` | `createFormChildren` → 节点 `children` | | |
| `slots.update.pc/mobile.children` | `updateFormChildren` → 节点 `children` | | |
| `slots.update.{tabKey}.pc/mobile.children` | 合并进 `updateFormChildren` | | |
| platform UpdateSheet | `updateFormComponent=FormSheet` | `rounded: true` | `isUpdateDrawerShown` / `updateItem` |

---

## 6. page / dataSource / layout

| 语义 | 用途 | 组件/页面 |
|------|------|-----------|
| `page.id` / `page.name` / `page.title` | 页元信息 | `PageTitle.title`；文档标题 |
| `page.helpDoc` | 帮助 | `PageTitle.helpDoc` |
| `dataSource.*Resource` | 接口 | 页面模板 bake `listResource` 等 → `getTableData` |
| `dataSource.table` / `primaryKey` | 表 | `tableParams`、List `primaryKey` |
| `layout.list.regions` | 多区域 | `HStack` + `Box`/`Table` |
| `layout.list.treeWidth` | 树区域占位宽度 | `Box.props.width`（仅 regions 含 tree 时） |
| `layout.list.cols` | 移动 List 详情 grid 列数 | `List.props.cols`（默认 2） |
| `views.list.serverPagination` | 移动 List 满高滚动 | `jh-list` flex 列 + 底部分页（见 `adaptCrudPageMobile`） |
| `layout.list.variants.mobile` | 详情字段跨列 | `headers[].span`（2=占满一行） |
| `mobileColumns[].span` | 单列跨列 | `headers[].span` | |

---

## 7. dataSource → 页面（非组件 props）

| 语义 | 页面常量 / actionId |
|------|---------------------|
| `listResource` | `getTableData` → `actionId` |
| `createResource` | `createItem` |
| `updateResource` | `updateItem` |
| `deleteResource` | `deleteItem` |

---

## 8. 调试

`buildPage` 后查看：

- `standardConfig.v7Meta`：`collectionComponent`、`createFormComponent`、`filterMode`…
- `standardConfig.pageContent` / `actionContent`：解析后节点树
- `standardConfig.actionContent` 中 `key:'create'` 节点的 `resolvedProps` / `resolvedBindings`
