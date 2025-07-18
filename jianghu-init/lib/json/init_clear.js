'use strict';
const CommandBase = require('../command_base.js');

require('colors');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');
const mixin = require('./mixin.js');

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitClear extends CommandBase {
  constructor() {
    super();
    Object.assign(this, mixin);
  }

  async run(cwd, jsonArgv, argv) {
    this.argv = argv;
    this.cwd = cwd;
    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = await this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    // this.notice('初始化数据库连接成功');
    // generate crud
    await this.clear(jsonArgv);
  }

  async clear() {
    this.info('清除开始');
    this.info("   - _page:                  operationByUserId='jianghu-init'");
    this.info("   - _resource:              operationByUserId='jianghu-init'");
    this.info("   - init-json/page/*,       pageId.html");
    this.info("   - init-json/component/*,  componentPath.html");
    
    // _page、_resource
    
    const knex = await this.getKnex();
    await knex.raw('delete from _page where operationByUserId like "jianghu-init%"');
    await knex.raw('delete from _resource where operationByUserId like "jianghu-init%"');

    // component of init
    const componentOfInitList = ['./app/view/component/vueJsonEditor.html', './app/view/component/jhFile.html', './app/view/component/tableRecordHistory.html']
    for (const filePath of componentOfInitList) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // page of /init-json/page/**
    const fileList = await this.findJsFiles('./app/view/init-json/page');
    for (const file of fileList) {
      // eslint-disable-next-line no-eval
      const fileObj = eval(fs.readFileSync('./' + file).toString());
      const { pageId } = fileObj;
      const pagePath = `./app/view/page/${pageId}.html`;
      if (pageId && fs.existsSync(pagePath)) {
        fs.unlinkSync(pagePath);
      }
    }

    // component of /init-json/component/**
    const componentList = await this.findJsFiles('./app/view/init-json/component');
    for (const component of componentList) {
      // eslint-disable-next-line no-eval
      const fileObj = eval(fs.readFileSync('./' + component).toString());
      const { pageId, componentPath } = fileObj;
      const componentPathNew = `./app/view/component/${componentPath}.html`;
      if (componentPathNew && fs.existsSync(componentPathNew)) {
        fs.unlinkSync(componentPathNew);
      }
    }
    
    this.info('清除完成');
  }


  findJsFiles(dir) {
    let files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        files = files.concat(this.findJsFiles(fullPath)); // 如果是目录，则递归搜索
      } else if (path.extname(item) === '.js') {
        files.push(fullPath); // 如果是 .js 文件，则添加到文件列表
      }
    }

    return files;
  }

  // 生成 crud
  async generateCrud(jsonConfig) {
    const { table } = jsonConfig;
    if (!table) {
      this.info('未配置table，流程结束');
      return;
    }
    this.notice(`开始生成 ${table} 的 CRUD...`);
    // 生成 vue
    const renderResult = await this.renderVue(jsonConfig);
    if (renderResult) {
      console.log('modifyTable');
      await this.modifyTable(jsonConfig);
      await this.handleOtherResource(jsonConfig);
      // 生成组件
      await this.renderComponent(jsonConfig);
      // 生成 service
      await this.renderService(jsonConfig);
      this.success('build page by json success');
    } else {
      this.error(`生成 ${table} 的 vue 文件失败`);
      return;
    }
  }

  async renderContent(jsonConfig, dev = false) {
    this.dbSetting = await this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    await this.renderVue(jsonConfig);
    await this.modifyTable(jsonConfig);
    await this.handleOtherResource(jsonConfig);
    await this.checkPage(jsonConfig);
    // 提示组件尚未生成
    await this.renderComponent(jsonConfig, dev);
    await this.renderService(jsonConfig, dev);
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
    const filepath = `./app/view/page/${pageId}.html`;
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/jh-page`;
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
      [ 'page', 'pageDoc' ].forEach(dir => {
        const pageIdDirPath = `./app/view/${dir}/${pageIdDir}`;
        fs.mkdirSync(pageIdDirPath, { recursive: true });
      });
    }

    // 生成 md
    if (jsonConfig.headContent && jsonConfig.headContent.helpDrawer) {
      const mdPath = './app/view/pageDoc';
      if (!fs.existsSync(`${mdPath}/${pageId}.md`)) {
        fs.mkdirSync(mdPath, { recursive: true });
        fs.writeFileSync(`${mdPath}/${pageId}.md`, `# ${pageId}页面`);
      }
    }

    // fs.writeFileSync(filepath, htmlUser);
    fs.writeFileSync(filepath, htmlGenerate);
    return true;
  }
};
