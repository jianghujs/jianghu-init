---
id: v7-crud-authoring
title: V7 CRUD Authoring
---

# V7 CRUD Authoring

## mode

| mode | 写法 |
|------|------|
| 省略 / UI | 必填单根 `pageContent`，纯弹层可写 `{}` + `actionContent`；禁止 `fields` / `views` / `dataSource` / `pc()` / `mobile()` |
| `"crud"` | 必填 `fields` + `dataSource.table` 或 `dataSource.model`；禁止顶层 `pageContent`；`views.list` 可省略 |

## 新建标准 CRUD

- 优先运行 `jianghu-init json --generateType=json --pageType=jh-page --table=<table> --pageId=<pageId>`，再检查和局部调整生成配置
- 生成器负责表字段、主键、审计字段过滤、标准 Resource、双端 views 和 action 骨架；不要让 AI 重复手写这些标准部分
- 普通 CRUD 使用本文件即可；只有 tabs、slots、layout、platform 或 PC/mobile 结构覆写时，再读取 `v7-crud-full-structure.md`
- 新生成配置只写 canonical key；旧 key 仅用于读取历史文件并输出 Warning

## 端与 platform

- `targetPlatform: 'pc' | 'mobile'` 优先于 `pageType` 推断
- 配置键：优先写 `platform.pc` / `platform.mobile`；`platform.desktop` 仅兼容旧配置
- 默认：pc → `Table` + inline `Search`；mobile → `List` + `SearchSheet`

## actions

- 所有业务 action 必须是对象，且必填 `label` + `uiAction`
- 适用位置：`views.list.headActionList` / `rowActionList`、`views.create.actionList`、`views.update.actionList`、`views.update.tabList[].actionList`
- `uiAction` 写标准 token（如 `create` / `update` / `delete`）或自定义 `doUiAction` 方法名；不要用 `intent` / `id` / `actionId`
- 结构项例外：`{ type: 'spacer' | 'slot' | 'filter' }` 不需要 `label` / `uiAction`

## pc / mobile 覆写

- 仅 `mode: 'crud'` 可用；返回 `{ pageContent?, actionContent? }`
- 列表插槽：`slots.list.pc.children` / `slots.list.mobile.children`（完整 `<template v-slot:…>` 字符串）
- **不要**写 `pc.children` / `mobile.children`（expandCrudPage 会报错）

## hasTable

- 只看最终 `pageContent` 里是否有带列配置的 `List` / `Table`
- 自定义 list item：用 `slots` 或 `{ ...blocks.list, children }`；**保留 list 节点**

## dataSource

- 必填 `table` 或 `model`；常用 `primaryKey`
- 扁平：`listResource` / `createResource` / `updateResource` / `deleteResource`
- 新配置、生成器和正式示例只允许使用上述扁平 `*Resource`
- `resource: { list, create, update, delete }`、`actions: { list, create, update, delete }` 和 `*ActionId` 仅用于读取历史配置，禁止在新代码中产生

## 列表滚动（mobile）

- `views.list.serverPagination: true` → `jh-list` 列表区 `overflow-y: auto`
- 组件高度：宿主设高 + mobile 覆写保留 `blocks.list`

## mobileItemAction（mobile List 专用）

控制移动端 `jh-list` item **整行点击**（PC Table 忽略）。

| 值 | 行为 |
|---|---|
| **省略** 或 **`'sheet'`** | **组件内置预设**：弹出 ActionSheet 展示 `rowActionList`（**不是** doUiAction case） |
| **`false`** / **`'none'`** | 整行点击不响应；`action` slot / 右侧操作区仍可用 |
| **其他字符串** | **`doUiAction` 方法名**，如 `'viewDetail'` → `doUiAction('viewDetail', item)`，跳过 ActionSheet |

```js
views: {
  list: {
    rowActionList: [{ uiAction: 'update', label: '编辑' }, { uiAction: 'delete', label: '删除' }],
    // 默认省略即可，等价 sheet 预设
    mobileItemAction: false,
    // mobileItemAction: 'viewDetail',
  },
},
```

## Sheet 叠层行为（仅 Sheet，不含 Drawer）

- `views.create.mobileSheet` / `views.update.mobileSheet`：mobile FormSheet 默认 `maxBodyHeight: calc(...)` + `bodyHeightMode: 'fill'`（与 `jh-sheet` / `jh-form-sheet` 组件默认一致，可省略）
- `views.list.search.mobileSheet`：SearchSheet 默认 `maxBodyHeight: 70vh` + `bodyHeightMode: 'content'`（**必须保持 content 默认**；仅需撑满时显式写 `fill`）
- 共用子键：`persistent`、`maxBodyHeight`、`bodyHeightMode`（FormSheet/Sheet 仅需内容撑开时显式写 `content`；SearchSheet 默认已是 `content`，可省略）
- 自定义 Sheet：`actionContent` 手写 `Sheet` 节点，使用同一套 props
