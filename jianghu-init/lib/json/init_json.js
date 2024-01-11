'use strict';
const CommandBase = require('../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
// const _ = require('lodash');
const path = require('path');
const typeList = [
  { value: '1table-page', name: '1table-page' },
  { value: '1table-component', name: '1table-component' },
  { value: 'jh-component', name: 'jh-component' },
];

const chartTypeList = [
  { value: 'line', name: 'line - 折线图' },
  { value: 'pie', name: 'pie - 饼状图' },
  { value: 'bar', name: 'bar - 柱状图' },
  { value: 'gauge', name: 'gauge - 仪器表' },
];

/**
 * 根据 table 定义生成 crud 页面
 */
module.exports = class InitJson extends CommandBase {
  async run(cwd, argv) {
    this.cwd = cwd;
    this.argv = argv;
    // 检查配置 && 生成json配置中缺省的默认配置
    // 检查当前目录是否是在项目中
    await this.checkPath();
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    this.success('初始化数据库连接成功');
    const config = await this.promptConfig();
    await this.buildJson(config);
  }

  // 确认生成表
  async promptConfig() {
    const knex = await this.getKnex();
    let { table, pageId, pageType } = this.argv;
    if (!pageType) {
      const res = await inquirer.prompt({
        name: 'type',
        type: 'list',
        choices: typeList,
        message: '请选择类型',
      });
      pageType = res.type;
    }
    if (pageType === 'jh-component') {
      const res = await inquirer.prompt({
        name: 'chartType',
        type: 'list',
        choices: chartTypeList,
        message: '请选择图表类型',
      });
      const chartType = res.chartType;
      return { table, pageId, pageType, chartType };
    }
    if (!table) {
      const result = await knex
        .select('TABLE_NAME')
        .from('INFORMATION_SCHEMA.TABLES')
        .where({
          TABLE_SCHEMA: this.dbSetting.database,
          TABLE_TYPE: 'BASE TABLE',
        });
      const tables = result
        .map(item => item.TABLE_NAME)
        .filter(table => !table.startsWith('_'));
      const res = await inquirer.prompt({
        name: 'table',
        type: 'list',
        message: '请选择你要生成 crud 的表',
        choices: tables,
        pageSize: 100,
      });
      table = res.table;
    }
    if (!pageId) {
      const res = await inquirer.prompt({
        name: 'pageId',
        type: 'input',
        default: table + 'Management',
        message: `请输入文件名，如"${table}Management"`,
      });
      pageId = res.pageId;
    }
    return { table, pageId, pageType };
  }

  // 生成 json
  async buildJson({ table, pageId, pageType, chartType }) {
    // 检测创建文件夹
    if (!fs.existsSync('./app/view/init-json')) fs.mkdirSync('./app/view/init-json');
    const generateFileDir = pageType === '1table-page' ? './app/view/init-json/page' : './app/view/init-json/component';
    if (!fs.existsSync(generateFileDir)) fs.mkdirSync(generateFileDir);

    const fields = table ? await this.getTableFields(table) : [];

    let content;
    let fileName = pageId;
    if (pageType === 'jh-component') {
      if (chartType) {
        content = this.getChartContent({ table, pageId, pageType, chartType });
        if (!pageId) {
          fileName = chartType + 'chart';
        }
      }
    } else {
      content = this.getContent({ table, pageId, pageType, fields });
    }
    // 生成文件
    const generateFilePath = `${generateFileDir}/${fileName}.js`;
    fs.writeFileSync(generateFilePath, content);
  }

  getContent({ table, pageId, pageType, fields }) {
    let columnStr = '';
    let createItemListStr = '';
    let updateItemListStr = '';
    let space = '';
    fields.forEach((field, index) => {
      const fieldKey = field.COLUMN_NAME;
      const fieldName = field.COLUMN_COMMENT;
      if (index === 0) columnStr += space + `{ text: "${fieldName}", value: "${fieldKey}", type: "v-text-field", width: 80, sortable: true, class: "fixed", cellClass: "fixed" },\n`;
      if (index !== 0) columnStr += space + `{ text: "${fieldName}", value: "${fieldKey}", type: "v-text-field", width: 80, sortable: true },\n`;
      createItemListStr += space + `{ label: "${fieldName}", model: "${fieldKey}", tag: "v-text-field", rules: "validationRules.requireRules",   },\n`;
      updateItemListStr += space + `  { label: "${fieldName}", model: "${fieldKey}", tag: "v-text-field", rules: "validationRules.requireRules",   },\n`;
      space = '      ';
    });
    columnStr += space + '{ text: "", value: "" },\n';
    columnStr += space + '{ text: "操作", value: "action", type: "action", width: 120, align: "center", class: "fixed", cellClass: "fixed" },\n';
    const propsStr = pageType === '1table-component' ? 'props: {},' : '';
    const componentPath = pageType === '1table-component' ? `componentPath: "${pageId}",` : '';
    const content =
    `const content = {
      pageType: "${pageType}", pageId: "${pageId}", table: "${table}", pageName: "${pageId}页面", ${componentPath}
      resourceList: [], // 额外resource { actionId, resourceType, resourceData }
      drawerList: [], // 抽屉列表 { key, title, contentList }
      includeList: [], // 其他资源引入
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
    return content;
  }

  getChartData(chartType) {
    switch (chartType) {
      case 'line':
        return {
          lineOption: {
            xAxis: {
              type: 'category',
              data: [ '2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06' ],
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: [ 0, 2000, 4000, 6000, 2000, 2000 ],
                type: 'line',
              },
            ],
          },
        };
      case 'bar':
        return {
          barChartOption: {
            xAxis: {
              max: 'dataMax',
            },
            yAxis: {
              type: 'category',
              data: [ '初步沟通', '验证客户', '报价', '赢单', '输单' ],
            },
            series: [
              {
                name: '金额',
                type: 'bar',
                data: [ 1000, 2000, 4000, 6000, 2000 ],
                label: {
                  show: true,
                  position: 'right',
                },
              },
            ],
          },
        };
      case 'pie':
        return {
          pieChartOption: {
            title: {
              left: 'center',
            },
            tooltip: {
              trigger: 'item',
            },
            legend: {
              orient: 'vertical',
              left: 'left',
            },
            series: [
              {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: [
                  { value: 1048, name: 'IT' },
                  { value: 735, name: '设计' },
                  { value: 580, name: '金融' },
                  { value: 484, name: '电力' },
                  { value: 300, name: '餐饮' },
                ],
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                  },
                },
              },
            ],
          },
        };
      case 'gauge':
        return {
          gaugeChartOption: {
            tooltip: {
              formatter: '{a} <br/>{b} : {c}%',
            },
            series: [
              {
                name: 'Pressure',
                type: 'gauge',
                detail: {
                  formatter: '{value}%',
                },
                data: [
                  {
                    value: 50,
                    name: '完成率',
                  },
                ],
              },
            ],
          },
        };
      default:
        return {};
    }
  }
  getChartContent({ pageId, pageType, chartType }) {
    let pageIdStr = '';
    if (pageIdStr) {
      pageIdStr = `pageId: "${pageId}", `;
    }
    let pageContent = '';
    if (chartType) {
      pageContent = `
    tag: "v-chart",
    attrs: {
      ':option': '${chartType}ChartOption',
      style: 'height: 300px;',
      autoresize: true,
      ref: '${chartType}Chart',
    },
    value: ''`;

    }
    const content = `
const content = {
  pageType: "${pageType}", ${pageIdStr}pageName: "${chartType}图表", componentPath: "${pageId || 'chart/' + chartType}",
  resourceList: [], // 额外resource { actionId, resourceType, resourceData }
  drawerList: [], // 抽屉列表 { key, title, contentList }
  includeList: [], // 其他资源引入
  common: {
    data: ${JSON.stringify(this.getChartData(chartType), null, 2).replace(/"([^"]+)":/g, '$1:').replace(/\n/g, '\n    ')},
  },
  headContent: {
  },
  pageContent: {
    ${pageContent}
  },
};

module.exports = content;
    `;
    return content;
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * 获取数据库表所有原生字段
   * @param {String} table
   * @returns
   */
  async getTableFields(table) {
    const knex = await this.getKnex();
    const result = await knex
      .select('COLUMN_NAME', 'COLUMN_COMMENT')
      .from('INFORMATION_SCHEMA.COLUMNS')
      .where({
        TABLE_SCHEMA: this.dbSetting.database,
        TABLE_NAME: table,
      });

    const defaultColumn = [
      'operation',
      'operationByUserId',
      'operationByUser',
      'operationAt',
    ];
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
        COLUMN_COMMENT: (column.COLUMN_COMMENT || column.COLUMN_NAME || '')
          .split(';')[0]
          .split('；')[0]
          .split(':')[0],
      };
    });

    return columns;
  }

  async example() {
    // 初始化数据库连接
    this.dbSetting = this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);

    const examplePath = `${path.join(
      __dirname,
      '../../'
    )}page-template-json/example`;
    const examplePageFilePath = examplePath + '/class.js';
    const exampleComponentFilePath = examplePath + '/studentOfClass.js';
    // 检测创建文件夹
    if (!fs.existsSync('./app/view/init-json')) {
      fs.mkdirSync('./app/view/init-json');
    }
    if (!fs.existsSync('./app/view/init-json/page')) {
      fs.mkdirSync('./app/view/init-json/page');
    }
    if (!fs.existsSync('./app/view/init-json/component')) {
      fs.mkdirSync('./app/view/init-json/component');
    }
    // 把样例文件复制到项目中
    fs.copyFileSync(
      examplePageFilePath,
      './app/view/init-json/page/exampleClass.js'
    );
    fs.copyFileSync(
      exampleComponentFilePath,
      './app/view/init-json/component/exampleStudentOfClass.js'
    );

    // sql 文件
    const sqlFilePath = examplePath + '/crud.sql';
    // knex 运行 sql 文件

    const knex = await this.getKnex();
    const sqlContentList = fs
      .readFileSync(sqlFilePath)
      .toString()
      .replace(/--.*|\n|\\/g, '')
      .split(';')
      .filter(sql => sql);
    for (const sql of sqlContentList) {
      await knex.raw(sql);
    }
    return [
      // eslint-disable-next-line no-eval
      eval(fs.readFileSync('./app/view/init-json/page/exampleClass.js').toString()),
      // eslint-disable-next-line no-eval
      eval(fs.readFileSync('./app/view/init-json/component/exampleStudentOfClass.js').toString()),
    ];
  }
};
