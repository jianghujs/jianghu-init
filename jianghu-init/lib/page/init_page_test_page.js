'use strict';
const yargs = require('yargs');
const CommandBase = require('../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');

/**
 * 根据 table 定义生成 testPage 页面
 */
module.exports = class InitPageTestPage extends CommandBase {

  async run(cwd, args) {
    this.cwd = cwd;

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

    // generate testPage
    await this.generateCrud();

    this.success('init testPage is success');
  }

  /**
   * 生成 testPage
   */
  async generateCrud() {
    this.info('开始生成 testPage');
    const tables = await this.promptTables('请输入你要生成 testPage 的 table', '');
    if (!tables || !tables.length) {
      this.info('未选择 table，流程结束');
      return;
    }
    for (const table of tables) {
      this.info(`开始生成 ${table} 的 testPage`);
      // 生成 vue
      if (await this.renderVue(table)) {
        this.success(`生成 ${table} 的 vue 文件完成`);

        // 数据库
        this.info(`开始生成 ${table} 的相关数据`);
        await this.modifyTable(table);
        this.success(`生成 ${table} 的相关数据完成`);
      }
    }
  }

  async modifyTable(table) {
    const knex = await this.getKnex();

    const templatePath = `${path.join(__dirname, '../../')}page-template`;
    let sql = fs.readFileSync(`${templatePath}/testPage.sql`).toString();

    // 替换一些变量
    const tableCamelCase = _.camelCase(table);
    const pageId = `${tableCamelCase}TestPage`;
    sql = sql.replace(/\{\{pageId}}/g, pageId);
    sql = sql.replace(/\{\{table}}/g, table);
    // const appId = `${tableCamelCase}TestPage`;
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
      message: '请选择你要生成 testPage 的表',
      choices: tables,
      pageSize: 100,
    });
    console.log(answer);
    return answer.tables;
  }

  /**
   * 生成 vue
   */
  async renderVue(table) {
    const tableCamelCase = _.camelCase(table);
    // 写文件前确认是否覆盖
    const filepath = `./app/view/page/${tableCamelCase}TestPage.html`;
    const pageId = `${tableCamelCase}TestPage`;
    if (fs.existsSync(filepath)) {
      const overwrite = await this.readlineMethod(`文件 ${filepath} 已经存在，是否覆盖?(y/N)`, 'n');
      if (overwrite !== 'y' && overwrite !== 'Y') {
        this.warning(`跳过 ${table} 表 testPage 的生成`);
        return false;
      }
    }

    // 读取文件
    const templatePath = `${path.join(__dirname, '../../')}page-template`;
    let listTemplate = fs.readFileSync(`${templatePath}/testPage.html.njk`).toString();
    // 为了方便 ide 渲染，在模板里面约定 //===// 为无意义标示
    listTemplate = listTemplate.replace(/\/\/===\/\//g, '');

    // 生成 vue
    nunjucks.configure(`${templatePath}/testPage.html.njk`, {
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
    return result.filter(column => {
      return !['id', 'operation', 'operationByUserId', 'operationByUser', 'operationAt'].includes(column.COLUMN_NAME);
    }).map(column => {
      return {
        COLUMN_NAME: column.COLUMN_NAME,
        COLUMN_COMMENT: column.COLUMN_COMMENT || column.COLUMN_NAME,
      };
    });
  }

};
