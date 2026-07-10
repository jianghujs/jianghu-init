'use strict';

const path = require('path');
const fs = require('fs');
const { ensureDir } = require('../util');
const { getRulePack } = require('../rulePacks');

const splitScope = scope => {
  if (!scope) return [];
  if (Array.isArray(scope)) return scope;
  return String(scope).split(',').map(s => s.trim()).filter(Boolean);
};

const syncKiro = ({ cwd, ruleIds, force }) => {
  const outDir = path.join(cwd, '.kiro', 'steering');
  ensureDir(outDir);
  const written = [];
  const packs = (ruleIds || []).map(getRulePack).filter(Boolean);

  for (const pack of packs) {
    const outFile = path.join(outDir, `${pack.id}.md`);
    if (fs.existsSync(outFile) && !force) continue;

    const lines = ['---'];
    const patterns = splitScope(pack.globs);
    if (patterns.length) {
      lines.push('inclusion: fileMatch');
      lines.push('fileMatchPattern:');
      for (const p of patterns) {
        lines.push(`  - ${JSON.stringify(p)}`);
      }
    } else {
      lines.push('inclusion: auto');
    }
    lines.push('---', '', `# ${pack.label}`, '', `Read \`.ai-rules/${pack.id}/README.md\` before editing matching files.`, '');
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
