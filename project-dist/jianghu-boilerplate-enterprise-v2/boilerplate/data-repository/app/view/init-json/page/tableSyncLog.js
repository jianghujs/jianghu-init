const content = {
  pageType: "jh-page", pageId: "tableSyncLog", pageName: "同步日志", version: 'v2',
  resourceList: [
    /**
     * 	tableSyncLog	selectItemList	✅获取同步日志	sql		{"table": "_table_sync_log", "operation": "select"}
     */
    {
      actionId: "selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅获取同步日志",
      resourceData: {
        table: "_table_sync_log",
        operation: "select"
      }
    },
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "同步日志", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      props: {
        serverPagination: true,
      },
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headers: [
        {text: "数据库", value: "sourceDatabase", width: 140},
        {text: "表格", value: "sourceTable", width: 140},
        {text: "同步动作", value: "syncAction", width: 200},
        {text: "同步状态", value: "syncDesc", width: 300},
        {text: "同步时间", value: "syncTime", width: 200},
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
        this.tableData = this.tableDataFromBackend.map(item => {
          return {
            ...item,
            syncTime: item.syncTime ? dayjs(item.syncTime).format('YYYY-MM-DD HH:mm:ss') : '',
          };
        })
      }
    }
  },
  
};

module.exports = content;
