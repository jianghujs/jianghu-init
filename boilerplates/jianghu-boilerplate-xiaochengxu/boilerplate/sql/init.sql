/*
 Navicat Premium Data Transfer

 Source Server         : localhost3306
 Source Server Type    : MySQL
 Source Server Version : 80021
 Source Host           : 127.0.0.1:3306
 Source Schema         : test

 Target Server Type    : MySQL
 Target Server Version : 80021
 File Encoding         : 65001

 Date: 22/07/2022 15:33:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _cache
-- ----------------------------
DROP TABLE IF EXISTS `_cache`;
CREATE TABLE `_cache` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户Id',
  `content` longtext COLLATE utf8mb4_general_ci COMMENT '缓存数据',
  `recordStatus` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'active',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='缓存表';

-- ----------------------------
-- Records of _cache
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _constant
-- ----------------------------
DROP TABLE IF EXISTS `_constant`;
CREATE TABLE `_constant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `constantKey` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `constantType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '常量类型; object, array',
  `desc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '描述',
  `constantValue` text COLLATE utf8mb4_general_ci COMMENT '常量内容; object, array',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='常量表; 软删除未启用;';

-- ----------------------------
-- Records of _constant
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _file
-- ----------------------------
DROP TABLE IF EXISTS `_file`;
CREATE TABLE `_file` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fileId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'fileId',
  `fileDirectory` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '文件保存路径;',
  `filename` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '文件名;',
  `filenameStorage` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '文件保存名',
  `downloadPath` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '文件下载路径',
  `fileType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '文件类型;(预留字段)',
  `fileDesc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '文件描述',
  `binarySize` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '文件二进制大小',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `fileId_index` (`fileId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='文件表; 软删除未启用;';

-- ----------------------------
-- Records of _file
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _group
-- ----------------------------
DROP TABLE IF EXISTS `_group`;
CREATE TABLE `_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `groupId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'groupId',
  `groupName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '群组名',
  `groupDesc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '群组描述',
  `groupAvatar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '群logo',
  `groupExtend` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT '{}' COMMENT '拓展字段; { groupNotice: ''xx'' }',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `groupId_index` (`groupId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='群组表; 软删除未启用;';

-- ----------------------------
-- Records of _group
-- ----------------------------
BEGIN;
INSERT INTO `_group` (`id`, `groupId`, `groupName`, `groupDesc`, `groupAvatar`, `groupExtend`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, 'adminGroup', '管理组', '管理组', NULL, '{}', 'insert', NULL, NULL, NULL);
INSERT INTO `_group` (`id`, `groupId`, `groupName`, `groupDesc`, `groupAvatar`, `groupExtend`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (6, 'wudang', '武当', '武当', NULL, '{}', 'insert', NULL, NULL, NULL);
INSERT INTO `_group` (`id`, `groupId`, `groupName`, `groupDesc`, `groupAvatar`, `groupExtend`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (7, 'gaibang', '丐帮', '丐帮', NULL, '{}', 'insert', NULL, NULL, NULL);
INSERT INTO `_group` (`id`, `groupId`, `groupName`, `groupDesc`, `groupAvatar`, `groupExtend`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (8, 'huashan', '华山派', '华山派', NULL, '{}', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _page
-- ----------------------------
DROP TABLE IF EXISTS `_page`;
CREATE TABLE `_page` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'pageId',
  `pageName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'page name',
  `pageType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '页面类型; showInMenu, dynamicInMenu',
  `sort` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='页面表; 软删除未启用;';

-- ----------------------------
-- Records of _page
-- ----------------------------
BEGIN;
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, 'help', '帮助', 'dynamicInMenu', '11', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (37, 'studentManagement', 'demo页面', 'showInMenu', '5', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _record_history
-- ----------------------------
DROP TABLE IF EXISTS `_record_history`;
CREATE TABLE `_record_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '表',
  `recordId` int DEFAULT NULL COMMENT '数据在table中的主键id; recordContent.id',
  `recordContent` text COLLATE utf8mb4_general_ci NOT NULL COMMENT '数据',
  `packageContent` text COLLATE utf8mb4_general_ci NOT NULL COMMENT '当时请求的 package JSON',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `index_record_id` (`recordId`),
  KEY `index_table_action` (`table`,`operation`)
) ENGINE=InnoDB AUTO_INCREMENT=2142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='数据历史表';

-- ----------------------------
-- Records of _record_history
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _resource
-- ----------------------------
DROP TABLE IF EXISTS `_resource`;
CREATE TABLE `_resource` (
  `id` int NOT NULL AUTO_INCREMENT,
  `accessControlTable` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '数据规则控制表',
  `resourceHook` text COLLATE utf8mb4_general_ci COMMENT '[ "before": {"service": "xx", "serviceFunction": "xxx"}, "after": [] }',
  `pageId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'page id; E.g: index',
  `actionId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'action id; E.g: selectXXXByXXX',
  `desc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '描述',
  `resourceType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'resource 类型; E.g: auth service sql',
  `appDataSchema` text COLLATE utf8mb4_general_ci COMMENT 'appData 参数校验',
  `resourceData` text COLLATE utf8mb4_general_ci COMMENT 'resource 数据; { "service": "auth", "serviceFunction": "passwordLogin" } or  { "table": "${tableName}", "action": "select", "whereCondition": ".where(function() {this.whereNot( { recordStatus: \\"active\\" })})" }',
  `requestDemo` text COLLATE utf8mb4_general_ci COMMENT '请求Demo',
  `responseDemo` text COLLATE utf8mb4_general_ci COMMENT '响应Demo',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=381 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';

-- ----------------------------
-- Records of _resource
-- ----------------------------
BEGIN;
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (231, NULL, NULL, 'login', 'passwordLogin', '✅登陆', 'service', '{}', '{\"service\": \"user\", \"serviceFunction\": \"passwordLogin\"}', '', '', 'update', NULL, NULL, '2022-04-27T15:32:57+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (251, NULL, NULL, 'allPage', 'logout', '✅登出', 'service', '{}', '{\"service\": \"user\", \"serviceFunction\": \"logout\"}', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (253, NULL, NULL, 'allPage', 'userInfo', '✅获取用户信息', 'service', '{}', '{\"service\": \"user\", \"serviceFunction\": \"userInfo\"}', '', '', 'update', NULL, NULL, '2022-04-27T15:37:21+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (258, NULL, NULL, 'allPage', 'getConstantList', '✅查询常量', 'sql', '{}', '{\"table\": \"_constant\", \"operation\": \"select\"}', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (259, NULL, NULL, 'xiaochengxu', 'getView', '✅小程序：获取前端页面', 'service', '{}', '{ \"service\": \"xiaochengxu\", \"serviceFunction\": \"getView\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (371, NULL, NULL, 'studentManagement', 'selectItemList', '✅studentManagement查询-查询列表', 'sql', '{}', '{ \"table\": \"student\", \"operation\": \"select\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (372, NULL, NULL, 'studentManagement', 'insertItem', '✅studentManagement查询-添加成员', 'sql', '{}', '{ \"table\": \"student\", \"operation\": \"insert\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (373, NULL, NULL, 'studentManagement', 'updateItem', '✅studentManagement查询-更新成员', 'sql', '{}', '{ \"table\": \"student\", \"operation\": \"jhUpdate\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (374, NULL, NULL, 'studentManagement', 'deleteItem', '✅studentManagement查询-删除信息', 'sql', '{}', '{ \"table\": \"student\", \"operation\": \"jhDelete\" }', '', '', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _resource_request_log
-- ----------------------------
DROP TABLE IF EXISTS `_resource_request_log`;
CREATE TABLE `_resource_request_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `resourceId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'resource id;',
  `packageId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'resource package id',
  `userIp` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户ip;',
  `userAgent` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '设备信息',
  `deviceId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '设备id',
  `userIpRegion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户Ip区域',
  `executeSql` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '执行的sql',
  `requestBody` text COLLATE utf8mb4_general_ci COMMENT '请求body',
  `responseBody` text COLLATE utf8mb4_general_ci COMMENT '响应body',
  `responseStatus` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '执行的结果;  success, fail',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `resourceId_index` (`resourceId`),
  KEY `packageId_index` (`packageId`)
) ENGINE=InnoDB AUTO_INCREMENT=3646 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='文件表; 软删除未启用;';

-- ----------------------------
-- Records of _resource_request_log
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _role
-- ----------------------------
DROP TABLE IF EXISTS `_role`;
CREATE TABLE `_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'roleId',
  `roleName` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'role name',
  `roleDesc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'role desc',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='角色表; 软删除未启用;';

-- ----------------------------
-- Records of _role
-- ----------------------------
BEGIN;
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'administrator', '系统管理员', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (6, 'boss', '掌门', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (7, 'disciple', '门徒', '', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _ui
-- ----------------------------
DROP TABLE IF EXISTS `_ui`;
CREATE TABLE `_ui` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'page id; E.g: index',
  `uiActionType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'ui 动作类型，如：fetchData, postData, changeUi',
  `uiActionId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'action id; E.g: selectXXXByXXX',
  `desc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '描述',
  `uiActionConfig` text COLLATE utf8mb4_general_ci COMMENT 'ui 动作数据',
  `appDataSchema` text COLLATE utf8mb4_general_ci COMMENT 'ui 校验数据',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='ui 施工方案';

-- ----------------------------
-- Records of _ui
-- ----------------------------
BEGIN;
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (64, 'studentManagement', 'ui', 'refreshTableData', '✅获取表格数据', '{\"main\": [{\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (65, 'studentManagement', 'ui', 'startCreateItem', '✅获取表格数据', '{\"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateItemDialog\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (66, 'studentManagement', 'ui', 'createItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmCreateItemDialog\"}], \"main\": [{\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (67, 'studentManagement', 'ui', 'startUpdateItem', '✅获取表格数据', '{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (68, 'studentManagement', 'ui', 'updateItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (69, 'studentManagement', 'ui', 'deleteItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _user
-- ----------------------------
DROP TABLE IF EXISTS `_user`;
CREATE TABLE `_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idSequence` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '自增id; 用于生成userId',
  `userId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '主键id',
  `username` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户名(登陆)',
  `clearTextPassword` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '明文密码',
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '密码',
  `md5Salt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'md5Salt',
  `userStatus` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'active' COMMENT '用户账号状态：活跃或关闭',
  `userType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户类型; staff, student.',
  `config` mediumtext COLLATE utf8mb4_general_ci COMMENT '配置信息',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_index` (`username`),
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户表';

-- ----------------------------
-- Records of _user
-- ----------------------------
BEGIN;
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (42, NULL, 'admin', '系统管理员', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (43, NULL, 'W00001', '张三丰', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (44, NULL, 'W00002', '张无忌', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (45, NULL, 'G00001', '洪七公', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (46, NULL, 'G00002', '郭靖', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (47, NULL, 'H00001', '岳不群', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (48, NULL, 'H00002', '令狐冲', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _user_group_role
-- ----------------------------
DROP TABLE IF EXISTS `_user_group_role`;
CREATE TABLE `_user_group_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户id',
  `groupId` varchar(255) COLLATE utf8mb4_general_ci NOT NULL COMMENT '群组Id',
  `roleId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '角色Id',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `groupId_index` (`groupId`),
  KEY `userId_index` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=587 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户群组角色关联表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _user_group_role_page
-- ----------------------------
DROP TABLE IF EXISTS `_user_group_role_page`;
CREATE TABLE `_user_group_role_page` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'userId 或者 通配符; 通配符: *',
  `group` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'groupId 或者 通配符; 通配符: *',
  `role` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'roleId 或者 通配符; 通配符: *',
  `page` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'pageId id',
  `allowOrDeny` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户群组角色 匹配后 执行动作; allow、deny',
  `desc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '映射描述',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户群组角色 - 页面 映射表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role_page
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (17, '*', 'public', '*', 'login', 'allow', '登陆页; 开放给所有用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (18, '*', 'login', '*', 'manual', 'allow', '操作手册页; 开放给登陆用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (19, '*', 'login', '*', 'help', 'allow', '帮助页; 开放给登陆用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (31, '*', 'login', '*', '*', 'allow', '所有页面; 为了方便测试开放给所有登陆用户;', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _user_group_role_resource
-- ----------------------------
DROP TABLE IF EXISTS `_user_group_role_resource`;
CREATE TABLE `_user_group_role_resource` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'userId 或者 通配符; 通配符: *',
  `group` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'groupId 或者 通配符; 通配符: *',
  `role` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'roleId 或者 通配符; 通配符: *',
  `resource` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'resourceId 或者 通配符; 通配符: *, !resourceId',
  `allowOrDeny` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户群组角色 匹配后 执行动作; allow、deny',
  `desc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '映射描述',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户群组角色 - 请求资源 映射表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role_resource
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, '*', 'public', '*', 'login.passwordLogin', 'allow', '登陆resource, 开放给所有用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, '*', 'public', '*', 'allPage.getConstantList', 'allow', '查询常量resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, '*', 'public', '*', 'xiaochengxu.*', 'allow', 'xiaochengxu resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (10, '*', 'login', '*', 'allPage.*', 'allow', 'allPage resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (11, '*', 'login', '*', '*', 'allow', '所有resource, 为了方便测试-开放给所有登陆成功用户', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _user_session
-- ----------------------------
DROP TABLE IF EXISTS `_user_session`;
CREATE TABLE `_user_session` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户id',
  `userIp` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户ip',
  `userIpRegion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户Ip区域',
  `userAgent` text COLLATE utf8mb4_general_ci COMMENT '请求的 agent',
  `deviceId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '设备id',
  `deviceType` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'web' COMMENT '设备类型; flutter, web, bot_databot, bot_chatbot, bot_xiaochengxu',
  `socketStatus` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'offline' COMMENT 'socket状态',
  `authToken` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'auth token',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `userId_index` (`userId`),
  KEY `userId_deviceId_index` (`userId`,`deviceId`) USING BTREE,
  KEY `authToken_index` (`authToken`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户session表; deviceId 维度;软删除未启用;';

-- ----------------------------
-- Records of _user_session
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for access_control_student
-- ----------------------------
DROP TABLE IF EXISTS `access_control_student`;
CREATE TABLE `access_control_student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '主键id',
  `username` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '用户名(登陆)',
  `resourceData` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '明文密码',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_index` (`username`),
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='学生表的 accessControl 表';

-- ----------------------------
-- Records of access_control_student
-- ----------------------------
BEGIN;
INSERT INTO `access_control_student` (`id`, `userId`, `username`, `resourceData`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (50, 'G00001', '洪七公', '{ \"where\":{\"level\": \"02\"} }', 'insert', NULL, NULL, NULL);
INSERT INTO `access_control_student` (`id`, `userId`, `username`, `resourceData`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (51, 'H00001', '岳不群', '{ \"where\":{\"level\": \"02\"} }', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` int NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '学生ID',
  `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '学生名字',
  `gender` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '性别',
  `dateOfBirth` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '出生日期',
  `classId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '班级ID',
  `level` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '年级',
  `bodyHeight` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '身高',
  `studentStatus` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '学生状态',
  `remarks` mediumtext COLLATE utf8mb4_general_ci COMMENT '备注',
  `operation` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `studentId` (`studentId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of student
-- ----------------------------
BEGIN;
INSERT INTO `student` (`id`, `studentId`, `name`, `gender`, `dateOfBirth`, `classId`, `level`, `bodyHeight`, `studentStatus`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (161, 'G00003', '小虾米', 'male', '2022-01-25', '2021-01级-02班', '02', '180', '正常', '小虾米', 'jhUpdate', 'admin', '系统管理员', '2022-05-01T15:29:52+08:00');
INSERT INTO `student` (`id`, `studentId`, `name`, `gender`, `dateOfBirth`, `classId`, `level`, `bodyHeight`, `studentStatus`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (168, '100067', '1111', 'male', '2022-05-02', '2021-01级-01班', '01', NULL, NULL, NULL, 'jhUpdate', 'admin', '系统管理员', '2022-05-01T23:38:23+08:00');
INSERT INTO `student` (`id`, `studentId`, `name`, `gender`, `dateOfBirth`, `classId`, `level`, `bodyHeight`, `studentStatus`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (173, '121432', '21434', NULL, NULL, '2021-01级-01班', NULL, NULL, NULL, NULL, 'jhInsert', 'admin', '系统管理员', '2022-05-01T23:37:58+08:00');
INSERT INTO `student` (`id`, `studentId`, `name`, `gender`, `dateOfBirth`, `classId`, `level`, `bodyHeight`, `studentStatus`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (174, 'admin', '系统管理员', 'male', '2022-05-02', '2021-01级-01班', '01', NULL, NULL, NULL, 'jhUpdate', 'G00002', '郭靖', '2022-07-22T15:32:41+08:00');
COMMIT;

-- ----------------------------
-- View structure for _view01_user
-- ----------------------------
DROP VIEW IF EXISTS `_view01_user`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `_view01_user` AS select `_user`.`id` AS `id`,`_user`.`idSequence` AS `idSequence`,`_user`.`userId` AS `userId`,`_user`.`username` AS `username`,`_user`.`clearTextPassword` AS `clearTextPassword`,`_user`.`password` AS `password`,`_user`.`md5Salt` AS `md5Salt`,`_user`.`userStatus` AS `userStatus`,`_user`.`userType` AS `userType`,`_user`.`config` AS `config`,`_user`.`operation` AS `operation`,`_user`.`operationByUserId` AS `operationByUserId`,`_user`.`operationByUser` AS `operationByUser`,`_user`.`operationAt` AS `operationAt` from `_user`;

SET FOREIGN_KEY_CHECKS = 1;
