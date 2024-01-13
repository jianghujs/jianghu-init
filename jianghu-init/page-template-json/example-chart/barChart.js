
const content = {
  pageType: "jh-component", pageName: "bar图表", componentPath: "exampleChart/barChart",
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
      barChartOption: {
        xAxis: {
          max: "dataMax"
        },
        yAxis: {
          type: "category",
          data: [
            "初步沟通",
            "验证客户",
            "报价",
            "赢单",
            "输单"
          ]
        },
        series: [
          {
            name: "金额",
            type: "bar",
            data: [
              1000,
              2000,
              4000,
              6000,
              2000
            ],
            label: {
              show: true,
              position: "right"
            }
          }
        ]
      }
    },
  },
  pageContent: {
    tag: "v-chart",
    attrs: {
      ':option': 'barChartOption',
      style: 'height: 300px;',
      autoresize: true,
      ref: 'barChart',
      ':loading': 'isLoading',
    },
    value: ''
  },
};

module.exports = content;
    