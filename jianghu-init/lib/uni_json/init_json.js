'use strict';
const CommandBase = require('../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
// const _ = require('lodash');
const path = require('path');

const pageTypeList = [
  { value: 'example', name: '模板' },
  // { value: 'index', name: '首页' },
  // { value: 'goodsList', name: '商品列表' },
  // { value: 'goods', name: '商品详情' },
  // { value: 'articleList', name: '咨询列表' },
  // { value: 'article', name: '咨询详情' },
  // { value: 'user', name: '用户中心' },
];

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitJson extends CommandBase {

  async run(cwd, argv) {
    this.cwd = cwd;
    this.argv = argv;
    // 检查配置 && 生成json配置中缺省的默认配置
    // 检查当前目录是否是在项目中
    await this.checkUniappPath();
    const config = await this.promptConfig();
    await this.buildJson(config);
    this.success('生成配置文件成功！');
  }

  // 确认生成表
  async promptConfig() {
    const res = await inquirer.prompt({
      name: 'pageType',
      type: 'list',
      choices: pageTypeList,
      message: '请选择图表类型',
    });
    const pageType = res.pageType;

    // 输入路径
    const { filename } = await inquirer.prompt({
      name: 'filename',
      type: 'input',
      message: '请输入路径文件',
      default: 'example/index',
    });
    return { pageType, filename };
  }


  // 生成 json
  async buildJson({ pageType, filename }) {
    // 检测创建文件夹
    const pathPrefix = filename.includes('/') ? filename.split('/')[0] : '';
    const targetDir = './init-json/page' + (pathPrefix ? '/' + pathPrefix : '');
    // 判断目录不存在就创建
    try {
      fs.mkdirSync(targetDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }

    this.getJhContent({ pageType, filename, targetDir });
  }

  getJhContent({ pageType, filename }) {
    const templateDir = path.join(__dirname, '../../') + 'page-template-uni-json/jh-page';
    const pageTypeMap = {
      example: 'example.js',
      index: 'index.js',
      goodsList: 'goodsList.js',
      goods: 'goods.js',
      articleList: 'articleList.js',
      article: 'article.js',
      user: 'user.js',
    };

    // 复制文件到 targetDir
    fs.copyFileSync(`${templateDir}/${pageTypeMap[pageType]}`, `./init-json/page/${filename}.js`);
  }

};
