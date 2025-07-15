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
    this.info('✅ 获取模板信息');
  }

  async setupDatabase() {
    await this.checkPath();
    this.dbSetting = await this.readDbConfigFromFile();
    this.app = this.dbSetting.database;
    await this.getKnex(this.dbSetting);
    this.info('✅ 数据库连接初始化');
  }

  async copyTemplateFiles() {
    const templateDir = path.join(__dirname, '../../../page-template-json/template', this.templateName);
    const targetDir = './app';

    await this.copyFile(templateDir, targetDir, `${this.pageId}.js`, 'view/init-json/page');
    if (fs.existsSync(`${templateDir}/service`)) {
      try {
        await this.copyDirectory(templateDir, targetDir, 'service');
        this.info('✅ 生成 service 依赖文件');
      } catch (err) {
        this.warning(`无法复制 service 文件: ${err.message}`);
      }
    }

    if (fs.existsSync(`${templateDir}/component`)) {
      try {
        await this.copyDirectory(templateDir, targetDir, 'component', 'view/component');
        this.info('✅ 生成 component 依赖文件');
      } catch (err) {
        this.warning(`无法复制 component 文件: ${err.message}`);
      }
    }

    if (fs.existsSync(`${templateDir}/common`)) {
      try {
        await this.copyDirectory(templateDir, targetDir, 'common', 'common');
        this.info('✅ 生成 common 依赖文件');
      } catch (err) {
        this.warning(`无法复制 common 文件: ${err.message}`);
      }
    }

    if (fs.existsSync(`${templateDir}/script.js`)) {
      const scriptPath = path.join(templateDir, 'script.js');
      const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
      // eslint-disable-next-line no-eval
      eval(`(function() { ${scriptContent} }).call(this)`);
      this.info('✅ 执行定制化脚本');
    }
  }

  async renderAndExecuteContent() {
    const content = await this.renderJson();
    if (content) {
      // eslint-disable-next-line no-eval
      const jsConfig = eval(content);
      await new InitPage().renderContent(jsConfig);
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
    const targetSubDir = path.join(targetDir, subDir);
    const targetPath = path.join(targetSubDir, fileName);

    if (!fs.existsSync(sourcePath)) {
      this.warning(`源文件 ${sourcePath} 不存在，当前 pageId: ${this.pageId}`);
      return;
    }

    fs.mkdirSync(targetSubDir, { recursive: true });

    if (sourcePath.endsWith('.js')) {
      const content = fs.readFileSync(sourcePath, 'utf-8');
      fs.writeFileSync(targetPath, content.replace(/^\/\* eslint-disable \*\/\n/, ''));
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
    this.info(`✅ 生成 ${fileName} 文件`);
  }

  async copyDirectory(sourceDir, targetDir, dirName, targetSubDir = '') {
    const sourcePath = path.join(sourceDir, dirName);
    const targetPath = path.join(targetDir, targetSubDir || dirName);

    if (!fs.existsSync(sourcePath)) {
      this.warning(`源目录 ${sourcePath} 不存在，当前 pageId: ${this.pageId}`);
      return;
    }

    fs.mkdirSync(targetPath, { recursive: true });
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

}

module.exports = InitPageDefault;
