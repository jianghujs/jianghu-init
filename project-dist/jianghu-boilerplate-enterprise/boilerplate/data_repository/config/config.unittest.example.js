'use strict';

module.exports = appInfo => {

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
          database: '{{dbPrefix}}data_repository',
        },
        pool: { min: 0, max: 100 },
        acquireConnectionTimeout: 30000,
      },
      app: true,
    },
  };

};
