'use strict';
const yargs = require('yargs');
const InitBoilerplate = require('./init_boilerplate');
const InitTableData = require('./init_table_data');
const CommandBase = require('./command_base');
const path = require('path');
require('colors');
const fs = require('fs');
const util = require('util');
const exists = util.promisify(fs.exists);
/**
 * 生成项目，初始化数据库，初始化 view
 */
module.exports = class InitProjectCommand extends CommandBase {

  async run(cwd, args) {
    const argv = this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;
    // console.log('%j', argv);

    // 如果是 xiaoapp-in-multi，则需要先获取 dbPrefix
    const dbPrefix = this.tryGetDbPrefix();

    // 下载模板并生成项目
    const { targetDir, boilerplate } = await new InitBoilerplate({ dbPrefix }).run(cwd, args);
    const projectName = path.basename(path.resolve(targetDir));

    // 运行数据库初始化
    await this.initDb(boilerplate, projectName, dbPrefix);

    // done
    this.printGuide(targetDir, boilerplate);

    this.success('jianghu init project is success');
  }

  /**
   * get argv parser
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('init jianghu project .\nUsage: $0 project')
      .options(this.getParserOptions())
      .alias('h', 'help')
      .help();
  }

  /**
   * get yargs options
   * @return {Object} opts
   */
  getParserOptions() {
    return {
      type: {
        type: 'string',
        description: 'boilerplate type',
      },
    };
  }

  /**
   * 获取数据库配置
   */
  async getDbSetting(boilerplate, projectName) {
    let dbSetting = {};
    if (boilerplate.name === 'xiaoapp-in-multi' && fs.existsSync('user_app_management')) {
      // 读取 example 中的数据库前缀
      process.chdir('user_app_management');
      dbSetting = this.readDbConfigFromFile();
      process.chdir('..');
    } else {
      dbSetting.dbPrefix = this.tryGetDbPrefix();
      dbSetting.host = await this.readlineMethod('数据库IP：', '127.0.0.1');
      if (boilerplate.name !== 'multi') {
        const databaseName = projectName.replace(new RegExp('-', 'g'), '_');
        dbSetting.defaultDatabase = await this.readlineMethod('数据库名称：', databaseName);
      }
      dbSetting.port = await this.readlineMethod('数据库端口：', 3306);
      dbSetting.user = await this.readlineMethod('数据库账号：', 'root');
      dbSetting.password = await this.readlineMethod('数据库密码：', '123456');
    }
    return dbSetting;
  }

  /**
   * 运行数据库初始化
   */
  async initDb(boilerplate, projectName, dbPrefix) {
    // 确认要处理的 app
    const apps = [];
    if (boilerplate.name === 'multi') {
      apps.push('data_repository', 'user_app_management', 'directory'); // , 'simple_xiaoapp'
      process.chdir(projectName);
    } else {
      apps.push(projectName);
    }

    // 获取数据库配置
    const dbSetting = await this.getDbSetting(boilerplate, projectName);
    dbSetting.dbPrefix = dbSetting.dbPrefix || dbPrefix || '';
    if (['xiaoapp', 'xiaochengxu', 'workflow'].includes(boilerplate.name)) {
      dbSetting.dbPrefix = '';
    }

    for (const app of apps) {
      // 目录切换
      if (await exists(path.join(process.cwd(), app))) {
        this.success(`目录切换 ${app}`);
        process.chdir(app);
      }

      // 数据库初始化
      dbSetting.database = dbSetting.dbPrefix + (dbSetting.defaultDatabase || app);
      // console.log(dbSetting);
      await new InitTableData({ boilerplate, app, dbSetting }).run(process.cwd());

      // 写入数据库配置
      this.writeDbConfigToFile(dbSetting);

      process.chdir('..');
    }
  }

  /**
   * print usage guide
   */
  printGuide(targetDir, boilerplate) {
    if (boilerplate.name === 'multi') {
      this.success(`usage:
      - cd ${targetDir}
      - ls
      - cd your_app
      - npm install
      - npm start / npm run dev
    `);
    } else {
      this.success(`usage:
      - cd ${targetDir}
      - npm install
      - npm start / npm run dev
    `);
    }
  }

};
