'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const {BizError, errorInfoEnum} = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
const {tableEnum} = require('../constant/constant');
// ========================================常用 require end=============================================
const _ = require('lodash');
const md5 = require('md5-node');


class UserGroupRoleService extends Service {

  async deleteUserGroupRole() {
    const { jianghuKnex } = this.app;
    const { where } = this.ctx.request.body.appData;
    await jianghuKnex(tableEnum._user_group_role, this.ctx).where(where).jhDelete();
    return {};
  }

}

module.exports = UserGroupRoleService;
