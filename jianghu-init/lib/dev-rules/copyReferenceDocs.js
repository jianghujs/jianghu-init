'use strict';

const path = require('path');
const fs = require('fs');
const { ensureDir, copyFileIfNeeded } = require('./util');

const APP_DOCS = [
  { src: 'lib/dev-rules/docs/v7-app-authoring.md', dest: 'v7-app-authoring.md' },
];

const INIT_TOOL_DOCS = [
  { src: 'docs/v7-config-rules.md', dest: 'v7-config-rules-compiler.md' },
  { src: 'lib/json/v7/docs/semantic-to-component-mapping.md', dest: 'semantic-to-component-mapping.md' },
];

const copyReferenceDocs = ({ pkgRoot, docsDir, profile, force }) => {
  ensureDir(docsDir);
  const list = profile === 'init-tool' ? [...APP_DOCS, ...INIT_TOOL_DOCS] : APP_DOCS;
  const copied = [];
  const skipped = [];

  for (const item of list) {
    const src = path.join(pkgRoot, item.src);
    const dest = path.join(docsDir, item.dest);
    if (!fs.existsSync(src)) {
      skipped.push(item.dest);
      continue;
    }
    if (copyFileIfNeeded(src, dest, force)) {
      copied.push(item.dest);
    }
  }

  return { copied, skipped };
};

/** 按 profile 只复制需要的 source 模块到项目 SSOT */
const copySourceModules = ({ templateDir, sourceDir, moduleIds, moduleDefs, force }) => {
  ensureDir(sourceDir);
  const copied = [];
  for (const modId of moduleIds) {
    const def = moduleDefs[modId];
    if (!def || !def.file) continue;
    const src = path.join(templateDir, def.file);
    const dest = path.join(sourceDir, def.file);
    if (!fs.existsSync(src)) continue;
    if (copyFileIfNeeded(src, dest, force)) {
      copied.push(def.file);
    }
  }
  return copied;
};

module.exports = {
  APP_DOCS,
  INIT_TOOL_DOCS,
  copyReferenceDocs,
  copySourceModules,
};
