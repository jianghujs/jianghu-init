const content = {
  "pageType": "jh-page",
  "pageId": "userPageResource",
  "table": "_user",
  "pageName": "权限规则",
  "resourceList": [
    {
      "actionId": "insertItemOfResource",
      "desc": "✅权限规则-协议管理-插入信息",
      "resourceType": "sql",
      "resourceData": {
        "table": "_resource",
        "operation": "jhInsert"
      }
    },
    {
      "actionId": "selectItemListOfResource",
      "desc": "✅权限规则-协议管理-查询数据列表",
      "resourceType": "sql",
      "resourceData": {
        "table": "_resource",
        "operation": "select"
      }
    },
    {
      "actionId": "updateItemOfResource",
      "desc": "✅权限规则-协议管理-更新数据",
      "resourceType": "sql",
      "resourceData": {
        "table": "_resource",
        "operation": "jhUpdate"
      }
    },
    {
      "actionId": "deleteItemOfResource",
      "desc": "✅权限规则-协议管理-删除数据",
      "resourceType": "sql",
      "resourceData": {
        "table": "_resource",
        "operation": "jhDelete"
      }
    },
    {
      "actionId": "insertItemOfPage",
      "desc": "✅权限规则-页面管理-插入信息",
      "resourceType": "sql",
      "resourceData": {
        "table": "_page",
        "operation": "jhInsert"
      }
    },
    {
      "actionId": "selectItemListOfPage",
      "desc": "✅权限规则-页面管理-查询数据列表",
      "resourceType": "sql",
      "resourceData": {
        "table": "_page",
        "operation": "select"
      }
    },
    {
      "actionId": "updateItemOfPage",
      "desc": "✅权限规则-页面管理-更新数据",
      "resourceType": "sql",
      "resourceData": {
        "table": "_page",
        "operation": "jhUpdate"
      }
    },
    {
      "actionId": "deleteItemOfPage",
      "desc": "✅权限规则-页面管理-删除数据",
      "resourceType": "sql",
      "resourceData": {
        "table": "_page",
        "operation": "jhDelete"
      }
    },
    {
      "actionId": "selectGroup",
      "desc": "✅权限规则管理-查询群组",
      "resourceType": "sql",
      "resourceData": {
        "table": "_group",
        "operation": "select"
      }
    },
    {
      "actionId": "selectRole",
      "desc": "✅权限规则管理-查询角色",
      "resourceType": "sql",
      "resourceData": {
        "table": "_role",
        "operation": "select"
      }
    },
    {
      "actionId": "selectResourceList",
      "desc": "✅权限规则-查询协议列表",
      "resourceType": "sql",
      "resourceData": {
        "table": "_resource",
        "operation": "select"
      }
    },
    {
      "actionId": "selectPageList",
      "desc": "✅权限规则-查询页面列表",
      "resourceType": "sql",
      "resourceData": {
        "table": "_page",
        "operation": "select"
      }
    }
  ],
  "includeList": [
    `{% include 'common/jianghuJs/fixedTableHeightV4.html' %}`
  ],
  headContent: [
    { tag: 'jh-page-title', value: "page&resource管理", attrs: { cols: 12, sm: 6, md: 4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    `
    <v-btn-toggle v-model="dataTypeSwitch" mandatory dense color="success"> 
      <v-btn small :value="index" v-for="item, index in constantObj.dataType" :key="index"> {{item}} </v-btn> 
    </v-btn-toggle>
    `
  ],

  "pageContent": [
    {
      tag: 'jh-table',
      attrs: {},
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { small: true, color: 'success', '@click': 'doUiAction("startCreateItem")' } },
        { tag: 'v-spacer' },
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '2', class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: { prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true } },
          ],
        }
      ],
      headers: [
        { text: "用户ID[登陆]", value: "userId", width: 120 },
        { text: "用户名", value: "username", width: 140 },
        { text: "用户类型", value: "userType", width: 120 },
        { text: "用户状态", value: "userStatus", width: 120 },
        { text: "初始密码", value: "clearTextPassword", width: 120 },
        { text: "操作人", value: "operationByUser", width: 90 },
        { text: "操作时间", value: "operationAt", width: 150 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: 'window.innerWidth < 500 ? 80 : 230', class: 'fixed', cellClass: 'fixed' },
      ],
      value: [
         /*html*/`
         <template v-slot:item.pageType="{ item }">
         {{ getDisplayText({displayObj: constantObj.pageType, displayValue: item.pageType}) }}
       </template>
         `
      ],
      rowActionList: [
        { text: '修改', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' },
      ],
    },
  ],
  "actionContent": [
    {
      tag: 'jh-create-drawer',
      key: "create",
      attrs: {},
      title: '添加信息',
      headSlot: [
        { tag: 'v-spacer' }
      ],
      contentList: [
        {
          "label": "",
          "type": "form",
          "formItemList": [
            {
              "label": "pageId",
              "model": "createItem.pageId",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },
            },
            {
              "label": "actionId",
              "model": "createItem.actionId",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

            },
            {
              "label": "resourceType",
              "model": "createItem.resourceType",
              "tag": "v-select",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

              "attrs": {
                "clearable": true,
                ":items": "constantObj.resourceType"
              }
            },
            {
              "label": "accessControlTable",
              "model": "createItem.accessControlTable",
              "tag": "v-select",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },
              "attrs": {
                "clearable": true,
                ":items": "constantObj.accessControlTable"
              }
            },
            {
              "label": "resourceHook",
              "model": "createItem.resourceHook",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

            },
            {
              "label": "appDataSchema",
              "model": "createItem.appDataSchema",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

            },
            {
              "label": "resourceData",
              "model": "createItem.resourceData",
              "tag": "v-textarea",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

            },
            {
              "label": "desc",
              "model": "createItem.desc",
              "tag": "v-textarea",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

            },
            {
              "label": "pageId*必填",
              "model": "createItem.pageId",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==1" },

              "rules": "validationRules.requireRules"
            },
            {
              "label": "pageName",
              "model": "createItem.pageName",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==1" },

            },
            {
              "label": "pageFile",
              "model": "createItem.pageFile",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==1" },

            },
            {
              "label": "pageType",
              "model": "createItem.pageType",
              "tag": "v-select",
              "colAttrs": { "v-if": "dataTypeSwitch==1" },

              "attrs": {
                "clearable": true,
                ":items": "constantObj.pageType",
              }
            },
            {
              "label": "sort",
              "model": "createItem.sort",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==1" },

            }
          ],
          action: [
            { tag: 'v-btn', value: '保存', attrs: { small: true, class: 'ml-2', color: 'success', '@click': "doUiAction('createItem')" } },
          ]
        }
      ]
    },
    {
      tag: 'jh-update-drawer',
      key: "update",
      attrs: {},
      title: '修改信息',
      headSlot: [
        { tag: 'v-spacer' }
      ],
      contentList: [
        {
          "label": "",
          "type": "form",
          "formItemList": [
            {
              "label": "pageId",
              "model": "updateItem.pageId",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },
            },
            {
              "label": "actionId",
              "model": "updateItem.actionId",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

            },
            {
              "label": "resourceType",
              "model": "updateItem.resourceType",
              "tag": "v-select",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

              "attrs": {
                "clearable": true,
                ":items": "constantObj.resourceType"
              }
            },
            {
              "label": "accessControlTable",
              "model": "updateItem.accessControlTable",
              "tag": "v-select",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

              "attrs": {
                "clearable": true,
                ":items": "constantObj.accessControlTable"
              }
            },
            {
              "label": "resourceHook",
              "model": "updateItem.resourceHook",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

            },
            {
              "label": "appDataSchema",
              "model": "updateItem.appDataSchema",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

            },
            {
              "label": "resourceData",
              "model": "updateItem.resourceData",
              "tag": "v-textarea",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

            },
            {
              "label": "desc",
              "model": "updateItem.desc",
              "tag": "v-textarea",
              "colAttrs": { "v-if": "dataTypeSwitch==0" },

            },
            {
              "label": "pageId*必填",
              "model": "updateItem.pageId",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==1" },

              "rules": "validationRules.requireRules"
            },
            {
              "label": "pageName*必填",
              "model": "updateItem.pageName",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==1" },

              "rules": "validationRules.requireRules"
            },
            {
              "label": "pageFile",
              "model": "updateItem.pageFile",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==1" },

            },
            {
              "label": "pageType*必填",
              "model": "updateItem.pageType",
              "tag": "v-select",
              "colAttrs": { "v-if": "dataTypeSwitch==1" },
              "attrs": {
                "clearable": true,
                ":items": "constantObj.pageType"
              },
              "rules": "validationRules.requireRules"
            },
            {
              "label": "sort",
              "model": "updateItem.sort",
              "tag": "v-text-field",
              "colAttrs": { "v-if": "dataTypeSwitch==1" },

            }
          ],
          action: [
            { tag: 'v-btn', value: '保存', attrs: { small: true, class: 'ml-2', color: 'success', '@click': "doUiAction('updateItem')" } },
          ]
        }
      ]
    },
  ],
  "common": {
    data: {
      isHelpPageDrawerShown: false,

      // 表格相关数据
      isTableZebraLineShown: true,
      validationRules: {
        requireRules: [
          v => !!v || 'This is required',
        ],
      },
      // 常量下拉选项
      constantObj: {
        dataType: ['接口管理', '页面管理'],
        accessControlTable: [{ "value": "_access_control_a000", "text": "_access_control_a000" }],
        resourceType: [{ "value": "service", "text": "service" }, { "value": "sql", "text": "sql" }],
        pageType: [{ "value": "common", "text": "common" }, { "value": "showInMenu", "text": "顶部菜单" }, { "value": "dynamicInMenu", "text": "动态菜单" }, { "value": "avatarInMenu", "text": "用户菜单" }],
      },

      searchInput: null,
      dataTypeSwitch: 0,
      isTableLoading: true,
      tableData: [],
      pageTableDataFromBackend: [],
      tabPageHeaders: [],
      headers: [
        { text: "pageId", value: "pageId", width: 120 },
        { text: "actionId", value: "actionId", width: 120 },
        { text: "resourceType", value: "resourceType", width: 120 },
        { text: "accessControlTable", value: "accessControlTable" },
        { text: "resourceHook", value: "resourceHook", width: 120 },
        { text: "appDataSchema", value: "appDataSchema", width: 120 },
        { text: "resourceData", value: "resourceData", width: 400 },
        { text: "desc", value: "desc", width: 260 },
        { text: "操作人", value: "operationByUser", width: 90 },
        { text: "操作时间", value: "operationAt", width: 150 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: 120, class: 'fixed', cellClass: 'fixed' },
      ],

      pageHeaders: [
        { text: "pageId", value: "pageId", width: 120 },
        { text: "pageName", value: "pageName", width: 120 },
        { text: "pageFile", value: "pageFile", width: 120 },
        { text: "pageType", value: "pageType", width: 120 },
        { text: "sort", value: "sort", width: 120 },
        { text: "操作人", value: "operationByUser", width: 90 },
        { text: "操作时间", value: "operationAt", width: 150 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: 120, class: 'fixed', cellClass: 'fixed' },
      ],
      pageId: 'Resource',
      // 新增数据
      isCreateDrawerShown: false,
      createItem: {},
      createActionData: {},
      // 编辑数据
      isUpdateDrawerShown: false,
      updateItem: {},
      updateItemId: null,
      updateActionData: {},
      // 删除数据
      deleteItemId: null,
      // actionId
      createActionId: null,
      updateActionId: null,
      deleteActionId: null,
    },
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
    async created() {
      this.tabPageHeaders = this.resourceHeaders;
    },
    mounted() {
      this.doUiAction('getTableData');
    },
    methods: {
      async doUiAction(uiActionId, uiActionData) {
        switch (uiActionId) {
          case 'getTableData':
            await this.getTableData();
            break;
          case 'startCreateItem':
            await this.prepareCreateItem();
            await this.openCreateItemDrawer();
            break;
          case 'createItem':
            await this.prepareCreateValidate();
            await this.confirmCreateItemDialog();
            await this.prepareDoCreateItem();
            await this.doCreateItem();
            await this.closeCreateDrawer();
            await this.getTableData();
            break;
          case 'startUpdateItem':
            await this.prepareUpdateItem(uiActionData);
            await this.openUpdateItemDrawer();
            break;
          case 'updateItem':
            await this.prepareUpdateValidate();
            await this.confirmUpdateItemDialog();
            await this.prepareDoUpdateItem();
            await this.doUpdateItem();
            await this.closeUpdateDrawer();
            await this.getTableData();
            break;
          case 'deleteItem':
            await this.prepareDeleteItem(uiActionData);
            await this.confirmDeleteItemDialog();
            await this.doDeleteItem();
            await this.getTableData();
            break;
          default:
            console.error("[doUiAction] uiActionId not find", { uiActionId });
            break;
        }
      },
      /**
       * description: ✅获取表格数据
       */
      async getTableData() {
        this.isTableLoading = true;
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userPageResource',
              actionId: `selectItemListOf${this.pageId}`
            }
          }
        })).data.appData.resultData.rows;

        rows.forEach(row => {
          row.operationAt = window.dayjs(row.operationAt).format('YYYY-MM-DD HH:mm:ss');
        })
        this.tableData = rows;
        this.isTableLoading = false;
      },
      // ---------------新增数据 uiAction >>>>>>>>>>>>>>>> ---------------
      async prepareCreateItem() {
        this.createItem = {};
      },
      async openCreateItemDrawer() {
        this.isCreateDrawerShown = true;
      },
      async prepareCreateValidate() {
        if (await this.$refs.createForm.validate() === false) {
          throw new Error("[prepareValidate] false");
        }
      },
      async confirmCreateItemDialog() {
        if (await window.confirmDialog({ title: "新增", content: "确定新增吗？" }) === false) {
          throw new Error("[confirmCreateFormDialog] 否");
        }
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
      async closeCreateDrawer() {
        this.createActionId = null;
        this.createActionData = null;
        this.createItem = {};
        this.isCreateDrawerShown = false;
      },
      // ---------------新增数据 uiAction <<<<<<<<<<<<<<<< ---------------
      // ---------------编辑数据 uiAction >>>>>>>>>>>>>>>> ---------------
      async prepareUpdateItem(funObj) {
        this.updateItem = _.cloneDeep(funObj);
      },
      async openUpdateItemDrawer() {
        this.isUpdateDrawerShown = true;
      },
      async prepareUpdateValidate() {
        if (await this.$refs.updateForm.validate() === false) {
          throw new Error("[prepareValidate] false");
        }
      },
      async confirmUpdateItemDialog() {
        if (await window.confirmDialog({ title: "修改", content: "确定修改吗？" }) === false) {
          throw new Error("[confirmUpdateItemDialog] 否");
        }
      },
      async prepareDoUpdateItem() {
        const { id, ...data } = this.updateItem;
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
              where: { id: this.updateItemId }
            }
          }
        })
        await window.vtoast.success("修改成功");
      },
      async closeUpdateDrawer() {
        this.updateItem = {};
        this.updateActionId = null;
        this.updateItemId = null;
        this.updateActionData = null;
        this.isUpdateDrawerShown = false;
      },
      // ---------------编辑数据 uiAction <<<<<<<<<<<<<<<< ---------------
      // ---------------删除数据 uiAction >>>>>>>>>>>>>>>> ---------------
      async prepareDeleteItem(funObj) {
        this.deleteItemId = funObj.id;
        this.deleteActionId = `deleteItemOf${this.pageId}`;
      },
      async confirmDeleteItemDialog() {
        if (await window.confirmDialog({ title: "删除", content: "确定删除吗？" }) === false) {
          throw new Error("[confirmDeleteItemDialog] 否");
        }
      },
      async doDeleteItem() {
        window.vtoast.loading('正在删除');
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userPageResource',
              actionId: this.deleteActionId,
              where: { id: this.deleteItemId }
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
  style: `
   
  `
}

module.exports = content;