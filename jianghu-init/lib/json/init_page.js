'use strict';
const CommandBase = require('../command_base');

require('colors');
const fs = require('fs');
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

  /**
   * ================================================================================================
   * 运行
   * @param {String} cwd 当前目录
   * @param {Object} jsonArgv json配置
   * @param {Object} argv 命令行参数
   * ================================================================================================
   */
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

  /**
   * ================================================================================================
   * 生成 crud
   * @param {Object} jsonConfig 配置对象
   * ================================================================================================
   */
  async generateCrud(jsonConfig) {
    const { table, pageId } = jsonConfig;
    // if (!table) {
    //   this.info('未配置table，流程结束');
    //   return;
    // }
    this.notice(`[2/5]开始生成 ${pageId} 的 CRUD...`);
    // 生成 vue
    const renderResult = await this.renderVue(jsonConfig);
    if (renderResult) {
      await this.modifyTable(jsonConfig);
      await this.handleOtherResource(jsonConfig);
      await this.checkPage(jsonConfig);

      // 生成组件
      await this.renderComponent(jsonConfig);
      // 生成 service
      await this.renderService(jsonConfig);
      this.success(`[${pageId}]page generated successfully`);
    } else {
      this.error(`生成 ${table} 的 vue 文件失败`);
      return;
    }
  }

  /**
   * ================================================================================================
   * 渲染内容
   * @param {Object} jsonConfig 配置对象
   * @param {Boolean} dev 是否为开发模式
   * ================================================================================================
   */
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

  /**
   * ================================================================================================
   * 修改表
   * @param {Object} jsonConfig 配置对象
   * ================================================================================================
   */
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

  /**
   * ================================================================================================
   * 执行 sql
   * @param {String} sqlFile sql文件名
   * @param {Object} obj 替换对象
   * ================================================================================================
   */
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
        this.notice(`${label} ${line}`);
      } else {
        await knex.raw(line);
      }
    }
  }

  /**
   * ================================================================================================
   * 生成 vue
   * @param {Object} jsonConfig 配置对象
   * ================================================================================================
   */
  async renderVue(jsonConfig) {
    // version / pageType 在 v6 原始配置里已有，用于确定模板路径
    const { version, pageType } = jsonConfig;
    const njkRootPath = `${path.join(__dirname, '../../')}page-template-json`;
    const templateTargetPath = `jh-page/${version ? pageType + '-' + version : pageType}.njk.html`;

    // 初始化 njk 模板标签、filter
    const nunjucksEnv = this.handleNunjucksEnv(njkRootPath);
    // v6 配置在此处才会把 pageId 等写入 jsonConfig（来自 legacyConfig）
    this.handleJsonConfig(jsonConfig);

    // handleJsonConfig 之后再解构，确保 v6 的 pageId / table 已填充
    const { table, pageId, pageFile } = jsonConfig;
    const tableCamelCase = _.camelCase(table);
    const v7MobileOnly = version === 'v7' && jsonConfig.v7BuildTargets === 'mobile';
    const pcFilepath = `./app/view/page/${pageFile || pageId}.html`;
    const mobileFilepath = `./app/view/page/mobile/${pageFile || pageId}.html`;

    const componentList = this.getConfigComponentList(jsonConfig);

    const writePageHtml = (filepath, templatePath, renderCtx) => {
      const html = nunjucksEnv.render(templatePath, Object.assign({ tableCamelCase }, renderCtx, { componentList }));
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, html);
    };

    if (pageId && pageId.includes('/')) {
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

    if (v7MobileOnly) {
      fs.mkdirSync('./app/view/page/mobile', { recursive: true });
      writePageHtml(
        mobileFilepath,
        'jh-mobile-page/jh-mobile-page-v7.njk.html',
        jsonConfig,
      );
      this.notice(`[v7] mobile-only page generated: ${mobileFilepath}`);
      return true;
    }

    writePageHtml(pcFilepath, templateTargetPath, jsonConfig);

    // v7 双端：PC 已写入根路径，再生成 mobile/ 子目录
    if (version === 'v7' && jsonConfig.mobileStandardConfig) {
      const mobilePageId = `mobile/${pageId}`;
      const mobileSubFilepath = `./app/view/page/${mobilePageId}.html`;
      fs.mkdirSync('./app/view/page/mobile', { recursive: true });

      const mobileRenderCtx = Object.assign({}, jsonConfig, {
        standardConfig: jsonConfig.mobileStandardConfig,
        includeList: jsonConfig.mobileStandardConfig.includeList || [],
        basicUiActionConfig: jsonConfig.mobileBasicUiActionConfig || jsonConfig.basicUiActionConfig,
        pageId: mobilePageId,
        tableCamelCase,
      });
      writePageHtml(mobileSubFilepath, 'jh-mobile-page/jh-mobile-page-v7.njk.html', mobileRenderCtx);
      this.notice(`[v7] mobile page generated: ${mobileSubFilepath}`);
    }

    return true;
  }
};
