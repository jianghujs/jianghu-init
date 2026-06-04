'use strict';
const _ = require('lodash');
const handleJsonConfigV7 = require('./handle_json_config_v7');
const handleJsonConfigV6 = require('./handle_json_config_v6');
const handleJsonConfigLegacy = require('./handle_json_config_legacy');

const configMixin = {
  /**
   * 处理配置文件数据：标准化所有版本（v1–v6）的 jsonConfig，注入快捷判断字段
   * @param {Object} jsonConfig 配置对象
   */
  handleJsonConfig(jsonConfig) {
    // 自动从 EggJS config.default.js 读取 jhId，只在 config 里未显式设置时才注入
    if (!jsonConfig.jhId && this.readJhIdFromEggConfig) {
      const jhId = this.readJhIdFromEggConfig();
      if (jhId) jsonConfig.jhId = jhId;
    }

    // actionContent：允许 string（整段 HTML），在 v6 解析与其它分支前统一为数组
    if (jsonConfig.actionContent == null || jsonConfig.actionContent === '') {
      jsonConfig.actionContent = [];
    } else if (typeof jsonConfig.actionContent === 'string') {
      jsonConfig.actionContent = [jsonConfig.actionContent];
    } else if (!Array.isArray(jsonConfig.actionContent)) {
      jsonConfig.actionContent = [];
    }

    // v7：纯声明 JSON -> 标准配置 -> legacyConfig（并 early return，不跑旧版扫描逻辑）
    const handledByV7 = handleJsonConfigV7.call(this, jsonConfig);
    if (handledByV7) return;

    // v6：纯声明 JSON -> 标准配置 -> legacyConfig（并 early return，不跑旧版扫描逻辑）
    const handledByV6 = handleJsonConfigV6.call(this, jsonConfig);
    if (handledByV6) return;

    // legacy：保留原逻辑
    handleJsonConfigLegacy.call(this, jsonConfig);
  },

  /**
   * 处理 v3/v4 版本特性：补全 jh-scene / jh-order / jh-search 的默认 data
   * @param {Object} jsonConfig 配置对象
   */
  processingVersionData(jsonConfig) {
    const { version, pageType } = jsonConfig;
    if (![ 'v4', 'v3' ].includes(version)) return;

    for (const content of jsonConfig.headContent) {
      if (content.tag === 'jh-scene') {
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
          sceneCreateForm: {}, serverSceneSearchWhere: {}, serverSceneSearchWhereIn: {},
          serverSceneSearchWhereLike: {}, serverSceneSearchWhereOptions: [],
          serverSceneSearchWhereOrOptions: [], currentSceneId: '',
          defaultSceneList: [], customSceneList: [], maxSceneDisplay: 5,
        };
        content.colAttrs = Object.assign({ class: 'pt-3' }, content.colAttrs || {});
        content.data = Object.assign(defaultData, content.data || {});
      }
      if (pageType === 'jh-mobile-page' && content.tag === 'jh-order') {
        if (!content.data) {
          this.errorLog([
            '** v3 版本中 jh-order 组件必须配置 data 属性 **',
            '@tableDataOrder {array} 当前排序',
            '@tableDataOrderList {array} 排序列表',
          ]);
        }
        content.data = Object.assign({
          tableDataOrder: [{ column: 'operationAt', order: 'desc' }],
          tableDataOrderList: [ { text: '最新更新↓', value: [{ column: 'operationAt', order: 'desc' }] } ],
        }, content.data || {});
      }
      if (content.tag === 'jh-search') {
        if (!content.data) {
          this.notice("自定义使用：{ tag: 'jh-search', data: { serverSearchWhere: {}, serverSearchWhereIn: {}, serverSearchWhereLike: {} } }");
        }
        content.data = Object.assign({
          serverSearchWhere: {}, serverSearchWhereIn: {}, serverSearchWhereLike: {}, maxSearchDisplay: 5,
        }, content.data || {});
      }
    }

    jsonConfig.pageContent.forEach(content => {
      if (content.tag === 'jh-list') {
        content.props = Object.assign({ rightArrow: true }, content.props || {});
      }
    });

    if (version === 'v4' && [ 'jh-mobile-page', 'jh-mobile-component' ].includes(pageType)) {
      jsonConfig.actionContent.forEach(content => {
        if ([ 'jh-create-drawer', 'jh-update-drawer', 'jh-detail-drawer', 'jh-drawer' ].includes(content.tag)) {
          content.contentList.forEach(item => {
            if (item.type === 'form') {
              item.formItemList.forEach((formItem, formIndex) => {
                if (_.isObject(formItem)) {
                  if (!formItem.colAttrs) formItem.colAttrs = {};
                  if (!formItem.colAttrs?.class) {
                    formItem.colAttrs.class = 'flex flex-wrap items-start' + (formIndex != 0 ? ' border-t' : '') + ' py-2';
                  }
                }
              });
            }
          });
        }
      });
    }
  },

  /**
   * 格式化错误日志，带边框输出
   * @param {String|Array} error 错误信息
   */
  errorLog(error) {
    this.error('┏----------------------------------------------------------┓');
    if (Array.isArray(error)) {
      for (const item of error) { this.error('  ' + item); }
    } else {
      this.error('  ' + error);
    }
    this.error('┗----------------------------------------------------------┛');
  },

  /**
   * 标准化 doUiAction 方法链中的单个 item 为可执行字符串
   * @param {String} item
   * @returns {String}
   */
  processUiActionItem(item) {
    item = item.replace(/this\./, '').replace(/^async\./, 'this.').replace(/^await\./, 'await this.');
    if (!item.includes('this.')) { item = 'await this.' + item; }
    if (item.includes('doUiAction.')) {
      const prefixKey = item.includes('await ') ? 'await ' : '';
      item = item.replace(/\(.*\)/, '').replace(/(await\s+)?this\./, '').replace(/doUiAction\./, '') + '\', uiActionData)';
      item = `${prefixKey}this.doUiAction('${item}`;
    } else {
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
   * 生成基础 uiAction 配置（basicUiActionConfig）和方法列表（basicUiActionList）
   * @param {Object} config
   */
  getBasicConfig(config) {
    const basicUiActionConfig = this.basicUiAction(config);
    return {
      basicUiActionConfig,
      basicUiActionList: _.flatten(_.values(basicUiActionConfig)),
    };
  },

  /**
   * 根据 config feature flags 生成默认 doUiAction 方法链配置
   * @param {Object} config
   */
  basicUiAction({ version, common, hasJhTable, hasJhList, hasCreateDrawer, hasCreateSubmit, hasUpdateDrawer, hasDelete, hasUpdateSubmit, hasDetailDrawer }) {
    let defaultUiAction = {
      getTableData:    [ 'getTableData' ],
      startCreateItem: [ 'prepareCreateFormData', 'openCreateDrawer' ],
      createItem:      [ 'prepareCreateValidate', 'confirmCreateItemDialog', 'prepareDoCreateItem', 'doCreateItem', 'closeCreateDrawer', 'getTableData' ],
      startUpdateItem: [ 'prepareUpdateFormData', 'openUpdateDrawer' ],
      updateItem:      [ 'prepareUpdateValidate', 'confirmUpdateItemDialog', 'prepareDoUpdateItem', 'doUpdateItem', 'closeUpdateDrawer', 'getTableData' ],
      startDetailItem: [ 'prepareDetailFormData', 'openDetailDrawer' ],
      deleteItem:      [ 'prepareDeleteFormData', 'confirmDeleteItemDialog', 'prepareDoDeleteItem', 'doDeleteItem', 'getTableData' ],
    };
    if (version) {
      const uiAction = {
        getTableData: [ 'prepareTableParamsDefault', 'prepareTableParams', 'getTableData', 'formatTableData' ],
        createItem:   [ 'prepareCreateValidate', 'confirmCreateItemDialog', 'prepareDoCreateItem', 'doCreateItem', 'closeCreateDrawer', 'doUiAction.getTableData' ],
        updateItem:   [ 'prepareUpdateValidate', 'confirmUpdateItemDialog', 'prepareDoUpdateItem', 'doUpdateItem', 'closeUpdateDrawer', 'doUiAction.getTableData' ],
        deleteItem:   [ 'prepareDeleteFormData', 'confirmDeleteItemDialog', 'prepareDoDeleteItem', 'doDeleteItem', 'doUiAction.getTableData' ],
      };
      defaultUiAction = Object.assign(defaultUiAction, uiAction);
      for (const key in defaultUiAction) {
        const uiActionArr = defaultUiAction[key];
        for (let [ index, item ] of uiActionArr.entries()) {
          item = this.processUiActionItem(item);
          defaultUiAction[key][index] = item;
        }
      }
    }
    
    if (!hasJhTable && !hasJhList) { delete defaultUiAction.getTableData; }
    if (!hasCreateDrawer) { delete defaultUiAction.startCreateItem; }
    if (!hasCreateSubmit) { delete defaultUiAction.createItem; }
    if (!hasUpdateDrawer) { delete defaultUiAction.startUpdateItem; }
    if (!hasUpdateSubmit) { delete defaultUiAction.updateItem; }
    if (!hasDetailDrawer) { delete defaultUiAction.startDetailItem; }
    if (!hasDelete) { delete defaultUiAction.deleteItem; }
    for (const key in defaultUiAction) {
      if (common.doUiAction[key]) { delete defaultUiAction[key]; }
    }
    return defaultUiAction;
  },
};

module.exports = configMixin;
