'use strict';
const nunjucks = require('nunjucks');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const checkClick = (obj, action) => {
  // /doUiAction\(['"]action['"]/
  if (!obj || !action) return false;
  const reg = new RegExp(`doUiAction\\(['"]${action || ''}['"]`);
  return obj && obj.attrs && obj.attrs['@click'] && reg.test(obj.attrs['@click']);
};

/**
 * ================================================================================================
 * 生成随机key
 * @param {Number} length 随机key长度
 * @returns {String} 随机key
 * ================================================================================================
 */
const randomKey = (length = 4) => {
  const charList = 'abcdefhijkmnprstwxyz123456789';
  const charListLength = charList.length;
  let string = '';
  for (let i = 0; i < length; i++) string += charList.charAt(Math.floor(Math.random() * charListLength));
  return string;
};

/**
 * ================================================================================================
 * 1table-page / 1table-component 共用方法
 * ================================================================================================
 */
const mixin = {
  /**
   * ================================================================================================
   * 处理 nunjucks 环境
   * @param {String} templateTargetPath 模板目标路径
   * @returns {Object} nunjucks 环境
   * ================================================================================================
   */
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
          .replace(/\\\\/g, '|||')
          // 处理换行符和缩进
          .replace(/\\r\\n/g, '\n')
          .replace(/\\n {4}/g, '\n')
          .replace(/\\n/g, '\n')
          .replace(/\\(?!n)/g, '')
          .replace(/\n/g, '\n' + ' '.repeat(indent))
          .replace(/\|\|\|/g, '\\');
      } else {
        content = obj;
      }
      testKey.forEach(key => {
        content = content.replace(new RegExp(`"${key}":\\s*?replace_this_key`, 'g'), '');
      });
      if (k) {
        if (k.includes('.')) {
          k = '\'' + k + '\'';
        }
        // 匿名同步格式
        if (/^function\s*?\(/.test(content) || /^\(/.test(content)) {
          content = k + ': ' + content;
        }
        // 匿名异步格式
        if ((/^async\s+function\s*?\(/.test(content) || /^async\s+\(/.test(content))) {
          content = k + ': ' + content;
        }
        if (typeof obj === 'object') {
          content = k + ': ' + content.replace(/"(\w+)":/g, '$1:');
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
      return content;
      // return content.replace(/(?<!case\s+)"(\w+)":/g, '$1:');
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
    const tagAttr = (keyStr, value, tag = '') => {
      let key = keyStr;
      if (!keyStr.startsWith(':') && !keyStr.startsWith('@') && !keyStr.includes('-')) {
        key = _.kebabCase(keyStr);
      }
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
      // key 驼峰转 kebab
      return `${key}="${value.toString().replace(/"/g, '\'')}"`;
    };
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
      let quickAttrs = (item.quickAttrs || []).join(' ');
      quickAttrs = quickAttrs ? ' ' + quickAttrs : '';
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
      return `${indentSpaces}<${tag} ${attrs}${quickAttrs}>${lineBreak}${value}${lineBreak}${value ? indentSpaces : ''}</${tag}>`;
    };
    nunjucksEnv.addFilter('tagFormat', function(result, indent = 0) {
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
    });
    nunjucksEnv.addFilter('formItemFormat', function(result, drawerKey = '') {
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
          res.attrs['v-model'] = res.model.includes('.') ? res.model : (drawerKey ? drawerKey + '.' + res.model : res.model);

          if (res.model === 'keyword' && !drawerKey) {
            if (!res.value) {
              res.attrs[':placeholder'] = "_.compact(keywordFieldList.map(e => headers.find(h => h.value == e)?.text)).join('/')";
              res.attrs.prefix = res.attrs.prefix ? res.attrs.prefix.replace('：', '') : '搜索';
              res.value = `
        <template v-slot:prepend-inner>
          <!-- 下拉选择模糊搜索字段 v-menu, 外只显示缩略 -->
          <v-menu :close-on-content-click="false" transition="scale-transition" offset-y min-width="290">
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" class="text-nowrap pt-1">
                ${ res.attrs.prefix }<span class="bg-green-500 text-white ml-0.5 px-1 rounded">{{keywordFieldList.length}}</span>
              </div>
            </template>
            <div class="pa-2 w-[300px]">
              <v-chip v-for="header in headers.filter(e => e.value != 'action')" :key="header.value" class="ma-1" :color=" keywordFieldList.includes(header.value) ? 'primary' : 'default'" label outlined small @click="keywordFieldList = keywordFieldList.includes(header.value) ? keywordFieldList.filter(field => field !== header.value) : [...keywordFieldList, header.value]">
                {{ header.text }}
              </v-chip>
            </div>
          </v-menu>
        </template>
        `;
              delete res.attrs.prefix;
            }
          }
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

        let quickAttrs = (res.quickAttrs || []).join(' ');
        quickAttrs = quickAttrs ? ' ' + quickAttrs : '';

        tagStr += _.map(res.attrs, (value, key) => {
          let val = value;
          if (key === 'v-model' && !value.includes('.') && drawerKey) {
            val = drawerKey + '.' + value;
          }
          if (key === 'v-model') {
            // 替换this.
            val = val ? val.replace(/this\./g, '') : val;
          }
          return tagAttr(key, val, res.tag);
        }).join(' ');
        if (res.value) {
          tagStr += `${quickAttrs}>${res.value}</${res.tag}>`;
        } else {
          tagStr += `${quickAttrs}></${res.tag}>`;
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
    const isFormItemDisabled = (res) => {
      const readonly = res.readonly || false;
      const attrs = res.attrs || {};
      const quickAttrs = res.quickAttrs || [];
      const checkTrue = (value) => (value === true || value === 'true');
      return checkTrue(attrs.disabled) || checkTrue(attrs.readonly) || checkTrue(attrs[':disabled']) || checkTrue(attrs[':readonly']) || checkTrue(quickAttrs.includes('disabled')) || checkTrue(quickAttrs.includes('readonly')) || checkTrue(readonly);
    }

    nunjucksEnv.addFilter('isFormItemDisabled', function(res) {
      return isFormItemDisabled(res);
    });
    nunjucksEnv.addFilter('mobileFormItemFormat', function(result, drawerKey = 'updateItem') {
      const tag = [];
      const tagItemFormat = res => {
        if (!res.tag) {
          return '';
        }
        if (!res.attrs) {
          // res.attrs = { ':reverse': true };
          res.attrs = {};
        } else {
          // res.attrs[':reverse'] = true;
        }
        if (!res.quickAttrs) {
          res.quickAttrs = [ ];
        }
        if (!res.quickAttrs.includes('dense')) {
          res.quickAttrs.push('dense');
        }
        if (!res.quickAttrs.includes('single-line')) {
          res.quickAttrs.push('single-line');
        }
        if (!res.quickAttrs.includes('filled') && res.tag == 'v-textarea') {
          res.quickAttrs.push('filled');
        }

        const classList = res.attrs.class ? res.attrs.class.split(' ') : [ 'jh-v-input', 'mt-0', 'pt-0' ];
        if (res.model && res.label && ['v-text-field', 'v-select', 'v-textarea', 'v-autocomplete', 'v-combobox', 'v-file-input', 'v-radio', 'v-checkbox', 'v-switch', 'v-slider', 'v-range-slider', 'v-rating', 'v-date-picker', 'v-time-picker'].includes(res.tag)) {
          if (!isFormItemDisabled(res)) {
            // 判断 attrs 内是否有 placeholder 属性
            let prefix = '请输入';
            if (['v-select', 'v-autocomplete', 'v-combobox'].includes(res.tag)) {
              prefix = '请选择';
            }
            if (!res.attrs.placeholder) {
              // 替换掉 （.*）|（.*）|{{.*}}
              const placeholder = res.label.replace(/（.*）|（.*）|{{.*}}/g, '');
              res.attrs.placeholder = prefix + placeholder;
            }
          } else {
            classList.push('!text-gray-500');
          }
        }

        // class="jh-v-input" dense single-line filled
        if (['v-date-picker', 'jh-json-editor', 'v-textarea'].includes(res.tag)) {
          if (!classList.includes('w-full')) {
            classList.push('w-full');
          }
        } else {
          if (!classList.includes('w-2/3')) {
            classList.push('w-2/3 inline-block');
          }
        }
        res.attrs.class = classList.join(' ');


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

        let quickAttrs = (res.quickAttrs || []).join(' ');
        quickAttrs = quickAttrs ? ' ' + quickAttrs : '';
        tagStr += _.map(res.attrs, (value, key) => {
          let val = value;
          if (key === 'v-model' && !value.includes('.')) {
            val = drawerKey + '.' + value;
          }
          if (key === 'v-model') {
            // 替换this.
            val = val ? val.replace(/this\./g, '') : val;
          }
          return tagAttr(key, val, res.tag);
        }).join(' ');
        if (res.value) {
          tagStr += `${quickAttrs}>${res.value}</${res.tag}>`;
        } else {
          tagStr += `${quickAttrs}></${res.tag}>`;
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
    nunjucksEnv.addFilter('isString', function(item) {
      return _.isString(item);
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
    nunjucksEnv.addFilter('componentUlName', function(path) {
      const componentName = path.split('/').pop().split('.')[0];
      return componentName.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
    });

    nunjucksEnv.addFilter('includeFormat', function(item) {
      if (!item) return '';
      if (_.isString(item)) return item; // 兼容原生代码
      const { type, path } = item;
      if ([ 'js', 'script' ].includes(type)) {
        return `<script src="${path}"></script>`;
      } else if ([ 'css', 'style' ].includes(type)) {
        return `<link rel="stylesheet" href="${path}">`;
      } else if ([ 'html', 'component', 'include' ].includes(type)) {
        return `{% include "${path}" %}`;
      } else if (type === 'vueComponent') {
        return `Vue.component('${item.name}', ${item.component})`;
      } else if (type === 'vueUse') {
        return `Vue.use(${item.component})`;
      }
    });

    nunjucksEnv.addFilter('find', function(list, obj) {
      if (!list || !obj) return;
      return list.find(item => {
        return _.isMatch(item, obj);
      });
    });
    nunjucksEnv.addFilter('filter', function(list, obj) {
      if (!list || !obj) return list; // 如果没有提供list或obj，直接返回原始list
      return list.filter(item => {
        // 遍历obj的每个键值对，检查是否有取反条件
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            // 如果obj的值以"!"开头，表示这是一个取反条件
            if (typeof obj[key] === 'string' && obj[key].startsWith('!')) {
              // 检查item的属性值是否不等于obj中指定的取反值（去掉"!"后的部分）
              if (item[key] === obj[key].substring(1)) {
                return false; // 如果等于取反条件的值，则过滤掉这个item
              }
            } else {
              // 对于非取反条件，使用_.isMatch进行匹配
              if (!_.isMatch(item, { [key]: obj[key] })) {
                return false; // 如果不匹配，则过滤掉这个item
              }
            }
          }
        }
        return true; // 如果item通过了所有条件检查，则保留这个item
      });
    });
    nunjucksEnv.addFilter('includes', function(arr, val) {
      return arr.includes(val);
    });
    // 填充随机key
    nunjucksEnv.addFilter('fillConfigKey', function(config) { 
      if (!config) return;

      const fillObjRandomKey = (obj) => {
        if (!_.isPlainObject(obj) || obj.key) return obj;
        
        let key;
        do {
          key = randomKey();
        } while (/^\d/.test(key)); // 检查是否以数字开头
        obj.key = key;
        return obj;
      };
      if (_.isPlainObject(config)) {
        fillObjRandomKey(config);
      };
      // 判断是否为json对象
      if (_.isArray(config)) {
        config.map(item => {
          return fillObjRandomKey(item);
        });
      }
      return config;
    });
    // 添加后缀并转为驼峰
    nunjucksEnv.addFilter('fillConfigKeySuffix', function(config, suffix) {
      if (!config) return;
      const fillObjRandomKeySuffix = (obj) => {
        if (!_.isPlainObject(obj) || !obj.key) return obj;
        obj.key = _.camelCase(obj.key + suffix);
        return obj;
      };
      if (_.isPlainObject(config)) {
        fillObjRandomKeySuffix(config);
      };
      if (_.isArray(config)) {
        config.map(item => {
          return fillObjRandomKeySuffix(item);
        });
      }
      return config;
    });

    return nunjucksEnv;
  },

  /**
   * ================================================================================================
   * 检查页面
   * @param {Object} jsonConfig 配置对象
   * ================================================================================================
   */
  async checkPage(jsonConfig) {
    const { pageType, pageId, pageName, jhId } = jsonConfig;
    const operationByUserId = `jianghu-init/${pageId}`;
    const knex = await this.getKnex();
    const where = { pageId };
    if (jhId) {
      where.jhId = jhId;
    }
    const existPage = await knex('_page').where(where).first();
    const pageData = {
      pageId,
      pageName,
      operationByUserId,
    };
    if (jhId) {
      pageData.jhId = jhId;
    }
    if (existPage && (existPage.pageName !== pageData.pageName || existPage.operationByUserId !== operationByUserId)) {
      this.notice(`更新页面名称 ${existPage.pageName} => ${pageName}`);
      await knex('_page').where({ id: existPage.id }).update(pageData);
    } else if (!existPage) {
      this.notice(`新增页面 ${pageName}`);
      await knex('_page').insert({ ...pageData, pageType: 'showInMenu' });
    }
  },

  /**
   * ================================================================================================
   * 处理其他资源
   * @param {Object} jsonConfig 配置对象
   * ================================================================================================
   */
  async handleOtherResource(jsonConfig) {
    const { resourceList, pageId, jhId } = jsonConfig;
    if (!resourceList || !pageId) return;
    const knex = this.knex;
    const where = { pageId };
    if (jhId) {
      where.jhId = jhId;
    }
    const existResourceList = await knex('_resource').where(where);
    for (const { actionId, resourceType, desc = null, resourceData, resourceHook = null, operationByUserId = `jianghu-init/${pageId}` } of resourceList) {
      const resourceDataStr = _.isObject(resourceData) ? JSON.stringify(resourceData) : resourceData;
      const resourceHookStr = _.isObject(resourceHook) ? JSON.stringify(resourceHook) : resourceHook;
      // 比对是否存在，存在则更新，不存在则插入
      // eslint-disable-next-line eqeqeq
      const resourceItem = existResourceList.find(e => e.actionId == actionId);
      if (resourceItem) {
        // 对比有差异再修改
        let isDiff = false;
        const updateData = { actionId, pageId, resourceType, desc, resourceData: resourceDataStr, resourceHook: resourceHookStr, operationByUserId };
        _.forEach(updateData, (value, key) => {
          if ((value || null) !== (resourceItem[key] || null)) {
            isDiff = true;
            updateData[key] = updateData[key] || null;
          }
        });
        if (!isDiff) continue;
        await knex('_resource').where({ id: resourceItem.id }).update(updateData);
      }

      if (!resourceItem) {
        const data = { pageId, actionId, desc, resourceType, resourceData: resourceDataStr, resourceHook: resourceHookStr, operationByUserId };
        if (jhId) {
          data.jhId = jhId;
        }
        await knex('_resource').insert(data);
      }
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

  /**
   * ================================================================================================
   * 处理配置文件数据
   * @param {Object} jsonConfig 配置对象
   * ================================================================================================
   */
  handleJsonConfig(jsonConfig) {

    if (!jsonConfig.template) {
      jsonConfig.template = 'jhTemplateV4';
    }
    if (!jsonConfig.actionContent) {
      jsonConfig.actionContent = [];
    }
    if (!jsonConfig.headContent) {
      jsonConfig.headContent = [];
    }
    if (!jsonConfig.common) {
      jsonConfig.common = [];
    }
    if (!jsonConfig.pageContent) {
      jsonConfig.pageContent = [];
    }
    if (!jsonConfig.hasOwnProperty('jhMenu')) {
      jsonConfig.jhMenu = true;
    }

    let { includeList, actionContent, pageContent = [], headContent = [], common = {} } = jsonConfig;
    /**
     * njk 快捷判断变量
     * {hasIncludeList} - 是否有 includeList
     * {hasHeadContent} - 是否有 headContent
     * {hasPageContent} - 是否有 pageContent
     * {hasJhTable} - 是否有 jh-table
     * {hasJhScene} - 是否有 jh-scene
     * {hasCreateDrawer / hasCreateStart / hasCreateSubmit} - 是否有创建抽屉
     * {hasUpdateDrawer / hasUpdateStart / hasUpdateSubmit} - 是否有更新抽屉
     * {idGenerate} - 是否有业务id配置
     */
    if (!common.doUiAction) {
      common.doUiAction = [];
    }
    // 默认 headSlot 加入分隔符
    for (const content of jsonConfig.actionContent) {
      if (!_.isString(content) && (!content.headSlot || !content.headSlot.length)) {
        content.headSlot = [ '<v-spacer></v-spacer>' ];
      }
    }
    if (!_.isArray(pageContent) && _.isObject(pageContent)) {
      jsonConfig.pageContent = [ pageContent ];
      pageContent = jsonConfig.pageContent;
    }
    if (includeList && includeList.length > 0) {
      jsonConfig.hasIncludeList = true;
    }
    if (headContent && headContent.length > 0) {
      jsonConfig.hasHeadContent = true;
    }
    if (pageContent && pageContent.length > 0) {
      jsonConfig.hasPageContent = true;
    }
    const findJhTable = pageContent.find(e => [ 'jhTable', 'jh-table' ].includes(e.tag));
    if (findJhTable) {
      // 旧版 jh-table value 兼容
      jsonConfig.pageContent.forEach(content => {
        if (content.tag === 'jh-table') {
          if (content.value && _.isArray(content.value) && content.value.find(e => e.text && e.value && e.width)) {
            this.warning('已过期旧版headers: key vlaue');
            content.headers = content.value;
            // todo 提示 使用新版key
          }
          if (content.slot) {
            content.value = content.slot;
          }
          const defaultColAttrs = {
            cols: 12,
          };
          if (!content.colAttrs) {
            content.colAttrs = Object.assign({}, defaultColAttrs, content.colAttrs);
          }
          const defaultCardAttrs = {
            class: '',
          };
          if (!content.cardAttrs) {
            content.cardAttrs = Object.assign({}, defaultCardAttrs, content.cardAttrs);
          }
          if ((!content.headActionList || !content.headActionList.length) && content.showTableColumnSettingBtn) {
            content.headActionList = [{ tag: 'v-spacer' }];
          }
        }
      });

      jsonConfig.hasJhTable = true;
      jsonConfig.jhTable = findJhTable;
      if (findJhTable.headActionList && findJhTable.headActionList.length) {
        if (findJhTable.headActionList.some(e => checkClick(e, 'startCreateItem'))) {
          jsonConfig.hasCreateStart = true;
        }
      }

      if (findJhTable.rowActionList && findJhTable.rowActionList.length) {
        jsonConfig.hasUpdateStart = findJhTable.rowActionList.some(e => checkClick(e, 'startUpdateItem') || /doUiAction\(['"]startUpdateItem['"]/.test(e.click || ''));
        jsonConfig.hasDelete = findJhTable.rowActionList.some(e => checkClick(e, 'deleteItem') || /doUiAction\(['"]deleteItem['"]/.test(e.click || ''));
      }
      if (findJhTable.showTableColumnSettingBtn) {
        jsonConfig.hasShowTableColumnSettingBtn = true;
      }
    }

    const hasJhList = pageContent.find(e => e.tag === 'jh-list');
    if (hasJhList) {
      const index = hasJhList.headers.findIndex(e => !!e.isTitle);
      jsonConfig.pageContent.forEach(content => {
        if (content.tag === 'jh-list') {
          if (index !== -1) {
            content.headers = content.headers || common.data.headers;
            content.headers.forEach((e, i) => {
              if (index !== i) {
                e.isTitle = false;
              } else {
                e.isSimpleMode = true;
              }
            });
          } else {
            content.headers[0].isTitle = true;
            content.headers[0].isSimpleMode = true;
          }
        }
      });
      jsonConfig.hasJhList = jsonConfig.pageContent.find(e => e.tag === 'jh-list');
      // 把 isTitle 为 true 的放到第一位
      if (hasJhList.headers) {
        const titleIndex = (hasJhList.headers || []).findIndex(e => e.isTitle);
        const title = hasJhList.headers.splice(titleIndex, 1);
        hasJhList.headers.unshift(title[0]);
        if (hasJhList.rowActionList) {
          jsonConfig.hasDelete = hasJhList.rowActionList.some(e => checkClick(e, 'deleteItem') || /doUiAction\(['"]deleteItem['"]/.test(e.click || ''));
        }
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
        if (updateDrawer.props && updateDrawer.props.mergeForm) {
          jsonConfig.updateFormItemList = updateDrawer.contentList.filter(e => e.type === 'form').map(e => e.formItemList).flat();
        } else {
          jsonConfig.updateFormItemList = action.formItemList;
        }
        jsonConfig.hasUpdateSubmit = true;
      }
    }
    const detailDrawer = actionContent.find(e => e.tag === 'jh-detail-drawer');
    if (detailDrawer) {
      jsonConfig.hasDetailDrawer = detailDrawer.contentList.length;
      if (detailDrawer.contentList.find(e => e.type === 'preview' && e.action && (_.isObject(e.action) && checkClick(e.action, 'deleteItem')) || (_.isArray(e.action) && e.action.some(a => checkClick(a, 'deleteItem'))))) {
        jsonConfig.hasDetailUpdate = true;
      }
    }

    if (createDrawer || updateDrawer) {
      // 统一转换 contentList 内 type 是 form 的 formItemList 内的 item colsAttrs -> colAttrs
      for (const drawer of jsonConfig.actionContent) {
        if (drawer.tag === 'jh-update-drawer' || drawer.tag === 'jh-create-drawer') {
          for (const content of drawer.contentList) {
            if (content.type === 'form') {
              content.formItemList.forEach(item => {
                if (_.isString(item)) return;
                if (item.colsAttrs) {
                  item.colAttrs = item.colsAttrs;
                }
                if (!item.colAttrs) item.colAttrs = {};
                if (jsonConfig.pageType === 'jh-mobile-page' && !!item.model) {
                  // border-b flex justify-between items-center py-2
                  if (item.attrs && (item.attrs.disabled || item.attrs.readonly || item.attrs[':readonly'] || item.attrs[':disabled'])) {
                    item.colAttrs.class = '' + (item.colAttrs.class ? ' ' + item.colAttrs.class : '');
                  } else {
                    item.colAttrs.class = (item.colAttrs.class ? ' ' + item.colAttrs.class : '');
                  }
                }
              });
            }
          }
        }
      }
    }

    if ((headContent.find(e => e.tag === 'jh-page-title') || {}).helpBtn) {
      jsonConfig.hasHelpDrawer = true;
    }

    if (headContent.find(e => e.tag === 'jh-search')) {
      jsonConfig.hasSearch = true;

      // 统一转换 jh-search 的 formItemList 内的 item colsAttrs -> colAttrs
      for (const content of headContent) {
        if (content.tag === 'jh-search' && content.value) {
          content.value.forEach(item => {
            if (item.colsAttrs) {
              item.colAttrs = item.colsAttrs;
            }
          });
        }
      }

      if (jsonConfig.pageType === 'jh-mobile-page' && headContent.find(e => e.tag === 'jh-search').advSearchList) {
        jsonConfig.hasAdvSearch = true;
        jsonConfig.advSearchList = headContent.find(e => e.tag === 'jh-search').advSearchList;
      }
    }

    const hasJhScene = headContent.find(e => e.tag === 'jh-scene');
    if (hasJhScene) {
      jsonConfig.hasJhScene = true;
    }

    // 版本特性处理
    this.processingVersionData(jsonConfig);

    Object.assign(jsonConfig, this.getBasicConfig(jsonConfig));

    // 拼接 doUiAction, 支持环节添加 doUiAction 配置
    if (jsonConfig.common.doUiAction) {
      for (const key in jsonConfig.common.doUiAction) {
        const uiAction = jsonConfig.common.doUiAction[key];
        for (let [ index, item ] of uiAction.entries()) {
          item = this.processUiActionItem(item);
          jsonConfig.common.doUiAction[key][index] = item;
        }
      }
    }
  },

  /**
   * ================================================================================================
   * 处理版本特性
   * @param {Object} jsonConfig 配置对象
   * ================================================================================================
   */
  processingVersionData(jsonConfig) {
    const { version, pageType } = jsonConfig;
    if ([ 'v4', 'v3' ].includes(version)) {

      for (const content of jsonConfig.headContent) {
        if (content.tag === 'jh-scene') {
          // 格式校验
          if (!content.data) {
            this.errorLog([ 
              '** v3 版本中 jh-scene 组件必须配置 data 属性 **',
              '@sceneCreateForm {object} 场景搜索 input 变量',
              '@serverSceneSearchWhere {object} 场景搜索变量',
              '@serverSceneSearchWhereIn {object} 场景搜索变量',
              '@serverSceneSearchWhereLike {object} 场景搜索变量',
              '@serverSceneSearchWhereOptions {array} 场景搜索变量',
              '@serverSceneSearchWhereOrOptions {array} 场景搜索变量',
              '@currentSceneId {string} 当前场景 name',
              '@defaultSceneList {array} 默认场景列表',
              '@customSceneList {array} 自定义场景列表',
            ]);
          }
          const defaultData = {
            sceneCreateForm: {},
            serverSceneSearchWhere: {},
            serverSceneSearchWhereIn: {},
            serverSceneSearchWhereLike: {},
            serverSceneSearchWhereOptions: [],
            serverSceneSearchWhereOrOptions: [],
            currentSceneId: '',
            defaultSceneList: [],
            customSceneList: [],
            maxSceneDisplay: 5
          };
          const defaultColAttrs = {
            class: 'pt-3',
          };
          content.colAttrs = Object.assign(defaultColAttrs, content.colAttrs || {});
          content.data = Object.assign(defaultData, content.data || {});
        }
        if (pageType === 'jh-mobile-page' && content.tag === 'jh-order') {
          // 格式校验
          if (!content.data) {
            this.errorLog([ 
              '** v3 版本中 jh-order 组件必须配置 data 属性 **',
              '@tableDataOrder {array} 当前排序',
              '@tableDataOrderList {array} 排序列表',
            ]);
          }
          const defaultData = {
            tableDataOrder: [{ column: 'operationAt', order: 'desc' }],
            tableDataOrderList: [
              { text: '最新更新↓', value: [{ column: 'operationAt', order: 'desc' }] },
            ],
          };
          content.data = Object.assign(defaultData, content.data || {});
        }

        if (content.tag === 'jh-search') {
          // 格式校验
          if (!content.data) {
            this.notice("自定义使用：{ tag: 'jh-search', data: { serverSearchWhere: {}, serverSearchWhereIn: {}, serverSearchWhereLike: {} } }");
          }
          const defaultData = {
            serverSearchWhere: {},
            serverSearchWhereIn: {},
            serverSearchWhereLike: {},
            maxSearchDisplay: 5,
          };
          content.data = Object.assign(defaultData, content.data || {});
        }
      }
      // pageContent 中 jh-table 的 rightArrow 属性
      jsonConfig.pageContent.forEach(content => {
        if (content.tag === 'jh-list') {
          content.props = content.props || {};

          const defaultProps = {
            rightArrow: true,
          };
          content.props = Object.assign(defaultProps, content.props || {});
        }
      });

      if (version === 'v4' && [ 'jh-mobile-page', 'jh-mobile-component' ].includes(pageType)) {
        jsonConfig.actionContent.forEach(content => {
          if ([ 'jh-create-drawer', 'jh-update-drawer', 'jh-detail-drawer', 'jh-drawer' ].includes(content.tag)) {
            content.contentList.forEach(item => {
              if (item.type === 'form') {
                item.formItemList.forEach(formItem => {
                  if (_.isObject(formItem)) {
                    if (!formItem.colAttrs) formItem.colAttrs = {};
                    if (!formItem.colAttrs?.class) {
                      formItem.colAttrs.class = 'flex flex-wrap items-start border-b py-2';
                    }
                  }
                });
              }
            });
          }
        });
      }
    }
  },

  /**
   * ================================================================================================
   * 错误日志
   * @param {String | Array} error 错误信息
   * ================================================================================================
   */
  errorLog(error) {
    this.error('┏----------------------------------------------------------┓');
    if (Array.isArray(error)) {
      for (const item of error) {
        this.error('  ' + item);
      }
    } else {
      this.error('  ' + error);
    }
    this.error('┗----------------------------------------------------------┛');
  },

  /**
   * ================================================================================================
   * 处理 doUiAction 的特殊情况
   * @param {String} item doUiAction 的特殊情况
   * @returns {String} 处理后的 doUiAction
   * ================================================================================================
   */
  processUiActionItem(item) {
    // 统一替换前缀
    item = item.replace(/this\./, '').replace(/^async\./, 'this.').replace(/^await\./, 'await this.');
    if (!item.includes('this.')) {
      item = 'await this.' + item;
    }

    // 处理doUiAction的特殊情况
    if (item.includes('doUiAction.')) {
      const prefixKey = item.includes('await ') ? 'await ' : '';
      item = item.replace(/\(.*\)/, '').replace(/(await\s+)?this\./, '').replace(/doUiAction\./, '') + '\', uiActionData)';
      item = `${prefixKey}this.doUiAction('${item}`;
    } else {
      // 处理参数添加uiActionData
      const patt = /\((.*)\)/;
      if (patt.test(item)) {
        item = item.replace(/\(.*\)/, '') + '(' + patt.exec(item)[1] + ', uiActionData)';
      } else {
        item = item + '(uiActionData)';
      }
    }
    return item;
  },

  /**
   * ================================================================================================
   * 获取组件列表
   * @param {Object} jsonConfig 配置对象
   * @returns {Array} 组件列表
   * ================================================================================================
   */
  getConfigComponentList(jsonConfig) {
    const { table, pageId, actionContent = [], pageContent = [] } = jsonConfig;
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
      tableColumnSettingBtn: { filename: 'tableColumnSettingBtn', bind: {} },
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
                obj[':' + key.replace(/^:/, '')] = `${itemKey}Item.${key}`;
                return obj;
              }, {});
            }

            item.bind = Object.assign({}, _.cloneDeep(bind), item.bind || {}, item.attrs || {});
            _.forEach(item.bind, (value, key) => {
              item.bind[key] = (value || '').replace(/"/g, '\'').replace(/\{\{key\}\}/g, itemKey);
            });
            item.sqlMap = sqlMap;
          } else {
            const bind = {};
            if (_.isArray(item.bind)) {
              item.bind.forEach(bindItem => {
                if (_.isString(bindItem)) {
                  bind[':' + bindItem.replace(/^:/, '')] = `${itemKey}Item.${bindItem}`;
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
    const drawerList = actionContent.filter(e => [ 'jh-create-drawer', 'jh-update-drawer', 'jh-detail-drawer', 'jh-drawer' ].includes(e.tag));
    const tableColumnSetting = pageContent.filter(e => [ 'jh-table' ].includes(e.tag)).filter(item => item.showTableColumnSettingBtn);

    if (tableColumnSetting.length) {
      componentList.push({ type: 'component', componentPath: 'tableColumnSettingBtn' });
    }
    drawerList.forEach(drawer => {
      processContentList(drawer.contentList, drawer.key);
    });

    return _.uniqBy(componentList, 'componentPath');
  },

  // eslint-disable-next-line valid-jsdoc
  /**
   * ================================================================================================
   * 获取数据库表所有原生字段
   * @param {Object} jsonConfig 配置对象
   * @returns {Promise<Array>} 表所有原生字段
   * ================================================================================================
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

  /**
   * ================================================================================================
   * 初始化table依赖字段，检测依赖字段是否存在，不存在则创建
   * @param {String} table 表名
   * @param {Boolean} idGenerate 是否生成 id
   * ================================================================================================
   */
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
    const noticeFieldList = [];
    for (const column of defaultColumn) {
      if (!columnList[column]) {
        return knex.schema.table(table, t => {
          this.info(`创建依赖字段：${column}`);
          noticeFieldList.push(column);
          // idSequence 列则在 id 后添加
          if (column === 'idSequence') {
            t.integer(column).after('id');
          } else {
            t.string(column);
          }
        });
      }
    }
    noticeFieldList.length && this.success(`创建依赖字段：${noticeFieldList.join('、')}`);
  },
  /**
   * ================================================================================================
   * 批量添加组件 resource --- 废弃
   * @param {Object} jsonConfig 配置对象
   * ================================================================================================
   */
  async modifyComponentResource(jsonConfig) {
    if (this.argv.devModel) return;
    const templatePath = `${path.join(__dirname, '../../')}page-template-json/component`;
    const componentList = this.getConfigComponentList(jsonConfig);

    // 循环 componentList 运行 sql
    for (const component of componentList) {
      await this.modifyComponentResourceItem(templatePath, component);
    }
  },

  /**
   * ================================================================================================
   * 修改组件资源
   * @param {String} templatePath 模板路径
   * @param {Object} component 组件
   * ================================================================================================
   */
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
        this.notice(`[4/5]正在执行 ${component.componentPath} ${line}`);
      } else {
        await knex.raw(line);
      }
    }
  },

  /**
   * ================================================================================================
   * 渲染组件
   * @param {Object} jsonConfig 配置对象
   * @param {Boolean} devModel 是否为开发模式
   * ================================================================================================
   */
  async renderComponent(jsonConfig, devModel = false) {
    const componentList = this.getConfigComponentList(jsonConfig);
    if (!componentList.length) return;

    const componentPath = `${path.join(__dirname, '../../')}page-template-json/component`;
    fs.mkdirSync('./app/view/component', { recursive: true });

    const { y, n } = this.argv || {};
    for (const item of componentList) {
      // 检查文件存在则提示是否覆盖
      const targetFilePath = `./app/view/component/${item.componentPath}.html`;
      if ([ 'tableRecordHistory', 'vueJsonEditor', 'jhFile', 'tableColumnSettingBtn' ].includes(item.componentPath)) {
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
        this.notice(`[3/5]${y ? '默认' : ''}开始生成 ${item.componentPath} 组件...`);
        const componentHtml = fs.readFileSync(componentPath + '/' + item.componentPath + '.html')
          .toString()
          .replace(/\/\/===\/\/ /g, '')
          .replace(/\/\/===\/\//g, '');

        fs.writeFileSync(targetFilePath, componentHtml);
        await this.modifyComponentResourceItem(componentPath, item);
      }
    }
  },
  /**
   * ================================================================================================
   * 生成 service
   * @param {Object} jsonConfig 配置对象
   * @param {Boolean} dev 是否为开发模式
   * ================================================================================================
   */
  async renderService(jsonConfig, dev = false) {
    const { idGenerate = false } = jsonConfig;
    if (idGenerate) {
      // idGenerate 依赖 common service
      const templatePath = `${path.join(__dirname, '../../')}page-template-json/service`;
      const templateTargetPath = `${templatePath}/common.js`;

      const servicePath = './app/service';
      fs.mkdirSync(servicePath, { recursive: true });

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
      this.notice(`[5/5]${y ? '默认' : ''}开始生成 common service`);
      fs.copyFileSync(templateTargetPath, serviceFilePath);
    }
  },

  /**
   * ================================================================================================
   * 执行命令
   * @param {String} command 命令
   * ================================================================================================
   */
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

  /**
   * ================================================================================================
   * 基础配置
   * @param {Object} config 配置对象
   * ================================================================================================
   */
  getBasicConfig(config) {
    const basicUiActionConfig = this.basicUiAction(config);
    return {
      basicUiActionConfig: this.basicUiAction(config),
      basicUiActionList: _.flatten(_.values(basicUiActionConfig)),
    };
  },

  /**
   * ================================================================================================
   * 基础 uiAction
   * @param {Object} config 配置对象
   * ================================================================================================
   */
  basicUiAction({ version, common, hasJhTable, hasJhList, hasCreateDrawer, hasCreateSubmit, hasUpdateDrawer, hasDelete, hasUpdateSubmit, hasDetailDrawer }) {
    let defaultUiAction = {
      getTableData: [ 'getTableData' ],
      startCreateItem: [ 'prepareCreateFormData', 'openCreateDrawer' ],
      createItem: [ 'prepareCreateValidate', 'confirmCreateItemDialog', 'prepareDoCreateItem', 'doCreateItem', 'closeCreateDrawer', 'getTableData' ],
      startUpdateItem: [ 'prepareUpdateFormData', 'openUpdateDrawer' ],
      updateItem: [ 'prepareUpdateValidate', 'confirmUpdateItemDialog', 'prepareDoUpdateItem', 'doUpdateItem', 'closeUpdateDrawer', 'getTableData' ],
      startDetailItem: [ 'prepareDetailFormData', 'openDetailDrawer' ],
      deleteItem: [ 'prepareDeleteFormData', 'confirmDeleteItemDialog', 'prepareDoDeleteItem', 'doDeleteItem', 'getTableData' ],
    };

    if (version) {
      const uiAction = {
        getTableData: [ 'prepareTableParamsDefault', 'prepareTableParams', 'getTableData', 'formatTableData' ],
        createItem: [ 'prepareCreateValidate', 'confirmCreateItemDialog', 'prepareDoCreateItem', 'doCreateItem', 'closeCreateDrawer', 'doUiAction.getTableData' ],
        updateItem: [ 'prepareUpdateValidate', 'confirmUpdateItemDialog', 'prepareDoUpdateItem', 'doUpdateItem', 'closeUpdateDrawer', 'doUiAction.getTableData' ],
        deleteItem: [ 'prepareDeleteFormData', 'confirmDeleteItemDialog', 'prepareDoDeleteItem', 'doDeleteItem', 'doUiAction.getTableData' ],
      };
      // 合并到默认配置
      defaultUiAction = Object.assign(defaultUiAction, uiAction);

      for (const key in defaultUiAction) {
        const uiAction = defaultUiAction[key];
        for (let [ index, item ] of uiAction.entries()) {
          item = this.processUiActionItem(item);
          defaultUiAction[key][index] = item;
        }
      }
    }

    if (!hasJhTable && !hasJhList) {
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
    if (!hasDetailDrawer) {
      delete defaultUiAction.startDetailItem;
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
