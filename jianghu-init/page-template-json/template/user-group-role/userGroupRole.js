const content = {
  "pageType": "jh-page",
  "pageId": "userGroupRole",
  "table": "course",
  "pageName": "用户权限管理",
  "resourceList": [],
  "includeList": [],
  "pageContent": [
    {
      "tag": "jh-table",
      "attrs": {
        "fixed-header": "",
        ":headers": "relationDataTableHeader",
        ":items": "relationDataListFromBackend",
        ":search": "searchInput",
        ":footer-props": "{ itemsPerPageOptions: [20, 50, -1], itemsPerPageText: '每页行数', itemsPerPageAllText: '所有'}",
        ":items-per-page": "20",
        "mobile-breakpoint": "0",
        ":loading": "isTableLoading",
        ":class": "{'zebraLine': isTableZebraLineShown }",
        "checkbox-color": "success"
      },
      "slot": /*html*/`
              <template v-slot:item.roleId="{ item }">
                {{ (constantObj.userType.find(({value}) => value === item.roleId) || roleListFromBackend.find(({value}) => value === item.roleId) || {}).text }}
              </template>
              <!-- 表格行操作按钮 -->
              <template v-slot:item.action="{ item }">
                <template>
                  <!-- pc端 -->
                  <template v-if="!isMobile">
                    <span role="button" class="success--text font-weight-medium font-size-2 mr-2" @click="doUiAction('startUpdateRelationDataItem', item)">
                      <v-icon size="16" class="success--text">mdi-note-edit-outline</v-icon>修改
                    </span>
                    <span role="button" class="red--text text--accent-2 font-weight-medium font-size-2" @click="doUiAction('deleteRelationDataItem', item)">
                      <v-icon size="16" class="red--text text--accent-2">mdi-trash-can-outline</v-icon>删除
                    </span>
                  </template>
                  <!-- 手机端 -->
                  <v-menu offset-y="" v-if="isMobile">
                    <template v-slot:activator="{ on, attrs }">
                      <span role="button" class="success--text font-weight-medium font-size-2" v-bind="attrs" v-on="on">
                        操作<v-icon size="14" class="success--text">mdi-chevron-down</v-icon>
                      </span>
                    </template>
                    <v-list dense="">
                      <v-list-item @click="doUiAction('startUpdateRelationDataItem', item)">
                        <v-list-item-title>修改</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="doUiAction('deleteRelationDataItem', item)">
                        <v-list-item-title>删除</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </template>
           `
    }
  ],
  "actionContent": [
    {
      "tag": "jh-drawer",
      "key": "create",
      "title": "新增",
      "contentList": [
        {
          "label": "新增",
          "type": "form",
          "formItemList": [
            {
              "label": "UserID*必填",
              "model": "createRelationDataFormData.userId",
              "tag": "v-select",
              "attrs": {
                "clearable": true,
                ":items": "userListFromBackend"
              },
              "rules": "validationRules.requireRules"
            },
            {
              "label": "GroupID*必填",
              "model": "createRelationDataFormData.groupId",
              "tag": "v-select",
              "attrs": {
                "clearable": true,
                ":items": "groupListFromBackend"
              },
              "rules": "validationRules.requireRules"
            },
            {
              "label": "RoleId*必填",
              "model": "createRelationDataFormData.roleId",
              "tag": "v-select",
              "attrs": {
                "clearable": true,
                ":items": "roleListFromBackend"
              },
              "rules": "validationRules.requireRules"
            }
          ]
        },
        {
          "label": "新增",
          "type": "form",
          "formItemList": [
            {
              "label": "UserID*必填",
              "model": "updateRelationDataFormData.userId",
              "tag": "v-select",
              "attrs": {
                "clearable": true,
                ":items": "userListFromBackend"
              },
              "rules": "validationRules.requireRules"
            },
            {
              "label": "GroupID*必填",
              "model": "updateRelationDataFormData.groupId",
              "tag": "v-select",
              "attrs": {
                "clearable": true,
                ":items": "groupListFromBackend"
              },
              "rules": "validationRules.requireRules"
            },
            {
              "label": "RoleId*必填",
              "model": "updateRelationDataFormData.roleId",
              "tag": "v-select",
              "attrs": {
                "clearable": true,
                ":items": "roleListFromBackend"
              },
              "rules": "validationRules.requireRules"
            }
          ]
        }
      ]
    }
  ],
  "common": {
    data: {
      "isHelpPageDrawerShown": false,
      isMobile: window.innerWidth < 500,
      isTableZebraLineShown: true,
      // 表格相关数据
      isFullDataShown: false,
      // 左侧用户、组织、角色弹窗状态
      isCreateUserDialogShow: false,
      isCreateGroupDialogShown: false,
      isCreateRoleDialogShown: false,
      dataType: 0, // 数据类型，0：用户，1：组织，2：角色
      currentItemIndex: 0,
      showLeftMenu: window.innerWidth > 600,
      validationRules: {
        requireRules: [v => !!v || 'This is required'],
        nullRules: [v => true],
      },
      tabsSearchKeyword: null,
      constantObj: {
        userStatus: [{value: 'active', text: '活跃'}, {value: 'banned', text: '关闭'}],
        userType: [{value: 'common', text: '管理员'}, {value: 'staff', text: '职工'}, {value: 'teacher', text: '老师'}, {value: 'student', text: '学员'}],
      },
      isRelationDataCreateDrawerShow: false,
      isRelationDataUpdateDrawerShow: false,
      searchInput: null,
      isDataTypeLoading: true,
      isTableLoading: true,
      // 后端数据
      relationDataListFromBackend: [],
      userListFromBackend: [],
      groupListFromBackend: [],
      roleListFromBackend: [],
      // 数据表单
      createRelationDataFormData: {},
      updateRelationDataFormData: {},
      createUserData: {},
      createGroupData: {},
      createRoleData: {},
      // 左侧抽屉选中数据
      currentDataTypeItem: {},
      isUpdateCurrentDataTypeDialog: false,
  
      relationDataTableHeader: [
        {text: "用户Id", value: "userId", width: 120},
        {text: "组织ID", value: "groupId", width: 120},
        {text: "角色ID", value: "roleId", width: 120},
        {text: "操作人", value: "operationByUser", width: 90},
        {text: "操作时间", value: "operationAt", width: 150},
        {text: '操作', value: 'action', align: 'center', sortable: false, width: window.innerWidth < 500 ? 80 : 120, class: 'fixed', cellClass: 'fixed'},
      ],
  
      userKeys: [
        {text: "用户Id", value: "userId"},
        {text: "用户名", value: "username"},
        {text: "用户账号状态", value: "userStatus", type: 'select'},
        {text: "用户类型", value: "userType", type: 'select'},
      ],
  
      groupKeys: [
        {text: "组织Id", value: "groupId"},
        {text: "组织名", value: "groupName"},
        {text: "组织描述", value: "groupDesc", require: false},
        {text: "组织Logo", value: "groupAvatar", require: false},
        {text: "拓展字段", value: "groupExtend", type: 'textarea', require: false},
      ],
      roleKeys: [
        {text: "角色ID", value: "roleId"},
        {text: "角色名", value: "roleName"},
        {text: "角色描述", value: "roleDesc", require: false},
      ],
      currentOperation: {title: '新增', action: 'add'},
      formSubmitAction: '',
      dataTypeName: '用户',
      dataTypeFieldList: [],
      dataTypeData: []
    },
    watch: {
      // description: ✅响应左侧抽屉数据类型的切换
      async dataType() {
        this.dataTypeName = ['用户', '组织', '角色'][this.dataType];
        // 根据左侧tab类型动态改变右侧表单的字段
        if (this.dataType === 0) {
          this.dataTypeFieldList = this.userKeys;
        }
        if (this.dataType === 1) {
          this.dataTypeFieldList = this.groupKeys;
        }
        if (this.dataType === 2) {
          this.dataTypeFieldList = this.roleKeys;
        }
        this.buildDataTypeData();
        this.relationDataListFromBackend = [];
        await this.doUiAction('getRelationDataList');
      },
      currentItemIndex(v, ov) {
        if (v !== ov) {
          this.setCurrentItemInfo();
          this.doUiAction('getRelationDataList');
        }
      }
    },
    async created() {
      this.dataTypeFieldList = this.userKeys;
    },
    async mounted() {
      this.isDataTypeLoading = true;
      await this.doUiAction('getBasicDataFromBackend');
      this.isDataTypeLoading = false;
    },
    methods: {
      async doUiAction(uiActionId, uiActionData) {
        switch (uiActionId) {
          case 'getRelationDataList':
            await this.getRelationDataList(uiActionData);
            break;
          case 'getBasicDataFromBackend':
            await this.getUserList();
            await this.getGroupList();
            await this.getRoleList();
            await this.buildDataTypeData();
            await this.setCurrentItemInfo();
            await this.getRelationDataList(uiActionData);
            break;
          // description: ✅中间表格操作
          case 'startCreateRelationDataItem':
            await this.prepareCreateRelationDataForm(uiActionData);
            await this.openCreateRelationDataDrawer(uiActionData);
            break;
          case 'createRelationDataItem':
            await this.prepareCreateRelationDataFormValidate(uiActionData);
            await this.confirmCreateItemDialog(uiActionData);
            await this.doCreateRelationDataItem(uiActionData);
            await this.getRelationDataList(uiActionData);
            await this.closeDrawerShow(uiActionData);
            break;
          case 'startUpdateRelationDataItem':
            await this.prepareUpdateRelationDataForm(uiActionData);
            await this.openUpdateRelationDataDrawer(uiActionData);
            break;
          case 'updateRelationDataItem':
            await this.prepareUpdateRelationDataFormValidate(uiActionData);
            await this.confirmUpdateItemDialog(uiActionData);
            await this.doUpdateRelationDataItem(uiActionData);
            await this.getRelationDataList(uiActionData);
            await this.closeDrawerShow(uiActionData);
            break;
          case 'deleteRelationDataItem':
            await this.confirmDeleteItemDialog(uiActionData);
            await this.doDeleteRelationDataItem(uiActionData);
            await this.getRelationDataList(uiActionData);
            break;
          // description: ✅左侧抽屉数据操作（用户、组织、角色）
          case 'startCreateDataTypeItem':
            await this.prepareDataTypeFormData(uiActionData);
            await this.openDataTypeFormDialog(uiActionData);
            break;
          case 'createUserItem':
            await this.prepareUserFormValidate();
            await this.doCreateUserItem();
            await this.getUserList();
            await this.buildDataTypeData();
            await this.closeFormDialog();
            break;
          case 'createGroupItem':
            await this.prepareGroupFormValidate();
            await this.doCreateGroupItem();
            await this.getGroupList();
            await this.buildDataTypeData();
            await this.closeFormDialog();
            break;
          case 'createRoleItem':
            await this.prepareRoleFormValidate();
            await this.doCreateRoleItem();
            await this.getRoleList();
            await this.buildDataTypeData();
            await this.closeFormDialog();
            break;
          // description: ✅表格右侧表单操作
          case 'startUpdateDataTypeItem':
            await this.prepareCurrentDataTypeForm(uiActionData);
            await this.openCurrentDataTypeDialog(uiActionData);
            break;
          case 'updateCurrentDataTypeItem':
            await this.prepareCurrentDataTypeFormValidate(uiActionData);
            await this.doUpdateCurrentDataTypeDataItem(uiActionData);
            await this.closeCurrentDataTypeDialog();
            await this.getDataTypeList(uiActionData);
            await this.buildDataTypeData();
            break;
          case 'deleteCurrentDataTypeItem':
            await this.confirmDeleteDataItemDialog(uiActionData);
            await this.doDeleteCurrentDataTypeItem(uiActionData);
            await this.closeCurrentDataTypeDialog();
            await this.getDataTypeList(uiActionData);
            await this.buildDataTypeData();
            break;
          default:
            console.error("[doUiAction] uiActionId not find", {uiActionId});
            break;
        }
      },
      // description: ✅用户、组织、角色数据重建
      buildDataTypeData() {
        let tempList, searchKey;
        if (this.dataType === 0) {
          searchKey = ['userId', 'username'];
          tempList = _.cloneDeep(this.userListFromBackend);
        }
        if (this.dataType === 1) {
          searchKey = ['groupId', 'groupName'];
          tempList = _.cloneDeep(this.groupListFromBackend);
        }
        if (this.dataType === 2) {
          searchKey = ['roleId', 'roleName'];
          tempList = _.cloneDeep(this.roleListFromBackend);
        }
        if (this.tabsSearchKeyword) {
          this.dataTypeData = tempList.filter((funObj) => {
            if (funObj.data[searchKey[0]].includes(this.tabsSearchKeyword)) return true;
            if (funObj.data[searchKey[1]].includes(this.tabsSearchKeyword)) return true;
            return false;
          });
        } else {
          this.dataTypeData = tempList;
        }
      },
      // description: ✅获取当前左侧选中的选项详情
      setCurrentItemInfo() {
        let tempList;
        if (this.dataType === 0) {
          tempList = _.cloneDeep(this.userListFromBackend);
        }
        if (this.dataType === 1) {
          tempList = _.cloneDeep(this.groupListFromBackend);
        }
        if (this.dataType === 2) {
          tempList = _.cloneDeep(this.roleListFromBackend);
        }
        if (tempList && tempList[this.currentItemIndex || 0]) {
          this.currentDataTypeItem = tempList[this.currentItemIndex || 0].data;
        }
      },
      // description: ✅获取组织数据
      async getGroupList() {
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: 'selectGroup'
            }
          }
        });
        this.groupListFromBackend = result.data.appData.resultData.rows.map((group) => {
          return {value: group.groupId, text: group.groupName, data: group}
        });
      },
      // description: ✅获取角色数据
      async getRoleList() {
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: 'selectRole'
            }
          }
        });
        this.roleListFromBackend = result.data.appData.resultData.rows.map((role) => {
          return {value: role.roleId, text: role.roleName, data: role}
        })
      },
      // description: ✅获取用户数据
      async getUserList() {
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: 'selectUser'
            }
          }
        });
        this.userListFromBackend = result.data.appData.resultData.rows.map((user) => {
          return {value: user.userId, text: user.username, data: user}
        })
      },
      /**
       * 获取关系表格数据
       */
      async getRelationDataList() {
        this.isTableLoading = true;
        let where = {};
        const currentDataTypeData = this.dataTypeData[this.currentItemIndex];
        if (!this.isFullDataShown && currentDataTypeData) {
          let key;
          if (this.dataType === 0) {
            key = 'userId';
          }
          if (this.dataType === 1) {
            key = 'groupId';
          }
          if (this.dataType === 2) {
            key = 'roleId';
          }
          where = {[key]: currentDataTypeData.value}
        }
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: 'selectItemList',
              where: where
            }
          }
        })).data.appData.resultData.rows;
  
        rows.forEach(row => {
          row.operationAt = window.dayjs(row.operationAt).format('YYYY-MM-DD HH:mm:ss');
        })
        this.relationDataListFromBackend = rows;
        this.isTableLoading = false;
      },
      // description: ✅准备新增关系表单数据
      async prepareCreateRelationDataForm() {
        this.createRelationDataFormData = {};
      },
      // description: ✅准备更新关系表单数据
      async prepareUpdateRelationDataForm(funObj) {
        this.updateRelationDataFormData = _.cloneDeep(funObj);
      },
      // description: ✅准备更新用户、组织、角色表单数据
      async prepareCurrentDataTypeForm(funObj) {
        this.currentDataTypeItem = _.cloneDeep(funObj);
      },
      // description: ✅打开更新用户、组织、角色弹窗
      async openCurrentDataTypeDialog() {
        this.isUpdateCurrentDataTypeDialog = true;
      },
      // description: ✅关闭更新用户、组织、角色弹窗
      async closeCurrentDataTypeDialog() {
        this.isUpdateCurrentDataTypeDialog = false;
      },
      // description: ✅打开关系新增抽屉
      async openCreateRelationDataDrawer() {
        this.isRelationDataCreateDrawerShow = true;
      },
  
      // description: ✅创建关系表单验证
      async prepareCreateRelationDataFormValidate() {
        if (await this.$refs.createRelationDataForm.validate() === false) {
          throw new Error("[prepareRelationDataFormValidate] false");
        }
      },
      // description: ✅更新关系表单验证
      async prepareUpdateRelationDataFormValidate() {
        if (await this.$refs.updateRelationDataForm.validate() === false) {
          throw new Error("[prepareRelationDataFormValidate] false");
        }
      },
      // description: ✅新增关系弹窗确认
      async confirmCreateItemDialog() {
        if (await window.confirmDialog({title: "新增", content: "确定新增吗？"}) === false) {
          throw new Error("[confirmCreateFormDialog] 否");
        }
      },
  
      // description: ✅新增关系数据resource
      async doCreateRelationDataItem() {
        await window.vtoast.loading("保存中");
        const {userId, groupId, roleId} = this.createRelationDataFormData;
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: 'insertItem',
              actionData: {userId, groupId, roleId}
            }
          }
        });
        await window.vtoast.success("保存成功");
      },
      // description: ✅关闭关系新增、更新抽屉
      async closeDrawerShow() {
        this.isRelationDataCreateDrawerShow = false;
        this.isRelationDataUpdateDrawerShow = false;
      },
      // description: ✅重构用户、组织、角色的表单数据
      async prepareDataTypeFormData() {
        this.createUserData = {};
        this.createGroupData = {};
        this.createRoleData = {};
      },
      // description: ✅打开关系新增抽屉
      async openUpdateRelationDataDrawer() {
        this.isRelationDataUpdateDrawerShow = true;
      },
  
      // description: ✅更新关系数据弹窗确认
      async confirmUpdateItemDialog() {
        if (await window.confirmDialog({title: "修改", content: "确定修改吗？"}) === false) {
          throw new Error("[confirmUpdateItemDialog] 否");
        }
      },
  
      // description: ✅更新关系数据resource
      async doUpdateRelationDataItem() {
        await window.vtoast.loading("保存中");
        const id = this.updateRelationDataFormData.id;
        const {userId, groupId, roleId} = this.updateRelationDataFormData;
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: 'updateItem',
              actionData: {userId, groupId, roleId},
              where: {id: id}
            }
          }
        });
        await window.vtoast.success("修改成功");
      },
  
      // description: ✅删除关系数据弹窗确认
      async confirmDeleteItemDialog() {
        if (await window.confirmDialog({title: "删除", content: "确定删除吗？"}) === false) {
          throw new Error("[confirmDeleteItemDialog] 否");
        }
      },
      // description: ✅删除用户组织角色关系数据resource
      async doDeleteRelationDataItem({id}) {
        window.vtoast.loading('正在删除')
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: 'deleteItem',
              where: {id}
            }
          }
        });
        window.vtoast.success('删除成功')
      },
  
      // description: ✅打开添加用户、组织、角色的表单弹窗
      async openDataTypeFormDialog() {
        this.isCreateUserDialogShow = false;
        this.isCreateGroupDialogShown = false;
        this.isCreateRoleDialogShown = false;
        if (this.dataType === 0) {
          this.isCreateUserDialogShow = true;
        }
        if (this.dataType === 1) {
          this.isCreateGroupDialogShown = true;
        }
        if (this.dataType === 2) {
          this.isCreateRoleDialogShown = true;
        }
      },
      // description: ✅左侧表单验证
      async prepareUserFormValidate() {
        if (await this.$refs.userForm.validate() === false) {
          throw new Error("[prepareUserFormValidate] false");
        }
      },
      async prepareGroupFormValidate() {
        if (await this.$refs.groupForm.validate() === false) {
          throw new Error("[prepareGroupFormValidate] false");
        }
      },
      async prepareRoleFormValidate() {
        if (await this.$refs.roleForm.validate() === false) {
          throw new Error("[prepareRoleFormValidate] false");
        }
      },
  
      /**
       * description: ✅新增用户数据
       */
      async doCreateUserItem() {
        window.vtoast.loading("添加中")
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: 'insertUser',
              actionData: this.createUserData
            }
          }
        })
        window.vtoast.success("添加成功")
      },
  
      /**
       * description: ✅新增组织数据
       */
      async doCreateGroupItem() {
        window.vtoast.loading("添加中")
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: 'insertGroup',
              actionData: this.createGroupData
            }
          }
        })
        window.vtoast.success("添加成功")
      },
  
      /**
       * description: ✅新增角色数据
       */
      async doCreateRoleItem() {
        window.vtoast.loading("添加中")
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: 'insertRole',
              actionData: this.createRoleData
            }
          }
        })
        window.vtoast.success("添加成功")
      },
      // description: ✅关闭添加用户、组织、角色的表单弹窗
      async closeFormDialog() {
        this.isCreateUserDialogShow = false;
        this.isCreateGroupDialogShown = false;
        this.isCreateRoleDialogShown = false;
      },
      // description: ✅刷新用户、组织、角色的数据
      async getDataTypeList() {
        if (this.dataType === 0) {
          await this.getUserList();
        }
        if (this.dataType === 1) {
          await this.getGroupList();
        }
        if (this.dataType === 2) {
          await this.getRoleList();
        }
        this.$forceUpdate()
      },
      // description: ✅deleteDataItem 确认
      async confirmDeleteDataItemDialog() {
        if (await window.confirmDialog({title: `确认删除该${this.dataTypeName}？`}) === false) {
          throw new Error("[confirmDeleteDataItemDialog] 否");
        }
      },
      // description: ✅删除用户、组织、角色
      async doDeleteCurrentDataTypeItem() {
        let actionId, whereKey, where;
        switch (this.dataType) {
          case 0:
            actionId = 'deleteUser';
            whereKey = 'userId';
            where = {userId: this.currentDataTypeItem['userId']};
            break;
          case 1:
            actionId = 'deleteGroup';
            whereKey = 'groupId';
            where = {groupId: this.currentDataTypeItem['groupId']};
            break;
          case 2:
            actionId = 'deleteRole';
            whereKey = 'roleId';
            where = {roleId: this.currentDataTypeItem['roleId']};
            break;
        }
        if (where[whereKey]) {
          window.vtoast.loading("删除中");
          await window.jianghuAxios({
            data: {
              appData: {
                pageId: '<=$ pageId $=>',
                actionId: actionId,
                where: where
              }
            }
          })
          window.vtoast.success("删除成功");
        }
      },
      // description: ✅右侧表单验证
      async prepareCurrentDataTypeFormValidate() {
        if (await this.$refs.formCurrentDataTypeDetail.validate() === false) {
          throw new Error("[prepareCurrentDataTypeFormValidate] false");
        }
      },
      // description: ✅更新修改用户、组织、角色
      async doUpdateCurrentDataTypeDataItem() {
        window.vtoast.loading("保存中");
        const {id, userId, ...updateItem} = this.currentDataTypeItem;
        let actionId;
        switch (this.dataType) {
          case 0:
            actionId = 'updateUser';
            break;
          case 1:
            actionId = 'updateGroup';
            break;
          case 2:
            actionId = 'updateRole';
            break;
        }
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: '<=$ pageId $=>',
              actionId: actionId,
              actionData: updateItem,
              where: {id}
            }
          }
        })
        window.vtoast.success("保存成功");
      }
    }
  },
}

module.exports = content;