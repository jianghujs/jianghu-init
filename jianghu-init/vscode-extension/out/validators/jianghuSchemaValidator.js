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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JianghuSchemaValidator = void 0;
const vscode = __importStar(require("vscode"));
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const acorn = __importStar(require("acorn"));
const walk = __importStar(require("acorn-walk"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// 主schema文件
const jianghu_config_schema_json_1 = __importDefault(require("../schemas/jianghu-config.schema.json"));
class JianghuSchemaValidator {
    constructor(context) {
        // 初始化 AJV 实例，启用高级特性
        this.ajv = new ajv_1.default({
            allErrors: true,
            verbose: true,
            messages: true,
            strict: false,
            $data: true,
            discriminator: true,
            logger: false // 禁用控制台日志
        });
        // 添加格式验证和错误信息增强
        (0, ajv_formats_1.default)(this.ajv);
        (0, ajv_errors_1.default)(this.ajv);
        // 添加自定义关键字，用于更精确的错误定位
        this.ajv.addKeyword({
            keyword: 'errorPath',
            validate: () => true,
            errors: false
        });
        // 注册所有schema
        this.registerSchemas();
        // 编译主schema
        this.validateFn = this.ajv.compile(jianghu_config_schema_json_1.default);
        // 创建诊断集合
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('jianghu-config');
        context.subscriptions.push(this.diagnosticCollection);
    }
    /**
     * 注册所有schema文件
     */
    registerSchemas() {
        // 注册主schema
        this.ajv.addSchema(jianghu_config_schema_json_1.default, 'jianghu-config.schema.json');
        // 注册子schema目录
        const schemasDir = path.join(__dirname, '..', 'schemas');
        this.registerSchemaDir(schemasDir);
    }
    /**
     * 递归注册目录中的所有schema文件
     */
    registerSchemaDir(dir) {
        if (!fs.existsSync(dir)) {
            console.warn(`Schema目录不存在: ${dir}`);
            return;
        }
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) {
                this.registerSchemaDir(filePath);
            }
            else if (file.endsWith('.schema.json') && file !== 'jianghu-config.schema.json') {
                try {
                    const schema = require(filePath);
                    this.ajv.addSchema(schema, schema.$id || file);
                }
                catch (error) {
                    console.error(`加载schema文件失败: ${filePath}`, error);
                }
            }
        }
    }
    /**
     * 验证文档
     */
    validate(document) {
        if (!this.isTargetFile(document.uri.fsPath)) {
            return;
        }
        try {
            const content = document.getText();
            const { configObject, location } = this.extractModuleExports(content);
            if (!configObject || !location) {
                return;
            }
            const valid = this.validateFn(configObject);
            if (!valid && this.validateFn.errors) {
                // 记录原始错误，用于调试
                console.log('原始验证错误:', JSON.stringify(this.validateFn.errors, null, 2));
                // 对错误进行分组和过滤，保留最具体的错误
                const filteredErrors = this.filterErrors(this.validateFn.errors);
                // 创建诊断信息
                const diagnostics = this.createDiagnostics(document, filteredErrors, location);
                this.diagnosticCollection.set(document.uri, diagnostics);
            }
            else {
                this.diagnosticCollection.delete(document.uri);
            }
        }
        catch (error) {
            console.error('验证过程出错:', error);
        }
    }
    /**
     * 过滤和分组错误，保留最具体的错误
     */
    filterErrors(errors) {
        // 首先按照路径分组
        const errorsByPath = new Map();
        for (const error of errors) {
            const path = error.instancePath || '/';
            if (!errorsByPath.has(path)) {
                errorsByPath.set(path, []);
            }
            errorsByPath.get(path).push(error);
        }
        // 过滤掉被更具体路径包含的路径
        const pathsToKeep = new Set();
        for (const path of errorsByPath.keys()) {
            let shouldKeep = true;
            for (const otherPath of errorsByPath.keys()) {
                // 如果当前路径是其他路径的父路径，且不是同一路径
                if (path !== otherPath && otherPath.startsWith(path + '/')) {
                    shouldKeep = false;
                    break;
                }
            }
            if (shouldKeep) {
                pathsToKeep.add(path);
            }
        }
        // 收集要保留的错误
        let result = [];
        for (const path of pathsToKeep) {
            const pathErrors = errorsByPath.get(path);
            // 优先保留 required 错误，其次是 additionalProperties 错误
            const requiredErrors = pathErrors.filter(e => e.keyword === 'required');
            const additionalPropsErrors = pathErrors.filter(e => e.keyword === 'additionalProperties');
            if (requiredErrors.length > 0) {
                result.push(...requiredErrors);
            }
            else if (additionalPropsErrors.length > 0) {
                result.push(...additionalPropsErrors);
            }
            else {
                result.push(...pathErrors);
            }
        }
        // 对错误进行排序，使 required 错误排在最前面，其次是 additionalProperties 错误
        result.sort((a, b) => {
            if (a.keyword === 'required' && b.keyword !== 'required') {
                return -1;
            }
            if (a.keyword !== 'required' && b.keyword === 'required') {
                return 1;
            }
            if (a.keyword === 'additionalProperties' && b.keyword !== 'additionalProperties' && b.keyword !== 'required') {
                return -1;
            }
            if (a.keyword !== 'additionalProperties' && b.keyword === 'additionalProperties' && a.keyword !== 'required') {
                return 1;
            }
            return 0;
        });
        return result;
    }
    /**
     * 判断文件是否为目标验证文件
     */
    isTargetFile(filePath) {
        return /\/(page-template-json|init-json)\/.*\.js$/.test(filePath);
    }
    /**
     * 从JS文件中提取模块导出的配置对象
     */
    extractModuleExports(content) {
        try {
            const ast = acorn.parse(content, {
                ecmaVersion: 2020,
                sourceType: 'module'
            });
            let configObject = null;
            let location = null;
            let variableName = null;
            // 第一步：查找变量声明
            walk.simple(ast, {
                VariableDeclaration(node) {
                    if (node.declarations.length === 1) {
                        const declaration = node.declarations[0];
                        if (declaration.init && declaration.init.type === 'ObjectExpression') {
                            try {
                                const objectContent = content.slice(declaration.init.start, declaration.init.end);
                                configObject = eval(`(${objectContent})`);
                                location = {
                                    start: declaration.init.start,
                                    end: declaration.init.end,
                                    node: declaration.init
                                };
                                variableName = declaration.id.name;
                            }
                            catch (e) {
                                console.error('解析变量对象失败:', e);
                            }
                        }
                    }
                }
            });
            // 第二步：查找 module.exports 赋值
            walk.simple(ast, {
                AssignmentExpression(node) {
                    if (node.left.type === 'MemberExpression' &&
                        node.left.object.name === 'module' &&
                        node.left.property.name === 'exports') {
                        if (node.right.type === 'ObjectExpression') {
                            // 直接赋值对象的情况
                            try {
                                const objectContent = content.slice(node.right.start, node.right.end);
                                configObject = eval(`(${objectContent})`);
                                location = {
                                    start: node.right.start,
                                    end: node.right.end,
                                    node: node.right
                                };
                            }
                            catch (e) {
                                console.error('解析导出对象失败:', e);
                            }
                        }
                        else if (node.right.type === 'Identifier' &&
                            variableName &&
                            node.right.name === variableName) {
                            // 使用已定义变量的情况
                            // 此时 configObject 和 location 已经在第一步中设置
                        }
                    }
                }
            });
            return { configObject, location };
        }
        catch (error) {
            console.error('解析JS文件失败:', error);
            return { configObject: null, location: null };
        }
    }
    /**
     * 创建诊断信息
     */
    createDiagnostics(document, errors, location) {
        return errors.map(error => {
            // 获取错误范围
            const range = this.getErrorRange(document, error, location);
            // 格式化错误消息
            const message = this.formatErrorMessage(error);
            // 创建诊断信息
            const diagnostic = new vscode.Diagnostic(range, message, this.getDiagnosticSeverity(error));
            // 添加错误代码和链接
            diagnostic.code = {
                value: error.keyword,
                target: vscode.Uri.parse(`https://ajv.js.org/keywords.html#${error.keyword}`)
            };
            // 添加自定义数据，用于快速修复
            diagnostic.data = {
                instancePath: error.instancePath,
                keyword: error.keyword,
                params: error.params,
                schemaPath: error.schemaPath
            };
            return diagnostic;
        });
    }
    /**
     * 获取诊断严重性
     */
    getDiagnosticSeverity(error) {
        // 根据错误类型确定严重性
        switch (error.keyword) {
            case 'additionalProperties':
                return vscode.DiagnosticSeverity.Warning;
            case 'required':
                return vscode.DiagnosticSeverity.Error;
            default:
                return vscode.DiagnosticSeverity.Error;
        }
    }
    /**
     * 获取错误范围
     */
    getErrorRange(document, error, location) {
        // 解析JSON路径
        const path = error.instancePath ? error.instancePath.split('/').filter(Boolean) : [];
        // 检查是否有自定义错误路径
        if (error.params && error.params.errorPath) {
            path.push(error.params.errorPath);
        }
        // 处理额外属性错误，只标记属性键
        if (error.keyword === 'additionalProperties') {
            const additionalProp = error.params.additionalProperty;
            let currentNode = location.node;
            // 导航到包含额外属性的对象
            for (const key of path) {
                if (currentNode.type === 'ObjectExpression') {
                    const property = currentNode.properties.find((p) => (p.key.type === 'Identifier' && p.key.name === key) ||
                        (p.key.type === 'Literal' && p.key.value === key));
                    if (property) {
                        currentNode = property.value;
                    }
                    else {
                        break;
                    }
                }
                else if (currentNode.type === 'ArrayExpression') {
                    const index = parseInt(key, 10);
                    if (!isNaN(index) && index < currentNode.elements.length) {
                        currentNode = currentNode.elements[index];
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            // 在当前对象中查找额外属性的键
            if (currentNode.type === 'ObjectExpression') {
                const property = currentNode.properties.find((p) => (p.key.type === 'Identifier' && p.key.name === additionalProp) ||
                    (p.key.type === 'Literal' && p.key.value === additionalProp));
                if (property) {
                    // 只标记属性键，而不是整个属性
                    const start = document.positionAt(property.key.start);
                    const end = document.positionAt(property.key.end);
                    return new vscode.Range(start, end);
                }
            }
        }
        // 处理required错误，标记整个对象
        if (error.keyword === 'required') {
            const missingProp = error.params.missingProperty;
            let currentNode = location.node;
            // 导航到缺少属性的对象
            for (const key of path) {
                if (currentNode.type === 'ObjectExpression') {
                    const property = currentNode.properties.find((p) => (p.key.type === 'Identifier' && p.key.name === key) ||
                        (p.key.type === 'Literal' && p.key.value === key));
                    if (property) {
                        currentNode = property.value;
                    }
                    else {
                        break;
                    }
                }
                else if (currentNode.type === 'ArrayExpression') {
                    const index = parseInt(key, 10);
                    if (!isNaN(index) && index < currentNode.elements.length) {
                        currentNode = currentNode.elements[index];
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            // 标记整个对象
            if (currentNode) {
                const start = document.positionAt(currentNode.start);
                const end = document.positionAt(currentNode.end);
                return new vscode.Range(start, end);
            }
        }
        // 处理一般错误，尝试精确定位到属性或元素
        return this.getNodeRangeByPath(document, path, location);
    }
    /**
     * 根据路径获取节点范围
     */
    getNodeRangeByPath(document, path, location) {
        if (path.length === 0) {
            const startPos = document.positionAt(location.start);
            const endPos = document.positionAt(location.end);
            return new vscode.Range(startPos, endPos);
        }
        let currentNode = location.node;
        // 遍历路径，定位到具体节点
        for (let i = 0; i < path.length; i++) {
            const key = path[i];
            // 处理数组索引
            if (!isNaN(Number(key))) {
                const arrayIndex = Number(key);
                if (currentNode.type === 'ArrayExpression') {
                    // 直接处理数组元素
                    if (arrayIndex < currentNode.elements.length) {
                        currentNode = currentNode.elements[arrayIndex];
                    }
                    else {
                        // 如果索引超出范围，标记整个数组
                        break;
                    }
                }
                else if (currentNode.type === 'ObjectExpression') {
                    // 可能是数组属性的一个元素
                    const arrayProp = path[i - 1];
                    const property = currentNode.properties.find((p) => (p.key.type === 'Identifier' && p.key.name === arrayProp) ||
                        (p.key.type === 'Literal' && p.key.value === arrayProp));
                    if (property && property.value.type === 'ArrayExpression') {
                        if (arrayIndex < property.value.elements.length) {
                            currentNode = property.value.elements[arrayIndex];
                        }
                        else {
                            // 如果索引超出范围，标记整个数组
                            currentNode = property.value;
                        }
                    }
                    else {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            // 处理对象属性
            else if (currentNode.type === 'ObjectExpression') {
                const property = currentNode.properties.find((p) => (p.key.type === 'Identifier' && p.key.name === key) ||
                    (p.key.type === 'Literal' && p.key.value === key));
                if (property) {
                    currentNode = property.value;
                }
                else {
                    // 如果找不到属性，尝试定位到最接近的节点
                    break;
                }
            }
            else {
                break;
            }
        }
        // 如果找到了具体的节点，就标记该节点
        if (currentNode) {
            const start = document.positionAt(currentNode.start);
            const end = document.positionAt(currentNode.end);
            return new vscode.Range(start, end);
        }
        // 如果没有找到具体节点，返回整个对象的位置
        const startPos = document.positionAt(location.start);
        const endPos = document.positionAt(location.end);
        return new vscode.Range(startPos, endPos);
    }
    /**
     * 格式化错误消息
     */
    formatErrorMessage(error) {
        // 获取路径部分
        const pathParts = error.instancePath ? error.instancePath.split('/').filter(Boolean) : [];
        // 使用最后的键名作为主要标识
        const lastPathPart = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '根对象';
        // 对于数字索引，尝试添加父级路径以提供更多上下文
        let displayPath = lastPathPart;
        if (!isNaN(Number(lastPathPart)) && pathParts.length > 1) {
            // 如果最后部分是数字索引，添加父级路径
            const parentPath = pathParts[pathParts.length - 2];
            displayPath = `${parentPath}[${lastPathPart}]`;
        }
        // 根据错误类型构建简洁的错误消息
        switch (error.keyword) {
            case 'additionalProperties':
                return `不支持的额外属性: ${error.params.additionalProperty}`;
            case 'required':
                return `缺少必需的属性: ${error.params.missingProperty}`;
            case 'enum':
                return `${displayPath}: 值必须是以下之一: ${error.params.allowedValues.join(', ')}`;
            case 'type':
                return `${displayPath}: 类型错误，应为 ${error.params.type}`;
            case 'format':
                return `${displayPath}: 格式不正确 (${error.params.format})`;
            case 'pattern':
                return `${displayPath}: 格式不正确`;
            case 'oneOf':
                return `${displayPath}: 结构不符合要求`;
            default:
                return `${displayPath}: ${error.message}`;
        }
    }
}
exports.JianghuSchemaValidator = JianghuSchemaValidator;
//# sourceMappingURL=jianghuSchemaValidator.js.map