'use strict';

const cursor = require('./cursor');
const claude = require('./claude');
const kiro = require('./kiro');
const codex = require('./codex');
const agentsMd = require('./agents-md');

const ADAPTERS = [codex, cursor, claude, kiro, agentsMd];

const getAdapter = id => ADAPTERS.find(a => a.id === id);

const listAdapters = () => ADAPTERS.map(a => ({ id: a.id, label: a.label }));

const syncTargets = ({ cwd, targets, ruleIds, templateRoot, manifest, force, managedFiles }) => {
  const results = {};
  for (const target of targets) {
    const adapter = getAdapter(target);
    if (!adapter) {
      throw new Error(`Unknown target: ${target}`);
    }
    results[target] = adapter.sync({
      cwd,
      ruleIds,
      templateRoot,
      manifest,
      force,
      managedFiles,
    });
  }
  return results;
};

module.exports = {
  ADAPTERS,
  getAdapter,
  listAdapters,
  syncTargets,
};
