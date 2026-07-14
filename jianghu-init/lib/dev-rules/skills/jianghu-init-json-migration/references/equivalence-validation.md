# Migration Equivalence Validation

Do not define success as “the file compiles.” Validate the layers affected by the migration.

## 1. Static gate

- The target config loads without syntax errors.
- Version, mode, page type, identity, and targets match the migration decision.
- CRUD and UI authoring are not mixed.
- Every business action has non-empty `label + uiAction`.
- Includes, components, methods, service functions, tables/models, and field keys resolve.
- V7 components do not own `page.id` or `resourceList`; host resources are present.
- The replacement lives under `app/view/init-json/**`; a converted configuration left only at a nonstandard input path does not satisfy the active-source gate unless that path is explicitly established as the project's active source tree.
- The active host includes/imports the replacement and preserves its ref/event entry path.
- Host attrs/props, listeners/emits, refs, and slots are preserved or their replacement is verified. For each prop used by the replacement, inspect every active host binding; an omitted binding that silently uses the default is a failure unless that default is proven equivalent.
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
- Generated action switch cases, methods, state, and refs contain no duplicate names from structural/custom collisions.
- Outer Drawer/Sheet/Dialog ownership, initial hidden state, open/close behavior, and host mount behavior remain equivalent.

Recheck scoped version-control status after writing the source. A running watcher may regenerate HTML even when no generation command was invoked; such output is part of the migration diff and must be reviewed.

Use a dry or isolated environment when available. Explain before running `jianghu-init json` because generation may update HTML and synchronize `_page` or `_resource`. Do not skip rendered-output validation merely to avoid generated diffs: either run the safe available generation path and review the output, or classify the result as a structural conversion with the compiler gate incomplete.

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
- Source-only and generated-HTML-only behavior remains present or has an explicitly accepted replacement/removal decision.
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

A config that only passes `require()` or `buildPage()` is a structural conversion, not a completed migration, when its active source path, host integration, generated output, or runtime behavior remains unverified.

Fail the compiler gate when an unconditionally mounted legacy Drawer/Sheet/Dialog component becomes always-visible page content, even if the inner markup and methods compile.

## 6. Cleanup gate

Delete or stop maintaining old source/output only when:

- The replacement is the confirmed source of truth.
- Static and compiler gates pass.
- Required data, permission, and runtime gates pass or are explicitly accepted as residual risk.
- Routes, hosts, menus, and links no longer reference the old identity.
- The user authorizes deletion and any database synchronization.

If cleanup is deferred, document which legacy files remain authoritative to prevent dual maintenance.
