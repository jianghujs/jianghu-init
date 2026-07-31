'use strict';

const fs = require('fs');
const path = require('path');
const {
  ensureDir, parseFrontmatter, createSyncResult, mergeSyncResult, syncTextFile,
} = require('../util');
const { getRulePack } = require('../rulePacks');
const { getSkillsForRuleIds, syncSkillsToDirectory } = require('../skills');

const splitScope = scope => {
  if (!scope) return [];
  if (Array.isArray(scope)) return scope;
  return String(scope).split(',').map(s => s.trim()).filter(Boolean);
};

const readPackOverview = (templateRoot, pack) => {
  const overview = (pack.files || []).find(file => file.dest === 'README.md') || (pack.files || [])[0];
  if (!overview) return '';
  return parseFrontmatter(
    fs.readFileSync(path.join(templateRoot, overview.source), 'utf8'),
  ).body;
};

const syncClaude = ({ cwd, ruleIds, manifest, templateRoot, force, managedFiles }) => {
  const rulesDir = path.join(cwd, '.claude', 'rules');
  ensureDir(rulesDir);
  const result = createSyncResult();
  const packs = (ruleIds || []).map(getRulePack).filter(Boolean);
  const skills = getSkillsForRuleIds(templateRoot, ruleIds);
  const hasInitJsonPack = (manifest.ruleIds || []).includes('jianghu-init-json-app');

  const skillResult = syncSkillsToDirectory({
    cwd,
    templateRoot,
    skills,
    targetRoot: path.join(cwd, '.claude', 'skills'),
    force,
    managedFiles,
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
    lines.push(
      '---',
      '',
      `# ${pack.label}`,
      '',
      readPackOverview(templateRoot, pack),
      '',
      `Detailed references remain under \`.ai-rules/${pack.id}/\`; read only the document needed for the task.`,
      '',
    );
    syncTextFile({ cwd, filePath: outFile, content: lines.join('\n'), force, managedFiles, result });
  }

  const claudeMd = path.join(cwd, 'CLAUDE.md');
  const lines = [
      '# JianghuJS Project Instructions',
      '',
      'Apply these boundaries before selecting a task workflow:',
      '',
      ...(hasInitJsonPack ? [
        '- Read `.ai-rules/project/README.md` for project-owned business rules and `.ai-rules/project/pages/<pageId>.md` when it exists.',
        '- Before init-json changes, read `.ai-rules/jianghu-init-json-app/coding-standards.md`; follow `.ai-rules/jianghu-init-json-app/agent-workflow.md` for L0/L1/L2/L3 quality boundaries.',
      ] : []),
      '- Treat project source and nearby project examples as evidence; do not invent fields, resources, services, components, or business behavior.',
      '- Keep changes scoped to the requested task and do not edit generated output as the long-term source.',
      '- Load only the matching Skill below; do not read every workflow by default.',
      '',
      '## Task routing',
      '',
      ...skills.map(skill => `- ${skill.label}: \`.claude/skills/${skill.id}/SKILL.md\``),
    ];
  if (hasInitJsonPack) {
    lines.push(
      '',
      '## JianghuJS init-json baseline',
      '',
      '- `app/view/init-json/**/*.js` is source; `app/view/page/**/*.html` and `app/view/component/**/*.html` are generated output.',
      '- New or modified V7 configuration must use canonical keys; legacy keys are compatibility inputs only.',
      '- Before a separate compile, run `jianghu-init json --dev-status`; when active, let the watcher generate and verify the output changed.',
      '- A `constructionPlan` describes intended functionality and boundaries, not proof of implementation.',
      '- Frontend button visibility does not replace backend resource authorization.',
    );
  }
  lines.push(
      '',
      'Claude-specific scoped rules live in `.claude/rules/`; detailed shared references live under `.ai-rules/`.',
      '',
      `Selected rule packs: ${(manifest.ruleIds || []).join(', ')}`,
      '',
      '## Quick commands',
      '',
      `- Update AI rules: \`jianghu-init dev-rules --rule=${(manifest.ruleIds || []).join(',')} --target=claude --force\``,
      '',
  );
  const content = lines.join('\n');
  syncTextFile({ cwd, filePath: claudeMd, content, force, managedFiles, result });

  return result;
};

module.exports = {
  id: 'claude',
  label: 'Claude Code (CLAUDE.md + .claude/rules/)',
  sync: syncClaude,
};
