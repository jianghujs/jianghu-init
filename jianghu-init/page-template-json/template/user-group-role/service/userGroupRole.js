'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
// ========================================常用 require end=============================================
const _ = require('lodash');

const TARGET_KEYS = [ 'user', 'group', 'role' ];
const PUBLIC_TARGET = { user: '*', group: 'public', role: '*' };
const LOGIN_TARGET = { user: '*', group: 'login', role: '*' };
const REQUIRED_PERMISSION_MAP = {
  public: {
    pageIdList: [ 'login' ],
    resourceIdList: [ 'login.*' ],
  },
  login: {
    pageIdList: [ 'help' ],
    resourceIdList: [ 'help.*' ],
  },
};

class userGroupRoleService extends Service {

  async deleteUserGroupRole() {
    const { jianghuKnex } = this.app;
    const { where } = this.ctx.request.body.appData;
    await jianghuKnex('_user_group_role', this.ctx).where(where).jhDelete();
    return {};
  }

  async selectTargetPermission() {
    const { jianghuKnex } = this.app;
    const { target } = this.ctx.request.body.appData.actionData;
    this.validatePermissionTarget(target);
    const compatibleTargetList = this.getCompatiblePermissionTargetList(target);
    const selectRuleList = async (table, field, allowOrDeny) => _.flatten(await Promise.all(
      compatibleTargetList.map(compatibleTarget => jianghuKnex(table)
        .where({ ...compatibleTarget, allowOrDeny })
        .select(field))
    ));

    const [
      pageList,
      resourceList,
      pageRuleList,
      resourceRuleList,
      pageDenyRuleList,
      resourceDenyRuleList,
    ] = await Promise.all([
      jianghuKnex('_page').select('pageId', 'pageName', 'pageType', 'sort'),
      jianghuKnex('_resource').select('pageId', 'actionId', 'desc', 'resourceType'),
      selectRuleList('_user_group_role_page', 'page', 'allow'),
      selectRuleList('_user_group_role_resource', 'resource', 'allow'),
      selectRuleList('_user_group_role_page', 'page', 'deny'),
      selectRuleList('_user_group_role_resource', 'resource', 'deny'),
    ]);

    const pageIdSet = new Set(pageList.map(item => item.pageId));
    const requiredPermission = this.getRequiredPermission(target);
    this.validateRequiredPermission(requiredPermission, pageIdSet);
    const resourceListByPageId = _.groupBy(
      resourceList.filter(item => pageIdSet.has(item.pageId)),
      'pageId'
    );
    const permissionTree = _.sortBy(pageList, [
      item => Number(item.sort) || Number.MAX_SAFE_INTEGER,
      'pageId',
    ]).map(page => {
      const children = [
        {
          id: `resource:${page.pageId}.*`,
          type: 'resourceWildcard',
          name: '全部操作（含未来新增）',
          code: `${page.pageId}.*`,
          resourceType: 'wildcard',
          isWildcard: true,
        },
        ..._.sortBy(resourceListByPageId[page.pageId] || [], 'actionId').map(resource => ({
          id: `resource:${resource.pageId}.${resource.actionId}`,
          type: 'resource',
          name: resource.desc || resource.actionId,
          code: resource.actionId,
          resourceType: resource.resourceType,
        })),
      ];
      return {
        id: `page:${page.pageId}`,
        type: 'page',
        name: page.pageName || page.pageId,
        code: page.pageId,
        pageType: page.pageType,
        children,
      };
    });

    const allPageIdList = pageList.map(item => item.pageId);
    const visibleResourceIdSet = new Set(
      resourceList
        .filter(item => pageIdSet.has(item.pageId))
        .map(item => `${item.pageId}.${item.actionId}`)
    );
    const directPageRuleValueList = this.unpackRuleValueList(pageRuleList, 'page');
    const directResourceRuleValueList = this.unpackRuleValueList(resourceRuleList, 'resource');
    const selectedPageIdList = _.uniq([
      ...this.expandRuleValueList(pageRuleList, 'page', allPageIdList),
      ...requiredPermission.pageIdList,
    ]);
    const selectedResourceIdList = this.normalizeResourcePermissionList([
      ...this.expandResourceRuleValueList(resourceRuleList, visibleResourceIdSet, pageIdSet),
      ...requiredPermission.resourceIdList,
    ]);
    const deniedPageIdList = this.expandRuleValueList(pageDenyRuleList, 'page', allPageIdList);
    const deniedResourceIdList = this.expandResourceRuleValueList(
      resourceDenyRuleList,
      visibleResourceIdSet,
      pageIdSet
    );
    const isVisibleResourceRule = resourceId => (
      visibleResourceIdSet.has(resourceId)
      || this.isPageResourceWildcard(resourceId, pageIdSet)
    );

    const inherited = await this.buildInheritedPermissionMeta({
      target,
      allPageIdList,
      pageIdSet,
      visibleResourceIdSet,
    });
    const groupRoleOptionList = this.isActualGroupTarget(target)
      ? await this.selectGroupRolePermissionOptionList(target.group)
      : [];

    return {
      permissionTree,
      selectedNodeIdList: [
        ...selectedPageIdList.map(pageId => `page:${pageId}`),
        ...selectedResourceIdList
          .filter(isVisibleResourceRule)
          .map(resourceId => `resource:${resourceId}`),
      ],
      deniedNodeIdList: [
        ...deniedPageIdList.map(pageId => `page:${pageId}`),
        ...deniedResourceIdList
          .filter(isVisibleResourceRule)
          .map(resourceId => `resource:${resourceId}`),
      ],
      inheritedNodeIdList: inherited.inheritedNodeIdList,
      inheritedPermissionSourceMap: inherited.inheritedPermissionSourceMap,
      requiredNodeIdList: [
        ...requiredPermission.pageIdList.map(pageId => `page:${pageId}`),
        ...requiredPermission.resourceIdList.map(resourceId => `resource:${resourceId}`),
      ],
      groupRoleOptionList,
      appWildcardPermission: {
        page: directPageRuleValueList.includes('*'),
        resource: directResourceRuleValueList.includes('*'),
        enabled: directPageRuleValueList.includes('*') && directResourceRuleValueList.includes('*'),
      },
    };
  }

  async updateTargetPermission() {
    const { jianghuKnex } = this.app;
    const {
      target,
      pageIdList = [],
      resourceIdList = [],
      appWildcardMode = 'unchanged',
    } = this.ctx.request.body.appData.actionData;
    this.validatePermissionTarget(target);
    if (![ 'unchanged', 'enabled', 'disabled' ].includes(appWildcardMode)) {
      throw new Error('全应用权限状态不支持');
    }
    const compatibleTargetList = this.getCompatiblePermissionTargetList(target);
    const selectRuleList = async (table, field, allowOrDeny) => _.flatten(await Promise.all(
      compatibleTargetList.map(compatibleTarget => jianghuKnex(table)
        .where({ ...compatibleTarget, allowOrDeny })
        .select(field))
    ));

    const submittedPageIdList = _.uniq(pageIdList.filter(item => typeof item === 'string' && item));
    const submittedResourceIdList = _.uniq(resourceIdList.filter(item => typeof item === 'string' && item));
    const [ pageList, resourceList, existingPageRuleList, existingResourceRuleList ] = await Promise.all([
      jianghuKnex('_page').select('pageId'),
      jianghuKnex('_resource').select('pageId', 'actionId'),
      selectRuleList('_user_group_role_page', 'page', 'allow'),
      selectRuleList('_user_group_role_resource', 'resource', 'allow'),
    ]);
    const validPageIdSet = new Set(pageList.map(item => item.pageId));
    const requiredPermission = this.getRequiredPermission(target);
    this.validateRequiredPermission(requiredPermission, validPageIdSet);
    const explicitPageIdList = _.uniq([
      ...submittedPageIdList,
      ...requiredPermission.pageIdList,
    ]);
    const explicitResourceIdList = this.normalizeResourcePermissionList([
      ...submittedResourceIdList,
      ...requiredPermission.resourceIdList,
    ]);
    const allResourceIdList = resourceList.map(item => `${item.pageId}.${item.actionId}`);
    const validResourceIdSet = new Set(allResourceIdList);
    const visibleResourceIdSet = new Set(
      resourceList
        .filter(item => validPageIdSet.has(item.pageId))
        .map(item => `${item.pageId}.${item.actionId}`)
    );
    // 未注册到 _page 的 resource 当前不会展示在树上，保存时必须保留其原授权。
    const hiddenExistingResourceIdList = this
      .unpackRuleValueList(existingResourceRuleList, 'resource')
      .filter(resourceId => (
        resourceId !== '*'
        && !visibleResourceIdSet.has(resourceId)
        && !this.isPageResourceWildcard(resourceId, validPageIdSet)
      ));
    const existingPageWildcard = this.unpackRuleValueList(existingPageRuleList, 'page').includes('*');
    const existingResourceWildcard = this.unpackRuleValueList(existingResourceRuleList, 'resource').includes('*');
    let normalizedPageIdList = explicitPageIdList;
    let normalizedResourceIdList = this.normalizeResourcePermissionList([
      ...explicitResourceIdList,
      ...hiddenExistingResourceIdList,
    ]);
    if (appWildcardMode === 'enabled') {
      normalizedPageIdList = [ '*' ];
      normalizedResourceIdList = [ '*' ];
    } else if (appWildcardMode === 'unchanged') {
      if (existingPageWildcard) {
        normalizedPageIdList = [ '*' ];
      }
      if (existingResourceWildcard) {
        normalizedResourceIdList = [ '*' ];
      }
    }
    const invalidPageIdList = submittedPageIdList.filter(pageId => !validPageIdSet.has(pageId));
    const invalidResourceIdList = submittedResourceIdList.filter(resourceId => (
      !validResourceIdSet.has(resourceId)
      && !this.isPageResourceWildcard(resourceId, validPageIdSet)
    ));
    if (invalidPageIdList.length || invalidResourceIdList.length) {
      throw new Error(`权限节点不存在: ${[ ...invalidPageIdList, ...invalidResourceIdList ].join(', ')}`);
    }

    const pageRuleList = this.packRuleValueList(normalizedPageIdList).map(page => ({
      ...target,
      page,
      allowOrDeny: 'allow',
      desc: '权限管理页配置',
    }));
    const resourceRuleList = this.packRuleValueList(normalizedResourceIdList).map(resource => ({
      ...target,
      resource,
      allowOrDeny: 'allow',
      desc: '权限管理页配置',
    }));

    await jianghuKnex.transaction(async trx => {
      for (const compatibleTarget of compatibleTargetList) {
        await trx('_user_group_role_page').where({ ...compatibleTarget, allowOrDeny: 'allow' }).jhDelete();
        await trx('_user_group_role_resource').where({ ...compatibleTarget, allowOrDeny: 'allow' }).jhDelete();
      }
      if (pageRuleList.length) {
        await trx('_user_group_role_page').jhInsert(pageRuleList);
      }
      if (resourceRuleList.length) {
        await trx('_user_group_role_resource').jhInsert(resourceRuleList);
      }
    });
    await this.clearTargetUserInfoCache(target);

    return {
      pagePermissionCount: normalizedPageIdList.length,
      resourcePermissionCount: normalizedResourceIdList.length,
    };
  }

  async buildInheritedPermissionMeta({
    target,
    allPageIdList,
    pageIdSet,
    visibleResourceIdSet,
  }) {
    const { jianghuKnex } = this.app;
    const inheritedPermissionSourceMap = {};
    const inheritedTargets = this.getInheritedPermissionTargetList(target);
    if (!inheritedTargets.length) {
      return { inheritedNodeIdList: [], inheritedPermissionSourceMap };
    }

    const ruleGroups = await Promise.all(inheritedTargets.map(async ({ key, target: inheritedTarget }) => {
      const compatibleInheritedTargetList = this.getCompatiblePermissionTargetList(inheritedTarget);
      const selectInheritedRuleList = async (table, field) => _.flatten(await Promise.all(
        compatibleInheritedTargetList.map(compatibleTarget => jianghuKnex(table)
          .where({ ...compatibleTarget, allowOrDeny: 'allow' })
          .select(field))
      ));
      const [ pageRuleList, resourceRuleList ] = await Promise.all([
        selectInheritedRuleList('_user_group_role_page', 'page'),
        selectInheritedRuleList('_user_group_role_resource', 'resource'),
      ]);
      return {
        key,
        pageIdList: this.expandRuleValueList(pageRuleList, 'page', allPageIdList),
        resourceIdList: this.expandResourceRuleValueList(
          resourceRuleList,
          visibleResourceIdSet,
          pageIdSet
        ),
      };
    }));

    ruleGroups.forEach(({ key, pageIdList, resourceIdList }) => {
      pageIdList.forEach(pageId => {
        this.mergeInheritedSource(inheritedPermissionSourceMap, `page:${pageId}`, key);
      });
      resourceIdList.forEach(resourceId => {
        this.mergeInheritedSource(inheritedPermissionSourceMap, `resource:${resourceId}`, key);
      });
    });

    return {
      inheritedNodeIdList: Object.keys(inheritedPermissionSourceMap),
      inheritedPermissionSourceMap,
    };
  }

  getInheritedPermissionTargetList(target) {
    if (this.isPublicTarget(target)) {
      return [];
    }
    if (this.isLoginTarget(target)) {
      return [{ key: 'public', target: PUBLIC_TARGET }];
    }
    const inheritedTargets = [
      { key: 'public', target: PUBLIC_TARGET },
      { key: 'login', target: LOGIN_TARGET },
    ];
    if (this.isGroupRoleTarget(target)) {
      inheritedTargets.push(
        {
          key: 'group',
          target: { user: '*', group: target.group, role: '*' },
        },
        {
          key: 'role',
          target: { user: '*', group: 'login', role: target.role },
        },
      );
    }
    return inheritedTargets;
  }

  async selectGroupRolePermissionOptionList(groupId) {
    const { jianghuKnex } = this.app;
    const [ membershipRoleList, pageRuleList, resourceRuleList, roleList ] = await Promise.all([
      jianghuKnex('_user_group_role').where({ groupId }).distinct('roleId').select('roleId'),
      jianghuKnex('_user_group_role_page')
        .where({ user: '*', group: groupId })
        .select('role', 'page', 'allowOrDeny'),
      jianghuKnex('_user_group_role_resource')
        .where({ user: '*', group: groupId })
        .select('role', 'resource', 'allowOrDeny'),
      jianghuKnex('_role').select('roleId', 'roleName'),
    ]);
    return this.buildGroupRolePermissionOptionList({
      membershipRoleList,
      pageRuleList,
      resourceRuleList,
      roleList,
    });
  }

  buildGroupRolePermissionOptionList({
    membershipRoleList = [],
    pageRuleList = [],
    resourceRuleList = [],
    roleList = [],
  }) {
    const roleIdSet = new Set();
    membershipRoleList.forEach(item => {
      if (typeof item.roleId === 'string' && item.roleId && item.roleId !== '*') {
        roleIdSet.add(item.roleId);
      }
    });
    [ ...pageRuleList, ...resourceRuleList ].forEach(item => {
      String(item.role || '').split(',').filter(roleId => roleId && roleId !== '*')
        .forEach(roleId => roleIdSet.add(roleId));
    });
    const roleMap = _.keyBy(roleList, 'roleId');
    const buildOption = roleId => {
      const roleName = roleId === '*' ? '全组' : ((roleMap[roleId] || {}).roleName || roleId);
      const isTargetRole = item => String(item.role || '').split(',').includes(roleId);
      const isAllowRule = item => isTargetRole(item) && item.allowOrDeny !== 'deny';
      const isDenyRule = item => isTargetRole(item) && item.allowOrDeny === 'deny';
      const pagePermissionValueList = this.unpackRuleValueList(pageRuleList.filter(isAllowRule), 'page');
      const resourcePermissionValueList = this.unpackRuleValueList(resourceRuleList.filter(isAllowRule), 'resource');
      const pagePermissionCount = pagePermissionValueList.length;
      const resourcePermissionCount = resourcePermissionValueList.length;
      const denyPermissionCount = this.unpackRuleValueList(pageRuleList.filter(isDenyRule), 'page').length
        + this.unpackRuleValueList(resourceRuleList.filter(isDenyRule), 'resource').length;
      return {
        value: roleId,
        text: roleId === '*' ? '全组（角色 *）' : `${roleName}（${roleId}）`,
        roleId,
        roleName,
        pagePermissionCount,
        resourcePermissionCount,
        denyPermissionCount,
        isAppWildcardConfigured: pagePermissionValueList.includes('*') && resourcePermissionValueList.includes('*'),
        isConfigured: pagePermissionCount > 0 || resourcePermissionCount > 0 || denyPermissionCount > 0,
      };
    };
    const roleOptionList = Array.from(roleIdSet)
      .map(buildOption)
      .sort((a, b) => a.text.localeCompare(b.text, 'zh-CN'));
    return [ buildOption('*'), ...roleOptionList ];
  }

  mergeInheritedSource(sourceMap, nodeId, sourceKey) {
    if (!sourceMap[nodeId]) {
      sourceMap[nodeId] = sourceKey;
      return;
    }
    const sourceSet = new Set(String(sourceMap[nodeId]).split(','));
    sourceSet.add(sourceKey);
    sourceMap[nodeId] = Array.from(sourceSet).join(',');
  }

  isPublicTarget(target) {
    return target.user === '*' && target.group === 'public' && target.role === '*';
  }

  isLoginTarget(target) {
    return target.user === '*' && target.group === 'login' && target.role === '*';
  }

  isActualGroupTarget(target) {
    return target.user === '*' && ![ '*', 'public', 'login' ].includes(target.group);
  }

  isGroupRoleTarget(target) {
    return this.isActualGroupTarget(target) && target.role !== '*';
  }

  getRequiredPermission(target) {
    const targetType = this.isPublicTarget(target)
      ? 'public'
      : this.isLoginTarget(target)
        ? 'login'
        : '';
    const requiredPermission = REQUIRED_PERMISSION_MAP[targetType] || {};
    return {
      pageIdList: [ ...(requiredPermission.pageIdList || []) ],
      resourceIdList: [ ...(requiredPermission.resourceIdList || []) ],
    };
  }

  validateRequiredPermission(requiredPermission, pageIdSet) {
    const requiredPageIdList = _.uniq([
      ...(requiredPermission.pageIdList || []),
      ...(requiredPermission.resourceIdList || [])
        .filter(resourceId => resourceId.endsWith('.*'))
        .map(resourceId => resourceId.slice(0, -2)),
    ]);
    const missingPageIdList = requiredPageIdList.filter(pageId => !pageIdSet.has(pageId));
    if (missingPageIdList.length) {
      throw new Error(`强制基础权限页面不存在: ${missingPageIdList.join(', ')}`);
    }
  }

  getCompatiblePermissionTargetList(target) {
    const targetList = [ target ];
    const isUserTarget = target.user !== '*' && target.group === 'login' && target.role === '*';
    const isRoleTarget = target.user === '*' && target.group === 'login' && target.role !== '*';
    if (isUserTarget || isRoleTarget) {
      targetList.push({ ...target, group: '*' });
    }
    return targetList;
  }

  validatePermissionTarget(target) {
    if (!target || TARGET_KEYS.some(key => typeof target[key] !== 'string' || !target[key])) {
      throw new Error('授权对象不能为空');
    }
    const { user, group, role } = target;
    const isPublic = this.isPublicTarget(target);
    const isLogin = this.isLoginTarget(target);
    const isActualGroup = ![ '*', 'public', 'login' ].includes(group);
    const isUser = user !== '*' && group === 'login' && role === '*';
    const isGroup = user === '*' && isActualGroup && role === '*';
    const isRole = user === '*' && group === 'login' && role !== '*';
    const isGroupRole = user === '*' && isActualGroup && role !== '*';
    if (![ isPublic, isLogin, isUser, isGroup, isRole, isGroupRole ].some(Boolean)) {
      throw new Error('授权对象类型不支持');
    }
    if (TARGET_KEYS.some(key => target[key] !== '*' && /[,*]/.test(target[key]))) {
      throw new Error('授权对象ID不能包含逗号或通配符');
    }
  }

  expandRuleValueList(ruleList, field, allValueList) {
    const selectedValueSet = new Set();
    ruleList.forEach(rule => {
      String(rule[field] || '').split(',').forEach(ruleValue => {
        if (ruleValue === '*') {
          allValueList.forEach(value => selectedValueSet.add(value));
        } else if (allValueList.includes(ruleValue)) {
          selectedValueSet.add(ruleValue);
        }
      });
    });
    return Array.from(selectedValueSet);
  }

  unpackRuleValueList(ruleList, field) {
    return _.uniq(ruleList.flatMap(rule => String(rule[field] || '')
      .split(',')
      .filter(Boolean)));
  }

  expandResourceRuleValueList(ruleList, visibleResourceIdSet, pageIdSet) {
    const resourceIdList = this.unpackRuleValueList(ruleList, 'resource');
    if (resourceIdList.includes('*')) {
      return [
        ...Array.from(visibleResourceIdSet),
        ...Array.from(pageIdSet).map(pageId => `${pageId}.*`),
      ];
    }
    return resourceIdList.filter(resourceId => (
      visibleResourceIdSet.has(resourceId)
      || this.isPageResourceWildcard(resourceId, pageIdSet)
    ));
  }

  isPageResourceWildcard(resourceId, pageIdSet) {
    if (typeof resourceId !== 'string' || !resourceId.endsWith('.*')) {
      return false;
    }
    return pageIdSet.has(resourceId.slice(0, -2));
  }

  normalizeResourcePermissionList(resourceIdList) {
    const normalizedResourceIdList = _.uniq(resourceIdList || []);
    const wildcardPageIdList = normalizedResourceIdList
      .filter(resourceId => typeof resourceId === 'string' && resourceId.endsWith('.*'))
      .map(resourceId => resourceId.slice(0, -2));
    return normalizedResourceIdList.filter(resourceId => (
      typeof resourceId !== 'string'
      || resourceId.endsWith('.*')
      || !wildcardPageIdList.some(pageId => resourceId.startsWith(`${pageId}.`))
    ));
  }

  packRuleValueList(valueList, maxLength = 250) {
    const result = [];
    valueList.forEach(value => {
      if (value.length > maxLength) {
        throw new Error(`权限节点ID过长: ${value}`);
      }
      const currentIndex = result.length - 1;
      const currentValue = result[currentIndex];
      if (!currentValue || `${currentValue},${value}`.length > maxLength) {
        result.push(value);
      } else {
        result[currentIndex] = `${currentValue},${value}`;
      }
    });
    return result;
  }

  async clearTargetUserInfoCache(target) {
    const { jianghuKnex } = this.app;
    if (this.isPublicTarget(target) || this.isLoginTarget(target)) {
      await jianghuKnex('_cache').delete();
      return;
    }
    let userIdList = [];
    if (target.user !== '*') {
      userIdList = [ target.user ];
    } else {
      // 修复后
      let query = jianghuKnex('_user_group_role').distinct('userId');
      const membershipWhere = this.getTargetMembershipWhere(target);
      if (Object.keys(membershipWhere).length) {
        query = query.where(membershipWhere);
      }
      userIdList = (await query.select('userId')).map(item => item.userId);
    }
    if (userIdList.length) {
      await jianghuKnex('_cache').whereIn('userId', userIdList).delete();
    }
  }

  getTargetMembershipWhere(target) {
    const where = {};
    if (target.group !== 'login') {
      where.groupId = target.group;
    }
    if (target.role !== '*') {
      where.roleId = target.role;
    }
    return where;
  }

}

module.exports = userGroupRoleService;
