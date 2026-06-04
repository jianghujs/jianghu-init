'use strict';
const CommandBase = require('../command_base');

require('colors');
const inquirer = require('inquirer');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const nunjucks = require('nunjucks');
const InitPage = require('./init_page');
const InitMobilePage = require('./init_mobile_page');
const InitComponent = require('./init_component');
const { buildV7CrudContent, buildV7CustomContent } = require('./v7/generateInitJsonContent');

const defaultComponentPathFromTable = table => `biz/${_.camelCase(table)}`;

const defaultComponentNameFromTable = table => {
  const stripped = String(table || '').replace(/^[a-z]_/i, '').replace(/_/g, ' ').trim();
  return stripped || _.camelCase(table) || '组件';
};

const typeList = [
  { value: 'jh-page', name: 'jh-page' },
  { value: 'jh-mobile-page', name: 'jh-mobile-page' },
  { value: 'jh-component', name: 'jh-component' },
];

const chartTypeList = [
  { value: 'all', name: 'all - 所有样例（page + component）' },
  { value: 'line', name: 'line - 折线图' },
  { value: 'pie', name: 'pie - 饼状图' },
  { value: 'bar', name: 'bar - 柱状图' },
  { value: 'gauge', name: 'gauge - 仪器表' },
  { value: 'saleData', name: 'saleData - 销售简报' },
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
    this.dbSetting = await this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    const config = await this.promptConfig();
    await this.buildJson(config);
    this.success('生成配置文件成功！');
  }

  // 确认生成表
  async promptConfig() {
    const knex = await this.getKnex();
    let { table, pageId, pageType, chartPage, pageName, filename, componentPath } = this.argv;
    if (!pageType) {
      const res = await inquirer.prompt({
        name: 'type',
        type: 'list',
        choices: typeList,
        message: '请选择类型',
      });
      pageType = res.type;
    }
    if (chartPage) {
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
      const result = await knex.select('TABLE_NAME').from('INFORMATION_SCHEMA.TABLES').where({
        TABLE_SCHEMA: this.dbSetting.database,
        TABLE_TYPE: 'BASE TABLE',
      });
      const tables = result.filter(table => !table.TABLE_NAME.startsWith('_')).map(item => ({ value: item.TABLE_NAME, name: item.TABLE_NAME }));
      // const tables = result.map(item => ({ value: item.TABLE_NAME, name: item.TABLE_NAME }));

      if (pageType.startsWith('jh-')) {
        tables.unshift({ value: '', name: '自定义（不选表，生成 UI pageContent）' });
      }
      const res = await inquirer.prompt({
        name: 'table',
        type: 'list',
        message: '请选择数据表（选表 → mode:crud；不选 → 自定义 UI）',
        choices: tables,
        pageSize: 100,
      });
      table = res.table;
    }

    // jh-component 无 pageId：路径与名称由 component.path / component.name 决定，权限与路由归宿主 Page
    if (pageType === 'jh-component') {
      const defaultPath = table
        ? defaultComponentPathFromTable(table)
        : 'biz/exampleComponent';
      const defaultName = table
        ? defaultComponentNameFromTable(table)
        : '示例组件';
      const presetPath = componentPath || filename;
      if (!presetPath) {
        const res = await inquirer.prompt([
          {
            name: 'filename',
            type: 'input',
            default: defaultPath,
            message: `请输入 component.path（相对 app/view/component/），如 "${defaultPath}"`,
          },
          {
            name: 'pageName',
            type: 'input',
            default: answers => {
              const leaf = String(answers.filename || defaultPath).split('/').filter(Boolean).pop();
              return defaultName || leaf || '组件';
            },
            message: '请输入组件显示名称（component.name）',
          },
        ]);
        filename = res.filename;
        pageName = res.pageName;
      } else {
        filename = presetPath;
        if (!pageName) {
          pageName = table
            ? defaultComponentNameFromTable(table)
            : (String(filename).split('/').filter(Boolean).pop() || '组件');
        }
      }
      const mobileFilePrefix = '';
      return {
        table,
        pageId: undefined,
        pageName,
        pageType,
        filename: `${mobileFilePrefix}${filename}`,
      };
    }

    if (!pageId) {
      const defaultPageId = table ? `${_.camelCase(table)}Management` : 'examplePage';
      const res = await inquirer.prompt([
        {
          name: 'pageId',
          type: 'input',
          default: defaultPageId,
          message: `请输入 pageId（路由/权限边界），如 "${defaultPageId}"`,
        },
        {
          name: 'pageName',
          type: 'input',
          default: answers => answers.pageId,
          message: '请输入显示名称',
        },
      ]);
      pageId = res.pageId;
      pageName = res.pageName;
    } else if (!pageName) {
      pageName = pageId;
    }
    const filenameForPage = pageId;
    const mobileFilePrefix = pageType === 'jh-mobile-page' ? 'mobile/' : '';
    return {
      table,
      pageId,
      pageName: pageName || pageId,
      pageType,
      filename: `${mobileFilePrefix}${filenameForPage}`,
    };
  }


  // 生成 json
  async buildJson({ table, pageId, pageType, chartType, filename, pageName }) {

    const label = pageType === 'jh-component' ? (filename || 'component') : (pageId || filename || '');
    this.notice(`生成 ${label} 的 v7 配置文件...`);
    // 检测创建文件夹
    const generateFileDir = [ '1table-page', 'jh-mobile-page', 'jh-page' ].includes(pageType) ? './app/view/init-json/page' : './app/view/init-json/component';
    fs.mkdirSync(generateFileDir, { recursive: true });


    let fileName = filename;
    let content;
    if (![ 'jh-component', 'jh-page', 'jh-mobile-page' ].includes(pageType)) {
      this.error('pageType 只能是 jh-component、jh-page、jh-mobile-page');
    }
    if (pageType === 'jh-component') {
      if (chartType) {
        if (chartType === 'all') {
          content = await this.getAllChartContent();
          this.checkStaticChartFile();
          return;
        } else {
          content = this.getChartContent({ table, pageId, pageType, chartType });
        }
        if (!pageId) {
          fileName = chartType + 'Chart';
        }
        // 添加依赖的public 静态资源
        this.checkStaticChartFile();
      } else if (table) {
        content = await this.getV7CrudContent({ table, pageId, pageName, pageType, filename: fileName });
      } else {
        content = this.getV7CustomContent({ pageId, pageName, pageType, filename: fileName });
      }
    } else if (table) {
      content = await this.getV7CrudContent({ table, pageId, pageName, pageType, filename: fileName });
    } else {
      content = this.getV7CustomContent({ pageId, pageName, pageType, filename: fileName });
    }

    if (fileName.includes('/')) {
      const dir = fileName.split('/').slice(0, -1).join('/');
      fs.mkdirSync(`${generateFileDir}/${dir}`, { recursive: true });
    }

    // 生成文件
    const generateFilePath = `${generateFileDir}/${fileName}.js`;
    fs.writeFileSync(generateFilePath, content);

    // eslint-disable-next-line no-eval
    // const jsConfig = eval(content);
    // switch (pageType) {
    //   case 'jh-component':
    //     new InitComponent().renderContent(jsConfig);
    //     break;
    //   case 'jh-page':
    //     await new InitPage().renderContent(jsConfig);
    //     break;
    //   case 'jh-mobile-page':
    //     await new InitMobilePage().renderContent(jsConfig);
    //     break;
    //   default:
    //     this.error('pageType 只能是 jh-component、jh-page、jh-mobile-page');
    //     break;
    // }
    if (pageType.includes('component')) {
      const tag = fileName.split('/').pop().replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
      this.info(`
    ---------- v7 宿主 Page 引入示例 ----------
    includeList: [
      { type: 'html', path: 'component/${fileName}.html' },
    ],
    slots / pageContent 中挂载：
    <${tag} />
      `);
    }
  }

  /**
   * V7 CRUD 配置（选表 → mode: 'crud'，fields 来自表结构）
   */
  async getV7CrudContent({ table, pageId, pageName, pageType, filename }) {
    const columns = await this.getTableFields(table);
    if (!columns.length) {
      this.warn(`表 ${table} 无可用业务字段，将仅生成最小 CRUD 骨架`);
    }
    const componentPath = pageType === 'jh-component' ? filename : undefined;
    const componentName = pageName
      || (componentPath && String(componentPath).split('/').filter(Boolean).pop())
      || pageId;
    return buildV7CrudContent({
      pageType,
      pageId,
      pageName: componentName,
      table,
      columns,
      componentPath,
    });
  }

  /**
   * V7 自定义 UI（不选表 → 默认 UI，pageContent 骨架）
   */
  getV7CustomContent({ pageId, pageName, pageType, filename }) {
    const componentPath = pageType === 'jh-component' ? filename : undefined;
    const componentName = pageName
      || (componentPath && String(componentPath).split('/').filter(Boolean).pop())
      || pageId
      || '组件';
    return buildV7CustomContent({
      pageType,
      pageId,
      pageName: componentName,
      componentPath,
    });
  }

  /**
   * @deprecated 旧版 v3 模板，已由 getV7CrudContent 替代
   */
  async getCrudContent({ table, pageId, pageType, fields, filename = '' }) {
    // 读取文件
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/template`;
    // 使用正则表达式替换占位符
    let templateFile = 'crud';
    if (pageType === 'jh-component') {
      templateFile = '1table-component/component';
    } else if (pageType === 'jh-mobile-page') {
      templateFile = 'mobile';
    }
    let listTemplate = fs.readFileSync(`${templatePath}/${templateFile}.js`, 'utf-8').toString();
    // 为了方便 ide 渲染，在模板里面约定 //===// 为无意义标示
    listTemplate = listTemplate.replace(/\/\/===\/\//g, '');
    // 生成 vue
    nunjucks.configure(`${templatePath}/crud.html.njk`, {
      tags: {
        blockStart: '<=%',
        blockEnd: '%=>',
        variableStart: '<=$',
        variableEnd: '$=>',
      },
    });
    const result = nunjucks.renderString(listTemplate, {
      pageType,
      pageId,
      pageName: pageId,
      table,
      tableCamelCase: _.camelCase(table),
      fields,
      propsStr: pageType === 'jh-component' ? 'props: {},' : '',
      // component 独有
      componentName: filename,
      actionIdPrefix: filename.split('/').pop(),
    });
    return result.replace(/^\/\* eslint-disable \*\/\n/, '');
  }

  getBasicContent({ pageId, pageType, tableStr = '', componentPath = '', resourceList = '[]', propsStr = '', pageContent = '[]', actionContent, style }) {
    return `const content = {
  pageType: "${pageType}", pageId: "${pageId}", pageName: "${pageId}页面", ${componentPath}
  resourceList: ${resourceList}, // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "${pageId}", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    { 
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      value: [
        { tag: "v-text-field", model: "serverSearchWhereLike.className", attrs: {prefix: '前缀'} },
      ], 
      searchBtn: true
    }
  ],
  pageContent: ${pageContent},
  ${actionContent},
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    ${propsStr}
    data: {
      constantObj: {},
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
    computed: {
      tableDataComputed() {
        if(this.filterMap) {
          return this.tableData.filter(row => {
            for (const key in this.filterMap) {
              if (this.filterMap[key] && row[key] !== this.filterMap[key]) {
                return false;
              }
            }
            return true;
          });
        } else {
          return this.tableData;
        }
      },
    },
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {}
  },
  ${style}
};

module.exports = content;
`;
  }
  customStringify(obj, pageId, table, filename) {
    for (const item of obj) {
      for (const key in item) {
        if (key === 'resourceHook' || key === 'resourceData') {
          if (Object.keys(item[key]).length === 0) {
            delete item[key];
          }
        }
      }
    }
    return JSON.stringify(obj, (key, value) => {
      if (key === 'resourceHook' || key === 'resourceData') {
        // 如果是 resourceHook 或 resourceData，则将其内容压缩成单行
        if (Object.keys(value).length === 0) {
          return {}; // 空对象
        } else {
          // 将内部的 key-value 对象格式化为单行
          const formattedEntries = Object.entries(value)
            .map(([ k, v ]) => `${k}: ${JSON.stringify(v)}`) // 使用 JSON.stringify 保持字符串引号
            .join(', ');
          return `{ ${formattedEntries} }`; // 保持花括号

        }
      }
      return value;
    }, 2)
      // 进行模板替换
      .replace(/\{\{pageId}}/g, pageId)
      .replace(/\{\{table}}/g, table)
      .replace(/\{\{filename}}/g, filename.split('/').pop())
      .replace(/"([^"]+)":/g, '$1:') // 移除属性名的引号
      .replace(/\\/g, '') // 移除属性名的引号
      .replace(/"{/g, '{') // 移除被 JSON.stringify 添加的引号
      .replace(/}"/g, '}')
      .replace(/\n/g, '\n  '); // 移除结尾的引号
  }

  getBasicMobileContent({ pageId, pageType, tableStr = '', componentPath = '', resourceList = '[]', propsStr = '', pageContent = '[]', actionContent, style }) {
    return `const content = {
  pageType: "${pageType}", pageId: "mobile/${pageId}", pageName: "${pageId}页面", template: "jhMobileTemplateV4", ${componentPath}
  resourceList: ${resourceList}, // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "${pageId}", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },

    { 
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      searchList: [
        { tag: "v-text-field", model: "serverSearchWhereLike.className", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '前缀'} },
      ], 
    },
    { tag: 'v-spacer'},
    { tag: 'jh-mode', title: '简单模式', icon: 'mdi-view-carousel-outline', model: 'viewMode', items: 'constantObj.viewModeList' },
  ],
  pageContent: ${pageContent},
  ${actionContent},
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    ${propsStr}
    data: {
      constantObj: {
        viewModeList: [
          { text: "简洁模式", value: "simple" },
          { text: "详细模式", value: "detail" }
        ]
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件
      tableDataOrder: [
        {
          column: "operationAt",
          order: "desc"
        }
      ],
      tableDataOrderList: [
        { text: "更新时间↓", value: [
          {
            column: "operationAt",
            order: "desc"
          },
        ] },
        { text: "更新时间↑", value: [
          {
            column: "operationAt",
            order: "asc"
          },
        ] },
      ],
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
    computed: {
      tableDataComputed() {
        if(this.filterMap) {
          return this.tableData.filter(row => {
            for (const key in this.filterMap) {
              if (this.filterMap[key] && row[key] !== this.filterMap[key]) {
                return false;
              }
            }
            return true;
          });
        } else {
          return this.tableData;
        }
      },
    },
    async created() {
      await this.doUiAction('getTableData');
    },
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {}
  },
  ${style}
};

module.exports = content;
`;

  }

  getChartData(chartType) {
    switch (chartType) {
      case 'line':
        return {
          lineChartOption: {
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
      case 'saleData':
        return {
          saleData: [
            {
              label: '新增客户',
              number: 2,
              unit: '人',
              rate: '100%',
              status: 'up',
              chartOption: {
                color: [ '#5470C6' ],
                data: [ 0, 2, 5, 9, 5, 10, 3 ],
              },
            },
            {
              label: '新增联系人',
              number: 2,
              unit: '人',
              rate: '100%',
              status: 'up',
              chartOption: {
                color: [ '#5470C6' ],
                data: [ 0, 2, 5, 9, 5, 10, 3 ],
              },
            },
            {
              label: '新增商机',
              number: 2,
              unit: '个',
              rate: '-20%',
              status: 'down',
              chartOption: {
                color: [ '#5470C6' ],
                data: [ 0, 2, 5, 9, 5, 10, 3 ],
              },
            },
            {
              label: '新增合同',
              number: 2,
              unit: '个',
              rate: '100%',
              status: 'up',
              chartOption: {
                color: [ '#5470C6' ],
                data: [ 0, 2, 5, 9, 5, 10, 3 ],
              },
            },
          ],
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
    let includeList = [];
    if ([ 'line', 'pie', 'bar', 'gauge' ].includes(chartType)) {
      pageContent = `tag: "v-chart",
    attrs: {
      ':option': '${chartType}ChartOption',
      style: 'height: 300px;',
      autoresize: true,
      ref: '${chartType}Chart',
    },
    value: ''`;
      includeList = [
        '<script src="/<$ ctx.app.config.appId $>/public/lib/echarts.min.js"></script>',
        '<script src="/<$ ctx.app.config.appId $>/public/lib/vue-echarts.min.js"></script>',
      ];
    } else if (chartType === 'saleData') {
      includeList = [];
      pageContent = `
    tag: "v-card",
    attrs: {
      class: 'rounded-lg jh-dashboard-card',
    },
    value: [
      { tag: 'div', attrs: { class: 'd-flex align-center py-4' }, value: '<div class="font-weight-medium text-subtitle-2">销售简报</div>' },
      { tag: 'div', attrs: { class: 'pb-4' }, value: \`
      <v-row dense>
        <v-col cols="12" xs="12" sm="12" md="3"
          v-for="(item, index) in saleData"  
          :key="index"
          >
          <v-card class="rounded-lg pa-4" outlined role="button">
            <v-row dense align="center">
              <v-col cols="12" xs="12" sm="12" md="6">
                <div>{{item.label}}</div>
                <div class="mt-2"><span class="font-weight-bold text-subtitle-2 mr-1">{{item.number}}</span>{{item.unit}}</div>
                <div class="d-flex align-center mt-2">
                  <div class="mr-2">较上月</div>
                  <div class="mr-2" :class="item.status === 'up' ? 'red--text' : 'success--text'">{{item.rate}}</div>
                  <div>
                    <v-icon v-if="item.status === 'up'" size="18" color="red">mdi-arrow-up-bold</v-icon>
                    <v-icon v-if="item.status === 'down'" size="18" color="green">mdi-arrow-down-bold</v-icon>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" xs="12" sm="12" md="6">
                <v-sparkline
                  :gradient="item.chartOption.color"
                  line-width="2"
                  padding="8"
                  smooth="10"
                  :value="item.chartOption.data"
                  auto-draw
                ></v-sparkline>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row> 
      \` },
    ]`;

    }
    const content = `
const content = {
  pageType: "${pageType}", ${pageIdStr}pageName: "${chartType}图表", componentPath: "${pageId || 'chart/' + chartType}Chart",
  resourceList: [], // 额外resource { actionId, resourceType, resourceData }
  pageContent: {
    ${pageContent}
  },
  includeList: [
    ${includeList.map(item => `'${item}'`).join(',\n    ')}
  ], // 其他资源引入
  common: {
    data: ${JSON.stringify(this.getChartData(chartType), null, 2).replace(/"([^"]+)":/g, '$1:').replace(/\n/g, '\n    ')},
  },
};

module.exports = content;
    `;
    return content;
  }

  checkStaticChartFile() {
    const chartDir = './app/public/lib';
    fs.mkdirSync(chartDir, { recursive: true });
    const echartsFile = `${chartDir}/echarts.min.js`;
    const vueEchartsFile = `${chartDir}/vue-echarts.min.js`;

    if (!fs.existsSync(echartsFile)) {
      fs.copyFileSync(`${path.join(__dirname, '../../')}page-template-json/jh-component/echarts.min.js`, echartsFile);
    }
    if (!fs.existsSync(vueEchartsFile)) {
      fs.copyFileSync(`${path.join(__dirname, '../../')}page-template-json/jh-component/vue-echarts.min.js`, vueEchartsFile);
    }
  }

  // eslint-disable-next-line valid-jsdoc
  /**
   * 获取数据库表所有原生字段
   * @param {String} table
   * @returns
   */
  async getTableFields(table) {
    const knex = await this.getKnex();
    const result = await knex.select('COLUMN_NAME', 'COLUMN_COMMENT', 'DATA_TYPE').from('INFORMATION_SCHEMA.COLUMNS').where({
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
    }).map(column => ({
      COLUMN_NAME: column.COLUMN_NAME,
      COLUMN_COMMENT: (column.COLUMN_COMMENT || column.COLUMN_NAME || '').split(';')[0].split('；')[0].split(':')[0],
      DATA_TYPE: column.DATA_TYPE,
    }));
  }

  async example(cwd, argv) {
    this.cwd = cwd;
    this.argv = argv;
    // 初始化数据库连接
    this.dbSetting = await this.readDbConfigFromFile();
    // app 默认使用 database，如果有前缀则需要去掉前缀
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);

    const examplePath = `${path.join(__dirname, '../../')}page-template-json/example`;
    const examplePageFilePath = examplePath + '/class.js';
    const exampleComponentFilePath = examplePath + '/studentOfClass.js';
    // 检测创建文件夹
    fs.mkdirSync('./app/view/init-json/page', { recursive: true });
    fs.mkdirSync('./app/view/init-json/component', { recursive: true });
    // 把样例文件复制到项目中
    fs.copyFileSync(examplePageFilePath, './app/view/init-json/page/exampleClass.js');
    fs.copyFileSync(exampleComponentFilePath, './app/view/init-json/component/exampleStudentOfClass.js');
    this.success('生成 init-json 样例文件成功');

    // sql 文件
    const sqlFilePath = examplePath + '/crud.sql';
    // knex 运行 sql 文件

    const knex = await this.getKnex();
    const sqlContentList = fs.readFileSync(sqlFilePath).toString().replace(/--.*|\n|\\/g, '')
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

  async getAllChartContent() {
    const examplePath = `${path.join(__dirname, '../../')}page-template-json/example-chart`;
    const fileList = [
      { file: 'lineChart', path: 'component/exampleChart', checkPath: true },
      { file: 'pieChart', path: 'component/exampleChart' },
      { file: 'barChart', path: 'component/exampleChart' },
      { file: 'gaugeChart', path: 'component/exampleChart' },
      { file: 'saleDataChart', path: 'component/exampleChart' },
      { file: 'exampleChartPage', path: 'page' },
    ];

    // 检测创建文件夹
    fs.mkdirSync('./app/view/init-json/page', { recursive: true });
    fs.mkdirSync('./app/view/init-json/component', { recursive: true });
    // 把样例文件复制到项目中
    for (const fileItem of fileList) {
      if (fileItem.checkPath) {
        const pathArr = fileItem.path.split('/');
        // 判断目录不存在就创建
        let dir = './app/view/init-json';
        for (const pathItem of pathArr) {
          dir += '/' + pathItem;
          fs.mkdirSync(dir, { recursive: true });
        }
      }
      fs.copyFileSync(`${examplePath}/${fileItem.file}.js`, `./app/view/init-json/${fileItem.path}/${fileItem.file}.js`);
    }
    // sql 文件
    const sqlFilePath = 'example-chart/check_page.sql';
    await this.executeSql(sqlFilePath, { pageId: 'exampleChartPage', pageName: '图表样例' });
  }

  async executeSql(sqlFile, obj) {
    const knex = await this.getKnex();
    let label = '';
    const sqlFilename = sqlFile.split('/').pop();
    if (sqlFilename.startsWith('clear_')) {
      label = '正在执行删除';
    } else if (sqlFilename.startsWith('init_')) {
      label = '正在执行插入/更新';
    } else if (sqlFilename.startsWith('check_')) {
      label = '正在执行检查';
    }
    const templatePath = `${path.join(__dirname, '../../')}page-template-json`;
    let sqlContent = fs.readFileSync(`${templatePath}/${sqlFile.replace(/\.sql$/, '') + '.sql'}`).toString();
    for (const key in obj) {
      sqlContent = sqlContent.replace(new RegExp(`{{${key}}}`, 'g'), obj[key]);
    }
    const sqlList = sqlContent.split('\n');
    for (const line of sqlList) {
      if (!line) continue;
      if (line.startsWith('--')) {
        this.info(`${label} ${line}`);
      } else {
        await knex.raw(line);
      }
    }
  }

};
