'use strict';
const yargs = require('yargs');
const InitToolScript = require('./tool/init_tool_script');
const CommandBase = require('./command_base');
const inquirer = require('inquirer');

const pageTypes = [
  {
    type: 'tool',
    value: 'initSqlToResourceList',
    name: 'initSqlToResourceList - 将init.sql转换成init-json的resouceList',
  },
  {
    type: 'tool',
    value: 'updateResourceId',
    name: 'updateResourceId - 按pageId更新_resouce表id，方便排序查看',
  },
  {
    type: 'tool',
    value: 'htmlToInitJson',
    name: 'htmlToInitJson - 将html文件转换成init-json配置文件',
  },
  {
    type: 'tool',
    value: 'dumpSqlFile',
    name: 'dumpSqlFile - 导出数据库数据表为sql文件',
  },
  {
    type: 'tool',
    value: 'exportProjectDocs',
    name: 'exportProjectDocs - 导出当前项目目录结构, 系统数据表为md文档',
  },
];


/**
 * 生成页面
 */
module.exports = class InitToolCommand extends CommandBase {

  async run(cwd, args) {
    this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;

    let pageType = '';
    if (this.argv.type) {
      if (pageTypes.find(o => o.value === this.argv.type)) {
        pageType = this.argv.type;
      }
    }
    if (this.argv.type === 'all' || args[0] === 'all') {
      for (const page of pageTypes) {
        if (page.value === 'all') {
          continue;
        }
        page.queryPageId = false;
        await new InitPageStatic().run(process.cwd(), page);
      }
      this.success('jianghu init tool is success');
    } else {
      if (!pageType) {
        pageType = await this.askForPageType();
      }
      const page = pageTypes.find(o => o.value === pageType);
      if (this.argv.pageId) {
        page.queryPageId = false;
        page.pageId = this.argv.pageId;
      }
      page.y = this.argv.y;

      await new InitToolScript().run(process.cwd(), page);
      this.success('jianghu init tool is success');
    }
  }

  /**
   * get argv parser
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('init jianghu tool .\nUsage: $0 page')
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
        description: 'page type',
      },
    };
  }

  async askForPageType() {
    const answer = await inquirer.prompt({
      name: 'pageType',
      type: 'list',
      message: 'Please select a page type',
      choices: pageTypes,
      pageSize: pageTypes.length + 1,
    });
    return answer.pageType;
  }

};
