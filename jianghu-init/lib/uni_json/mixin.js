'use strict';
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');

// 将 fs.readFile 转换为返回 Promise 的函数
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const checkClick = (obj, action) => {
  // /doUiAction\(['"]action['"]/
  if (!obj || !action) return false;
  const reg = new RegExp(`doUiAction\\(['"]${action || ''}['"]`);
  return obj && obj.attrs && obj.attrs['@click'] && reg.test(obj.attrs['@click']);
};

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
    nunjucksEnv.addFilter('objToVar', function(obj, key, spaceCount = 4) {
      if (!obj) { obj = {}; }
      let spaceStr = '';
      for (let i = 0; i < spaceCount; i++) { spaceStr += ' '; }
      const objStr = JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/\n/g, `\n${spaceStr}`);
      return `${key}: ${objStr}`;
    });
    nunjucksEnv.addFilter('listToVar', function(arr, key, spaceCount = 4) {
      if (!arr) { return `${key}: []`; }
      let spaceStr = '';
      for (let i = 0; i < spaceCount; i++) { spaceStr += ' '; }
      const arrayStr = `[\n${arr.map(item => '  ' + spaceStr + JSON.stringify(item).replace(/"([^"]+)":/g, '$1: ').replace(/width:\s*['"`](.*?)['"`]/g, (match, group1) => `width:${group1}`)
        .replace(/\{/g, '\{ ')
        .replace(/}/g, ' }')
        .replace(/,/g, ', ') + ',\n').join('')}${spaceStr}]`;
      return `${key}: ${arrayStr}`;
    });
    // 复杂变量包含函数或函数原样渲染
    nunjucksEnv.addFilter('variableToVar', function(obj, k, indent = 2) {
      if (_.isUndefined(obj)) return '';
      const testKey = [];
      let content;
      if (!_.isBoolean(obj) && !_.isString(obj)) {
        content = JSON.stringify(obj, function(key, value) {
          if (typeof value === 'function') {
            let valStr = value.toString();
            // 匹配 String Object 等函数原样输出
            const reg = /function ([A-Z][a-z]+)\(\) \{ \[native code\] \}/;
            if (reg.test(valStr)) {
              valStr = valStr.replace(reg, '$1');
            }
            if (key && valStr.startsWith(key)) {
              valStr = 'replace_this_key' + valStr;
              testKey.push(key);
            }
            // if (!key && valStr.includes('=>')) {
            //   const params = valStr.substring(0, valStr.indexOf('=>')).trim();
            //   const funcBody = valStr.substring(valStr.indexOf('=>') + 2).trim();
            //   if (params.startsWith('(')) {
            //     valStr = value.name + `${params} ` + funcBody;
            //   } else {
            //     valStr = value.name + `(${params}) ` + funcBody;
            //   }
            // }
            return `__FUNC_START__${valStr}__FUNC_END__`;
          }
          return value;
        }, 2)
          .replace(/"__FUNC_START__/g, '').replace(/__FUNC_END__"/g, '')
          .replace(/\\t/g, '  ')
          .replace(/\\r\\n/g, '\n')
          .replace(/\\n {4}/g, '\n')
          .replace(/\\n/g, '\n')
          .replace(/\\(?!n)/g, '')
          .replace(/\n/g, '\n' + ' '.repeat(indent));
      } else {
        content = obj;
      }
      testKey.forEach(key => {
        content = content.replace(new RegExp(`"${key}":\\s*?replace_this_key`, 'g'), '');
      });
      if (k) {
        // 匿名同步格式
        if (/^function\s*?\(/.test(content) || /^\(/.test(content)) {
          content = k + ': ' + content;
        }
        // 匿名异步格式
        if ((/^async\s+function\s*?\(/.test(content) || /^async\s+\(/.test(content))) {
          content = k + ': ' + content;
        }
        if (typeof obj === 'object') {
          content = k + ': ' + content;
        }
        if (_.isBoolean(obj)) {
          content = k + ': ' + content;
        }
        if (_.isString(obj)) {
          content = k + ': \'' + content.replace(/"/g, '\'') + '\''; // 字符串需要加引号
        }
        if (_.isNumber(obj)) {
          content = k + ': ' + content; // 字符串需要加引号
        }
      }
      content = content.replace(/'__FUN__\(/gm, '').replace(/\)__FUN__'/gm, '');
      return content.replace(/"(\w+)":/g, '$1:');
    });

    nunjucksEnv.addFilter('stringToVar', function(obj) {
      if (!_.isString(obj)) return '';
      return obj.substring(1, obj.length - 1);
    });
    nunjucksEnv.addFilter('expressionToVar', function(obj, k) {
      if (!_.isString(obj)) return '';
      const str = k + ': ' + obj.replace(/"/g, '\'');
      return str.replace(/"(\w+)":/, '$1:');
    });
    nunjucksEnv.addFilter('camelToKebab', function(obj) {
      return obj.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '\$1-\$2').toLowerCase();
    });
    nunjucksEnv.addFilter('typeof', function(str) {
      return typeof str;
    });
    const tagAttr = (key, value, tag = '') => {
      // vuetify 的缩略标签
      const preList = [ 'x-small', 'small', 'medium', 'large', 'x-large', 'disabled', 'readonly', 'active', 'fixed', 'absolute', 'top', 'bottom', 'left', 'right', 'tile', 'content', 'inset', 'dense', 'single-line', 'filled', 'v-else' ];
      if (tag.startsWith('v-') && (preList.includes(key) || preList.includes(key.replace(':', ''))) && value === true) {
        return `${key}`.replace(/:/g, '');
      } else if (key === 'rules') {
        return `:${key}="${Array.isArray(value) ? JSON.stringify(value).replace(/"/g, '') : value}"`;
      } else if (!_.isString(value) && !key.startsWith(':') && !key.startsWith('@')) {
        if (key === 'v-else') {
          return `${key}`;
        }
        return `:${key}="${value.toString()}"`;
      }

      return `${key}="${value.toString().replace(/"/g, '\'')}"`;
    };
    nunjucksEnv.addFilter('includes', function(arr, val) {
      return arr.includes(val);
    });
    nunjucksEnv.addFilter('tagAttr', function(key, value, tag) {
      return tagAttr(key, value, tag);
    });
    const tagItemFormat = (item, indent = 0) => {
      if (!item) {
        return '';
      }
      if (typeof item === 'string') {
        return ' '.repeat(indent + 2) + item;
      }
      if (!item.tag) {
        return '';
      }
      const tag = item.tag;
      const attrs = Object.entries(item.attrs || {})
        .map(([ key, value ]) => tagAttr(key, value, tag))
        .join(' ');

      let value = '';
      if (typeof item.value === 'string') {
        value = ' '.repeat(indent + 2) + item.value;
      } else if (Array.isArray(item.value)) {
        if (!item.value.length) {
          value = '';
        } else if (item.value.length === 1 && typeof item.value[0] === 'string') {
          value = ' '.repeat(indent + 2) + item.value[0];
        } else {
          value = item.value.map(subItem => tagItemFormat(subItem, indent + 2)).join('\n');
        }
      } else if (typeof item.value === 'object') {
        value = tagItemFormat(item.value, indent + 2);
      }

      const indentSpaces = ' '.repeat(indent);
      const lineBreak = value ? '\n' : '';
      return `${indentSpaces}<${tag} ${attrs}>${lineBreak}${value}${lineBreak}${value ? indentSpaces : ''}</${tag}>`;
    };
    const tagFormat = (result, indent = 0) => {
      const tag = [];
      if (_.isArray(result)) {
        result.forEach(res => {
          tag.push(tagItemFormat(res, indent).replace(/^\s+/, ''));
        });
      } else if (_.isObject(result)) {
        tag.push(tagItemFormat(result, indent).replace(/^\s+/, ''));
      } else {
        tag.push(result);
      }
      return tag.join('\n' + ' '.repeat(indent));
    }
    nunjucksEnv.addFilter('tagFormat', function(result, indent = 0) {
      // const tag = [];
      // if (_.isArray(result)) {
      //   result.forEach(res => {
      //     tag.push(tagItemFormat(res, indent).replace(/^\s+/, ''));
      //   });
      // } else if (_.isObject(result)) {
      //   tag.push(tagItemFormat(result, indent).replace(/^\s+/, ''));
      // } else {
      //   tag.push(result);
      // }
      // return tag.join('\n' + ' '.repeat(indent));
      return tagFormat(result, indent);
    });
    nunjucksEnv.addFilter('formItemFormat', function(result, drawerKey = 'updateItem') {
      const tag = [];
      const tagItemFormat = res => {
        if (!res.tag) {
          return '';
        }

        if (!res.attrs) res.attrs = {};
        // class="jh-v-input" dense single-line filled
        if (!res.attrs.class) res.attrs.class = 'jh-v-input';
        if (!res.attrs[':dense']) res.attrs[':dense'] = true;
        if (!res.attrs[':single-line']) res.attrs[':single-line'] = true;
        if (!res.attrs[':filled']) res.attrs[':filled'] = true;

        let tagStr = `<${res.tag} `;
        if (res.model) {
          res.attrs['v-model'] = res.model.includes('.') ? res.model : drawerKey + '.' + res.model;
        }
        if (res.rules) {
          res.attrs.rules = res.rules;
        }
        if (res.attrs[':items'] && !_.isString(res.attrs[':items'])) {
          if (_.isFunction(res.attrs[':items'])) {
            res.attrs[':items'] = res.attrs[':items'].toString().replace(/"/g, '\'');
          } else {
            res.attrs[':items'] = JSON.stringify(res.attrs[':items']);
          }
        }
        if (res.attrs.items) {
          if (_.isString(res.attrs.items)) {
            res.attrs[':items'] = res.attrs.items.replace(/"/g, '\'');
          } else if (_.isFunction(res.attrs.items)) {
            res.attrs[':items'] = res.attrs.items.toString().replace(/"/g, '\'');
          } else {
            res.attrs[':items'] = JSON.stringify(res.attrs.items);
          }
          delete res.attrs.items;
        }
        tagStr += _.map(res.attrs, (value, key) => {
          let val = value;
          if (key === 'v-model' && !value.includes('.')) {
            val = drawerKey + '.' + value;
          }
          return tagAttr(key, val, res.tag);
        }).join(' ');
        if (res.value) {
          tagStr += `>${res.value}</${res.tag}>`;
        } else {
          tagStr += `></${res.tag}>`;
        }
        return tagStr;
      };
      if (_.isArray(result)) {
        result.forEach(res => {
          tag.push(tagItemFormat(res));
        });
      } else if (_.isObject(result)) {
        tag.push(tagItemFormat(result));
      } else if (_.isString(result)) {
        tag.push(result);
      }
      return tag.join('\n                    ');
    });
    nunjucksEnv.addFilter('templateFormat', (result, indent = 0) => {
      const templatePath = `${path.join(__dirname, '../../')}page-template-uni-json/jh-template`;
      const targetPath = `${templatePath}/${result.template}.html`;

      try {
        let data = fs.readFileSync(targetPath, 'utf8'); 

        // 使用正则表达式匹配 <template> 标签之间的内容
        let matches = data.match(/<template>([\s\S]*?)<\/template>/);
        let templateData = matches ? matches[1] : '';
 
        // 使用正则表达式匹配 <= $ slot.xxx $ => 和 <= $ endSlot $ => 之间的内容，并替换为 slot.xxx
        templateData = templateData.replace(/<=\s*\$ slot\.(\w+) \$\s*=>[\s\S]*?<=\s*\$ endSlot \$\s*=>/g,  (match, p1) => {
          if (result.slot[p1]) {
            return tagFormat(result.slot[p1], indent)  || '';
          }else{
            return match;
          }
        });

        // 如果插槽没有自定义，显示默认的内容，删除占位符
        templateData = templateData.replace(/<=\s*\$ slot\.(\w+) \$\s*=>/g, '').replace(/<=\s*\$ endSlot \$\s*=>/g, '');

        // 使用正则表达式查找所有类似于 <=$ action.xxx $=> 的占位符
        templateData = templateData.replace(/<=\s*\$ action\.([^\$]*) \$\s*=>/g, (match, p1) => {
          return result.action ? result.action[p1] : '';
        });

        // 使用正则表达式查找所有类似于 <=$ param.xxx $=> 的占位符
        templateData = templateData.replace(/<=\s*\$ param\.([^\$]*) \$\s*=>/g, (match, p1) => {
          // data.xxx，输出'data'
          const key = p1.match(/^[^.]+/)[0];
          // data、data.title.xxx、data.name，输出''、.title.xxx、.name
          let endExpression = p1.match(/\.(.*?)(?:\s|$)/);
          endExpression = endExpression ? endExpression[0] : '';

          // 处理自定义key
          if(key === 'data'){
            // data、data.title.xxx、data.name，输出''、title、name
            const dataKey = p1.match(/\.(\w+)(?:\.|$|\s)/);
            const customKey = `${dataKey ? dataKey[1] : ''}Key`;
            if(result.param[customKey]){
              // data、data.title.xxx、data.name，输出''、.xxx、''
              endExpression = p1.match(/^[^.]*\.[^.]*\.(.*?)(?:\s|$)/);
              endExpression = endExpression ? endExpression[0].substring(endExpression[0].lastIndexOf('.')) : '';
              endExpression = `.${result.param[customKey]}${endExpression}`
            }
          }

          // 处理动态数据、静态数据
          let data = '';
          if(_.has(result.param, `:${key}`)){
            data = `${result.param[`:${key}`]}${endExpression}`;
          }else{
            data = _.isString(result.param[key]) ? result.param[key] : _.get(result.param, `${key}${endExpression}`) || '';
          }

          return data;
        });

        // 使用正则表达式查找所有类似于 <=$ dataPrefix $=> 的占位符
        templateData = templateData.replace(/<=\s*\$ dataPrefix \$\s*=>/g, _.has(result.param, ':data') ? ':' : '');

        return templateData;
      } catch (err) {
        console.error('read jh-template Error:', err);
        return '';
      }
    });
    nunjucksEnv.addFilter('templateStyle', (result, indent = 0) => {
      const templatePath = `${path.join(__dirname, '../../')}page-template-uni-json/jh-template`;
      const targetPath = `${templatePath}/${result.template}.html`;
      
      try {
        let data = fs.readFileSync(targetPath, 'utf8');   
        
        // 使用正则表达式匹配 <style> 标签之间的内容
        let matches = data.match(/<style>([\s\S]*?)<\/style>/);
        let styleData = matches ? matches[1] : '';

        return styleData;
      } catch (err) {
        console.error('read jh-template Error:', err);
        return '';
      }
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
    nunjucksEnv.addFilter('matchStr', function(str, regexStr) {
      if (!str) return '';
      const match = str.replace(/\n/, '\n').match(new RegExp(regexStr));
      return match && match.length > 1 ? match[1] : '';
    });
    nunjucksEnv.addFilter('componentName', function(path) {
      return path.split('/').pop().split('.')[0];
    });
    nunjucksEnv.addFilter('componentHumpName', function(path) {
      const componentName = path.split('/').pop().split('.')[0];
      return _.camelCase(componentName);
    });

    nunjucksEnv.addFilter('includeFormat', function(item) {
      if (!item) return '';
      if (_.isString(item)) return item; // 兼容原生代码
      return `import <=$ item.name $=> from '<=$ item.path $=>'`;
      // const { type, path } = item;
      // if ([ 'js', 'script' ].includes(type)) {
      //   return `<script src="${path}"></script>`;
      // } else if ([ 'css', 'style' ].includes(type)) {
      //   return `<link rel="stylesheet" href="${path}">`;
      // } else if ([ 'html', 'component', 'include' ].includes(type)) {
      //   return `{% include "${path}" %}`;
      // } else if (type === 'vueComponent') {
      //   return `Vue.component('${item.name}', ${item.component})`;
      // } else if (type === 'vueUse') {
      //   return `Vue.use(${item.component})`;
      // }
    });

    nunjucksEnv.addFilter('find', function(list, obj) {
      if (!list || !obj) return;
      return list.find(item => {
        return _.isMatch(item, obj);
      });
    });
    nunjucksEnv.addFilter('isString', function(item) {
      return _.isString(item);
    });
    return nunjucksEnv;
  },

  async checkPage(jsonConfig) {
    const { pageId, pageName } = jsonConfig;
    const knex = await this.getKnex();
    const existPage = await knex('_page').where({ pageId }).first();
    const pageData = {
      pageId,
      pageName,
    };
    if (existPage && existPage.pageName !== pageName) {
      console.log(`更新页面名称 ${existPage.pageName} => ${pageName}`);
      await knex('_page').where({ id: existPage.id }).update(pageData);
    } else if (!existPage) {
      console.log(`插入页面 ${pageName}`);
      await knex('_page').insert(pageData);
    }
  },

  async handleOtherResource(jsonConfig) {
    const { resourceList, pageId } = jsonConfig;
    if (!resourceList || !pageId) return;
    const knex = this.knex;
    const existResourceList = await knex('_resource').where({ pageId });
    for (const { actionId, resourceType, desc = null, resourceData, resourceHook = null } of resourceList) {
      const resourceDataStr = _.isObject(resourceData) ? JSON.stringify(resourceData) : resourceData;
      const resourceHookStr = _.isObject(resourceHook) ? JSON.stringify(resourceHook) : resourceHook;
      // 比对是否存在，存在则更新，不存在则插入
      // eslint-disable-next-line eqeqeq
      const resourceItem = existResourceList.find(e => e.actionId == actionId);
      if (resourceItem) {
        // 对比有差异再修改
        let isDiff = false;
        const updateData = { actionId, pageId, resourceType, desc, resourceData: resourceDataStr, resourceHook: resourceHookStr };
        _.forEach(updateData, (value, key) => {
          if ((value || null) !== (resourceItem[key] || null)) {
            isDiff = true;
            updateData[key] = updateData[key] || null;
          }
        });
        if (!isDiff) continue;
        await knex('_resource').where({ id: resourceItem.id }).update(updateData);
        continue;
      }
      await knex('_resource').insert({ pageId, actionId, desc, resourceType, resourceData: resourceDataStr, resourceHook: resourceHookStr });
    }
    // filter 数据库内有但是却没设置的 resource
    // const warningList = existResourceList.filter(e => !resourceList.some(r => r.actionId === e.actionId));
    // if (!warningList.length) return;
    // this.warning(`尚未配置 resource, 如不需要请手动数据库删除
    // ${warningList
    // .map(e => {
    //   const fieldList = [ 'actionId', 'desc', 'resourceType', 'resourceData' ];
    //   if (e.resourceHook) fieldList.unshift('resourceHook');
    //   e.resourceData = JSON.parse(e.resourceData);
    //   if (e.resourceHook) e.resourceHook = JSON.parse(e.resourceHook);
    //   return JSON.stringify(_.pick(e, fieldList))
    //     .replace(/\\"/g, '====')
    //     .replace(/"([^"]+)":/g, '$1:')
    //     .replace(/"/g, '\'')
    //     .replace(/====/g, '"');
    // })
    // .join(',\n    ')}`);
  },

  // 处理配置文件数据
  handleJsonConfig(jsonConfig) {
    let { actionContent, pageContent, headContent = [], common } = jsonConfig;
    /**
     * njk 快捷判断变量
     * {hasJhTable} - 是否有 jh-table
     * {hasCreateDrawer / hasCreateStart / hasCreateSubmit} - 是否有创建抽屉
     * {hasUpdateDrawer / hasUpdateStart / hasUpdateSubmit} - 是否有更新抽屉
     * {idGenerate} - 是否有业务id配置
     */
    if (!common.doUiAction) {
      common.doUiAction = [];
    }
    if (!actionContent) {
      jsonConfig.actionContent = [];
      actionContent = [];
    }
    if (!headContent) {
      jsonConfig.headContent = [];
      headContent = [];
    }
    if (!_.isArray(pageContent) && _.isObject(pageContent)) {
      jsonConfig.pageContent = [ pageContent ];
      pageContent = jsonConfig.pageContent;
    }
    const findJhTable = pageContent?.value?.find(e => [ 'jhTable', 'jh-table' ].includes(e.tag));
    if (findJhTable) {
      jsonConfig.hasJhTable = true;
      if (findJhTable.headActionList) {
        if (findJhTable.headActionList.some(e => checkClick(e, 'startCreateItem'))) {
          jsonConfig.hasCreateStart = true;
        }
      }

      if (findJhTable.rowActionList && findJhTable.rowActionList.length) {
        jsonConfig.hasUpdateStart = findJhTable.rowActionList.some(e => checkClick(e, 'startUpdateItem') || /doUiAction\(['"]startUpdateItem['"]/.test(e.click || ''));
        jsonConfig.hasDelete = findJhTable.rowActionList.some(e => checkClick(e, 'deleteItem') || /doUiAction\(['"]deleteItem['"]/.test(e.click || ''));
      }
    }
    const createDrawer = actionContent.find(e => e.tag === 'jh-create-drawer');
    if (createDrawer) {
      jsonConfig.hasCreateDrawer = createDrawer.contentList.length;
      const action = createDrawer.contentList.find(e => e.type === 'form' && e.action && (_.isObject(e.action) && checkClick(e.action, 'createItem')) || (_.isArray(e.action) && e.action.some(a => checkClick(a, 'createItem'))));
      if (action) {
        jsonConfig.createFormItemList = action.formItemList;
        jsonConfig.hasCreateSubmit = true;
      }
      const idGenerate = createDrawer.contentList.find(e => e.type === 'form' && e.formItemList.some(item => !!item.idGenerate));
      if (idGenerate) {
        jsonConfig.idGenerate = idGenerate.formItemList.find(item => !!item.idGenerate).idGenerate;
      }
    }
    const updateDrawer = actionContent.find(e => e.tag === 'jh-update-drawer');
    if (updateDrawer) {
      jsonConfig.hasUpdateDrawer = updateDrawer.contentList.length;
      const action = updateDrawer.contentList.find(e => e.type === 'form' && e.action && (_.isObject(e.action) && checkClick(e.action, 'updateItem')) || (_.isArray(e.action) && e.action.some(a => checkClick(a, 'updateItem'))));
      if (action) {
        jsonConfig.updateFormItemList = action.formItemList;
        jsonConfig.hasUpdateSubmit = true;
      }
    }

    if ((headContent.find(e => e.tag === 'jh-page-title') || {}).helpBtn) {
      jsonConfig.hasHelpDrawer = true;
    }

    if (headContent.find(e => e.tag === 'jh-search')) {
      jsonConfig.hasSearch = true;
    }
    Object.assign(jsonConfig, this.getBasicConfig(jsonConfig));


  },

  getConfigComponentList(jsonConfig) {
    const { table, pageId, actionContent = [] } = jsonConfig;
    const componentList = [];
    /**
     * 组件映射表
     * filename - 组件文件名
     * bind - 组件绑定数据
     * sqlMap - 组件 sqlMap
     */
    const componentMap = {
      recordHistory: { filename: 'tableRecordHistory', bind: { table, pageId, ':id': '{{key}}Item.id' }, sqlMap: { table, pageId } },
      tableRecordHistory: { filename: 'tableRecordHistory', bind: { table, pageId, ':id': '{{key}}Item.id' }, sqlMap: { table, pageId } },
      vueJsonEditor: { filename: 'vueJsonEditor', model: '', bind: { mode: 'code', expandedOnStart: false } },
      tableAttachment: { filename: 'tableAttachment', bind: { table, pageId, ':id': '{{key}}Item.id', fileType: '[]', fileSubType: '[]' }, sqlMap: { table, pageId, insertBeforeHook: '' } },
    };

    const processContentList = (contentList, itemKey = 'updateItem') => {
      contentList.forEach(item => {
        // eslint-disable-next-line eqeqeq
        if (item.type == 'component') {
          if (componentMap[item.componentPath]) {
            const { filename, bind, sqlMap } = componentMap[item.componentPath];
            item.componentPath = filename;
            if (_.isArray(item.bind)) {
              item.bind = item.bind.reduce((obj, key) => {
                obj[key] = `${itemKey}Item.${key}`;
                return obj;
              }, {});
            }

            item.bind = Object.assign({}, _.cloneDeep(bind), item.bind || {}, item.attrs || {});
            _.forEach(item.bind, (value, key) => {
              item.bind[key] = value.replace(/"/g, '\'').replace(/\{\{key\}\}/g, itemKey);
            });
            item.sqlMap = sqlMap;
          } else {
            const bind = {};
            if (_.isArray(item.bind)) {
              item.bind.forEach(bindItem => {
                if (_.isString(bindItem)) {
                  bind[bindItem] = `${itemKey}Item.${bindItem}`;
                }
              });
            }
            item.bind = Object.assign({}, bind, item.attrs || {});
            item.componentPath = item.componentPath;
          }
          componentList.push(item);
        } else if (item.type === 'form' && item.formItemList) {
          if (item.formItemList.some(e => e.tag === 'jh-json-editor')) {
            componentList.push({
              componentPath: 'vueJsonEditor',
            });
          }
        }
      });
    };
    const drawerList = actionContent.filter(e => [ 'jh-create-drawer', 'jh-update-drawer', 'jh-drawer' ].includes(e.tag));

    drawerList.forEach(drawer => {
      processContentList(drawer.contentList, drawer.key);
    });

    return _.uniqBy(componentList, 'componentPath');
  },

  // eslint-disable-next-line valid-jsdoc
  /**
   * 获取数据库表所有原生字段
   * @param {String} table
   * @returns
   */
  async getTableFields(jsonConfig) {
    const { table } = jsonConfig;
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

  // 初始化table依赖字段，检测依赖字段是否存在，不存在则创建
  async checkTableFields(table, idGenerate) {
    const knex = await this.getKnex();
    // 判断 table 是 table 还是 view
    const tableInfo = await knex('information_schema.tables').where({ table_name: table, table_schema: this.dbSetting.database }).first();
    if (!tableInfo || tableInfo.TABLE_TYPE === 'VIEW') {
      return;
    }
    const columnList = await knex(table).columnInfo();

    const defaultColumn = [ 'operation', 'operationByUserId', 'operationByUser', 'operationAt' ];
    if (idGenerate) defaultColumn.push('idSequence');
    for (const column of defaultColumn) {
      if (!columnList[column]) {
        return knex.schema.table(table, t => {
          this.info(`创建依赖字段：${column}`);
          // idSequence 列则在 id 后添加
          if (column === 'idSequence') {
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
    if (this.argv.devModel) return;
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/component`;
    const componentList = this.getConfigComponentList(jsonConfig);

    // 循环 componentList 运行 sql
    for (const component of componentList) {
      await this.modifyComponentResourceItem(templatePath, component);
    }
  },

  async modifyComponentResourceItem(templatePath, component) {
    const knex = await this.getKnex();
    if (component.type === 'component' && ![ 'tableRecordHistory', 'jhFile' ].includes(component.componentPath)) return;
    if (!fs.existsSync(`${templatePath}/${component.componentPath}.sql`)) return;
    let resourceSql = fs.readFileSync(`${templatePath}/${component.componentPath}.sql`).toString();
    _.forEach(component.sqlMap, (value, key) => {
      resourceSql = resourceSql.replace(new RegExp(`\{\{${key}\}\}`, 'g'), value || '');
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

  async renderComponent(jsonConfig, devModel = false) {
    const componentList = this.getConfigComponentList(jsonConfig);
    if (!componentList.length) return;

    const componentPath = `${path.join(__dirname, '../../')}page-template-json/component`;
    if (!fs.existsSync('./app/view/component')) fs.mkdirSync('./app/view/component');

    const { y, n } = this.argv || {};
    for (const item of componentList) {
      // 检查文件存在则提示是否覆盖
      const targetFilePath = `./app/view/component/${item.componentPath}.html`;
      if ([ 'tableRecordHistory', 'vueJsonEditor', 'jhFile' ].includes(item.componentPath)) {
        if (fs.existsSync(targetFilePath)) {
          if (devModel) continue;
          if (n) {
            this.warning(`跳过 ${item.componentPath} 组件的生成`);
            continue;
          }
          if (!y) {
            const overwrite = await this.readlineMethod(`组件 ${item.componentPath} 已经存在，是否覆盖?(y/N)`, 'n');
            if ((overwrite !== 'y' && overwrite !== 'Y')) {
              this.warning(`跳过 ${item.componentPath} 组件的生成`);
              continue;
            }
          }
        }
        this.info(`${y ? '默认' : ''}开始生成 ${item.componentPath} 组件`);
        const componentHtml = fs.readFileSync(componentPath + '/' + item.componentPath + '.html')
          .toString()
          .replace(/\/\/===\/\/ /g, '')
          .replace(/\/\/===\/\//g, '');

        fs.writeFileSync(targetFilePath, componentHtml);
        await this.modifyComponentResourceItem(componentPath, item);
      }
    }
  },

  // 生成 service
  async renderService(jsonConfig, dev = false) {
    const { idGenerate = false } = jsonConfig;
    if (idGenerate) {
      // idGenerate 依赖 common service
      const templatePath = `${path.join(__dirname, '../../')}page-template-json/service`;
      const templateTargetPath = `${templatePath}/common.js`;

      const servicePath = './app/service';
      if (!fs.existsSync(servicePath)) fs.mkdirSync(servicePath);

      // 检查 service 是否存在
      const serviceFilePath = `${servicePath}/common.js`;
      const { y, n } = this.argv || {};
      if (fs.existsSync(serviceFilePath)) {
        if (dev) return;
        if (n) {
          this.warning('跳过 common service 的生成');
          return false;
        }
        if (!y) {
          const overwrite = await this.readlineMethod('common service 已经存在，是否覆盖?(y/N)', 'n');
          if (overwrite !== 'y' && overwrite !== 'Y') {
            this.warning('跳过 common service 的生成');
            return false;
          }
        }
      }
      this.info(`${y ? '默认' : ''}开始生成 common service`);
      fs.copyFileSync(templateTargetPath, serviceFilePath);
    }
  },

  async executeCommand(command) {
    return new Promise(resolve => {
      exec(command, (error, stdout) => {
        if (error) {
          // console.error(`执行${command}出错: ${error.message}`, { error, stdout, stderr });
          // reject();
          resolve(stdout);
        }
        resolve(stdout);
      });
    });
  },

  getBasicConfig(config) {
    const basicUiActionConfig = this.basicUiAction(config);
    return {
      basicUiActionConfig: this.basicUiAction(config),
      basicUiActionList: _.flatten(_.values(basicUiActionConfig)),
    };
  },

  basicUiAction({ common, hasJhTable, hasCreateDrawer, hasCreateSubmit, hasUpdateDrawer, hasUpdateSubmit, hasDelete }) {
    const defaultUiAction = {
      getTableData: [ 'getTableData' ],
      startCreateItem: [ 'prepareCreateFormData', 'openCreateDrawer' ],
      createItem: [ 'prepareCreateValidate', 'confirmCreateItemDialog', 'prepareDoCreateItem', 'doCreateItem', 'closeCreateDrawer', 'getTableData' ],
      startUpdateItem: [ 'prepareUpdateFormData', 'openUpdateDrawer' ],
      updateItem: [ 'prepareUpdateValidate', 'confirmUpdateItemDialog', 'prepareDoUpdateItem', 'doUpdateItem', 'closeUpdateDrawer', 'getTableData' ],
      deleteItem: [ 'prepareDeleteFormData', 'confirmDeleteItemDialog', 'prepareDoDeleteItem', 'doDeleteItem', 'getTableData' ],
    };

    if (!hasJhTable) {
      delete defaultUiAction.getTableData;
    }
    if (!hasCreateDrawer) {
      delete defaultUiAction.startCreateItem;
    }
    if (!hasCreateSubmit) {
      delete defaultUiAction.createItem;
    }
    if (!hasUpdateDrawer) {
      delete defaultUiAction.startUpdateItem;
    }
    if (!hasUpdateSubmit) {
      delete defaultUiAction.updateItem;
    }
    if (!hasDelete) {
      delete defaultUiAction.deleteItem;
    }
    for (const key in defaultUiAction) {
      if (common.doUiAction[key]) {
        delete defaultUiAction[key];
      }
    }

    return defaultUiAction;
  },

};
module.exports = mixin;