const content = {
  pageType: "jh-page", pageId: "groupAuthorityManagement", table: "", pageName: "[组织权限]组织权限分配", 
  resourceList: [
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "组织权限分配", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    {
      tag: 'v-btn',
      value: '保存',
      attrs: { color: 'success', small: true, ':loading': 'isAppLoading', '@click': 'doUiAction("updateUserGroupRolePage")' }
    }
  ],
  pageContent: [
    {
      tag: 'v-col',
      attrs: { cols: '12', sm: '6', md: '3', class: 'pa-0 border-r pr-4' },
      value: `
        <select-group-tree @change-active="changeActiveGroup" hide-admin @change-group-list="constantObj.groupList = $event"></select-group-tree>
      `,
    },

    {
      tag: 'v-col',
      attrs: { cols: '12', sm: '6', md: '9', class: 'pa-0' },
      value: `
        <group-role-page :app-list="constantObj.appList" :role-list="constantObj.roleList" :loading="isAppLoading" :active-role="activeRole" v-model="activePageList" :group="activeGroup" @change-role="changeRole" @refresh-role-list="getRoleData"></group-role-page>
      `,
    },
  ],
  includeList: [
    { type: 'html', path: 'common/jianghuJs/fixedTableHeightV4.html' },
    { type: 'html', path: 'component/select-group-tree.html' },
    { type: 'html', path: 'component/group-role-page.html' },
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {
        appType: [{"value": "internal", "text": "内部应用"}, {"value": "external", "text": "外部应用"}],
        tabList: ['组织权限'],
        appList: [],
        groupList: [],
        roleList: [],
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      testString: '测试字符串',
      serverSearchWhereLike: { className: '' },
      filterMap: {},
      tableDataBackUp: [],

      tabActive: 0,
      activeGroup: null,
      activeGroupName: null,
      activeGroupPath: null,
      activeRole: '*',

      activePageList: [],
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {
      activePageList(val) {
        console.log('activePageList', val)
      }
    },
    computed: {
      tabList() {
        return this.constantObj.tabList;
      },
      tableData() {
        return this.tableDataBackUp.filter(e => (e.groupPath || '').startsWith(this.activeGroupPath || ''));
      },
    },
    async created() {
      this.doUiAction('getAppData');
    },
    doUiAction: {
      /**
       * case 'getTableData':
          await this.getTableData();
          break;
        case 'getAppData':
          await this.getAppData();
          break;
        case 'getUserGroupRolePage':
          await this.getUserGroupRolePage();
          break;
        case 'updateUserGroupRolePage':
          await this.doUpdateUserGroupRolePage(uiActionData);
          await this.getUserGroupRolePage();
          break;
       */
      getTableData: ['getTableData'],
      getAppData: ['getAppData'],
      getUserGroupRolePage: ['getUserGroupRolePage'],
      updateUserGroupRolePage: ['doUpdateUserGroupRolePage', 'getUserGroupRolePage'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      async getTableData() {
        this.isTableLoading = true;
        const where = {};
        const whereIn = {};
        if (this.activeGroupPath) {
          where.groupPath = `${this.activeGroupPath}`;
          where.groupId = `${this.activeGroup}`;
        } else {
          // whereIn.groupId = this.constantObj.groupList.map(e => e.value);
          whereIn.groupId = [this.activeGroup];
        }
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupAuthorityManagement',
              actionId: 'selectItemList',
              actionData: {},
              where,
              whereIn,
              orderBy: [{column: 'userId', order: 'asc'}]
            }
          }
        })).data.appData.resultData.rows;
  
        rows.forEach(row => {
          row.operationAt = dayjs(row.operationAt).format('YYYY-MM-DD HH:mm:ss');
        })
        const list = [];
        const groupBy = _.groupBy(rows, 'userId');
        Object.keys(groupBy).forEach(key => {
          const item = groupBy[key][0];
          item.username = groupBy[key][0].username;
          item.roleName = groupBy[key].map(e => (e.roleName || '默认权限')).join(',');
          item.roleId = groupBy[key].map(e => e.roleId);
          item.operationByUser = groupBy[key][0].operationByUser;
          item.operationAt = groupBy[key][0].operationAt;
          item.ids = groupBy[key].map(e => e.id);
          list.push(item);
        })
        this.tableDataBackUp = list;
        this.isTableLoading = false;
      },
      async getAppData() {
        this.isAppLoading = true;
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupAuthorityManagement',
              actionId: 'selectAppList',
              actionData: {},
              where: {},
              orderBy: [{column: 'appGroup', order: 'base'}]
            }
          }
        })).data.appData.resultData.rows
        rows.forEach(row => {
          row.appPageList = JSON.parse(row.appPageList || '[]');
        })
        this.constantObj.appList = rows;
        this.isAppLoading = false;
      },
      async getRoleData() {
        this.isAppLoading = true;
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupAuthorityManagement',
              actionId: 'selectRoleList',
              actionData: {},
              whereLike: {roleId: `${this.activeGroup}|%`},
              orderBy: [{column: 'operationAt', order: 'asc'}]
            }
          }
        })).data.appData.resultData.rows;
  
        rows.forEach(row => {
          row.operationAt = dayjs(row.operationAt).format('YYYY-MM-DD HH:mm:ss');
        })
        this.constantObj.roleList = [{roleId: '*', roleName: '默认权限'}, ...rows];
        this.isAppLoading = false;
      },
      async getUserGroupRolePage() {
        this.isAppLoading = true;
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupAuthorityManagement',
              actionId: 'getUserGroupRolePage',
              actionData: {},
              where: {group: this.activeGroup, role: this.activeRole},
              orderBy: [{column: 'id', order: 'asc'}]
            }
          }
        })).data.appData.resultData.rows
        const pageList = [];
        rows.forEach(row => {
          const list = row.page.split(',');
          list.forEach(e => {
            pageList.push(row.appId + '|' + e);
          })
        })
        this.activePageList = pageList;
        this.isAppLoading = false;
      },
      changeActiveGroup(item) {
        this.activeGroup = item.groupId ? item.groupId : item.groupPath + '-' + item.groupLastId;
        this.activeGroupName = item.groupName;
        this.activeGroupPath = item.groupPath;
        this.getRoleData();
        this.changeRole('*');
        this.getTableData();
      },
      changeRole(role) {
        this.activeRole = role;
        this.getUserGroupRolePage();
      },
  
      async doUpdateUserGroupRolePage() {
        const activePageList = this.clearActivePageList();
        const updateList = [];
        activePageList.forEach(e => {
          const [appId, pageId] = e.split('|');
          // 过滤脏数据
          if (pageId != '*' && !this.constantObj.appList.find(e => e.appId == appId)?.appPageList.some(e => e.pageId == pageId)) {
            return;
          } 
          updateList.push({appId, pageId});
        })
        await window.vtoast.loading("正在保存");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupAuthorityManagement',
              actionId: 'updateUserGroupRolePage',
              actionData: {dataList: updateList, group: this.activeGroup, role: this.activeRole},
            }
          }
        })
        await window.vtoast.success("保存成功");
      },
  
      // 如果指定应用存在管理员权限，则删除其他权限
      clearActivePageList() {
        const activePageList = this.activePageList.filter(e => e.includes('|*'));
        const otherPageList = this.activePageList.filter(e => !e.includes('|*'));
        const otherList = [];
        otherPageList.forEach(e => {
          const [appId, pageId] = e.split('|');
          if (!activePageList.includes(appId + '|*')) {
            otherList.push(e);
          }
        })
        return [...activePageList, ...otherList];
      },
    }
  },
  style: /*css*/`
  .border-r {
    border-right: 1px solid #e0e0e0;
  }
  `
  
};

module.exports = content;
