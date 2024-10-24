'use strict';

const path = require('path');

module.exports = appInfo => {

  return {
    appType: 'multiApp',
    appDirectoryLink: '/directory',
    authTokenKey: 'directory',
    loginPage: '/directory/page/login',
    wechat: {
      qyApiConfig: {
        // appId: '123',
        // appScrect: '123',
        // corpId: '123',
        // loginRedirectUri:'https://wxsg.foisongroup.com/directory/page/login'
      },
    },
    jiangHuConfig: {
      packageIdCheck: true,
      updateRequestDemoAndResponseDemo: false,
    },
    knex: {
      client: {
        dialect: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: '3306',
          user: 'root',
          password: '123456',
          database: '{{dbPrefix}}base_directory',
        },
        pool: { min: 0, max: 10 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
    },
    logger: {
      outputJSON: true,
      level: 'INFO',
      // level: 'DEBUG',
      // allowDebugAtProd: true,
      dir: path.join(appInfo.baseDir, 'logs'),
      contextFormatter(meta) {
        return `[${meta.date}] [${meta.level}] [${meta.ctx.method} ${meta.ctx.url}] ${meta.message}`;
      },
    },
  };
};
