'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
// ========================================常用 require end=============================================
const _ = require('lodash');
const Knex = require('knex');
const dayjs = require('dayjs');

const getJhIdViewSql = (appList, tableName, dataRepositoryTable) => {

  // 检查 appList 中是否存在非空的 jhId
  if (!appList.some(({ appJhId }) => !!appJhId)) {

    let whereClause = ''; // 初始化 WHERE 子句
    if (['enterprise_user_group_role_page', 'enterprise_user_group_role_resource'].includes(tableName)) {
      whereClause = ` WHERE appId = '{APPID}' OR appId = '*'`;
    } else if (tableName === 'enterprise_view02_user_app') {
      whereClause = ` WHERE appId = '{APPID}'`;
    }
    // 如果所有的 jhId 都是空，生成一个简单的 SELECT 查询
    return `SELECT * FROM ${dataRepositoryTable}.${tableName}${whereClause.replace('{APPID}', appList[0].appId)}`;
  }

  // 否则，生成一个 CROSS JOIN 查询
  const jhIdValuesSql = appList.map(({ appJhId }) => {
    return `SELECT '${appJhId}' as jhId`;
  }).join(' UNION ALL ');

  if (['enterprise_user_group_role_page', 'enterprise_user_group_role_resource', 'enterprise_view02_user_app'].includes(tableName)) {
    const appIdJhidMap = _.fromPairs(appList.map(({ appId, appJhId }) => [appId, appJhId]));
    const appIdList = _.uniq(appList.map(({ appId }) => appId));
    /**
     * CASE my_field
          WHEN 'haha' THEN 'Result for haha'
          WHEN 'hehe' THEN 'Result for hehe'
          ELSE 'Result for heihei'
      END 
    */
    let ifClasus = 'CASE appId';
    _.forEach(appIdJhidMap, (jhId, appId) => {
      ifClasus += ` WHEN '${appId}' THEN '${jhId}'`;
    });
    let userAppWhereClause = appIdList.length > 1 ? ` WHERE appId IN ('${appIdList.join("','")}')` : ` WHERE appId = '${appIdList[0]}'`;
    if (tableName != 'enterprise_view02_user_app') {
      userAppWhereClause += ` union all 
      SELECT jhId_values.jhId, ${dataRepositoryTable}.${tableName}.* 
          FROM (${jhIdValuesSql}) AS jhId_values 
          CROSS JOIN ${dataRepositoryTable}.${tableName} where appId = '*'
      `;
    }
    ifClasus += ' ELSE NULL END AS jhId';
    return `SELECT ${ifClasus}, ${dataRepositoryTable}.${tableName}.* 
            FROM ${dataRepositoryTable}.${tableName}${userAppWhereClause}`;
  }

  return `SELECT jhId_values.jhId, ${dataRepositoryTable}.${tableName}.* 
          FROM (${jhIdValuesSql}) AS jhId_values 
          CROSS JOIN ${dataRepositoryTable}.${tableName}`;
}

/**
 * @description 判断资源是否符合规则，支持逗号及后缀通配符
 * @return {Boolean} 检查结果
 * @param {String} checkResource 待检查资源名，如 app1.student.res1
 * @param {String} ruleResource 规则中的资源名，如 app1.normal.*,app1.student.res1
 */
const checkResource = (checkResource, ruleResource) => {
  const ruleParts = ruleResource.split(',');
  return !!ruleParts.find(ruleValue => {
    // 将后缀通配符转成正常正则
    const ruleReg =
      '^' + ruleValue.replace(/\./g, '\\.').replace('*', '.*') + '$';
    const regExp = new RegExp(ruleReg);
    return regExp.test(checkResource);
  });
}

class AppService extends Service {

  async checkDatabaseExist() {
    const { jianghuKnex, knex } = this.app;
    const { appDatabase: database, appJhId: jhId } = this.ctx.request.body.appData.actionData;
    // 检查数据库是否存在
    const [databaseExist] = await knex.raw('SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?', [database])
    if (!databaseExist.length) {
      throw new Error(`数据库不存在`);
    }
    // 修改 knex 的 database
    if (jhId) {
      // knex 验证jhId 字段是否存在
      if (!await knex.schema.hasColumn(database + '._page', 'jhId')) {
        throw new Error(`数据库不存在 jhId 字段`);
      }
    }
    const pageList = await jianghuKnex(database + '._page').where(jhId ? { jhId } : {}).select();
    // console.log(_.pick(pageList, ['pageId', 'pageName', 'pageType', 'sort']));
    // const pageListFilter = _.pick(pageList, ['pageId', 'pageName', 'pageType', 'sort']);
    const pageListFilter = _.map(pageList.filter(e => !['help', 'login', 'manual'].includes(e.pageId)), item => _.pick(item, ['pageId', 'pageName', 'pageType', 'sort']));

    this.ctx.request.body.appData.actionData.appPageList = JSON.stringify(pageListFilter);
  }

  // TODO: 更新个数打印 & 如果是一样的不用update
  async updatePageList() {
    const { jianghuKnex, logger } = this.app;
    const appList = await jianghuKnex('enterprise_app').select();
    let updateCount = 0;
    for (const app of appList) {
      if (!app.appDatabase) {
        continue;
      }
      let pageList = [];
      try {
        pageList = await jianghuKnex(`${app.appDatabase}._page`).select();
      } catch (error) {
        if (error.code == 'ER_NO_SUCH_TABLE') {
          logger.error(`[schedule/appPageList.js]______`, { 'enterprise_app.appDatabase不存在': app.appDatabase });
          continue;
        }
      }
      const pageListFilter = pageList
        .filter(e => !['help', 'login', 'manual'].includes(e.pageId))
        .filter(e => e.pageName !== '通知/待办');
      const pageListFilterData = _.map(pageListFilter, item => _.pick(item, ['pageId', 'pageName', 'pageType', 'sort']));
      const pageListFilterDataString = JSON.stringify(pageListFilterData);
      if (pageListFilterDataString !== app.appPageList) {
        await jianghuKnex('enterprise_app').where({ id: app.id }).update({ appPageList: pageListFilterDataString });
        updateCount++;
      }
    }
    logger.info('[schedule/appPageList.js]______', { 'enterprise_app.appPageList 更新个数': updateCount });
  }

  async updateAppUserGroupRole() {
    const actionData = this.ctx.request.body.appData.actionData;
    const { knex, logger } = this.app;
    const appWhere = _.pick(actionData, ['id']);
    const { systemAppId, dataRepositoryTable, directoryTable } = this.app.config.enterpriseConfig;
    if (!systemAppId || !dataRepositoryTable || !directoryTable) {
      throw new Error('enterpriseConfig 未设置');
    }

    const appListAll = await knex('enterprise_app').where(appWhere).select();
    const appListForUserGroupRole = appListAll.filter((app) => app.appId != systemAppId);
    const databaseList = _.compact(_.uniqBy(appListForUserGroupRole.map((app) => app.appDatabase)));
    for (const database of databaseList) {
      const appListByDatabase = appListForUserGroupRole.filter((app) => app.appDatabase == database);
      const appIdList = appListByDatabase.map((app) => app.appId);
      knex.client.config.connection.database = database;
      const currentKnex = Knex(knex.client.config);
      logger.info(`updateAppUserGroupRole appId: ${appIdList.join(',')}`);
      const deleteViewSql = [
        currentKnex.raw(`DROP TABLE IF EXISTS _group;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _role;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _user_group_role;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _user_group_role_page;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _user_group_role_resource;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _view01_user;`),
        currentKnex.raw(`DROP TABLE IF EXISTS _view02_user_app;`),

        currentKnex.raw(`DROP VIEW IF EXISTS _group;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _role;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _user_group_role;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _user_group_role_page;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _user_group_role_resource;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _enterprise_user_session;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _directory_user_session;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _view01_user;`),
        currentKnex.raw(`DROP VIEW IF EXISTS _view02_user_app;`),

        // 废弃的view
        // currentKnex.raw(`DROP VIEW IF EXISTS _dr__member;`),
      ];
      const createViewSql = [
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _group AS ${getJhIdViewSql(appListByDatabase, 'enterprise_group', dataRepositoryTable)};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _role AS ${getJhIdViewSql(appListByDatabase, 'enterprise_role', dataRepositoryTable)};`),

        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user_group_role', dataRepositoryTable)};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role_page AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user_group_role_page', dataRepositoryTable)};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _user_group_role_resource AS ${getJhIdViewSql(appListByDatabase, 'enterprise_user_group_role_resource', dataRepositoryTable)};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _directory_user_session AS ${getJhIdViewSql(appListByDatabase, 'enterprise_directory_user_session', dataRepositoryTable)};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _view01_user AS ${getJhIdViewSql(appListByDatabase, 'enterprise_view01_user', dataRepositoryTable)};`),
        currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _view02_user_app AS ${getJhIdViewSql(appListByDatabase, 'enterprise_view02_user_app', dataRepositoryTable)};`),
      ];
      if (appIdList.includes('directory')) {
        // 替换 createViewSql 的最后一个
        createViewSql.pop();
        createViewSql.push(currentKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _view02_user_app AS SELECT * FROM ${dataRepositoryTable}.enterprise_view02_user_app`));
      }
      await Promise.all(deleteViewSql);
      await Promise.all(createViewSql);
      await currentKnex.destroy();
    }
    // 补一个system的 _user_session
    const systemApp = appListAll.find((app) => app.appId == systemAppId);
    knex.client.config.connection.database = systemApp.appDatabase;
    const systemKnex = Knex(knex.client.config);
    await systemKnex.raw(`DROP VIEW IF EXISTS _enterprise_user_session;`);
    await systemKnex.raw(`DROP VIEW IF EXISTS _directory_user_session;`);
    await systemKnex.raw(`CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW _directory_user_session AS ${getJhIdViewSql([systemAppId], 'enterprise_directory_user_session', dataRepositoryTable)};`);
    await systemKnex.destroy();


    // knex 检查 _page表是否有 pageIcon 字段
    const appListForTask = appListAll;
    // const appListForTask = appListAll.filter((app) => app.appId != 'task');
    const taskApp = appListAll.find((app) => app.appId == 'task');
    if (!taskApp) return;
    for (const app of appListForTask) {
      const { appDatabase, appId } = app;
      if (!appDatabase) continue;
      if (!await knex.schema.hasColumn(`${appDatabase}._page`, 'pageIcon')) {
        await knex.schema.alterTable(`${appDatabase}._page`, function (table) {
          table.text('pageIcon').after('pageType');
        });
      }
      await knex(`${appDatabase}._page`).where({ pageName: '通知/待办', pageType: 'showInRightMenu' }).delete();
      await knex(`${appDatabase}._page`).insert({
        pageId: taskApp.appUrl + '/page/noticeManagement',
        pageName: '通知/待办', pageType: 'showInRightMenu',
        pageIcon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"> <g id="Frame 19"> <path id="Vector" d="M14 0C6.2695 0 0 6.2695 0 14C0 21.7305 6.2695 28 14 28C21.7305 28 28 21.7305 28 14C28 6.2695 21.7305 0 14 0Z" fill="#5DB55F"/> <g id="Frame"> <path id="Vector_2" d="M15.2698 19.44L15.307 19.4419C15.5022 19.4633 15.6398 19.6499 15.5895 19.8403L15.57 19.9088C15.3646 20.5638 14.7393 21.04 14.0001 21.04L13.9239 21.0384C13.193 21.0057 12.5866 20.5075 12.4103 19.8403L12.4033 19.8048C12.3758 19.6153 12.5284 19.44 12.7303 19.44H15.2698ZM14.0001 6.95996C14.1274 6.95996 14.2495 7.01053 14.3395 7.10055C14.4295 7.19057 14.4801 7.31266 14.4801 7.43996V7.94364C16.9402 8.191 18.8001 10.3545 18.8001 12.8556V16.24L18.802 16.288C18.8141 16.4489 18.8866 16.5994 19.0049 16.7091C19.1232 16.8189 19.2787 16.8799 19.4401 16.88H19.5543L19.6087 16.8816C20.0055 16.9065 20.3562 17.1993 20.3959 17.5974L20.3994 17.6486C20.4037 17.7562 20.3861 17.8635 20.3479 17.9642C20.3096 18.0648 20.2514 18.1567 20.1768 18.2343C20.1022 18.312 20.0127 18.3737 19.9137 18.4159C19.8146 18.4581 19.7081 18.4799 19.6004 18.48H8.44583L8.39143 18.4784C7.99463 18.4534 7.64391 18.1606 7.60423 17.7625L7.60071 17.7113C7.59649 17.6037 7.61404 17.4964 7.65231 17.3957C7.69058 17.295 7.74878 17.2031 7.82342 17.1255C7.89807 17.0479 7.98762 16.9861 8.0867 16.9439C8.18579 16.9017 8.29238 16.88 8.40007 16.88H8.56007L8.60807 16.8784C8.76908 16.8663 8.91956 16.7937 9.02935 16.6753C9.13914 16.5569 9.20012 16.4014 9.20007 16.24V12.72C9.20007 10.231 11.0945 8.1846 13.5201 7.94364V7.43996C13.5201 7.31266 13.5706 7.19057 13.6607 7.10055C13.7507 7.01053 13.8728 6.95996 14.0001 6.95996Z" fill="white"/> </g> </g> </svg>`,
      });
    }

  }

  async updateToDirectoryApp() {
    const { jianghuKnex } = this.app;

    const appTypeListConstant = await jianghuKnex('_constant', this.ctx).where({ constantKey: 'appTypeList' }).select().first();
    const appTypeList = JSON.parse(appTypeListConstant?.constantValue || '[]');
    const appList = await jianghuKnex('enterprise_app').select();
    appList.forEach((row) => {
      row.appPageList = JSON.parse(row.appPageList || '[]');
      row.appPageDirectoryList = JSON.parse(row.appPageDirectoryList || '[]');
      row.appPageDirectoryList = row.appPageDirectoryList
        .filter((pageId) => row.appPageList.findIndex((page) => page.pageId == pageId) > -1)
        .map((pageId) => row.appPageList.find((page) => page.pageId == pageId));
    });
    const directoryList = await jianghuKnex(`${directoryTable}.directory`).select();
    const directoryListFilter = directoryList.filter(d => d.appGroupItemSort && d.appGroupItemSort >= 0);
    const appGroupItemSortMap = Object.fromEntries(directoryListFilter.map(obj => [obj.appId, obj.appGroupItemSort]));
    await jianghuKnex(`${directoryTable}.directory`).where({ description: '生成' }).delete();
    for (const app of appList) {
      const { appPageDirectoryList, appId, appType, appUrl } = app;
      const directoryList = appPageDirectoryList.map((page) => {
        const appTypeObj = appTypeList.find((at) => at.value == appType)
        return {
          appGroupNumber: appTypeObj?.appGroupNumber,
          appGroupName: app.appType,
          appGroupItemSort: appGroupItemSortMap[appId], // TODO: 从 old directoryList里取
          appId: app.appId,
          appName: app.appName,
          url: `${appUrl}/page/${page.pageId}`,
          displayName: page.pageName,
          description: '生成',
          accessType: 'login',
        }
      });
      if (directoryList.length > 0) {
        await jianghuKnex(`${directoryTable}.directory`).insert(directoryList);
      }
    }
  }
  
  async buildSupperAdminUserApp() {
    const { jianghuKnex } = this.app;
    const supperAdminUserList = await jianghuKnex('enterprise_user_group_role').where({ groupId: '超级管理员' }).select();
    const userList = supperAdminUserList.map(e => e.userId);
    // 检查 enterprise_user_app 内是否有对应的关系数据
    const userAppList = await jianghuKnex('enterprise_user_app').whereIn('userId', userList).select();
    const appList = await jianghuKnex('enterprise_app').select();
    const appIdList = appList.map(e => e.appId);

    for (const appId of appIdList) {
      for (const userId of userList) {
        if (!userAppList.some(e => e.appId == appId && e.userId == userId)) {
          await jianghuKnex('enterprise_user_app').insert({
            userId: userId,
            appId: appId,
            source: '超级管理员',
          });
        }
      }
    }
    // 判断是否有非这些id的user关系数据
    const idList = userAppList.filter(e => !appIdList.includes(e.appId)).map(e => e.id);
    if (idList.length > 0) {
      await jianghuKnex('enterprise_user_app').whereIn('id', idList).delete();
    }
  }

  async buildUserGroupRolePageByCommonAuth() {
    const { jianghuKnex, logger } = this.app;
    const source = "通用权限";

    const commonAuthListConfig = await jianghuKnex('_constant').where({ constantKey: 'commonAuthList' }).select().first() || {constantValue: "[]"};
    const commonAuthList = JSON.parse(commonAuthListConfig.constantValue);
    commonAuthList.forEach(commonAuth => {
      commonAuth.page = commonAuth.pageIdList.join(',');
      commonAuth.resource = commonAuth.pageIdList.join(',') === '*' ? '*' : commonAuth.pageIdList.join('.*,') + '.*';
      commonAuth.allowOrDeny = "allow";
      delete commonAuth.pageIdList;
    })

    let userGroupRolePageAll = await jianghuKnex('enterprise_user_group_role_page').where({ source }).select();
    let userGroupRoleResourceAll = await jianghuKnex('enterprise_user_group_role_resource').where({ source }).select();

    // enterprise_user_group_role_page     通用权限 删除多余的记录
    // enterprise_user_group_role_resource 通用权限 删除多余的记录
    const userGroupRolePageDelete = userGroupRolePageAll
      .filter((userGroupRolePage) => {
        const { appId, user, group, role, page, allowOrDeny } = userGroupRolePage;
        return commonAuthList.findIndex(commonAuth =>
          appId == commonAuth.appId && user == commonAuth.user &&
          group == commonAuth.group && role == commonAuth.role &&
          page == commonAuth.page && allowOrDeny == commonAuth.allowOrDeny) == -1;
      });
    if (userGroupRolePageDelete.length > 0) {
      const userGroupRolePageDeleteIdList = userGroupRolePageDelete.map(e => e.id);
      await jianghuKnex('enterprise_user_group_role_page').whereIn('id', userGroupRolePageDeleteIdList).delete();
    }
    const userGroupRoleResourceDelete = userGroupRoleResourceAll
      .filter((userGroupRoleResource) => {
        const { appId, user, group, role, resource, allowOrDeny } = userGroupRoleResource;
        return commonAuthList.findIndex(commonAuth =>
          appId == commonAuth.appId && user == commonAuth.user &&
          group == commonAuth.group && role == commonAuth.role &&
          resource == commonAuth.resource && allowOrDeny == commonAuth.allowOrDeny) == -1;
      });
    if (userGroupRoleResourceDelete.length > 0) {
      const userGroupRoleResourceDeleteIdList = userGroupRoleResourceDelete.map(e => e.id);
      await jianghuKnex('enterprise_user_group_role_resource').whereIn('id', userGroupRoleResourceDeleteIdList).delete();
    }

    userGroupRolePageAll = await jianghuKnex('enterprise_user_group_role_page').where({ source }).select();
    userGroupRoleResourceAll = await jianghuKnex('enterprise_user_group_role_resource').where({ source }).select();


    // enterprise_user_group_role_page     通用权限 生成
    // enterprise_user_group_role_resource 通用权限 生成
    const userGroupRolePageInsertList = [];
    const userGroupRoleResouceInsertList = [];
    for (const commonAuth of commonAuthList) {
      const { appId, user, group, role, page, resource, allowOrDeny } = commonAuth;
      const userGroupRolePageOld = userGroupRolePageAll.find(item => item.appId === appId && item.user === user && item.group === group && item.role === role);
      if (!userGroupRolePageOld) {
        userGroupRolePageInsertList.push({ source, appId, user, group, role, page, allowOrDeny });
      }
      const userGroupRoleResourceOld = userGroupRoleResourceAll.find(item => item.appId === appId && item.user === user && item.group === group && item.role === role);
      if (!userGroupRoleResourceOld) {
        userGroupRoleResouceInsertList.push({ source, appId, user, group, role, resource, allowOrDeny });
      }
    }
    logger.info('[schedule/enterpriseAuthBuild.js]______', { '通用权限新增数': userGroupRolePageInsertList.length, '通用权限删除数': userGroupRolePageDelete.length });
    if (userGroupRolePageInsertList.length > 0) {
      await jianghuKnex('enterprise_user_group_role_page').insert(userGroupRolePageInsertList);
    }
    if (userGroupRoleResouceInsertList.length > 0) {
      await jianghuKnex('enterprise_user_group_role_resource').insert(userGroupRoleResouceInsertList);
    }
    return;
  }

  async buildUserApp(targetUserId) {
    const { jianghuKnex, logger } = this.app;

    const searchWhere = {};
    if (targetUserId) { searchWhere.userId = targetUserId; }
    const userAppAll = await jianghuKnex('enterprise_user_app').where(searchWhere).select();
    const userInfoList = await jianghuKnex('_user').where(searchWhere).select();
    const userGroupRolePageAll = await jianghuKnex('enterprise_user_group_role_page').where({}).select();
    const userGroupRoleAll = await jianghuKnex('enterprise_user_group_role').where(searchWhere).select();
    userInfoList.forEach(userInfo => {
      userInfo.groupList = userGroupRoleAll.filter(e => e.userId === userInfo.userId);
      userInfo.groupList.push({ groupId: 'login', roleId: '*' });
    })

    const appList = await jianghuKnex('enterprise_app').select();
    const appIdList = appList.map(e => e.appId);

    const insertUserAppList = []
    for (const userGroupRolePage of userGroupRolePageAll) {
      const { appId, user, group, role } = userGroupRolePage;
      if (!appIdList.find(e => e === appId)) {
        continue;
      }
      for (const userInfo of userInfoList) {
        const { userId, groupList } = userInfo;
        const userIsAccess = checkResource(userId, user);
        const groupIsAccess = groupList.find(g => checkResource(g.groupId, group) && checkResource(g.roleId, role));
        const userAppOld = userAppAll.find(item => item.appId === appId && item.userId === userId);
        if (userAppOld && userIsAccess && groupIsAccess) {
          userAppOld.dontDelete = true;
        }
        if (userIsAccess && groupIsAccess) {
          if (!userAppOld) {
            insertUserAppList.push({ appId, userId, source: '用户APP权限' });
          }
        }
      }
    }

    const supperAdminUserList = userGroupRoleAll.filter(e => e.groupId === '超级管理员');
    for (const appId of appIdList) {
      for (const userInfo of supperAdminUserList) {
        const { userId } = userInfo;
        const userAppOld = userAppAll.find(item => item.appId === appId && item.userId === userId);
        if (userAppOld) {
          userAppOld.dontDelete = true;
        }
        if (!userAppOld) {
          insertUserAppList.push({ appId, userId, source: '用户APP权限' });
        }
      }
    }
    const insertUserAppListUniq = _.uniqBy(insertUserAppList, e => `${e.userId}---${e.appId}`);
    const deleteUserAppIdList = userAppAll.filter(e => !e.dontDelete).map(e => e.id);
    logger.info('[schedule/enterpriseAuthBuild.js]______', { '用户APP权限新增数': insertUserAppListUniq.length, '用户APP权限删除数': deleteUserAppIdList.length });
    if (insertUserAppListUniq.length > 0) {
      await jianghuKnex('enterprise_user_app').insert(insertUserAppListUniq);
    }
    if (deleteUserAppIdList.length > 0) {
      await jianghuKnex('enterprise_user_app').whereIn('id', deleteUserAppIdList).delete();
    }

  }

  async removeRelationByExpire() {
    const { jianghuKnex, logger } = this.app;
    let today = dayjs().format('YYYY-MM-DD')
    const userRoleList = await jianghuKnex('enterprise_user_group_role')
      .where('roleDeadline', '<', today)
      .where('roleDeadline', '<>', '-1')
      .select();

    // enterprise_user_group_role
    await jianghuKnex('enterprise_user_group_role')
      .where('roleDeadline', '<', today)
      .where('roleDeadline', '<>', '-1')
      .jhDelete();

    // enterprise_user_app
    logger.info('[schedule/enterpriseAuthBuild.js]______', { '临时职位删除个数': userRoleList.length });
    if (userRoleList.length > 0) {
      for (const i of userRoleList) {
        await jianghuKnex('enterprise_user_app')
          .where({ userId: i.userId, roleId: i.roleId, groupId: i.groupId })
          .jhDelete();
      }
    }
  }
}



module.exports = AppService;
