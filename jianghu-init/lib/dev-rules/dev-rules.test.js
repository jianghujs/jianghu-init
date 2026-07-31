'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { syncRulePacks, listRulePacks } = require('./rulePacks');
const { syncTargets } = require('./adapters');
const { readManifest, cleanupGeneratedFiles } = require('./state');
const { listSkillIds } = require('./skills');
const { parseFrontmatter } = require('./util');

const templateRoot = __dirname;

const collectFiles = (results, key) => Array.from(new Set(Object.values(results).reduce(
  (files, result) => files.concat(result[key] || []),
  [],
))).sort();

const generate = (
  cwd,
  ruleIds,
  targets = ['codex', 'cursor', 'claude', 'kiro'],
  force = true,
  managedFiles = new Set(),
) => {
  const manifest = {
    schemaVersion: 5,
    jianghuInitVersion: 'test',
    ruleIds,
    targets,
    lastSyncAt: 'test',
  };
  const results = syncTargets({
    cwd,
    targets: manifest.targets,
    ruleIds,
    templateRoot,
    manifest,
    force,
    managedFiles,
  });
  results['.ai-rules'] = syncRulePacks({ cwd, ruleIds, templateRoot, force, managedFiles });
  return { manifest, results, desiredFiles: collectFiles(results, 'desired') };
};

const exists = (root, relativePath) => fs.existsSync(path.join(root, relativePath));
const runDevRulesCommand = (cwd, args) => {
  const commandPath = path.resolve(__dirname, '..', 'init_dev_rules.js');
  const script = [
    `(async () => {`,
    `  const Command = require(${JSON.stringify(commandPath)});`,
    `  await new Command().run(process.cwd(), ${JSON.stringify(args)});`,
    `})().catch(error => { console.error(error); process.exitCode = 1; });`,
  ].join('\n');
  const result = spawnSync(process.execPath, ['-e', script], { cwd, encoding: 'utf8' });
  assert.strictEqual(result.status, 0, result.stderr || result.stdout);
  return result;
};

const appDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-dev-rules-app-'));
generate(appDir, ['jianghu-init-json-app']);
const unchangedRun = generate(
  appDir,
  ['jianghu-init-json-app'],
  ['codex', 'cursor', 'claude', 'kiro'],
  false,
);
assert.strictEqual(collectFiles(unchangedRun.results, 'skipped').length, 0);
assert(collectFiles(unchangedRun.results, 'unchanged').length > 0);

const managedFiles = new Set(generate(appDir, ['jianghu-init-json-app']).desiredFiles);
assert(!managedFiles.has('.ai-rules/project/README.md'));
fs.appendFileSync(path.join(appDir, 'AGENTS.md'), '\nmanaged local edit\n', 'utf8');
const managedUpdate = generate(
  appDir,
  ['jianghu-init-json-app'],
  ['codex', 'cursor', 'claude', 'kiro'],
  false,
  managedFiles,
);
assert(collectFiles(managedUpdate.results, 'written').includes('AGENTS.md'));
assert(!fs.readFileSync(path.join(appDir, 'AGENTS.md'), 'utf8').includes('managed local edit'));

const unmanagedDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-dev-rules-unmanaged-'));
fs.writeFileSync(path.join(unmanagedDir, 'AGENTS.md'), 'custom unmanaged instructions\n', 'utf8');
const unmanagedUpdate = generate(unmanagedDir, ['jianghu-init-json-app'], ['codex'], false);
assert(collectFiles(unmanagedUpdate.results, 'skipped').includes('AGENTS.md'));
assert.strictEqual(
  fs.readFileSync(path.join(unmanagedDir, 'AGENTS.md'), 'utf8'),
  'custom unmanaged instructions\n',
);

const projectTemplateFiles = [
  '.ai-rules/project/README.md',
];
for (const projectFile of projectTemplateFiles) {
  assert(exists(appDir, projectFile), `missing project template: ${projectFile}`);
}
assert(!managedFiles.has('.ai-rules/project/README.md'));

const qualityRuleFiles = [
  '.ai-rules/jianghu-init-json-app/agent-workflow.md',
  '.ai-rules/jianghu-init-json-app/coding-standards.md',
  '.ai-rules/jianghu-init-json-app/review-prompt-template.md',
];
for (const qualityFile of qualityRuleFiles) {
  assert(exists(appDir, qualityFile), `missing managed quality rule: ${qualityFile}`);
  assert(managedFiles.has(qualityFile), `quality rule should be managed: ${qualityFile}`);
}
for (const legacyProjectQualityFile of [
  '.ai-rules/project/agent-workflow.md',
  '.ai-rules/project/coding-standards.md',
  '.ai-rules/project/review-prompt-template.md',
]) {
  assert(!exists(appDir, legacyProjectQualityFile), `quality rule should not be project-owned: ${legacyProjectQualityFile}`);
}

const projectRulesPath = path.join(appDir, '.ai-rules/project/README.md');
assert(exists(appDir, '.ai-rules/project/README.md'));
fs.writeFileSync(projectRulesPath, 'project-owned knowledge\n', 'utf8');
generate(appDir, ['jianghu-init-json-app']);
assert.strictEqual(fs.readFileSync(projectRulesPath, 'utf8'), 'project-owned knowledge\n');

const workflowPath = path.join(appDir, '.ai-rules/jianghu-init-json-app/agent-workflow.md');
const workflowBody = fs.readFileSync(workflowPath, 'utf8');
fs.writeFileSync(workflowPath, 'custom workflow\n', 'utf8');
generate(appDir, ['jianghu-init-json-app'], ['codex'], false, managedFiles);
assert.strictEqual(fs.readFileSync(workflowPath, 'utf8'), workflowBody);
assert(workflowBody.includes('四层职责边界'));
assert(workflowBody.includes('L3 Incomplete'));
assert(workflowBody.includes('jianghu-init json --validate-changed --format=json'));
assert(workflowBody.includes('会加载并执行可信项目中的 init-json 模块顶层代码'));
assert(workflowBody.includes('不会解析任意方法体'));
const codingStandardsBody = fs.readFileSync(
  path.join(appDir, '.ai-rules/jianghu-init-json-app/coding-standards.md'),
  'utf8',
);
assert(codingStandardsBody.includes('本次触及的 `label + uiAction`'));
assert(codingStandardsBody.includes('不得给自己的改动签发独立 L2 Review 结论'));
assert(codingStandardsBody.includes('生成前确认 dev 状态'));
const reviewPromptBody = fs.readFileSync(
  path.join(appDir, '.ai-rules/jianghu-init-json-app/review-prompt-template.md'),
  'utf8',
);
assert(reviewPromptBody.includes('.ai-rules/skills/jianghu-init-json-review/SKILL.md'));
assert(!reviewPromptBody.includes('.agents/skills/jianghu-init-json-review/SKILL.md'));

const skillIds = [
  'jianghu-init-json-authoring',
  'jianghu-init-json-migration',
  'jianghu-init-json-review',
];
const skillReferences = {
  'jianghu-init-json-authoring': ['decision-guide.md', 'common-recipes.md'],
  'jianghu-init-json-migration': ['inventory-checklist.md', 'migration-matrix.md', 'equivalence-validation.md'],
  'jianghu-init-json-review': ['review-checklist.md', 'severity-and-evidence.md'],
};
const cursorSkillSignatures = {
  'jianghu-init-json-authoring': 'Treat `app/view/init-json/**/*.js` as source',
  'jianghu-init-json-migration': 'Migrate behavior in small verified steps',
  'jianghu-init-json-review': 'Lead with concrete findings',
};

for (const skillId of skillIds) {
  assert(exists(appDir, `.ai-rules/skills/${skillId}/SKILL.md`));
  assert(exists(appDir, `.agents/skills/${skillId}/SKILL.md`));
  assert(exists(appDir, `.claude/skills/${skillId}/SKILL.md`));
  assert(exists(appDir, `.kiro/skills/${skillId}/SKILL.md`));
  assert(exists(appDir, `.cursor/rules/${skillId}.mdc`));
  assert(!exists(appDir, `.kiro/steering/${skillId}.md`));
  for (const reference of skillReferences[skillId]) {
    assert(exists(appDir, `.ai-rules/skills/${skillId}/references/${reference}`));
    assert(exists(appDir, `.agents/skills/${skillId}/references/${reference}`));
    assert(exists(appDir, `.claude/skills/${skillId}/references/${reference}`));
    assert(exists(appDir, `.kiro/skills/${skillId}/references/${reference}`));
  }
  const cursorSkill = fs.readFileSync(path.join(appDir, `.cursor/rules/${skillId}.mdc`), 'utf8');
  assert(cursorSkill.includes(cursorSkillSignatures[skillId]));
  assert(!cursorSkill.includes(`.ai-rules/skills/${skillId}/SKILL.md`));
  assert(!cursorSkill.includes('](references/'), `Cursor rule should not keep relative reference links: ${skillId}`);
  assert(
    cursorSkill.includes(`.ai-rules/skills/${skillId}/references/`),
    `Cursor rule should use absolute reference paths: ${skillId}`,
  );
  const kiroSkill = fs.readFileSync(path.join(appDir, `.kiro/skills/${skillId}/SKILL.md`), 'utf8');
  assert(kiroSkill.includes(cursorSkillSignatures[skillId]));
}

const cursorIndex = fs.readFileSync(path.join(appDir, '.cursor/rules/ai-rules-index.mdc'), 'utf8');
assert(cursorIndex.includes('alwaysApply: true'));
assert(cursorIndex.includes('## Task routing'));
assert(cursorIndex.includes('Review、检查或排错'));
assert(cursorIndex.includes('.ai-rules/project/README.md'));
assert(cursorIndex.includes('.ai-rules/jianghu-init-json-app/coding-standards.md'));
assert(cursorIndex.includes('.ai-rules/jianghu-init-json-app/agent-workflow.md'));
assert(cursorIndex.includes('jianghu-init json --dev-status'));
assert(cursorIndex.includes('Frontend button visibility does not replace backend resource authorization'));
const cursorPack = fs.readFileSync(path.join(appDir, '.cursor/rules/jianghu-init-json-app.mdc'), 'utf8');
assert(cursorPack.includes('## 管线'));
assert(cursorPack.includes('config-reference.md'));
assert(cursorPack.includes('config-reference.md` 是 Full Reference'));
assert(cursorPack.includes('Detailed references remain under'));
for (const cursorRuleFile of [
  'ai-rules-index.mdc',
  'jianghu-init-json-app.mdc',
  ...skillIds.map(skillId => `${skillId}.mdc`),
]) {
  const parsedCursorRule = parseFrontmatter(
    fs.readFileSync(path.join(appDir, '.cursor/rules', cursorRuleFile), 'utf8'),
  );
  assert(parsedCursorRule.meta.description, `missing Cursor description: ${cursorRuleFile}`);
  assert.strictEqual(typeof parsedCursorRule.meta.alwaysApply, 'boolean');
  assert(parsedCursorRule.body.length > 100, `Cursor rule body too small: ${cursorRuleFile}`);
}

const kiroIndex = parseFrontmatter(
  fs.readFileSync(path.join(appDir, '.kiro/steering/ai-rules-index.md'), 'utf8'),
);
assert.strictEqual(kiroIndex.meta.inclusion, 'always');
assert(kiroIndex.body.includes('## Task routing'));
assert(kiroIndex.body.includes('.kiro/skills/jianghu-init-json-review/SKILL.md'));
assert(kiroIndex.body.includes('.ai-rules/project/README.md'));
assert(kiroIndex.body.includes('canonical keys'));
assert(kiroIndex.body.includes('jianghu-init json --dev-status'));
assert(kiroIndex.body.includes('Frontend button visibility does not replace backend resource authorization'));
const kiroPackRaw = fs.readFileSync(
  path.join(appDir, '.kiro/steering/jianghu-init-json-app.md'),
  'utf8',
);
const kiroPack = parseFrontmatter(kiroPackRaw);
assert.strictEqual(kiroPack.meta.inclusion, 'fileMatch');
assert(kiroPackRaw.includes('fileMatchPattern:\n  - "app/view/init-json/**/*.js"'));
assert(kiroPack.body.includes('## 管线'));
assert(kiroPack.body.includes('config-reference.md` 是 Full Reference'));
assert(kiroPack.body.includes('Detailed references remain under'));

const claudePackRaw = fs.readFileSync(
  path.join(appDir, '.claude/rules/jianghu-init-json-app.md'),
  'utf8',
);
const claudePack = parseFrontmatter(claudePackRaw);
assert(claudePackRaw.includes('paths:\n  - "app/view/init-json/**/*.js"'));
assert(claudePack.body.includes('## 管线'));
assert(claudePack.body.includes('config-reference.md` 是 Full Reference'));
assert(claudePack.body.includes('Detailed references remain under'));

const fullKnowledgeFiles = {
  'config-reference.md': '# V7 配置参考',
  'authoring-guide.md': '# V7 Authoring 指南',
  'semantic-to-component-mapping.md': '# V7 语义配置 → 组件参数映射表',
  'bind-slots-and-targets.md': '# *Bind、插槽与分端字段',
  'examples-guide.md': '# V7 示例配置说明',
};
for (const [file, signature] of Object.entries(fullKnowledgeFiles)) {
  const relativePath = `.ai-rules/jianghu-init-json-app/${file}`;
  assert(exists(appDir, relativePath), `missing Full knowledge document: ${file}`);
  assert(fs.readFileSync(path.join(appDir, relativePath), 'utf8').includes(signature));
}
for (const exampleFile of [
  'projectManagement.v7.sample.js',
  'fullCrudPage.v7.example.js',
  'fullUiPage.v7.example.js',
  'taskSubTable.v7.component.crud.sample.js',
  'projectSummaryCard.v7.component.ui.sample.js',
  'fullComponentCrud.v7.example.js',
  'fullComponentUi.v7.example.js',
]) {
  assert(exists(appDir, `.ai-rules/jianghu-init-json-app/examples/${exampleFile}`));
}
const generatedFullComponentCrud = fs.readFileSync(
  path.join(appDir, '.ai-rules/jianghu-init-json-app/examples/fullComponentCrud.v7.example.js'),
  'utf8',
);
assert(generatedFullComponentCrud.includes("listResource: 'selectTaskList'"));
assert(!/\n\s+resource:\s*\{/.test(generatedFullComponentCrud));
assert(!/\n\s+(list|create|update|delete)ActionId:/.test(generatedFullComponentCrud));
const generatedExamplesGuide = fs.readFileSync(
  path.join(appDir, '.ai-rules/jianghu-init-json-app/examples-guide.md'),
  'utf8',
);
assert(generatedExamplesGuide.includes('.ai-rules/jianghu-init-json-app/examples/'));
assert(generatedExamplesGuide.includes('拒绝 deprecated key 与旧 `dataSource` 写法'));

const generatedAuthoringSkill = fs.readFileSync(
  path.join(appDir, '.agents/skills/jianghu-init-json-authoring/SKILL.md'),
  'utf8',
);
const generatedAuthoringDecisionGuide = fs.readFileSync(
  path.join(appDir, '.agents/skills/jianghu-init-json-authoring/references/decision-guide.md'),
  'utf8',
);
const generatedFullCrudStructure = fs.readFileSync(
  path.join(appDir, '.ai-rules/jianghu-init-json-app/v7-crud-full-structure.md'),
  'utf8',
);
const generatedMigrationSkill = fs.readFileSync(
  path.join(appDir, '.agents/skills/jianghu-init-json-migration/SKILL.md'),
  'utf8',
);
const generatedReviewSkill = fs.readFileSync(
  path.join(appDir, '.agents/skills/jianghu-init-json-review/SKILL.md'),
  'utf8',
);
const generatedMigrationValidation = fs.readFileSync(
  path.join(appDir, '.agents/skills/jianghu-init-json-migration/references/equivalence-validation.md'),
  'utf8',
);
assert(generatedAuthoringSkill.includes('Treat the current project as the source of truth'));
assert(generatedAuthoringSkill.includes('does not imply an image-generation task'));
assert(generatedAuthoringSkill.includes('--generateType=json --pageType=jh-page --table=<table> --pageId=<pageId>'));
assert(generatedAuthoringSkill.includes('--generateType=json --pageType=jh-component --table=<table> --componentPath=<componentPath>'));
assert(generatedAuthoringSkill.includes('Never regenerate over an existing source file'));
assert(generatedAuthoringSkill.includes('do not duplicate its field query manually'));
assert(generatedAuthoringSkill.includes('--generateType=page --pageType=page --file=<filename> -y'));
assert(generatedAuthoringSkill.includes('include the project\'s tenant/app identity'));
assert(generatedAuthoringSkill.includes('v7-crud-full-structure.md'));
assert(generatedAuthoringSkill.includes('config-reference.md'));
assert(generatedAuthoringSkill.includes('semantic-to-component-mapping.md'));
assert(generatedAuthoringSkill.includes('bind-slots-and-targets.md'));
assert(generatedAuthoringSkill.includes('jianghu-init json --dev-status'));
assert(generatedAuthoringSkill.includes('jianghu-init json --validate --file=<pageId|componentPath>'));
assert(generatedAuthoringSkill.includes('constructionPlan'));
assert(generatedAuthoringDecisionGuide.includes('Stop once the required fact is confirmed'));
assert(generatedAuthoringDecisionGuide.includes('do not perform writes while discovering schema'));
assert(generatedAuthoringDecisionGuide.includes('cannot establish current fields or configuration'));
assert(generatedAuthoringDecisionGuide.includes('jianghu-init json --dev-status'));
assert(generatedAuthoringDecisionGuide.includes('The standard generator owns schema lookup'));
assert(generatedAuthoringDecisionGuide.includes('do not query and reconstruct its schema work manually'));
assert(generatedAuthoringDecisionGuide.includes('v7-crud-full-structure.md'));
assert(generatedAuthoringDecisionGuide.includes('it is not the Full Reference'));
for (const canonicalKey of [
  'columnList',
  'mobileColumnList',
  'headActionList',
  'rowActionList',
  'fieldList',
  'actionList',
  'tabList',
  'mobileSheet',
  'label',
  'uiAction',
]) {
  assert(generatedFullCrudStructure.includes(canonicalKey), `missing full CRUD key: ${canonicalKey}`);
}
assert(generatedFullCrudStructure.includes('Legacy compatibility only'));
assert(generatedFullCrudStructure.includes('standard generator intentionally emits the smaller canonical structure'));
assert(generatedMigrationSkill.includes('outside `app/view/init-json/**` is a read-only migration input by default'));
assert(generatedMigrationSkill.includes('create its v7 replacement under the corresponding path in `app/view/init-json/**`'));
assert(generatedMigrationSkill.includes('the active host can reach it'));
assert(generatedMigrationSkill.includes('matching only the include path is insufficient'));
assert(generatedMigrationSkill.includes('duplicate action cases'));
assert(generatedMigrationSkill.includes('jianghu-init json --dev-status'));
assert(generatedMigrationSkill.includes('jianghu-init json --validate --file=<pageId|componentPath>'));
assert(generatedMigrationSkill.includes('let the watcher generate'));
assert(generatedMigrationSkill.includes('Do not migrate its inner body into always-visible'));
assert(generatedMigrationValidation.includes('a structural conversion, not a completed migration'));
assert(generatedMigrationValidation.includes('structural/custom collisions'));
assert(generatedMigrationValidation.includes('becomes always-visible page content'));
assert(generatedReviewSkill.includes('jianghu-init json --validate --file=<pageId|componentPath>'));
assert(generatedReviewSkill.includes('do not silently treat unknown as pass'));
assert(
  fs.readFileSync(
    path.join(appDir, '.agents/skills/jianghu-init-json-authoring/references/common-recipes.md'),
    'utf8',
  ).includes('not the primary creation path'),
);

const obsoleteReference = path.join(
  appDir,
  '.agents/skills/jianghu-init-json-authoring/references/obsolete.md',
);
fs.writeFileSync(obsoleteReference, 'obsolete generated reference\n', 'utf8');
const customReference = path.join(
  appDir,
  '.agents/skills/jianghu-init-json-authoring/references/custom-team-note.md',
);
fs.writeFileSync(customReference, 'custom team note\n', 'utf8');
const regenerated = generate(appDir, ['jianghu-init-json-app']);
cleanupGeneratedFiles({
  cwd: appDir,
  previousManifest: {
    schemaVersion: 5,
    generatedFiles: [ path.relative(appDir, obsoleteReference) ],
  },
  desiredFiles: regenerated.desiredFiles,
  knownRuleIds: listRulePacks().map(rule => rule.id),
  knownSkillIds: listSkillIds(),
});
assert(!fs.existsSync(obsoleteReference));
assert(fs.existsSync(customReference));

const traversalDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-dev-rules-traversal-'));
const traversalSentinel = path.join(traversalDir, 'sentinel.txt');
fs.mkdirSync(path.join(traversalDir, '.ai-rules/jianghu-init-json-app'), { recursive: true });
fs.writeFileSync(traversalSentinel, 'keep\n', 'utf8');
const traversalRemoved = cleanupGeneratedFiles({
  cwd: traversalDir,
  previousManifest: {
    schemaVersion: 5,
    generatedFiles: ['.ai-rules/jianghu-init-json-app/../../sentinel.txt'],
  },
  desiredFiles: [],
  knownRuleIds: listRulePacks().map(rule => rule.id),
  knownSkillIds: listSkillIds(),
});
assert.deepStrictEqual(traversalRemoved, []);
assert(fs.existsSync(traversalSentinel));

const symlinkTargetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-dev-rules-symlink-target-'));
const symlinkSentinel = path.join(symlinkTargetDir, 'sentinel.txt');
fs.writeFileSync(symlinkSentinel, 'keep\n', 'utf8');
fs.symlinkSync(symlinkTargetDir, path.join(traversalDir, '.ai-rules/jianghu-init-json-app/link'));
const symlinkRemoved = cleanupGeneratedFiles({
  cwd: traversalDir,
  previousManifest: {
    schemaVersion: 5,
    generatedFiles: ['.ai-rules/jianghu-init-json-app/link/sentinel.txt'],
  },
  desiredFiles: [],
  knownRuleIds: listRulePacks().map(rule => rule.id),
  knownSkillIds: listSkillIds(),
});
assert.deepStrictEqual(symlinkRemoved, []);
assert(fs.existsSync(symlinkSentinel));

const invalidManifestDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-dev-rules-invalid-manifest-'));
fs.mkdirSync(path.join(invalidManifestDir, '.ai-rules'), { recursive: true });
fs.writeFileSync(path.join(invalidManifestDir, '.ai-rules/manifest.json'), '{invalid json\n', 'utf8');
assert.throws(
  () => readManifest(invalidManifestDir),
  error => error.code === 'INVALID_DEV_RULES_MANIFEST',
);

const agentsMd = fs.readFileSync(path.join(appDir, 'AGENTS.md'), 'utf8');
const claudeMd = fs.readFileSync(path.join(appDir, 'CLAUDE.md'), 'utf8');
assert(claudeMd.includes('## Task routing'));
assert(claudeMd.includes('.ai-rules/jianghu-init-json-app/coding-standards.md'));
assert(agentsMd.includes('.ai-rules/jianghu-init-json-app/coding-standards.md'));
assert(agentsMd.includes('.ai-rules/jianghu-init-json-app/agent-workflow.md'));
assert(claudeMd.includes('canonical keys'));
assert(claudeMd.includes('jianghu-init json --dev-status'));
assert(claudeMd.includes('Frontend button visibility does not replace backend resource authorization'));
assert(!agentsMd.includes('Last sync:'));
for (const skillId of skillIds) {
  assert(agentsMd.includes(`.agents/skills/${skillId}/SKILL.md`));
  assert(claudeMd.includes(`.claude/skills/${skillId}/SKILL.md`));
}

const seoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-dev-rules-seo-'));
generate(seoDir, ['jianghu-seo-app']);
assert(!exists(seoDir, '.agents/skills/jianghu-init-json-authoring/SKILL.md'));
assert(exists(seoDir, '.ai-rules/skills/jianghu-seo-development/SKILL.md'));
assert(exists(seoDir, '.agents/skills/jianghu-seo-development/SKILL.md'));
assert(exists(seoDir, '.claude/skills/jianghu-seo-development/SKILL.md'));
assert(exists(seoDir, '.kiro/skills/jianghu-seo-development/SKILL.md'));
assert(exists(seoDir, '.cursor/rules/jianghu-seo-development.mdc'));
assert(!exists(seoDir, '.kiro/steering/jianghu-seo-development.md'));
for (const reference of [
  'render-pipeline.md',
  'article-and-tags.md',
  'search-and-index.md',
  'review-checklist.md',
]) {
  assert(exists(seoDir, `.ai-rules/skills/jianghu-seo-development/references/${reference}`));
}
for (const entryFile of [
  '.ai-rules/index.md',
  'AGENTS.md',
  '.cursor/rules/ai-rules-index.mdc',
  'CLAUDE.md',
  '.kiro/steering/ai-rules-index.md',
]) {
  const entryContent = fs.readFileSync(path.join(seoDir, entryFile), 'utf8');
  assert(!entryContent.includes('.ai-rules/project/README.md'), `SEO-only broken project route: ${entryFile}`);
  assert(!entryContent.includes('.ai-rules/jianghu-init-json-app/'), `SEO-only broken init-json route: ${entryFile}`);
}
assert(!exists(seoDir, '.ai-rules/project/README.md'));

const switchDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-dev-rules-switch-'));
const beforeSwitch = generate(
  switchDir,
  ['jianghu-init-json-app', 'jianghu-seo-app'],
  ['codex', 'cursor', 'claude', 'kiro'],
);
const legacyKiroSkillPointer = '.kiro/steering/jianghu-init-json-authoring.md';
fs.writeFileSync(
  path.join(switchDir, legacyKiroSkillPointer),
  'legacy generated Kiro Skill pointer\n',
  'utf8',
);
const afterSwitch = generate(switchDir, ['jianghu-seo-app'], ['codex']);
cleanupGeneratedFiles({
  cwd: switchDir,
  previousManifest: {
    schemaVersion: 5,
    generatedFiles: [...beforeSwitch.desiredFiles, legacyKiroSkillPointer],
  },
  desiredFiles: afterSwitch.desiredFiles,
  knownRuleIds: listRulePacks().map(rule => rule.id),
  knownSkillIds: listSkillIds(),
});
for (const staleFile of [
  '.ai-rules/jianghu-init-json-app/README.md',
  '.agents/skills/jianghu-init-json-authoring/SKILL.md',
  '.cursor/rules/jianghu-init-json-app.mdc',
  '.claude/rules/jianghu-init-json-app.md',
  '.kiro/steering/jianghu-init-json-app.md',
  '.kiro/steering/ai-rules-index.md',
  legacyKiroSkillPointer,
  '.kiro/skills/jianghu-init-json-authoring/SKILL.md',
]) {
  assert(!exists(switchDir, staleFile), `stale generated file: ${staleFile}`);
}
assert(exists(switchDir, '.ai-rules/jianghu-seo-app/README.md'));
assert(exists(switchDir, '.agents/skills/jianghu-seo-development/SKILL.md'));
assert(exists(switchDir, 'AGENTS.md'));

const manifestLifecycleDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-dev-rules-manifest-'));
fs.writeFileSync(path.join(manifestLifecycleDir, 'package.json'), '{"name":"manifest-lifecycle-test"}\n', 'utf8');
runDevRulesCommand(manifestLifecycleDir, [
  '--rule=jianghu-init-json-app',
  '--target=codex,cursor',
  '--force',
]);
fs.unlinkSync(path.join(manifestLifecycleDir, '.cursor/rules/ai-rules-index.mdc'));
fs.writeFileSync(path.join(manifestLifecycleDir, 'CLAUDE.md'), 'custom Claude instructions\n', 'utf8');
runDevRulesCommand(manifestLifecycleDir, [
  '--rule=jianghu-init-json-app',
  '--target=codex,claude',
]);
const manifestAfterCleanup = readManifest(manifestLifecycleDir);
assert(!manifestAfterCleanup.generatedFiles.includes('.cursor/rules/ai-rules-index.mdc'));
fs.mkdirSync(path.join(manifestLifecycleDir, '.cursor/rules'), { recursive: true });
const customCursorPath = path.join(manifestLifecycleDir, '.cursor/rules/ai-rules-index.mdc');
fs.writeFileSync(customCursorPath, 'custom Cursor instructions\n', 'utf8');
for (const legacyFile of [
  '.ai-rules/project/agent-workflow.md',
  '.ai-rules/project/coding-standards.md',
  '.ai-rules/project/review-prompt-template.md',
]) {
  fs.writeFileSync(path.join(manifestLifecycleDir, legacyFile), 'legacy project quality rule\n', 'utf8');
}
const lifecycleThirdRun = runDevRulesCommand(manifestLifecycleDir, [
  '--rule=jianghu-init-json-app',
  '--target=codex,claude',
]);
assert.strictEqual(fs.readFileSync(customCursorPath, 'utf8'), 'custom Cursor instructions\n');
assert(lifecycleThirdRun.stdout.includes('检测到旧版 project 质量文档'));

console.log('dev-rules skill generation tests passed');
