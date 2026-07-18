# V7 Authoring 指南

## 1. 你要写的是什么

一份 **init-json**（`.js` 模块）描述页面或子组件，由 **`jianghu-init`** 编译为 **PC / Mobile HTML + Vue 片段**。

```text
authoring（fields / views / pageContent）
  → normalizeSchema
  → expandCrudPage（仅 mode: crud）
  → platform adapt（pc | mobile）
  → schemaPipeline.parseSchema
  → standardConfig → NJK bake
```

业务配置里 **不出现** `jh-table` 等标签名；编译产物里才有 **`Table` → `jh-table`** 映射。

## 2. 三种写法

| 类型 | 识别条件 | 写什么 |
|------|----------|--------|
| **CRUD 页面** | `mode: 'crud'` + `page.id` | `fields`、`views`、`dataSource`；可选 `layout`、`platform`、`slots`、`pc`/`mobile` |
| **UI 页面** | 无 `mode`，有 `pageContent` | 直接组件树（同 V6 `pageContent`） |
| **子组件** | `pageType: 'jh-component'` + `component.path` | CRUD 或 UI；**禁止** `page.id`、`resourceList` |

### 2.1 CRUD 页面最小骨架

```js
module.exports = {
  version: 'v7',
  mode: 'crud',
  page: { id: 'myPage', name: '我的页面' },
  dataSource: {
    table: 't_x',
    primaryKey: 'id',
    listResource: 'getXList',
    createResource: 'createX',
    updateResource: 'updateX',
    deleteResource: 'deleteX',
  },
  fields: {
    id: { label: 'ID', type: 'text' },
    name: { label: '名称', type: 'text' },
  },
  views: {
    list: {
      columnList: ['id', 'name'],
      headActionList: [{ uiAction: 'create', label: '新增' }],
      rowActionList: [{ uiAction: 'update', label: '编辑' }, { uiAction: 'delete', label: '删除' }],
    },
    create: { fieldList: ['id', 'name'], actionList: [{ label: '保存', uiAction: 'save', color: 'primary' }] },
    update: { fieldList: ['id', 'name'], actionList: [{ label: '保存', uiAction: 'save', color: 'primary' }] },
  },
  common: { data: {}, methods: {}, doUiAction: {} },
};
```

### 2.2 UI 页面最小骨架

```js
module.exports = {
  version: 'v7',
  page: { id: 'myUi', name: '自定义' },
  pageContent: {
    component: 'VStack',
    children: [
      { component: 'PageTitle', props: { title: '标题' } },
    ],
  },
  common: {},
};
```

### 2.3 子组件 CRUD

```js
module.exports = {
  version: 'v7',
  mode: 'crud',
  pageType: 'jh-component',
  component: { path: 'biz/foo/MyTable', name: '子表', targets: 'pc' },
  dataSource: { /* 同页面 */ },
  fields: { /* ... */ },
  views: { /* 通常只有 list + create + update */ },
  common: {
    props: { parentId: { type: String, required: true } },
    methods: {
      prepareTableParams() {
        this.tableParams.where.parentId = this.parentId;
      },
    },
  },
};
```

## 3. 双端编译

| 机制 | 作用 |
|------|------|
| **`mode: 'crud'`** | 未写 **`page.targets`** 时 CLI 默认 **PC + Mobile** 双端 |
| **`page.targets`** | `'pc'` \| `'mobile'` \| `'both'`；**覆盖** CRUD 默认（`targets:'mobile'` 只出 `mobile/*.html`） |
| **`component.targets`** | 子组件同理 |
| **`targetPlatform`** | 单次 `buildPage` 强制 `'pc'` 或 `'mobile'`（调试 / smoke） |

**`platform.pc` / `platform.mobile`** 控制各端用 Table 还是 List、Drawer 还是 FormSheet（见 [config-reference.md](./config-reference.md)）。

## 4. 常用扩展（仍不写组件名）

- **列表树 + 表**：`layout.list.regions: { treePanel: { role: 'tree' }, main: { role: 'table' } }`
- **字段显隐/只读**：`views.create.interaction` / `views.update.tabList[].interaction`
- **表头/行/表单插槽**：`slots.list.pc.children` 等（完整 `<template v-slot:…>` 字符串）
- **移动端搜索条**：`views.list.search` + 默认 mobile `filter: sheet` → SearchSheet
- **顶栏富文本摘要**：手写 **`MobileFilterBtn`** + `children` 里 `v-slot:active-display`（见 [bind-slots-and-targets.md](./bind-slots-and-targets.md)）
- **分端静态资源**：`includeList[].targets`（见同上）

## 5. 降级：完全自定义布局

```js
pc: (views, blocks) => ({
  pageContent: { component: 'VStack', children: [blocks.pageHeader, blocks.list] },
  actionContent: [blocks.create, blocks.update].filter(Boolean),
}),
mobile: (views, blocks) => ({ /* ... */ }),
```

`blocks` 含 `pageHeader`、`list`、`create`、`update`、`searchSheet`、`searchBtn`、`toolbarActions` 等预构建节点。

## 6. 编译与调试

```js
const v7 = require('./lib/json/v7');
const { standardConfig, legacyConfig } = v7.buildPage(require('./pages/examples/fullCrudPage.v7.example'));
console.log(standardConfig.v7Meta);
```

业务仓库：**`jianghu-init json`**。

## 7. 下一步

- 字段全集：[config-reference.md](./config-reference.md)
- 映射表：[semantic-to-component-mapping.md](./semantic-to-component-mapping.md)
- 可复制示例：[examples-guide.md](./examples-guide.md)
