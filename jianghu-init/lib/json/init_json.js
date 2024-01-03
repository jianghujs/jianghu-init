'use strict';
const yargs = require('yargs');
const CommandBase = require('../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const nunjucks = require('nunjucks');
const _ = require('lodash');
const moment = require('moment');
const path = require('path');
const typeList = [
  {value: 'page', name: 'page'},
  {value: 'component', name: 'component'},
]

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitJson extends CommandBase {

  async run(cwd) {
    this.cwd = cwd;
    // 检查配置 && 生成json配置中缺省的默认配置
    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    this.success('初始化数据库连接成功');
    const config = await this. promptConfig();
    await this.buildJson(config);
    this.success('初始化数据库成功');
  }

  /**
   * 确认生成表
   */
  async promptConfig() {
    const knex = await this.getKnex();

    const result = await knex.select('TABLE_NAME').from('INFORMATION_SCHEMA.TABLES').where({
      TABLE_SCHEMA: this.dbSetting.database,
      TABLE_TYPE: 'BASE TABLE',
    });
    const tables = result.map(item => item.TABLE_NAME).filter(table => !table.startsWith('_'));
    const { table } = await inquirer.prompt({
      name: 'table',
      type: 'list',
      message: '请选择你要生成 crud 的表',
      choices: tables,
      pageSize: 100,
    });
    const { pageId } = await inquirer.prompt({
      name: 'pageId',
      type: 'input',
      default: table + 'Management',
      message: `请输入文件名，如"${table}Management"`,
    });
    const { type } = await inquirer.prompt({
      name: 'type',
      type: 'list',
      choices: typeList,
      message: `请选择类型`,
    });
    return { table, pageId, type };
  }

  async askForConfig() {
    const answer = await inquirer.prompt({
      name: 'jsonType',
      type: 'list',
      message: 'Please select a json type',
      choices: jsonTypes,
      pageSize: jsonTypes.length + 1,
    });
    return answer.jsonType;
  }

  /**
   * 生成 vue
   */
  async buildJson({table, pageId, type}) {
    const generateFileDir = type === 'page' ? `./app/view/pageConfig` : `./app/view/componentConfig`;

    if (!fs.existsSync(generateFileDir)) {
      fs.mkdirSync(generateFileDir);
    }
    const generateFilePath = `${generateFileDir}/${pageId}.js`
    const fields = await this.getTableFields(table);
    let columnStr = '';
    let createItemListStr = '';
    let updateItemListStr = '';
    let space = '';
    fields.forEach((field, index) => {
      const fieldKey = field.COLUMN_NAME;
      const fieldName = field.COLUMN_COMMENT;
      columnStr += space + `{ text: "${fieldName}", value: "${fieldKey}", type: "v-text-field", width: 80, sortable: true },\n`;
      createItemListStr += space + `{ label: "${fieldName}", model: "${fieldKey}", tag: "v-text-field", rules: "validationRules.requireRules",   },\n`;
      updateItemListStr += space + `  { label: "${fieldName}", model: "${fieldKey}", tag: "v-text-field", rules: "validationRules.requireRules",   },\n`;
      if (index == 0) space = '      ';
    })
    columnStr += space + `{ text: "操作", value: "action", type: "action", width: 120, align: "center", class: "fixed", cellClass: "fixed" },\n`;
    const pageType = type == 'page' ? '1table-page' : '1table-component';
    const propsStr = type != 'page' ? `props: {},` : '';
    const componentPath = type != 'page' ? `componentPath: "${pageId}",` : '';
    const content = 
`const content = {
  pageType: "${pageType}", pageId: "${pageId}", table: "${table}", pageName: "${pageId}页面", ${componentPath}
  resourceList: [], // 额外resource { actionId, resourceType, resourceData }
  drawerList: [], // 抽屉列表 { key, title, contentList }
  common: {
    ${propsStr}
    data: {
      constantObj: {
          gender: ["全部", "男", "女"],
      },
      validationRules: { 
          requireRules: [
              v => !!v || '此项必填',
          ],
          phoneRules: [
              v => !!v || '此项必填',
              v => /^1[3456789]\d{9}$/.test(v) || '手机号格式错误',
          ],
      },
    },
    watch: {},
    computed: {},
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {}
  },
  headContent: {
    helpDrawer: {}, // 自动初始化md文件
    // serverSearchList: [
    //   { tag: "v-text-field",  label: "学生名字",    model: "serverSearchWhereLike.name",                                          },
    //   { tag: "v-select",      label: "性别",       model: "serverSearchWhere.gender",           attrs: { items: ["全部", "男", "女"] } },
    //   { tag: "v-date-picker", label: "出生日期",    model: "serverSearchWhereLike.dateOfBirth",  attrs: { type: "month" },             },
    // ],
    // serverSearchWhere: { gender: "全部" },
    // serverSearchWhereLike: { name: null, dateOfBirth: null },
  },
  pageContent: {
    tableAttrs: {},
    tableHeaderList: [
      ${columnStr}
    ],
    rowActionList: [], // 行内操作按钮 { tag, value, attrs }
    headActionList: [], // 表头操作按钮 { tag, value, attrs }
  },
  createDrawerContent: {
    formItemList: [
      ${createItemListStr}
    ]
  },
  updateDrawerContent: {
    contentList: [
      { label: "详细信息", type: "form", formItemList: [
      ${updateItemListStr}
      ]},
      { label: "操作记录", type: "component", componentPath: "recordHistory" },
    ]
  },
  deleteContent: {},
};

module.exports = content;
`;
    fs.writeFileSync(generateFilePath, content);
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
