'use strict';

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
      const { logger } = app;
      await ctx.service.app.updatePageList();
      logger.info('[schedule/appPageList.js]', { useTime: `${new Date().getTime() - startTime}/ms` });
    },
  };
};
