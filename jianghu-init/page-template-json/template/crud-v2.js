const content = {
  pageType: "${pageType}", pageId: "${pageId}", table: "${table}", pageName: "${pageName}", template: "jhMobileTemplateV4", version: 'v2', ${componentPath}
  resourceList: ${resourceList}, // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    ${headContent}
  ],
  pageContent: [
    ${pageContent}
  ],
  actionContent: [
    ${actionContent}
  ],
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
      ${commonDataStr}
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
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
    ${createdStr}
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      ${methodItemStr}
    }
  },
  ${style}
};

module.exports = content;