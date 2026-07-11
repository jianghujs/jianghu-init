---
name: jianghu-init-json-migration
description: Migrate existing JianghuJS legacy init-json or manually maintained generated pages to init-json v7. Use for v2/v4/v6 conversion, jh-mobile-page consolidation, PC/mobile target merging, legacy page/component field cleanup, and moving maintained HTML behavior back into init-json without losing resources or custom behavior.
---

# JianghuJS init-json Migration

Migrate behavior in small verified steps. Do not treat migration as a mechanical field rename.

## Workflow

1. Inventory the source init-json, generated HTML, includes, services, resource actions, and PC/mobile variants.
2. Read [references/inventory-checklist.md](references/inventory-checklist.md) and record unknowns before editing.
3. Read [references/migration-matrix.md](references/migration-matrix.md) to choose the target mode and map legacy structures.
4. Identify the current source of truth. Preserve custom behavior that exists only in HTML before regenerating it.
5. Load the applicable canonical v7 rule from `.ai-rules/jianghu-init-json-app/`; do not duplicate its field definitions from memory.
6. Migrate one page or component boundary at a time. Keep unrelated legacy files unchanged.
7. Consolidate separate PC/mobile definitions only when they represent one logical page and v7 targets can preserve their differences.
8. Read [references/equivalence-validation.md](references/equivalence-validation.md), then compare page identity, resources, methods, includes, actions, fields, and every target output.
9. Remove obsolete legacy source only after the replacement passes the acceptance gates and the user has authorized deletion.

## Safety

- Do not delete an old mobile page merely because `targets: 'both'` exists; verify runtime page IDs, resources, routes, and custom behavior first.
- Do not move component resources into a v7 component. Register permissions in the host page.
- Do not rewrite unrelated pages to v7 for consistency.
- Explain database writes and destructive cleanup before execution.
