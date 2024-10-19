'use strict';

const inquirer = require('inquirer');
const CommandInitProject = require('./init_project');
const CommandInitPage = require('./init_page');
const CommandInitTool = require('./init_tool');
const CommandInitByJson = require('./init_by_json');
const path = require('path');
const fs = require('fs');

const initTypes = [
  {
    value: 'json',
    name: 'json - init by json text',
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

    // 添加版本号检查
    if (initType === '-v' || initType === '--version') {
      this.showVersion();
      return;
    }

    // 添加帮助信息检查
    if (initType === '-h' || initType === '--help') {
      this.showHelp();
      return;
    }

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
      default:
        console.log('未知的命令类型。显示帮助信息：\n');
        this.showHelp();
        break;
    }

    process.exit();
  }
  

  showVersion() {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`当前版本: ${packageJson.version}`);
  }

  showHelp() {
    console.log(`
使用方法: jianghu-init <命令> [选项]

选项:
  -V, --version                输出版本号
  -h, --help                   显示帮助信息

命令:
  project [选项]               创建一个新项目并初始化表
  page [选项]                  从数据库表生成管理或测试页面
  tool [选项]                  添加一些工具来管理你的应用
  json [选项]                  通过 JSON 文本初始化

  运行 jianghu-init <命令> --help 以获取指定命令的详细用法。
  `);
  }
};

