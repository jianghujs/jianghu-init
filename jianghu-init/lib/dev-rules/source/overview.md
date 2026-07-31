---
id: overview
title: JianghuJS 总览
---

# JianghuJS AI 开发规范（App 项目）

## 管线

`app/view/init-json/**/*.js` → **`jianghu-init json`**（全局 CLI）→ `app/view/**/*.html`

> 编译器在全局 `jianghu-init` 包内，**不在本 App 仓库**。日常只改 `app/view/init-json/`。

## 项目内文档与规则

- AI 规则入口：`AGENTS.md` / `.cursor/rules/` / `.kiro/steering/` / `.claude/rules/`
- 任务 Skill：`.agents/skills/` / `.kiro/skills/` / `.claude/skills/`
- 页面说明：`app/view/pageDoc/*.md`

更新：`jianghu-init dev-rules --force`

## 路径速查

| 类型 | 路径 |
|------|------|
| 页面 init-json | `app/view/init-json/page/` |
| 组件 init-json | `app/view/init-json/component/` |
| 生成 HTML | `app/view/page/`、`app/view/component/` |

## 修改原则

- V7 CRUD：显式 `mode: 'crud'`，只写 `fields` / `views` / `dataSource` / `platform` / `layout` / `slots` / `pc()` / `mobile()`
- UI 模式：省略 `mode`，只写单根 `pageContent`（或 `{}` + `actionContent`）；不要混写 `fields` / `views` / `pc()` / `mobile()`
- 改配置后先执行 `jianghu-init json --dev-status`；active 时由 watcher 生成并核对输出，inactive 时仅在获授权后执行单页生成
- 不要长期手改 `.html` 生成物

## 知识路由

- 快速 CRUD 规则：`v7-crud-authoring.md`
- V7 字段全集与默认值：`config-reference.md`
- 语义配置到运行时组件映射：`semantic-to-component-mapping.md`
- Bind、slots 与 targets：`bind-slots-and-targets.md`
- 标准写法与模式选择：`authoring-guide.md`
- 复杂 CRUD 完整结构示例：`v7-crud-full-structure.md`
- 可复制页面与组件示例：`examples-guide.md`、`examples/`

`config-reference.md` 是 Full Reference；其他文档负责入门、映射、示例和任务边界，不应各自维护一套字段全集。

## 工具

- `jianghu-init json` — 编译 init-json
- `jianghu-init json --validate --file=<pageId>` — 校验单个 V7 页面，不主动生成 HTML 或同步数据库；会执行可信 init-json 模块顶层代码；组件同名冲突时补 `--pageType=component`
- `jianghu-init json --validate --file=<pageId> --format=json` — 输出统一的 errors / warnings / unknowns 报告
- `jianghu-init json --validate-changed --format=json` — 校验 Git 中新增、修改、重命名、删除和未跟踪的 V7 init-json
- `jianghu-init json --dev-status` — 判断当前项目的 json dev watcher 是否仍在运行
- `jianghu-init dev-rules --force` — 更新 AI 规则
- `jianghu-init vscode` — init-json Hover / Schema
- https://openjianghu.org/
