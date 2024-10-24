const content = {
  pageType: "jh-page", pageId: "pagePasscodeDemo", pageName: "二次认证", version: 'v2',
  resourceList: [
    /**
     * 		pagePasscodeDemo	selectItemList	✅查询列表	sql	{}	{ "table": "student", "operation": "select" }
	pagePasscodeDemo	insertItem	✅添加	sql	{}	{ "table": "student", "operation": "insert" }
	pagePasscodeDemo	updateItem	✅更新	sql	{}	{ "table": "student", "operation": "jhUpdate" }
	pagePasscodeDemo	deleteItem	✅删除	sql	{}	{ "table": "student", "operation": "jhDelete" }
     */
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "student", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      desc: "✅添加",
      resourceData: { table: "student", operation: "insert" }
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
    { tag: 'jh-page-title', value: "二次认证", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      props: { 
        serverPagination: true,
      },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")', small: true } },
        { tag: 'v-spacer' },
        // 默认筛选
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '3', xs: 8, class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: {prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true} },
          ],
        }
      ],
      headers: [
        {text: "学生ID", value: "studentId", width: 120},
        {text: "学生名字", value: "name", width: 120},
        {text: "性别", value: "gender", width: 120},
        {text: "出生日期", value: "dateOfBirth", width: 120},
        {text: "班级ID", value: "classId", width: 120},
        {text: "年级", value: "level", width: 120},
        {text: "身高", value: "bodyHeight", width: 120},
        {text: "学生状态", value: "studentStatus", width: 120},
        {text: "备注", value: "remarks", width: 120},
        {text: "操作者", value: "operationByUser", width: 120},
        {text: "操作时间", value: "operationAt", width: 250},
        {text: '操作', value: 'action', align: 'center', sortable: false, width: 'window.innerWidth < 500 ? 80 : 120', class: 'fixed', cellClass: 'fixed'},
        // width 表达式需要使用字符串包裹
      ],
      value: [
        // vuetify table custom slot
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
            { label: "userId", model: "userId", tag: "v-text-field", quickAttrs: ['disabled'], attrs: { placeholder: '自动生成'}, idGenerate: {
              prefix: 'E',
              bizId: 'userId',
              startValue: '10000',
            }   },
            { label: "用户名", model: "username", tag: "v-text-field", rules: "validationRules.requireRules",   },
            // { label: "用户类型", model: "userType", tag: "v-select", rules: "validationRules.requireRules", attrs: { items: "constantObj.userType" }  },
            { label: "用户状态", model: "userStatus", tag: "v-select", rules: "validationRules.requireRules", attrs: { items: "constantObj.userStatus" }  },
            { label: "初始密码", model: "clearTextPassword", tag: "v-text-field", rules: "validationRules.requireRules",   },

          ], 
          action: [{
            tag: "v-btn",
            value: "新增",
            attrs: {
              color: "success",
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
      title: '编辑',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "编辑", 
          type: "form", 
          formItemList: [
            /**
             * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
             * attrs: {} // 表单项属性
             */
            { label: "userId", model: "userId", tag: "v-text-field", quickAttrs: ['disabled']},
            { label: "用户名", model: "username", tag: "v-text-field", rules: "validationRules.requireRules",   },
            // { label: "用户类型", model: "userType", tag: "v-select", rules: "validationRules.requireRules", attrs: { items: "constantObj.userType" }  },
            { label: "用户状态", model: "userStatus", tag: "v-select", rules: "validationRules.requireRules", attrs: { items: "constantObj.userStatus" }  },
            { label: "初始密码", model: "clearTextPassword", tag: "v-text-field", rules: "validationRules.requireRules",   },

          ], 
          action: [{
            tag: "v-btn",
            value: "编辑",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('updateItem')"
            }
          }],
        },
      ]
    },
    /*html*/`
      <!-- 页面认证弹窗 >>>>>>>>>>>>> -->
      <v-dialog v-model="isPageValidationDialogShown" scrollable persistent width="80%" overlay-opacity="0.46"
      content-class="jh-fixed-dialog-height jh-dialog-mobile-fullscreen">
        <v-card flat>
          <v-card-title class="pa-4">
            <v-row class="justify-space-between pt-3 px-3 pb-1">
              <span class="text-h7 font-weight-bold">页面认证</span>
            </v-row>
          </v-card-title>
          <v-card-text class="px-0 pb-0">
            <v-form ref="allotForm" lazy-validation>
              <v-row class="mt-0 px-4">
                <v-col cols="12" sm="12" md="6">
                  <span class="jh-input-label">认证码<span class="red--text text--accent-2 ml-1">*必填</span></span>
                  <v-text-field class="jh-v-input" dense filled single-line label="认证码" type="password" v-model="passcodeOfUser"></v-text-field>
                  <p class="jh-font-size-13 mt-2">认证成功后, {{ validationDurationHour }}小时内无需重复认证。</p>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <v-btn color="success" @click="doUiAction('doPageValidation')" small>
              确定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- <<<<<<<<<<< 页面认证弹窗 -->
    `
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {
        gender: [{"value": "male", "text": "男"}, {"value": "female", "text": "女"}],
        classId: [
          {"value": "2021-01级-01班", "text": "2021-01级-01班"}, {"value": "2021-01级-02班", "text": "2021-01级-02班"},
          {"value": "2021-02级-01班", "text": "2021-02级-01班"}, {"value": "2021-02级-02班", "text": "2021-02级-02班"},
          {"value": "2021-03级-01班", "text": "2021-03级-01班"}, {"value": "2021-03级-02班", "text": "2021-03级-02班"}
        ],
        level: [{"value": "01", "text": "一年级"}, {"value": "02", "text": "二年级"}, {"value": "03", "text": "三年级"}],
        studentStatus: [{"value": "正常", "text": "正常"}, {"value": "退学", "text": "退学"}]
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
      isPageValidationDialogShown: false,
      validationDurationHour: 6,
      passcodeOfServer: '<$ page.passcode $>',
      passcodeOfUser: null,
      pageId: null,
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
    computed: {
      isMobile() {
        return window.innerWidth < 600;
      },
    },
    async created() {
      await this.doUiAction('getTableData');
      await this.doUiAction('startPageValidation');
    },
    doUiAction: {
      selectLogFileList: ['selectLogFileList'],
      startPageValidation: ['preparePageValidationData', 'checkAndOpenPageValidationDialog'],
      doPageValidation: ['doPageValidation']
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
        
      //   --------------- 二次认证 uiAction >>>>>>>>>>  ---------------
      async preparePageValidationData() {
        const urlPathList = window.location.pathname.split('/');
        this.pageId = urlPathList && urlPathList[urlPathList.length - 1];
      },

      checkAndOpenPageValidationDialog() {
        if (!this.passcodeOfServer) {
          this.isPageValidationDialogShown = false
          return;
        }
        const pageValidation = this.getPageValidationCache({pageId: this.pageId});
        const {date, success} = pageValidation;
        let duration = 999999;
        try {
          duration = dayjs().diff(date, 'hour');
          // duration = dayjs().diff(date, 'minute');
          // duration = dayjs().diff(date, 'second');
        } catch (error) {
          console.error("[created]", "date 解析异常");
        }
        if (success === true && duration < this.validationDurationHour) {
          this.isPageValidationDialogShown = false;
          return;
        }
        this.isPageValidationDialogShown = true
      },

      getPageValidationCache({pageId}) {
        let pageValidationObj = {}
        try {
          const pageValidationObjStr = localStorage.getItem(`${window.appInfo.appId}_page_validation_obj`);
          pageValidationObj = JSON.parse(pageValidationObjStr || '{}');
        } catch (error) {
          console.error("[getPageValidationCache]", "json 数据异常");
        }
        return pageValidationObj[pageId] || {};
      },

      cachePageValidation({pageId, value}) {
        let pageValidationObj = {}
        try {
          const pageValidationObjStr = localStorage.getItem(`${window.appInfo.appId}_page_validation_obj`);
          pageValidationObj = JSON.parse(pageValidationObjStr || '{}');
        } catch (error) {
          console.error("[cachePageValidation]", "json 数据异常");
        }
        pageValidationObj[pageId] = value;
        localStorage.setItem(`${window.appInfo.appId}_page_validation_obj`, JSON.stringify(pageValidationObj));
      },

      doPageValidation() {
        if (this.passcodeOfUser !== this.passcodeOfServer) {
          window.vtoast.fail({message: '页面认证失败'});
        }
        if (this.passcodeOfUser === this.passcodeOfServer) {
          this.cachePageValidation({
            pageId: this.pageId,
            value: {
              pageId: this.pageId,
              date: dayjs(),
              success: true,
            }
          });
          this.isPageValidationDialogShown = false;
        }
      },
      //   --------------- <<<<<<<<<< 二次认证 uiAction  ---------------
    }
  },
  
};

module.exports = content;
