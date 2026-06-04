# V7 示例配置说明

示例文件位于 **`lib/json/v7/pages/examples/`**，均为可 `require` 的 CommonJS 模块，导出 **`module.exports = { version: 'v7', ... }`**。

## 页面示例（`jh-page` / `jh-mobile-page`）

| 文件 | mode | 说明 |
|------|------|------|
| **projectManagement.v7.sample.js** | `crud` | 入门：fields/views、interaction、update tabs、slots 占位、`pc`/`mobile` 覆写 |
| **fullCrudPage.v7.example.js** | `crud` | **全集**：双端 targets、includeList 分端、layout.regions、platform/layout 覆盖、sheet overlay、插槽模板、MobileFilterBtn `active-display` |
| **fullUiPage.v7.example.js** | UI（无 mode） | **手写 `pageContent` 树**：VStack/HStack、PageHeader、Table、Drawer、MobileFilterBtn 插槽 |

## 子组件示例（`jh-component`）

| 文件 | mode | 说明 |
|------|------|------|
| **taskSubTable.v7.component.crud.sample.js** | `crud` | 最小 CRUD 子表 + `common.props.projectId` |
| **projectSummaryCard.v7.component.ui.sample.js** | UI | 最小 UI 卡片 |
| **fullComponentCrud.v7.example.js** | `crud` | 子表 CRUD：interaction、create/update、layout、methods 挂钩 |
| **fullComponentUi.v7.example.js** | UI | 子组件：props、pageContent、includeList |

## 自检脚本

| 文件 | 命令 | 作用 |
|------|------|------|
| **validate-examples.js** | `node lib/json/v7/pages/examples/validate-examples.js` | 对每个 `*.example.js` / `*.sample.js` 跑 `buildPage`（pc + 必要时 mobile） |
| **smoke-platform-layout.js** | 同上路径 | 平台/layout/slots 回归断言（改编译器后必跑） |

## 在业务 App 中使用

1. 复制 **`fullCrudPage.v7.example.js`** 到 **`app/view/init-json/page/xxx.js`**（或子目录）。
2. 改 **`page.id`**、**`dataSource`**、**`fields`**、**`views`**。
3. 执行 **`jianghu-init json`**（或项目约定的编译命令）。
4. 勿长期手改生成 HTML；改 init-json 后重新编译。

## 与 V6 手写树的关系

- **V7 CRUD**：业务只写语义层，不出现 `Table`/`CreateDrawer` 等（编译产物才有）。
- **V7 UI**：与 V6 类似，直接写 **`pageContent` / `actionContent`** 组件树。
- 降级：CRUD 可用 **`pc(views, blocks)` / `mobile(views, blocks)`** 完全替换 `pageContent`（见 fullCrudPage 注释段）。
