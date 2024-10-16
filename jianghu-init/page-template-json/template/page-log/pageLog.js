const content = {
  "pageType": "jh-page",
  "pageId": "pageLog",
  "table": "_user",
  "pageName": "页面访问日志",
  "resourceList": [
    {
      "actionId": "selectLogFileList",
      "desc": "✅✅查询日志文件列表",
      "resourceType": "service",
      "resourceData": {
        "service": "pageLog",
        "serviceFunction": "selectLogFileList"
      }
    },
    {
      "actionId": "selectItemListFromLogFile",
      "desc": "✅查询日志文件内容",
      "resourceType": "service",
      "resourceData": {
        "service": "pageLog",
        "serviceFunction": "selectItemListFromLogFile"
      }
    }
  ],
  "includeList": [],
  headContent: [
    { tag: 'jh-page-title', value: "页面访问日志", attrs: { cols: 12, sm: 6, md: 4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    {
      tag: 'jh-search',
      value: [
        { tag: 'v-select', attrs: { vModel: 'logFileSelected', items: 'constantCollection.logFile', prefix: '文件：', hideDetails: true } },
      ],
      searchBtn: true
    }
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
      value: [
         /*html*/`
         `
      ],
      rowActionList: [
      ],
    }
  ],
  "actionContent": [

  ],
  "common": {
    data: {
      // 面包屑
      breadcrumbs: [
        { text: '首页', disabled: true, },
        { text: '页面访问日志', disabled: true, }
      ],
      // 表格相关数据
      isFormValid: true,
      requireRules: [
        v => !!v || 'This is required',
      ],
      constantCollection: {
        logFile: [],
      },

      logFileSelected: null,
      searchInput: null,
      isTableLoading: true,

      tableDataFromBackend: [],
      headers: [
        { text: "访问时间", value: "date", width: 220, class: 'fixed', cellClass: 'fixed' },
        { text: "访问页面Id", value: "pageId", width: 220 },
        { text: "访问页面", value: "pageName", width: 120 },
        { text: "访问用户Id", value: "userId", width: 90 },
        { text: "访问用户名", value: "username", width: 90 },
        { text: "设备Id", value: "deviceId", width: 120 },
        { text: "设备类型", value: "deviceType", width: 120 },
        { text: "服务器主机名", value: "hostname", width: 220 },
        { text: "服务进程Id", value: "pid", width: 120 },
      ],
    },
    computed: {
      tableData() {
        return this.tableDataFromBackend;
      }
    },
    watch: {
      logFileSelected() {
        this.doUiAction('getTableData');
      }
    },
    async created() {
      await this.doUiAction('selectLogFileList');
      if (this.constantCollection.logFile.length > 0) {
        this.logFileSelected = this.constantCollection.logFile[0].filename;
      }
      await this.doUiAction('getTableData');
    },
    mounted() { },
    methods: {
      async doUiAction(uiActionId, uiActionData) {
        switch (uiActionId) {
          case 'selectLogFileList':
            await this.selectLogFileList();
            break;
          case 'getTableData':
            await this.getTableData();
            break;
          default:
            console.error("[doUiAction] uiActionId not find", { uiActionId });
            break;
        }
      },
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
        this.constantCollection.logFile = rows.map(item => {
          const { filename } = item;
          return { text: filename, value: filename, filename };
        });
      },
      async getTableData() {
        this.isTableLoading = true;
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'pageLog',
              actionId: 'selectItemListFromLogFile',
              actionData: { logFile: this.logFileSelected },
            }
          }
        });
        const { rows } = result.data.appData.resultData;

        this.tableDataFromBackend = rows;
        this.isTableLoading = false;
      },
      // =================================uiAction 公共方法 end ======================================
    }
  },
}

module.exports = content;