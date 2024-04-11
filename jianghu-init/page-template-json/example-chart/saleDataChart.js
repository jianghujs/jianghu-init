
const content = {
  pageType: "jh-component", pageName: "saleData图表", componentPath: "exampleChart/saleDataChart",
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
      saleData: [
        {
          label: "新增客户",
          number: 2,
          unit: "人",
          rate: "100%",
          status: "up",
          chartOption: {
            color: [
              "#5470C6"
            ],
            data: [
              0,
              2,
              5,
              9,
              5,
              10,
              3
            ]
          }
        },
        {
          label: "新增联系人",
          number: 2,
          unit: "人",
          rate: "100%",
          status: "up",
          chartOption: {
            color: [
              "#5470C6"
            ],
            data: [
              0,
              2,
              5,
              9,
              5,
              10,
              3
            ]
          }
        },
        {
          label: "新增商机",
          number: 2,
          unit: "个",
          rate: "-20%",
          status: "down",
          chartOption: {
            color: [
              "#5470C6"
            ],
            data: [
              0,
              2,
              5,
              9,
              5,
              10,
              3
            ]
          }
        },
        {
          label: "新增合同",
          number: 2,
          unit: "个",
          rate: "100%",
          status: "up",
          chartOption: {
            color: [
              "#5470C6"
            ],
            data: [
              0,
              2,
              5,
              9,
              5,
              10,
              3
            ]
          }
        }
      ]
    },
  },
  pageContent: {
    
    tag: "v-card",
    attrs: {
      class: 'rounded-lg jh-dashboard-card',
    },
    value: [
      { tag: 'div', attrs: { class: 'd-flex align-center py-4' }, value: '<div class="font-weight-medium text-subtitle-2">销售简报</div>' },
      { tag: 'div', attrs: { class: 'pb-4' }, value: `
      <v-row dense>
        <v-col cols="12" xs="12" sm="12" md="3"
          v-for="(item, index) in saleData"  
          :key="index"
          >
          <v-card class="rounded-lg pa-4" outlined role="button">
            <v-row dense align="center">
              <v-col cols="12" xs="12" sm="12" md="6">
                <div>{{item.label}}</div>
                <div class="mt-2"><span class="font-weight-bold text-subtitle-2 mr-1">{{item.number}}</span>{{item.unit}}</div>
                <div class="d-flex align-center mt-2">
                  <div class="mr-2">较上月</div>
                  <div class="mr-2" :class="item.status === 'up' ? 'red--text' : 'success--text'">{{item.rate}}</div>
                  <div>
                    <v-icon v-if="item.status === 'up'" size="18" color="red">mdi-arrow-up-bold</v-icon>
                    <v-icon v-if="item.status === 'down'" size="18" color="green">mdi-arrow-down-bold</v-icon>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="6">
                <v-sparkline
                  :gradient="item.chartOption.color"
                  line-width="2"
                  padding="8"
                  smooth="10"
                  :value="item.chartOption.data"
                  auto-draw
                ></v-sparkline>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row> 
      ` },
    ]
  },
};

module.exports = content;
    