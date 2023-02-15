'use strict';

const path = require('path');

module.exports = appInfo => {

  return {
    appDirectoryLink: 'https://panshi.openjianghu.org',
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
          database: '{{dbPrefix}}directory',
        },
        pool: { min: 0, max: 100 },
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
