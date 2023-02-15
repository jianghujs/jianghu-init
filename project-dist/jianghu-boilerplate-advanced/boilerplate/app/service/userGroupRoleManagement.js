'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
// ========================================常用 require end=============================================


class UserGroupRoleManagementService extends Service {

  async deleteUserGroupRole() {
    const { jianghuKnex } = this.app;
    const { where } = this.ctx.request.body.appData;
    await jianghuKnex('_user_group_role', this.ctx).where(where).jhDelete();
    return {};
  }

}

module.exports = UserGroupRoleManagementService;
