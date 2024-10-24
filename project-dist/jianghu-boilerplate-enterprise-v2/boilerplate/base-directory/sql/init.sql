/*
 Navicat Premium Data Transfer

 Source Server         : openjianghu02_db
 Source Server Type    : MySQL
 Source Server Version : 50738
 Source Host           : localhost:43302
 Source Schema         : jianghujs_enterprise_directory

 Target Server Type    : MySQL
 Target Server Version : 50738
 File Encoding         : 65001

 Date: 01/03/2023 20:55:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COMMENT='页面表; 软删除未启用;';

-- ----------------------------
-- Records of _page
-- ----------------------------
BEGIN;
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, 'help', '帮助', 'helpV4', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'login', '登陆', 'loginV4', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (6, 'manual', '操作手册', NULL, NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (8, 'directory', '目录', NULL, 'showInMenu', '1', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _record_history
-- ----------------------------
DROP TABLE IF EXISTS `_record_history`;
CREATE TABLE `_record_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(255) DEFAULT NULL COMMENT '表',
  `recordId` int(11) DEFAULT NULL COMMENT '数据在table中的主键id; recordContent.id',
  `recordContent` json NOT NULL COMMENT '数据JSON',
  `packageContent` json NOT NULL COMMENT '当时请求的 package JSON',
  `operation` varchar(255) DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `index_record_id` (`recordId`) USING BTREE,
  KEY `index_table_action` (`table`,`operation`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COMMENT='数据历史表';

-- ----------------------------
-- Records of _record_history
-- ----------------------------
BEGIN;
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, '_user_session', 1, '{\"id\": 1, \"userId\": \"admin\", \"userIp\": \"127.0.0.1\", \"deviceId\": \"127.0.0.1:7007_Windows.10.0_0b25fca4_chrome\", \"authToken\": \"YNmP_e05v6wqKpQXL7CZTc8KWWJL5gZfYOSD\", \"operation\": \"jhInsert\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\", \"deviceType\": \"web\", \"operationAt\": \"2022-11-04T11:46:01+08:00\", \"socketStatus\": \"offline\", \"userIpRegion\": \"\", \"operationByUser\": null, \"operationByUserId\": null}', '{\"appData\": {\"appId\": \"directory\", \"pageId\": \"login\", \"actionId\": \"passwordLogin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\", \"actionData\": {\"userId\": \"admin\", \"deviceId\": \"127.0.0.1:7007_Windows.10.0_0b25fca4_chrome\", \"password\": \"123456\"}}, \"packageId\": \"1667533560948_7092809\", \"packageType\": \"httpRequest\"}', 'jhInsert', NULL, NULL, '2022-11-04T11:46:01+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, '_user_session', 2, '{\"id\": 2, \"userId\": \"admin\", \"userIp\": \"127.0.0.1\", \"deviceId\": \"127.0.0.1:7007_Mac.10.15.7_fbae8120_chrome\", \"authToken\": \"AUxhx6Z48Vgas6teOIqijUo-I5qpBikMIHu_\", \"operation\": \"jhInsert\", \"userAgent\": \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\", \"deviceType\": \"web\", \"operationAt\": \"2023-02-24T13:54:35+08:00\", \"socketStatus\": \"offline\", \"userIpRegion\": \"\", \"operationByUser\": null, \"operationByUserId\": null}', '{\"appData\": {\"appId\": \"directory\", \"pageId\": \"login\", \"actionId\": \"passwordLogin\", \"userAgent\": \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\", \"actionData\": {\"userId\": \"admin\", \"deviceId\": \"127.0.0.1:7007_Mac.10.15.7_fbae8120_chrome\", \"password\": \"123456\"}}, \"packageId\": \"1677218075598_2695287\", \"packageType\": \"httpRequest\"}', 'jhInsert', NULL, NULL, '2023-02-24T13:54:35+08:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=264 DEFAULT CHARSET=utf8mb4 COMMENT='请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';

-- ----------------------------
-- Records of _resource
-- ----------------------------
BEGIN;
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (231, NULL, NULL, 'login', 'passwordLogin', '✅登陆', 'service', NULL, '{ \"service\": \"user\", \"serviceFunction\": \"passwordLogin\" }', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7007_Mac.10.15.7_fbae8120_chrome\"},\"appId\":\"directory\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677218075598_2695287\",\"packageType\":\"httpRequest\"}', '{\"packageId\":\"1677218075598_2695287\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-24T13:54:35+08:00\",\"appData\":{\"authToken\":\"AUxhx6Z48Vgas6teOIqijUo-I5qpBikMIHu_\",\"deviceId\":\"127.0.0.1:7007_Mac.10.15.7_fbae8120_chrome\",\"userId\":\"admin\",\"resultData\":{\"authToken\":\"AUxhx6Z48Vgas6teOIqijUo-I5qpBikMIHu_\",\"deviceId\":\"127.0.0.1:7007_Mac.10.15.7_fbae8120_chrome\",\"userId\":\"admin\"},\"appId\":\"directory\",\"pageId\":\"login\",\"actionId\":\"passwordLogin\"}}', 'update', NULL, NULL, '2023-02-24T13:54:35+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (251, NULL, NULL, 'allPage', 'logout', '✅登出', 'service', NULL, '{ \"service\": \"user\", \"serviceFunction\": \"logout\" }', '', '', 'update', NULL, NULL, '2022-02-23T23:08:31+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (253, NULL, NULL, 'allPage', 'userInfo', '✅获取用户信息', 'service', NULL, '{ \"service\": \"user\", \"serviceFunction\": \"userInfo\" }', '', '', 'update', NULL, NULL, '2022-11-04T11:49:34+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (263, NULL, NULL, 'directory', 'selectItemList', '✅查询目录', 'service', NULL, '{ \"service\": \"directory\", \"serviceFunction\": \"getDirectoryList\" }', '{\"appData\":{\"pageId\":\"directory\",\"actionId\":\"selectItemList\",\"orderBy\":[{\"column\":\"operationAt\",\"order\":\"desc\"}],\"appId\":\"directory\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1677218143168_8084229\",\"packageType\":\"httpRequest\"}', '{\"packageId\":\"1677218143168_8084229\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-24T13:55:43+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":13,\"appId\":\"zhihu\",\"appName\":\"知乎\",\"appGroupName\":\"搜索\",\"appGroupNumber\":\"10\",\"appGroupItemSort\":\"01\",\"url\":\"https://www.zhihu.com/\",\"displayName\":\"有问题就会有答案\",\"description\":null,\"accessType\":\"public\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":14,\"appId\":\"baidu\",\"appName\":\"百度\",\"appGroupName\":\"搜索\",\"appGroupNumber\":\"10\",\"appGroupItemSort\":\"02\",\"url\":\"https://www.baidu.com\",\"displayName\":\"百度一下, 你就知道\",\"description\":null,\"accessType\":\"public\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":15,\"appId\":\"360\",\"appName\":\"360\",\"appGroupName\":\"搜索\",\"appGroupNumber\":\"10\",\"appGroupItemSort\":\"03\",\"url\":\"https://www.so.com/\",\"displayName\":\"最安全的搜索引擎\",\"description\":null,\"accessType\":\"public\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":16,\"appId\":\"sougou\",\"appName\":\"搜狗\",\"appGroupName\":\"搜索\",\"appGroupNumber\":\"10\",\"appGroupItemSort\":\"04\",\"url\":\"https://www.sogou.com/\",\"displayName\":\"上网从搜狗开始\",\"description\":null,\"accessType\":\"public\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":53,\"appId\":\"data_repository\",\"appName\":\"数据中心管理\",\"appGroupName\":\"系统管理\",\"appGroupNumber\":\"20\",\"appGroupItemSort\":\"03\",\"url\":\"http://127.0.0.1:7005/data_repository/page/tableSyncConfig\",\"displayName\":\"数据同步表管理\",\"description\":null,\"accessType\":\"app\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null}]},\"appId\":\"directory\",\"pageId\":\"directory\",\"actionId\":\"selectItemList\"}}', 'update', NULL, NULL, '2023-02-24T13:55:43+08:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COMMENT='角色表; 软删除未启用;';

-- ----------------------------
-- Records of _role
-- ----------------------------
BEGIN;
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'appManager', '应用负责人', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (4, 'teacher', '老师', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (5, 'student', '学生', '', 'insert', NULL, NULL, NULL);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='测试用例表';

-- ----------------------------
-- Records of _test_case
-- ----------------------------
BEGIN;
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
) ENGINE=InnoDB AUTO_INCREMENT=582 DEFAULT CHARSET=utf8mb4 COMMENT='用户群组角色关联表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (568, 'admin', 'authorization', 'appManager', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (569, 'T66661G', 'authorization', 'teacher', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (580, 'T66662G', 'authorization', 'teacher', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (581, 'T66663G', 'authorization', 'teacher', 'insert', NULL, NULL, NULL);
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
INSERT INTO `_user_session` (`id`, `userId`, `userIp`, `userIpRegion`, `userAgent`, `deviceId`, `deviceType`, `socketStatus`, `authToken`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, 'admin', '127.0.0.1', '', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418', '127.0.0.1:7007_Windows.10.0_0b25fca4_chrome', 'web', 'offline', 'YNmP_e05v6wqKpQXL7CZTc8KWWJL5gZfYOSD', 'jhInsert', NULL, NULL, '2022-11-04T11:46:01+08:00');
INSERT INTO `_user_session` (`id`, `userId`, `userIp`, `userIpRegion`, `userAgent`, `deviceId`, `deviceType`, `socketStatus`, `authToken`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, 'admin', '127.0.0.1', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', '127.0.0.1:7007_Mac.10.15.7_fbae8120_chrome', 'web', 'offline', 'AUxhx6Z48Vgas6teOIqijUo-I5qpBikMIHu_', 'jhInsert', NULL, NULL, '2023-02-24T13:54:35+08:00');
COMMIT;

-- ----------------------------
-- Table structure for directory
-- ----------------------------
DROP TABLE IF EXISTS `directory`;
CREATE TABLE `directory` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `appId` varchar(255) DEFAULT NULL COMMENT '应用ID; 可以是内部应用 E.g: user_app_management; 也可以是外部应用 E.g: taobao, baidu, zhihu',
  `appName` varchar(255) DEFAULT NULL COMMENT '应用名',
  `appGroupName` varchar(255) DEFAULT NULL COMMENT '应用组名',
  `appGroupNumber` varchar(255) DEFAULT NULL COMMENT '应用组排序',
  `appGroupItemSort` varchar(255) DEFAULT NULL COMMENT '应用组下url的排序',
  `url` varchar(255) DEFAULT NULL COMMENT '链接; 可以是外部链接, 也可是内部应用链接',
  `displayName` varchar(255) DEFAULT NULL COMMENT '链接展示名',
  `description` varchar(255) DEFAULT NULL COMMENT '链接描述',
  `accessType` varchar(255) DEFAULT NULL COMMENT '链接权限类型, public: 所有登陆用户都可以拿到, app: 只有用户有app权限才能拿到',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of directory
-- ----------------------------
BEGIN;
INSERT INTO `directory` (`id`, `appId`, `appName`, `appGroupName`, `appGroupNumber`, `appGroupItemSort`, `url`, `displayName`, `description`, `accessType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (13, 'zhihu', '知乎', '搜索', '10', '01', 'https://www.zhihu.com/', '有问题就会有答案', NULL, 'public', 'insert', NULL, NULL, NULL);
INSERT INTO `directory` (`id`, `appId`, `appName`, `appGroupName`, `appGroupNumber`, `appGroupItemSort`, `url`, `displayName`, `description`, `accessType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (14, 'baidu', '百度', '搜索', '10', '02', 'https://www.baidu.com', '百度一下, 你就知道', NULL, 'public', 'insert', NULL, NULL, NULL);
INSERT INTO `directory` (`id`, `appId`, `appName`, `appGroupName`, `appGroupNumber`, `appGroupItemSort`, `url`, `displayName`, `description`, `accessType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (15, '360', '360', '搜索', '10', '03', 'https://www.so.com/', '最安全的搜索引擎', NULL, 'public', 'insert', NULL, NULL, NULL);
INSERT INTO `directory` (`id`, `appId`, `appName`, `appGroupName`, `appGroupNumber`, `appGroupItemSort`, `url`, `displayName`, `description`, `accessType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (16, 'sougou', '搜狗', '搜索', '10', '04', 'https://www.sogou.com/', '上网从搜狗开始', NULL, 'public', 'insert', NULL, NULL, NULL);
INSERT INTO `directory` (`id`, `appId`, `appName`, `appGroupName`, `appGroupNumber`, `appGroupItemSort`, `url`, `displayName`, `description`, `accessType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (51, 'user_app_management', '账号权限管理', '系统管理', '20', '01', 'http://127.0.0.1:7006/user_app_management/page/userManagement', '用户管理', NULL, 'app', 'insert', NULL, NULL, NULL);
INSERT INTO `directory` (`id`, `appId`, `appName`, `appGroupName`, `appGroupNumber`, `appGroupItemSort`, `url`, `displayName`, `description`, `accessType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (52, 'user_app_management', '账号权限管理', '系统管理', '20', '02', 'http://127.0.0.1:7006/user_app_management/page/appManagement', 'APP管理', NULL, 'app', 'insert', NULL, NULL, NULL);
INSERT INTO `directory` (`id`, `appId`, `appName`, `appGroupName`, `appGroupNumber`, `appGroupItemSort`, `url`, `displayName`, `description`, `accessType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (53, 'data_repository', '数据中心管理', '系统管理', '20', '03', 'http://127.0.0.1:7005/data_repository/page/tableSyncConfig', '数据同步表管理', NULL, 'app', 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- View structure for _view01_user
-- ----------------------------
DROP VIEW IF EXISTS `_view01_user`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `_view01_user` AS select `jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`id` AS `id`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`idSequence` AS `idSequence`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`userId` AS `userId`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`username` AS `username`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`clearTextPassword` AS `clearTextPassword`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`password` AS `password`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`md5Salt` AS `md5Salt`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`userStatus` AS `userStatus`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`userType` AS `userType`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`userConfig` AS `userConfig`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`operation` AS `operation`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`operationByUserId` AS `operationByUserId`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`operationByUser` AS `operationByUser`,`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`operationAt` AS `operationAt` from (`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user` join `jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user_app` on((`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user`.`userId` = `jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user_app`.`userId`))) where (`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user_app`.`appId` = 'directory');

-- ----------------------------
-- View structure for _view02_user_app
-- ----------------------------
DROP VIEW IF EXISTS `_view02_user_app`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `_view02_user_app` AS select `_user_app`.`id` AS `id`,`_app`.`appId` AS `appId`,`_app`.`appName` AS `appName`,`_user`.`userId` AS `userId`,`_user`.`username` AS `username`,`_user`.`userStatus` AS `userStatus`,`_user`.`userType` AS `userType`,`_user_app`.`operation` AS `operation`,`_user_app`.`operationByUserId` AS `operationByUserId`,`_user_app`.`operationByUser` AS `operationByUser`,`_user_app`.`operationAt` AS `operationAt` from ((`jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user_app` `_user_app` join `jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___user` `_user` on((`_user_app`.`userId` = `_user`.`userId`))) join `jianghujs_enterprise_data_repository`.`jianghujs_enterprise_user_app_management___app` `_app` on((`_user_app`.`appId` = `_app`.`appId`)));

SET FOREIGN_KEY_CHECKS = 1;
