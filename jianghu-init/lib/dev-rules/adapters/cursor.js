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

const syncCursor = ({ cwd, ruleIds, manifest, force }) => {
  const outDir = path.join(cwd, '.cursor', 'rules');
  ensureDir(outDir);
  const written = [];
  const packs = (ruleIds || []).map(getRulePack).filter(Boolean);

  for (const pack of packs) {
    const outFile = path.join(outDir, `${pack.id}.mdc`);
    if (fs.existsSync(outFile) && !force) continue;

    const lines = ['---'];
    lines.push(`description: ${JSON.stringify(pack.description)}`);
    lines.push('alwaysApply: false');
    const globs = splitScope(pack.globs);
    if (globs.length) {
      lines.push(`globs: ${JSON.stringify(globs.join(','))}`);
    }
    lines.push('---');
    lines.push('');
    lines.push(`# ${pack.label}`);
    lines.push('');
    lines.push(`Read \`.ai-rules/${pack.id}/README.md\` before editing matching files.`);
    lines.push('');
    lines.push('Also read `.ai-rules/index.md` for selected project rule packs.');
    lines.push('');
    fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
    written.push(path.relative(cwd, outFile));
  }

  const indexFile = path.join(outDir, 'ai-rules-index.mdc');
  if (force || !fs.existsSync(indexFile)) {
    const lines = [
      '---',
      'description: "JianghuJS AI rule pack index"',
      'alwaysApply: true',
      '---',
      '',
      '# JianghuJS AI Rule Packs',
      '',
      'Use `.ai-rules/index.md` as the shared rule-pack index. Load detailed rule packs only when relevant.',
      '',
      `Generated targets: ${(manifest.targets || []).join(', ')}`,
      '',
    ];
    fs.writeFileSync(indexFile, lines.join('\n'), 'utf8');
    written.push(path.relative(cwd, indexFile));
  }
  return written;
};

module.exports = {
  id: 'cursor',
  label: 'Cursor (.cursor/rules/*.mdc)',
  sync: syncCursor,
};
