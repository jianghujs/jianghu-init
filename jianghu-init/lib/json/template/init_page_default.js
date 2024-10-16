'use strict';
const path = require('path');
const fs = require('fs');
const CommandBase = require('../../command_base.js');
const InitPage = require('../init_page.js');

class InitPageDefault extends CommandBase {
  async run(cwd, pageTypeObj) {
    this.initialize(cwd, pageTypeObj);
    await this.setupDatabase();
    await this.copyTemplateFiles();
    await this.renderAndExecuteContent();
  }

  initialize(cwd, pageTypeObj) {
    this.cwd = cwd;
    this.templateName = pageTypeObj.pageId.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    this.pageId = pageTypeObj.pageId;
    this.info(`初始化完成，当前 pageId: ${this.pageId}`);
  }

  async setupDatabase() {
    await this.checkPath();
    this.dbSetting = this.readDbConfigFromFile();
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    this.success(`数据库连接初始化成功，当前 pageId: ${this.pageId}`);
  }

  async copyTemplateFiles() {
    const templateDir = path.join(__dirname, '../../../page-template-json/template', this.templateName);
    const targetDir = './app';

    this.info(`开始复制模板文件，当前 pageId: ${this.pageId}`);
    await this.copyFile(templateDir, targetDir, `${this.pageId}.js`, 'view/init-json/page');
    await this.copyDirectory(templateDir, targetDir, 'service');
    await this.copyDirectory(templateDir, targetDir, 'component', 'view/component');
    this.success(`模板文件复制完成，当前 pageId: ${this.pageId}`);
  }

  async renderAndExecuteContent() {
    this.info(`开始渲染和执行内容，当前 pageId: ${this.pageId}`);
    const content = await this.renderJson();
    if (content) {
      const jsConfig = eval(content);
      new InitPage().renderContent(jsConfig);
      this.success(`内容渲染完成，当前 pageId: ${this.pageId}`);
    } else {
      this.warning(`未找到内容，当前 pageId: ${this.pageId}`);
    }
  }

  async renderJson() {
    const templateDir = path.join(__dirname, '../../../page-template-json/template', this.templateName);
    const targetPath = path.join('./app', 'view', 'init-json', 'page', `${this.pageId}.js`);

    await this.executeSqlFile(path.join(templateDir, 'init.sql'));

    return fs.existsSync(targetPath) ? fs.readFileSync(targetPath, 'utf-8') : '';
  }

  async copyFile(sourceDir, targetDir, fileName, subDir = '') {
    const sourcePath = path.join(sourceDir, fileName);
    const targetPath = path.join(targetDir, subDir, fileName);

    if (!fs.existsSync(sourcePath)) {
      this.warning(`源文件 ${sourcePath} 不存在，当前 pageId: ${this.pageId}`);
      return;
    }

    await this.ensureDirectoryExistence(targetPath);
    fs.copyFileSync(sourcePath, targetPath);
    this.success(`已复制 ${fileName} 文件，当前 pageId: ${this.pageId}`);
  }

  async copyDirectory(sourceDir, targetDir, dirName, targetSubDir = '') {
    const sourcePath = path.join(sourceDir, dirName);
    const targetPath = path.join(targetDir, targetSubDir || dirName);

    if (!fs.existsSync(sourcePath)) {
      this.warning(`源目录 ${sourcePath} 不存在，当前 pageId: ${this.pageId}`);
      return;
    }

    await this.ensureDirectoryExistence(targetPath);
    this.copyRecursively(sourcePath, targetPath);
    this.success(`已复制 ${dirName} 目录下的所有文件和文件夹，当前 pageId: ${this.pageId}`);
  }

  copyRecursively(src, dest) {
    if (fs.statSync(src).isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(childItemName => {
        this.copyRecursively(path.join(src, childItemName), path.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  }

  async executeSqlFile(filePath) {
    if (!fs.existsSync(filePath)) {
      this.warning(`SQL文件 ${filePath} 不存在，当前 pageId: ${this.pageId}`);
      return;
    }

    const sql = fs.readFileSync(filePath, 'utf-8')
      .replace(/\{\{pageId}}/g, this.pageId);

    for (const line of sql.split('\n')) {
      if (line.trim() && !line.startsWith('--')) {
        try {
          await this.knex.raw(line);
        } catch (error) {
          this.error(`SQL执行失败: ${line}, 错误: ${error.message}，当前 pageId: ${this.pageId}`);
        }
      }
    }
    this.success(`SQL执行成功，当前 pageId: ${this.pageId}`);
  }

  async ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) return true;
    await this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  toCamelCase(str) {
    return str.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  }
}

module.exports = InitPageDefault;
