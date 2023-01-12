'use strict';
const humps = require('humps');
const _ = require('lodash');
module.exports = {
  schedule: {
    //immediate: true, // 应用启动后触发
    cron: '0 0 3 * * *', // 每天 3 点执行
    type: 'worker', // worker: 只有一个worker执行
    disable: false,
    immediate: true
  },
  // 扫描所有符合条件的数据库、开头不是 _ 的表跳过
  async task (ctx) {
    let { knex, config: {knex: knexConfig }} = ctx.app;
    const connectConfig = _.cloneDeep(knexConfig);
    let [tableList] = await knex.raw(`
    SELECT 
      table_name as \`table\`,
      table_schema as \`database\`
    FROM 
      information_schema.tables 
    WHERE table_schema like 'jianghujs_hrm_%' AND table_type = 'base table'`);
    const defaultColumn = [ 'id', 'operation', 'operationByUserId', 'operationByUser', 'operationAt' ];
    
    
    for (const {table, database} of tableList) {
      connectConfig.client.connection.database = database;
      let knex = require('knex')({
        client: connectConfig.client.dialect,
        connection: connectConfig.client.connection,
      });
      if (table[0] === '_') continue;
      // rename column
      const columns = await knex(table).columnInfo();
      console.log('table---', table);
      for (const column in columns) {
        // columnInfo 默认不包含注释、如需添加需要手动改造
        /* 
         * \node_modules\knex\lib\dialects\mysql\query\mysql-querycompiler.js 125行
         * columns[val.COLUMN_NAME] = {
         *   defaultValue: val.COLUMN_DEFAULT,
         *   type: val.DATA_TYPE,
         *   maxLength: val.CHARACTER_MAXIMUM_LENGTH,
         *   nullable: val.IS_NULLABLE === 'YES',
         *   comment: val.COLUMN_COMMENT,
         * };
        */
        // const comment = columns[column].comment;
        // 字段包含 _ 则需要转换
        if (column.includes('_')) {
          try {
            await knex.schema.table(table, t => {
              const newColumn = humps.camelize(column);
              console.log(`rename 字段：${column}->${newColumn}`);
              // 重命名字段、knex 不支持重命名字段的注释
              // 如要重命名字段的注释，需要手动自定义改造 knex 的传参
              /*
               * \node_modules\knex\lib\dialects\mysql\schema\mysql-tablecompiler.js 65行:   
               * --------------------------------------------------------------------------------
               * renameColumn(field, comment) {
               *   const [from, to] = field.split(' to ');
               */
              /*
               * \node_modules\knex\lib\dialects\mysql\schema\mysql-tablecompiler.js 91行:  
               * -------------------------------------------------------------------------------- 
               * if (comment) { // Add the comment if there is one
               *   sql += ` COMMENT '${comment}'`;
               * } 
               */
              // t.renameColumn(column+ ' to ' +newColumn, comment);
              t.renameColumn(column, newColumn);
            });
          } catch (e) {
            console.log(e);
          }
        }
      }
      // add column
      for (const column of defaultColumn) {
        knex.schema.hasColumn(table, column).then(exists => {
          if (!exists) {
            return knex.schema.table(table, t => {
              console.log(`创建依赖字段：${table}->${column}`);
              if (column === 'id') {
                t.integer(column).first().comment('自增主键');
              } else {
                t.string(column);
              }
            });
          }
        });
      }
    }
    console.log('定时任务执行成功');
    
  }
};