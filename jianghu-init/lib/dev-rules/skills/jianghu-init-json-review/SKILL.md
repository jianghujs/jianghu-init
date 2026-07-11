---
name: jianghu-init-json-review
description: Review JianghuJS init-json pages, components, migrations, and generated results for correctness. Use when asked to review, inspect, validate, audit, or troubleshoot init-json structure, v7 rules, actions, targets, includes, resource/service mapping, generated HTML consistency, or legacy-field leakage.
---

# JianghuJS init-json Review

Lead with concrete findings. Do not edit unless the user also requests a fix.

## Workflow

1. Determine whether each file is v7 or legacy and whether it is a page or component.
2. Read [references/review-checklist.md](references/review-checklist.md), selecting only the matching Page/Component and CRUD/UI sections.
3. Read [references/severity-and-evidence.md](references/severity-and-evidence.md) before assigning severity or claiming runtime correctness.
4. Load only the canonical `.ai-rules/jianghu-init-json-app/` document needed to verify the disputed structure.
5. Trace source init-json through the compiler-facing structure to generated HTML and resources where available.
6. Validate both PC and mobile outputs when targets include both.
7. Check referenced includes, component paths, methods, service functions, table fields, and resource actions against the repository.
8. Run non-mutating tests or validation commands when available. Do not run database-writing generation merely to review.
9. Report findings by severity with precise file and line references, followed by test gaps and residual risk.

## Review Boundary

- Treat generated HTML differences as evidence; locate the source defect in init-json or the compiler.
- Do not require v7-only fields in legacy files.
- Distinguish schema errors, compiler defects, missing project dependencies, and business-rule ambiguity.
- If no defect is found, state that clearly and name the validation not performed.
