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
exports.activateJsonDocCodeLens = exports.JsonDocHoverProvider = exports.JsonDocCodeLensProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * JSON文档代码镶边提供者
 * 在/app/view/init-json/目录中的JSON文件中显示文档链接
 */
class JsonDocCodeLensProvider {
    constructor(context) {
        this.context = context;
        this._onDidChangeCodeLenses = new vscode.EventEmitter();
        this.onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;
        this.disposables = [];
        // 创建装饰器类型
        this.decorationType = vscode.window.createTextEditorDecorationType({
            // hover 状态
            backgroundColor: new vscode.ThemeColor('editor.hoverHighlightBackground'),
            cursor: 'help'
        });
        // 监听配置变更，刷新代码镶边
        vscode.workspace.onDidChangeConfiguration((_) => {
            this._onDidChangeCodeLenses.fire();
        });
        // 监听文本编辑器变化
        vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                this.updateDecorations(editor);
            }
        });
        // 监听文档变化
        vscode.workspace.onDidChangeTextDocument(event => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document) {
                this.updateDecorations(editor);
            }
        });
        // 初始化装饰器
        if (vscode.window.activeTextEditor) {
            this.updateDecorations(vscode.window.activeTextEditor);
        }
    }
    updateDecorations(editor) {
        if (!this.isInitJsonFile(editor.document.fileName)) {
            return;
        }
        const text = editor.document.getText();
        const decorations = [];
        const propertyRegex = /(?:^|\s+)['"]?([\w]+)['"]?\s*:/gm;
        let match;
        while ((match = propertyRegex.exec(text)) !== null) {
            const propertyName = match[1];
            if (!propertyName)
                continue;
            const docInfo = this.findDocumentation(propertyName);
            if (docInfo.filePath) {
                const startPos = editor.document.positionAt(match.index + (match[0].indexOf(propertyName)));
                const endPos = editor.document.positionAt(match.index + match[0].indexOf(propertyName) + propertyName.length);
                const range = new vscode.Range(startPos, endPos);
                decorations.push({ range });
            }
        }
        editor.setDecorations(this.decorationType, decorations);
    }
    dispose() {
        this.decorationType.dispose();
        this.disposables.forEach(d => d.dispose());
    }
    /**
     * 判断文件是否在指定目录下
     * @param filePath 文件路径
     * @returns 是否为init-json目录下的JSON文件
     */
    isInitJsonFile(filePath) {
        const normalizedPath = filePath.replace(/\\/g, '/');
        console.log('检查文件路径:', normalizedPath);
        const isMatch = normalizedPath.includes('/init-json/') && normalizedPath.endsWith('.js');
        console.log('是否匹配:', isMatch);
        return isMatch;
    }
    /**
     * 查找Markdown文档
     * @param propertyName 属性名称
     * @returns {filePath?: string} 本地文件路径
     */
    findDocumentation(propertyName) {
        // 构建Markdown文档目录路径
        const mdDocPath = path.join(this.context.extensionPath, 'md-doc');
        console.log(`查找文档，属性名: ${propertyName}, 文档目录: ${mdDocPath}`);
        // 检查目录是否存在
        if (!fs.existsSync(mdDocPath)) {
            console.log('文档目录不存在');
            return {};
        }
        // 只进行精确匹配
        const mdFileName = `${propertyName}.md`;
        const mdFilePath = path.join(mdDocPath, mdFileName);
        if (fs.existsSync(mdFilePath)) {
            console.log(`找到文档: ${mdFilePath}`);
            return { filePath: mdFilePath };
        }
        console.log(`未找到文档: ${mdFileName}`);
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
            console.log(`文件 ${document.fileName} 不在目标目录下`);
            return [];
        }
        console.log(`开始处理文件: ${document.fileName}`);
        const codeLenses = [];
        const text = document.getText();
        // 使用正则表达式匹配所有属性，包括缩进的属性
        const propertyRegex = /(?:^|\s+)['"]?([\w]+)['"]?\s*:/gm;
        let match;
        while ((match = propertyRegex.exec(text)) !== null) {
            if (token.isCancellationRequested) {
                return [];
            }
            // 提取属性名
            const propertyName = match[1];
            if (!propertyName)
                continue;
            const startPos = document.positionAt(match.index + match[0].length);
            const endPos = document.positionAt(match.index + match[0].length + 2); // 为问号图标预留空间
            const range = new vscode.Range(startPos, endPos);
            // 查找文档
            const docInfo = this.findDocumentation(propertyName);
            console.log(`找到属性: ${propertyName}, 文档路径: ${docInfo.filePath || '未找到'}`);
            // 只在有文档的情况下创建代码镶边
            if (docInfo.filePath) {
                const codeLens = new vscode.CodeLens(range, {
                    title: `❓${propertyName}`,
                    command: '',
                    tooltip: `查看 ${propertyName} 的文档`
                });
                codeLenses.push(codeLens);
            }
        }
        console.log(`共找到 ${codeLenses.length} 个代码镶边`);
        return codeLenses;
    }
    async showPropertyDoc(propertyName, docInfo) {
        try {
            // 读取文档内容
            const docContent = fs.readFileSync(docInfo.filePath, 'utf8');
            // 创建一个临时的 untitled 文档
            const doc = await vscode.workspace.openTextDocument({
                content: docContent,
                language: 'markdown'
            });
            // 在新的编辑器中打开文档并显示预览
            await vscode.commands.executeCommand('markdown.showPreview', doc.uri);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`无法加载文档: ${errorMessage}`);
        }
    }
}
exports.JsonDocCodeLensProvider = JsonDocCodeLensProvider;
class JsonDocHoverProvider {
    constructor(context) {
        this.context = context;
    }
    provideHover(document, position, token) {
        if (!this.isInitJsonFile(document.fileName)) {
            return null;
        }
        const line = document.lineAt(position.line);
        const lineText = line.text;
        const character = position.character;
        // 获取当前行的所有属性名位置
        const propertyRegex = /['"]?([\w]+)['"]?\s*:/g;
        let propertyMatch;
        while ((propertyMatch = propertyRegex.exec(lineText)) !== null) {
            const propertyName = propertyMatch[1];
            const startIndex = propertyMatch.index + (propertyMatch[0].indexOf(propertyName));
            const endIndex = startIndex + propertyName.length;
            // 检查光标是否在属性名上
            if (character >= startIndex && character <= endIndex) {
                return this.createHoverForProperty(propertyName, new vscode.Range(position.line, startIndex, position.line, endIndex));
            }
        }
        // 获取当前行的所有问号图标位置
        const questionMarkRegex = /\$\(error\)\s*([\w]+)/g;
        let questionMatch;
        while ((questionMatch = questionMarkRegex.exec(lineText)) !== null) {
            const propertyName = questionMatch[1];
            const fullMatch = questionMatch[0];
            const startIndex = questionMatch.index;
            const endIndex = startIndex + fullMatch.length;
            // 检查光标是否在问号图标或其后的属性名上
            if (character >= startIndex && character <= endIndex) {
                return this.createHoverForProperty(propertyName, new vscode.Range(position.line, startIndex, position.line, endIndex));
            }
        }
        return null;
    }
    isInitJsonFile(filePath) {
        const normalizedPath = filePath.replace(/\\/g, '/');
        return normalizedPath.includes('/init-json/') && normalizedPath.endsWith('.js');
    }
    createHoverForProperty(propertyName, range) {
        const docInfo = this.findDocumentation(propertyName);
        if (!docInfo.filePath) {
            return null;
        }
        try {
            const docContent = fs.readFileSync(docInfo.filePath, 'utf8');
            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(docContent);
            markdown.isTrusted = true;
            markdown.supportHtml = true;
            markdown.supportThemeIcons = true;
            return new vscode.Hover(markdown, range);
        }
        catch (error) {
            console.error('Error providing hover:', error);
            return null;
        }
    }
    findDocumentation(propertyName) {
        const mdDocPath = path.join(this.context.extensionPath, 'md-doc');
        if (!fs.existsSync(mdDocPath)) {
            return {};
        }
        const mdFileName = `${propertyName}.md`;
        const mdFilePath = path.join(mdDocPath, mdFileName);
        if (fs.existsSync(mdFilePath)) {
            return { filePath: mdFilePath };
        }
        return {};
    }
}
exports.JsonDocHoverProvider = JsonDocHoverProvider;
/**
 * 激活JSON文档代码镶边
 * @param context 扩展上下文
 */
function activateJsonDocCodeLens(context) {
    // 创建代码镶边提供者实例
    const provider = new JsonDocCodeLensProvider(context);
    // 创建悬停提供者实例
    const hoverProvider = new JsonDocHoverProvider(context);
    // 注册代码镶边提供者
    const codeLensProvider = vscode.languages.registerCodeLensProvider([
        { language: 'javascript', pattern: '**/init-json/**/*.js' },
        { language: 'typescript', pattern: '**/init-json/**/*.js' }
    ], provider);
    // 注册悬停提供者
    const hoverRegistration = vscode.languages.registerHoverProvider([
        { language: 'javascript', pattern: '**/init-json/**/*.js' },
        { language: 'typescript', pattern: '**/init-json/**/*.js' }
    ], hoverProvider);
    context.subscriptions.push(codeLensProvider, hoverRegistration);
}
exports.activateJsonDocCodeLens = activateJsonDocCodeLens;
//# sourceMappingURL=jsonDocCodeLensProvider.js.map