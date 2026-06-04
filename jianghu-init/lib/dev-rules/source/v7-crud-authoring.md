---
id: v7-crud-authoring
title: V7 CRUD Authoring
---

# V7 CRUD Authoring

## mode

| mode | 写法 |
|------|------|
| 省略 / UI | `pageContent` 直连；禁止 `fields` / `views` / `pc()` / `mobile()` |
| `"crud"` | 必填 `fields` + `dataSource`；`views.list` **可选** |

## 端与 platform

- `targetPlatform: 'pc' | 'mobile'` 优先于 `pageType` 推断
- 配置键：`platform.pc` / `platform.mobile`（`platform.desktop` 同义 pc）
- 默认：pc → `Table` + inline `Search`；mobile → `List` + `SearchSheet`

## pc / mobile 覆写

- 覆写 **`pageContent` 单根对象** + `actionContent`
- 列表插槽：`slots.list.pc.children` / `slots.list.mobile.children`（完整 `<template v-slot:…>` 字符串）
- **不要**写 `pc.children` / `mobile.children`（expandCrudPage 会报错）

## hasTable

- 只看最终 `pageContent` 里是否有带列配置的 `List` / `Table`
- 自定义 list item：用 `slots` 或 `{ ...blocks.list, children }`；**保留 list 节点**

## dataSource

- 扁平：`listResource` / `createResource` / `updateResource` / `deleteResource`
- 或嵌套：`resource: { list, create, update, delete }`

## 列表滚动（mobile）

- `views.list.serverPagination: true` → `jh-list` 列表区 `overflow-y: auto`
- 组件高度：宿主设高 + mobile 覆写保留 `blocks.list`

## Sheet 叠层行为（仅 Sheet，不含 Drawer）

- `views.create.sheet` / `views.update.sheet`：mobile FormSheet 默认 `autoHeight: true` + 满高（单 tab `viewportOffset: 102`，多 tab `152`）
- `views.list.searchSheet`：SearchSheet 默认 `maxBodyHeight: 70vh`
- 共用子键：`persistent`、`maxBodyHeight`、`bodyHeight`、`minCardHeight`（默认 100px）
- 自定义 Sheet：`actionContent` 手写 `Sheet` 节点，使用同一套 props
