'use strict';

const path = require('path');

module.exports = appInfo => {

  return {
    pageHost: `http://localhost:7001/${appInfo.appId}/page/`,
   
    wecom: {
      // 企业号，见 https://developer.work.weixin.qq.com/document/path/90665#corpid
      corpId: '12345',
      // 应用的密钥，见 https://developer.work.weixin.qq.com/document/path/90665#secret
      corpSecret: '12345',
      // 应用 agentId
      agentId: '12345',
      apiHost: 'https://qyapi.weixin.qq.com',
    },
    appRootUrl: '',
    static: {
      maxAge: 0,
      buffer: false,
      preload: false,
      maxFiles: 0,
    },
    logger: {
      outputJSON: true,
      consoleLevel: 'DEBUG',
      level: 'DEBUG',
      dir: path.join(appInfo.baseDir, 'logs'),
      contextFormatter(meta) {
        return `[${meta.date}] [${meta.level}] [${meta.ctx.method} ${meta.ctx.url}] ${meta.message}`;
      }
    },
    knex: {
      client: {
        dialect: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: 3306,
          user: 'root',
          password: '123456',
          database: '{{dbPrefix}}base_task'
        },
        pool: { min: 0, max: 7 },
        acquireConnectionTimeout: 30000
      },
      app: true
    },
    tableRecipient: 'recipient',
  };

};
