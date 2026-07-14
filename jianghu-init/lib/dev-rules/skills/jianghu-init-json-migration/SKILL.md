---
name: jianghu-init-json-migration
description: Migrate existing JianghuJS legacy init-json or manually maintained generated pages to init-json v7. Use for v2/v4/v6 conversion, jh-mobile-page consolidation, PC/mobile target merging, legacy page/component field cleanup, and moving maintained HTML behavior back into init-json without losing resources or custom behavior.
---

# JianghuJS init-json Migration

Migrate behavior in small verified steps. Do not treat migration as a mechanical field rename.

## Workflow

1. Inventory the source init-json, generated HTML, includes, services, resource actions, host references, and PC/mobile variants.
2. Read [references/inventory-checklist.md](references/inventory-checklist.md) and record unknowns before editing.
3. Resolve and state the active target path before editing. Any init-json configuration outside `app/view/init-json/**` is a read-only migration input by default; create its v7 replacement under the corresponding path in `app/view/init-json/**`. This includes, but is not limited to, directories named `_bak*`, `backup`, or `legacy`.
4. Read [references/migration-matrix.md](references/migration-matrix.md) to choose the target mode and map legacy structures.
5. Identify the current source of truth. Compare the migration input with the active generated HTML and preserve every active behavior that exists only in HTML unless replacement or removal is explicitly verified. This includes outer Drawer/Sheet/Dialog ownership, initial visibility, close behavior, and any generated methods not present in the input configuration.
6. For a component, compare the complete active host contract: include/import path, attrs/props, listeners/emits, refs, slots, runtime page ID, and host-owned resources. Include required host changes in the migration boundary; matching only the include path is insufficient. If the replacement declares or renders from a prop, every active host must pass the intended value or the migration must explicitly prove that the default is correct. Never silently leave a required prop at its default.
7. Load the applicable canonical v7 rule from `.ai-rules/jianghu-init-json-app/`; do not duplicate its field definitions from memory.
8. Migrate one page or component boundary at a time. Keep unrelated legacy files unchanged.
9. Compare a named PC or mobile source with its counterpart before choosing mobile-only, PC-only, or both targets. Do not merge targets merely because both files exist.
10. Before writing, capture the relevant source and generated-output status. After writing, recheck both because an existing `json dev` watcher may regenerate HTML automatically; include every observed generated diff in validation and reporting.
11. Read [references/equivalence-validation.md](references/equivalence-validation.md), then compare page identity, resources, methods, includes, actions, fields, host integration, and every target output. Inspect generated code for duplicate action cases, methods, state, or refs caused by collisions between v7 structural component keys and `common.doUiAction/common.methods`.
12. Report a change as a completed migration only when the replacement is in the active source tree, the active host can reach it with the required contract, all observed generated outputs are reviewed, and the required static/compiler gates pass. A source file that only passes `require()` or `buildPage()` is a structural conversion. If rendered output was not generated and compared, say so explicitly and do not describe the task as a completed upgrade.
13. Remove obsolete legacy source only after the replacement passes the acceptance gates and the user has authorized deletion.

Keep the investigation scoped. Start with paths, symbols, action names, host bindings, and focused line ranges; expand only around behavior that must be preserved. Do not repeatedly print entire generated HTML files, large init-json files, or full diffs when a symbol inventory and focused hunks provide the same evidence.

## Safety

- Do not delete an old mobile page merely because `targets: 'both'` exists; verify runtime page IDs, resources, routes, and custom behavior first.
- Do not edit an init-json configuration outside `app/view/init-json/**` in place unless the user explicitly identifies that nonstandard path as the active source tree. A request to upgrade an external configuration names the migration input, not automatically the destination.
- Do not move component resources into a v7 component. Register permissions in the host page.
- Do not preserve unresolved refs, missing state, misspelled action steps, or unavailable methods as if they were verified behavior; trace them or report them as blockers.
- Do not redeclare compiler-generated Drawer/Sheet action chains or methods under the same names in `common`; rename the business action or rely on the generated structural action, then inspect the output for duplicates.
- Do not remove behavior found in the active generated HTML merely because it is absent from the migration input. Record its ownership and preserve it or obtain explicit approval to drop it.
- Do not preserve a component prop in the replacement while omitting its active host binding. A render branch that always falls back to the prop default is a behavior regression, even when compilation succeeds.
- If the host mounts a component unconditionally and the active generated component owns a Drawer/Sheet/Dialog, the v7 replacement must retain an equivalent hidden-by-default container. Do not migrate its inner body into always-visible `pageContent`.
- When a required external action name collides with a v7 structural action generated from a component key, either choose a non-colliding structural key or update and verify the host caller. Never accept duplicate cases/methods or silently remove the extra business steps.
- Do not rewrite unrelated pages to v7 for consistency.
- Explain database writes and destructive cleanup before execution.
