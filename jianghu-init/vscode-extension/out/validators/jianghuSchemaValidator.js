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
exports.V7DeprecatedKeyCodeActionProvider = exports.JianghuSchemaValidator = exports.collectV7DeprecatedKeys = void 0;
const vscode = __importStar(require("vscode"));
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv_errors_1 = __importDefault(require("ajv-errors"));
const acorn = __importStar(require("acorn"));
const walk = __importStar(require("acorn-walk"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// 组合入口（v6 | legacy oneOf），供 $id 解析与文档工具
const jianghu_config_schema_json_1 = __importDefault(require("../schemas/jianghu-config.schema.json"));
const jianghu_config_legacy_schema_json_1 = __importDefault(require("../schemas/jianghu-config-legacy.schema.json"));
const include_list_schema_json_1 = __importDefault(require("../schemas/components/include-list.schema.json"));
const resource_list_schema_json_1 = __importDefault(require("../schemas/components/resource-list.schema.json"));
const v6_page_tree_schema_json_1 = __importDefault(require("../schemas/components/v6-page-tree.schema.json"));
// v6 完整文档
const jianghu_config_v6_schema_json_1 = __importDefault(require("../schemas/v6/jianghu-config-v6.schema.json"));
const jianghu_config_v7_schema_json_1 = __importDefault(require("../schemas/v7/jianghu-config-v7.schema.json"));
const v7_key_migrations_json_1 = __importDefault(require("../generated/v7-key-migrations.json"));
/** V7 根级互斥字段 → 简短提示（标在属性键上，不含「根对象」前缀） */
const V7_FORBIDDEN_PROPERTY_MSG = {
    resourceList: 'jh-component 不需要 resourceList',
    page: 'jh-component 不需要 page',
    pageContent: 'CRUD 不需要根级 pageContent',
    mode: 'UI 模式不需要 mode',
    fields: 'UI 模式不需要 fields',
    views: 'UI 模式不需要 views',
    dataSource: 'UI 模式不需要 dataSource',
    pc: 'UI 模式不需要根级 pc',
    mobile: 'UI 模式不需要根级 mobile',
};
const migrationsToMap = (items) => Object.fromEntries(items.map(item => [item.from, item.to]));
const V7_RUNTIME_PROP_MIGRATIONS = Object.fromEntries(Object.entries(v7_key_migrations_json_1.default.runtime).map(([component, items]) => [component, migrationsToMap(items)]));
const structuralListFlatToSearch = migrationsToMap(v7_key_migrations_json_1.default.structural.listIntoSearch);
const structuralSheetDeprecated = v7_key_migrations_json_1.default.structural.sheet;
const resolveRuntimePropAliases = (component) => {
    const groups = v7_key_migrations_json_1.default.runtimeGroups?.[component];
    const names = groups || (V7_RUNTIME_PROP_MIGRATIONS[component] ? [component] : []);
    return Object.assign({}, ...names.map(name => V7_RUNTIME_PROP_MIGRATIONS[name] || {}));
};
const hasOwn = (value, key) => value != null && Object.prototype.hasOwnProperty.call(value, key);
/** 收集 V7 旧 key；结构 Error 仍由 AJV 负责。 */
function collectV7DeprecatedKeys(config) {
    const result = [];
    const addFromObject = (value, path, aliases) => {
        if (!value || typeof value !== 'object')
            return;
        for (const [property, replacement] of Object.entries(aliases)) {
            if (hasOwn(value, property))
                result.push({ path, property, replacement });
        }
    };
    if (typeof config?.page?.template === 'string') {
        result.push({
            path: ['page'],
            property: 'template',
            replacement: v7_key_migrations_json_1.default.structural.pageTemplateString,
        });
    }
    (config?.includeList || []).forEach((item, index) => {
        for (const { from, to } of v7_key_migrations_json_1.default.structural.includeListItem) {
            if (hasOwn(item, from)) {
                result.push({ path: ['includeList', String(index)], property: from, replacement: to });
            }
        }
    });
    for (const [fieldKey, field] of Object.entries(config?.fields || {})) {
        addFromObject(field, ['fields', fieldKey], migrationsToMap(v7_key_migrations_json_1.default.structural.field));
    }
    const list = config?.views?.list;
    addFromObject(list, ['views', 'list'], {
        ...migrationsToMap(v7_key_migrations_json_1.default.semantic.list),
        ...structuralListFlatToSearch,
    });
    addFromObject(list?.search, ['views', 'list', 'search'], migrationsToMap(v7_key_migrations_json_1.default.structural.listSearch));
    const visitFormView = (view, path, includeTabs) => {
        addFromObject(view, path, {
            ...migrationsToMap(includeTabs ? v7_key_migrations_json_1.default.semantic.update : v7_key_migrations_json_1.default.semantic.create),
            fieldAttrs: v7_key_migrations_json_1.default.structural.formView.fieldAttrs,
            type: v7_key_migrations_json_1.default.structural.formView.type,
            ...(includeTabs ? { tabs: 'tabList' } : {}),
        });
        for (const sheetKey of ['mobileSheet', 'sheet']) {
            addFromObject(view?.[sheetKey], [...path, sheetKey], structuralSheetDeprecated);
        }
    };
    visitFormView(config?.views?.create, ['views', 'create'], false);
    visitFormView(config?.views?.update, ['views', 'update'], true);
    const tabList = config?.views?.update?.tabList || config?.views?.update?.tabs || [];
    tabList.forEach((tab, index) => addFromObject(tab, ['views', 'update', hasOwn(config?.views?.update, 'tabList') ? 'tabList' : 'tabs', String(index)], {
        ...migrationsToMap(v7_key_migrations_json_1.default.semantic.tab),
        type: v7_key_migrations_json_1.default.structural.formView.type,
    }));
    const visitRuntimeTree = (value, path) => {
        if (!value || typeof value !== 'object')
            return;
        if (!Array.isArray(value) && typeof value.component === 'string' && value.props && typeof value.props === 'object') {
            const propsPath = [...path, 'props'];
            addFromObject(value.props, propsPath, resolveRuntimePropAliases(value.component));
            const actionKeys = ['headActionList', 'rowActionList'];
            if (['CreateDrawer', 'UpdateDrawer', 'FormDrawer', 'FormSheet', 'MobileActions'].includes(value.component)) {
                actionKeys.push('actionList');
            }
            for (const actionKey of actionKeys) {
                (value.props[actionKey] || []).forEach((action, index) => {
                    addFromObject(action, [...propsPath, actionKey, String(index)], v7_key_migrations_json_1.default.structural.actionIntent);
                });
            }
        }
        if (Array.isArray(value))
            value.forEach((item, index) => visitRuntimeTree(item, [...path, String(index)]));
        else
            for (const [key, child] of Object.entries(value))
                visitRuntimeTree(child, [...path, key]);
    };
    visitRuntimeTree(config?.pageContent, ['pageContent']);
    visitRuntimeTree(config?.actionContent, ['actionContent']);
    return result;
}
exports.collectV7DeprecatedKeys = collectV7DeprecatedKeys;
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
            logger: false
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
        // 注册所有schema（含 main / legacy / 子目录）
        this.registerSchemas();
        this.validateFn = this.ajv.compile(jianghu_config_legacy_schema_json_1.default);
        const ajvV6 = new ajv_1.default({ allErrors: true, strict: false, logger: false });
        (0, ajv_formats_1.default)(ajvV6);
        ajvV6.addSchema(v6_page_tree_schema_json_1.default);
        ajvV6.addSchema(resource_list_schema_json_1.default);
        ajvV6.addSchema(include_list_schema_json_1.default);
        this.validateV6Fn = ajvV6.compile(jianghu_config_v6_schema_json_1.default);
        const ajvV7 = new ajv_1.default({ allErrors: true, strict: false, logger: false });
        (0, ajv_formats_1.default)(ajvV7);
        ajvV7.addSchema(resource_list_schema_json_1.default);
        ajvV7.addSchema(include_list_schema_json_1.default);
        this.validateV7Fn = ajvV7.compile(jianghu_config_v7_schema_json_1.default);
        // 创建诊断集合
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('jianghu-config');
        context.subscriptions.push(this.diagnosticCollection);
    }
    /**
     * 注册所有schema文件
     */
    registerSchemas() {
        // 注册主入口（oneOf 组合）与 legacy；具体目录扫描跳过与主入口同名的孤立文件避免重复 id
        this.ajv.addSchema(jianghu_config_schema_json_1.default, 'jianghu-config.schema.json');
        this.ajv.addSchema(jianghu_config_legacy_schema_json_1.default, 'jianghu-config-legacy.schema.json');
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
            else if (file.endsWith('.schema.json')) {
                const skipFiles = new Set([
                    'jianghu-config.schema.json',
                    'jianghu-config-legacy.schema.json',
                    'jianghu-config-v6.schema.json',
                    'jianghu-config-v7.schema.json',
                ]);
                if (skipFiles.has(file)) {
                    continue;
                }
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
     * - version === 'v7' 使用 v7 语义 schema（jianghu-config-v7.schema.json）
     * - version === 'v6' 使用 v6 专属 schema（jianghu-config-v6.schema.json）
     * - 其他版本走原有 v1-v5 schema（保持兼容性不变）
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
            const isV7 = configObject.version === 'v7';
            const isV6 = configObject.version === 'v6';
            const validateFn = isV7 ? this.validateV7Fn : (isV6 ? this.validateV6Fn : this.validateFn);
            const valid = validateFn(configObject);
            const deprecatedDiagnostics = isV7
                ? this.createDeprecatedDiagnostics(document, collectV7DeprecatedKeys(configObject), location)
                : [];
            if (!valid && validateFn.errors) {
                let errors = validateFn.errors;
                if (isV7) {
                    errors = this.normalizeV7ForbiddenNotErrors(errors, configObject);
                }
                const filteredErrors = this.filterErrors(errors);
                const diagnostics = [
                    ...this.createDiagnostics(document, filteredErrors, location),
                    ...deprecatedDiagnostics,
                ];
                this.diagnosticCollection.set(document.uri, diagnostics);
            }
            else if (deprecatedDiagnostics.length > 0) {
                this.diagnosticCollection.set(document.uri, deprecatedDiagnostics);
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
     *
     * 说明：`additionalProperties` / `unevaluatedProperties` 的 instancePath 指向「包含多余属性的对象」
     * （如 `/page`），而不是多余字段本身（不会是 `/page/type`）。若同期还存在 `/page/id` 等更深路径错误，
     * 简单按「父路径剔除」会把整条 `/page` 分组扔掉，导致永远看不到「不支持的额外属性」提示。
     * 因此对这类关键字强制保留其 instancePath 对应分组。
     */
    filterErrors(errors) {
        errors = this.dropRedundantIfErrors(errors);
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
        // 强制保留「额外属性」类错误所在路径（避免因同期存在 /page/foo 而误删整条 /page）
        const forceKeepKeywords = new Set([
            'additionalProperties',
            'unevaluatedProperties',
            'jianghuForbiddenProperty',
        ]);
        for (const error of errors) {
            if (forceKeepKeywords.has(error.keyword)) {
                pathsToKeep.add(error.instancePath || '/');
            }
        }
        // 收集要保留的错误
        let result = [];
        for (const path of pathsToKeep) {
            const pathErrors = errorsByPath.get(path);
            const requiredErrors = pathErrors.filter(e => e.keyword === 'required');
            const additionalPropsErrors = pathErrors.filter(e => e.keyword === 'additionalProperties');
            const restErrors = pathErrors.filter(e => e.keyword !== 'required' && e.keyword !== 'additionalProperties');
            // required 与 additionalProperties 常见于同一 instancePath（如 /page），用 else-if 会吞掉后者
            if (requiredErrors.length > 0 || additionalPropsErrors.length > 0) {
                result.push(...requiredErrors, ...additionalPropsErrors, ...restErrors);
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
     * V7 根级 `not`（must NOT be valid）展开为按属性键定位的错误，避免整对象标红。
     */
    normalizeV7ForbiddenNotErrors(errors, config) {
        const result = [];
        for (const error of errors) {
            const isRootNot = error.keyword === 'not' &&
                (!error.instancePath || error.instancePath === '');
            if (!isRootNot) {
                result.push(error);
                continue;
            }
            const forbiddenKeys = this.detectV7ForbiddenRootKeys(config);
            if (forbiddenKeys.length === 0) {
                result.push({
                    ...error,
                    message: '配置模式与顶层字段冲突',
                });
                continue;
            }
            for (const key of forbiddenKeys) {
                result.push({
                    ...error,
                    keyword: 'jianghuForbiddenProperty',
                    instancePath: '',
                    message: V7_FORBIDDEN_PROPERTY_MSG[key] ?? `不应使用 ${key}`,
                    params: { forbiddenProperty: key },
                });
            }
        }
        return result;
    }
    detectV7ForbiddenRootKeys(config) {
        const has = (k) => Object.prototype.hasOwnProperty.call(config, k);
        const keys = [];
        const isCrud = config.mode === 'crud';
        const isComponent = config.pageType === 'jh-component' ||
            (has('component') && config.component != null);
        if (isCrud && has('pageContent')) {
            keys.push('pageContent');
        }
        if (isComponent) {
            if (has('page'))
                keys.push('page');
            if (has('resourceList'))
                keys.push('resourceList');
        }
        if (!isCrud) {
            for (const k of ['mode', 'fields', 'views', 'dataSource', 'pc', 'mobile']) {
                if (has(k))
                    keys.push(k);
            }
        }
        return keys;
    }
    /**
     * AJV 在 if/then/else 失败时常附带 keyword:if（如 failingKeyword: then）。
     * 若同一路径或该路径下的子路径已有更具体的校验错误，则去掉冗余 if，避免与 additionalProperties 等重复刷屏。
     */
    dropRedundantIfErrors(errors) {
        return errors.filter((e) => {
            if (e.keyword !== 'if')
                return true;
            const path = e.instancePath || '/';
            const childPrefix = path === '/' ? '/' : `${path}/`;
            const hasConcreteSibling = errors.some((x) => {
                if (x === e || x.keyword === 'if')
                    return false;
                const xp = x.instancePath || '/';
                return xp === path || xp.startsWith(childPrefix);
            });
            return !hasConcreteSibling;
        });
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
    createDeprecatedDiagnostics(document, items, location) {
        return items.map(item => {
            const range = this.getPropertyKeyRange(document, item.path, location, item.property)
                || this.getNodeRangeByPath(document, item.path, location);
            const diagnostic = new vscode.Diagnostic(range, `旧 key：${item.property}，请改用 ${item.replacement}`, vscode.DiagnosticSeverity.Warning);
            diagnostic.code = 'V7_DEPRECATED_KEY';
            diagnostic.data = { path: item.path, property: item.property, replacement: item.replacement };
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
            case 'jianghuForbiddenProperty':
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
        // 额外属性 / V7 互斥字段：只标记属性键
        if (error.keyword === 'additionalProperties' ||
            error.keyword === 'jianghuForbiddenProperty') {
            const propName = error.keyword === 'additionalProperties'
                ? error.params.additionalProperty
                : error.params.forbiddenProperty;
            const keyRange = this.getPropertyKeyRange(document, path, location, propName);
            if (keyRange) {
                return keyRange;
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
     * 在配置对象 AST 上定位某一属性的键名范围
     */
    getPropertyKeyRange(document, path, location, propertyName) {
        let currentNode = location.node;
        for (const key of path) {
            if (currentNode.type === 'ObjectExpression') {
                const property = currentNode.properties.find((p) => (p.key.type === 'Identifier' && p.key.name === key) ||
                    (p.key.type === 'Literal' && p.key.value === key));
                if (property) {
                    currentNode = property.value;
                }
                else {
                    return null;
                }
            }
            else if (currentNode.type === 'ArrayExpression') {
                const index = parseInt(key, 10);
                if (!isNaN(index) && index < currentNode.elements.length) {
                    currentNode = currentNode.elements[index];
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        }
        if (currentNode.type !== 'ObjectExpression') {
            return null;
        }
        const property = currentNode.properties.find((p) => (p.key.type === 'Identifier' && p.key.name === propertyName) ||
            (p.key.type === 'Literal' && p.key.value === propertyName));
        if (!property) {
            return null;
        }
        const start = document.positionAt(property.key.start);
        const end = document.positionAt(property.key.end);
        return new vscode.Range(start, end);
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
            case 'jianghuForbiddenProperty': {
                const prop = error.params?.forbiddenProperty;
                return (error.message ||
                    V7_FORBIDDEN_PROPERTY_MSG[prop] ||
                    `不应使用 ${prop}`);
            }
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
            case 'if':
                return `${displayPath}: 分支条件不满足（${error.params?.failingKeyword ?? 'then/else'}）`;
            default:
                return `${displayPath}: ${error.message}`;
        }
    }
}
exports.JianghuSchemaValidator = JianghuSchemaValidator;
class V7DeprecatedKeyCodeActionProvider {
    provideCodeActions(document, _range, context) {
        const actions = [];
        for (const diagnostic of context.diagnostics) {
            if (diagnostic.code !== 'V7_DEPRECATED_KEY')
                continue;
            const data = diagnostic.data || {};
            const replacement = data.replacement;
            if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(replacement || ''))
                continue;
            if (this.hasSiblingKey(document, diagnostic.range, replacement))
                continue;
            const action = new vscode.CodeAction(`改为 ${replacement}`, vscode.CodeActionKind.QuickFix);
            action.diagnostics = [diagnostic];
            action.isPreferred = true;
            action.edit = new vscode.WorkspaceEdit();
            action.edit.replace(document.uri, diagnostic.range, replacement);
            actions.push(action);
        }
        return actions;
    }
    hasSiblingKey(document, range, key) {
        const line = document.lineAt(range.start.line).text;
        const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
        const keyPattern = new RegExp(`^\\s{${indent}}${key}\\s*:`);
        for (let lineNumber = range.start.line - 1; lineNumber >= 0; lineNumber--) {
            const text = document.lineAt(lineNumber).text;
            if (!text.trim())
                continue;
            const currentIndent = text.match(/^(\s*)/)?.[1].length ?? 0;
            if (currentIndent < indent)
                break;
            if (currentIndent === indent && keyPattern.test(text))
                return true;
        }
        for (let lineNumber = range.start.line + 1; lineNumber < document.lineCount; lineNumber++) {
            const text = document.lineAt(lineNumber).text;
            if (!text.trim())
                continue;
            const currentIndent = text.match(/^(\s*)/)?.[1].length ?? 0;
            if (currentIndent < indent)
                break;
            if (currentIndent === indent && keyPattern.test(text))
                return true;
        }
        return false;
    }
}
exports.V7DeprecatedKeyCodeActionProvider = V7DeprecatedKeyCodeActionProvider;
V7DeprecatedKeyCodeActionProvider.providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];
//# sourceMappingURL=jianghuSchemaValidator.js.map