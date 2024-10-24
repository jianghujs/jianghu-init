'use strict';

const _ = require('lodash');

const Service = require('egg').Service;

class DirectoryService extends Service {

  async getDirectoryList() {
    const { jianghuKnex } = this.app;
    const { userInfo } = this.ctx;
    const { userAppList } = userInfo;
    const appIdList = userAppList.map(userApp => userApp.appId);
    
    // 旧版
    // const rows = await jianghuKnex('directory')
    //   .orWhere(function() {
    //     this.whereIn('appId', appIdList);
    //   })
    //   .orWhere('accessType', 'public')
    //   .select();

    const directoryConfigConstant = await jianghuKnex('_constant').where('constantKey', 'directoryConfig').first();
    const appList = await jianghuKnex('enterprise_app').select();
    const directoryConfig = JSON.parse(directoryConfigConstant.constantValue);
    const allAppPageList = directoryConfig.reduce((allPageList, catalog) => {
      catalog.children.forEach(app => {
        allPageList = allPageList.concat(app.children.map(page => ({appId: page.appId, pageId: page.pageId})));
      });
      return allPageList;
    }, []);
    const allowAllPageList = await this.captureAllowPageList({ 
      jianghuKnex, 
      allAppPageList
    });
    const allowDirectoryConfig = []
    // 去除掉 directoryConfig 中没有 allowPageList 权限的 catalog app page
    directoryConfig.forEach(catalog => {
      const catalogTmp = _.cloneDeep(catalog);
      catalogTmp.children = catalogTmp.children.filter(app => {
        const appTmp = _.cloneDeep(app);
        app.children = appTmp.children.filter(page => {
          if (page.link && !app.appId && !page.pageId) {
            return true;
          }
          const pageTmp = _.cloneDeep(page);
          const allowPage = allowAllPageList.find(allowPage => allowPage.appId === pageTmp.appId && allowPage.pageId === pageTmp.pageId);
          if (allowPage) {
            return true;
          }
          return false;
        });
        if (app.children.length) {
          return true;
        }
        return false;
      });
      if (catalogTmp.children.length) {
        allowDirectoryConfig.push(catalogTmp);
      }
    });
    
    allowDirectoryConfig
      .forEach(catalog => {
      catalog.children.forEach(app => {
        app.children.forEach(page => {
          if (page.link) {
            page.name = (page.name || '').replace(/\[.*\]/g, '');
          }

          if (!page.link) {
            const appItem = appList.find(app => app.appId === page.appId);
            let url = appItem?.appUrl || '';
            if (page.pageId) {
              url += `/page/${page.pageId}`;
            }
            page.link = page.link || url;
            page.name = (page.name || '').replace(/\[.*\]/g, '');
          }
        });
      });
    })
    return { rows: allowDirectoryConfig };
  }

  getRuleIdList(groupId, userId, userGroupRoleList) {
    const getGroupIdList = (groupId, userId, userGroupRoleList) => {
      const groupIdList = userGroupRoleList.map(
        userGroupRole => userGroupRole.groupId
      );
      groupIdList.push('*');
      if (groupId) {
        return groupIdList;
      }
      groupIdList.push('public');
      if (userId) {
        groupIdList.push('login');
      }
      return groupIdList;
    };
    const getRoleIdList = (userId, userGroupRoleList) => {
      const roleIdList = userGroupRoleList.map(
        userGroupRole => userGroupRole.roleId
      );
      roleIdList.push('*');
      return roleIdList;
    };
    const getUserIdList = userId => {
      const userIdList = [];
      if (userId) {
        userIdList.push(userId);
      }
      userIdList.push('*');
      return userIdList;
    };

    const userIdList = getUserIdList(userId);
    const groupIdList = getGroupIdList(groupId, userId, userGroupRoleList);
    const roleIdList = getRoleIdList(userId, userGroupRoleList);
    return { userIdList, groupIdList, roleIdList };
  }

  async captureAllowPageList({
    jianghuKnex,
    allAppPageList,
  }) {
    const { userId, userGroupRoleList } = this.ctx.userInfo;
    const userGroupRoleListTmp = _.cloneDeep(userGroupRoleList);
    userGroupRoleListTmp.push({ userId, groupId: 'public', roleId: '--' });
    userGroupRoleListTmp.push({ userId, groupId: 'login', roleId: '--' });
    const allUserGroupRolePageList = await jianghuKnex('enterpirse_user_group_role_page').select();
    const allowPageList = this.computeAllowList(
      'page',
      allAppPageList,
      allUserGroupRolePageList, userGroupRoleListTmp,
    );
    return allowPageList;
  }
  /**
     * 计算用户有权限的数据项
     *
     * @param fieldKey 数据类型字段，如 'resource', 'page', 'uiLevel'
     * @param allItemList 所有的数据列表，如 allResourceList, allPageList, allUiLevelList
     * @param allRuleList 所有的规则列表，如 allUserGroupRoleResourceList， allUserGroupRolePageList， allUserGroupRoleUiLevelList
     * @param userIdList
     * @param groupIdList 用户有权限的 groupId 列表
     * @param roleIdList 用户所属的 roleId 列表
     */
  computeAllowList(
    fieldKey,
    allItemList,
    allRuleList,
    userGroupRoleList,
  ) {
    const idFieldKey = `${fieldKey}Id`;
    const allowItemList = [];

    if (!allItemList || !allRuleList) {
      return allowItemList;
    }

    // 检查每个数据项有没有权限
    allItemList.forEach(item => {
      let resultAllowOrDeny = '';
      let isPublic = false;
      // 遍历并检查规则
      allRuleList.forEach(rule => {
        if (item.appId !== rule.appId && rule.appId !== '*') {
          return;
        }
        // deny 的优先级高于全部，一旦有 deny 则不再需要判断
        if (resultAllowOrDeny === 'deny') {
          return;
        }

        // 判断这条规则的资源是否和当前资源匹配
        // TODO: 还是有bug purchaseOrderManagement
        if (!this.checkResource(item[idFieldKey], rule[fieldKey])) {
          return;
        }
        
        // 判断这条规则是否和当前用户匹配
        if (!this.checkRule({ userGroupRoleList, rule })) {
          return;
        }
        
        resultAllowOrDeny = rule.allowOrDeny;
      });

      if (resultAllowOrDeny === 'allow') {
        allowItemList.push({ ...item, isPublic });
      }
    });
    return allowItemList;
  }


  /**
   * @description 判断资源是否符合规则，支持逗号及后缀通配符
   * @return {Boolean} 检查结果
   * @param {String} checkResource 待检查资源名，如 app1.student.res1
   * @param {String} ruleResource 规则中的资源名，如 app1.normal.*,app1.student.res1
   */
  checkResource(checkResource, ruleResource) {
    const ruleParts = ruleResource.split(',');
    return !!ruleParts.find(ruleValue => {
      // 将后缀通配符转成正常正则
      const ruleReg =
        '^' + ruleValue.replace(/\./g, '\\.').replace(/\|/g, '\\\\|').replace('*', '.*') + '$';
      const regExp = new RegExp(ruleReg);
      return regExp.test(checkResource);
    });
  }

  /**
   * userGroupRoleList 是否和当前 rule匹配
   * @param userGroupRoleList.userGroupRoleList
   * @param userGroupRoleList  [{ userId, groupId, roleId }]
   * @param rule  {user:'*', group: 'login', role:'*'}
   * @param userGroupRoleList.rule
   */
    checkRule({ userGroupRoleList, rule }) {
      const userGroupRoleListRule = userGroupRoleList
        .filter(userGroupRole => this.checkResource(userGroupRole.userId, rule.user))
        .filter(userGroupRole => this.checkResource(userGroupRole.groupId, rule.group))
        .filter(userGroupRole => this.checkResource(userGroupRole.roleId, rule.role));
      if (userGroupRoleListRule.length === 0) {
        return false;
      }
      if (userGroupRoleListRule.length > 0) {
        return true;
      }
    }


  async saveDirectoryConfig() {
    const { jianghuKnex } = this.app;
    const { userInfo } = this.ctx;
    const {appConfigList} = this.ctx.request.body.appData.actionData;
    const appList = await jianghuKnex('enterprise_app').select();

    const confitStr = JSON.stringify(appConfigList);
    for (const catalog of appConfigList) {
      for (const appTmp of catalog.children) {
        for (const pageTmp of appTmp.children) {
          const { appId, pageId, link } = pageTmp;
          const app = appList.find(app => app.appId === appId);
          if (!link) {
            pageTmp.link = app.appUrl;
            if (pageId) {
              pageTmp.link += `/${pageId}`;
            }
          }
        }
      }
    }
    if (!await jianghuKnex('_constant').where('constantKey', 'directoryConfig').first()) {
      await jianghuKnex('_constant').insert({ constantKey: 'directoryConfig', constantValue: confitStr });
      await jianghuKnex('_constant').insert({ constantKey: 'directoryList', constantValue: JSON.stringify(appConfigList) });
      return;
    }
    await jianghuKnex('_constant').where('constantKey', 'directoryConfig').update({ constantValue: confitStr });
    await jianghuKnex('_constant').where('constantKey', 'directoryList').update({ constantValue: JSON.stringify(appConfigList) });

  }

}

module.exports = DirectoryService;
