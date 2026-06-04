# V7 Compiler

**路径**：`jianghu-init/lib/json/v7/`（与 `lib/json/v6` 同级）。

## 文档（本目录）

| 文档 | 说明 |
|------|------|
| **[docs/README.md](./docs/README.md)** | 文档索引与阅读顺序 |
| **[docs/authoring-guide.md](./docs/authoring-guide.md)** | 入门：CRUD / UI / 子组件 |
| **[docs/config-reference.md](./docs/config-reference.md)** | 字段全集（与实现同步） |
| **[docs/bind-slots-and-targets.md](./docs/bind-slots-and-targets.md)** | `*Bind`、插槽、`targets` / `target` |
| **[docs/examples-guide.md](./docs/examples-guide.md)** | 示例文件说明 |
| **[docs/semantic-to-component-mapping.md](./docs/semantic-to-component-mapping.md)** | 语义 → 组件映射 |

仓库根 **`docs/v7-config-rules.md`** 可与 `docs/config-reference.md` 对照维护。

## 示例配置

```text
pages/examples/
├── README.md
├── fullCrudPage.v7.example.js       # Page CRUD 全集（推荐复制）
├── fullUiPage.v7.example.js         # Page UI 手写树
├── fullComponentCrud.v7.example.js  # 子组件 CRUD 全集
├── fullComponentUi.v7.example.js    # 子组件 UI
├── projectManagement.v7.sample.js   # CRUD 入门
├── taskSubTable / projectSummaryCard …
├── validate-examples.js             # node 校验 buildPage
└── smoke-platform-layout.js         # 平台回归
```

```bash
cd jianghu-init
node lib/json/v7/pages/examples/validate-examples.js
node lib/json/v7/pages/examples/smoke-platform-layout.js
```

## 流程

```text
semantic（fields / views / layout / platform）
    → normalizeSchema → expandCrudPage
    → platform adapt（pc | mobile）
    → schemaPipeline.parseSchema
    → standardConfig（NJK）
```

业务 authoring **不出现** `Table`/`Drawer` 等；编译产物才有 `jh-*`。

## API

```js
const v7 = require('./lib/json/v7');
const { standardConfig, legacyConfig } = v7.buildPage(
  require('./lib/json/v7/pages/examples/fullCrudPage.v7.example'),
);
```

| mode | 写法 |
|------|------|
| **CRUD** | `mode: 'crud'` + `fields` + `views` |
| **UI** | `pageContent` 组件树 |
| **子组件** | `pageType: 'jh-component'` + `component.path` |

## 默认值

见 **`defaults.js`**、`policy.js`：`layout.list.cols=2`、`platform.pc`→Table、`platform.mobile`→List 等。细节见 **config-reference.md**。

## `includeList` 分端

- 项上 **`target: 'pc' | 'mobile' | ['pc','mobile']`**
- 页面级双端用 **`page.targets: 'both'`**（与 `includeList[].target` 不同，见 bind-slots-and-targets.md）
