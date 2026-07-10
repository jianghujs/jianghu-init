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

## 端与 platform

- `targetPlatform: 'pc' | 'mobile'` 优先于 `pageType` 推断
- 配置键：优先写 `platform.pc` / `platform.mobile`；`platform.desktop` 仅兼容旧配置
- 默认：pc → `Table` + inline `Search`；mobile → `List` + `SearchSheet`

## actions

- 所有业务 action 必须是对象，且必填 `label` + `uiAction`
- 适用位置：`views.list.toolbarActions` / `rowActions`、`views.create.actions`、`views.update.actions`、`views.update.tabs[].actions`
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
- 兼容嵌套：`resource: { list, create, update, delete }` 或 `actions: { list, create, update, delete }`

## 列表滚动（mobile）

- `views.list.serverPagination: true` → `jh-list` 列表区 `overflow-y: auto`
- 组件高度：宿主设高 + mobile 覆写保留 `blocks.list`

## Sheet 叠层行为（仅 Sheet，不含 Drawer）

- `views.create.sheet` / `views.update.sheet`：mobile FormSheet 默认 `autoHeight: true` + 满高（单 tab `viewportOffset: 102`，多 tab `152`）
- `views.list.searchSheet`：SearchSheet 默认 `maxBodyHeight: 70vh`
- 共用子键：`persistent`、`maxBodyHeight`、`bodyHeight`、`minCardHeight`（默认 100px）
- 自定义 Sheet：`actionContent` 手写 `Sheet` 节点，使用同一套 props
