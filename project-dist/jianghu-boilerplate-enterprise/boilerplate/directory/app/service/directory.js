'use strict';

const Service = require('egg').Service;

class DirectoryService extends Service {

  async getDirectoryList() {
    const { jianghuKnex } = this.app;
    const { userInfo } = this.ctx;
    const { userAppList } = userInfo;
    const appIdList = userAppList.map(userApp => userApp.appId);
    const rows = await jianghuKnex('directory')
      .orWhere(function() {
        this.whereIn('appId', appIdList);
      })
      .orWhere('accessType', 'public')
      .select();
    return { rows };
  }

}

module.exports = DirectoryService;
