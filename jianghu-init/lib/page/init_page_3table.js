'use strict';
const yargs = require('yargs');
const CommandBase = require('../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');

/**
 * 根据 table 定义生成 crud 页面（3 table）
 */
module.exports = class InitPage3Table extends CommandBase {

  async run(cwd, argv) {
    this.cwd = cwd;

    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    // 如果是 multi，则切换到 user_app_management 获取前缀
    if (fs.existsSync('../user_app_management')) {
      const oldCwd = process.cwd();
      process.chdir('../user_app_management');
      this.dbPrefix = this.readDbPrefixFromFile();
      process.chdir(oldCwd);
      if (this.dbPrefix && this.app.startsWith(this.dbPrefix)) {
        this.app = this.app.slice(this.dbPrefix.length);
      }
    }
    await this.getKnex(this.dbSetting);
    this.success('初始化数据库连接成功');

    // generate crud
    await this.generateCrud();

    this.success('init crud is success');
  }

  // 创建 view
  async createView({ tableA, nameA, primaryFieldA, tableB, nameB, primaryFieldB, tableMiddle }) {

    const fieldsA = await this.getFields(tableA);
    const fieldsB = await this.getFields(tableB);
    const fieldsMiddle = await this.getFields(tableMiddle);

    const existNames = [];
    let aPartSql = '';
    fieldsA.forEach(field => {
      if ([ 'id', 'operation', 'operationByUserId', 'operationByUser', 'operationAt', primaryFieldA, primaryFieldB ].includes(field.COLUMN_NAME)) {
        return;
      }
      existNames.push(field.COLUMN_NAME);
      aPartSql += `\`${tableA}\`.\`${field.COLUMN_NAME}\` AS \`${field.COLUMN_NAME}\`,\n`;
    });

    let bPartSql = '';
    fieldsB.forEach(field => {
      if ([ 'id', 'operation', 'operationByUserId', 'operationByUser', 'operationAt', primaryFieldA, primaryFieldB ].includes(field.COLUMN_NAME)) {
        return;
      }
      if (existNames.includes(field.COLUMN_NAME)) {
        this.warning(`生成 view 时，发现 ${tableB} 表中的 ${field.COLUMN_NAME} 在 ${tableA} 中已经存在，暂时跳过，请后续手动处理`);
        return;
      }
      existNames.push(field.COLUMN_NAME);
      bPartSql += `\`${tableB}\`.\`${field.COLUMN_NAME}\` AS \`${field.COLUMN_NAME}\`,\n`;
    });

    let middlePartSql = '';
    fieldsMiddle.forEach(field => {
      if ([ 'id', 'operation', 'operationByUserId', 'operationByUser', 'operationAt', primaryFieldA, primaryFieldB ].includes(field.COLUMN_NAME)) {
        return;
      }
      if (existNames.includes(field.COLUMN_NAME)) {
        this.warning(`生成 view 时，发现 ${tableMiddle} 表中的 ${field.COLUMN_NAME} 在 ${tableA} 和 ${tableB} 中已经存在，暂时跳过，请后续手动处理`);
        return;
      }
      existNames.push(field.COLUMN_NAME);
      middlePartSql += `\`${tableMiddle}\`.\`${field.COLUMN_NAME}\` AS \`${field.COLUMN_NAME}\`,\n`;
    });

    const viewCreateSql = `
create or replace view view01_${tableMiddle} as
select distinct \`${tableMiddle}\`.\`id\`                AS \`id\`,
                \`${tableMiddle}\`.\`${primaryFieldA}\`         AS \`${primaryFieldA}\`,
                \`${tableMiddle}\`.\`${primaryFieldB}\`           AS \`${primaryFieldB}\`,
${aPartSql}${bPartSql}${middlePartSql}
                \`${tableMiddle}\`.\`operation\`         AS \`operation\`,
                \`${tableMiddle}\`.\`operationByUserId\` AS \`operationByUserId\`,
                \`${tableMiddle}\`.\`operationByUser\`   AS \`operationByUser\`,
                \`${tableMiddle}\`.\`operationAt\`       AS \`operationAt\`
from ((\`${tableMiddle}\` left join \`${tableA}\` on ((
        \`${tableMiddle}\`.\`${primaryFieldA}\` =
        \`${tableA}\`.\`${primaryFieldA}\`)))
         left join \`${tableB}\`
                   on ((\`${tableMiddle}\`.\`${primaryFieldB}\` =
                        \`${tableB}\`.\`${primaryFieldB}\`)));
    `;

    const knex = await this.getKnex();
    await knex.schema.raw(viewCreateSql);
    this.info(viewCreateSql);
    this.info(`生成 view: view01_${tableMiddle} 完成`);
  }

  /**
   * 生成 crud
   */
  async generateCrud() {
    this.info('开始生成 CRUD');
    const { tableA, nameA, primaryFieldA, tableB, nameB, primaryFieldB, tableMiddle } = await this.promptTables('请输入你要生成 CRUD 的 table', '');
    if (!tableA || !tableB) {
      this.info('未选择 table，流程结束');
      return;
    }
    this.info(`开始生成 ${tableA} 的 CRUD`);

    // 创建 view
    await this.createView({ tableA, nameA, primaryFieldA, tableB, nameB, primaryFieldB, tableMiddle });
    const tableView = `view01_${tableMiddle}`;

    // 生成 vue
    const abMiddlePageId = `${_.camelCase(tableA)}ManagementOfOne${_.upperFirst(_.camelCase(tableB))}`;
    const baMiddlePageId = `${_.camelCase(tableB)}ManagementOfOne${_.upperFirst(_.camelCase(tableA))}`;
    if (await this.renderVue('3table/a_crud.html', _.camelCase(tableA) + 'Management', { tableA, nameA, tableB, nameB, table: tableA, tableMiddle, tableView, middlePageId: baMiddlePageId, primaryFieldA, primaryFieldB, title: nameA })) {
      this.success(`生成 ${tableA} 的 vue 文件完成`);
    }
    if (await this.renderVue('3table/a_crud.html', _.camelCase(tableB) + 'Management', { tableA: tableB, nameA: nameB, tableB: tableA, nameB: nameA, table: tableB, tableMiddle, tableView, middlePageId: abMiddlePageId, primaryFieldB: primaryFieldA, primaryFieldA: primaryFieldB, title: nameB })) {
      this.success(`生成 ${tableB} 的 vue 文件完成`);
    }
    if (await this.renderVue('3table/b_management_of_one_a.html', baMiddlePageId, { tableB, nameB, tableA, nameA, table: tableB, tableMiddle, tableView, primaryFieldA, primaryFieldB, title: abMiddlePageId })) {
      this.success(`生成 ${tableMiddle} 的 vue 文件完成`);
    }
    if (await this.renderVue('3table/b_management_of_one_a.html', abMiddlePageId, { tableA: tableB, nameA: nameB, tableB: tableA, nameB: nameA, table: tableB, tableMiddle, tableView, primaryFieldB: primaryFieldA, primaryFieldA: primaryFieldB, title: baMiddlePageId })) {
      this.success(`生成 ${tableMiddle} 的 vue 文件完成`);
    }
  }

  /**
   * 确认生成表
   */
  async promptTables() {
    const knex = await this.getKnex();

    const result = await knex.select('TABLE_NAME').from('INFORMATION_SCHEMA.TABLES').where({
      TABLE_SCHEMA: this.dbSetting.database,
      TABLE_TYPE: 'BASE TABLE',
    });
    const tables = result.map(item => item.TABLE_NAME).filter(table => !table.startsWith('_'));
    // console.log(tables);

    const { tableA } = await inquirer.prompt({
      name: 'tableA',
      type: 'list',
      message: '请选择你要生成 crud 的表（A表）',
      choices: tables,
      pageSize: 100,
    });
    const { nameA } = await inquirer.prompt({
      name: 'nameA',
      type: 'input',
      default: tableA,
      message: `请输入 ${tableA} 的名字，如"文章"`,
    });
    const { primaryFieldA } = await inquirer.prompt({
      name: 'primaryFieldA',
      type: 'input',
      default: _.camelCase(tableA) + 'Id',
      message: `请输入 ${tableA} 表的业务字段`,
    });

    const { tableB } = await inquirer.prompt({
      name: 'tableB',
      type: 'list',
      message: '请选择你要生成 crud 的表（B表）',
      choices: tables,
      pageSize: 100,
    });
    const { nameB } = await inquirer.prompt({
      name: 'nameB',
      type: 'input',
      default: tableB,
      message: `请输入 ${tableB} 的名字，如"标签"`,
    });
    const { primaryFieldB } = await inquirer.prompt({
      name: 'primaryFieldB',
      type: 'input',
      default: _.camelCase(tableB) + 'Id',
      message: `请输入 ${tableB} 表的业务字段`,
    });

    const { tableMiddle } = await inquirer.prompt({
      name: 'tableMiddle',
      type: 'list',
      message: '请输入两表的第三张关联表',
      choices: tables,
    });
    return { tableA, nameA, primaryFieldA, tableB, nameB, primaryFieldB, tableMiddle };
  }

  /**
   * 生成 vue
   */
  async renderVue(template, pageId, renderContext = {}) {
  // 写文件前确认是否覆盖
    const filepath = `./app/view/page/${pageId}.html`;
    if (fs.existsSync(filepath)) {
      const overwrite = await this.readlineMethod(`文件 ${filepath} 已经存在，是否覆盖?(y/N)`, 'n');
      if (overwrite !== 'y' && overwrite !== 'Y') {
        this.warning(`跳过 ${filepath} 的生成`);
        return false;
      }
    }

    // 读取文件
    const templatePath = `${path.join(__dirname, '../')}page-template`;
    let listTemplate = fs.readFileSync(`${templatePath}/${template}`).toString();
    // 为了方便 ide 渲染，在模板里面约定 //===// 为无意义标示
    listTemplate = listTemplate.replace(/\/\/===\/\//g, '');

    // 生成 vue
    nunjucks.configure(`${templatePath}/${template}`, {
      tags: {
        blockStart: '<=%',
        blockEnd: '%=>',
        variableStart: '<=$',
        variableEnd: '$=>',
      },
    });
    const context = {
      pageId,
    };
    for (const key of Object.keys(renderContext)) {
      const value = renderContext[key];
      context[key] = value;
      context[key + 'CamelCase'] = _.camelCase(value);
      if (key.startsWith('table')) {
        context[key + 'Fields'] = await this.getFields(value);
      }
    }
    // console.log('context', context);
    let result = nunjucks.renderString(listTemplate, context);

    // render 的 view 中会包含一些 sql，提取出来执行
    const groups = /<!--SQL START([\s\S]*)SQL END!-->/.exec(result);
    if (groups && groups.length) {
      this.info('渲染页面中包含 sql，执行中..');
      const lines = result.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('INSERT')) {
          await this.knex.schema.raw(line);
          console.log(`执行 SQL:\n${line}`);
        }
      }
      result = result.replace(/<!--SQL START([\s\S]*)SQL END!-->/, '');
    }

    fs.writeFileSync(filepath, result);
    return true;
  }

  /**
   * 获取表字段
   */
  async getFields(table) {
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

    return result.filter(column => {
      return ![ ...defaultColumn, 'id' ].includes(column.COLUMN_NAME);
    }).map(column => {
      return {
        COLUMN_NAME: column.COLUMN_NAME,
        COLUMN_COMMENT: column.COLUMN_COMMENT || column.COLUMN_NAME,
      };
    });
  }

};
