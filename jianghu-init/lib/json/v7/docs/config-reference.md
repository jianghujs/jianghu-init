# V7 配置参考（与 `lib/json/v7` 实现一致）

> 维护：改 `expandCrudPage` / `schemaPipeline` / `policy` 时同步本文。

## 1. 目录与入口

```text
lib/json/v7/
├── index.js                    # buildPage, parseSchema, expandCrudPage, …
├── defaults.js                 # DEFAULT_LAYOUT
├── policy.js                   # platform 策略、端判定
├── builders.js                 # pageContent / actionContent 组装
├── fieldFormProps.js           # fields → fieldList
├── sheetOverlay.js             # FormSheet/SearchSheet 叠层 props
├── compiler/semantic/          # expandCrudPage, resolveIncludeList, …
└── compiler/runtime/schemaPipeline.js
```

| API | 说明 |
|-----|------|
| **`buildPage(semantic)`** | 完整编译；`version` 须为 `'v7'` |
| **`expandCrudPage(semantic)`** | 仅语义 → 合成 schema（含 `_v7`） |
| **`parseSchema(payload)`** | 合成 schema → standardConfig |

## 2. 根对象

| 键 | 类型 | 说明 |
|----|------|------|
| **`version`** | `'v7'` | 必填（可省略，normalize 会补） |
| **`mode`** | `'crud'` | CRUD 语义展开；省略则为 **UI 模式**（`pageContent` 直连） |
| **`pageType`** | string | `jh-page` / `jh-mobile-page` / `jh-component`；省略则按端推断 |
| **`targetPlatform`** | `'pc' \| 'mobile'` | 单次编译强制端；优先于 pageType 推断 |
| **`page`** | object | `id`、`name`、`menu`、`hook`、`vuetify`、`targets`、`template`、`helpDoc` |
| **`component`** | object | 子组件：`path`、`name`、`targets`；`props` 为兼容别名，合并进 `common.props` |
| **`fields`** | object | 字段字典（CRUD） |
| **`views`** | object | `list` / `create` / `update`（CRUD） |
| **`platform`** | object | **`platform.pc`**、**`platform.mobile`**（见 §6） |
| **`layout`** | object | `list` / `create` / `update` 布局（见 §7） |
| **`slots`** | object | 插槽 HTML 字符串（见 §9） |
| **`pc` / `mobile`** | function | `(views, blocks) => { pageContent, actionContent }` 覆写 |
| **`dataSource`** | object | 表、主键、resource（§10） |
| **`common`** | object | Vue：`data`、`computed`、`methods`、`props`、`doUiAction` |
| **`includeList`** | array | 静态资源；项上 **`target`** 分端（§11） |
| **`resourceList`** | array | 权限资源（页面级） |
| **`pageContent` / `actionContent`** | tree | UI 模式或降级覆写结果 |

### `page.targets` / `component.targets`

| 值 | CLI 行为 |
|----|----------|
| **`pc`**（UI 默认） | `app/view/page/{pageId}.html`（`jh-page-v7`） |
| **`mobile`** | 仅 `app/view/page/mobile/{pageId}.html`（`jh-mobile-page-v7`），**不写**根路径 PC 文件 |
| **`both`** | 根路径 PC + `mobile/` 子目录各一份 |
| **`mode: 'crud'`** 且未写 **`page.targets`** | 等价 **`both`** |

**优先级**：显式 **`page.targets`** > **`mode:'crud'`** 默认双端。

与 **`includeList[].target`** 不同：后者只过滤**单次编译**里的资源项（见 [bind-slots-and-targets.md](./bind-slots-and-targets.md)）。

## 3. `fields` 字典

| 属性 | 说明 |
|------|------|
| **`label`** | 展示名 |
| **`type`** | `text`、`select`、`textarea`、`number`… |
| **`options`** | select 选项；常为 `'constantObj.xxx'` 表达式 |
| **`required` / `readonly`** | 表单 |
| **`op`** | 搜索操作符 `like`、`eq`… |
| **`width` / `class` / `cellClass`** | 列宽 / 固定列 class |
| **`attrs`** | 透传 Vuetify（双端默认） |
| **`pc` / `mobile`** | attrs 分端覆写（merge 进 attrs） |
| **`placeholder` / `hint` / `quickAttrs`** | 表单项 |

## 4. `views.list`

| 字段 | 说明 |
|------|------|
| **`columns`** | **必填**（有 list 时）；`string[]` 或 `{ field, width, class, cellClass, slot }[]` |
| **`mobileColumns`** | 移动 List 列；首列可作标题 |
| **`search`** | `string[]` 或 `{ keyword: { fields, placeholder }, fields: [] }` → PageHeader / SearchSheet |
| **`filter`** | 对象 → 客户端 `filterList`；字符串 `'inline'|'sheet'` → 仅布局 |
| **`filters`** | 声明型筛选项数组 |
| **`toolbarActions`** | `[{ intent, label, visibleWhen?, disabledWhen? }]` 或协议字符串 |
| **`rowActions`** | 行操作；`intent`: `update` / `delete` 等 |
| **`orderBy` / `serverPagination` / `pageSize` / `selectable`** | 列表行为 |
| **`layout.type` / `filter`** | 参与 platform 解析（优先级见 §6） |
| **`mobileSearchKey` / `mobileSearchBtnText` / `mobileSearchTitle` / `mobileSearchIcon`** | SearchSheet + 触发按钮 |
| **`searchSheet`** | SearchSheet overlay：`persistent`、`autoHeight`、`viewportOffset`… |

## 5. `views.create` / `views.update`

| 字段 | 说明 |
|------|------|
| **`fields`** | 非空才生成 create/update 表单 |
| **`title`** | 抽屉/Sheet 标题 |
| **`type`** | `'form'`（tabs 内） |
| **`tabs`** | `[{ key, title, fields, interaction, actions }]` |
| **`interaction`** | `{ fieldKey: { visibleWhen, readonlyWhen, disabledWhen } }` |
| **`actions`** | `[{ label, intent, color, visibleWhen?, disabledWhen? }]` |
| **`saveTipBeforeClose`** | create 脏检查 |
| **`fieldAttrs`** | 按 key 覆写 `fieldList[].attrs` |
| **`sheet`** | **仅 FormSheet**：`persistent`、`autoHeight`、`viewportOffset`、`maxBodyHeight`… |

抽屉 **`key`** 固定：`create`、`update`。

## 6. `platform`

配置键：**`platform.pc`**、**`platform.mobile`**（`policy.js` 读取；勿写 `desktop`）。

| token | 语义 | Schema 组件 |
|-------|------|-------------|
| `Table` / `List` | list | Table / List |
| `CreateDrawer` / `UpdateDrawer` | create / update | 同名 |
| `CreateSheet` / `UpdateSheet` | create / update | FormSheet |

**默认策略**（可被 `platform.*` 或 `views.list` 覆盖）：

| 端 | list.layout | list.filter |
|----|-------------|-------------|
| pc | table | inline |
| mobile | card | sheet |

解析顺序：**`platform.[pc|mobile].list.*` 显式** → **`views.list`** → **默认表**。

## 7. `layout`

| 键 | 默认 | 说明 |
|----|------|------|
| **`layout.list.cols`** | 2 | 移动 List 详情 grid 列数 |
| **`layout.list.treeWidth`** | 280px | `role: tree` 的 Box 宽度 |
| **`layout.list.regions`** | 单 collection | `{ id: { role: 'tree'|'table'|'collection'|'list' } }` |
| **`layout.list.variants.mobile`** | {} | 字段 `{ span: 2 }` 满行 |
| **`layout.create.cols` / `update.cols`** | 3 | 表单栅格 |
| **`layout.*.variants.pc/mobile`** | span 默认 pc=1，mobile=cols | `applyVariants` |

多 region → **HStack**；单 collection → 直接挂 Table/List。

## 8. `slots`

```js
slots: {
  list: {
    pc: { children: ['<template v-slot:body="{ item }">…</template>'] },
    mobile: { children: [] },
    columns: { projectName: 'custom' },  // 列 slot 名占位（与 children 配合）
  },
  create: { pc: { children: ['<template v-slot:field-x="{ field }">…</template>'] } },
  update: {
    basicInfo: { pc: { children: [] } },  // tab key
    pc: { children: [] },
  },
},
```

- 列表：**`slots.list.[pc|mobile].children`**
- 表单：**`slots.create|update.[pc|mobile].children`**
- 每项为完整 **`<template v-slot:…>…</template>`** 字符串

## 9. 手写组件树（UI / 降级）

Schema **`component`** 枚举见 `semantic-mapping.js`。常用：

| Schema | Vue |
|--------|-----|
| `VStack` / `HStack` | `jh-v-stack` / `jh-h-stack` |
| `Table` / `List` | `jh-table` / `jh-list` |
| `CreateDrawer` / `UpdateDrawer` | `jh-create-drawer` / `jh-update-drawer` |
| `FormSheet` / `SearchSheet` | `jh-form-sheet` / `jh-mobile-search-sheet` |
| `MobileFilterBtn` | `jh-mobile-filter-btn` |

**`MobileFilterBtn`**：

- **`labelBind` / `activeDisplayBind` / `iconBind`** → `:prop="表达式"`
- **`children`** → **`v-slot:active-display`** 富文本第二行
- 中继（`MobileFilter` 等）的 **`children`** 进 Sheet，**不**进顶栏按钮

**`*Bind` 与 plain**：同时存在时 **`*Bind` 优先**；plain `label` / `activeDisplay` / `icon` 一律静态。

## 10. `dataSource`

扁平推荐：

```js
dataSource: {
  table: 'project',
  primaryKey: 'projectId',
  listResource: 'getProjectList',
  createResource: 'createProject',
  updateResource: 'updateProject',
  deleteResource: 'deleteProject',
}
```

嵌套（`normalizeDataSource` 会扁平化）：

```js
resource: { list: 'getX', create: 'createX', update: 'updateX', delete: 'deleteX' }
```

## 11. `includeList`

```js
includeList: [
  { type: 'css', path: '/page/foo.css' },
  { type: 'html', path: 'fragment/bar.html', target: 'pc' },
  { type: 'js', path: '/page/foo.js', target: ['pc', 'mobile'] },
]
```

| `type` | 说明 |
|--------|------|
| css / js / html / include / vueUse / vueComponent | 见 hover |

编译后 **剔除 `target` 字段**；省略 `target` → 当前端编译若跑双端则两端都包含该项。

## 12. `standardConfig.v7Meta`

| 字段 | 含义 |
|------|------|
| **`target`** | 本次 `pc` \| `mobile` |
| **`mode`** | `crud` \| `ui` |
| **`policy`** | 合并后的 platform 策略 |
| **`listLayout` / `filterMode`** | 解析后的 list 布局 |
| **`collectionComponent`** | Table \| List |
| **`componentTokens`** | create/update/list 选用的 token |
| **`regionsPlan`** | layout regions 展开数组 |

## 13. 尚未深度映射

- **`policy.update.layout`**：`fullscreen` / `accordion` 仅占位
- **独立 semantic IR 文件**：当前一步 `expandCrudPage`

## 14. 示例

见 [examples-guide.md](./examples-guide.md)。
