const content = {
  pageType: "jh-component", pageId: "exampleClass", table: "example_student", pageName: "班级学生列表", componentPath: "example/studentOfClass",
  resourceList: [
    {
      actionId: "exampleStudent-selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅查询列表-exampleStudent",
      resourceData: {
        table: "example_student",
        operation: "select"
      }
    },
    {
      actionId: "exampleStudent-insertItem",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅添加-exampleStudent",
      resourceData: {
        table: "example_student",
        operation: "jhInsert"
      }
    },
    {
      actionId: "exampleStudent-updateItem",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅更新-exampleStudent",
      resourceData: {
        table: "example_student",
        operation: "jhUpdate"
      }
    },
    {
      actionId: "exampleStudent-deleteItem",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅删除-exampleStudent",
      resourceData: {
        table: "example_student",
        operation: "jhDelete"
      }
    },
    {
      actionId: "selectRecordHistory",
      resourceType: "sql",
      resourceData: {
        table: "_record_history",
        operation: "select"
      }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  includeList: [], // { type: < js | css | html >, path: ''}
  common: {
    props: {
      classId: {
        type: String,
        required: true,
        default: ''
      },
    },
    data: {
      constantObj: {
        gender: ["全部", "男", "女"],
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
      serverSearchWhereLike: {},
      serverSearchWhere: {},
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500', // data 表达式
    },
    watch: {
      classId: {
        immediate: true,
        handler(val) {
          if (!val) return;
          this.serverSearchPropsWhere.classId = val;
          this.doUiAction('getTableData');
        }
      }
    },
    computed: {},
  },
  headContent: [
    { tag: 'jh-page-title', value: "班级学生页面", attrs: {}, helpBtn: true, slot: [] },
    { 
      tag: 'jh-search', 
      value: [
        { tag: "v-text-field", model: "serverSearchWhereLike.className", attrs: {prefix: '前缀'} },
      ], 
      searchBtn: {}
    }
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs:{},
      value: [
        { text: "学生ID", value: "studentId", type: "v-text-field", width: 80, sortable: true}, // 格式化、插槽
        { text: "学生名字", value: "name", type: "v-text-field", width: 80, sortable: true },
        { text: "性别", value: "gender", type: "v-text-field", width: 80, sortable: true },
        { text: "出生日期", value: "dateOfBirth", type: "v-text-field", width: 80, sortable: true, 
          formatter: '<v-icon></v-icon>{{dayjs(item.dateOfBirth).format("YYYY-MM")}}'},
        { text: "班级ID", value: "classId", type: "v-text-field", width: 80, sortable: true, formatter: [
            {
              tag: "v-chip",
              value: '{{dayjs(item.dateOfBirth).format("YYYY-MM")}}',
              attrs: {
                color: 'success',
                small: true,
                'v-if': 'item.classId === "1"',
                '@click': 'doUiAction("viewDetail", item)'
              },
            },
            {
              tag: "v-chip",
              value: '{{dayjs(item.dateOfBirth).format("YYYY-MM")}}',
              attrs: {
                color: 'success',
                small: true,
                '@click': 'doUiAction("viewDetail", item)'
              },
            }
          ]
        },
        { text: "年级", value: "level", type: "v-text-field", width: 80, sortable: true },
        { text: "身高", value: "bodyHeight", type: "v-text-field", width: 80, sortable: true },
        { text: "学生状态", value: "studentStatus", type: "v-text-field", width: 80, sortable: true },
        { text: "备注", value: "remarks", type: "v-text-field", width: 80, sortable: true },
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 120', align: "center", class: "fixed", cellClass: "fixed" },
        // width 表达式需要使用字符串包裹
      ],
      rowActionList: [],
      headActionList: []
    }
  ],

  actionContent: [
    {
      tag: 'jh-create-drawer',
      key: "create",
      attrs: {},
      title: '新增班级',
      headSlot: [],
      contentList: [
        { 
          label: "新增", 
          type: "form", 
          formItemList: [
            { label: "学生ID", model: "studentId", tag: "v-text-field", idGenerate: { prefix: "S", startValue: 10001, bizId: "studentId" }, attrs: { disabled: true, placeholder: "规则自动生成" }},
            { label: "学生名字", model: "name", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "性别", model: "gender", tag: "v-select", rules: "[v => !!v || '此项必填',]", required: true, attrs: { ':items': 'constantObj.gender' }, default: "'男'" },
            { label: "出生日期", model: "dateOfBirth", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "班级ID", model: "classId", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "年级", model: "level", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "身高", model: "bodyHeight", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "学生状态", model: "studentStatus", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "备注", model: "remarks", tag: "v-text-field", rules: "validationRules.requireRules", required: true },

          ], 
          action: {
            tag: "v-btn",
            value: "新增",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('createItem')"
            }
          }, 
        },

      ]
    },
    {
      tag: 'jh-update-drawer',
      key: "update",
      attrs: {},
      title: '编辑班级',
      headSlot: [
        { tag: 'v-spacer' },
        { tag: 'v-btn', value: '自定义按钮', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("123")', small: true } },
      ],
      contentList: [
        { 
          label: "编辑", 
          type: "form", 
          formItemList: [
            { tag: 'h3', value: '分组1', cols: '12', colsAttrs: { class: 'pb-0' } }, // 表单分组
            { label: "学生ID", model: "studentId", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "学生名字", model: "name", tag: "v-text-field", rules: "[v => !!v || '此项必填',]", required: true },
            { label: "性别", model: "gender", tag: "v-select", rules: "validationRules.requireRules", required: true, attrs: { ':items': 'constantObj.gender' }},
            { label: "出生日期", model: "dateOfBirth", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { tag: 'h3', value: '分组2', cols: '12', colsAttrs: { class: 'pb-0' } }, // 表单分组
            { label: "班级ID", model: "classId", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "年级", model: "level", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "身高", model: "bodyHeight", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "学生状态", model: "studentStatus", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
            { label: "备注", model: "remarks", tag: "v-text-field", rules: "validationRules.requireRules", required: true },

          ], 
          action: {
            tag: "v-btn",
            value: "编辑",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('updateItem')"
            }
          }, 
        },
        { label: "操作记录", type: "component", componentPath: "recordHistory" },
      ]
    },
  ]
};

module.exports = content;
