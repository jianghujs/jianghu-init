'use strict';

const path = require('path');
const fs = require('fs');
const {
  ensureDir, parseFrontmatter, createSyncResult, mergeSyncResult, toRelativePath,
} = require('./util');

const SKILLS = {
  'jianghu-init-json-authoring': {
    id: 'jianghu-init-json-authoring',
    label: 'JianghuJS init-json authoring',
    rulePacks: ['jianghu-init-json-app'],
    globs: ['app/view/init-json/**/*.js'],
  },
  'jianghu-init-json-migration': {
    id: 'jianghu-init-json-migration',
    label: 'JianghuJS init-json migration',
    rulePacks: ['jianghu-init-json-app'],
    globs: [],
  },
  'jianghu-init-json-review': {
    id: 'jianghu-init-json-review',
    label: 'JianghuJS init-json review',
    rulePacks: ['jianghu-init-json-app'],
    globs: [],
  },
  'jianghu-seo-development': {
    id: 'jianghu-seo-development',
    label: 'OpenJianghu SEO development',
    rulePacks: ['jianghu-seo-app'],
    globs: [
      'app/view/page/**/*.html',
      'app/view/xfpageTemplate/**/*.html',
      'app/view/template/**/*.html',
      'app/service/**/*.js',
      'app/controller/**/*.js',
      'config/**/*.js',
      'meilisearchScript/**/*',
    ],
  },
};

const getSkillSourceDir = (templateRoot, skillId) => path.join(templateRoot, 'skills', skillId);

const getSkill = (templateRoot, skillId) => {
  const definition = SKILLS[skillId];
  if (!definition) return null;
  const skillFile = path.join(getSkillSourceDir(templateRoot, skillId), 'SKILL.md');
  const parsed = parseFrontmatter(fs.readFileSync(skillFile, 'utf8'));
  return Object.assign({}, definition, {
    description: parsed.meta.description || definition.label,
  });
};

const getSkillsForRuleIds = (templateRoot, ruleIds) => {
  const selected = new Set(ruleIds || []);
  return Object.values(SKILLS)
    .filter(skill => skill.rulePacks.some(ruleId => selected.has(ruleId)))
    .map(skill => getSkill(templateRoot, skill.id));
};

const listSkillIds = () => Object.keys(SKILLS);

const listRelativeFiles = (dir, rootDir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) listRelativeFiles(target, rootDir, out);
    else if (entry.isFile()) out.push(path.relative(rootDir, target));
  }
  return out;
};

const listSkillFiles = (templateRoot, skillId) => {
  const sourceDir = getSkillSourceDir(templateRoot, skillId);
  return fs.existsSync(sourceDir) ? listRelativeFiles(sourceDir, sourceDir) : [];
};

const copyDirectory = (sourceDir, targetDir, force, managedFiles, cwd) => {
  const result = createSyncResult();
  ensureDir(targetDir);
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const source = path.join(sourceDir, entry.name);
    const target = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      const nested = copyDirectory(source, target, force, managedFiles, cwd);
      mergeSyncResult(result, nested);
    } else if (entry.isFile()) {
      const relativePath = toRelativePath(cwd, target);
      result.desired.push(relativePath);
      const canOverwrite = force || (managedFiles && managedFiles.has(relativePath));
      if (!canOverwrite && fs.existsSync(target)) {
        if (fs.readFileSync(source).equals(fs.readFileSync(target))) result.unchanged.push(relativePath);
        else result.skipped.push(relativePath);
      } else {
        ensureDir(path.dirname(target));
        fs.copyFileSync(source, target);
        result.written.push(relativePath);
      }
    }
  }
  return result;
};

const syncSkillsToDirectory = ({ cwd, templateRoot, skills, targetRoot, force, managedFiles }) => {
  const result = createSyncResult();
  for (const skill of skills || []) {
    const targetDir = path.join(targetRoot, skill.id);
    const copied = copyDirectory(
      getSkillSourceDir(templateRoot, skill.id),
      targetDir,
      force,
      managedFiles,
      cwd,
    );
    mergeSyncResult(result, copied);
  }
  return result;
};

module.exports = {
  getSkillsForRuleIds,
  listSkillIds,
  listSkillFiles,
  syncSkillsToDirectory,
};
