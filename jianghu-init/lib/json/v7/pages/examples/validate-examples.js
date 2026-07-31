'use strict';

/**
 * 校验 pages/examples 下 sample / example 能否通过 v7.buildPage
 * 用法（jianghu-init 根）：node lib/json/v7/pages/examples/validate-examples.js
 */

const path = require('path');
const fs = require('fs');
const v7 = require('../../index');
const {
  analyzeStaticContracts,
  validateV7Config,
} = require('../../../validate_init_json');

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

const validateCanonicalDataSource = semantic => {
  const dataSource = semantic && semantic.dataSource;
  if (!dataSource || typeof dataSource !== 'object') return;
  const legacyKeys = [
    'resource',
    'actions',
    'listActionId',
    'createActionId',
    'updateActionId',
    'deleteActionId',
  ].filter(key => Object.prototype.hasOwnProperty.call(dataSource, key));
  if (legacyKeys.length) {
    throw new Error(`dataSource 使用旧 key：${legacyKeys.join(', ')}；正式示例只允许扁平 *Resource`);
  }
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

  try {
    const { validateActionUiActionSyntax } = require('../../actionIntent');
    validateActionUiActionSyntax(semantic);
    validateCanonicalDataSource(semantic);
    const resolvedType = semantic.pageType === 'jh-component' ? 'component' : 'page';
    const structural = validateV7Config(semantic, resolvedType);
    const contracts = analyzeStaticContracts({
      cwd: path.resolve(dir, '../../../../..'),
      config: semantic,
      generatedUiActions: structural.generatedUiActions,
    });
    if (contracts.errors.length) {
      throw new Error(contracts.errors.map(item => `${item.code}: ${item.message}`).join('; '));
    }
  } catch (e) {
    console.error(`[FAIL] ${file} canonical syntax: ${e.message}`);
    failed += 1;
    continue;
  }

  const targets = platformsFor(semantic);
  for (const targetPlatform of targets) {
    try {
      const { standardConfig, diagnostics } = v7.buildPage(Object.assign({}, semantic, { targetPlatform }));
      if (!standardConfig || !standardConfig.pageContent) {
        throw new Error('standardConfig.pageContent missing');
      }
      const deprecatedDiagnostics = (diagnostics || []).filter(item => item.code === 'V7_DEPRECATED_KEY');
      if (deprecatedDiagnostics.length) {
        const paths = deprecatedDiagnostics.map(item => item.path).join(', ');
        throw new Error(`正式示例包含旧写法：${paths}`);
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
