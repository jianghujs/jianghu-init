const content = {
  pageType: "jh-page", pageId: "studentList", table: "student", pageName: "学生列表", template: "jhTemplateV4", version: 'v2',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "student", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      // resourceHook: { before: [{service:"common",serviceFunction:"generateBizIdOfBeforeHook"}] },
      desc: "✅添加",
      resourceData: { table: "student", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新",
      resourceData: { table: "student", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除",
      resourceData: { table: "student", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "学生列表", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },

    { tag: 'v-spacer'},
    { 
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      value: [
        { tag: "v-text-field", model: "keyword", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '标题', ':disabled': 'keywordFieldList.length == 0', ':placeholder': "!keywordFieldList.length ? '未设置搜索字段' : ''"} },
        // { tag: "v-text-field", model: "serverSearchWhereLike.className", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '前缀'} },
      ], 
      searchBtn: true
    },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")' }, quickAttrs: ['small'] },
        { tag: 'v-spacer' },
        /*html*/`
        <v-col cols="12" sm="6" md="3" xs="8" class="pa-0">
          <v-text-field prefix="筛选" v-model="searchInput" class="jh-v-input" dense filled single-line></v-text-field>
        </v-col>
        `
      ],
      headers: [
        { text: "学生ID", value: "studentId", width: 80, sortable: true },
        { text: "学生名字", value: "name", width: 80, sortable: true },
        { text: "性别", value: "gender", width: 80, sortable: true },
        { text: "出生日期", value: "dateOfBirth", width: 80, sortable: true },
        { text: "年级", value: "level", width: 80, sortable: true },
        { text: "身高", value: "bodyHeight", width: 80, sortable: true },
        { text: "学生状态", value: "studentStatus", width: 80, sortable: true },
        { text: "备注", value: "remark", width: 80, sortable: true },
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 120', align: "center", class: "fixed", cellClass: "fixed" },
      ],
      value: [],
      rowActionList: [
        // 简写支持 pc 和 移动端折叠
         
        { text: '班级列表', icon: 'mdi-account-school-outline', color: 'success', click: 'doUiAction("redirect", item)' },
        { text: '详情', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' }
      ],
    }
  ],
  actionContent: [
    {
      tag: 'jh-create-drawer',
      key: "create",
      attrs: {},
      title: '新增',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "新增", 
          type: "form", 
          formItemList: [
            /**
            * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
            * attrs: {} // 表单项属性
            */
            { label: "学生ID", model: "studentId", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "学生名字", model: "name", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "性别", model: "gender", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "出生日期", model: "dateOfBirth", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "年级", model: "level", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "身高", model: "bodyHeight", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "学生状态", model: "studentStatus", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "备注", model: "remark", tag: "v-text-field", rules: "validationRules.requireRules" },
          ], 
          action: [{
            tag: "v-btn",
            value: "新增",
            attrs: {
              color: "success",
              class: 'ml-2',
              ':small': true,
              '@click': "doUiAction('createItem')"
            }
          }],
        },

      ]
    },
    {
      tag: 'jh-update-drawer',
      key: "update",
      attrs: {},
      title: '详情',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "详情", 
          type: "form", 
          formItemList: [
            /**
            * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
            * attrs: {} // 表单项属性
            */
            { label: "学生ID", model: "studentId", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "学生名字", model: "name", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "性别", model: "gender", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "出生日期", model: "dateOfBirth", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "年级", model: "level", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "身高", model: "bodyHeight", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "学生状态", model: "studentStatus", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "备注", model: "remark", tag: "v-text-field", rules: "validationRules.requireRules" },
          ], 
          action: [{
            tag: "v-btn",
            value: "保存",
            attrs: {
              color: "success",
              class: 'ml-2',
              ':small': true,
              '@click': "doUiAction('updateItem')"
            }
          }],
        },
         
      ]
    }
  ],
  includeList: [
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
     
    data: {
      constantObj: {
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

      keyword: '', // 搜索关键字
      keywordFieldList: [], // 搜索关键字对应字段
       
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
    async created() {
      await this.doUiAction('getTableData');
    },
    doUiAction: {
      redirect: ['redirectToClassListForStudent']
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      // ---------- 学生的班级列表 uiAction >>>>>>>>>>>> --------
      async redirectToClassListForStudent(funObj) {
        window.location.href = `/${window.appInfo.appId}/page/classListOfOneStudent?studentId=${funObj.studentId}&title=${funObj.name}`
      },
      // ---------- <<<<<<<<<<< 学生的班级列表 uiAction  --------
    }
  },
   
};

module.exports = content;