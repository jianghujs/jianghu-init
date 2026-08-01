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
assert(content.common.doUiAction.startPublicTargetPermission);
assert(content.common.doUiAction.startLoginTargetPermission);
assert(content.common.data.pageFeatures.user.enableCreate === true);
assert(content.common.data.pageFeatures.relation.enableDelete === true);
assert(content.common.computed.isRelationCreateEnabled !== undefined);
assert.strictEqual(content.common.dataExpression.isMobile, 'window.innerWidth < 500');
assert.strictEqual(content.common.dataExpression.showLeftMenu, 'window.innerWidth > 600');

const pageHtml = content.pageContent.children.join('');
const actionNodes = buildResult.standardConfig.actionContent || [];
const flattenActionHtml = (nodes) => (nodes || []).flatMap((node) => {
  if (typeof node === 'string') return [ node ];
  if (!node || typeof node !== 'object') return [];
  return flattenActionHtml(node.children);
});
const actionHtml = flattenActionHtml(actionNodes).join('\n');
const fullUiHtml = `${pageHtml}\n${actionHtml}`;

assert.strictEqual(actionNodes.length, 7);
assert(actionNodes.some(node => node.component === 'FormDrawer' && node.key === 'currentDataType'));
assert(actionNodes.some(node => node.component === 'Drawer' && node.key === 'permission'));
assert.strictEqual((pageHtml.match(/<jh-form-drawer/g) || []).length, 0);
assert.strictEqual((pageHtml.match(/<jh-drawer/g) || []).length, 0);
assert(fullUiHtml.includes('v-treeview'));
assert(fullUiHtml.includes('selection-type="independent"'));
assert.strictEqual((fullUiHtml.match(/<jh-form-drawer/g) || []).length, 0);
assert.strictEqual((fullUiHtml.match(/<jh-drawer/g) || []).length, 0);
assert(pageHtml.includes('marginLeft: \'270px\''));
assert(pageHtml.includes('startPublicTargetPermission'));
assert(pageHtml.includes('startLoginTargetPermission'));
assert(pageHtml.includes('isDataTypeCreateEnabled'));
assert(pageHtml.includes('isRelationDeleteEnabled'));
assert.strictEqual((pageHtml.match(/<v-dialog/g) || []).length, 0);
assert.strictEqual((pageHtml.match(/<v-navigation-drawer/g) || []).length, 1);
const currentDataTypeDrawer = actionNodes.find(node => node.key === 'currentDataType');
const permissionDrawer = actionNodes.find(node => node.key === 'permission');
assert(currentDataTypeDrawer.component === 'FormDrawer');
assert(currentDataTypeDrawer.resolvedBindings[':field-list'] === 'currentDataTypeFormFieldList');
assert(currentDataTypeDrawer.resolvedBindings[':action-list'] === 'currentDataTypeDrawerActionList');
assert(currentDataTypeDrawer.resolvedBindings[':scope'] === '$data');
assert(currentDataTypeDrawer.resolvedBindings['@field-change'] === 'handleCurrentDataTypeFieldChange');
assert(permissionDrawer.resolvedBindings[':action-list'] === 'permissionDrawerActionList');
assert(fullUiHtml.includes('v-permission="\'selectTargetPermission\'"'));
assert(fullUiHtml.includes('v-permission="\'updateTargetPermission\'"'));
assert(content.common.computed.currentDataTypeDrawerActionList);
assert(content.common.computed.currentDataTypeFormFieldList);
assert(content.common.computed.relationCreateDrawerActionList);
assert(content.common.computed.permissionDrawerActionList);
assert(content.common.computed.canUpdateTargetPermission);
assert.strictEqual(content.common.data.isCurrentDataTypeDrawerShown, false);
assert.strictEqual(content.common.data.isCreateUserDrawerShown, false);
assert(content.common.methods.handleCurrentDataTypeFieldChange);

const currentDataTypeFormFieldList = content.common.computed.currentDataTypeFormFieldList.call({
  dataTypeFieldList: [
    { text: '用户状态', value: 'userStatus', type: 'select' },
    { text: '描述', value: 'description', type: 'textarea', require: false },
  ],
  constantObj: {
    userStatus: [{ value: 'active', text: '活跃' }],
  },
});
assert.deepStrictEqual(currentDataTypeFormFieldList, [
  {
    key: 'userStatus',
    label: '用户状态',
    type: 'select',
    required: true,
    options: [{ value: 'active', text: '活跃' }],
  },
  {
    key: 'description',
    label: '描述',
    type: 'textarea',
    required: false,
    options: undefined,
  },
]);

const currentDataTypeItem = {};
content.common.methods.handleCurrentDataTypeFieldChange.call({
  currentDataTypeItem,
  $set(target, key, value) {
    target[key] = value;
  },
}, { key: 'groupName', value: '研发组' });
assert.strictEqual(currentDataTypeItem.groupName, '研发组');

const inheritedNodeId = 'resource:userGroupRole.updateTargetPermission';
const permissionSelectionState = {
  canUpdateTargetPermission: true,
  selectedPermissionNodeIdList: [],
  inheritedPermissionNodeIdList: [ inheritedNodeId ],
  permissionTree: [],
  normalizeWildcardPermissionNodeIdList: content.common.methods.normalizeWildcardPermissionNodeIdList,
  applyPermissionTreeState: content.common.methods.applyPermissionTreeState,
  syncPermissionSelectionState: content.common.methods.syncPermissionSelectionState,
};
content.common.methods.handlePermissionSelectionChange.call(permissionSelectionState, [ inheritedNodeId ]);
assert.deepStrictEqual(
  permissionSelectionState.selectedPermissionNodeIdList,
  [ inheritedNodeId ],
  'inherited permission must be allowed as a direct permission'
);

const pageNodeId = 'page:userGroupRole';
const selectNodeId = 'resource:userGroupRole.selectTargetPermission';
const wildcardNodeId = 'resource:userGroupRole.*';
const permissionCascadeState = {
  canUpdateTargetPermission: true,
  selectedPermissionNodeIdList: [],
  getPageConcretePermissionNodeIdList: content.common.methods.getPageConcretePermissionNodeIdList,
  getPageAllPermissionNodeIdList: content.common.methods.getPageAllPermissionNodeIdList,
  normalizeWildcardPermissionNodeIdList: content.common.methods.normalizeWildcardPermissionNodeIdList,
  applyPermissionTreeState: content.common.methods.applyPermissionTreeState,
  syncPermissionSelectionState: content.common.methods.syncPermissionSelectionState,
  permissionTree: [
    {
      id: pageNodeId,
      children: [
        { id: selectNodeId },
        { id: inheritedNodeId },
        { id: wildcardNodeId, isWildcard: true },
      ],
    },
  ],
};
content.common.methods.handlePermissionSelectionChange.call(permissionCascadeState, [ pageNodeId ]);
assert.deepStrictEqual(
  permissionCascadeState.selectedPermissionNodeIdList,
  [ pageNodeId, selectNodeId, inheritedNodeId ],
  'selecting a page must select current resources but not wildcard permission'
);
content.common.methods.handlePermissionSelectionChange.call(
  permissionCascadeState,
  [ selectNodeId, inheritedNodeId ]
);
assert.deepStrictEqual(
  permissionCascadeState.selectedPermissionNodeIdList,
  [],
  'unselecting a page must unselect current and wildcard resources under the page'
);
content.common.methods.handlePermissionSelectionChange.call(permissionCascadeState, [ selectNodeId ]);
assert.deepStrictEqual(
  permissionCascadeState.selectedPermissionNodeIdList,
  [ selectNodeId, pageNodeId ],
  'selecting a child action must mark page checked without cascading other actions'
);
assert.strictEqual(
  permissionCascadeState.selectedPermissionNodeIdList.includes(inheritedNodeId),
  false,
  'auto page check from child must not select sibling actions'
);
const wildcardNextTickQueue = [];
permissionCascadeState.$nextTick = (cb) => { wildcardNextTickQueue.push(cb); };
content.common.methods.handlePermissionSelectionChange.call(
  permissionCascadeState,
  [ pageNodeId, selectNodeId, wildcardNodeId ]
);
assert.deepStrictEqual(
  permissionCascadeState.selectedPermissionNodeIdList,
  [ pageNodeId, wildcardNodeId ],
  'wildcard permission must remain independently selectable and keep page checked'
);
// 模拟 treeview 在禁用具体 action 时回放旧选中态（只剩 page）
content.common.methods.handlePermissionSelectionChange.call(
  permissionCascadeState,
  [ pageNodeId ]
);
assert.deepStrictEqual(
  permissionCascadeState.selectedPermissionNodeIdList,
  [ pageNodeId, wildcardNodeId ],
  'spurious treeview input while syncing must not clear newly selected wildcard'
);
while (wildcardNextTickQueue.length) {
  wildcardNextTickQueue.shift()();
}
assert.deepStrictEqual(
  permissionCascadeState.selectedPermissionNodeIdList,
  [ pageNodeId, wildcardNodeId ],
  'wildcard must stay selected after deferred disabled sync'
);
assert.strictEqual(permissionCascadeState._permissionSelectionSyncing, false);
assert.strictEqual(permissionCascadeState.permissionTree[0].children[0].disabled, true);
assert.strictEqual(permissionCascadeState.permissionTree[0].children[1].disabled, true);
assert.strictEqual(permissionCascadeState.permissionTree[0].children[2].disabled, false);
delete permissionCascadeState.$nextTick;
content.common.methods.handlePermissionSelectionChange.call(permissionCascadeState, []);
assert.strictEqual(permissionCascadeState.permissionTree[0].children[0].disabled, false);
assert.strictEqual(permissionCascadeState.permissionTree[0].children[1].disabled, false);
assert.strictEqual(permissionCascadeState.permissionTree[0].children[2].disabled, false);
content.common.methods.handlePermissionSelectionChange.call(
  permissionCascadeState,
  [ pageNodeId, selectNodeId ]
);
assert.deepStrictEqual(
  permissionCascadeState.selectedPermissionNodeIdList,
  [ pageNodeId, selectNodeId, inheritedNodeId ],
  'explicit page check must cascade even when some children already selected'
);
assert.strictEqual(
  content.common.methods.isDirectPermissionSelected.call(permissionSelectionState, inheritedNodeId),
  true
);
assert.deepStrictEqual(
  content.common.computed.effectivePermissionNodeIdList.call({
    selectedPermissionNodeIdList: [ inheritedNodeId ],
    inheritedPermissionNodeIdList: [ inheritedNodeId, 'page:userGroupRole' ],
  }),
  [ inheritedNodeId, 'page:userGroupRole' ]
);

const inheritedPermissionTreeState = {
  canUpdateTargetPermission: true,
  selectedPermissionNodeIdList: [],
  inheritedPermissionNodeIdList: [ inheritedNodeId ],
  permissionTree: [
    {
      id: 'page:userGroupRole',
      children: [{ id: inheritedNodeId }],
    },
  ],
};
content.common.methods.applyPermissionTreeState.call(inheritedPermissionTreeState);
assert.strictEqual(inheritedPermissionTreeState.permissionTree[0].children[0].disabled, false);
const inheritedWildcardTreeState = {
  canUpdateTargetPermission: true,
  selectedPermissionNodeIdList: [],
  inheritedPermissionNodeIdList: [ wildcardNodeId ],
  permissionTree: [
    {
      id: pageNodeId,
      children: [
        { id: selectNodeId },
        { id: wildcardNodeId, isWildcard: true },
      ],
    },
  ],
};
content.common.methods.applyPermissionTreeState.call(inheritedWildcardTreeState);
assert.strictEqual(
  inheritedWildcardTreeState.permissionTree[0].children[0].disabled,
  false,
  'inherited wildcard must not block staging direct resource permissions'
);
assert.deepStrictEqual(
  content.common.methods.getSelectablePermissionNodeIdList.call({
    getAllPermissionNodeIdList: () => [ 'page:userGroupRole', inheritedNodeId, wildcardNodeId ],
    isWildcardPermissionNodeId: content.common.methods.isWildcardPermissionNodeId,
  }),
  [ 'page:userGroupRole', inheritedNodeId ]
);

const userPermissionTargetState = {};
content.common.methods.preparePermissionTarget.call(userPermissionTargetState, {
  targetType: 'user',
  item: { userId: 'U001', username: '管理员' },
});
assert.deepStrictEqual(userPermissionTargetState.permissionTarget, {
  user: 'U001',
  group: 'login',
  role: '*',
});
assert.strictEqual(userPermissionTargetState.permissionTargetType, 'user');
const publicPermissionTargetState = {};
content.common.methods.preparePermissionTarget.call(publicPermissionTargetState, {
  targetType: 'public',
});
assert.strictEqual(publicPermissionTargetState.permissionTargetType, 'public');
const loginPermissionTargetState = {};
content.common.methods.preparePermissionTarget.call(loginPermissionTargetState, {
  targetType: 'login',
});
assert.strictEqual(loginPermissionTargetState.permissionTargetType, 'login');
assert.strictEqual(
  content.common.computed.permissionTargetTypeLabel.call({ permissionTargetType: 'public' }),
  '公开'
);
assert.strictEqual(
  content.common.computed.permissionTargetTypeLabel.call({ permissionTargetType: 'groupRole' }),
  '组内角色'
);
const rolePermissionTargetState = {};
content.common.methods.preparePermissionTarget.call(rolePermissionTargetState, {
  targetType: 'role',
  item: { roleId: 'R001', roleName: '管理员角色' },
});
assert.deepStrictEqual(rolePermissionTargetState.permissionTarget, {
  user: '*',
  group: 'login',
  role: 'R001',
});
const groupRolePermissionTargetState = {};
content.common.methods.preparePermissionTarget.call(groupRolePermissionTargetState, {
  targetType: 'groupRole',
  item: { groupId: 'G001', roleId: 'R001' },
});
assert.deepStrictEqual(groupRolePermissionTargetState.permissionTarget, {
  user: '*',
  group: 'G001',
  role: 'R001',
});

const drawerActionListList = [
  content.common.computed.relationCreateDrawerActionList.call({}),
  content.common.computed.relationUpdateDrawerActionList.call({}),
  content.common.computed.permissionDrawerActionList.call({ isPermissionSaving: false }),
  content.common.computed.createUserDrawerActionList.call({}),
  content.common.computed.createGroupDrawerActionList.call({}),
  content.common.computed.createRoleDrawerActionList.call({}),
];
for (const dataType of [ 0, 1, 2 ]) {
  const permissionSuffix = [ 'User', 'Group', 'Role' ][dataType];
  drawerActionListList.push(content.common.computed.currentDataTypeDrawerActionList.call({
    dataType,
    isDataTypeEditEnabled: true,
    currentDataTypeUpdatePermission: `update${permissionSuffix}`,
    currentDataTypeDeletePermission: `delete${permissionSuffix}`,
  }));
}
drawerActionListList.flat().forEach(action => {
  assert(resourceActionIdSet.has(action.permission), `drawer permission ${action.permission} must exist in resourceList`);
});

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
assert.doesNotThrow(() => service.validatePermissionTarget({ user: 'U001', group: 'login', role: '*' }));
assert.doesNotThrow(() => service.validatePermissionTarget({ user: '*', group: 'G001', role: '*' }));
assert.doesNotThrow(() => service.validatePermissionTarget({ user: '*', group: 'login', role: 'R001' }));
assert.doesNotThrow(() => service.validatePermissionTarget({ user: '*', group: 'G001', role: 'R001' }));
assert.doesNotThrow(() => service.validatePermissionTarget({ user: '*', group: 'public', role: '*' }));
assert.doesNotThrow(() => service.validatePermissionTarget({ user: '*', group: 'login', role: '*' }));
assert.throws(
  () => service.validatePermissionTarget({ user: 'U001', group: '*', role: '*' }),
  /授权对象类型不支持/
);
assert.throws(
  () => service.validatePermissionTarget({ user: '*', group: '*', role: 'R001' }),
  /授权对象类型不支持/
);
assert.throws(
  () => service.validatePermissionTarget({ user: '*', group: '*', role: '*' }),
  /授权对象类型不支持/
);
assert.deepStrictEqual(
  service.getTargetMembershipWhere({ user: '*', group: 'login', role: 'R001' }),
  { roleId: 'R001' }
);
assert.deepStrictEqual(
  service.getTargetMembershipWhere({ user: '*', group: 'G001', role: '*' }),
  { groupId: 'G001' }
);
assert.deepStrictEqual(
  service.getTargetMembershipWhere({ user: '*', group: 'G001', role: 'R001' }),
  { groupId: 'G001', roleId: 'R001' }
);
assert.deepStrictEqual(
  service.getCompatiblePermissionTargetList({ user: 'U001', group: 'login', role: '*' }),
  [
    { user: 'U001', group: 'login', role: '*' },
    { user: 'U001', group: '*', role: '*' },
  ]
);
assert.deepStrictEqual(
  service.getCompatiblePermissionTargetList({ user: '*', group: 'login', role: 'R001' }),
  [
    { user: '*', group: 'login', role: 'R001' },
    { user: '*', group: '*', role: 'R001' },
  ]
);
assert.deepStrictEqual(
  service.getCompatiblePermissionTargetList({ user: '*', group: 'G001', role: 'R001' }),
  [
    { user: '*', group: 'G001', role: 'R001' },
  ]
);
assert.deepStrictEqual(
  service.unpackRuleValueList([
    { resource: 'userGroupRole.selectTargetPermission,userGroupRole.*' },
  ], 'resource'),
  [ 'userGroupRole.selectTargetPermission', 'userGroupRole.*' ]
);
assert.strictEqual(
  service.isPageResourceWildcard('userGroupRole.*', new Set([ 'userGroupRole' ])),
  true
);
assert.strictEqual(
  service.isPageResourceWildcard('unknownPage.*', new Set([ 'userGroupRole' ])),
  false
);
assert.deepStrictEqual(
  service.normalizeResourcePermissionList([
    'userGroupRole.selectTargetPermission',
    'userGroupRole.*',
    'userGroupRole.updateTargetPermission',
    'otherPage.selectItem',
  ]),
  [ 'userGroupRole.*', 'otherPage.selectItem' ]
);
assert.deepStrictEqual(
  service.expandRuleValueList([ { page: 'home,task' }, { page: '*' } ], 'page', [ 'home', 'task', 'report' ]),
  [ 'home', 'task', 'report' ]
);
assert.deepStrictEqual(
  service.packRuleValueList([ 'home', 'task', 'report' ], 10),
  [ 'home,task', 'report' ]
);

const inheritedSourceMap = {};
service.mergeInheritedSource(inheritedSourceMap, 'page:home', 'public');
service.mergeInheritedSource(inheritedSourceMap, 'page:home', 'login');
assert.strictEqual(inheritedSourceMap['page:home'], 'public,login');

console.log('userGroupRole V7 permission tree tests passed');
