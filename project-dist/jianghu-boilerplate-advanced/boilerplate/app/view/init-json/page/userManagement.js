const content = {
  pageType: "jh-page", pageId: "userManagement", table: '_user', pageName: "用户管理", version: 'v2',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表-_user",
      resourceData: { table: "_user", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      desc: "✅添加-_user",
      resourceHook: { before: [{service: 'common', serviceFunction: 'generateBizIdOfBeforeHook'}] },
      resourceData: { table: "_user", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新-_user",
      resourceData: { table: "_user", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除-_user",
      resourceData: { table: "_user", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "用户管理", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
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
        {text: "用户ID[登陆]", value: "userId", width: 120},
        {text: "用户名", value: "username", width: 140},
        // {text: "用户类型", value: "userType", width: 120, formatter: `
        //   {{ getDisplayText({displayObj: constantObj.userType, displayValue: item.userType}) }}
        //   `},
        {text: "用户状态", value: "userStatus", width: 120, formatter: `
          {{ getDisplayText({displayObj: constantObj.userStatus, displayValue: item.userStatus}) }}
          `},
        {text: "初始密码", value: "clearTextPassword", width: 120, formatter: `
          <span role="button" @click="doUiAction('copyPassword', item)" class="success--text">
            <v-icon small color="success">mdi-content-copy</v-icon>复制
          </span>
          `},
        {text: "操作人", value: "operationByUser", width: 120},
        {text: "操作时间", value: "operationAt", width: 250},
        {text: '操作', value: 'action', align: 'center', sortable: false, width: 'window.innerWidth < 500 ? 80 : 230', class: 'fixed', cellClass: 'fixed'},

        // width 表达式需要使用字符串包裹
      ],
      value: [
        // vuetify table custom slot
      ],
      rowActionList: [
        { text: '修改信息', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '修改密码', icon: 'mdi-lock-reset', color: 'success', click: 'doUiAction("startResetPassword", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '激活', icon: 'mdi-lock-open-variant-outline', color: 'success', click: 'doUiAction("activeUserStatus", item)', attrs: { 'v-if': 'item.userStatus != "active"' } }, // 简写支持 pc 和 移动端折叠
        { text: '禁用', icon: 'mdi-lock-outline', color: 'error', click: 'doUiAction("bannedUserStatus", item)', attrs: { 'v-if': 'item.userStatus === "active"'} } // 简写支持 pc 和 移动端折叠
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
    {
      tag: 'jh-drawer',
      key: "resetUserPassword",
      title: '重置密码',
      contentList: [
        {
          label: "重置密码",
          type: "form",
          formItemList: [
            { label: "新密码", model: "clearTextPassword", tag: "v-text-field", rules: "validationRules.requireRules",   },
          ],

          action: [{
            tag: "v-btn",
            value: "保存",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('resetPassword')"
            }
          }],
        }
      ]
    }
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {
        userStatus: [{value: 'active', text: '正常'}, {value: 'banned', text: '禁用'}],
        userType: [{value: 'common', text: '普通用户'}, {value: 'staff', text: '教职工'}, {value: 'student', text: '学生'}],
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
    doUiAction: {
      /**
       * 
        case 'activeUserStatus':
          await this.prepareActiveUserItem(uiActionData);
          await this.confirmActiveUserStatusDialog();
          await this.prepareDoActiveUserStatus();
          await this.doActiveUser();
          await this.getTableData();
          break;
        case 'bannedUserStatus':
          await this.prepareBannedUserItem(uiActionData);
          await this.confirmBannedUserStatusDialog();
          await this.prepareDoBannedUserStatus();
          await this.doBannedUser();
          await this.getTableData();
          break;
        case 'startResetPassword':
          await this.prepareResetPasswordItem(uiActionData);
          await this.openResetPasswordDrawer();
          break;
        case 'resetPassword':
          await this.prepareResetPasswordValidate();
          await this.confirmResetPasswordDialog();
          await this.prepareDoResetPasswordItem();
          await this.doResetPasswordItem();
          await this.closeResetPasswordDrawer();
          break;
        case 'copyPassword':
          await this.copyPassword(uiActionData);
          break;
       */
      activeUserStatus: ['prepareActiveUserItem', 'confirmActiveUserStatusDialog', 'prepareDoActiveUserStatus', 'doActiveUser', 'doUiAction.getTableData'],
      bannedUserStatus: ['prepareBannedUserItem', 'confirmBannedUserStatusDialog', 'prepareDoBannedUserStatus', 'doBannedUser', 'doUiAction.getTableData'],
      startResetPassword: ['prepareResetPasswordItem', 'openResetPasswordDrawer'],
      resetPassword: ['prepareResetPasswordValidate', 'confirmResetPasswordDialog', 'prepareDoResetPasswordItem', 'doResetPasswordItem', 'closeResetPasswordDrawer'],
      copyPassword: ['copyPassword'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      //   --------------- 激活用户 uiAction >>>>>>>>>>>>  ---------------
      async prepareActiveUserItem(funObj) {
        this.activeUserItem = _.cloneDeep(funObj);
      },
      async confirmActiveUserStatusDialog() {
        if (await window.confirmDialog({title: "激活", content: "确定激活吗？"}) === false) {
          throw new Error("[confirmActiveUserStatusDialog] 否");
        }
      },
      async prepareDoActiveUserStatus() {
        this.activeUserId = this.activeUserItem.userId;
      },
      async doActiveUser() {
        await window.vtoast.loading('正在激活');
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userManagement',
              actionId: 'updateItem',
              actionData: {userStatus: 'active'},
              where: {userId: this.activeUserId}
            }
          }
        });
        await window.vtoast.success(`激活成功`);
        this.activeUserItem = {};
        this.activeUserId = null;
      },
      //   --------------- <<<<<<<<<<<< 激活用户 uiAction  ---------------
      //   --------------- 禁用用户 uiAction >>>>>>>>>>>>  ---------------
      async prepareBannedUserItem(funObj) {
        this.bannedUserItem = _.cloneDeep(funObj);
      },
      async confirmBannedUserStatusDialog() {
        if (await window.confirmDialog({title: "禁用", content: "确定禁用吗？"}) === false) {
          throw new Error("[confirmBannedUserStatusDialog] 否");
        }
      },
      async prepareDoBannedUserStatus() {
        this.bannedUserId = this.bannedUserItem.userId;
      },
      async doBannedUser(funObj) {
        await window.vtoast.loading('正在禁用');
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userManagement',
              actionId: 'updateItem',
              actionData: {userStatus: 'banned'},
              where: {userId: this.bannedUserId}
            }
          }
        });
        await window.vtoast.success(`禁用成功`);
        this.bannedUserItem = {};
        this.bannedUserId = null;
      },
      //   --------------- <<<<<<<<<<<< 禁用用户 uiAction  ---------------
      //   --------------- 修改密码 uiAction >>>>>>>>>>>>  ---------------
      async prepareResetPasswordItem(funObj) {
        this.userPasswordItem = _.cloneDeep(funObj);
      },
      async openResetPasswordDrawer() {
        this.isResetUserPasswordDrawerShown = true;
      },
      async prepareResetPasswordValidate() {
        if (await this.$refs.passwordForm.validate() === false) {
          throw new Error("[prepareResetPasswordValidate] false");
        }
      },
      async confirmResetPasswordDialog() {
        if (await window.confirmDialog({title: "修改用户密码", content: "确定修改用户密码吗？"}) === false) {
          throw new Error("[confirmResetPasswordDialog] 否");
        }
      },
      async prepareDoResetPasswordItem() {
        const {userId, clearTextPassword} = this.userPasswordItem;
        this.clearTextPassword = clearTextPassword;
        this.resetPasswordUserId = userId;
      },
      async doResetPasswordItem() {
        await window.vtoast.loading("修改密码");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userManagement',
              actionId: 'resetUserPassword',
              actionData: {userId: this.resetPasswordUserId, clearTextPassword: this.clearTextPassword},
              where: {}
            }
          }
        });
        window.vtoast.success("修改密码成功");
      },
      async closeResetPasswordDrawer() {
        this.isResetUserPasswordDrawerShown = false;
        this.userPasswordItem = {};
        this.clearTextPassword = null;
        this.resetPasswordUserId = null;
      },
      //   --------------- <<<<<<<<<<<<< 修改密码 uiAction  ---------------
      //   --------------- 复制密码 uiAction >>>>>>>>>>>>>  ---------------
      async copyPassword(funObj) {
        await navigator.clipboard.writeText(funObj.clearTextPassword);
        return window.vtoast.success("复制密码成功！")
      },
      //   --------------- <<<<<<<<<<<<< 复制密码 uiAction  ---------------
    }
  },
  
};

module.exports = content;
