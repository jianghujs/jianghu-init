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
const lockfile = require('proper-lockfile');
const chokidar = require('chokidar');

const jsonTypes = [
  {
    value: 'page',
    name: 'init page by json text',
  },
  {
    value: 'json',
    name: 'init json by table',
  },
  {
    value: 'example',
    name: 'init example json and page',
  },
];
const pageTypeList = [
  { value: '1table-page', name: '1table-page' },
  { value: '1table-component', name: '1table-component' },
];


/**
 * 生成页面
 */
module.exports = class InitByJsonCommand extends CommandBase {

  async run(cwd, args) {
    this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;
    this.page1Table = new InitPage1Table();
    this.component1Table = new InitComponent1Table();
    this.page2Table = new InitPage2Table();

    const jsonText = this.argv.jsonText;
    const jsonFile = this.argv.jsonFile;
    const jsFile = this.argv.jsFile;
    let handleType = this.argv.generateType || 'page';
    if (jsonText) {
      this.jsonArgv = JSON.parse(jsonText);
    } else if (jsonFile) {
      const jsonFileText = fs.readFileSync(jsonFile).toString();
      this.jsonArgv = JSON.parse(jsonFileText);
    } else if (jsFile) {
      this.jsonArgv = require(jsFile);
    } else {
      if (!this.argv.generateType) {
        handleType = await this.askForPageType();
      }
    }

    let pageType = this.jsonArgv && this.jsonArgv.pageType || '';
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
          await this.page1Table.run(process.cwd(), jsonArgv, this.argv);
        } else if (pageType === '1table-component') {
          await this.component1Table.run(process.cwd(), jsonArgv, this.argv);
        } else if (pageType === '2table-page') {
          await this.page2Table.run(process.cwd(), jsonArgv, this.argv);
        }
        this.success('jianghu init by json is success');
      }
      await this.enableDevMode();

    } else if (handleType === 'example') {
      const jsonArgvList = await new InitJson().example(process.cwd(), this.argv);
      for (const jsonArgvItem of jsonArgvList) {
        this.argv.y = true;
        pageType = jsonArgvItem.pageType;
        if (pageType === '1table-page') {
          await new InitPage1Table().run(process.cwd(), jsonArgvItem, this.argv);
        } else if (pageType === '1table-component') {
          await new InitComponent1Table().run(process.cwd(), jsonArgvItem, this.argv);
        }
      }
      // await new InitPage1Table().example(process.cwd(), this.jsonArgv);
    }
    // this.success('jianghu init by json is success');
  }

  // 确认生成表
  async promptConfig() {
    let type = this.argv.pageType;
    if (!type) {
      const res = await inquirer.prompt({
        name: 'type',
        type: 'list',
        choices: pageTypeList,
        message: '请选择类型',
      });
      type = res.type;
      this.argv.pageType = type;
    }
    let generateFileDir;
    if (type === '1table-page') {
      generateFileDir = './app/view/init-json/page';
    } else if (type === '1table-component') {
      generateFileDir = './app/view/init-json/component';
    } else {
      this.error(`不存在的配置类型${type}`);
      return false;
    }
    let file;
    if (fs.existsSync(generateFileDir)) {
      // 选择页面文件
      let fileItem = (this.argv.file || '').split('.')[0];
      if (!fileItem) {
        const fileList = fs.readdirSync(generateFileDir);
        const res = await inquirer.prompt({
          name: 'fileItem',
          type: 'list',
          choices: fileList,
          message: '请选择页面文件',
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
      },
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

  async enableDevMode() {
    const { dev } = this.argv;
    if (dev) {

      const lockFilePath = path.join('./', 'jianghu-init.dev.lock');
      if (!fs.existsSync(lockFilePath)) fs.writeFileSync(lockFilePath, '');
      if (await lockfile.check(lockFilePath)) {
        console.log('项目已开启 dev 模式');
        // this.error('项目已开启 dev 模式');
        return;
      }
      await lockfile.lock(lockFilePath);

      // 监控文件变化
      const watcher = chokidar.watch('./app/view/init-json', {
        persistent: true,
        ignoreInitial: true,
        followSymlinks: false,
        depth: 1,
      });
      watcher.on('all', async (event, path) => {
        if (event === 'change') {
          this.info(`File ${path.replace('app/view/init-json', '')} changed`);
          let fileObj = {};
          try {
            // eslint-disable-next-line no-eval
            fileObj = eval(fs.readFileSync('./' + path).toString());
          } catch (e) {
            this.error(`文件语法错误: ${e.message}`);
            return;
          }
          try {
            if (fileObj.pageType === '1table-page') {
              await this.page1Table.renderVue(fileObj);
              this.success('page vue render success');
            } else if (fileObj.pageType === '1table-component') {
              await this.component1Table.renderVue(fileObj);
              this.success('component vue render success');
            }
          } catch (e) {
            this.error(`${path.replace('app/view/init-json', '')} 文件渲染错误: ${e.message}`);
          }
        }
      });
      watcher.on('error', err => {
        console.error(`监控文件变化出错: ${err.message}`);
      });
      console.log('Watching ./app/view/init-json for changes...');

      // 在进程退出时删除锁定文件
      process.on('exit', async () => {
        await lockfile.unlock(lockFilePath);
      });
      process.on('SIGINT', async () => {
        console.log('接收到 SIGINT 信号，准备退出');
        if (await lockfile.check(lockFilePath)) {
          console.log('解锁文件');
          await lockfile.unlock(lockFilePath);
        }
        process.exit();
      });

      // 在监控文件时保持进程运行
      return new Promise(() => {});
    }
  }


};
