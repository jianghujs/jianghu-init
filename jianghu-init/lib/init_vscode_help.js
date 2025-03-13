'use strict';

const chalk = require('chalk');

/**
 * VSCode扩展安装命令的帮助信息
 */
module.exports = function showVSCodeHelp() {
  console.log(`
${chalk.bold('命令:')} ${chalk.green('jianghu-init vscode')}

${chalk.bold('描述:')}
  安装江湖初始化助手VSCode扩展，提供以下功能：
  - 自动检查并安装 @jianghujs/jianghu-init
  - 提供江湖项目创建向导
  - 提供 CRUD 页面生成向导
  - 在活动栏中提供江湖助手面板
  - 在状态栏中提供快速访问按钮
  - 提供详细的帮助文档
  - 提供代码补全建议
  - 提供代码片段
  - 提供悬停提示
  - 自动检查更新并提醒

${chalk.bold('用法:')}
  ${chalk.green('jianghu-init vscode')}           安装江湖初始化助手VSCode扩展
  ${chalk.green('jianghu-init vscode --update')}  更新江湖初始化助手VSCode扩展

${chalk.bold('选项:')}
  -h, --help     显示帮助信息
  -u, --update   更新扩展（跳过安装选择）

${chalk.bold('示例:')}
  ${chalk.green('jianghu-init vscode')}
    安装江湖初始化助手VSCode扩展

  ${chalk.green('jianghu-init vscode --update')}
    更新江湖初始化助手VSCode扩展

${chalk.bold('注意:')}
  - 需要先安装VSCode
  - 安装完成后需要重启VSCode以激活扩展
  - 扩展会自动检查更新，并在有新版本时提醒
  `);
}; 