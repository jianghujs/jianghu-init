'use strict';

const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('@jianghujs/jianghu/app/constant/error');
const _ = require('lodash');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');

const md5 = require('md5-node');
const paramsScheme = Object.freeze({
  passwordReset: {
    type: 'object',
    additionalProperties: true,
    required: [ 'oldPassword', 'newPassword' ],
    properties: {
      oldPassword: { type: 'string' },
      newPassword: { type: 'string' },
    },
  },
});

class ChangePasswordService extends Service { 

    async appendPasswordToParams(params, ctx) {
        validateUtil.validate(paramsScheme.passwordReset, params);
        const app = this.app;
        const { jianghuKnex } = this.app;
        const { oldPassword, newPassword } = params;
        const { userInfo: { user: { userId } } } = this.ctx;
        const user = await jianghuKnex("_view01_user").where('userId', userId).first()
        const oldPasswordMd5 = this.encryptPassword(oldPassword, user.md5Salt);
        if (oldPasswordMd5 !== user.password) {
            throw new BizError(errorInfoEnum.user_password_reset_old_error);
        }
        if (user.clearTextPassword === newPassword) {
            throw new BizError(errorInfoEnum.user_password_reset_same_error);
        }
        const { encryptedPassword, md5Salt} = this.generatePassword(newPassword);
        ctx.request.body.appData.actionData = Object.assign({} , { clearTextPassword: newPassword, password: encryptedPassword, md5Salt: md5Salt });
        ctx.request.body.appData.where = { userId: userId };
    }

    encryptPassword(clearTextPassword, salt) {
        const encryptedPassword =  md5(`${clearTextPassword}_${salt}`);
        return encryptedPassword;
    }

    generatePassword(clearTextPassword) {
        const md5Salt = idGenerateUtil.randomString(12);
        const encryptedPassword = this.encryptPassword(clearTextPassword,md5Salt);
        return { encryptedPassword, md5Salt};
    }
}
 
module.exports = ChangePasswordService;