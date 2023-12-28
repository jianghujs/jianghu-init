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
    await this.renderComonentVue(jsonConfig);
    if (renderResult) {
      this.success(`生成 ${table} 的 vue 文件完成`);
      // 数据库
      this.info(`开始生成 ${table} 的相关数据`);
      await this.modifyTable(table, pageId);
      await this.modifyComponentResource(jsonConfig);
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

  async modifyComponentResource(jsonConfig) {
    const knex = await this.getKnex();
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/component`;
    const componentList = this.getUpdateDrawerComponentList(jsonConfig);

    // 循环 componentList 运行 sql
    for (const component of componentList) {
      let resourceSql = fs.readFileSync(`${templatePath}/${component.filename}.sql`).toString();
      _.forEach(component.njkObj, (value, key) => {
        resourceSql = resourceSql.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });
      
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


  handleNunjucksEnv(templateTargetPath) {
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
    // 复杂变量包含函数或函数原样渲染
    nunjucksEnv.addFilter('variableToVar', function(obj, k) {
      let content = JSON.stringify(obj, function(key, value) {
          if (typeof value === 'function') {
              return `__FUNC_START__${value.toString()}__FUNC_END__`;
          }
          return value;
      }, 2).replace(/"__FUNC_START__/g, '').replace(/__FUNC_END__"/g, '').replace(/\\n/g, '\n').replace(/\\/g, '').replace(/\n/g, '\n    ');

      if (/^function\s*?\(/.test(content)) {
        content = k + ': ' + content;
      }
      if (/^async\s+function\s*?\(/.test(content)) {
        content = k + ': ' + content;
      }
      if (typeof obj == 'function') {
        content = content.replace(/   /g, ' ');
      }
      return content;
    });
    nunjucksEnv.addFilter('camelToKebab', function(obj) {
      return obj.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '\$1-\$2').toLowerCase();
    });
    return nunjucksEnv;
  }

  handleJsonConfig(jsonConfig) {
    const { pageContent } = jsonConfig;
    const defaultActionList = [
      { text: "编辑", action: "startUpdateItem", icon: "mdi-pencil", color: "primary", },
      { text: "删除", action: "deleteItem", icon: "mdi-delete", color: "error", },
    ]
    // pageContent.actionList push defaultActionList;
    if (!pageContent.actionList) {
      pageContent.actionList = defaultActionList;
    }
    
  }

  getUpdateDrawerComponentList(jsonConfig) {
    const { table, pageId, primaryField } = jsonConfig;
    const componentList = [];
    const componentMap = {
      'recordHistory': {filename: 'tableRecordHistory'},
      '2table': {
        filename: '2table',
        require: ['table', 'primaryField'],
      },
    };
    if (jsonConfig.updateDrawerContent && jsonConfig.updateDrawerContent.contentList) {
      jsonConfig.updateDrawerContent.contentList.forEach(item => {
        if (item.type != 'updateForm' && componentMap[item.type]) {
          item.filename = componentMap[item.type].filename;
          item.templateName = componentMap[item.type].filename;
          if (componentMap[item.type].require) {
            componentMap[item.type].require.forEach(key => {
              if (!item[key]) {
                this.error(`${item.type}组件 缺少参数 ${key}`);
                throw new Error(`${item.type}组件 缺少参数 ${key}`);
              }
            });
          }
          item.njkObj = { 
            table: table,
            pageId
          }
          if (item.type == '2table' && item.table) {
            const tableCamelCaseB = _.camelCase(item.table);
            const tableCamelCaseA = _.camelCase(table);
            const templateName = `${tableCamelCaseB}Of${tableCamelCaseA.replace(tableCamelCaseA[0],tableCamelCaseA[0].toUpperCase())}`;
            item.njkObj = { 
              tableCamelCaseA: _.camelCase(table), 
              tableCamelCaseB, 
              tableA: table, 
              tableB: item.table,
              nameA: table, 
              nameB: item.table,
              primaryFieldA: primaryField,
              primaryFieldB: item.primaryField,
              pageId,
              templateName
            }
            item.templateName = templateName;
          }
          componentList.push(item);
        }
      });
    }
    return componentList;
  }

  async renderComonentVue(jsonConfig) {
    const componentList = this.getUpdateDrawerComponentList(jsonConfig);
    if (!componentList.length) return;

    const componentPath = `${path.join(__dirname, '../../')}page-template-json/component`;
    if (componentList.length) {
      if (!fs.existsSync(`./app/view/component`)) fs.mkdirSync(`./app/view/component`);
    }

    for( const item of componentList) {
      let componentHtml = fs.readFileSync(componentPath + '/' + item.filename + '.html')
        .toString()
        .replace(/\/\/===\/\/ /g, '')
        .replace(/\/\/===\/\//g, '');
      if (item.type == '2table' && item.table) {
        const tableBFields = await this.getTableFields(item.table);
        componentHtml = nunjucks.renderString(componentHtml, {...item.njkObj, tableBFields});
      }

      fs.writeFileSync(`./app/view/component/${item.templateName}.html`, componentHtml);
    }
  }
  /**
   * 生成 vue
   */
  async renderVue(jsonConfig) {
    const pageBakDir = `./app/view/pageBak`;
    if (!fs.existsSync(pageBakDir)) fs.mkdirSync(pageBakDir);

    const { table, pageId, pageType } = jsonConfig;
    const tableCamelCase = _.camelCase(table);
    const filepath = `./app/view/page/${pageId}.html`;
    const htmlBasePath = `${path.join(__dirname, '../../')}page-template-json/base.njk.html`;
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/1table-page`;
    const templateTargetPath = `${templatePath}/${pageType}.njk.html`;
    const listTemplate = fs.readFileSync(templateTargetPath)
      .toString()
      .replace(/\/\/===\/\/ /g, '')
      .replace(/\/\/===\/\//g, '');

    // 初始化 njk 模板标签、filter
    this.handleNunjucksEnv(templateTargetPath);
    this.handleJsonConfig(jsonConfig);
    
    const componentList = this.getUpdateDrawerComponentList(jsonConfig);
    const htmlBase = fs.readFileSync(htmlBasePath);
    let htmlUser = fs.existsSync(filepath) ? fs.readFileSync(filepath) : htmlBase;
    const htmlGenerate = nunjucks.renderString(listTemplate, { tableCamelCase, ...jsonConfig, componentList });
    const bakFilePath = await this.handleViewBak(pageId, filepath);

    
    // 生成 md
    if (jsonConfig.headContent && jsonConfig.headContent.helpDrawer) {
      const mdPath = `./app/view/pageDoc`;
      if (!fs.existsSync(mdPath)) fs.mkdirSync(mdPath);
      fs.writeFileSync(`${mdPath}/${pageId}.md`, `# ${pageId}页面`);
    }

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

  /**
   * 获取数据库表所有原生字段
   * @param {String} table
   * @returns
   */
  async getTableFields(table) {
    const knex = await this.getKnex();
    const result = await knex.select('COLUMN_NAME', 'COLUMN_COMMENT').from('INFORMATION_SCHEMA.COLUMNS').where({
      TABLE_SCHEMA: this.dbSetting.database,
      TABLE_NAME: table,
    });

    const defaultColumn = [ 'operation', 'operationByUserId', 'operationByUser', 'operationAt' ];
    for (const column of defaultColumn) {
      await knex.schema.hasColumn(table, column).then(exists => {
        if (!exists) {
          return knex.schema.table(table, t => {
            this.info(`创建依赖字段：${column}`);
            t.string(column);
          });
        }
      });
    }

    const columns = result.map(column => {
      return {
        COLUMN_NAME: column.COLUMN_NAME,
        COLUMN_COMMENT: (column.COLUMN_COMMENT || column.COLUMN_NAME || '').split(';')[0].split('；')[0].split(':')[0],
      };
    });

    return columns;
  }

};
