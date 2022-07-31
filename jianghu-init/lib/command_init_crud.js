'use strict';
const yargs = require('yargs');
const CommandBase = require('./command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitCrudCommand extends CommandBase {

  async run(cwd, args) {
    const argv = this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;
    // console.log('%j', argv);

    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    // 如果是 multi，则切换到 user_app_management 获取前缀
    if (fs.existsSync('../user_app_management')) {
      const oldCwd = process.cwd();
      process.chdir('../user_app_management');
      this.dbPrefix = this.readDbPrefixFromFile();
      process.chdir(oldCwd);
      if (this.dbPrefix && this.app.startsWith(this.dbPrefix)) {
        this.app = this.app.slice(this.dbPrefix.length);
      }
    }
    await this.getKnex(this.dbSetting);
    this.success('初始化数据库连接成功');

    // generate crud
    await this.generateCrud();

    this.success('init crud is success');
  }

  /**
   * get argv parser
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('init jianghu crud .\nUsage: $0 crud')
      .options(this.getParserOptions())
      .alias('h', 'help')
      .help();
  }

  /**
   * get yargs options
   * @return {Object} opts
   */
  getParserOptions() {
    return {
      type: {
        type: 'string',
        description: 'boilerplate type',
      },
    };
  }

  /**
   * 生成 crud
   */
  async generateCrud() {
    this.info('开始生成 CRUD');
    const tables = await this.promptTables('请输入你要生成 CRUD 的 table', '');
    if (!tables || !tables.length) {
      this.info('未选择 table，流程结束');
      return;
    }
    for (const table of tables) {
      this.info(`开始生成 ${table} 的 CRUD`);
      const tableCamelCase = _.camelCase(table);
      let pageId = `${tableCamelCase}Management`;
      pageId = await this.readlineMethod(`【${table}】数据表pageId`, pageId);
      // 生成 vue
      if (await this.renderVue(table, pageId)) {
        this.success(`生成 ${table} 的 vue 文件完成`);
        
        // 数据库
        this.info(`开始生成 ${table} 的相关数据`);
        await this.modifyTable(table, pageId);
        this.success(`生成 ${table} 的相关数据完成`);
      }
    }
  }

  async modifyTable(table, pageId) {
    const knex = await this.getKnex();

    const templatePath = `${path.join(__dirname, '../')}template`;
    let sql = fs.readFileSync(`${templatePath}/crud.sql`).toString();

    sql = sql.replace(/\{\{pageId}}/g, pageId);
    sql = sql.replace(/\{\{table}}/g, table);
    // const appId = `${tableCamelCase}Management`;
    // sql = sql.replace(/\{\{appId}}/g, appId);
    // console.log(sql);

    for (const line of sql.split('\n')) {
      if (!line) {
        continue;
      }
      if (line.startsWith('--')) {
        this.info(`正在执行 ${line}`);
      } else {
        await knex.raw(line);
      }
    }
  }

  /**
   * 确认生成表
   */
  async promptTables() {
    const knex = await this.getKnex();

    const result = await knex.select('TABLE_NAME').from('INFORMATION_SCHEMA.TABLES').where({
      TABLE_SCHEMA: this.dbSetting.database,
      TABLE_TYPE: 'BASE TABLE',
    });
    const tables = result.map(item => item.TABLE_NAME).filter(table => !table.startsWith('_'));
    const answer = await inquirer.prompt({
      name: 'tables',
      type: 'checkbox',
      message: '请选择你要生成 crud 的表',
      choices: tables,
      pageSize: 100,
    });
    console.log(answer);
    return answer.tables;
  }

  /**
   * 生成 vue
   */
  async renderVue(table, pageId) {
    const tableCamelCase = _.camelCase(table);
    // 写文件前确认是否覆盖
    const filepath = `./app/view/page/${pageId}.html`;
    if (fs.existsSync(filepath)) {
      const overwrite = await this.readlineMethod(`文件 ${filepath} 已经存在，是否覆盖?(y/N)`, 'n');
      if (overwrite !== 'y' && overwrite !== 'Y') {
        this.warning(`跳过 ${table} 表 CRUD 的生成`);
        return false;
      }
    }

    // 读取文件
    const templatePath = `${path.join(__dirname, '../')}template`;
    let listTemplate = fs.readFileSync(`${templatePath}/crud.html.njk`).toString();
    // 为了方便 ide 渲染，在模板里面约定 //===// 为无意义标示
    listTemplate = listTemplate.replace(/\/\/===\/\//g, '');

    // 生成 vue
    nunjucks.configure(`${templatePath}/crud.html.njk`, {
      tags: {
        blockStart: '<=%',
        blockEnd: '%=>',
        variableStart: '<=$',
        variableEnd: '$=>',
      },
    });
    const fields = await this.getFields(table);
    this.info('表字段', fields);
    const result = nunjucks.renderString(listTemplate, {
      table,
      tableCamelCase,
      pageId,
      fields,
    });

    fs.writeFileSync(filepath, result);
    return true;
  }

  /**
   * 获取表字段
   */
  async getFields(table) {
    const knex = await this.getKnex();
    const result = await knex.select('COLUMN_NAME', 'COLUMN_COMMENT').from('INFORMATION_SCHEMA.COLUMNS').where({
      TABLE_SCHEMA: this.dbSetting.database,
      TABLE_NAME: table,
    });

    const defaultColumn = [ 'operation', 'operationByUserId', 'operationByUser', 'operationAt' ];
    for (const column of defaultColumn) {
      await knex.schema.hasColumn(table, column).then(exists => {
        if (!exists) {
          return knex.schema.table(table, t => {
            this.info(`创建依赖字段：${column}`);
            t.string(column);
          });
        }
      });
    }

    return result.filter(column => {
      return ![...defaultColumn, 'id'].includes(column.COLUMN_NAME);
    }).map(column => {
      return {
        COLUMN_NAME: column.COLUMN_NAME,
        COLUMN_COMMENT: column.COLUMN_COMMENT || column.COLUMN_NAME,
      };
    });
  }

};
