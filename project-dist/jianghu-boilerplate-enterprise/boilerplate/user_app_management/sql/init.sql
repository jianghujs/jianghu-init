/*
 Navicat Premium Data Transfer

 Source Server         : openjianghu02_db
 Source Server Type    : MySQL
 Source Server Version : 50738
 Source Host           : localhost:43302
 Source Schema         : {{dbPrefix}}user_app_management

 Target Server Type    : MySQL
 Target Server Version : 50738
 File Encoding         : 65001

 Date: 01/03/2023 21:04:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for _app
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of _app
-- ----------------------------
BEGIN;
INSERT INTO `_app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (12, 'user_app_management', 'base', '账号权限管理', NULL, NULL, NULL, 'internal', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `_app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (13, 'data_repository', 'base', '数据中心管理', NULL, NULL, NULL, 'internal', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `_app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (14, 'directory', 'base', 'APP目录', NULL, NULL, NULL, 'internal', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `_app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (18, '1table-crud', NULL, '小APPDemo项目', NULL, NULL, NULL, 'internal', 'jhInsert', 'admin', '系统管理员', '2022-02-24T20:18:14+08:00', NULL);
INSERT INTO `_app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (19, 'test', NULL, 'uiAction23', NULL, NULL, NULL, 'internal', 'jhUpdate', 'admin', '系统管理员', '2022-09-08T15:13:22+08:00', NULL);
INSERT INTO `_app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (20, NULL, NULL, '0908', NULL, NULL, NULL, 'internal', 'jhUpdate', 'admin', '系统管理员', '2022-09-08T14:54:51+08:00', NULL);
INSERT INTO `_app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (21, 'test', NULL, '123456', NULL, NULL, NULL, 'external', 'jhInsert', 'admin', '系统管理员', '2022-09-08T14:55:07+08:00', NULL);
INSERT INTO `_app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (22, '090909', NULL, '090909', NULL, NULL, NULL, 'internal', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:26:10+08:00', NULL);
COMMIT;

-- ----------------------------
-- Table structure for _cache
-- ----------------------------
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='缓存表';

-- ----------------------------
-- Records of _cache
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _group
-- ----------------------------
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='群组表; 软删除未启用;';

-- ----------------------------
-- Records of _group
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _page
-- ----------------------------
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
  `pageHook` text,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COMMENT='页面表; 软删除未启用;';

-- ----------------------------
-- Records of _page
-- ----------------------------
BEGIN;
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, 'help', '帮助', 'helpV4', 'dynamicInMenu', '0', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'login', '登陆', 'loginV4', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (27, 'userManagement', '用户管理', NULL, 'showInMenu', '3', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (31, 'appManagement', 'App管理', NULL, 'showInMenu', '5', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (35, 'appManagementOfOneUser', '用户的App权限管理', NULL, 'dynamicInMenu', '4', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (36, 'userManagementOfOneApp', 'App的用户权限管理', NULL, 'dynamicInMenu', '6', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _record_history
-- ----------------------------
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
  KEY `index_table_action` (`table`,`operation`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='数据历史表';

-- ----------------------------
-- Records of _record_history
-- ----------------------------
BEGIN;
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, '_user_session', 1, '{\"id\":1,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\",\"deviceId\":\"127.0.0.1:7006_Windows.10.0_3632e939_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"97xHfqKu3Ip4saHV_iUfMpj820-LHQGQBGx7\",\"operation\":\"jhInsert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":\"2022-11-04T11:57:56+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7006_Windows.10.0_3632e939_chrome\"},\"appId\":\"user_app_management\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\"},\"packageId\":\"1667534275920_4031815\",\"packageType\":\"httpRequest\"}', 'jhInsert', NULL, NULL, '2022-11-04T11:57:56+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, '_user_session', 1, '{\"id\":1,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\",\"deviceId\":\"127.0.0.1:7006_Windows.10.0_3632e939_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"Ycunr8ck_YABkvsVwaNjQPxoNwutZ4wwDtpb\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2022-11-04T11:59:37+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7006_Windows.10.0_3632e939_chrome\"},\"appId\":\"user_app_management\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\"},\"packageId\":\"1667534375892_5601026\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2022-11-04T11:59:37+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, '_user_session', 1, '{\"id\":1,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\",\"deviceId\":\"127.0.0.1:7006_Windows.10.0_3632e939_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"ugB1KmaFXZtysWW-NzFvh-cO2jiPPH809BB8\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2022-11-04T12:00:01+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7006_Windows.10.0_3632e939_chrome\"},\"appId\":\"user_app_management\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\"},\"packageId\":\"1667534400817_2358472\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2022-11-04T12:00:01+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (4, '_user_session', 1, '{\"id\":1,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\",\"deviceId\":\"127.0.0.1:7006_Windows.10.0_3632e939_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"cg35O77ui-4sX0oORb32yOm6kNAM0_P9NynG\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2022-11-04T12:01:00+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7006_Windows.10.0_3632e939_chrome\"},\"appId\":\"user_app_management\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\"},\"packageId\":\"1667534459171_7069398\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2022-11-04T12:01:00+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (5, '_user_session', 2, '{\"id\":2,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7006_Mac.10.15.7_f4102b4e_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"nChKceFe38urNx1N1vUs2JpaaoDoySCLyA7R\",\"operation\":\"jhInsert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":\"2023-03-01T21:03:14+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7006_Mac.10.15.7_f4102b4e_chrome\"},\"appId\":\"user_app_management\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\"},\"packageId\":\"1677675793271_6372914\",\"packageType\":\"httpRequest\"}', 'jhInsert', NULL, NULL, '2023-03-01T21:03:14+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (6, '_user_session', 2, '{\"id\":2,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7006_Mac.10.15.7_f4102b4e_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"nChKceFe38urNx1N1vUs2JpaaoDoySCLyA7R\",\"operation\":\"jhInsert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":\"2023-03-01T21:03:14+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7006_Mac.10.15.7_f4102b4e_chrome\"},\"appId\":\"user_app_management\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\"},\"packageId\":\"1677675858841_4131032\",\"packageType\":\"httpRequest\"}', 'jhInsert', NULL, NULL, '2023-03-01T21:03:14+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (7, '_user_session', 2, '{\"id\":2,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7006_Mac.10.15.7_f4102b4e_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"JCrUcovB7EzFVxKp0-HF47TF73nGTiN-h34d\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2023-03-01T21:04:20+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7006_Mac.10.15.7_f4102b4e_chrome\"},\"appId\":\"user_app_management\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\"},\"packageId\":\"1677675858841_4131032\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2023-03-01T21:04:20+08:00');
COMMIT;

-- ----------------------------
-- Table structure for _resource
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=375 DEFAULT CHARSET=utf8mb4 COMMENT='请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';

-- ----------------------------
-- Records of _resource
-- ----------------------------
BEGIN;
INSERT INTO `_resource` (accessControlTable,resourceHook,pageId,actionId,`desc`,resourceType,appDataSchema,resourceData,requestDemo,responseDemo,operation,operationByUserId,operationByUser,operationAt) VALUES
	 (NULL,NULL,'login','passwordLogin','✅登陆','service','{}','{ "service": "user", "serviceFunction": "passwordLogin" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'allPage','logout','✅登出','service','{}','{ "service": "user", "serviceFunction": "logout" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'allPage','userInfo','✅获取用户信息','service','{}','{ "service": "user", "serviceFunction": "userInfo" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'userManagement','insertItem','✅用户管理页-创建用户','service','{}','{ "service": "userManagement", "serviceFunction": "addUser" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'userManagement','resetUserPassword','✅用户管理页-修改用户密码','service','{}','{ "service": "userManagement", "serviceFunction": "resetUserPassword" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'userManagement','updateItem','✅用户管理页-修改用户信息','sql','{"type":"object","required":["actionData","where"],"properties":{"actionData":{"type":"object","required":["username","userType","userStatus"],"properties":{"username":{"type":"string"},"userType":{"type":"string"},"userStatus":{"type":"string"}},"additionalProperties":true},"where":{"type":"object","required":["id"],"properties":{"id":{"type":"number"}}}},"additionalProperties":true}','{ "table": "_user", "operation": "update" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'userManagement','selectItemList','✅用户管理页-查询用户列表','sql','{"type":"object","required":["orderBy"],"properties":{"orderBy":{"type":"array","minItems":1,"items":{"type":"object","required":["column","order"],"properties":{"column":{"type":"string"},"order":{"type":"string"}}}}},"additionalProperties":true}','{ "table": "_user", "operation": "select" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'appManagement','selectItemList','✅APP管理-查询APP列表','sql','{"type":"object","required":["orderBy"],"properties":{"orderBy":{"type":"array","minItems":1,"items":{"type":"object","required":["column","order"],"properties":{"column":{"type":"string"},"order":{"type":"string"}}}}},"additionalProperties":true}','{ "table": "_app", "operation": "select" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'appManagement','updateItem','✅APP管理-更新','sql','{"type":"object","required":["actionData"],"properties":{"actionData":{"type":"object","required":["appName","appType"],"properties":{"appName":{"type":"string"},"appType":{"type":"string"}},"additionalProperties":true}},"additionalProperties":true}','{ "table": "_app", "operation": "jhUpdate" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'appManagement','insertItem','✅APP管理-创建APP','sql','{"type":"object","required":["actionData"],"properties":{"actionData":{"type":"object","required":["appId","appName","appType"],"properties":{"appId":{"type":"string"},"appName":{"type":"string"},"appType":{"type":"string"}},"additionalProperties":true}},"additionalProperties":true}','{ "table": "_app", "operation": "jhInsert" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (accessControlTable,resourceHook,pageId,actionId,`desc`,resourceType,appDataSchema,resourceData,requestDemo,responseDemo,operation,operationByUserId,operationByUser,operationAt) VALUES
	 (NULL,NULL,'appManagement','deleteItem','✅APP管理-删除APP','sql','{"type":"object","required":["where"],"properties":{"where":{"type":"object","required":["id"],"properties":{"id":{"type":"number"}}}},"additionalProperties":true}','{ "table": "_app", "operation": "jhDelete" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'appManagementOfOneUser','selectItemList','✅用户的App权限管理-查询列表','sql','{"type":"object","required":["orderBy","where"],"properties":{"orderBy":{"type":"array","minItems":1,"items":{"type":"object","required":["column","order"],"properties":{"column":{"type":"string"},"order":{"type":"string"}}}},"where":{"type":"object","required":["userId"],"properties":{"userId":{"type":"string"}}},"additionalProperties":true},"additionalProperties":true}','{ "table": "_view02_user_app", "operation": "select" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'appManagementOfOneUser','insertItem','✅用户的App权限管理-添加','sql','{"type":"object","required":["actionData"],"properties":{"actionData":{"type":"object","required":["appId","userId"],"properties":{"appId":{"type":"string"},"userId":{"type":"string"}},"additionalProperties":true}},"additionalProperties":true}','{ "table": "_user_app", "operation": "jhInsert" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'appManagementOfOneUser','deleteItem','✅用户的App权限管理-删除','sql','{"type":"object","required":["where"],"properties":{"where":{"type":"object","required":["appId"],"properties":{"appId":{"type":"string"}},"additionalProperties":true}},"additionalProperties":true}','{ "table": "_user_app", "operation": "jhDelete" }','','','insert',NULL,NULL,NULL),
	 (NULL,'','appManagementOfOneUser','selectAppItemList','✅用户的App权限管理-查询APP列表','sql','{"type":"object","required":["orderBy"],"properties":{"orderBy":{"type":"array","minItems":1,"items":{"type":"object","required":["column","order"],"properties":{"column":{"type":"string"},"order":{"type":"string"}}}}},"additionalProperties":true}','{ "table": "_app", "operation": "select" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'userManagementOfOneApp','selectItemList','✅App的用户权限管理-查询列表','sql','{"type":"object","required":["orderBy","where"],"properties":{"orderBy":{"type":"array","minItems":1,"items":{"type":"object","required":["column","order"],"properties":{"column":{"type":"string"},"order":{"type":"string"}}}},"where":{"type":"object","required":["appId"],"properties":{"appId":{"type":"string"}}}},"additionalProperties":true}','{ "table": "_view02_user_app", "operation": "select" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'userManagementOfOneApp','insertItem','✅App的用户权限管理-添加','sql','{"type":"object","required":["actionData"],"properties":{"actionData":{"type":"object","required":["appId","userId"],"properties":{"appId":{"type":"string"},"userId":{"type":"string"}},"additionalProperties":true}},"additionalProperties":true}','{ "table": "_user_app", "operation": "jhInsert" }','','','insert',NULL,NULL,NULL),
	 (NULL,NULL,'userManagementOfOneApp','deleteItem','✅App的用户权限管理-删除','sql','{"type":"object","required":["where"],"properties":{"where":{"type":"object","required":["userId"],"properties":{"userId":{"type":"string"}},"additionalProperties":true}},"additionalProperties":true}','{ "table": "_user_app", "operation": "jhDelete" }','','','insert',NULL,NULL,NULL),
	 (NULL,'','userManagementOfOneApp','selectUserItemList','✅App的用户权限管理-查询APP列表','sql','{"type":"object","required":["orderBy"],"properties":{"orderBy":{"type":"array","minItems":1,"items":{"type":"object","required":["column","order"],"properties":{"column":{"type":"string"},"order":{"type":"string"}}}}},"additionalProperties":true}','{ "table": "_user", "operation": "select" }','','','insert',NULL,NULL,NULL);
COMMIT;

-- ----------------------------
-- Table structure for _role
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COMMENT='角色表; 软删除未启用;';

-- ----------------------------
-- Records of _role
-- ----------------------------
BEGIN;
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'appAdmin', '系统管理员', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (6, 'boss', '掌门', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (7, 'disciple', '门徒', '', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _test_case
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=198 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='测试用例表';

-- ----------------------------
-- Records of _test_case
-- ----------------------------
BEGIN;
INSERT INTO `_test_case` (`id`, `pageId`, `testId`, `testName`, `uiActionIdList`, `testOpeartion`, `expectedResult`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (197, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _ui
-- ----------------------------
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='ui 施工方案';

-- ----------------------------
-- Records of _ui
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for _user
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ----------------------------
-- Records of _user
-- ----------------------------
BEGIN;
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (42, '111', 'admin', '系统管理员', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', 'common', NULL, 'update', NULL, NULL, '2022-02-19T15:02:24+08:00');
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (43, NULL, 'W00001', '张三丰', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'update', 'admin', '系统管理员', '2022-02-19T15:18:42+08:00');
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (44, NULL, 'W00002', '张无忌', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'update', 'admin', '系统管理员', '2022-02-19T15:45:14+08:00');
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (45, NULL, 'G00001', '洪七公', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (46, NULL, 'G00002', '郭靖', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'update', 'admin', '系统管理员', '2022-05-03T13:45:14+08:00');
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (47, NULL, 'H00001', '岳不群', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (48, NULL, 'H00002', '令狐冲', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (58, '112', 'U223P', 'uiaction123', '12345678', '31166f44402dedbf27c9b2d4bcfa90cb', 'ajGTYtmy4cNH', 'banned', 'common', NULL, 'update', 'admin', '系统管理员', '2022-09-09T16:03:56+08:00');
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (59, '113', 'U224R', '0909', '123456', '8146695749e5e774d1904e6c5bc21e74', 'rYnxj8ABbbCd', 'active', 'common', NULL, 'insert', 'admin', '系统管理员', '2022-09-09T16:21:39+08:00');
COMMIT;

-- ----------------------------
-- Table structure for _user_app
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of _user_app
-- ----------------------------
BEGIN;
INSERT INTO `_user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (62, 'admin', 'data_repository', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (63, 'admin', 'directory', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (68, 'admin', 'user_app_management', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:53:46+08:00');
INSERT INTO `_user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (109, 'admin', '1table-crud', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:13:16+08:00');
INSERT INTO `_user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (133, 'admin', 'test', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:24:08+08:00');
INSERT INTO `_user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (148, 'admin', '090909', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:26:27+08:00');
INSERT INTO `_user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (152, 'U224R', '090909', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:27:03+08:00');
COMMIT;

-- ----------------------------
-- Table structure for _user_app_09_12
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of _user_app_09_12
-- ----------------------------
BEGIN;
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (62, 'admin', 'data_repository', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (63, 'admin', 'directory', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (64, 'admin', 'user_app_management', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (68, '0', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:53:46+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (69, '1', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:53:47+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (70, '2', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:53:49+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (71, '0', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:55:10+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (72, '1', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:55:12+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (73, '2', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:55:13+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (74, '0', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:56:34+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (75, '1', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:56:35+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (76, '2', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:56:36+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (77, '0', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:57:51+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (78, '1', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:57:52+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (79, '2', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:57:53+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (109, 'admin', 'demo_xiaoapp', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:13:16+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (133, 'admin', 'test', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:24:08+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (135, 'W00002', 'null', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:25:18+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (139, 'W00002', 'null', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:25:35+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (141, 'admin', 'null', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:25:35+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (148, 'admin', '090909', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:26:27+08:00');
INSERT INTO `_user_app_09_12` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (152, 'U224R', '090909', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:27:03+08:00');
COMMIT;

-- ----------------------------
-- Table structure for _user_group_role
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=579 DEFAULT CHARSET=utf8mb4 COMMENT='用户群组角色关联表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (568, 'admin', 'adminGroup', 'appAdmin', 'insert', NULL, NULL, NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='用户群组角色 - 页面 映射表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role_page
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, '*', 'public', '*', 'login', 'allow', '登陆页面; 开放所有用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, '*', 'login', '*', 'help,manual', 'allow', '工具页; 开放给登陆用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` (`id`, `user`, `group`, `role`, `page`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, '*', 'login', '*', '*', 'allow', '所有页面; 开放给登陆用户;', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _user_group_role_resource
-- ----------------------------
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='用户群组角色 - 请求资源 映射表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role_resource
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, '*', 'public', '*', 'login.passwordLogin', 'allow', '登陆resource, 开放给所有用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, '*', 'login', '*', 'allPage.*', 'allow', '工具类resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` (`id`, `user`, `group`, `role`, `resource`, `allowOrDeny`, `desc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, '*', 'login', '*', '*', 'allow', '所有resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _user_session
-- ----------------------------
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
  KEY `userId_deviceId_index` (`userId`,`deviceId`) USING BTREE,
  KEY `authToken_index` (`authToken`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='用户session表; deviceId 维度;软删除未启用;';

-- ----------------------------
-- Records of _user_session
-- ----------------------------
BEGIN;
INSERT INTO `_user_session` (`id`, `userId`, `userIp`, `userIpRegion`, `userAgent`, `deviceId`, `deviceType`, `socketStatus`, `authToken`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, 'admin', '127.0.0.1', '', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418', '127.0.0.1:7006_Windows.10.0_3632e939_chrome', 'web', 'offline', 'cg35O77ui-4sX0oORb32yOm6kNAM0_P9NynG', 'jhUpdate', 'admin', '系统管理员', '2022-11-04T12:01:00+08:00');
INSERT INTO `_user_session` (`id`, `userId`, `userIp`, `userIpRegion`, `userAgent`, `deviceId`, `deviceType`, `socketStatus`, `authToken`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, 'admin', '127.0.0.1', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36', '127.0.0.1:7006_Mac.10.15.7_f4102b4e_chrome', 'web', 'offline', 'JCrUcovB7EzFVxKp0-HF47TF73nGTiN-h34d', 'jhUpdate', 'admin', '系统管理员', '2023-03-01T21:04:20+08:00');
COMMIT;

-- ----------------------------
-- View structure for _view01_user
-- ----------------------------
DROP VIEW IF EXISTS `_view01_user`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `_view01_user` AS select `_user`.`id` AS `id`,`_user`.`idSequence` AS `idSequence`,`_user`.`userId` AS `userId`,`_user`.`username` AS `username`,`_user`.`clearTextPassword` AS `clearTextPassword`,`_user`.`password` AS `password`,`_user`.`md5Salt` AS `md5Salt`,`_user`.`userStatus` AS `userStatus`,`_user`.`userType` AS `userType`,`_user`.`userConfig` AS `userConfig`,`_user`.`operation` AS `operation`,`_user`.`operationByUserId` AS `operationByUserId`,`_user`.`operationByUser` AS `operationByUser`,`_user`.`operationAt` AS `operationAt` from `_user`;

-- ----------------------------
-- View structure for _view02_user_app
-- ----------------------------
DROP VIEW IF EXISTS `_view02_user_app`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `_view02_user_app` AS select `_user_app`.`id` AS `id`,`_app`.`appId` AS `appId`,`_app`.`appName` AS `appName`,`_user`.`userId` AS `userId`,`_user`.`username` AS `username`,`_user`.`userStatus` AS `userStatus`,`_user`.`userType` AS `userType`,`_user_app`.`operation` AS `operation`,`_user_app`.`operationByUserId` AS `operationByUserId`,`_user_app`.`operationByUser` AS `operationByUser`,`_user_app`.`operationAt` AS `operationAt` from ((`_user_app` join `_user` on((`_user_app`.`userId` = `_user`.`userId`))) join `_app` on((`_user_app`.`appId` = `_app`.`appId`)));

-- ----------------------------
-- Triggers structure for table _app
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___app_INSERT`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___app_INSERT` AFTER INSERT ON `_app` FOR EACH ROW BEGIN
            INSERT INTO `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___app`
            (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`)
            VALUES
            (NEW.`id`,NEW.`appId`,NEW.`appGroup`,NEW.`appName`,NEW.`appDesc`,NEW.`appUrl`,NEW.`appMenu`,NEW.`appType`,NEW.`operation`,NEW.`operationByUserId`,NEW.`operationByUser`,NEW.`operationAt`,NEW.`sort`);
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _app
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___app_UPDATE`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___app_UPDATE` AFTER UPDATE ON `_app` FOR EACH ROW BEGIN
            UPDATE `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___app`
            SET `id`=NEW.`id`,`appId`=NEW.`appId`,`appGroup`=NEW.`appGroup`,`appName`=NEW.`appName`,`appDesc`=NEW.`appDesc`,`appUrl`=NEW.`appUrl`,`appMenu`=NEW.`appMenu`,`appType`=NEW.`appType`,`operation`=NEW.`operation`,`operationByUserId`=NEW.`operationByUserId`,`operationByUser`=NEW.`operationByUser`,`operationAt`=NEW.`operationAt`,`sort`=NEW.`sort`
            where id=OLD.id;
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _app
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___app_DELETE`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___app_DELETE` AFTER DELETE ON `_app` FOR EACH ROW BEGIN
            DELETE FROM `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___app` WHERE id = OLD.id;
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _test_case
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___test_case_INSERT`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___test_case_INSERT` AFTER INSERT ON `_test_case` FOR EACH ROW BEGIN
            INSERT INTO `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___test_case`
            (`id`,`pageId`,`testId`,`testName`,`uiActionIdList`,`testOpeartion`,`expectedResult`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`)
            VALUES
            (NEW.`id`,NEW.`pageId`,NEW.`testId`,NEW.`testName`,NEW.`uiActionIdList`,NEW.`testOpeartion`,NEW.`expectedResult`,NEW.`operation`,NEW.`operationByUserId`,NEW.`operationByUser`,NEW.`operationAt`);
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _test_case
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___test_case_UPDATE`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___test_case_UPDATE` AFTER UPDATE ON `_test_case` FOR EACH ROW BEGIN
            UPDATE `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___test_case`
            SET `id`=NEW.`id`,`pageId`=NEW.`pageId`,`testId`=NEW.`testId`,`testName`=NEW.`testName`,`uiActionIdList`=NEW.`uiActionIdList`,`testOpeartion`=NEW.`testOpeartion`,`expectedResult`=NEW.`expectedResult`,`operation`=NEW.`operation`,`operationByUserId`=NEW.`operationByUserId`,`operationByUser`=NEW.`operationByUser`,`operationAt`=NEW.`operationAt`
            where id=OLD.id;
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _test_case
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___test_case_DELETE`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___test_case_DELETE` AFTER DELETE ON `_test_case` FOR EACH ROW BEGIN
            DELETE FROM `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___test_case` WHERE id = OLD.id;
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _user
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___user_INSERT`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___user_INSERT` AFTER INSERT ON `_user` FOR EACH ROW BEGIN
            INSERT INTO `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___user`
            (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`)
            VALUES
            (NEW.`id`,NEW.`idSequence`,NEW.`userId`,NEW.`username`,NEW.`clearTextPassword`,NEW.`password`,NEW.`md5Salt`,NEW.`userStatus`,NEW.`userType`,NEW.`userConfig`,NEW.`operation`,NEW.`operationByUserId`,NEW.`operationByUser`,NEW.`operationAt`);
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _user
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___user_UPDATE`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___user_UPDATE` AFTER UPDATE ON `_user` FOR EACH ROW BEGIN
            UPDATE `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___user`
            SET `id`=NEW.`id`,`idSequence`=NEW.`idSequence`,`userId`=NEW.`userId`,`username`=NEW.`username`,`clearTextPassword`=NEW.`clearTextPassword`,`password`=NEW.`password`,`md5Salt`=NEW.`md5Salt`,`userStatus`=NEW.`userStatus`,`userType`=NEW.`userType`,`userConfig`=NEW.`userConfig`,`operation`=NEW.`operation`,`operationByUserId`=NEW.`operationByUserId`,`operationByUser`=NEW.`operationByUser`,`operationAt`=NEW.`operationAt`
            where id=OLD.id;
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _user
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___user_DELETE`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___user_DELETE` AFTER DELETE ON `_user` FOR EACH ROW BEGIN
            DELETE FROM `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___user` WHERE id = OLD.id;
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _user_app
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___user_app_INSERT`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___user_app_INSERT` AFTER INSERT ON `_user_app` FOR EACH ROW BEGIN
            INSERT INTO `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___user_app`
            (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`)
            VALUES
            (NEW.`id`,NEW.`userId`,NEW.`appId`,NEW.`operation`,NEW.`operationByUserId`,NEW.`operationByUser`,NEW.`operationAt`);
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _user_app
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___user_app_UPDATE`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___user_app_UPDATE` AFTER UPDATE ON `_user_app` FOR EACH ROW BEGIN
            UPDATE `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___user_app`
            SET `id`=NEW.`id`,`userId`=NEW.`userId`,`appId`=NEW.`appId`,`operation`=NEW.`operation`,`operationByUserId`=NEW.`operationByUserId`,`operationByUser`=NEW.`operationByUser`,`operationAt`=NEW.`operationAt`
            where id=OLD.id;
        END
$$
delimiter ;

-- ----------------------------
-- Triggers structure for table _user_app
-- ----------------------------
DROP TRIGGER IF EXISTS `{{dbPrefix}}user_app_management___user_app_DELETE`;
delimiter $$
CREATE TRIGGER `{{dbPrefix}}user_app_management___user_app_DELETE` AFTER DELETE ON `_user_app` FOR EACH ROW BEGIN
            DELETE FROM `{{dbPrefix}}data_repository`.`{{dbPrefix}}user_app_management___user_app` WHERE id = OLD.id;
        END
$$
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
