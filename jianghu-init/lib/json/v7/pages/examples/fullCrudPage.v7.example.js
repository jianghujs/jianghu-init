/**
 * V7 CRUD 页面「全集」示例（可复制为业务 init-json 起点）
 *
 * 涵盖：fields、views（list/create/update+tabs）、interaction、slots、layout.regions、
 * platform、sheet overlay、includeList 分端、pc/mobile 覆写、MobileFilterBtn active-display 插槽。
 *
 * 自检：node lib/json/v7/pages/examples/validate-examples.js
 */
const content = {
  version: 'v7',
  mode: 'crud',
  pageType: 'jh-page',

  page: {
    id: 'fullCrudPageExample',
    name: 'V7 CRUD 全集示例',
    menu: true,
    targets: 'both',
    hook: {},
    vuetify: {},
  },

  includeList: [
    { type: 'css', path: '/page/fullCrudPage/common.css' },
    { type: 'html', path: 'page/fullCrudPage/pc-only.html', target: 'pc' },
    { type: 'html', path: 'page/fullCrudPage/mobile-only.html', target: 'mobile' },
    { type: 'js', path: '/page/fullCrudPage/extra.js', target: ['pc', 'mobile'] },
  ],

  resourceList: [
    { code: 'fullCrudPageExample', name: 'V7 CRUD 全集示例' },
  ],

  // ─── fields：字典（被 views 引用）────────────────────────────────────────
  fields: {
    projectId: {
      label: '项目ID',
      type: 'text',
      width: 160,
      class: 'fixed',
      cellClass: 'fixed',
    },
    projectName: {
      label: '项目名称',
      type: 'text',
      required: true,
      placeholder: '请输入项目名称',
    },
    projectType: {
      label: '项目类型',
      type: 'select',
      options: 'constantObj.projectType',
      op: 'eq',
    },
    status: {
      label: '状态',
      type: 'select',
      options: 'constantObj.projectStatus',
    },
    remark: {
      label: '备注',
      type: 'textarea',
      attrs: { rows: 3 },
      pc: { rows: 5 },
      mobile: { rows: 4 },
    },
  },

  // ─── views ───────────────────────────────────────────────────────────────
  views: {
    list: {
      columns: [
        'projectId',
        { field: 'projectName', width: 240 },
        'status',
      ],
      mobileColumns: ['projectName', 'status', 'projectType'],
      toolbarActions: [
        { intent: 'create', label: '新增', color: 'primary' },
        { intent: 'delete', label: '批量删除', visibleWhen: 'hasSelection' },
      ],
      rowActions: [
        { intent: 'update', label: '编辑', key: 'edit' },
        { intent: 'delete', label: '删除', key: 'del' },
      ],
      search: {
        keyword: { fields: ['projectName', 'projectId'], placeholder: '搜索项目' },
        fields: ['status', 'projectType'],
      },
      filter: {
        keyword: { fields: ['projectName'], placeholder: '筛选当前页' },
        fields: ['status'],
      },
      orderBy: [{ column: 'projectName', order: 'asc' }],
      serverPagination: true,
      pageSize: 50,
      selectable: true,
      mobileSearchKey: 'listSearch',
      mobileSearchBtnText: '筛选',
      mobileSearchTitle: '列表筛选',
      mobileSearchIcon: 'filter-2',
      searchSheet: {
        persistent: false,
        autoHeight: true,
        viewportOffset: 120,
      },
    },

    create: {
      type: 'form',
      title: '新建项目',
      fields: ['projectId', 'projectName', 'projectType', 'status', 'remark'],
      interaction: {
        projectName: { readonlyWhen: 'isFinished' },
        status: {
          visibleWhen: 'isOutsource',
          disabledWhen: "status === '已归档'",
        },
      },
      fieldAttrs: {
        projectId: { readonly: true },
      },
      saveTipBeforeClose: true,
      actions: [
        { label: '保存', intent: 'create', color: 'primary' },
        { label: '取消', intent: 'cancel', color: 'secondary', visibleWhen: 'false' },
      ],
      sheet: {
        persistent: true,
        autoHeight: true,
        viewportOffset: 102,
        minCardHeight: '100px',
      },
    },

    update: {
      title: '编辑项目',
      tabs: [
        {
          key: 'basicInfo',
          type: 'form',
          title: '基础信息',
          fields: ['projectId', 'projectName', 'status', 'remark'],
          interaction: {
            projectName: { readonlyWhen: 'isFinished' },
            status: { visibleWhen: 'isOutsource' },
          },
          actions: [{ label: '保存', intent: 'update', color: 'primary' }],
        },
        {
          key: 'extensionInfo',
          title: '扩展信息',
          fields: ['projectType'],
        },
      ],
      sheet: {
        autoHeight: true,
        viewportOffset: 152,
      },
    },
  },

  // ─── slots（完整 template 字符串；业务可替换为真实 slot 内容）────────────
  slots: {
    list: {
      pc: {
        children: [
          '<template v-slot:body="{ item }"><span class="text-primary">{{ item.projectName }}</span></template>',
        ],
      },
      mobile: {
        children: [
          '<template v-slot:body="{ item }"><div class="font-bold">{{ item.projectName }}</div></template>',
        ],
      },
    },
    create: {
      pc: {
        children: [
          '<template v-slot:field-projectName="{ field, value, onChange }"><!-- 自定义 projectName --></template>',
        ],
      },
    },
    update: {
      basicInfo: {
        pc: {
          children: [
            '<template v-slot:label-status="{ field }">状态★</template>',
          ],
        },
      },
    },
  },

  // ─── layout / platform（可省略，此处演示覆盖）──────────────────────────────
  layout: {
    list: {
      cols: 2,
      treeWidth: '300px',
      regions: {
        treePanel: { role: 'tree' },
        mainTable: { role: 'table' },
      },
      variants: {
        mobile: {
          remark: { span: 2 },
          status: { span: 2 },
        },
      },
    },
    create: { cols: 3 },
    update: { cols: 3 },
  },

  platform: {
    pc: {
      list: 'Table',
      create: 'CreateDrawer',
      update: 'UpdateDrawer',
    },
    mobile: {
      list: 'List',
      create: 'CreateSheet',
      update: 'UpdateSheet',
    },
  },

  // ─── 双端布局覆写（可选；默认 expand 已生成 blocks）────────────────────────
  pc: (views, blocks) => ({
    pageContent: {
      component: 'VStack',
      props: { gap: 8 },
      children: [blocks.pageHeader, blocks.list].filter(Boolean),
    },
    actionContent: [blocks.create, blocks.update].filter(Boolean),
  }),

  mobile: (views, blocks) => ({
    pageContent: {
      component: 'VStack',
      children: [
        blocks.composeToolbar([
          {
            component: 'MobileFilterBtn',
            props: { label: '组织', showActive: true },
            children: [
              `<template v-slot:active-display>
                {{ currentOrgInfo.orgName }}
                <span class="bg-green-500 text-white rounded px-0.5">
                  {{ constant.showOrgMemberSimpleType.find(e => e.value == showOrgMemberType)?.text || showOrgMemberType }}
                </span>
              </template>`,
            ],
            attrs: { '@click': 'isOrgPickerShown = true' },
          },
          blocks.searchBtn,
          blocks.toolbarSpacer,
          blocks.toolbarActions,
        ].filter(Boolean), { props: { justify: 'space-between', gap: 8 } }),
        blocks.list,
      ].filter(Boolean),
    },
    actionContent: [blocks.create, blocks.update, blocks.searchSheet].filter(Boolean),
  }),

  dataSource: {
    table: 'project',
    primaryKey: 'projectId',
    listResource: 'getProjectList',
    createResource: 'createProject',
    updateResource: 'updateProject',
    deleteResource: 'deleteProject',
  },

  common: {
    data: {
      constantObj: {
        projectType: ['内部项目', '外部项目'],
        projectStatus: ['草稿', '进行中', '已归档'],
        showOrgMemberSimpleType: [
          { value: 'all', text: '全部' },
          { value: 'direct', text: '直属' },
        ],
      },
      currentOrgInfo: { orgName: '示例组织' },
      showOrgMemberType: 'direct',
      isFinished: false,
      isOutsource: true,
      hasSelection: false,
      isOrgPickerShown: false,
      validationRules: {
        requireRules: [v => !!v || '必填'],
      },
    },
    computed: {},
    watch: {},
    methods: {
      prepareTableParams() {},
    },
    doUiAction: {},
  },
};

module.exports = content;
