/* eslint-disable */
const content = {
  pageType: "jh-page", pageId: "pageLog", pageName: "页面访问日志", version: 'v3',
  resourceList: [
    {
      actionId: "selectLogFileList",
      resourceType: "service",
      desc: "✅查看page log",
      resourceData: { service: "pageLog", serviceFunction: "selectLogFileList" }
    },
    {
      actionId: "selectItemListFromLogFile",
      resourceType: "service",
      desc: "✅查看page log 内容",
      resourceData: { service: "pageLog", serviceFunction: "selectItemListFromLogFile" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "页面访问日志", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    { 
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      value: [
        { tag: "v-select", model: "serverSearchWhere.logFile", colAttrs: { md: 5 }, attrs: {prefix: '文件', ':items': "constantObj.logFile" } },
      ], 
      searchBtn: true,
      data: {
        serverSearchWhere: { },
      }
    }
  ],
  pageContent: [
    {
      tag: 'jh-table',
      props: { 
        serverPagination: true,
      },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
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
        {text: "访问时间", value: "date", width: 200, class: 'fixed', cellClass: 'fixed'}, 
        {text: "访问页面", value: "pageName", width: 150, class: 'fixed', cellClass: 'fixed'}, 
        {text: "访问页面Id", value: "pageId", width: 220}, 
        {text: "访问用户Id", value: "userId", width: 120}, 
        {text: "访问用户名", value: "username", width: 120}, 
        {text: "设备Id", value: "deviceId", width: 120}, 
        {text: "设备类型", value: "deviceType", width: 120}, 
        {text: "服务器主机名", value: "hostname", width: 220}, 
        {text: "服务进程Id", value: "pid", width: 120}, 
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
    
    data: {
      constantObj: {
        logFile: [],
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      filterMap: {}, // 结果筛选条件
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
    computed: {
      isMobile() {
        return window.innerWidth < 600;
      },
    },
    watch: {
      logFileSelected() {
        this.doUiAction('getTableData');
      }
    },
    async created() {
      await this.doUiAction('selectLogFileList');
      if (this.constantObj.logFile.length > 0) {
        this.serverSearchWhere.logFile = this.constantObj.logFile[0].filename;
      }
      await this.doUiAction('getTableData');
    },
    doUiAction: {
      selectLogFileList: ['selectLogFileList'],
      getTableData: ['getTableData', 'formatTableData'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      // =================================uiAction 公共方法 start ======================================
      async selectLogFileList() {
        this.isTableLoading = true;
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'pageLog',
              actionId: 'selectLogFileList',
              actionData: {},
            }
          }
        });
        const { rows } = result.data.appData.resultData;
        this.constantObj.logFile = rows.map(item => {
          const { filename } = item;
          return { text: filename, value: filename, filename };
        });
        if (this.constantObj.logFile.length > 0) {
          this.serverSearchWhere.logFile = this.constantObj.logFile[0].filename;
        }
      },

      async getTableData() {
        if (!this.serverSearchWhere.logFile) return;
        this.isTableLoading = true;

        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'pageLog',
              actionId: 'selectItemListFromLogFile',
              actionData: { logFile: this.serverSearchWhere.logFile },
            }
          }
        });
        const { rows, count } = result.data.appData.resultData;
        
        this.tableOptions.totalCount = count || rows.length;
        this.tableDataFromBackend = rows;
        this.isTableLoading = false;
      },
      // =================================uiAction 公共方法 end ======================================
      reloadPage() {
        //console.log('captured page expire')
        this.tableDataFromBackend = [];
        window.location.reload();
      }
    }
  },
  
};

module.exports = content;
