import * as vscode from 'vscode';

export type ConfigVersion = 'v6' | 'v7';

/**
 * 从完整文件文本解析 version: 'v6' | 'v7'（v7 优先）。
 * 已持有全文时直接正则查找，不做行数截断。
 */
export function detectConfigVersion(text: string): ConfigVersion | null {
  if (/version\s*:\s*['"]v7['"]/.test(text)) return 'v7';
  if (/version\s*:\s*['"]v6['"]/.test(text)) return 'v6';
  return null;
}

export function isJsConfigDocument(document: vscode.TextDocument): boolean {
  return document.fileName.endsWith('.js');
}

export function isV6ConfigDocument(document: vscode.TextDocument): boolean {
  if (!isJsConfigDocument(document)) return false;
  return detectConfigVersion(document.getText()) === 'v6';
}

export function isV7ConfigDocument(document: vscode.TextDocument): boolean {
  if (!isJsConfigDocument(document)) return false;
  return detectConfigVersion(document.getText()) === 'v7';
}

/** v6 / v7 语义或 pageContent 配置：不走 v4 md-doc / json 模板 hover */
export function isModernConfigText(text: string): boolean {
  return detectConfigVersion(text) !== null;
}
