'use strict';

const Knex = require("knex");
let knex = null;
let jianghuKnex = null;
let logger = null;
const { app, assert } = require('egg-mock/bootstrap');
const hyperDiff = require('@jianghujs/jianghu/app/common/hyperDiff');
let syncDatabase = null;

describe('test/controller/database.sync.util.js', () => {

  before(async () => {
    knex = app.knex;
    jianghuKnex = app.jianghuKnex;
    logger = app.logger;
    const { database } = app.config.knex.client.connection;
    syncDatabase = database;
    assert(knex);
    assert(logger);
  })

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
      // const ctx = app.mockContext();
      // await ctx.service.util.updateMysqlDataSyncTrigger();
    })

    // it('crud test', async () => {
    //   for (let index = 0; index < 3000; index++) {
    //     await knex('zhiyuan_v6_user_app_management.test').insert({ testId: `${index}`, content: `${index}`, desc: `${index}` });
    //   }
    // }).timeout(600000);

    // it('hyperDiff test', async () => {
    //   const repositoryConnection = { ...app.config.knex.client.connection, database: 'zhiyuan_v6_data_repository' };
    //   const repositoryTable = 'zhiyuan_v6_user_app_management__test';
    //   const applicationConnection = { ...app.config.knex.client.connection, database: 'zhiyuan_v6_user_app_management' };
    //   const applicationTable = 'test';
    //   const result = await hyperDiff({
    //     oldDatabaseConnectionConfig: repositoryConnection,
    //     oldTable: repositoryTable,
    //     newDatabaseConnectionConfig: applicationConnection,
    //     newTable: applicationTable,
    //     splitCount: 2,
    //     stopThreshold: 10,
    //     ignoreColumns: [
    //       'operation',
    //       'operationByUserId',
    //       'operationByUser',
    //       'operationAt',
    //     ],
    //   });
    //   console.log('result', JSON.stringify(result, null, ' '));
    //   const { added, removed, changed } = result;
    //   if (added.length > 0) {
    //     await Knex({ client: 'mysql', connection: repositoryConnection })
    //       (repositoryTable).insert(added);
    //   }

    //   if (removed.length > 0) {
    //     const idList = removed.map(item => item.id);
    //     await Knex({ client: 'mysql', connection: repositoryConnection })
    //       (repositoryTable).whereIn('id', idList).delete();
    //   }

    //   if (changed.length > 0) {
    //     for (const item of changed) {
    //       const { id, ...updateParam } = item.new;
    //       await Knex({ client: 'mysql', connection: repositoryConnection })
    //         (repositoryTable).where({ id }).update(updateParam);
    //     }
    //   }
    // }).timeout(60000);
  })

})
