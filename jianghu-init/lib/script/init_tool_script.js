'use strict';
const path = require('path');
const fs = require('fs');
const CommandBase = require('../command_base.js');
const Module = require('module');
class initToolScript extends CommandBase {
  async run(cwd, pageTypeObj) {
    this.initialize(cwd, pageTypeObj);
    await this.setupDatabase();

    // 根据参数决定是复制脚本文件还是直接执行
    if (pageTypeObj?.exec) {
      if (pageTypeObj.isExec === false) {
        this.error(`暂不支持 exec 直接执行，请手动下载后执行脚本 ${this.scriptName}.js`);
        return;
      }
      await this.executeScriptDirectly();
    } else {
      await this.copyTemplateFiles();
    }
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

  async executeScriptDirectly() {
    const templateDir = path.join(__dirname, '../../page-template-script');
    const sourceFile = path.join(templateDir, `${this.scriptName}.js`);
    const targetDir = './app';
    // 保存当前工作目录
    const originalDir = process.cwd();
    
    // 不使用 eval，而是直接 require 脚本文件
    try {
      const scriptString = fs.readFileSync(sourceFile, 'utf-8');
      await this.runInTargetDir(scriptString, targetDir);
      
      this.info(`✅ 脚本 ${this.scriptName}.js 执行完成`);
    } catch (error) {
      this.error(`执行脚本 ${this.scriptName}.js 时出错: ${error.message}`);
      console.error(error);
    }
  }

  async runInTargetDir(code, targetDir) {
    // 创建虚拟文件名
    return new Promise((resolve) => {
      const filename = path.join(targetDir, 'virtual.js');
      
      // 动态生成新模块
      const mod = new Module(filename, module.parent);
      mod.filename = filename;
      mod.paths = Module._nodeModulePaths(targetDir); // 关键：设置模块查找路径
      
      // 劫持 process.exit 防止退出
      const originalExit = process.exit;
      process.exit = (code) => {
        process.exit = originalExit; // 恢复
        resolve(code);
      };

      // 在目标目录的上下文中编译代码
      mod._compile(code, filename);
    });
  }
}

module.exports = initToolScript;
