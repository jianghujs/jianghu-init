'use strict';

const inquirer = require('inquirer');
const CommandInitProject = require('./init_project');
const CommandInitPage = require('./init_page');

const initTypes = [
  {
    value: 'project',
    name: 'project - Create a project and init table.',
  }, {
    value: 'page',
    name: 'page - Generate manage or test page from database table.',
  }];

/**
 * 命令入口
 */
module.exports = class Entry {

  async run() {

    let passArgv = process.argv.slice(2);
    let initType = passArgv[0];

    if (initType !== 'project' && initType !== 'page') {
      // 需要指定是 page 还是 project
      const answer = await inquirer.prompt({
        name: 'initType',
        type: 'list',
        message: 'Please select a init type',
        choices: initTypes,
        pageSize: initTypes.length,
      });
      initType = answer.initType;
    }

    if (initType === 'project') {
      await new CommandInitProject().run(process.cwd(), passArgv);
    } else if (initType === 'page') {
      await new CommandInitPage().run(process.cwd(), passArgv);
    }

    process.exit();
  }

};
