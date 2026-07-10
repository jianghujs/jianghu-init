'use strict';

const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const CommandBase = require('./command_base');
const { readJson } = require('./dev-rules/util');
const { getRulePack, listRulePacks, parseRuleIds, syncRulePacks } = require('./dev-rules/rulePacks');

const { listAdapters, syncTargets } = require('./dev-rules/adapters');

const PACKAGE_JSON = path.join(__dirname, '..', 'package.json');
const TEMPLATE_ROOT = path.join(__dirname, 'dev-rules');
const TEMPLATE_SOURCE = path.join(TEMPLATE_ROOT, 'source');
const PROFILES_DIR = path.join(__dirname, 'dev-rules', 'profiles');
const MODULES_FILE = path.join(__dirname, 'dev-rules', 'modules.json');

const parseArgs = argv => {
  const out = {
    sync: false,
    force: false,
    yes: false,
    interactive: false,
    listRules: false,
    listTargets: false,
    help: false,
    profile: null,
    ruleIds: null,
    targets: null,
  };
  for (const arg of argv || []) {
    if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--sync') out.sync = true;
    else if (arg === '--force' || arg === '-f') out.force = true;
    else if (arg === '--yes' || arg === '-y') out.yes = true;
    else if (arg === '--interactive') out.interactive = true;
    else if (arg === '--list-rules') out.listRules = true;
    else if (arg === '--list-targets') out.listTargets = true;
    else if (arg.startsWith('--profile=')) out.profile = arg.slice('--profile='.length);
    else if (arg.startsWith('--rule=')) out.ruleIds = parseRuleIds(arg.slice('--rule='.length));
    else if (arg.startsWith('--rules=')) out.ruleIds = parseRuleIds(arg.slice('--rules='.length));
    else if (arg.startsWith('--target=')) {
      out.targets = arg.slice('--target='.length).split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return out;
};

const normalizeProfileId = profileId => profileId === 'init-tool' ? 'init-json' : profileId;

const loadProfile = profileId => readJson(path.join(PROFILES_DIR, `${normalizeProfileId(profileId)}.json`));

const loadModuleDefs = () => readJson(MODULES_FILE);

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
  --force, -f            覆盖已有生成物
  --yes, -y              兼容旧参数；当前无交互
  --list-rules           列出支持的规则包
  --list-targets         列出支持的 adapter
  --help, -h             显示帮助

生成结构:
  .ai-rules/index.md              通用规则索引
  .ai-rules/<rule-pack>/          通用规则包
  AGENTS.md                       Codex
  .cursor/rules/*.mdc             Cursor
  .claude/rules/*.md + CLAUDE.md  Claude Code
  .kiro/steering/*.md             Kiro

规则模板来源:
  jianghu-init/lib/dev-rules/
`);
};

module.exports = class InitDevRulesCommand extends CommandBase {
  async run(cwd, args) {
    const opts = parseArgs(args);

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
    const manifest = await this.resolveManifest(cwd, opts, jianghuInitVersion);

    const moduleDefs = loadModuleDefs();
    const rulePackFiles = syncRulePacks({
      cwd,
      ruleIds: manifest.ruleIds,
      templateRoot: TEMPLATE_ROOT,
      force: opts.force,
    });
    const results = syncTargets({
      cwd,
      targets: manifest.targets,
      modules: manifest.modules,
      ruleIds: manifest.ruleIds,
      moduleDefs,
      sourceDir: TEMPLATE_SOURCE,
      manifest,
      force: opts.force,
    });
    results['.ai-rules'] = rulePackFiles;

    this.printResults(cwd, manifest, results);
  }

  async resolveManifest(cwd, opts, jianghuInitVersion) {
    this.notice('Generating JianghuJS AI dev-rules...');

    const profileId = opts.profile || 'app';
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
      process.exit(1);
    }

    const profile = loadProfile(profileId);

    return {
      schemaVersion: 2,
      jianghuInitVersion,
      profile: profile.id,
      ruleIds,
      targets,
      modules: profile.modules,
      lastSyncAt: new Date().toISOString(),
    };
  }

  printResults(cwd, manifest, results) {
    this.notice('\nSync complete.');
    console.log(`Profile: ${manifest.profile}`);
    console.log(`Rule packs: ${manifest.ruleIds.join(', ')}`);
    console.log(`Targets: ${manifest.targets.join(', ')}`);
    console.log('');

    for (const [target, files] of Object.entries(results)) {
      if (files && files.error) {
        this.warning(`${target}: ${files.error}`);
        continue;
      }
      if (files && files.skipped) {
        console.log(`- ${target}: skipped existing ${files.skipped.join(', ')} (use --force to overwrite)`);
        continue;
      }
      if (!files || !files.length) {
        console.log(`- ${target}: (skipped, files exist — use --force)`);
        continue;
      }
      this.success(`${target}:`);
      for (const f of files) {
        console.log(`  · ${f}`);
      }
    }

    this.notice('\n规则模板来源: jianghu-init/lib/dev-rules/');
    this.notice('更新命令: jianghu-init dev-rules --rule=' + manifest.ruleIds.join(',') + ' --target=' + manifest.targets.join(',') + ' --force');
  }
};
