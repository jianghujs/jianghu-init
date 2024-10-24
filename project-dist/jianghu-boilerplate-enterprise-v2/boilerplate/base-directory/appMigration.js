'use strict';
const _ = require('lodash');

// 解析命令行参数为对象
function parseCommandLineArgs(args) {
  const parsedArgs = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      if (key && value !== undefined) {
        parsedArgs[key] = value;
      }
    }
  }
  return parsedArgs;
}
const commandLineArgs = parseCommandLineArgs(process.argv.slice(2));

// 获取环境变量
const env = commandLineArgs.env || 'local';
const targetDatabase = commandLineArgs.target;
const selfDatabase = commandLineArgs.self;

if (!targetDatabase || !selfDatabase) {
  console.log(`must to set target and self database, exit. 
--------------
example command: node appMigration.js --env=prod --target=target_database --self=database
database info found in config/config.{env}.js
jianghuConfig found in config/config.default.js
`);
  process.exit(0);
}

if (targetDatabase === selfDatabase) {
  console.log('target database is same as self database, exit.');
  process.exit(0);
}

const configFile = require('./config/config.' + env)({baseDir: ''});
const defaultConfigFile = require('./config/config.default')({baseDir: ''});
// 获取egg config local 环境的 knex 配置
const currentKnexConfig = configFile.knex.client;
const targetKnexConfig = _.cloneDeep(currentKnexConfig);
currentKnexConfig.connection.database = selfDatabase;
targetKnexConfig.connection.database = targetDatabase;
const jhId = defaultConfigFile.jianghuConfig.jhIdConfig.jhId;

// 获取默认支持jhId的表
const careTableViewList = defaultConfigFile.jianghuConfig.jhIdConfig.careTableViewList;

// 如果数据库相同，直接退出
if (currentKnexConfig.connection.database === targetKnexConfig.connection.database) {
  console.log('same database, exit.');
  process.exit(0);
}

const currentKnex = require('knex')(currentKnexConfig);
const targetKnex = require('knex')(targetKnexConfig);

async function createTable() {
  // 查出current所有 _ 开头的表
  const currentTables = await currentKnex.raw('show tables');
  const currentTableNames = _.compact(currentTables[0].map(item => item[`Tables_in_${currentKnexConfig.connection.database}`]));
  // 过滤掉 careTableViewList 中没有的表
  const currentTableNamesFiltered = currentTableNames.filter(tableName => careTableViewList.includes(tableName));
  
  // 查出target所有 _ 开头的表
  const targetTables = await targetKnex.raw('show tables');
  const targetTableNames = _.compact(targetTables[0].map(item => item[`Tables_in_${targetKnexConfig.connection.database}`]));

  // 循环判断 target 内相应的table是否存在，不存在则按照当前结构创建
  for (const tableName of currentTableNamesFiltered) {
    if (!targetTableNames.includes(tableName)) {
      // 不存在则创建 并复制现有数据
      const createTableSql = await currentKnex.raw(`show create table ${tableName}`);
      const createTableSqlStr = createTableSql[0][0]['Create Table'];
      await targetKnex.raw(createTableSqlStr);
      // 重置自增id
      await targetKnex.raw(`ALTER TABLE ${tableName} AUTO_INCREMENT=1;`);
      console.log(`Table ${tableName} created successfully.`);
    }
    const exists = await targetKnex.schema.hasColumn(tableName, 'jhId');
    if (!exists) {
      await targetKnex.schema.table(tableName, (table) => {
        table.string('jhId', 255).after('id');
      });

      if (tableName === '_user') {
        const indexList = await targetKnex.raw(`SHOW INDEX FROM ${tableName}`);
        // 删除非 PRIMARY 的所有索引
        for (const index of indexList[0]) {
          if (index.Key_name !== 'PRIMARY') {
            await targetKnex.raw(`ALTER TABLE ${tableName} DROP INDEX ${index.Key_name};`);
          }
        }
        
        // 添加两个新的唯一索引，1. jhId + username 2. jhId + userId
        await targetKnex.raw(`ALTER TABLE ${tableName} ADD UNIQUE INDEX username_index (jhId, username);`);
        await targetKnex.raw(`ALTER TABLE ${tableName} ADD UNIQUE INDEX userId_index (jhId, userId);`);
      }

      if (tableName == '_page') {
        const pageFileExists = await targetKnex.schema.hasColumn(tableName, 'pageFile');
        if (!pageFileExists) {
          await targetKnex.schema.table(tableName, (table) => {
            table.string('pageFile', 255).after('pageId');
          });
        }
      }
      console.log(`Column jhId added successfully.`);
    } else {
      console.log('Column already exists.');
    }
    
    if (await targetKnex(tableName).where({jhId}).first()) {
      console.log(`table ${tableName} already has jhId ${jhId}`);
      continue;
    }
    if (!['_record_history', '_resource_request_log', '_user_session'].includes(tableName)) {
      // 复制数据
      const currentTableData = await currentKnex(tableName).select();
      currentTableData.length && await targetKnex(tableName).insert(currentTableData.map(item => {
          if (!item.jhId) {
            item.jhId = jhId;
          }

          if (tableName === '_page') {
            if (item.pageId == 'login') {
              item.pageFile = 'loginV4';
            }
            if (item.pageId == 'help') {
              item.pageFile = 'helpV4';
            }
            
          }
          delete item.id;
          return item;
        }
      ));
      console.log(`Table ${tableName} data copied successfully.`);
    }
  }
}

createTable();


