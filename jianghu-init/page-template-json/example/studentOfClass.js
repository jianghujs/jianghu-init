const content = {
  pageType: "jh-component", pageId: "exampleClass", table: "example_student", pageName: "班级学生列表", componentPath: "example/studentOfClass",
  resourceList: [], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  drawerList: [], // { key: '', title: '', contentList: [] }
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
      isMobile: 'window.innerWidth < 500', // 表达式使用字符串包裹
      testString: '"测试字符串"', // 字符串变量需要使用双层引号包裹
      tableSelected: [],
    },
    watch: {
      classId: {
        immediate: true,
        handler(val) {
          this.doUiAction('getTableData');
        }
      }
    },
    computed: {},
  },
  headContent: {
    serverSearchList: [
        { tag: "v-text-field",  label: "学生名字",    model: "serverSearchWhereLike.name",                                          },
        { tag: "v-select",      label: "性别",       model: "serverSearchWhere.gender",           attrs: { items: 'constantObj.gender' } },
        // { tag: "v-date-picker", label: "出生日期",    model: "serverSearchWhereLike.dateOfBirth",  attrs: { type: "month" },             },
    ],
    serverSearchWhere: { gender: "全部" },
    serverSearchWhereLike: { name: null, dateOfBirth: null },
  },
  pageContent: {
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
  },
  createDrawerContent: {
    formItemList: [
      { label: "学生ID", model: "studentId", tag: "v-text-field", idGenerate: { prefix: "S", startValue: 10001, bizId: "studentId" }, attrs: { disabled: true, placeholder: "规则自动生成" }},
      { label: "学生名字", model: "name", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
      { label: "性别", model: "gender", tag: "v-select", rules: "[v => !!v || '此项必填',]", required: true, attrs: { ':items': 'constantObj.gender' }, default: "男" },
      { label: "出生日期", model: "dateOfBirth", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
      { label: "班级ID", model: "classId", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
      { label: "年级", model: "level", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
      { label: "身高", model: "bodyHeight", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
      { label: "学生状态", model: "studentStatus", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
      { label: "备注", model: "remarks", tag: "v-text-field", rules: "validationRules.requireRules", required: true },
    ],
  },
  updateDrawerContent: {
    contentList: [
      { label: "详细信息", type: "form", formItemList: [
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

      ], action: "doUiAction('updateItem')" },
      { label: "操作记录", type: "component", componentPath: "recordHistory"},
    ]
  },
  deleteContent: {},
};

module.exports = content;
