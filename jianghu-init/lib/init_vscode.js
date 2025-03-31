'use strict';

const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const inquirer = require('inquirer');
const chalk = require('chalk');
const showVSCodeHelp = require('./init_vscode_help');

/**
 * 安装VSCode扩展的命令
 */
module.exports = class CommandInitVSCode {
  constructor() {
    this.vscodeExtensionPath = path.join(__dirname, '..', 'vscode-extension');
    this.prebuiltVsixPath = path.join(__dirname, '..', 'vscode-extension', 'prebuilt', 'jianghu-init-vscode-0.0.1.vsix');
  }

  /**
   * 运行命令
   * @param {string} cwd - 当前工作目录
   * @param {Array} argv - 命令行参数
   */
  async run(cwd, argv) {
    // 检查是否需要显示帮助信息
    if (argv.includes('--help') || argv.includes('-h')) {
      showVSCodeHelp();
      return;
    }

    // 检查是否是更新模式
    const isUpdate = argv.includes('--update') || argv.includes('-u');
    
    console.log(chalk.green(isUpdate ? '开始更新江湖初始化助手VSCode扩展...' : '开始安装江湖初始化助手VSCode扩展...'));

    // 检查VSCode是否已安装
    const isVSCodeInstalled = await this.checkVSCodeInstalled();
    if (!isVSCodeInstalled) {
      console.log(chalk.red('未检测到VSCode，请先安装VSCode后再安装扩展。'));
      console.log(chalk.yellow('您可以从 https://code.visualstudio.com/ 下载安装VSCode。'));
      return;
    }

    // 如果是更新模式，直接进行更新
    if (isUpdate) {
      try {
        await this.fullInstall();
        return;
      } catch (error) {
        console.error(chalk.red('更新过程中发生错误:'), error);
        console.log(chalk.yellow('您可以尝试手动更新扩展:'));
        console.log(chalk.yellow('1. 在VSCode中卸载现有的江湖初始化助手扩展'));
        console.log(chalk.yellow('2. 运行 jianghu-init vscode 重新安装'));
        return;
      }
    }

    // 安装选项
    const { installType } = await inquirer.prompt({
      name: 'installType',
      type: 'list',
      message: '请选择安装方式:',
      choices: [
        { name: '简易安装 (推荐，直接使用预编译包)', value: 'simple' },
        { name: '完整安装 (从源码构建，可能需要更长时间)', value: 'full' }
      ],
      default: 'simple'
    });

    try {
      if (installType === 'simple') {
        await this.simpleInstall();
      } else {
        await this.fullInstall();
      }
    } catch (error) {
      console.error(chalk.red('安装过程中发生错误:'), error);
      console.log(chalk.yellow('您可以尝试手动安装扩展:'));
      console.log(chalk.yellow('1. 进入扩展目录: cd ' + this.vscodeExtensionPath));
      console.log(chalk.yellow('2. 安装依赖: npm install'));
      console.log(chalk.yellow('3. 编译扩展: npm run compile'));
      console.log(chalk.yellow('4. 打包扩展: npx vsce package'));
      console.log(chalk.yellow('5. 安装扩展: code --install-extension jianghu-init-vscode-0.0.1.vsix'));
    }
  }

  /**
   * 简易安装 - 使用预编译的扩展包
   */
  async simpleInstall() {
    console.log(chalk.blue('使用简易安装模式...'));
    
    // 检查预编译的vsix文件是否存在
    const prebuiltDir = path.dirname(this.prebuiltVsixPath);
    if (!fs.existsSync(prebuiltDir)) {
      fs.mkdirSync(prebuiltDir, { recursive: true });
      console.log(chalk.gray(`创建预编译目录: ${prebuiltDir}`));
    }
    
    // 如果预编译的vsix文件不存在，尝试创建一个简单的扩展
    if (!fs.existsSync(this.prebuiltVsixPath)) {
      console.log(chalk.yellow('预编译的扩展包不存在，尝试创建一个简单的扩展...'));
      
      // 创建一个简单的扩展包
      await this.createSimpleExtension();
    }
    
    // 安装扩展
    console.log(chalk.blue(`正在安装VSCode扩展: ${path.basename(this.prebuiltVsixPath)}...`));
    try {
      await this.executeCommand(`code --install-extension "${this.prebuiltVsixPath}"`);
      console.log(chalk.green('江湖初始化助手VSCode扩展安装成功！'));
      console.log(chalk.green('请重启VSCode以激活扩展。'));
    } catch (error) {
      console.error(chalk.red('安装VSCode扩展失败:'), error);
      console.log(chalk.yellow('您可以手动安装扩展:'));
      console.log(chalk.yellow(`1. 打开VSCode`));
      console.log(chalk.yellow(`2. 按下Ctrl+Shift+X打开扩展面板`));
      console.log(chalk.yellow(`3. 点击"..."按钮，选择"从VSIX安装..."`));
      console.log(chalk.yellow(`4. 选择文件: ${this.prebuiltVsixPath}`));
      
      // 如果简易安装失败，尝试完整安装
      console.log(chalk.blue('简易安装失败，尝试完整安装...'));
      await this.fullInstall();
    }
  }
  
  /**
   * 创建一个简单的扩展包
   */
  async createSimpleExtension() {
    // 这里我们可以尝试使用vsce命令行工具创建一个最小的扩展包
    // 但为了简单起见，我们可以直接使用完整安装流程来创建扩展包
    await this.fullInstall();
    
    // 复制生成的vsix文件到预编译目录
    const files = fs.readdirSync(this.vscodeExtensionPath).filter(file => file.endsWith('.vsix'));
    if (files.length > 0) {
      const vsixFile = files.sort().pop();
      const vsixPath = path.join(this.vscodeExtensionPath, vsixFile);
      
      // 确保预编译目录存在
      const prebuiltDir = path.dirname(this.prebuiltVsixPath);
      if (!fs.existsSync(prebuiltDir)) {
        fs.mkdirSync(prebuiltDir, { recursive: true });
      }
      
      // 复制文件
      fs.copyFileSync(vsixPath, this.prebuiltVsixPath);
      console.log(chalk.green(`已将扩展包复制到预编译目录: ${this.prebuiltVsixPath}`));
    }
  }

  /**
   * 完整安装 - 从源码构建
   */
  async fullInstall() {
    console.log(chalk.blue('使用完整安装模式...'));
    await this.installExtension();
  }

  /**
   * 检查VSCode是否已安装
   * @returns {Promise<boolean>}
   */
  async checkVSCodeInstalled() {
    return new Promise((resolve) => {
      const command = process.platform === 'win32' ? 'where code' : 'which code';
      exec(command, (error) => {
        resolve(!error);
      });
    });
  }

  /**
   * 执行命令并返回输出
   * @param {string} command - 要执行的命令
   * @param {Object} options - 执行选项
   * @returns {Promise<string>} - 命令输出
   */
  async executeCommand(command, options = {}) {
    return new Promise((resolve, reject) => {
      console.log(chalk.blue(`执行命令: ${command}`));
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red(`命令执行失败: ${command}`));
          console.error(chalk.red(`错误信息: ${error.message}`));
          if (stderr) {
            console.error(chalk.red(`标准错误: ${stderr}`));
          }
          reject(error);
          return;
        }
        
        if (stdout) {
          console.log(chalk.gray(`命令输出: ${stdout.substring(0, 200)}${stdout.length > 200 ? '...' : ''}`));
        }
        
        resolve(stdout);
      });
    });
  }

  /**
   * 安装VSCode扩展
   * @returns {Promise<void>}
   */
  async installExtension() {
    // 检查扩展目录是否存在
    if (!fs.existsSync(this.vscodeExtensionPath)) {
      throw new Error(`VSCode扩展目录不存在: ${this.vscodeExtensionPath}`);
    }

    console.log(chalk.blue('正在检查扩展目录结构...'));
    const files = fs.readdirSync(this.vscodeExtensionPath);
    console.log(chalk.gray(`扩展目录文件: ${files.join(', ')}`));

    // 检查package.json是否存在
    const packageJsonPath = path.join(this.vscodeExtensionPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error(`扩展的package.json文件不存在: ${packageJsonPath}`);
    }

    try {
      // 读取并解析package.json，确保它是有效的JSON
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      console.log(chalk.gray(`扩展名称: ${packageJson.name}, 版本: ${packageJson.version}`));
    } catch (error) {
      throw new Error(`无法解析扩展的package.json文件: ${error.message}`);
    }

    // 首先安装依赖
    console.log(chalk.blue('正在安装依赖...'));
    try {
      await this.executeCommand('npm install', { cwd: this.vscodeExtensionPath });
    } catch (error) {
      console.log(chalk.yellow('安装依赖失败，尝试继续...'));
    }
    
    // 创建src目录（如果不存在）
    const srcDir = path.join(this.vscodeExtensionPath, 'src');
    if (!fs.existsSync(srcDir)) {
      console.log(chalk.blue('创建src目录...'));
      fs.mkdirSync(srcDir, { recursive: true });
    }

    // 检查src/extension.ts是否存在
    const extensionTsPath = path.join(srcDir, 'extension.ts');
    if (!fs.existsSync(extensionTsPath)) {
      console.log(chalk.yellow('extension.ts文件不存在，尝试从extension.js创建...'));
      const extensionJsPath = path.join(this.vscodeExtensionPath, 'extension.js');
      if (fs.existsSync(extensionJsPath)) {
        const extensionJs = fs.readFileSync(extensionJsPath, 'utf8');
        // 简单转换为TypeScript
        const extensionTs = extensionJs
          .replace(/const (\w+) = require\('([^']+)'\);/g, "import * as $1 from '$2';")
          .replace(/module\.exports = {/g, 'export {')
          .replace(/};$/g, '}');
        fs.writeFileSync(extensionTsPath, extensionTs);
        console.log(chalk.green('成功创建extension.ts文件'));
      } else {
        throw new Error('既没有找到extension.ts也没有找到extension.js文件');
      }
    }
    
    console.log(chalk.blue('正在构建VSCode扩展...'));
    try {
      await this.executeCommand('npm run compile', { cwd: this.vscodeExtensionPath });
    } catch (error) {
      console.log(chalk.yellow('构建失败，尝试直接使用JavaScript版本...'));
      // 如果编译失败，尝试直接使用JavaScript版本
      const outDir = path.join(this.vscodeExtensionPath, 'out');
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      const extensionJsPath = path.join(this.vscodeExtensionPath, 'extension.js');
      if (fs.existsSync(extensionJsPath)) {
        const outExtensionJsPath = path.join(outDir, 'extension.js');
        fs.copyFileSync(extensionJsPath, outExtensionJsPath);
        console.log(chalk.green('已复制JavaScript版本到输出目录'));
      }
    }
    
    console.log(chalk.blue('正在打包VSCode扩展...'));
    
    // 本地安装vsce而不是全局安装，避免权限问题
    try {
      await this.executeCommand('npm install vsce --no-save', { cwd: this.vscodeExtensionPath });
    } catch (error) {
      console.log(chalk.yellow('安装vsce失败，尝试继续...'));
    }
    
    // 使用本地安装的vsce打包
    try {
      await this.executeCommand('npx vsce package', { cwd: this.vscodeExtensionPath });
    } catch (error) {
      console.log(chalk.red('打包VSCode扩展失败，尝试手动修复问题...'));
      
      // 尝试修复常见问题
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
      let packageJson;
      try {
        packageJson = JSON.parse(packageJsonContent);
      } catch (e) {
        throw new Error(`package.json解析失败: ${e.message}`);
      }
      
      // 确保有publisher字段
      if (!packageJson.publisher) {
        packageJson.publisher = 'jianghujs';
        console.log(chalk.yellow('添加缺失的publisher字段'));
      }
      
      // 确保有repository字段（vsce要求）
      if (!packageJson.repository) {
        packageJson.repository = {
          type: 'git',
          url: 'https://github.com/jianghujs/jianghu-init.git'
        };
        console.log(chalk.yellow('添加缺失的repository字段'));
      }
      
      // 写回修改后的package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(chalk.green('已修复package.json，重新尝试打包'));
      
      // 再次尝试打包
      try {
        await this.executeCommand('npx vsce package', { cwd: this.vscodeExtensionPath });
      } catch (packError) {
        throw new Error(`修复后打包仍然失败: ${packError.message}`);
      }
    }
    
    // 查找生成的.vsix文件
    const vsixFiles = fs.readdirSync(this.vscodeExtensionPath).filter(file => file.endsWith('.vsix'));
    
    if (vsixFiles.length === 0) {
      throw new Error('未找到生成的.vsix文件');
    }
    
    // 使用最新的vsix文件
    const vsixFile = vsixFiles.sort().pop();
    console.log(chalk.blue(`找到VSCode扩展包: ${vsixFile}`));
    
    console.log(chalk.blue(`正在安装VSCode扩展: ${vsixFile}...`));
    
    // 安装扩展
    try {
      // 先尝试卸载旧版本
      try {
        await this.executeCommand(`code --uninstall-extension jianghujs.jianghu-init-vscode`);
        console.log(chalk.gray('已卸载旧版本的扩展'));
      } catch (error) {
        // 忽略卸载错误，可能是未安装
      }
      
      await this.executeCommand(`code --install-extension ${path.join(this.vscodeExtensionPath, vsixFile)}`);
      console.log(chalk.green('江湖初始化助手VSCode扩展安装成功！'));
      console.log(chalk.green('请重启VSCode以激活扩展。'));
      
      // 复制到预编译目录
      const prebuiltDir = path.dirname(this.prebuiltVsixPath);
      if (!fs.existsSync(prebuiltDir)) {
        fs.mkdirSync(prebuiltDir, { recursive: true });
      }
      fs.copyFileSync(path.join(this.vscodeExtensionPath, vsixFile), this.prebuiltVsixPath);
      console.log(chalk.gray(`已将扩展包复制到预编译目录: ${this.prebuiltVsixPath}`));
    } catch (error) {
      console.error(chalk.red('安装VSCode扩展失败:'), error);
      console.log(chalk.yellow('您可以手动安装扩展:'));
      console.log(chalk.yellow(`1. 打开VSCode`));
      console.log(chalk.yellow(`2. 按下Ctrl+Shift+X打开扩展面板`));
      console.log(chalk.yellow(`3. 点击"..."按钮，选择"从VSIX安装..."`));
      console.log(chalk.yellow(`4. 选择文件: ${path.join(this.vscodeExtensionPath, vsixFile)}`));
    }
  }
}; 