const content = {
  pageType: "jh-page", pageId: "mysqlTrigger", pageName: "MySQL触发器", version: 'v2',
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
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      orderBy: [{column: 'TRIGGER_SCHEMA', order: 'desc'},{column: 'TRIGGER_NAME', order: 'desc'}],
      headers: [
        {text:"触发器-所在仓库", value:"TRIGGER_SCHEMA", width:150},
        {text:"触发器", value:"TRIGGER_NAME", width:80},
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
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      formatTableData() {
        this.tableData = this.tableDataFromBackend.filter(row => row.TRIGGER_SCHEMA != 'sys');
      },
    }
  },
  
};

module.exports = content;
