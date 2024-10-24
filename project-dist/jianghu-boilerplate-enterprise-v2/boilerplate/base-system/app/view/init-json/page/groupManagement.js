const content = {
  pageType: "jh-page", pageId: "groupManagement", table: "enterprise_group", pageName: "[组织权限]组织管理", 
  resourceList: [
    
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "组织管理", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    { tag: 'v-btn', value: '新增组织', attrs: { color: 'primary', '@click': 'doUiAction("startCreateItem")' }, quickAttrs: ['small'] },
  ],
  pageContent: [
    {
      tag: 'v-col',
      attrs: { cols: 12, class: 'jh-fixed-table-height overflow-y-auto pa-0' },
      value: `
      <v-card class="rounded-lg elevation-0 pa-4 jh-fixed-table-height" outlined>
        <!-- 树形结构 -->
        <v-treeview
          hoverable
          activatable
          :open="openIdList"
          open-all
          :items="tableDataTree"
          dense
          item-key="groupId"
          item-text="groupName"
          :filter="filter"
          :search="searchInput"
          :active="selectedItem"
        >

          <template v-slot:label="{ item }">
            <!-- {{item.groupName + ' (' + item.groupId + ')'}} -->
            {{item.groupName}}
          </template>
          <template v-slot:append="{ item, open }">
            <template v-if="item.groupId != '超级管理员'">
              <template v-if="constantObj.userGroupRoleList.includes('超级管理员') && item.groupId">
                <v-autocomplete style="width: 170px; display: inline-block;" 
                  prefix="主管:" v-model="item.headId" 
                  class="jh-v-input" dense filled single-line 
                  :items="constantObj.userList" 
                  @change="doUiAction('updateHeadId', item)"
                  item-text="username" 
                  item-value="userId"></v-autocomplete>
              </template>
              <!-- <template v-if="constantObj.userGroupRoleList.includes('超级管理员') && item.groupId">
                <span role="button" class="blue--text font-weight-medium font-size-2 mr-2" @click.stop="doUiAction('startSetPrincipal', item)">
                  <v-icon size="16" class="blue--text">mdi-account-details-outline</v-icon>组织管理者
                </span>
              </template> -->
              <template v-if="constantObj.userGroupRoleList.includes('超级管理员') || (item.principalIdList?.split(',') || []).includes(userInfo.userId)">
                <span role="button" class="success--text font-weight-medium font-size-2 mr-2" @click.stop="doUiAction('startCreateItem', item)">
                  <v-icon size="16" class="success--text">mdi-plus</v-icon>下属组织
                </span>
                <span role="button" class="orange--text font-weight-medium font-size-2 mr-2" @click.stop="doUiAction('startUpdateItem', item)">
                  <v-icon size="16" class="orange--text">mdi-note-edit-outline</v-icon>组织信息
                </span>
                <span role="button" class="red--text font-weight-medium font-size-2 mr-2" @click.stop="doUiAction('deleteItem', item)">
                  <v-icon size="16" class="red--text">mdi-trash-can-outline</v-icon>删除组织
                </span>
              </template>
            </template>
          </template>
        </v-treeview>
        <!-- overlay -->
        <v-overlay :value="isTableLoading" color="#fff" absolute >
          <v-progress-circular
            indeterminate
            size="32"
            color="primary"
          ></v-progress-circular>
        </v-overlay>
      </v-card>
      `
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
            { label: "groupId", md: 4, model: "groupId", tag: "v-text-field", rules: "validationRules.requireRules", attrs: { ':prefix': "createItem.groupPath ? createItem.groupPath + '-' : ''" } },
            { label: "群组简称", md: 4, model: "groupName", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "群组描述", md: 4, model: "groupDesc", tag: "v-text-field" },

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
             * 
            <v-col cols="12" sm="12" md="4">
              <span class="jh-input-label">组织Id</span>
              <v-text-field class="jh-v-input" dense single-line filled v-model="updateItem.groupId" disabled></v-text-field>
            </v-col>
             
            <v-col cols="12" sm="12" md="4">
              <span class="jh-input-label">组织名称<span class="red--text text--accent-2 ml-1">*必填</span></span>
              <v-text-field class="jh-v-input" dense single-line filled v-model="updateItem.groupName" :rules="validationRules.requireRules"></v-text-field>
            </v-col>
             
            <v-col cols="12" sm="12" md="4">
              <span class="jh-input-label">组织描述</span>
              <v-text-field class="jh-v-input" dense single-line filled v-model="updateItem.groupDesc"></v-text-field>
            </v-col>
             */
            { label: "组织Id", md: 4, model: "groupId", tag: "v-text-field", attrs: { disabled: true } },
            { label: "组织名称", md: 4, model: "groupName", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "组织描述", md: 4, model: "groupDesc", tag: "v-text-field" },

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
    <v-dialog
      v-model="isSetPrincipalDialog"
      width="500"
      height="800"
    >
      <v-card>
        <v-card-title class="font-weight-bold" style="font-size:medium">
          请选择【{{setPrincipalItem.groupAllName}}（{{setPrincipalItem.groupId}}）】的组织负责人       
        </v-card-title>

        <div class="ma-4">
          <v-autocomplete class="jh-v-input" dense filled single-line v-model="setPrincipalItem.principalId" :items="constantObj.userList" item-text="username" item-value="userId" multiple></v-autocomplete>
        </div>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="doUiAction('setPrincipal')"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    `
  ],
  includeList: [
    // {% include 'common/jianghuJs/fixedTableHeightV4.html' %}
    { type: 'html', path: 'common/jianghuJs/fixedTableHeightV4.html' },
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {
        gender: [{"value": null, "text": "全部"}, {"value": "male", "text": "男"}, {"value": "female", "text": "女"}],
        userGroupRoleList: [],
        userList: [],
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      testString: '测试字符串',
      serverSearchWhereLike: { className: '' },
      filterMap: {},
      setPrincipalItem:{},
      setPrincipalData:{},
      // 树形视图
      selectedItem: null,
      openIdList: [],
      tableDataTree: [],
      isSetPrincipalDialog: false,
      searchInput: '',
      isTableLoading: false,
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
    mounted() {
      this.doUiAction('getTableData');
      this.doUiAction('getUserData');
      this.constantObj.userGroupRoleList = window.userInfo.userGroupRoleList.map(item=>item.groupId)
    },
    doUiAction: {
      /**
       * case 'getTableData':
          await this.getTableData();
          break;
        case 'getUserData':
          await this.getUserData();
          break;
        case 'startCreateItem':
          await this.prepareCreateFormData(uiActionData);
          await this.openCreateDrawer();
          break;
        case 'createItem':
          await this.prepareCreateValidate();
          await this.confirmCreateItemDialog();
          await this.prepareDoCreateItem();
          await this.doCreateItem();
          await this.closeCreateDrawer();
          await this.getTableData();
          break;
        case 'startUpdateItem':
          await this.prepareUpdateFormData(uiActionData);
          await this.openUpdateDrawer();
          break;
        case 'updateItem':
          await this.prepareUpdateValidate();
          await this.confirmUpdateItemDialog();
          await this.prepareDoUpdateItem();
          await this.doUpdateItem();
          await this.closeUpdateDrawer();
          await this.getTableData();
          break;
        case 'deleteItem':
          await this.prepareDeleteFormData(uiActionData);
          await this.checkAffiliatedGroup();
          await this.confirmDeleteItemDialog();
          await this.prepareDoDeleteItem();
          await this.doDeleteItem();
          await this.clearDeleteItem();
          await this.getTableData();
          break;
        case 'startSetPrincipal':
          await this.prepareSetPrincipalData(uiActionData);
          await this.openSetPrincipalDialog();
          break;
        case 'setPrincipal':
          await this.prepareSetPrincipalItem();
          await this.doSetPrincipal();
          await this.closeSetPrincipalDialog();
          await this.getTableData();
          break;
        case 'updateHeadId':
          await this.updateHeadId(uiActionData);
          break;
        default:
       */
      getTableData: ['getTableData'],
      getUserData: ['getUserData'],
      updateHeadId: ['updateHeadId']
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      /**
       * 获取表格数据
       */
      async getTableData() {
        this.isTableLoading = true;
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupManagement',
              actionId: 'selectItemList',
              actionData: {},
              orderBy: [{column: 'groupName', order: 'desc'}]
            }
          }
        })).data.appData.resultData.rows;

        rows.forEach(row => {
          row.operationAt = dayjs(row.operationAt).format('YYYY-MM-DD HH:mm:ss');
        })
        this.tableData = rows;
        
        this.tableDataTree = this.buildTableTree(rows)
        this.isTableLoading = false;
      },
      async getUserData() {
        this.isTableLoading = true;
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupManagement',
              actionId: 'getUserList',
              actionData: {},
              where: {
                userStatus: 'active'
              },
              orderBy: [{column: 'userId', order: 'asc'}]
            }
          }
        })).data.appData.resultData.rows;
        this.constantObj.userList = rows
      },
      buildTableTree(rows) {
        const data = rows.filter(item => !item.groupPath);
        this.selectedItem = data[0] ? [data[0]?.groupId] : [];
        // 递归  子 groupPath === 父 groupId
        const buildTree = (data) => {
          data.forEach(item => {
            item.name = item.groupName;
            item.principalIdList = item.principalId;
            const children = rows.filter(child => {
              const parentPath = item.groupId ? item.groupId : item.groupPath + '-' + item.groupLastId;
              return child.groupPath == parentPath
            }).map(child=>{
              child.principalIdList = child.principalId == null ? item.principalIdList : item.principalIdList + ',' + child.principalId
              return child
            })
            if (children.length) {
              this.openIdList.push(item.groupId);
              item.children = children;
              buildTree(children);
            }
          });
        };
        buildTree(data);
        return data;
      },
      // ---------- 新增数据 uiAction >>>>>>>>>> --------
      async prepareCreateFormData(item) {
        this.createItem = {};
        if (item) {
          this.createItem.groupPath = item.groupId ? item.groupId : item.groupPath + '-' + item.groupLastId;
          this.createItem.groupPathName = item.groupAllName ? item.groupAllName : "";
        } else {
          this.createItem.groupPath = '';
          this.createItem.groupPathName = '';
        }
      },

      async confirmCreateItemDialog() {
        if (await window.confirmDialog({title: "新增组织", content: "确定新增组织吗？"}) === false) {
          throw new Error("[confirmCreateFormDialog] 否");
        }
      },

      prepareDoCreateItem() {
        const {id, ...data} = this.createItem;
        this.createActionData = { 
          groupId: data.groupPath ? data.groupPath + '-' + data.groupId : data.groupId,
          groupLastId: data.groupId,
          groupPath: data.groupPath,
          groupName: data.groupName,
          groupDeptName: data.groupName,
          groupAllName: data.groupPathName == '' ? data.groupName : data.groupPathName + '-' + data.groupName 
        };
      },

      // ---------- <<<<<<<<<<< 新增数据 uiAction ---------
      // ---------- 修改数据 uiAction >>>>>>>>>>>> --------

      async prepareDoUpdateItem() {
        const {id, name, ...data} = this.updateItem;
        this.updateActionData = {
          groupId: data.groupId,
          groupName: data.groupName,
          groupAllName: _.slice(data.groupAllName, 0, _.lastIndexOf(data.groupAllName,'-')).join('')+ '-' + data.groupName,
          groupDesc: data.groupDesc
        };
      },
      // ---------- <<<<<<<<<<< 修改数据 uiAction ---------

      async updateHeadId(item){
        await window.vtoast.loading("修改主管");
        const {groupId, headId} = item;
        if (!groupId) {
          return;
        }
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupManagement',
              actionId: 'updateItem',
              actionData: {headId},
              where: {groupId}
            }
          }
        })
        await window.vtoast.success("修改主管");
      },
      // ---------- 删除数据 uiAction >>>>>>>>>>>> --------
      async prepareDeleteFormData(funObj) {
        this.deleteItem = _.cloneDeep(funObj);
      },
      async checkAffiliatedGroup(){
        if(this.deleteItem.children && this.deleteItem.children.length > 0){
          await window.vtoast.fail("请先删除下属组织！");
          throw new Error("[checkAffiliatedGroup] 请先删除下属组织！");
        }
      },
      async confirmDeleteItemDialog() {
        if (await window.confirmDialog({title: "删除", content: "确定删除吗？"}) === false) {
          throw new Error("[confirmDeleteItemDialog] 否");
        }
      },
      async prepareDoDeleteItem() {
        const {id} = this.deleteItem;
      },
      async doDeleteItem() {
        await window.vtoast.loading("删除数据");
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupManagement',
              actionId: 'deleteItem',
              actionData: {
                groupId: this.deleteItem.groupId
              },
              where: {}
            }
          }
        });
        await window.vtoast.success("删除数据成功");
      },
      async clearDeleteItem() {
        this.deleteItem = {};
      },
      // ---------- <<<<<<<<<<< 删除数据 uiAction ---------
      // ---------- 设置负责人 uiAction >>>>>>>>>>>> --------
      prepareSetPrincipalData(item){
        this.setPrincipalItem = {
          groupAllName: item.groupAllName,
          groupId: item.groupId,
          principalId: item.principalId?.split(',')
        }
      },
      openSetPrincipalDialog(){
        this.isSetPrincipalDialog = true
      },
      prepareSetPrincipalItem(){
        const {groupAllName, ...data} = this.setPrincipalItem;
        this.setPrincipalData = {
          groupId: data.groupId,
          principalId: data.principalId.join(',')
        }
        
      },
      async doSetPrincipal(){
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupManagement',
              actionId: 'setPrincipal',
              actionData: {
                principalId: this.setPrincipalData.principalId
              },
              where: {groupId: this.setPrincipalData.groupId}
            }
          }
        })
      },
      closeSetPrincipalDialog(){
        this.setPrincipalItem = {}
        this.isSetPrincipalDialog = false
      },
      // 重写搜索方法
      filter (value, search) {
        let newItem = _.pick(value,['groupId','groupAllName'])
        const result = _.some(newItem, itemValue =>  itemValue && itemValue.toString().includes(search));
        if(result){
          return true
        }else{
          // 特殊操作
          let {test} = value;
          return _.some(test, itemValue =>{ 
            return _.isString(itemValue.name) && itemValue['name'].includes(search)
          });
        }
      },
      async updateHeadId(item){
        await window.vtoast.loading("修改主管");
        const {groupId, headId} = item;
        if (!groupId) {
          return;
        }
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'groupManagement',
              actionId: 'updateItem',
              actionData: {headId},
              where: {groupId}
            }
          }
        })
        await window.vtoast.success("修改主管");
      },
    }
  },
  
};

module.exports = content;
