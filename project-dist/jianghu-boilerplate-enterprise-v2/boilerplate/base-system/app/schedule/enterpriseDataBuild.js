'use strict';
const _ = require('lodash');


module.exports = app => {
  return {
    schedule: {
      immediate: true,
      cron: "0 12,20 * * *", // 每天 12点、20点 执行 
      type: 'worker', // 只有一个worker执行
      disable: false,
    },
    async task(ctx) {
      const startTime = new Date().getTime();
      const { jianghuKnex, logger } = app;

      await ctx.service.app.removeRelationByExpire();
      await ctx.service.app.buildUserGroupRolePageByCommonAuth();
      await ctx.service.app.buildUserApp();
      logger.info('[schedule/enterpriseAuthBuild.js]', { useTime: `${new Date().getTime() - startTime}/ms` });
    },
  };
};
