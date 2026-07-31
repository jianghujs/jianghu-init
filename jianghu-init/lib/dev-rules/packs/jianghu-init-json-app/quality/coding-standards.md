# 编码硬规则（L0）与开发自检（L1）

> JianghuJS 通用质量规则，由 dev-rules 管理和更新。  
> 职责边界见 [agent-workflow.md](./agent-workflow.md)。

## L0：写时遵守（十条硬规则）

生成 / 修改 init-json 时必须遵守。开发 Agent 在 L1 检查本次触及的规则；L2 独立复核，能机器检测的规则再由 L3 validate 证明。

1. **init-json 是唯一源** — 禁止手改 generated HTML（除非修生成器 / 编译器）。
2. **先读 Skill 再动手** — authoring / migration / review 分任务使用，禁止混用。
3. **禁止虚构契约** — 不得编造 field、resource、service、component path、pageId。
4. **禁止覆盖已有源文件** — 已存在的 init-json 只读编辑，禁止 table 生成覆盖。
5. **CRUD / UI 不混用** — L1 检查本次改动，L2 独立复核，L3 在安全验证入口可用时再次验证。
6. **action 语义规范** — 非空 `label` + `uiAction`；禁止 `intent` / `id` / `actionId` 作业务语义。
7. **生成前确认 dev 状态** — 单独编译前运行 `jianghu-init json --dev-status`；active 时交给 watcher，inactive 时仅执行获授权的窄范围生成，并另行核对目标输出。
8. **双端独立验收** — targets 含 PC + mobile 时，L1/L2 分别检查生成结果，L3 分别取得运行时证据。
9. **生成会话不自评 L2** — 本会话不得宣称「已通过 Review」。
10. **交付必须诚实** — 输出 L1 DoD，列出未测项；不得把未测说成已通过。

---

## L1：交付检查清单（DoD）

**每次改 init-json 后必填。** 自检范围随本次改动展开，不能因为后续还有 L2/L3 而省略已知规则。

```markdown
## L1 交付检查

- [ ] 源文件边界：仅 init-json / 授权源文件，未手改 generated HTML
- [ ] L0 符合性：本次触及规则 ___；逐项检查结果 ___
- [ ] 验证与生成链路：单页 validate ___；errors ___；unknowns ___；dev-status ___；预期输出已更新：是 / 否
- [ ] 契约可追溯：action / resource / include / component 能在项目中找到对应实现：是 / 否 / 不适用
- [ ] 范围与证据：双端 / 权限 / 运行时 ___；已验证 ___；未测项 ___
- [ ] 已 Read 的 skill：___
```

**L1 结论边界**：

- 必须检查本次触及的 `label + uiAction`、canonical/deprecated key、CRUD/UI 边界等规则。
- 可以运行安全验证并记录结果，但只能称为开发自检。
- 不得给自己的改动签发独立 L2 Review 结论。
- 未执行的浏览器、权限或业务验证必须进入 `L3 Incomplete`，不能只写成一般备注。

---

## L2 触发条件（摘要）

完整表见 [agent-workflow.md#3-l2-独立-review](./agent-workflow.md#3-l2-独立-review)。

- **可跳过 L2**：局部 label / visible / 文案等小改动（L1 仍必做）。
- **必须 L2**：新页、迁移、action/resource/targets 变更、用户要求 review。

Review 一律用 [review-prompt-template.md](./review-prompt-template.md) **标准 / 迁移模板**，无缩写版。
