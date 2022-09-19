'use strict';

// ========================================常用 require start===========================================
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const { BizError, errorInfoEnum } = require('../constant/error');
const Service = require('egg').Service;
// ========================================常用 require end=============================================
const _ = require('lodash');
const md5 = require('md5-node');
const { tableEnum } = require('../constant/constant');
const actionDataScheme = Object.freeze({
  addUser: {
    type: 'object',
    additionalProperties: true,
    required: [ 'userId', 'username', 'clearTextPassword' ],
    properties: {
      clearTextPassword: { type: 'string' },
      userId: { type: 'string' },
      username: { type: 'string' },
      userType: { type: 'string' },
      userStatus: { type: 'string' },
    },
  },
});


class UserGroupRoleManagementService extends Service {

  async deleteUserGroupRole() {
    const { jianghuKnex } = this.app;
    const { where } = this.ctx.request.body.appData;
    await jianghuKnex(tableEnum._user_group_role, this.ctx).where(where).jhDelete();
    return {};
  }

  async addUser() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.addUser, actionData);
    const { clearTextPassword, userId } = actionData;
    const md5Salt = idGenerateUtil.randomString(12);
    const password = md5(`${clearTextPassword}_${md5Salt}`);
    const idSequence = await this.getNextIdByTableAndField({ table: '_user', field: 'idSequence' });
    const userExistCountResult = await jianghuKnex(tableEnum._user, this.ctx).where({ userId }).count('*', { as: 'count' });
    const userExistCount = userExistCountResult[0].count;
    if (userExistCount > 0) {
      throw new BizError(errorInfoEnum.user_id_exist);
    }
    const insertParams = _.pick(actionData, [ 'username', 'userType', 'userStatus' ]);
    await jianghuKnex(tableEnum._user, this.ctx).insert({ ...insertParams, idSequence, userId, password, clearTextPassword, md5Salt });
    return {};
  }

  async getNextIdByTableAndField({ table, field }) {
    const knex = this.app.knex;
    const rows = await knex(table).max(`${field} as maxValue`);
    let maxValue = null;
    if (rows.length > 0 && rows[0].maxValue) {
      maxValue = parseInt(rows[0].maxValue) + 1;
    } else {
      maxValue = 26260000;
    }
    return maxValue;
  }

}

module.exports = UserGroupRoleManagementService;
