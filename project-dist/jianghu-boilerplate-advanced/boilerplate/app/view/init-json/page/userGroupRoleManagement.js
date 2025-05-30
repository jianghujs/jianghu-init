const content = {
    pageType: "jh-page", pageId: "userGroupRoleManagement", pageName: "用户、组织、角色", version: 'v2',
    resourceList: [
        {
            actionId: 'selectItemList',
            resourceType: 'sql',
            resourceData: {
                "table": "_user_group_role",
                "operation": "select"
            },
            resourceHook: null,
            desc: '✅权限管理页-查询已配置权限列表'
        },
        {
            actionId: 'selectUser',
            resourceType: 'sql',
            resourceData: {
                "table": "_user",
                "operation": "select"
            },
            resourceHook: null,
            desc: '✅权限管理页-查询用户'
        },
        {
            actionId: 'selectGroup',
            resourceType: 'sql',
            resourceData: {
                "table": "_group",
                "operation": "select"
            },
            resourceHook: null,
            desc: '✅权限管理页-查询群组'
        },
        {
            actionId: 'insertItem',
            resourceType: 'sql',
            resourceData: {
                "table": "_user_group_role",
                "operation": "jhInsert",
                "whereCondition": ""
            },
            resourceHook: null,
            desc: '✅权限管理页-创建权限配置'
        },
        {
            actionId: 'updateItem',
            resourceType: 'sql',
            resourceData: {
                "table": "_user_group_role",
                "operation": "jhUpdate",
                "whereParamsCondition": ".where(function() {this.where(whereParams)})"
            },
            resourceHook: null,
            desc: '✅权限管理页-更新权限配置'
        },
        {
            actionId: 'deleteItem',
            resourceType: 'sql',
            resourceData: {
                "table": "_user_group_role",
                "operation": "jhDelete",
                "whereParamsCondition": ".where(function() {this.where(whereParams)})"
            },
            resourceHook: null,
            desc: '✅权限管理页-删除权限配置'
        },
        {
            actionId: 'selectRole',
            resourceType: 'sql',
            resourceData: {
                "table": "_role",
                "operation": "select"
            },
            resourceHook: null,
            desc: '✅权限管理页-查询角色'
        },
        {
            actionId: 'insertUser',
            resourceType: 'service',
            resourceData: {
                "service": "userManagement",
                "serviceFunction": "addUser"
            },
            resourceHook: null,
            desc: '✅权限管理页-添加用户'
        },
        {
            actionId: 'insertGroup',
            resourceType: 'sql',
            resourceData: {
                "table": "_group",
                "operation": "jhInsert"
            },
            resourceHook: null,
            desc: '✅权限管理页-添加群组'
        },
        {
            actionId: 'insertRole',
            resourceType: 'sql',
            resourceData: {
                "table": "_role",
                "operation": "jhInsert"
            },
            resourceHook: null,
            desc: '✅权限管理页-添加角色'
        },
        {
            actionId: 'deleteUser',
            resourceType: 'sql',
            resourceData: {
                "table": "_user",
                "operation": "jhDelete"
            },
            resourceHook: {
                "before": [],
                "after": [{
                    "service": "userGroupRoleManagement",
                    "serviceFunction": "deleteUserGroupRole"
                }]
            },
            desc: '✅权限管理页-删除用户'
        },
        {
            actionId: 'deleteGroup',
            resourceType: 'sql',
            resourceData: {
                "table": "_group",
                "operation": "jhDelete"
            },
            resourceHook: {
                "before": [],
                "after": [{
                    "service": "userGroupRoleManagement",
                    "serviceFunction": "deleteUserGroupRole"
                }]
            },
            desc: '✅权限管理页-删除群组'
        },
        {
            actionId: 'deleteRole',
            resourceType: 'sql',
            resourceData: {
                "table": "_role",
                "operation": "jhDelete"
            },
            resourceHook: {
                "before": [],
                "after": [{
                    "service": "userGroupRoleManagement",
                    "serviceFunction": "deleteUserGroupRole"
                }]
            },
            desc: '✅权限管理页-删除角色'
        },
        {
            actionId: 'updateUser',
            resourceType: 'sql',
            resourceData: {
                "table": "_user",
                "operation": "jhUpdate"
            },
            resourceHook: null,
            desc: '✅权限管理页-更新用户'
        },
        {
            actionId: 'updateGroup',
            resourceType: 'sql',
            resourceData: {
                "table": "_group",
                "operation": "jhUpdate"
            },
            resourceHook: null,
            desc: '✅权限管理页-更新群组'
        },
        {
            actionId: 'updateRole',
            resourceType: 'sql',
            resourceData: {
                "table": "_role",
                "operation": "jhUpdate"
            },
            resourceHook: null,
            desc: '✅权限管理页-更新角色'
        },
    ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
    headContent: [],
    pageContent: [
        {
            tag: 'v-col',
            colAttrs: { clos: 12 },
            cardAttrs: { class: 'rounded-lg elevation-0' },
            value: [
          /*html*/`

           <!--用户、组织、角色 切换抽屉 >>>>>>>>>>>>> -->
    <v-navigation-drawer app left width="270" style="z-index: 80" :style="{'top': isMobile ? 0 : '60px'}" v-model="showLeftMenu">
    <template v-slot:prepend>
      <v-tabs color="success" v-model="dataType">
        <v-tab class="pa-0">用户</v-tab>
        <v-tab class="pa-0">组织</v-tab>
        <v-tab class="pa-0">角色</v-tab>
      </v-tabs>
      <v-btn depressed block style="max-width: 180px; display: block; min-width: calc(100% - 24px)!important;" @click="doUiAction('startCreateDataTypeItem', null)" color="success ma-3 mb-0">
        添加新{{ dataTypeName }}
      </v-btn>
      <v-col>
        <v-text-field
          label="搜索" dense
          color="success"
          class="jh-v-input"
          placeholder="搜索"
          v-model="tabsSearchKeyword"
          prepend-inner-icon="mdi-text-search"
          filled single-line
        ></v-text-field>
      </v-col>
    </template>
    <template v-if="isDataTypeLoading">
      <div class="d-flex align-center justify-center mt-10">
        <v-progress-circular :size="20" indeterminate color="primary"></v-progress-circular>
        <span style="color: #999999;" class="pl-2">
          数据加载中
        </span>
      </div>
    </template>
    <v-list-item-group v-else v-model="currentItemIndex" mandatory dense color="success">
      <v-list-item
        v-for="item in dataTypeData"
        :key="item.value"
      >
        <v-list-item-content>
          <v-list-item-title class="d-flex">
            <span>{{ item.text }}({{ item.value }})</span>
            <v-spacer></v-spacer>
            <span v-if="isMobile" class="success--text" @click.stop="doUiAction('startUpdateDataTypeItem', item.data)">
              <v-icon color="success" :size="12">mdi-pencil-outline</v-icon>修改
            </span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-navigation-drawer>
  <!-- <<<<<<<<<<<<< 组织、角色、用户 切换抽屉 -->

  <!-- 头部内容 >>>>>>>>>>>>> -->
  <div class="jh-page-second-bar">
    <v-row class="align-center">
      <v-col cols="12" xs="12" sm="12" md="4" xl="3">
        <div class="py-4 text-body-1 font-weight-bold">用户、组织、角色
          <!-- 帮助页按钮 -->
          <span role="button" class="success--text font-weight-regular jh-font-size-13 ml-2" @click="isHelpPageDrawerShown = true">
            <v-icon size="13" class="success--text">mdi-help-circle-outline</v-icon>帮助
          </span>
        </div>
      </v-col>
    </v-row>
  </div>
  <!-- <<<<<<<<<<<<< 头部内容 -->

  <!-- 页面主要内容 -->
  <div class="jh-page-body-container">
    <v-btn
      color="success"
      class="ma-2 white--text"
      fab absolute right bottom
      style="bottom: 68px; z-index: 101"
      v-if="isMobile"
      @click="showLeftMenu = !showLeftMenu"
    >
      <v-icon dark>
        mdi-menu-open
      </v-icon>
    </v-btn>

    <!-- 页面内容 >>>>>>>>>>>>> -->

    <v-card class="rounded-lg">
      <!--表格 头部 >>>>>>>>>>>>> -->
      <v-row class="ma-0 py-0">
        <v-col :style="{maxWidth: 'calc(100% - ' + (isMobile ? 0 : 270) + 'px)'}" class="ma-0 pa-0">
          <!--中间表格 头部 >>>>>>>>>>>>> -->
          <v-row class="ma-0 pb-4 align-center">
            <v-btn color="success" dark small class="elevation-0 mr-2" @click="doUiAction('startCreateRelationDataItem', null)">新增</v-btn>
            <!--显示全部 开关 >>>>>>>>>>>>> -->
            <div class="mr-4">
              <v-switch
                class="ma-0 pa-0" color="success"
                v-model="isFullDataShown" label="显示全部"
                hide-details
                @change="doUiAction('getRelationDataList')"
              ></v-switch>
            </div>
            <v-spacer></v-spacer>
            <!--搜索过滤-->
            <v-col cols="12" xs="8" sm="4" md="6" xl="2" class="pa-0">
              <v-text-field color="success" v-model="searchInput" prefix="搜索：" class="jh-v-input" dense filled single-line></v-text-field>
            </v-col>
          </v-row>
          <!-- <<<<<<<<<<< 中间表格 头部 -->
          <!--中间表格 主体 >>>>>>>>>>>>> -->
          <v-data-table
            fixed-header
            :headers="relationDataTableHeader"
            :items="relationDataListFromBackend"
            :search="searchInput"
            :footer-props="{ itemsPerPageOptions: [20, 50, -1], itemsPerPageText: '每页行数', itemsPerPageAllText: '所有'}"
            :items-per-page="20"
            mobile-breakpoint="0"
            :loading="isTableLoading"
            :class="{'zebraLine': isTableZebraLineShown }"
            checkbox-color="success"
            class="jh-fixed-table-height elevation-0 mt-0 mb-xs-4">
            <!--角色ID-->
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
                <v-menu offset-y v-if="isMobile">
                  <template v-slot:activator="{ on, attrs }">
                    <span role="button" class="success--text font-weight-medium font-size-2"
                      v-bind="attrs" v-on="on">
                      操作<v-icon size="14" class="success--text">mdi-chevron-down</v-icon>
                    </span>
                  </template>
                  <v-list dense>
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
            <!--没有数据-->
            <template v-slot:loading>
              <div class="jh-no-data">数据加载中</div>
            </template>
            <template v-slot:no-data>
              <div class="jh-no-data">暂无数据</div>
            </template>
            <template v-slot:no-results>
              <div class="jh-no-data">暂无数据</div>
            </template>
            <!-- 表格分页 -->
            <template v-slot:footer.page-text="pagination">
              <span>{{ pagination.pageStart }}-{{ pagination.pageStop }}</span>
              <span class="ml-1">共{{ pagination.itemsLength }}条</span>
            </template>
          </v-data-table>
          <!-- <<<<<<<<<<< 中间表格 主体 -->
        </v-col>
        <!--右侧用户、组织、角色信息 >>>>>>>>>>>>> -->
        <v-col style="max-width: 270px; border-left: 1px solid #eee;" class="pa-0 pl-6 ml-3" v-if="!isMobile">
          <v-list-item-title style="font-size: 18px!important; font-weight: bold;" class="pt-3">{{ dataTypeName + '信息' }}</v-list-item-title>
          <v-form ref="formCurrentDataTypeDetail" lazy-validation>
            <!--右侧信息表单 >>>>>>>>>>>>> -->
            <v-list-item v-for="item of dataTypeFieldList" class="pl-0 pt-4 pr-0">
              <v-select
                v-if="item.type === 'select'"
                class="jh-v-input" dense filled single-line
                item-value="value"
                :label="item.text" v-model="currentDataTypeItem[item.value]"
                :rules="item.require == false ? validationRules.nullRules : validationRules.requireRules" :items="constantObj[item.value]"></v-select>
              <v-textarea
                v-else-if="item.type === 'textarea'" class="jh-v-input" dense filled single-line :label="item.text" v-model="currentDataTypeItem[item.value]"
                :rules="item.require == false ? validationRules.nullRules : validationRules.requireRules"></v-textarea>
              <v-text-field
                v-else class="jh-v-input" dense filled single-line :label="item.text" v-model="currentDataTypeItem[item.value]"
                :rules="item.require == false ? validationRules.nullRules : validationRules.requireRules"></v-text-field>
            </v-list-item>
            <!-- <<<<<<<<<<< 右侧信息表单 -->
            <!--右侧信息表单 操作按钮-->
            <v-row class="justify-end ma-0 py-2">
              <v-btn color="error" small @click="doUiAction('deleteCurrentDataTypeItem')" class="mr-4">删除</v-btn>
              <v-btn color="success" small @click="doUiAction('updateCurrentDataTypeItem')">修改</v-btn>
            </v-row>
          </v-form>
        </v-col>
        <!--修改当前数据（用户、组织、角色） >>>>>>>>>>>>> -->
        <v-dialog v-else v-model="isUpdateCurrentDataTypeDialog" width="800px">
          <v-card>
            <v-card-title class="text-h5  lighten-2  pt-6">
              {{ dataTypeName + '信息' }}
            </v-card-title>
            <v-card-text>
              <v-form ref="formCurrentDataTypeDetail" lazy-validation>
                <!--右侧信息表单 >>>>>>>>>>>>> -->
                <v-list-item v-for="item of dataTypeFieldList" class="pl-0 pt-4 pr-0">
                  <v-select
                    v-if="item.type === 'select'"
                    class="jh-v-input" dense filled single-line
                    item-value="value"
                    :label="item.text" v-model="currentDataTypeItem[item.value]"
                    :rules="item.require == false ? validationRules.nullRules : validationRules.requireRules" :items="constantObj[item.value]"></v-select>
                  <v-textarea
                    v-else-if="item.type === 'textarea'" class="jh-v-input" dense filled single-line :label="item.text" v-model="currentDataTypeItem[item.value]"
                    :rules="item.require == false ? validationRules.nullRules : validationRules.requireRules"></v-textarea>
                  <v-text-field
                    v-else class="jh-v-input" dense filled single-line :label="item.text" v-model="currentDataTypeItem[item.value]"
                    :rules="item.require == false ? validationRules.nullRules : validationRules.requireRules"></v-text-field>
                </v-list-item>
                <!-- <<<<<<<<<<< 右侧信息表单 -->
              </v-form>
            </v-card-text>
            <!--弹窗操作按钮 >>>>>>>>>>>>> -->
            <v-card-actions class="justify-end py-4">
              <v-btn color="success" small @click.stop="doUiAction('updateCurrentDataTypeItem')"> 保存</v-btn>
              <v-btn color="error" small @click.stop="doUiAction('deleteCurrentDataTypeItem')">删除</v-btn>
              <v-btn class="elevation-0 mr-2" small @click.stop="isUpdateCurrentDataTypeDialog = false">取消</v-btn>
            </v-card-actions>
            <!-- <<<<<<<<<<< 弹窗操作按钮 -->
          </v-card>
        </v-dialog>
        <!--<<<<<<<<<<< 添加新组织弹窗 -->
        <!-- <<<<<<<<<<< 右侧用户、组织、角色信息 -->
      </v-row>
    </v-card>
    <!-- 抽屉遮罩层 -->

    <!-- 新增relationData抽屉 >>>>>>>>>>>>> -->
    <v-navigation-drawer v-model="isRelationDataCreateDrawerShow" v-click-outside="drawerClickOutside" fixed temporary right width="80%" class="elevation-24">
      <v-form ref="createRelationDataForm" lazy-validation>
        <!-- 抽屉标题 -->
        <v-row no-gutters>
          <span class="text-h7 font-weight-bold pa-4">{{ currentOperation.title }}信息</span>
        </v-row>
        <v-divider class="jh-divider"></v-divider>
        <!-- 抽屉表单主体 -->
        <v-row class="mt-0 px-4">
          <v-col cols="12" sm="12" md="4">
            <span class="jh-input-label">UserID<span class="red--text text--accent-2 ml-1">*必填</span></span>
            <v-select class="jh-v-input" dense filled single-line clearable :rules="validationRules.requireRules" v-model="createRelationDataFormData.userId" :items="userListFromBackend"></v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <span class="jh-input-label">GroupID<span class="red--text text--accent-2 ml-1">*必填</span></span>
            <v-select class="jh-v-input" dense filled single-line clearable :rules="validationRules.requireRules" v-model="createRelationDataFormData.groupId" :items="groupListFromBackend"></v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <span class="jh-input-label">RoleId<span class="red--text text--accent-2 ml-1">*必填</span></span>
            <v-select class="jh-v-input" dense filled single-line clearable :rules="validationRules.requireRules" v-model="createRelationDataFormData.roleId" :items="roleListFromBackend"></v-select>
          </v-col>
        </v-row>
        <!-- 抽屉操作按钮 -->
        <v-row class="justify-end mx-0 my-8 px-4">
          <v-btn color="success" @click="doUiAction('createRelationDataItem')" small>保存</v-btn>
          <v-btn color="color" class="ml-2" @click="isRelationDataCreateDrawerShow = false" small>取消</v-btn>
        </v-row>
      </v-form>
      <!-- 抽屉的关闭按钮 -->
      <v-btn elevation="0" color="success" fab absolute top left small tile class="drawer-close-float-btn" @click="isRelationDataCreateDrawerShow = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-navigation-drawer>
    <!-- <<<<<<<<<<< 新增relationData抽屉 -->

    <!-- 编辑relationData抽屉 >>>>>>>>>>>>> -->
    <v-navigation-drawer v-model="isRelationDataUpdateDrawerShow" v-click-outside="drawerClickOutside" fixed temporary right width="80%" class="elevation-24">
      <v-form ref="updateRelationDataForm" lazy-validation>
        <!-- 抽屉标题 -->
        <v-row no-gutters>
          <span class="text-h7 font-weight-bold pa-4">{{ currentOperation.title }}信息</span>
        </v-row>
        <v-divider class="jh-divider"></v-divider>
        <!-- 抽屉表单主体 -->
        <v-row class="mt-0 px-4">
          <v-col cols="12" sm="12" md="4">
            <span class="jh-input-label">UserID<span class="red--text text--accent-2 ml-1">*必填</span></span>
            <v-select class="jh-v-input" dense filled single-line clearable :rules="validationRules.requireRules" v-model="updateRelationDataFormData.userId" :items="userListFromBackend"></v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <span class="jh-input-label">GroupID<span class="red--text text--accent-2 ml-1">*必填</span></span>
            <v-select class="jh-v-input" dense filled single-line clearable :rules="validationRules.requireRules" v-model="updateRelationDataFormData.groupId" :items="groupListFromBackend"></v-select>
          </v-col>
          <v-col cols="12" sm="12" md="4">
            <span class="jh-input-label">RoleId<span class="red--text text--accent-2 ml-1">*必填</span></span>
            <v-select class="jh-v-input" dense filled single-line clearable :rules="validationRules.requireRules" v-model="updateRelationDataFormData.roleId" :items="roleListFromBackend"></v-select>
          </v-col>
        </v-row>
        <!-- 抽屉操作按钮 -->
        <v-row class="justify-end mx-0 my-8 px-4">
          <v-btn color="success" @click="doUiAction('updateRelationDataItem')" small>保存</v-btn>
          <v-btn color="color" class="ml-2" @click="isRelationDataUpdateDrawerShow = false" small>取消</v-btn>
        </v-row>
      </v-form>
      <!-- 抽屉的关闭按钮 -->
      <v-btn elevation="0" color="success" fab absolute top left small tile class="drawer-close-float-btn" @click="isRelationDataUpdateDrawerShow = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-navigation-drawer>
    <!-- <<<<<<<<<<< 编辑relationData抽屉 -->

    <!--添加新用户弹窗 >>>>>>>>>>>>> -->
    <v-dialog v-model="isCreateUserDialogShow" width="800px">
      <v-card>
        <v-card-title class="text-h5  lighten-2  pt-6">
          添加新用户
        </v-card-title>
        <v-card-text>
          <v-form ref="userForm" lazy-validation>
            <!--新增用户表单 >>>>>>>>>>>>> -->
            <v-row v-if="dataType === 0">
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">用户ID<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense filled single-line label="用户ID" v-model="createUserData.userId" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">用户名<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense filled single-line label="用户名" v-model="createUserData.username" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">用户状态</span>
                <v-select class="jh-v-input" dense filled single-line clearable label="用户状态" v-model="createUserData.userStatus" :items="constantObj.userStatus"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">用户类型</span>
                <v-select class="jh-v-input" dense filled single-line clearable label="用户类型" v-model="createUserData.userType" :items="constantObj.userType"></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">初始密码<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense filled single-line label="初始密码" v-model="createUserData.clearTextPassword" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
            </v-row>
            <!-- <<<<<<<<<<< 新增用户表单 -->
          </v-form>
        </v-card-text>
        <!--弹窗操作按钮 >>>>>>>>>>>>> -->
        <v-card-actions class="justify-end py-4">
          <v-btn color="success" small @click="doUiAction('createUserItem')"> 保存</v-btn>
          <v-btn class="elevation-0 mr-2 ml-2" small @click="isCreateUserDialogShow = false">取消</v-btn>
        </v-card-actions>
        <!-- <<<<<<<<<<< 弹窗操作按钮 -->
      </v-card>
    </v-dialog>

    <!--添加新组织弹窗 >>>>>>>>>>>>> -->
    <v-dialog v-model="isCreateGroupDialogShown" width="800px">
      <v-card>
        <v-card-title class="text-h5  lighten-2  pt-6">
          添加新组织
        </v-card-title>

        <v-card-text>
          <v-form ref="groupForm" lazy-validation>
            <!--新增组织表单 >>>>>>>>>>>>> -->
            <v-row v-if="dataType === 1">
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">组织ID<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense filled single-line label="组织ID" v-model="createGroupData.groupId" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">组织名<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense filled single-line label="组织名" v-model="createGroupData.groupName" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">组织描述</span>
                <v-text-field class="jh-v-input" dense filled single-line label="组织描述" v-model="createGroupData.groupDesc"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">组织Logo</span>
                <v-text-field class="jh-v-input" dense filled single-line label="组织Logo" v-model="createGroupData.groupAvatar"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">拓展字段</span>
                <v-text-field class="jh-v-input" dense filled single-line label="拓展字段" v-model="createGroupData.groupExtend"></v-text-field>
              </v-col>
            </v-row>
            <!-- <<<<<<<<<<< 新增组织表单 -->
          </v-form>
        </v-card-text>
        <!--弹窗操作按钮 >>>>>>>>>>>>> -->
        <v-card-actions class="justify-end py-4">
          <v-btn color="success" small @click="doUiAction('createGroupItem')"> 保存</v-btn>
          <v-btn class="elevation-0 mr-2 ml-2" small @click="isCreateGroupDialogShown = false">取消</v-btn>
        </v-card-actions>
        <!-- <<<<<<<<<<< 弹窗操作按钮 -->
      </v-card>
    </v-dialog>

    <!--添加新角色弹窗 >>>>>>>>>>>>> -->
    <v-dialog v-model="isCreateRoleDialogShown" width="800px">
      <v-card>
        <v-card-title class="text-h5  lighten-2  pt-6">
          添加新角色
        </v-card-title>

        <v-card-text>
          <v-form ref="roleForm" lazy-validation>
            <!--新增角色表单 >>>>>>>>>>>>> -->
            <v-row v-if="dataType === 2">
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">角色ID<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense filled single-line label="角色ID" v-model="createRoleData.roleId" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">角色名<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense filled single-line label="角色名" v-model="createRoleData.roleName" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="4">
                <span class="jh-input-label">角色描述</span>
                <v-text-field class="jh-v-input" dense filled single-line label="角色描述" v-model="createRoleData.roleDesc"></v-text-field>
              </v-col>
            </v-row>
            <!-- <<<<<<<<<<< 新增角色表单 -->
          </v-form>
        </v-card-text>
        <!--弹窗操作按钮 >>>>>>>>>>>>> -->
        <v-card-actions class="justify-end py-4">
          <v-btn color="success" small @click="doUiAction('createRoleItem')"> 保存</v-btn>
          <v-btn class="elevation-0 mr-2 ml-2" small @click="isCreateRoleDialogShown = false">取消</v-btn>
        </v-card-actions>
        <!-- <<<<<<<<<<< 弹窗操作按钮 -->
      </v-card>
    </v-dialog>
    <!-- <<<<<<<<<<< 添加新 用户、组织、角色 弹窗 -->
  </div>

          `
            ],
        }
    ],
    actionContent: [

    ],
    includeList: [

    ], // { type: < js | css | html | vueComponent >, path: ''}
    common: {

        data: {
            isHelpPageDrawerShown: false,
            isTableZebraLineShown: true,
            // 表格相关数据
            isFullDataShown: false,
            // 左侧用户、组织、角色弹窗状态
            isCreateUserDialogShow: false,
            isCreateGroupDialogShown: false,
            isCreateRoleDialogShown: false,
            dataType: 0, // 数据类型，0：用户，1：组织，2：角色
            currentItemIndex: 0,
            showLeftMenu: 'window.innerWidth > 600',
            validationRules: {
                requireRules: [v => !!v || 'This is required'],
                nullRules: [v => true],
            },
            tabsSearchKeyword: null,
            constantObj: {
                userStatus: [{ value: 'active', text: '活跃' }, { value: 'banned', text: '关闭' }],
                userType: [{ value: 'common', text: '管理员' }, { value: 'staff', text: '职工' }, { value: 'teacher', text: '老师' }, { value: 'student', text: '学员' }],
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
                { text: "用户Id", value: "userId", width: 120 },
                { text: "组织ID", value: "groupId", width: 120 },
                { text: "角色ID", value: "roleId", width: 120 },
                { text: "操作人", value: "operationByUser", width: 120 },
                { text: "操作时间", value: "operationAt", width: 250 },
                { text: '操作', value: 'action', align: 'center', sortable: false, width: 120, class: 'fixed', cellClass: 'fixed' },
            ],

            userKeys: [
                { text: "用户Id", value: "userId" },
                { text: "用户名", value: "username" },
                { text: "用户账号状态", value: "userStatus", type: 'select' },
                { text: "用户类型", value: "userType", type: 'select' },
            ],

            groupKeys: [
                { text: "组织Id", value: "groupId" },
                { text: "组织名", value: "groupName" },
                { text: "组织描述", value: "groupDesc", require: false },
                { text: "组织Logo", value: "groupAvatar", require: false },
                { text: "拓展字段", value: "groupExtend", type: 'textarea', require: false },
            ],
            roleKeys: [
                { text: "角色ID", value: "roleId" },
                { text: "角色名", value: "roleName" },
                { text: "角色描述", value: "roleDesc", require: false },
            ],
            currentOperation: { title: '新增', action: 'add' },
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
                        console.error("[doUiAction] uiActionId not find", { uiActionId });
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
                            pageId: 'userGroupRoleManagement',
                            actionId: 'selectGroup'
                        }
                    }
                });
                this.groupListFromBackend = result.data.appData.resultData.rows.map((group) => {
                    return { value: group.groupId, text: group.groupName, data: group }
                });
            },
            // description: ✅获取角色数据
            async getRoleList() {
                const result = await window.jianghuAxios({
                    data: {
                        appData: {
                            pageId: 'userGroupRoleManagement',
                            actionId: 'selectRole'
                        }
                    }
                });
                this.roleListFromBackend = result.data.appData.resultData.rows.map((role) => {
                    return { value: role.roleId, text: role.roleName, data: role }
                })
            },
            // description: ✅获取用户数据
            async getUserList() {
                const result = await window.jianghuAxios({
                    data: {
                        appData: {
                            pageId: 'userGroupRoleManagement',
                            actionId: 'selectUser'
                        }
                    }
                });
                this.userListFromBackend = result.data.appData.resultData.rows.map((user) => {
                    return { value: user.userId, text: user.username, data: user }
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
                    where = { [key]: currentDataTypeData.value }
                }
                const result = await window.jianghuAxios({
                    data: {
                        appData: {
                            pageId: 'userGroupRoleManagement',
                            actionId: 'selectItemList',
                            where: where
                        }
                    }
                });
                this.relationDataListFromBackend = result.data.appData.resultData.rows;
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
                if (await window.confirmDialog({ title: "新增", content: "确定新增吗？" }) === false) {
                    throw new Error("[confirmCreateFormDialog] 否");
                }
            },

            // description: ✅新增关系数据resource
            async doCreateRelationDataItem() {
                await window.vtoast.loading("保存中");
                const { userId, groupId, roleId } = this.createRelationDataFormData;
                await window.jianghuAxios({
                    data: {
                        appData: {
                            pageId: 'userGroupRoleManagement',
                            actionId: 'insertItem',
                            actionData: { userId, groupId, roleId }
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
                if (await window.confirmDialog({ title: "修改", content: "确定修改吗？" }) === false) {
                    throw new Error("[confirmUpdateItemDialog] 否");
                }
            },

            // description: ✅更新关系数据resource
            async doUpdateRelationDataItem() {
                await window.vtoast.loading("保存中");
                const id = this.updateRelationDataFormData.id;
                const { userId, groupId, roleId } = this.updateRelationDataFormData;
                await window.jianghuAxios({
                    data: {
                        appData: {
                            pageId: 'userGroupRoleManagement',
                            actionId: 'updateItem',
                            actionData: { userId, groupId, roleId },
                            where: { id: id }
                        }
                    }
                });
                await window.vtoast.success("修改成功");
            },

            // description: ✅删除关系数据弹窗确认
            async confirmDeleteItemDialog() {
                if (await window.confirmDialog({ title: "删除", content: "确定删除吗？" }) === false) {
                    throw new Error("[confirmDeleteItemDialog] 否");
                }
            },
            // description: ✅删除用户组织角色关系数据resource
            async doDeleteRelationDataItem({ id }) {
                window.vtoast.loading('正在删除')
                await window.jianghuAxios({
                    data: {
                        appData: {
                            pageId: 'userGroupRoleManagement',
                            actionId: 'deleteItem',
                            where: { id }
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
                            pageId: 'userGroupRoleManagement',
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
                            pageId: 'userGroupRoleManagement',
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
                            pageId: 'userGroupRoleManagement',
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
                if (await window.confirmDialog({ title: `确认删除该${this.dataTypeName}？` }) === false) {
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
                        where = { userId: this.currentDataTypeItem['userId'] };
                        break;
                    case 1:
                        actionId = 'deleteGroup';
                        whereKey = 'groupId';
                        where = { groupId: this.currentDataTypeItem['groupId'] };
                        break;
                    case 2:
                        actionId = 'deleteRole';
                        whereKey = 'roleId';
                        where = { roleId: this.currentDataTypeItem['roleId'] };
                        break;
                }
                if (where[whereKey]) {
                    window.vtoast.loading("删除中");
                    await window.jianghuAxios({
                        data: {
                            appData: {
                                pageId: 'userGroupRoleManagement',
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
                const { id, userId, ...updateItem } = this.currentDataTypeItem;
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
                            pageId: 'userGroupRoleManagement',
                            actionId: actionId,
                            actionData: updateItem,
                            where: { id }
                        }
                    }
                })
                window.vtoast.success("保存成功");
            }
        }
    },
    style: `
    @media (min-width: 600px) {

      .v-application .px-sm-8 {
          padding-right: 12px !important;
          padding-left: 12px !important;
      }
    }
  `

};

module.exports = content;
