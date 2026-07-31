---
name: jianghu-init-json-review
description: Review JianghuJS init-json pages, components, migrations, and generated results for correctness. Use when asked to review, inspect, validate, audit, or troubleshoot init-json structure, v7 rules, actions, targets, includes, resource/service mapping, generated HTML consistency, or legacy-field leakage.
---

# JianghuJS init-json Review

Lead with concrete findings. Do not edit unless the user also requests a fix.

## Workflow

1. Determine whether each file is v7 or legacy and whether it is a page or component.
2. Read `.ai-rules/skills/jianghu-init-json-review/references/review-checklist.md`, selecting only the matching Page/Component and CRUD/UI sections.
3. Read `.ai-rules/skills/jianghu-init-json-review/references/severity-and-evidence.md` before assigning severity or claiming runtime correctness.
4. Load only the canonical `.ai-rules/jianghu-init-json-app/` document needed to verify the disputed structure.
5. Read `.ai-rules/project/README.md` and the matching `.ai-rules/project/pages/<pageId>.md` when present. Treat `constructionPlan` as intended functionality and business boundaries, then trace each applicable feature through source init-json, generated HTML, resources, and services without assuming it is implemented.
6. Validate both PC and mobile outputs when targets include both.
7. Check referenced includes, component paths, methods, service functions, table fields, and resource actions against the repository.
8. For V7, run `jianghu-init json --validate --file=<pageId|componentPath> --format=json` as the non-generating structural/compiler gate. It does not proactively write HTML or database metadata, but it loads and executes top-level code from the trusted init-json module. Resolve or explicitly retain every reported `unknown`; do not silently treat unknown as pass. Use `jianghu-init json --dev-status` to distinguish watcher-owned generation from an inactive dev environment; do not infer status from the mere existence of `jianghu-init.dev.lock`. Do not run database-writing generation merely to review.
9. Report findings by severity with precise file and line references, followed by test gaps and residual risk.

## Review Boundary

- Treat generated HTML differences as evidence; locate the source defect in init-json or the compiler.
- Do not require v7-only fields in legacy files.
- Distinguish schema errors, compiler defects, missing project dependencies, and business-rule ambiguity.
- If no defect is found, state that clearly and name the validation not performed.
