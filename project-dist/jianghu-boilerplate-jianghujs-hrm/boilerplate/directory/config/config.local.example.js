'use strict';

const assert = require('assert');
const path = require('path');

module.exports = appInfo => {

  assert(appInfo);
  return {
    appDirectoryLink: 'http://127.0.0.1:7007/directory',
    debug: true,
    jiangHuConfig: {
      packageIdCheck: false,
      updateRequestDemoAndResponseDemo: true,
    },
    logger: {
      outputJSON: true,
      consoleLevel: 'DEBUG',
      level: 'DEBUG',
      dir: path.join(appInfo.baseDir, 'logs'),
      contextFormatter(meta) {
        return `[${meta.date}] [${meta.level}] [${meta.ctx.method} ${meta.ctx.url}] ${meta.message}`;
      },
    },
    knex: {
      client: {
        dialect: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: 3306,
          user: 'root',
          password: '123456',
          database: 'jianghujs_hrm_directory',
        },
        pool: { min: 0, max: 100 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
    },
  };

};
