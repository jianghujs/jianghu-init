
const content = {
  pageType: "jh-component", pageName: "line图表", componentPath: "exampleChart/lineChart",
  resourceList: [], // 额外resource { actionId, resourceType, resourceData }
  drawerList: [], // 抽屉列表 { key, title, contentList }
  includeList: [], // 其他资源引入
  common: {
    props: {
      month: {
        type: String,
        default: ""
      },
    },
    watch: {
      month (val) {
        this.isLoading = true;
        setTimeout(() => {
          this.isLoading = false;
        }, 1000);
      },
    },
    data: {
      isLoading: false,
      lineChartOption: {
        xAxis: {
          type: "category",
          data: [
            "2023-01",
            "2023-02",
            "2023-03",
            "2023-04",
            "2023-05",
            "2023-06"
          ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [
              0,
              2000,
              4000,
              6000,
              2000,
              2000
            ],
            type: "line"
          }
        ]
      }
    },
  },
  pageContent: {
    tag: "v-chart",
    attrs: {
      ':option': 'lineChartOption',
      style: 'height: 300px;',
      autoresize: true,
      ref: 'lineChart',
      ':loading': 'isLoading',
    },
    value: ''
  },
};

module.exports = content;
    