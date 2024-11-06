/* eslint-disable */
const content = {
  pageType: "jh-page", pageId: "userManagement", table: "_user", pageName: "用户管理", version: 'v3',
  resourceList: [
    {
      actionId: "selectItemList",
      desc: "✅用户管理-查询信息",
      resourceType: "sql",
      resourceData: {
        table: "_user",
        operation: "select"
      }
    },
    {
      actionId: "insertItem",
      desc: "✅用户管理-查询信息",
      resourceType: "service",
      resourceData: {
        service: "userManagement",
        serviceFunction: "addUser"
      }
    },
    {
      actionId: "resetUserPassword",
      desc: "✅用户管理-修改密码",
      resourceType: "service",
      resourceData: {
        service: "userManagement",
        serviceFunction: "resetUserPassword"
      }
    },
    {
      actionId: "updateItem",
      desc: "✅用户管理-更新用户",
      resourceType: "sql",
      resourceData: {
        table: "_user",
        operation: "jhUpdate"
      }
    }
  ],
  headContent: [
    { tag: 'jh-page-title', value: "用户管理", attrs: { cols: 12, sm: 6, md: 4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    {
      tag: 'jh-search',
      value: [
      ],
    },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {},
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { small: true, color: 'success', '@click': 'doUiAction("startCreateItem")' } },
        { tag: 'v-spacer' },
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '2', class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: { prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true } },
          ],
        }
      ],
      headers: [
        { text: "用户ID[登陆]", value: "userId", width: 120 },
        { text: "用户名", value: "username", width: 140 },
        { text: "用户类型", value: "userType", width: 120 },
        { text: "用户状态", value: "userStatus", width: 120 },
        { text: "初始密码", value: "clearTextPassword", width: 120 },
        { text: "操作人", value: "operationByUser", width: 90 },
        { text: "操作时间", value: "operationAt", width: 150 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: 'window.innerWidth < 500 ? 80 : 230', class: 'fixed', cellClass: 'fixed' },
      ],
      value: [
         /*html*/`
           <template v-slot:item.clearTextPassword="{ item }">
            <span role="button" @click="doUiAction('copyPassword', item)" class="success--text">
              <v-icon small color="success">mdi-content-copy</v-icon>复制
            </span>
          </template>
          <!-- 用户类型 -->
          <template v-slot:item.userType="{ item }">
            {{ getDisplayText({displayObj: constantObj.userType, displayValue: item.userType}) }}
          </template>
          <!-- 用户状态 -->
          <template v-slot:item.userStatus="{ item }">
            {{ getDisplayText({displayObj: constantObj.userStatus, displayValue: item.userStatus}) }}
          </template>
         `
      ],
      rowActionList: [
        { text: '修改信息', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
        { text: '修改密码', icon: 'mdi-lock-reset', color: 'success', click: 'doUiAction("startResetPassword", item)' },
        { text: '激活', icon: 'mdi-lock-open-variant-outline', color: 'success', click: 'doUiAction("activeUserStatus", item)', attrs: { 'v-if': "item.userStatus !== 'active'" } },
        { text: '禁用', icon: 'mdi-lock-outline', color: 'red', click: 'doUiAction("bannedUserStatus", item)', attrs: { 'v-if': "item.userStatus === 'active'" } },
      ],
    }
  ],
  actionContent: [
    {
      tag: 'jh-create-drawer',
      key: "create",
      attrs: {},
      title: '课程详情',
      contentList: [
        {
          label: "新增",
          type: "form",
          formItemList: [
            { label: "用户ID[登陆]*必填", model: "userId", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "用户名*必填", model: "username", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "用户类型*必填", model: "userType", tag: "v-select", attrs: { ":items": "constantObj.userType" }, rules: "validationRules.requireRules", quickAttrs: ['clearable'] },
            { label: "用户状态*必填", model: "userStatus", tag: "v-select", attrs: { ":items": "constantObj.userStatus" }, rules: "validationRules.requireRules", quickAttrs: ['clearable'] },
            { label: "初始密码*必填", model: "clearTextPassword", tag: "v-text-field", rules: "validationRules.requireRules" }
          ],
          action: [
            { tag: 'v-btn', value: '新增', attrs: { class: 'ml-2', color: 'success', '@click': "doUiAction('updateItem')" }, quickAttrs: ['small'] },
          ]
        },
      ]
    },
    {
      tag: 'jh-update-drawer',
      key: "update",
      attrs: {},
      title: '编辑',
      headSlot: [
        { tag: 'v-spacer' }
      ],
      contentList: [
        {
          label: "新增",
          type: "form",
          formItemList: [
            { label: "用户ID[登陆]", model: "updateItem.userId", tag: "v-text-field", quickAttrs: ['disabled'], rules: "validationRules.requireRules" },
            { label: "用户名*必填", model: "updateItem.username", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "用户类型*必填", model: "userType", tag: "v-select", attrs: { ":items": "constantObj.userType" }, rules: "validationRules.requireRules", quickAttrs: ['clearable'] },
            { label: "用户状态*必填", model: "userStatus", tag: "v-select", attrs: { ":items": "constantObj.userStatus" }, rules: "validationRules.requireRules", quickAttrs: ['clearable'] },
            {
              label: "初始密码",
              model: "updateItem.clearTextPassword",
              tag: "v-text-field",
              attrs: {
                disabled: true
              },
              rules: "validationRules.requireRules"
            }
          ],
          action: [
            { tag: 'v-btn', value: '保存', attrs: { class: 'ml-2', color: 'success', '@click': "doUiAction('updateItem')" }, quickAttrs: ['small'] },
          ]
        },
        { label: "操作记录", type: "component", componentPath: "recordHistory", attrs: { table: 'course', pageId: 'course', ':id': 'updateItem.id' } },
      ]
    },
    {
      tag: 'jh-drawer',
      key: "resetPassword",
      attrs: {},
      title: '修改密码',
      headSlot: [
        { tag: 'v-spacer' }
      ],
      contentList: [
        {
          label: "",
          type: "form",
          formItemList: [{
            label: "初始密码*必填",
            model: "resetPasswordItem.clearTextPassword",
            tag: "v-text-field",
            attrs: {},
            rules: "validationRules.requireRules"
          }],
          action: [
            { tag: 'v-btn', value: '保存', attrs: { small: true, class: 'ml-2', color: 'success', '@click': "doUiAction('resetPassword')" } },
          ]
        }
      ]
    },
  ],
  includeList: [
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: {
    data: {
      isHelpPageDrawerShown: false,
      // 表格斑马纹
      isTableZebraLineShown: true,
      // 表单验证
      validationRules: {
        requireRules: [
          v => !!v || 'This is required',
        ],
      },
      // 常量列表
      constantObj: {
        userStatus: [{ value: 'active', text: '正常' }, { value: 'banned', text: '禁用' }],
        userType: [{ value: 'common', text: '普通用户' }, { value: 'staff', text: '教职工' }, { value: 'student', text: '学生' }],
      },
      
      // 激活用户
      activeUserItem: {},
      activeUserId: null,
      // 禁用用户
      bannedUserItem: {},
      bannedUserId: null,
      // 修改密码
      isResetPasswordDrawerShown: false,
      resetPasswordItem: {},
      clearTextPassword: null,
      resetPasswordUserId: null,
    },
    computed: {},
    watch: {},
    async created() {
    },
    mounted() {
      this.doUiAction('getTableData');
    },
    doUiAction: {
      activeUserStatus: ['prepareActiveUserItem', 'confirmActiveUserStatusDialog', 'prepareDoActiveUserStatus', 'doActiveUser', 'doUiAction.getTableData'],
      bannedUserStatus: ['prepareBannedUserItem', 'confirmBannedUserStatusDialog', 'prepareDoBannedUserStatus', 'doBannedUser', 'doUiAction.getTableData'],
      startResetPassword: ['prepareResetPasswordItem', 'doUiAction.viewResetPassword'],
      resetPassword: ['prepareResetPasswordValidate', 'confirmResetPasswordDialog', 'prepareDoResetPasswordItem', 'doResetPasswordItem', 'closeResetPasswordDrawer', 'doUiAction.getTableData'],
      copyPassword: ['copyPassword'],
    },
    methods: {
      //   --------------- 激活用户 uiAction >>>>>>>>>>>>  ---------------
      async prepareActiveUserItem(funObj) {
        this.activeUserItem = _.cloneDeep(funObj);
      },
      async confirmActiveUserStatusDialog() {
        if (await window.confirmDialog({ title: "激活", content: "确定激活吗？" }) === false) {
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
              actionData: { userStatus: 'active' },
              where: { userId: this.activeUserId }
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
        if (await window.confirmDialog({ title: "禁用", content: "确定禁用吗？" }) === false) {
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
              actionData: { userStatus: 'banned' },
              where: { userId: this.bannedUserId }
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
        this.resetPasswordItem = _.cloneDeep(funObj);
      },
      async openResetPasswordDrawer() {
        this.isResetPasswordDrawerShown = true;
      },
      async prepareResetPasswordValidate() {
        if (await this.$refs.resetPasswordForm.validate() === false) {
          throw new Error("[prepareResetPasswordValidate] false");
        }
      },
      async confirmResetPasswordDialog() {
        if (await window.confirmDialog({ title: "修改用户密码", content: "确定修改用户密码吗？" }) === false) {
          throw new Error("[confirmResetPasswordDialog] 否");
        }
      },
      async prepareDoResetPasswordItem() {
        const { userId, clearTextPassword } = this.resetPasswordItem;
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
              actionData: { userId: this.resetPasswordUserId, clearTextPassword: this.clearTextPassword },
              where: {}
            }
          }
        });
        window.vtoast.success("修改密码成功");
      },
      async closeResetPasswordDrawer() {
        this.isResetPasswordDrawerShown = false;
        this.resetPasswordItem = {};
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
    },
  },
  style: `
    `
};

module.exports = content;
