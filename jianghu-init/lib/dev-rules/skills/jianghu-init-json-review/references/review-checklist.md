# Review Checklist

Select only the sections matching the file under review. Do not apply v7-only requirements to legacy files.

## 1. Common classification

- Identify version: v7 or legacy.
- Identify owner: Page or Component.
- Identify mode: CRUD or UI.
- Identify requested targets: PC, mobile, or both.
- Identify source and generated output paths.
- Determine whether the task is review-only or includes authorization to fix.

## 2. V7 Page CRUD

- Require `version: 'v7'`, explicit CRUD mode, `page.id`, fields, and a valid data source.
- Reject top-level UI `pageContent` mixed into CRUD authoring.
- Verify list/create/update views reference declared fields.
- Verify visible columns are not assumed to be all writable fields.
- Verify search/filter operators, pagination, primary key, and resource behavior against project evidence.
- Verify every business action has non-empty `label + uiAction` and no semantic `intent/id/actionId`.
- Verify new v7 source uses canonical keys (`columnList`, `headActionList`, `rowActionList`, `fieldList`, `actionList`, `tabList`, `mobileSheet`) and report deprecated-key warnings.
- Verify slots and PC/mobile overrides use supported locations.
- Verify targets and platform policy produce the intended route and layout.

## 3. V7 Page UI

- Require a valid page identity and explicit component-tree source.
- Reject CRUD fields/views mixed into UI authoring.
- Verify component names, props, bindings, events, children, and action content against compiler examples or project usage.
- Resolve includes, child components, methods, computed state, watchers, and injected/provided values.
- Verify resource/service actions used by custom methods are registered and permission-safe.
- Validate target-specific composition independently.

## 4. V7 Component CRUD

- Require `pageType: 'jh-component'`, CRUD mode, and `component.path`.
- Reject component `page.id` and `resourceList`.
- Verify the host Page supplies runtime page identity and registers required resources.
- Verify `common.props`, host bindings, emitted events, and data-source filters.
- Verify embedded height, pagination, and list scrolling in the host layout.
- Verify target support using the current component rule rather than assuming Page target fields.

## 5. V7 Component UI

- Require `component.path` and explicit UI structure.
- Reject component-owned page identity and permissions.
- Verify props, emits, provide/inject behavior, includes, and child component paths.
- Verify host layout constraints and target-specific rendering.
- Check that reusable component behavior does not depend on a hard-coded host page ID.

## 6. Legacy files

- Preserve fields required by their version and existing compiler path.
- Do not demand v7 `component.path`, CRUD mode, or action structure unless the task is an explicit migration.
- Report legacy risk separately from a current defect.
- Check generated output against the actual legacy compiler behavior.

## 7. References and contracts

- Resolve include files and component paths.
- Verify field keys against SQL/schema/model evidence when available.
- Verify UI method and service-function names exist.
- Verify resource action names and permission ownership.
- Verify callers of page IDs, component paths, routes, props, and emitted events.
- Report missing evidence instead of inventing a contract.

## 8. Targets and generated output

- Compile or inspect every requested target when non-mutating validation is available.
- Compare page IDs, routes, list/form structure, actions, slots, methods, and includes.
- Check mobile list/card fields, sheet behavior, page height, scrolling, and touch interaction.
- Treat generated HTML differences as evidence; locate the source defect in init-json or compiler code.
- For v7, distinguish deprecated-key Warning from structural Error; supported old keys may run, but should not be recommended in new source.
- Do not recommend long-term direct edits to generated HTML.

## 9. Database and operational safety

- Distinguish read-only validation from commands that synchronize `_page` or `_resource`.
- Do not run database-writing generation in a review-only task without authorization.
- Flag resource ID, permission, schema, or production-environment risk explicitly.
- Record validation that was skipped because configuration or a safe environment was unavailable.

## 10. Review output

- Lead with actionable findings ordered by severity.
- Include precise file and line references.
- Separate confirmed defects from questions and residual risks.
- State the evidence level for claims involving compilation, database state, or runtime behavior.
- If no defect is found, say so and list unperformed validation.
