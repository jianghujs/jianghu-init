'use strict';

/**
 * 校验 pages/examples 下 sample / example 能否通过 v7.buildPage
 * 用法（jianghu-init 根）：node lib/json/v7/pages/examples/validate-examples.js
 */

const path = require('path');
const fs = require('fs');
const v7 = require('../../index');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(name =>
  (name.endsWith('.sample.js') || name.endsWith('.example.js'))
  && name !== 'validate-examples.js',
);

const { resolveV7BuildTargets } = require('../../../mixin/handle_json_config_v7');

const platformsFor = semantic => {
  const t = resolveV7BuildTargets(semantic);
  if (t === 'both') return ['pc', 'mobile'];
  return [t];
};

let failed = 0;

for (const file of files) {
  const id = path.basename(file, path.extname(file));
  let semantic;
  try {
    semantic = require(path.join(dir, file));
  } catch (e) {
    console.error(`[FAIL] ${file} require: ${e.message}`);
    failed += 1;
    continue;
  }

  if (!semantic || semantic.version !== 'v7') {
    console.error(`[FAIL] ${file} missing version: 'v7'`);
    failed += 1;
    continue;
  }

  const targets = platformsFor(semantic);
  for (const targetPlatform of targets) {
    try {
      const { standardConfig } = v7.buildPage(Object.assign({}, semantic, { targetPlatform }));
      if (!standardConfig || !standardConfig.pageContent) {
        throw new Error('standardConfig.pageContent missing');
      }
      console.log(`[OK] ${file} → ${targetPlatform} (${standardConfig.v7Meta && standardConfig.v7Meta.mode})`);
    } catch (e) {
      console.error(`[FAIL] ${file} @ ${targetPlatform}: ${e.message}`);
      failed += 1;
    }
  }
}

if (failed) {
  process.exitCode = 1;
  console.error(`\n${failed} failure(s)`);
} else {
  console.log(`\nAll ${files.length} example(s) passed.`);
}
