import * as vscode from 'vscode';
import * as path from 'path';

/**
 * JSON模板文件的预设key
 */
const JSON_TEMPLATE_KEYS = {
  // 顶级属性
  topLevel: [
    {
      label: 'pageType',
      detail: '页面类型',
      documentation: '页面类型，如jh-page、jh-mobile-page等',
      insertText: 'pageType: "${1:jh-page}"',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'pageId',
      detail: '页面ID',
      documentation: '页面的唯一标识符',
      insertText: 'pageId: "${1:pageId}"',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'pageName',
      detail: '页面名称',
      documentation: '页面的显示名称',
      insertText: 'pageName: "${1:页面名称}"',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'resourceList',
      detail: '资源列表',
      documentation: '页面所需的资源列表',
      insertText: 'resourceList: [\n  $1\n]',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'pageData',
      detail: '页面数据',
      documentation: '页面的数据配置',
      insertText: 'pageData: {\n  $1\n}',
      kind: vscode.CompletionItemKind.Property
    }
  ],
  
  // 资源项属性
  resource: [
    {
      label: 'actionId',
      detail: '操作ID',
      documentation: '资源操作的唯一标识符',
      insertText: 'actionId: "${1:actionId}"',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'resourceType',
      detail: '资源类型',
      documentation: '资源的类型，如sql、service等',
      insertText: 'resourceType: "${1:sql}"',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'resourceHook',
      detail: '资源钩子',
      documentation: '资源的前置和后置钩子',
      insertText: 'resourceHook: {\n  $1\n}',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'desc',
      detail: '描述',
      documentation: '资源的描述信息',
      insertText: 'desc: "${1:描述}"',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'resourceData',
      detail: '资源数据',
      documentation: '资源的具体数据配置',
      insertText: 'resourceData: {\n  $1\n}',
      kind: vscode.CompletionItemKind.Property
    }
  ],
  
  // 资源数据属性
  resourceData: [
    {
      label: 'table',
      detail: '表名',
      documentation: '操作的数据表名',
      insertText: 'table: "${1:tableName}"',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'operation',
      detail: '操作类型',
      documentation: '数据操作类型，如select、jhInsert、jhUpdate、jhDelete等',
      insertText: 'operation: "${1:select}"',
      kind: vscode.CompletionItemKind.Property
    }
  ],
  
  // 页面数据属性
  pageData: [
    {
      label: 'listColumnList',
      detail: '列表列配置',
      documentation: '表格列表的列配置',
      insertText: 'listColumnList: [\n  $1\n]',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'formColumnList',
      detail: '表单列配置',
      documentation: '表单的字段配置',
      insertText: 'formColumnList: [\n  $1\n]',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'searchFormColumnList',
      detail: '搜索表单列配置',
      documentation: '搜索表单的字段配置',
      insertText: 'searchFormColumnList: [\n  $1\n]',
      kind: vscode.CompletionItemKind.Property
    }
  ],
  
  // 列配置属性
  column: [
    {
      label: 'title',
      detail: '标题',
      documentation: '列的显示标题',
      insertText: 'title: "${1:标题}"',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'dataIndex',
      detail: '数据索引',
      documentation: '列对应的数据字段名',
      insertText: 'dataIndex: "${1:fieldName}"',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'componentType',
      detail: '组件类型',
      documentation: '表单字段的组件类型，如Input、Select等',
      insertText: 'componentType: "${1:Input}"',
      kind: vscode.CompletionItemKind.Property
    },
    {
      label: 'formatType',
      detail: '格式化类型',
      documentation: '数据的格式化类型，如datetime、money等',
      insertText: 'formatType: "${1:datetime}"',
      kind: vscode.CompletionItemKind.Property
    }
  ],
  
  // 完整模板
  templates: [
    {
      label: 'crudTemplate',
      detail: 'CRUD模板',
      documentation: '创建一个完整的CRUD页面模板',
      insertText: `const content = {
  pageType: "jh-page", pageId: "\${1:pageId}", pageName: "\${2:页面名称}", 
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅查询列表",
      resourceData: {
        table: "\${3:tableName}",
        operation: "select"
      }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅添加",
      resourceData: {
        table: "\${3:tableName}",
        operation: "jhInsert"
      }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅更新",
      resourceData: {
        table: "\${3:tableName}",
        operation: "jhUpdate"
      }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      resourceHook: {},
      desc: "✅删除",
      resourceData: {
        table: "\${3:tableName}",
        operation: "jhDelete"
      }
    }
  ],
  pageData: {
    listColumnList: [
      {
        title: "ID",
        dataIndex: "id",
        width: 100,
      },
      \${4}
    ],
    formColumnList: [
      \${5}
    ]
  }
};

module.exports = content;`,
      kind: vscode.CompletionItemKind.Snippet
    }
  ]
};

/**
 * 判断文件是否在指定目录下
 * @param filePath 文件路径
 * @param targetDirs 目标目录列表
 */
function isFileInTargetDirs(filePath: string, targetDirs: string[]): boolean {
  const normalizedPath = filePath.replace(/\\/g, '/');
  return targetDirs.some(dir => normalizedPath.includes(dir));
}

/**
 * JSON模板代码补全提供者
 */
export class JsonTemplateCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
    // 检查文件是否在目标目录下
    const targetDirs = [
      'page-template-json',
      'init-json'
    ];
    
    if (!isFileInTargetDirs(document.fileName, targetDirs)) {
      return undefined;
    }
    
    // 获取当前行文本
    const lineText = document.lineAt(position).text.substring(0, position.character);
    
    // 创建补全项
    const completionItems: vscode.CompletionItem[] = [];
    
    // 根据上下文提供不同的补全项
    if (lineText.match(/^\s*const\s+content\s*=\s*{\s*$/)) {
      // 顶级属性
      JSON_TEMPLATE_KEYS.topLevel.forEach(item => {
        const completionItem = new vscode.CompletionItem(item.label, item.kind);
        completionItem.detail = item.detail;
        completionItem.documentation = new vscode.MarkdownString(item.documentation);
        completionItem.insertText = new vscode.SnippetString(item.insertText);
        completionItems.push(completionItem);
      });
    } else if (lineText.match(/resourceList.*{\s*$/)) {
      // 资源项属性
      JSON_TEMPLATE_KEYS.resource.forEach(item => {
        const completionItem = new vscode.CompletionItem(item.label, item.kind);
        completionItem.detail = item.detail;
        completionItem.documentation = new vscode.MarkdownString(item.documentation);
        completionItem.insertText = new vscode.SnippetString(item.insertText);
        completionItems.push(completionItem);
      });
    } else if (lineText.match(/resourceData.*{\s*$/)) {
      // 资源数据属性
      JSON_TEMPLATE_KEYS.resourceData.forEach(item => {
        const completionItem = new vscode.CompletionItem(item.label, item.kind);
        completionItem.detail = item.detail;
        completionItem.documentation = new vscode.MarkdownString(item.documentation);
        completionItem.insertText = new vscode.SnippetString(item.insertText);
        completionItems.push(completionItem);
      });
    } else if (lineText.match(/pageData.*{\s*$/)) {
      // 页面数据属性
      JSON_TEMPLATE_KEYS.pageData.forEach(item => {
        const completionItem = new vscode.CompletionItem(item.label, item.kind);
        completionItem.detail = item.detail;
        completionItem.documentation = new vscode.MarkdownString(item.documentation);
        completionItem.insertText = new vscode.SnippetString(item.insertText);
        completionItems.push(completionItem);
      });
    } else if (lineText.match(/(?:listColumnList|formColumnList|searchFormColumnList).*{\s*$/)) {
      // 列配置属性
      JSON_TEMPLATE_KEYS.column.forEach(item => {
        const completionItem = new vscode.CompletionItem(item.label, item.kind);
        completionItem.detail = item.detail;
        completionItem.documentation = new vscode.MarkdownString(item.documentation);
        completionItem.insertText = new vscode.SnippetString(item.insertText);
        completionItems.push(completionItem);
      });
    } else if (position.character === 0) {
      // 文件开头，提供完整模板
      JSON_TEMPLATE_KEYS.templates.forEach(item => {
        const completionItem = new vscode.CompletionItem(item.label, item.kind);
        completionItem.detail = item.detail;
        completionItem.documentation = new vscode.MarkdownString(item.documentation);
        completionItem.insertText = new vscode.SnippetString(item.insertText);
        completionItems.push(completionItem);
      });
    }
    
    return completionItems;
  }
}

/**
 * 激活JSON模板代码补全
 * @param context 扩展上下文
 */
export function activateJsonTemplateCompletion(context: vscode.ExtensionContext): void {
  // 注册代码补全提供者
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: 'javascript', pattern: '**/{page-template-json,init-json}/**/*.js' },
    new JsonTemplateCompletionProvider(),
    // 触发字符
    ':', '{', '['
  );
  
  context.subscriptions.push(completionProvider);
} 