'use strict';

const inquirer = require('inquirer');
const CommandInitProject = require('./init_project');
const CommandInitPage = require('./init_page');
const CommandInitTool = require('./init_tool');
const CommandInitByJson = require('./init_by_json');
const CommandInitByUniappJson = require('./init_by_uniapp_json');


const initTypes = [
  {
    value: 'json',
    name: 'json - init by json text',
  },
  {
    value: 'uniapp-json',
    name: 'uniapp-json - init by uniapp json text',
  },
  {
    value: 'project',
    name: 'project - Create a project and init table.',
  },
  {
    value: 'page',
    name: 'page - Generate manage or test page from database table.',
  },
  {
    value: 'tool',
    name: 'tool - Add some tools to manage your app.',
  }];

/**
 * 命令入口
 */
module.exports = class Entry {


  async run() {
    let passArgv = process.argv.slice(2);
    let initType = passArgv[0];

    if (![ 'project', 'page', 'tool', 'json' ].includes(initType)) {
      const answer = await inquirer.prompt({
        name: 'initType',
        type: 'list',
        message: 'Please select an init type',
        choices: initTypes,
        pageSize: initTypes.length + 1,
      });
      initType = answer.initType;
    } else {
      passArgv = passArgv.slice(1);
    }

    switch (initType) {
      case 'project':
        await new CommandInitProject().run(process.cwd(), passArgv);
        break;
      case 'page':
        await new CommandInitPage().run(process.cwd(), passArgv);
        break;
      case 'tool':
        await new CommandInitTool().run(process.cwd(), passArgv);
        break;
      case 'json':
        await new CommandInitByJson().run(process.cwd(), passArgv);
        break;
      case 'uniapp-json':
        await new CommandInitByUniappJson().run(process.cwd(), passArgv);
        break;
      default:
        this.errror('init type is not support');
        break;
    }

    process.exit();
  }


};
