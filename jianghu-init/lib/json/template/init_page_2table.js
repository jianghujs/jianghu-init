'use strict';
const CommandBase = require('../../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const mixin = require('./mixin.js');
const InitPage = require('../init_page');
const InitComponent = require('../init_component');

/**
 * 根据 table 定义生成 crud 页面（3 table）
 */
module.exports = class InitPage2Table extends CommandBase {

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
    const { tableA, nameA, primaryFieldA, tableB, nameB, primaryFieldB } = await this.promptTables('请输入你要生成 CRUD 的 table', '');
    if (!tableA || !tableB) {
      this.info('未选择 table，流程结束');
      return;
    }
    this.info(`开始生成 ${tableA} 的 CRUD`);

    // 生成 vue
    const tableCamelCase = _.camelCase(tableA);
    let pageId = `${tableCamelCase}Management`;
    pageId = await this.readlineMethod(`【${tableA}】数据表pageId`, pageId);
    let componentName = _.camelCase(tableB) + 'List';
    for (const table of [ tableA, tableB ]) {
      if (table === tableB) {
        componentName = await this.readlineMethod(`【${tableB}】数据表组件名`, componentName);
      }
      // 生成 vue
      const content = await this.renderJson(table, pageId, table === tableA ? 'jh-page' : 'jh-component', componentName, nameA, primaryFieldA, nameB, primaryFieldB);
      // eslint-disable-next-line no-eval
      const jsConfig = eval(content, true);
      if (table === tableA) {
        await new InitPage().renderContent(jsConfig, true);
      } else {
        await new InitComponent().renderContent(jsConfig, true);
      }
      this.success(`生成 ${table} 的 vue 文件完成`);
    }
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
    // console.log(tables);
    console.log('注意: 仅支持一(A表)对多(B表)');
    const { tableA } = await inquirer.prompt({
      name: 'tableA',
      type: 'list',
      message: '请选择你要生成 crud 的表（A表）',
      choices: tables,
      pageSize: 100,
    });
    const { nameA } = await inquirer.prompt({
      name: 'nameA',
      type: 'input',
      default: tableA,
      message: `请输入 ${tableA} 的名字，如"文章"`,
    });
    const { primaryFieldA } = await inquirer.prompt({
      name: 'primaryFieldA',
      type: 'input',
      default: _.camelCase(tableA) + 'Id',
      message: `请输入 ${tableA} 表的业务字段`,
    });

    const { tableB } = await inquirer.prompt({
      name: 'tableB',
      type: 'list',
      message: '请选择你要生成 crud 的表（B表）',
      choices: tables,
      pageSize: 100,
    });
    const { nameB } = await inquirer.prompt({
      name: 'nameB',
      type: 'input',
      default: tableB,
      message: `请输入 ${tableB} 的名字，如"标签"`,
    });
    const { primaryFieldB } = await inquirer.prompt({
      name: 'primaryFieldB',
      type: 'input',
      default: _.camelCase(tableB) + 'Id',
      message: `请输入 ${tableB} 表的业务字段`,
    });
    return { tableA, nameA, primaryFieldA, tableB, nameB, primaryFieldB };
  }

  /**
   * 生成 vue
   */
  async renderJson(table, pageId, pageType = 'jh-page', componentName = '', nameA, primaryFieldA, nameB, primaryFieldB) {
    const tableCamelCase = _.camelCase(table);
    // 写文件前确认是否覆盖
    const filepath = pageType === 'jh-page' ? `./app/view/init-json/page/${pageId}.js` : `./app/view/init-json/component/${componentName}.js`;
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
    const resourceList = this.getResourceList(pageType, pageId, table, [], componentName, pageType === 'jh-page' ? primaryFieldA : primaryFieldB);
    const {
      pageName,
      updateDrawerComponent,
      componentPath,
      propsStr,
      createdStr,
      methodItemStr,
    } = this.buildParameters(pageType, nameA, nameB, componentName, primaryFieldA, primaryFieldB);

    const { pageContent, actionContent, tableStr, headContent } = this.getContent(
      table,
      pageId,
      pageType,
      fields,
      pageName,
      updateDrawerComponent,
      pageType === 'jh-page' ? primaryFieldA : primaryFieldB
    );
    const replacements = {
      pageType,
      pageId,
      pageName,
      table,
      tableCamelCase,
      componentPath,
      resourceList,
      headContent,
      pageContent,
      actionContent,
      propsStr,
      createdStr,
      methodItemStr,
    };

    // 使用正则表达式替换占位符
    const fileContent = fs.readFileSync(`${templatePath}/crud.js`, 'utf-8').toString();
    const result = fileContent.replace(/\$\{(\w+)\}/g, (match, p1) => {
      return replacements[p1] || ''; // 替换变量或保留原样
    });

    fs.writeFileSync(filepath, result);
    return result;
  }

  buildParameters(pageType, nameA, nameB, componentName, primaryFieldA, primaryFieldB) {
    let updateDrawerComponent = '';
    let componentPath = '';
    let pageName = '';
    let propsStr = '';
    let methodItemStr = '';
    let createdStr = `
    async created() {
      await this.doUiAction('getTableData');
    },`;
    if (pageType === 'jh-page') {
      pageName = nameA + '页面';
      updateDrawerComponent = `{ label: "${nameB}", type: "component", componentPath: "${componentName}", attrs: { ':${primaryFieldA}': 'updateItem.${primaryFieldA}', class: 'px-4' } },`;
    } else {
      // 传递变量
      propsStr = `props: { ${primaryFieldA}: { type: String, required: true } },`;
      // 初始watch、生命周期
      createdStr = `
    watch: {
      ${primaryFieldA}() {
        this.serverSearchWhere['${primaryFieldA}'] = this.${primaryFieldA};
        this.doUiAction('getTableData');
      },
    },
    async created() {
      this.serverSearchWhere['${primaryFieldA}'] = this.${primaryFieldA};
      await this.doUiAction('getTableData');
    },`;
      componentPath = `componentPath: '${componentName}',`;
      methodItemStr = `
      async prepareCreateFormData() {
        this.createItem = {
          ${primaryFieldA}: this.${primaryFieldA},
        };
      },
      `;
    }
    return {
      pageName,
      updateDrawerComponent,
      componentPath,
      propsStr,
      createdStr,
      methodItemStr,
    };
  }
};
