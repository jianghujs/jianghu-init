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

const syncCursor = ({ cwd, ruleIds, manifest, templateRoot, force }) => {
  const outDir = path.join(cwd, '.cursor', 'rules');
  ensureDir(outDir);
  const result = createSyncResult();
  const packs = (ruleIds || []).map(getRulePack).filter(Boolean);
  const skills = getSkillsForRuleIds(templateRoot, ruleIds);

  for (const pack of packs) {
    const outFile = path.join(outDir, `${pack.id}.mdc`);
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
    syncTextFile({ cwd, filePath: outFile, content: lines.join('\n'), force, result });
  }

  for (const skill of skills) {
    const outFile = path.join(outDir, `${skill.id}.mdc`);
    const lines = [
      '---',
      `description: ${JSON.stringify(skill.description)}`,
      'alwaysApply: false',
    ];
    if (skill.globs.length) lines.push(`globs: ${JSON.stringify(skill.globs.join(','))}`);
    lines.push(
      '---',
      '',
      `# ${skill.label}`,
      '',
      `For matching tasks, read and follow \`.ai-rules/skills/${skill.id}/SKILL.md\`.`,
      '',
    );
    syncTextFile({ cwd, filePath: outFile, content: lines.join('\n'), force, result });
  }

  const indexFile = path.join(outDir, 'ai-rules-index.mdc');
  const indexLines = [
      '---',
      'description: "JianghuJS AI rule pack index"',
      'alwaysApply: true',
      '---',
      '',
      '# JianghuJS AI Rule Packs',
      '',
      'Use `.ai-rules/index.md` as the shared rule-pack index. Load detailed rule packs only when relevant.',
      '',
      'Task workflows live under `.ai-rules/skills/`; select the matching generated Cursor rule.',
      '',
      `Generated targets: ${(manifest.targets || []).join(', ')}`,
      '',
    ];
  syncTextFile({ cwd, filePath: indexFile, content: indexLines.join('\n'), force, result });
  return result;
};

module.exports = {
  id: 'cursor',
  label: 'Cursor (.cursor/rules/*.mdc)',
  sync: syncCursor,
};
