const content = {
  pageType: "${pageType}", pageId: "${pageId}", pageName: "${pageId}页面", template: "jhMobileTemplateV4", ${componentPath}
  resourceList: ${resourceList}, // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "${pageId}", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },

    { 
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      searchList: [
        { tag: "v-text-field", model: "serverSearchWhereLike.className", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '前缀'} },
      ], 
    },
    { tag: 'v-spacer'},
    { tag: 'jh-mode', title: '简单模式', icon: 'mdi-view-carousel-outline', model: 'viewMode', items: 'constantObj.viewModeList' },
  ],
  pageContent: ${pageContent},
  ${actionContent},
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    ${propsStr}
    data: {
      constantObj: {
        viewModeList: [
          { text: "简洁模式", value: "simple" },
          { text: "详细模式", value: "detail" }
        ]
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件
      tableDataOrder: [
        {
          column: "operationAt",
          order: "desc"
        }
      ],
      tableDataOrderList: [
        { text: "更新时间↓", value: [
          {
            column: "operationAt",
            order: "desc"
          },
        ] },
        { text: "更新时间↑", value: [
          {
            column: "operationAt",
            order: "asc"
          },
        ] },
      ],
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
    async created() {
      await this.doUiAction('getTableData');
    },
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {}
  },
  ${style}
};

module.exports = content;