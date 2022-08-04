/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50738
 Source Host           : localhost:3306
 Source Schema         : jianghujs_demo_threetable

 Target Server Type    : MySQL
 Target Server Version : 50738
 File Encoding         : 65001

 Date: 31/07/2022 21:33:57
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _cache
-- ----------------------------
DROP TABLE IF EXISTS `_cache`;
CREATE TABLE `_cache` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT '用户Id',
  `content` longtext COLLATE utf8mb4_bin COMMENT '缓存数据',
  `recordStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT 'active',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='缓存表';

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `constantKey` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `constantType` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '常量类型; object, array',
  `desc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '描述',
  `constantValue` text COLLATE utf8mb4_bin COMMENT '常量内容; object, array',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='常量表; 软删除未启用;';

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fileId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'fileId',
  `fileDirectory` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '文件保存路径;',
  `filename` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '文件名;',
  `filenameStorage` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '文件保存名',
  `downloadPath` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '文件下载路径',
  `fileType` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '文件类型;(预留字段)',
  `fileDesc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '文件描述',
  `binarySize` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '文件二进制大小',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `fileId_index` (`fileId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='文件表; 软删除未启用;';

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupId` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT 'groupId',
  `groupName` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '群组名',
  `groupDesc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '群组描述',
  `groupAvatar` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '群logo',
  `groupExtend` varchar(1024) COLLATE utf8mb4_bin DEFAULT '{}' COMMENT '拓展字段; { groupNotice: ''xx'' }',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `groupId_index` (`groupId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='群组表; 软删除未启用;';

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'pageId',
  `pageName` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'page name',
  `pageType` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '页面类型; showInMenu, dynamicInMenu',
  `sort` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='页面表; 软删除未启用;';

-- ----------------------------
-- Records of _page
-- ----------------------------
BEGIN;
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, 'help', '帮助', 'dynamicInMenu', '11', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'login', '登陆', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (6, 'manual', '操作手册', 'showInMenu', '0', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (36, 'studentManagement', '学生管理-学生的增删改查页面', 'showInMenu', '5', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (37, 'classManagement', '班级管理-班级的增删改查页面', 'showInMenu', '5', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (38, 'studentManagementOfOneClass', '学生管理-班级的学生管理', 'dynamicInMenu', '5', 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (39, 'classManagementOfOneStudent', '班级管理-学生的班级管理', 'dynamicInMenu', '5', 'jhInsert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _record_history
-- ----------------------------
DROP TABLE IF EXISTS `_record_history`;
CREATE TABLE `_record_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '表',
  `recordId` int(11) DEFAULT NULL COMMENT '数据在table中的主键id; recordContent.id',
  `recordContent` text COLLATE utf8mb4_bin NOT NULL COMMENT '数据',
  `packageContent` text COLLATE utf8mb4_bin NOT NULL COMMENT '当时请求的 package JSON',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `index_record_id` (`recordId`),
  KEY `index_table_action` (`table`,`operation`)
) ENGINE=InnoDB AUTO_INCREMENT=2141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='数据历史表';

-- ----------------------------
-- Records of _record_history
-- ----------------------------
BEGIN;
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2140, '_user_session', 22, '{\"id\":22,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7002_Mac.10.15.7_d1495937_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"4NTlApugWpRytKTcZCLfemEZ4s-uc1oUT3ml\",\"operation\":\"jhInsert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":\"2022-07-31T16:39:35+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7002_Mac.10.15.7_d1495937_chrome\"},\"appId\":\"jianghujs_demo_threetable\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\"},\"packageId\":\"1659256775220_8915323\",\"packageType\":\"httpRequest\"}', 'jhInsert', NULL, NULL, '2022-07-31T16:39:35+08:00');
COMMIT;

-- ----------------------------
-- Table structure for _resource
-- ----------------------------
DROP TABLE IF EXISTS `_resource`;
CREATE TABLE `_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accessControlTable` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '数据规则控制表',
  `resourceHook` text COLLATE utf8mb4_bin COMMENT '[ "before": {"service": "xx", "serviceFunction": "xxx"}, "after": [] }',
  `pageId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'page id; E.g: index',
  `actionId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'action id; E.g: selectXXXByXXX',
  `desc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '描述',
  `resourceType` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'resource 类型; E.g: auth service sql',
  `appDataSchema` text COLLATE utf8mb4_bin COMMENT 'appData 参数校验',
  `resourceData` text COLLATE utf8mb4_bin COMMENT 'resource 数据; { "service": "auth", "serviceFunction": "passwordLogin" } or  { "table": "${tableName}", "action": "select", "whereCondition": ".where(function() {this.whereNot( { recordStatus: \\"active\\" })})" }',
  `requestDemo` text COLLATE utf8mb4_bin COMMENT '请求Demo',
  `responseDemo` text COLLATE utf8mb4_bin COMMENT '响应Demo',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=383 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';

-- ----------------------------
-- Records of _resource
-- ----------------------------
BEGIN;
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (231, NULL, NULL, 'login', 'passwordLogin', '✅登陆', 'service', '{}', '{\"service\": \"user\", \"serviceFunction\": \"passwordLogin\"}', NULL, NULL, 'update', NULL, NULL, '2022-04-27T15:32:57+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (251, NULL, NULL, 'allPage', 'logout', '✅登出', 'service', '{}', '{\"service\": \"user\", \"serviceFunction\": \"logout\"}', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (253, NULL, NULL, 'allPage', 'userInfo', '✅获取用户信息', 'service', '{}', '{\"service\": \"user\", \"serviceFunction\": \"userInfo\"}', NULL, NULL, 'update', NULL, NULL, '2022-04-27T15:37:21+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (258, NULL, NULL, 'allPage', 'getConstantList', '✅查询常量', 'sql', '{}', '{\"table\": \"_constant\", \"operation\": \"select\"}', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (365, NULL, NULL, 'studentManagement', 'selectItemList', '✅studentManagement查询-查询列表', 'sql', '{}', '{ \"table\": \"student\", \"operation\": \"select\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (366, NULL, NULL, 'studentManagement', 'insertItem', '✅studentManagement查询-添加成员', 'sql', '{}', '{ \"table\": \"student\", \"operation\": \"insert\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (367, NULL, NULL, 'studentManagement', 'updateItem', '✅studentManagement查询-更新成员', 'sql', '{}', '{ \"table\": \"student\", \"operation\": \"jhUpdate\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (368, NULL, NULL, 'studentManagement', 'deleteItem', '✅studentManagement查询-删除信息', 'sql', '{}', '{ \"table\": \"student\", \"operation\": \"jhDelete\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (369, NULL, NULL, 'classManagement', 'selectItemList', '✅classManagement查询-查询列表', 'sql', '{}', '{ \"table\": \"class\", \"operation\": \"select\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (370, NULL, NULL, 'classManagement', 'insertItem', '✅classManagement查询-添加成员', 'sql', '{}', '{ \"table\": \"class\", \"operation\": \"insert\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (371, NULL, NULL, 'classManagement', 'updateItem', '✅classManagement查询-更新成员', 'sql', '{}', '{ \"table\": \"class\", \"operation\": \"jhUpdate\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (372, NULL, NULL, 'classManagement', 'deleteItem', '✅classManagement查询-删除信息', 'sql', '{}', '{ \"table\": \"class\", \"operation\": \"jhDelete\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (373, NULL, NULL, 'studentManagementOfOneClass', 'selectCurrentList', '✅班级的学生管理-查询当前学生下的班级列表', 'sql', '{}', '{ \"table\": \"view01_student_class\", \"operation\": \"select\" }', NULL, NULL, 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (374, NULL, NULL, 'studentManagementOfOneClass', 'insertItem', '✅班级的学生管理-建立关系', 'sql', '{}', '{ \"table\": \"student_class\", \"operation\": \"jhInsert\" }', NULL, NULL, 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (375, NULL, NULL, 'studentManagementOfOneClass', 'updateItem', '✅班级的学生管理-更新数据', 'sql', '{}', '{ \"table\": \"student_class\", \"operation\": \"jhUpdate\" }', NULL, NULL, 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (376, NULL, NULL, 'studentManagementOfOneClass', 'deleteItem', '✅班级的学生管理-删除信息', 'sql', '{}', '{ \"table\": \"student_class\", \"operation\": \"jhDelete\" }', NULL, NULL, 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (377, NULL, NULL, 'studentManagementOfOneClass', 'selectAllList', '✅班级查询-查询列表', 'sql', '{}', '{ \"table\": \"student\", \"operation\": \"select\" }', NULL, NULL, 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (378, NULL, NULL, 'classManagementOfOneStudent', 'selectCurrentList', '✅学生的班级管理-查询当前班级下的学生列表', 'sql', '{}', '{ \"table\": \"view01_student_class\", \"operation\": \"select\" }', NULL, NULL, 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (379, NULL, NULL, 'classManagementOfOneStudent', 'insertItem', '✅学生的班级管理-建立关系', 'sql', '{}', '{ \"table\": \"student_class\", \"operation\": \"jhInsert\" }', NULL, NULL, 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (380, NULL, NULL, 'classManagementOfOneStudent', 'updateItem', '✅学生的班级管理-更新数据', 'sql', '{}', '{ \"table\": \"student_class\", \"operation\": \"jhUpdate\" }', NULL, NULL, 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (381, NULL, NULL, 'classManagementOfOneStudent', 'deleteItem', '✅学生的班级管理-删除信息', 'sql', '{}', '{ \"table\": \"student_class\", \"operation\": \"jhDelete\" }', NULL, NULL, 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (382, NULL, NULL, 'classManagementOfOneStudent', 'selectAllList', '✅学生查询-查询列表', 'sql', '{}', '{ \"table\": \"class\", \"operation\": \"select\" }', NULL, NULL, 'jhInsert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _resource_request_log
-- ----------------------------
DROP TABLE IF EXISTS `_resource_request_log`;
CREATE TABLE `_resource_request_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resourceId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'resource id;',
  `packageId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'resource package id',
  `userIp` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户ip;',
  `userAgent` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '设备信息',
  `deviceId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '设备id',
  `userIpRegion` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户Ip区域',
  `executeSql` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '执行的sql',
  `requestBody` text COLLATE utf8mb4_bin COMMENT '请求body',
  `responseBody` text COLLATE utf8mb4_bin COMMENT '响应body',
  `responseStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '执行的结果;  success, fail',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `resourceId_index` (`resourceId`),
  KEY `packageId_index` (`packageId`)
) ENGINE=InnoDB AUTO_INCREMENT=3716 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='文件表; 软删除未启用;';

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'roleId',
  `roleName` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'role name',
  `roleDesc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'role desc',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='角色表; 软删除未启用;';

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'page id; E.g: index',
  `uiActionType` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ui 动作类型，如：fetchData, postData, changeUi',
  `uiActionId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'action id; E.g: selectXXXByXXX',
  `desc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '描述',
  `uiActionConfig` text COLLATE utf8mb4_bin COMMENT 'ui 动作数据',
  `appDataSchema` text COLLATE utf8mb4_bin COMMENT 'ui 校验数据',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='ui 施工方案';

-- ----------------------------
-- Records of _ui
-- ----------------------------
BEGIN;
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, 'uiAction', 'ui', 'refreshTableData', '✅获取表格数据', '{ \"main\": [{\"function\": \"refreshTableData\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'uiAction', 'ui', 'startInsertItem', '✅打开创建数据抽屉', '{ \"main\": [{\"function\": \"clearCreateForm\"}, {\"function\": \"openCreateDrawer\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (4, 'uiAction', 'ui', 'createItem', '✅创建数据', '{ \"before\": [{\"function\": \"prepareValidate\"}, {\"function\": \"prepareCreateItem\"}, {\"function\": \"confirmCreateFormDialog\"}], \"main\": [ {\"function\": \"doCreateItem\"}], \"after\": [{\"function\": \"closeCreateDrawer\"}, {\"function\": \"refreshTableData\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (5, 'uiAction', 'ui', 'startUpdateItem', '✅打开更新数据抽屉', '{ \"main\": [{\"function\": \"fillUpdateForm\"}, {\"function\": \"openUpdateDrawer\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (6, 'uiAction', 'ui', 'updateItem', '✅更新数据', '{ \"before\": [{\"function\": \"prepareValidate\"}, {\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeUpdateDrawer\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (7, 'uiAction', 'ui', 'deleteItem', '✅删除数据', '{ \"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [ {\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (11, 'uiActionComponent', 'ui', 'refreshTableData', '✅获取表格数据', '{ \"before\": [{\"vueComponent\": \"classSelectDialog\", \"function\": \"selectItem\", \"functionParamObj\": { \"item\": { \"value\": \"2021-01级-01班\" } }}], \"main\": [{\"function\": \"refreshTableData\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (13, 'uiActionComponent', 'ui', 'startCreateItem', '✅打开创建数据抽屉', '{ \"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateDialog\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (14, 'uiActionComponent', 'ui', 'insertItem', '✅创建数据', '{ \"before\": [{\"function\": \"prepareValidate\"}, {\"vueComponent\": \"jhConfirmDialog\", \"function\": \"confirmDialog\", \"functionParamObj\": { \"title\": \"新增\", \"content\": \"确定新增吗？\" }}], \"main\": [{\"function\": \"prepareCreateItem\"}, {\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (15, 'uiActionComponent', 'ui', 'startUpdateItem', '✅打开更新数据抽屉', '{ \"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (16, 'uiActionComponent', 'ui', 'updateItem', '✅更新数据', '{ \"before\": [{\"function\": \"prepareValidate\"}, {\"vueComponent\": \"jhConfirmDialog\", \"function\": \"confirmDialog\", \"functionParamObj\": { \"title\": \"修改\", \"content\": \"确定修改吗？\" }}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (17, 'uiActionComponent', 'ui', 'deleteItem', '✅删除数据', '{ \"before\": [{\"vueComponent\": \"jhConfirmDialog\", \"function\": \"confirmDialog\", \"functionParamObj\": { \"title\": \"删除\", \"content\": \"确定删除吗？\" }}], \"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (30, 'resourceHook', 'ui', 'refreshTableData', '✅获取表格数据', '{ \"main\": [{\"function\": \"refreshTableData\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (31, 'resourceHook', 'ui', 'startCreateItem', '✅打开创建数据抽屉', '{ \"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateDialog\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (32, 'resourceHook', 'ui', 'createItem', '✅创建数据', '{ \"before\": [{\"function\": \"prepareValidate\"}, {\"function\": \"confirmCreateItemDialog\"}], \"main\": [{\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (33, 'resourceHook', 'ui', 'startUpdateItem', '✅打开更新数据抽屉', '{ \"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (34, 'resourceHook', 'ui', 'updateItem', '✅更新数据', '{ \"before\": [{\"function\": \"prepareValidate\"}, {\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (35, 'resourceHook', 'ui', 'deleteItem', '✅删除数据', '{ \"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (40, 'backendSearchDemo', 'ui', 'refreshTableData', '✅获取表格数据', '{ \"main\": [{\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (41, 'backendSearchDemo', 'ui', 'startCreateItem', '✅打开创建数据抽屉', '{ \"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateDialog\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (42, 'backendSearchDemo', 'ui', 'createItem', '✅创建数据', '{ \"before\": [{\"function\": \"prepareValidate\"}, {\"function\": \"confirmCreateItemDialog\"}], \"main\": [{\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (43, 'backendSearchDemo', 'ui', 'startUpdateItem', '✅打开更新数据抽屉', '{ \"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (44, 'backendSearchDemo', 'ui', 'updateItem', '✅更新数据', '{ \"before\": [{\"function\": \"prepareValidate\"}, {\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (45, 'backendSearchDemo', 'ui', 'deleteItem', '✅删除数据', '{ \"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (50, 'dataAccessRight', 'ui', 'refreshTableData', '✅获取表格数据', '{ \"main\": [{\"function\": \"refreshTableData\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (51, 'dataAccessRight', 'ui', 'startCreateItem', '✅打开创建数据抽屉', '{ \"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateDialog\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (52, 'dataAccessRight', 'ui', 'createItem', '✅创建数据', '{ \"before\": [{\"function\": \"prepareValidate\"}, {\"function\": \"confirmCreateItemDialog\"}], \"main\": [{\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (53, 'dataAccessRight', 'ui', 'startUpdateItem', '✅打开更新数据抽屉', '{ \"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (54, 'dataAccessRight', 'ui', 'updateItem', '✅更新数据', '{ \"before\": [{\"function\": \"prepareValidate\"}, {\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (55, 'dataAccessRight', 'ui', 'deleteItem', '✅删除数据', '{ \"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}] }', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (64, 'studentManagement', 'ui', 'refreshTableData', '✅获取表格数据', '{\"main\": [{\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (65, 'studentManagement', 'ui', 'startCreateItem', '✅获取表格数据', '{\"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateItemDialog\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (66, 'studentManagement', 'ui', 'createItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmCreateItemDialog\"}], \"main\": [{\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (67, 'studentManagement', 'ui', 'startUpdateItem', '✅获取表格数据', '{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (68, 'studentManagement', 'ui', 'updateItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (69, 'studentManagement', 'ui', 'deleteItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (70, 'classManagement', 'ui', 'refreshTableData', '✅获取表格数据', '{\"main\": [{\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (71, 'classManagement', 'ui', 'startCreateItem', '✅获取表格数据', '{\"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateItemDialog\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (72, 'classManagement', 'ui', 'createItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmCreateItemDialog\"}], \"main\": [{\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (73, 'classManagement', 'ui', 'startUpdateItem', '✅获取表格数据', '{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (74, 'classManagement', 'ui', 'updateItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (75, 'classManagement', 'ui', 'deleteItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (76, 'classManagement', 'ui', 'redirect', '✅跳转详情', '{\"main\": [{\"function\": \"doRedirect\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (77, 'studentManagement', 'ui', 'redirect', '✅跳转详情', '{\"main\": [{\"function\": \"doRedirect\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (78, 'studentManagementOfOneClass', 'ui', 'refreshTableData', '✅获取表格数据', '{\"main\": [{\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (79, 'studentManagementOfOneClass', 'ui', 'getDrawerTableData', '✅获取内表格数据', '{\"main\": [{\"function\": \"getDrawerTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (80, 'studentManagementOfOneClass', 'ui', 'allotItem', '✅同步数据', '{\"before\": [{\"function\": \"confirmAllotItemDialog\"}], \"main\": [{\"function\": \"doAllotItem\"}, {\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (81, 'studentManagementOfOneClass', 'ui', 'buildRelation', '✅同步数据', '{\"before\": [{\"function\": \"confirmAllotItemDialog\"}], \"main\": [{\"function\": \"doBuildRelation\"}, {\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (82, 'studentManagementOfOneClass', 'ui', 'startUpdateItem', '✅获取表格数据', '{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (83, 'studentManagementOfOneClass', 'ui', 'updateItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (84, 'studentManagementOfOneClass', 'ui', 'deleteRelation', '✅删除关系数据', '{\"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"doDeleteRelation\"}, {\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (85, 'classManagementOfOneStudent', 'ui', 'refreshTableData', '✅获取表格数据', '{\"main\": [{\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (86, 'classManagementOfOneStudent', 'ui', 'getDrawerTableData', '✅获取内表格数据', '{\"main\": [{\"function\": \"getDrawerTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (87, 'classManagementOfOneStudent', 'ui', 'allotItem', '✅同步数据', '{\"before\": [{\"function\": \"confirmAllotItemDialog\"}], \"main\": [{\"function\": \"doAllotItem\"}, {\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (88, 'classManagementOfOneStudent', 'ui', 'buildRelation', '✅同步数据', '{\"before\": [{\"function\": \"confirmAllotItemDialog\"}], \"main\": [{\"function\": \"doBuildRelation\"}, {\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (89, 'classManagementOfOneStudent', 'ui', 'startUpdateItem', '✅获取表格数据', '{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (90, 'classManagementOfOneStudent', 'ui', 'updateItem', '✅获取表格数据', '{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_ui` (`id`, `pageId`, `uiActionType`, `uiActionId`, `desc`, `uiActionConfig`, `appDataSchema`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (91, 'classManagementOfOneStudent', 'ui', 'deleteRelation', '✅删除关系数据', '{\"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"doDeleteRelation\"}, {\"function\": \"refreshTableData\"}]}', NULL, 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _user
-- ----------------------------
DROP TABLE IF EXISTS `_user`;
CREATE TABLE `_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '自增id; 用于生成userId',
  `userId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '主键id',
  `username` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户名(登陆)',
  `clearTextPassword` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '明文密码',
  `password` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '密码',
  `md5Salt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'md5Salt',
  `userStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT 'active' COMMENT '用户账号状态：活跃或关闭',
  `userType` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户类型; staff, student.',
  `config` mediumtext COLLATE utf8mb4_bin COMMENT '配置信息',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_index` (`username`),
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户表';

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT '用户id',
  `groupId` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT '群组Id',
  `roleId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '角色Id',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `groupId_index` (`groupId`),
  KEY `userId_index` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=587 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户群组角色关联表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (568, 'admin', 'adminGroup', 'administrator', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (569, 'W00001', 'wudang', 'boss', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (570, 'W00002', 'wudang', 'disciple', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (573, 'G00001', 'gaibang', 'boss', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (574, 'G00002', 'gaibang', 'disciple', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (577, 'H00001', 'huashan', 'boss', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (578, 'H00002', 'huashan', 'disciple', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _user_group_role_page
-- ----------------------------
DROP TABLE IF EXISTS `_user_group_role_page`;
CREATE TABLE `_user_group_role_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'userId 或者 通配符; 通配符: *',
  `group` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'groupId 或者 通配符; 通配符: *',
  `role` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'roleId 或者 通配符; 通配符: *',
  `page` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'pageId id',
  `allowOrDeny` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户群组角色 匹配后 执行动作; allow、deny',
  `desc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '映射描述',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户群组角色 - 页面 映射表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role_page
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (17, '*', 'public', '*', 'login', 'allow', '登陆页; 开放给所有用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (18, '*', 'login', '*', 'manual', 'allow', '操作手册页; 开放给登陆用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (19, '*', 'login', '*', 'help', 'allow', '帮助页; 开放给登陆用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (21, '*', 'adminGroup', 'administrator', '*', 'allow', '所有页面; 开放给应用管理者;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (27, '*', 'wudang', 'boss,disciple', 'protocolDemo', 'allow', 'studentManagement01; 开放给武当派派掌门&门徒;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (28, '*', 'gaibang', 'boss,disciple', 'frontendDemo01,frontendDemo02', 'allow', 'studentManagement02&studentManagement03; 开放给丐帮掌门&门徒;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (29, '*', 'huashan', 'boss,disciple', 'backendSearchDemo', 'allow', 'studentManagement04; 开放给华山派掌门&门徒;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (30, '*', '*', 'boss,disciple', 'dataAccessRight', 'allow', '数据权限demo', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _user_group_role_resource
-- ----------------------------
DROP TABLE IF EXISTS `_user_group_role_resource`;
CREATE TABLE `_user_group_role_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'userId 或者 通配符; 通配符: *',
  `group` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'groupId 或者 通配符; 通配符: *',
  `role` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'roleId 或者 通配符; 通配符: *',
  `resource` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'resourceId 或者 通配符; 通配符: *, !resourceId',
  `allowOrDeny` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户群组角色 匹配后 执行动作; allow、deny',
  `desc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '映射描述',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户群组角色 - 请求资源 映射表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role_resource
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, '*', 'public', '*', 'login.passwordLogin', 'allow', '登陆resource, 开放给所有用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (11, '*', 'public', '*', 'allPage.getConstantList', 'allow', '查询常量resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (31, '*', 'login', '*', 'allPage.logout', 'allow', '登出resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (32, '*', 'login', '*', 'allPage.refreshToken', 'allow', '刷新authToken resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (33, '*', 'login', '*', 'allPage.userInfo', 'allow', '用户个人信息resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (34, '*', 'login', '*', 'allPage.uploadByBase64', 'allow', '上传文件resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (35, '*', 'login', '*', 'allPage.uploadByStream', 'allow', '上传文件resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (51, '*', 'adminGroup', 'administrator', '*', 'allow', '应用管理者, 赋予所有resource权限', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (117, '*', 'wudang', 'boss', 'protocolDemo.*', 'allow', 'page01 内的所有操作; 开放给武当派掌门;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (118, '*', 'wudang', 'disciple', 'protocolDemo.selectItemList', 'allow', 'page01 内的查询列表操作; 开放给武当派门徒;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (125, '*', 'gaibang', 'boss', 'frontendDemo01.*,frontendDemo02.*', 'allow', 'page02&page03 内的所有操作; 开放给丐帮掌门&门徒;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (126, '*', 'gaibang', 'disciple', 'frontendDemo01.selectItemList,frontendDemo02.selectItemList', 'allow', 'page02&page03 内的查询列表操作; 开放给丐帮掌门&门徒;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (131, '*', 'huashan', 'boss', 'backendSearchDemo.*', 'allow', 'page04 内的所有操作; 开放给华山派掌门&门徒;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (132, '*', 'huashan', 'disciple', 'backendSearchDemo.selectItemList', 'allow', 'page04 内的查询列表操作; 开放给华山派掌门&门徒;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (133, '*', '*', 'boss', 'dataAccessRight.*', 'allow', 'page05 内的所有操作; 开放给所有掌门', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (134, '*', '*', 'disciple', 'dataAccessRight.selectItemList', 'allow', 'page05 内的查询列表操作; 开放给所有门徒;', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _user_session
-- ----------------------------
DROP TABLE IF EXISTS `_user_session`;
CREATE TABLE `_user_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户id',
  `userIp` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户ip',
  `userIpRegion` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户Ip区域',
  `userAgent` text COLLATE utf8mb4_bin COMMENT '请求的 agent',
  `deviceId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '设备id',
  `deviceType` varchar(255) COLLATE utf8mb4_bin DEFAULT 'web' COMMENT '设备类型; flutter, web, bot_databot, bot_chatbot, bot_xiaochengxu',
  `socketStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT 'offline' COMMENT 'socket状态',
  `authToken` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'auth token',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `userId_index` (`userId`),
  KEY `userId_deviceId_index` (`userId`,`deviceId`) USING BTREE,
  KEY `authToken_index` (`authToken`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户session表; deviceId 维度;软删除未启用;';

-- ----------------------------
-- Records of _user_session
-- ----------------------------
BEGIN;
INSERT INTO `_user_session` (`id`, `userId`, `userIp`, `userIpRegion`, `userAgent`, `deviceId`, `deviceType`, `socketStatus`, `authToken`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (22, 'admin', '127.0.0.1', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36', '127.0.0.1:7002_Mac.10.15.7_d1495937_chrome', 'web', 'offline', '4NTlApugWpRytKTcZCLfemEZ4s-uc1oUT3ml', 'jhInsert', NULL, NULL, '2022-07-31T16:39:35+08:00');
COMMIT;

-- ----------------------------
-- Table structure for access_control_student
-- ----------------------------
DROP TABLE IF EXISTS `access_control_student`;
CREATE TABLE `access_control_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '主键id',
  `username` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户名(登陆)',
  `resourceData` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '明文密码',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_index` (`username`),
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='学生表的 accessControl 表';

-- ----------------------------
-- Records of access_control_student
-- ----------------------------
BEGIN;
INSERT INTO `access_control_student` (`id`, `userId`, `username`, `resourceData`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (50, 'G00001', '洪七公', '{ \"where\":{\"level\": \"02\"} }', 'insert', NULL, NULL, NULL);
INSERT INTO `access_control_student` (`id`, `userId`, `username`, `resourceData`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (51, 'H00001', '岳不群', '{ \"where\":{\"level\": \"02\"} }', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for class
-- ----------------------------
DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '班级ID',
  `menPaiId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '门派ID',
  `menPaiName` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '门派名',
  `remarks` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '备注',
  `classStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT 'active' COMMENT '班级状态',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Records of class
-- ----------------------------
BEGIN;
INSERT INTO `class` (`id`, `classId`, `menPaiId`, `menPaiName`, `remarks`, `classStatus`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (111, '武当01班', 'wudang', '武当', NULL, '正常', 'jhUpdate', 'W00001', '张三丰', '2022-05-02T14:44:42+08:00');
INSERT INTO `class` (`id`, `classId`, `menPaiId`, `menPaiName`, `remarks`, `classStatus`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (112, '武当02班', 'wudang', '武当', NULL, '正常', 'jhUpdate', 'W00001', '张三丰', '2022-04-27T19:52:53+08:00');
INSERT INTO `class` (`id`, `classId`, `menPaiId`, `menPaiName`, `remarks`, `classStatus`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (117, '丐帮01班', 'gaibang', '丐帮', NULL, '正常', 'jhUpdate', 'W00001', '张三丰', '2022-04-27T19:52:53+08:00');
INSERT INTO `class` (`id`, `classId`, `menPaiId`, `menPaiName`, `remarks`, `classStatus`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (118, '丐帮02班', 'gaibang', '丐帮', NULL, '正常', 'jhUpdate', 'W00001', '张三丰', '2022-04-27T19:52:53+08:00');
INSERT INTO `class` (`id`, `classId`, `menPaiId`, `menPaiName`, `remarks`, `classStatus`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (120, '华山03班', 'huashan', '华山', NULL, '正常', 'jhUpdate', 'W00001', '张三丰', '2022-04-27T19:52:53+08:00');
INSERT INTO `class` (`id`, `classId`, `menPaiId`, `menPaiName`, `remarks`, `classStatus`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (122, '华山01班', 'huashan', '华山', NULL, '正常', 'jhUpdate', 'W00001', '张三丰', '2022-04-27T19:52:53+08:00');
INSERT INTO `class` (`id`, `classId`, `menPaiId`, `menPaiName`, `remarks`, `classStatus`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (123, '华山02班', 'huashan', '华山', NULL, '正常', 'jhUpdate', 'W00001', '张三丰', '2022-04-27T19:52:53+08:00');
COMMIT;

-- ----------------------------
-- Table structure for student
-- ----------------------------
DROP TABLE IF EXISTS `student`;
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '学生ID',
  `name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '学生名字',
  `gender` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '性别',
  `dateOfBirth` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '出生日期',
  `classId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '班级ID',
  `level` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '年级',
  `bodyHeight` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '身高',
  `studentStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '学生状态',
  `remarks` mediumtext COLLATE utf8mb4_bin COMMENT '备注',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `studentId` (`studentId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Records of student
-- ----------------------------
BEGIN;
INSERT INTO `student` (`id`, `studentId`, `name`, `gender`, `dateOfBirth`, `classId`, `level`, `bodyHeight`, `studentStatus`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (161, 'G00003', '小虾米', 'male', '2022-01-25', '2021-01级-02班', '02', '180', '正常', '小虾米', 'jhUpdate', 'admin', '系统管理员', '2022-05-01T15:29:52+08:00');
INSERT INTO `student` (`id`, `studentId`, `name`, `gender`, `dateOfBirth`, `classId`, `level`, `bodyHeight`, `studentStatus`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (168, '100067', '1111', 'male', '2022-05-02', '2021-01级-01班', '01', NULL, NULL, NULL, 'jhUpdate', 'admin', '系统管理员', '2022-05-01T23:38:23+08:00');
INSERT INTO `student` (`id`, `studentId`, `name`, `gender`, `dateOfBirth`, `classId`, `level`, `bodyHeight`, `studentStatus`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (173, '121432', '21434', NULL, NULL, '2021-01级-01班', NULL, NULL, NULL, NULL, 'jhInsert', 'admin', '系统管理员', '2022-05-01T23:37:58+08:00');
INSERT INTO `student` (`id`, `studentId`, `name`, `gender`, `dateOfBirth`, `classId`, `level`, `bodyHeight`, `studentStatus`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (174, 'admin', '系统管理员', 'male', '2022-05-02', '2021-01级-01班', '01', NULL, NULL, NULL, 'jhUpdate', 'admin', '系统管理员', '2022-05-03T21:17:52+08:00');
INSERT INTO `student` (`id`, `studentId`, `name`, `gender`, `dateOfBirth`, `classId`, `level`, `bodyHeight`, `studentStatus`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (175, '1000221', '221', 'male', '2022-05-08', '2021-01级-02班', '01', NULL, NULL, NULL, 'jhUpdate', 'admin', '系统管理员', '2022-05-03T20:50:51+08:00');
COMMIT;

-- ----------------------------
-- Table structure for student_class
-- ----------------------------
DROP TABLE IF EXISTS `student_class`;
CREATE TABLE `student_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '学生ID',
  `classId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '班级ID',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  `remark` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `studentId` (`studentId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Records of student_class
-- ----------------------------
BEGIN;
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (72, 'H00001', '华山03班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (73, 'H00002', '华山03班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (74, 'H00003', '华山03班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (75, 'H00004', '华山03班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (76, 'H00005', '华山03班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (77, 'H00001', '华山03班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (78, 'H00001', '华山01班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (79, 'H00001', '华山02班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (80, 'H00001', '华山03班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (81, 'H00006', '华山03班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (82, 'H00006', '华山01班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (83, 'H00006', '华山02班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (86, '111', '武当02班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (87, '111', '丐帮01班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (88, '111', '丐帮02班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (89, '111', '华山01班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (90, '111', '华山02班', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (93, 'W00001', '武当01班', 'insert', 'W00001', '张三丰', '2022-02-18T22:12:22+08:00', NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (95, 'D00001', '华山03班', 'jhInsert', 'W00001', '张三丰', '2022-04-27T21:29:21+08:00', NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (100, 'D00001', '华山01班', 'jhInsert', 'W00001', '张三丰', '2022-04-29T16:10:13+08:00', NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (103, 'H00001', '武当01班', 'jhUpdate', 'W00001', '张三丰', '2022-05-07T22:04:33+08:00', '123');
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (105, 'H00001', 'undefined', 'jhInsert', 'W00001', '张三丰', '2022-05-07T21:19:22+08:00', NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (109, 'D00001', '华山02班', 'jhInsert', 'W00001', '张三丰', '2022-05-07T21:40:47+08:00', NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (110, 'D00001', '丐帮02班', 'jhUpdate', 'W00001', '张三丰', '2022-05-07T21:53:17+08:00', '123');
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (111, 'D00001', '武当02班', 'jhInsert', 'W00001', '张三丰', '2022-05-07T21:54:40+08:00', NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (112, 'D00001', '丐帮01班', 'jhInsert', 'W00001', '张三丰', '2022-05-07T21:54:41+08:00', NULL);
INSERT INTO `student_class` (`id`, `studentId`, `classId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `remark`) VALUES (113, 'D00001', '武当01班', 'jhInsert', 'W00001', '张三丰', '2022-05-07T22:05:11+08:00', NULL);
COMMIT;

-- ----------------------------
-- View structure for view01_class_basic
-- ----------------------------
DROP VIEW IF EXISTS `view01_class_basic`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view01_class_basic` AS select `class`.`id` AS `id`,`class`.`classId` AS `classId`,`class`.`menPaiId` AS `menPaiId`,`class`.`menPaiName` AS `menPaiName`,count(1) AS `count`,`class`.`remarks` AS `remarks`,`class`.`classStatus` AS `classStatus`,`class`.`operation` AS `operation`,`class`.`operationByUserId` AS `operationByUserId`,`class`.`operationByUser` AS `operationByUser`,`class`.`operationAt` AS `operationAt` from (`class` left join `student_class` on((`class`.`classId` = `student_class`.`classId`))) group by `class`.`classId`;

-- ----------------------------
-- View structure for view01_student_class
-- ----------------------------
DROP VIEW IF EXISTS `view01_student_class`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view01_student_class` AS select distinct `student_class`.`id` AS `id`,`student_class`.`classId` AS `classId`,`student_class`.`studentId` AS `studentId`,`class`.`menPaiId` AS `menPaiId`,`class`.`menPaiName` AS `menPaiName`,`class`.`remarks` AS `remarks`,`class`.`classStatus` AS `classStatus`,`student`.`name` AS `name`,`student`.`gender` AS `gender`,`student`.`dateOfBirth` AS `dateOfBirth`,`student`.`level` AS `level`,`student`.`bodyHeight` AS `bodyHeight`,`student`.`studentStatus` AS `studentStatus`,`student_class`.`remark` AS `remark`,`student_class`.`operation` AS `operation`,`student_class`.`operationByUserId` AS `operationByUserId`,`student_class`.`operationByUser` AS `operationByUser`,`student_class`.`operationAt` AS `operationAt` from ((`student_class` left join `class` on((`student_class`.`classId` = `class`.`classId`))) left join `student` on((`student_class`.`studentId` = `student`.`studentId`)));

-- ----------------------------
-- View structure for _view01_user
-- ----------------------------
DROP VIEW IF EXISTS `_view01_user`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `_view01_user` AS select `_user`.`id` AS `id`,`_user`.`idSequence` AS `idSequence`,`_user`.`userId` AS `userId`,`_user`.`username` AS `username`,`_user`.`clearTextPassword` AS `clearTextPassword`,`_user`.`password` AS `password`,`_user`.`md5Salt` AS `md5Salt`,`_user`.`userStatus` AS `userStatus`,`_user`.`userType` AS `userType`,`_user`.`config` AS `config`,`_user`.`operation` AS `operation`,`_user`.`operationByUserId` AS `operationByUserId`,`_user`.`operationByUser` AS `operationByUser`,`_user`.`operationAt` AS `operationAt` from `_user`;

SET FOREIGN_KEY_CHECKS = 1;
