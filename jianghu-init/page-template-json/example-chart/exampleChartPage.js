const content = {
  pageType: "jh-page", pageId: "exampleChartPage", pageName: "dashboard 页面", 
  // 1table 外需要添加的其他 resource
  resourceList: [
    { actionId: "balance-updateItem", resourceType: 'sql', resourceData: {
      table: "class",
      operation: "jhUpdate",
    } },
  ],
  // 自定义抽屉列表
  drawerList: [
  ],
  includeList: [
    { type: 'script', path: "/<$ ctx.app.config.appId $>/public/lib/echarts.min.js" },
    { type: 'script', path: "/<$ ctx.app.config.appId $>/public/lib/vue-echarts.min.js" },
    { type: 'include', path: "component/exampleChart/lineChart.html" },
    { type: 'include', path: "component/exampleChart/pieChart.html" },
    { type: 'include', path: "component/exampleChart/barChart.html" },
    { type: 'include', path: "component/exampleChart/saleDataChart.html" },
    { type: 'include', path: "component/exampleChart/gaugeChart.html" },
    { type: 'include', path: "component/classList.html" },
  ],
  common: {
    data: {
      constantObj: {
        classType: ["普通班", "重点班", "特长班"],
        classTypeColor: {
          "普通班": "success",
          "重点班": "warning",
          "特长班": "blue",
        }
      },
      validationRules: { 
        requireRules: [
          v => !!v || '此项必填',
        ],
        phoneRules: [
          v => !!v || '此项必填',
          v => /^1[3456789]d{9}$/.test(v) || '手机号格式错误',
        ],
      },
      tableSelected: [],
    },
    watch: {},
    methods: {
    }
  },
  headContent: {
    helpDrawer: {}, // 自动初始化md文件
    serverSearchList: [
      { tag: "v-date-picker", label: "日期", model: "serverSearchWhere.month",  attrs: { type: "month" } },
    ],
    serverSearchWhere: { month: "" },
    // serverSearchWhereLike: { className: null },
  },
  pageContent: {
    tag: 'v-row',
    attrs:{
      ':dense': true,
    },
    value: [
      { tag: 'v-col', attrs: { cols: '12', sm: '12', md: '12', lg: '12', xl: '12' }, value: '<v-card class="rounded-lg"><sale-data-chart></sale-data-chart></v-card>' },
      { tag: 'v-col', attrs: { cols: '6' }, value: '<v-card class="rounded-lg"><pie-chart :month="serverSearchWhere.month"></pie-chart></v-card>' },
      { tag: 'v-col', attrs: { cols: '6' }, value: '<v-card class="rounded-lg"><gauge-chart :month="serverSearchWhere.month"></gauge-chart></v-card>' },
      // { tag: 'v-col', attrs: { cols: '4' }, value: '<v-card class="rounded-lg" style="height: 100%;"><class-list :month="serverSearchWhere.month"></class-list></v-card>' },
      { tag: 'v-col', attrs: { cols: '6' }, value: '<v-card class="rounded-lg"><line-chart :month="serverSearchWhere.month"></line-chart></v-card>' },
      { tag: 'v-col', attrs: { cols: '6' }, value: '<v-card class="rounded-lg"><bar-chart :month="serverSearchWhere.month"></bar-chart></v-card>' },
    ],
  },
};

module.exports = content;