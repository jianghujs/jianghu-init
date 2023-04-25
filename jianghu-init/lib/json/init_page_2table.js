'use strict';
const yargs = require('yargs');
const CommandBase = require('../command_base');

require('colors');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');
const moment = require('moment');

/**
 * 根据 table 定义生成 crud 页面（3 table）
 */
module.exports = class InitPage2Table extends CommandBase {

  async run(cwd, jsonArgv) {
    this.cwd = cwd;
    const {  tableAInfo, tableBInfo } = jsonArgv;
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
    await this.generateCrud({ tableAInfo, tableBInfo });

    this.success('init crud is success');
  }

  /**
   * 生成 crud
   */
  async generateCrud({ tableAInfo, tableBInfo }) {
    this.info('开始生成 CRUD');
    const { table: tableA, name: nameA, primaryField: primaryFieldA } = tableAInfo;
    const { table: tableB, name: nameB, primaryField: primaryFieldB } = tableBInfo;
    if (!tableA || !tableB) {
      this.info('未配置 table，流程结束');
      return;
    }
    this.info(`开始生成 ${tableA} 的 CRUD`);

    // 生成 vue
    const baMiddlePageId = `${_.camelCase(tableB)}ManagementOfOne${_.upperFirst(_.camelCase(tableA))}`;
    if (await this.renderVue('table-a-page.html.njk', 'a_crud.sql', _.camelCase(tableA) + 'Management', { tableA, nameA, tableB, nameB, table: tableA, middlePageId: baMiddlePageId, primaryFieldA, primaryFieldB, title: nameA })) {
      this.success(`生成 ${tableA} 的 vue 文件完成`);
    }
    if (await this.renderVue('table-b-page.html.njk', 'b_crud.sql', baMiddlePageId, { tableB, nameB, tableA, nameA, table: tableB, primaryFieldA, primaryFieldB, title: baMiddlePageId, tableMiddle: tableB, tableView: tableB })) {
      this.success(`生成 ${baMiddlePageId} 的 vue 文件完成`);
    }
  }

  /**
   * 生成 vue
   */
  async renderVue(template, sqlTemplate, pageId, renderContext = {}) {
  // 写文件前确认是否覆盖
    const filepath = `./app/view/page/${pageId}.html`;
    if (fs.existsSync(filepath)) {
      const isBackUp = await this.readlineMethod(`文件 ${filepath} 已经存在，是否覆盖?(y/N)`, 'n');
      if (['y', 'Y'].includes(isBackUp)) {
        const bakPath = `./app/view/page/${pageId}-bak`;
        if (!fs.existsSync(bakPath)) fs.mkdirSync(bakPath);
        const backFilePath = `${bakPath}/${pageId}.html.${moment().format('YYYYMMDDHHmmss')}`;
        fs.copyFileSync(filepath, backFilePath);
      }
    }

    // 读取文件
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/2table-page`;
    let listTemplate = fs.readFileSync(`${templatePath}/${template}`).toString();
    // 为了方便 ide 渲染，在模板里面约定 //===// 为无意义标示
    listTemplate = listTemplate.replace(/\/\/===\/\//g, '');

    // 生成 vue
    nunjucks.configure(`${templatePath}/${template}`, {
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
    // 生成 vue
    let result = nunjucks.renderString(listTemplate, context);

    // 生成 table
    await this.modifyTable(templatePath, sqlTemplate, context)

    // 写入文件
    fs.writeFileSync(filepath, result);
    return true;
  }

  /**
   * @param {*} templatePath
   * @param {*} sqlTemplate
   * @param {*} context
   * @returns
   * @memberof InitPage2Table
   **/
  async modifyTable(templatePath, sqlTemplate, context) {
    const knex = await this.getKnex();

    nunjucks.configure(`${templatePath}/${sqlTemplate}`, {
      tags: {
        blockStart: '<=%',
        blockEnd: '%=>',
        variableStart: '<=$',
        variableEnd: '$=>',
      },
    });
    let sqlListTemplate = fs.readFileSync(`${templatePath}/${sqlTemplate}`).toString();
    let sql = nunjucks.renderString(sqlListTemplate, context);

    // 插入数据
    for (const line of sql.split('\n')) {
      if (!line) continue;
      if (line.startsWith('--')) {
        this.info(`正在执行插入/更新 ${line}`);
      } else {
        await knex.raw(line);
      }
    }
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
