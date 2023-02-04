'use strict';

const { middleware, middlewareMatch } = require('@jianghujs/jianghu/config/middlewareConfig');
const path = require('path');
const assert = require('assert');
const eggJianghuPathTemp = require.resolve('@jianghujs/jianghu');
const eggJianghuPath = path.join(eggJianghuPathTemp, '../');

module.exports = appInfo => {
  assert(appInfo);

  const appId = '{{name}}';
  const uploadDir = path.join(appInfo.baseDir, 'upload');
  const downloadBasePath = `/${appId}/upload`;

  return {
    appId,
    debug: false,
    appTitle: '江湖演示-进阶',
    appLogo: `${appId}/public/img/logo.png`,
    appType: 'single', // single: 单应用; multiApp: 多应用
    appDirectoryLink: '/',
    indexPage: `/${appId}/page/userManagement`,
    loginPage: `/${appId}/page/login`,
    helpPage: `/${appId}/page/help`,
    uploadDir,
    downloadBasePath,
    primaryColor: "#4caf50",
    primaryColorA80: "#EEF7EE",
    static: {
      maxAge: 0,
      buffer: false,
      preload: false,
      maxFiles: 0,
      dir: [
        { prefix: `/${appId}/public/`, dir: path.join(appInfo.baseDir, 'app/public') },
        { prefix: `/${appId}/public/`, dir: path.join(eggJianghuPath, 'app/public') },
        { prefix: `/${appId}/upload/`, dir: uploadDir },
      ],
    },
    view: {
      defaultViewEngine: 'nunjucks',
      mapping: { '.html': 'nunjucks' },
      root: [
        path.join(appInfo.baseDir, 'app/view'),
        path.join(eggJianghuPath, 'app/view'),
      ].join(','),
    },
    middleware,
    ...middlewareMatch,
    pageDocPackage: {
      match(ctx) { return false; },
    },
    pageDocUserInfo: {
      match(ctx) {
        // url 格式符合 /appId/page/pageId 或 /appId/pageDoc/pageId.md
        return (ctx.request.method === 'GET' || ctx.request.method === 'HEAD')
          && ctx.request.path.startsWith(`/${ctx.app.config.appId}/pageDoc`);
      },
    },
    pageDocAuthorization: {
      match(ctx) { return false; },
    },
  };

};
