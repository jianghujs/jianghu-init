
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

// 1table-page / 1table-component 共用方法
const mixin = {
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
    nunjucksEnv.addFilter('typeof', function(str) {
      console.log(str)
      console.log(typeof str)
      return typeof str;
    });
    const tagAttr = (key, value, tag = '') => {
      // vuetify 的缩略标签
      const preList = ['x-small', 'small', 'medium', 'large', 'x-large', 'disabled', 'readonly', 'active', 'fixed', 'absolute', 'top', 'bottom', 'left', 'right', 'tile', 'content', 'inset']
      if (tag.startsWith('v-') && preList.includes(key) && value === true) {
        return `${key}`;
      } else if (!_.isString(value) && !key.startsWith(':') && !key.startsWith('@')) {
        return `:${key}="${value.toString()}"`;
      }

      return `${key}="${value.toString().replace(/"/g, '\'')}"`;
    };
    nunjucksEnv.addFilter('tagAttr', function(key, value, tag) {
      return tagAttr(key, value, tag);
    });

    nunjucksEnv.addFilter('tagFormat', function(result) {
      let tag = [];
      const tagItemFormat = (res) => {
        let tagStr = `<${res.tag} `;
        tagStr += _.map(res.attrs, (value, key) => {
          return tagAttr(key, value, res.tag);
        }).join(' ');
        if (res.value) {
          tagStr += `>${res.value}</${res.tag}>`;
        } else {
          tagStr += `></${res.tag}>`;
        }
        return tagStr;
      }
      if (_.isArray(result)) {
        result.forEach(res => {
          tag.push(tagItemFormat(res))
        });
      } else if (_.isObject(result)) {
        tag.push(tagItemFormat(result))
      } else if (_.isString(result)) {
        tag.push(result);
      }
      return tag.join('\n                    ');
    });
    nunjucksEnv.addFilter('removeKey', function(data, keyList) {
      if (_.isArray(data)) {
        return _.map(data, function(item) {
          return _.omit(item, keyList);
        });
      } else if (_.isObject(data)) {
        if (!data) return data;
        return _.omit(data, keyList);
      }
      return data;
    });
    nunjucksEnv.addFilter('ucfirst', function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    });
    nunjucksEnv.addFilter('lcfirst', function(str) {
      return str.charAt(0).toLowerCase() + str.slice(1);
    });
    return nunjucksEnv;
  },

  async handleOtherResource(jsonConfig) {
    const { resourceList, pageId } = jsonConfig;
    if (!resourceList) return;
    const knex = await this.getKnex();
    for (const {actionId, resourceType, desc, resourceData, resourceHook = null } of resourceList) {
      // pageId + actionId 删除后新增
      await knex('_resource').where({ pageId, actionId }).delete();
      await knex('_resource').insert({ pageId, actionId, desc, resourceType, resourceData: JSON.stringify(resourceData), resourceHook });
    }
  },

  handleJsonConfig(jsonConfig) {
    const { pageContent, createDrawerContent } = jsonConfig;
    if (createDrawerContent) {
      const idGenerate = createDrawerContent.formItemList.find(e => !!e.idGenerate)?.idGenerate;
      jsonConfig.idGenerate = idGenerate;
    }
    // ... do something
    
  },

  async handleOtherResource(jsonConfig) {
    const { resourceList, pageId } = jsonConfig;
    if (!resourceList) return;
    const knex = await this.getKnex();
    for (const {actionId, resourceType, desc, resourceData, resourceHook = null } of resourceList) {
      // pageId + actionId 删除后新增
      await knex('_resource').where({ pageId, actionId }).delete();
      await knex('_resource').insert({ pageId, actionId, desc, resourceType, resourceData: JSON.stringify(resourceData), resourceHook });
    }
  },

  getUpdateDrawerComponentList(jsonConfig) {
    const { table, pageId, updateDrawerContent, drawerList = [] } = jsonConfig;
    const componentList = [];
    const componentMap = {
      'recordHistory': {filename: 'tableRecordHistory', ctx: { table: `'${table}'`, pageId: `'${pageId}'`}, sqlMap: { table, pageId }},
      'tableRecordHistory': {filename: 'tableRecordHistory', ctx: { table: `'${table}'`, pageId: `'${pageId}'`}, sqlMap: { table, pageId }},
    };

    const processContentList = (contentList) => {
      contentList.forEach(item => {
        if (item.type == 'component') {
          if (componentMap[item.componentPath]) {
            const { filename, ctx, sqlMap } = componentMap[item.componentPath];
            item.componentPath = filename;
            if (!item.ctx) {
              item.ctx = ctx;
            }
            _.forEach(item.ctx, (value, key) => {
              item.ctx[key] = value.replace(/"/g, '\'');
            });
            item.sqlMap = sqlMap;
          } else {
            const ctx = {}
            if (_.isArray(item.ctx)) {
              item.ctx.forEach(ctxItem => {
                if (_.isString(ctxItem)) {
                  ctx[ctxItem] = `updateItem.${ctxItem}`;
                }
              })
            }
            item.ctx = ctx;
            item.componentPath = item.componentPath;
          }
          componentList.push(item);
        }
      });
    }

    if (updateDrawerContent && updateDrawerContent.contentList) {
      processContentList(updateDrawerContent.contentList);
    }

    drawerList.forEach(drawer => {
      processContentList(drawer.contentList);
    })

    return _.uniqBy(componentList, 'componentPath');
  },

  /**
   * 获取数据库表所有原生字段
   * @param {String} table
   * @returns
   */
  async getTableFields(jsonConfig) {
    const knex = await this.getKnex();
    const result = await knex.select('COLUMN_NAME', 'COLUMN_COMMENT').from('INFORMATION_SCHEMA.COLUMNS').where({
      TABLE_SCHEMA: this.dbSetting.database,
      TABLE_NAME: table,
    });
    await this.initTableFields(jsonConfig);

    const columns = result.map(column => {
      return {
        COLUMN_NAME: column.COLUMN_NAME,
        COLUMN_COMMENT: (column.COLUMN_COMMENT || column.COLUMN_NAME || '').split(';')[0].split('；')[0].split(':')[0],
      };
    });

    return columns;
  },

  /**
   * 初始化table依赖字段，检测依赖字段是否存在，不存在则创建
   * @param {*} jsonConfig 
   */
  async checkTableFields(table, idGenerate) {
    const knex = await this.getKnex();
    const columnList = await knex(table).columnInfo();

    const defaultColumn = [ 'operation', 'operationByUserId', 'operationByUser', 'operationAt' ];
    if (idGenerate) defaultColumn.push('idSequence');
    for (const column of defaultColumn) {
      if (!columnList[column]) {
        return knex.schema.table(table, t => {
          this.info(`创建依赖字段：${column}`);
          // idSequence 列则在 id 后添加
          if (column == 'idSequence') {
            t.integer(column).after('id');
          } else {
            t.string(column);
          }
        });
      }
    }
  },

  async modifyComponentResource(jsonConfig) {
    const knex = await this.getKnex();
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/component`;
    const componentList = this.getUpdateDrawerComponentList(jsonConfig);

    // 循环 componentList 运行 sql
    for (const component of componentList) {
      if (component.type == 'component' && component.componentPath != 'tableRecordHistory') continue;
      let resourceSql = fs.readFileSync(`${templatePath}/${component.componentPath}.sql`).toString();
      _.forEach(component.sqlMap, (value, key) => {
        if (!value) return
        resourceSql = resourceSql.replace(new RegExp(`\{\{${key}\}\}`, 'g'), value);
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

  },

  async renderComonentVue(jsonConfig) {
    const componentList = this.getUpdateDrawerComponentList(jsonConfig);
    if (!componentList.length) return;

    const componentPath = `${path.join(__dirname, '../../')}page-template-json/component`;
    if (componentList.length) {
      if (!fs.existsSync(`./app/view/component`)) fs.mkdirSync(`./app/view/component`);
    }

    for( const item of componentList) {
      if (['tableRecordHistory'].includes(item.componentPath)) {
        let componentHtml = fs.readFileSync(componentPath + '/' + item.componentPath + '.html')
          .toString()
          .replace(/\/\/===\/\/ /g, '')
          .replace(/\/\/===\/\//g, '');
  
        fs.writeFileSync(`./app/view/component/${item.componentPath}.html`, componentHtml);
      }
    }
  },

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
module.exports = mixin;