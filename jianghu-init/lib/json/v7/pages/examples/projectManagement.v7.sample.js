const content = {
  version: 'v7',
  mode: 'crud',
  pageType: 'jh-page',
  page: {
    id: 'projectManagement',
    name: '项目管理',
    hook: {},
    vuetify: {},
  },
  includeList: [],
  resourceList: [],
  // =========================
  // fields（纯数据定义层）
  // =========================
  fields: {

    projectId: {
      label: '项目ID',
      type: 'text',
      width: 200,
      class: 'fixed',
      cellClass: 'fixed',
    },

    projectName: {
      label: '项目名称',
      type: 'text',
    },

    projectType: {
      label: '项目类型',
      type: 'select',
      options: 'constantObj.projectType'
    },

    status: {
      label: '状态',
      type: 'select',
      options: 'constantObj.projectStatus'
    }
  },

  // =========================
  // views（UI + interaction）
  // =========================
  views: {
    list: {

      columns: [ 'projectId', 'projectName', 'status' ],
      // 移动端 List：第一项为卡片标题，其余为详情；省略则仍用 columns
      mobileColumns: [ 'projectName', 'status' ],
      toolbarActions: [{intent: 'create', label: '新增'}],
      rowActions: [{intent: 'update', label: '编辑', key: 'update'}, {intent: 'delete', label: '删除', key: 'update'}],
      search: {
        keyword: { fields: ['projectName', 'projectType'], placeholder: '搜索项目' },
        fields: ['status'],
      },
      filter: {
        keyword: { fields: ['projectName', 'projectType'], placeholder: '筛选当前页' },
        fields: ['status'],
      },
      orderBy: [{column: 'projectName', order: 'asc'}],
      serverPagination: true,
      pageSize: 50,
      selectable: true,
    },

    // =========================
    // CREATE FORM
    // =========================
    create: {

      type: 'form',
      title: '创建项目',
      fields: [ 'projectId', 'projectName', 'status' ],
      interaction: {
        projectName: {
          readonlyWhen: 'isFinished'
        },
        status: {
          visibleWhen: 'isOutsource',
          readonlyWhen: {
            or: [
              'isFinished',
              { field: 'projectType', op: 'eq', value: '内部项目' }
            ]
          },
          disabledWhen: "status === '已归档'"
        }
      },
      saveTipBeforeClose: true,
      actions: [{ label: '保存', intent: 'create', color: 'primary' }],
    },

    // =========================
    // UPDATE（tabs + interaction）
    // =========================
    update: {

      tabs: [

        {
          key: 'basicInfo',
          type: 'form',
          title: '基础信息',
          fields: [ 'projectId', 'projectName', 'status' ],
          interaction: {
            projectName: {
              readonlyWhen: 'isFinished'
            },
            status: {
              visibleWhen: 'isOutsource',
              readonlyWhen: {
                or: [
                  'isFinished',
                  { field: 'projectType', op: 'eq', value: '内部项目' }
                ]
              },
              disabledWhen: "status === '已归档'"
            }
          },
          actions: [{ label: '保存', intent: 'update', color: 'primary' }],
        },


        {
          key: 'extensionInfo',
          title: '扩展信息',
        }
      ]
    }
  },

  // =========================
  // slots（插槽）
  // =========================
  slots: {
    
    list: {
      columns: {
        projectName: '插槽'
      },
  
      rowActions: {
        update: '插槽',
        delete: '插槽'
      }
    },
  
    update: {
      basicInfo: {
        fields: {
          projectName: '插槽',
          status: '插槽'
        }
      }
    }
  },
  // layout / platform 可省略，见 lib/json/v7/defaults.js、policy.DEFAULT_PLATFORM_TOKENS
  // 覆盖示例：layout.list.variants.mobile.status = { span: 2 }；platform.pc.create = 'CreateDrawer'
  // 降级人工写法：pc/mobile 覆盖时 blocks 提供细粒度顶栏节点 + composeToolbar 辅助
  pc: (views, blocks) => ({
    pageContent: { component: 'VStack', children: [blocks.pageHeader, blocks.list] },
    actionContent: [blocks.create, blocks.update].filter(Boolean),
  }),
  mobile: (views, blocks) => ({
    // 细粒度：searchBtn 左、toolbarActions 右（与默认 pageHeader 顺序相反示例）
    pageContent: {
      component: 'VStack',
      children: [
        blocks.composeToolbar([
          blocks.searchBtn,
          blocks.toolbarSpacer,
          blocks.toolbarActions,
        ], { props: { justify: 'space-between' } }),
        blocks.list,
      ].filter(Boolean),
    },
    actionContent: [blocks.create, blocks.update, blocks.searchSheet].filter(Boolean),
  }),
  // =========================
  // dataSource
  // =========================
  dataSource: {
    table: 'project',
    primaryKey: 'projectId',
    listResource: 'getProjectList',
    createResource: 'createProject',
    updateResource: 'updateProject',
    deleteResource: 'deleteProject',
  },
  // =========================
  // common 双端页面生成后都有的 vue 相关部分, 两个文件生成时都包含这一块
  // =========================
  common: {
    model: {
      prop: 'shown',
      event: 'value'
    },
    props: {
      shown: Boolean,
    },
    data: {
      constantObj: {

      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      pageId: '<$ ctx.packagePage.pageId $>',
      followUpStatusClass: {
        done: 'text-[#43a047]',
        draft: 'text-[#ff9800]',
        running: 'text-[#43a047]',
        cancel: 'text-[#e53935]',
      },
    },
    computed: {
    },
    watch: {
    },
    doUiAction: {
      open: ['doUiAction.viewDetail']
    },
    methods: {
    },
  },
};

module.exports = content;