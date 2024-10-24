'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================
const _ = require('lodash');
const md5 = require('md5-node');
const dayjs = require('dayjs');

const appDataSchema = Object.freeze({
  addUser: {
    type: 'object',
    additionalProperties: true,
    required: [ 'username', 'clearTextPassword' ],
    properties: {
      clearTextPassword: { type: 'string' },
      username: { type: 'string' },
      userAvatar: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      contactNumber: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      gender: { anyOf: [{ type: 'string', enum: [ 'male', 'female' ] }, { type: 'null' }] },
      birthday: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
      signature: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      email: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    },
  },
  initUserPassword: {
    type: 'object',
    additionalProperties: true,
    required: [ 'userId', 'clearTextPassword' ],
    properties: {
      userId: { type: 'string' },
      clearTextPassword: { type: 'string' },
    },
  },
});

class UserManagementService extends Service {

  async getNextIdByTableAndField({ table, field }) {
    const knex = this.app.knex;
    const rows = await knex(table).max(`${field} as maxValue`);
    let maxValue = null;
    if (rows.length > 0 && rows[0].maxValue) {
      maxValue = parseInt(rows[0].maxValue) + 1;
    } else {
      maxValue = 10001;
    }
    return maxValue;
  }

  async addUser() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(appDataSchema.addUser, actionData);
    const { clearTextPassword, roleConfig=[], groupId } = actionData;
    let { userId } = actionData;
    const md5Salt = idGenerateUtil.randomString(12);
    const password = md5(`${clearTextPassword}_${md5Salt}`);

    const idSequence = await this.getNextIdByTableAndField({ table: '_user', field: 'idSequence' });
    userId = userId || `W${idSequence}`;
    const insertParams = _.pick(actionData, ['username', 'userStatus', 'qiweiId', 'phoneNumber', 'email']);
    const roleInsertList = [];

    roleConfig.forEach(item => {
      roleInsertList.push({
        userId,
        roleId: item.roleId,
        groupId: groupId,
        roleDeadline: item.roleDeadline == -1 ? item.roleDeadline : dayjs().add(item.roleDeadline, 'day').format('YYYY-MM-DD')
      })
    })

    if (roleInsertList.length > 0) {
      await jianghuKnex('enterprise_user_group_role', this.ctx).insert(roleInsertList);
    }
    await jianghuKnex('_user', this.ctx).jhInsert({ ...insertParams, idSequence, userId, password, clearTextPassword, md5Salt });
    // Tip: 临时代码， commonAuthList待废弃
    await this.service.app.buildUserGroupRolePageByCommonAuth();
    await this.service.app.buildUserApp(userId);
    return {};
  }


  async batchAddUser() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    const { userList=[] } = actionData;

    let idSequence = await this.getNextIdByTableAndField({ table: '_user', field: 'idSequence' });
    const userListInsert = [];
    userList.forEach(user => {
      const {userId, username, phoneNumber } = user;
      if (!userId || !username) { return; }
      const insertParams = _.pick(user, [ 'userId', 'username', 'userType', 'userStatus', ]);
      const md5Salt = idGenerateUtil.randomString(12);
      const clearTextPassword = idGenerateUtil.randomString(6);
      const password = md5(`${clearTextPassword}_${md5Salt}`);

      // 替换 空格、换行、制表符
      userListInsert.push({ ...insertParams, phoneNumber, userId: userId.replace(/\s+/g, ''), password, clearTextPassword, md5Salt, username: username.replace(/\s+/g, ''), idSequence: idSequence++});
    })
    if (userListInsert.length > 0) {
      await jianghuKnex('_user', this.ctx).jhInsert(userListInsert);
    }
    await this.service.app.buildUserApp();
    return {};
  }

  async resetUserPassword() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(appDataSchema.initUserPassword, actionData);
    const { userId, clearTextPassword } = actionData;
    const userExistCountResult = await jianghuKnex('_user', this.ctx).where({ userId }).count('*', {as: 'count'});
    const userExistCount = userExistCountResult[0].count;
    if (userExistCount === 0) {
      throw new BizError(errorInfoEnum.user_not_exist);
    }
    const md5Salt = idGenerateUtil.randomString(12);
    const password = md5(`${clearTextPassword}_${md5Salt}`);
    await jianghuKnex('_user', this.ctx).where({userId}).update({ password, clearTextPassword, md5Salt });
    return {};
  }

  async filterUserData() {
    const { jianghuKnex } = this.app;
    const { rows } = this.ctx.response.body.appData.resultData;
    const { userId, userGroupRoleList } = this.ctx.userInfo;
    // 获取用户管理的组织
    const groupIdData = await jianghuKnex('enterprise_group').where('principalId', 'like', '%' + userId + '%').select();
    const principalGroupIdList = groupIdData.map(item => item.groupId)
    const userGroupIdList = _.map(userGroupRoleList, "groupId").join(',')

    // 如果是管理员就看到全部数据
    if (!(userGroupRoleList.length > 0 && userGroupIdList.includes('超级管理员'))) {
      this.ctx.response.body.appData.resultData.rows = rows.filter(item => _.some(principalGroupIdList, e => item.groupId && item.groupId.includes(e)))
    }
  }

  async filterGroupByAuth() {
    const { jianghuKnex } = this.app;
    const { userId, userGroupRoleList } = this.ctx.userInfo;
    const { rows } = this.ctx.response.body.appData.resultData;

    const principalGroupIdList = rows.filter(item => item.principalId?.includes(userId))

    // 管理员看到全部数据
    const userGroupIdList = _.map(userGroupRoleList, "groupId").join(',')
    if (!(userGroupRoleList.length > 0 && userGroupIdList.includes('超级管理员'))) {
      this.ctx.response.body.appData.resultData.rows = rows.filter(item => _.some(principalGroupIdList, e => item.groupId && item.groupId.includes(e.groupId)))
    } else {
      this.ctx.response.body.appData.resultData.rows = rows
    }
  }
}

module.exports = UserManagementService;
