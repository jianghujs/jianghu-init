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
    for (const tableHeader of jsonConfig.tableHeaders) {
      // TODO: 检查 tableHeader 组件type
      const supportType = ["v-text-field", "v-textarea", "v-select", "v-date-picker", "v-checkbox"]
      if (!supportType.includes(tableHeader.type)) tableHeader.type = "v-text-field";
      if (!_.isBoolean(tableHeader.sortable)) tableHeader.sortable = true;
      if (!_.isBoolean(tableHeader.createEnable)) tableHeader.createEnable = true;
      if (!_.isBoolean(tableHeader.updateEnable)) tableHeader.updateEnable = true;
      if (!_.isBoolean(tableHeader.fixed)) tableHeader.fixed = false;
      if (!tableHeader.width) tableHeader.width = 80;
      if (!tableHeader.align) tableHeader.align = "left";
    }
    
    return jsonConfig;
  }

  /**
   * 生成 crud
   */
  async generateCrud(jsonConfig) {
    const { pageType, pageId, table } = jsonConfig;
    this.info('开始生成 CRUD');
    if (!table) {
      this.info('未配置table，流程结束');
      return;
    }
    this.info(`开始生成 ${table} 的 CRUD`);
    // 生成 vue
    const renderResult = await this.renderVue(jsonConfig);
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
  async renderVue(jsonConfig) {
    const { table, pageId, pageType } = jsonConfig;
    const tableCamelCase = _.camelCase(table);
    // 写文件前确认是否覆盖
    const filepath = `./app/view/page/${pageId}.html`;
    // TODO: 若文件没有改动 则 删除backup文件
    // await this.handleViewBackUp(pageId, filepath);

    // 设置njk渲染模板
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/1table-page`;
    const templateTargetPath = `${templatePath}/${pageType}.njk.html`;
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
    nunjucksEnv.addFilter('jsonToStr', function(obj, spaceCount=4) {
      let spaceStr = '';
      for (let i = 0; i < spaceCount; i++) { spaceStr += ' '; }
      if (Array.isArray(obj)) {
        const arrayStr = `[\n${obj.map(item => "  " + spaceStr + JSON.stringify(item).replace(/"([^"]+)":/g, '$1:') + ",\n").join("")}${spaceStr}]`;
        return arrayStr;
      }
      const objStr = JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/\n/g, `\n${spaceStr}`);;
      return objStr;
    });
    
    const htmlOld = fs.existsSync(filepath) ? fs.readFileSync(filepath) : '';
    const htmlNew = nunjucks.renderString(listTemplate, { tableCamelCase, ...jsonConfig });
    // fs.writeFileSync(`./app/view/page/${pageId}.old.html`, htmlOld);
    fs.writeFileSync(`./app/view/page/${pageId}.new.html`, htmlNew);

    // TODO: 使用js diff 合并代码
    //  - 关键部分用模版(打标记的位置)
    //  - 其他部分直接保留原有
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
      const pageBakDir = `./app/view/pageBak`;
      if (!fs.existsSync(pageBakDir)) fs.mkdirSync(pageBakDir);
      const pageBakPath = `${pageBakDir}/${pageId}`;
      if (!fs.existsSync(pageBakPath)) fs.mkdirSync(pageBakPath);
      const backFilePath = `${pageBakPath}/${pageId}.${moment().format('YYYYMMDD_HHmmss')}.html`;
      fs.copyFileSync(filepath, backFilePath);
    }
  }

};
