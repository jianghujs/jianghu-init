import * as vscode from 'vscode';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import * as fs from 'fs';
import * as path from 'path';

// 主schema文件
import mainSchema from '../schemas/jianghu-config.schema.json';
// 子schema文件
import basicTypesSchema from '../schemas/components/basic-types.schema.json';
import headContentSchema from '../schemas/components/head-content.schema.json';
import pageContentSchema from '../schemas/components/page-content.schema.json';
import actionContentSchema from '../schemas/components/action-content.schema.json';
import formItemsSchema from '../schemas/components/form-items.schema.json';
import includeListSchema from '../schemas/components/include-list.schema.json';
import commonSchema from '../schemas/components/common.schema.json';
import resourceListSchema from '../schemas/components/resource-list.schema.json';

export class JianghuSchemaValidator {
  private ajv: Ajv;
  private diagnosticCollection: vscode.DiagnosticCollection;
  private validateFn: any; // 编译后的验证函数

  constructor(context: vscode.ExtensionContext) {
    // 初始化 AJV 实例，启用高级特性
    this.ajv = new Ajv({ 
      allErrors: true,
      verbose: true,
      messages: true,
      strict: false,
      $data: true, // 启用 $data 引用
      discriminator: true, // 启用鉴别器
      logger: false // 禁用控制台日志
    });
    
    // 添加格式验证和错误信息增强
    addFormats(this.ajv);
    addErrors(this.ajv);
    
    // 添加自定义关键字，用于更精确的错误定位
    this.ajv.addKeyword({
      keyword: 'errorPath',
      validate: () => true, // 总是通过，只用于错误定位
      errors: false
    });
    
    // 注册所有schema
    this.registerSchemas();
    
    // 编译主schema
    this.validateFn = this.ajv.compile(mainSchema);
    
    // 创建诊断集合
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('jianghu-config');
    context.subscriptions.push(this.diagnosticCollection);
  }

  /**
   * 注册所有schema文件
   */
  private registerSchemas() {
    // 注册主schema
    this.ajv.addSchema(mainSchema, 'jianghu-config.schema.json');
    
    // 注册子schema目录
    const schemasDir = path.join(__dirname, '..', 'schemas');
    this.registerSchemaDir(schemasDir);
  }

  /**
   * 递归注册目录中的所有schema文件
   */
  private registerSchemaDir(dir: string) {
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
      } else if (file.endsWith('.schema.json') && file !== 'jianghu-config.schema.json') {
        try {
          const schema = require(filePath);
          this.ajv.addSchema(schema, schema.$id || file);
        } catch (error) {
          console.error(`加载schema文件失败: ${filePath}`, error);
        }
      }
    }
  }

  /**
   * 验证文档
   */
  public validate(document: vscode.TextDocument) {
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
      } else {
        this.diagnosticCollection.delete(document.uri);
      }
    } catch (error) {
      console.error('验证过程出错:', error);
    }
  }

  /**
   * 过滤和分组错误，保留最具体的错误
   */
  private filterErrors(errors: any[]): any[] {
    // 首先按照路径分组
    const errorsByPath = new Map<string, any[]>();
    
    for (const error of errors) {
      const path = error.instancePath || '/';
      if (!errorsByPath.has(path)) {
        errorsByPath.set(path, []);
      }
      errorsByPath.get(path)!.push(error);
    }
    
    // 过滤掉被更具体路径包含的路径
    const pathsToKeep = new Set<string>();
    
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
    let result: any[] = [];
    
    for (const path of pathsToKeep) {
      const pathErrors = errorsByPath.get(path)!;
      
      // 优先保留 required 错误，其次是 additionalProperties 错误
      const requiredErrors = pathErrors.filter(e => e.keyword === 'required');
      const additionalPropsErrors = pathErrors.filter(e => e.keyword === 'additionalProperties');
      
      if (requiredErrors.length > 0) {
        result.push(...requiredErrors);
      } else if (additionalPropsErrors.length > 0) {
        result.push(...additionalPropsErrors);
      } else {
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
  private isTargetFile(filePath: string): boolean {
    return /\/(page-template-json|init-json)\/.*\.js$/.test(filePath);
  }

  /**
   * 从JS文件中提取模块导出的配置对象
   */
  private extractModuleExports(content: string): { configObject: any, location: any } {
    try {
      const ast = acorn.parse(content, {
        ecmaVersion: 2020,
        sourceType: 'module'
      });

      let configObject = null;
      let location = null;
      let variableName: string | null = null;

      // 第一步：查找变量声明
      walk.simple(ast, {
        VariableDeclaration(node: any) {
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
              } catch (e) {
                console.error('解析变量对象失败:', e);
              }
            }
          }
        }
      });

      // 第二步：查找 module.exports 赋值
      walk.simple(ast, {
        AssignmentExpression(node: any) {
          if (
            node.left.type === 'MemberExpression' &&
            node.left.object.name === 'module' &&
            node.left.property.name === 'exports'
          ) {
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
              } catch (e) {
                console.error('解析导出对象失败:', e);
              }
            } else if (
              node.right.type === 'Identifier' &&
              variableName &&
              node.right.name === variableName
            ) {
              // 使用已定义变量的情况
              // 此时 configObject 和 location 已经在第一步中设置
            }
          }
        }
      });

      return { configObject, location };
    } catch (error) {
      console.error('解析JS文件失败:', error);
      return { configObject: null, location: null };
    }
  }

  /**
   * 创建诊断信息
   */
  private createDiagnostics(
    document: vscode.TextDocument,
    errors: any[],
    location: { start: number, end: number, node: any }
  ): vscode.Diagnostic[] {
    return errors.map(error => {
      // 获取错误范围
      const range = this.getErrorRange(document, error, location);
      
      // 格式化错误消息
      const message = this.formatErrorMessage(error);
      
      // 创建诊断信息
      const diagnostic: vscode.Diagnostic = new vscode.Diagnostic(
        range,
        message,
        this.getDiagnosticSeverity(error)
      );
      
      // 添加错误代码和链接
      diagnostic.code = {
        value: error.keyword,
        target: vscode.Uri.parse(`https://ajv.js.org/keywords.html#${error.keyword}`)
      };
      
      // 添加自定义数据，用于快速修复
      (diagnostic as any).data = {
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
  private getDiagnosticSeverity(error: any): vscode.DiagnosticSeverity {
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
  private getErrorRange(
    document: vscode.TextDocument,
    error: any,
    location: { start: number, end: number, node: any }
  ): vscode.Range {
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
          const property = currentNode.properties.find((p: any) => 
            (p.key.type === 'Identifier' && p.key.name === key) ||
            (p.key.type === 'Literal' && p.key.value === key)
          );
          if (property) {
            currentNode = property.value;
          } else {
            break;
          }
        } else if (currentNode.type === 'ArrayExpression') {
          const index = parseInt(key, 10);
          if (!isNaN(index) && index < currentNode.elements.length) {
            currentNode = currentNode.elements[index];
          } else {
            break;
          }
        } else {
          break;
        }
      }
      
      // 在当前对象中查找额外属性的键
      if (currentNode.type === 'ObjectExpression') {
        const property = currentNode.properties.find((p: any) => 
          (p.key.type === 'Identifier' && p.key.name === additionalProp) ||
          (p.key.type === 'Literal' && p.key.value === additionalProp)
        );
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
          const property = currentNode.properties.find((p: any) => 
            (p.key.type === 'Identifier' && p.key.name === key) ||
            (p.key.type === 'Literal' && p.key.value === key)
          );
          if (property) {
            currentNode = property.value;
          } else {
            break;
          }
        } else if (currentNode.type === 'ArrayExpression') {
          const index = parseInt(key, 10);
          if (!isNaN(index) && index < currentNode.elements.length) {
            currentNode = currentNode.elements[index];
          } else {
            break;
          }
        } else {
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
  private getNodeRangeByPath(
    document: vscode.TextDocument,
    path: string[],
    location: { start: number, end: number, node: any }
  ): vscode.Range {
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
          } else {
            // 如果索引超出范围，标记整个数组
            break;
          }
        } else if (currentNode.type === 'ObjectExpression') {
          // 可能是数组属性的一个元素
          const arrayProp = path[i-1];
          const property = currentNode.properties.find((p: any) => 
            (p.key.type === 'Identifier' && p.key.name === arrayProp) ||
            (p.key.type === 'Literal' && p.key.value === arrayProp)
          );
          
          if (property && property.value.type === 'ArrayExpression') {
            if (arrayIndex < property.value.elements.length) {
              currentNode = property.value.elements[arrayIndex];
            } else {
              // 如果索引超出范围，标记整个数组
              currentNode = property.value;
            }
          } else {
            break;
          }
        } else {
          break;
        }
      } 
      // 处理对象属性
      else if (currentNode.type === 'ObjectExpression') {
        const property = currentNode.properties.find((p: any) => 
          (p.key.type === 'Identifier' && p.key.name === key) ||
          (p.key.type === 'Literal' && p.key.value === key)
        );
        
        if (property) {
          currentNode = property.value;
        } else {
          // 如果找不到属性，尝试定位到最接近的节点
          break;
        }
      } else {
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
  private formatErrorMessage(error: any): string {
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
