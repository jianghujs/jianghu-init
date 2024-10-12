const content = {
  "pageType": "jh-page",
  "pageId": "resetPassword",
  "table": "_user",
  "pageName": "修改密码",
  "resourceList": [],
  "includeList": [],
  headContent: [
    { tag: 'jh-page-title', value: "修改密码", attrs: { cols: 12, sm: 6, md: 4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    {
      tag: 'jh-search',
      value: [
      ],
    },
  ],

  "pageContent": [
    {
      tag: 'v-col',
      attrs: { cols: 12 },
      value: [
        /*html*/`
          <div class="jh-page-body-container px-8">
          <!-- 页面主要内容 -->
          <v-card class="rounded-lg jh-fixed-table-height">
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
        </div>

        <!-- 帮助页抽屉 >>>>>>>>>>>>> -->
        <v-navigation-drawer v-model="isHelpPageDrawerShown" v-click-outside="drawerClickOutside" fixed temporary right width="80%" class="elevation-24">
        <iframe style="border: 0" :src="'/' + appInfo.appId + '/pageDoc#7.resetUserPassword.md'" width="100%" height="100%"></iframe>
        <v-btn elevation="0" color="success" fab absolute top left small tile class="drawer-close-float-btn" @click="isHelpPageDrawerShown = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-navigation-drawer>
      <!-- <<<<<<<<<<< 帮助页抽屉  -->

        `
      ]
    }
  ],
  "actionContent": [

  ],
  "common": {
    data: {
      isHelpPageDrawerShown: false,
      // 页面变量

      validationRules: {
        requireRules: [
          v => !!v || 'This is required',
        ]
      },
      formData: {
        oldPassword: null,
        newPassword1: null,
        newPassword2: null,
      }
    },
    computed: {
      isMobile() {
        return window.innerWidth < 600;
      },
    },
    watch: {},
    async created() {
    },
    mounted() {
    },
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
              pageId: '<=$ pageId $=>',
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
  style: `
    .jh-passwordForm{
      width: 390px; 
      max-width: 100%;
      margin-top: 100px;
    }
  `
}

module.exports = content;