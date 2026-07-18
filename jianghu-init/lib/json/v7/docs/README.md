# V7 文档索引

本目录为 **`lib/json/v7`** 的完整说明，与编译实现同仓维护。

## 阅读顺序

| 文档 | 适合谁 | 内容 |
|------|--------|------|
| [authoring-guide.md](./authoring-guide.md) | 新写 init-json | 心智模型、CRUD / UI / 子组件三种写法、编译命令 |
| [config-reference.md](./config-reference.md) | 查字段 | 根对象、`fields`、`views`、`platform`、`layout`、`dataSource` 全表 |
| [bind-slots-and-targets.md](./bind-slots-and-targets.md) | 进阶 | `*Bind`、`children` 插槽、`page.targets` vs `includeList[].targets` |
| [semantic-to-component-mapping.md](./semantic-to-component-mapping.md) | 改编译器 | 语义 → Schema 组件 → Vue 标签对照 |
| [examples-guide.md](./examples-guide.md) | 抄示例 | `pages/examples/` 各文件用途与自检 |

## 仓库内其它文档

- **`jianghu-init/docs/v7-config-rules.md`** — 与 [config-reference.md](./config-reference.md) 同源维护（发布/对外时可只保留其一）。
- **`jianghu-init/docs/v6-page-config-overview.md`** — V6 手写组件树、`MobileFilterBtn`、`*Bind`。
- **`jianghu-init/docs/v7-config-rules.md`**（Sheet overlay 等）— 见 config-reference § views.create/update.mobileSheet。

## 示例配置

```text
lib/json/v7/pages/examples/
├── README.md
├── projectManagement.v7.sample.js      # CRUD 入门（交互 + tabs + pc/mobile）
├── fullCrudPage.v7.example.js          # CRUD 能力全集（推荐对照）
├── fullUiPage.v7.example.js            # UI 模式页面树
├── fullComponentCrud.v7.example.js       # 子组件 CRUD
├── fullComponentUi.v7.example.js         # 子组件 UI
├── smoke-platform-layout.js            # 回归自检（非示例，勿改语义）
└── validate-examples.js                # 示例能否 buildPage
```

自检：

```bash
cd jianghu-init
node lib/json/v7/pages/examples/validate-examples.js
node lib/json/v7/pages/examples/smoke-platform-layout.js
```

## API 速查

```js
const v7 = require('./lib/json/v7');
const { standardConfig, legacyConfig, v7Meta } = v7.buildPage(semantic);
// CRUD 双端：semantic.mode === 'crud' 或 page.targets === 'both'
```
