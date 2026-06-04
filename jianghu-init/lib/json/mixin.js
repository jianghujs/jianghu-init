'use strict';
/**
 * mixin：1table-page / 1table-component 共用方法集
 *
 * 子模块职责：
 *   nunjucks_mixin  —— handleNunjucksEnv + 所有 Nunjucks filter
 *   config_mixin    —— handleJsonConfig / processingVersionData / doUiAction 工具
 *   db_mixin        —— checkPage / handleOtherResource / getTableFields / checkTableFields / modifyComponentResource*
 *   render_mixin    —— getConfigComponentList / renderComponent / renderService / executeCommand
 */
const nunjucksMixin = require('./mixin/nunjucks_mixin');
const configMixin   = require('./mixin/config_mixin');
const dbMixin       = require('./mixin/db_mixin');
const renderMixin   = require('./mixin/render_mixin');

module.exports = Object.assign({}, nunjucksMixin, configMixin, dbMixin, renderMixin);
