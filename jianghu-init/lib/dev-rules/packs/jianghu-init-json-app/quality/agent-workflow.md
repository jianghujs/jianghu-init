# Agent 质量工作流（L0 → L1 → L2 → L3）

> JianghuJS 通用质量流程，由 dev-rules 管理和更新。项目业务规则在 `.ai-rules/project/` 中补充，但不得降低本流程要求。

## 四层职责边界

各层按责任和证据递进。后一层不替代前一层，前一层也不得因为后续还有检查而故意降低深度。

| 层级 | 名称 | 深度 | 何时做 | 负责 | 不负责 |
|------|------|------|--------|------|--------|
| **L0** | 编码硬规则 | **写时约束** | 生成 / 修改过程中 | source of truth、canonical schema、契约和安全边界 | 证明运行时正确 |
| **L1** | 开发自检 | **完整自检** | 每次改 init-json 后 | 检查本次触及的 L0、生成链路、契约、双端范围和未测项 | 宣称独立 Review 通过 |
| **L2** | 独立 Review | **全量 checklist** | 见 [触发条件](#3-l2-独立-review) | 新上下文重新检查结构、编译证据、调用链和 severity | 修改文件、代替运行时验收 |
| **L3** | 交付验收 | **可证明证据** | 交付 / 合并前 | 可用的静态验证、生成结果、浏览器 / Playwright、权限与业务路径 | 代替 L1/L2 |

```
L0：按硬规则写 init-json
        ↓
L1：开发 Agent 完整自检
        ↓
L2：触发时另开上下文只读 Review
        ↓
L3：交付前取得机器和运行时证据
```

**边界原则**

- L1 必须检查本次改动触及的 L0 规则，包括 `label + uiAction`、canonical key、CRUD/UI 边界等；可以检查得更深，但不得把自检称为独立 Review。
- L2 **不得** 修改文件；**不得** 用 abbreviated checklist 代替全量（小改动要么跳过 L2，要么走标准 Review）。
- L2 可以运行安全、非写入的静态或编译验证；运行时和权限验收归 L3。
- L3 不得因为 L2 通过就跳过；未取得必要证据时只能标记 `L3 Incomplete`，不得写成通过或可合并。
- 生成会话可以完成 L0、L1 和必要验证，但不得在同一上下文自评「L2 Review 已通过」。

L0 硬规则（写时遵守）见 [coding-standards.md](./coding-standards.md)；L2 检查项见 review skill 的 checklist。

---

## 1. 写（生成 / 修改）

归属：**authoring / migration skill + L0 硬规则**（不属于 L1/L2/L3）。

1. Read `.ai-rules/jianghu-init-json-app/coding-standards.md`。
2. Read `.ai-rules/project/pages/<pageId>.md`（若存在）。
3. Read 对应 task skill（authoring / migration）。
4. 只改 init-json 及任务授权源文件。
5. 运行 `jianghu-init json --validate --file=<pageId|componentPath>`，通过不生成 HTML、不同步数据库的机器门禁。该命令会加载并执行可信项目中的 init-json 模块顶层代码。
6. 单独生成前运行 `jianghu-init json --dev-status`，判断由 watcher 还是单页命令负责生成；生成后另行核对目标 HTML 是否实际更新。

---

## 2. L1 自检（每次必做）

开发 Agent 对本次改动做完整检查：

1. **L0 符合性** — 逐项检查本次触及的 schema、action、source of truth 和安全规则。
2. **源文件边界** — 是否只改了 init-json（及授权源文件），未手改 generated HTML？
3. **验证与生成链路** — 单页 `--validate` 是否通过？`--dev-status` 结果？预期 generated 输出是否已更新？
4. **契约可追溯** — 本次 action / resource / include / component 能否在项目中找到对应实现？
5. **范围与未测** — 涉及双端 / 权限 / 运行时是否已测？列出证据和未测项。

填写 [coding-standards.md](./coding-standards.md) 中的 DoD 模板。

---

## 3. L2 独立 Review

### 触发条件

| 改动类型 | L1 自检 | L2 Review |
|----------|---------|-----------|
| 改 label、文案、visible 等局部字段 | **必须** | **可跳过** |
| 新页 / 新组件 | **必须** | **必须**（另开会话） |
| v4/v6→v7 迁移 | **必须** | **必须**（另开会话） |
| 改 action / resource / uiAction | **必须** | **必须**（另开会话） |
| 改 targets / 双端布局 | **必须** | **必须**（另开会话） |
| 用户明确要求 review | **必须** | **必须**（另开会话） |

- **可跳过 L2** 时：交付物 = L1 DoD + 改动说明；合并前仍建议 L3 点验。
- **必须 L2** 时：使用 [review-prompt-template.md](./review-prompt-template.md) 的 **标准模板**（迁移用迁移模板）；只读，按 P0–P3 + evidence 输出。

---

## 4. L3 验证 / 测试（交付前）

| 步骤 | 归属 | 说明 |
|------|------|------|
| `jianghu-init json --validate --file=<file>` | L3 | V7 必须通过；不主动生成 HTML 或写 `_page/_resource`，但会执行可信 init-json 模块顶层代码 |
| `jianghu-init json --validate-changed --format=json` | L3 / CI | 合并前校验 Git 中新增、修改、重命名及删除的 V7 init-json |
| generated HTML diff | L3 | 每个 requested target 都要确认编译结果符合预期 |
| 浏览器点验 | L3 | 新页以及 action/resource/权限/targets 变更必须覆盖关联核心流程 |
| Playwright smoke | L3 | 有稳定用例的关键页执行并记录结果 |
| 权限与业务边界 | L3 | 涉及权限、提交、撤销等边界时验证成功和拒绝路径 |

L3 只有两种结论：

- **L3 Passed**：本次改动所需的自动验证、生成结果和运行时证据均已取得。
- **L3 Incomplete**：存在未执行或失败的必要验证；必须列明原因和影响，不得表述为已通过、可合并或已验收。

验证报告中的 `unknowns` 不会伪装成机器错误，但必须在 L2/L3 中确认或保留为未完成项；存在未解决 `unknowns` 时不能仅凭 validator 宣称 L3 Passed。

当前 validator 可检查 `uiAction → common.doUiAction → common.methods` 的显式配置关系，但不会解析任意方法体来证明其最终调用的 `actionId/resource/service`；这部分仍由 L2 沿源码调用链核对，并在 L3 做权限与业务验证。

---

## 5. 合并 / 提交三件套

1. **Diff** — init-json（+ 必要 sql/js）；HTML 为生成物
2. **L1 DoD** — 每次必有；**L2 Review 报告** — 触发 L2 时必有
3. **L3 验收结论** — `Passed` 及证据，或 `Incomplete` 及阻塞项

---

## 验证 dev-rules 是否生效（抽查）

1. 生效了哪些 rules？Read 了哪些 skill？
2. L1 是否检查了本次触及的 L0 规则并填写 DoD？
3. 触发 L2 时是否在 **独立会话** 且 **只读**？
4. L3 是否明确为 `Passed` 并附证据，或明确为 `Incomplete` 并列出阻塞项？
