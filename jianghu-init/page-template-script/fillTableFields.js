/**
 * 重新排序_resource的id
 */

const Knex = require('knex')
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');
let eggConfigInfo;
try {
    eggConfigInfo = require('../config/config.local.js');
} catch (error) {
    eggConfigInfo = require('../config/config.prod.js');
}
const config = eggConfigInfo({baseDir: path.join(__dirname, '..')});
const knexConnection = config.knex.client.connection


async function main() { 
    const knex = Knex({ client: 'mysql', connection: knexConnection });
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const databaseName = knexConnection.database;
    let tables = await knex(`information_schema.tables`).where({ TABLE_SCHEMA: databaseName }).select();
    tables = tables
        .filter(table => !table.TABLE_NAME.startsWith('_') && table.TABLE_TYPE ==='BASE TABLE')
        .filter(table => !table.TABLE_NAME.includes('_copy'))
        .filter(table => !table.TABLE_NAME.includes('bak'))
        .filter(table => !table.TABLE_NAME.startsWith('__'))
        ;

    console.group("数据库信息");
    console.log(`host: ${knexConnection.host}`);
    console.log(`port: ${knexConnection.port}`);
    console.log(`user: ${knexConnection.user}`);
    console.log(`database: ${knexConnection.database}`);
    console.groupEnd();

    // 多选表
    const askForSelectTable = async () => {
      const answer = await inquirer.prompt({
        name: 'table',
        type: 'checkbox',
        message: 'Please select a table',
        choices: tables.map(table => table.TABLE_NAME),
        pageSize: tables.length + 1,
      });
      return answer.table;
    }
    const tableList = await askForSelectTable();
    // console.log('tableList', tableList);

    for (const table of tableList) {
      // const { TABLE_NAME } = table;
      // const result = await knex.select('COLUMN_NAME as columnName', 'COLUMN_COMMENT as columnComment').from('INFORMATION_SCHEMA.COLUMNS').where({
      //   TABLE_SCHEMA: databaseName,
      //   TABLE_NAME: table,
      // });

      const defaultColumn = [ 
        {name: 'operation', comment: '操作', default: 'insert'}, 
        {name: 'operationByUserId', comment: '操作人ID'}, 
        {name: 'operationByUser', comment: '操作人'}, 
        {name: 'operationAt', comment: '操作时间'} 
      ];
      for (const column of defaultColumn) {
        await knex.schema.hasColumn(table, column.name).then(exists => {
          if (!exists) {
            return knex.schema.table(table, t => {
              console.log(`创建依赖字段：${table} - ${column.name} ${column.comment}`);
              t.string(column.name).comment(column.comment || '');
            });
          }
        });
      }
    }

    await knex.destroy();
    rl.close();
}


main();