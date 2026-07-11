'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { syncRulePacks, listRulePacks } = require('./rulePacks');
const { syncTargets } = require('./adapters');
const { cleanupGeneratedFiles } = require('./state');
const { listSkillIds } = require('./skills');

const templateRoot = __dirname;

const collectFiles = (results, key) => Array.from(new Set(Object.values(results).reduce(
  (files, result) => files.concat(result[key] || []),
  [],
))).sort();

const generate = (cwd, ruleIds, targets = ['codex', 'cursor', 'claude', 'kiro'], force = true) => {
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
  });
  results['.ai-rules'] = syncRulePacks({ cwd, ruleIds, templateRoot, force });
  return { manifest, results, desiredFiles: collectFiles(results, 'desired') };
};

const exists = (root, relativePath) => fs.existsSync(path.join(root, relativePath));

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

for (const skillId of skillIds) {
  assert(exists(appDir, `.ai-rules/skills/${skillId}/SKILL.md`));
  assert(exists(appDir, `.agents/skills/${skillId}/SKILL.md`));
  assert(exists(appDir, `.claude/skills/${skillId}/SKILL.md`));
  assert(exists(appDir, `.cursor/rules/${skillId}.mdc`));
  assert(exists(appDir, `.kiro/steering/${skillId}.md`));
  for (const reference of skillReferences[skillId]) {
    assert(exists(appDir, `.ai-rules/skills/${skillId}/references/${reference}`));
    assert(exists(appDir, `.agents/skills/${skillId}/references/${reference}`));
    assert(exists(appDir, `.claude/skills/${skillId}/references/${reference}`));
  }
  assert(
    fs.readFileSync(path.join(appDir, `.cursor/rules/${skillId}.mdc`), 'utf8')
      .includes(`.ai-rules/skills/${skillId}/SKILL.md`),
  );
  assert(
    fs.readFileSync(path.join(appDir, `.kiro/steering/${skillId}.md`), 'utf8')
      .includes(`.ai-rules/skills/${skillId}/SKILL.md`),
  );
}

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

const agentsMd = fs.readFileSync(path.join(appDir, 'AGENTS.md'), 'utf8');
const claudeMd = fs.readFileSync(path.join(appDir, 'CLAUDE.md'), 'utf8');
for (const skillId of skillIds) {
  assert(agentsMd.includes(`.agents/skills/${skillId}/SKILL.md`));
  assert(claudeMd.includes(`.claude/skills/${skillId}/SKILL.md`));
}

const seoDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-dev-rules-seo-'));
generate(seoDir, ['jianghu-seo-app']);
assert(!exists(seoDir, '.agents/skills/jianghu-init-json-authoring/SKILL.md'));

const switchDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-dev-rules-switch-'));
const beforeSwitch = generate(
  switchDir,
  ['jianghu-init-json-app', 'jianghu-seo-app'],
  ['codex', 'cursor', 'claude', 'kiro'],
);
const afterSwitch = generate(switchDir, ['jianghu-seo-app'], ['codex']);
cleanupGeneratedFiles({
  cwd: switchDir,
  previousManifest: { schemaVersion: 5, generatedFiles: beforeSwitch.desiredFiles },
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
]) {
  assert(!exists(switchDir, staleFile), `stale generated file: ${staleFile}`);
}
assert(exists(switchDir, '.ai-rules/jianghu-seo-app/README.md'));
assert(exists(switchDir, 'AGENTS.md'));

console.log('dev-rules skill generation tests passed');
