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
    // app 默认使用 database，如果有前缀则需要去掉前缀
    await this.checkUniappPath();
    await this.renderVue(jsonArgv);
  }

  async renderContent(jsonConfig, dev = false) {
    await this.renderVue(jsonConfig);
  }

  // 生成 vue
  async renderVue(jsonConfig) {
    const { componentPath, pageType } = jsonConfig;
    const filepath = `./components/${componentPath}.vue`;
    const templatePath = `${path.join(__dirname, '../../')}page-template-uni-json/jh-component`;
    const templateTargetPath = `${templatePath}/${pageType}.njk.html`;
    const listTemplate = fs.readFileSync(templateTargetPath)
      .toString()
      .replace(/\/\/===\/\/ /g, '')
      .replace(/\/\/===\/\//g, '');

    // 初始化 njk 模板标签、filter
    this.handleNunjucksEnv(templateTargetPath);
    this.handleJsonConfig(jsonConfig);

    const componentList = this.getConfigComponentList(jsonConfig);
    const htmlGenerate = nunjucks.renderString(listTemplate, Object.assign(jsonConfig, { componentList }));

    if (componentPath.includes('/')) {
      const componentPathArr = componentPath.split('/');
      const componentDir = componentPathArr.slice(0, componentPathArr.length - 1).join('/');

      const componentDirPath = `./components/${componentDir}`;
      if (!fs.existsSync(componentDirPath)) {
        fs.mkdirSync(componentDirPath);
      }
    }

    // fs.writeFileSync(filepath, htmlUser);
    fs.writeFileSync(filepath, htmlGenerate);
    return true;
  }

};
