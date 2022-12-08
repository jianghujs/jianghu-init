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
  PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT = '缓存表';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _constant
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_constant`;
CREATE TABLE `_constant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `constantKey` varchar(255) DEFAULT NULL,
  `constantType` varchar(255) DEFAULT NULL COMMENT '常量类型; object, array',
  `desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `constantValue` text COMMENT '常量内容; object, array',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB COMMENT = '常量表; 软删除未启用;';






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
  PRIMARY KEY (`id`),
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
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 40 COMMENT = '页面表; 软删除未启用;';



INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'help','帮助','helpV3','dynamicInMenu','11','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'login','登陆','loginV3','','','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (36,'studentManagement','学生管理-学生的增删改查页面',NULL,'showInMenu','5','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (37,'classManagement','班级管理-班级的增删改查页面',NULL,'showInMenu','5','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (38,'studentManagementOfOneClass','班级的学生管理',NULL,'dynamicInMenu','5','jhInsert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (39,'classManagementOfOneStudent','学生的班级管理',NULL,'dynamicInMenu','5','jhInsert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _record_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_record_history`;
CREATE TABLE `_record_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(255) DEFAULT NULL COMMENT '表',
  `recordId` int(11) DEFAULT NULL COMMENT '数据在table中的主键id; recordContent.id',
  `recordContent` text NOT NULL COMMENT '数据',
  `packageContent` text NOT NULL COMMENT '当时请求的 package JSON',
  `operation` varchar(255) DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `index_record_id` (`recordId`),
  KEY `index_table_action` (`table`, `operation`)
) ENGINE = InnoDB AUTO_INCREMENT = 59 COMMENT = '数据历史表';




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
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 383 COMMENT = '请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';



INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (231,NULL,NULL,'login','passwordLogin','✅登陆','service','{}','{\"service\": \"user\", \"serviceFunction\": \"passwordLogin\"}','','','update',NULL,NULL,'2022-04-27T15:32:57+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (251,NULL,NULL,'allPage','logout','✅登出','service','{}','{\"service\": \"user\", \"serviceFunction\": \"logout\"}','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (253,NULL,NULL,'allPage','userInfo','✅获取用户信息','service','{}','{\"service\": \"user\", \"serviceFunction\": \"userInfo\"}','','','update',NULL,NULL,'2022-04-27T15:37:21+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (258,NULL,NULL,'allPage','getConstantList','✅查询常量','sql','{}','{\"table\": \"_constant\", \"operation\": \"select\"}','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (365,NULL,NULL,'studentManagement','selectItemList','✅studentManagement查询-查询列表','sql','{}','{ \"table\": \"student\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (366,NULL,NULL,'studentManagement','insertItem','✅studentManagement查询-添加成员','sql','{}','{ \"table\": \"student\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (367,NULL,NULL,'studentManagement','updateItem','✅studentManagement查询-更新成员','sql','{}','{ \"table\": \"student\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (368,NULL,NULL,'studentManagement','deleteItem','✅studentManagement查询-删除信息','sql','{}','{ \"table\": \"student\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (369,NULL,NULL,'classManagement','selectItemList','✅classManagement查询-查询列表','sql','{}','{ \"table\": \"class\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (370,NULL,NULL,'classManagement','insertItem','✅classManagement查询-添加成员','sql','{}','{ \"table\": \"class\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (371,NULL,NULL,'classManagement','updateItem','✅classManagement查询-更新成员','sql','{}','{ \"table\": \"class\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (372,NULL,NULL,'classManagement','deleteItem','✅classManagement查询-删除信息','sql','{}','{ \"table\": \"class\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (373,NULL,NULL,'studentManagementOfOneClass','selectCurrentList','✅班级的学生管理-查询当前学生下的班级列表','sql','{}','{ \"table\": \"view01_student_class\", \"operation\": \"select\" }','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (374,NULL,NULL,'studentManagementOfOneClass','insertItem','✅班级的学生管理-建立关系','sql','{}','{ \"table\": \"student_class\", \"operation\": \"jhInsert\" }','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (375,NULL,NULL,'studentManagementOfOneClass','updateItem','✅班级的学生管理-更新数据','sql','{}','{ \"table\": \"student_class\", \"operation\": \"jhUpdate\" }','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (376,NULL,NULL,'studentManagementOfOneClass','deleteItem','✅班级的学生管理-删除信息','sql','{}','{ \"table\": \"student_class\", \"operation\": \"jhDelete\" }','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (377,NULL,NULL,'studentManagementOfOneClass','selectAllList','✅班级查询-查询列表','sql','{}','{ \"table\": \"student\", \"operation\": \"select\" }','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (378,NULL,NULL,'classManagementOfOneStudent','selectCurrentList','✅学生的班级管理-查询当前班级下的学生列表','sql','{}','{ \"table\": \"view01_student_class\", \"operation\": \"select\" }','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (379,NULL,NULL,'classManagementOfOneStudent','insertItem','✅学生的班级管理-建立关系','sql','{}','{ \"table\": \"student_class\", \"operation\": \"jhInsert\" }','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (380,NULL,NULL,'classManagementOfOneStudent','updateItem','✅学生的班级管理-更新数据','sql','{}','{ \"table\": \"student_class\", \"operation\": \"jhUpdate\" }','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (381,NULL,NULL,'classManagementOfOneStudent','deleteItem','✅学生的班级管理-删除信息','sql','{}','{ \"table\": \"student_class\", \"operation\": \"jhDelete\" }','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (382,NULL,NULL,'classManagementOfOneStudent','selectAllList','✅学生查询-查询列表','sql','{}','{ \"table\": \"class\", \"operation\": \"select\" }','','','jhInsert',NULL,NULL,NULL);



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
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 COMMENT = '角色表; 软删除未启用;';



INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'administrator','系统管理员','','insert',NULL,NULL,NULL);
INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'boss','掌门','','insert',NULL,NULL,NULL);
INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (7,'disciple','门徒','','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _test_case
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_test_case`;
CREATE TABLE `_test_case` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) DEFAULT NULL COMMENT '页面Id',
  `testId` varchar(255) DEFAULT NULL COMMENT '测试用例Id; 10000 ++',
  `testName` varchar(255) DEFAULT NULL COMMENT '测试用例名',
  `uiActionIdList` varchar(255) DEFAULT NULL COMMENT 'uiAction列表; 一个测试用例对应多个uiActionId',
  `testOpeartion` text COMMENT '测试用例步骤;',
  `expectedResult` text COMMENT '期望结果',
  `operation` varchar(255) DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 197 COMMENT = '测试用例表';






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
  PRIMARY KEY (`id`)
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
  `config` mediumtext COMMENT '配置信息',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_index` (`username`),
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 49 COMMENT = '用户表';



INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (42,NULL,'admin','系统管理员','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (43,NULL,'W00001','张三丰','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (44,NULL,'W00002','张无忌','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (45,NULL,'G00001','洪七公','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (46,NULL,'G00002','郭靖','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (47,NULL,'H00001','岳不群','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (48,NULL,'H00002','令狐冲','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);



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
  PRIMARY KEY (`id`),
  KEY `groupId_index` (`groupId`),
  KEY `userId_index` (`userId`)
) ENGINE = InnoDB AUTO_INCREMENT = 579 COMMENT = '用户群组角色关联表; 软删除未启用;';



INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (568,'admin','adminGroup','administrator','insert',NULL,NULL,NULL);
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
  PRIMARY KEY (`id`)
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
  PRIMARY KEY (`id`)
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
  PRIMARY KEY (`id`),
  KEY `userId_index` (`userId`),
  KEY `userId_deviceId_index` (`userId`, `deviceId`) USING BTREE,
  KEY `authToken_index` (`authToken`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 COMMENT = '用户session表; deviceId 维度;软删除未启用;';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: access_control_student
# ------------------------------------------------------------

DROP TABLE IF EXISTS `access_control_student`;
CREATE TABLE `access_control_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) DEFAULT NULL COMMENT '主键id',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名(登陆)',
  `resourceData` varchar(255) DEFAULT NULL COMMENT '明文密码',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_index` (`username`),
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 52 COMMENT = '学生表的 accessControl 表';



INSERT INTO `access_control_student` (`id`,`userId`,`username`,`resourceData`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (50,'G00001','洪七公','{ \"where\":{\"level\": \"02\"} }','insert',NULL,NULL,NULL);
INSERT INTO `access_control_student` (`id`,`userId`,`username`,`resourceData`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (51,'H00001','岳不群','{ \"where\":{\"level\": \"02\"} }','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: class
# ------------------------------------------------------------

DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classId` varchar(255) DEFAULT NULL COMMENT '班级ID',
  `menPaiId` varchar(255) DEFAULT NULL COMMENT '门派ID',
  `menPaiName` varchar(255) DEFAULT NULL COMMENT '门派名',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `classStatus` varchar(255) DEFAULT 'active' COMMENT '班级状态',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 124;



INSERT INTO `class` (`id`,`classId`,`menPaiId`,`menPaiName`,`remarks`,`classStatus`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (111,'武当01班','wudang','武当',NULL,'正常','jhUpdate','admin','系统管理员','2022-09-05T16:57:01+08:00');
INSERT INTO `class` (`id`,`classId`,`menPaiId`,`menPaiName`,`remarks`,`classStatus`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (117,'丐帮01班','gaibang','丐帮',NULL,'正常','jhUpdate','W00001','张三丰','2022-04-27T19:52:53+08:00');
INSERT INTO `class` (`id`,`classId`,`menPaiId`,`menPaiName`,`remarks`,`classStatus`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (118,'丐帮02班','gaibang','丐帮',NULL,'正常','jhUpdate','W00001','张三丰','2022-04-27T19:52:53+08:00');
INSERT INTO `class` (`id`,`classId`,`menPaiId`,`menPaiName`,`remarks`,`classStatus`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (120,'华山03班','huashan','华山',NULL,'正常','jhUpdate','W00001','张三丰','2022-04-27T19:52:53+08:00');
INSERT INTO `class` (`id`,`classId`,`menPaiId`,`menPaiName`,`remarks`,`classStatus`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (122,'华山01班','huashan','华山',NULL,'正常','jhUpdate','W00001','张三丰','2022-04-27T19:52:53+08:00');
INSERT INTO `class` (`id`,`classId`,`menPaiId`,`menPaiName`,`remarks`,`classStatus`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (123,'123','武当03班','武当',NULL,'active','jhUpdate','admin','系统管理员','2022-12-08T15:18:05+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: student
# ------------------------------------------------------------

DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) DEFAULT NULL COMMENT '学生ID',
  `name` varchar(255) DEFAULT NULL COMMENT '学生名字',
  `gender` varchar(255) DEFAULT NULL COMMENT '性别',
  `dateOfBirth` varchar(255) DEFAULT NULL COMMENT '出生日期',
  `classId` varchar(255) DEFAULT NULL COMMENT '班级ID',
  `level` varchar(255) DEFAULT NULL COMMENT '年级',
  `bodyHeight` varchar(255) DEFAULT NULL COMMENT '身高',
  `studentStatus` varchar(255) DEFAULT NULL COMMENT '学生状态',
  `remarks` mediumtext COMMENT '备注',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `studentId` (`studentId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6;



INSERT INTO `student` (`id`,`studentId`,`name`,`gender`,`dateOfBirth`,`classId`,`level`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'G00001','小虾米','男',NULL,NULL,NULL,NULL,NULL,NULL,'insert','admin','系统管理员','2022-10-06T13:45:16+08:00');
INSERT INTO `student` (`id`,`studentId`,`name`,`gender`,`dateOfBirth`,`classId`,`level`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'W00001','姜小白','女',NULL,NULL,NULL,NULL,NULL,NULL,'insert','admin','系统管理员','2022-10-06T13:46:06+08:00');
INSERT INTO `student` (`id`,`studentId`,`name`,`gender`,`dateOfBirth`,`classId`,`level`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'X00001','鸣人','男',NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','admin','系统管理员','2022-12-08T13:45:32+08:00');
INSERT INTO `student` (`id`,`studentId`,`name`,`gender`,`dateOfBirth`,`classId`,`level`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4,'Z00001','佐助','男',NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','admin','系统管理员','2022-12-08T13:43:33+08:00');
INSERT INTO `student` (`id`,`studentId`,`name`,`gender`,`dateOfBirth`,`classId`,`level`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (5,'E00001','小樱','女',NULL,NULL,NULL,NULL,NULL,NULL,'insert','admin','系统管理员','2022-10-12T19:09:31+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: student_class
# ------------------------------------------------------------

DROP TABLE IF EXISTS `student_class`;
CREATE TABLE `student_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) DEFAULT NULL COMMENT '学生ID',
  `classId` varchar(255) DEFAULT NULL COMMENT '班级ID',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `studentId` (`studentId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 186;



INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (72,'H00001','华山03班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (73,'H00002','华山03班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (74,'H00003','华山03班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (75,'H00004','华山03班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (76,'H00005','华山03班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (77,'H00001','华山03班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (78,'H00001','华山01班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (79,'H00001','华山02班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (80,'H00001','华山03班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (81,'H00006','华山03班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (82,'H00006','华山01班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (83,'H00006','华山02班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (86,'111','武当02班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (89,'111','华山01班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (90,'111','华山02班','insert',NULL,NULL,NULL,NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (95,'D00001','华山03班','jhInsert','W00001','张三丰','2022-04-27T21:29:21+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (100,'D00001','华山01班','jhInsert','W00001','张三丰','2022-04-29T16:10:13+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (105,'H00001','undefined','jhInsert','W00001','张三丰','2022-05-07T21:19:22+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (109,'D00001','华山02班','jhInsert','W00001','张三丰','2022-05-07T21:40:47+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (111,'D00001','武当02班','jhInsert','W00001','张三丰','2022-05-07T21:54:40+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (120,'admin','武当02班','jhInsert','admin','系统管理员','2022-08-26T21:43:44+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (130,'100067','11150','jhInsert','admin','系统管理员','2022-09-09T02:01:14+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (131,'G00003','11150','jhInsert','admin','系统管理员','2022-09-09T02:01:14+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (132,'121432','11150','jhInsert','admin','系统管理员','2022-09-09T02:01:14+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (135,'121432','华山01班','jhInsert','admin','系统管理员','2022-09-09T02:01:57+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (136,'121432','华山03班','jhInsert','admin','系统管理员','2022-09-09T02:01:57+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (143,'admin','华山01班','jhInsert','admin','系统管理员','2022-09-09T02:06:14+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (144,'admin','华山03班','jhInsert','admin','系统管理员','2022-09-09T02:06:14+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (150,'100067','华山03班','jhInsert','admin','系统管理员','2022-09-09T02:17:28+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (151,'100067','华山01班','jhInsert','admin','系统管理员','2022-09-09T02:17:28+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (156,'121432','武当01班','jhInsert','admin','系统管理员','2022-09-09T02:23:14+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (158,'G00001','丐帮02班','jhInsert','admin','系统管理员','2022-10-06T13:45:25+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (159,'G00001','华山03班','jhInsert','admin','系统管理员','2022-10-06T13:45:25+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (160,'G00001','丐帮01班','jhInsert','admin','系统管理员','2022-10-06T13:47:02+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (161,'X00001','丐帮01班','jhInsert','admin','系统管理员','2022-10-06T13:47:19+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (162,'Z00001','1234','jhUpdate','admin','系统管理员','2022-10-20T01:59:31+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (168,'G00001','123','jhInsert','admin','系统管理员','2022-10-23T21:10:02+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (171,'Z00001','123','jhInsert','admin','系统管理员','2022-10-23T21:10:20+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (176,'E00001','华山01班','jhInsert','admin','系统管理员','2022-12-08T13:23:37+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (178,'E00001','丐帮01班','jhInsert','admin','系统管理员','2022-12-08T13:27:31+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (179,'E00001','武当01班','jhInsert','admin','系统管理员','2022-12-08T13:28:56+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (182,'E00001','华山03班','jhInsert','admin','系统管理员','2022-12-08T13:36:49+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (183,'E00001','123','jhInsert','admin','系统管理员','2022-12-08T13:39:59+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (184,'W00001','123','jhInsert','admin','系统管理员','2022-12-08T15:18:18+08:00',NULL);
INSERT INTO `student_class` (`id`,`studentId`,`classId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`remark`) VALUES (185,'X00001','123','jhInsert','admin','系统管理员','2022-12-08T15:18:26+08:00',NULL);



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
  `_user`.`config` AS `config`,
  `_user`.`operation` AS `operation`,
  `_user`.`operationByUserId` AS `operationByUserId`,
  `_user`.`operationByUser` AS `operationByUser`,
  `_user`.`operationAt` AS `operationAt`
from
  `_user`;





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_class_basic
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_class_basic` AS
select
  `class`.`id` AS `id`,
  `class`.`classId` AS `classId`,
  `class`.`menPaiId` AS `menPaiId`,
  `class`.`menPaiName` AS `menPaiName`,
  count(1) AS `count`,
  `class`.`remarks` AS `remarks`,
  `class`.`classStatus` AS `classStatus`,
  `class`.`operation` AS `operation`,
  `class`.`operationByUserId` AS `operationByUserId`,
  `class`.`operationByUser` AS `operationByUser`,
  `class`.`operationAt` AS `operationAt`
from
  (
  `class`
  left join `student_class` on((`class`.`classId` = `student_class`.`classId`))
  )
group by
  `class`.`classId`;





# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: view01_student_class
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `view01_student_class` AS
select
  distinct `student_class`.`id` AS `id`,
  `student_class`.`classId` AS `classId`,
  `student_class`.`studentId` AS `studentId`,
  `class`.`menPaiId` AS `menPaiId`,
  `class`.`menPaiName` AS `menPaiName`,
  `class`.`remarks` AS `remarks`,
  `class`.`classStatus` AS `classStatus`,
  `student`.`name` AS `name`,
  `student`.`gender` AS `gender`,
  `student`.`dateOfBirth` AS `dateOfBirth`,
  `student`.`level` AS `level`,
  `student`.`bodyHeight` AS `bodyHeight`,
  `student`.`studentStatus` AS `studentStatus`,
  `student_class`.`remark` AS `remark`,
  `student_class`.`operation` AS `operation`,
  `student_class`.`operationByUserId` AS `operationByUserId`,
  `student_class`.`operationByUser` AS `operationByUser`,
  `student_class`.`operationAt` AS `operationAt`
from
  (
  (
    `student_class`
    left join `class` on((`student_class`.`classId` = `class`.`classId`))
  )
  left join `student` on(
    (
    `student_class`.`studentId` = `student`.`studentId`
    )
  )
  );





