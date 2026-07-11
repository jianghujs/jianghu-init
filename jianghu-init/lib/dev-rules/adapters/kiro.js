'use strict';

const path = require('path');
const { ensureDir, createSyncResult, syncTextFile } = require('../util');
const { getRulePack } = require('../rulePacks');
const { getSkillsForRuleIds } = require('../skills');

const splitScope = scope => {
  if (!scope) return [];
  if (Array.isArray(scope)) return scope;
  return String(scope).split(',').map(s => s.trim()).filter(Boolean);
};

const syncKiro = ({ cwd, ruleIds, templateRoot, force, managedFiles }) => {
  const outDir = path.join(cwd, '.kiro', 'steering');
  ensureDir(outDir);
  const result = createSyncResult();
  const packs = (ruleIds || []).map(getRulePack).filter(Boolean);
  const skills = getSkillsForRuleIds(templateRoot, ruleIds);

  for (const pack of packs) {
    const outFile = path.join(outDir, `${pack.id}.md`);
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
    syncTextFile({ cwd, filePath: outFile, content: lines.join('\n'), force, managedFiles, result });
  }

  for (const skill of skills) {
    const outFile = path.join(outDir, `${skill.id}.md`);
    const lines = ['---'];
    if (skill.globs.length) {
      lines.push('inclusion: fileMatch', 'fileMatchPattern:');
      for (const glob of skill.globs) lines.push(`  - ${JSON.stringify(glob)}`);
    } else {
      lines.push('inclusion: auto');
    }
    lines.push(
      '---',
      '',
      `# ${skill.label}`,
      '',
      skill.description,
      '',
      `For matching tasks, read and follow \`.ai-rules/skills/${skill.id}/SKILL.md\`.`,
      '',
    );
    syncTextFile({ cwd, filePath: outFile, content: lines.join('\n'), force, managedFiles, result });
  }

  return result;
};

module.exports = {
  id: 'kiro',
  label: 'Kiro (.kiro/steering/)',
  sync: syncKiro,
};
