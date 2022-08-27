'use strict';

let knex = null;
let logger = null;
const { app, assert } = require('egg-mock/bootstrap');
let syncDatabase = null;

describe('test/controller/database.sync.util.js', () => {

  before(async () => {
    knex = app.knex;
    logger = app.logger;
    const { database } = app.config.knex.client.connection;
    syncDatabase = database;
    assert(knex);
    assert(logger);
  });

  /**
   * 注意：
   *  - config.unittest.js 中要使用 特殊的用户（用户有所有库的查询权限 和 data_repository的执行权限）; 目前先使用root用户
   */
  describe('database sync util', () => {


    /**
     * [mysql 触发器](https://www.cnblogs.com/phpper/p/7587031.html)
     * [mysql declare-handler](https://dev.mysql.com/doc/refman/5.7/en/declare-handler.html)
     */
    it('generate mysql trigger', async () => {
      const ctx = app.mockContext();
      await ctx.service.util.updateMysqlDataSyncTrigger();
    });

  });

});
