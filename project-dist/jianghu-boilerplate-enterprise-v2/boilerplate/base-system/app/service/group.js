'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
// ========================================常用 require end=============================================

class GroupService extends Service {
    async deteleGroup() {
        const { jianghuKnex } = this.app;
        const { groupId } = this.ctx.request.body.appData.actionData;

        await jianghuKnex.transaction(async trx => {
            await trx('enterprise_user_group_role', this.ctx).where('groupId',groupId).jhDelete();
            await trx('enterprise_user_group_role_page', this.ctx).where('group',groupId).jhDelete();
            await trx('enterprise_user_group_role_resource', this.ctx).where('group',groupId).jhDelete();
            await trx('enterprise_group', this.ctx).where('groupId',groupId).jhDelete();
        });
        this.service.app.buildUserApp();
    }
}

module.exports = GroupService;