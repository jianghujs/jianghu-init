'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/controller/database.util.js', () => {

  let knex = null;
  before(() => {
    knex = app.knex;
    assert(knex);
  });

  describe('util', () => {

    it('批量操作数据库', async () => {


      const databaseList = [
        '{{dbPrefix}}user_app_management',
        '{{dbPrefix}}directory',
        '{{dbPrefix}}data_repository',
      ];
      for (const database of databaseList) {
        const tableList = await knex('information_schema.TABLES')
          .where({ table_schema: database, table_type: 'BASE TABLE' }).orderBy('table_name', 'desc')
          .select('table_name as tableName');
        assert(tableList);
        await knex.raw(`use ${database};`);
        for (const tableItem of tableList) {
          const { tableName } = tableItem;
        }
      }
    });

  });


});
