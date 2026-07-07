/**
 * V7 子组件 CRUD 全集示例（jh-component + mode:crud）
 *
 * 典型：主页面嵌入的任务子表，通过 props 传入 projectId 过滤数据。
 */
const content = {
  version: 'v7',
  mode: 'crud',
  pageType: 'jh-component',

  component: {
    path: 'biz/example/TaskSubTableFull',
    name: '任务子表（全集）',
    targets: 'both',
  },

  includeList: [
    { type: 'css', path: '/component/taskSubTable/task.css', target: 'pc' },
  ],

  dataSource: {
    table: 't_task',
    primaryKey: 'taskId',
    resource: {
      list: 'selectTaskList',
      create: 'insertTask',
      update: 'updateTask',
      delete: 'deleteTask',
    },
  },

  fields: {
    taskId: { label: '任务ID', type: 'text', width: 120 },
    taskName: { label: '任务名', type: 'text', required: true },
    status: {
      label: '状态',
      type: 'select',
      options: 'constantObj.taskStatus',
    },
    assignee: { label: '负责人', type: 'text' },
    dueDate: { label: '截止日期', type: 'text' },
  },

  views: {
    list: {
      columns: ['taskId', 'taskName', 'status', 'assignee'],
      mobileColumns: ['taskName', 'status'],
      toolbarActions: [{ uiAction: 'create', label: '新增任务' }],
      rowActions: [
        { uiAction: 'update', label: '编辑' },
        { uiAction: 'delete', label: '删除', disabledWhen: "status === '已关闭'" },
      ],
      serverPagination: false,
      pageSize: 20,
    },
    create: {
      title: '新建任务',
      fields: ['taskName', 'status', 'assignee', 'dueDate'],
      interaction: {
        assignee: { visibleWhen: 'showAssigneeField' },
      },
      actions: [{ label: '保存', uiAction: 'create', color: 'primary' }],
    },
    update: {
      title: '编辑任务',
      fields: ['taskId', 'taskName', 'status', 'assignee', 'dueDate'],
      interaction: {
        taskId: { readonlyWhen: true },
      },
      actions: [{ label: '保存', uiAction: 'update', color: 'primary' }],
    },
  },

  layout: {
    list: { cols: 2 },
    create: { cols: 2 },
    update: { cols: 2 },
  },

  platform: {
    pc: { list: 'Table', create: 'CreateDrawer', update: 'UpdateDrawer' },
    mobile: { list: 'List', create: 'CreateSheet', update: 'UpdateSheet' },
  },

  common: {
    props: {
      projectId: { type: [String, Number], required: true },
      readonly: { type: Boolean, default: false },
    },
    data: {
      constantObj: {
        taskStatus: ['待办', '进行中', '已关闭'],
      },
      showAssigneeField: true,
    },
    computed: {
      tableReadonly() {
        return this.readonly;
      },
    },
    methods: {
      prepareTableParams() {
        const pid = this.projectId;
        if (!this.tableParams.where) this.tableParams.where = {};
        this.tableParams.where.projectId = pid;
      },
      prepareCreateItem() {
        this.createItem.projectId = this.projectId;
      },
    },
    doUiAction: {},
  },
};

module.exports = content;
