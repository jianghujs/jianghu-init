'use strict';
const chalk = require('chalk');
const symbols = require('log-symbols');

require('colors');
const fs = require('fs');
const inquirer = require('inquirer');
const assert = require('assert');
const Knex = require('knex');

/**
 * 基本类，包括一些操作 DB 的命令
 */
module.exports = class CommandBase {
  constructor() {
    this.knex = null;
    this.multiDemoProject = ['multi', 'enterprise'];
    this.inMultiDemoProject = ['xiaoapp-in-multi', '1table-enterprise'];
    this.demoProject = ['xiaoapp', 'xiaochengxu', 'workflow', '1table', '3table'];
  }

  /**
   * 检查路径
   */
  async checkPath() {
    const checkDone = fs.existsSync('./config') &&
      fs.existsSync('./app') &&
      fs.existsSync('./app.js') &&
      fs.existsSync('./package.json');
    if (!checkDone) {
      this.error('Please change to jianghu project path');
      process.exit();
    }
  }

  /**
   * 读取用户输入
   * @param message 提示信息
   * @param defValue 默认值
   */
  async readlineMethod(message, defValue) {
    const answer = await inquirer.prompt({
      name: 'value',
      type: 'input',
      default: defValue,
      message,
    });
    return answer.value || defValue;
  }

  /**
   * 获取 knex，会从 config.local.js 读取数据库连接配置，如果文件不存在则会询问用户并保存文件
   */
  async getKnex(dbSetting, forceReconnect = false) {
    if (!this.knex || forceReconnect) {
      await this.initDbConnection(dbSetting);
    }
    assert(this.knex != null);
    return this.knex;
  }

  /**
   * 初始化数据库链接
   */
  async initDbConnection(dbSetting) {
    this.knex = Knex({
      client: 'mysql',
      connection: dbSetting,
    });
  }

  /**
   * 将数据库配置写入配置文件 config.local.js
   */
  writeDbConfigToFile(setting) {
    const configPath = './config/config.local.js';
    const examplePath = './config/config.local.example.js';

    let configData = fs.readFileSync(examplePath).toString();
    [ 'host', 'port', 'user', 'password', 'database' ].forEach(key => {
      const regStr = `${key}:.*`;
      const reg = new RegExp(regStr, 'g');
      const matchResult = configData.match(reg);
      if (key === 'port') {
        configData = configData.replace(new RegExp(matchResult[0], 'g'), `${key}: ${setting[key]},`);
      } else {
        configData = configData.replace(new RegExp(matchResult[0], 'g'), `${key}: '${setting[key]}',`);
      }
    });
    fs.writeFileSync(configPath, configData);
  }

  /**
   * 从配置文件 config.local.js 中读取数据库连接配置
   */
  readDbConfigFromFile() {
    const configData = fs.readFileSync('./config/config.local.js').toString();
    const setting = {};
    [ 'host', 'port', 'user', 'password', 'database' ].forEach(key => {
      const regStr = `${key}: (.*)`;
      const reg = new RegExp(regStr);
      const matchResult = configData.match(reg);
      setting[key] = matchResult[1].replace(/'/g, '').replace(/,/g, '').replace(/"/g, '');
    });
    setting.dbPrefix = this.tryGetDbPrefix();
    return setting;
  }

  tryGetDbPrefix() {
    if (fs.existsSync('config/config.local.example.js')) {
      const dbPrefix = this.readDbPrefixFromFile();
      return dbPrefix || '';
    }
    if (fs.existsSync('user_app_management/config/config.local.example.js')) {
      const oldPath = process.cwd();
      process.chdir('user_app_management');
      const dbPrefix = this.readDbPrefixFromFile();
      process.chdir(oldPath);
      return dbPrefix || '';
    }
    if (fs.existsSync('../user_app_management/config/config.local.example.js')) {
      const oldPath = process.cwd();
      process.chdir('../user_app_management');
      const dbPrefix = this.readDbPrefixFromFile();
      process.chdir(oldPath);
      return dbPrefix || '';
    }
    return '';
  }

  /**
   * 从 example 配置文件 config.local.example.js 中读取数据库连接配置
   */
  readDbPrefixFromFile() {
    const configData = fs.readFileSync('./config/config.local.example.js').toString();
    const regStr = 'database: [\'\"](.*)[\'\"],?';
    const reg = new RegExp(regStr);
    const matchResult = configData.match(reg);
    // console.log(regStr, configData, matchResult);
    return matchResult[1].replace('user_app_management', '');
  }

  info(msg) {
    console.log(symbols.info, msg);
  }

  success(msg) {
    console.log(symbols.success, chalk.green(msg));
  }

  warning(msg) {
    console.log(symbols.error, chalk.yellowBright(msg));
  }

  error(msg) {
    console.error(symbols.error, chalk.red(msg));
  }

};
