'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================
const _ = require('lodash');
const Knex = require('knex');
const dayjs = require('dayjs');


class UserGroupRoleService extends Service {

  async insertUserGroupRole() {
    const { jianghuKnex } = this.app;
    const { userId, roleId: roleIdList, groupId, roleConfig } = this.ctx.request.body.appData.actionData;
    const roleInsertList = [];
    roleConfig.forEach(item => {
      roleInsertList.push({
        userId,
        roleId: item.roleId,
        groupId,
        roleDeadline: item.roleDeadline == -1 ? item.roleDeadline : dayjs().add(item.roleDeadline, 'day').format('YYYY-MM-DD')
      })
    })
    if (roleInsertList.length > 0) {
      await jianghuKnex('enterprise_user_group_role', this.ctx).insert(roleInsertList);
    }
    // Tip: 临时代码， commonAuthList待废弃
    await this.service.app.buildUserGroupRolePageByCommonAuth();
    await this.service.app.buildUserApp(userId);
  }

  async updateUserGroupRole() {
    const { jianghuKnex } = this.app;
    const { id, userId, roleId: roleIdList, groupId, roleConfig } = this.ctx.request.body.appData.actionData;

    const roleInsertList = [];
    roleConfig.forEach(item => {
      roleInsertList.push({
        userId,
        roleId: item.roleId,
        groupId,
        roleDeadline: item.roleType == "临时角色" ? item.roleDeadline : -1
      })
    })

    await jianghuKnex.transaction(async trx => { 
      // 删除旧的
      await trx('enterprise_user_group_role').where({ id }).delete();
      if (roleInsertList.length > 0) { 
        // 插入新的
        await trx('enterprise_user_group_role', this.ctx).insert(roleInsertList);
      }
    })
    // Tip: 临时代码， commonAuthList待废弃
    await this.service.app.buildUserGroupRolePageByCommonAuth();
    await this.service.app.buildUserApp(userId);
  }
  async deleteUserGroupRole() {
    const { jianghuKnex } = this.app;
    const { userId, groupId } = this.ctx.request.body.appData.actionData;
    await jianghuKnex('enterprise_user_group_role').where({ userId, groupId }).delete();
    // Tip: 临时代码， commonAuthList待废弃
    await this.service.app.buildUserGroupRolePageByCommonAuth();
    await this.service.app.buildUserApp(userId);
  }


  async updateUserGroupRolePage() {
    const { jianghuKnex } = this.app;
    const {dataList, role, group} = this.ctx.request.body.appData.actionData;
    const dataListByAppId = _.groupBy(dataList, 'appId');
    const appIdList = Object.keys(dataListByAppId);
    const insertUserGroupRolePageList = [];
    const insertUserGroupRoleResourceList = [];
    _.forEach(dataListByAppId, (value, key) => {
      const item = {
        appId: key,
        role,
        group,
        user: '*',
        allowOrDeny: 'allow',
      }
      insertUserGroupRolePageList.push({
        ...item,
        page: value.map(e => e.pageId).join(','),
      })
      insertUserGroupRoleResourceList.push({
        ...item,
        resource: value.map(e => e.pageId == '*' ? e.pageId : e.pageId + '.*').join(','),
      })
    });

    await jianghuKnex.transaction(async trx => {
      // 删除原有的 enterprise_user_group_role_page
      await trx('enterprise_user_group_role_page').where({ group, role }).jhDelete();
      // 新增 enterprise_user_group_role_page
      insertUserGroupRolePageList.length && await trx('enterprise_user_group_role_page').jhInsert(insertUserGroupRolePageList);
      await trx('enterprise_user_group_role_resource').where({ group, role }).jhDelete();
      // 新增 enterprise_user_group_role_resource
      insertUserGroupRoleResourceList.length && await trx('enterprise_user_group_role_resource').jhInsert(insertUserGroupRoleResourceList);
    })

    this.service.app.buildUserApp();
  }

  /**
   * 删除角色，删除角色关系与权限
   */
  async deleteGroupRole() {
    const { jianghuKnex } = this.app;
    const { roleId, groupId } = this.ctx.request.body.appData.actionData;
    
    await jianghuKnex.transaction(async trx => { 
      await trx('enterprise_role').where({ roleId  }).jhDelete();
      await trx('enterprise_user_group_role').where({ roleId, groupId }).jhDelete();
      await trx('enterprise_user_group_role_page').where({ group: groupId, role: roleId }).jhDelete();
      await trx('enterprise_user_group_role_resource').where({ group: groupId, role: roleId }).jhDelete();
    })
    this.service.app.buildUserApp();
  }

  // async updateUserOrg() {
  //   const { jianghuKnex } = this.app;
  //   const userList = await jianghuKnex('_user')
  //       .where('userStatus', '=', "active")
  //       .select();
  //   const userGroupRoleList = await jianghuKnex('enterprise_user_group_role')
  //       .where('groupId', '<>', 'login')
  //       .where('groupId', '<>', '超级管理员')
  //       .where('roleDeadline', '=', '-1')
  //       .select()
  //       .orderBy("id", "asc")
  //   const groupList = await jianghuKnex('enterprise_group')
  //       .select();
  //   const useUpdateList = []

  //   // 循环user表
  //   userList.forEach(element => {
  //       const userGroupRole = userGroupRoleList.find(item => item.userId == element.userId)
  //       // 判断User的组织信息是否跟enterprise_user_group_role的第一条信息相同
  //       if (userGroupRole && userGroupRole.groupId != element.orgId) {
  //           const group = groupList.find(item => userGroupRole.groupId == item.groupPath + '-' + item.groupId)
  //           if (group) {
  //               useUpdateList.push({
  //                   userId: element.userId,
  //                   orgId: group.groupPath + '-' + group.groupId,
  //                   orgName: group.groupName,
  //                   orgFullName: group.groupAllName,
  //                   orgPath: group.groupPath + '-' + group.groupId,
  //               })
  //           }
  //       }
  //   });
  //   if (useUpdateList.length > 0) {
  //       for (const i of useUpdateList) {
  //         await jianghuKnex('_user').where({userId: i.userId}).jhUpdate(i);
  //       }
  //   }
  // }

  async checkIsGroupPrincipalByCommon() {
    const { userId, userGroupRoleList } = this.ctx.userInfo;
    const userGroupIdList = _.map(userGroupRoleList, "groupId").join(',')
    const { jianghuKnex } = this.app;
    // 兼容校验：新增用户校验、新增组织校验、给组织分配用户校验
    const { groupPath, groupId } = this.ctx.request.body.appData.actionData;
    let operationGroupId = groupPath || groupId
    let isHasAuth = false

    // 管理员组可以操作所有组织
    if (!(userGroupRoleList.length > 0 && userGroupIdList.includes('超级管理员'))) {
      const groupIdData = await jianghuKnex('enterprise_group').where("principalId", "like", "%" + userId + "%").select();
      if (groupIdData.length > 0) {
        groupIdData.forEach(item => {
          if (operationGroupId.includes(item.groupId)) {
            isHasAuth = true
          }
        })
      }
      if (!isHasAuth) {
        throw new Error(`暂无权限，请联系管理员！`);
      }
    }
    
  }

  async checkIsGroupPrincipalByDeleteGroupIp() {
    const { userId, userGroupRoleList } = this.ctx.userInfo;
    const userGroupIdList = _.map(userGroupRoleList, "groupId").join(',')
    const { jianghuKnex } = this.app;
    // 兼容校验：新增用户校验、新增组织校验、给组织分配用户校验
    const { groupId } = this.ctx.request.body.appData.actionData;
    let operationGroupId = groupId
    let isHasAuth = false

    // 管理员组可以操作所有组织
    if (!(userGroupRoleList.length > 0 && userGroupIdList.includes('超级管理员'))) {
      const groupIdData = await jianghuKnex('enterprise_group').where("principalId", "like", "%" + userId + "%").select();
      if (groupIdData.length > 0) {
        groupIdData.forEach(item => {
          if (operationGroupId.includes(item.groupId)) {
            isHasAuth = true
          }
        })
      }
      if (!isHasAuth) {
        throw new Error(`暂无权限，请联系管理员！`);
      }
    }
    delete this.ctx.request.body.appData.actionData.groupId
  }
}

module.exports = UserGroupRoleService;
