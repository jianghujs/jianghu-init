const content = {
  pageType: "jh-component", pageId: "appManagement", table: "_view02_user_app", pageName: "应用用户列表", componentPath: "userList",
  resourceList: [
    {
      actionId: "userList-selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅查询列表-enterprise_user_app",
      resourceData: {
        table: "_view02_user_app",
        operation: "select"
      }
    },
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  pageContent: [
    {
      tag: 'jh-table',
      attrs: { ':items': 'tableDataComputed', ':hide-default-footer': true },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        {
          tag: 'v-chip',
          value: '用户列表 {{ tableDataComputed.length }}',
        },
        { tag: 'v-spacer' },
        // 默认筛选
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '4', xs: 8, class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: {prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true} },
          ],
        }
      ],
      headers: [
        {text: "账号", value: "userId", width: 90},
        {text: "姓名", value: "username", width: 100},
        {text: "部门角色", value: "groupRoleName"},

        // width 表达式需要使用字符串包裹
      ],
      value: [
        // vuetify table custom slot
      ],
    }
  ],
  actionContent: [
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    props: {
      appId: {
        type: String,
        default: ''
      }
    },
    data: {
      constantObj: {},
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      testString: '测试字符串',
      serverSearchWhereLike: { className: '' },
      serverSearchWhere: {},
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
    computed: {
      tableDataComputed() {
        return this.tableData;
      }
    },
    async created() {
      this.serverSearchWhere.appId = this.appId;
      await this.getTableData();
    },
    mounted() {
      resetTableMaxHeight()
    },
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {}
  },
  
};

module.exports = content;
