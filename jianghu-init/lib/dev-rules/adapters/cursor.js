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

const syncCursor = ({ cwd, modules, moduleDefs, sourceDir, force }) => {
  const outDir = path.join(cwd, '.cursor', 'rules');
  ensureDir(outDir);
  const written = [];

  for (const modId of modules) {
    const def = moduleDefs[modId];
    if (!def) continue;
    const body = loadModuleBody(sourceDir, def);
    const outFile = path.join(outDir, `${modId}.mdc`);
    if (fs.existsSync(outFile) && !force) continue;

    const lines = ['---'];
    lines.push(`description: ${JSON.stringify(def.description || def.title || modId)}`);
    if (def.always) {
      lines.push('alwaysApply: true');
    } else {
      lines.push('alwaysApply: false');
      const globs = splitScope(def.scope);
      if (globs.length) {
        lines.push(`globs: ${JSON.stringify(globs.join(','))}`);
      }
    }
    lines.push('---', '', body, '');
    fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
    written.push(path.relative(cwd, outFile));
  }
  return written;
};

module.exports = {
  id: 'cursor',
  label: 'Cursor (.cursor/rules/*.mdc)',
  sync: syncCursor,
};
