#!/usr/bin/env node
'use strict';

/**
 * V7 调试工具：输入配置文件路径，输出每一步的编译结果
 * 用法：node lib/json/v7/inspect.js <config.js> [--target pc|mobile]
 */
const path = require('path');
const { buildPage } = require('./index');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node lib/json/v7/inspect.js <config.js> [--target pc|mobile]');
  process.exit(1);
}

const targetArg = process.argv.includes('--target')
  ? process.argv[process.argv.indexOf('--target') + 1]
  : null;

const semantic = require(path.resolve(file));
if (targetArg) semantic.targetPlatform = targetArg;

try {
  const { standardConfig } = buildPage(semantic);

  console.log('═══ page ═══');
  console.log(standardConfig.page);

  console.log('\n═══ dataSource ═══');
  console.log(standardConfig.dataSource);

  console.log('\n═══ features ═══');
  console.log(standardConfig.features);

  console.log('\n═══ v7Meta ═══');
  console.log(standardConfig.v7Meta);

  console.log('\n═══ pageContent tree ═══');
  const printTree = (nodes, indent = '') => {
    for (const n of (nodes || [])) {
      if (typeof n === 'string') { console.log(indent + '[html]', n.substring(0, 60).trim()); continue; }
      if (!n) continue;
      const tag = n.resolvedComponent || n.component || '?';
      const key = n.key ? ` key=${n.key}` : '';
      console.log(indent + tag + key);
      if (n.children) printTree(n.children, indent + '  ');
    }
  };
  printTree(standardConfig.pageContent);

  console.log('\n═══ actionContent ═══');
  for (const n of (standardConfig.actionContent || [])) {
    if (!n) continue;
    const tag = n.resolvedComponent || n.component || '?';
    const key = n.key ? ` key=${n.key}` : '';
    const props = n.resolvedProps || n.props || {};
    const info = [];
    if (props.tabList) info.push(`tabs=${props.tabList.length}`);
    if (props.fieldList) info.push(`fields=${props.fieldList.length}`);
    if (props.beforeCloseConfirm) info.push('beforeCloseConfirm');
    console.log(' ', tag + key, info.length ? `(${info.join(', ')})` : '');
  }

  console.log('\n═══ blocks.table (headers) ═══');
  if (standardConfig.blocks && standardConfig.blocks.table) {
    const headers = standardConfig.blocks.table.columns || [];
    console.log(headers.map(h => `${h.text}[${h.value}]`).join(' | '));
  }
} catch (e) {
  console.error('编译失败:', e.message);
  console.error(e.stack);
  process.exit(1);
}
