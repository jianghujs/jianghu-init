---
id: overview
title: JianghuJS 总览
---

# JianghuJS AI 开发规范（App 项目）

## 管线

`app/view/init-json/**/*.js` → **`jianghu-init json`**（全局 CLI）→ `app/view/**/*.html`

> 编译器在全局 `jianghu-init` 包内，**不在本 App 仓库**。日常只改 `app/view/init-json/`。

## 项目内文档

- V7 配置指南：`.jianghu/ai-rules/docs/v7-app-authoring.md`
- AI 短规范：`.jianghu/ai-rules/source/*.md`
- 页面说明：`app/view/pageDoc/*.md`

更新：`jianghu-init dev-rules --sync --force`

## 路径速查

| 类型 | 路径 |
|------|------|
| 页面 init-json | `app/view/init-json/page/` |
| 组件 init-json | `app/view/init-json/component/` |
| 生成 HTML | `app/view/page/`、`app/view/component/` |

## 修改原则

- V7 CRUD：只写 `fields` / `views` / `platform` / `slots` / `pc()` / `mobile()`，不要手写 `Table`/`List`/`Drawer`（UI mode 除外）
- 改配置后执行 `jianghu-init json` 重新编译
- 不要长期手改 `.html` 生成物

## 工具

- `jianghu-init json` — 编译 init-json
- `jianghu-init dev-rules --sync` — 更新 AI 规则
- `jianghu-init vscode` — init-json Hover / Schema
- https://openjianghu.org/
