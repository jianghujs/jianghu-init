'use strict';

const path = require('path');

module.exports = appInfo => {

  return {
    static: {
      maxAge: 0,
      buffer: false,
      preload: false,
      maxFiles: 0,
    },
    logger: {
      outputJSON: true,
      level: 'INFO',
      // level: 'DEBUG',
      // allowDebugAtProd: true,
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
          port: '3306',
          user: 'root',
          password: '123456',
          database: '__database__'
        },
        pool: { min: 0, max: 10 },
        acquireConnectionTimeout: 30000
      },
      app: true
    },
    duoxingBot: {
      server: "https://duoxing-v5.openjianghu.org",
      userId: "userId",
      password: "123456",
      serverAppId: "duoxing",
      deviceType: "bot_xiaochengxu",
      xiaochengxuIndexPage: "categoryManagement",
    },
  };
};
