'use strict';

const path = require('path');

module.exports = appInfo => {

  return {
    appDirectoryLink: 'http://127.0.0.1:7007/directory',
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
          database: '{{dbPrefix}}user_app_management',
        },
        pool: { min: 0, max: 100 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
    },
  };

};
