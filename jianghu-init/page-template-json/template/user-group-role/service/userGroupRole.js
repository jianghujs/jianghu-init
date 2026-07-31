'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
// ========================================常用 require end=============================================
const _ = require('lodash');

const TARGET_KEYS = [ 'user', 'group', 'role' ];

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
      jianghuKnex('_user_group_role_page').where({ ...target, allowOrDeny: 'allow' }).select('page'),
      jianghuKnex('_user_group_role_resource').where({ ...target, allowOrDeny: 'allow' }).select('resource'),
      jianghuKnex('_user_group_role_page').where({ ...target, allowOrDeny: 'deny' }).select('page'),
      jianghuKnex('_user_group_role_resource').where({ ...target, allowOrDeny: 'deny' }).select('resource'),
    ]);

    const pageIdSet = new Set(pageList.map(item => item.pageId));
    const resourceListByPageId = _.groupBy(
      resourceList.filter(item => pageIdSet.has(item.pageId)),
      'pageId'
    );
    const permissionTree = _.sortBy(pageList, [
      item => Number(item.sort) || Number.MAX_SAFE_INTEGER,
      'pageId',
    ]).map(page => {
      const children = _.sortBy(resourceListByPageId[page.pageId] || [], 'actionId').map(resource => ({
        id: `resource:${resource.pageId}.${resource.actionId}`,
        type: 'resource',
        name: resource.desc || resource.actionId,
        code: resource.actionId,
        resourceType: resource.resourceType,
      }));
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
    const allResourceIdList = resourceList.map(item => `${item.pageId}.${item.actionId}`);
    const visibleResourceIdSet = new Set(
      resourceList
        .filter(item => pageIdSet.has(item.pageId))
        .map(item => `${item.pageId}.${item.actionId}`)
    );
    const selectedPageIdList = this.expandRuleValueList(pageRuleList, 'page', allPageIdList);
    const selectedResourceIdList = this.expandRuleValueList(resourceRuleList, 'resource', allResourceIdList);
    const deniedPageIdList = this.expandRuleValueList(pageDenyRuleList, 'page', allPageIdList);
    const deniedResourceIdList = this.expandRuleValueList(resourceDenyRuleList, 'resource', allResourceIdList);

    return {
      permissionTree,
      selectedNodeIdList: [
        ...selectedPageIdList.map(pageId => `page:${pageId}`),
        ...selectedResourceIdList
          .filter(resourceId => visibleResourceIdSet.has(resourceId))
          .map(resourceId => `resource:${resourceId}`),
      ],
      deniedNodeIdList: [
        ...deniedPageIdList.map(pageId => `page:${pageId}`),
        ...deniedResourceIdList
          .filter(resourceId => visibleResourceIdSet.has(resourceId))
          .map(resourceId => `resource:${resourceId}`),
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

    const normalizedPageIdList = _.uniq(pageIdList.filter(item => typeof item === 'string' && item));
    const submittedResourceIdList = _.uniq(resourceIdList.filter(item => typeof item === 'string' && item));
    const [ pageList, resourceList, existingResourceRuleList ] = await Promise.all([
      jianghuKnex('_page').select('pageId'),
      jianghuKnex('_resource').select('pageId', 'actionId'),
      jianghuKnex('_user_group_role_resource').where({ ...target, allowOrDeny: 'allow' }).select('resource'),
    ]);
    const validPageIdSet = new Set(pageList.map(item => item.pageId));
    const allResourceIdList = resourceList.map(item => `${item.pageId}.${item.actionId}`);
    const validResourceIdSet = new Set(allResourceIdList);
    const visibleResourceIdSet = new Set(
      resourceList
        .filter(item => validPageIdSet.has(item.pageId))
        .map(item => `${item.pageId}.${item.actionId}`)
    );
    // 未注册到 _page 的 resource 当前不会展示在树上，保存时必须保留其原授权。
    const hiddenExistingResourceIdList = this
      .expandRuleValueList(existingResourceRuleList, 'resource', allResourceIdList)
      .filter(resourceId => !visibleResourceIdSet.has(resourceId));
    const normalizedResourceIdList = _.uniq([
      ...submittedResourceIdList,
      ...hiddenExistingResourceIdList,
    ]);
    const invalidPageIdList = normalizedPageIdList.filter(pageId => !validPageIdSet.has(pageId));
    const invalidResourceIdList = submittedResourceIdList.filter(resourceId => !validResourceIdSet.has(resourceId));
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
      await trx('_user_group_role_page').where({ ...target, allowOrDeny: 'allow' }).jhDelete();
      await trx('_user_group_role_resource').where({ ...target, allowOrDeny: 'allow' }).jhDelete();
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

  validatePermissionTarget(target) {
    if (!target || TARGET_KEYS.some(key => typeof target[key] !== 'string' || !target[key])) {
      throw new Error('授权对象不能为空');
    }
    const { user, group, role } = target;
    const isUser = user !== '*' && group === '*' && role === '*';
    const isGroup = user === '*' && group !== '*' && role === '*';
    const isRole = user === '*' && group === '*' && role !== '*';
    const isGroupRole = user === '*' && group !== '*' && role !== '*';
    if (![ isUser, isGroup, isRole, isGroupRole ].some(Boolean)) {
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
    let userIdList = [];
    if (target.user !== '*') {
      userIdList = [ target.user ];
    } else {
      const query = jianghuKnex('_user_group_role').distinct('userId');
      if (target.group !== '*') {
        query.where('groupId', target.group);
      }
      if (target.role !== '*') {
        query.where('roleId', target.role);
      }
      userIdList = (await query).map(item => item.userId);
    }
    if (userIdList.length) {
      await jianghuKnex('_cache').whereIn('userId', userIdList).delete();
    }
  }

}

module.exports = userGroupRoleService;
