'use strict';

const path = require('path');
const assert = require('assert');

const { middleware, middlewareMatch } = require('@jianghujs/jianghu/config/middlewareConfig');

const jianghuPathTemp = require.resolve('@jianghujs/jianghu');
const jianghuPath = path.join(jianghuPathTemp, '../');

module.exports = appInfo => {
  assert(appInfo);

  const appId = 'data_repository';
  const uploadDir = path.join(appInfo.baseDir, 'upload');
  const downloadBasePath = `/${appId}/upload`;

  return {
    // egg-jianghu 配置
    appId,
    appTitle: '江湖演示-企业级',
    appLogo: `${appId}/public/img/logo.png`,
    appType: 'multiApp', // single: 单应用; multiApp: 多应用
    appDirectoryLink: '/',
    indexPage: `/${appId}/page/tableSyncConfig`,
    loginPage: `/${appId}/page/login`,
    helpPage: `/${appId}/page/help`,
    uploadDir,
    downloadBasePath,
    static: {
      maxAge: 0,
      buffer: false,
      preload: false,
      maxFiles: 0,
      dir: [
        { prefix: `/${appId}/public/`, dir: path.join(appInfo.baseDir, 'app/public') },
        { prefix: `/${appId}/public/`, dir: path.join(jianghuPath, 'app/public') },
        { prefix: `/${appId}/upload/`, dir: uploadDir },
      ],
    },
    view: {
      defaultViewEngine: 'nunjucks',
      mapping: { '.html': 'nunjucks' },
      root: [
        path.join(appInfo.baseDir, 'app/view'),
        path.join(jianghuPath, 'app/view'),
      ].join(','),
    },
    middleware,
    ...middlewareMatch,


    // 自定义配置
    dataSyncStatus: '启用', // 是否启用同步，启用/禁用

  };

};
