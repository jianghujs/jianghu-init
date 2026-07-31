'use strict';

const assert = require('assert');
const Module = require('module');
const content = require('../../../page-template-json/template/user-group-role/userGroupRole');
const { buildPage } = require('.');

const buildResult = buildPage(content);
assert.strictEqual(content.version, 'v7');
assert.strictEqual(buildResult.standardConfig.page.id, 'userGroupRole');
assert.strictEqual(buildResult.standardConfig.pageContent.length, 1);
assert.strictEqual(buildResult.diagnostics.length, 0);

const resourceActionIdSet = new Set(content.resourceList.map(item => item.actionId));
assert(resourceActionIdSet.has('selectTargetPermission'));
assert(resourceActionIdSet.has('updateTargetPermission'));
assert(content.common.doUiAction.startTargetPermission);
assert(content.common.doUiAction.saveTargetPermission);

const pageHtml = content.pageContent.children.join('');
assert(pageHtml.includes('v-treeview'));
assert(pageHtml.includes('selection-type="independent"'));
assert(pageHtml.includes('selectedPermissionNodeIdList'));

const originalLoad = Module._load;
Module._load = function mockEgg(request, parent, isMain) {
  if (request === 'egg') {
    return { Service: class Service {} };
  }
  return originalLoad.call(this, request, parent, isMain);
};
const UserGroupRoleService = require('../../../page-template-json/template/user-group-role/service/userGroupRole');
Module._load = originalLoad;

const service = Object.create(UserGroupRoleService.prototype);
assert.doesNotThrow(() => service.validatePermissionTarget({ user: 'U001', group: '*', role: '*' }));
assert.doesNotThrow(() => service.validatePermissionTarget({ user: '*', group: 'G001', role: 'R001' }));
assert.throws(
  () => service.validatePermissionTarget({ user: '*', group: '*', role: '*' }),
  /授权对象类型不支持/
);
assert.deepStrictEqual(
  service.expandRuleValueList([ { page: 'home,task' }, { page: '*' } ], 'page', [ 'home', 'task', 'report' ]),
  [ 'home', 'task', 'report' ]
);
assert.deepStrictEqual(
  service.packRuleValueList([ 'home', 'task', 'report' ], 10),
  [ 'home,task', 'report' ]
);

console.log('userGroupRole V7 permission tree tests passed');
