'use strict';
const yargs = require('yargs');
const CommandBase = require('../../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');
const mixin = require('./mixin.js');
const InitPage = require('../init_page');

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
    const content = await this.renderJson('_user', 'userManagement');

    const jsConfig = eval(content);
    new InitPage().renderContent(jsConfig);
  }

  async renderJson() {

    const templatePathFolder = `${path.join(__dirname, '../../../')}page-template-json/template/${this.templateName}`;
    const targetPathFolder = `./app`;

    // 复制 userManagement 文件
    const userManagementSourcePath = path.join(templatePathFolder, `${this.templateNameCamelCase}.js`);
    const userManagementTargetPath = path.join(targetPathFolder, 'view', 'init-json', 'page', `${this.templateNameCamelCase}.js`);
    
    if (!fs.existsSync(path.dirname(userManagementTargetPath))) {
      fs.mkdirSync(path.dirname(userManagementTargetPath), { recursive: true });
    }
    
    fs.copyFileSync(userManagementSourcePath, userManagementTargetPath);
    
    this.success(`已复制 ${this.templateNameCamelCase}.js 文件`);

    // 复制 service 目录下的所有文件
    const serviceSourcePath = path.join(templatePathFolder, 'service');
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

    return fs.readFileSync(userManagementTargetPath, 'utf-8');
  }
};
