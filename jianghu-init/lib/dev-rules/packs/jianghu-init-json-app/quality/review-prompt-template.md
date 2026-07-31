# 独立 Review Prompt 模板（L2）

> **职责**：L2 独立 Review — 深度固定为 checklist **全量**，只读，不改文件。  
> **边界**：schema 细则、P0–P3、调用链和安全的非写入验证归 L2；浏览器 / 权限实测归 L3。  
> 小改动若 [可跳过 L2](./agent-workflow.md#3-l2-独立-review)，不要开缩写版 Review；要么跳过，要么用下方标准模板。

---

## 标准 Review（init-json 改动）

```text
请对以下 init-json 改动做 L2 只读 Review，不要修改任何文件。

## 范围
- 改动文件：<列出 app/view/init-json/... 路径>
- 关联 pageId：<pageId>
- 任务类型：新建 / 修改 / 迁移

## 要求（L2 全量深度，不可 abbreviated）
1. Read `.ai-rules/skills/jianghu-init-json-review/SKILL.md`
2. Read `.ai-rules/skills/jianghu-init-json-review/references/review-checklist.md`（只选匹配章节，但该章节内条目全量检查）
3. Read `.ai-rules/skills/jianghu-init-json-review/references/severity-and-evidence.md`
4. 若存在，Read `.ai-rules/project/pages/<pageId>.md`
5. 检查 L0 相关项：label + uiAction、deprecated key、CRUD/UI 混用、uiAction → method → resource、双端 targets
6. 对 V7 运行 `jianghu-init json --validate --file=<pageId|componentPath>`；它不主动生成 HTML 或同步数据库，但会执行可信 init-json 模块顶层代码；禁止为 Review 执行会同步数据库的生成命令

## 输出格式
- 按 P0 → P3 列出 findings（无问题时明确说明）
- 每条含：severity、文件行号、违反的契约、影响、evidence level（Static / Compiler / Runtime）
- 单独一节：L2 已执行的验证及证据
- 对 validator 的每个 `unknown` 给出“已确认 / 仍未知”的结论，禁止静默忽略
- 单独一节：归属 L3、本次未执行的运行时验证（浏览器 / 权限 / 业务路径）
- 不要改文件；修复只给方向

## 边界
- 不要机械复述 L1 DoD；必须在独立上下文重新核对证据
- 不要用「看起来没问题」代替 checklist 逐项结论
- 不要在本会话执行 L3 浏览器测试（可列出应测项）
```

---

## 迁移专项 Review（v4/v6 → v7）

```text
请对以下 v7 迁移结果做 L2 只读 Review，不要修改任何文件。

## 范围
- 源 legacy：<路径>
- 目标 v7：<路径>
- pageId：<pageId>

## 要求
1. 执行标准 Review 第 1–6 步（全量 checklist）
2. 额外检查：legacy 行为保留、deprecated key 清理、双端 targets、generated HTML（PC + mobile）差异来自 init-json 而非手改 html

## 输出格式
同标准 Review。
```

---

## Review 输出示例

```markdown
## Findings

### P1 — uiAction 未追溯到 method
- 文件：`app/view/init-json/page/foo.js:42`
- 问题：`headActionList[0].uiAction: 'doExport'` 在 generated HTML 中无对应 method
- 影响：导出按钮点击无效
- Evidence：Static + Compiler

## 归属 L3、未执行的验证
- 浏览器实际点击导出
- 非 admin 角色权限

## 结论
存在 1 个 P1，不建议合并，直至 uiAction 与 method 对齐。
```
