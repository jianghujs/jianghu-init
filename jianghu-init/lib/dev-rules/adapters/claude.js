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

const syncClaude = ({ cwd, ruleIds, manifest, force }) => {
  const rulesDir = path.join(cwd, '.claude', 'rules');
  ensureDir(rulesDir);
  const written = [];
  const packs = (ruleIds || []).map(getRulePack).filter(Boolean);

  for (const pack of packs) {
    const outFile = path.join(rulesDir, `${pack.id}.md`);
    if (fs.existsSync(outFile) && !force) continue;

    const lines = ['---'];
    const paths = splitScope(pack.globs);
    if (paths.length) {
      lines.push('paths:');
      for (const p of paths) {
        lines.push(`  - ${JSON.stringify(p)}`);
      }
    }
    lines.push('---', '', `# ${pack.label}`, '', `Read \`.ai-rules/${pack.id}/README.md\` before editing matching files.`, '');
    fs.writeFileSync(outFile, lines.join('\n'), 'utf8');
    written.push(path.relative(cwd, outFile));
  }

  const claudeMd = path.join(cwd, 'CLAUDE.md');
  if (force || !fs.existsSync(claudeMd)) {
    const content = [
      '# JianghuJS Project Instructions',
      '',
      'Read `.ai-rules/index.md` for shared AI rule packs.',
      '',
      'Claude-specific routing rules live in `.claude/rules/`.',
      '',
      `Selected rule packs: ${(manifest.ruleIds || []).join(', ')}`,
      '',
      '## Quick commands',
      '',
      `- Update AI rules: \`jianghu-init dev-rules --rule=${(manifest.ruleIds || []).join(',')} --target=claude --force\``,
      '',
    ].join('\n');
    fs.writeFileSync(claudeMd, content, 'utf8');
    written.push('CLAUDE.md');
  }

  return written;
};

module.exports = {
  id: 'claude',
  label: 'Claude Code (CLAUDE.md + .claude/rules/)',
  sync: syncClaude,
};
