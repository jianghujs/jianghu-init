'use strict';
const yargs = require('yargs');
const InitPage1Table = require('./json/template/init_page_1table');
const InitPage1TableFile = require('./json/template/init_page_1table_file');
const InitPage2Table = require('./json/template/init_page_2table');
const InitPage3Table = require('./json/template/init_page_3table');
const InitPageTestPage = require('./json/template/init_page_test_page');
const InitComponentCrudRelateTable = require('./json/template/init_component_crud_relate_table');
const InitPageStaticJson = require('./json/template/init_page_default');
const CommandBase = require('./command_base');
const inquirer = require('inquirer');

const pageTypes = [
  {
    value: '1table-page',
    name: '1table-page - generate pages from a table',
  }, {
    value: '1table-file-page',
    name: '1table-file-page - generate pages from a table',
  }, {
    value: '2table-page',
    name: '2table-page - generate pages from 2 related table',
  }, {
    value: '3table-page',
    name: '3table-page - generate pages from 3 related table',
  }, {
    value: 'captcha-login',
    name: 'captcha-login - generate captcha login page',
    pageId: 'captchaLogin',
    path: 'template/captcha-login/',
  }, {
    value: 'manual-page',
    name: 'manual-page - generate manual page from a table',
    pageId: 'manual',
    path: 'template/manual/',
  }, {
    value: 'reset-password-page',
    name: 'reset-password-page - generate pages from reset-password',
    pageId: 'resetPassword',
    path: 'template/reset-password/',
  }, {
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
    value: 'user-group-role-enterprise-page',
    name: 'user-group-role-enterprise-page - generate pages from user-group-role-enterprise',
    pageId: 'userGroupRoleEnterprise',
    path: 'template/user-group-role-enterprise/',
  }, {
    value: 'user-page-resource-page',
    name: 'user-page-resource-page - generate pages from user-page-resource',
    pageId: 'userPageResource',
    path: 'template/user-page-resource/',
  }, {
    value: 'page-log',
    name: 'page-log - view page log',
    pageId: 'pageLog',
    path: 'template/page-log/',
  }, {
    value: 'constant',
    name: 'constant - management constant',
    pageId: 'constant',
    path: 'template/constant/',
  }, {
    value: 'component-crud-relate-table',
    pageId: 'componentCrudRelateTable',
    path: 'template/component-crud-relate-table/',
    name: 'component-crud - generate component from a relate table for targetPage',
  }, {
    value: 'file-manager-page',
    pageId: 'fileManager',
    path: 'template/file-manager/',
    name: 'file-manager-page - generate file manager page from a table',
  }, {
    value: 'test-page',
    path: 'template/test/',
    name: 'test-page - generate test page from a table',
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

    if (pageType === '1table-page') {
      await new InitPage1Table().run(process.cwd(), this.argv);
    } else if (pageType === '1table-file-page') {
      await new InitPage1TableFile().run(process.cwd(), this.argv);
    } else if (pageType === '2table-page') {
      await new InitPage2Table().run(process.cwd(), this.argv);
    } else if (pageType === '3table-page') {
      await new InitPage3Table().run(process.cwd(), this.argv);
    } else if (pageType === 'test-page') {
      await new InitPageTestPage().run(process.cwd(), this.argv);
    } else if (pageType === 'component-crud-relate-table') {
      await new InitComponentCrudRelateTable().run(process.cwd(), this.argv);
    } else {
      await new InitPageStaticJson().run(process.cwd(), pageTypes.find(o => o.value === pageType));
    }
    this.success('jianghu init page is success');
  }
  
  /**
   * get argv parser
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('🚀 init jianghu page .\n🔧 Usage: jianghu-init page --type=1table-page')
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
