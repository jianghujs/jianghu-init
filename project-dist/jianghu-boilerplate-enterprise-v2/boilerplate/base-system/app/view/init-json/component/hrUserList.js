const content = {
  pageType: "jh-component", pageId: "staffUserList", table: "view01_employee", pageName: "人资用户列表", componentPath: "hrUserList",
  resourceList: [
    {
      actionId: "hrUserList-selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅查询列表",
      resourceData: {
        table: "view01_employee",
        operation: "select"
      }
    },
  ], 
  pageContent: [
    {
      tag: 'jh-table',
      attrs: { 'v-model': 'tableSelected', ':show-select': true, ':items': 'tableDataComputed', ':hide-default-footer': true },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '批量-创建用户', attrs: { color: 'success', class: 'mr-2', '@click': 'batchEmitAdd(tableSelected)', small: true, ':outlined': true, 'v-if': 'status == "在职"', ':disabled': '!tableSelected.length' } },
        { tag: 'v-btn', value: '批量-删除用户', attrs: { color: 'error', class: 'mr-2', '@click': 'batchEmitDelete(tableSelected)', small: true, ':outlined': true, 'v-if': 'status == "已离职"', ':disabled': '!tableSelected.length' } },
        { tag: 'v-spacer' },
        // 默认筛选
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '4', xs: '8', class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: {prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true} },
          ],
        }
      ],
      headers: [
        // {value: "employeeId", text: "员工ID", width: 100, required: true, fixed: "left", class: "fixed", align: "left fixed"},
        { value: "employeeId", text: "员工ID", width: 80 },
        { value: "employeeName", text: "老师名", width: 90 },
        { value: "staffRecordNumber", text: "员工记录编号", width: 90 },
        { value: "gender", text: "性别", width: 60 },
        { value: "contactNumber", text: "联系方式", width: 130 },
        // { value: "educationBackground", text: "教育背景", width: 150 },
        // { value: "academicQualification", text: "学历", width: 150 },
        // { value: "title", text: "职位", width: 100 },
        // { value: "segment", text: "学部", width: 100 },
        // { value: "teachingSubject", text: "教学科目", width: 150 },
        // { value: "hometown", text: "籍贯", width: 150 },
        // { value: "contractStartDate", text: "合同开始日期", width: 150 },
        // { value: "contractExpiryDate", text: "合同截止日期", width: 150 },
        // { value: "lastDateOfService", text: "工作截止日期", width: 150 },
        // { value: "teacherStatus", text: "老师状态", width: 150 },
        { value: "entryStatus", text: "老师状态", width: 80 },
        { value: "remarks", text: "备注", width: 250 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: 100, class: 'fixed', cellClass: 'fixed' },

        // width 表达式需要使用字符串包裹
      ],
      value: [
        // vuetify table custom slot
      ],
      rowActionList: [
        { text: '添加', icon: 'mdi-trash-can-outline', color: 'success', click: 'batchEmitAdd([item])', attrs: { 'v-if': 'status == "在职"' } }, // 简写支持 pc 和 移动端折叠
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'batchEmitDelete([item])', attrs: { 'v-if': 'status == "已离职"' } }, // 简写支持 pc 和 移动端折叠
      ],
    }
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    props: {
      userList: {
        type: Array,
        default: () => []
      },
      status: {
        type: String,
        default: '在职'
      }
    },
    data: {
      constantObj: {},
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      testString: '测试字符串',
      serverSearchWhereLike: { className: '' },
      filterMap: {},
      tableSelected: [],
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
    computed: {
      tableDataComputed() {
        console.log(this.status);
        
        return this.tableData.filter(item => {
          if (this.status == '在职') {
            return !this.userList.includes(item.employeeId) && item.entryStatus == this.status;
          } 
          return this.userList.includes(item.employeeId) && item.entryStatus == this.status;
        });
      }
    },
    mounted() {
      this.getTableData();
      resetTableMaxHeight()
    },
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      async batchEmitAdd(item) {
        this.$emit('batch-add', item);
      },
      async batchEmitDelete(item) {
        this.$emit('batch-delete', item);
      },
    }
  },
  
};

module.exports = content;
