# Migration Equivalence Validation

Do not define success as “the file compiles.” Validate the layers affected by the migration.

## 1. Static gate

- The target config loads without syntax errors.
- Version, mode, page type, identity, and targets match the migration decision.
- CRUD and UI authoring are not mixed.
- Every business action has non-empty `label + uiAction`.
- Includes, components, methods, service functions, tables/models, and field keys resolve.
- V7 components do not own `page.id` or `resourceList`; host resources are present.
- Unrelated legacy files remain unchanged.

Failure blocks generation.

## 2. Compiler gate

For each requested target, compare:

- Generated file path and page/component identity.
- Page title, menu behavior, route assumptions, and mobile runtime ID.
- List/table fields, ordering, slots, search, filters, pagination, and scrolling.
- Create/update/detail forms, tabs, validation, readonly/default behavior.
- Toolbar, row, form, tab, and custom actions.
- Includes, child components, methods, computed state, watchers, and lifecycle hooks.

Use a dry or isolated environment when available. Explain before running `jianghu-init json` because generation may update HTML and synchronize `_page` or `_resource`.

## 3. Data and permission gate

- List requests use equivalent resource/service actions, filters, sorting, and pagination.
- Create/update/delete payloads preserve field names and hooks.
- Permission checks remain at least as restrictive as before.
- Host pages register resources used by migrated components.
- `_page` and `_resource` identities do not conflict or silently change.
- Any intended resource change is listed explicitly for approval.

Do not run this gate against production data merely to prove migration.

## 4. Runtime gate

Validate PC and mobile independently when both are targets:

- Initial loading, empty state, error state, and retry behavior.
- Search, filter, sort, pagination, refresh, and selection.
- Create, update, delete, custom actions, confirmations, and validation failures.
- Permission-denied behavior.
- Slots, dialogs, drawers/sheets, fixed height, overflow, and touch interaction.
- Navigation into and out of the page and embedded component behavior.

Record any runtime check not performed.

## 5. Acceptance matrix

Use a compact matrix in the migration report:

| Area | PC | Mobile | Evidence | Result |
|---|---|---|---|---|
| Identity and route | checked/not applicable | checked/not applicable | file/runtime | pass/fail/unknown |
| List and query | | | request/output | |
| Forms and validation | | | runtime/output | |
| Actions and permissions | | | code/request | |
| Custom layout and slots | | | DOM/screenshot | |
| Generated resources | | | diff/database preview | |

Unknown is not pass.

## 6. Cleanup gate

Delete or stop maintaining old source/output only when:

- The replacement is the confirmed source of truth.
- Static and compiler gates pass.
- Required data, permission, and runtime gates pass or are explicitly accepted as residual risk.
- Routes, hosts, menus, and links no longer reference the old identity.
- The user authorizes deletion and any database synchronization.

If cleanup is deferred, document which legacy files remain authoritative to prevent dual maintenance.

