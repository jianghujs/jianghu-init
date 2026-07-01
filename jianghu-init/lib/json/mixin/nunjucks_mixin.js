'use strict';
const nunjucks = require('nunjucks');
const _ = require('lodash');
const { normalizeBakedPageMenu } = require('../shared/resolvePageMenu');


class CleanLoader extends nunjucks.FileSystemLoader {
  getSource(name) {
    const source = super.getSource(name);
    if (!source) return null;

    const cleanedSrc = source.src
      .replace(/\/\/===\/\/ /g, '')
      .replace(/\/\/===\/\//g, '');

    return {
      src: cleanedSrc,
      path: source.path,
      noCache: source.noCache,
    };
  }
}

/**
 * v6 ：prop="" 中间的 JS 字面量序列化。
 * HTML 外层用双引号时，表达式内不可用未转义的 "，故对象/数组用单引号串 + 无引号合法的 key，
 * 避免 JSON.stringify + &quot 导致运行时无法编译。
 */
function vueColonPropInlineJs(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  const t = typeof val;
  if (t === 'boolean' || t === 'number') return String(val);
  if (t === 'string') {
    return '\'' + String(val)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r') + '\'';
  }
  if (Array.isArray(val)) {
    return '[' + val.map(vueColonPropInlineJs).join(',') + ']';
  }
  if (val && typeof val === 'object') {
    // __expr__ 哨兵：表示该值应作为 Vue 表达式输出，不加引号
    // 例：{ __expr__: 'memberList' } → memberList（Vue 解析为 this.memberList）
    if (typeof val.__expr__ === 'string') return val.__expr__;
    const keys = Object.keys(val);
    return '{' + keys.map(k => {
      const keyPart = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : vueColonPropInlineJs(k);
      return keyPart + ':' + vueColonPropInlineJs(val[k]);
    }).join(',') + '}';
  }
  return 'undefined';
}

// fillConfigKey filter 依赖
const randomKey = (length = 4) => {
  const charList = 'abcdefhijkmnprstwxyz123456789';
  const charListLength = charList.length;
  let string = '';
  for (let i = 0; i < length; i++) string += charList.charAt(Math.floor(Math.random() * charListLength));
  return string;
};

const nunjucksMixin = {
  /**
   * 处理 nunjucks 环境：配置自定义分隔符并注册所有模板 filter
   * @param {String} njkRootPath 模板目录路径
   * @returns {Object} nunjucks 环境实例
   */
  handleNunjucksEnv(njkRootPath) {
    const nunjucksEnv = new nunjucks.Environment(
      new CleanLoader(njkRootPath),
      {
        autoescape: false,
        tags: {
          blockStart: '<=%',
          blockEnd: '%=>',
          variableStart: '<=$',
          variableEnd: '$=>',
        },
      }
    );

    // ── 对象/数组序列化为 JS 变量字面量（通用；v4/v5/v6 注释块等仍用此 filter）──
    nunjucksEnv.addFilter('objToVar', function(obj, key, spaceCount = 4) {
      // 勿用 !obj：false / 0 / '' 等合法标量会被误判成 {}（如 HStack wrap: false → :wrap='{}'）
      if (obj === undefined || obj === null) {
        obj = {};
      }
      let spaceStr = '';
      for (let i = 0; i < spaceCount; i++) { spaceStr += ' '; }
      // 只对合法 JS 标识符去引号；含 : . - 等特殊字符的 key（如 :items / v-model）保留引号，否则生成非法语法
      const objStr = JSON.stringify(obj, null, 2).replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)":/g, '$1:').replace(/\n/g, `\n${spaceStr}`);
      if (key) {
        return `${key}: ${objStr}`;
      }
      return objStr;
    });

    // ── v6 专用：Vue 绑定写在 HTML 标准双引号属性内时的表达式片段（ :prop="…" 中间的 … ）──
    // · 字符串 → 单引号 JS 字面量，避免与属性外层 " 冲突（含 <$ … $> 占位，SSR 后仍为合法字符串字面量）
    // · 对象 / 数组 / 数字 / bool / null → 单行 JS 字面量（单引号串 + 合法 key），勿用 &quot;，否则 Vue 无法解析
    nunjucksEnv.addFilter('vueBindAttrValue', function(obj, spaceCount) {
      if (typeof spaceCount !== 'number') spaceCount = 0;
      if (typeof obj === 'string') {
        return '\'' + obj
          .replace(/\\/g, '\\\\')
          .replace(/'/g, '\\\'')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r') + '\'';
      }
      if (obj === undefined || obj === null) {
        return vueColonPropInlineJs(obj);
      }
      return vueColonPropInlineJs(obj);
    });

    /** v6 根 attrs：:foo / @bar / v-* 为 Vue 绑定，值为「表达式」时用本过滤器（勿套 JS 字符串引号） */
    nunjucksEnv.addFilter('vueAttrExpr', function(val) {
      if (val === undefined || val === null) return '';
      if (typeof val === 'boolean' || typeof val === 'number') return String(val);
      return String(val)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '&quot;');
    });
    nunjucksEnv.addFilter('isVueDynamicAttrKey', function(key) {
      if (!key || typeof key !== 'string') return false;
      const c0 = key[0];
      if (c0 === ':' || c0 === '@') return true;
      return key.startsWith('v-');
    });
    /** 对象/数组走 vueBindAttrValue；primitive 走 vueAttrExpr */
    nunjucksEnv.addFilter('shouldUseVueBindAttrValue', function(val) {
      return val !== null && typeof val === 'object';
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

    // ── 含函数的复杂变量序列化 ──
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
      return _.kebabCase(String(obj || ''));
    });

    /** standardConfig.page.menu → Vue 组件标签名（true → jh-menu，避免输出 <true />） */
    nunjucksEnv.addFilter('pageMenuTag', function(menu) {
      const tag = normalizeBakedPageMenu(menu);
      return tag === false ? '' : tag;
    });

    nunjucksEnv.addFilter('typeof', function(str) {
      return typeof str;
    });

    // ── HTML 标签属性序列化 ──
    const tagAttr = (keyStr, value, tag = '') => {
      let key = keyStr;
      if (!keyStr.startsWith(':') && !keyStr.startsWith('@') && !keyStr.includes('-')) {
        key = _.kebabCase(keyStr);
      }
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

    nunjucksEnv.addFilter('tagAttr', function(key, value, tag) {
      return tagAttr(key, value, tag);
    });

    const tagItemFormat = (item, indent = 0) => {
      if (!item) { return ''; }
      if (typeof item === 'string') { return ' '.repeat(indent + 2) + item; }
      if (!item.tag) { return ''; }
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
        result.forEach(res => { tag.push(tagItemFormat(res, indent).replace(/^\s+/, '')); });
      } else if (_.isObject(result)) {
        tag.push(tagItemFormat(result, indent).replace(/^\s+/, ''));
      } else {
        tag.push(result);
      }
      return tag.join('\n' + ' '.repeat(indent));
    });

    const isFormItemDisabled = (res) => {
      const readonly = res.readonly || false;
      const attrs = res.attrs || {};
      const quickAttrs = res.quickAttrs || [];
      const checkTrue = (value) => (value === true || value === 'true');
      return checkTrue(attrs.disabled) || checkTrue(attrs.readonly) || checkTrue(attrs[':disabled']) || checkTrue(attrs[':readonly']) || checkTrue(quickAttrs.includes('disabled')) || checkTrue(quickAttrs.includes('readonly')) || checkTrue(readonly);
    };

    nunjucksEnv.addFilter('isFormItemDisabled', function(res) {
      return isFormItemDisabled(res);
    });

    // ── 桌面端表单 item 格式化 ──
    nunjucksEnv.addFilter('formItemFormat', function(result, drawerKey = '') {
      const tag = [];
      const tagItemFormat = res => {
        if (!res.tag) { return ''; }
        if (!res.attrs) res.attrs = {};
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
        if (res.rules) { res.attrs.rules = res.rules; }
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
          if (key === 'v-model' && !value.includes('.') && drawerKey) { val = drawerKey + '.' + value; }
          if (key === 'v-model') { val = val ? val.replace(/this\./g, '') : val; }
          return tagAttr(key, val, res.tag);
        }).join(' ');
        if (res.value) {
          tagStr += `${quickAttrs}>${res.value}</${res.tag}>`;
        } else {
          tagStr += `${quickAttrs}></${res.tag}>`;
        }
        return tagStr;
      };
      if (_.isArray(result)) { result.forEach(res => { tag.push(tagItemFormat(res)); }); }
      else if (_.isObject(result)) { tag.push(tagItemFormat(result)); }
      else if (_.isString(result)) { tag.push(result); }
      return tag.join('\n                    ');
    });

    // ── 移动端表单 item 格式化 ──
    nunjucksEnv.addFilter('mobileFormItemFormat', function(result, drawerKey = 'updateItem') {
      const tag = [];
      const tagItemFormat = res => {
        if (!res.tag) { return ''; }
        if (!res.attrs) { res.attrs = {}; }
        if (!res.quickAttrs) { res.quickAttrs = []; }
        if (!res.quickAttrs.includes('dense')) { res.quickAttrs.push('dense'); }
        if (!res.quickAttrs.includes('single-line')) { res.quickAttrs.push('single-line'); }
        if (!res.quickAttrs.includes('filled') && res.tag == 'v-textarea') { res.quickAttrs.push('filled'); }

        const classList = res.attrs.class ? res.attrs.class.split(' ') : [ 'jh-v-input', 'mt-0', 'pt-0' ];
        if (res.model && res.label && [ 'v-text-field', 'v-select', 'v-textarea', 'v-autocomplete', 'v-combobox', 'v-file-input', 'v-radio', 'v-checkbox', 'v-switch', 'v-slider', 'v-range-slider', 'v-rating', 'v-date-picker', 'v-time-picker' ].includes(res.tag)) {
          if (!isFormItemDisabled(res)) {
            let prefix = '请输入';
            if ([ 'v-select', 'v-autocomplete', 'v-combobox' ].includes(res.tag)) { prefix = '请选择'; }
            if (!res.attrs.placeholder) {
              const placeholder = res.label.replace(/（.*）|（.*）|{{.*}}/g, '').replace(/<.*?>/g, '');
              res.attrs.placeholder = prefix + placeholder;
            }
          } else {
            classList.push('!text-gray-500');
          }
        }
        if ([ 'v-date-picker', 'jh-json-editor', 'v-textarea' ].includes(res.tag)) {
          if (!classList.includes('w-full')) { classList.push('w-full'); }
        } else {
          if (!classList.includes('w-2/3')) { classList.push('flex-1 inline-block'); }
        }
        res.attrs.class = classList.join(' ');

        let tagStr = `<${res.tag} `;
        if (res.model) { res.attrs['v-model'] = res.model.includes('.') ? res.model : drawerKey + '.' + res.model; }
        if (res.rules) { res.attrs.rules = res.rules; }
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
          if (key === 'v-model' && !value.includes('.')) { val = drawerKey + '.' + value; }
          if (key === 'v-model') { val = val ? val.replace(/this\./g, '') : val; }
          return tagAttr(key, val, res.tag);
        }).join(' ');
        if (res.value) {
          tagStr += `${quickAttrs}>${res.value}</${res.tag}>`;
        } else {
          tagStr += `${quickAttrs}></${res.tag}>`;
        }
        return tagStr;
      };
      if (_.isArray(result)) { result.forEach(res => { tag.push(tagItemFormat(res)); }); }
      else if (_.isObject(result)) { tag.push(tagItemFormat(result)); }
      else if (_.isString(result)) { tag.push(result); }
      return tag.join('\n                    ');
    });

    // ── 工具类 filter ──
    nunjucksEnv.addFilter('removeKey', function(data, keyList) {
      if (_.isArray(data)) { return _.map(data, function(item) { return _.omit(item, keyList); }); }
      else if (_.isObject(data)) { if (!data) return data; return _.omit(data, keyList); }
      return data;
    });
    nunjucksEnv.addFilter('ucfirst', function(str) { return str.charAt(0).toUpperCase() + str.slice(1); });
    nunjucksEnv.addFilter('lcfirst', function(str) { return str.charAt(0).toLowerCase() + str.slice(1); });
    nunjucksEnv.addFilter('isArray', function(val) { return _.isArray(val); });
    nunjucksEnv.addFilter('isObject', function(val) { return _.isObject(val); });
    nunjucksEnv.addFilter('isString', function(item) { return _.isString(item); });
    nunjucksEnv.addFilter('matchStr', function(str, regexStr) {
      if (!str) return '';
      const match = str.replace(/\n/, '\n').match(new RegExp(regexStr));
      return match && match.length > 1 ? match[1] : '';
    });
    nunjucksEnv.addFilter('componentName', function(p) { return p.split('/').pop().split('.')[0]; });
    nunjucksEnv.addFilter('componentHumpName', function(p) { return _.camelCase(p.split('/').pop().split('.')[0]); });
    nunjucksEnv.addFilter('componentUlName', function(p) {
      const componentName = p.split('/').pop().split('.')[0];
      return componentName.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/([A-Z])([A-Z][a-z])/g, '$1-$2').toLowerCase();
    });
    nunjucksEnv.addFilter('includeFormat', function(item) {
      if (!item) return '';
      if (_.isString(item)) return item;
      const { type, path } = item;
      if ([ 'js', 'script' ].includes(type)) { return `<script src="${path}"></script>`; }
      else if ([ 'css', 'style' ].includes(type)) { return `<link rel="stylesheet" href="${path}">`; }
      else if ([ 'html', 'component', 'include' ].includes(type)) { return `{% include "${path}" %}`; }
      else if (type === 'vueComponent') { return `Vue.component('${item.name}', ${item.component})`; }
      else if (type === 'vueUse') { return `Vue.use(${item.component})`; }
    });
    nunjucksEnv.addFilter('find', function(list, obj) {
      if (!list || !obj) return;
      return list.find(item => _.isMatch(item, obj));
    });
    nunjucksEnv.addFilter('filter', function(list, obj) {
      if (!list || !obj) return list;
      return list.filter(item => {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'string' && obj[key].startsWith('!')) {
              if (item[key] === obj[key].substring(1)) return false;
            } else {
              if (!_.isMatch(item, { [key]: obj[key] })) return false;
            }
          }
        }
        return true;
      });
    });
    nunjucksEnv.addFilter('includes', function(arr, val) { return arr?.includes(val); });

    // ── 随机 key 填充 ──
    nunjucksEnv.addFilter('fillConfigKey', function(config) {
      if (!config) return;
      const fillObjRandomKey = (obj) => {
        if (!_.isPlainObject(obj) || obj.key) return obj;
        let key;
        do { key = randomKey(); } while (/^\d/.test(key));
        obj.key = key;
        return obj;
      };
      if (_.isPlainObject(config)) { fillObjRandomKey(config); }
      if (_.isArray(config)) { config.map(item => fillObjRandomKey(item)); }
      return config;
    });

    nunjucksEnv.addFilter('fillConfigKeySuffix', function(config, suffix) {
      if (!config) return;
      const fillObjRandomKeySuffix = (obj) => {
        if (!_.isPlainObject(obj) || !obj.key) return obj;
        obj.key = _.camelCase(obj.key + suffix);
        return obj;
      };
      if (_.isPlainObject(config)) { fillObjRandomKeySuffix(config); }
      if (_.isArray(config)) { config.map(item => fillObjRandomKeySuffix(item)); }
      return config;
    });

    return nunjucksEnv;
  },
};

module.exports = nunjucksMixin;
