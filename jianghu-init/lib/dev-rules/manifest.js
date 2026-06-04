'use strict';

const path = require('path');
const fs = require('fs');
const { readJson, writeJson } = require('./util');

const AI_RULES_DIR = '.jianghu/ai-rules';
const MANIFEST_FILE = 'manifest.json';

const getAiRulesDir = cwd => path.join(cwd, AI_RULES_DIR);
const getManifestPath = cwd => path.join(getAiRulesDir(cwd), MANIFEST_FILE);
const getSourceDir = cwd => path.join(getAiRulesDir(cwd), 'source');
const getDocsDir = cwd => path.join(getAiRulesDir(cwd), 'docs');

const loadManifest = cwd => {
  const manifestPath = getManifestPath(cwd);
  if (!fs.existsSync(manifestPath)) return null;
  return readJson(manifestPath);
};

const saveManifest = (cwd, manifest) => {
  writeJson(getManifestPath(cwd), manifest);
};

const buildDefaultManifest = ({ profile, targets, modules, jianghuInitVersion }) => ({
  schemaVersion: 1,
  jianghuInitVersion,
  profile,
  targets,
  modules,
  lastSyncAt: new Date().toISOString(),
});

module.exports = {
  AI_RULES_DIR,
  getAiRulesDir,
  getManifestPath,
  getSourceDir,
  getDocsDir,
  loadManifest,
  saveManifest,
  buildDefaultManifest,
};
