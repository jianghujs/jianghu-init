const content = {
  pageType: "jh-page", pageId: "exampleClass", table: "example_class", pageName: "班级页面", 
  // 1table 外需要添加的其他 resource
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅查询列表-exampleClass",
      resourceData: {
        table: "example_class",
        operation: "select"
      }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      resourceHook: {before: [{service: "common", serviceFunction: "generateBizIdOfBeforeHook"}]},
      desc: "✅添加-exampleClass",
      resourceData: {
        table: "example_class",
        operation: "jhInsert"
      }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅更新-exampleClass",
      resourceData: {
        table: "example_class",
        operation: "jhUpdate"
      }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅删除-exampleClass",
      resourceData: {
        table: "example_class",
        operation: "jhDelete"
      }
    },
    {
      actionId: "selectRecordHistory",
      resourceType: "sql",
      resourceData: {
        table: "_record_history",
        operation: "select"
      }
    }
  ],
  includeList: [], // { type: < js | css | html >, path: ''}
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
      testString: '测试字符串', // 字符串变量需要使用双层引号包裹
      tableSelected: [],
      serverSearchWhereLike: { className: '' },
      serverSearchWhere: { classType: '' },
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500', // data 表达式
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
  headContent: [
    { tag: 'jh-page-title', value: "班级页面", attrs: {}, helpBtn: true, slot: [] },
    { 
      tag: 'jh-search', 
      value: [
        { tag: "v-text-field", model: "serverSearchWhereLike.className", attrs: {prefix: '前缀'} },
      ], 
      searchBtn: true
    }
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs:{
        ':show-select': true,
        'v-model': 'tableSelected',
        'item-key': 'classId',
      },
      value: [
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
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 120', align: "center", class: "fixed", cellClass: "fixed" },
        // width 表达式需要使用字符串包裹
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
        }, // tag写法不支持移动端折叠
        {text: '学生列表', icon: 'mdi-note-edit-outline', click: 'doUiAction("viewClassStudentList", item)', color: 'success'}, // 简写支持 pc 和 移动端折叠
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
      ],
      headActionList: [
        { 
          tag: 'v-btn',  
          value: `新增`, 
          attrs: {
            color: "success",
            class: "mr-2",
            small: true,
            '@click': "doUiAction('startCreateItem')"
          }
        },
        { 
          tag: 'v-btn',  
          value: `批量console`, 
          attrs: {
            color: "success",
            outlined: true,
            class: "mr-2",
            small: true,
            '@click': "doUiAction('batchConsole')"
          }
        },
        { tag: 'v-spacer' },
        // 默认筛选
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '4', class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: {prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true} },
          ],
        }
      ]
    }
  ],
  actionContent: [
    {
      tag: 'jh-create-drawer',
      key: "create",
      attrs: {},
      title: '新增班级',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "新增", 
          type: "form", 
          formItemList: [
            { label: "班级ID", model: "classId", tag: "v-text-field", idGenerate: { prefix: "C", startValue: 10001, bizId: "classId" }, attrs: { disabled: true, placeholder: "规则自动生成" }, hidden: true },
            { label: "班级名称", model: "className", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "班级类型", model: "classType", tag: "v-select", rules: "validationRules.requireRules", required: true, default: '"普通班"', attrs: { ':items': 'constantObj.classType' }  },
            { label: "备注", model: "remarks", tag: "v-text-field",   },

          ], 
          action: {
            tag: "v-btn",
            value: "新增",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('createItem')"
            }
          }, 
        },

      ]
    },
    {
      tag: 'jh-update-drawer',
      key: "update",
      attrs: {},
      title: '编辑班级',
      headSlot: [
        { tag: 'v-spacer' },
        { tag: 'v-btn', value: '自定义按钮', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("123")', small: true } },
      ],
      contentList: [
        { 
          label: "编辑", 
          type: "form", 
          formItemList: [
            { tag: 'h3', value: '分组1', cols: '12', colsAttrs: { class: 'pb-0' } }, // 表单分组
            { label: "班级ID", model: "classId", tag: "v-text-field", rules: "validationRules.requireRules", required: true, attrs: { disabled: true }},
            { label: "班级名称", model: "className", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { tag: 'h3', value: '分组2', cols: '12', colsAttrs: { class: 'pb-0' } }, // 表单分组
            { label: "班级类型", model: "classType", tag: "v-select", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.classType' }, required: true },
            { label: "备注", model: "remarks", tag: "v-text-field",   },

          ], 
          action: {
            tag: "v-btn",
            value: "编辑",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('updateItem')"
            }
          }, 
        },
        { label: "操作记录", type: "component", componentPath: "recordHistory", attrs: { table: 'class', pageId: 'exampleClass', ':id': 'updateItem.id' } },
        { label: "学生列表", type: "component", componentPath: "example/studentOfClass", attrs: { classId: 'updateItem.classId' } },
      ]
    },
    {
      tag: 'jh-drawer',
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
      tag: 'jh-drawer',
      key: "classStudent",
      // title: "班级学生列表",
      contentList: [
        { label: "学生列表", type: "component", componentPath: "example/studentOfClass", bind: ['classId'] },
      ]
    },
  ],
  style: '',
};

module.exports = content;
