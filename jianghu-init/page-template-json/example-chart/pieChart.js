
const content = {
  pageType: "jh-component", pageName: "pie图表", componentPath: "exampleChart/pieChart",
  resourceList: [], // 额外resource { actionId, resourceType, resourceData }
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
       pieChartOption: {
         title: {
           left: "center"
         },
         tooltip: {
           trigger: "item"
         },
         legend: {
           orient: "vertical",
           left: "left"
         },
         series: [
           {
             name: "Access From",
             type: "pie",
             radius: "50%",
             data: [
               {
                 value: 1048,
                 name: "IT"
               },
               {
                 value: 735,
                 name: "设计"
               },
               {
                 value: 580,
                 name: "金融"
               },
               {
                 value: 484,
                 name: "电力"
               },
               {
                 value: 300,
                 name: "餐饮"
               }
             ],
             emphasis: {
               itemStyle: {
                 shadowBlur: 10,
                 shadowOffsetX: 0,
                 shadowColor: "rgba(0, 0, 0, 0.5)"
               }
             }
           }
         ]
       }
     },
  },
  pageContent: {
    
    tag: "v-chart",
    attrs: {
      ':option': 'pieChartOption',
      style: 'height: 300px;',
      autoresize: true,
      ref: 'pieChart',
      ':loading': 'isLoading',
    },
    value: ''
  },
};

module.exports = content;
    