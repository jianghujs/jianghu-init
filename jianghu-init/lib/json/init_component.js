'use strict';
const CommandBase = require('../command_base');

require('colors');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');
const mixin = require('./mixin.js');

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitComponent extends CommandBase {
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
    this.dbSetting = await this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    this.notice('[1/5]初始化数据库连接成功');
    // generate crud
    await this.generateCrud(jsonArgv);
  }

  // 生成 crud
  async generateCrud(jsonConfig) {
    const { pageId, table, componentPath } = jsonConfig;
    // this.notice('开始生成 CRUD...');
    // if (!table) {
    //   this.info('未配置table，流程结束');
    //   return;
    // }
    this.notice(`[2/5]开始生成 ${componentPath} 的 CRUD...`);
    // 生成 vue
    const renderResult = await this.renderVue(jsonConfig);
    if (renderResult) {
      await this.modifyTable(jsonConfig);
      // 生成组件
      await this.renderComponent(jsonConfig);
      // 生成 service
      await this.renderService(jsonConfig);
      this.success(`[${componentPath}]component generated successfully`);
    } else {
      this.error(`生成 ${table} 的 vue 文件失败`);
      return;
    }
  }

  async renderContent(jsonConfig) {
    this.dbSetting = await this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    await this.renderVue(jsonConfig);
    await this.modifyTable(jsonConfig);
    await this.handleOtherResource(jsonConfig);
  }

  async modifyTable(jsonConfig) {
    const { table, pageId, pageName = '', pageHook = {}, idGenerate = false } = jsonConfig;

    if (table) {
      await this.checkTableFields(table, idGenerate);
      // await this.executeSql('clear_resource.sql', { pageId, table });
      // const insertBeforeHook = idGenerate ? '{"before": [{"service": "common", "serviceFunction": "generateBizIdOfBeforeHook"}]}' : '';
      // await this.executeSql('check_resource.sql', { pageId, pageName, table, insertBeforeHook });
    }
    // if (pageId) {
    //   await this.executeSql('check_page.sql', { pageId, pageName, pageHook });
    // }
  }

  // 生成 vue
  async renderVue(jsonConfig) {
    const { version, pageType } = jsonConfig;
    const njkRootPath = `${path.join(__dirname, '../../')}page-template-json`;
    const templateTargetPath = `jh-component/${version ? pageType + '-' + version : pageType}.njk.html`;

    // 初始化 njk 模板标签、filter
    const nunjucksEnv = this.handleNunjucksEnv(njkRootPath);
    // v7/v6 配置在此处才会把 componentPath 等写入 jsonConfig（来自 legacyConfig）
    this.handleJsonConfig(jsonConfig);

    const { table, componentPath: _componentPath, page } = jsonConfig;
    const componentPath = page?.componentPath || _componentPath || jsonConfig.component?.path;
    if (!componentPath) {
      throw new Error('jh-component: componentPath 未设置，请配置 component.path 或 componentPath');
    }
    const tableCamelCase = _.camelCase(table);
    const filepath = `./app/view/component/${componentPath}.html`;

    const componentList = this.getConfigComponentList(jsonConfig);
    const htmlGenerate = nunjucksEnv.render(templateTargetPath, Object.assign({ tableCamelCase }, jsonConfig, { componentList }));
    console.log('componentPath', componentPath);
    // fs.writeFileSync(filepath, htmlUser);
    const componentPathArr = componentPath.split('/');
    if (componentPathArr.length > 1) {
      const componentDir = componentPathArr.slice(0, componentPathArr.length - 1).join('/');
      fs.mkdirSync(`./app/view/component/${componentDir}`, { recursive: true });
    }

    // fs.writeFileSync(filepath, htmlUser);
    fs.writeFileSync(filepath, htmlGenerate);
    return true;
  }

};
