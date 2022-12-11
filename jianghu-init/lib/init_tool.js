'use strict';
const yargs = require('yargs');
const InitPageStatic = require('./page/init_page_static');
const CommandBase = require('./command_base');
const inquirer = require('inquirer');

const pageTypes = [
  {
    value: 'record-history-page',
    name: 'record-history-page - generate pages from record-history',
    pageId: 'recordHistory',
    path: 'template/record-history/',
  }, {
    value: 'user-management-page',
    name: 'user-management-page - generate pages from user-management',
    pageId: 'userManagement',
    path: 'template/user-management/',
  }, {
    value: 'user-group-role-page',
    name: 'user-group-role-page - generate pages from user-group-role',
    pageId: 'userGroupRole',
    path: 'template/user-group-role/',
  }, {
    value: 'user-page-resource-page',
    name: 'user-page-resource-page - generate pages from user-page-resource',
    pageId: 'userPageResource',
    path: 'template/user-page-resource/',
  }, {
    value: 'all',
    name: 'all - generate all above pages',
  }];


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

      await new InitPageStatic().run(process.cwd(), pageTypes.find(o => o.value === pageType));
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
