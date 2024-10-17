'use strict';
const CommandBase = require('../../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const mixin = require('./mixin.js');
const InitPage = require('../init_page');
const nunjucks = require('nunjucks');

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitPage1Table extends CommandBase {

  constructor() {
    super();
    Object.assign(this, mixin);
  }

  async run(cwd, argv) {
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

    // generate crud
    await this.generateCrud();

    this.success('init crud is success');
  }

  /**
   * 生成 crud
   */
  async generateCrud() {
    this.info('开始生成 CRUD');
    const table = await this.promptTables('请输入你要生成 CRUD 的 table', '');
    if (!table) {
      this.info('未选择 table，流程结束');
      return;
    }

    this.info(`开始生成 ${table} 的 CRUD`);
    const tableCamelCase = _.camelCase(table);
    let pageId = `${tableCamelCase}Management`;
    pageId = await this.readlineMethod(`【${table}】数据表pageId`, pageId);
    // 生成 vue
    const content = await this.renderJson(table, pageId);
    // eslint-disable-next-line no-eval
    const jsConfig = eval(content);
    new InitPage().renderContent(jsConfig);
    this.success(`生成 ${table} 的 vue 文件完成`);
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
      name: 'table',
      type: 'list',
      message: '请选择你要生成 crud 的表',
      choices: tables,
      pageSize: 100,
    });
    return answer.table;
  }

  /**
   * 生成 vue
   */
  async renderJson(table, pageId) {
    const tableCamelCase = _.camelCase(table);
    // 写文件前确认是否覆盖
    const filepath = `./app/view/init-json/page/${pageId}.js`;
    if (fs.existsSync(filepath)) {
      const overwrite = await this.readlineMethod(`文件 ${filepath} 已经存在，是否覆盖?(y/N)`, 'n');
      if (overwrite !== 'y' && overwrite !== 'Y') {
        this.warning(`跳过 ${table} 表 CRUD 的生成`);
        return false;
      }
    }

    // 读取文件
    const templatePath = `${path.join(__dirname, '../../../')}page-template-json/template`;
    const fields = await this.getFields(table);
    this.info('表字段', fields);
    const pageType = 'jh-page';
    const pageName = `${pageId}页面`;
    const resourceList = this.getResourceList(pageType, pageId, table, []);
    const { pageContent, actionContent, tableStr, headContent } = this.getContentV2(table, pageId, pageType, fields, pageName);
    const replacements = {
      pageType,
      pageId,
      pageName: pageId + '页面',
      table,
      tableCamelCase,
    };

    // 使用正则表达式替换占位符
    let listTemplate = fs.readFileSync(`${templatePath}/crud.js`, 'utf-8').toString();
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
    const result = nunjucks.renderString(listTemplate, {
      pageType,
      pageId,
      pageName: pageId + '页面',
      table,
      resourceList,
      headContent,
      tableCamelCase,
      fields,
    });

    fs.writeFileSync(filepath, result.replace(/^\/\* eslint-disable \*\/\n/, ''));
    return result;
  }

};
