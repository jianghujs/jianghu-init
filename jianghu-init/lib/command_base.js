'use strict';
const chalk = require('chalk');
const symbols = require('log-symbols');

require('colors');
const fs = require('fs');
const inquirer = require('inquirer');
const assert = require('assert');
const Knex = require('knex');
const path = require('path');
const _ = require('lodash');

/**
 * 基本类，包括一些操作 DB 的命令
 */
module.exports = class CommandBase {
  constructor() {
    this.knex = null;
    this.multiDemoProject = ['enterprise', 'enterprise-v2'];
    this.inMultiDemoProject = ['1table-crud-enterprise', '1table-crud-enterprise-v2'];
    this.demoProject = ['xiaochengxu', 'workflow', '1table-crud', '3table-crud'];
  }

  static dbPrefix = '';
  static needDbPrefix = false;

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
  async readDbConfigFromFile() {
    const configData = fs.readFileSync('./config/config.local.js').toString();
    const setting = {};
    // 去除注释
    let fileContent = configData.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
    // 匹配到 connection 配置的块
    fileContent = fileContent.match(/connection: {[\s\S]*?}/)[0];
    [ 'host', 'port', 'user', 'password', 'database' ].forEach(key => {
      const regStr = `${key}:\s?(.*)`;
      const reg = new RegExp(regStr);
      const matchResult = fileContent.match(reg);
      setting[key] = matchResult[1].replace(/'/g, '').replace(/\s+/g, '').replace(/,/g, '')
        .replace(/"/g, '');
    });

    if (CommandBase.needDbPrefix) {
      setting.dbPrefix = await this.tryGetDbPrefix();
    }

    // 如果配置文件中包含 process.env 则需要读取 .env 文件
    if (Object.values(setting).join('').includes('process.env')) {
      const dotenvRequire = configData.match(/require\('dotenv'\).config\({path:\s*(.*)}\)/);
      const envContent = dotenvRequire ? this.loadDotEnv(dotenvRequire[1]) : {};
      for (const key in setting) {
        if (setting[key].includes('process.env')) {
          const k = setting[key].split('.').pop();
          setting[key] = envContent[k] || setting[key];
        }
      }
    }

    // 如果配置中仍包含 process.env 则说明配置文件中的配置不正确
    if (Object.values(setting).join('').includes('process.env')) {
      this.error('请检查配置文件 config.local.js 中的数据库连接配置是否正确');
      process.exit();
    }
    return setting;
  }

  loadDotEnv(dotenvRequire) {
    // 切换到 config 目录下读取 .env 文件
    // 记录 pwd
    const oldPath = process.cwd();
    const configDir = path.resolve(oldPath, 'config');
    const dotenvAbsolutePath = dotenvRequire.match(/['"](.*)['"]/);
    const envFilePath = path.resolve(configDir, dotenvAbsolutePath[1]);

    // eslint-disable-next-line no-eval
    const data = fs.readFileSync(envFilePath, 'utf-8');
    const lines = data.split('\n');
    const env = {};
    for (const line of lines) {
      const [ key, value ] = line.split('=');
      if (key && value) {
        env[key] = value;
      }
    }
    process.chdir(oldPath);
    return env;
  }

  async tryGetDbPrefix() {
    if (fs.existsSync('config/config.local.example.js')) {
      const dbPrefix = CommandBase.dbPrefix || await this.readDbPrefixFromFile();
      return dbPrefix || '';
    }

    const { systemDir } = this.getEnterpriseDir();
    const enterPriseSystemDir = fs.existsSync(systemDir);
    if (!enterPriseSystemDir) {
      throw new Error(`未获取到多应用项目【${systemDir}】，请检查项目目录结构`);
    }

    if (fs.existsSync(`${systemDir}/config/config.local.example.js`)) {
      const oldPath = process.cwd();
      process.chdir(systemDir);
      const dbPrefix = CommandBase.dbPrefix || await this.readDbPrefixFromFile();
      process.chdir(oldPath);
      return dbPrefix || '';
    }
    throw new Error(`未获取到多应用项目【${systemDir}】，请检查项目目录结构`);
  }

  getEnterpriseDir() {
    const enterPriseV1 = fs.existsSync('user_app_management');
    const enterPriseV2 = fs.existsSync('base-system');
    const enterPriseConfig = fs.existsSync('.jianghu/init-config.json');

    const enterPriseUpperV1 = fs.existsSync('../user_app_management');
    const enterPriseUpperV2 = fs.existsSync('../base-system');
    const enterPriseUpperConfig = fs.existsSync('../.jianghu/init-config.json');
    let prefix = '';
    if (enterPriseUpperV1 || enterPriseUpperV2 || enterPriseUpperConfig) {
      prefix = '../';
    }

    if (enterPriseV1 || enterPriseUpperV1) {
      return {
        systemDir: `${prefix}user_app_management`,
        dataRepositoryDir: `${prefix}data_repository`,
        directoryDir: `${prefix}directory`,
      };
    }
    if (enterPriseV2 || enterPriseUpperV2) {
      return {
        systemDir: `${prefix}base-system`,
        dataRepositoryDir: `${prefix}data-repository`,
        directoryDir: `${prefix}base-directory`,
      };
    }
    if (enterPriseConfig || enterPriseUpperConfig) {
      try {
        const initConfig = JSON.parse(fs.readFileSync(`${prefix}.jianghu/init-config.json`, 'utf8'));
        console.log('initConfig', initConfig);
        if (!initConfig.enterprise) {
          throw new Error('多应用配置 init-config.json 文件中缺少 enterprise 配置');
        }
        return {
          systemDir: `${prefix}${initConfig.enterprise.systemDir}`,
          dataRepositoryDir: `${prefix}${initConfig.enterprise.dataRepositoryDir}`,
          directoryDir: `${prefix}${initConfig.enterprise.directoryDir}`,
        };
      } catch (error) {
        const defaultError = '识别 .jianghu/init-config.json 配置文件失败，请检查 .jianghu/init-config.json 文件是否正确';
        throw new Error(error || defaultError);
      }
    }

    throw new Error('未识别到多应用项目');
  }

  /**
   * 从 example 配置文件 config.local.example.js 中读取数据库连接配置
   */
  async readDbPrefixFromFile() {
    if (!CommandBase.needDbPrefix) {
      return CommandBase.dbPrefix;
    }
    const { systemDir } = this.getEnterpriseDir();
    if (CommandBase.dbPrefix) {
      return CommandBase.dbPrefix;
    }
    const configData = fs.readFileSync('./config/config.local.example.js').toString();
    const regStr = 'database: [\'\"](.*)[\'\"],?';
    const reg = new RegExp(regStr);
    const matchResult = configData.match(reg);
    // console.log(regStr, configData, matchResult);
    const dbPrefix = matchResult[1].replace(_.snakeCase(systemDir), '');
    if (dbPrefix) {
      const dbPrefixConfirm = dbPrefix.endsWith('_') ? dbPrefix : dbPrefix + '_';
      // 第一次执行才询问确认
      const answer = await inquirer.prompt({
        name: 'value',
        type: 'input',
        default: dbPrefixConfirm,
        message: 'database prefix',
      });
      const result = answer.value || dbPrefixConfirm;
      
      // 缓存结果，避免重复询问
      CommandBase.dbPrefix = result.endsWith('_') ? result : result + '_';
      return CommandBase.dbPrefix;
    }
    return dbPrefix;
  }

  info(msg) {
    console.log(symbols.info, msg);
  }

  success(msg) {
    console.log(symbols.success, chalk.green(msg));
  }

  warning(msg) {
    console.log(symbols.info, chalk.yellowBright(msg));
  }

  error(msg) {
    console.error(symbols.error, chalk.red(msg));
  }

  notice(msg) {
    console.log(symbols.info, chalk.blue(msg));
  }

};
