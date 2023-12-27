'use strict';
const yargs = require('yargs');
const CommandBase = require('../command_base');
const { exec } = require('child_process');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const moment = require('moment');
const path = require('path');

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitPage1Table extends CommandBase {
  async run(cwd, jsonArgv) {
    this.cwd = cwd;
    // TODO: ajv库检查 jsonArgv
    // 检查配置 && 生成json配置中缺省的默认配置
    // const finalJsonConfig = this.checkAndGenerateDefaultConfig(jsonArgv);
    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    this.success('初始化数据库连接成功');
    // generate crud
    await this.generateCrud(jsonArgv);
  }

  /**
   * 生成 crud
   */
  async generateCrud(jsonConfig) {
    const { pageType, pageId, table } = jsonConfig;
    this.info('开始生成 CRUD');
    if (!table) {
      this.info('未配置table，流程结束');
      return;
    }
    this.info(`开始生成 ${table} 的 CRUD`);
    // 生成 vue
    const renderResult = await this.renderVue(jsonConfig);
    if (renderResult) {
      this.success(`生成 ${table} 的 vue 文件完成`);
      // 数据库
      this.info(`开始生成 ${table} 的相关数据`);
      await this.modifyTable(table, pageId);
      await this.modifyComponentResource(table, pageId, jsonConfig);
      this.success(`生成 ${table} 的相关数据完成`);
    } else {
      this.error(`生成 ${table} 的 vue 文件失败`);
      return;
    }
  }

  async modifyTable(table, pageId) {
    const knex = await this.getKnex();
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/1table-page`;

    let clearSql = fs.readFileSync(`${templatePath}/clear_crud.sql`).toString();
    clearSql = clearSql.replace(/\{\{pageId}}/g, pageId);
    clearSql = clearSql.replace(/\{\{table}}/g, table);
    // 删除数据
    for (const line of clearSql.split('\n')) {
      if (!line) {
        continue;
      }
      if (line.startsWith('--')) {
        this.info(`正在执行删除 ${line}`);
      } else {
        await knex.raw(line);
      }
    }    

    let sql = fs.readFileSync(`${templatePath}/crud.sql`).toString();
    sql = sql.replace(/\{\{pageId}}/g, pageId);
    sql = sql.replace(/\{\{table}}/g, table);
    // 插入数据
    for (const line of sql.split('\n')) {
      if (!line) continue;
      if (line.startsWith('--')) {
        this.info(`正在执行插入/更新 ${line}`);
      } else {
        await knex.raw(line);
      }
    }
  }

  async modifyComponentResource(table, pageId, jsonConfig) {
    const knex = await this.getKnex();
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/component`;
    const componentList = this.getUpdateDrawerComponentList(jsonConfig);

    // 循环 componentList 运行 sql
    for (const component of componentList) {
      let resourceSql = fs.readFileSync(`${templatePath}/${component.replace('.html', '.sql')}`).toString();
      resourceSql = resourceSql.replace(/\{\{pageId}}/g, pageId);
      resourceSql = resourceSql.replace(/\{\{table}}/g, table);
      
      // 插入数据
      for (const line of resourceSql.split('\n')) {
        if (!line) continue;
        if (line.startsWith('--')) {
          this.info(`正在执行插入/更新 ${line}`);
        } else {
          await knex.raw(line);
        }
      }

    }

  }

  functionToStr(obj) {
    return JSON.stringify(obj, function(key, value) {
      if (typeof value === 'function') {
        return `__FUNC_START__${value.toString()}__FUNC_END__`;
      }
      return value;
    }).replace(/"__FUNC_START__/g, '').replace(/__FUNC_END__"/g, '');
  }

  getUpdateDrawerComponentList(jsonConfig) {
    const componentList = [];
    const componentMap = {
      'recordHistory': 'tableRecordHistory.html',
    };
    if (jsonConfig.updateDrawerContent && jsonConfig.updateDrawerContent.contentList) {
      jsonConfig.updateDrawerContent.contentList.forEach(item => {
        if (item.type != 'updateForm' && componentMap[item.type]) {
          componentList.push(componentMap[item.type]);
        }
      });
    }
    return componentList;
  }

  /**
   * 生成 vue
   */
  async renderVue(jsonConfig) {
    const pageBakDir = `./app/view/pageBak`;
    if (!fs.existsSync(pageBakDir)) fs.mkdirSync(pageBakDir);

    const { table, pageId, pageType } = jsonConfig;
    // 原样输出渲染data
    if (jsonConfig.common && jsonConfig.common.data) {
      _.forEach(jsonConfig.common.data, (value, key) => {
        jsonConfig.common.data[key] = this.functionToStr(value);
      });
    }
    const tableCamelCase = _.camelCase(table);
    const filepath = `./app/view/page/${pageId}.html`;
    const htmlBasePath = `${path.join(__dirname, '../../')}page-template-json/base.njk.html`;
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/1table-page`;
    const componentPath = `${path.join(__dirname, '../../')}page-template-json/component`;
    const templateTargetPath = `${templatePath}/${pageType}.njk.html`;
    const listTemplate = fs.readFileSync(templateTargetPath)
      .toString()
      .replace(/\/\/===\/\/ /g, '')
      .replace(/\/\/===\/\//g, '');
    const nunjucksEnv = nunjucks.configure(templateTargetPath, {
      autoescape: false,
      tags: {
        blockStart: '<=%',
        blockEnd: '%=>',
        variableStart: '<=$',
        variableEnd: '$=>',
      },
    });
    nunjucksEnv.addFilter('objToVar', function(obj, key, spaceCount=4) {
      if (!obj) { obj = {}; };
      let spaceStr = '';
      for (let i = 0; i < spaceCount; i++) { spaceStr += ' '; }
      const objStr = JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/\n/g, `\n${spaceStr}`);;
      return `${key}: ${objStr}`;
    });
    nunjucksEnv.addFilter('listToVar', function(arr, key, spaceCount=4) {
      if (!arr) { return `${key}: []`; };
      let spaceStr = '';
      for (let i = 0; i < spaceCount; i++) { spaceStr += ' '; }
      const arrayStr = `[\n${arr.map(item => "  " + spaceStr + JSON.stringify(item).replace(/"([^"]+)":/g, '$1:') + ",\n").join("")}${spaceStr}]`;
      return `${key}: ${arrayStr}`;
    });

    const componentList = this.getUpdateDrawerComponentList(jsonConfig);
    const htmlBase = fs.readFileSync(htmlBasePath);
    let htmlUser = fs.existsSync(filepath) ? fs.readFileSync(filepath) : htmlBase;
    const htmlGenerate = nunjucks.renderString(listTemplate, { tableCamelCase, ...jsonConfig, componentList });
    const bakFilePath = await this.handleViewBak(pageId, filepath);

    // 组件添加文件夹、文件
    if (componentList.length) {
      if (!fs.existsSync(`./app/view/component`)) fs.mkdirSync(`./app/view/component`);
    }
    componentList.forEach(item => {
      fs.writeFileSync(`./app/view/component/${item}`, fs.readFileSync(componentPath + '/' + item));
    });

    // fs.writeFileSync(filepath, htmlUser);
    fs.writeFileSync(filepath, htmlGenerate); // 测试  
    fs.writeFileSync(`./app/view/pageBak/${pageId}.base.html`, htmlBase);
    fs.writeFileSync(`./app/view/pageBak/${pageId}.generate.html`, htmlGenerate); 
    await this.executeCommand(`git merge-file ./app/view/page/${pageId}.html ./app/view/pageBak/${pageId}.base.html ./app/view/pageBak/${pageId}.generate.html`, );
    
    htmlUser = fs.readFileSync(filepath).toString();
    const diffCount = (htmlUser.match(new RegExp(`<<<<<<< ${filepath}`, 'g')) || []).length;
    if (diffCount > 0) {
      // git checkout --theirs ./app/view/page/${pageId}.html ===> 不好使
      this.warning(`生成的文件有 ${diffCount}处 冲突, 请手动解决!`);
    }
    if (diffCount == 0 && bakFilePath) {
      fs.unlinkSync(bakFilePath);
    }
    return true;
  }

  /**
   * 处理文件备份
   * @param {String} pageId
   * @param {String} filepath
   * @returns 
   */
  async handleViewBak(pageId, filepath){
    if (fs.existsSync(filepath)) {
      const pageBakDir = `./app/view/pageBak`;
      const pageBakPath = `${pageBakDir}/${pageId}`;
      if (!fs.existsSync(pageBakPath)) fs.mkdirSync(pageBakPath);
      const bakFilePath = `${pageBakPath}/${pageId}.${moment().format('YYYYMMDD_HHmmss')}.html`;
      fs.copyFileSync(filepath, bakFilePath);
      return bakFilePath;
    }
    return null;
  }


  async executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                // console.error(`执行${command}出错: ${error.message}`, { error, stdout, stderr });
                // reject();
                resolve(stdout);
            }
            resolve(stdout);
        });
    });
  }

};
