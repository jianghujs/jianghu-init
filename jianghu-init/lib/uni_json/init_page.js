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
module.exports = class InitPage1Table extends CommandBase {
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
    await this.checkUniappPath();
    await this.renderVue(jsonArgv);
  }

  async renderContent(jsonConfig, dev = false) {
    // this.dbSetting = this.readDbConfigFromFile();
    // // app 默认使用 database，如果有前缀则需要去掉前缀
    // this.app = this.dbSetting.database;
    // await this.getKnex(this.dbSetting);
    await this.renderVue(jsonConfig);
    // await this.modifyTable(jsonConfig);
    // await this.handleOtherResource(jsonConfig);
    // await this.checkPage(jsonConfig);
    // // 提示组件尚未生成
    // await this.renderComponent(jsonConfig, dev);
    // await this.renderService(jsonConfig, dev);
  }

  async modifyTable(jsonConfig) {
    const { table, pageId, pageName = '', idGenerate = false } = jsonConfig;

    if (table) {
      await this.checkTableFields(table, idGenerate);
      // await this.executeSql('clear_resource.sql', { pageId, table });
      // const insertBeforeHook = idGenerate ? '{"before": [{"service": "common", "serviceFunction": "generateBizIdOfBeforeHook"}]}' : '';
      // await this.executeSql('check_resource.sql', { pageId, pageName, table, insertBeforeHook });
    }
    if (pageId) {
      await this.executeSql('check_page.sql', { pageId, pageName });
    }
  }

  async executeSql(sqlFile, obj) {
    const knex = await this.getKnex();
    let label = '';
    const sqlFilename = sqlFile.replace(/\.sql$/, '') + '.sql';
    if (sqlFilename.startsWith('clear_')) {
      label = '正在执行删除';
    } else if (sqlFilename.startsWith('init_')) {
      label = '正在执行插入/更新';
    } else if (sqlFilename.startsWith('check_')) {
      label = '正在执行检查';
    }
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/jh-page`;
    let sqlContent = fs.readFileSync(`${templatePath}/${sqlFilename}`).toString();
    for (const key in obj) {
      sqlContent = sqlContent.replace(new RegExp(`{{${key}}}`, 'g'), obj[key]);
    }
    const sqlList = sqlContent.split('\n');
    for (const line of sqlList) {
      if (!line) continue;
      if (line.startsWith('--')) {
        this.info(`${label} ${line}`);
      } else {
        await knex.raw(line);
      }
    }
  }

  // 生成 vue
  async renderVue(jsonConfig) {
    // const pageBakDir = './app/view/pageBak';
    // if (!fs.existsSync(pageBakDir)) fs.mkdirSync(pageBakDir);

    const { table, pageId, pageType } = jsonConfig;
    const tableCamelCase = _.camelCase(table);
    const filepath = `./pages/${pageId}.vue`;
    const templatePath = `${path.join(__dirname, '../../')}page-template-uni-json/jh-page`;
    const templateTargetPath = `${templatePath}/${pageType}.njk.html`;
    const listTemplate = fs.readFileSync(templateTargetPath)
      .toString()
      .replace(/\/\/===\/\/ /g, '')
      .replace(/\/\/===\/\//g, '');

    // 初始化 njk 模板标签、filter
    this.handleNunjucksEnv(templateTargetPath);
    this.handleJsonConfig(jsonConfig);

    const componentList = this.getConfigComponentList(jsonConfig);
    const htmlGenerate = nunjucks.renderString(listTemplate, Object.assign({ tableCamelCase }, jsonConfig, { componentList }));

    if (pageId.includes('/')) {
      const pageIdArr = pageId.split('/');
      const pageIdDir = pageIdArr.slice(0, pageIdArr.length - 1).join('/');

      const pageIdDirPath = `./pages/${pageIdDir}`;
      if (!fs.existsSync(pageIdDirPath)) {
        fs.mkdirSync(pageIdDirPath);
      }
    }
    // fs.writeFileSync(filepath, htmlUser);
    fs.writeFileSync(filepath, htmlGenerate);
    return true;
  }
};
