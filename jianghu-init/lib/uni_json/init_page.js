'use strict';
const CommandBase = require('../command_base');

require('colors');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');
const CJSON = require('comment-json')
const { promisify } = require('util');
const mixin = require('./mixin.js');

// 将 fs.readFile 转换为返回 Promise 的函数
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

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
    // 检查当前目录是否是在项目中
    await this.checkUniappPath();
    await this.renderVue(jsonArgv);
    await this.updatePagesJson(jsonArgv);
  }

  async renderContent(jsonConfig, dev = false) {
    await this.renderVue(jsonConfig);
    await this.updatePagesJson(jsonConfig);
  }

  // 生成 vue
  async renderVue(jsonConfig) {
    // const pageBakDir = './app/view/pageBak';
    // if (!fs.existsSync(pageBakDir)) fs.mkdirSync(pageBakDir);

    const { pageId, pageType } = jsonConfig;
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

    // const componentList = this.getConfigComponentList(jsonConfig);
    const htmlGenerate = nunjucks.renderString(listTemplate, Object.assign(jsonConfig, { componentList: jsonConfig.componentList }));

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

  // 页面添加到pages.json
  async updatePagesJson(jsonConfig) {
    const { pageId, pageName } = jsonConfig;
    // 读取并解析 pages.json 文件
    const filePath = './pages.json';

    try {
      // 读取 JSON 文件
      const data = await readFileAsync(filePath, 'utf8');

      // 解析 JSON
      const jsonData = CJSON.parse(data.toString());
              
      // 要插入的页面对象
      const pageConfig = {
          "path": `pages/${pageId}`,
          "style": {
              "navigationBarTitleText": pageName
          }
      };

      // 检查是否已存在相同的路径，避免重复插入
      const exists = jsonData.pages.some(page => page.path === pageConfig.path);
      if (!exists) {
          jsonData.pages.push(pageConfig);
      } else {
          const index = _.findIndex(jsonData.pages, {path: pageConfig.path})
          jsonData.pages[index].style.navigationBarTitleText = pageName;
      }

      // 将修改后的 JSON 对象转换为字符串
      const updatedData = CJSON.stringify(jsonData, null, 2);

      // 将字符串写回到 pages.json 文件
      await writeFileAsync(filePath, updatedData, 'utf8');

      console.log('pages.json file has been updated successfully.');
  
    } catch (err) {
        console.error('update pages.json file Error:', err);
    }
  }
};
