'use strict';
const yargs = require('yargs');
const CommandBase = require('../../command_base.js');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');
const mixin = require('./mixin.js');
const InitPage = require('../init_page.js');

/**
 * 根据 table 定义生成 user-management 页面
 */
module.exports = class InitPageUserManagement extends CommandBase {

  async run(cwd, templateName) {
    this.cwd = cwd;
    this.templateName = templateName;
    // 小驼峰名称
    this.templateNameCamelCase = this.templateName.replace(/-(\w)/g, (match, p1) => p1.toUpperCase());

    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;

    await this.getKnex(this.dbSetting);
    this.success('初始化数据库连接成功');

    // 检查当前目录是否是在项目中
    await this.checkPath();
    const content = await this.renderJson('_user', 'userManagement');

    const jsConfig = eval(content);
    new InitPage().renderContent(jsConfig);
  }

  async renderJson() {

    const templatePathFolder = `${path.join(__dirname, '../../../')}page-template-json/template/${this.templateName}`;
    const targetPathFolder = `./app`;

    // 复制 userManagement 文件
    const sourcePath = path.join(templatePathFolder, `${this.templateNameCamelCase}.js`);
    const targetPath = path.join(targetPathFolder, 'view', 'init-json', 'page', `${this.templateNameCamelCase}.js`);
    
    if (!fs.existsSync(path.dirname(targetPath))) {
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    }
    
    fs.copyFileSync(sourcePath, targetPath);
    
    this.success(`已复制 ${this.templateNameCamelCase}.js 文件`);

    // 复制 service 目录下的所有文件（如果存在）
    const serviceSourcePath = path.join(templatePathFolder, 'service');
    if (fs.existsSync(serviceSourcePath)) {
      const serviceTargetPath = path.join(targetPathFolder, 'service');
      
      if (!fs.existsSync(serviceTargetPath)) {
        fs.mkdirSync(serviceTargetPath, { recursive: true });
      }
      
      fs.readdirSync(serviceSourcePath).forEach(file => {
        const sourcePath = path.join(serviceSourcePath, file);
        const targetPath = path.join(serviceTargetPath, file);
        fs.copyFileSync(sourcePath, targetPath);
      });
      
      this.success(`已复制 ${this.templateNameCamelCase} service 目录下的所有文件`);
    }

    // 检查并执行 init.sql 文件
    const initSqlPath = path.join(templatePathFolder, 'init.sql');
    
    if (fs.existsSync(initSqlPath)) {
      let sql = fs.readFileSync(initSqlPath).toString();

      if (sql) {
        sql = sql.replace(/\{\{pageId}}/g, this.templateNameCamelCase);
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

    return fs.readFileSync(targetPath, 'utf-8');
  }

};
