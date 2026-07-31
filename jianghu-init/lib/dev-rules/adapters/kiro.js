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

const syncKiro = ({ cwd, ruleIds, manifest, templateRoot, force, managedFiles }) => {
  const outDir = path.join(cwd, '.kiro', 'steering');
  ensureDir(outDir);
  const result = createSyncResult();
  const packs = (ruleIds || []).map(getRulePack).filter(Boolean);
  const skills = getSkillsForRuleIds(templateRoot, ruleIds);
  const hasInitJsonPack = (manifest.ruleIds || []).includes('jianghu-init-json-app');

  const skillResult = syncSkillsToDirectory({
    cwd,
    templateRoot,
    skills,
    targetRoot: path.join(cwd, '.kiro', 'skills'),
    force,
    managedFiles,
  });
  mergeSyncResult(result, skillResult);

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

  const indexFile = path.join(outDir, 'ai-rules-index.md');
  const indexLines = [
      '---',
      'inclusion: always',
      '---',
      '',
      '# JianghuJS AI Rule Packs',
      '',
      'Apply these boundaries before activating a task Skill:',
      '',
      ...(hasInitJsonPack ? [
        '- Read `.ai-rules/project/README.md` for project-owned business rules and `.ai-rules/project/pages/<pageId>.md` when it exists.',
        '- Before init-json changes, read `.ai-rules/jianghu-init-json-app/coding-standards.md`; follow `.ai-rules/jianghu-init-json-app/agent-workflow.md` for L0/L1/L2/L3 quality boundaries.',
      ] : []),
      '- Treat project source and nearby project examples as evidence; do not invent fields, resources, services, components, or business behavior.',
      '- Keep changes scoped to the requested task and do not edit generated output as the long-term source.',
      '- Activate only the matching native Skill below; do not load every workflow by default.',
      '',
      '## Task routing',
      '',
  ];
  for (const skill of skills) {
    indexLines.push(`- ${skill.label}: \`.kiro/skills/${skill.id}/SKILL.md\``);
  }
  if (hasInitJsonPack) {
    indexLines.push(
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
  indexLines.push('', `Generated targets: ${(manifest.targets || []).join(', ')}`, '');
  syncTextFile({ cwd, filePath: indexFile, content: indexLines.join('\n'), force, managedFiles, result });

  return result;
};

module.exports = {
  id: 'kiro',
  label: 'Kiro (.kiro/steering/ + .kiro/skills/)',
  sync: syncKiro,
};
