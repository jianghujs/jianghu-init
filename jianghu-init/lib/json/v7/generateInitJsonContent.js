'use strict';

const _ = require('lodash');

const OPERATION_COLUMNS = new Set([
  'operation', 'operationByUserId', 'operationByUser', 'operationAt', 'id',
]);

const SELECT_NAME_RE = /(?:status|state|type|gender|level|category|kind)$/i;

const formatObject = (obj, indent = 2) => (
  JSON.stringify(obj, null, indent).replace(/"([^"]+)":/g, '$1:')
);

const inferFieldType = col => {
  const dataType = String(col.DATA_TYPE || '').toLowerCase();
  const name = col.COLUMN_NAME || '';

  if (/int|decimal|numeric|float|double|real|bigint|smallint|tinyint/.test(dataType)) {
    if (dataType === 'tinyint' && SELECT_NAME_RE.test(name)) return 'select';
    return 'number';
  }
  if (/date|time|year/.test(dataType)) return 'date';
  if (SELECT_NAME_RE.test(name)) return 'select';
  return 'text';
};

const buildFieldDef = col => {
  const key = col.COLUMN_NAME;
  const label = (col.COLUMN_COMMENT || key || '').trim() || key;
  const type = inferFieldType(col);
  const field = { label, type };
  if (type === 'select') {
    field.options = `constantObj.${key}`;
  }
  return { key, field };
};

const resolvePrimaryKey = (columns, table) => {
  const names = columns.map(c => c.COLUMN_NAME);
  if (names.includes('id')) return 'id';
  const guess = `${_.camelCase(table)}Id`;
  if (names.includes(guess)) return guess;
  const idLike = names.find(n => /Id$/.test(n));
  if (idLike) return idLike;
  return names[0] || 'id';
};

const buildFieldsFromColumns = columns => {
  const fields = {};
  const constantObj = {};
  const entries = [];

  for (const col of columns) {
    if (!col.COLUMN_NAME || OPERATION_COLUMNS.has(col.COLUMN_NAME)) continue;
    const { key, field } = buildFieldDef(col);
    fields[key] = field;
    entries.push({ key, field, col });
    if (field.type === 'select') {
      constantObj[key] = ['选项A', '选项B'];
    }
  }
  return { fields, constantObj, entries };
};

const pickSearchTextFields = entries => (
  entries.filter(e => e.field.type === 'text').slice(0, 3).map(e => e.key)
);

const buildResourceList = (table, actionIds) => [
  {
    actionId: actionIds.list,
    resourceType: 'sql',
    desc: '查询列表',
    resourceData: { table, operation: 'select' },
  },
  {
    actionId: actionIds.create,
    resourceType: 'sql',
    desc: '新增',
    resourceData: { table, operation: 'jhInsert' },
  },
  {
    actionId: actionIds.update,
    resourceType: 'sql',
    desc: '更新',
    resourceData: { table, operation: 'jhUpdate' },
  },
  {
    actionId: actionIds.del,
    resourceType: 'sql',
    desc: '删除',
    resourceData: { table, operation: 'jhDelete' },
  },
];

const buildCrudViews = (fieldKeys, searchTextFields) => {
  const listColumns = fieldKeys.slice(0, 8);
  const formFields = fieldKeys.slice(0, 12);
  const views = {
    list: {
      columns: listColumns.length ? listColumns : fieldKeys,
      toolbarActions: [{ intent: 'startCreateItem', label: '新增' }],
      rowActions: [
        { intent: 'startUpdateItem', label: '编辑' },
        { intent: 'deleteItem', label: '删除' },
      ],
      serverPagination: true,
      pageSize: 50,
    },
    create: {
      type: 'form',
      title: '新增',
      fields: formFields.length ? formFields : fieldKeys,
      actions: [{ label: '保存', intent: 'createItem', color: 'primary' }],
    },
    update: {
      title: '编辑',
      fields: formFields.length ? formFields : fieldKeys,
      actions: [{ label: '保存', intent: 'updateItem', color: 'primary' }],
    },
  };

  if (searchTextFields.length) {
    views.list.search = {
      keyword: { fields: searchTextFields, placeholder: '关键字搜索' },
    };
  }
  return views;
};

/** mode:crud 默认 pc/mobile 布局覆写（与 projectManagement.v7.sample 一致） */
const CRUD_PC_MOBILE_OVERRIDES = `
  pc: (views, blocks) => ({
    pageContent: {
      component: 'VStack',
      children: [blocks.pageHeader, blocks.list].filter(Boolean),
    },
    actionContent: [blocks.create, blocks.update].filter(Boolean),
  }),
  mobile: (views, blocks) => ({
    pageContent: {
      component: 'VStack',
      children: [
        blocks.composeToolbar([
          blocks.toolbarActions,
          blocks.toolbarSpacer,
          blocks.searchBtn,
        ], { props: { justify: 'space-between' } }),
        blocks.list,
      ].filter(Boolean),
    },
    actionContent: [blocks.create, blocks.update, blocks.searchSheet].filter(Boolean),
  }),
`;

const buildV7CrudContent = ({
  pageType,
  pageId,
  pageName,
  table,
  columns,
  componentPath,
}) => {
  const isComponent = pageType === 'jh-component';
  const { fields, constantObj, entries } = buildFieldsFromColumns(columns);
  const fieldKeys = entries.map(e => e.key);
  const primaryKey = resolvePrimaryKey(columns, table);
  const searchTextFields = pickSearchTextFields(entries);
  const actionIds = {
    list: 'selectItemList',
    create: 'insertItem',
    update: 'updateItem',
    del: 'deleteItem',
  };

  const head = `const content = {
  version: 'v7',
  mode: 'crud',
  pageType: '${pageType}',
`;

  const pageOrComponent = isComponent
    ? `  component: ${formatObject({
      path: componentPath,
      name: pageName || (componentPath && String(componentPath).split('/').filter(Boolean).pop()) || '组件',
      targets: 'pc',
    }, 2).split('\n').map((line, i) => (i === 0 ? line : '  ' + line)).join('\n')},
`
    : `  page: ${formatObject({ id: pageId, name: pageName, hook: {} }, 2).split('\n').map((line, i) => (i === 0 ? line : '  ' + line)).join('\n')},
  includeList: [
    { type: 'include', path: 'common/jianghuJs/fixedTableHeightV4.html', target: 'pc' },
    { type: 'include', path: 'common/jianghuJs/globalCSSJHV4.html', target: 'mobile' },
    { type: 'include', path: 'common/jianghuJs/globalCSSMediaV4.html', target: 'mobile' },
  ],
  resourceList: ${formatObject(buildResourceList(table, actionIds), 2).split('\n').map((line, i) => (i === 0 ? line : '  ' + line)).join('\n')},
`;

  const componentInclude = isComponent ? '  includeList: [],\n' : '';

  const tail = `  dataSource: ${formatObject({
    table,
    primaryKey,
    listResource: actionIds.list,
    createResource: actionIds.create,
    updateResource: actionIds.update,
    deleteResource: actionIds.del,
  }, 2).split('\n').map((line, i) => (i === 0 ? line : '  ' + line)).join('\n')},
  fields: ${formatObject(fields, 2).split('\n').map((line, i) => (i === 0 ? line : '  ' + line)).join('\n')},
  views: ${formatObject(buildCrudViews(fieldKeys, searchTextFields), 2).split('\n').map((line, i) => (i === 0 ? line : '  ' + line)).join('\n')},
${CRUD_PC_MOBILE_OVERRIDES}  common: {
    props: {},
    data: {
      constantObj: ${formatObject(constantObj, 2).split('\n').map((line, i) => (i === 0 ? line : '      ' + line)).join('\n')},
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
    },
    mounted() {
      this.$nextTick(() => {
        resetTableMaxHeight()
      })
    },
  },
};

module.exports = content;
`;

  return head + (isComponent ? pageOrComponent + componentInclude : pageOrComponent) + tail;
};

const buildV7CustomContent = ({
  pageType,
  pageId,
  pageName,
  componentPath,
}) => {
  const isComponent = pageType === 'jh-component';
  const title = pageName
    || (componentPath && String(componentPath).split('/').filter(Boolean).pop())
    || pageId
    || '组件';

  const pageContent = formatObject({
    component: 'VStack',
    props: { gap: 8 },
    children: [
      { component: 'PageTitle', props: { title } },
    ],
  }, 2);

  if (isComponent) {
    return `const content = {
  version: 'v7',
  pageType: '${pageType}',
  component: ${formatObject({
    path: componentPath,
    name: title,
    targets: 'pc',
  }, 2).split('\n').map((line, i) => (i === 0 ? line : '  ' + line)).join('\n')},
  pageContent: ${pageContent.split('\n').map((line, i) => (i === 0 ? line : '  ' + line)).join('\n')},
  includeList: [],
  common: {
    props: {},
  },
};

module.exports = content;
`;
  }

  return `const content = {
  version: 'v7',
  pageType: '${pageType}',
  page: ${formatObject({ id: pageId, name: title, hook: {}, targets: 'pc' }, 2).split('\n').map((line, i) => (i === 0 ? line : '  ' + line)).join('\n')},
  pageContent: ${pageContent.split('\n').map((line, i) => (i === 0 ? line : '  ' + line)).join('\n')},
  includeList: [],
  resourceList: [],
  common: {},
};

module.exports = content;
`;
};

module.exports = {
  buildFieldsFromColumns,
  buildV7CrudContent,
  buildV7CustomContent,
  inferFieldType,
  resolvePrimaryKey,
};
