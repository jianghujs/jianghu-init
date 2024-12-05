'use strict';
const yargs = require('yargs');
const CommandBase = require('../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');

/**
 * 根据 table 定义生成 crud 页面（3 table）
 */
module.exports = class InitPagePublic extends CommandBase {

  async run(cwd, argv) {
    this.cwd = cwd;

    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    // 如果是 multi，则切换到 user_app_management 获取前缀
    const enterPriseV1 = fs.existsSync('../user_app_management');
    const enterPriseV2 = fs.existsSync('../base-system');
    if (enterPriseV1 || enterPriseV2) {
      const oldCwd = process.cwd();
      const systemDir = enterPriseV1 ? 'user_app_management' : 'base-system';
      process.chdir(enterPriseV1 ? '../' + systemDir : '../' + systemDir);
      this.dbPrefix = this.readDbPrefixFromFile(systemDir);
      process.chdir(oldCwd);
      if (this.dbPrefix && this.app.startsWith(this.dbPrefix)) {
        this.app = this.app.slice(this.dbPrefix.length);
      }
    }
    await this.getKnex(this.dbSetting);
    this.notice('初始化数据库连接成功');

    // generate crud
    await this.generateCrud(argv);

    this.success('init crud is success');
  }

  /**
   * 生成 crud
   */
  async generateCrud({ type, pageId: defaultPageId, filename, path, queryPageId = true, demo, y }) {

    this.notice('开始生成 CRUD...');
    let pageId = defaultPageId;
    if (queryPageId) {
      pageId = (await inquirer.prompt({
        name: 'pageId',
        type: 'input',
        message: 'Please input component name',
        default: defaultPageId,
      })).pageId;
    }
    if (!pageId && pageId !== false) {
      this.info('未输入page，流程结束');
      return;
    }
    this.notice(`开始生成 ${pageId} 的 CRUD`);

    // 生成 vue
    if (await this.renderVue(path, type, pageId, filename, { pageId }, y)) {
      this.success(`生成 ${pageId} 的 vue 文件完成`);
    }
    // 生成 sql
    if (await this.renderSql(path, { pageId })) {
      this.success(`生成 ${pageId} 的 sql 文件完成`);
    }
    // 生成 service
    if (await this.copyTemplateFiles(path)) {
      this.success(`生成 ${pageId} 的 service 文件完成`);
    }

    if (type === 'component') {
      // log 提示引入、使用
      this.info(`
        引入方式：
        {% include 'component/${filename || pageId}.html' %}
        or
        { type: 'html', path: 'component/${filename || pageId}.html' },
        
        ${demo}
      `);
    }
  }

  /**
   * 生成 vue
   */
  async renderVue(dirPath, type, pageId, filename, renderContext = {}, y) {
  // 写文件前确认是否覆盖
    const filepath = `./app/view/${type}/${filename || pageId}.html`;

    if (fs.existsSync(filepath) && !y) {
      const overwrite = await this.readlineMethod(`文件 ${filepath} 已经存在，是否覆盖?(y/N)`, 'n');
      if (overwrite !== 'y' && overwrite !== 'Y') {
        this.warning(`跳过 ${filepath} 的生成`);
        return false;
      }
    }

    // 读取文件
    const templatePath = `${path.join(__dirname, '../../')}page-template-component`;
    let listTemplate = fs.readFileSync(`${templatePath}/${dirPath}/init.html`).toString();
    // 为了方便 ide 渲染，在模板里面约定 //===// 为无意义标示
    listTemplate = listTemplate.replace(/\/\/===\/\//g, '');

    // 生成 vue
    nunjucks.configure(`${templatePath}/${dirPath}/init.html`, {
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
    // console.log('context', context);
    let result = nunjucks.renderString(listTemplate, context);

    result = result.replace(/<!--SQL START([\s\S]*)SQL END!-->/, '');
    fs.writeFileSync(filepath, result);
    return true;
  }

  /**
   * 生成 vue
   */
  async renderSql(dirPath, { pageId }) {
    const templatePath = `${path.join(__dirname, '../../')}page-template-component`;
    if (fs.existsSync(`${templatePath}/${dirPath}/init.sql`)) {
      let sql = fs.readFileSync(`${templatePath}/${dirPath}/init.sql`).toString();
      if (sql) {
        sql = sql.replace(/\{\{pageId}}/g, pageId);
        // const appId = `${tableCamelCase}Management`;
        // sql = sql.replace(/\{\{appId}}/g, appId);
        // console.log(sql);

        for (const line of sql.split('\n')) {
          if (!line) {
            continue;
          }
          if (line.startsWith('--')) {
            this.info(`正在执行 ${line}`);
          } else {
            await this.knex.raw(line);
          }
        }
        return true;
      }
    }
    return false;
  }

  async copyTemplateFiles(dirPath) {
    const templateDir = path.join(__dirname, '../../page-template-component', dirPath);
    const targetDir = './app';

    await this.copyFile(templateDir, targetDir, `${this.pageId}.js`, 'view/init-json/page');
    if (fs.existsSync(`${templateDir}/service`)) {
      await this.copyDirectory(templateDir, targetDir, 'service');
      this.info('✅ 生成 service 依赖文件');
    }

    if (fs.existsSync(`${templateDir}/component`)) {
      await this.copyDirectory(templateDir, targetDir, 'component', 'view/component');
      this.info('✅ 生成 component 依赖文件');
    }

    if (fs.existsSync(`${templateDir}/public`)) {
      await this.copyDirectory(templateDir, targetDir, 'public', 'public');
      this.info('✅ 生成 public 依赖文件');
    }
  }

  async copyFile(sourceDir, targetDir, fileName, subDir = '') {
    const sourcePath = path.join(sourceDir, fileName);
    const targetSubDir = path.join(targetDir, subDir);
    const targetPath = path.join(targetSubDir, fileName);

    if (!fs.existsSync(sourcePath)) {
      this.warning(`源文件 ${sourcePath} 不存在，当前 pageId: ${this.pageId}`);
      return;
    }

    fs.mkdirSync(targetSubDir, { recursive: true });


    if (sourcePath.endsWith('.js')) {
      const content = fs.readFileSync(sourcePath, 'utf-8');
      fs.writeFileSync(targetPath, content.replace(/^\/\* eslint-disable \*\/\n/, ''));
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
    this.info(`✅ 生成 ${fileName} 文件`);
  }

  async copyDirectory(sourceDir, targetDir, dirName, targetSubDir = '') {
    const sourcePath = path.join(sourceDir, dirName);
    const targetPath = path.join(targetDir, targetSubDir || dirName);

    if (!fs.existsSync(sourcePath)) {
      this.warning(`源目录 ${sourcePath} 不存在，当前 pageId: ${this.pageId}`);
      return;
    }

    fs.mkdirSync(targetPath, { recursive: true });
    this.copyRecursively(sourcePath, targetPath);
    this.success(`已复制 ${dirName} 目录下的所有文件和文件夹`);
  }

  copyRecursively(src, dest) {
    if (fs.statSync(src).isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(childItemName => {
        this.copyRecursively(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
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
