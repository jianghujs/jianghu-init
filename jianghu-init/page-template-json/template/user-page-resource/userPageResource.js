const content = {
  pageType: "jh-page", pageId: "userPageResource", pageName: "page&resource管理", version: 'v2',
  resourceList: [
    {
      actionId: "selectItemListOfResource",
      resourceType: "sql",
      desc: "✅resource管理-查询成员",
      resourceData: { table: "_resource", operation: "select" }
    },
    {
      actionId: "insertItemOfResource",
      resourceType: "sql",
      desc: "✅resource管理-新增成员",
      resourceData: { table: "_resource", operation: "jhInsert" }
    },
    {
      actionId: "deleteItemOfResource",
      resourceType: "sql",
      desc: "✅resource管理-删除成员",
      resourceData: { table: "_resource", operation: "jhDelete" }
    },
    {
      actionId: "updateItemOfResource",
      resourceType: "sql",
      desc: "✅resource管理-更新成员",
      resourceData: { table: "_resource", operation: "jhUpdate" }
    },
    {
      actionId: "selectItemListOfPage",
      resourceType: "sql",
      desc: "✅page管理-查询成员",
      resourceData: { table: "_page", operation: "select" }
    },
    {
      actionId: "insertItemOfPage",
      resourceType: "sql",
      desc: "✅page管理-新增成员",
      resourceData: { table: "_page", operation: "jhInsert" }
    },
    {
      actionId: "deleteItemOfPage",
      resourceType: "sql",
      desc: "✅page管理-删除成员",
      resourceData: { table: "_page", operation: "jhDelete" }
    },
    {
      actionId: "updateItemOfPage",
      resourceType: "sql",
      desc: "✅page管理-更新成员",
      resourceData: { table: "_page", operation: "jhUpdate" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "page&resource管理", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    /*html*/`
    <v-btn-toggle v-model="dataTypeSwitch" mandatory dense color="success"> 
      <v-btn small :value="index" v-for="item, index in constantObj.dataType" :key="index"> {{item}} </v-btn> 
    </v-btn-toggle>
    `
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: { ':headers': 'tabPageHeaders' },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")', small: true } },
        { tag: 'v-spacer' },
        // 默认筛选
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '3', xs: 8, class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: {prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true} },
          ],
        }
      ],
      headers: [
        // width 表达式需要使用字符串包裹
      ],
      value: [
        // vuetify table custom slot
      ],
      rowActionList: [
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' }
      ],
    }
  ],
  actionContent: [
    {
      tag: 'jh-create-drawer',
      key: "create",
      attrs: {},
      title: '新增',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "新增", 
          type: "form", 
          formItemList: [
            /**
             * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
             * attrs: {} // 表单项属性
             */
            { label: "page id", model: "pageId", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'}, rules: "validationRules.requireRules" },
            { label: "action id", model: "actionId", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'}, rules: "validationRules.requireRules" },
            { label: "resource 类型", model: "resourceType", tag: "v-select", colAttrs: {vIf: 'dataTypeSwitch == 0'}, rules: "validationRules.requireRules", attrs: {':items': 'constantObj.resourceType'} },
            { label: "描述", model: "desc", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'}, rules: "validationRules.requireRules" },
            { label: "数据规则控制表", model: "accessControlTable", colAttrs: {vIf: 'dataTypeSwitch == 0'}, tag: "v-select", attrs: {':items': 'constantObj.accessControlTable'} },
            { label: "resourceHook", model: "resourceHook", tag: "jh-json-editor", colAttrs: {md: 12, vIf: 'dataTypeSwitch == 0'}, attrs: { height: '250px'} },
            { label: "resource 数据", model: "resourceData", tag: "jh-json-editor", colAttrs: {md: 12, vIf: 'dataTypeSwitch == 0'}, rules: "validationRules.requireRules", attrs: { height: '250px'} },
            { label: "appData 参数校验", model: "appDataSchema", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'} },
            { label: "请求Demo", model: "requestDemo", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'} },
            { label: "响应Demo", model: "responseDemo", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'} },


            { label: "page id", model: "pageId", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 1'}, rules: "validationRules.requireRules" },
            { label: "pageName", model: "pageName", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 1'}, rules: "validationRules.requireRules" },
            { label: "pageFile", model: "pageFile", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 1'} },
            { label: "pageType", model: "pageType", tag: "v-select", colAttrs: {vIf: 'dataTypeSwitch == 1'}, rules: "validationRules.requireRules", attrs: {':items': 'constantObj.pageType'} },
            { label: "sort", model: "sort", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 1'} },
          ], 
          action: [{
            tag: "v-btn",
            value: "新增",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('createItem')"
            }
          }],
        },

      ]
    },
    {
      tag: 'jh-update-drawer',
      key: "update",
      attrs: {},
      title: '编辑',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "编辑", 
          type: "form", 
          formItemList: [
            /**
             * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
             * attrs: {} // 表单项属性
             */
            { label: "page id", model: "pageId", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'}, rules: "validationRules.requireRules" },
            { label: "action id", model: "actionId", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'}, rules: "validationRules.requireRules" },
            { label: "resource 类型", model: "resourceType", tag: "v-select", colAttrs: {vIf: 'dataTypeSwitch == 0'}, rules: "validationRules.requireRules", attrs: {':items': 'constantObj.resourceType'} },
            { label: "描述", model: "desc", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'}, rules: "validationRules.requireRules" },
            { label: "数据规则控制表", model: "accessControlTable", colAttrs: {vIf: 'dataTypeSwitch == 0'}, tag: "v-select", attrs: {':items': 'constantObj.accessControlTable'} },
            { label: "resourceHook", model: "resourceHook", tag: "jh-json-editor", colAttrs: {md: 12, vIf: 'dataTypeSwitch == 0'}, attrs: { height: '250px'} },
            { label: "resource 数据", model: "resourceData", tag: "jh-json-editor", colAttrs: {md: 12, vIf: 'dataTypeSwitch == 0'}, rules: "validationRules.requireRules", attrs: { height: '250px'} },
            { label: "appData 参数校验", model: "appDataSchema", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'} },
            { label: "请求Demo", model: "requestDemo", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'} },
            { label: "响应Demo", model: "responseDemo", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 0'} },


            { label: "page id", model: "pageId", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 1'}, rules: "validationRules.requireRules" },
            { label: "pageName", model: "pageName", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 1'}, rules: "validationRules.requireRules" },
            { label: "pageFile", model: "pageFile", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 1'} },
            { label: "pageType", model: "pageType", tag: "v-select", colAttrs: {vIf: 'dataTypeSwitch == 1'}, rules: "validationRules.requireRules", attrs: {':items': 'constantObj.pageType'} },
            { label: "sort", model: "sort", tag: "v-text-field", colAttrs: {vIf: 'dataTypeSwitch == 1'} },
          ], 
          action: [{
            tag: "v-btn",
            value: "编辑",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('updateItem')"
            }
          }],
        },
      ]
    },
    {
      tag: 'jh-drawer',
      key: "resetUserPassword",
      title: '重置密码',
      contentList: [
        {
          label: "重置密码",
          type: "form",
          formItemList: [
            { label: "新密码", model: "clearTextPassword", tag: "v-text-field", rules: "validationRules.requireRules",   },
          ],

          action: [{
            tag: "v-btn",
            value: "保存",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('resetPassword')"
            }
          }],
        }
      ]
    }
  ],
  includeList: [
    { type: 'html', path: 'component/vueJsonEditor.html' },
    /**
     * 
<link href="/<$ ctx.app.config.appId $>/public/plugins/jsoneditor/jsoneditor.min.css" rel="stylesheet">
<script src="/<$ ctx.app.config.appId $>/public/plugins/jsoneditor/jsoneditor.min.js"></script>
     */
    { type: 'css', path: '/<$ ctx.app.config.appId $>/public/plugins/jsoneditor/jsoneditor.min.css' },
    { type: 'js', path: '/<$ ctx.app.config.appId $>/public/plugins/jsoneditor/jsoneditor.min.js' },
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {
        dataType: ['接口管理', '页面管理'],
        accessControlTable: [{"value": "_access_control_a000", "text": "_access_control_a000"}],
        resourceType: [{"value": "service", "text": "service"}, {"value": "sql", "text": "sql"}],
        pageType: [{"value": "common", "text": "common"}, {"value": "showInMenu", "text": "顶部菜单"}, {"value": "dynamicInMenu", "text": "动态菜单"}, {"value": "avatarInMenu", "text": "用户菜单"}],
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件


      dataTypeSwitch: 0,
      pageTableDataFromBackend: [],
      tabPageHeaders: [],
      resourceHeaders: [
        {text: "pageId", value: "pageId", width: 120},
        {text: "actionId", value: "actionId", width: 120},
        {text: "resourceType", value: "resourceType", width: 120},
        {text: "accessControlTable", value: "accessControlTable"},
        {text: "resourceHook", value: "resourceHook", width: 120},
        {text: "appDataSchema", value: "appDataSchema", width: 120},
        {text: "resourceData", value: "resourceData", width: 400},
        {text: "desc", value: "desc", width: 260},
        {text: "操作人", value: "operationByUser", width: 120},
        {text: "操作时间", value: "operationAt", width: 160},
        {text: '操作', value: 'action', align: 'center', sortable: false, width: 120, class: 'fixed', cellClass: 'fixed'},
      ],

      pageHeaders: [
        {text: "pageId", value: "pageId", width: 120},
        {text: "pageName", value: "pageName", width: 120},
        {text: "pageFile", value: "pageFile", width: 120},
        {text: "pageType", value: "pageType", width: 120},
        {text: "sort", value: "sort", width: 120},
        {text: "操作人", value: "operationByUser", width: 120},
        {text: "操作时间", value: "operationAt", width: 160},
        {text: '操作', value: 'action', align: 'center', sortable: false, width: 120, class: 'fixed', cellClass: 'fixed'},
      ],
      pageId: 'Resource',

      // actionId
      createActionId: null,
      updateActionId: null,
      deleteActionId: null,
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {
      dataTypeSwitch(value) {
        this.tableData = [];
        if (value === 0) {
          this.pageId = 'Resource'
          this.tabPageHeaders = this.resourceHeaders;
        }
        if (value === 1) {
          this.pageId = 'Page'
          this.tabPageHeaders = this.pageHeaders;
        }
        this.doUiAction('getTableData');
      }
    },
    computed: {
      tableDataComputed() {
        if(this.filterMap) {
          return this.tableData.filter(row => {
            for (const key in this.filterMap) {
              if (this.filterMap[key] && row[key] !== this.filterMap[key]) {
                return false;
              }
            }
            return true;
          });
        } else {
          return this.tableData;
        }
      },
    },
    async created() {
      this.tabPageHeaders = this.resourceHeaders;
    },
    mounted() {
      this.doUiAction('getTableData');
    },
    doUiAction: {
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      /**
       * description: ✅获取表格数据
       */
      async getTableData() {
        this.isTableLoading = true;
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userPageResource',
              actionId: `selectItemListOf${this.pageId}`
            }
          }
        });
        this.tableDataFromBackend = result.data.appData.resultData.rows;
        this.isTableLoading = false;
      },


      async prepareDoCreateItem() {
        this.createActionId = `insertItemOf${this.pageId}`;
        this.createActionData = this.createItem;
      },
      async doCreateItem() {
        await window.vtoast.loading("保存中");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userPageResource',
              actionId: this.createActionId,
              actionData: this.createActionData
            }
          }
        })
        await window.vtoast.success("保存成功");
      },
      async prepareDoUpdateItem() {
        const {id, ...data} = this.updateItem;
        this.updateActionId = `updateItemOf${this.pageId}`;
        this.updateItemId = id;
        this.updateActionData = data;
      },
      async doUpdateItem() {
        await window.vtoast.loading("保存中");
        delete this.updateItem.id;
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userPageResource',
              actionId: this.updateActionId,
              actionData: this.updateActionData,
              where: {id: this.updateItemId}
            }
          }
        })
        await window.vtoast.success("修改成功");
      },
      // ---------------删除数据 uiAction >>>>>>>>>>>>>>>> ---------------
      async confirmDeleteItemDialog() {
        if (await window.confirmDialog({title: "删除", content: "确定删除吗？"}) === false) {
          throw new Error("[confirmDeleteItemDialog] 否");
        }
      },
      async prepareDoDeleteItem() {
        const {id} = this.deleteItem;
        this.deleteItemId = id;
        this.deleteActionId = `deleteItemOf${this.pageId}`;
      },
      async doDeleteItem() {
        window.vtoast.loading('正在删除');
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userPageResource',
              actionId: this.deleteActionId,
              where: {id: this.deleteItemId}
            }
          }
        });
        window.vtoast.success('删除成功');
        this.deleteActionId = null;
        this.deleteItemId = null;
      },
      // ---------------删除数据 uiAction <<<<<<<<<<<<<<<< ---------------
    }
  },
  
};

module.exports = content;