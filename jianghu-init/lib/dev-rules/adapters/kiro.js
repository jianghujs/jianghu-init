'use strict';

const path = require('path');
const fs = require('fs');
const { parseFrontmatter, ensureDir } = require('../util');

const splitScope = scope => {
  if (!scope) return [];
  if (Array.isArray(scope)) return scope;
  return String(scope).split(',').map(s => s.trim()).filter(Boolean);
};

const loadModuleBody = (sourceDir, mod) => {
  const filePath = path.join(sourceDir, mod.file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { body } = parseFrontmatter(raw);
  return body;
};

const syncKiro = ({ cwd, modules, moduleDefs, sourceDir, force }) => {
  const outDir = path.join(cwd, '.kiro', 'steering');
  ensureDir(outDir);
  const written = [];

  for (const modId of modules) {
    const def = moduleDefs[modId];
    if (!def) continue;
    const body = loadModuleBody(sourceDir, def);
    const outFile = path.join(outDir, `${modId}.md`);
    if (fs.existsSync(outFile) && !force) continue;

    const lines = ['---'];
    if (def.always) {
      lines.push('inclusion: always');
    } else {
      const patterns = splitScope(def.scope);
      if (patterns.length) {
        lines.push('inclusion: fileMatch');
        lines.push('fileMatchPattern:');
        for (const p of patterns) {
          lines.push(`  - ${JSON.stringify(p)}`);
        }
      } else if (def.description) {
        lines.push('inclusion: auto');
        lines.push(`name: ${modId}`);
        lines.push(`description: ${JSON.stringify(def.description)}`);
      } else {
        lines.push('inclusion: manual');
      }
    }
    lines.push('---', '', body, '');
    fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
    written.push(path.relative(cwd, outFile));
  }

  return written;
};

module.exports = {
  id: 'kiro',
  label: 'Kiro (.kiro/steering/)',
  sync: syncKiro,
};
