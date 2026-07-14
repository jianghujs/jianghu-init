---
name: jianghu-init-json-authoring
description: Create or modify JianghuJS init-json v7 pages and components. Use for CRUD or UI page work under app/view/init-json, table-driven page generation, fields/views/dataSource/platform/targets configuration, actions, slots, and jh-component authoring. Do not use for migrating an existing legacy page; use jianghu-init-json-migration instead.
---

# JianghuJS init-json Authoring

Treat `app/view/init-json/**/*.js` as source and generated HTML as output.

## Workflow

1. Resolve the exact target init-json path and check whether it already exists. Never regenerate over an existing source file; read and edit it in place.
2. For a new table-driven CRUD page, use Jianghu Init to generate the v7 source before hand-authoring fields or resources:
   `jianghu-init json --generateType=json --pageType=jh-page --table=<table> --pageId=<pageId>`
   This step reads the configured database schema and writes the init-json source; it does not compile HTML or synchronize `_page` / `_resource`.
3. Inspect the generated source, then make only the business-specific changes requested: labels, visible/search/form fields, validation, options, targets, actions, slots, or platform differences. Do not independently rebuild generated `fields`, primary key, audit-field filtering, or standard `resourceList` unless correcting a verified generator defect.
4. For a new table-driven CRUD component, use the same generation path with `--pageType=jh-component` and the project-approved component path. For a custom UI page without a table, author a minimal UI-mode source instead of forcing CRUD generation.
5. Route references by task; do not read all authoring references by default:
   - Narrow edit to an existing CRUD page: read only `.ai-rules/jianghu-init-json-app/v7-crud-authoring.md` and the nearby source file.
   - New page/component or uncertain CRUD/UI, Page/Component, target, slot, or override choice: read [references/decision-guide.md](references/decision-guide.md).
   - Need to inspect, repair, or customize a generated shape: additionally read [references/common-recipes.md](references/common-recipes.md).
6. Load only the applicable canonical project rule:
   - CRUD fields, views, actions, and data source: `.ai-rules/jianghu-init-json-app/v7-crud-authoring.md`
   - Page/component structure and complete v7 fields: `.ai-rules/jianghu-init-json-app/v7-app-authoring.md`
   - Component-specific rules: `.ai-rules/jianghu-init-json-app/jh-component.md`
7. Prefer `version: 'v7'`. Use `pageType: 'jh-page'` for pages and `pageType: 'jh-component'` for components; express PC/mobile generation through targets.
8. Use CRUD mode only for semantic table/list/form authoring. Use UI mode for an explicit component tree. Do not mix both modes.
9. Keep business actions explicit with non-empty `label` and `uiAction`. Do not introduce `intent`, `id`, or `actionId` as action semantics.
10. Modify init-json and supporting source files only. Do not preserve a manual generated-HTML edit by copying it around the compiler.
11. Run the narrowest available validation. In a non-interactive shell, compile one page with `jianghu-init json --generateType=page --pageType=page --file=<filename> -y` when generation and database writes are authorized; do not probe with bare `jianghu-init json` or `jianghu-init json --help`.
12. Inspect generated HTML and resource changes. Report any validation or generation step that could not run.

## Project facts

- Treat the current project as the source of truth. For a new standard table CRUD, let the Jianghu Init generator read the configured schema; do not duplicate its field query manually. Use project SQL/schema files or a separate read-only query only when diagnosing a generator failure or verifying a business-specific field decision.
- If those sources cannot confirm a field, service, resource, component, or page-registration convention, ask the user instead of widening the search or guessing.
- Keep searches scoped to relevant project directories and file types. Global memory may help locate files, but it is not evidence for current-project fields or configuration; verify every fact locally. Do not search unrelated projects or unrelated system Skills.
- A business name such as `banner`, `image`, or `icon` does not imply an image-generation task. Use an image Skill only when the request is actually to create or edit an image asset.

## Safety

- Inspect project-local examples before choosing fields, services, includes, or UI methods.
- Do not invent database columns, service functions, resource actions, or component paths.
- Database inspection must be read-only. Reuse project configuration; do not guess or hard-code a database name.
- Read only the database settings required for the connection. Do not print an entire local configuration file that may contain unrelated secrets.
- Explain before running a command that writes database resource records.
- When checking generated `_page` or `_resource` rows, include the project's tenant/app identity before treating same-page records as duplicates.
- Preserve legacy syntax in unrelated files.
