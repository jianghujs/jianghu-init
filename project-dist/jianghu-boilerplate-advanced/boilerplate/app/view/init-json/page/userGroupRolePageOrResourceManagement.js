const content = {
  pageType: "jh-page", pageId: "userGroupRolePageOrResourceManagement", pageName: "权限规则管理", version: 'v2',
  resourceList: [
    /**
     * 		userGroupRolePageOrResourceManagement	insertItemOfResource	✅权限规则-协议管理-插入信息	sql		{"table": "_user_group_role_resource", "operation": "jhInsert"}
	  userGroupRolePageOrResourceManagement	selectItemListOfResource	✅权限规则-协议管理-查询数据列表	sql		{"table": "_user_group_role_resource", "operation": "select"}
	  userGroupRolePageOrResourceManagement	updateItemOfResource	✅权限规则-协议管理-更新数据	sql		{"table": "_user_group_role_resource", "operation": "jhUpdate"}
	  userGroupRolePageOrResourceManagement	deleteItemOfResource	✅权限规则-协议管理-删除数据	sql		{"table": "_user_group_role_resource", "operation": "jhDelete"}
	  userGroupRolePageOrResourceManagement	insertItemOfPage	✅权限规则-页面管理-插入信息	sql		{"table": "_user_group_role_page", "operation": "jhInsert"}
	  userGroupRolePageOrResourceManagement	selectItemListOfPage	✅权限规则-页面管理-查询数据列表	sql		{"table": "_user_group_role_page", "operation": "select"}
	  userGroupRolePageOrResourceManagement	updateItemOfPage	✅权限规则-页面管理-更新数据	sql		{"table": "_user_group_role_page", "operation": "jhUpdate"}
	  userGroupRolePageOrResourceManagement	deleteItemOfPage	✅权限规则-页面管理-删除数据	sql		{"table": "_user_group_role_page", "operation": "jhDelete"}
  	userGroupRolePageOrResourceManagement	selectGroup	✅权限规则管理-查询群组	sql		{"table": "_group", "operation": "select"}
	  userGroupRolePageOrResourceManagement	selectRole	✅权限规则管理-查询角色	sql		{"table": "_role", "operation": "select"}
  	userGroupRolePageOrResourceManagement	selectResourceList	✅权限规则-查询协议列表	sql		{"table": "_resource", "operation": "select"}
	  userGroupRolePageOrResourceManagement	selectPageList	✅权限规则-查询页面列表	sql		{"table": "_page", "operation": "select"}
     */
    {
      actionId: "insertItemOfResource",
      resourceType: "sql",
      desc: "✅权限规则-协议管理-插入信息",
      resourceData: { table: "_user_group_role_resource", operation: "jhInsert" }
    },
    {
      actionId: "selectItemListOfResource",
      resourceType: "sql",
      desc: "✅权限规则-协议管理-查询数据列表",
      resourceData: { table: "_user_group_role_resource", operation: "select" }
    },
    {
      actionId: "updateItemOfResource",
      resourceType: "sql",
      desc: "✅权限规则-协议管理-更新数据",
      resourceData: { table: "_user_group_role_resource", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItemOfResource",
      resourceType: "sql",
      desc: "✅权限规则-协议管理-删除数据",
      resourceData: { table: "_user_group_role_resource", operation: "jhDelete" }
    },
    {
      actionId: "insertItemOfPage",
      resourceType: "sql",
      desc: "✅权限规则-页面管理-插入信息",
      resourceData: { table: "_user_group_role_page", operation: "jhInsert" }
    },
    {
      actionId: "selectItemListOfPage",
      resourceType: "sql",
      desc: "✅权限规则-页面管理-查询数据列表",
      resourceData: { table: "_user_group_role_page", operation: "select" }
    },
    {
      actionId: "updateItemOfPage",
      resourceType: "sql",
      desc: "✅权限规则-页面管理-更新数据",
      resourceData: { table: "_user_group_role_page", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItemOfPage",
      resourceType: "sql",
      desc: "✅权限规则-页面管理-删除数据",
      resourceData: { table: "_user_group_role_page", operation: "jhDelete" }
    },
    {
      actionId: "selectGroup",
      resourceType: "sql",
      desc: "✅权限规则管理-查询群组",
      resourceData: { table: "_group", operation: "select" }
    },
    {
      actionId: "selectRole",
      resourceType: "sql",
      desc: "✅权限规则管理-查询角色",
      resourceData: { table: "_role", operation: "select" }
    },
    {
      actionId: "selectResourceList",
      resourceType: "sql",
      desc: "✅权限规则-查询协议列表",
      resourceData: { table: "_resource", operation: "select" }
    },
    {
      actionId: "selectPageList",
      resourceType: "sql",
      desc: "✅权限规则-查询页面列表",
      resourceData: { table: "_page", operation: "select" }
    },
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "权限规则管理", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
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
             * 
             * 
             * 
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">用户ID/通配符(*)</span>
                <v-autocomplete
                  class="jh-v-input" dense filled single-line clearable
                  v-model="createItem.user" :items="constantObj.user.filter(item => item.value)" @change="onConstantChange($event, 'user')"
                  @update:search-input="onConstantChange($event, 'user')"></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">GroupID/通配符(*)</span>
                <v-autocomplete
                  class="jh-v-input" dense filled single-line clearable
                  v-model="createItem.group"
                  :items="constantObj.group.filter(item => item.value)"
                  @update:search-input="onConstantChange($event, 'group')">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">RoleID/通配符(*)</span>
                <v-autocomplete
                  class="jh-v-input" dense filled single-line clearable
                  v-model="createItem.role"
                  :items="constantObj.role.filter(item => item.value)"
                  @update:search-input="onConstantChange($event, 'role')">
                </v-autocomplete>
              </v-col>
              <v-col v-if="dataTypeSwitch === 0" cols="12" sm="12" md="4" xl="3" class="pb-3">
                <span class="jh-input-label">ResourceId/通配符(*)</span>
                <v-autocomplete
                  class="jh-v-input" dense filled single-line clearable
                  v-model="createItem.resource"
                  :items="constantObj.resource.filter(item => item.value)"
                  @update:search-input="onConstantChange($event, 'resource')">
                </v-autocomplete>
              </v-col>
              <v-col v-if="dataTypeSwitch === 1" cols="12" sm="12" md="4" xl="3" class="pb-3">
                <span class="jh-input-label">PageId/通配符(*)</span>
                <v-autocomplete
                  class="jh-v-input" dense filled single-line clearable
                  v-model="createItem.page"
                  :items="constantObj.page.filter(item => item.value)"
                  @update:search-input="onConstantChange($event, 'page')">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">权限状态</span>
                <v-select
                  class="jh-v-input" dense filled single-line clearable
                  v-model="createItem.allowOrDeny"
                  :items="constantObj.allowOrDeny">
                </v-select>
              </v-col>
              <v-col cols="12" sm="12" md="12" xl="12">
                <span class="jh-input-label">desc</span>
                <v-textarea class="jh-v-input" dense filled single-line label="desc" v-model="createItem.desc"></v-textarea>
              </v-col>
             */
            { label: "用户ID/通配符(*)", model: "user", tag: "v-autocomplete", attrs: { ':items': "constantObj.user.filter(item => item.value)", '@change': "onConstantChange($event, 'user')", '@update:search-input': "onConstantChange($event, 'user')"} },
            { label: "GroupID/通配符(*)", model: "group", tag: "v-autocomplete", attrs: { ':items': "constantObj.group.filter(item => item.value)", '@update:search-input': "onConstantChange($event, 'group')"} },
            { label: "RoleID/通配符(*)", model: "role", tag: "v-autocomplete", attrs: { ':items': "constantObj.role.filter(item => item.value)", '@update:search-input': "onConstantChange($event, 'role')"} },
            { label: "ResourceId/通配符(*)", model: "resource", tag: "v-autocomplete", colAttrs: {vIf: 'dataTypeSwitch == 0'}, attrs: { ':items': "constantObj.resource.filter(item => item.value)", '@update:search-input': "onConstantChange($event, 'resource')"} },
            { label: "PageId/通配符(*)", model: "page", tag: "v-autocomplete", colAttrs: {vIf: 'dataTypeSwitch == 1'}, attrs: { ':items': "constantObj.page.filter(item => item.value)", '@update:search-input': "onConstantChange($event, 'page')"} },
            { label: "权限状态", model: "allowOrDeny", tag: "v-select", attrs: {':items': 'constantObj.allowOrDeny'} },
            { label: "desc", model: "desc", tag: "v-text-field", colAttrs: { md: 9 } },
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
            { label: "用户ID/通配符(*)", model: "user", tag: "v-autocomplete", attrs: { ':items': "constantObj.user.filter(item => item.value)", '@change': "onConstantChange($event, 'user')", '@update:search-input': "onConstantChange($event, 'user')"}, quickAttrs: ['clearable'] },
            { label: "GroupID/通配符(*)", model: "group", tag: "v-autocomplete", attrs: { ':items': "constantObj.group.filter(item => item.value)", '@update:search-input': "onConstantChange($event, 'group')"}, quickAttrs: ['clearable'] },
            { label: "RoleID/通配符(*)", model: "role", tag: "v-autocomplete", attrs: { ':items': "constantObj.role.filter(item => item.value)", '@update:search-input': "onConstantChange($event, 'role')"}, quickAttrs: ['clearable'] },
            { label: "ResourceId/通配符(*)", model: "resource", tag: "v-autocomplete", colAttrs: {vIf: 'dataTypeSwitch == 0'}, attrs: { ':items': "constantObj.resource.filter(item => item.value)", '@update:search-input': "onConstantChange($event, 'resource')"}, quickAttrs: ['clearable'] },
            { label: "PageId/通配符(*)", model: "page", tag: "v-autocomplete", colAttrs: {vIf: 'dataTypeSwitch == 1'}, attrs: { ':items': "constantObj.page.filter(item => item.value)", '@update:search-input': "onConstantChange($event, 'page')"}, quickAttrs: ['clearable'] },
            { label: "权限状态", model: "allowOrDeny", tag: "v-select", attrs: {':items': 'constantObj.allowOrDeny'} },
            { label: "desc", model: "desc", tag: "v-text-field", colAttrs: { md: 9 } },
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

      // 常量下拉选项
      constantObj: {
        dataType: ['接口权限', '页面权限'],
        user: [{"value": "*", "text": "通配符*"}, {custom: true}],
        group: [{"value": "*", "text": "通配符*"}, {custom: true}],
        role: [{"value": "*", "text": "通配符*"}, {custom: true}],
        resource: [{"value": "*", "text": "通配符*"}, {custom: true}],
        page: [{"value": "*", "text": "通配符*"}, {custom: true}],
        allowOrDeny: [{"value": "allow", "text": "Allow"}, {"value": "deny", "text": "Deny"}],
      },
      searchInput: null,
      dataTypeSwitch: 0,
      pageTableDataFromBackend: [],
      tabPageHeaders: [],
      resourceHeaders: [
        {text: "用户ID/通配符(*)", value: "user", width: 120},
        {text: "GroupID/通配符(*)", value: "group", width: 120},
        {text: "RoleId/通配符(*)", value: "role", width: 120},
        {text: "ResourceId/通配符(*)", value: "resource", width: 120, class: 'fixed', cellClass: 'fixed'},
        {text: "权限状态", value: "allowOrDeny", width: 120},
        {text: "说明", value: "desc", width: 420},
        {text: "操作人", value: "operationByUser", width: 120},
        {text: "操作时间", value: "operationAt", width: 160},
        {text: '操作', value: 'action', align: 'center', sortable: false, width: 120, class: 'fixed', cellClass: 'fixed'},
      ],
      // 页面权限字段
      pageHeaders: [
        {text: "用户ID/通配符(*)", value: "user", width: 120},
        {text: "GroupID/通配符(*)", value: "group", width: 120},
        {text: "RoleId/通配符(*)", value: "role", width: 120},
        {text: "PageId/通配符(*)", value: "page", width: 120, class: 'fixed', cellClass: 'fixed'},
        {text: "权限状态", value: "allowOrDeny", width: 120},
        {text: "说明", value: "desc", width: 420},
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
              pageId: 'userGroupRolePageOrResourceManagement',
              actionId: `selectItemListOf${this.pageId}`
            }
          }
        });
        this.tableDataFromBackend = result.data.appData.resultData.rows;
        this.isTableLoading = false;
      },
      async setConstantDefault() {
        this.constantObj = {
          dataType: ['接口权限', '页面权限'],
          user: [{"value": "*", "text": "通配符*"}, {custom: true}],
          group: [{"value": "*", "text": "通配符*"}, {custom: true}],
          role: [{"value": "*", "text": "通配符*"}, {custom: true}],
          resource: [{"value": "*", "text": "通配符*"}, {custom: true}],
          page: [{"value": "*", "text": "通配符*"}, {custom: true}],
          allowOrDeny: [{"value": "allow", "text": "Allow"}, {"value": "deny", "text": "Deny"}],
        };
      },
      // ---------------新增数据 uiAction >>>>>>>>>>>>>>>> ---------------
      async prepareDoCreateItem() {
        this.createActionId = `insertItemOf${this.pageId}`;
        this.createActionData = this.createItem;
      },
      async doCreateItem() {
        await window.vtoast.loading("保存中");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userGroupRolePageOrResourceManagement',
              actionId: this.createActionId,
              actionData: this.createActionData
            }
          }
        })
        await window.vtoast.success("保存成功");
      },
      // ---------------新增数据 uiAction <<<<<<<<<<<<<<<< ---------------
      // ---------------编辑数据 uiAction >>>>>>>>>>>>>>>> ---------------
      async prepareUpdateItem(funObj) {
        this.updateItem = _.cloneDeep(funObj);
        this.currentOperation = 'updateItem';
        Object.keys(this.updateItem).forEach((key) => {
          this.onConstantChange(this.updateItem[key], key)
        })
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
              pageId: 'userGroupRolePageOrResourceManagement',
              actionId: this.updateActionId,
              actionData: this.updateActionData,
              where: {id: this.updateItemId}
            }
          }
        })
        await window.vtoast.success("修改成功");
      },
      // ---------------编辑数据 uiAction <<<<<<<<<<<<<<<< ---------------
      // ---------------删除数据 uiAction >>>>>>>>>>>>>>>> ---------------
      async prepareDeleteItem(funObj) {
        this.deleteItemId = funObj.id;
        this.deleteActionId = `deleteItemOf${this.pageId}`;
      },
      async doDeleteItem() {
        window.vtoast.loading('正在删除');
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userGroupRolePageOrResourceManagement',
              actionId: this.deleteActionId,
              where: {id: this.deleteItemId}
            }
          }
        });
        window.vtoast.success('删除成功');
        this.deleteActionId = null;
        this.deleteItemId = null;
      },
      // description: ✅动态增加下来选项
      onConstantChange(e, key) {
        if (!this.constantObj[key]) {
          return;
        }
        if (e && e !== '*' && e !== '通配符*') {
          let customItem = this.constantObj[key].find(item => item.custom);
          if (!customItem) {
            return;
          }
          this.$set(customItem, 'value', e);
          this.$set(customItem, 'text', e);
          if (this.currentOperation === 'createItem') {
            this.createItem[key] = e
          }
          if (this.currentOperation === 'updateItem') {
            this.updateItem[key] = e
          }
        }
      }
      // ---------------删除数据 uiAction <<<<<<<<<<<<<<<< ---------------
    }
  },
  
};

module.exports = content;
