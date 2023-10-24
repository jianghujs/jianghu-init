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
    // 检查配置 && 生成json配置中缺省的默认配置
    const finalJsonConfig = this.checkAndGenerateDefaultConfig(jsonArgv);
    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    this.success('初始化数据库连接成功');
    // generate crud
    await this.generateCrud(finalJsonConfig);
    this.success('初始化数据库成功');
  }

  /** 
   * 检查配置 && 生成json配置中缺省的默认配置
   */
  checkAndGenerateDefaultConfig(originJsonConfig) {
    const jsonConfig = _.cloneDeep(originJsonConfig);
    // 1: 检查配置
    if (!jsonConfig.pageId) {
      this.info('未配置pageId，流程结束');
      return;
    }
    if (!jsonConfig.table) {
      this.info('未配置数据库table，流程结束');
      return;
    }
    // 2: 生成缺省配置
    for (const column of jsonConfig.columns) {
      // TODO: 检查 column 组件type
      const supportType = ["v-text-field", "v-textarea", "v-select", "v-date-picker", "v-checkbox"]
      if (!supportType.includes(column.type)) column.type = "v-text-field";
      if (!_.isBoolean(column.sortable)) column.sortable = true;
      if (!_.isBoolean(column.createEnable)) column.createEnable = true;
      if (!_.isBoolean(column.updateEnable)) column.updateEnable = true;
      if (!_.isBoolean(column.fixed)) column.fixed = false;
      if (!column.width) column.width = 80;
      if (!column.align) column.align = "left";
    }
    
    return jsonConfig;
  }

  /**
   * 生成 crud
   */
  async generateCrud(jsonConfig) {
    const { pageType, pageId, table, columns } = jsonConfig;
    this.info('开始生成 CRUD');
    if (!table) {
      this.info('未配置table，流程结束');
      return;
    }
    this.info(`开始生成 ${table} 的 CRUD`);
    // 生成 vue
    const renderResult = await this.renderVue(table, pageId, pageType, columns);
    if (renderResult) {
      this.success(`生成 ${table} 的 vue 文件完成`);
      // 数据库
      this.info(`开始生成 ${table} 的相关数据`);
      await this.modifyTable(table, pageId);
      this.success(`生成 ${table} 的相关数据完成`);
    } else {
      this.error(`生成 ${table} 的 vue 文件失败`);
      return;
    }
  }

  async modifyTable(table, pageId) {
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
        await knex.raw(line);
      }
    }
  }

  /**
   * 生成 vue
   */
  async renderVue(table, pageId, pageType, columns) {
    const tableCamelCase = _.camelCase(table);
    // 写文件前确认是否覆盖
    const filepath = `./app/view/page/${pageId}.html`;
    await this.handleViewBackUp(pageId, filepath);

    // 设置njk渲染模板
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/1table-page`;
    const templateTargetPath = `${templatePath}/${pageType}.html.njk`;
    const listTemplate = fs.readFileSync(templateTargetPath).toString();
    const nunjucksEnv = nunjucks.configure(templateTargetPath, {
      autoescape: false,
      tags: {
        blockStart: '<=%',
        blockEnd: '%=>',
        variableStart: '<=$',
        variableEnd: '$=>',
      },
    });

    //获取数据库表所有原生字段
    const allFields = await this.getTableFields(table);
    //获取enableInsertFields、enableUpdateFields
    const enableCreateColumns = await this.getFormCreateColumns(allFields, columns);
    const enableUpdateColumns = await this.getFormUpdateColumns(allFields, columns);
    //获取tableHeaders
    const tableHeaders = await this.getTableHeaders(allFields, columns);
   
    nunjucksEnv.addFilter('toArrayString', function(array) {
      return JSON.stringify(array);
    });
    
    const result = nunjucks.renderString(listTemplate, {
      table,
      tableCamelCase,
      pageId,
      enableCreateColumns,
      enableUpdateColumns,
      tableHeaders
    });

    fs.writeFileSync(filepath, result);
    return true;
  }

  /**
   * 处理文件备份
   * @param {String} pageId
   * @param {String} filepath
   * @returns 
   */
  async handleViewBackUp(pageId, filepath){
    // 写文件前确认是否覆盖
    if (fs.existsSync(filepath)) {
      const pageBakDir = `./app/view/page-bak`;
      if (!fs.existsSync(pageBakDir)) fs.mkdirSync(pageBakDir);
      const pageBakPath = `${pageBakDir}/${pageId}`;
      if (!fs.existsSync(pageBakPath)) fs.mkdirSync(pageBakPath);
      const backFilePath = `${pageBakPath}/${pageId}.html.${moment().format('YYYYMMDDHHmmss')}`;
      fs.copyFileSync(filepath, backFilePath);
    }
  }

  /**
   * 获取可以创建的表单字段信息
   * @param {Array} fields 
   * @param {Array} columns 
   * @returns 
   */
  async getFormCreateColumns(fields, columns){
    const enableInsertFieldNames = fields.map(field => field.COLUMN_NAME);
    const enableCreateColumns = columns.filter(column => column.createEnable !== false && enableInsertFieldNames.includes(column.name));
    return enableCreateColumns;
  }

  /**
   * 获取可以更新的表单字段信息
   * @param {Array} fields 
   * @param {Array} columns 
   * @returns 
   */
  async getFormUpdateColumns(fields, columns){
    const enableUpdateFieldNames = fields.map(field => field.COLUMN_NAME);
    const enableUpdateColumns = columns.filter(column => column.updateEnable !== false && enableUpdateFieldNames.includes(column.name));
    return enableUpdateColumns;
  }

  /**
   * 获取tableHeaders
   * @param {Array} fields 
   * @param {Array} columns 
   * @returns 
   */
  async getTableHeaders(fields, columns){
    const tableHeaders = [];
    // TODO 根据配置动态获取
    tableHeaders.push({text: '操作', value: 'action', align: 'center', sortable: false, width: 120, class: 'fixed', cellClass: 'fixed'});

    for (const column of columns) {
      const fieldInfo = fields.find(x => x.COLUMN_NAME === column.name) || {};
      if (!_.isEmpty(fieldInfo)) {
        tableHeaders.push({
          text: fieldInfo.COLUMN_COMMENT, 
          value: fieldInfo.COLUMN_NAME, 
          width: column.width
        })
      }
    }
    
    return tableHeaders;
  }

  /**
   * 获取数据库表所有原生字段
   * @param {String} table
   * @returns
   */
  async getTableFields(table) {
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

    return columns;
  }
};
