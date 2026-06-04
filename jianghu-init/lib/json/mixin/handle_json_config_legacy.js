'use strict';
const _ = require('lodash');

// handleJsonConfig 内部使用：检测 @click 是否调用了指定 uiAction
const checkClick = (obj, action) => {
  if (!obj || !action) return false;
  const reg = new RegExp(`doUiAction\\(['"]${action || ''}['"]`);
  return obj && obj.attrs && obj.attrs['@click'] && reg.test(obj.attrs['@click']);
};

/**
 * legacy（v1-v5）配置标准化：保留原逻辑不改动
 * 注意：此函数依赖 this.warning / this.notice / this.processingVersionData / this.getBasicConfig / this.processUiActionItem 等 mixin 方法
 * @param {Object} jsonConfig
 */
module.exports = function handleJsonConfigLegacy(jsonConfig) {
  if (!jsonConfig.template) { jsonConfig.template = 'jhTemplateV4'; }
  if (!jsonConfig.headContent) { jsonConfig.headContent = []; }
  if (!jsonConfig.common) { jsonConfig.common = []; }
  if (!jsonConfig.pageContent) { jsonConfig.pageContent = []; }
  if (!jsonConfig.hasOwnProperty('jhMenu')) { jsonConfig.jhMenu = true; }
  if (!jsonConfig.hasOwnProperty('vuetify')) { jsonConfig.vuetify = ''; }

  let { includeList, actionContent, pageContent = [], headContent = [], common = {}, version } = jsonConfig;

  if (!common.doUiAction) { common.doUiAction = []; }

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
  if (includeList && includeList.length > 0) { jsonConfig.hasIncludeList = true; }
  if (headContent && headContent.length > 0) { jsonConfig.hasHeadContent = true; }
  if (pageContent && pageContent.length > 0) { jsonConfig.hasPageContent = true; }

  const findJhTable = pageContent.find(e => [ 'jhTable', 'jh-table' ].includes(e.tag));
  if (findJhTable) {
    jsonConfig.pageContent.forEach(content => {
      if (content.tag === 'jh-table') {
        if (content.value && _.isArray(content.value) && content.value.find(e => e.text && e.value && e.width)) {
          this.warning('已过期旧版headers: key vlaue');
          content.headers = content.value;
        }
        if (content.slot) { content.value = content.slot; }
        const defaultColAttrs = { cols: 12 };
        if (!content.colAttrs) { content.colAttrs = Object.assign({}, defaultColAttrs, content.colAttrs); }
        const defaultCardAttrs = { class: '' };
        if (!content.cardAttrs) { content.cardAttrs = Object.assign({}, defaultCardAttrs, content.cardAttrs); }
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
    if (findJhTable.showTableColumnSettingBtn) { jsonConfig.hasShowTableColumnSettingBtn = true; }
  }

  const hasJhList = pageContent.find(e => e.tag === 'jh-list');
  if (hasJhList) {
    const index = hasJhList.headers.findIndex(e => !!e.isTitle);
    jsonConfig.pageContent.forEach(content => {
      if (content.tag === 'jh-list') {
        if (index !== -1) {
          content.headers = content.headers || common.data.headers;
          content.headers.forEach((e, i) => {
            if (index !== i) { e.isTitle = false; } else { e.isSimpleMode = true; }
          });
        } else {
          content.headers[0].isTitle = true;
          content.headers[0].isSimpleMode = true;
        }
      }
    });
    jsonConfig.hasJhList = jsonConfig.pageContent.find(e => e.tag === 'jh-list');
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
    const idGenerateItem = createDrawer.contentList.find(e => e.type === 'form' && e.formItemList.some(item => !!item.idGenerate));
    if (idGenerateItem) {
      jsonConfig.idGenerate = idGenerateItem.formItemList.find(item => !!item.idGenerate).idGenerate;
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
    for (const drawer of jsonConfig.actionContent) {
      if (drawer.tag === 'jh-update-drawer' || drawer.tag === 'jh-create-drawer') {
        for (const content of drawer.contentList) {
          if (content.type === 'form') {
            content.formItemList.forEach(item => {
              if (_.isString(item)) return;
              if (item.colsAttrs) { item.colAttrs = item.colsAttrs; }
              if (!item.colAttrs) item.colAttrs = {};
              if (jsonConfig.pageType === 'jh-mobile-page' && !!item.model) {
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

  if ((headContent.find(e => e.tag === 'jh-page-title') || {}).helpBtn) { jsonConfig.hasHelpDrawer = true; }

  if (headContent.find(e => e.tag === 'jh-search')) {
    jsonConfig.hasSearch = true;
    for (const content of headContent) {
      if (content.tag === 'jh-search' && content.value) {
        content.value.forEach(item => { if (item.colsAttrs) { item.colAttrs = item.colsAttrs; } });
      }
    }
    if (jsonConfig.pageType === 'jh-mobile-page' && headContent.find(e => e.tag === 'jh-search').advSearchList) {
      jsonConfig.hasAdvSearch = true;
      jsonConfig.advSearchList = headContent.find(e => e.tag === 'jh-search').advSearchList;
    }
  }

  const hasJhScene = headContent.find(e => e.tag === 'jh-scene');
  if (hasJhScene) { jsonConfig.hasJhScene = true; }

  this.processingVersionData(jsonConfig);
  Object.assign(jsonConfig, this.getBasicConfig(jsonConfig));

  if (jsonConfig.common.doUiAction) {
    for (const key in jsonConfig.common.doUiAction) {
      const uiAction = jsonConfig.common.doUiAction[key];
      for (let [ index, item ] of uiAction.entries()) {
        item = this.processUiActionItem(item);
        jsonConfig.common.doUiAction[key][index] = item;
      }
    }
  }
};

