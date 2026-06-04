'use strict';

const cursor = require('./cursor');
const claude = require('./claude');
const kiro = require('./kiro');
const agentsMd = require('./agents-md');

const ADAPTERS = [cursor, claude, kiro, agentsMd];

const getAdapter = id => ADAPTERS.find(a => a.id === id);

const listAdapters = () => ADAPTERS.map(a => ({ id: a.id, label: a.label }));

const syncTargets = ({ cwd, targets, modules, moduleDefs, sourceDir, manifest, force }) => {
  const results = {};
  for (const target of targets) {
    const adapter = getAdapter(target);
    if (!adapter) {
      results[target] = { error: `Unknown target: ${target}` };
      continue;
    }
    results[target] = adapter.sync({
      cwd,
      modules,
      moduleDefs,
      sourceDir,
      manifest,
      force,
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
