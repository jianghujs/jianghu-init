# V7 CRUD Full Structure

This reference defines the canonical `mode: 'crud'` shape for complex JianghuJS init-json work. For a new standard table CRUD, run the Jianghu Init table generator first and inspect its output. Load this document only when the generated page needs advanced fields, tabs, slots, layout, platform policy, or PC/mobile composition overrides.

## Canonical structure

```js
module.exports = {
  version: 'v7',
  mode: 'crud',
  pageType: 'jh-page',

  page: {
    id: 'projectManagement',
    name: '项目管理',
    menu: true,
    targets: 'both',
    hook: {},
  },

  includeList: [],
  resourceList: [],

  fields: {
    projectId: {
      label: '项目ID',
      type: 'text',
      column: {
        width: 160,
        align: 'start',
        class: 'fixed',
        cellClass: 'fixed',
      },
      search: { op: 'eq' },
      form: {
        required: true,
        rules: 'validationRules.projectIdRules',
        placeholder: '请输入项目ID',
        quickAttrs: ['clearable'],
        attrs: { dense: true },
        pcAttrs: { hideDetails: false },
        mobileAttrs: { hideDetails: true },
      },
      createForm: { attrs: { readonly: true } },
      updateForm: {},
    },
  },

  views: {
    list: {
      columnList: [
        'projectId',
        { field: 'projectName', width: 240, align: 'start' },
      ],
      mobileColumnList: ['projectName', 'status'],
      headActionList: [
        { label: '新增', uiAction: 'create', color: 'primary' },
      ],
      rowActionList: [
        { label: '编辑', uiAction: 'update' },
        { label: '删除', uiAction: 'delete' },
      ],
      search: {
        keyword: {
          fields: ['projectName', 'projectId'],
          placeholder: '搜索项目',
        },
        fieldList: ['status', 'projectType'],
        btnText: '查询',
        btnIcon: 'search',
        mobileBtnText: '筛选',
        mobileBtnIcon: 'filter-2',
        mobileSheet: {
          title: '列表筛选',
          persistent: false,
          maxBodyHeight: 'calc(100vh - 120px)',
          bodyHeightMode: 'content', // SearchSheet 默认；可省略
        },
      },
      filter: {
        keyword: { fields: ['projectName'], placeholder: '筛选当前页' },
        fields: ['status'],
      },
      orderBy: [{ column: 'projectName', order: 'asc' }],
      serverPagination: true,
      pageSize: 50,
      selectable: true,
      mobileItemAction: false,
      dataTableProps: {},
    },

    create: {
      title: '新建项目',
      fieldList: ['projectId', 'projectName', 'status'],
      interaction: {
        status: { visibleWhen: 'isOutsource' },
      },
      beforeCloseConfirm: true,
      actionList: [
        { label: '保存', uiAction: 'create', color: 'primary' },
      ],
      mobileSheet: {
        persistent: true,
        maxBodyHeight: 'calc(100vh - 102px)',
        // bodyHeightMode 默认 fill，可省略
      },
    },

    update: {
      title: '编辑项目',
      tabList: [
        {
          key: 'basicInfo',
          title: '基础信息',
          fieldList: ['projectId', 'projectName', 'status'],
          interaction: {},
          actionList: [
            { label: '保存', uiAction: 'update', color: 'primary' },
          ],
        },
      ],
      beforeCloseConfirm: true,
      mobileSheet: {
        maxBodyHeight: 'calc(100vh - 152px)',
      },
    },
  },

  dataSource: {
    table: 'project',
    primaryKey: 'projectId',
    listResource: 'selectItemList',
    createResource: 'insertItem',
    updateResource: 'updateItem',
    deleteResource: 'deleteItem',
  },

  common: {
    data: {},
    computed: {},
    watch: {},
    methods: {},
    doUiAction: {},
  },
};
```

## Field boundaries

- Keep field identity in the `fields` dictionary key and display identity in `label`.
- Keep field-level `type` at the field root. `form.type` may override the control only for a form-specific difference.
- Put PC table header properties under `column`: `width`, `align`, `class`, and `cellClass`.
- Put search behavior under `search`; `op` defaults to ordinary text-search behavior when omitted.
- Put shared form behavior under `form`; layer `createForm` and `updateForm` over it for operation-specific differences.
- `columnList` entries may be a field key or one flat object such as `{ field, width, align, class, cellClass }`. Do not add another nested `column` object there.

## View boundaries

- `views.list.columnList` controls PC table columns; `mobileColumnList` controls mobile list fields.
- `views.list.search` is server-side query configuration. Its fixed form fields use `fieldList`; keyword metadata remains under `keyword`.
- `views.list.filter` filters already loaded PC rows and does not replace server search.
- `views.create` and `views.update` use `fieldList` for a single form. Use `tabList` only when the update view genuinely has multiple groups.
- Each business action requires a non-empty `label` and `uiAction`. Standard CRUD tokens are `create`, `update`, and `delete`; a custom token must resolve through `doUiAction`.
- Structural action entries with `type: 'spacer' | 'slot' | 'filter'` are the only action-list entries exempt from `label` and `uiAction`.

## Optional advanced structure

Add these sections only for a verified requirement:

- `slots.list.pc/mobile.children`, `slots.create.pc/mobile.children`, or tab-specific update slots for local template customization.
- `layout` for column counts, list regions, tree/table composition, or platform variants.
- `platform.pc/mobile` to replace default Table/List and Drawer/Sheet component tokens.
- `pc(views, blocks)` and `mobile(views, blocks)` only when default composition cannot express the layout. Preserve `blocks.list` when the page still owns a list.
- `mobileSheet` only for mobile Sheet behavior; its ordinary public controls are `persistent`, `maxBodyHeight`, and `bodyHeightMode: 'fill' | 'content'`. **Sheet/FormSheet default `fill`** (omit unless you need `content`); **SearchSheet default `content`**.

Do not make these optional sections part of every generated CRUD file. The standard generator intentionally emits the smaller canonical structure and AI should add advanced sections only for business differences.

## Canonical key policy

New and modified configuration must use canonical keys:

| Canonical | Legacy compatibility only |
|---|---|
| `columnList` | `columns` |
| `mobileColumnList` | `mobileColumns` |
| `headActionList` | `toolbarActions` |
| `rowActionList` | `rowActions` |
| `fieldList` | view-level `fields` |
| `actionList` | `actions` |
| `tabList` | `tabs` |
| `beforeCloseConfirm` | `saveTipBeforeClose` |
| `mobileSheet` | `sheet` |

The compiler may normalize legacy keys and emit compact diagnostics, but generators, rules, examples, and AI-authored changes must not produce them.
