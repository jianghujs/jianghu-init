'use strict';
const yargs = require('yargs');
const path = require('path');
const Importer = require('mysql-import');
let importer = null;
const CommandBase = require('../command_base');

require('colors');
const fs = require("fs");

/**
 * 初始化数据库表格及数据
 */
module.exports = class InitTableData extends CommandBase {

  constructor(options) {
    super();
    options = options || {};
    this.dbSetting = options.dbSetting || {};
    this.app = options.app || '';
    this.boilerplate = options.boilerplate || {};
  }

  async run(cwd, args) {
    const argv = this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;
    // console.log('argv %j', cwd, this.argv);

    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 创建数据库
    await this.createDatabase();
    // 创建表格
    await this.createTables();

    this.success('初始化`数据库基本表和数据`完成');
  }

  /**
   * get argv parser
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('init jianghu db .\nUsage: $0')
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

  async createTables() {
    if (fs.existsSync('sql/extend.sql')) {
      await importer.import('sql/extend.sql');
    }
    if (fs.existsSync('sql/1.init.sql')) {
      await importer.import('sql/1.init.sql');
      return true;
    }
    if (fs.existsSync('sql/init.sql')) {
      await importer.import('sql/init.sql');
      return true;
    }
    return true;
  }

  async createDatabase() {
    // 数据库创建时，knex 不能指定 database
    const {database, ...createDbSetting} = this.dbSetting;
    let knex = await this.getKnex(createDbSetting, true);
    await knex.schema.raw(`CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin`);
    await this.getKnex(this.dbSetting, true);

    importer = new Importer(this.dbSetting);
    importer.onProgress(progress => {
      const percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
      console.log(`\t [mysql importer] ${percent}% Completed`);
    });
    return true;
  }

};
