import * as vscode from 'vscode';
import Ajv from 'ajv';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import schema from '../schemas/jianghu-config.schema.json';

export class JianghuSchemaValidator {
  private ajv: Ajv;
  private diagnosticCollection: vscode.DiagnosticCollection;

  constructor(context: vscode.ExtensionContext) {
    this.ajv = new Ajv({ 
      allErrors: true,
      verbose: true,
      messages: true,
      strict: false, // 👈 关闭 strict 模式限制
    });
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('jianghu-config');
    context.subscriptions.push(this.diagnosticCollection);
  }

  public validate(document: vscode.TextDocument) {
    if (!this.isTargetFile(document.uri.fsPath)) {
      console.log('validate', this.isTargetFile(document.uri.fsPath));
      return;
    }

    try {
      const content = document.getText();
      const { configObject, location } = this.extractModuleExports(content);
      
      if (!configObject || !location) {
        return;
      }

      const validate = this.ajv.compile(schema);
      const valid = validate(configObject);

      if (!valid && validate.errors) {
        console.log('Validation errors:', JSON.stringify(validate.errors, null, 2));
        
        // 对错误进行分组，只保留最深层级的错误
        const pathMap = new Map();
        validate.errors.forEach(error => {
          const path = error.instancePath || '/';
          
          // 检查是否已存在更深层级的错误路径
          let shouldAdd = true;
          
          // 如果当前错误是父级路径，且已有子级路径的错误，则忽略当前错误
          pathMap.forEach((existingError, existingPath) => {
            if (existingPath.startsWith(path + '/')) {
              // 当前路径是已存在路径的父路径，不添加当前错误
              shouldAdd = false;
            } else if (path.startsWith(existingPath + '/')) {
              // 当前路径是已存在路径的子路径，删除父路径错误，保留更具体的子路径错误
              pathMap.delete(existingPath);
            }
          });
          
          if (shouldAdd) {
            pathMap.set(path, error);
          }
        });
        
        const filteredErrors = Array.from(pathMap.values());
        const diagnostics = this.createDiagnostics(document, filteredErrors, location);
        this.diagnosticCollection.set(document.uri, diagnostics);
      } else {
        this.diagnosticCollection.delete(document.uri);
      }
    } catch (error) {
      console.error('Validation error:', error);
    }
  }

  private filterDeepestErrors(errors: any[]) {
    const result: any[] = [];
  
    function isParentPath(parent: string, child: string) {
      if (parent === child) return false;
      return child.startsWith(parent + '/') || (parent === '/' && child !== '/');
    }
  
    for (const error of errors) {
      const path = error.instancePath || '/';
  
      // 先过滤掉所有被这个路径包裹的（也就是比它浅的）
      for (let i = result.length - 1; i >= 0; i--) {
        const existingPath = result[i].instancePath || '/';
        if (isParentPath(path, existingPath)) {
          result.splice(i, 1); // 删除更浅的路径
        }
      }
  
      // 如果这个路径是其他路径的父路径，就不要加入（保留更深的）
      const hasDeeper = result.some(e => isParentPath(e.instancePath || '/', path));
      if (!hasDeeper) {
        result.push(error);
      }
    }
  
    return result;
  }

  private isTargetFile(filePath: string): boolean {
    return /\/(page-template-json|init-json)\/.*\.js$/.test(filePath);
  }

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
                console.error('Failed to evaluate variable object:', e);
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
                console.error('Failed to evaluate exports object:', e);
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
      console.error('Failed to parse JS:', error);
      return { configObject: null, location: null };
    }
  }

  private createDiagnostics(
    document: vscode.TextDocument,
    errors: any[],
    location: { start: number, end: number, node: any }
  ): vscode.Diagnostic[] {
    return errors.map(error => {
      const range = this.getErrorRange(document, error, location);
      const message = this.formatErrorMessage(error);
      const diagnostic = new vscode.Diagnostic(
        range,
        message,
        error.keyword === 'additionalProperties' ? vscode.DiagnosticSeverity.Warning : vscode.DiagnosticSeverity.Error
      );
      
      diagnostic.code = {
        value: error.keyword,
        target: vscode.Uri.parse(`https://ajv.js.org/keywords.html#${error.keyword}`)
      };
      
      return diagnostic;
    });
  }

  private getErrorRange(
    document: vscode.TextDocument,
    error: any,
    location: { start: number, end: number, node: any }
  ): vscode.Range {
    const path = error.instancePath.split('/').filter(Boolean);
    
    // 处理额外属性错误，只标记属性键
    if (error.keyword === 'additionalProperties') {
      const additionalProp = error.params.additionalProperty;
      let currentNode = location.node;
      
      // 导航到包含额外属性的对象
      for (const key of path) {
        if (currentNode.type === 'ObjectExpression') {
          const property = currentNode.properties.find((p: any) => 
            p.key.type === 'Identifier' && p.key.name === key
          );
          if (property) {
            currentNode = property.value;
          } else {
            break;
          }
        }
      }
      
      // 在当前对象中查找额外属性的键
      if (currentNode.type === 'ObjectExpression') {
        const property = currentNode.properties.find((p: any) => 
          p.key.type === 'Identifier' && p.key.name === additionalProp
        );
        if (property) {
          // 只标记属性键，而不是整个属性
          const start = document.positionAt(property.key.start);
          const end = document.positionAt(property.key.end);
          return new vscode.Range(start, end);
        }
      }
    }
    
    // 其他错误的处理保持不变
    if (path.length === 0) {
      const startPos = document.positionAt(location.start);
      const endPos = document.positionAt(location.end);
      return new vscode.Range(startPos, endPos);
    }

    // 在配置对象中查找属性
    let currentNode = location.node;
    let arrayIndex = -1;
    let arrayProperty = null;
    
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      
      // 处理数组索引
      if (!isNaN(Number(key))) {
        arrayIndex = Number(key);
        if (currentNode.type === 'ObjectExpression') {
          // 找到数组属性
          arrayProperty = currentNode.properties.find((p: any) => 
            p.key.type === 'Identifier' && p.key.name === path[i-1]
          );
          if (arrayProperty && arrayProperty.value.type === 'ArrayExpression') {
            // 找到数组中的特定元素
            if (arrayIndex < arrayProperty.value.elements.length) {
              currentNode = arrayProperty.value.elements[arrayIndex];
            } else {
              // 如果索引超出范围，标记整个数组
              currentNode = arrayProperty.value;
            }
          }
        } else if (currentNode.type === 'ArrayExpression' && arrayIndex < currentNode.elements.length) {
          // 直接处理数组元素
          currentNode = currentNode.elements[arrayIndex];
        }
        continue;
      }
      
      if (currentNode.type === 'ObjectExpression') {
        const property = currentNode.properties.find((p: any) => 
          p.key.type === 'Identifier' && p.key.name === key
        );
        if (property) {
          currentNode = property.value;
        } else {
          // 如果找不到属性，尝试定位到最接近的节点
          break;
        }
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

  private formatErrorMessage(error: any): string {
    const property = error.instancePath ? error.instancePath.slice(1) : '根对象';
    let message = `${property}: ${error.message}`;
    
    switch (error.keyword) {
      case 'enum':
        message += ` (允许的值: ${error.params.allowedValues.join(', ')})`;
        break;
      case 'required':
        message = `缺少必需的属性: ${error.params.missingProperty}`;
        break;
      case 'additionalProperties':
        message = `不支持的额外属性: ${error.params.additionalProperty}`;
        break;
      case 'pattern':
        message += ' (格式不正确)';
        break;
      case 'type':
        message += ` (期望类型: ${error.params.type})`;
        break;
    }
    
    return message;
  }
} 