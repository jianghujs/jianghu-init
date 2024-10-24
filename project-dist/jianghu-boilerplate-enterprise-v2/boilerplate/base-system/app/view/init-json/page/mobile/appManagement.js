const content = {
  pageType: "jh-mobile-page", pageId: "mobile/appManagement", pageName: "应用管理", template: 'jhMobileTemplateV4', version: 'v2',
  resourceList: [
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
      resourceHook: {},
      desc: "✅添加-enterprise_app",
      resourceData: {
        table: "enterprise_app",
        operation: "jhInsert"
      }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅更新-enterprise_app",
      resourceData: {
        table: "enterprise_app",
        operation: "jhUpdate"
      }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅删除-enterprise_app",
      resourceData: {
        table: "enterprise_app",
        operation: "jhDelete"
      }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "应用管理", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'jh-order' },
    {
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      searchList: [
        { tag: "v-select", model: "serverSearchWhere.userStatus", attrs: {prefix: '用户状态：', ':items': 'constantObj.userStatus' }, quickAttrs: ['clearable'] },
      ], 
    },
    { tag: 'v-spacer' },
    { tag: 'jh-mode' }
  ],
  pageContent: [
    {
      tag: 'jh-list',
      props: { limit: 20 },
      attrs: { cols: 12, class: 'p-0 pb-7', ':style': '`height: calc(100vh - 140px); overflow-y: auto;overscroll-behavior: contain`' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")', small: true } },
        { tag: 'v-spacer' },
        // 默认筛选
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '3', class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: {prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true} },
          ],
        }
      ],
      headers: [
        {text: "应用ID", value: "appId", isSimpleMode: true},
        {text: "应用名", value: "appName", isTitle: true},
        {text: "应用类型", value: "appType", isSimpleMode: true},
        {text: "操作人", value: "operationByUser"},
        {text: "操作时间", value: "operationAt"},
        {text: '操作', value: 'action', align: 'center', sortable: false, width: 'window.innerWidth < 500 ? 80 : 200', class: 'fixed', cellClass: 'fixed'},

        // width 表达式需要使用字符串包裹
      ],
      value: [
        // vuetify table custom slot
      ],
      rowActionList: [
        /**
         * 
                  <span
                    role="button" class="success--text font-weight-medium font-size-2 mr-2"
                    @click="doUiAction('openUserDrawer',item.appId)">
                    <v-icon size="16" class="success--text">mdi-account-supervisor</v-icon>用户管理
                  </span> 
                  <span role="button" class="success--text font-weight-medium font-size-2 mr-2" @click="doUiAction('startUpdateItem', item)">
                    <v-icon size="16" class="success--text">mdi-note-edit-outline</v-icon>修改
                  </span>
                  <span role="button" class="red--text text--accent-2 font-weight-medium font-size-2" @click="doUiAction('deleteItem', item)">
                    <v-icon size="16" class="red--text text--accent-2">mdi-trash-can-outline</v-icon>删除
                  </span>
         */
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '用户列表', icon: 'mdi-account-supervisor', color: 'success', click: 'doUiAction("viewUserList", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
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
             * 
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">应用ID<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense single-line filled label="应用ID" v-model="createItem.appId" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">应用名<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense single-line filled label="应用名" v-model="createItem.appName" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">应用类型</span>
                <v-text-field class="jh-v-input" dense single-line filled label="应用类型" v-model="createItem.appType"></v-text-field>
              </v-col>
             */
            { label: "应用ID", model: "appId", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "应用名", model: "appName", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "应用类型", model: "appType", tag: "v-text-field" },
          ], 
          action: [{
            tag: "v-btn",
            value: "新增",
            attrs: {
              color: "success",
              ':small': true,
              class: 'ml-2',
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
            { label: "应用ID", model: "appId", tag: "v-text-field", attrs: { disabled: true } },
            { label: "应用名", model: "appName", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "应用类型", model: "appType", tag: "v-text-field" },

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
      title: '编辑',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "编辑", 
          type: "preview", 
          formItemList: [
            { label: "应用ID", model: "appId", tag: "span", colAttrs: { class: 'border-b py-3 flex justify-between' }, value: "{{ detailItem.appId }}" },
            { label: "应用名", model: "appName", tag: "span", colAttrs: { class: 'border-b py-3 flex justify-between' }, value: "{{ detailItem.appName }}" },
            { label: "应用类型", model: "appType", tag: "span", colAttrs: { class: 'border-b py-3 flex justify-between' }, value: "{{ detailItem.appType }}" },

          ], 
          action: [
            /**
             * 
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '用户列表', icon: 'mdi-account-supervisor', color: 'success', click: 'doUiAction("viewUserList", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
             */
            {
              tag: "v-btn",
              value: "编辑",
              attrs: {
                color: "primary",
                '@click': "doUiAction('startUpdateItem', detailItem); closeDetailDrawer()"
              }
            },
            {
              tag: "v-btn",
              value: "用户列表",
              attrs: {
                color: "primary",
                '@click': "doUiAction('viewUserList', detailItem); closeDetailDrawer()"
              }
            },
            {
              tag: "v-btn",
              value: "删除",
              attrs: {
                color: "error",
                '@click': "doUiAction('deleteItem', detailItem); closeDetailDrawer()"
              }
            }
          ],
        },
      ]
    },
    {
      tag: 'jh-drawer',
      key: 'userList',
      attrs: {},
      title: '用户列表',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "用户列表", 
          type: "component", 
          componentPath: "userList", 
          attrs: { ':app-id': 'userListItem.appId', class: 'px-0 px-md-4 pa-4' },
          action: [],
        },
      ]
    }
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {},
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
    },
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    created() {
      this.doUiAction('getTableData')
    },
    methods: {}
  },
  
};

module.exports = content;
