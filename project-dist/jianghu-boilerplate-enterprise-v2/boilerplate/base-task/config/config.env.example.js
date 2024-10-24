'use strict';

const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../../.env')});

module.exports = appInfo => {

  return {
    // appType: 'multiApp',
    // appDirectoryLink: '/directory',
    // authTokenKey: 'directory',
    // loginPage: '/directory/page/login',
    jiangHuConfig: {
      packageIdCheck: false,
      updateRequestDemoAndResponseDemo: false,
      enableUserInfoCache: true,
      userInfoCacheRefreshInterval: '10s',
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
    knex: {
      client: {
        dialect: 'mysql',
        connection: {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: '{{dbPrefix}}base_task',
        },
        pool: { min: 0, max: 10 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
    },
  };
};
