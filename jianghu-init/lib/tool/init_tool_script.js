'use strict';
const path = require('path');
const fs = require('fs');
const CommandBase = require('../command_base.js');

class initToolScript extends CommandBase {
  async run(cwd, pageTypeObj) {
    this.initialize(cwd, pageTypeObj);
    await this.setupDatabase();
    await this.copyTemplateFiles();
  }

  initialize(cwd, pageTypeObj) {
    this.cwd = cwd;
    this.scriptName = pageTypeObj.value;
    this.info('✅ 获取模板信息');
  }

  async setupDatabase() {
    await this.checkPath();
    this.dbSetting = this.readDbConfigFromFile();
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    this.info('✅ 数据库连接初始化');
  }

  async copyTemplateFiles() {
    const templateDir = path.join(__dirname, '../../page-template-script');
    const targetDir = './_script';
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const sourceFile = path.join(templateDir, `${this.scriptName}.js`);
    const targetFile = path.join(targetDir, `${this.scriptName}.js`);
    
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, targetFile);
      this.info(`✅ 已复制文件 ${this.scriptName}.js 到 _script 目录`);
    } else {
      this.warning(`源文件 ${sourceFile} 不存在`);
    }
  }

 
}

module.exports = initToolScript;
