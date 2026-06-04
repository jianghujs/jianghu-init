---
id: v7-compiler
title: V7 Compiler
---

# V7 编译器（jianghu-init 工具仓）

> 仅 **init-tool** profile。以下路径在全局 `jianghu-init` 包或工具仓内，**不在业务 App 项目**。

## 流水线

`normalizeSchema` → `expandCrudPage` → `adaptCrudPagePc | adaptCrudPageMobile | adaptCrudComponent` → `schemaPipeline.parseSchema`

## 职责

| 文件 | 职责 |
|------|------|
| `expandCrudPage.js` | 语义 → blocks / pageContent / actionContent |
| `builders.js` | IR → 节点树 |
| `policy.js` | 端 adapt、flex 高度链 |
| `schemaPipeline.js` | `features.hasTable`、NJK bake |

## hasTable

- 扫描最终 `pageContent` 的 `List`/`Table` + headers，不看 `views.list` 是否存在

## jh-component flex

- `adaptCrudComponent` → `applyPageContentFlexLayout({ rootHeightClass: 'h-full' })`
- 与 `jh-mobile-page` 的 `100dvh` 不同，组件接宿主传入高度

## 改动后

1. 更新 `docs/v7-config-rules.md`
2. `node lib/json/v7/pages/examples/smoke-platform-layout.js`
