'use strict';
const yargs = require('yargs');
const InitPage1Table = require('./json/init_page_1table');
const CommandBase = require('./command_base');
const inquirer = require('inquirer');

const pageTypes = [
  {
    value: '1table-page',
    name: '1table-page - generate pages from a table',
  },
];


/**
 * 生成页面
 */
module.exports = class InitByJsonCommand extends CommandBase {

  async run(cwd, args) {
    this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;

    const jsonText = this.argv.jsonText;
    this.jsonArgv = JSON.parse(jsonText);
    if (this.jsonArgv.pageType === '1table-page') {
      await new InitPage1Table().run(process.cwd(), this.jsonArgv);
    }
    this.success('jianghu init by json is success');
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
      jsonText: {
        type: 'string',
        description: 'json text',
      },
    };
  }

};
