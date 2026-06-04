const content = {
  version: 'v7',
  mode: 'crud',
  pageType: 'jh-component',

  component: {
    path: 'biz/project/TaskSubTable',
    name: '任务子表',
    targets: 'pc',
  },

  dataSource: {
    table: 't_task',
    primaryKey: 'id',
    listResource: 'selectTaskList',
    createResource: 'insertTask',
    updateResource: 'updateTask',
    deleteResource: 'deleteTask',
  },

  fields: {
    taskName: { label: '任务名', type: 'text' },
    status: {
      label: '状态',
      type: 'select',
      options: 'constantObj.taskStatus',
    },
  },

  views: {
    list: {
      columns: ['taskName', 'status'],
      toolbarActions: [{ intent: 'create', label: '新增' }],
      rowActions: [{ intent: 'update', label: '编辑' }, { intent: 'delete', label: '删除' }],
    },
    create: {
      fields: ['taskName', 'status'],
      actions: [{ label: '保存', intent: 'create', color: 'primary' }],
    },
    update: {
      fields: ['taskName', 'status'],
      actions: [{ label: '保存', intent: 'update', color: 'primary' }],
    },
  },

  common: {
    props: {
      projectId: { type: String, required: true },
    },
    data: {
      constantObj: { taskStatus: ['待办', '进行中', '完成'] },
    },
    methods: {
      prepareTableParams() {
        this.tableParams.where = Object.assign({}, this.tableParams.where, {
          projectId: this.projectId,
        });
      },
    },
  },
};

module.exports = content;
