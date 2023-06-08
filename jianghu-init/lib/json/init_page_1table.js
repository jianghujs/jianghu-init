'use strict';
const yargs = require('yargs');
const CommandBase = require('../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const moment = require('moment');
const path = require('path');

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitPage1Table extends CommandBase {

  async run(cwd, jsonArgv) {
    this.cwd = cwd;
    const { pageType, table, basicConfig, feature } = jsonArgv;
    if (!feature.create) feature.create = {enable: false};
    if (!feature.update) feature.update = {enable: false};
    if (!feature.delete) feature.delete = {enable: false};

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
    await this.generateCrud({ table, pageType, feature, basicConfig });
    this.success('初始化数据库成功');
  }

  /**
   * 生成 crud
   */
  async generateCrud({ table, pageType, feature, basicConfig }) {
    this.info('开始生成 CRUD');
    if (!table) {
      this.info('未配置table，流程结束');
      return;
    }
    
    this.info(`开始生成 ${table} 的 CRUD`);
    const tableCamelCase = _.camelCase(table);
    let pageId = `${tableCamelCase}Management`;
    // 生成 vue
    if (await this.renderVue(table, pageId, pageType, feature, basicConfig)) {
      this.success(`生成 ${table} 的 vue 文件完成`);

      // 数据库
      this.info(`开始生成 ${table} 的相关数据`);
      await this.modifyTable(table, pageId, feature);
      this.success(`生成 ${table} 的相关数据完成`);
    }
  }

  async modifyTable(table, pageId, feature) {
    const knex = await this.getKnex();

    const templatePath = `${path.join(__dirname, '../../')}page-template-json/1table-page`;

    let clearSql = fs.readFileSync(`${templatePath}/clear_crud.sql`).toString();
    clearSql = clearSql.replace(/\{\{pageId}}/g, pageId);
    clearSql = clearSql.replace(/\{\{table}}/g, table);
    // 删除数据
    for (const line of clearSql.split('\n')) {
      if (!line) {
        continue;
      }
      if (line.startsWith('--')) {
        this.info(`正在执行删除 ${line}`);
      } else {
        await knex.raw(line);
      }
    }    

    let sql = fs.readFileSync(`${templatePath}/crud.sql`).toString();
    sql = sql.replace(/\{\{pageId}}/g, pageId);
    sql = sql.replace(/\{\{table}}/g, table);
    // 插入数据
    for (const line of sql.split('\n')) {
      if (!line) continue;
      if (line.startsWith('--')) {
        this.info(`正在执行插入/更新 ${line}`);
      } else {
        if (!feature.create.enable && line.includes('insertItem')) continue;
        if (!feature.update.enable && line.includes('updateItem')) continue;
        if (!feature.delete.enable && line.includes('deleteItem')) continue;

        await knex.raw(line);
      }
    }
  }

  /**
   * 生成 vue
   */
  async renderVue(table, pageId, pageType, feature, basicConfig) {
    const tableCamelCase = _.camelCase(table);
    // 写文件前确认是否覆盖
    const filepath = `./app/view/page/${pageId}.html`;
    if (fs.existsSync(filepath)) {
      const isBackUp = await this.readlineMethod(`文件 ${filepath} 已经存在，是否备份?(y/N)`, 'n');
      if (['y', 'Y'].includes(isBackUp)) {
        const bakPath = `./app/view/page/${pageId}-bak`;
        if (!fs.existsSync(bakPath)) fs.mkdirSync(bakPath);
        const backFilePath = `${bakPath}/${pageId}.html.${moment().format('YYYYMMDDHHmmss')}`;
        fs.copyFileSync(filepath, backFilePath);
      }
    }

    // 读取文件
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/1table-page`;
    const templateTargetPath = `${templatePath}/${pageType}.html.njk`;
    let listTemplate = fs.readFileSync(templateTargetPath).toString();
    // 为了方便 ide 渲染，在模板里面约定 //===// 为无意义标示
    listTemplate = listTemplate.replace(/\/\/===\/\//g, '');

    // 生成 vue
    nunjucks.configure(templateTargetPath, {
      tags: {
        blockStart: '<=%',
        blockEnd: '%=>',
        variableStart: '<=$',
        variableEnd: '$=>',
      },
    });
    const fields = await this.getFields(table, feature, basicConfig);
    this.info('表字段', fields);
    const result = nunjucks.renderString(listTemplate, {
      table,
      tableCamelCase,
      pageId,
      fields,
      basicConfig,
      feature
    });

    fs.writeFileSync(filepath, result);
    return true;
  }

  /**
   * 获取表字段
   */
  async getFields(table, feature, basicConfig) {
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

    const columns = result.map(column => {
      return {
        COLUMN_NAME: column.COLUMN_NAME,
        COLUMN_COMMENT: (column.COLUMN_COMMENT || column.COLUMN_NAME || '').split(';')[0].split('；')[0].split(':')[0],
      };
    });
    const tableFields = columns.filter(column => ![ ...defaultColumn, ...basicConfig.tableIgnoreFields, 'id' ].includes(column.COLUMN_NAME));

    let createFields = tableFields, updateFields = tableFields;
    if(!_.isEmpty(feature.create.ignoreFields)) createFields = columns.filter(column => !feature.create.ignoreFields.includes(column.COLUMN_NAME));
    if(!_.isEmpty(feature.update.ignoreFields)) updateFields = columns.filter(column => !feature.update.ignoreFields.includes(column.COLUMN_NAME));

    return { tableFields, createFields, updateFields};
  }
};
