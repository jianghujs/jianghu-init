const content = {
  pageType: "1table-page", pageId: "exampleClass", table: "example_class", pageName: "班级页面", 
  // 1table 外需要添加的其他 resource
  resourceList: [
    { actionId: "balance-updateItem", resourceType: 'sql', resourceData: {
      table: "class",
      operation: "jhUpdate",
    } },
  ],
  // 自定义抽屉列表
  drawerList: [
    {
      key: "updateBalance",
      title: "班级费用",
      contentList: [
        { label: "详细信息", type: "form", formItemList: [
            { label: "班级ID", model: "classId", tag: "v-text-field", rules: "validationRules.requireRules", attrs: {
              disabled: true
            }   },
            { label: "修改班费", model: "classBalance", tag: "v-text-field", rules: "validationRules.requireRules", required: true   },
          ], action: {
            tag: "v-btn",
            value: "提交",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('updateBalance')"
            }
          } 
        },
      ]
    },
    {
      key: "classStudent",
      // title: "班级学生列表",
      contentList: [
        { label: "学生列表", type: "component", componentPath: "example/studentOfClass", bind: ['classId'] },
      ]
    },
  ],
  includeList: [],
  common: {
    data: {
      constantObj: {
        classType: ["普通班", "重点班", "特长班"],
        classTypeColor: {
          "普通班": "success",
          "重点班": "warning",
          "特长班": "blue",
        }
      },
      validationRules: { 
          requireRules: [
              v => !!v || '此项必填',
          ],
          phoneRules: [
              v => !!v || '此项必填',
              v => /^1[3456789]d{9}$/.test(v) || '手机号格式错误',
          ],
      },
      tableSelected: [],
    },
    doUiAction: {
      'startUpdateBalance': ['prepareUpdateBalanceData', 'openUpdateBalanceDrawer'],
      'updateBalance': ['prepareUpdateBalanceValidate', 'confirmUpdateBalanceDialog', 'doUpdateBalance', 'closeUpdateBalanceDrawer', 'getTableData'],
      'batchConsole': ['batchConsole'],
      'viewClassStudentList': ['prepareClassStudentData', 'openClassStudentDrawer', ],
    },
    watch: {},
    methods: {
      prepareUpdateBalanceData(item) {
        this.updateBalance = _.cloneDeep(item);
      },
      async prepareUpdateBalanceValidate() {
        if (await this.$refs.updateBalance.validate()) {
          return true;
        }
        throw new Error("请完善表单信息")
      },
      async confirmUpdateBalanceDialog() {
        if (await window.confirmDialog({title: "修改班费", content: "确定修改班费吗？"}) === false) {
          throw new Error("[confirmUpdateBalanceDialog] 否");
        }
      },
      async doUpdateBalance(uiActionData) {
        const {classBalance, id} = this.updateBalance;
        await window.jhMask.show();
        await window.vtoast.loading("修改数据");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'classManagement',
              actionId: 'balance-updateItem',
              actionData: {classBalance},
              where: {id}
            }
          }
        })
        await window.jhMask.hide();
        await window.vtoast.success("修改数据成功");
      },
      async prepareClassStudentData(item) {
        this.classStudent = _.cloneDeep(item);
      },
      async batchConsole() {
        console.log(this.tableSelected);
      },
    }
  },
  headContent: {
    helpDrawer: {}, // 自动初始化md文件
    serverSearchList: [
        { tag: "v-text-field",  label: "班级名称",    model: "serverSearchWhereLike.className",                                          },
        // { tag: "v-select",      label: "性别",       model: "serverSearchWhere.gender",           attrs: { items: ["全部", "男", "女"] } },
        // { tag: "v-date-picker", label: "出生日期",    model: "serverSearchWhereLike.dateOfBirth",  attrs: { type: "month" },             },
    ],
    // serverSearchWhere: { gender: "全部" },
    serverSearchWhereLike: { className: null },
  },
  pageContent: {
    tableAttrs:{
      ':show-select': true,
      'v-model': 'tableSelected',
      'item-key': 'classId',
    },
    tableHeaderList: [
      { text: "班级ID", value: "classId", type: "v-text-field", width: 80, sortable: true },
      { text: "班级名称", value: "className", type: "v-text-field", width: 80, sortable: true },
      { text: "班级类型", value: "classType", type: "v-text-field", width: 80, sortable: true, formatter: [
        { 
          tag: "v-chip", 
          value: 'xxx-{{item.classType}}', 
          attrs: { 
            'v-if': 'item.classType',
            ':color': 'constantObj.classTypeColor[item.classType]', 
            small: true,
          } },
      ] },
      { text: "班费", value: "classBalance", type: "v-text-field", width: 80, sortable: true },
      { text: "备注", value: "remarks", type: "v-text-field", width: 80, sortable: true },
      { text: "操作", value: "action", type: "action", width: 120, align: "center", class: "fixed", cellClass: "fixed" },

    ],
    rowActionList: [
      { 
        tag: 'span',  
        value: `<v-icon size="16" class="success--text">mdi-note-edit-outline</v-icon>班费`, 
        attrs: {
          role: "button",
          class: "success--text font-weight-medium font-size-2 mr-2",
          '@click': "doUiAction('startUpdateBalance', item)"
        }
      },
      { 
        tag: 'span',  
        value: `<v-icon size="16" class="success--text">mdi-note-edit-outline</v-icon>班级学生列表`, 
        attrs: {
          role: "button",
          class: "success--text font-weight-medium font-size-2 mr-2",
          '@click': "doUiAction('viewClassStudentList', item)"
        }
      },
    ],
    headActionList: [
      { 
        tag: 'v-btn',  
        value: `批量console`, 
        attrs: {
          color: "success",
          outlined: true,
          class: "mr-2",
          '@click': "doUiAction('batchConsole')"
        }
      },
    ]
  },
  createDrawerContent: {
    formItemList: [
      { label: "班级ID", model: "classId", tag: "v-text-field", idGenerate: { prefix: "C", startValue: 10001, bizId: "classId" }, attrs: { disabled: true, placeholder: "规则自动生成" } },
      { label: "班级名称", model: "className", tag: "v-text-field", rules: "validationRules.requireRules",   },
      { label: "班级类型", model: "classType", tag: "v-select", rules: "validationRules.requireRules", default: '普通班', attrs: { ':items': 'constantObj.classType' }  },
      { label: "备注", model: "remarks", tag: "v-text-field",   },
    ],
  },
  updateDrawerContent: {
    contentList: [
      { label: "编辑", type: "form", formItemList: [
        { label: "班级ID", model: "classId", tag: "v-text-field", rules: "validationRules.requireRules", attrs: { disabled: true }},
        { label: "班级名称", model: "className", tag: "v-text-field", rules: "validationRules.requireRules",   },
        { label: "班级类型", model: "classType", tag: "v-select", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.classType' }  },
        { label: "备注", model: "remarks", tag: "v-text-field",   },

      ]},
      { label: "操作记录", type: "component", componentPath: "recordHistory"},
      { label: "学生列表", type: "component", componentPath: "example/studentOfClass", bind: ['classId'] },
    ]
  },
  deleteContent: {},
};

module.exports = content;
