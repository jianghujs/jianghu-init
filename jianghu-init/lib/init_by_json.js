'use strict';
const yargs = require('yargs');
const InitPage = require('./json/init_page');
const InitMobilePage = require('./json/init_mobile_page');
const InitComponent = require('./json/init_component');
const InitMobileComponent = require('./json/init_mobile_component');
const InitJson = require('./json/init_json');
const InitClear = require('./json/init_clear');
const CommandBase = require('./command_base');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const lockfile = require('proper-lockfile');
const chokidar = require('chokidar');
const dayjs = require('dayjs');
const _ = require('lodash');
const chalk = require('chalk');
const { attachProvideStringFromSource } = require('./json/mixin/extract_provide_source');

const resolveConfigPageId = (item) => {
  if (!item || typeof item !== 'object') return undefined;
  return item.pageId || item.page?.id || item.page?.pageId;
};

const resolveConfigComponentPath = (item) => {
  if (!item || typeof item !== 'object') return undefined;
  return item.componentPath || item.component?.path || item.page?.componentPath;
};

const jsonTypes = [
  {
    value: 'dev',
    name: 'run dev mode',
  },
  // {
  //   value: 'page',
  //   name: 'init page by json text',
  // },
  {
    value: 'json',
    name: 'init json by table',
  },
  {
    value: 'example',
    name: 'init example json and page',
  },
  {
    value: 'example chart',
    name: 'init example chart component',
  },
  {
    value: 'clear',
    name: 'clear all init json data [ _page, _resource, /view/page, /view/component]',
  },
];
const pageTypeList = [
  { value: 'page', name: 'page' },
  { value: 'component', name: 'component' },
];


/**
 * 生成页面
 */
module.exports = class InitByJsonCommand extends CommandBase {

  async run(cwd, args) {

    this.notice('Starting json initialization...');

    this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;
    this.jhComponent = new InitComponent();
    this.jhPage = new InitPage();
    this.jhMobilePage = new InitMobilePage();
    this.jhMobileComponent = new InitMobileComponent();
    await this.enableDevMode(args.includes('dev'));
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
        switch (pageType) {
          case 'jh-mobile-component':
            await this.jhMobileComponent.run(process.cwd(), jsonArgv, this.argv);
            break;
          case 'jh-component':
          case '1table-component':
            await this.jhComponent.run(process.cwd(), jsonArgv, this.argv);
            break;
          case 'jh-page':
          case '1table-page':
            await this.jhPage.run(process.cwd(), jsonArgv, this.argv);
            break;
          case 'jh-mobile-page':
            await this.jhMobilePage.run(process.cwd(), jsonArgv, this.argv);
            break;
          default:
            this.error(`不存在的 pageType: ${pageType}`);
            break;
        }
        this.success('jianghu init by json is success');
      }

    } else if (handleType === 'example') {
      const jsonArgvList = await new InitJson().example(process.cwd(), this.argv);
      for (const jsonArgvItem of jsonArgvList) {
        this.argv.y = true;
        pageType = jsonArgvItem.pageType;
        switch (pageType) {
          case 'jh-mobile-component':
            await this.jhMobileComponent.run(process.cwd(), jsonArgvItem, this.argv);
            break;
          case 'jh-component':
          case '1table-component':
            await this.jhComponent.run(process.cwd(), jsonArgvItem, this.argv);
            break;
          case 'jh-page':
          case '1table-page':
            await this.jhPage.run(process.cwd(), jsonArgvItem, this.argv);
            break;
          case 'jh-mobile-page':
            await this.jhMobilePage.run(process.cwd(), jsonArgvItem, this.argv);
            break;
          default:
            this.error(`不存在的 pageType: ${pageType}`);
            break;
        }
      }
    } else if (handleType === 'example chart') {
      await new InitJson().run(process.cwd(), Object.assign(this.argv, { chartPage: true, pageType: 'jh-component' }));
    } else if (handleType === 'clear') {
      await new InitClear().run(process.cwd(), this.argv);
    } else if (handleType === 'dev') {
      await this.enableDevMode(true);
    }
    // this.success('jianghu init by json is success');
    await this.enableDevMode(this.argv.dev);
  }

  /**
   * ================================================================================================
   * 确认生成表
   * ================================================================================================
   */
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
    if ([ 'page' ].includes(type)) {
      generateFileDir = './app/view/init-json/page';
    } else if ([ 'component' ].includes(type)) {
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
   * ================================================================================================
   * 获取 yargs 实例
   * @return {Object} yargs instance
   * ================================================================================================
   */
  getParser() {
    return yargs
      .usage('🚀 init init-json page .\n🔧 Generate config: jianghu-init json --generateType=json --pageType=jh-page --table=class --pageId=classManagement')
      .options(this.getParserOptions())
      .help(false)
      .version(false)
      .alias('h', 'help')
      .help();
  }

  /**
   * ================================================================================================
   * 获取 yargs 选项
   * @return {Object} opts
   * ================================================================================================
   */
  getParserOptions() {
    return {
      generateType: {
        type: 'string',
        description: 'Generate type [ json | page | example | clear | dev ]',
      },
      pageType: {
        type: 'string',
        description: 'Config type [ jh-page | jh-component ]; jh-mobile-page is legacy compatibility only',
      },
      file: {
        type: 'string',
        description: 'File name',
      },
      table: {
        type: 'string',
        description: 'Select table',
      },
      pageId: {
        type: 'string',
        description: 'Generate pageId',
      },
    };
  }

  /**
   * ================================================================================================
   * 询问生成页面类型
   * ================================================================================================
   */
  async askForPageType() {
    const answer = await inquirer.prompt({
      name: 'jsonType',
      type: 'list',
      message: '请选择执行命令类型',
      choices: jsonTypes,
      pageSize: jsonTypes.length + 1,
    });
    return answer.jsonType;
  }

  /**
   * ================================================================================================
   * 复制目录
   * @param {String} src 源目录
   * @param {String} dest 目标目录
   * ================================================================================================
   */
  copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
  
    let entries = fs.readdirSync(src, { withFileTypes: true });
  
    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);
  
        if (entry.isDirectory()) {
            this.copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
  }
  /**
   * ================================================================================================
   * 复制jianghuJs公共组件和样式
   * ================================================================================================
   */
  async copyJianghuJs() {
    // 如果没有jianghuJs 目录，则创建
    fs.mkdirSync('./app/view/common/jianghuJs', { recursive: true });
    fs.mkdirSync('./app/view/component/jianghuJs', { recursive: true });
    fs.mkdirSync('./app/view/component/v6', { recursive: true });
    fs.mkdirSync('./app/view/template', { recursive: true });
    fs.mkdirSync('./app/public/lib', { recursive: true });

    const initConfig = this.getInitConfig();
    let isCommonOverwrite = true;
    let isComponentOverwrite = true;
    let isV6ComponentOverwrite = true;
    let isTemplateOverwrite = true;
    let isPublicwrite = true;
    if (initConfig && initConfig.initJsonOverwrite) {
      const isFalse = (key) => {
        return initConfig.initJsonOverwrite.hasOwnProperty(key) && !initConfig.initJsonOverwrite[key];
      }
      if (isFalse('common')) {
        isCommonOverwrite = false;
      }
      if (isFalse('component')) {
        isComponentOverwrite = false;
      }
      if (isFalse('v6Component')) {
        isV6ComponentOverwrite = false;
      }
      if (isFalse('template')) {
        isTemplateOverwrite = false;
      }
      if (isFalse('publicStatic')) {
        isPublicwrite = false;
      }
    }
    
    // 复制通用样式和组件
    const copyConfigs = [
      { flag: isComponentOverwrite, name: 'component', desc: 'component' },
      { flag: isCommonOverwrite, name: 'common', desc: 'common' },
      { flag: isPublicwrite, name: 'publicStatic', desc: 'public' },
      { flag: isTemplateOverwrite, name: 'template', desc: 'template' },
      { flag: isV6ComponentOverwrite, name: 'v6Component', desc: 'v6Component' }
    ];
    this.notice('------------依赖文件覆盖 START------------');
    copyConfigs.forEach(({ flag, name, desc }) => {
      const status = flag ? '✅ 文件覆盖' : '⚠️  跳过覆盖';
      const logFn = flag ? this.success.bind(this) : this.warning.bind(this);
      logFn(`${status}: ${desc.padEnd(12)} [initJsonOverwrite.${name} = ${flag}]`);
    });
    this.notice('------------依赖文件覆盖 END------------');

    if (isComponentOverwrite) {
      this.copyDir(`${path.join(__dirname, '../')}page-template-json/component/jianghuJs`, './app/view/component/jianghuJs');
    }
    if (isCommonOverwrite) {
      this.copyDir(`${path.join(__dirname, '../')}page-template-json/common/jianghuJs`, './app/view/common/jianghuJs');
    }
    if (isV6ComponentOverwrite) {
      this.copyDir(`${path.join(__dirname, '../')}page-template-json/component/v6`, './app/view/component/v6');
    }
    if (isPublicwrite) {
      this.copyDir(`${path.join(__dirname, '../')}page-template-json/public/lib`, './app/public/lib');
    }
    if (isTemplateOverwrite) {
      this.copyDir(`${path.join(__dirname, '../')}page-template-json/common/template`, './app/view/template');
    }
  }


  /**
   * ================================================================================================
   * 开启 dev 模式
   * @param {Boolean} dev 是否开启 dev 模式
   * ================================================================================================
   */
  async enableDevMode(dev) {
    if (!dev) return;
    const lockFilePath = path.join('./', 'jianghu-init.dev.lock');
    if (!fs.existsSync(lockFilePath)) fs.writeFileSync(lockFilePath, '');
    if (await lockfile.check(lockFilePath)) {
      console.log('项目已开启 dev 模式');
      // this.error('项目已开启 dev 模式');
      return;
    }
    // 检测 init-json 文件夹是否存在，不存在则创建
    if (!fs.existsSync('./app/view/init-json')) {
      fs.mkdirSync('./app/view/init-json', { recursive: true });
    }

    await lockfile.lock(lockFilePath);

    await this.copyJianghuJs();

    // 默认渲染 ./app/view/init-json 内的递归所有文件
    const fileList = await this.findJsFiles('./app/view/init-json');

    this.info(`共有 ${fileList.length} 个配置文件，加载中...`);
    const configFileList = [];
    for (const file of fileList) {
      let fileObj;
      let fileContent;
      try {
        fileContent = fs.readFileSync('./' + file).toString();
        // eslint-disable-next-line no-eval
        fileObj = eval(fileContent);
        attachProvideStringFromSource(fileObj, fileContent);
      } catch (e) {
        this.error(`文件语法错误 (${file}): ${e.message}`);
        console.error(
          chalk.red(
            `eval 失败：${file} — init-json 须为可被 eval 的 JS（推荐 module.exports = { ... };，或对顶层写成 ({ pageType: 'jh-page', ... });）。`,
          ),
        );
        console.log(e);
        continue;
      }
      configFileList.push({
        pageType: fileObj.pageType,
        pageId: resolveConfigPageId(fileObj),
        componentPath: resolveConfigComponentPath(fileObj),
        file: file.replace('app/view/init-json/', ''),
      });
      await this.renderContent(fileObj, file.replace('app/view/init-json/', ''));
    }
    this.success(`共有 ${fileList.length} 个配置文件，加载完成`);
    this.checkFileRepeat(configFileList);

    // 监控文件变化
    const watcher = chokidar.watch('./app/view/init-json', {
      persistent: true,
      ignoreInitial: true,
      followSymlinks: false,
      depth: 3,
    });
    watcher.on('all', async (event, pathStr) => {
      if (event === 'change') {
        console.log(chalk.gray(`File ${pathStr.replace('app/view/init-json', '')} change ${dayjs().format('HH:mm:ss')}`));
        let fileObj = {};
        try {
          const fileContent = fs.readFileSync('./' + pathStr).toString();
          // eslint-disable-next-line no-eval
          fileObj = eval(fileContent);
          attachProvideStringFromSource(fileObj, fileContent);
        } catch (e) {
          const rel = path.relative(process.cwd(), pathStr) || pathStr;
          this.error(`文件语法错误 (${rel}): ${e.message}`);
          console.error(
            chalk.red(
              `eval 失败：${rel} — init-json 须为可被 eval 的 JS（推荐 module.exports = { ... };，或对顶层写成 ({ pageType: 'jh-page', ... });）。仅以 { ... } 开头且无赋值时常触发 Unexpected token。`,
            ),
          );
          console.log(e);
          return;
        }
        await this.renderContent(fileObj, pathStr.replace('app/view/init-json/', ''));
      } else if (event === 'unlink') {
        this.allConfigFileList = this.allConfigFileList.filter(item => !pathStr.includes(item.file));
      }
    });
    watcher.on('error', err => {
      console.error(`监控文件变化出错: ${err.message}`);
    });
    this.success('开启 dev 开发模式');
    this.notice('Watching ./app/view/init-json for changes...');

    // 在进程退出时删除锁定文件
    process.on('exit', async () => {
      this.success('exit dev mode');
      await lockfile.unlock(lockFilePath);
    });
    process.on('SIGINT', async () => {
      console.log('接收到 SIGINT 信号，准备退出');
      if (await lockfile.check(lockFilePath)) {
        this.success('exit dev mode');
        await lockfile.unlock(lockFilePath);
      }
      process.exit();
    });

    // 在监控文件时保持进程运行
    return new Promise(() => {});
  }

  /**
   * ================================================================================================
   * 渲染内容
   * @param {Object} fileObj 文件对象
   * @param {String} filename 文件名
   * ================================================================================================
   */
  async renderContent(fileObj, filename) {
    const { error } = this.checkWarning(fileObj, filename);
    if (error) return;
    try {
      switch (fileObj.pageType) {
        case 'jh-mobile-component':
          await this.jhMobileComponent.renderContent(fileObj, true);
          break;
        case 'jh-component':
        case '1table-component':
          await this.jhComponent.renderContent(fileObj, true);
          break;
        case 'jh-page':
        case '1table-page':
          await this.jhPage.renderContent(fileObj, true);
          break;
        case 'jh-mobile-page':
          await this.jhMobilePage.renderContent(fileObj, true);
          break;
        default:
          this.error(`不存在的 pageType: ${fileObj.pageType}`);
          break;
      }
      this.success(`build ${filename} success`);
      console.log('');
    } catch (e) {
      console.log(e);
      this.error(e);
    }
  }

  /**
   * ================================================================================================
   * 查找 js 文件
   * @param {String} dir 目录
   * @return {Array} 文件列表
   * ================================================================================================
   */
  findJsFiles(dir) {
    let files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        files = files.concat(this.findJsFiles(fullPath)); // 如果是目录，则递归搜索
      } else if (path.extname(item) === '.js') {
        files.push(fullPath); // 如果是 .js 文件，则添加到文件列表
      }
    }

    return files;
  }

  /**
   * ================================================================================================
   * 检查文件重复
   * @param {Array} configFileList 配置文件列表
   * ================================================================================================
   */
  checkFileRepeat(configFileList) {
    if (!this.allConfigFileList) {
      this.allConfigFileList = configFileList || [];
    }
    const pageConfigList = this.allConfigFileList.filter(item => [ 'jh-page', '1table-page', 'jh-mobile-page' ].includes(item.pageType));
    const componentConfigList = this.allConfigFileList.filter(item => [ 'jh-component', '1table-component', 'jh-mobile-component' ].includes(item.pageType));

    const checkDuplicate = (configList, property, warningMessage) => {
      const group = _.groupBy(configList, property);
      const duplicateGroup = _.pickBy(group, item => item.length > 1);
      if (Object.keys(duplicateGroup).length) {
        this.warning(warningMessage);

        Object.keys(duplicateGroup).forEach(key => {
          const fileList = _.uniq(duplicateGroup[key].map(item => item.file));
          this.warning(`${property}: ${key}  [ ${fileList.join(', ')} ]`);
        });
      }
    };

    checkDuplicate(pageConfigList, 'pageId', '页面 pageId 重复，请检查');
    checkDuplicate(componentConfigList, 'componentPath', '组件 componentPath 重复，请检查');
  }

  /**
   * ================================================================================================
   * 检查警告
   * @param {Object} fileObj 文件对象
   * @param {String} file 文件名
   * ================================================================================================
   */
  checkWarning(fileObj, file) {
    const warning = [];
    const error = [];
    // ------------ 全局检查 ------------
    if (fileObj.includeList && fileObj.includeList.find(item => _.isString(item))) {
      warning.push('includeList 更新规范 { type, path }');
    }
    if (fileObj.drawerList && fileObj.drawerList.some(a => a.contentList.find(e => e.type === 'form' && e.actions))) {
      warning.push('错误的用法 drawerList.form.actions, 请统一使用 action <object | array>');
    }
    if (fileObj.updateDrawerContent && fileObj.updateDrawerContent.contentList.find(e => e.type === 'form' && e.actions)) {
      warning.push('错误的用法 updateDrawerContent.form.actions, 请统一使用 action <object | array>');
    }
    if (fileObj.headContent && (fileObj.headContent.serverSearchList || []).find(e => e.label)) {
      warning.push('无效的 serverSearchList label 设置');
    }
    if (!fileObj.pageType) {
      error.push('pageType 不能为空');
    }
    if (fileObj.pageType === '1table-page') {
      error.push('1table-page 已废弃，请使用 jh-page');
    }
    if (fileObj.pageType === '1table-component') {
      error.push('1table-component 已废弃，请使用 jh-component');
    }
    // ------------ 最新 pageContent 检查 ------------
    // if (fileObj.pageContent) {
    //   if (fileObj.pageContent.tableAttrs || fileObj.pageContent.tableHeaderList) {
    //     warning.push(`请参照最新 pageContent table 规范
    // {                                     {
    //   tag: 'jh-table',                      tag: 'v-row',
    //   attrs: {},                            attrs: {},
    //   value: [                              value: [  // < string | object | array >
    //     ...headers,             OR            { tag: 'v-col', attrs: { cols: 12 }, value: '' },
    //   ],                                    ],
    //   rowActionList: [],                  }
    //   headActionList: [],
    // }`);
    //   }
    // }
    if (fileObj.createDrawerContent || fileObj.updateDrawerContent) {
      error.push('createDrawerContent 和 updateDrawerContent 已废弃，请使用 actionContent');
    }

    // 检查 this.allConfigFileList 内是否有除了 fileObj 的其他重复项, 有则检查提示重复, 没有则添加
    this.allConfigFileList = this.allConfigFileList || [];
    const getPageId = resolveConfigPageId;
    const getComponentPath = resolveConfigComponentPath;
    let duplicateList = [];
    if ([ 'jh-page', '1table-page', 'jh-mobile-page' ].includes(fileObj.pageType)) {
      duplicateList = this.allConfigFileList.filter(item => (item.pageType || '').includes('-page') && getPageId(item) === getPageId(fileObj) && item.file !== file);
    } else {
      duplicateList = this.allConfigFileList.filter(item => (item.pageType || '').includes('-component') && getComponentPath(item) === getComponentPath(fileObj) && item.file !== file);
    }
    if (duplicateList.length) {
      error.push(`pageId: ${getPageId(fileObj)} [ ${file}, ${duplicateList.map(e => e.file).join(',')} ] 文件重复，请检查`);
    } else {
      this.allConfigFileList.push({ pageId: getPageId(fileObj), pageType: fileObj.pageType, componentPath: getComponentPath(fileObj), file });
    }

    // 检查 jh-json-editor 资源引入
    this.checkJhJsonExists(fileObj, warning);

    if (error.length) {
      this.error('┏----------------------------------------------------------┓');
      this.error('  Error: ' + file + ' 渲染失败');
      this.error('┗----------------------------------------------------------┛');
    } else if (warning.length) {
      this.warning('┏----------------------------------------------------------┓');
      this.warning('  Warning: ' + file);
      this.warning('┗----------------------------------------------------------┛');
    }
    let index = 1;
    error.forEach(item => {
      this.error(index + '.' + item);
      index++;
    });
    warning.forEach(item => {
      this.warning(index + '.' + item);
      index++;
    });

    return { error: error.length, warning: warning.length };
  }

  /**
   * ================================================================================================
   * 检查 jh-json-editor 资源引入
   * @param {Object} fileObj 文件对象
   * @param {Array} warning 警告列表
   * ================================================================================================
   */
  checkJhJsonExists(fileObj, warning) {
    let jhJsonExists = false;
    const { drawerList, createDrawerContent, updateDrawerContent, includeList } = fileObj;
    if (drawerList && drawerList.some(drawer => drawer.contentList.some(content => content.type === 'form' && content.formItemList.some(item => item.tag === 'jh-json-editor')))) {
      jhJsonExists = true;
    }
    if (!jhJsonExists && createDrawerContent && createDrawerContent.formItemList.some(content => content.tag === 'jh-json-editor')) {
      jhJsonExists = true;
    }
    if (!jhJsonExists && updateDrawerContent && updateDrawerContent.contentList.some(content => content.type === 'form' && content.formItemList.some(item => item.tag === 'jh-json-editor'))) {
      jhJsonExists = true;
    }
    if (jhJsonExists) {
      const warn = [];
      if (!includeList || !includeList.some(item => item.path === '/<$ ctx.app.config.appId $>/public/plugins/jsoneditor/jsoneditor.js' && item.type === 'js')) {
        warn.push('{ type: \'js\', path: \'/<$ ctx.app.config.appId $>/public/plugins/jsoneditor/jsoneditor.js\' },');
      }
      if (!includeList || !includeList.some(item => item.path === '/<$ ctx.app.config.appId $>/public/plugins/jsoneditor/jsoneditor.css' && item.type === 'css')) {
        warn.push('{ type: \'css\', path: \'/<$ ctx.app.config.appId $>/public/plugins/jsoneditor/jsoneditor.css\' },');
      }
      if (warn.length) {
        warning.push('请在 includeList 中添加 jh-json-editor 资源引入\n    ' + warn.join('\n    '));
      }
    }
  }

};
