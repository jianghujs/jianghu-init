'use strict';

const path = require('path');
const { ensureDir, createSyncResult, mergeSyncResult, syncTextFile } = require('../util');
const { getRulePack } = require('../rulePacks');
const { getSkillsForRuleIds, syncSkillsToDirectory } = require('../skills');

const splitScope = scope => {
  if (!scope) return [];
  if (Array.isArray(scope)) return scope;
  return String(scope).split(',').map(s => s.trim()).filter(Boolean);
};

const syncClaude = ({ cwd, ruleIds, manifest, templateRoot, force }) => {
  const rulesDir = path.join(cwd, '.claude', 'rules');
  ensureDir(rulesDir);
  const result = createSyncResult();
  const packs = (ruleIds || []).map(getRulePack).filter(Boolean);
  const skills = getSkillsForRuleIds(templateRoot, ruleIds);

  const skillResult = syncSkillsToDirectory({
    cwd,
    templateRoot,
    skills,
    targetRoot: path.join(cwd, '.claude', 'skills'),
    force,
  });
  mergeSyncResult(result, skillResult);

  for (const pack of packs) {
    const outFile = path.join(rulesDir, `${pack.id}.md`);
    const lines = ['---'];
    const paths = splitScope(pack.globs);
    if (paths.length) {
      lines.push('paths:');
      for (const p of paths) {
        lines.push(`  - ${JSON.stringify(p)}`);
      }
    }
    lines.push('---', '', `# ${pack.label}`, '', `Read \`.ai-rules/${pack.id}/README.md\` before editing matching files.`, '');
    syncTextFile({ cwd, filePath: outFile, content: lines.join('\n'), force, result });
  }

  const claudeMd = path.join(cwd, 'CLAUDE.md');
  const content = [
      '# JianghuJS Project Instructions',
      '',
      'Read `.ai-rules/index.md` for shared AI rule packs.',
      '',
      'Claude-specific routing rules live in `.claude/rules/`.',
      '',
      'Task skills live in `.claude/skills/`. Read the matching `SKILL.md` before performing init-json work.',
      '',
      ...skills.map(skill => `- ${skill.label}: \`.claude/skills/${skill.id}/SKILL.md\``),
      '',
      `Selected rule packs: ${(manifest.ruleIds || []).join(', ')}`,
      '',
      '## Quick commands',
      '',
      `- Update AI rules: \`jianghu-init dev-rules --rule=${(manifest.ruleIds || []).join(',')} --target=claude --force\``,
      '',
    ].join('\n');
  syncTextFile({ cwd, filePath: claudeMd, content, force, result });

  return result;
};

module.exports = {
  id: 'claude',
  label: 'Claude Code (CLAUDE.md + .claude/rules/)',
  sync: syncClaude,
};
