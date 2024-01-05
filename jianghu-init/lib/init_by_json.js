'use strict';
const yargs = require('yargs');
const InitPage1Table = require('./json/init_page_1table');
const InitComponent1Table = require('./json/init_component_1table');
const InitPage2Table = require('./json/init_page_2table');
const InitJson = require('./json/init_json');
const CommandBase = require('./command_base');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const jsonTypes = [
  {
    value: 'page',
    name: 'init page by json text',
  },
  {
    value: 'json',
    name: 'init json by table',
  }
];
const pageTypeList = [
  {value: '1table-page', name: '1table-page'},
  {value: '1table-component', name: '1table-component'},
]


/**
 * 生成页面
 */
module.exports = class InitByJsonCommand extends CommandBase {

  async run(cwd, args) {
    this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;

    const jsonText = this.argv.jsonText;
    const jsonFile = this.argv.jsonFile;
    const jsFile = this.argv.jsFile;
    let handleType = this.argv['generateType'] || 'page';
    if (jsonText) {
      this.jsonArgv = JSON.parse(jsonText);
    } else if (jsonFile) {
      const jsonFileText = fs.readFileSync(jsonFile).toString();
      this.jsonArgv = JSON.parse(jsonFileText);
    } else if (jsFile) {
      this.jsonArgv = require(jsFile);
    } else {
      if (!this.argv['generateType']) {
        handleType = await this.askForPageType();
      }
    }

    let pageType = this.jsonArgv?.pageType || '';
    if (handleType === 'json') {
      await new InitJson().run(process.cwd(), this.argv);
    } else if (handleType === 'page' && !this.jsonArgv) {
      // 1. 选择生成页面还是组件
      const jsonArgv = await this.promptConfig();
      if (!jsonArgv) {
        this.error('没有可选择的文件，流程结束');
      } else {
        pageType = jsonArgv.pageType;
        if (pageType === '1table-page') {
          await new InitPage1Table().run(process.cwd(), jsonArgv, this.argv);
        } else if (pageType === '1table-component') {
          await new InitComponent1Table().run(process.cwd(), jsonArgv, this.argv);
        } else if(pageType === '2table-page'){
          await new InitPage2Table().run(process.cwd(), jsonArgv, this.argv);
        }
        this.success('jianghu init by json is success');
      }
      
    } else if (pageType === '1table-page') {
      await new InitPage1Table().run(process.cwd(), this.jsonArgv);
    } else if (pageType === '1table-component') {
      await new InitComponent1Table().run(process.cwd(), this.jsonArgv);
    } else if(pageType === '2table-page'){
      await new InitPage2Table().run(process.cwd(), this.jsonArgv);
    }
    // this.success('jianghu init by json is success');
  }

  /**
   * 确认生成表
   */
  async promptConfig() {
    let type = this.argv.pageType;
    if (!type) {
      const res = await inquirer.prompt({
        name: 'type',
        type: 'list',
        choices: pageTypeList,
        message: `请选择类型`,
      });
      type = res.type;
      this.argv.pageType = type;
    }
    let generateFileDir;
    if (type === '1table-page') {
      generateFileDir = `./app/view/init-json/page`;
    } else if (type === '1table-component') {
      generateFileDir = `./app/view/init-json/component`;
    } else {
      this.error(`不存在的配置类型${type}`);
      return false;
    }
    let file;
    if (fs.existsSync(generateFileDir)) {
      // 选择页面文件
      let fileItem = (this.argv['file'] || '').split('.')[0];
      if (!fileItem) {
        const fileList = fs.readdirSync(generateFileDir);
        const res = await inquirer.prompt({
          name: 'fileItem',
          type: 'list',
          choices: fileList,
          message: `请选择页面文件`,
        });
        fileItem = res.fileItem;
        this.argv.file = fileItem;
      } else {
        if (!fs.existsSync(`${generateFileDir}/${fileItem}.js`)) {
          this.error(`文件${fileItem}.js不存在`);
          return false;
        }
      }
      const filePath = path.resolve(`${generateFileDir}/${fileItem}`);
      file = require(filePath);
    }
    return file;
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
      excludeColumn: {
        type: 'array',
        description: 'exclude column',
      }
    };
  }

  async askForPageType() {
    const answer = await inquirer.prompt({
      name: 'jsonType',
      type: 'list',
      message: 'Please select a json type',
      choices: jsonTypes,
      pageSize: jsonTypes.length + 1,
    });
    return answer.jsonType;
  }


};
