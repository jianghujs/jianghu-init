'use strict';

const os = require('os');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const urllib = require('urllib');
const updater = require('npm-updater');
const mkdirp = require('mkdirp');
const inquirer = require('inquirer');
const yargs = require('yargs');
const glob = require('globby');
const is = require('is-type-of');
const compressing = require('compressing');
const rimraf = require('mz-modules/rimraf');
const isTextOrBinary = require('istextorbinary');
const ProxyAgent = require('proxy-agent');

require('colors');
const symbols = require('log-symbols');
const chalk = require('chalk');

/**
 * 下载模板并生成项目
 */
module.exports = class InitBoilerplate {

  constructor(options) {
    options = options || {};
    this.name = options.name || 'jianghu-init';
    this.configName = options.configName || 'jianghu-init-config';
    this.pkgInfo = options.pkgInfo || require('../package.json');
    this.needUpdate = options.needUpdate !== false;
    this.httpClient = urllib.create();
    this.dbPrefix = options.dbPrefix || '';

    this.inquirer = inquirer;
    this.fileMapping = {
      gitignore: '.gitignore',
      _gitignore: '.gitignore',
      '_.gitignore': '.gitignore',
      '_package.json': 'package.json',
      '_.eslintrc': '.eslintrc',
      '_.eslintignore': '.eslintignore',
      '_.npmignore': '.npmignore',
    };
  }

  async run(cwd, args) {

    const argv = this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;
    // console.log('%j', argv);

    const proxyHost = process.env.http_proxy || process.env.HTTP_PROXY;
    if (proxyHost) {
      const proxyAgent = new ProxyAgent(proxyHost);
      this.httpClient.agent = proxyAgent;
      this.httpClient.httpsAgent = proxyAgent;
      this.log(`use http_proxy: ${proxyHost}`);
    }

    // set name and configName
    this.name = argv.name || this.name;
    this.configName = argv.configName || this.configName;
    this.needUpdate = argv.needUpdate || this.needUpdate;

    // detect registry url
    this.registryUrl = this.getRegistryByType(argv.registry);
    this.log(`use registry: ${this.registryUrl}`);

    if (this.needUpdate) {
      // check update
      await updater({
        package: this.pkgInfo,
        registry: this.registryUrl,
        level: 'major',
      });
    }

    // ask for target dir
    this.targetDir = await this.getTargetDirectory();
    // use local template
    let templateDir = await this.getTemplateDir();
    let pkgName = this.argv.package;
    let boilerplate;

    if (!templateDir) {
      // support --package=<npm name>
      if (!pkgName) {
        // list boilerplate
        const boilerplateMapping = await this.fetchBoilerplateMapping();
        // ask for boilerplate
        if (argv.type && boilerplateMapping.hasOwnProperty(argv.type)) {
          boilerplate = boilerplateMapping[argv.type];
        } else {
          boilerplate = await this.askForBoilerplateType(boilerplateMapping);
          if (!boilerplate) return;
        }
        this.log(`use boilerplate: ${boilerplate.name}(${boilerplate.package})`);
        const checkDir = this.checkProjectDirectory(boilerplate.name);
        if (!checkDir) {
          this.log();
          process.exit();
          return false;
        }
        pkgName = boilerplate.package;
      }
      // download boilerplate
      templateDir = await this.downloadBoilerplate(pkgName);
    }

    // copy template
    await this.processFiles(this.targetDir, templateDir);

    return { boilerplate, targetDir: this.targetDir };
  }

  /**
   * 检查项目目录
   */
  checkProjectDirectory(name) {
    if (name === 'xiaoapp-in-multi') {
      // 多应用下增加应用需要验证目录
      console.log(symbols.success, chalk.blue('xiaoapp-in-multi 模式目录验证'));
      const dirList = fs.readdirSync(process.cwd());
      // 多应用，三者缺一不可
      if (dirList.indexOf('data_repository') === -1
        || dirList.indexOf('user_app_management') === -1
        || dirList.indexOf('directory') === -1) {
        console.log(symbols.success, chalk.red('请切换到多应用模式的项目目录下'));
        return false;
      }
      console.log(symbols.success, chalk.green('xiaoapp-in-multi 模式目录验证 成功'));
      return true;
    }
    return true;
  }

  /**
   *
   * @param {object} obj origin Object
   * @param {string} key group by key
   * @param {string} otherKey  group by other key
   * @return {object} result grouped object
   */
  groupBy(obj, key, otherKey) {
    const result = {};
    for (const i in obj) {
      let isMatch = false;
      for (const j in obj[i]) {
        // check if obj[i]'s property is 'key'
        if (j === key) {
          const mappingItem = obj[i][j];
          if (typeof result[mappingItem] === 'undefined') {
            result[mappingItem] = {};
          }
          result[mappingItem][i] = obj[i];
          isMatch = true;
          break;
        }
      }
      if (!isMatch) {
        // obj[i] doesn't have property 'key', then use 'otherKey' to group
        if (typeof result[otherKey] === 'undefined') {
          result[otherKey] = {};
        }
        result[otherKey][i] = obj[i];
      }
    }
    return result;
  }
  /**
   * show boilerplate list and let user choose one
   *
   * @param {Object} mapping - boilerplate config mapping, `{ simple: { "name": "simple", "package": "jianghu-boilerplate-simple", "description": "Simple jianghu app boilerplate" } }`
   * @return {Object} boilerplate config item
   */
  async askForBoilerplateType(mapping) {
    // group by category
    // group the mapping object by property 'category' or 'other' if item of mapping doesn't have 'category' property
    const groupMapping = this.groupBy(mapping, 'category', 'other');
    const groupNames = Object.keys(groupMapping);
    let group;
    if (groupNames.length > 1) {
      const answers = await inquirer.prompt({
        name: 'group',
        type: 'list',
        message: 'Please select a boilerplate category',
        choices: groupNames,
        pageSize: groupNames.length,
      });
      group = groupMapping[answers.group];
    } else {
      group = groupMapping[groupNames[0]];
    }

    // ask for boilerplate
    const choices = Object.keys(group).map(key => {
      const item = group[key];
      return {
        name: `${key} - ${item.description}`,
        value: item,
      };
    });

    choices.unshift(new inquirer.Separator());
    const { boilerplateInfo } = await inquirer.prompt({
      name: 'boilerplateInfo',
      type: 'list',
      message: 'Please select a boilerplate type',
      choices,
      pageSize: choices.length,
    });
    if (!boilerplateInfo.deprecate) return boilerplateInfo;

    // ask for deprecate
    const { shouldInstall } = await inquirer.prompt({
      name: 'shouldInstall',
      type: 'list',
      message: 'It\'s deprecated',
      choices: [
        {
          name: `1. ${boilerplateInfo.deprecate}`,
          value: false,
        },
        {
          name: '2. I still want to continue installing',
          value: true,
        },
      ],
    });

    if (shouldInstall) {
      return boilerplateInfo;
    } else {
      console.log(`Exit due to: ${boilerplateInfo.deprecate}`);
      return;
    }
  }

  /**
   * ask user to provide variables which is defined at boilerplate
   * @param {String} targetDir - target dir
   * @param {String} templateDir - template dir
   * @return {Object} variable scope
   */
  async askForVariable(targetDir, templateDir) {
    let questions;
    try {
      questions = require(templateDir);
      // support function
      if (is.function(questions)) {
        questions = questions(this);
      }
      // 将 name 参数的默认值设置为当前目录名
      if (questions.name && !questions.name.default) {
        questions.name.default = path.basename(targetDir).replace(/^jianghu-/, '');
      }
      // 将 dbPrefix 参数的默认值设置为当前目录名
      if (questions.dbPrefix && !questions.dbPrefix.default) {
        questions.dbPrefix.default = (path.basename(targetDir).replace(/^jianghu-/, '') + '_').replace(/-/g, '_');
      }
      questions.database = {
        desc: 'database name',
        default: questions.name.default.replace(/-/g, '_')
      }
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND') {
        this.log(`load boilerplate config got trouble, skip and use defaults, ${err.message}`.yellow);
      }
      return {};
    }

    this.log('collecting boilerplate config...');
    const keys = Object.keys(questions);
    if (this.argv.silent) {
      const result = keys.reduce((result, key) => {
        const defaultFn = questions[key].default;
        const filterFn = questions[key].filter;
        if (typeof defaultFn === 'function') {
          result[key] = defaultFn(result) || '';
        } else {
          result[key] = questions[key].default || '';
        }
        if (typeof filterFn === 'function') {
          result[key] = filterFn(result[key]) || '';
        }

        return result;
      }, {});
      this.log('use default due to --silent, %j', result);
      return result;
    } else {
      return await inquirer.prompt(keys.map(key => {
        const question = questions[key];
        return {
          type: question.type || 'input',
          name: key,
          message: question.description || question.desc,
          default: question.default,
          filter: question.filter,
          choices: question.choices,
        };
      }));
    }
  }

  /**
   * copy boilerplate to target dir with template scope replace
   * @param {String} targetDir - target dir
   * @param {String} templateDir - template dir, must contain a folder which named `boilerplate`
   * @return {String[]} file names
   */
  async processFiles(targetDir, templateDir) {
    const src = path.join(templateDir, 'boilerplate');
    const locals = await this.askForVariable(targetDir, templateDir);
    locals.dbPrefix = locals.dbPrefix || this.dbPrefix;
    const files = glob.sync('**/*', {
      cwd: src,
      dot: true,
      onlyFiles: false,
      followSymlinkedDirectories: false,
    });
    files.forEach(file => {
      const { dir: dirname, base: basename } = path.parse(file);
      const from = path.join(src, file);
      const name = path.join(dirname, this.fileMapping[basename] || basename);
      const to = path.join(targetDir, this.replaceTemplate(name, locals));

      const stats = fs.lstatSync(from);
      if (stats.isSymbolicLink()) {
        const target = fs.readlinkSync(from);
        fs.symlinkSync(target, to);
        this.log('%s link to %s', to, target);
      } else if (stats.isDirectory()) {
        mkdirp.sync(to);
      } else if (stats.isFile()) {
        const content = fs.readFileSync(from);
        this.log('write to %s', to);

        // check if content is a text file
        const result = isTextOrBinary.isTextSync(from, content)
          ? this.replaceTemplate(content.toString('utf8'), locals)
          : content;
        fs.writeFileSync(to, result);
      } else {
        this.log('ignore %s only support file, dir, symlink', file);
      }
    });
    return files;
  }

  /**
   * get argv parser
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('init jianghu project from boilerplate.\nUsage: $0 [dir] --type=simple')
      .options(this.getParserOptions())
      .alias('h', 'help')
      .version()
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
        description: 'boilerplate type',
      },
      dir: {
        type: 'string',
        description: 'target directory',
      },
      force: {
        type: 'boolean',
        description: 'force to override directory',
        alias: 'f',
      },
      template: {
        type: 'string',
        description: 'local path to boilerplate',
      },
      package: {
        type: 'string',
        description: 'boilerplate package name',
      },
      registry: {
        type: 'string',
        description: 'npm registry, support china/npm/custom, default to auto detect',
        alias: 'r',
      },
      silent: {
        type: 'boolean',
        description: 'don\'t ask, just use default value',
      },
    };
  }

  /**
   * get registryUrl by short name
   * @param {String} key - short name, support `china / npm / npmrc`, default to read from .npmrc
   * @return {String} registryUrl
   */
  getRegistryByType(key) {
    switch (key) {
      case 'china':
        return 'https://registry.npm.taobao.org';
      case 'npm':
        return 'https://registry.npmjs.org';
      default: {
        if (/^https?:/.test(key)) {
          return key.replace(/\/$/, '');
        } else {
          // default use self registry
          // return 'http://init.openjianghu.org';
          return 'https://registry.npmjs.org';
        }
      }
    }
  }

  /**
   * ask for target directory, will check if dir is valid.
   * @return {String} Full path of target directory
   */
  async getTargetDirectory() {
    const dir = this.argv._[0] || this.argv.dir || '';
    let targetDir = path.resolve(this.cwd, dir);
    const force = this.argv.force;

    const validate = dir => {
      // create dir if not exist
      if (!fs.existsSync(dir)) {
        mkdirp.sync(dir);
        return true;
      }

      // not a directory
      if (!fs.statSync(dir).isDirectory()) {
        return `${dir} already exists as a file`.red;
      }

      // check if directory empty
      const files = fs.readdirSync(dir).filter(name => name[0] !== '.');
      if (files.length > 0) {
        if (force) {
          this.log(`${dir} already exists and will be override due to --force`.red);
          return true;
        }
        return `${dir} already exists and not empty: ${JSON.stringify(files)}`.red;
      }
      return true;
    };

    // if argv dir is invalid, then ask user
    const isValid = validate(targetDir);
    if (isValid !== true) {
      this.log(isValid);
      const answer = await this.inquirer.prompt({
        name: 'dir',
        message: 'Please enter target dir: ',
        default: dir || '.',
        filter: dir => path.resolve(this.cwd, dir),
        validate,
      });
      targetDir = answer.dir;
    }
    this.log(`target dir is ${targetDir}`);
    return targetDir;
  }

  /**
   * find template dir from support `--template=`
   * @return {undefined|String} template files dir
   */
  async getTemplateDir() {
    let templateDir;
    // when use `jianghu-init --template=PATH`
    if (this.argv.template) {
      templateDir = path.resolve(this.cwd, this.argv.template);
      if (!fs.existsSync(templateDir)) {
        this.log(`${templateDir} is not exists`.red);
      } else if (!fs.existsSync(path.join(templateDir, 'boilerplate'))) {
        this.log(`${templateDir} should contain boilerplate folder`.red);
      } else {
        this.log(`local template dir is ${templateDir.green}`);
        return templateDir;
      }
    }
  }

  /**
   * fetch boilerplate mapping from `jianghu-init-config`
   * @param {String} [pkgName] - config package name, default to `this.configName`
   * @return {Object} boilerplate config mapping, `{ simple: { "name": "simple", "package": "jianghu-boilerplate-simple", "description": "Simple jianghu app boilerplate" } }`
   */
  async fetchBoilerplateMapping(pkgName) {
    const pkgInfo = await this.getPackageInfo(pkgName || this.configName, true);
    // const pkgInfo = (pkgName || this.configName) === 'jianghu-init-config' ? require(`../../${(pkgName || this.configName)}/package.json`) : await this.getPackageInfo(pkgName || this.configName, true);
    const mapping = pkgInfo.config.boilerplate;
    Object.keys(mapping).forEach(key => {
      const item = mapping[key];
      item.name = item.name || key;
      item.from = pkgInfo;
    });
    return mapping;
  }

  /**
   * replace content with template scope,
   * - `{{ test }}` will replace
   * - `\{{ test }}` will skip
   *
   * @param {String} content - template content
   * @param {Object} scope - variable scope
   * @return {String} new content
   */
  replaceTemplate(content, scope) {
    return content.toString().replace(/(\\)?{{ *(\w+) *}}/g, (block, skip, key) => {
      if (skip) {
        return block.substring(skip.length);
      }
      return scope.hasOwnProperty(key) ? scope[key] : block;
    });
  }

  /**
   * download boilerplate by pkgName then extract it
   * @param {String} pkgName - boilerplate package name
   * @return {String} extract directory
   */
  async downloadBoilerplate(pkgName) {
    const result = await this.getPackageInfo(pkgName, false);
    const tgzUrl = result.dist.tarball;

    this.log(`downloading ${tgzUrl}`);

    const saveDir = path.join(os.tmpdir(), 'jianghu-init-boilerplate');
    await rimraf(saveDir);

    const response = await this.curl(tgzUrl, { streaming: true, followRedirect: true });
    await compressing.tgz.uncompress(response.res, saveDir);

    this.log(`extract to ${saveDir}`);
    return path.join(saveDir, '/package');
  }

  /**
   * send curl to remote server
   * @param {String} url - target url
   * @param {Object} [options] - request options
   * @return {Object} response data
   */
  async curl(url, options) {
    return await this.httpClient.request(url, options);
  }

  /**
   * get package info from registry
   *
   * @param {String} pkgName - package name
   * @param {Boolean} [withFallback] - when http request fail, whethe to require local
   * @return {Object} pkgInfo
   */
  async getPackageInfo(pkgName, withFallback) {
    this.log(`fetching npm info of ${pkgName} ${withFallback}`);
    try {
      // 重要的一句话，有些node版本，会提示 `unable to get local issuer certificate`
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
      // this.log(`线上开始 ${this.registryUrl.substring(7)} ${this.registryUrl}/${pkgName}/latest`);
      const result = await this.curl(`${this.registryUrl}/${pkgName}/latest`, {
        dataType: 'json',
        followRedirect: true,
        maxRedirects: 5,
        timeout: 5000,
      });
      // this.log(`线上成功 ${result}`);
      assert(result.status === 200, `npm info ${pkgName} got error: ${result.status}, ${result.data.reason}`);
      return result.data;
    } catch (err) {
      this.log(`线上失败 ${pkgName}`);
      if (withFallback) {
        this.log(`use fallback from ${pkgName}`);
        return require(`../../${pkgName}/package.json`);
      } else {
        throw err;
      }
    }
  }

  /**
   * log with prefix
   */
  log() {
    const args = Array.prototype.slice.call(arguments);
    args[0] = `[${this.name}] `.blue + args[0];
    console.log.apply(console, args);
  }
};
