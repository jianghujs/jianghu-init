'use strict';

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = '.ai-rules/manifest.json';

const readManifest = cwd => {
  const filePath = path.join(cwd, MANIFEST_PATH);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return null;
  }
};

const normalizeRelativePath = filePath => String(filePath || '').replace(/\\/g, '/').replace(/^\.\//, '');

const isGeneratedPath = (filePath, knownRuleIds, knownSkillIds) => {
  const relativePath = normalizeRelativePath(filePath);
  if ([
    'AGENTS.md',
    'CLAUDE.md',
    '.ai-rules/index.md',
    '.cursor/rules/ai-rules-index.mdc',
  ].includes(relativePath)) return true;

  for (const ruleId of knownRuleIds) {
    if (relativePath.startsWith(`.ai-rules/${ruleId}/`)) return true;
    if (relativePath === `.cursor/rules/${ruleId}.mdc`) return true;
    if (relativePath === `.claude/rules/${ruleId}.md`) return true;
    if (relativePath === `.kiro/steering/${ruleId}.md`) return true;
  }
  for (const skillId of knownSkillIds) {
    if (relativePath.startsWith(`.ai-rules/skills/${skillId}/`)) return true;
    if (relativePath.startsWith(`.agents/skills/${skillId}/`)) return true;
    if (relativePath.startsWith(`.claude/skills/${skillId}/`)) return true;
    if (relativePath === `.cursor/rules/${skillId}.mdc`) return true;
    if (relativePath === `.kiro/steering/${skillId}.md`) return true;
  }
  return false;
};

const removeEmptyParents = (cwd, startDir) => {
  const root = path.resolve(cwd);
  let current = path.resolve(startDir);
  while (current.startsWith(root + path.sep) && current !== root) {
    if (!fs.existsSync(current) || fs.readdirSync(current).length) break;
    fs.rmdirSync(current);
    current = path.dirname(current);
  }
};

const removeGeneratedFile = (cwd, relativePath, knownRuleIds, knownSkillIds) => {
  if (!isGeneratedPath(relativePath, knownRuleIds, knownSkillIds)) return false;
  const filePath = path.resolve(cwd, normalizeRelativePath(relativePath));
  const root = path.resolve(cwd);
  if (!filePath.startsWith(root + path.sep) || !fs.existsSync(filePath)) return false;
  if (!fs.statSync(filePath).isFile()) return false;
  fs.unlinkSync(filePath);
  removeEmptyParents(cwd, path.dirname(filePath));
  return true;
};

const cleanupGeneratedFiles = ({ cwd, previousManifest, desiredFiles, knownRuleIds, knownSkillIds }) => {
  if (!previousManifest) return [];
  const previousFiles = Array.isArray(previousManifest.generatedFiles) ? previousManifest.generatedFiles : [];
  const desired = new Set((desiredFiles || []).map(normalizeRelativePath));
  const removed = [];
  for (const file of previousFiles) {
    const relativePath = normalizeRelativePath(file);
    if (desired.has(relativePath)) continue;
    if (removeGeneratedFile(cwd, relativePath, knownRuleIds, knownSkillIds)) removed.push(relativePath);
  }
  return removed;
};

module.exports = {
  MANIFEST_PATH,
  readManifest,
  cleanupGeneratedFiles,
};
