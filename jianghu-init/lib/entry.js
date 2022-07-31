'use strict';

const inquirer = require('inquirer');
const CommandInitProject = require('./command_init_project');
const CommandInitCrud = require('./command_init_crud');
const CommandInitCrud3Table = require('./command_init_crud_3table');
const CommandInitCrud2Table = require('./command_init_crud_2table');
const CommandInitTestPage = require('./command_init_test_page');

const initTypes = [
  {
    value: 'project',
    name: 'project - Create a project and init table.',
  }, {
    value: 'crud',
    name: 'crud - Generate crud page from a db table.',
  }, {
    value: 'crud-2-table',
    name: 'crud 2 table - Generate crud page from a db table.',
  }, {
    value: 'crud-3-table',
    name: 'crud 3 table - Generate crud page from a db table.',
  }, {
    value: 'test-page',
    name: 'test-page - Generate test page from a db table.',
  }];

/**
 * 命令入口
 */
module.exports = class Entry {

  async run() {

    let passArgv = process.argv.slice(2);
    let initProject = passArgv.indexOf('project') > -1;
    let initCrud = passArgv.indexOf('crud') > -1;
    let initCrud3Table = passArgv.indexOf('crud-3-table') > -1;
    let initCrud2Table = passArgv.indexOf('crud-2-table') > -1;
    let initTestPage = passArgv.indexOf('test-age') > -1;

    if (!initProject && !initCrud && !initTestPage) {
      // 如果没有传参数，则询问类型
      const answer = await inquirer.prompt({
        name: 'initType',
        type: 'list',
        message: 'Please select a init type',
        choices: initTypes,
        pageSize: initTypes.length,
      });
      initProject = answer.initType === 'project';
      initCrud = answer.initType === 'crud';
      initCrud3Table = answer.initType === 'crud-3-table';
      initCrud2Table = answer.initType === 'crud-2-table';
      initTestPage = answer.initType === 'test-page';
    } else {
      passArgv = passArgv.slice(1);
    }

    if (initProject) {
      await new CommandInitProject().run(process.cwd(), passArgv);
    } else if (initCrud) {
      await new CommandInitCrud().run(process.cwd(), passArgv);
    } else if (initCrud3Table) {
      await new CommandInitCrud3Table().run(process.cwd(), passArgv);
    } else if (initCrud2Table) {
      await new CommandInitCrud2Table().run(process.cwd(), passArgv);
    } else if (initTestPage) {
      await new CommandInitTestPage().run(process.cwd(), passArgv);
    }

    process.exit();
  }

};
