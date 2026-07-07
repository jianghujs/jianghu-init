/**
 * V7 UI 模式页面示例：直接写 pageContent / actionContent 组件树（不经 fields/views 展开）
 *
 * 适用：非标准 CRUD、营销页、复杂自定义布局。
 */
const content = {
  version: 'v7',
  page: {
    id: 'fullUiPageExample',
    name: 'V7 UI 页面示例',
    targets: 'both',
  },

  includeList: [
    { type: 'css', path: '/page/fullUiPage/style.css' },
    { type: 'html', path: 'page/fullUiPage/widget.html', target: 'mobile' },
  ],

  resourceList: [],

  pageContent: {
    component: 'VStack',
    props: { gap: 12, class: 'p-3' },
    children: [
      {
        component: 'PageHeader',
        props: {
          title: '自定义仪表盘',
          helpBtn: true,
          helpSrc: 'https://openjianghu.org/',
        },
      },
      {
        component: 'HStack',
        props: { gap: 8, align: 'center', wrap: true },
        children: [
          {
            component: 'MobileFilterBtn',
            props: {
              label: '筛选',
              showActive: true,
              activeDisplayBind: 'filterSummary',
            },
            attrs: { '@click': 'isFilterSheetShown = true' },
          },
          {
            component: 'MobileFilterBtn',
            props: { label: '组织', showActive: true },
            children: [
              `<template v-slot:active-display>
                {{ orgName }}
                <span class="bg-blue-500 text-white text-xs rounded px-1">{{ orgRoleLabel }}</span>
              </template>`,
            ],
            attrs: { '@click': 'isOrgSheetShown = true' },
          },
          { component: 'VSpacer' },
          {
            component: 'MobileActions',
            props: {
              actionList: [
                { label: '刷新', uiAction: 'refresh', color: 'primary' },
                { label: '导出', uiAction: 'export', visibleWhen: 'canExport' },
              ],
            },
          },
        ],
      },
      {
        component: 'Box',
        props: { class: 'rounded border p-4 min-h-[120px]' },
        children: [
          '<div class="text-gray-500">此处可嵌原始 HTML 字符串子节点</div>',
        ],
      },
    ],
  },

  actionContent: [
    {
      component: 'FormSheet',
      key: 'filter',
      props: {
        title: '筛选',
        rounded: true,
        hiddenBtn: false,
        fieldList: [
          { key: 'keyword', label: '关键词', type: 'text' },
          { key: 'status', label: '状态', type: 'select', options: 'constantObj.statusList' },
        ],
      },
    },
    {
      component: 'Sheet',
      key: 'org',
      props: {
        title: '选择组织',
        rounded: true,
        actionList: [
          { label: '确定', uiAction: 'confirmOrg', color: 'primary' },
        ],
        cols: 1,
      },
    },
  ],

  common: {
    data: {
      filterSummary: '3 个条件',
      orgName: '华东事业部',
      orgRoleLabel: '管理员',
      isFilterSheetShown: false,
      isOrgSheetShown: false,
      canExport: true,
      constantObj: {
        statusList: ['启用', '停用'],
      },
    },
    methods: {},
    doUiAction: {
      refresh: [],
      export: [],
      confirmOrg: [],
    },
  },
};

module.exports = content;
