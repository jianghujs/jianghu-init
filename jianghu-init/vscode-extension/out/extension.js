"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const https = __importStar(require("https"));
const semver = __importStar(require("semver"));
const jsonTemplateCompletionProvider_1 = require("./jsonTemplateCompletionProvider");
const jsonTemplateHoverProvider_1 = require("./jsonTemplateHoverProvider");
const jsonDocCodeLensProvider_1 = require("./jsonDocCodeLensProvider");
const jianghuSchemaValidator_1 = require("./validators/jianghuSchemaValidator");
// 当前扩展版本
const CURRENT_VERSION = '0.0.1';
// 检查更新的URL（可以是GitHub仓库API或自定义服务器）
const VERSION_CHECK_URL = 'https://api.github.com/repos/jianghujs/jianghu-init/releases/latest';
// 全局扩展上下文
let extensionContext;
/**
 * 检查是否有新版本
 * @returns {Promise<{hasUpdate: boolean, latestVersion: string, downloadUrl: string}>}
 */
async function checkForUpdates() {
    return new Promise((resolve) => {
        try {
            const req = https.get(VERSION_CHECK_URL, {
                headers: {
                    'User-Agent': 'jianghu-init-vscode'
                }
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const releaseInfo = JSON.parse(data);
                        console.log('Release Info:', releaseInfo); // 调试输出
                        if (!releaseInfo || !releaseInfo.tag_name) {
                            console.error('Invalid release info:', releaseInfo);
                            resolve({
                                hasUpdate: false,
                                latestVersion: CURRENT_VERSION,
                                downloadUrl: ''
                            });
                            return;
                        }
                        const latestVersion = releaseInfo.tag_name.replace(/^v/, '');
                        const downloadUrl = releaseInfo.assets.find((asset) => asset.name.endsWith('.vsix'))?.browser_download_url || '';
                        const hasUpdate = semver.gt(latestVersion, CURRENT_VERSION);
                        resolve({
                            hasUpdate,
                            latestVersion,
                            downloadUrl
                        });
                    }
                    catch (error) {
                        console.error('解析版本信息失败:', error);
                        resolve({
                            hasUpdate: false,
                            latestVersion: CURRENT_VERSION,
                            downloadUrl: ''
                        });
                    }
                });
            });
            req.on('error', (error) => {
                console.error('检查更新失败:', error);
                resolve({
                    hasUpdate: false,
                    latestVersion: CURRENT_VERSION,
                    downloadUrl: ''
                });
            });
            req.end();
        }
        catch (error) {
            console.error('检查更新失败:', error);
            resolve({
                hasUpdate: false,
                latestVersion: CURRENT_VERSION,
                downloadUrl: ''
            });
        }
    });
}
/**
 * 显示更新提醒
 * @param latestVersion 最新版本
 * @param downloadUrl 下载链接
 */
async function showUpdateNotification(latestVersion, downloadUrl) {
    const updateMessage = `江湖初始化助手有新版本可用: v${latestVersion}`;
    const result = await vscode.window.showInformationMessage(updateMessage, '立即更新', '稍后提醒', '忽略此版本');
    if (result === '立即更新') {
        // 如果有下载链接，打开浏览器下载
        if (downloadUrl) {
            vscode.env.openExternal(vscode.Uri.parse(downloadUrl));
        }
        else {
            // 否则运行更新命令
            const terminal = vscode.window.createTerminal('江湖初始化助手更新');
            terminal.show();
            terminal.sendText('jianghu-init vscode');
        }
    }
    else if (result === '忽略此版本') {
        // 保存忽略的版本
        extensionContext.globalState.update('ignoredVersion', latestVersion);
    }
}
/**
 * 检查是否安装了jianghu-init
 * @returns {Promise<boolean>}
 */
async function checkJianghuInitInstalled() {
    return new Promise((resolve) => {
        (0, child_process_1.exec)('npm list -g @jianghujs/jianghu-init', (error, stdout) => {
            if (error || !stdout.includes('@jianghujs/jianghu-init')) {
                resolve(false);
            }
            else {
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
            (0, child_process_1.exec)('npm install -g @jianghujs/jianghu-init', (error) => {
                if (error) {
                    vscode.window.showErrorMessage('安装 @jianghujs/jianghu-init 失败，请手动安装。');
                    resolve(false);
                }
                else {
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
    const panel = vscode.window.createWebviewPanel('jianghuHelp', '江湖初始化助手', vscode.ViewColumn.One, {
        enableScripts: true
    });
    panel.webview.html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>江湖初始化助手</title>
    </head>
    <body>
      文档
    </body>
    </html>
  `;
}
/**
 * 创建项目
 */
async function createProject() {
    const projectType = await vscode.window.showQuickPick([
        { label: '独立应用', value: 'stand-alone', description: '创建一个独立的江湖应用' },
        { label: '多应用项目', value: 'multi', description: '创建一个包含多个应用的江湖项目' },
        { label: '单应用（在多应用项目中）', value: 'single', description: '在多应用项目中创建一个新应用' }
    ], { placeHolder: '选择项目类型' });
    if (!projectType)
        return;
    const projectName = await vscode.window.showInputBox({
        placeHolder: '输入项目名称',
        prompt: '请输入项目名称'
    });
    if (!projectName)
        return;
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
        return Promise.resolve(items);
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
        return Promise.resolve([createProjectItem, generateCrudItem]);
    }
}
/**
 * 提供代码补全建议
 */
class JianghuCompletionItemProvider {
    provideCompletionItems(document, position, token, context) {
        // 获取当前行文本
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        // 检查是否应该提供建议
        if (!linePrefix.endsWith('jianghu.')) {
            return undefined;
        }
        // 创建建议项
        const projectCompletion = new vscode.CompletionItem('createProject', vscode.CompletionItemKind.Method);
        projectCompletion.detail = '创建江湖项目';
        projectCompletion.documentation = new vscode.MarkdownString('使用jianghu-init创建一个新的江湖项目\n\n```javascript\njianghu.createProject()\n```');
        projectCompletion.insertText = new vscode.SnippetString('createProject()');
        const crudCompletion = new vscode.CompletionItem('generateCrud', vscode.CompletionItemKind.Method);
        crudCompletion.detail = '生成CRUD页面';
        crudCompletion.documentation = new vscode.MarkdownString('根据数据库表生成CRUD页面\n\n```javascript\njianghu.generateCrud()\n```');
        crudCompletion.insertText = new vscode.SnippetString('generateCrud()');
        const helpCompletion = new vscode.CompletionItem('showHelp', vscode.CompletionItemKind.Method);
        helpCompletion.detail = '显示江湖帮助';
        helpCompletion.documentation = new vscode.MarkdownString('显示江湖初始化助手帮助信息\n\n```javascript\njianghu.showHelp()\n```');
        helpCompletion.insertText = new vscode.SnippetString('showHelp()');
        return [
            projectCompletion,
            crudCompletion,
            helpCompletion
        ];
    }
}
/**
 * 提供悬停提示
 */
class JianghuHoverProvider {
    provideHover(document, position, token) {
        // 获取当前单词
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }
        const word = document.getText(range);
        // 根据不同的单词提供不同的悬停提示
        if (word === 'jianghu' || word === 'jianghujs') {
            return new vscode.Hover([
                new vscode.MarkdownString('# 江湖JS\n\n江湖JS是一个开源的Web应用框架，基于Egg.js构建。\n\n[访问官网](https://openjianghu.org/)'),
                new vscode.MarkdownString('## 常用命令\n\n```bash\n# 创建项目\njianghu-init project --type=stand-alone my-project\n\n# 生成CRUD页面\njianghu-init crud\n```')
            ]);
        }
        if (word === 'jianghu-init') {
            return new vscode.Hover([
                new vscode.MarkdownString('# 江湖初始化工具\n\n用于创建江湖JS项目和生成CRUD页面的命令行工具。\n\n```bash\nnpm install -g @jianghujs/jianghu-init\n```'),
                new vscode.MarkdownString('## 常用命令\n\n```bash\n# 创建项目\njianghu-init project --type=stand-alone my-project\n\n# 生成CRUD页面\njianghu-init crud\n```')
            ]);
        }
        if (word === 'createProject') {
            return new vscode.Hover(new vscode.MarkdownString('创建江湖项目\n\n```javascript\njianghu.createProject()\n```'));
        }
        if (word === 'generateCrud') {
            return new vscode.Hover(new vscode.MarkdownString('生成CRUD页面\n\n```javascript\njianghu.generateCrud()\n```'));
        }
        return null;
    }
}
/**
 * 激活扩展
 * @param context 扩展上下文
 */
async function activate(context) {
    console.log('江湖初始化助手已激活');
    // 保存扩展上下文
    extensionContext = context;
    // 创建验证器实例
    const validator = new jianghuSchemaValidator_1.JianghuSchemaValidator(context);
    // 注册文档变化事件
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        validator.validate(event.document);
    }));
    // 注册文档打开事件
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(document => {
        validator.validate(document);
    }));
    // 注册保存事件
    context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(document => {
        validator.validate(document);
    }));
    // 检查是否有新版本
    const ignoredVersion = context.globalState.get('ignoredVersion');
    const updateInfo = await checkForUpdates();
    if (updateInfo.hasUpdate && updateInfo.latestVersion !== ignoredVersion) {
        showUpdateNotification(updateInfo.latestVersion, updateInfo.downloadUrl);
    }
    // 检查是否安装了jianghu-init
    const isInstalled = await checkJianghuInitInstalled();
    if (!isInstalled) {
        const answer = await vscode.window.showInformationMessage('未检测到 @jianghujs/jianghu-init，是否立即安装？', '安装', '取消');
        if (answer === '安装') {
            await installJianghuInit();
        }
    }
    // 注册命令
    const showHelpCommand = vscode.commands.registerCommand('jianghu-init-vscode.showHelp', showHelpPanel);
    const createProjectCommand = vscode.commands.registerCommand('jianghu-init-vscode.createProject', createProject);
    const generateCrudCommand = vscode.commands.registerCommand('jianghu-init-vscode.generateCrud', generateCrud);
    const checkUpdateCommand = vscode.commands.registerCommand('jianghu-init-vscode.checkUpdate', async () => {
        const updateInfo = await checkForUpdates();
        if (updateInfo.hasUpdate) {
            showUpdateNotification(updateInfo.latestVersion, updateInfo.downloadUrl);
        }
        else {
            vscode.window.showInformationMessage('您已经使用的是最新版本的江湖初始化助手');
        }
    });
    context.subscriptions.push(showHelpCommand, createProjectCommand, generateCrudCommand, checkUpdateCommand);
    // 创建状态栏项
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = "$(tools) 江湖助手";
    statusBarItem.tooltip = "点击打开江湖初始化助手";
    statusBarItem.command = 'jianghu-init-vscode.showHelp';
    statusBarItem.show();
    // 创建更新检查状态栏项
    const updateStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    updateStatusBarItem.text = "$(sync) 检查江湖助手更新";
    updateStatusBarItem.tooltip = "检查江湖初始化助手更新";
    updateStatusBarItem.command = 'jianghu-init-vscode.checkUpdate';
    updateStatusBarItem.show();
    context.subscriptions.push(statusBarItem, updateStatusBarItem);
    // 创建树视图提供者
    const helpTreeProvider = new JianghuHelpTreeProvider();
    const commandsTreeProvider = new JianghuCommandsTreeProvider();
    vscode.window.registerTreeDataProvider('jianghuHelp', helpTreeProvider);
    vscode.window.registerTreeDataProvider('jianghuCommands', commandsTreeProvider);
    // 注册代码补全提供者
    const completionProvider = vscode.languages.registerCompletionItemProvider(['javascript', 'typescript', 'json'], // 支持的语言
    new JianghuCompletionItemProvider(), '.' // 触发字符
    );
    context.subscriptions.push(completionProvider);
    // 注册悬停提示提供者
    const hoverProvider = vscode.languages.registerHoverProvider(['javascript', 'typescript', 'json'], // 支持的语言
    new JianghuHoverProvider());
    context.subscriptions.push(hoverProvider);
    // 激活JSON模板代码补全
    (0, jsonTemplateCompletionProvider_1.activateJsonTemplateCompletion)(context);
    // 激活JSON模板悬停提示
    (0, jsonTemplateHoverProvider_1.activateJsonTemplateHover)(context);
    // 激活JSON文档代码镶边
    (0, jsonDocCodeLensProvider_1.activateJsonDocCodeLens)(context);
    // 设置定期检查更新（每天检查一次）
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24小时（毫秒）
    setInterval(async () => {
        const updateInfo = await checkForUpdates();
        const ignoredVersion = context.globalState.get('ignoredVersion');
        if (updateInfo.hasUpdate && updateInfo.latestVersion !== ignoredVersion) {
            showUpdateNotification(updateInfo.latestVersion, updateInfo.downloadUrl);
        }
    }, ONE_DAY);
}
exports.activate = activate;
/**
 * 停用扩展
 */
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map