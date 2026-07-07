# *Bind、插槽与分端字段

## 1. `*Bind` 协议（组件 props，通用）

**任意** `pageContent` / `actionContent` 节点的 **`props`** 均支持：

| 配置键 | 生成 | plain 键 |
|--------|------|----------|
| **`<prop>Bind`** | `:<kebab-prop>="expr"` | `<prop>` 静态 |

示例：`titleBind` → `:title`；`activeDisplayBind` → `:active-display`；`minCardHeightBind` → `:min-card-height`。

规则：

- 值是 **一整段 Vue 表达式**，不是模板字符串（不要写 `{{ }}`）。
- 同时写 `*Bind` 与 plain 时，**丢弃 plain**。
- **不**适用于：`**Binding`（如 `headersBinding`）、`REACTIVE_BINDINGS_MAP`（如 FormSheet `:shown.sync`）、PageHeader/SearchSheet 的 plain 变量名 props（`keyword: 'keyword'`）。

```js
props: {
  titleBind: "bindGroupItem.duoxingRoomId ? '已绑定' : '尚未绑定'",
  label: '组织',
  activeDisplayBind: 'currentOrgInfo.orgName',
}
```

## 2. `active-display` 插槽（富文本第二行）

组件：**`jh-mobile-filter-btn`**（Schema：`MobileFilterBtn`）。

```js
{
  component: 'MobileFilterBtn',
  props: { label: '组织', showActive: true },
  children: [
    `<template v-slot:active-display>
      {{ currentOrgInfo.orgName }}
      <span class="bg-green-500 text-white rounded px-0.5">
        {{ constant.showOrgMemberSimpleType.find(e => e.value == showOrgMemberType)?.text || showOrgMemberType }}
      </span>
    </template>`,
  ],
  attrs: { '@click': 'isOrgFilterShown = true' },
}
```

- 与 **Table/List** 相同：`children` 为 **`string[]`**，每项是完整 `<template v-slot:…>`。
- 有插槽时可 **不写** `activeDisplayBind`。
- **`showActive: true`** 且（插槽 **或** `activeDisplay` 有值）才显示双行块。

## 3. CRUD 插槽（`slots`）

| 路径 | 挂载到 |
|------|--------|
| **`slots.list.pc.children`** | PC Table |
| **`slots.list.mobile.children`** | Mobile List |
| **`slots.create.pc.children`** | CreateDrawer / FormSheet |
| **`slots.update.pc.children`** | UpdateDrawer / FormSheet |
| **`slots.update.{tabKey}.pc.children`** | 多 Tab 按 tab 追加 |

## 4. `page.targets` vs `includeList[].target`

| 字段 | 层级 | 含义 |
|------|------|------|
| **`page.targets`** | 整份配置 | 编译产出几端：`pc` / `mobile` / `both` |
| **`includeList[].target`** | 单条资源 | 在某次 `buildPage('pc'|'mobile')` 中是否包含该项 |

```js
page: { id: 'x', targets: 'both' },
includeList: [
  { type: 'html', path: 'all.html' },
  { type: 'html', path: 'pc.html', target: 'pc' },
  { type: 'html', path: 'm.html', target: 'mobile' },
],
```

**不要**把 include 的 `target` 改成 `targets`（除非未来做别名）；页面级用复数 **`targets`**，条目级用单数 **`target`** 是刻意区分。

## 5. 字段 attrs 分端

```js
fields: {
  remark: {
    label: '备注',
    type: 'textarea',
    attrs: { rows: 3 },
    pc: { rows: 6 },
    mobile: { rows: 4 },
  },
},
```

编译时 merge：`pc` 覆盖用于 PC 编译，`mobile` 用于 mobile 编译。

## 6. Mobile `views.list.search.keyword`（与 PC 对齐）

配置：

```js
search: {
  keyword: { fields: ['projectName', 'projectId'], placeholder: '搜索' },
  fields: ['status'],
},
```

- **PC**：`jh-search` 用 `props.keyword.fields` 固定 OR 列。
- **Mobile**：`SearchSheet` 用 **`keywordMeta.fields`**（编译器从同一 `keywordConfig` 注入），**不再**用表头 chip 自选列。
- 页面初值：`standardConfig.features.keywordFieldList` bake 进 `jh-mobile-page-v7` 的 `data.keywordFieldList`。

## 7. `interaction` 条件

```js
interaction: {
  status: {
    visibleWhen: 'isOutsource',
    readonlyWhen: { or: ['isFinished', { field: 'type', op: 'eq', value: 'A' }] },
    disabledWhen: "status === '已归档'",
  },
},
```

写入 **`fieldList[]`** 的 `visibleWhen` / `readonlyWhen` / `disabledWhen`（表达式包装为 `__expr__` 供 NJK 输出）。

按钮 **`actions[]` / `toolbarActions[]` / `rowActions[]`** 均支持 **`visibleWhen` / `disabledWhen` / `loadingWhen`**。

- **`loadingWhen`** 为 true 时按钮显示 loading（`v-btn` 转圈 / 行文字按钮 spinner），并阻止重复点击
- 表单 / 工具栏：上下文为 page `$data` + `initialData`
- **行操作**：上下文额外包含 **`item`**（当前行），例如 `visibleWhen: 'item.id !== -1'`

**标准 uiAction**（编译期 **1:1 输出**（`intent` → `uiAction`），不拆 `id`；运行时 `resolveDoUiActionId` → `doUiAction(...)`）：

| 位置 | 常用 uiAction |
|------|---------------|
| `toolbarActions` | `create` / `delete` / `batchDelete` / 自定义 doUiAction 名 |
| `rowActions` | `update` / `delete` / `detail` / 自定义 doUiAction 名 |
| `create.actions` | `createItem` / `save` / `cancel` / 自定义 doUiAction 名 |
| `update.actions` | `updateItem` / `save` / `cancel` / 自定义 doUiAction 名 |

自定义：uiAction 直接写 camelCase doUiAction 方法名。旧 **`intent`** 键仍可读（生成时转为 `uiAction`）；**语法校验**（`validate-examples`）强制 **`uiAction`**。
