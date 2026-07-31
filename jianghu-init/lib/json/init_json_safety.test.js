'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const InitJson = require('./init_json');

const run = async () => {
  const originalCwd = process.cwd();
  const appDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jianghu-init-json-safety-'));
  process.chdir(appDir);

  try {
    const command = new InitJson();
    command.argv = { force: false };
    command.getV7CustomContent = () => 'module.exports = { version: \'v7\' };\n';

    const first = await command.buildJson({
      pageId: 'safePage',
      pageName: 'Safe Page',
      pageType: 'jh-page',
      filename: 'safePage',
    });
    assert.strictEqual(first, true);

    const outputFile = path.join(appDir, 'app/view/init-json/page/safePage.js');
    fs.writeFileSync(outputFile, 'project-owned source\n', 'utf8');
    const blockedOverwrite = await command.buildJson({
      pageId: 'safePage',
      pageName: 'Safe Page',
      pageType: 'jh-page',
      filename: 'safePage',
    });
    assert.strictEqual(blockedOverwrite, false);
    assert.strictEqual(fs.readFileSync(outputFile, 'utf8'), 'project-owned source\n');

    const blockedTraversal = await command.buildJson({
      pageId: '../../outside',
      pageName: 'Outside',
      pageType: 'jh-page',
      filename: '../../outside',
    });
    assert.strictEqual(blockedTraversal, false);
    assert(!fs.existsSync(path.join(appDir, 'outside.js')));

    command.argv.force = true;
    const forcedOverwrite = await command.buildJson({
      pageId: 'safePage',
      pageName: 'Safe Page',
      pageType: 'jh-page',
      filename: 'safePage',
    });
    assert.strictEqual(forcedOverwrite, true);
    assert(fs.readFileSync(outputFile, 'utf8').includes("version: 'v7'"));
  } finally {
    process.chdir(originalCwd);
  }
};

run()
  .then(() => console.log('init-json output safety tests passed'))
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
