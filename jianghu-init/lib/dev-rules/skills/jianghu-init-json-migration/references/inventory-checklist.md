# Migration Inventory Checklist

Complete the relevant sections before editing. Mark missing evidence as unknown rather than guessing.

## Source ownership

- Identify the init-json source, generated HTML, manually maintained HTML, and shared includes.
- Compare init-json and generated HTML to find behavior that exists only in output.
- Check version control history when it can explain whether HTML changes are intentional.
- Identify the command and compiler version that currently produce the page.
- Determine whether another generator or script owns any target file.

## Identity and routing

- Record page ID, mobile page ID, component path, page name, menu state, route, and query parameters.
- Search for links, redirects, menu records, includes, and host components that reference those identities.
- Determine whether PC and mobile variants share one logical route or are intentionally independent.
- Record runtime page ID behavior for embedded components.

## Data and permissions

- Record table/model, primary key, filters, sorting, pagination, joins, and response shape.
- Confirm fields against SQL/schema/model evidence.
- Record list/create/update/delete resources and any service-backed actions.
- Locate service functions, hooks, validation, transaction behavior, and permission checks.
- Determine whether a host page owns resources used by a component.

## Presentation and interaction

- Record table/list columns, mobile summary fields, search, filters, and empty/loading/error states.
- Record create/update/detail forms, tabs, validation, readonly rules, and conditional visibility.
- Record toolbar, row, form, tab, and custom actions with their method names and confirmation behavior.
- Record slots, custom HTML, includes, child components, dialogs, drawers, sheets, and fixed-height/scroll behavior.
- Record `data`, `computed`, `watch`, lifecycle hooks, mixins, and injected/provided state.

## Target differences

- Compare PC and mobile fields, actions, request behavior, layout, navigation, and permissions.
- Separate presentation-only differences from business behavior differences.
- Identify whether the mobile page uses a distinct page ID or resource namespace.
- Record target-specific custom slots and methods.

## Runtime evidence

- Capture representative screenshots or DOM structure when visual equivalence matters.
- Record network requests and responses for list and mutation workflows.
- Record permission-denied, validation, empty-data, loading, and error behavior.
- Record browser/device constraints that cannot be verified statically.

## Inventory outcome

Before migration, state:

1. The current source of truth.
2. The proposed v7 source file and identity.
3. Behaviors that map directly.
4. Behaviors requiring slots, overrides, UI mode, or supporting source changes.
5. Unknowns blocking safe deletion or database synchronization.

