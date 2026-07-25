'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const InitComponent = require('../init_component');

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jh-component-targets-'));
const previousCwd = process.cwd();

const semantic = {
  version: 'v7',
  pageType: 'jh-component',
  component: {
    path: 'example/DualTargetCard',
    name: '双端组件',
    targets: 'both',
  },
  includeList: [
    { type: 'css', path: '/pc-only.css', targets: 'pc' },
    { type: 'css', path: '/mobile-only.css', targets: 'mobile' },
  ],
  pageContent: {
    component: 'Box',
    children: ['shared-content'],
  },
  common: {
    props: {},
    data: {},
    methods: {},
    doUiAction: {},
  },
};

(async () => {
  try {
    fs.mkdirSync(path.join(tempDir, 'app/view/component'), { recursive: true });
    process.chdir(tempDir);

    const initComponent = new InitComponent();
    await initComponent.renderVue(semantic);

    const pcPath = path.join(
      tempDir,
      'app/view/component/example/DualTargetCard.html',
    );
    const mobilePath = path.join(
      tempDir,
      'app/view/component/mobile/example/DualTargetCard.html',
    );

    assert(fs.existsSync(pcPath), 'PC component output missing');
    assert(fs.existsSync(mobilePath), 'mobile component output missing');

    const pcHtml = fs.readFileSync(pcPath, 'utf8');
    const mobileHtml = fs.readFileSync(mobilePath, 'utf8');
    assert(pcHtml.includes('shared-content'), 'PC component content mismatch');
    assert(mobileHtml.includes('shared-content'), 'mobile component content mismatch');
    assert(pcHtml.includes('/pc-only.css'), 'PC include missing');
    assert(!pcHtml.includes('/mobile-only.css'), 'PC output contains mobile include');
    assert(mobileHtml.includes('/mobile-only.css'), 'mobile include missing');
    assert(!mobileHtml.includes('/pc-only.css'), 'mobile output contains PC include');

    console.log('v7 component targets render test passed');
  } finally {
    process.chdir(previousCwd);
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
