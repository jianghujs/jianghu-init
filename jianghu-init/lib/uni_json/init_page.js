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

    const componentList = this.getConfigComponentList(jsonConfig);
    const htmlGenerate = nunjucks.renderString(listTemplate, Object.assign(jsonConfig, { componentList }));

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
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }

        try {
            const json = JSON.parse(data);

            // 要插入的页面对象
            const newPage = {
                "path": `pages/${pageId}`,
                "style": {
                    "navigationBarTitleText": pageName
                }
            };

            // 检查是否已存在相同的路径，避免重复插入
            const exists = json.pages.some(page => page.path === newPage.path);
            if (!exists) {
                json.pages.push(newPage);
            } else {
                console.log('Page already exists in the JSON.');
            }

            // 将修改后的 JSON 对象转换为字符串
            const updatedData = JSON.stringify(json, null, 2);

            // 将字符串写回到 pages.json 文件
            fs.writeFile(filePath, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing the file:', err);
                    return;
                }
                console.log('Page added successfully.');
            });
        } catch (err) {
            console.error('Error parsing JSON:', err);
        }
    });
  }
};
