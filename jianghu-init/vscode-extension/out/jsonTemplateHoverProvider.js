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
exports.activateJsonTemplateHover = exports.JsonTemplateHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
/**
 * JSON模板文件的预设key说明
 */
const JSON_TEMPLATE_KEY_DOCS = {
    // 顶级属性
    'pageType': '页面类型，如jh-page、jh-mobile-page等',
    'pageId': '页面的唯一标识符',
    'pageName': '页面的显示名称',
    'resourceList': '页面所需的资源列表',
    'pageData': '页面的数据配置',
    // 资源项属性
    'actionId': '资源操作的唯一标识符',
    'resourceType': '资源的类型，如sql、service等',
    'resourceHook': '资源的前置和后置钩子',
    'desc': '资源的描述信息',
    'resourceData': '资源的具体数据配置',
    // 资源数据属性
    'table': '操作的数据表名',
    'operation': '数据操作类型，如select、jhInsert、jhUpdate、jhDelete等',
    // 页面数据属性
    'listColumnList': '表格列表的列配置',
    'formColumnList': '表单的字段配置',
    'searchFormColumnList': '搜索表单的字段配置',
    // 列配置属性
    'title': '列的显示标题',
    'dataIndex': '列对应的数据字段名',
    'componentType': '表单字段的组件类型，如Input、Select等',
    'formatType': '数据的格式化类型，如datetime、money等',
    'width': '列的宽度',
    'sorter': '是否可排序',
    'defaultValue': '字段的默认值',
    'placeholder': '输入框的占位文本',
    'options': '下拉选项的配置',
    'rules': '表单验证规则',
    'disabled': '是否禁用',
    'hidden': '是否隐藏'
};
/**
 * 判断文件是否在指定目录下
 * @param filePath 文件路径
 * @param targetDirs 目标目录列表
 */
function isFileInTargetDirs(filePath, targetDirs) {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return targetDirs.some(dir => normalizedPath.includes(dir));
}
/**
 * JSON模板悬停提示提供者
 */
class JsonTemplateHoverProvider {
    provideHover(document, position, token) {
        // 检查文件是否在目标目录下
        const targetDirs = [
            'page-template-json',
            'init-json'
        ];
        if (!isFileInTargetDirs(document.fileName, targetDirs)) {
            return null;
        }
        // 获取当前单词
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }
        const word = document.getText(range);
        // 检查是否是预设key
        if (word in JSON_TEMPLATE_KEY_DOCS) {
            const description = JSON_TEMPLATE_KEY_DOCS[word];
            // 创建悬停提示
            return new vscode.Hover([
                new vscode.MarkdownString(`### ${word}\n\n${description}`)
            ]);
        }
        return null;
    }
}
exports.JsonTemplateHoverProvider = JsonTemplateHoverProvider;
/**
 * 激活JSON模板悬停提示
 * @param context 扩展上下文
 */
function activateJsonTemplateHover(context) {
    // 注册悬停提示提供者
    const hoverProvider = vscode.languages.registerHoverProvider({ language: 'javascript', pattern: '**/{page-template-json,init-json}/**/*.js' }, new JsonTemplateHoverProvider());
    context.subscriptions.push(hoverProvider);
}
exports.activateJsonTemplateHover = activateJsonTemplateHover;
//# sourceMappingURL=jsonTemplateHoverProvider.js.map