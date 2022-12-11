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
 * 根据 table 定义生成 crud 页面（3 table）
 */
module.exports = class InitPagePublic extends CommandBase {

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
    await this.generateCrud(argv);

    this.success('init crud is success');
  }

  /**
   * 生成 crud
   */
  async generateCrud({ pageId: defaultPageId, path, queryPageId = true }) {

    this.info('开始生成 CRUD');
    let pageId = defaultPageId;
    if (queryPageId) {
      pageId = (await inquirer.prompt({
        name: 'pageId',
        type: 'input',
        message: 'Please input pageId',
        default: defaultPageId,
      })).pageId;
    }
    if (!pageId) {
      this.info('为输入page，流程结束');
      return;
    }
    this.info(`开始生成 ${pageId} 的 CRUD`);

    // 生成 vue
    if (await this.renderVue(path, pageId, { pageId })) {
      this.success(`生成 ${pageId} 的 vue 文件完成`);
    }
    // 生成 sql
    if (await this.renderSql(path, { pageId })) {
      this.success(`生成 ${pageId} 的 sql 文件完成`);
    }
    // 生成 service
    if (await this.renderService(path, { pageId })) {
      this.success(`生成 ${pageId} 的 service 文件完成`);
    }
  }

  /**
   * 生成 vue
   */
  async renderVue(dirPath, pageId, renderContext = {}) {
  // 写文件前确认是否覆盖
    const filepath = `./app/view/page/${pageId}.html`;
    if (fs.existsSync(filepath)) {
      const overwrite = await this.readlineMethod(`文件 ${filepath} 已经存在，是否覆盖?(y/N)`, 'n');
      if (overwrite !== 'y' && overwrite !== 'Y') {
        this.warning(`跳过 ${filepath} 的生成`);
        return false;
      }
    }

    // 读取文件
    const templatePath = `${path.join(__dirname, '../../')}page-template`;
    let listTemplate = fs.readFileSync(`${templatePath}/${dirPath}/init.html`).toString();
    // 为了方便 ide 渲染，在模板里面约定 //===// 为无意义标示
    listTemplate = listTemplate.replace(/\/\/===\/\//g, '');

    // 生成 vue
    nunjucks.configure(`${templatePath}/${dirPath}/init.html`, {
      tags: {
        blockStart: '<=%',
        blockEnd: '%=>',
        variableStart: '<=$',
        variableEnd: '$=>',
      },
    });
    const context = {
      pageId,
    };
    for (const key of Object.keys(renderContext)) {
      const value = renderContext[key];
      context[key] = value;
      context[key + 'CamelCase'] = _.camelCase(value);
      if (key.startsWith('table')) {
        context[key + 'Fields'] = await this.getFields(value);
      }
    }
    // console.log('context', context);
    let result = nunjucks.renderString(listTemplate, context);

    result = result.replace(/<!--SQL START([\s\S]*)SQL END!-->/, '');
    fs.writeFileSync(filepath, result);
    return true;
  }

  /**
   * 生成 vue
   */
  async renderSql(dirPath, { pageId }) {
    const templatePath = `${path.join(__dirname, '../../')}page-template`;
    if (fs.existsSync(`${templatePath}/${dirPath}/init.sql`)) {
      let sql = fs.readFileSync(`${templatePath}/${dirPath}/init.sql`).toString();
      if (sql) {
        sql = sql.replace(/\{\{pageId}}/g, pageId);
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
            await this.knex.raw(line);
          }
        }
        return true;
      }
    }
    return false;
  }

  /**
   * 生成 service
   */
  async renderService(dirPath, { pageId }) {
    const templatePath = `${path.join(__dirname, '../../')}page-template`;
    if (fs.existsSync(`${templatePath}/${dirPath}/service.js`)) {
      let service = fs.readFileSync(`${templatePath}/${dirPath}/service.js`).toString();
      if (service) {
        service = service.replace(/\{\{pageId}}/g, pageId.slice(0, 1).toUpperCase() + pageId.slice(1));
        const servicePath = `./app/service/${pageId}.js`;
        if (fs.existsSync(servicePath)) {
          const overwrite = await this.readlineMethod(`文件 ${servicePath} 已经存在，是否覆盖?(y/N)`, 'n');
          if (overwrite !== 'y' && overwrite !== 'Y') {
            this.warning(`跳过 ${servicePath} 的生成`);
            return false;
          }
        }

        fs.writeFileSync(servicePath, service);
        return true;
      }
    }
    return false;
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
      return ![ ...defaultColumn, 'id' ].includes(column.COLUMN_NAME);
    }).map(column => {
      return {
        COLUMN_NAME: column.COLUMN_NAME,
        COLUMN_COMMENT: column.COLUMN_COMMENT || column.COLUMN_NAME,
      };
    });
  }

};
