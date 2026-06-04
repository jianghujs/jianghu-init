'use strict';
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const renderMixin = {
  /**
   * 获取 config 中所有需要生成的组件列表（组件类型 component / jh-json-editor 等）
   * @param {Object} jsonConfig
   * @returns {Array}
   */
  getConfigComponentList(jsonConfig) {
    const { table, pageId, actionContent = [], pageContent = [] } = jsonConfig;
    const componentList = [];
    const componentMap = {
      recordHistory:          { filename: 'tableRecordHistory', bind: { table, pageId, ':id': '{{key}}Item.id' }, sqlMap: { table, pageId } },
      tableRecordHistory:     { filename: 'tableRecordHistory', bind: { table, pageId, ':id': '{{key}}Item.id' }, sqlMap: { table, pageId } },
      vueJsonEditor:          { filename: 'vueJsonEditor', model: '', bind: { mode: 'code', expandedOnStart: false } },
      tableAttachment:        { filename: 'tableAttachment', bind: { table, pageId, ':id': '{{key}}Item.id', fileType: '[]', fileSubType: '[]' }, sqlMap: { table, pageId, insertBeforeHook: '' } },
      tableColumnSettingBtn:  { filename: 'tableColumnSettingBtn', bind: {} },
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
                if (_.isString(bindItem)) { bind[':' + bindItem.replace(/^:/, '')] = `${itemKey}Item.${bindItem}`; }
              });
            }
            item.bind = Object.assign({}, bind, item.attrs || {});
          }
          componentList.push(item);
        } else if (item.type === 'form' && item.formItemList) {
          if (item.formItemList.some(e => e.tag === 'jh-json-editor')) {
            componentList.push({ componentPath: 'vueJsonEditor' });
          }
        }
      });
    };

    const drawerList = actionContent.filter(e => [ 'jh-create-drawer', 'jh-update-drawer', 'jh-detail-drawer', 'jh-drawer' ].includes(e.tag));
    const tableColumnSetting = pageContent.filter(e => [ 'jh-table' ].includes(e.tag)).filter(item => item.showTableColumnSettingBtn);
    if (tableColumnSetting.length) { componentList.push({ type: 'component', componentPath: 'tableColumnSettingBtn' }); }
    drawerList.forEach(drawer => { processContentList(drawer.contentList, drawer.key); });
    return _.uniqBy(componentList, 'componentPath');
  },

  /**
   * 渲染依赖组件文件到 app/view/component/
   * @param {Object} jsonConfig
   * @param {Boolean} devModel
   */
  async renderComponent(jsonConfig, devModel = false) {
    const componentList = this.getConfigComponentList(jsonConfig);
    if (!componentList.length) return;

    const componentPath = `${path.join(__dirname, '../../../')}page-template-json/component`;
    fs.mkdirSync('./app/view/component', { recursive: true });

    const { y, n } = this.argv || {};
    for (const item of componentList) {
      const targetFilePath = `./app/view/component/${item.componentPath}.html`;
      if ([ 'tableRecordHistory', 'vueJsonEditor', 'jhFile', 'tableColumnSettingBtn' ].includes(item.componentPath)) {
        if (fs.existsSync(targetFilePath)) {
          if (devModel) continue;
          if (n) { this.warning(`跳过 ${item.componentPath} 组件的生成`); continue; }
          if (!y) {
            const overwrite = await this.readlineMethod(`组件 ${item.componentPath} 已经存在，是否覆盖?(y/N)`, 'n');
            if ((overwrite !== 'y' && overwrite !== 'Y')) { this.warning(`跳过 ${item.componentPath} 组件的生成`); continue; }
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
   * 生成 common service（idGenerate 依赖时）
   * @param {Object} jsonConfig
   * @param {Boolean} dev
   */
  async renderService(jsonConfig, dev = false) {
    const { idGenerate = false, standardConfig } = jsonConfig;
    const autoId = standardConfig?.features?.autoId;
    if (!idGenerate && !autoId) return;

    const templatePath = `${path.join(__dirname, '../../../')}page-template-json/service`;
    const templateTargetPath = `${templatePath}/${autoId ? 'autoId' : 'common'}.js`;
    const servicePath = './app/service';
    fs.mkdirSync(servicePath, { recursive: true });

    const serviceFilePath = `${servicePath}/${autoId ? 'autoId' : 'common'}.js`;
    const { y, n } = this.argv || {};
    if (fs.existsSync(serviceFilePath)) {
      if (dev) return;
      if (n) { this.warning('跳过 common service 的生成'); return false; }
      if (!y) {
        const overwrite = await this.readlineMethod('common service 已经存在，是否覆盖?(y/N)', 'n');
        if (overwrite !== 'y' && overwrite !== 'Y') { this.warning('跳过 common service 的生成'); return false; }
      }
    }
    this.notice(`[5/5]${y ? '默认' : ''}开始生成 common service`);
    fs.copyFileSync(templateTargetPath, serviceFilePath);
  },

  /**
   * 执行 shell 命令（静默失败）
   * @param {String} command
   * @returns {Promise<String>}
   */
  async executeCommand(command) {
    return new Promise(resolve => {
      exec(command, (error, stdout) => { resolve(stdout); });
    });
  },
};

module.exports = renderMixin;
