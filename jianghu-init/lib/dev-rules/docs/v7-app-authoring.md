# V7 页面配置指南（江湖 App）

本文档面向 **业务 App 项目**（如 `JS.205.jianghujs-basic`），只描述项目内可见的路径与写法。  
编译实现位于全局 `jianghu-init`，不在 App 仓库内。

---

## 1. 项目内路径

| 用途 | 路径 |
|------|------|
| 页面 init-json | `app/view/init-json/page/*.js` |
| 组件 init-json | `app/view/init-json/component/**/*.js` |
| 编译生成 HTML | `app/view/page/*.html`、`app/view/component/**/*.html` |
| 页面文档 | `app/view/pageDoc/*.md` |
| AI 规范 | `AGENTS.md`、`.cursor/rules/`、`.kiro/steering/`、`.claude/rules/` |

**工作流**：编辑 `app/view/init-json/**/*.js` → 运行 `jianghu-init json` → 生成/更新 `app/view/**/*.html`

不要长期手改 `.html` 生成物；改 init-json 后重新编译。

---

## 2. 版本与 pageType

| 字段 | 说明 |
|------|------|
| `version: 'v7'` | V7 语义配置（推荐新项目） |
| `version: 'v6'` / `'v2'` 等 | 旧版 pageContent 直连，见项目既有样例 |
| `pageType` | `jh-page` / `jh-mobile-page` / `jh-component` |

V7 CRUD 须显式 `mode: 'crud'`（或由生成器写入）。

---

## 3. V7 CRUD 根字段

| 键 | 必填 | 说明 |
|----|------|------|
| `version` | 推荐 `'v7'` | |
| `mode` | CRUD 时 `'crud'` | UI 模式省略，用 `pageContent` |
| `pageType` | 推荐 | 决定 NJK 模板族 |
| `targetPlatform` | 否 | `'pc'` \| `'mobile'`，优先于 pageType 推断 |
| `page` | page 时 | `id`、`name`、`menu` 等 |
| `component` | component 时 | V7：`path`、`name`；旧版常见 `componentPath` + `pageId` |
| `fields` | CRUD | 字段字典 |
| `dataSource` | CRUD | `table` 或 `model`、主键、list/create/update/delete Resource |
| `views` | 否 | `list` 可选；`create` / `update` 按需 |
| `platform` | 否 | `pc` / `mobile` 组件 token |
| `layout` | 否 | 列宽、regions、variants |
| `slots` | 否 | 列表/表单插槽 HTML |
| `common` | 否 | Vue `data` / `methods` / **`common.props`（jh-component）** |
| `pc` / `mobile` | 否 | `(views, blocks) => ({ pageContent, actionContent })` |
| `resourceList` | page / 旧版 component | 后端权限；**V7 jh-component 禁止**（归宿主 Page） |

---

## 4. fields 与 views

- `fields`：字段字典 `{ label, type, options, required, readonly, op, attrs, pc, mobile }`
- `views.list.columns` / `mobileColumns`：列定义；**list 整块可省略**
- `views.list.search` / `filter`：搜索与筛选
- `views.create.fields` / `views.update.fields` 或 `tabs`
- `views.list.serverPagination: true`：移动端列表区内滚动
- **Sheet 叠层**（仅 Sheet）：`views.create.sheet` / `views.update.sheet` 默认满高；`views.list.searchSheet` 默认 `maxBodyHeight: 70vh`；共用 `persistent`、`maxBodyHeight`、`bodyHeight`、`minCardHeight`

### actions

- 业务 action 必须写对象，且必填 `label` + `uiAction`
- 覆盖位置：`views.list.toolbarActions` / `rowActions`、`views.create.actions`、`views.update.actions`、`views.update.tabs[].actions`
- `uiAction` 写标准 token（如 `create` / `update` / `delete`）或自定义 `doUiAction` 方法名
- 不要用 `intent` / `id` / `actionId`；结构项 `{ type: 'spacer' | 'slot' | 'filter' }` 例外

---

## 5. platform 默认

| 端 | list | create | update | 筛选 |
|----|------|--------|--------|------|
| pc | Table | CreateDrawer | UpdateDrawer | inline Search |
| mobile | List | FormSheet | FormSheet | SearchSheet |

配置键：优先写 `platform.pc`、`platform.mobile`；`platform.desktop` 仅兼容旧配置。

---

## 6. slots 与 pc/mobile 覆写

- 列表插槽：`slots.list.pc.children` / `slots.list.mobile.children`（`<template v-slot:…>` 字符串）
- **不要**写 `pc.children` / `mobile.children`（无效）
- 自定义 list item：保留 `blocks.list`，用 slots 或 `{ ...blocks.list, children }`
- `hasTable` 只看最终 `pageContent` 是否有 `List`/`Table`，不看 `views.list` 是否存在

---

## 7. jh-component 要点（仅 V7）

- `version: 'v7'` + `pageType: 'jh-component'` + `component.path`
- **不要** `page.id` / `resourceList`（与 v6/v4 旧组件不同）
- Vue props → **`common.props`**；`component.props` 仅兼容旧写法
- 宿主设高：`<my-comp class="h-[400px]" />`；列表滚动需 `serverPagination`
- 运行时 `pageId` 来自宿主 Page（`inject jhPage`）

旧版组件（无 `version: 'v7'`）仍可使用 `pageId`、`componentPath`、`resourceList`，勿按 V7 规则删字段。

---

## 8. 常用命令（全局 CLI）

```bash
jianghu-init json          # 编译 init-json → html
jianghu-init dev-rules --force          # 更新 AI 规则
jianghu-init vscode        # 安装 Hover / Schema 扩展
```

---

## 9. 更多说明

- 官网：https://openjianghu.org/
- VSCode 扩展内 Hover 可查看字段说明
- 改编译器/模板：在 **jianghu-init 工具仓** 进行，非 App 项目职责
