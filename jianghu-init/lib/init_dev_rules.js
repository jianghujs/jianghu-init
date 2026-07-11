'use strict';

const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const CommandBase = require('./command_base');
const { getRulePack, listRulePacks, parseRuleIds, syncRulePacks } = require('./dev-rules/rulePacks');
const { getSkillsForRuleIds, listSkillIds, listSkillFiles } = require('./dev-rules/skills');
const { writeJson } = require('./dev-rules/util');
const { MANIFEST_PATH, readManifest, cleanupGeneratedFiles } = require('./dev-rules/state');

const { getAdapter, listAdapters, syncTargets } = require('./dev-rules/adapters');

const PACKAGE_JSON = path.join(__dirname, '..', 'package.json');
const TEMPLATE_ROOT = path.join(__dirname, 'dev-rules');

const buildLegacyGeneratedFiles = manifest => {
  const files = [ '.ai-rules/index.md' ];
  const ruleIds = (manifest.ruleIds || []).filter(getRulePack);
  const skillIds = (manifest.skills || []).filter(id => listSkillIds().includes(id));
  for (const ruleId of ruleIds) {
    const pack = getRulePack(ruleId);
    for (const file of pack.files) files.push(`.ai-rules/${ruleId}/${file.dest}`);
  }
  for (const skillId of skillIds) {
    for (const file of listSkillFiles(TEMPLATE_ROOT, skillId)) {
      files.push(`.ai-rules/skills/${skillId}/${file}`);
      files.push(`.agents/skills/${skillId}/${file}`);
      files.push(`.claude/skills/${skillId}/${file}`);
    }
  }
  files.push(
    '.ai-rules/skills/jianghu-init-json-authoring/references/v7-authoring.md',
    '.agents/skills/jianghu-init-json-authoring/references/v7-authoring.md',
    '.claude/skills/jianghu-init-json-authoring/references/v7-authoring.md',
    '.ai-rules/skills/jianghu-init-json-migration/references/migration-guide.md',
    '.agents/skills/jianghu-init-json-migration/references/migration-guide.md',
    '.claude/skills/jianghu-init-json-migration/references/migration-guide.md',
  );
  for (const target of manifest.targets || []) {
    if (target === 'codex' || target === 'agents-md') {
      files.push('AGENTS.md');
    } else if (target === 'cursor') {
      files.push('.cursor/rules/ai-rules-index.mdc');
      for (const ruleId of ruleIds) files.push(`.cursor/rules/${ruleId}.mdc`);
      for (const skillId of skillIds) files.push(`.cursor/rules/${skillId}.mdc`);
    } else if (target === 'claude') {
      files.push('CLAUDE.md');
      for (const ruleId of ruleIds) files.push(`.claude/rules/${ruleId}.md`);
    } else if (target === 'kiro') {
      for (const ruleId of ruleIds) files.push(`.kiro/steering/${ruleId}.md`);
      for (const skillId of skillIds) files.push(`.kiro/steering/${skillId}.md`);
    }
  }
  return Array.from(new Set(files));
};

const parseArgs = argv => {
  const out = {
    sync: false,
    force: false,
    yes: false,
    interactive: false,
    listRules: false,
    listTargets: false,
    help: false,
    ruleIds: null,
    targets: null,
    removedProfile: null,
    unknown: [],
  };
  for (const arg of argv || []) {
    if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--sync') out.sync = true;
    else if (arg === '--force' || arg === '-f') out.force = true;
    else if (arg === '--yes' || arg === '-y') out.yes = true;
    else if (arg === '--interactive') out.interactive = true;
    else if (arg === '--list-rules') out.listRules = true;
    else if (arg === '--list-targets') out.listTargets = true;
    else if (arg.startsWith('--profile=')) out.removedProfile = arg;
    else if (arg.startsWith('--rule=')) out.ruleIds = parseRuleIds(arg.slice('--rule='.length));
    else if (arg.startsWith('--rules=')) out.ruleIds = parseRuleIds(arg.slice('--rules='.length));
    else if (arg.startsWith('--target=')) {
      out.targets = arg.slice('--target='.length).split(',').map(s => s.trim()).filter(Boolean);
    } else out.unknown.push(arg);
  }
  return out;
};

const showHelp = () => {
  console.log(`
用法: jianghu-init dev-rules [选项]
别名: jianghu-init rules

初始化 JianghuJS AI 开发规范（生成通用规则包和各工具入口文件）。

选项:
  --sync                 兼容旧命令；当前等同于重新生成目标文件
  --rule=jianghu-init-json-app,jianghu-seo-app
                         指定项目规则包；默认 jianghu-init-json-app
  --target=codex,cursor  指定生成目标（codex | cursor | claude | kiro | agents-md）
  --interactive          交互选择规则包 / 生成目标（裸 jianghu-init 菜单会自动启用）
  --force, -f            按所选 rule/target 同步最终状态，并覆盖已有生成物
  --yes, -y              兼容旧参数；当前无交互
  --list-rules           列出支持的规则包
  --list-targets         列出支持的 adapter
  --help, -h             显示帮助

生成结构:
  .ai-rules/index.md              通用规则索引
  .ai-rules/<rule-pack>/          通用规则包
  .ai-rules/skills/               通用任务 Skill
  AGENTS.md + .agents/skills/     Codex
  .cursor/rules/*.mdc             Cursor
  CLAUDE.md + .claude/skills/     Claude Code
  .kiro/steering/*.md             Kiro

规则模板来源:
  jianghu-init/lib/dev-rules/

说明:
  --force 只清理 manifest 记录的旧生成文件；不会删除未被 dev-rules 管理的自定义文件。
`);
};

module.exports = class InitDevRulesCommand extends CommandBase {
  async run(cwd, args) {
    const opts = parseArgs(args);

    if (opts.removedProfile) {
      this.error(`${opts.removedProfile} 已移除；dev-rules 现在只面向业务 App，请使用 --rule 选择规则包。`);
      process.exitCode = 1;
      return;
    }
    if (opts.unknown.length) {
      this.error(`未知参数: ${opts.unknown.join(', ')}`);
      process.exitCode = 1;
      return;
    }

    if (opts.help) {
      showHelp();
      return;
    }

    if (opts.listTargets) {
      for (const item of listAdapters()) {
        console.log(`- ${item.id}: ${item.label}`);
      }
      return;
    }

    if (opts.listRules) {
      for (const item of listRulePacks()) {
        console.log(`- ${item.id}: ${item.label} - ${item.description}`);
      }
      return;
    }

    const pkgPath = path.join(cwd, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      this.error('当前目录未找到 package.json，请在项目根目录运行。');
      process.exit(1);
    }

    const jianghuInitVersion = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8')).version;
    const manifest = await this.resolveManifest(opts, jianghuInitVersion);
    if (!manifest) return;
    const previousManifest = readManifest(cwd);

    const rulePackFiles = syncRulePacks({
      cwd,
      ruleIds: manifest.ruleIds,
      templateRoot: TEMPLATE_ROOT,
      force: opts.force,
    });
    const results = syncTargets({
      cwd,
      targets: manifest.targets,
      ruleIds: manifest.ruleIds,
      templateRoot: TEMPLATE_ROOT,
      manifest,
      force: opts.force,
    });
    results['.ai-rules'] = rulePackFiles;

    const allResults = Object.values(results);
    const collectFiles = key => Array.from(new Set(allResults.reduce(
      (files, result) => files.concat(result[key] || []),
      [],
    ))).sort();
    const desiredFiles = collectFiles('desired');
    const writtenFiles = collectFiles('written');
    const unchangedFiles = collectFiles('unchanged');
    const skippedFiles = collectFiles('skipped');
    const knownRuleIds = listRulePacks().map(rule => rule.id);
    const knownSkillIds = listSkillIds();
    const cleanupManifest = previousManifest && !Array.isArray(previousManifest.generatedFiles)
      ? Object.assign({}, previousManifest, { generatedFiles: buildLegacyGeneratedFiles(previousManifest) })
      : previousManifest;
    const removedFiles = opts.force ? cleanupGeneratedFiles({
      cwd,
      previousManifest: cleanupManifest,
      desiredFiles,
      knownRuleIds,
      knownSkillIds,
    }) : [];
    if (removedFiles.length) {
      results.cleanup = { desired: [], written: [], unchanged: [], skipped: [], removed: removedFiles };
    }

    const canUpgradeLegacyManifest = !previousManifest
      || previousManifest.schemaVersion >= 5
      || opts.force
      || !skippedFiles.length;
    if (canUpgradeLegacyManifest) {
      const previousGenerated = previousManifest && Array.isArray(previousManifest.generatedFiles)
        ? previousManifest.generatedFiles
        : [];
      const generatedFiles = opts.force || !skippedFiles.length
        ? desiredFiles
        : Array.from(new Set([ ...previousGenerated, ...writtenFiles, ...unchangedFiles ])).sort();
      const skills = getSkillsForRuleIds(TEMPLATE_ROOT, manifest.ruleIds).map(skill => skill.id);
      Object.assign(manifest, {
        skills,
        syncComplete: skippedFiles.length === 0,
        generatedFiles,
        skippedFiles,
      });
      writeJson(path.join(cwd, MANIFEST_PATH), manifest);
      results.manifest = {
        desired: [ MANIFEST_PATH ],
        written: [ MANIFEST_PATH ],
        unchanged: [],
        skipped: [],
        removed: [],
      };
    } else {
      manifest.syncComplete = false;
      results.manifest = {
        desired: [],
        written: [],
        unchanged: [],
        removed: [],
        skipped: [ `${MANIFEST_PATH} (legacy manifest kept until --force)` ],
      };
    }

    this.printResults(manifest, results);
  }

  async resolveManifest(opts, jianghuInitVersion) {
    this.notice('Generating JianghuJS AI dev-rules...');

    let ruleIds = opts.ruleIds && opts.ruleIds.length ? opts.ruleIds : ['jianghu-init-json-app'];
    let targets = opts.targets && opts.targets.length ? opts.targets : ['codex'];

    if (opts.interactive && !opts.yes) {
      if (!opts.ruleIds) {
        const answer = await inquirer.prompt({
          name: 'ruleIds',
          type: 'checkbox',
          message: '选择项目规则包',
          choices: listRulePacks().map(pack => ({
            name: `${pack.label} - ${pack.description}`,
            value: pack.id,
            checked: pack.id === 'jianghu-init-json-app',
          })),
        });
        ruleIds = answer.ruleIds.length ? answer.ruleIds : ['jianghu-init-json-app'];
      }

      if (!opts.targets) {
        const answer = await inquirer.prompt({
          name: 'targets',
          type: 'checkbox',
          message: '选择要生成的 AI 工具入口',
          choices: listAdapters()
            .filter(a => a.id !== 'agents-md')
            .map(a => ({
              name: a.label,
              value: a.id,
              checked: a.id === 'codex',
            })),
        });
        targets = answer.targets.length ? answer.targets : ['codex'];
      }
    }

    const unknownRules = ruleIds.filter(id => !getRulePack(id));
    if (unknownRules.length) {
      this.error(`未知规则包: ${unknownRules.join(', ')}。可运行 jianghu-init dev-rules --list-rules 查看支持项。`);
      process.exitCode = 1;
      return null;
    }
    const unknownTargets = targets.filter(id => !getAdapter(id));
    if (unknownTargets.length) {
      this.error(`未知生成目标: ${unknownTargets.join(', ')}。可运行 jianghu-init dev-rules --list-targets 查看支持项。`);
      process.exitCode = 1;
      return null;
    }

    return {
      schemaVersion: 5,
      jianghuInitVersion,
      ruleIds,
      targets,
      lastSyncAt: new Date().toISOString(),
    };
  }

  printResults(manifest, results) {
    this.notice('\nSync complete.');
    console.log(`Rule packs: ${manifest.ruleIds.join(', ')}`);
    console.log(`Targets: ${manifest.targets.join(', ')}`);
    console.log('');

    for (const [target, result] of Object.entries(results)) {
      if (result.written && result.written.length) {
        this.success(`${target}:`);
        for (const file of result.written) console.log(`  · ${file}`);
      }
      if (result.removed && result.removed.length) {
        console.log(`- ${target}: removed stale ${result.removed.join(', ')}`);
      }
      if (result.skipped && result.skipped.length) {
        console.log(`- ${target}: skipped existing ${result.skipped.join(', ')} (use --force to overwrite)`);
      }
      if (!result.written.length && !result.removed.length && !result.skipped.length) {
        console.log(`- ${target}: up to date`);
      }
    }

    if (manifest.syncComplete === false) {
      this.warning('规则同步未完全应用；manifest 已记录 skippedFiles，请使用 --force 完成更新。');
    }

    this.notice('\n规则模板来源: jianghu-init/lib/dev-rules/');
    this.notice('更新命令: jianghu-init dev-rules --rule=' + manifest.ruleIds.join(',') + ' --target=' + manifest.targets.join(',') + ' --force');
  }
};
