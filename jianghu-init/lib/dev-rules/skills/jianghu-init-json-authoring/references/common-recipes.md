# Common Authoring Recipes

These are inspection and customization references, not the primary creation path and not a replacement for the canonical v7 field reference. For a new standard table CRUD, use the Jianghu Init table generator first. Use these recipes to review generated output, make business-specific changes, repair a verified generator defect, or work when generation is unavailable.

## Standard CRUD page

Expected shape when one page owns a table/model workflow. Do not copy it by hand when the table generator is available:

```js
module.exports = {
  version: 'v7',
  pageType: 'jh-page',
  mode: 'crud',
  page: { id: 'itemManagement', name: '条目管理', targets: 'pc' },
  resourceList: [
    { actionId: 'selectItemList', resourceType: 'sql', resourceData: { table: 'item', operation: 'select' } },
    { actionId: 'insertItem', resourceType: 'sql', resourceData: { table: 'item', operation: 'jhInsert' } },
    { actionId: 'updateItem', resourceType: 'sql', resourceData: { table: 'item', operation: 'jhUpdate' } },
    { actionId: 'deleteItem', resourceType: 'sql', resourceData: { table: 'item', operation: 'jhDelete' } },
  ],
  dataSource: { table: 'item' },
  fields: {
    itemId: { label: '条目ID' },
    name: { label: '名称', required: true },
  },
  views: {
    list: { columns: ['itemId', 'name'] },
    create: { fields: ['name'] },
    update: { fields: ['name'] },
  },
};
```

Confirm the table fields, primary key, required operations, generated resource behavior, and current dataSource syntax from the project before using the shape. Remove resource entries for operations the requested page does not expose.

## Dual-target CRUD page

Start from the standard CRUD page and set the supported page target field to `both`. Keep shared fields and views common. Add platform policy only for genuine differences:

```js
page: { id: 'itemManagement', name: '条目管理', targets: 'both' },
platform: {
  pc: { list: 'Table', create: 'CreateDrawer', update: 'UpdateDrawer' },
  mobile: { list: 'List', create: 'CreateSheet', update: 'UpdateSheet' },
},
```

Do not create a second `jh-mobile-page` for a new page unless route or business behavior must remain independent.

## CRUD component

Use for reusable embedded list/form behavior:

```js
module.exports = {
  version: 'v7',
  pageType: 'jh-component',
  mode: 'crud',
  component: { path: 'item/itemList', name: '条目列表' },
  dataSource: { table: 'item' },
  fields: {
    itemId: { label: '条目ID' },
    name: { label: '名称' },
  },
  views: {
    list: { columns: ['itemId', 'name'] },
  },
  common: {
    props: {},
  },
};
```

Do not add `page.id` or `resourceList`. Verify the host page registers required resources and passes props expected by `common.props`.

## UI page

Use when the explicit component tree is the source of truth:

```js
module.exports = {
  version: 'v7',
  pageType: 'jh-page',
  page: { id: 'itemDashboard', name: '条目看板', targets: 'pc' },
  pageContent: {
    component: 'VStack',
    children: [],
  },
  actionContent: [],
};
```

Resolve component names and props from current v7 examples. Do not add CRUD `fields/views` merely because the UI reads table data.

## Business actions

Represent semantic actions with both identity and visible text:

```js
{ label: '新增', uiAction: 'create', color: 'primary' }
{ label: '编辑', uiAction: 'update' }
{ label: '归档', uiAction: 'archiveItem', confirm: true }
```

Do not use `intent`, `id`, or `actionId` as the semantic key. Structural entries such as spacer, slot, or filter use their structural `type` instead of business-action fields.

## Custom list cell or form region

Keep the page in CRUD mode when only a local region is custom. Use the supported slot location from the canonical rule. Verify that slot names match the generated component and that PC/mobile variants are assigned to the correct target.

Escalate to `pc()`/`mobile()` overrides only when target composition differs. Escalate to UI mode only when custom composition is the page's dominant structure.
