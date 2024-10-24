const content = {
  pageType: "jh-mobile-page", pageId: "mobile/tableSyncConfig", pageName: "同步表管理", version: 'v2', template: 'jhMobileTemplateV4',
  resourceList: [
    /**
     * 	tableSyncConfig	selectSourceDatabase	✅数据库管理页-查询源数据库列表	service		{"service": "tableSync", "serviceFunction": "selectSourceDatabase"}
	tableSyncConfig	selectSourceTable	✅数据库管理页-查询源数据库中的table列表	service		{"service": "tableSync", "serviceFunction": "selectSourceTable"}
	tableSyncConfig	deleteTable	✅数据库管理页-删除同步表	service		{"service": "tableSync", "serviceFunction": "deleteTableSyncConfig"}
	tableSyncConfig	selectItemList	✅数据库管理页-查询同步表	sql		{"table": "_table_sync_config", "operation": "select"}
	tableSyncConfig	syncTable	✅数据库管理页-手动同步表	service		{"service": "tableSync", "serviceFunction": "syncTable"}
	tableSyncConfig	insertTable	✅数据库管理页-创建同步表	sql		{"table": "_table_sync_config", "operation": "insert"}
	tableSyncConfig	updateTable	✅数据库管理页-更新同步表	sql		{"table": "_table_sync_config", "operation": "update"}
     */
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅数据库管理页-查询同步表",
      resourceData: {
        table: "_table_sync_config",
        operation: "select"
      }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      desc: "✅数据库管理页-创建同步表",
      resourceData: {
        table: "_table_sync_config",
        operation: "insert"
      }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅数据库管理页-更新同步表",
      resourceData: {
        table: "_table_sync_config",
        operation: "update"
      }
    },
    {
      actionId: "deleteItem",
      resourceType: "service",
      desc: "✅数据库管理页-删除同步表",
      resourceData: {
        service: "tableSync",
        serviceFunction: "deleteTableSyncConfig"
      }
    },
    {
      actionId: "selectSourceDatabase",
      resourceType: "service",
      desc: "✅数据库管理页-查询源数据库列表",
      resourceData: {
        service: "tableSync",
        serviceFunction: "selectSourceDatabase"
      }
    },
    {
      actionId: "selectSourceTable",
      resourceType: "service",
      desc: "✅数据库管理页-查询源数据库中的table列表",
      resourceData: {
        service: "tableSync",
        serviceFunction: "selectSourceTable"
      }
    },
    {
      actionId: "syncTable",
      resourceType: "service",
      desc: "✅数据库管理页-手动同步表",
      resourceData: {
        service: "tableSync",
        serviceFunction: "syncTable"
      }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "同步表管理", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    // { 
    //   tag: 'jh-search', 
    //   attrs: { cols: 12, sm: 6, md:8 },
    //   value: [
    //     // { tag: "v-text-field", model: "serverSearchWhereLike.className", attrs: {prefix: '前缀'} },
    //   ], 
    //   searchBtn: true
    // }
    { tag: 'jh-mode' }
  ],
  pageContent: [
    {
      tag: 'jh-list',
      props: {
        limit: 10,
      },
      attrs: { cols: 12, class: 'p-0 pb-7', ':style': '`height: calc(100vh - 140px); overflow-y: auto;overscroll-behavior: contain`' },
      headActionList: [
        { tag: 'v-btn', value: '新增同步表', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")', small: true } },
        //  <v-btn color="primary" dark class="elevation-0 mr-2" @click="doUiAction('manualSyncAll', null)" small>全部同步</v-btn>
        { tag: 'v-btn', value: '全部同步', attrs: { color: 'primary', class: 'elevation-0 mr-2', '@click': 'doUiAction("manualSyncAll", null)', small: true }, quickAttrs: ['outlined'] },
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
        {text: "同步-源表", value: "sourceTable", width: 140, class: 'fixed', cellClass: 'fixed'},
        {text: "同步-目标表", value: "targetTable",},
        {text: "同步-源库", value: "sourceDatabaseShowName"},
        {text: "同步-目标库", value: "targetDatabase"},
  
        {text: "同步-源表类型", value: "tableType", width: 120},
        {text: "定时检查/分钟", value: "syncTimeSlot", width: 140, isSimpleMode: true},
        {text: "Trigger实时同步", value: "enableMysqlTrigger", isSimpleMode: true, width: 120},
        {text: "同步状态", value: "syncDesc", width: 120},
        {text: "同步触发时间", value: "lastSyncTime", width: 150},
        
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 180', align: "center", class: "fixed", cellClass: "fixed" },

        // width 表达式需要使用字符串包裹
      ],
      rowActionList: [
        { text: '同步', icon: 'mdi-sync', color: 'success', click: 'doUiAction("manualSyncOneTable", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
      ],
    },
    {
      tag: 'jh-action',
      attrs: { class: 'h-16 w-16 p-2 fixed right-4 bottom-32' },
      actionList: [
        { tag: 'v-btn', value: '新增', attrs: {color: 'success', '@click': "doUiAction('startCreateItem'); isPageActionDrawerShown = false"}, quickAttrs: ['block'] },
        { tag: 'v-btn', value: '全部同步', attrs: {color: 'success', '@click': "doUiAction('manualSyncAll')"}, quickAttrs: ['block'] },
      ]
    },
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
            { label: "同步-源库", model: "sourceDatabase", tag: "v-autocomplete", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.sourceDatabase'}  },
            { label: "同步-源表", model: "sourceTable", tag: "v-autocomplete", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.sourceTable'}  },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "同步-目标库", model: "targetDatabase", tag: "v-autocomplete", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.sourceDatabase'}  },
            { label: "同步-目标表", model: "targetTable", tag: "v-text-field", rules: "validationRules.requireRules", attrs: { ':placeholder': '\`${createItem.sourceDatabase}__${createItem.sourceTable}\`' } },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "定时检查/分钟", model: "syncTimeSlot", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "Mysql Trigger 实时同步数据", model: "enableMysqlTrigger", default: true, tag: "v-checkbox", attrs: { trueValue: "开启", falseValue: "关闭" }, quickAttrs: ['dense'] },

          ], 
          action: [{
            tag: "v-btn",
            value: "新增",
            attrs: {
              color: "success",
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
            { label: "同步-源库", model: "sourceDatabase", tag: "v-autocomplete", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.sourceDatabase'}  },
            { label: "同步-源表", model: "sourceTable", tag: "v-autocomplete", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.sourceTable'}  },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "同步-目标库", model: "targetDatabase", tag: "v-autocomplete", rules: "validationRules.requireRules", attrs: { ':items': 'constantObj.sourceDatabase'}  },
            { label: "同步-目标表", model: "targetTable", tag: "v-text-field", rules: "validationRules.requireRules" },
            { tag: 'div', colAttrs: { md: 12, class: 'pa-0'} },
            { label: "定时检查/分钟", model: "syncTimeSlot", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "Mysql Trigger 实时同步数据", model: "enableMysqlTrigger", default: true, tag: "v-checkbox", attrs: { trueValue: "开启", falseValue: "关闭" }, quickAttrs: ['dense'] },
          ], 
          action: [{
            tag: "v-btn",
            value: "保存",
            attrs: {
              color: "success",
              '@click': "doUiAction('updateItem')"
            }
          }],
        },
      ]
    },
    {
      tag: 'jh-detail-drawer',
      key: "detail",
      attrs: {},
      title: '详情',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "详情", 
          type: "preview", 
          formItemList: [
            { label: "同步-源库", tag: "span", colAttrs: { class: 'border-b py-3 flex justify-between' }, value: "{{ detailItem.sourceDatabase }}" },
            { label: "同步-源表", tag: "span", colAttrs: { class: 'border-b py-3 flex justify-between' }, value: "{{ detailItem.sourceTable }}" },
            { label: "同步-目标库", tag: "span", colAttrs: { class: 'border-b py-3 flex justify-between' }, value: "{{ detailItem.targetDatabase }}" },
            { label: "同步-目标表", tag: "span", colAttrs: { class: 'border-b py-3 flex justify-between' }, value: "{{ detailItem.targetTable }}" },
            { label: "定时检查/分钟", tag: "span", colAttrs: { class: 'border-b py-3 flex justify-between' }, value: "{{ detailItem.syncTimeSlot }}" },
            { label: "Mysql Trigger 实时同步数据", tag: "span", colAttrs: { class: 'border-b py-3 flex justify-between' }, value: "{{ detailItem.enableMysqlTrigger }}" },
          ], 
          action: [
            // 同步、编辑、删除
            { tag: "v-btn", value: "同步", attrs: { color: "success", '@click': "doUiAction('manualSyncOneTable', detailItem)" } },
            { tag: "v-btn", value: "编辑", attrs: { color: "success", '@click': "doUiAction('startUpdateItem', detailItem); closeDetailDrawer()" } },
            { tag: "v-btn", value: "删除", attrs: { color: "error", '@click': "doUiAction('deleteItem', detailItem); closeDetailDrawer()" } },
          ],
        },
      ]
    },
    
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {
        sourceDatabase: [],
        sourceTable: []
      },
      // 表格相关数据
      dataSyncStatus: "<$ ctx.app.config.dataSyncStatus $>",
      validationRules: {
        requireRules: [v => !!v || 'This is required',],
        numberRules: [v => !_.isEmpty(_.trim(v)) && !isNaN(v) || 'This is number'],
      },
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件

      syncItem: null,
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {
      createItem: {
        handler(value, oldValue) {
          if (!_.isEmpty(value.sourceDatabase)) {
            this.doUiAction('getSourceTable', {sourceDatabase: value.sourceDatabase});
          }
        },
        deep: true
      },
      updateItem: {
        handler(value, oldValue) {
          if (!_.isEmpty(value.sourceDatabase)) {
            this.doUiAction('getSourceTable', {sourceDatabase: value.sourceDatabase});
          }
        },
        deep: true
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
      this.doUiAction('getTableData');
      this.doUiAction('getAppList');
    },
    doUiAction: {
      getAppList: ['getAppList'],
      /**
       * case 'manualSyncOneTable':
          await this.prepareSyncOnTable(uiActionData);
          await this.confirmSyncOneTableDialog();
          await this.doManualSyncOneTable();
          await this.getTableData();
          break;
        case 'manualSyncAll':
          await this.confirmManualSyncAllDialog();
          await this.doManualSyncAll();
          await this.getTableData();
       */
      manualSyncOneTable: ['prepareSyncOnTable', 'confirmSyncOneTableDialog', 'doManualSyncOneTable', 'doUiAction.getTableData'],
      manualSyncAll: ['confirmManualSyncAllDialog', 'doManualSyncAll', 'doUiAction.getTableData'],
      getSourceTable: ['getSourceTable']
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      formatTableData() {
        let sourceDatabaseObj;
        let hasError;
        this.tableData = this.tableDataFromBackend.map(element => {
          hasError = false;
          try {
            sourceDatabaseObj = JSON.parse(element.sourceDatabase);
          } catch {
            // internal database
            hasError = true;
          }
          element.sourceDatabaseShowName = hasError ? element.sourceDatabase :
            sourceDatabaseObj.name + '-' + sourceDatabaseObj.database;
          element.operationAt = element.operationAt ? dayjs(element.operationAt).format('YYYY-MM-DD HH:mm:ss') : '';
          element.lastSyncTime = element.lastSyncTime ? dayjs(element.lastSyncTime).format('YYYY-MM-DD HH:mm:ss') : '';
          return element;
        });
      },
      // ---------- 获取数据库列表 uiAction >>>>>>>>>> --------
      async getAppList() {
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfig',
              actionId: 'selectSourceDatabase',
            }
          }
        });
        const { defaultTargetDatabase, rows } = result.data.appData.resultData;
        this.constantObj.sourceDatabase = result.data.appData.resultData.rows.map((row) => {
          return {"value": row.sourceDatabase, "text": row.sourceDatabase}
        });
        this.defaultTargetDatabase = defaultTargetDatabase;
      },
      // ---------- <<<<<<<<<<<< 获取数据库列表 uiAction --------
      // ---------- 获取数据库的table表 uiAction >>>>>>>>>> --------
      async getSourceTable(funObj) {
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfig',
              actionId: 'selectSourceTable',
              actionData: {sourceDatabase: funObj.sourceDatabase},
              orderBy: [{column: 'operationAt', order: 'desc'}]
            }
          }
        });
        const { tableRows, viewRows } = result.data.appData.resultData;
        const sourceTable = tableRows.map((table) => {
          return { value: table.sourceTable, text: table.sourceTable}
        });
        const sourceView = viewRows.map((view) => {
          return { value: view.sourceTable, text: view.sourceTable}
        });
        this.constantObj.sourceTable = [ ...sourceTable, ...sourceView ];
      },
      // ---------- <<<<<<<<<<<< 获取数据库的table表 uiAction --------
      // ---------- 新增数据 uiAction >>>>>>>>>> --------
      async prepareCreateFormData() {
        this.createItem = {
          targetDatabase: this.defaultTargetDatabase,
          syncTimeSlot: 5,
          enableMysqlTrigger: '开启',
        };
      },

      prepareDoCreateItem() {
        const {id, tableType, ...data} = this.createItem;
        if (!data.targetTable){
          data.targetTable = `${data.sourceDatabase}__${data.sourceTable}`;
        }
        this.createActionData = data;
      },
      async prepareDoUpdateItem() {
        const {id, tableType, ...data} = this.updateItem;
        if (!data.targetTable){
          data.targetTable = `${data.sourceDatabase}__${data.sourceTable}`;
        }
        this.updateItemId = id;
        this.updateActionData = data;
        delete this.updateActionData['sourceDatabaseShowName'];
      },

      // ---------- 数据同步 uiAction >>>>>>>>>>>> --------
      async prepareSyncOnTable(funObj) {
        this.syncItem = _.cloneDeep(funObj);
      },
      // 单表数据同步
      async confirmSyncOneTableDialog() {
        if (await window.confirmDialog({title: "确定要同步这张表吗", content: "确定同步吗？"}) === false) {
          throw new Error("[confirmSyncOneTableDialog] 否");
        }
      },
      async doManualSyncOneTable() {
        window.vtoast.loading("同步中");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfig',
              actionId: 'syncTable',
              actionData: {
                id: this.syncItem.id,
              }
            }
          }
        });
        window.vtoast.success("同步成功");
        this.syncItem = {};
      },
      // 全部数据表同步
      async confirmManualSyncAllDialog() {
        if (await window.confirmDialog({title: "确定要全部同步吗", content: "确定同步吗？"}) === false) {
          throw new Error("[confirmSyncOneTableDialog] 否");
        }
      },
      async doManualSyncAll() {
        window.vtoast.loading("同步中");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'tableSyncConfig',
              actionId: 'syncTable',
              actionData: {}
            }
          }
        });
        window.vtoast.success("手动同步成功")
      },
      // ---------- <<<<<<<<<<<< 数据同步 uiAction --------
    }
  },
  
};

module.exports = content;
