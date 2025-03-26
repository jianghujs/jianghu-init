"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activateJsonDocCodeLens = exports.showPropertyDoc = exports.JsonDocCodeLensProvider = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const https = require("https");
const http = require("http");
/**
 * JSON文档代码镶边提供者
 * 在/app/view/init-json/目录中的JSON文件中显示文档链接
 */
class JsonDocCodeLensProvider {
    constructor() {
        this._onDidChangeCodeLenses = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
        // 监听配置变更，刷新代码镶边
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
    }
    /**
     * 判断文件是否在指定目录下
     * @param filePath 文件路径
     * @returns 是否为init-json目录下的JSON文件
     */
    isInitJsonFile(filePath) {
        const normalizedPath = filePath.replace(/\\/g, '/');
        return normalizedPath.includes('/app/view/init-json/') && normalizedPath.endsWith('.js');
    }
    /**
     * 查找Markdown文档
     * @param propertyName 属性名称
     * @returns {url?: string, filePath?: string} 文档URL或本地文件路径
     */
    findDocumentation(propertyName) {
        var _a;
        // 首先检查是否有URL映射
        if (JsonDocCodeLensProvider.docUrlMap[propertyName]) {
            return { url: JsonDocCodeLensProvider.docUrlMap[propertyName] };
        }
        // 如果没有URL映射，查找本地文档
        const extensionPath = (_a = vscode.extensions.getExtension('jianghujs.jianghu-init-vscode')) === null || _a === void 0 ? void 0 : _a.extensionPath;
        if (!extensionPath) {
            return {};
        }
        // 构建Markdown文档目录路径
        const mdDocPath = path.join(extensionPath, '..', '..', 'md-doc');
        // 检查目录是否存在
        if (!fs.existsSync(mdDocPath)) {
            return {};
        }
        // 尝试查找匹配的Markdown文件
        const mdFileName = `${propertyName}.md`;
        const mdFilePath = path.join(mdDocPath, mdFileName);
        if (fs.existsSync(mdFilePath)) {
            return { filePath: mdFilePath };
        }
        // 如果没有找到精确匹配，尝试查找相关文档
        const files = fs.readdirSync(mdDocPath);
        for (const file of files) {
            if (file.endsWith('.md') && file.toLowerCase().includes(propertyName.toLowerCase())) {
                return { filePath: path.join(mdDocPath, file) };
            }
        }
        return {};
    }
    /**
     * 提供代码镶边
     * @param document 文档
     * @param token 取消令牌
     * @returns 代码镶边列表
     */
    provideCodeLenses(document, token) {
        // 检查文件是否在目标目录下
        if (!this.isInitJsonFile(document.fileName)) {
            return [];
        }
        const codeLenses = [];
        const text = document.getText();
        // 使用正则表达式匹配属性定义
        const propertyRegex = /'([^']+)':|"([^"]+)":|(\w+):/g;
        let match;
        while ((match = propertyRegex.exec(text)) !== null) {
            if (token.isCancellationRequested) {
                return [];
            }
            // 提取属性名
            const propertyName = match[1] || match[2] || match[3];
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);
            const range = new vscode.Range(startPos, endPos);
            // 查找文档
            const docInfo = this.findDocumentation(propertyName);
            // 如果找到了文档（本地或URL），创建代码镶边
            if (docInfo.url || docInfo.filePath) {
                const codeLens = new vscode.CodeLens(range, {
                    title: '?',
                    tooltip: `查看 ${propertyName} 的文档`,
                    command: 'jianghu-init-vscode.showPropertyDoc',
                    arguments: [docInfo, propertyName]
                });
                codeLenses.push(codeLens);
            }
        }
        return codeLenses;
    }
}
exports.JsonDocCodeLensProvider = JsonDocCodeLensProvider;
// 文档URL映射
JsonDocCodeLensProvider.docUrlMap = {
    // 关键属性文档URL
    'pageType': 'https://www.openjianghu.org/doc/page/article/11105',
    'resourceList': 'https://www.openjianghu.org/doc/page/article/11105',
    'pageId': 'https://www.openjianghu.org/doc/page/article/11105',
    'jianghu-init': 'https://www.openjianghu.org/doc/page/article/11105'
};
// 默认文档URL
JsonDocCodeLensProvider.defaultDocUrl = 'https://www.openjianghu.org/doc/page/article/11105';
/**
 * 从URL获取内容
 * @param url 网址
 * @returns Promise<string> 网页内容
 */
function fetchUrlContent(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`请求失败，状态码: ${res.statusCode}`));
                return;
            }
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}
/**
 * 提取网页中的主要内容
 * @param htmlContent 完整HTML
 * @returns 提取的内容HTML
 */
function extractMainContent(htmlContent) {
    // 这是一个简单的实现，实际应用中可能需要更复杂的解析
    // 尝试查找主要内容区域
    const mainContentRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;
    const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/i;
    const contentRegex = /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i;
    let match = mainContentRegex.exec(htmlContent) ||
        articleRegex.exec(htmlContent) ||
        contentRegex.exec(htmlContent);
    if (match && match[1]) {
        return match[1];
    }
    // 如果无法提取特定区域，返回整个body内容
    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
    match = bodyRegex.exec(htmlContent);
    if (match && match[1]) {
        return match[1];
    }
    return htmlContent;
}
/**
 * 显示属性文档
 * @param docInfo 文档信息（URL或文件路径）
 * @param propertyName 属性名称
 */
function showPropertyDoc(docInfo, propertyName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let content = '';
            let isHtml = false;
            let isIframe = false;
            let iframeUrl = '';
            // 根据文档类型获取内容
            if (docInfo.url) {
                // 使用iframe嵌入网页
                iframeUrl = docInfo.url;
                isIframe = true;
            }
            else if (docInfo.filePath) {
                // 从本地文件获取Markdown内容
                content = fs.readFileSync(docInfo.filePath, 'utf-8');
                isHtml = false;
            }
            else {
                throw new Error('没有可用的文档');
            }
            // 创建Webview面板
            const panel = vscode.window.createWebviewPanel('jianghuPropertyDoc', `${propertyName} 文档`, vscode.ViewColumn.Beside, {
                enableScripts: true,
                retainContextWhenHidden: true
            });
            // 设置Webview内容
            panel.webview.html = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${propertyName} 文档</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            padding: 0;
            margin: 0;
            height: 100vh;
            overflow: hidden;
          }
          h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
          h2 { font-size: 1.5em; margin-top: 24px; margin-bottom: 16px; }
          h3 { font-size: 1.25em; margin-top: 24px; margin-bottom: 16px; }
          p, ul, ol { margin-bottom: 16px; }
          code {
            font-family: SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
            background-color: rgba(27, 31, 35, 0.05);
            border-radius: 3px;
            font-size: 85%;
            padding: 0.2em 0.4em;
          }
          pre {
            background-color: #f6f8fa;
            border-radius: 3px;
            font-size: 85%;
            line-height: 1.45;
            overflow: auto;
            padding: 16px;
          }
          pre code {
            background-color: transparent;
            padding: 0;
          }
          blockquote {
            border-left: 0.25em solid #dfe2e5;
            color: #6a737d;
            margin: 0;
            padding: 0 1em;
          }
          table {
            border-collapse: collapse;
            margin-bottom: 16px;
            width: 100%;
          }
          table th, table td {
            border: 1px solid #dfe2e5;
            padding: 6px 13px;
          }
          table tr {
            background-color: #fff;
            border-top: 1px solid #c6cbd1;
          }
          table tr:nth-child(2n) {
            background-color: #f6f8fa;
          }
          img {
            max-width: 100%;
          }
          .source-link {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 10px;
            background-color: #f8f9fa;
            border-top: 1px solid #dfe2e5;
            text-align: center;
            z-index: 1000;
          }
          .source-link a {
            color: #0366d6;
            text-decoration: none;
          }
          .source-link a:hover {
            text-decoration: underline;
          }
          .iframe-container {
            width: 100%;
            height: 100vh;
            border: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          iframe {
            width: 100%;
            height: 100%;
            border: none;
          }
          .markdown-content {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        ${isIframe ?
                `<div class="iframe-container">
            <iframe src="${iframeUrl}" frameborder="0" allowfullscreen></iframe>
           </div>` :
                `<div class="markdown-content">
            ${isHtml ? content : convertMarkdownToHtml(content)}
           </div>`}
        ${docInfo.url && !isIframe ?
                `<div class="source-link">
            <a href="${docInfo.url}" target="_blank">在浏览器中打开完整文档</a>
           </div>` : ''}
      </body>
      </html>
    `;
        }
        catch (error) {
            vscode.window.showErrorMessage(`无法显示文档: ${error}`);
        }
    });
}
exports.showPropertyDoc = showPropertyDoc;
/**
 * 将Markdown转换为HTML（简单版本）
 * @param markdown Markdown文本
 * @returns HTML文本
 */
function convertMarkdownToHtml(markdown) {
    // 简单的Markdown转HTML处理
    // 实际应用中可以使用更完整的Markdown解析库
    let html = markdown;
    // 处理标题
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    // 处理段落
    html = html.replace(/^(?!<h[1-6]|<ul|<ol|<li|<blockquote|<pre)(.+)$/gm, '<p>$1</p>');
    // 处理粗体
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // 处理斜体
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // 处理代码块（使用[\s\S]代替s标志）
    html = html.replace(/```([\s\S]+?)```/g, '<pre><code>$1</code></pre>');
    // 处理行内代码
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');
    // 处理链接
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    // 处理列表
    html = html.replace(/^- (.+)$/gm, '<ul><li>$1</li></ul>');
    // 合并相邻的列表项
    html = html.replace(/<\/ul>\s*<ul>/g, '');
    return html;
}
/**
 * 激活JSON文档代码镶边
 * @param context 扩展上下文
 */
function activateJsonDocCodeLens(context) {
    // 注册代码镶边提供者
    const codeLensProvider = vscode.languages.registerCodeLensProvider({ language: 'javascript', pattern: '**/app/view/init-json/**/*.js' }, new JsonDocCodeLensProvider());
    // 注册命令
    const showDocCommand = vscode.commands.registerCommand('jianghu-init-vscode.showPropertyDoc', (docInfo, propertyName) => {
        showPropertyDoc(docInfo, propertyName);
    });
    context.subscriptions.push(codeLensProvider, showDocCommand);
}
exports.activateJsonDocCodeLens = activateJsonDocCodeLens;
//# sourceMappingURL=jsonDocCodeLensProvider.js.map