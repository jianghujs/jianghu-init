const content = {
  pageType: "jh-page", pageId: "example/index", pageName: "page页面", 
  includeList: [], // 'import { xxx } from "xxx";', 'const xxx = xxx;',
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
      testString: '测试字符串', // 字符串变量需要使用双层引号包裹
      tableSelected: [],
      serverSearchWhereLike: { className: '' },
      serverSearchWhere: { classType: '' },
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500', // data 表达式
    },
    doUiAction: {
      'startUpdateBalance': ['prepareUpdateBalanceData', 'openUpdateBalanceDrawer'],
    },
    watch: {},
    methods: {
    }
  },
  pageContent: {
    tag: 'view',
    attrs: { class: 'bg-gray-100' },
    value: []
  },
  style: '',
};

module.exports = content;
