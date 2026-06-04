'use strict';

const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const CommandBase = require('./command_base');
const { detectProfile } = require('./dev-rules/detect');
const {
  getAiRulesDir,
  getSourceDir,
  getDocsDir,
  loadManifest,
  saveManifest,
  buildDefaultManifest,
} = require('./dev-rules/manifest');
const { copyReferenceDocs, copySourceModules } = require('./dev-rules/copyReferenceDocs');
const { readJson } = require('./dev-rules/util');

const PKG_ROOT = path.join(__dirname, '..');
const { listAdapters, syncTargets } = require('./dev-rules/adapters');

const PACKAGE_JSON = path.join(__dirname, '..', 'package.json');
const TEMPLATE_SOURCE = path.join(__dirname, 'dev-rules', 'source');
const PROFILES_DIR = path.join(__dirname, 'dev-rules', 'profiles');
const MODULES_FILE = path.join(__dirname, 'dev-rules', 'modules.json');

const parseArgs = argv => {
  const out = {
    sync: false,
    force: false,
    yes: false,
    listTargets: false,
    help: false,
    profile: null,
    targets: null,
  };
  for (const arg of argv || []) {
    if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--sync') out.sync = true;
    else if (arg === '--force' || arg === '-f') out.force = true;
    else if (arg === '--yes' || arg === '-y') out.yes = true;
    else if (arg === '--list-targets') out.listTargets = true;
    else if (arg.startsWith('--profile=')) out.profile = arg.slice('--profile='.length);
    else if (arg.startsWith('--target=')) {
      out.targets = arg.slice('--target='.length).split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return out;
};

const loadProfile = profileId => readJson(path.join(PROFILES_DIR, `${profileId}.json`));

const loadModuleDefs = () => readJson(MODULES_FILE);

const showHelp = () => {
  console.log(`
用法: jianghu-init dev-rules [选项]
别名: jianghu-init rules

初始化 JianghuJS AI 开发规范（SSOT + 多 IDE adapter）。

选项:
  --sync                 按 manifest 重新生成各 IDE 规则（默认：无 manifest 时 init + sync）
  --target=cursor,claude 指定生成目标（cursor | claude | kiro | agents-md）
  --profile=app          配置模板：app | init-tool
  --force, -f            覆盖已有 source / 生成物
  --yes, -y              跳过交互
  --list-targets         列出支持的 adapter
  --help, -h             显示帮助

生成结构:
  .jianghu/ai-rules/source/     规范源（SSOT，建议提交 git）
  .jianghu/ai-rules/docs/       App：v7-app-authoring.md；init-tool 另含编译器文档
  .jianghu/ai-rules/manifest.json
  .cursor/rules/*.mdc             Cursor
  .claude/rules/*.md + CLAUDE.md  Claude Code
  .kiro/steering/*.md             Kiro
  AGENTS.md                       跨工具索引
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

    const pkgPath = path.join(cwd, 'package.json');
    if (!fs.existsSync(pkgPath)) {
      this.error('当前目录未找到 package.json，请在项目根目录运行。');
      process.exit(1);
    }

    const jianghuInitVersion = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8')).version;
    let manifest = loadManifest(cwd);
    const isFirstRun = !manifest;

    const shouldRefreshSources = isFirstRun || !opts.sync || opts.force;

    if (isFirstRun || !opts.sync) {
      manifest = await this.initManifest(cwd, opts, manifest, jianghuInitVersion);
    } else if (opts.profile) {
      const profile = loadProfile(opts.profile);
      manifest.profile = profile.id;
      manifest.modules = profile.modules;
    }

    if (opts.targets && opts.targets.length) {
      manifest.targets = opts.targets;
    }

    if (shouldRefreshSources && manifest) {
      const moduleDefs = loadModuleDefs();
      const copiedSources = copySourceModules({
        templateDir: TEMPLATE_SOURCE,
        sourceDir: getSourceDir(cwd),
        moduleIds: manifest.modules,
        moduleDefs,
        force: opts.force || isFirstRun,
      });
      if (copiedSources.length) {
        this.success(`Updated source → .jianghu/ai-rules/source/ (${copiedSources.join(', ')})`);
      }
      this.copyProjectReferenceDocs(cwd, manifest.profile, opts.force || isFirstRun);
    }

    manifest.jianghuInitVersion = jianghuInitVersion;
    manifest.lastSyncAt = new Date().toISOString();
    saveManifest(cwd, manifest);

    const moduleDefs = loadModuleDefs();
    const sourceDir = getSourceDir(cwd);
    const results = syncTargets({
      cwd,
      targets: manifest.targets,
      modules: manifest.modules,
      moduleDefs,
      sourceDir,
      manifest,
      force: opts.force || isFirstRun,
    });

    this.printResults(cwd, manifest, results);
  }

  async initManifest(cwd, opts, existingManifest, jianghuInitVersion) {
    this.notice('Initializing JianghuJS AI dev-rules...');

    const detectedProfile = detectProfile(cwd);
    let profileId = opts.profile || (existingManifest && existingManifest.profile) || detectedProfile;

    if (!opts.yes && !opts.profile) {
      const answer = await inquirer.prompt({
        name: 'profile',
        type: 'list',
        message: `选择规范模板（检测到: ${detectedProfile}）`,
        choices: [
          { name: 'app - 江湖 App 业务项目', value: 'app' },
          { name: 'init-tool - jianghu-init 工具仓', value: 'init-tool' },
        ],
        default: detectedProfile,
      });
      profileId = answer.profile;
    }

    const profile = loadProfile(profileId);
    let targets = (existingManifest && existingManifest.targets) || ['cursor', 'agents-md'];

    if (!opts.yes && !opts.targets) {
      const answer = await inquirer.prompt({
        name: 'targets',
        type: 'checkbox',
        message: '选择要生成的 IDE / 工具规则',
        choices: listAdapters().map(a => ({
          name: a.label,
          value: a.id,
          checked: ['cursor', 'agents-md'].includes(a.id),
        })),
      });
      targets = answer.targets.length ? answer.targets : ['cursor'];
    } else if (opts.targets && opts.targets.length) {
      targets = opts.targets;
    }

    const moduleDefs = loadModuleDefs();
    const sourceDir = getSourceDir(cwd);
    const copied = copySourceModules({
      templateDir: TEMPLATE_SOURCE,
      sourceDir,
      moduleIds: profile.modules,
      moduleDefs,
      force: opts.force,
    });
    if (copied.length) {
      this.success(`Copied source templates → .jianghu/ai-rules/source/ (${copied.join(', ')})`);
    } else {
      this.notice('Source templates already exist (use --force to overwrite).');
    }

    const manifest = buildDefaultManifest({
      profile: profile.id,
      targets,
      modules: profile.modules,
      jianghuInitVersion,
    });

    saveManifest(cwd, manifest);
    this.success(`Created ${path.join('.jianghu', 'ai-rules', 'manifest.json')}`);
    return manifest;
  }

  copyProjectReferenceDocs(cwd, profile, force) {
    const { copied, skipped } = copyReferenceDocs({
      pkgRoot: PKG_ROOT,
      docsDir: getDocsDir(cwd),
      profile: profile || 'app',
      force,
    });
    if (copied.length) {
      this.success(`Copied reference docs → .jianghu/ai-rules/docs/ (${copied.join(', ')})`);
    }
    if (skipped.length) {
      this.warning(`Reference docs not found in jianghu-init package: ${skipped.join(', ')}`);
    }
  }

  printResults(cwd, manifest, results) {
    this.notice('\nSync complete.');
    console.log(`Profile: ${manifest.profile}`);
    console.log(`Targets: ${manifest.targets.join(', ')}`);
    console.log(`Modules: ${manifest.modules.join(', ')}`);
    console.log('');

    for (const [target, files] of Object.entries(results)) {
      if (files && files.error) {
        this.warning(`${target}: ${files.error}`);
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

    this.notice('\n规范源目录: .jianghu/ai-rules/source/');
    this.notice('更新命令: jianghu-init dev-rules --sync --force');
  }
};
