/* eslint-disable */

const resetPasswordDrawerBody = /*html*/`
  <div class="jh-drawer-body-scroll px-4 py-4">
    <v-form ref="resetPasswordForm" lazy-validation>
      <v-row class="mt-0">
        <v-col cols="12">
          <span class="jh-input-label">用户ID</span>
          <v-text-field class="jh-v-input" dense filled single-line disabled :value="resetPasswordItem.userId"></v-text-field>
        </v-col>
        <v-col cols="12">
          <span class="jh-input-label">新密码<span class="red--text text--accent-2 ml-1">*必填</span></span>
          <v-text-field
            class="jh-v-input"
            dense filled single-line
            v-model="resetPasswordItem.clearTextPassword"
            :rules="validationRules.requireRules"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
    <div class="d-flex justify-end pt-2">
      <v-btn text small @click="isResetPasswordDrawerShown = false">取消</v-btn>
      <v-btn small color="success" class="ml-2" @click="doUiAction('resetPassword')">保存</v-btn>
    </div>
  </div>`;

const content = {
  version: 'v7',
  mode: 'crud',
  pageType: 'jh-page',
  page: {
    id: 'userManagement',
    name: '用户管理',
    targets: 'pc',
  },
  platform: {
    pc: { list: 'Table', create: 'CreateDrawer', update: 'UpdateDrawer' },
  },
  resourceList: [
    {
      actionId: 'selectItemList',
      desc: '✅用户管理-查询信息',
      resourceType: 'sql',
      resourceData: { table: '_user', operation: 'select' },
    },
    {
      actionId: 'insertItem',
      desc: '✅用户管理-新增用户',
      resourceType: 'service',
      resourceData: { service: 'userManagement', serviceFunction: 'addUser' },
    },
    {
      actionId: 'resetUserPassword',
      desc: '✅用户管理-修改密码',
      resourceType: 'service',
      resourceData: { service: 'userManagement', serviceFunction: 'resetUserPassword' },
    },
    {
      actionId: 'updateItem',
      desc: '✅用户管理-更新用户',
      resourceType: 'sql',
      resourceData: { table: '_user', operation: 'jhUpdate' },
    },
    {
      actionId: 'tableRecordHistory-selectItemList',
      desc: '✅操作记录-查询历史版本',
      resourceType: 'service',
      resourceData: { service: 'recordHistory', serviceFunction: 'selectItemList' },
    },
  ],
  includeList: [
    { type: 'html', path: 'common/jianghuJs/fixedTableHeightV4.html' },
    { type: 'html', path: 'component/tableRecordHistory.html' },
  ],
  fields: {
    userId: {
      label: '用户ID[登陆]',
      type: 'text',
      column: { width: 120, class: 'fixed', cellClass: 'fixed' },
      form: { required: true },
      createForm: { required: true },
      updateForm: { readonly: true },
    },
    username: {
      label: '用户名',
      type: 'text',
      column: { width: 140 },
      form: { required: true },
    },
    userType: {
      label: '用户类型',
      type: 'select',
      column: { width: 120 },
      form: {
        required: true,
        options: 'constantObj.userType',
        attrs: { 'item-value': 'value', 'item-text': 'text' },
      },
    },
    userStatus: {
      label: '用户状态',
      type: 'select',
      column: { width: 120 },
      form: {
        required: true,
        options: 'constantObj.userStatus',
        attrs: { 'item-value': 'value', 'item-text': 'text' },
      },
    },
    clearTextPassword: {
      label: '初始密码',
      type: 'text',
      column: { width: 120 },
      form: { required: true },
      createForm: { required: true },
      updateForm: { readonly: true },
    },
    operationByUser: {
      label: '操作人',
      type: 'text',
      column: { width: 100 },
      form: { readonly: true },
      createForm: { visible: false },
    },
    operationAt: {
      label: '操作时间',
      type: 'text',
      column: { width: 160 },
      form: { readonly: true },
      createForm: { visible: false },
    },
  },
  views: {
    list: {
      columnList: [
        'userId',
        'username',
        'userType',
        'userStatus',
        'clearTextPassword',
        'operationByUser',
        'operationAt',
      ],
      headActionList: [
        { uiAction: 'create', label: '新增', color: 'primary' },
      ],
      rowActionList: [
        { uiAction: 'update', label: '修改信息', key: 'edit', permission: 'updateItem' },
        { uiAction: 'startResetPassword', label: '修改密码', key: 'pwd', permission: 'resetUserPassword' },
        { uiAction: 'activeUserStatus', label: '激活', color: 'success', key: 'active', permission: 'updateItem', visibleWhen: "item.userStatus !== 'active'" },
        { uiAction: 'bannedUserStatus', label: '禁用', color: 'error', key: 'ban', permission: 'updateItem', visibleWhen: "item.userStatus === 'active'" },
      ],
      filter: {
        keyword: {
          fields: ['userId', 'username', 'userType', 'userStatus', 'operationByUser'],
          placeholder: '筛选',
        },
      },
      serverPagination: false,
      pageSize: 20,
    },
    create: {
      title: '新增用户',
      fieldList: ['userId', 'username', 'userType', 'userStatus', 'clearTextPassword'],
      actionList: [{ label: '新增', uiAction: 'create', color: 'primary' }],
    },
    update: {
      title: '编辑用户',
      tabList: [
        {
          key: 'basicInfo',
          title: '用户信息',
          fieldList: ['userId', 'username', 'userType', 'userStatus', 'clearTextPassword'],
          actionList: [{ label: '保存', uiAction: 'update', color: 'primary' }],
        },
        {
          key: 'recordHistory',
          title: '操作记录',
        },
      ],
    },
  },
  slots: {
    list: {
      pc: {
        children: [/*html*/`
          <template v-slot:item.clearTextPassword="{ item }">
            <jh-text-btn
              v-if="item.clearTextPassword"
              @click="doUiAction('copyPassword', item)"
              icon="copy"
              color="primary"
            >
              复制
            </jh-text-btn>
            <span v-else class="um-muted-text">-</span>
          </template>
          <template v-slot:item.userType="{ item }">
            {{ getDisplayText({ displayObj: constantObj.userType, displayValue: item.userType }) }}
          </template>
          <template v-slot:item.userStatus="{ item }">
            <v-chip x-small label :color="item.userStatus === 'active' ? 'success' : 'error'" text-color="white">
              {{ getDisplayText({ displayObj: constantObj.userStatus, displayValue: item.userStatus }) }}
            </v-chip>
          </template>
          <template v-slot:item.operationAt="{ item }">
            <span class="text-no-wrap">{{ formatDateTime(item.operationAt) }}</span>
          </template>`],
      },
    },
    update: {
      recordHistory: {
        pc: {
          children: [/*html*/`
            <div class="px-2 py-2">
              <table-record-history table="_user" :id="resolveRecordHistoryId(updateItem)" />
            </div>`],
        },
      },
    },
  },
  dataSource: {
    table: '_user',
    primaryKey: 'userId',
    listResource: 'selectItemList',
    createResource: 'insertItem',
    updateResource: 'updateItem',
  },
  pc: (views, blocks) => ({
    pageContent: {
      component: 'VStack',
      props: { gap: 0 },
      children: [
        blocks.pageHeader,
        blocks.list,
      ].filter(Boolean),
    },
    actionContent: [
      blocks.create,
      blocks.update,
      {
        component: 'Drawer',
        key: 'resetPassword',
        props: {
          title: '修改密码',
          width: '480px',
        },
        attrs: { class: 'um-reset-password-drawer' },
        children: [resetPasswordDrawerBody],
      },
    ].filter(Boolean),
  }),
  common: {
    data: {
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      constantObj: {
        userStatus: [
          { value: 'active', text: '正常' },
          { value: 'banned', text: '禁用' },
        ],
        userType: [
          { value: 'common', text: '普通用户' },
          { value: 'staff', text: '教职工' },
          { value: 'student', text: '学生' },
        ],
      },
      activeUserItem: {},
      activeUserId: null,
      bannedUserItem: {},
      bannedUserId: null,
      resetPasswordItem: {},
      clearTextPassword: null,
      resetPasswordUserId: null,
    },
    doUiAction: {
      activeUserStatus: [
        'prepareActiveUserItem',
        'confirmActiveUserStatusDialog',
        'prepareDoActiveUserStatus',
        'doActiveUser',
        'doUiAction.getTableData',
      ],
      bannedUserStatus: [
        'prepareBannedUserItem',
        'confirmBannedUserStatusDialog',
        'prepareDoBannedUserStatus',
        'doBannedUser',
        'doUiAction.getTableData',
      ],
      startResetPassword: ['prepareResetPasswordItem', 'openResetPasswordDrawer'],
      resetPassword: [
        'prepareResetPasswordValidate',
        'confirmResetPasswordDialog',
        'prepareDoResetPasswordItem',
        'doResetPasswordItem',
        'closeResetPasswordDrawer',
        'doUiAction.getTableData',
      ],
      copyPassword: ['copyPassword'],
    },
    methods: {
      resolveRecordHistoryId(record) {
        if (!record || typeof record !== 'object') return null;
        return record.id ?? record.userId ?? null;
      },
      formatDateTime(value) {
        const dayjsFn = window.dayjs || dayjs;
        return value && dayjsFn(value).isValid() ? dayjsFn(value).format('YYYY-MM-DD HH:mm:ss') : (value || '-');
      },
      async prepareActiveUserItem(funObj) {
        this.activeUserItem = _.cloneDeep(funObj);
      },
      async confirmActiveUserStatusDialog() {
        const confirmed = await window.confirmDialog({ title: '激活', content: '确定激活该用户吗？' });
        if (confirmed === false) {
          throw new Error('[confirmActiveUserStatusDialog] cancelled');
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
              pageId: this.pageId,
              actionId: 'updateItem',
              actionData: { userStatus: 'active' },
              where: { userId: this.activeUserId },
            },
          },
        });
        await window.vtoast.success('激活成功');
        this.activeUserItem = {};
        this.activeUserId = null;
      },
      async prepareBannedUserItem(funObj) {
        this.bannedUserItem = _.cloneDeep(funObj);
      },
      async confirmBannedUserStatusDialog() {
        const confirmed = await window.confirmDialog({ title: '禁用', content: '确定禁用该用户吗？' });
        if (confirmed === false) {
          throw new Error('[confirmBannedUserStatusDialog] cancelled');
        }
      },
      async prepareDoBannedUserStatus() {
        this.bannedUserId = this.bannedUserItem.userId;
      },
      async doBannedUser() {
        await window.vtoast.loading('正在禁用');
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: this.pageId,
              actionId: 'updateItem',
              actionData: { userStatus: 'banned' },
              where: { userId: this.bannedUserId },
            },
          },
        });
        await window.vtoast.success('禁用成功');
        this.bannedUserItem = {};
        this.bannedUserId = null;
      },
      async prepareResetPasswordItem(funObj) {
        this.resetPasswordItem = {
          userId: funObj.userId,
          clearTextPassword: '',
        };
      },
      openResetPasswordDrawer() {
        this.isResetPasswordDrawerShown = true;
      },
      async prepareResetPasswordValidate() {
        if (this.$refs.resetPasswordForm && await this.$refs.resetPasswordForm.validate() === false) {
          throw new Error('[prepareResetPasswordValidate] false');
        }
      },
      async confirmResetPasswordDialog() {
        const confirmed = await window.confirmDialog({
          title: '修改用户密码',
          content: '确定修改该用户密码吗？',
        });
        if (confirmed === false) {
          throw new Error('[confirmResetPasswordDialog] cancelled');
        }
      },
      async prepareDoResetPasswordItem() {
        const { userId, clearTextPassword } = this.resetPasswordItem;
        this.clearTextPassword = clearTextPassword;
        this.resetPasswordUserId = userId;
      },
      async doResetPasswordItem() {
        await window.vtoast.loading('修改密码');
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: this.pageId,
              actionId: 'resetUserPassword',
              actionData: {
                userId: this.resetPasswordUserId,
                clearTextPassword: this.clearTextPassword,
              },
            },
          },
        });
        window.vtoast.success('修改密码成功');
      },
      async closeResetPasswordDrawer() {
        this.isResetPasswordDrawerShown = false;
        this.resetPasswordItem = {};
        this.clearTextPassword = null;
        this.resetPasswordUserId = null;
      },
      async copyPassword(item) {
        if (!item || !item.clearTextPassword) return;
        await navigator.clipboard.writeText(item.clearTextPassword);
        window.vtoast.success('复制密码成功');
      },
    },
  },
  style: /*css*/`
    .um-muted-text {
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
    }
    .um-reset-password-drawer .v-card__title {
      min-height: 52px;
    }
  `,
};

module.exports = content;
