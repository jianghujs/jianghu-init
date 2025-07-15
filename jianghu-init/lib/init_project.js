'use strict';
const yargs = require('yargs');
const InitBoilerplate = require('./project/init_boilerplate');
const InitTableData = require('./project/init_table_data');
const CommandBase = require('./command_base');
const path = require('path');
require('colors');
const fs = require('fs');
const util = require('util');
const exists = util.promisify(fs.exists);
const _ = require('lodash');

/**
 * 生成项目，初始化数据库，初始化 view
 */
module.exports = class InitProjectCommand extends CommandBase {

  async run(cwd, args) {
    this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;

    // 如果是 xiaoapp-in-multi，则需要先获取 dbPrefix
    // const dbPrefix = await this.tryGetDbPrefix();

    // 下载模板并生成项目
    const { targetDir, boilerplate, database = '' } = await new InitBoilerplate().run(cwd, args);

    const projectName = path.basename(path.resolve(targetDir));

    const dbConfig = {
      dbIp: this.argv.dbIp,
      dbPort: this.argv.dbPort,
      dbUser: this.argv.dbUser,
      dbPass: this.argv.dbPass,
    };

    // 运行数据库初始化
    await this.initDb(boilerplate, projectName, database, dbConfig);

    // done
    this.printGuide(targetDir, boilerplate);


    this.success(`🎉 成功创建项目 ${projectName}`);
  }

  /**
   * get argv parser
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('🚀 init jianghu project .\nUsage: jianghu-init project --type=1table-crud my-project')
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
        description: 'project type',
      },
      dbIp: {
        type: 'string',
        description: 'database ip',
      },
      dbPort: {
        type: 'string',
        description: 'database port',
      },
      dbUser: {
        type: 'string',
        description: 'database user',
      },
      dbPass: {
        type: 'string',
        description: 'database pass',
      },
    };
  }

  /**
   * 获取数据库配置
   */
  async getDbSetting(boilerplate, projectName, database, dbConfig) {
    let dbSetting = {};
    if (this.inMultiDemoProject.includes(boilerplate.name)) {
      const { systemDir } = this.getEnterpriseDir();
      const oldPath = process.cwd();
      process.chdir(systemDir);
      dbSetting = await this.readDbConfigFromFile();
      process.chdir(oldPath);
    } else {
      dbSetting.dbPrefix = await this.tryGetDbPrefix();
      dbSetting.host = dbConfig.dbIp || await this.readlineMethod('数据库IP：', '127.0.0.1');
      if (!this.multiDemoProject.includes(boilerplate.name)) {
        // const databaseName = projectName.replace(new RegExp('-', 'g'), '_');
        // dbSetting.defaultDatabase = await this.readlineMethod('数据库名称：', databaseName);
        dbSetting.defaultDatabase = database;
      }
      dbSetting.port = dbConfig.dbPort || await this.readlineMethod('数据库端口：', 3306);
      dbSetting.user = dbConfig.dbUser || await this.readlineMethod('数据库账号：', 'root');
      dbSetting.password = dbConfig.dbPass || await this.readlineMethod('数据库密码：', '123456');
    }
    return dbSetting;
  }

  /**
   * 运行数据库初始化
   */
  async initDb(boilerplate, projectName, database, dbConfig) {
    // 确认要处理的 app
    const apps = [];
    if (this.multiDemoProject.includes(boilerplate.name)) {
      const { systemDir, dataRepositoryDir, directoryDir } = this.getEnterpriseDir();
      apps.push(dataRepositoryDir, systemDir, directoryDir);
      // 不在项目目录，则切换到项目目录
      if (projectName !== path.basename(path.resolve('.'))) {
        process.chdir(projectName);
      }
    } else {
      apps.push(projectName);
    }

    // 获取数据库配置
    const dbSetting = await this.getDbSetting(boilerplate, projectName, database, dbConfig);
    dbSetting.dbPrefix = dbSetting.dbPrefix || '';
    if (!this.multiDemoProject.includes(boilerplate.name) && !this.inMultiDemoProject.includes(boilerplate.name)) {
      dbSetting.dbPrefix = '';
    }
    for (const app of apps) {
      // 目录切换
      if (await exists(path.join(process.cwd(), app))) {
        // this.success(`Switching directory to ${app}`);
        process.chdir(app);
      }

      // 数据库初始化
      dbSetting.database = dbSetting.dbPrefix + (dbSetting.defaultDatabase || _.snakeCase(app));
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
    const relativeTargetDir = path.relative(process.cwd(), targetDir);
    if (this.multiDemoProject.includes(boilerplate.name)) {
      this.success(`👉 使用以下命令开始:
      - cd ${relativeTargetDir}
      - ls
      - cd your_app
      - npm install
      - npm start / npm run dev
    `);
    } else {
      this.success(`👉 使用以下命令开始:
      - cd ${relativeTargetDir}
      - npm install
      - npm start / npm run dev
    `);
    }
  }

};
