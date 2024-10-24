const content = {
  pageType: "jh-page", pageId: "groupUserManagement", table: "", pageName: "[组织权限]组织人员", 
  resourceList: [
    
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "组织人员管理", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
  ],
  pageContent: [
    {
      tag: 'v-col',
      attrs: { cols: '12', sm: '6', md: '3', class: 'pa-0 border-r pr-4' },
      value: `
        <select-group-tree @change-active="changeActiveGroup" @check-principal-auth="setPrincipalAuth"></select-group-tree>
      `,
    },

    {
      tag: 'v-col',
      attrs: { cols: '12', sm: '6', md: '9', class: 'pa-0' },
      value: `
        <group-user :table-data="tableDataComputed" :loading="isAppLoading" v-model="activePageList" :groupId="activeGroup" @refresh-user-list="getTableData" :isPrincipal="isPrincipal"></group-user>
      `,
    },
  ],
  includeList: [
    { type: 'html', path: 'common/jianghuJs/fixedTableHeightV4.html' },
    { type: 'html', path: 'component/common/datetimePicker.html' },
    { type: 'html', path: 'component/select-group-tree.html' },
    { type: 'html', path: 'component/group-user.html' },
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {
        appType: [{"value": "internal", "text": "内部应用"}, {"value": "external", "text": "外部应用"}],
        tabList: ['组织人员'],
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
      isAppLoading: false,
      activeGroup: '',
      isPrincipal: false,
      activePageList: [],
      tableDataBackUp: [],
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
    computed: {
      tabList() {
        return this.constantObj.tabList;
      },
      tableDataComputed() {
        return this.tableDataBackUp
      },
    },
    doUiAction: {
      /**
       * case 'getTableData':
          await this.getTableData();
          break;
        case 'getUserGroupRolePage':
          await this.getUserGroupRolePage();
          break;
       */
      getTableData: ['getTableData'],
      getUserGroupRolePage: ['getUserGroupRolePage'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      async getTableData(isContainSub) {
        this.isAppLoading = true;
        const where = {};
        const whereIn = {};
        const whereLike = {};
  
        if (this.activeGroupPath) {
          if(isContainSub){
            whereLike.groupId = `${this.activeGroup}%`;
          }else{
            where.groupId = `${this.activeGroup}`;
          }
        } else {
          whereIn.groupId = [this.activeGroup];
        }
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupUserManagement',
              actionId: 'selectItemList',
              actionData: {},
              where,
              whereIn,
              whereLike,
              orderBy: [{column: 'groupId', order: 'asc'}, {column: 'roleDeadline', order: 'asc'}]
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
          item.groupAllName = groupBy[key][0].groupAllName;
          item.roleName = groupBy[key].map(e => {
            // let roleName = e.roleDeadline == -1 ? e.roleName : e.roleName +' 【'+ e.roleDeadline +'】'
            return (e.roleName  || '无角色')
          }).join(',');
          item.roleId = _.compact(groupBy[key].map(e => e.roleId));
          item.roleConfig = groupBy[key].map(e => {
            return {
              roleId: e.roleId,
              groupId: e.groupId,
              roleDeadline: e.roleDeadline
            }
          });
          item.operationByUser = groupBy[key][0].operationByUser;
          item.operationAt = groupBy[key][0].operationAt;
          list.push(item);
        })
        this.tableDataBackUp = list;
        this.isAppLoading = false;
      },
      changeActiveGroup(item) {
        this.activeGroup = item.groupId ? item.groupId : item.groupPath + '-' + item.groupLastId;
        this.activeGroupName = item.groupName;
        this.activeGroupPath = item.groupPath || "FS";
        if (this.tabActive == 1) {
          this.getUserGroupRolePage();
          return;
        }
        this.getTableData();
      },
      setPrincipalAuth(item){
        this.isPrincipal = 
          _.map(window.userInfo.userGroupRoleList, "groupId").join(',').includes('超级管理员') || item.principalIdList?.includes(window.userInfo.userId)
      }
    }
  },
  style: /*css*/`
  .border-r {
    border-right: 1px solid #e0e0e0;
  }
  `
  
};

module.exports = content;
