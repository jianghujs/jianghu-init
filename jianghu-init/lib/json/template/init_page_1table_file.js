'use strict';
const CommandBase = require('../../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const InitPage = require('../init_page');
const nunjucks = require('nunjucks');

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitPage1TableFile extends CommandBase {

  async run(cwd, argv) {
    this.cwd = cwd;

    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    // 如果是 multi，则切换到 user_app_management 获取前缀
    const enterPriseV1 = fs.existsSync('../user_app_management');
    const enterPriseV2 = fs.existsSync('../base-system');
    if (enterPriseV1 || enterPriseV2) {
      const oldCwd = process.cwd();
      const systemDir = enterPriseV1 ? 'user_app_management' : 'base-system';
      process.chdir('../' + systemDir);
      this.dbPrefix = this.readDbPrefixFromFile();
      process.chdir(oldCwd);
      if (this.dbPrefix && this.app.startsWith(this.dbPrefix)) {
        this.app = this.app.slice(this.dbPrefix.length);
      }
    }
    await this.getKnex(this.dbSetting);
    this.notice('初始化数据库连接成功');

    // generate crud
    await this.generateCrud();

    this.success('init crud is success');
  }

  /**
   * 生成 crud
   */
  async generateCrud() {
    this.notice('开始生成 CRUD...');
    const table = await this.promptTables('请输入你要生成 CRUD 的 table', '');
    if (!table) {
      this.info('未选择 table，流程结束');
      return;
    }
    const field = await this.promptFields(table);
    if (!field) {
      this.info('未选择文件路径字段，流程结束');
      return;
    }

    this.notice(`开始生成 ${table} 的 CRUD...`);
    const tableCamelCase = _.camelCase(table);
    let pageId = `${tableCamelCase}Management`;
    pageId = await this.readlineMethod(`【${table}】数据表pageId`, pageId);
    // 生成 vue
    const content = await this.renderJson(table, pageId, field);
    // eslint-disable-next-line no-eval
    const jsConfig = eval(content);
    new InitPage().renderContent(jsConfig);
    this.success(`生成 ${table} 的 vue 文件完成`);
  }

  async modifyTable(table, pageId) {

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
    return answer.table || '';
  }

  /**
   * 确认生成表
   */
  async promptFields(tableName) {
    const knex = await this.getKnex();

    const result = await knex.raw(`SHOW COLUMNS FROM ${tableName}`);
    const fields = result[0].map(item => item.Field).filter(field => !['id', 'operationAt', 'operation', 'operationByUserId', 'operationByUser'].includes(field));
    const answer = await inquirer.prompt({
      name: 'field',
      type: 'list',
      message: `请选择 ${tableName} 表内的文件路径字段`,
      choices: fields,
      pageSize: 100,
    });
    return answer.field || '';
  }

  /**
   * 生成 vue
   */
  async renderJson(table, pageId, field) {
    const tableCamelCase = _.camelCase(table);
    // 写文件前确认是否覆盖
    const filepath = `./app/view/init-json/page/${pageId}.js`;
    if (fs.existsSync(filepath)) {
      const overwrite = await this.readlineMethod(`文件 ${filepath} 已经存在，是否覆盖?(y/N)`, 'n');
      if (overwrite !== 'y' && overwrite !== 'Y') {
        this.warning(`跳过 ${table} 表 CRUD 的生成`);
        return false;
      }
    } else {
      fs.mkdirSync('./app/view/init-json/page/', { recursive: true });
    }

    // 读取文件
    const templatePath = `${path.join(__dirname, '../../../')}page-template-json/template`;
    const fields = await this.getFields(table);
    // this.info('表字段', fields);
    const pageType = 'jh-page';

    // 读取文件
    let listTemplate = fs.readFileSync(`${templatePath}/1table-file.js`).toString();
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
      tableCamelCase,
      fields,
      fileField: field,
    });

    fs.writeFileSync(filepath, result.replace(/^\/\* eslint-disable \*\/\n/, ''));
    return result;
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

    const defaultColumn = ['operation', 'operationByUserId', 'operationByUser', 'operationAt'];
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
        COLUMN_COMMENT: (column.COLUMN_COMMENT || column.COLUMN_NAME || '').split(';')[0].split('；')[0].split(':')[0],
      };
    });
  }

};
