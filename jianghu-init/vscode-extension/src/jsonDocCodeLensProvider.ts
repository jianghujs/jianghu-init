import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import * as marked from 'marked';

/**
 * JSON文档代码镶边提供者
 * 在/app/view/init-json/目录中的JSON文件中显示文档链接
 */
export class JsonDocCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;
  private disposables: vscode.Disposable[] = [];

  constructor(private context: vscode.ExtensionContext) {
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
  private isInitJsonFile(filePath: string): boolean {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return normalizedPath.includes('/app/view/init-json/') && normalizedPath.endsWith('.js');
  }

  /**
   * 查找Markdown文档
   * @param propertyName 属性名称
   * @returns {filePath?: string} 本地文件路径
   */
  private findDocumentation(propertyName: string): {filePath?: string} {
    // 构建Markdown文档目录路径
    const mdDocPath = path.join(this.context.extensionPath, 'md-doc');
    
    console.log(`查找文档，属性名: ${propertyName}, 文档目录: ${mdDocPath}`);
    
    // 检查目录是否存在
    if (!fs.existsSync(mdDocPath)) {
      console.log('文档目录不存在');
      return {};
    }
    
    // 尝试查找匹配的Markdown文件
    const mdFileName = `${propertyName}.md`;
    const mdFilePath = path.join(mdDocPath, mdFileName);
    
    if (fs.existsSync(mdFilePath)) {
      console.log(`找到精确匹配的文档: ${mdFilePath}`);
      return { filePath: mdFilePath };
    }
    
    // 如果没有找到精确匹配，尝试查找相关文档
    const files = fs.readdirSync(mdDocPath);
    console.log(`文档目录中的文件: ${files.join(', ')}`);
    
    for (const file of files) {
      if (file.endsWith('.md') && file.toLowerCase().includes(propertyName.toLowerCase())) {
        console.log(`找到相关文档: ${file}`);
        return { filePath: path.join(mdDocPath, file) };
      }
    }
    
    console.log('未找到匹配的文档');
    return {};
  }

  /**
   * 提供代码镶边
   * @param document 文档
   * @param token 取消令牌
   * @returns 代码镶边列表
   */
  public provideCodeLenses(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CodeLens[]> {
    // 检查文件是否在目标目录下
    if (!this.isInitJsonFile(document.fileName)) {
      console.log(`文件 ${document.fileName} 不在目标目录下`);
      return [];
    }
    
    console.log(`开始处理文件: ${document.fileName}`);
    const codeLenses: vscode.CodeLens[] = [];
    const text = document.getText();
    
    // 使用正则表达式匹配所有可能的属性定义
    const propertyRegexes = [
      /'([^']+)'\s*:/g,  // 匹配 'property': 
      /"([^"]+)"\s*:/g,  // 匹配 "property":
      /(\w+)\s*:/g       // 匹配 property:
    ];
    
    for (const regex of propertyRegexes) {
      let match;
      while ((match = regex.exec(text)) !== null) {
        if (token.isCancellationRequested) {
          return [];
        }
        
        // 提取属性名
        const propertyName = match[1];
        if (!propertyName) continue;
        
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        const range = new vscode.Range(startPos, endPos);
        
        // 查找文档
        const docInfo = this.findDocumentation(propertyName);
        
        console.log(`找到属性: ${propertyName}, 文档路径: ${docInfo.filePath || '未找到'}`);
        
        // 只有找到对应文档时才创建代码镶边
        if (docInfo.filePath) {
          const codeLens = new vscode.CodeLens(range, {
            title: '❓帮助文档',
            command: 'jianghu-init-vscode.showPropertyDoc',
            arguments: [docInfo, propertyName],
            tooltip: `查看 ${propertyName} 的文档`
          });
          
          codeLenses.push(codeLens);
        }
      }
    }
    
    console.log(`共找到 ${codeLenses.length} 个代码镶边`);
    return codeLenses;
  }

  private getDocInfo(propertyName: string): { filePath: string } | undefined {
    // 这里可以根据属性名返回对应的文档文件路径
    const docPath = path.join(this.context.extensionPath, 'md-doc', `${propertyName}.md`);
    if (fs.existsSync(docPath)) {
      return { filePath: docPath };
    }
    return undefined;
  }

  public async showPropertyDoc(propertyName: string, docInfo: { filePath: string }): Promise<void> {
    try {
      // 读取文档内容
      const docContent = fs.readFileSync(docInfo.filePath, 'utf8');
      
      // 创建并显示 WebviewPanel
      const panel = vscode.window.createWebviewPanel(
        'propertyDoc',
        `${propertyName} 文档`,
        vscode.ViewColumn.Two, // 在右侧显示
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      // 设置面板内容
      panel.webview.html = this.getWebviewContent(docContent);

      // 显示面板
      panel.reveal(vscode.ViewColumn.Two);

      // 当面板关闭时释放资源
      panel.onDidDispose(() => {
        // 清理资源
      }, null, this.disposables);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      vscode.window.showErrorMessage(`无法加载文档: ${errorMessage}`);
    }
  }

  private getWebviewContent(docContent: string): string {
    return `<!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>属性文档</title>
        <style>
            body {
                padding: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                line-height: 1.6;
                background-color: #1e1e1e;
                color: #d4d4d4;
            }
            h1 {
                color: #e0e0e0;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
            }
            h2 {
                color: #e0e0e0;
                margin-top: 20px;
            }
            pre {
                background-color: #2d2d2d;
                padding: 15px;
                border-radius: 5px;
                overflow-x: auto;
                border: 1px solid #404040;
            }
            code {
                font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
                background-color: #2d2d2d;
                padding: 2px 5px;
                border-radius: 3px;
                color: #d4d4d4;
            }
            p {
                margin: 10px 0;
            }
            ul, ol {
                margin: 10px 0;
                padding-left: 20px;
            }
            blockquote {
                border-left: 4px solid #404040;
                margin: 10px 0;
                padding-left: 15px;
                color: #a0a0a0;
            }
            a {
                color: #6ea9ff;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
            table {
                border-collapse: collapse;
                width: 100%;
                margin: 15px 0;
            }
            th, td {
                border: 1px solid #404040;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #2d2d2d;
            }
            tr:nth-child(even) {
                background-color: #252525;
            }
        </style>
    </head>
    <body>
        ${marked.parse(docContent)}
    </body>
    </html>`;
  }
}

/**
 * 从URL获取内容
 * @param url 网址
 * @returns Promise<string> 网页内容
 */
function fetchUrlContent(url: string): Promise<string> {
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
function extractMainContent(htmlContent: string): string {
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
 * 激活JSON文档代码镶边
 * @param context 扩展上下文
 */
export function activateJsonDocCodeLens(context: vscode.ExtensionContext): void {
  // 创建代码镶边提供者实例
  const provider = new JsonDocCodeLensProvider(context);
  
  // 注册代码镶边提供者
  const codeLensProvider = vscode.languages.registerCodeLensProvider(
    { language: 'javascript', pattern: '**/app/view/init-json/**/*.js' },
    provider
  );
  
  // 注册命令
  const showDocCommand = vscode.commands.registerCommand(
    'jianghu-init-vscode.showPropertyDoc',
    (docInfo: { filePath: string }, propertyName: string) => {
      provider.showPropertyDoc(propertyName, docInfo);
    }
  );
  
  context.subscriptions.push(codeLensProvider, showDocCommand);
} 