const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * 检查是否安装了jianghu-init
 * @returns {Promise<boolean>}
 */
async function checkJianghuInitInstalled() {
  return new Promise((resolve) => {
    exec('npm list -g @jianghujs/jianghu-init', (error, stdout) => {
      if (error || !stdout.includes('@jianghujs/jianghu-init')) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * 安装jianghu-init
 * @returns {Promise<boolean>}
 */
async function installJianghuInit() {
  return new Promise((resolve) => {
    vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "正在安装 @jianghujs/jianghu-init...",
      cancellable: false
    }, async () => {
      exec('npm install -g @jianghujs/jianghu-init', (error) => {
        if (error) {
          vscode.window.showErrorMessage('安装 @jianghujs/jianghu-init 失败，请手动安装。');
          resolve(false);
        } else {
          vscode.window.showInformationMessage('@jianghujs/jianghu-init 安装成功！');
          resolve(true);
        }
      });
    });
  });
}

/**
 * 显示帮助面板
 */
function showHelpPanel() {
  const panel = vscode.window.createWebviewPanel(
    'jianghuHelp',
    '江湖初始化助手',
    vscode.ViewColumn.One,
    {
      enableScripts: true
    }
  );

  panel.webview.html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>江湖初始化助手</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          padding: 20px;
          line-height: 1.6;
        }
        h1 {
          border-bottom: 1px solid #eaecef;
          padding-bottom: 10px;
        }
        h2 {
          margin-top: 24px;
          margin-bottom: 16px;
          font-weight: 600;
          line-height: 1.25;
        }
        code {
          background-color: rgba(27, 31, 35, 0.05);
          border-radius: 3px;
          font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 85%;
          margin: 0;
          padding: 0.2em 0.4em;
        }
        pre {
          background-color: #f6f8fa;
          border-radius: 3px;
          font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
          font-size: 85%;
          line-height: 1.45;
          overflow: auto;
          padding: 16px;
        }
        .command {
          margin-bottom: 16px;
        }
        .command-title {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>江湖初始化助手</h1>
      <p>江湖初始化助手是一个VSCode扩展，用于辅助使用jianghu-init并显示帮助文字。</p>
      
      <h2>主要功能</h2>
      <div class="command">
        <div class="command-title">创建项目</div>
        <p>使用 <code>jianghu-init project</code> 命令创建新项目，支持独立应用和多应用项目。</p>
        <pre>jianghu-init project --type=stand-alone my-jh-project</pre>
      </div>
      
      <div class="command">
        <div class="command-title">生成CRUD页面</div>
        <p>在应用目录下执行 <code>jianghu-init crud</code> 命令，根据数据库已有表生成CRUD页面。</p>
        <pre>jianghu-init crud</pre>
      </div>
      
      <h2>使用方法</h2>
      <p>您可以通过以下方式使用江湖初始化助手：</p>
      <ol>
        <li>在活动栏中点击江湖助手图标</li>
        <li>在命令面板中搜索"江湖"相关命令</li>
        <li>在状态栏中点击江湖助手按钮</li>
      </ol>
      
      <h2>更多资源</h2>
      <p>访问 <a href="https://openjianghu.org/" target="_blank">江湖JS官方文档</a> 获取更多信息。</p>
    </body>
    </html>
  `;
}

/**
 * 创建项目
 */
async function createProject() {
  const projectType = await vscode.window.showQuickPick(
    [
      { label: '独立应用', value: 'stand-alone' },
      { label: '多应用项目', value: 'multi' },
      { label: '单应用（在多应用项目中）', value: 'single' }
    ],
    { placeHolder: '选择项目类型' }
  );

  if (!projectType) return;

  const projectName = await vscode.window.showInputBox({
    placeHolder: '输入项目名称',
    prompt: '请输入项目名称'
  });

  if (!projectName) return;

  const terminal = vscode.window.createTerminal('江湖初始化');
  terminal.show();
  terminal.sendText(`jianghu-init project --type=${projectType.value} ${projectName}`);
}

/**
 * 生成CRUD页面
 */
function generateCrud() {
  const terminal = vscode.window.createTerminal('江湖CRUD生成');
  terminal.show();
  terminal.sendText('jianghu-init crud');
}

/**
 * 激活扩展
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  console.log('江湖初始化助手已激活');

  // 检查是否安装了jianghu-init
  const isInstalled = await checkJianghuInitInstalled();
  if (!isInstalled) {
    const answer = await vscode.window.showInformationMessage(
      '未检测到 @jianghujs/jianghu-init，是否立即安装？',
      '安装',
      '取消'
    );
    
    if (answer === '安装') {
      await installJianghuInit();
    }
  }

  // 注册命令
  const showHelpCommand = vscode.commands.registerCommand('jianghu-init-vscode.showHelp', showHelpPanel);
  const createProjectCommand = vscode.commands.registerCommand('jianghu-init-vscode.createProject', createProject);
  const generateCrudCommand = vscode.commands.registerCommand('jianghu-init-vscode.generateCrud', generateCrud);

  context.subscriptions.push(showHelpCommand, createProjectCommand, generateCrudCommand);

  // 创建状态栏项
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "$(tools) 江湖助手";
  statusBarItem.tooltip = "点击打开江湖初始化助手";
  statusBarItem.command = 'jianghu-init-vscode.showHelp';
  statusBarItem.show();
  
  context.subscriptions.push(statusBarItem);

  // 创建树视图提供者
  const helpTreeProvider = new JianghuHelpTreeProvider();
  const commandsTreeProvider = new JianghuCommandsTreeProvider();
  
  vscode.window.registerTreeDataProvider('jianghuHelp', helpTreeProvider);
  vscode.window.registerTreeDataProvider('jianghuCommands', commandsTreeProvider);
}

/**
 * 停用扩展
 */
function deactivate() {}

/**
 * 帮助树视图提供者
 */
class JianghuHelpTreeProvider {
  getTreeItem(element) {
    return element;
  }

  getChildren() {
    const items = [
      new vscode.TreeItem('项目创建指南', vscode.TreeItemCollapsibleState.None),
      new vscode.TreeItem('CRUD生成指南', vscode.TreeItemCollapsibleState.None),
      new vscode.TreeItem('常见问题', vscode.TreeItemCollapsibleState.None)
    ];
    
    items.forEach(item => {
      item.command = {
        command: 'jianghu-init-vscode.showHelp',
        title: '显示帮助'
      };
    });
    
    return items;
  }
}

/**
 * 命令树视图提供者
 */
class JianghuCommandsTreeProvider {
  getTreeItem(element) {
    return element;
  }

  getChildren() {
    const createProjectItem = new vscode.TreeItem('创建项目', vscode.TreeItemCollapsibleState.None);
    createProjectItem.command = {
      command: 'jianghu-init-vscode.createProject',
      title: '创建项目'
    };
    
    const generateCrudItem = new vscode.TreeItem('生成CRUD页面', vscode.TreeItemCollapsibleState.None);
    generateCrudItem.command = {
      command: 'jianghu-init-vscode.generateCrud',
      title: '生成CRUD页面'
    };
    
    return [createProjectItem, generateCrudItem];
  }
}

module.exports = {
  activate,
  deactivate
}; 