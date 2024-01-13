
const content = {
  pageType: "jh-component", pageName: "gauge图表", componentPath: "exampleChart/gaugeChart",
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
      gaugeChartOption: {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
          {
            name: "Pressure",
            type: "gauge",
            detail: {
              formatter: "{value}%"
            },
            data: [
              {
                value: 50,
                name: "完成率"
              }
            ]
          }
        ]
      },
    },
  },
  pageContent: {
    tag: "v-chart",
    attrs: {
      ':option': 'gaugeChartOption',
      style: 'height: 300px;',
      autoresize: true,
      ref: 'gaugeChart',
      ':loading': 'isLoading',
    },
    value: ''
  },
};

module.exports = content;
    