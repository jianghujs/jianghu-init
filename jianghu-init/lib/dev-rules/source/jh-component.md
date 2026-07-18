---
id: jh-component
title: jh-component
---

# jh-component

## 版本区分（先看 `version`）

| | **V7**（`version: 'v7'` + 通常 `mode: 'crud'`） | **V6 及更早**（v6/v4/v2 等） |
|---|---|---|
| 标识 | `component.path`（+ `component.name`） | 常见 `pageId` + `componentPath` |
| `page.id` / `pageId` | **不要**写（权限不挂组件） | **可以**写（旧惯例） |
| `resourceList` | **不要**写（权限归宿主 Page） | **可以**写（组件自注册 resource） |
| Vue props | **`common.props`**（`component.props` 为兼容别名） | 常见 `props: {}` 或写在 `common` |

改 V7 组件时按上表左列；维护旧项目 init-json 时不要强行去掉 `resourceList` / `pageId`。

## V7 必填（`version: 'v7'`）

- `pageType: 'jh-component'` + `component.path`
- **禁止** `page.id`、`resourceList`（编译器会报错）
- Vue props → **`common.props`**；`component.props` 仅兼容旧写法
- CRUD 组件同样显式 `mode: 'crud'`；UI 组件省略 `mode` 并写单根 `pageContent`

## V7 pageId 运行时

- 不 bake 进组件 HTML；嵌套在 Page 内时 `inject jhPage`
- **统一写法**：业务 / axios 使用 `this.pageId`（模板提供的 computed）
- `resolvePageId()` 仍保留为别名（`return this.pageId`），旧代码可渐进替换
- 禁止在业务里写裸模块常量 `pageId`、禁止硬编码字符串、禁止 `window.pageId`

## 布局与高度

- 编译后组件根节点带 `flex flex-col min-h-0 h-full`（由 jianghu-init 模板生成）
- 宿主：`<my-comp class="h-[400px]" />` 或外层 `flex flex-col min-h-0` 容器
- 列表区内滚动：`views.list.serverPagination: true`
- mobile 覆写须 **保留 `blocks.list`**，否则无 `getTableData` 等默认方法

## 列表 UI 自定义

| 做法 | hasTable / 默认方法 |
|------|---------------------|
| `slots.list.mobile.children` + `blocks.list` | ✅ |
| mobile 里 `{ ...blocks.list, children: [...] }` | ✅ |
| pageContent 完全去掉 List/Table | ❌ 需自写 table 运行时 |

## mobile 覆写示例

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
