'use strict';
const yargs = require('yargs');
const InitPage1Table = require('./json/init_page_1table');
const InitPage2Table = require('./json/init_page_2table');
const CommandBase = require('./command_base');
const inquirer = require('inquirer');
const fs = require('fs');

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
    const jsonFile = this.argv.jsonFile;
    if (jsonText) {
      this.jsonArgv = JSON.parse(jsonText);
    }
    if (jsonFile) {
      const jsonFileText = fs.readFileSync(jsonFile).toString();
      this.jsonArgv = JSON.parse(jsonFileText);
    }
    if (this.jsonArgv.pageType === '1table-page') {
      await new InitPage1Table().run(process.cwd(), this.jsonArgv);
    } else if(this.jsonArgv.pageType === '2table-page'){
      await new InitPage2Table().run(process.cwd(), this.jsonArgv);
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
      jsonFile: {
        type: 'string',
        description: 'json file',
      },
    };
  }

};
