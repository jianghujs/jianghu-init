'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================

const { QyOauthApi } = require('tnwx');
const { BizError } = require('@jianghujs/jianghu/app/constant/error');
const { errorInfoEnum } = require('@jianghujs/jianghu/app/constant/error');
const { errorInfoEnum: customErrorInfoEnum } = require('../constant/error');

const actionDataScheme = Object.freeze({
  login: {
    type: 'object',
    additionalProperties: true,
    properties: {
      code: { type: 'string' },
      deviceId: { type: 'string' },
      deviceType: { type: 'string' },
      userAgent: { type: 'string' },
    },
  }
});

class WecomService extends Service {
  async getOauthUrl() {
    const { ctx } = this;
    const { wechat } = this.app.config;
    if (this.isWorkWechatEnv && wechat) {
    const { qyApiConfig } = wechat;
      const redirectUri = qyApiConfig.loginRedirectUri;
      return QyOauthApi.getAuthorizeUrl(qyApiConfig.corpId, redirectUri, "");
    }
    // return QyOauthApi.getAuthorizeUrl(qyApiConfig.corpId, "currentPageUrl", "");
  }

  async isWorkWechatEnv() {
    //获取user-agaent标识头
    var ua = window.navigator.userAgent.toLowerCase();
    //判断ua和微信浏览器的标识头是否匹配
    if ((ua.match(/micromessenger/i) == 'micromessenger') && (ua.match(/wxwork/i) == 'wxwork')) {
      return true;
    } else {
      return false;
    }
  }

  async autoOauth() {
    const { ctx } = this;
    const { code } = ctx.request.query;
    const userAgent = ctx.request.header['user-agent'];
    // 查询用户设备如果是在企业微信打开则自动跳转
    if (!code && userAgent.indexOf('MicroMessenger') > -1) {
      const oauthUrl = await this.getOauthUrl();
      // ctx.redirect(oauthUrl);
    }
  }
  // 登录
  async login() {
    const app = this.app;
    const { jianghuKnex } = app;
    const { appId } = app.config;
    const { actionData } = this.ctx.request.body.appData;
    validateUtil.validate(actionDataScheme.login, actionData);

    const { code, deviceId, deviceType, userAgent, needSetCookies = true } = actionData;

    // 微信登录
    const sessionResult = await QyOauthApi.getUserInfo(code);
    const { errcode, UserId: qiweiId } = sessionResult;
    if (errcode != 0) {
      throw new BizError(customErrorInfoEnum.wecom_login_error);
    }
    const userExistCountResult = await jianghuKnex('_view01_user', this.ctx).where({ qiweiId }).count('*', { as: 'count' });
    const userExistCount = userExistCountResult[0].count;
    if (userExistCount == 0) {
      throw new BizError(errorInfoEnum.user_not_exist);
    }
    let user = await jianghuKnex('_view01_user', this.ctx)
      .where({ qiweiId })
      .first();

    const { userId, userType } = user
    const authToken = await this.generateAuthToken(userId, deviceId, deviceType, userAgent)
    
    // 设置 cookies，用于 page 鉴权
    if (needSetCookies) {
      console.log("cookie", authToken);
      this.ctx.cookies.set(`${appId}_authToken`, authToken, {
        httpOnly: false,
        signed: false,
        maxAge: 1000 * 60 * 60 * 24 * 1080,
      }); // 1080天
    }

    return { authToken, deviceId, userId, userType };
  }

  async generateAuthToken(userId, deviceId, deviceType, userAgent) {
    const app = this.app;
    const { jianghuKnex } = app;

    const authToken = idGenerateUtil.uuid(36);
    // 存session 的目的是为了
    //   1. 系统可以根据这个判断是否是自己生成的token
    //   2. 有时候系统升级需要 用户重新登陆/重新登陆，这时候可以通过清理旧session达到目的
    const userSession = await jianghuKnex('_user_session')
      .where({ userId, deviceId })
      .first();

    const userIp = this.ctx.header['x-real-ip'] || this.ctx.request.ip || '';
    let userIpRegion = '';

    if (userSession && userSession.id) {
      await jianghuKnex('_user_session', this.ctx)
        .where({ id: userSession.id })
        .jhUpdate({ authToken, deviceType, userAgent, userIp, userIpRegion });
    } else {
      await jianghuKnex('_user_session', this.ctx).jhInsert({
        userId,
        deviceId,
        userAgent,
        userIp,
        userIpRegion,
        deviceType,
        authToken
      });
    }

    return authToken;
  }

  // 更新微信用户名
}

module.exports = WecomService;
