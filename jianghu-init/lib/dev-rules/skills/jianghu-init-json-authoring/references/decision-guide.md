# Authoring Decision Guide

Use this guide to choose the authoring shape before reading detailed field documentation.

## 0. Choose create or edit

| Situation | First action |
|---|---|
| Target init-json already exists | Read and edit it; never run table generation over it |
| New table-driven CRUD Page | Run `jianghu-init json --generateType=json --pageType=jh-page --table=<table> --pageId=<pageId>` |
| New table-driven CRUD Component | Run the same generator with `--pageType=jh-component` and the approved component path |
| New custom dashboard, workspace, or workflow | Author a minimal UI-mode source; do not force a CRUD table generator |
| Existing legacy page needs conversion | Stop and use `jianghu-init-json-migration` |

The standard generator owns schema lookup, fields, primary key, audit-field filtering, default views, and standard resources. Inspect its output and change only verified business differences. Do not hand-author the same standard structure first.

## 1. Establish project facts

Before creating or changing a page, confirm only the facts needed for the selected path:

1. Check the exact destination first. If it exists, edit it and do not run table generation.
2. Read only the nearest `app/view/init-json` files needed for naming, targets, and project conventions.
3. For a new standard table CRUD, run the table generator and inspect its output; do not query and reconstruct its schema work manually.
4. Check project SQL/schema files or run a separate read-only query only when the generator fails or a requested business decision cannot be verified from its output.
5. If the project still cannot establish a required fact, ask the user. Do not invent fields or infer them from another project.

Stop once the required fact is confirmed. Scope searches to relevant business source directories and file types; exclude generated assets, dependencies, unrelated repositories, and unrelated system Skills. Global memory can locate likely project files but cannot establish current fields or configuration without project-local verification. Table names such as `banner`, `image`, and `icon` remain business identifiers unless the user explicitly requests image generation.

For database inspection, reuse the project's configured connection and database name. Read only the required connection settings rather than printing the whole local config. Do not hard-code credentials or database names, and do not perform writes while discovering schema.

For non-interactive generation of a page file, use:

```bash
jianghu-init json --generateType=page --pageType=page --file=<filename> -y
```

This command can write generated files and synchronize `_page` / `_resource`; explain that impact before running it. Do not run bare interactive `jianghu-init json` or use `--help` as capability detection in a non-interactive shell. When verifying metadata, include the project tenant/app identity so records from another tenant are not mistaken for duplicates.

## 2. Choose CRUD or UI mode

| Evidence | Choose | Reason |
|---|---|---|
| The page is primarily list/search/create/update/delete over a table or model | CRUD | `fields`, `views`, and `dataSource` express the behavior without template duplication |
| The component is a reusable subtable with standard list/form behavior | CRUD component | The host owns page identity and resources while the component owns presentation |
| The page is a dashboard, detail workspace, chart composition, or custom workflow | UI | The component tree is the primary structure |
| Existing behavior depends on a highly custom DOM hierarchy | UI or supported slots | Do not force non-CRUD behavior into CRUD fields and views |
| The request mixes a standard list with a few custom cells or form areas | CRUD plus slots/overrides | Keep semantic CRUD and customize only the exceptional regions |

CRUD requires explicit `mode: 'crud'`. UI mode omits `mode` and uses `pageContent` with optional `actionContent`. Do not place top-level `pageContent` in CRUD mode or top-level `fields/views` in UI mode.

## 3. Choose Page or Component

| Requirement | Shape |
|---|---|
| Own route, menu, page identity, or permissions | `pageType: 'jh-page'` with `page.id` |
| Embedded reusable content controlled by a host page | `pageType: 'jh-component'` with `component.path` |
| Content needs its own resource permissions but is visually embedded | Register resources in the host Page; keep the v7 component free of `resourceList` |
| Existing file is an old component using `pageId/componentPath/resourceList` | Treat it as legacy until deliberately migrated |

Do not add `page.id` or `resourceList` to a v7 component. Keep component Vue props under `common.props` unless existing compiler compatibility requires otherwise.

## 4. Choose targets

| Requirement | Choice |
|---|---|
| PC only | `page.targets: 'pc'` or the project-established equivalent |
| Mobile only | `page.targets: 'mobile'` |
| One logical page on both | `page.targets: 'both'` |
| Separate routes or materially different business behavior | Keep separate pages; do not merge merely to use `both` |

For new v7 pages, keep `pageType: 'jh-page'`; treat `jh-mobile-page` as legacy compatibility. Use `platform.pc` and `platform.mobile` for component-policy differences, and `pc()`/`mobile()` only when output structure genuinely differs.

For components, follow the canonical component target field supported by the current v7 rule and nearby examples. Do not infer page target fields onto components without checking the rule pack.

## 5. Choose the customization mechanism

Use the least powerful mechanism that preserves the requirement:

1. Field/view options for ordinary labels, types, columns, forms, filters, and actions.
2. Platform policy for PC/mobile Table/List and Drawer/Sheet selection.
3. Slots for custom list cells, form regions, or template fragments.
4. `pc()`/`mobile()` overrides for target-specific composition that cannot be expressed declaratively.
5. UI mode for a page whose main structure is custom rather than CRUD.

Do not switch the whole page to UI mode for one custom column. Do not embed large HTML strings when supported semantic fields or slots express the same behavior.

## 6. Decide what to read next

- Read `.ai-rules/jianghu-init-json-app/v7-crud-authoring.md` for CRUD fields, views, actions, data sources, slots, and target overrides.
- Read `.ai-rules/jianghu-init-json-app/v7-crud-full-structure.md` only for complex CRUD requiring tabs, slots, layout, platform policy, or PC/mobile composition overrides.
- Read `.ai-rules/jianghu-init-json-app/v7-app-authoring.md` for full page/component structure and current field names.
- Read `.ai-rules/jianghu-init-json-app/jh-component.md` for any component task.
- Read [common-recipes.md](common-recipes.md) only when a matching recipe helps establish the minimal structure.
