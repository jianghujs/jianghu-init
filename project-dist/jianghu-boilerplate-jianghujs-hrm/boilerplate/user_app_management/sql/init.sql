# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _app
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_app`;
CREATE TABLE `_app` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appId` varchar(255) DEFAULT NULL COMMENT 'appId',
  `appGroup` varchar(255) DEFAULT NULL COMMENT 'app组',
  `appName` varchar(255) DEFAULT NULL COMMENT 'app名',
  `appDesc` varchar(255) DEFAULT NULL COMMENT 'app描述',
  `appUrl` varchar(255) DEFAULT NULL COMMENT 'app链接',
  `appMenu` text COMMENT 'app菜单',
  `appType` varchar(255) DEFAULT 'internal' COMMENT '应用类型：internal，external',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  `sort` int(11) DEFAULT NULL COMMENT '排序',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `appId` (`appId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23;


INSERT INTO `_app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (12,'user_app_management','base','账号权限管理',NULL,NULL,NULL,'internal','insert',NULL,NULL,NULL,NULL);
INSERT INTO `_app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (13,'data_repository','base','数据中心管理',NULL,NULL,NULL,'internal','insert',NULL,NULL,NULL,NULL);
INSERT INTO `_app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (14,'directory','base','APP目录',NULL,NULL,NULL,'internal','insert',NULL,NULL,NULL,NULL);
INSERT INTO `_app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (18,'1table-crud',NULL,'小APPDemo项目',NULL,NULL,NULL,'internal','jhInsert','admin','系统管理员','2022-02-24T20:18:14+08:00',NULL);
INSERT INTO `_app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (19,'test',NULL,'uiAction23',NULL,NULL,NULL,'internal','jhUpdate','admin','系统管理员','2022-09-08T15:13:22+08:00',NULL);
INSERT INTO `_app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (20,NULL,NULL,'0908',NULL,NULL,NULL,'internal','jhUpdate','admin','系统管理员','2022-09-08T14:54:51+08:00',NULL);
INSERT INTO `_app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (21,'test',NULL,'123456',NULL,NULL,NULL,'external','jhInsert','admin','系统管理员','2022-09-08T14:55:07+08:00',NULL);
INSERT INTO `_app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (22,'090909',NULL,'090909',NULL,NULL,NULL,'internal','jhInsert','admin','系统管理员','2022-09-09T16:26:10+08:00',NULL);

DELIMITER ;;
CREATE TRIGGER `jianghujs_hrm_user_app_management`.`jianghujs_hrm_user_app_management___app_INSERT` AFTER INSERT
        ON `jianghujs_hrm_user_app_management`.`_app` FOR EACH ROW
        BEGIN
            INSERT INTO `jianghujs_hrm_data_repository`.`jianghujs_hrm_user_app_management___app`
            (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`)
            VALUES
            (NEW.`id`,NEW.`appId`,NEW.`appGroup`,NEW.`appName`,NEW.`appDesc`,NEW.`appUrl`,NEW.`appMenu`,NEW.`appType`,NEW.`operation`,NEW.`operationByUserId`,NEW.`operationByUser`,NEW.`operationAt`,NEW.`sort`);
        END;;
DELIMITER ;


DELIMITER ;;
CREATE TRIGGER `jianghujs_hrm_user_app_management`.`jianghujs_hrm_user_app_management___app_UPDATE` AFTER UPDATE
        ON `jianghujs_hrm_user_app_management`.`_app` FOR EACH ROW
        BEGIN
            UPDATE `jianghujs_hrm_data_repository`.`jianghujs_hrm_user_app_management___app`
            SET `id`=NEW.`id`,`appId`=NEW.`appId`,`appGroup`=NEW.`appGroup`,`appName`=NEW.`appName`,`appDesc`=NEW.`appDesc`,`appUrl`=NEW.`appUrl`,`appMenu`=NEW.`appMenu`,`appType`=NEW.`appType`,`operation`=NEW.`operation`,`operationByUserId`=NEW.`operationByUserId`,`operationByUser`=NEW.`operationByUser`,`operationAt`=NEW.`operationAt`,`sort`=NEW.`sort`
            where id=OLD.id;
        END;;
DELIMITER ;


DELIMITER ;;
CREATE TRIGGER `jianghujs_hrm_user_app_management`.`jianghujs_hrm_user_app_management___app_DELETE` AFTER DELETE
        ON `jianghujs_hrm_user_app_management`.`_app` FOR EACH ROW
        BEGIN
            DELETE FROM `jianghujs_hrm_data_repository`.`jianghujs_hrm_user_app_management___app` WHERE id = OLD.id;
        END;;
DELIMITER ;



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _cache
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_cache`;
CREATE TABLE `_cache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL COMMENT '用户Id',
  `content` longtext COMMENT '缓存数据',
  `recordStatus` varchar(255) DEFAULT 'active',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB COMMENT = '缓存表';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_group`;
CREATE TABLE `_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupId` varchar(255) NOT NULL COMMENT 'groupId',
  `groupName` varchar(255) DEFAULT NULL COMMENT '群组名',
  `groupDesc` varchar(255) DEFAULT NULL COMMENT '群组描述',
  `groupAvatar` varchar(255) DEFAULT NULL COMMENT '群logo',
  `groupExtend` varchar(1024) DEFAULT '{}' COMMENT '拓展字段; { groupNotice: ''xx'' }',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `groupId_index` (`groupId`) USING BTREE
) ENGINE = InnoDB COMMENT = '群组表; 软删除未启用;';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _page
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_page`;
CREATE TABLE `_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) DEFAULT NULL COMMENT 'pageId',
  `pageName` varchar(255) DEFAULT NULL COMMENT 'page name',
  `pageFile` varchar(255) DEFAULT NULL COMMENT 'page文件指定; 默认使用pageId.html',
  `pageType` varchar(255) DEFAULT NULL COMMENT '页面类型; showInMenu, dynamicInMenu',
  `sort` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 37 COMMENT = '页面表; 软删除未启用;';



INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'help','帮助','helpV3','dynamicInMenu','0','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'login','登陆','loginV3','','','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (27,'userManagement','用户管理',NULL,'showInMenu','3','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (31,'appManagement','App管理',NULL,'showInMenu','5','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (35,'appManagementOfOneUser','用户的App权限管理',NULL,'dynamicInMenu','4','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (36,'userManagementOfOneApp','App的用户权限管理',NULL,'dynamicInMenu','6','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _record_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_record_history`;
CREATE TABLE `_record_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(255) DEFAULT NULL COMMENT '表',
  `recordId` int(11) DEFAULT NULL COMMENT '数据在table中的主键id; recordContent.id',
  `recordContent` text COMMENT '数据',
  `packageContent` text COMMENT '当时请求的 package JSON',
  `operation` varchar(255) DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `index_record_id` (`recordId`) USING BTREE,
  KEY `index_table_action` (`table`, `operation`) USING BTREE
) ENGINE = InnoDB COMMENT = '数据历史表';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _resource
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_resource`;
CREATE TABLE `_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accessControlTable` varchar(255) DEFAULT NULL COMMENT '数据规则控制表',
  `resourceHook` text COMMENT '[ "before": {"service": "xx", "serviceFunction": "xxx"}, "after": [] }',
  `pageId` varchar(255) DEFAULT NULL COMMENT 'page id; E.g: index',
  `actionId` varchar(255) DEFAULT NULL COMMENT 'action id; E.g: selectXXXByXXX',
  `desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `resourceType` varchar(255) DEFAULT NULL COMMENT 'resource 类型; E.g: auth service sql',
  `appDataSchema` text COMMENT 'appData 参数校验',
  `resourceData` text COMMENT 'resource 数据; { "service": "auth", "serviceFunction": "passwordLogin" } or  { "table": "${tableName}", "action": "select", "whereCondition": ".where(function() {this.whereNot( { recordStatus: \\"active\\" })})" }',
  `requestDemo` text COMMENT '请求Demo',
  `responseDemo` text COMMENT '响应Demo',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 375 COMMENT = '请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';



INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (231,NULL,NULL,'login','passwordLogin','✅登陆','service','{}','{ \"service\": \"user\", \"serviceFunction\": \"passwordLogin\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (251,NULL,NULL,'allPage','logout','✅登出','service','{}','{ \"service\": \"user\", \"serviceFunction\": \"logout\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (253,NULL,NULL,'allPage','userInfo','✅获取用户信息','service','{}','{ \"service\": \"user\", \"serviceFunction\": \"userInfo\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (312,NULL,NULL,'userManagement','insertItem','✅用户管理页-创建用户','service','{}','{ \"service\": \"userManagement\", \"serviceFunction\": \"addUser\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (313,NULL,NULL,'userManagement','updateItem','✅用户管理页-修改用户信息','sql','{}','{ \"table\": \"_user\", \"operation\": \"update\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (314,NULL,NULL,'userManagement','selectItemList','✅用户管理页-查询用户列表','sql','{}','{ \"table\": \"_user\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (315,NULL,NULL,'userManagement','resetUserPassword','✅用户管理页-修改用户密码','service','{}','{ \"service\": \"userManagement\", \"serviceFunction\": \"resetUserPassword\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (317,NULL,NULL,'appManagement','selectItemList','✅APP管理-查询APP列表','sql','{}','{ \"table\": \"_app\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (318,NULL,NULL,'appManagement','updateItem','✅APP管理-更新','sql','{}','{ \"table\": \"_app\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (319,NULL,NULL,'appManagement','insertItem','✅APP管理-创建APP','sql','{}','{ \"table\": \"_app\", \"operation\": \"jhInsert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (320,NULL,NULL,'appManagement','deleteItem','✅APP管理-删除APP','sql','{}','{ \"table\": \"_app\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (361,NULL,NULL,'appManagementOfOneUser','selectItemList','✅用户的App权限管理-查询列表','sql','{}','{ \"table\": \"_view02_user_app\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (362,NULL,NULL,'appManagementOfOneUser','insertItem','✅用户的App权限管理-添加','sql','{}','{ \"table\": \"_user_app\", \"operation\": \"jhInsert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (363,NULL,NULL,'appManagementOfOneUser','deleteItem','✅用户的App权限管理-删除','sql','{}','{ \"table\": \"_user_app\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (364,NULL,'','appManagementOfOneUser','selectAppItemList','✅用户的App权限管理-查询APP列表','sql','{}','{ \"table\": \"_app\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (371,NULL,NULL,'userManagementOfOneApp','selectItemList','✅App的用户权限管理-查询列表','sql','{}','{ \"table\": \"_view02_user_app\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (372,NULL,NULL,'userManagementOfOneApp','insertItem','✅App的用户权限管理-添加','sql','{}','{ \"table\": \"_user_app\", \"operation\": \"jhInsert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (373,NULL,NULL,'userManagementOfOneApp','deleteItem','✅App的用户权限管理-删除','sql','{}','{ \"table\": \"_user_app\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (374,NULL,'','userManagementOfOneApp','selectAppItemList','✅App的用户权限管理-查询APP列表','sql','{}','{ \"table\": \"_user\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_role`;
CREATE TABLE `_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` varchar(255) DEFAULT NULL COMMENT 'roleId',
  `roleName` varchar(255) DEFAULT NULL COMMENT 'role name',
  `roleDesc` varchar(255) DEFAULT NULL COMMENT 'role desc',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 COMMENT = '角色表; 软删除未启用;';



INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'appAdmin','系统管理员','','insert',NULL,NULL,NULL);
INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'boss','掌门','','insert',NULL,NULL,NULL);
INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (7,'disciple','门徒','','insert',NULL,NULL,NULL);



DROP TABLE IF EXISTS `_test_case`;
CREATE TABLE `_test_case` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`pageId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '页面Id',
`testId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '测试用例Id; 10000 ++',
`testName` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '测试用例名',
`uiActionIdList` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'uiAction列表; 一个测试用例对应多个uiActionId',
`testOpeartion` text COLLATE utf8mb4_bin COMMENT '测试用例步骤;',
`expectedResult` text COLLATE utf8mb4_bin COMMENT '期望结果',
`operation` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
`operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
`operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
`operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='测试用例表';


# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _ui
# ------------------------------------------------------------


DROP TABLE IF EXISTS `_ui`;
CREATE TABLE `_ui` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) DEFAULT NULL COMMENT 'page id; E.g: index',
  `uiActionType` varchar(255) DEFAULT NULL COMMENT 'ui 动作类型，如：fetchData, postData, changeUi',
  `uiActionId` varchar(255) DEFAULT NULL COMMENT 'action id; E.g: selectXXXByXXX',
  `desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `uiActionConfig` text COMMENT 'ui 动作数据',
  `appDataSchema` text COMMENT 'ui 校验数据',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB COMMENT = 'ui 施工方案';






# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user`;
CREATE TABLE `_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` varchar(255) DEFAULT NULL COMMENT '自增id; 用于生成userId',
  `userId` varchar(255) DEFAULT NULL COMMENT '主键id',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名(登陆)',
  `clearTextPassword` varchar(255) DEFAULT NULL COMMENT '明文密码',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `md5Salt` varchar(255) DEFAULT NULL COMMENT 'md5Salt',
  `userStatus` varchar(255) DEFAULT 'active' COMMENT '用户账号状态：活跃或关闭',
  `userType` varchar(255) DEFAULT NULL COMMENT '用户类型; staff, student.',
  `userConfig` text COMMENT '配置信息',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username_index` (`username`) USING BTREE,
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 60 COMMENT = '用户表';



INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (42,'111','admin','系统管理员','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','common',NULL,'update',NULL,NULL,'2022-02-19T15:02:24+08:00');
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (43,NULL,'W00001','张三丰','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'update','admin','系统管理员','2022-02-19T15:18:42+08:00');
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (44,NULL,'W00002','张无忌','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'update','admin','系统管理员','2022-02-19T15:45:14+08:00');
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (45,NULL,'G00001','洪七公','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (46,NULL,'G00002','郭靖','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'update','admin','系统管理员','2022-05-03T13:45:14+08:00');
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (47,NULL,'H00001','岳不群','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (48,NULL,'H00002','令狐冲','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (58,'112','U223P','uiaction123','12345678','31166f44402dedbf27c9b2d4bcfa90cb','ajGTYtmy4cNH','banned','common',NULL,'update','admin','系统管理员','2022-09-09T16:03:56+08:00');
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (59,'113','U224R','0909','123456','8146695749e5e774d1904e6c5bc21e74','rYnxj8ABbbCd','active','common',NULL,'insert','admin','系统管理员','2022-09-09T16:21:39+08:00');

DELIMITER ;;
CREATE TRIGGER `jianghujs_hrm_user_app_management`.`jianghujs_hrm_user_app_management___user_INSERT` AFTER INSERT
        ON `jianghujs_hrm_user_app_management`.`_user` FOR EACH ROW
        BEGIN
            INSERT INTO `jianghujs_hrm_data_repository`.`jianghujs_hrm_user_app_management___user`
            (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`)
            VALUES
            (NEW.`id`,NEW.`idSequence`,NEW.`userId`,NEW.`username`,NEW.`clearTextPassword`,NEW.`password`,NEW.`md5Salt`,NEW.`userStatus`,NEW.`userType`,NEW.`userConfig`,NEW.`operation`,NEW.`operationByUserId`,NEW.`operationByUser`,NEW.`operationAt`);
        END;;
DELIMITER ;


DELIMITER ;;
CREATE TRIGGER `jianghujs_hrm_user_app_management`.`jianghujs_hrm_user_app_management___user_UPDATE` AFTER UPDATE
        ON `jianghujs_hrm_user_app_management`.`_user` FOR EACH ROW
        BEGIN
            UPDATE `jianghujs_hrm_data_repository`.`jianghujs_hrm_user_app_management___user`
            SET `id`=NEW.`id`,`idSequence`=NEW.`idSequence`,`userId`=NEW.`userId`,`username`=NEW.`username`,`clearTextPassword`=NEW.`clearTextPassword`,`password`=NEW.`password`,`md5Salt`=NEW.`md5Salt`,`userStatus`=NEW.`userStatus`,`userType`=NEW.`userType`,`userConfig`=NEW.`userConfig`,`operation`=NEW.`operation`,`operationByUserId`=NEW.`operationByUserId`,`operationByUser`=NEW.`operationByUser`,`operationAt`=NEW.`operationAt`
            where id=OLD.id;
        END;;
DELIMITER ;


DELIMITER ;;
CREATE TRIGGER `jianghujs_hrm_user_app_management`.`jianghujs_hrm_user_app_management___user_DELETE` AFTER DELETE
        ON `jianghujs_hrm_user_app_management`.`_user` FOR EACH ROW
        BEGIN
            DELETE FROM `jianghujs_hrm_data_repository`.`jianghujs_hrm_user_app_management___user` WHERE id = OLD.id;
        END;;
DELIMITER ;



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user_app
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user_app`;
CREATE TABLE `_user_app` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) DEFAULT NULL COMMENT '用户id',
  `appId` varchar(255) DEFAULT NULL COMMENT 'appId',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 153;



INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (62,'admin','data_repository','insert',NULL,NULL,NULL);
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (63,'admin','directory','insert',NULL,NULL,NULL);
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (68,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:53:46+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (69,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:53:47+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (70,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:53:49+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (71,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:55:10+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (72,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:55:12+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (73,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:55:13+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (74,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:56:34+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (75,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:56:35+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (76,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:56:36+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (77,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:57:51+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (78,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:57:52+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (79,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:57:53+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (109,'admin','1table-crud','jhInsert','admin','系统管理员','2022-09-09T16:13:16+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (133,'admin','test','jhInsert','admin','系统管理员','2022-09-09T16:24:08+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (135,'W00002','null','jhInsert','admin','系统管理员','2022-09-09T16:25:18+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (139,'W00002','null','jhInsert','admin','系统管理员','2022-09-09T16:25:35+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (141,'admin','null','jhInsert','admin','系统管理员','2022-09-09T16:25:35+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (148,'admin','090909','jhInsert','admin','系统管理员','2022-09-09T16:26:27+08:00');
INSERT INTO `_user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (152,'U224R','090909','jhInsert','admin','系统管理员','2022-09-09T16:27:03+08:00');

DELIMITER ;;
CREATE TRIGGER `jianghujs_hrm_user_app_management`.`jianghujs_hrm_user_app_management___user_app_INSERT` AFTER INSERT
        ON `jianghujs_hrm_user_app_management`.`_user_app` FOR EACH ROW
        BEGIN
            INSERT INTO `jianghujs_hrm_data_repository`.`jianghujs_hrm_user_app_management___user_app`
            (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`)
            VALUES
            (NEW.`id`,NEW.`userId`,NEW.`appId`,NEW.`operation`,NEW.`operationByUserId`,NEW.`operationByUser`,NEW.`operationAt`);
        END;;
DELIMITER ;


DELIMITER ;;
CREATE TRIGGER `jianghujs_hrm_user_app_management`.`jianghujs_hrm_user_app_management___user_app_UPDATE` AFTER UPDATE
        ON `jianghujs_hrm_user_app_management`.`_user_app` FOR EACH ROW
        BEGIN
            UPDATE `jianghujs_hrm_data_repository`.`jianghujs_hrm_user_app_management___user_app`
            SET `id`=NEW.`id`,`userId`=NEW.`userId`,`appId`=NEW.`appId`,`operation`=NEW.`operation`,`operationByUserId`=NEW.`operationByUserId`,`operationByUser`=NEW.`operationByUser`,`operationAt`=NEW.`operationAt`
            where id=OLD.id;
        END;;
DELIMITER ;


DELIMITER ;;
CREATE TRIGGER `jianghujs_hrm_user_app_management`.`jianghujs_hrm_user_app_management___user_app_DELETE` AFTER DELETE
        ON `jianghujs_hrm_user_app_management`.`_user_app` FOR EACH ROW
        BEGIN
            DELETE FROM `jianghujs_hrm_data_repository`.`jianghujs_hrm_user_app_management___user_app` WHERE id = OLD.id;
        END;;
DELIMITER ;



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user_app_09_12
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user_app_09_12`;
CREATE TABLE `_user_app_09_12` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) DEFAULT NULL COMMENT '用户id',
  `appId` varchar(255) DEFAULT NULL COMMENT 'appId',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 153;



INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (62,'admin','data_repository','insert',NULL,NULL,NULL);
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (63,'admin','directory','insert',NULL,NULL,NULL);
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (64,'admin','user_app_management','insert',NULL,NULL,NULL);
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (68,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:53:46+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (69,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:53:47+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (70,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:53:49+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (71,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:55:10+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (72,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:55:12+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (73,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:55:13+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (74,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:56:34+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (75,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:56:35+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (76,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:56:36+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (77,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:57:51+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (78,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:57:52+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (79,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:57:53+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (109,'admin','{{name}}','jhInsert','admin','系统管理员','2022-09-09T16:13:16+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (133,'admin','test','jhInsert','admin','系统管理员','2022-09-09T16:24:08+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (135,'W00002','null','jhInsert','admin','系统管理员','2022-09-09T16:25:18+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (139,'W00002','null','jhInsert','admin','系统管理员','2022-09-09T16:25:35+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (141,'admin','null','jhInsert','admin','系统管理员','2022-09-09T16:25:35+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (148,'admin','090909','jhInsert','admin','系统管理员','2022-09-09T16:26:27+08:00');
INSERT INTO `_user_app_09_12` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (152,'U224R','090909','jhInsert','admin','系统管理员','2022-09-09T16:27:03+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user_group_role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user_group_role`;
CREATE TABLE `_user_group_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL COMMENT '用户id',
  `groupId` varchar(255) NOT NULL COMMENT '群组Id',
  `roleId` varchar(255) DEFAULT NULL COMMENT '角色Id',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `groupId_index` (`groupId`) USING BTREE,
  KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 579 COMMENT = '用户群组角色关联表; 软删除未启用;';



INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (568,'admin','adminGroup','appAdmin','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (569,'W00001','wudang','boss','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (570,'W00002','wudang','disciple','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (573,'G00001','gaibang','boss','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (574,'G00002','gaibang','disciple','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (577,'H00001','huashan','boss','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (578,'H00002','huashan','disciple','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user_group_role_page
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user_group_role_page`;
CREATE TABLE `_user_group_role_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL COMMENT 'userId 或者 通配符; 通配符: *',
  `group` varchar(255) DEFAULT NULL COMMENT 'groupId 或者 通配符; 通配符: *',
  `role` varchar(255) DEFAULT NULL COMMENT 'roleId 或者 通配符; 通配符: *',
  `page` varchar(255) DEFAULT NULL COMMENT 'pageId id',
  `allowOrDeny` varchar(255) DEFAULT NULL COMMENT '用户群组角色 匹配后 执行动作; allow、deny',
  `desc` varchar(255) DEFAULT NULL COMMENT '映射描述',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 COMMENT = '用户群组角色 - 页面 映射表; 软删除未启用;';



INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'*','public','*','login','allow','登陆页面; 开放所有用户;','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'*','login','*','help,manual','allow','工具页; 开放给登陆用户;','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'*','login','*','*','allow','所有页面; 开放给登陆用户;','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user_group_role_resource
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user_group_role_resource`;
CREATE TABLE `_user_group_role_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL COMMENT 'userId 或者 通配符; 通配符: *',
  `group` varchar(255) DEFAULT NULL COMMENT 'groupId 或者 通配符; 通配符: *',
  `role` varchar(255) DEFAULT NULL COMMENT 'roleId 或者 通配符; 通配符: *',
  `resource` varchar(255) DEFAULT NULL COMMENT 'resourceId 或者 通配符; 通配符: *, !resourceId',
  `allowOrDeny` varchar(255) DEFAULT NULL COMMENT '用户群组角色 匹配后 执行动作; allow、deny',
  `desc` varchar(255) DEFAULT NULL COMMENT '映射描述',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 COMMENT = '用户群组角色 - 请求资源 映射表; 软删除未启用;';



INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'*','public','*','login.passwordLogin','allow','登陆resource, 开放给所有用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'*','login','*','allPage.*','allow','工具类resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'*','login','*','*','allow','所有resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _user_session
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_user_session`;
CREATE TABLE `_user_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) DEFAULT NULL COMMENT '用户id',
  `userIp` varchar(255) DEFAULT NULL COMMENT '用户ip',
  `userIpRegion` varchar(255) DEFAULT NULL COMMENT '用户Ip区域',
  `userAgent` text COMMENT '请求的 agent',
  `deviceId` varchar(255) DEFAULT NULL COMMENT '设备id',
  `deviceType` varchar(255) DEFAULT 'web' COMMENT '设备类型; flutter, web, bot_databot, bot_chatbot, bot_xiaochengxu',
  `socketStatus` varchar(255) DEFAULT 'offline' COMMENT 'socket状态',
  `authToken` varchar(255) DEFAULT NULL COMMENT 'auth token',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `userId_index` (`userId`) USING BTREE,
  KEY `userId_deviceId_index` (`userId`, `deviceId`) USING BTREE,
  KEY `authToken_index` (`authToken`) USING BTREE
) ENGINE = InnoDB COMMENT = '用户session表; deviceId 维度;软删除未启用;';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _view01_user
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `_view01_user` AS
select
  `_user`.`id` AS `id`,
  `_user`.`idSequence` AS `idSequence`,
  `_user`.`userId` AS `userId`,
  `_user`.`username` AS `username`,
  `_user`.`clearTextPassword` AS `clearTextPassword`,
  `_user`.`password` AS `password`,
  `_user`.`md5Salt` AS `md5Salt`,
  `_user`.`userStatus` AS `userStatus`,
  `_user`.`userType` AS `userType`,
  `_user`.`userConfig` AS `userConfig`,
  `_user`.`operation` AS `operation`,
  `_user`.`operationByUserId` AS `operationByUserId`,
  `_user`.`operationByUser` AS `operationByUser`,
  `_user`.`operationAt` AS `operationAt`
from
  `_user`;





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _view02_user_app
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `_view02_user_app` AS
select
  `_user_app`.`id` AS `id`,
  `_app`.`appId` AS `appId`,
  `_app`.`appName` AS `appName`,
  `_user`.`userId` AS `userId`,
  `_user`.`username` AS `username`,
  `_user`.`userStatus` AS `userStatus`,
  `_user`.`userType` AS `userType`,
  `_user_app`.`operation` AS `operation`,
  `_user_app`.`operationByUserId` AS `operationByUserId`,
  `_user_app`.`operationByUser` AS `operationByUser`,
  `_user_app`.`operationAt` AS `operationAt`
from
  (
  (
    `_user_app`
    join `_user` on((`_user_app`.`userId` = `_user`.`userId`))
  )
  join `_app` on((`_user_app`.`appId` = `_app`.`appId`))
  );





