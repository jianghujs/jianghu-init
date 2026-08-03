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
    const selectedPageIdList = _.uniq([
      ...this.expandRuleValueList(pageRuleList, 'page', allPageIdList),
      ...requiredPermission.pageIdList,
    ]);
    const selectedResourceIdList = this.normalizeResourcePermissionList([
      ...this.unpackRuleValueList(resourceRuleList, 'resource'),
      ...requiredPermission.resourceIdList,
    ]);
    const deniedPageIdList = this.expandRuleValueList(pageDenyRuleList, 'page', allPageIdList);
    const deniedResourceIdList = this.unpackRuleValueList(resourceDenyRuleList, 'resource');
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
    };
  }

  async updateTargetPermission() {
    const { jianghuKnex } = this.app;
    const {
      target,
      pageIdList = [],
      resourceIdList = [],
    } = this.ctx.request.body.appData.actionData;
    this.validatePermissionTarget(target);
    const compatibleTargetList = this.getCompatiblePermissionTargetList(target);
    const selectRuleList = async (table, field, allowOrDeny) => _.flatten(await Promise.all(
      compatibleTargetList.map(compatibleTarget => jianghuKnex(table)
        .where({ ...compatibleTarget, allowOrDeny })
        .select(field))
    ));

    const submittedPageIdList = _.uniq(pageIdList.filter(item => typeof item === 'string' && item));
    const submittedResourceIdList = _.uniq(resourceIdList.filter(item => typeof item === 'string' && item));
    const [ pageList, resourceList, existingResourceRuleList ] = await Promise.all([
      jianghuKnex('_page').select('pageId'),
      jianghuKnex('_resource').select('pageId', 'actionId'),
      selectRuleList('_user_group_role_resource', 'resource', 'allow'),
    ]);
    const validPageIdSet = new Set(pageList.map(item => item.pageId));
    const requiredPermission = this.getRequiredPermission(target);
    this.validateRequiredPermission(requiredPermission, validPageIdSet);
    const normalizedPageIdList = _.uniq([
      ...submittedPageIdList,
      ...requiredPermission.pageIdList,
    ]);
    const normalizedSubmittedResourceIdList = this.normalizeResourcePermissionList([
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
        !visibleResourceIdSet.has(resourceId)
        && !this.isPageResourceWildcard(resourceId, validPageIdSet)
      ));
    const normalizedResourceIdList = this.normalizeResourcePermissionList([
      ...normalizedSubmittedResourceIdList,
      ...hiddenExistingResourceIdList,
    ]);
    const invalidPageIdList = normalizedPageIdList.filter(pageId => !validPageIdSet.has(pageId));
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
    const inheritedTargets = [];

    if (this.isPublicTarget(target)) {
      return { inheritedNodeIdList: [], inheritedPermissionSourceMap };
    }
    if (this.isLoginTarget(target)) {
      inheritedTargets.push({ key: 'public', target: PUBLIC_TARGET });
    } else {
      inheritedTargets.push(
        { key: 'public', target: PUBLIC_TARGET },
        { key: 'login', target: LOGIN_TARGET },
      );
    }

    const ruleGroups = await Promise.all(inheritedTargets.map(async ({ key, target: inheritedTarget }) => {
      const [ pageRuleList, resourceRuleList ] = await Promise.all([
        jianghuKnex('_user_group_role_page').where({ ...inheritedTarget, allowOrDeny: 'allow' }).select('page'),
        jianghuKnex('_user_group_role_resource').where({ ...inheritedTarget, allowOrDeny: 'allow' }).select('resource'),
      ]);
      return {
        key,
        pageIdList: this.expandRuleValueList(pageRuleList, 'page', allPageIdList),
        resourceIdList: this.unpackRuleValueList(resourceRuleList, 'resource')
          .filter(resourceId => (
            visibleResourceIdSet.has(resourceId)
            || this.isPageResourceWildcard(resourceId, pageIdSet)
          )),
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
