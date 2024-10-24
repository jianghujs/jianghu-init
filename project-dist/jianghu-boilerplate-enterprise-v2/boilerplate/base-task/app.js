'use strict';
const wecomUtil = require('./app/common/wecomUtil.js')

// app.js
class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  async serverDidReady() {
  }

  async didReady() {
    const { wecom } = this.app.config
    if (wecom) {
      await wecomUtil.initConfig(wecom);
    }
  }
}

module.exports = AppBootHook;

