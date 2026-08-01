/* eslint-disable */



const relationDataCreateDrawerBody = /*html*/`
      <div class="jh-drawer-body-scroll px-4 py-4">
        <v-form ref="createRelationDataForm" lazy-validation>
          <v-row class="mt-0">
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
        </v-form>
      </div>`;

const relationDataUpdateDrawerBody = /*html*/`
      <div class="jh-drawer-body-scroll px-4 py-4">
        <v-form ref="updateRelationDataForm" lazy-validation>
          <v-row class="mt-0">
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
        </v-form>
      </div>`;

const permissionDrawerTitleRightSlot = /*html*/`
      <template v-slot:title-right>
        <!-- 高亮显示当前授权对象类型 -->
        <v-chip small label color="primary" class="mx-2">{{ permissionTargetTypeLabel }}</v-chip>
        <span class="ugr-section-desc">{{ permissionTargetLabel }}</span>
      </template>`;

const permissionDrawerBody = /*html*/`
      <div class="d-flex flex-column permission-drawer jh-drawer-body-scroll">
        <div class="ugr-permission-header">
          <v-alert dense text type="info" class="ugr-alert-compact mb-2">
            页面节点控制是否允许进入页面；展开后的操作节点控制对应 resource 请求权限。“全部操作（含未来新增）”是独立通配权限，不会被批量选择自动勾选。
          </v-alert>
          <v-alert v-if="inheritedPermissionNodeIdList.length" dense text type="primary" class="ugr-alert-compact mb-2">
            已有 {{ inheritedPermissionNodeIdList.length }} 项权限由公开/登录规则继承。复选框只表示当前对象的直接授权；可重复勾选继承项，便于后续收回上级权限时继续保留。
          </v-alert>
          <v-alert v-if="deniedPermissionNodeIdList.length" dense text type="warning" class="ugr-alert-compact mb-2">
            当前对象还有 {{ deniedPermissionNodeIdList.length }} 项 deny 规则；deny 优先，且本页面保存时不会修改这些规则。
          </v-alert>
          <v-text-field
            v-model="permissionSearch"
            dense filled single-line clearable hide-details
            class="jh-v-input"
            prepend-inner-icon="mdi-magnify"
            placeholder="搜索页面、操作名称或 actionId"
          ></v-text-field>
          <div class="d-flex align-center mt-3 flex-wrap ugr-permission-toolbar">
            <v-chip small color="primary" outlined class="ugr-chip mr-2 mb-1">直接页面 {{ selectedPagePermissionCount }}</v-chip>
            <v-chip small color="primary" outlined class="ugr-chip mr-2 mb-1">直接操作 {{ selectedResourcePermissionCount }}</v-chip>
            <v-chip v-if="inheritedPermissionNodeIdList.length" small color="grey" outlined class="ugr-chip mr-2 mb-1">继承 {{ inheritedPermissionNodeIdList.length }}</v-chip>
            <v-spacer></v-spacer>
            <v-btn v-permission="'updateTargetPermission'" text small color="primary" class="ugr-text-btn" @click="doUiAction('selectAllPermission')">全部选择</v-btn>
            <v-btn v-permission="'updateTargetPermission'" text small color="grey darken-1" class="ugr-text-btn" @click="doUiAction('clearAllPermission')">清空直接权限</v-btn>
          </div>
        </div>
        <v-divider></v-divider>

        <div class="permission-tree-container ugr-permission-tree">
          <div v-if="isPermissionLoading" class="d-flex align-center justify-center py-12">
            <v-progress-circular :size="24" indeterminate color="primary"></v-progress-circular>
            <span class="ugr-muted-text ml-3">权限加载中</span>
          </div>
          <v-treeview
            v-else
            :value="selectedPermissionNodeIdList"
            @input="handlePermissionSelectionChange"
            :items="permissionTree"
            :open.sync="openedPermissionNodeIdList"
            :search="permissionSearch"
            item-key="id"
            item-text="name"
            item-children="children"
            item-disabled="disabled"
            selectable
            selection-type="independent"
            open-on-click
            hoverable
            dense
          >
            <template v-slot:prepend="{ item, open }">
              <v-icon v-if="item.type === 'page'" color="primary" size="19">
                {{ open ? 'mdi-folder-open-outline' : 'mdi-folder-outline' }}
              </v-icon>
              <v-icon v-else-if="item.type === 'resourceWildcard'" color="warning" size="17">mdi-asterisk</v-icon>
              <v-icon v-else color="primary" size="17">mdi-api</v-icon>
            </template>
            <template v-slot:label="{ item }">
              <div class="d-flex align-center permission-tree-label">
                <span>{{ item.name }}</span>
                <span v-if="item.code" class="ugr-tree-code ml-2">{{ item.code }}</span>
                <v-chip v-if="item.isWildcard" x-small outlined color="warning" class="ugr-chip ml-2">通配</v-chip>
                <v-chip
                  v-if="inheritedPermissionSourceMap[item.id]"
                  x-small
                  outlined
                  :color="isDirectPermissionSelected(item.id) ? 'primary' : 'grey'"
                  class="ugr-chip ml-2"
                >
                  {{ isDirectPermissionSelected(item.id) ? '直接 + 继承' : '仅继承' }}: {{ getInheritedPermissionLabel(item.id) }}
                </v-chip>
              </div>
            </template>
            <template v-slot:append="{ item }">
              <v-btn
                v-if="item.type === 'page' && item.children && item.children.length && !item.disabled"
                v-permission="'updateTargetPermission'"
                text x-small color="primary"
                @click.stop="doUiAction('togglePageAllPermission', item)"
              >
                {{ isPageAllPermissionSelected(item) ? '取消本页' : '选择本页全部' }}
              </v-btn>
            </template>
          </v-treeview>
          <div v-if="!isPermissionLoading && permissionTree.length === 0" class="jh-no-data py-12">暂无页面与资源数据</div>
        </div>
      </div>`;

const createUserDrawerBody = /*html*/`
      <div class="jh-drawer-body-scroll px-4 py-4">
          <v-form ref="userForm" lazy-validation>
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
                <span class="jh-input-label">初始密码<span class="red--text text--accent-2 ml-1">*必填</span></span>
                <v-text-field class="jh-v-input" dense filled single-line label="初始密码" v-model="createUserData.clearTextPassword" :rules="validationRules.requireRules"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
      </div>`;

const createGroupDrawerBody = /*html*/`
      <div class="jh-drawer-body-scroll px-4 py-4">
          <v-form ref="groupForm" lazy-validation>
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
          </v-form>
      </div>`;

const createRoleDrawerBody = /*html*/`
      <div class="jh-drawer-body-scroll px-4 py-4">
          <v-form ref="roleForm" lazy-validation>
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
          </v-form>
      </div>`;


const content = {
  version: 'v7',
  pageType: 'jh-page',
  page: {
    id: 'userGroupRole',
    name: '用户权限管理',
    targets: 'pc',
  },
  resourceList: [
    {
      actionId: "selectItemList",
      desc: "✅查询已配置权限列表",
      resourceType: "sql",
      resourceData: { table: "_user_group_role", operation: "select" }
    },
    {
      actionId: "selectUser",
      desc: "✅查询用户",
      resourceType: "sql",
      resourceData: { table: "_user", operation: "select" }
    },
    {
      actionId: "selectGroup",
      desc: "✅查询群组",
      resourceType: "sql",
      resourceData: { table: "_group", operation: "select" }
    },
    {
      actionId: "insertItem",
      desc: "✅创建权限配置",
      resourceType: "sql",
      resourceData: { table: "_user_group_role", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      desc: "✅更新权限配置",
      resourceType: "sql",
      resourceData: { table: "_user_group_role", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      desc: "✅删除权限配置",
      resourceType: "sql",
      resourceData: { table: "_user_group_role", operation: "jhDelete" }
    },
    {
      actionId: "selectRole",
      desc: "✅查询角色",
      resourceType: "sql",
      resourceData: { table: "_role", operation: "select" }
    },
    {
      actionId: "insertUser",
      desc: "✅添加用户",
      resourceType: "service",
      resourceData: { service: "userManagement", serviceFunction: "addUser" }
    },
    {
      actionId: "insertGroup",
      desc: "✅添加群组",
      resourceType: "sql",
      resourceData: { table: "_group", operation: "jhInsert" }
    },
    {
      actionId: "insertRole",
      desc: "✅添加角色",
      resourceType: "sql",
      resourceData: { table: "_role", operation: "jhInsert" }
    },
    {
      actionId: "deleteUser",
      desc: "✅删除用户",
      resourceType: "sql",
      resourceData: { table: "_user", operation: "jhDelete" }
    },
    {
      actionId: "deleteGroup",
      desc: "✅删除群组",
      resourceType: "sql",
      resourceData: { table: "_group", operation: "jhDelete" }
    },
    {
      actionId: "deleteRole",
      desc: "✅删除角色",
      resourceType: "sql",
      resourceData: { table: "_role", operation: "jhDelete" }
    },
    {
      actionId: "updateUser",
      desc: "✅更新用户",
      resourceType: "sql",
      resourceData: { table: "_user", operation: "jhUpdate" }
    },
    {
      actionId: "updateGroup",
      desc: "✅更新群组",
      resourceType: "sql",
      resourceData: { table: "_group", operation: "jhUpdate" }
    },
    {
      actionId: "updateRole",
      desc: "✅更新角色",
      resourceType: "sql",
      resourceData: { table: "_role", operation: "jhUpdate" }
    },
    {
      actionId: "selectTargetPermission",
      desc: "✅查询目标页面与资源权限",
      resourceType: "service",
      resourceData: { service: "userGroupRole", serviceFunction: "selectTargetPermission" }
    },
    {
      actionId: "updateTargetPermission",
      desc: "✅保存目标页面与资源权限",
      resourceType: "service",
      resourceData: { service: "userGroupRole", serviceFunction: "updateTargetPermission" }
    }
  ],
  includeList: [
    { type: 'html', path: 'common/jianghuJs/fixedTableHeightV4.html' }
  ],
  headContent: [

  ],
  pageContent: {
    component: 'Box',
    children: [
    /*html*/`
    <!-- 用户、组织、角色 切换抽屉 >>>>>>>>>>>>> -->
    <v-navigation-drawer app left width="270" class="ugr-left-drawer" style="z-index: 80" :style="{'top': isMobile ? 0 : '53px'}" v-model="showLeftMenu">
    <template v-slot:prepend>
      <div class="ugr-left-drawer__prepend">
      <v-tabs color="primary" v-model="dataType" class="ugr-left-drawer__tabs">
        <v-tab>用户</v-tab>
        <v-tab>组织</v-tab>
        <!-- <v-tab>角色</v-tab> -->
      </v-tabs>
      <v-btn
        v-if="isDataTypeCreateEnabled"
        v-permission="currentDataTypeCreatePermission"
        depressed block class="ugr-left-drawer__create-btn"
        @click="doUiAction('startCreateDataTypeItem', null)" color="primary"
      >
        添加新{{ dataTypeName }}
      </v-btn>
      <div class="ugr-left-drawer__search">
        <v-text-field
          label="搜索" dense
          color="primary"
          class="jh-v-input"
          placeholder="搜索"
          v-model="tabsSearchKeyword"
          prepend-inner-icon="mdi-text-search"
          filled single-line hide-details
        ></v-text-field>
      </div>
      </div>
    </template>
    <template v-if="isDataTypeLoading">
      <div class="ugr-empty-state d-flex align-center justify-center">
        <v-progress-circular :size="20" indeterminate color="primary"></v-progress-circular>
        <span class="ugr-muted-text pl-2">数据加载中</span>
      </div>
    </template>
    <v-list-item-group v-else v-model="currentItemIndex" mandatory dense color="primary" class="ugr-left-drawer__list">
      <v-list-item
        v-for="item in dataTypeData"
        :key="item.value"
        class="ugr-left-drawer__list-item"
      >
        <v-list-item-content class="py-2">
          <v-list-item-title class="ugr-list-item-title">
            <span class="ugr-list-item-name">{{ item.text }}</span>
            <span class="ugr-list-item-code">({{ item.value }})</span>
          </v-list-item-title>
          <div class="ugr-list-item-actions mt-1">
            <span
              v-if="isDataTypeEditEnabled"
              v-permission="currentDataTypeUpdatePermission"
              role="button" class="ugr-table-action primary--text mr-2"
              @click.stop="doUiAction('startUpdateDataTypeItem', item.data)"
            >
              <v-icon color="primary" :size="13">mdi-pencil-outline</v-icon>编辑
            </span>
            <span v-permission="'selectTargetPermission'" role="button" class="ugr-table-action primary--text mr-2" @click.stop="doUiAction('startDataTypeItemPermission', item.data)">
              <v-icon color="primary" :size="13">mdi-shield-key-outline</v-icon>权限
            </span>
            <span
              v-if="isDataTypeEditEnabled"
              v-permission="currentDataTypeDeletePermission"
              role="button" class="ugr-table-action red--text text--accent-2"
              @click.stop="doUiAction('deleteDataTypeItemFromList', item.data)"
            >
              <v-icon color="red" :size="13">mdi-trash-can-outline</v-icon>删除
            </span>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-navigation-drawer>
  <!-- <<<<<<<<<<<<< 组织、角色、用户 切换抽屉 -->

  <div class="flex-1 user-group-role-main" :style="!isMobile && showLeftMenu ? { marginLeft: '270px' } : null">
  <!-- 头部内容 >>>>>>>>>>>>> -->
  <div class="jh-page-second-bar ugr-page-header">
    <v-row class="align-center ma-0">
      <v-col cols="12" sm="12" md="4" xl="3" class="py-0 px-0">
        <div class="ugr-page-title">
          用户、组织、角色
          <!-- <span role="button" class="ugr-page-help primary--text ml-2" @click="isHelpPageDrawerShown = true">
            <v-icon size="14" class="primary--text">mdi-help-circle-outline</v-icon>帮助
          </span> -->
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="8" xl="9" class="d-flex justify-end flex-wrap py-0 ugr-header-actions">
        <v-btn v-permission="'selectTargetPermission'" small outlined color="warning" class="ugr-header-btn" @click="doUiAction('startPublicTargetPermission')">
          <v-icon left size="16">mdi-earth</v-icon>公开权限
        </v-btn>
        <v-btn v-permission="'selectTargetPermission'" small outlined color="info" class="ugr-header-btn" @click="doUiAction('startLoginTargetPermission')">
          <v-icon left size="16">mdi-login</v-icon>登录权限
        </v-btn>
      </v-col>
    </v-row>
  </div>
  <!-- <<<<<<<<<<<<< 头部内容 -->

  <!-- 页面主要内容 -->
  <div class="ugr-page-body">
    <v-btn
      color="primary"
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

    <div class="ugr-main-card rounded-lg elevation-0">
      <!-- 表格 头部 >>>>>>>>>>>>> -->
      <v-row class="ma-0">
        <v-col cols="12" class="ma-0 pa-0 ugr-section-main">
          <!-- 中间表格 头部 >>>>>>>>>>>>> -->
          <div class="ugr-section-head px-0 pt-0">
            <div class="ugr-section-title">{{ relationPanelMeta.title }}</div>
            <div class="ugr-section-desc">{{ relationPanelMeta.description }}</div>
          </div>
          <v-row class="ma-0 ugr-section-toolbar align-center px-0">
            <v-btn
              v-if="isRelationCreateEnabled"
              v-permission="'insertItem'"
              color="primary" dark small class="elevation-0"
              @click="doUiAction('startCreateRelationDataItem', null)"
            >{{ relationPanelMeta.createLabel }}</v-btn>
            <div class="ugr-switch-wrap">
              <v-switch
                class="ma-0 pa-0 ugr-switch" color="primary"
                v-model="isFullDataShown" :label="relationPanelMeta.filterLabel"
                hide-details dense
                @change="doUiAction('getRelationDataList')"
              ></v-switch>
            </div>
            <v-spacer></v-spacer>
            <v-col cols="12" xs="8" sm="4" md="5" xl="3" class="pa-0 ugr-search-field">
              <v-text-field color="primary" v-model="searchInput" placeholder="搜索表格" class="jh-v-input" dense filled single-line hide-details prepend-inner-icon="mdi-magnify"></v-text-field>
            </v-col>
          </v-row>
          <!-- <<<<<<<<<<< 中间表格 头部 -->
          <!-- 中间表格 主体 >>>>>>>>>>>>> -->
          <v-data-table
            fixed-header
            :headers="relationDataTableHeaderComputed"
            :items="relationDataListFromBackend"
            :search="searchInput"
            :footer-props="{ itemsPerPageOptions: [20, 50, -1], itemsPerPageText: '每页行数', itemsPerPageAllText: '所有'}"
            :items-per-page="20"
            mobile-breakpoint="0"
            :loading="isTableLoading"
            :class="{'zebraLine': isTableZebraLineShown }"
            checkbox-color="primary"
            class="ugr-data-table jh-fixed-table-height elevation-0">
            <!-- 角色ID -->
            <template v-slot:item.roleId="{ item }">
              {{ (roleListFromBackend.find(({value}) => value === item.roleId) || {}).text || item.roleId }}
            </template>
            <!-- 用户ID -->
            <template v-slot:item.userId="{ item }">
              {{ (userListFromBackend.find(({value}) => value === item.userId) || {}).text || item.userId }}
            </template>
            <!-- 组织ID -->
            <template v-slot:item.groupId="{ item }">
              {{ (groupListFromBackend.find(({value}) => value === item.groupId) || {}).text || item.groupId }}
            </template>
            <!-- 表格行操作按钮 -->
            <template v-slot:item.action="{ item }">
              <template>
                <!-- pc端 -->
                <template v-if="!isMobile">
                  <span
                    v-if="isRelationEditEnabled"
                    v-permission="'updateItem'"
                    role="button" class="ugr-table-action primary--text mr-3"
                    @click="doUiAction('startUpdateRelationDataItem', item)"
                  >
                    <v-icon size="15" class="primary--text">mdi-note-edit-outline</v-icon>修改
                  </span>
                  <span v-permission="'selectTargetPermission'" role="button" class="ugr-table-action primary--text mr-3" @click="doUiAction('startTargetPermission', { targetType: 'groupRole', item })">
                    <v-icon size="15" class="primary--text">mdi-shield-key-outline</v-icon>组内角色权限
                  </span>
                  <span
                    v-if="isRelationDeleteEnabled"
                    v-permission="'deleteItem'"
                    role="button" class="ugr-table-action red--text text--accent-2"
                    @click="doUiAction('deleteRelationDataItem', item)"
                  >
                    <v-icon size="15" class="red--text text--accent-2">mdi-trash-can-outline</v-icon>删除
                  </span>
                </template>
                <!-- 手机端 -->
                <v-menu offset-y v-if="isMobile">
                  <template v-slot:activator="{ on, attrs }">
                    <span role="button" class="ugr-table-action primary--text"
                      v-bind="attrs" v-on="on">
                      操作<v-icon size="14" class="primary--text">mdi-chevron-down</v-icon>
                    </span>
                  </template>
                  <v-list dense>
                    <v-list-item v-if="isRelationEditEnabled" v-permission="'updateItem'" @click="doUiAction('startUpdateRelationDataItem', item)">
                      <v-list-item-title>修改</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-permission="'selectTargetPermission'" @click="doUiAction('startTargetPermission', { targetType: 'groupRole', item })">
                      <v-list-item-title>组内角色权限</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="isRelationDeleteEnabled" v-permission="'deleteItem'" @click="doUiAction('deleteRelationDataItem', item)">
                      <v-list-item-title>删除</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </template>
            <!-- 没有数据 -->
            <template v-slot:loading>
              <div class="jh-no-data">数据加载中</div>
            </template>
            <template v-slot:no-data>
              <div class="jh-no-data">{{ relationPanelMeta.emptyText }}</div>
            </template>
            <template v-slot:no-results>
              <div class="jh-no-data">{{ relationPanelMeta.emptyText }}</div>
            </template>
            <!-- 表格分页 -->
            <template v-slot:footer.page-text="pagination">
              <span>{{ pagination.pageStart }}-{{ pagination.pageStop }}</span>
              <span class="ml-1">共{{ pagination.itemsLength }}条</span>
            </template>
          </v-data-table>
          <!-- <<<<<<<<<<< 中间表格 主体 -->
        </v-col>
      </v-row>
    </div>
  </div>
  </div>
  `
    ],
  },
  actionContent: [
    {
      component: 'FormDrawer',
      key: 'currentDataType',
      props: {
        titleBind: "dataTypeName + '信息'",
        width: '800px',
        formKey: 'currentDataType',
        fieldList: 'currentDataTypeFormFieldList',
        cols: 2,
        labelMode: 'above',
        actionList: 'currentDataTypeDrawerActionList',
        scope: '$data',
      },
      attrs: {
        '@field-change': 'handleCurrentDataTypeFieldChange',
      },
    },
    {
      component: 'Drawer',
      key: 'relationDataCreate',
      props: {
        title: '新增归属关系',
        width: '80%',
        actionList: 'relationCreateDrawerActionList',
      },
      attrs: { class: 'ugr-relation-drawer' },
      children: [ relationDataCreateDrawerBody ],
    },
    {
      component: 'Drawer',
      key: 'relationDataUpdate',
      props: {
        title: '编辑归属关系',
        width: '80%',
        actionList: 'relationUpdateDrawerActionList',
      },
      attrs: { class: 'ugr-relation-drawer' },
      children: [ relationDataUpdateDrawerBody ],
    },
    {
      component: 'Drawer',
      key: 'permission',
      props: {
        title: '配置权限',
        width: 'min(760px, 92vw)',
        actionList: 'permissionDrawerActionList',
      },
      attrs: { class: 'permission-drawer' },
      children: [ permissionDrawerTitleRightSlot, permissionDrawerBody ],
    },
    {
      component: 'Drawer',
      key: 'createUser',
      props: {
        title: '添加新用户',
        width: '800px',
        actionList: 'createUserDrawerActionList',
      },
      children: [ createUserDrawerBody ],
    },
    {
      component: 'Drawer',
      key: 'createGroup',
      props: {
        title: '添加新组织',
        width: '800px',
        actionList: 'createGroupDrawerActionList',
      },
      children: [ createGroupDrawerBody ],
    },
    {
      component: 'Drawer',
      key: 'createRole',
      props: {
        title: '添加新角色',
        width: '800px',
        actionList: 'createRoleDrawerActionList',
      },
      children: [ createRoleDrawerBody ],
    },
  ],
  common: {
    data: {
      pageFeatures: {
        user: { enableCreate: true, enableEdit: true },
        group: { enableCreate: true, enableEdit: true },
        role: { enableCreate: true, enableEdit: true },
        /** 中间「组织·角色归属」表格：分配 / 修改 / 删除 */
        relation: { enableCreate: true, enableEdit: true, enableDelete: true },
      },
      isHelpPageDrawerShown: false,
      isTableZebraLineShown: true,
      // 表格相关数据
      isFullDataShown: false,
      // 用户、组织、角色编辑抽屉状态
      isCreateUserDrawerShown: false,
      isCreateGroupDrawerShown: false,
      isCreateRoleDrawerShown: false,
      dataType: 1, // 数据类型，0：用户，1：组织，2：角色
      currentItemIndex: 1,
      validationRules: {
        requireRules: [v => !!v || 'This is required'],
        nullRules: [v => true],
      },
      tabsSearchKeyword: null,
      constantObj: {
        userStatus: [{ value: 'active', text: '活跃' }, { value: 'banned', text: '关闭' }],
        userType: [{ value: 'common', text: '管理员' }, { value: 'staff', text: '职工' }, { value: 'teacher', text: '老师' }, { value: 'student', text: '学员' }],
      },
      isRelationDataCreateDrawerShown: false,
      isRelationDataUpdateDrawerShown: false,
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
      isCurrentDataTypeDrawerShown: false,
      // 页面与资源权限
      isPermissionDrawerShown: false,
      isPermissionLoading: false,
      isPermissionSaving: false,
      permissionSearch: null,
      permissionTarget: {},
      permissionTargetType: '',
      permissionTargetLabel: '',
      permissionTree: [],
      selectedPermissionNodeIdList: [],
      inheritedPermissionNodeIdList: [],
      inheritedPermissionSourceMap: {},
      deniedPermissionNodeIdList: [],
      openedPermissionNodeIdList: [],

      relationDataTableHeader: [
        { text: "用户Id", value: "userId", width: 120 },
        { text: "组织ID", value: "groupId", width: 120 },
        { text: "角色ID", value: "roleId", width: 120 },
        { text: "操作人", value: "operationByUser", width: 90 },
        { text: "操作时间", value: "operationAt", width: 150 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: 'window.innerWidth < 500 ? 80 : 200', class: 'fixed', cellClass: 'fixed' },
      ],

      userKeys: [
        { text: "用户Id", value: "userId" },
        { text: "用户名", value: "username" },
        { text: "用户账号状态", value: "userStatus", type: 'select' },
        // { text: "用户类型", value: "userType", type: 'select' },
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
      formSubmitAction: '',
      dataTypeData: []
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500',
      showLeftMenu: 'window.innerWidth > 600',
    },
    computed: {
      dataTypeName() {
        return [ '用户', '组织', '角色' ][this.dataType] || '用户';
      },
      dataTypeFieldList() {
        if (this.dataType === 1) return this.groupKeys;
        if (this.dataType === 2) return this.roleKeys;
        return this.userKeys;
      },
      permissionTargetTypeLabel() {
        const labelMap = {
          public: '公开',
          login: '登录',
          user: '用户',
          group: '组织',
          role: '角色',
          groupRole: '组内角色',
        };
        return labelMap[this.permissionTargetType] || '';
      },
      currentPageFeature() {
        const key = ['user', 'group', 'role'][this.dataType];
        const config = (this.pageFeatures && this.pageFeatures[key]) || {};
        return {
          enableCreate: config.enableCreate !== false,
          enableEdit: config.enableEdit !== false,
        };
      },
      isDataTypeCreateEnabled() {
        return this.currentPageFeature.enableCreate;
      },
      isDataTypeEditEnabled() {
        return this.currentPageFeature.enableEdit;
      },
      relationPageFeature() {
        const config = (this.pageFeatures && this.pageFeatures.relation) || {};
        return {
          enableCreate: config.enableCreate !== false,
          enableEdit: config.enableEdit !== false,
          enableDelete: config.enableDelete !== false,
        };
      },
      isRelationCreateEnabled() {
        return this.relationPageFeature.enableCreate;
      },
      isRelationEditEnabled() {
        return this.relationPageFeature.enableEdit;
      },
      isRelationDeleteEnabled() {
        return this.relationPageFeature.enableDelete;
      },
      currentDataTypeCreatePermission() {
        return [ 'insertUser', 'insertGroup', 'insertRole' ][this.dataType] || '';
      },
      currentDataTypeUpdatePermission() {
        return [ 'updateUser', 'updateGroup', 'updateRole' ][this.dataType] || '';
      },
      currentDataTypeDeletePermission() {
        return [ 'deleteUser', 'deleteGroup', 'deleteRole' ][this.dataType] || '';
      },
      currentDataTypeFormFieldList() {
        return (this.dataTypeFieldList || []).map(item => ({
          key: item.value,
          label: item.text,
          type: item.type || 'text',
          required: item.require !== false,
          options: item.type === 'select'
            ? ((this.constantObj && this.constantObj[item.value]) || [])
            : undefined,
        }));
      },
      canUpdateTargetPermission() {
        return !!(
          window.jhPermissionUtil
          && window.jhPermissionUtil.hasPermission('updateTargetPermission')
        );
      },
      currentDataTypeDrawerActionList() {
        const typeKey = [ 'User', 'Group', 'Role' ][this.dataType];
        if (!this.isDataTypeEditEnabled || !typeKey) {
          return [];
        }
        return [
          { label: '保存', uiAction: 'updateCurrentDataTypeItem', permission: this.currentDataTypeUpdatePermission, color: 'primary' },
          { label: '删除', uiAction: 'deleteCurrentDataTypeItem', permission: this.currentDataTypeDeletePermission, color: 'error', outlined: true },
        ];
      },
      relationCreateDrawerActionList() {
        return [
          { label: '保存', uiAction: 'createRelationDataItem', permission: 'insertItem', color: 'primary' },
        ];
      },
      relationUpdateDrawerActionList() {
        return [
          { label: '保存', uiAction: 'updateRelationDataItem', permission: 'updateItem', color: 'primary' },
        ];
      },
      permissionDrawerActionList() {
        return [
          {
            label: '保存权限',
            uiAction: 'saveTargetPermission',
            permission: 'updateTargetPermission',
            color: 'primary',
            loading: this.isPermissionSaving,
          },
        ];
      },
      createUserDrawerActionList() {
        return [
          { label: '保存', uiAction: 'createUserItem', permission: 'insertUser', color: 'primary' },
        ];
      },
      createGroupDrawerActionList() {
        return [
          { label: '保存', uiAction: 'createGroupItem', permission: 'insertGroup', color: 'primary' },
        ];
      },
      createRoleDrawerActionList() {
        return [
          { label: '保存', uiAction: 'createRoleItem', permission: 'insertRole', color: 'primary' },
        ];
      },
      effectivePermissionNodeIdList() {
        return Array.from(new Set([
          ...this.selectedPermissionNodeIdList,
          ...this.inheritedPermissionNodeIdList,
        ]));
      },
      selectedPagePermissionCount() {
        return this.selectedPermissionNodeIdList.filter(id => id.startsWith('page:')).length;
      },
      selectedResourcePermissionCount() {
        return this.selectedPermissionNodeIdList.filter(id => id.startsWith('resource:')).length;
      },
      relationPanelMeta() {
        const selected = this.dataTypeData[this.currentItemIndex];
        const selectedLabel = selected ? `${selected.text}（${selected.value}）` : '未选择';
        if (this.dataType === 0) {
          return {
            description: `用户「${selectedLabel}」的组织与角色。用户级权限在左侧行内「权限」配置；中间行内为组内角色权限。`,
            createLabel: '分配组织与角色',
            emptyText: '无组织/角色，可点击「分配组织与角色」或在左侧配置用户权限。',
            filterLabel: '全部用户归属',
          };
        }
        if (this.dataType === 1) {
          return {
            title: '组内成员',
            description: `组织「${selectedLabel}」下成员及角色。组织级权限在左侧行内「权限」；中间行内为组内角色权限。`,
            createLabel: '添加成员',
            emptyText: '暂无成员，可在左侧配置组织权限。',
            filterLabel: '全部组织成员',
          };
        }
        return {
          title: '角色关联',
          description: `角色「${selectedLabel}」在用户和组织中的使用。角色级权限在左侧行内「权限」配置。`,
          createLabel: '添加关联',
          emptyText: '暂无关联用户，可在左侧配置角色权限。',
          filterLabel: '全部角色关联',
        };
      },
      relationDataTableHeaderComputed() {
        const actionHeader = {
          text: '操作',
          value: 'action',
          align: 'center',
          sortable: false,
          width: 200,
          class: 'fixed',
          cellClass: 'fixed',
        };
        const tailHeaders = [
          { text: '操作人', value: 'operationByUser', width: 90 },
          { text: '操作时间', value: 'operationAt', width: 150 },
          actionHeader,
        ];
        if (this.dataType === 0) {
          return [
            { text: '组织', value: 'groupId', width: 140 },
            { text: '角色', value: 'roleId', width: 140 },
            ...tailHeaders,
          ];
        }
        if (this.dataType === 1) {
          return [
            { text: '用户', value: 'userId', width: 140 },
            { text: '角色', value: 'roleId', width: 140 },
            ...tailHeaders,
          ];
        }
        return [
          { text: '用户', value: 'userId', width: 140 },
          { text: '组织', value: 'groupId', width: 140 },
          ...tailHeaders,
        ];
      },
    },
    watch: {
      // description: ✅响应左侧抽屉数据类型的切换
      async dataType() {
        this.currentItemIndex = 0;
        this.isFullDataShown = false;
        this.buildDataTypeData();
        this.relationDataListFromBackend = [];
        await this.doUiAction('getRelationDataList');
      },
      currentItemIndex(v, ov) {
        if (v !== ov) {
          this.setCurrentItemInfo();
          this.doUiAction('getRelationDataList');
        }
      },
      tabsSearchKeyword() {
        this.currentItemIndex = 0;
        this.buildDataTypeData();
        this.setCurrentItemInfo();
        this.doUiAction('getRelationDataList');
      },
    },
    async mounted() {
      this.isDataTypeLoading = true;
      await this.doUiAction('getBasicDataFromBackend');
      this.isDataTypeLoading = false;
    },
    doUiAction: {
      getRelationDataList: [ 'getRelationDataList' ],
      getBasicDataFromBackend: [
        'getUserList',
        'getGroupList',
        'getRoleList',
        'buildDataTypeData',
        'setCurrentItemInfo',
        'getRelationDataList',
      ],
      startCreateRelationDataItem: [ 'assertRelationCreateEnabled', 'prepareCreateRelationDataForm', 'openCreateRelationDataDrawer' ],
      createRelationDataItem: [
        'assertRelationCreateEnabled',
        'prepareCreateRelationDataFormValidate',
        'confirmCreateItemDialog',
        'doCreateRelationDataItem',
        'getRelationDataList',
        'closeDrawerShow',
      ],
      startUpdateRelationDataItem: [ 'assertRelationEditEnabled', 'prepareUpdateRelationDataForm', 'openUpdateRelationDataDrawer' ],
      updateRelationDataItem: [
        'assertRelationEditEnabled',
        'prepareUpdateRelationDataFormValidate',
        'confirmUpdateItemDialog',
        'doUpdateRelationDataItem',
        'getRelationDataList',
        'closeDrawerShow',
      ],
      deleteRelationDataItem: [ 'assertRelationDeleteEnabled', 'confirmDeleteItemDialog', 'doDeleteRelationDataItem', 'getRelationDataList' ],
      startCurrentTargetPermission: [ 'startCurrentTargetPermission' ],
      startPublicTargetPermission: [ 'preparePublicPermissionTarget', 'openPermissionDrawer', 'getTargetPermission' ],
      startLoginTargetPermission: [ 'prepareLoginPermissionTarget', 'openPermissionDrawer', 'getTargetPermission' ],
      startTargetPermission: [ 'preparePermissionTarget', 'openPermissionDrawer', 'getTargetPermission' ],
      selectAllPermission: [ 'selectAllPermission' ],
      clearAllPermission: [ 'clearAllPermission' ],
      togglePageAllPermission: [ 'togglePageAllPermission' ],
      saveTargetPermission: [ 'saveTargetPermission' ],
      startCreateDataTypeItem: [ 'assertDataTypeCreateEnabled', 'prepareDataTypeFormData', 'openDataTypeFormDrawer' ],
      createUserItem: [
        'assertDataTypeCreateEnabled',
        'prepareUserFormValidate',
        'doCreateUserItem',
        'getUserList',
        'buildDataTypeData',
        'closeFormDrawer',
      ],
      createGroupItem: [
        'assertDataTypeCreateEnabled',
        'prepareGroupFormValidate',
        'doCreateGroupItem',
        'getGroupList',
        'buildDataTypeData',
        'closeFormDrawer',
      ],
      createRoleItem: [
        'assertDataTypeCreateEnabled',
        'prepareRoleFormValidate',
        'doCreateRoleItem',
        'getRoleList',
        'buildDataTypeData',
        'closeFormDrawer',
      ],
      startUpdateDataTypeItem: [ 'assertDataTypeEditEnabled', 'prepareCurrentDataTypeForm', 'openCurrentDataTypeDrawer' ],
      startDataTypeItemPermission: [ 'prepareCurrentDataTypeForm', 'startCurrentTargetPermission' ],
      deleteDataTypeItemFromList: [
        'assertDataTypeEditEnabled',
        'prepareCurrentDataTypeForm',
        'confirmDeleteDataItemDialog',
        'doDeleteCurrentDataTypeItem',
        'getDataTypeList',
        'buildDataTypeData',
      ],
      updateCurrentDataTypeItem: [
        'assertDataTypeEditEnabled',
        'prepareCurrentDataTypeFormValidate',
        'doUpdateCurrentDataTypeDataItem',
        'closeCurrentDataTypeDrawer',
        'getDataTypeList',
        'buildDataTypeData',
      ],
      deleteCurrentDataTypeItem: [
        'assertDataTypeEditEnabled',
        'confirmDeleteDataItemDialog',
        'doDeleteCurrentDataTypeItem',
        'closeCurrentDataTypeDrawer',
        'getDataTypeList',
        'buildDataTypeData',
      ],
    },
    methods: {
      assertDataTypeCreateEnabled() {
        if (!this.isDataTypeCreateEnabled) {
          window.vtoast && window.vtoast.fail('当前类型未开启新增');
          throw new Error('[assertDataTypeCreateEnabled] disabled');
        }
      },
      assertDataTypeEditEnabled() {
        if (!this.isDataTypeEditEnabled) {
          window.vtoast && window.vtoast.fail('当前类型未开启编辑');
          throw new Error('[assertDataTypeEditEnabled] disabled');
        }
      },
      assertRelationCreateEnabled() {
        if (!this.isRelationCreateEnabled) {
          window.vtoast && window.vtoast.fail('未开启归属关系新增');
          throw new Error('[assertRelationCreateEnabled] disabled');
        }
      },
      assertRelationEditEnabled() {
        if (!this.isRelationEditEnabled) {
          window.vtoast && window.vtoast.fail('未开启归属关系编辑');
          throw new Error('[assertRelationEditEnabled] disabled');
        }
      },
      assertRelationDeleteEnabled() {
        if (!this.isRelationDeleteEnabled) {
          window.vtoast && window.vtoast.fail('未开启归属关系删除');
          throw new Error('[assertRelationDeleteEnabled] disabled');
        }
      },
      // description: ✅从当前用户、组织或角色准备授权对象
      async startCurrentTargetPermission() {
        const targetType = ['user', 'group', 'role'][this.dataType];
        await this.preparePermissionTarget({ targetType, item: this.currentDataTypeItem });
        await this.openPermissionDrawer();
        await this.getTargetPermission();
      },
      async preparePublicPermissionTarget() {
        await this.preparePermissionTarget({ targetType: 'public' });
      },
      async prepareLoginPermissionTarget() {
        await this.preparePermissionTarget({ targetType: 'login' });
      },
      // description: ✅构造现有权限规则表使用的 user/group/role 三元组
      async preparePermissionTarget({ targetType, item = {} }) {
        const targetMap = {
          public: {
            target: { user: '*', group: 'public', role: '*' },
            label: '公开权限（未登录用户）',
          },
          login: {
            target: { user: '*', group: 'login', role: '*' },
            label: '登录权限（所有已登录用户）',
          },
          user: {
            target: { user: item.userId, group: 'login', role: '*' },
            label: `${item.username || item.userId}（${item.userId}）`,
          },
          group: {
            target: { user: '*', group: item.groupId, role: '*' },
            label: `${item.groupName || item.groupId}（${item.groupId}）`,
          },
          role: {
            target: { user: '*', group: 'login', role: item.roleId },
            label: `${item.roleName || item.roleId}（${item.roleId}）`,
          },
          groupRole: {
            target: { user: '*', group: item.groupId, role: item.roleId },
            label: `组内角色：${item.groupId} / ${item.roleId}`,
          },
        };
        const targetConfig = targetMap[targetType];
        const requiresEntity = ![ 'public', 'login' ].includes(targetType);
        if (!targetConfig || (requiresEntity && Object.values(targetConfig.target).some(value => !value))) {
          throw new Error('[preparePermissionTarget] 授权对象不完整');
        }
        this.permissionTarget = targetConfig.target;
        this.permissionTargetType = targetType;
        this.permissionTargetLabel = targetConfig.label;
      },
      async openPermissionDrawer() {
        this.permissionSearch = null;
        this.permissionTree = [];
        this.selectedPermissionNodeIdList = [];
        this.inheritedPermissionNodeIdList = [];
        this.inheritedPermissionSourceMap = {};
        this.deniedPermissionNodeIdList = [];
        this.openedPermissionNodeIdList = [];
        this.isPermissionDrawerShown = true;
      },
      getInheritedPermissionLabel(nodeId) {
        const sourceTextMap = { public: '公开', login: '登录' };
        return String(this.inheritedPermissionSourceMap[nodeId] || '')
          .split(',')
          .filter(Boolean)
          .map(key => sourceTextMap[key] || key)
          .join(' / ');
      },
      isDirectPermissionSelected(nodeId) {
        return this.selectedPermissionNodeIdList.includes(nodeId);
      },
      handlePermissionSelectionChange(nextNodeIdList) {
        if (!this.canUpdateTargetPermission) return;
        // 勾通配时会禁用具体 action，treeview 可能同步再发一次旧选中态；同步窗口内忽略
        if (this._permissionSelectionSyncing) return;
        const previousNodeIdSet = new Set(this.selectedPermissionNodeIdList || []);
        const nextNodeIdSet = new Set(nextNodeIdList || []);
        (this.permissionTree || []).forEach(pageItem => {
          const wasPageSelected = previousNodeIdSet.has(pageItem.id);
          const isPageSelected = nextNodeIdSet.has(pageItem.id);
          const childNodeIdList = (pageItem.children || []).map(item => item.id);
          const hasSelectedChild = childNodeIdList.some(nodeId => nextNodeIdSet.has(nodeId));

          if (!wasPageSelected && isPageSelected) {
            // 主动勾选页面：默认全选当前具体操作（不含通配）
            this.getPageConcretePermissionNodeIdList(pageItem)
              .forEach(nodeId => nextNodeIdSet.add(nodeId));
            return;
          }
          if (wasPageSelected && !isPageSelected) {
            // 主动取消页面：清空该页下全部权限
            this.getPageAllPermissionNodeIdList(pageItem)
              .forEach(nodeId => nextNodeIdSet.delete(nodeId));
            return;
          }
          if (!isPageSelected && hasSelectedChild) {
            // 只勾了子 action：给页面勾选效果，但不触发页面级联全选
            nextNodeIdSet.add(pageItem.id);
          }
        });
        const normalizedNodeIdList = this.normalizeWildcardPermissionNodeIdList(
          Array.from(nextNodeIdSet)
        );
        this.selectedPermissionNodeIdList = normalizedNodeIdList;
        this.syncPermissionSelectionState(normalizedNodeIdList);
      },
      syncPermissionSelectionState(normalizedNodeIdList) {
        const commit = () => {
          this.selectedPermissionNodeIdList = normalizedNodeIdList;
          this.applyPermissionTreeState();
          const unlock = () => {
            this.selectedPermissionNodeIdList = normalizedNodeIdList;
            this._permissionSelectionSyncing = false;
          };
          if (typeof this.$nextTick === 'function') {
            this.$nextTick(unlock);
            return;
          }
          unlock();
        };
        this._permissionSelectionSyncing = true;
        if (typeof this.$nextTick === 'function') {
          this.$nextTick(commit);
          return;
        }
        commit();
      },
      applyPermissionTreeState() {
        const canUpdate = this.canUpdateTargetPermission;
        const setDisabled = (item, disabled) => {
          if (this.$set) {
            this.$set(item, 'disabled', disabled);
            return;
          }
          item.disabled = disabled;
        };
        // 原地更新 disabled，避免每次勾选重建整棵树导致 treeview 勾选失效
        (this.permissionTree || []).forEach(pageItem => {
          const wildcardItem = (pageItem.children || []).find(resourceItem => resourceItem.isWildcard);
          const isDirectWildcardSelected = !!(
            wildcardItem
            && this.selectedPermissionNodeIdList.includes(wildcardItem.id)
          );
          setDisabled(pageItem, !canUpdate);
          (pageItem.children || []).forEach(resourceItem => {
            setDisabled(
              resourceItem,
              !canUpdate || (isDirectWildcardSelected && !resourceItem.isWildcard)
            );
          });
        });
      },
      getSelectablePermissionNodeIdList() {
        return this.getAllPermissionNodeIdList()
          .filter(nodeId => !this.isWildcardPermissionNodeId(nodeId));
      },
      // description: ✅加载页面-resource树及当前目标已有直接授权
      async getTargetPermission() {
        this.isPermissionLoading = true;
        try {
          const result = await window.jianghuAxios({
            data: {
              appData: {
                pageId: 'userGroupRole',
                actionId: 'selectTargetPermission',
                actionData: { target: this.permissionTarget },
              }
            }
          });
          const resultData = result.data.appData.resultData;
          this.permissionTree = resultData.permissionTree || [];
          this.selectedPermissionNodeIdList = this.normalizeWildcardPermissionNodeIdList(
            resultData.selectedNodeIdList || []
          );
          this.inheritedPermissionNodeIdList = resultData.inheritedNodeIdList || [];
          this.inheritedPermissionSourceMap = resultData.inheritedPermissionSourceMap || {};
          this.deniedPermissionNodeIdList = resultData.deniedNodeIdList || [];
          this.applyPermissionTreeState();
          const visibleSelectedNodeIdList = this.effectivePermissionNodeIdList;
          this.openedPermissionNodeIdList = this.permissionTree
            .filter(item => item.children && item.children.some(child => visibleSelectedNodeIdList.includes(child.id)))
            .map(item => item.id);
        } finally {
          this.isPermissionLoading = false;
        }
      },
      getAllPermissionNodeIdList() {
        return this.permissionTree.reduce((result, pageItem) => {
          result.push(pageItem.id);
          (pageItem.children || []).forEach(resourceItem => result.push(resourceItem.id));
          return result;
        }, []);
      },
      isWildcardPermissionNodeId(nodeId) {
        return typeof nodeId === 'string'
          && nodeId.startsWith('resource:')
          && nodeId.endsWith('.*');
      },
      normalizeWildcardPermissionNodeIdList(nodeIdList) {
        const nodeIdSet = new Set(nodeIdList || []);
        (this.permissionTree || []).forEach(pageItem => {
          const wildcardItem = (pageItem.children || []).find(resourceItem => resourceItem.isWildcard);
          if (!wildcardItem || !nodeIdSet.has(wildcardItem.id)) return;
          (pageItem.children || [])
            .filter(resourceItem => !resourceItem.isWildcard)
            .forEach(resourceItem => nodeIdSet.delete(resourceItem.id));
        });
        return Array.from(nodeIdSet);
      },
      getPageConcretePermissionNodeIdList(pageItem) {
        return [
          pageItem.id,
          ...(pageItem.children || [])
            .filter(resourceItem => !resourceItem.isWildcard)
            .map(resourceItem => resourceItem.id),
        ];
      },
      getPageAllPermissionNodeIdList(pageItem) {
        return [
          pageItem.id,
          ...(pageItem.children || []).map(resourceItem => resourceItem.id),
        ];
      },
      async selectAllPermission() {
        this.selectedPermissionNodeIdList = this.getSelectablePermissionNodeIdList();
        this.applyPermissionTreeState();
        this.openedPermissionNodeIdList = this.permissionTree.map(item => item.id);
      },
      async clearAllPermission() {
        this.selectedPermissionNodeIdList = [];
        this.applyPermissionTreeState();
      },
      isPageAllPermissionSelected(pageItem) {
        const wildcardItem = (pageItem.children || []).find(resourceItem => resourceItem.isWildcard);
        if (
          this.selectedPermissionNodeIdList.includes(pageItem.id)
          && wildcardItem
          && this.selectedPermissionNodeIdList.includes(wildcardItem.id)
        ) {
          return true;
        }
        const pageNodeIdList = this.getPageConcretePermissionNodeIdList(pageItem);
        return pageNodeIdList.every(id => this.selectedPermissionNodeIdList.includes(id));
      },
      async togglePageAllPermission(pageItem) {
        const selectedNodeIdSet = new Set(this.selectedPermissionNodeIdList);
        if (this.isPageAllPermissionSelected(pageItem)) {
          this.getPageAllPermissionNodeIdList(pageItem)
            .forEach(id => selectedNodeIdSet.delete(id));
        } else {
          this.getPageConcretePermissionNodeIdList(pageItem)
            .forEach(id => selectedNodeIdSet.add(id));
          if (!this.openedPermissionNodeIdList.includes(pageItem.id)) {
            this.openedPermissionNodeIdList = [...this.openedPermissionNodeIdList, pageItem.id];
          }
        }
        this.selectedPermissionNodeIdList = Array.from(selectedNodeIdSet);
        this.applyPermissionTreeState();
      },
      // description: ✅页面节点保存到_page授权，resource节点保存到_resource授权
      async saveTargetPermission() {
        this.isPermissionSaving = true;
        try {
          const pageIdList = this.selectedPermissionNodeIdList
            .filter(id => id.startsWith('page:'))
            .map(id => id.slice('page:'.length));
          const resourceIdList = this.selectedPermissionNodeIdList
            .filter(id => id.startsWith('resource:'))
            .map(id => id.slice('resource:'.length));
          await window.jianghuAxios({
            data: {
              appData: {
                pageId: 'userGroupRole',
                actionId: 'updateTargetPermission',
                actionData: {
                  target: this.permissionTarget,
                  pageIdList,
                  resourceIdList,
                },
              }
            }
          });
          await window.vtoast.success('权限保存成功');
          this.isPermissionDrawerShown = false;
        } finally {
          this.isPermissionSaving = false;
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
        const currentItem = this.dataTypeData[this.currentItemIndex || 0];
        if (currentItem) {
          this.currentDataTypeItem = _.cloneDeep(currentItem.data);
        } else {
          this.currentDataTypeItem = {};
        }
      },
      // description: ✅获取组织数据
      async getGroupList() {
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userGroupRole',
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
              pageId: 'userGroupRole',
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
              pageId: 'userGroupRole',
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
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'userGroupRole',
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
        const form = {};
        const currentItem = this.dataTypeData[this.currentItemIndex];
        if (currentItem) {
          if (this.dataType === 0) {
            form.userId = currentItem.value;
          }
          if (this.dataType === 1) {
            form.groupId = currentItem.value;
          }
          if (this.dataType === 2) {
            form.roleId = currentItem.value;
          }
        }
        this.createRelationDataFormData = form;
      },
      // description: ✅准备更新关系表单数据
      async prepareUpdateRelationDataForm(funObj) {
        this.updateRelationDataFormData = _.cloneDeep(funObj);
      },
      // description: ✅准备更新用户、组织、角色表单数据
      async prepareCurrentDataTypeForm(funObj) {
        this.currentDataTypeItem = _.cloneDeep(funObj);
      },
      handleCurrentDataTypeFieldChange({ key, value }) {
        this.$set(this.currentDataTypeItem, key, value);
      },
      // description: ✅打开更新用户、组织、角色抽屉
      async openCurrentDataTypeDrawer() {
        this.isCurrentDataTypeDrawerShown = true;
      },
      // description: ✅关闭更新用户、组织、角色抽屉
      async closeCurrentDataTypeDrawer() {
        this.isCurrentDataTypeDrawerShown = false;
      },
      // description: ✅打开关系新增抽屉
      async openCreateRelationDataDrawer() {
        this.isRelationDataCreateDrawerShown = true;
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
      // description: ✅新增关系抽屉确认
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
              pageId: 'userGroupRole',
              actionId: 'insertItem',
              actionData: { userId, groupId, roleId }
            }
          }
        });
        await window.vtoast.success("保存成功");
      },
      // description: ✅关闭关系新增、更新抽屉
      async closeDrawerShow() {
        this.isRelationDataCreateDrawerShown = false;
        this.isRelationDataUpdateDrawerShown = false;
      },
      // description: ✅重构用户、组织、角色的表单数据
      async prepareDataTypeFormData() {
        this.createUserData = {};
        this.createGroupData = {};
        this.createRoleData = {};
      },
      // description: ✅打开关系新增抽屉
      async openUpdateRelationDataDrawer() {
        this.isRelationDataUpdateDrawerShown = true;
      },

      // description: ✅更新关系数据抽屉确认
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
              pageId: 'userGroupRole',
              actionId: 'updateItem',
              actionData: { userId, groupId, roleId },
              where: { id: id }
            }
          }
        });
        await window.vtoast.success("修改成功");
      },

      // description: ✅删除关系数据确认
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
              pageId: 'userGroupRole',
              actionId: 'deleteItem',
              where: { id }
            }
          }
        });
        window.vtoast.success('删除成功')
      },

      // description: ✅打开添加用户、组织、角色的表单抽屉
      async openDataTypeFormDrawer() {
        this.isCreateUserDrawerShown = false;
        this.isCreateGroupDrawerShown = false;
        this.isCreateRoleDrawerShown = false;
        if (this.dataType === 0) {
          this.isCreateUserDrawerShown = true;
        }
        if (this.dataType === 1) {
          this.isCreateGroupDrawerShown = true;
        }
        if (this.dataType === 2) {
          this.isCreateRoleDrawerShown = true;
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
              pageId: 'userGroupRole',
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
              pageId: 'userGroupRole',
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
              pageId: 'userGroupRole',
              actionId: 'insertRole',
              actionData: this.createRoleData
            }
          }
        })
        window.vtoast.success("添加成功")
      },
      // description: ✅关闭添加用户、组织、角色的表单抽屉
      async closeFormDrawer() {
        this.isCreateUserDrawerShown = false;
        this.isCreateGroupDrawerShown = false;
        this.isCreateRoleDrawerShown = false;
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
                pageId: 'userGroupRole',
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
        if (await this.$refs.currentDataTypeRef.validate() === false) {
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
              pageId: 'userGroupRole',
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
  style: /*css*/`
    .user-group-role-main {
      min-width: 0;
      transition: margin-left 0.2s ease;
    }

    .ugr-page-body {
      padding: 0 16px 0 12px;
    }

    .ugr-page-header {
      padding: 16px 16px 16px 12px;
    }

    .ugr-page-title {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.4;
      color: rgba(0, 0, 0, 0.87);
    }

    .ugr-page-help {
      font-size: 13px;
      font-weight: 400;
      vertical-align: middle;
    }

    .ugr-header-actions {
      gap: 8px;
    }

    .ugr-header-btn {
      margin: 0 !important;
    }

    .ugr-section-title {
      font-size: 15px;
      font-weight: 600;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.87);
    }

    .ugr-section-desc,
    .ugr-muted-text,
    .ugr-tree-code {
      font-size: 13px;
      line-height: 1.6;
      color: rgba(0, 0, 0, 0.54);
    }

    .ugr-section-head {
      padding: 16px 20px 0;
    }

    .ugr-section-toolbar {
      padding: 12px 20px;
      gap: 12px;
    }

    .ugr-section-main {
      min-width: 0;
    }

    .ugr-main-card {
      overflow: hidden;
    }

    .ugr-switch-wrap {
      margin-left: 4px;
    }

    .ugr-switch .v-label {
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
    }

    .ugr-search-field {
      max-width: 240px;
    }

    .ugr-data-table {
      font-size: 13px;
    }

    .ugr-data-table .v-data-table-header th {
      font-size: 13px !important;
      font-weight: 600 !important;
      color: rgba(0, 0, 0, 0.7) !important;
    }

    .ugr-table-action {
      font-size: 13px;
      font-weight: 500;
      line-height: 1.4;
      cursor: pointer;
      white-space: nowrap;
    }

    .ugr-alert-compact.v-alert {
      font-size: 13px;
      line-height: 1.55;
    }

    .ugr-alert-compact .v-alert__wrapper {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .ugr-left-drawer__prepend {
      padding: 0;
    }

    .ugr-left-drawer__tabs {
      border-bottom: 1px solid #eee;
    }

    .ugr-left-drawer__tabs .v-tab {
      font-size: 13px;
      font-weight: 500;
      min-width: 0;
      flex: 1;
    }

    .ugr-left-drawer__create-btn {
      margin: 12px 12px 0 !important;
      max-width: none !important;
      min-width: calc(100% - 24px) !important;
      font-size: 13px;
    }

    .ugr-left-drawer__search {
      padding: 12px 12px 4px;
    }

    .ugr-left-drawer__list {
      padding: 4px 12px 12px;
    }

    .ugr-left-drawer__list-item {
      border-radius: 8px;
      min-height: 52px !important;
    }

    .ugr-list-item-title {
      font-size: 13px;
      line-height: 1.5;
      white-space: normal;
    }

    .ugr-list-item-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 2px 0;
    }

    .ugr-list-item-actions .ugr-table-action {
      font-size: 12px;
    }

    .ugr-list-item-name {
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }

    .ugr-list-item-code {
      margin-left: 4px;
      color: rgba(0, 0, 0, 0.45);
    }

    .ugr-empty-state {
      min-height: 160px;
    }

    .ugr-chip {
      font-size: 12px !important;
      height: 24px !important;
    }

    .ugr-text-btn {
      font-size: 13px !important;
      font-weight: 500;
    }

    .ugr-relation-drawer .jh-input-label {
      font-size: 13px;
    }

    .ugr-permission-header {
      padding: 16px;
    }

    .ugr-permission-tree {
      padding: 8px 16px 12px;
    }

    .ugr-permission-toolbar {
      gap: 4px;
    }

    .permission-drawer {
      height: calc(100vh - 52px);
      min-height: 0;
    }

    .permission-tree-container {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }

    .permission-tree-label {
      min-width: 0;
      font-size: 13px;
    }

    .permission-tree-label .ugr-tree-code {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .jh-no-data {
      font-size: 13px;
      line-height: 1.6;
      color: rgba(0, 0, 0, 0.54);
      padding: 24px 16px;
    }

    @media (min-width: 600px) {
      .ugr-page-body {
        padding: 0 24px 0 12px;
      }

      .ugr-page-header {
        padding: 16px 16px 16px 12px;
      }

      .v-application .px-sm-8 {
        padding-right: 12px !important;
        padding-left: 12px !important;
      }
    }
  `
}

module.exports = content;
