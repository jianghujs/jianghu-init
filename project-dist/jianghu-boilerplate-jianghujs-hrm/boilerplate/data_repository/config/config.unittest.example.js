'use strict';

const assert = require('assert');

module.exports = appInfo => {

  assert(appInfo);
  return {
    dataSyncStatus: '禁用',
    knex: {
      client: {
        dialect: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: '3306',
          user: 'root',
          password: '123456',
          database: 'jianghujs_hrm_data_repository',
        },
        pool: { min: 0, max: 100 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
    },
  };

};
