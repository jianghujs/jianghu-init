const content = {
  pageType: "jh-page", pageId: "resetUserPassword", table: '_user', pageName: "修改密码", version: 'v2',
  resourceList: [
    /**
     * resetUserPassword	✅用户管理-修改密码	service		{"service": "userManagement", "serviceFunction": "resetUserPassword"}
     */
    {
      actionId: "resetUserPassword",
      resourceType: "service",
      desc: "✅用户管理-修改密码",
      resourceData: {service: "userManagement", serviceFunction: "resetUserPassword"}
    },
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "修改密码", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
  ],
  pageContent: [
    {
      tag: 'v-col',
      value: `
      <v-card class="rounded-lg jh-fixed-table-height elevation-0">
        <v-form ref="passwordForm" lazy-validation class="mx-auto jh-passwordForm">
          <v-row class="pa-0 ma-0 pa-xs-4 pb-xs-4 flex-none">
            <v-col cols="12" class="pb-xs-4 pb-3">
              <span class="jh-input-label">原密码<span class="red--text text--accent-2 ml-1">*必填</span></span>
              <v-text-field class="jh-v-input" dense filled single-line v-model="formData.oldPassword" :rules="validationRules.requireRules"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-xs-4 pb-3">
              <span class="jh-input-label">新密码<span class="red--text text--accent-2 ml-1">*必填</span></span>
              <v-text-field class="jh-v-input" dense filled single-line v-model="formData.newPassword1" :rules="validationRules.requireRules"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-xs-4 pb-3">
              <span class="jh-input-label">新密码确认<span class="red--text text--accent-2 ml-1">*必填</span></span>
              <v-text-field class="jh-v-input" dense filled single-line v-model="formData.newPassword2" :rules="validationRules.requireRules"></v-text-field>
            </v-col>
            <v-col cols="12" class="pb-xs-4 pb-3">
              <v-btn color="success" @click="resetPassword()" style="width: 100%;">确定</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card>
      `
    }
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件

      formData: {
        oldPassword: null,
        newPassword1: null,
        newPassword2: null,
      }
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
    computed: {
    },
    doUiAction: {
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      async resetPassword() {
        if (!this.$refs.passwordForm.validate()) return false;
        if (this.formData.newPassword1 !== this.formData.newPassword2) {
          window.vtoast.fail("两次输入的密码不一致");
          return;
        }
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'resetUserPassword',
              actionId: 'resetPassword',
              actionData: {
                oldPassword: this.formData.oldPassword,
                newPassword: this.formData.newPassword1,
              }
            }
          }
        })
        window.vtoast.success("密码修改成功");
        setTimeout(() => {
          location.reload();
        }, 500)
      }
    }
  },
  style: /*css*/`
  .jh-passwordForm{
    width: 390px; 
    max-width: 100%;
    margin-top: 100px;
  }
  `
  
};

module.exports = content;
