
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
      if (!obj) return '';
      const testKey = [];
      let content = JSON.stringify(obj, function(key, value) {
          if (typeof value === 'function') {
            let valStr = value.toString();
            // 匹配 String Object 等函数原样输出
            const reg = /function ([A-Z][a-z]+)\(\) \{ \[native code\] \}/;
            if (reg.test(valStr)) {
              valStr = valStr.replace(reg, '$1');
            }
            if(key && valStr.startsWith(key)) {
              valStr = 'replace_this_key' + valStr;
              testKey.push(key);
            }
            return `__FUNC_START__${valStr}__FUNC_END__`;
          }
          return value;
      }, 2)
          .replace(/"__FUNC_START__/g, '').replace(/__FUNC_END__"/g, '')
          .replace(/\\r\\n|\\r|\\n {4}/g, '\n')
          .replace(/\\/g, '')
          .replace(/\n/g, '\n    ');
      testKey.forEach(key => {
        content = content.replace(new RegExp(`"${key}":\\s*?replace_this_key`, 'g'), '');
      })
      
      // 匿名同步格式
      if (k && (/^function\s*?\(/.test(content) || /^\(/.test(content))) {
        content = k + ': ' + content;
      }
      // 匿名异步格式
      if (k && (/^async\s+function\s*?\(/.test(content) || /^async\s+\(/.test(content))) {
        content = k + ': ' + content;
      }
      if (typeof obj == 'function') {
        content = content.replace(/   /g, ' ');
      }
      if (typeof obj == 'object' && k) {
        content = `"${k}": ` + content;
      }
      return content.replace(/"(\w+)":/g, '$1:');
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
    nunjucksEnv.addFilter('isArray', function(val) {
      return _.isArray(val);
    });
    nunjucksEnv.addFilter('isObject', function(val) {
      return _.isObject(val);
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
      'recordHistory': {filename: 'tableRecordHistory', bind: { table: `'${table}'`, pageId: `'${pageId}'`}, sqlMap: { table, pageId }},
      'tableRecordHistory': {filename: 'tableRecordHistory', bind: { table: `'${table}'`, pageId: `'${pageId}'`}, sqlMap: { table, pageId }},
    };

    const processContentList = (contentList, itemKey = 'updateItem') => {
      contentList.forEach(item => {
        if (item.type == 'component') {
          if (componentMap[item.componentPath]) {
            const { filename, bind, sqlMap } = componentMap[item.componentPath];
            item.componentPath = filename;
            if (!item.bind) {
              item.bind = bind;
            }
            _.forEach(item.bind, (value, key) => {
              item.bind[key] = value.replace(/"/g, '\'');
            });
            item.sqlMap = sqlMap;
          } else {
            const bind = {}
            if (_.isArray(item.bind)) {
              item.bind.forEach(bindItem => {
                if (_.isString(bindItem)) {
                  bind[bindItem] = `${itemKey}.${bindItem}`;
                }
              })
            }
            item.bind = bind;
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
      processContentList(drawer.contentList, drawer.key);
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
  // 批量添加组件 resource --- 废弃
  async modifyComponentResource(jsonConfig) {
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/component`;
    const componentList = this.getUpdateDrawerComponentList(jsonConfig);

    // 循环 componentList 运行 sql
    for (const component of componentList) {
      await this.modifyComponentResourceItem(templatePath, component);
    }
  },

  async modifyComponentResourceItem(templatePath, component) {
    const knex = await this.getKnex();
    if (component.type == 'component' && component.componentPath != 'tableRecordHistory') return;
    let resourceSql = fs.readFileSync(`${templatePath}/${component.componentPath}.sql`).toString();
    _.forEach(component.sqlMap, (value, key) => {
      if (!value) return
      resourceSql = resourceSql.replace(new RegExp(`\{\{${key}\}\}`, 'g'), value);
    });
    
    // 插入数据
    for (const line of resourceSql.split('\n')) {
      if (!line) continue;
      if (line.startsWith('--')) {
        this.info(`正在执行 ${component.componentPath} ${line}`);
      } else {
        await knex.raw(line);
      }
    }
  },

  async renderComonent(jsonConfig) {
    const componentList = this.getUpdateDrawerComponentList(jsonConfig);
    if (!componentList.length) return;

    const componentPath = `${path.join(__dirname, '../../')}page-template-json/component`;
    if (componentList.length) {
      if (!fs.existsSync(`./app/view/component`)) fs.mkdirSync(`./app/view/component`);
    }

    for( const item of componentList) {
      // 检查文件存在则提示是否覆盖
      const targetFilePath = `./app/view/component/${item.componentPath}.html`;
      if (fs.existsSync(targetFilePath)) {
        const overwrite = await this.readlineMethod(`组件 ${item.componentPath} 已经存在，是否覆盖?(y/N)`, 'n');
        if (overwrite !== 'y' && overwrite !== 'Y') {
          this.warning(`跳过 ${item.componentPath} 组件的生成`);
          continue;
        }
      }
      if (['tableRecordHistory'].includes(item.componentPath)) {
        this.info(`开始生成 ${item.componentPath} 组件`);
        let componentHtml = fs.readFileSync(componentPath + '/' + item.componentPath + '.html')
          .toString()
          .replace(/\/\/===\/\/ /g, '')
          .replace(/\/\/===\/\//g, '');
  
        fs.writeFileSync(targetFilePath, componentHtml);
        await this.modifyComponentResourceItem(componentPath, item);
      }
    }
  },

  /**
   * 生成 service
   */
  async renderService(jsonConfig) {
    const { idGenerate = false } = jsonConfig;
    if (idGenerate) {
      // idGenerate 依赖 common service
      const templatePath = `${path.join(__dirname, '../../')}page-template-json/service`;
      const templateTargetPath = `${templatePath}/common.js`;
      
      const servicePath = `./app/service`;
      if (!fs.existsSync(servicePath)) fs.mkdirSync(servicePath);
  
      // 检查 service 是否存在
      const serviceFilePath = `${servicePath}/common.js`;
      if (fs.existsSync(serviceFilePath)) {
        const overwrite = await this.readlineMethod(`common service 已经存在，是否覆盖?(y/N)`, 'n');
        if (overwrite !== 'y' && overwrite !== 'Y') {
          this.warning(`跳过 common service 的生成`);
          return false;
        }
      }
      this.info(`开始生成 common service`);
      fs.copyFileSync(templateTargetPath, serviceFilePath);
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