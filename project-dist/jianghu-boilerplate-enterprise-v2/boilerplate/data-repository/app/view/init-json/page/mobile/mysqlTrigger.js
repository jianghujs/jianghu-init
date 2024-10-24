const content = {
  pageType: "jh-mobile-page", pageId: "mobile/mysqlTrigger", pageName: "MySQL触发器", version: 'v2', template: 'jhMobileTemplateV4',
  resourceList: [
    /**
     * 		mysqlTrigger	selectItemList	✅mysql触发器-查询列表	sql		{"table": "information_schema.triggers", "operation": "select"}
     */
    {
      actionId: "selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅mysql触发器-查询列表",
      resourceData: {
        table: "information_schema.triggers",
        operation: "select"
      }
    },
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "MySQL触发器", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'jh-order' },
    { tag: 'v-spacer' },
    { tag: 'jh-mode' }
  ],
  pageContent: [
    {
      tag: 'jh-list',
      props: {
        limit: 10,
      },
      attrs: { cols: 12, class: 'p-0 pb-7', ':style': '`height: calc(100vh - 140px); overflow-y: auto;overscroll-behavior: contain`' },
      headers: [
        {text:"触发器-所在仓库", value:"TRIGGER_SCHEMA", isTitle: true, width:150},
        {text:"触发器", value:"TRIGGER_NAME", isSimpleMode: true, width:80},
        {text:"触发器-事件", value:"EVENT_MANIPULATION", width:80},
        {text:"触发器-源表", value:"EVENT_OBJECT_TABLE", width:80},
        // width 表达式需要使用字符串包裹
      ],
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
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件

      tableDataOrder: [{column: 'TRIGGER_SCHEMA', order: 'desc'},{column: 'TRIGGER_NAME', order: 'desc'}],
      tableDataOrderList: [
        {text: '触发器-所在仓库', value: [{column: 'TRIGGER_SCHEMA', order: 'desc'},{column: 'TRIGGER_NAME', order: 'desc'}]},
      ],
      viewMode: 'detail'
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
    created() {
      this.doUiAction('getTableData');
    },
    doUiAction: {
      startDetailItem: []
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      formatTableData() {
        this.tableData = this.tableDataFromBackend.filter(row => row.TRIGGER_SCHEMA != 'sys');
      },
    }
  },
  
};

module.exports = content;
