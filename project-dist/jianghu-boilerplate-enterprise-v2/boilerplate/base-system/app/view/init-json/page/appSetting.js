const content = {
  pageType: "jh-page", pageId: "appSetting", table: "enterprise_app", pageName: "应用设置", 
  resourceList: [
    /**
     * 	appSetting	selectItemList	✅APP管理-查询APP列表	sql	{ "table": "enterprise_app", "operation": "select" }
{"before": [{"service": "app", "serviceFunction": "checkDatabaseExist"}]}	appSetting	updateItem	✅APP管理-更新	sql	{ "table": "enterprise_app", "operation": "jhUpdate" }
{"before": [{"service": "app", "serviceFunction": "checkDatabaseExist"}], "after": [{"service": "app", "serviceFunction": "buildSupperAdminUserApp"}]}	appSetting	insertItem	✅APP管理-创建APP	sql	{ "table": "enterprise_app", "operation": "jhInsert" }
{"after": [{"service": "app", "serviceFunction": "buildSupperAdminUserApp"}]}	appSetting	deleteItem	✅APP管理-删除APP	sql	{ "table": "enterprise_app", "operation": "jhDelete" }
	appSetting	updateAppUserGroupRole	✅APP目录管理-更新App _user_group_role	service	{ "service": "app", "serviceFunction": "updateAppUserGroupRole" }
     */
    {
      actionId: "selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅查询列表-enterprise_app",
      resourceData: {
        table: "enterprise_app",
        operation: "select"
      }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      resourceHook: { before: [{ service: "app", serviceFunction: "checkDatabaseExist" }], after: [{ service: "app", serviceFunction: "buildSupperAdminUserApp" }] },
      desc: "✅创建-enterprise_app",
      resourceData: {
        table: "enterprise_app",
        operation: "jhInsert"
      }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      resourceHook: { before: [{ service: "app", serviceFunction: "checkDatabaseExist" }] },
      desc: "✅更新-enterprise_app",
      resourceData: {
        table: "enterprise_app",
        operation: "jhUpdate"
      }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      resourceHook: { after: [{ service: "app", serviceFunction: "buildSupperAdminUserApp" }] },
      desc: "✅删除-enterprise_app",
      resourceData: {
        table: "enterprise_app",
        operation: "jhDelete"
      }
    },
    {
      actionId: "updateAppUserGroupRole",
      resourceType: "service",
      desc: "✅APP目录管理-更新App _user_group_role",
      resourceData: {
        service: "app",
        serviceFunction: "updateAppUserGroupRole"
      }
    },
    {
      actionId: "syncAppPageList",
      resourceType: "service",
      desc: "✅同步页面列表",
      resourceData: {
        service: "app",
        serviceFunction: "syncAppPageList"
      }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "应用设置", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '批量保存', attrs: { color: 'success', class: 'mr-2', '@click': "doUiAction('updateAppPageDirectoryList')", small: true, ':outlined': true } },
        { tag: 'v-btn', value: '更新权限', attrs: { color: 'success', class: 'mr-2', '@click': "doUiAction('updateAppUserGroupRole')", small: true, ':outlined': true } },
        { tag: 'v-spacer' },
        // 默认筛选
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '4', class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: {prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true} },
          ],
        }
      ],
      headers: [
        {text: "应用ID", value: "appId", width: 200},
        {text: "应用名", value: "appName", width: 160},
        {text: "数据库", value: "appDatabase",width: 200},
        {text: "目录设置", value: "appPageDirectoryList", width: 500, formatter: `
            <div class="py-1">
              <v-autocomplete v-model="item.appPageDirectoryList" :items="item.appPageList" item-text="pageName" item-value="pageId" :class="{ 'jh-v-input-change': !_.isEqual(item.appPageDirectoryListCopy, item.appPageDirectoryList) }" class="jh-v-input" multiple dense filled single-line></v-autocomplete>
              <!-- 全选按钮 -->
              <div class="d-flex justify-space-between pt-1">
                <div class="">
                  <v-btn color="success" x-small @click="item.appPageDirectoryList = item.appPageList.map(e => e.pageId)">全选</v-btn>
                  <v-btn x-small @click="item.appPageDirectoryList = []">全取消</v-btn>
                </div>
                <v-btn x-small color="success" @click="doUiAction('syncAppPageList', item)" outlined>
                  <v-icon x-small>mdi-sync</v-icon>重新同步页面列表
                </v-btn>
              </div>
            </div>
          `},
        {text: "应用类型", value: "appType", width: 150, formatter: `
            <v-text-field v-model="item.appType" :class="{ 'jh-v-input-change': item.appTypeCopy !== item.appType }" class="jh-v-input" dense filled single-line></v-text-field>
          `},
        {text: "应用链接", value: "appUrl", width: 270, formatter: `
            <v-text-field class="jh-v-input" dense single-line filled :class="{ 'jh-v-input-change': item.appUrlCopy !== item.appUrl }" v-model="item.appUrl"></v-text-field>
          `},
        {text: '操作', value: 'action', align: 'center', sortable: false, width: 'window.innerWidth < 500 ? 80 : 200', class: 'fixed', cellClass: 'fixed'},

        // width 表达式需要使用字符串包裹
      ],
      value: [
        // vuetify table custom slot
      ],
      rowActionList: [
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
      ],
    }
  ],
  actionContent: [
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
             * <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">应用ID<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense single-line filled label="应用ID" v-model="createItem.appId" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">应用名<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense single-line filled label="应用名" v-model="createItem.appName" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">数据库<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense single-line filled label="应用名" v-model="createItem.appDatabase" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">应用类型<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense single-line filled label="应用类型" v-model="createItem.appType" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
             */
            { label: "应用ID", model: "appId", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "应用名", model: "appName", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "数据库", model: "appDatabase", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "应用类型", model: "appType", tag: "v-text-field", rules: "validationRules.requireRules" },

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
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {
        appType: [{"value": "internal", "text": "内部应用"}, {"value": "external", "text": "外部应用"}],
        appTypeList: [],
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      testString: '测试字符串',
      serverSearchWhereLike: { className: '' },
      filterMap: {},
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
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
    mounted() {
      this.doUiAction('getTableData');
      this.doUiAction('getConstantObj');
    },
    doUiAction: {
      /**
       * 
          case 'jump':
            await this.jump(uiActionData);
            break;
          case 'updateAppPageDirectoryList':
            await this.updateAppPageDirectoryList();
            await this.getTableData();
            break;
          case 'updateAppUserGroupRole':
            await this.updateAppUserGroupRole(uiActionData);
            break;
       */
      jump: ['jump'],
      updateAppPageDirectoryList: ['updateAppPageDirectoryList', 'getTableData'],
      updateAppUserGroupRole: ['updateAppUserGroupRole'],
      syncAppPageList: ['syncAppPageList', 'getTableData'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      async getTableData() {
        this.isTableLoading = true;
        const where = {};
        const whereLike = {};
        const whereIn = {};
        for (const fieldKey in this.serverSearchWhereLike) {
          const fieldValue = this.serverSearchWhereLike[fieldKey];
          if(!!fieldValue && fieldValue != '全部') {
            whereLike[fieldKey] = fieldValue;
          }
        }
  
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'appSetting',
              actionId: 'selectItemList',
              actionData: {},
              where,
              whereLike,
              whereIn,
              orderBy: [{column: 'appType', order: 'asc'}, {column: 'appName', order: 'asc'}]
            }
          }
        })).data.appData.resultData.rows;
        this.tableData = this.formatTableData(rows);
        this.isTableLoading = false;
      },
      formatTableData(rows) {
        rows.forEach(row => {
          row.appPageList = JSON.parse(row.appPageList || '[]');
          row.appPageDirectoryList = JSON.parse(row.appPageDirectoryList || '[]');
          // row.appPageListCopy = _.cloneDeep(row.appPageList);
          row.appPageDirectoryListCopy = _.cloneDeep(row.appPageDirectoryList);
          row.appUrlCopy = row.appUrl;
          row.appTypeCopy = row.appType;
        })
        return rows;
      },
      // ---------- 保存目录设置 uiAction >>>>>>>>>> --------
      async updateAppPageDirectoryList() {
        const changeLineList = this.tableData.filter(item => !_.isEqual(item.appPageDirectoryListCopy, item.appPageDirectoryList) || item.appUrlCopy !== item.appUrl || item.appTypeCopy !== item.appType);
        if (changeLineList.length === 0) {
          await window.vtoast.fail("没有修改的内容需要保存");
          throw new Error("没有修改的内容需要保存");
          return;
        }
        
        await window.jhMask.show();
        await window.vtoast.loading({ message: '保存目录设置', timer: -1 });
        for (const item of changeLineList) {
          const { id, appPageDirectoryList, appType, appUrl, appDatabase, appName } = item;
          await window.jianghuAxios({
            data: {
              appData: {
                pageId: 'appSetting',
                actionId: 'updateItem',
                actionData: { 
                  appPageDirectoryList: JSON.stringify(appPageDirectoryList || '[]'),
                  appType,
                  appName,
                  appUrl,
                  appDatabase
                },
                where: {id},
              }
            }
          })
        }
        await window.jhMask.hide();
        await window.vtoast.success("保存目录设置成功");
      },
      // ---------- 更新应用的权限表为System View uiAction >>>>>>>>>> --------
      async updateAppUserGroupRole(item) {
        const actionData = {};
        if (item) { actionData.id = item.id; };
        await window.jhMask.show();
        await window.vtoast.loading({ message: '更新应用的权限表为System View', timer: -1 });
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'appSetting',
              actionId: 'updateAppUserGroupRole',
              actionData: actionData,
            }
          }
        });
        await window.jhMask.hide();
        await window.vtoast.success("更新应用的权限表为System View成功");
      },
      // 页面跳转
      jump(url) {
        window.location.href = url;
      },

      //   --------------- 复制密码 uiAction >>>>>>>>>>>>>  ---------------
      async copyText(text) {
        await navigator.clipboard.writeText(text);
        return window.vtoast.success("复制密码成功！")
      },

      async syncAppPageList(item) {
        await window.jhMask.show();
        await window.vtoast.loading({ message: '同步页面列表', timer: -1 });
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'appSetting',
              actionId: 'syncAppPageList',
              actionData: { appId: item.appId }
            }
          }
        });
        await window.jhMask.hide();
        await window.vtoast.success("同步页面列表成功");
      }

    }
  },
  style: `
  .jh-v-input-change .v-input__slot {
    border-color: red !important;
  }
  `
  
};

module.exports = content;
