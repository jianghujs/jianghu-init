'use strict';
const CommandBase = require('../command_base');

require('colors');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const moment = require('moment');
const path = require('path');
const mixin = require('./mixin.js');

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitComponent1Table extends CommandBase {
  constructor() {
    super();
    Object.assign(this, mixin);
  }

  async run(cwd, jsonArgv, argv) {
    this.argv = argv;
    this.cwd = cwd;
    // TODO: ajv库检查 jsonArgv
    // 检查配置 && 生成json配置中缺省的默认配置
    // const finalJsonConfig = this.checkAndGenerateDefaultConfig(jsonArgv);
    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    this.success('初始化数据库连接成功');
    // generate crud
    await this.generateCrud(jsonArgv);
  }

  /**
   * 生成 crud
   */
  async generateCrud(jsonConfig) {
    const { pageType, pageId, table, componentPath } = jsonConfig;
    this.info('开始生成 CRUD');
    if (!table) {
      this.info('未配置table，流程结束');
      return;
    }
    this.info(`开始生成 ${table} 的 CRUD`);
    // 生成 vue
    const renderResult = await this.renderVue(jsonConfig);
    if (renderResult) {
      await this.modifyTable(jsonConfig, pageId, componentPath);
    } else {
      this.error(`生成 ${table} 的 vue 文件失败`);
      return;
    }
    // 生成组件
    await this.renderComonent(jsonConfig);
    // 生成 service
    await this.renderService(jsonConfig);
  }

  async modifyTable(jsonConfig) {
    const { table, pageId, componentPath, idGenerate = false } = jsonConfig;
    const knex = await this.getKnex();
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/1table-component`;
    await this.checkTableFields(table, idGenerate);

    let clearSql = fs.readFileSync(`${templatePath}/clear_crud.sql`).toString();
    clearSql = clearSql.replace(/\{\{pageId}}/g, pageId);
    clearSql = clearSql.replace(/\{\{table}}/g, table);
    clearSql = clearSql.replace(/\{\{component}}/g, componentPath.split('/').pop());
    this.info(`开始生成 ${table} 的相关数据`);
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
    sql = sql.replace(/\{\{component}}/g, componentPath.split('/').pop());
    if (idGenerate) {
      sql = sql.replace(/\{\{insertBeforeHook}}/g, '{"before": [{"service": "common", "serviceFunction": "generateBizIdOfBeforeHook"}]}');
    } else {
      sql = sql.replace(/\{\{insertBeforeHook}}/g, '');
    }
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
    const pageBakDir = `./app/view/pageBak`;
    if (!fs.existsSync(pageBakDir)) fs.mkdirSync(pageBakDir);

    const { table, pageId, pageType, componentPath } = jsonConfig;
    const tableCamelCase = _.camelCase(table);
    const filepath = `./app/view/component/${componentPath}.html`;
    const htmlBasePath = `${path.join(__dirname, '../../')}page-template-json/base.njk.html`;
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/1table-component`;
    const templateTargetPath = `${templatePath}/${pageType}.njk.html`;
    const listTemplate = fs.readFileSync(templateTargetPath)
      .toString()
      .replace(/\/\/===\/\/ /g, '')
      .replace(/\/\/===\/\//g, '');

    // 初始化 njk 模板标签、filter
    this.handleNunjucksEnv(templateTargetPath);
    this.handleJsonConfig(jsonConfig);
    
    const componentList = this.getUpdateDrawerComponentList(jsonConfig);
    const htmlBase = fs.readFileSync(htmlBasePath);
    let htmlUser = fs.existsSync(filepath) ? fs.readFileSync(filepath) : htmlBase;
    const htmlGenerate = nunjucks.renderString(listTemplate, { tableCamelCase, ...jsonConfig, componentList });
    const bakFilePath = await this.handleViewBak(pageId, filepath);

    // fs.writeFileSync(filepath, htmlUser);
    const componentPathArr = componentPath.split('/');
    if (componentPathArr.length > 1) {
      const componentDir = componentPathArr.slice(0, componentPathArr.length - 1).join('/');
      if (!fs.existsSync(`./app/view/component/${componentDir}`)) fs.mkdirSync(`./app/view/component/${componentDir}`);
    }
    
    // fs.writeFileSync(filepath, htmlUser);
    fs.writeFileSync(filepath, htmlGenerate); // 测试  
    fs.writeFileSync(`./app/view/pageBak/${componentPath}.base.html`, htmlBase);
    fs.writeFileSync(`./app/view/pageBak/${componentPath}.generate.html`, htmlGenerate); 
    await this.executeCommand(`git merge-file ./app/view/component/${componentPath}.html ./app/view/pageBak/${componentPath}.base.html ./app/view/pageBak/${componentPath}.generate.html`, );
    
    htmlUser = fs.readFileSync(filepath).toString();
    await this.handleOtherResource(jsonConfig);
    const diffCount = (htmlUser.match(new RegExp(`<<<<<<< ${filepath}`, 'g')) || []).length;
    if (diffCount > 0) {
      // git checkout --theirs ./app/view/page/${componentPath}.html ===> 不好使
      this.warning(`生成的文件有 ${diffCount}处 冲突, 请手动解决!`);
    }
    if (diffCount == 0 && bakFilePath) {
      fs.unlinkSync(bakFilePath);
    }
    return true;
  }

  /**
   * 处理文件备份
   * @param {String} pageId
   * @param {String} filepath
   * @returns 
   */
  async handleViewBak(pageId, filepath){
    if (fs.existsSync(filepath)) {
      const pageBakDir = `./app/view/pageBak`;
      const pageBakPath = `${pageBakDir}/${pageId}`;
      if (!fs.existsSync(pageBakPath)) fs.mkdirSync(pageBakPath);
      const bakFilePath = `${pageBakPath}/${pageId}.${moment().format('YYYYMMDD_HHmmss')}.html`;
      fs.copyFileSync(filepath, bakFilePath);
      return bakFilePath;
    }
    return null;
  }

};