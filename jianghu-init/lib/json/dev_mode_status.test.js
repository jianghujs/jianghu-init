'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const lockfile = require('proper-lockfile');
const InitByJson = require('../init_by_json');

const run = async () => {
  const appDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-json-dev-status-'));
  const markerFile = path.join(appDir, 'jianghu-init.dev.lock');
  fs.writeFileSync(markerFile, '', 'utf8');

  const command = new InitByJson();
  assert.strictEqual(await command.isDevModeActive(appDir), false);

  const release = await lockfile.lock(markerFile);
  assert.strictEqual(await command.isDevModeActive(appDir), true);

  await release();
  assert.strictEqual(await command.isDevModeActive(appDir), false);
};

run()
  .then(() => console.log('json dev status tests passed'))
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
