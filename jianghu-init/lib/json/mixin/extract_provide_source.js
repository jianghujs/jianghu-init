'use strict';

/** 去掉块内统一 leading 空白，避免配置文件 common 层级缩进带入生成代码 */
const dedentBlock = text => {
  if (!text) return text;
  const lines = text.split('\n');
  const indents = lines
    .filter(line => line.trim().length > 0)
    .map(line => (line.match(/^(\s*)/) || [ '', '' ])[1].length);
  if (!indents.length) return text.trim();
  const min = Math.min(...indents);
  return lines.map(line => (line.length >= min ? line.slice(min) : line)).join('\n').trimEnd();
};

/** @param {string} src @param {number} openBraceIdx */
const sliceBalancedBraces = (src, openBraceIdx) => {
  if (openBraceIdx < 0 || src[openBraceIdx] !== '{') return null;
  let depth = 0;
  for (let i = openBraceIdx; i < src.length; i++) {
    const ch = src[i];
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(openBraceIdx, i + 1);
    }
  }
  return null;
};

/** 回退到当前行首（保留行缩进，供 dedent 统一处理） */
const lineStart = (src, idx) => {
  let i = idx;
  while (i > 0 && src[i - 1] !== '\n') i--;
  return i;
};

/**
 * 从 init-json 配置文件源码中提取 common.provide 的原始写法（避免 eval 后 Function#toString 变成 Babel 包装函数）。
 * @param {string} fileContent
 * @returns {string|null} 如 `provide() { ... }` 或 `provide: function () { ... }`
 */
const extractProvideSource = fileContent => {
  if (!fileContent || typeof fileContent !== 'string') return null;

  const commonMatch = fileContent.match(/\bcommon\s*:\s*\{/);
  if (!commonMatch) return null;

  const commonBraceIdx = commonMatch.index + commonMatch[0].length - 1;
  const commonBlock = sliceBalancedBraces(fileContent, commonBraceIdx);
  if (!commonBlock) return null;

  const innerStart = commonBraceIdx + 1;
  const inner = commonBlock.slice(1, -1);

  const patterns = [
    { re: /\bprovide\s*\(\s*\)\s*\{/g, mode: 'shorthand' },
    { re: /\bprovide\s*:\s*(?:async\s+)?function\s*\([^)]*\)\s*\{/g, mode: 'method' },
    { re: /\bprovide\s*:\s*(?:async\s+)?\([^)]*\)\s*=>\s*\{/g, mode: 'arrow' },
  ];

  for (const { re, mode } of patterns) {
    re.lastIndex = 0;
    const m = re.exec(inner);
    if (!m) continue;

    const absHead = innerStart + m.index;
    const head = lineStart(fileContent, absHead);
    const bodyBraceIdx = fileContent.indexOf('{', absHead);
    const body = sliceBalancedBraces(fileContent, bodyBraceIdx);
    if (!body) continue;

    const end = bodyBraceIdx + body.length;
    const slice = fileContent.slice(head, end);
    if (mode === 'shorthand') {
      return dedentBlock(slice);
    }
    const normalized = slice.trim().startsWith('provide')
      ? slice
      : `provide: ${slice.trim().replace(/^provide\s*:\s*/, '')}`;
    return dedentBlock(normalized);
  }

  return null;
};

/**
 * 写入 common.provideString（不覆盖用户显式配置）
 * @param {object} fileObj
 * @param {string} fileContent
 */
const attachProvideStringFromSource = (fileObj, fileContent) => {
  if (!fileObj || typeof fileObj !== 'object') return;
  fileObj.common = fileObj.common || {};
  if (fileObj.common.provideString) return;
  const extracted = extractProvideSource(fileContent);
  if (extracted) fileObj.common.provideString = extracted;
};

module.exports = {
  dedentBlock,
  extractProvideSource,
  attachProvideStringFromSource,
};
