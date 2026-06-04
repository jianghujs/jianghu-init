import * as vscode from 'vscode';

export type ConfigVersion = 'v6' | 'v7';

/** 从文件头部解析 version: 'v6' | 'v7'（v7 优先检测，避免混写时误判） */
export function detectConfigVersion(text: string, maxLines = 60): ConfigVersion | null {
  const head = text.split('\n').slice(0, maxLines).join('\n');
  if (/version\s*:\s*['"]v7['"]/.test(head)) return 'v7';
  if (/version\s*:\s*['"]v6['"]/.test(head)) return 'v6';
  return null;
}

export function isJsConfigDocument(document: vscode.TextDocument): boolean {
  return document.fileName.endsWith('.js');
}

export function isV6ConfigDocument(document: vscode.TextDocument): boolean {
  if (!isJsConfigDocument(document)) return false;
  return detectConfigVersion(document.getText(), 40) === 'v6';
}

export function isV7ConfigDocument(document: vscode.TextDocument): boolean {
  if (!isJsConfigDocument(document)) return false;
  return detectConfigVersion(document.getText(), 40) === 'v7';
}

/** v6 / v7 语义或 pageContent 配置：不走 v4 md-doc / json 模板 hover */
export function isModernConfigText(text: string): boolean {
  return detectConfigVersion(text) !== null;
}
