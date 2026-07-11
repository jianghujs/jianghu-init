---
name: jianghu-init-json-authoring
description: Create or modify JianghuJS init-json v7 pages and components. Use for CRUD or UI page work under app/view/init-json, table-driven page generation, fields/views/dataSource/platform/targets configuration, actions, slots, and jh-component authoring. Do not use for migrating an existing legacy page; use jianghu-init-json-migration instead.
---

# JianghuJS init-json Authoring

Treat `app/view/init-json/**/*.js` as source and generated HTML as output.

## Workflow

1. Read the nearest existing init-json files and project conventions before designing the change.
2. Route references by task; do not read all authoring references by default:
   - Narrow edit to an existing CRUD page: read only `.ai-rules/jianghu-init-json-app/v7-crud-authoring.md` and the nearby source file.
   - New page/component or uncertain CRUD/UI, Page/Component, target, slot, or override choice: read [references/decision-guide.md](references/decision-guide.md).
   - Need a new configuration skeleton: additionally read [references/common-recipes.md](references/common-recipes.md).
3. Load only the applicable canonical project rule:
   - CRUD fields, views, actions, and data source: `.ai-rules/jianghu-init-json-app/v7-crud-authoring.md`
   - Page/component structure and complete v7 fields: `.ai-rules/jianghu-init-json-app/v7-app-authoring.md`
   - Component-specific rules: `.ai-rules/jianghu-init-json-app/jh-component.md`
4. Prefer `version: 'v7'`. Use `pageType: 'jh-page'` for pages and `pageType: 'jh-component'` for components; express PC/mobile generation through targets.
5. Use CRUD mode only for semantic table/list/form authoring. Use UI mode for an explicit component tree. Do not mix both modes.
6. Keep business actions explicit with non-empty `label` and `uiAction`. Do not introduce `intent`, `id`, or `actionId` as action semantics.
7. Modify init-json and supporting source files only. Do not preserve a manual generated-HTML edit by copying it around the compiler.
8. Run the narrowest available validation, then run `jianghu-init json` when generation is authorized and database configuration is available.
9. Inspect generated HTML and resource changes. Report any validation or generation step that could not run.

## Safety

- Inspect project-local examples before choosing fields, services, includes, or UI methods.
- Do not invent database columns, service functions, resource actions, or component paths.
- Explain before running a command that writes database resource records.
- Preserve legacy syntax in unrelated files.
