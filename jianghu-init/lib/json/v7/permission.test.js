'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const templatePath = path.resolve(__dirname, '../../../page-template-json/utility/jianghuJs/jhPermissionV4.html');
const template = fs.readFileSync(templatePath, 'utf8');
const scriptMatch = template.match(/<script[^>]*>([\s\S]*?)<\/script>/);
assert(scriptMatch, 'jhPermissionV4 script should exist');

for (const templateName of [
  'jhTemplateV4.html',
  'jhTemplateV6.html',
  'jhMobileTemplateV4.html',
  'jhMobileTemplateV6.html',
]) {
  const commonTemplate = fs.readFileSync(
    path.resolve(__dirname, `../../../page-template-json/common/template/${templateName}`),
    'utf8',
  );
  assert(commonTemplate.includes("{% include 'utility/jianghuJs/jhPermissionV4.html' %}"), `${templateName} should include jhPermissionV4`);
}

let directiveDefinition;
const window = {
  appInfo: { pageId: 'taskManagement' },
  userInfo: {
    allowResourceList: [
      { resourceId: 'taskManagement.publishItem' },
      'otherPage.viewItem',
    ],
  },
  Vue: {
    directive(name, definition) {
      assert.strictEqual(name, 'permission');
      directiveDefinition = definition;
    },
  },
};

vm.runInNewContext(scriptMatch[1], { window, Set, Object });

const util = window.jhPermissionUtil;
assert(util, 'jhPermissionUtil should be installed');
assert.strictEqual(util.normalizeResourceId('publishItem'), 'taskManagement.publishItem');
assert.strictEqual(util.normalizeResourceId('otherPage.viewItem'), 'otherPage.viewItem');
assert.strictEqual(util.normalizeResourceId('  '), '');
assert.strictEqual(util.normalizeResourceId(null), '');
assert.strictEqual(util.hasPermission('publishItem'), true);
assert.strictEqual(util.hasPermission('otherPage.viewItem'), true);
assert.strictEqual(util.hasPermission('deleteItem'), false);

const actionWhenPath = path.resolve(__dirname, '../../../page-template-json/component/v6/jhActionWhenV6.html');
const actionWhenTemplate = fs.readFileSync(actionWhenPath, 'utf8');
const actionWhenScript = actionWhenTemplate.match(/<script[^>]*>([\s\S]*?)<\/script>/);
assert(actionWhenScript, 'jhActionWhenV6 script should exist');
vm.runInNewContext(actionWhenScript[1], { window, Object });
const hasActionPermission = window.jhActionWhenMixin.methods.hasActionPermission;
const actionContext = { _findPageVm: () => ({ pageId: 'taskManagement' }) };
assert.strictEqual(hasActionPermission.call(actionContext, { uiAction: 'publish' }), true);
assert.strictEqual(hasActionPermission.call(actionContext, { permission: 'publishItem' }), true);
assert.strictEqual(hasActionPermission.call(actionContext, { permission: '' }), false);
assert.strictEqual(hasActionPermission.call(actionContext, { permission: [] }), false);

const attributes = {};
const el = {
  style: { display: 'inline-block' },
  setAttribute(name, value) { attributes[name] = value; },
  removeAttribute(name) { delete attributes[name]; },
};
util.applyElementPermission(el, 'deleteItem');
assert.strictEqual(el.style.display, 'none');
assert.strictEqual(attributes['aria-hidden'], 'true');
window.userInfo.allowResourceList.push({ resourceId: 'taskManagement.deleteItem' });
util.applyElementPermission(el, 'deleteItem');
assert.strictEqual(el.style.display, 'inline-block');
assert.strictEqual(attributes['aria-hidden'], undefined);

assert(directiveDefinition, 'v-permission should be registered');
for (const hook of ['bind', 'inserted', 'update', 'componentUpdated']) {
  assert.strictEqual(typeof directiveDefinition[hook], 'function', `${hook} hook should exist`);
}

window.userInfo = null;
assert.strictEqual(util.hasPermission('publishItem'), false);
directiveDefinition.update(el, { value: 'publishItem' });
assert.strictEqual(el.style.display, 'none');

console.log('permission runtime tests passed');
