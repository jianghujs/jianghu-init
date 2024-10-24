'use strict';

module.exports = app => {
  return {
    schedule: {
      immediate: true,
      interval: '2m', // 1 分钟间隔; 2m 30s
      type: 'worker', // 只有一个worker执行
      disable: ['启用', 'enable'].indexOf(app.config.dataSyncStatus) == -1,
    },
    async task(ctx) {
      const startTime = new Date().getTime();
      const { logger } = app;
      await ctx.service.tableMerge.doTableMerge({ useSyncTimeSlotFilter: true });
      const endTime = new Date().getTime();
      logger.info('[tableMergeSchedule.js]', { useTime: `${endTime - startTime}/ms` });
    },
  };
};
