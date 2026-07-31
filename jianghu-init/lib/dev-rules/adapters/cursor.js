'use strict';

const fs = require('fs');
const path = require('path');
const {
  ensureDir, createSyncResult, syncTextFile, parseFrontmatter,
} = require('../util');
const { getRulePack } = require('../rulePacks');
const { getSkillsForRuleIds } = require('../skills');

const CURSOR_SKILL_HINTS = {
  'jianghu-init-json-authoring': {
    description: 'Create or modify JianghuJS init-json pages/components. 创建、新增、修改页面或组件时使用。',
    route: 'Create or modify init-json / 新建或修改页面组件',
  },
  'jianghu-init-json-migration': {
    description: 'Migrate legacy JianghuJS pages/components to init-json v7. 迁移、升级、转换 V2/V4/V6 页面时使用。',
    route: 'Migrate or upgrade legacy pages / 迁移或升级旧页面',
  },
  'jianghu-init-json-review': {
    description: 'Review or troubleshoot JianghuJS init-json and generated output. Review、检查、审计、排错时使用。',
    route: 'Review, inspect, or troubleshoot / Review、检查或排错',
  },
  'jianghu-seo-development': {
    description: 'Develop or review OpenJianghu SEO applications. 开发、检查 SEO 文档站时使用。',
    route: 'Develop or review an SEO application / 开发或检查 SEO 应用',
  },
};

const readMarkdownBody = filePath => parseFrontmatter(fs.readFileSync(filePath, 'utf8')).body;

const readPackOverview = (templateRoot, pack) => {
  const overview = (pack.files || []).find(file => file.dest === 'README.md') || (pack.files || [])[0];
  return overview ? readMarkdownBody(path.join(templateRoot, overview.source)) : '';
};

const readSkillBody = (templateRoot, skill) => (
  readMarkdownBody(path.join(templateRoot, 'skills', skill.id, 'SKILL.md'))
);

/** 内联到 .cursor/rules 时，把遗留的 references/foo 相对链接改成仓库根绝对路径 */
const rewriteSkillReferencesForCursor = (body, skillId) => {
  if (!body || !skillId) return body;
  const base = `.ai-rules/skills/${skillId}/references/`;
  return body.replace(
    /\[references\/([^\]]+)\]\(references\/\1\)/g,
    (_, file) => {
      const abs = `${base}${file}`;
      return `\`${abs}\``;
    },
  );
};

const splitScope = scope => {
  if (!scope) return [];
  if (Array.isArray(scope)) return scope;
  return String(scope).split(',').map(s => s.trim()).filter(Boolean);
};

const syncCursor = ({ cwd, ruleIds, manifest, templateRoot, force, managedFiles }) => {
  const outDir = path.join(cwd, '.cursor', 'rules');
  ensureDir(outDir);
  const result = createSyncResult();
  const packs = (ruleIds || []).map(getRulePack).filter(Boolean);
  const skills = getSkillsForRuleIds(templateRoot, ruleIds);
  const hasInitJsonPack = (manifest.ruleIds || []).includes('jianghu-init-json-app');

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
    lines.push(readPackOverview(templateRoot, pack));
    lines.push('');
    lines.push(`Detailed references remain under \`.ai-rules/${pack.id}/\`; load only the document needed for the task.`);
    lines.push('');
    syncTextFile({ cwd, filePath: outFile, content: lines.join('\n'), force, managedFiles, result });
  }

  for (const skill of skills) {
    const outFile = path.join(outDir, `${skill.id}.mdc`);
    const hint = CURSOR_SKILL_HINTS[skill.id] || {};
    const lines = [
      '---',
      `description: ${JSON.stringify([skill.description, hint.description].filter(Boolean).join(' '))}`,
      'alwaysApply: false',
    ];
    if (skill.globs.length) lines.push(`globs: ${JSON.stringify(skill.globs.join(','))}`);
    lines.push(
      '---',
      '',
      `# ${skill.label}`,
      '',
      rewriteSkillReferencesForCursor(readSkillBody(templateRoot, skill), skill.id),
      '',
      `Additional task references remain under \`.ai-rules/skills/${skill.id}/references/\`; load only the referenced file required by this workflow.`,
      '',
    );
    syncTextFile({ cwd, filePath: outFile, content: lines.join('\n'), force, managedFiles, result });
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
      'This rule is the always-loaded Cursor entry. Apply these boundaries before selecting a task workflow:',
      '',
      ...(hasInitJsonPack ? [
        '- Read `.ai-rules/project/README.md` for project-owned business rules and `.ai-rules/project/pages/<pageId>.md` when it exists.',
        '- Before init-json changes, read `.ai-rules/jianghu-init-json-app/coding-standards.md`; follow `.ai-rules/jianghu-init-json-app/agent-workflow.md` for L0/L1/L2/L3 quality boundaries.',
      ] : []),
      '- Treat project source and nearby project examples as evidence; do not invent fields, resources, services, components, or business behavior.',
      '- Keep changes scoped to the requested task and do not edit generated output as the long-term source.',
      '- Select exactly the matching task rule below; do not load all workflows by default.',
      '',
      '## Task routing',
      '',
    ];
  for (const skill of skills) {
    const hint = CURSOR_SKILL_HINTS[skill.id] || {};
    indexLines.push(`- ${hint.route || skill.label}: \`.cursor/rules/${skill.id}.mdc\``);
  }
  if (hasInitJsonPack) {
    indexLines.push(
      '',
      '## JianghuJS init-json baseline',
      '',
      '- `app/view/init-json/**/*.js` is source; `app/view/page/**/*.html` and `app/view/component/**/*.html` are generated output.',
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
  id: 'cursor',
  label: 'Cursor (.cursor/rules/*.mdc)',
  sync: syncCursor,
};
