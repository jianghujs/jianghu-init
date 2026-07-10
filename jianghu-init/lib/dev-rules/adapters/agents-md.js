'use strict';

const codex = require('./codex');

const syncAgentsMd = options => codex.sync(options);

module.exports = {
  id: 'agents-md',
  label: 'AGENTS.md (alias of codex)',
  sync: syncAgentsMd,
};
