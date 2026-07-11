# Authoring Decision Guide

Use this guide to choose the authoring shape before reading detailed field documentation.

## 1. Choose CRUD or UI mode

| Evidence | Choose | Reason |
|---|---|---|
| The page is primarily list/search/create/update/delete over a table or model | CRUD | `fields`, `views`, and `dataSource` express the behavior without template duplication |
| The component is a reusable subtable with standard list/form behavior | CRUD component | The host owns page identity and resources while the component owns presentation |
| The page is a dashboard, detail workspace, chart composition, or custom workflow | UI | The component tree is the primary structure |
| Existing behavior depends on a highly custom DOM hierarchy | UI or supported slots | Do not force non-CRUD behavior into CRUD fields and views |
| The request mixes a standard list with a few custom cells or form areas | CRUD plus slots/overrides | Keep semantic CRUD and customize only the exceptional regions |

CRUD requires explicit `mode: 'crud'`. UI mode omits `mode` and uses `pageContent` with optional `actionContent`. Do not place top-level `pageContent` in CRUD mode or top-level `fields/views` in UI mode.

## 2. Choose Page or Component

| Requirement | Shape |
|---|---|
| Own route, menu, page identity, or permissions | `pageType: 'jh-page'` with `page.id` |
| Embedded reusable content controlled by a host page | `pageType: 'jh-component'` with `component.path` |
| Content needs its own resource permissions but is visually embedded | Register resources in the host Page; keep the v7 component free of `resourceList` |
| Existing file is an old component using `pageId/componentPath/resourceList` | Treat it as legacy until deliberately migrated |

Do not add `page.id` or `resourceList` to a v7 component. Keep component Vue props under `common.props` unless existing compiler compatibility requires otherwise.

## 3. Choose targets

| Requirement | Choice |
|---|---|
| PC only | `page.targets: 'pc'` or the project-established equivalent |
| Mobile only | `page.targets: 'mobile'` |
| One logical page on both | `page.targets: 'both'` |
| Separate routes or materially different business behavior | Keep separate pages; do not merge merely to use `both` |

For new v7 pages, keep `pageType: 'jh-page'`; treat `jh-mobile-page` as legacy compatibility. Use `platform.pc` and `platform.mobile` for component-policy differences, and `pc()`/`mobile()` only when output structure genuinely differs.

For components, follow the canonical component target field supported by the current v7 rule and nearby examples. Do not infer page target fields onto components without checking the rule pack.

## 4. Choose the customization mechanism

Use the least powerful mechanism that preserves the requirement:

1. Field/view options for ordinary labels, types, columns, forms, filters, and actions.
2. Platform policy for PC/mobile Table/List and Drawer/Sheet selection.
3. Slots for custom list cells, form regions, or template fragments.
4. `pc()`/`mobile()` overrides for target-specific composition that cannot be expressed declaratively.
5. UI mode for a page whose main structure is custom rather than CRUD.

Do not switch the whole page to UI mode for one custom column. Do not embed large HTML strings when supported semantic fields or slots express the same behavior.

## 5. Decide what to read next

- Read `.ai-rules/jianghu-init-json-app/v7-crud-authoring.md` for CRUD fields, views, actions, data sources, slots, and target overrides.
- Read `.ai-rules/jianghu-init-json-app/v7-app-authoring.md` for full page/component structure and current field names.
- Read `.ai-rules/jianghu-init-json-app/jh-component.md` for any component task.
- Read [common-recipes.md](common-recipes.md) only when a matching recipe helps establish the minimal structure.

