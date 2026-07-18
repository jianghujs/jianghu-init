/**
 * V7 semantic config 设计记录（已实施）。
 *
 * 基线：fullCrudPage.v7.example.js（2026-07-17）。
 * 用途：保留命名、结构和语义设计决策；正式规范以 docs/config-reference.md 为准。
 * 约束：
 *   - 本文件仍不接入示例自动校验或生成器。
 *   - 旧 key 由统一归一化层兼容并输出 warning。
 * 注释标签：
 *   - 草案改名：现行 key 改成新的 canonical key，需要 alias 兼容。
 *   - 草案分组：现行平铺 key 收入职责对象，需要结构规范化。
 *   - 草案新增：现行规范没有该能力，需要 compiler/runtime 支持。
 *   - 已实施：canonical key 已进入 compiler/runtime/Schema/VSCode。
 */

/**
 * V7 CRUD 页面「全集」基线内容。
 *
 * 涵盖：fields、views（list/create/update+tabs）、interaction、slots、layout.regions、
 * platform、mobileSheet overlay、includeList 分端、pc/mobile 覆写、MobileFilterBtn active-display 插槽。
 *
 * 当前正式、可执行示例见同级 fullCrudPage.v7.example.js。
 */
const content = {
  version: 'v7',
  mode: 'crud',
  pageType: 'jh-page',

  page: {
    id: 'fullCrudPageExample',
    name: 'V7 CRUD 全集示例',
    menu: true,
    // 保持现行 key：声明整份配置的生成端；targetPlatform 只供单次编译内部使用。
    targets: 'both',
    hook: {},
    vuetify: {},
    // 保持现行 key：false 可省略；true 时显示帮助入口。
    helpDoc: false,
    // 已实施：page.template 使用 { pc, mobile }；旧字符串写法仅兼容。
    template: {
      pc: 'jhTemplateV6',
      mobile: 'jhMobileTemplateV6',
    },
  },

  includeList: [
    {
      type: 'js', path: '/page/fullCrudPage/extra.js',
      // 已实施：includeList[].targets 与 page.targets 对齐；旧 target 仅兼容。
      targets: 'both',
    },
  ],

  resourceList: [
    { code: 'fullCrudPageExample', name: 'V7 CRUD 全集示例' },
  ],

  // ─── fields：字典（被 views 引用）────────────────────────────────────────
  fields: {
    projectId: {
      label: '项目ID',
      // 保持现行 key：字段默认类型；form/createForm/updateForm.type 可按场景覆盖。
      type: 'text',
      // type: section / divider / tip 或普通表单项额外 class
      cls: 'mb-2',
      // 草案分组：width/align/class/cellClass → fields.*.column。
      // 用作列默认值，最终与 { value: fieldKey, text: label } 合并。
      column: {
        width: 160,
        align: 'start',
        class: 'fixed',
        cellClass: 'fixed',
      },
      // 仅业务id字段使用，需要搭配 insert resource 的 beforehook
      autoId: {
        type: 'common',
        prefix: 'P',
        start: 1,
      },
      // 草案分组：op → fields.*.search.op，供 search/filter 引用字段时复用。
      search: {
        op: 'eq',
      },

      // 草案分组：表单专用 key 收入 fields.*.form。
      form: {
        // 草案新增：form.type 覆盖字段根级 type。
        type: 'select',
        // 草案分组：options → form.options；仅覆盖表单 select 选项。
        options: 'constantObj.status',
        // 草案分组：component → form.component；type:'custom' 时使用。
        component: 'project-selector',
        // 草案分组：required/readonly → form.required/form.readonly。
        required: true,
        // 草案新增：仅控制 label 必填标记；省略时跟随 required。
        labelRequired: true,
        readonly: false,

        // 草案分组：rules/placeholder → form.rules/form.placeholder。
        rules: 'validationRules.projectIdRules',
        placeholder: '请输入项目ID',

        // 草案分组：quickAttrs/attrs → form.quickAttrs/form.attrs。
        quickAttrs: ['clearable'],
        attrs: {
          dense: true,
          outlined: true,
        },

        // 草案改名并分组：pc → form.pcAttrs；直接 merge 到 form.attrs。
        pcAttrs: {
          hideDetails: false,
        },

        // 草案改名并分组：mobile → form.mobileAttrs；直接 merge 到 form.attrs。
        mobileAttrs: {
          hideDetails: true,
        },
      },
      // 草案新增：createForm 仅覆盖新增表单，深度 merge 到 form。
      // 职责迁移：views.create.fieldAttrs.projectId → fields.projectId.createForm。
      // 已实施：结构归一化迁移旧 fieldAttrs，新配置只写 createForm。
      createForm: {
        readonly: true,
      },
      // 草案新增：updateForm 仅覆盖编辑表单，深度 merge 到 form。
      updateForm: {},

    },
  },

  // ─── views ───────────────────────────────────────────────────────────────
  views: {
    list: {
      // 草案改名：columns → columnList。
      // 字符串引用 fields；对象项直接覆盖 fields[field].column。
      columnList: [
        'projectId',
        {
          field: 'projectName',
          width: 160,
          align: 'start',
          class: 'fixed',
          cellClass: 'fixed',
        },
        'status',
      ],
      // 草案改名：mobileColumns → mobileColumnList；省略时回退 columnList。
      mobileColumnList: ['projectName', 'status', 'projectType'],
      // 草案改名：toolbarActions → headActionList；避免语义依赖 toolbar 组件。
      headActionList: [
        { uiAction: 'create', label: '新增', color: 'primary' },
        { uiAction: 'delete', label: '批量删除', visibleWhen: 'hasSelection' },
      ],
      // 草案改名：rowActions → rowActionList。
      rowActionList: [
        { uiAction: 'update', label: '编辑', key: 'edit' },
        { uiAction: 'delete', label: '删除', key: 'del' },
      ],
      // 服务端搜索，pc、移动端公用
      search: {
        keyword: { fields: ['projectName', 'projectId'], placeholder: '搜索项目' },
        fieldList: ['status', 'projectType'],
        // 已实施：PC jh-search 按钮文案。
        btnText: '查询',
        // 已实施：PC jh-search 按钮图标。
        btnIcon: 'search',
        // 草案改名并分组：mobileSearchBtnText → search.mobileBtnText。
        mobileBtnText: '筛选',
        // 草案改名并分组：mobileSearchIcon → search.mobileBtnIcon。
        mobileBtnIcon: 'filter-2',
        // 草案分组：mobileSearchTitle + searchSheet → search.mobileSheet。
        mobileSheet: {
          // 草案改名并分组：mobileSearchTitle → search.mobileSheet.title。
          title: '列表筛选',
          // canonical Sheet 高度模型。
          persistent: false,
          maxBodyHeight: 'calc(100vh - 120px)',
          bodyHeightMode: 'content',
        },
        // 草案删除：mobileSearchKey 不再作为业务配置，内部使用稳定默认 key。
      },
      // pc 端table已有结果计算筛选专用
      filter: {
        keyword: { fields: ['projectName'], placeholder: '筛选当前页' },
        fields: ['status'],
      },
      // 初始化 orderBy
      orderBy: [{ column: 'projectName', order: 'asc' }],
      serverPagination: true,
      pageSize: 50,
      selectable: true,
      // 保持现行 key：false/'none' 禁止点击；其他字符串触发对应 uiAction。
      mobileItemAction: false,
      // 保持现行 key：仅 PC 透传 v-data-table 的非托管 props。
      dataTableProps: {},
    },

    create: {
      // 草案删除：create.type:'form' 不提供额外语义，create 本身即表单 view。
      title: '新建项目',
      // 草案改名：create.fields → create.fieldList。
      // 旧 create.fields 由 alias 兼容。
      fieldList: ['projectId', 'projectName', 'projectType', 'status', 'remark'],
      // 保持现行 key：仅描述 create view 内的动态字段关系。
      // 字段静态差异统一放 fields.*.createForm，不再使用 create.fieldAttrs。
      interaction: {
        projectName: { readonlyWhen: 'isFinished' },
        status: {
          visibleWhen: 'isOutsource',
          disabledWhen: "status === '已归档'",
        },
      },
      // 草案删除：create.fieldAttrs → fields.*.createForm，避免两处表达静态覆盖。
      // 旧 fieldAttrs 在 alias 后迁移，以 fields 配置为准。
      // 草案改名：saveTipBeforeClose → beforeCloseConfirm，与组件 prop 对齐。
      // 旧 saveTipBeforeClose 由 alias 兼容。
      beforeCloseConfirm: true,
      // 草案改名：create.actions → create.actionList。
      // 旧 create.actions 由 alias 兼容。
      actionList: [
        { label: '保存', uiAction: 'create', color: 'primary' },
        { label: '取消', uiAction: 'cancel', color: 'secondary', visibleWhen: 'false' },
      ],
      // 草案改名：create.sheet → create.mobileSheet，明确该配置仅作用于移动端 FormSheet。
      // 旧 create.sheet 由 alias 兼容；PC CreateDrawer 不读取该配置。
      mobileSheet: {
        persistent: true,
        maxBodyHeight: 'calc(100vh - 102px)',
        bodyHeightMode: 'fill',
      },
    },

    update: {
      title: '编辑项目',
      // 草案改名：update.tabs → update.tabList。
      // tabList 与 fieldList 二选一；复杂编辑表单使用 tabList。
      // 旧 update.tabs 由 alias 兼容；简单表单可直接使用 update.fieldList。
      tabList: [
        {
          key: 'basicInfo',
          // 草案删除：tab.type:'form' 不提供额外语义，tab 默认承载表单字段。
          title: '基础信息',
          // 草案改名：update.tabs[].fields → update.tabList[].fieldList。
          // 旧 tab.fields 由 alias 兼容。
          fieldList: ['projectId', 'projectName', 'status', 'remark'],
          // 保持现行 key：仅描述当前 tab 内的动态字段关系。
          interaction: {
            projectName: { readonlyWhen: 'isFinished' },
            status: { visibleWhen: 'isOutsource' },
          },
          // 草案改名：update.tabs[].actions → update.tabList[].actionList。
          // 旧 tab.actions 由 alias 兼容。
          actionList: [{ label: '保存', uiAction: 'update', color: 'primary' }],
        },
        {
          key: 'extensionInfo',
          title: '扩展信息',
          // 草案改名：update.tabs[].fields → update.tabList[].fieldList。
          // 旧 tab.fields 由 alias 兼容。
          fieldList: ['projectType'],
        },
      ],
      // 草案改名：update.sheet → update.mobileSheet，明确该配置仅作用于移动端 FormSheet。
      // 旧 update.sheet 由 alias 兼容；PC UpdateDrawer 不读取该配置。
      mobileSheet: {
        maxBodyHeight: 'calc(100vh - 152px)',
        bodyHeightMode: 'fill',
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
