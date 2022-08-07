'use strict';
const yargs = require('yargs');
const InitPage1Table = require('./page/init_page_1table');
const InitPage2Table = require('./page/init_page_2table');
const InitPage3Table = require('./page/init_page_3table');
const InitPageTestPage = require('./page/init_page_test_page');
const CommandBase = require('./command_base');
const inquirer = require('inquirer');

const pageTypes = [
  {
    value: '1table-page',
    name: 'generate pages from a table',
  }, {
    value: '2table-crud',
    name: 'generate pages from 2 related table',
  }, {
    value: '3table-crud',
    name: 'generate pages from 3 related table',
  }, {
    value: 'test-page',
    name: 'generate test page',
  }];


/**
 * 生成页面
 */
module.exports = class InitPageCommand extends CommandBase {

  async run(cwd, args) {
    this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;

    let pageType = '';
    if (this.argv.type) {
      if (pageTypes.find(o => o.value === this.argv.type)) {
        pageType = this.argv.type;
      }
    }
    if (!pageType) {
      pageType = await this.askForPageType();
    }

    if (pageType === '1table-crud') {
      await new InitPage1Table().run(process.cwd(), this.argv);
    } else if (pageType === '2table-crud') {
      await new InitPage2Table().run(process.cwd(), this.argv);
    } else if (pageType === '3table-crud') {
      await new InitPage3Table().run(process.cwd(), this.argv);
    } else if (pageType === 'test-page') {
      await new InitPageTestPage().run(process.cwd(), this.argv);
    }
    this.success('jianghu init page is success');
  }

  /**
   * get argv parser
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('init jianghu page .\nUsage: $0 page')
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
      pageSize: pageTypes.length,
    });
    return answer.pageType;
  }

};
