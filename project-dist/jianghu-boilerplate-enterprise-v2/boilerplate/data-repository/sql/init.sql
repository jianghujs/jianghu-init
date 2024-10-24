/*
 Navicat Premium Data Transfer

 Source Server         : openjianghu02_db
 Source Server Type    : MySQL
 Source Server Version : 50738
 Source Host           : localhost:43302
 Source Schema         : jianghujs_enterprise_data_repository

 Target Server Type    : MySQL
 Target Server Version : 50738
 File Encoding         : 65001

 Date: 01/03/2023 20:50:53
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COMMENT='页面表; 软删除未启用;';

-- ----------------------------
-- Records of _page
-- ----------------------------
BEGIN;
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, 'help', '帮助', 'helpV4', 'dynamicInMenu', '0', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'login', '登陆', 'loginV4', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (4, 'goToDirectory', '回到目录', NULL, 'showInMenu', '1', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (8, 'tableSyncConfig', '数据同步表管理', NULL, 'showInMenu', '1', 'insert', NULL, NULL, NULL);
INSERT INTO `_page` (`id`, `pageId`, `pageName`, `pageFile`, `pageType`, `sort`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (12, 'tableSyncLog', '数据表同步日志', NULL, 'showInMenu', '2', 'update', 'vscode', 'vscode', '2022-06-06T23:46:28+08:00');
COMMIT;

-- ----------------------------
-- Table structure for _record_history
-- ----------------------------
DROP TABLE IF EXISTS `_record_history`;
CREATE TABLE `_record_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(255) DEFAULT NULL COMMENT '表',
  `recordId` int(11) DEFAULT NULL COMMENT '数据在table中的主键id; recordContent.id',
  `recordContent` text COMMENT '数据JSON',
  `packageContent` text COMMENT '当时请求的 package JSON',
  `operation` varchar(255) DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `index_record_id` (`recordId`) USING BTREE,
  KEY `index_table_action` (`table`,`operation`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COMMENT='数据历史表';

-- ----------------------------
-- Records of _record_history
-- ----------------------------
BEGIN;
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, '_user_session', 1, '{\"id\":1,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\",\"deviceId\":\"127.0.0.1:7005_Windows.10.0_26a04874_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"6Mq7ivrmuOK2UX-awUKB25ROQA4t_9VME9YA\",\"operation\":\"jhInsert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":\"2022-11-04T11:44:47+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Windows.10.0_26a04874_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418\"},\"packageId\":\"1667533484661_9781957\",\"packageType\":\"httpRequest\"}', 'jhInsert', NULL, NULL, '2022-11-04T11:44:47+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, '_user_session', 2, '{\"id\":2,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_a8a8389a_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"jIReMXlr9c5eUEand4NCUkewbMM9uePfS606\",\"operation\":\"jhInsert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":\"2022-12-09T13:44:49+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_a8a8389a_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36\"},\"packageId\":\"1670564687760_1692529\",\"packageType\":\"httpRequest\"}', 'jhInsert', NULL, NULL, '2022-12-09T13:44:49+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"KS1kRGMzbUNrELyuqHLxcD6vtJY8QQ3Tigh3\",\"operation\":\"jhInsert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":\"2023-02-24T14:53:07+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677221586435_5808369\",\"packageType\":\"httpRequest\"}', 'jhInsert', NULL, NULL, '2023-02-24T14:53:07+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (4, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"KS1kRGMzbUNrELyuqHLxcD6vtJY8QQ3Tigh3\",\"operation\":\"jhInsert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":\"2023-02-24T14:53:07+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677221665953_4957439\",\"packageType\":\"httpRequest\"}', 'jhInsert', NULL, NULL, '2023-02-24T14:53:07+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (5, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"U06XrIs4c2VYqGqiS4bMD38cFKq0hp804Xra\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2023-02-24T14:54:26+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677221665953_4957439\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2023-02-24T14:54:26+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (6, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"U06XrIs4c2VYqGqiS4bMD38cFKq0hp804Xra\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2023-02-24T14:54:26+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677253827476_6821663\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2023-02-24T14:54:26+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (7, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"gWMkNGzIHKUVPpFale-qk3XHCjSNp9yvkwaA\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2023-02-24T23:50:27+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677253827476_6821663\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2023-02-24T23:50:27+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (8, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"gWMkNGzIHKUVPpFale-qk3XHCjSNp9yvkwaA\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2023-02-24T23:50:27+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677255046842_8556083\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2023-02-24T23:50:27+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (9, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"1L3jcgvqG5PgbueaRbqoXhirZmOPFQQYB5k9\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2023-02-25T00:10:46+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677255046842_8556083\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2023-02-25T00:10:46+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (10, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"1L3jcgvqG5PgbueaRbqoXhirZmOPFQQYB5k9\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2023-02-25T00:10:46+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677255618965_9853388\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2023-02-25T00:10:46+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (11, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"EbXx7LTrmfsdAySYjyEFVc1yWBJ8LADVRb8Y\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2023-02-25T00:20:19+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677255618965_9853388\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2023-02-25T00:20:19+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (12, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"EbXx7LTrmfsdAySYjyEFVc1yWBJ8LADVRb8Y\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2023-02-25T00:20:19+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677255784771_9034669\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2023-02-25T00:20:19+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (13, '_user_session', 3, '{\"id\":3,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"U-Bo6B-f-ZGKPhScwgSrvjxxlfJ5wU_JiouH\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"系统管理员\",\"operationAt\":\"2023-02-25T00:23:04+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677255784771_9034669\",\"packageType\":\"httpRequest\"}', 'jhUpdate', 'admin', '系统管理员', '2023-02-25T00:23:04+08:00');
INSERT INTO `_record_history` (`id`, `table`, `recordId`, `recordContent`, `packageContent`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (14, '_user_session', 4, '{\"id\":4,\"userId\":\"admin\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_07ce59bd_chrome\",\"deviceType\":\"web\",\"socketStatus\":\"offline\",\"authToken\":\"KTMgTZ3e-sKOdCyNz6MNVb-6gU6nlCYNAtwF\",\"operation\":\"jhInsert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":\"2023-03-01T20:49:49+08:00\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_07ce59bd_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\"},\"packageId\":\"1677674987533_3344605\",\"packageType\":\"httpRequest\"}', 'jhInsert', NULL, NULL, '2023-03-01T20:49:49+08:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=412 DEFAULT CHARSET=utf8mb4 COMMENT='请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';

-- ----------------------------
-- Records of _resource
-- ----------------------------
BEGIN;
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (231, NULL, NULL, 'login', 'passwordLogin', '✅登陆', 'service', NULL, '{\"service\": \"user\", \"serviceFunction\": \"passwordLogin\"}', '{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677255784771_9034669\",\"packageType\":\"httpRequest\"}', '{\"packageId\":\"1677255784771_9034669\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-25T00:23:04+08:00\",\"appData\":{\"resultData\":{\"authToken\":\"U-Bo6B-f-ZGKPhScwgSrvjxxlfJ5wU_JiouH\",\"deviceId\":\"127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome\",\"userId\":\"admin\"},\"appId\":\"data_repository\",\"pageId\":\"login\",\"actionId\":\"passwordLogin\"}}', 'update', NULL, NULL, '2023-02-25T00:23:04+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (251, NULL, NULL, 'allPage', 'logout', '✅登出', 'service', NULL, '{\"service\": \"user\", \"serviceFunction\": \"logout\"}', '', '', 'update', NULL, NULL, '2022-09-10T15:10:06+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (252, NULL, NULL, 'allPage', 'refreshToken', '✅刷新authToken', 'service', NULL, '{\"service\": \"user\", \"serviceFunction\": \"refreshToken\"}', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (253, NULL, NULL, 'allPage', 'userInfo', '✅获取用户信息', 'service', NULL, '{\"service\": \"user\", \"serviceFunction\": \"userInfo\"}', '{\"appData\":{\"pageId\":\"allPage\",\"actionId\":\"userInfo\",\"actionData\":{},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36\"},\"packageId\":\"1670564691184_9752979\",\"packageType\":\"httpRequest\"}', '{\"packageId\":\"1670564691184_9752979\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2022-12-09T13:44:52+08:00\"}', 'update', NULL, NULL, '2022-12-09T13:44:52+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (256, NULL, NULL, 'allPage', 'uploadByStream', '✅文件上传(文件流)', 'service', NULL, '{\"service\": \"file\", \"serviceFunction\": \"uploadByBase64\"}', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (257, NULL, NULL, 'allPage', 'uploadByBase64', '✅文件上传(base64)', 'service', NULL, '{\"service\": \"file\", \"serviceFunction\": \"downlaodBase64ByFileId\"}', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (395, NULL, NULL, 'tableSyncConfig', 'selectSourceDatabase', '✅数据库管理页-查询源数据库列表', 'service', NULL, '{\"service\": \"tableSync\", \"serviceFunction\": \"selectSourceDatabase\"}', '{\"appData\":{\"pageId\":\"tableSyncConfig\",\"actionId\":\"selectSourceDatabase\",\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1677255785249_2560094\",\"packageType\":\"httpRequest\"}', '{\"packageId\":\"1677255785249_2560094\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-25T00:23:05+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceDatabase\":\"jianghujs_enterprise_directory\"},{\"sourceDatabase\":\"jianghujs_enterprise_data_repository\"},{\"sourceDatabase\":\"jianghujs_enterprise_1table_crud\"}]},\"appId\":\"data_repository\",\"pageId\":\"tableSyncConfig\",\"actionId\":\"selectSourceDatabase\"}}', 'update', NULL, NULL, '2023-02-25T00:23:05+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (396, NULL, NULL, 'tableSyncConfig', 'selectSourceTable', '✅数据库管理页-查询源数据库中的table列表', 'service', NULL, '{\"service\": \"tableSync\", \"serviceFunction\": \"selectSourceTable\"}', '{\"appData\":{\"pageId\":\"tableSyncConfig\",\"actionId\":\"selectSourceTable\",\"actionData\":{\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},\"orderBy\":[{\"column\":\"operationAt\",\"order\":\"desc\"}],\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677253585448_5598934\",\"packageType\":\"httpRequest\"}', '{\"packageId\":\"1677253585448_5598934\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-24T23:46:25+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"sourceTable\":\"_user_session\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_user_group_role_resource\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_user_group_role_page\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_user_group_role\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_user_app_09_12\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_user_app\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_user\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_ui\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_test_case\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_role\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_resource\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_record_history\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_page\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_group\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_cache\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"},{\"sourceTable\":\"_app\",\"sourceDatabase\":\"jianghujs_enterprise_user_app_management\"}]},\"appId\":\"data_repository\",\"pageId\":\"tableSyncConfig\",\"actionId\":\"selectSourceTable\"}}', 'update', NULL, NULL, '2023-02-24T23:46:25+08:00');
INSERT INTO `_resource` (accessControlTable,resourceHook,pageId,actionId,`desc`,resourceType,appDataSchema,resourceData,requestDemo,responseDemo,operation,operationByUserId,operationByUser,operationAt) VALUES (NULL,NULL,'tableSyncConfig','insertTable','✅数据库管理页-创建同步表','sql','{"type":"object","required":["actionData"],"properties":{"actionData":{"type":"object","required":["sourceDatabase","sourceTable","syncTimeSlot"],"properties":{"sourceDatabase":{"type":"string"},"sourceTable":{"type":"string"},"syncTimeSlot":{"type":"string"}},"additionalProperties":true}},"additionalProperties":true}','{"table": "_table_sync_config", "operation": "insert"}','{"appData":{"pageId":"tableSyncConfig","actionId":"insertTable","actionData":{"syncTimeSlot":5,"sourceDatabase":"jianghujs_enterprise_user_app_management","sourceTable":"_test_case"},"appId":"data_repository","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"},"packageId":"1670564823171_2419895","packageType":"httpRequest"}','{"packageId":"1670564823171_2419895","packageType":"httpResponse","status":"success","timestamp":"2022-12-09T13:47:05+08:00","appData":{"rows":[205],"resultData":{"rows":[205]},"appId":"data_repository","pageId":"tableSyncConfig","actionId":"insertTable"}}','update',NULL,NULL,'2022-12-09T13:47:05+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (398, NULL, NULL, 'tableSyncConfig', 'deleteTable', '✅数据库管理页-删除同步表', 'service', NULL, '{\"service\": \"tableSync\", \"serviceFunction\": \"deleteTableSyncConfig\"}', '', '', 'update', NULL, NULL, '2022-08-31T10:07:07+08:00');
INSERT INTO `_resource` (accessControlTable,resourceHook,pageId,actionId,`desc`,resourceType,appDataSchema,resourceData,requestDemo,responseDemo,operation,operationByUserId,operationByUser,operationAt) VALUES (NULL,NULL,'tableSyncConfig','updateTable','✅数据库管理页-更新同步表','sql','{"type":"object","required":["actionData"],"properties":{"actionData":{"type":"object","required":["sourceDatabase","sourceTable","syncTimeSlot"],"properties":{"sourceDatabase":{"type":"string"},"sourceTable":{"type":"string"},"syncTimeSlot":{"type":"string"}},"additionalProperties":true}},"additionalProperties":true}','{"table": "_table_sync_config", "operation": "update"}','','','update',NULL,NULL,'2022-09-10T14:19:10+08:00');
INSERT INTO `_resource` (accessControlTable,resourceHook,pageId,actionId,`desc`,resourceType,appDataSchema,resourceData,requestDemo,responseDemo,operation,operationByUserId,operationByUser,operationAt) VALUES (NULL,NULL,'tableSyncConfig','selectItemList','✅数据库管理页-查询同步表','sql','{"type":"object","required":["orderBy"],"properties":{"orderBy":{"type":"array","minItems":1,"items":{"type":"object","required":["column","order"],"properties":{"column":{"type":"string"},"order":{"type":"string"}}}}},"additionalProperties":true}','{"table": "_table_sync_config", "operation": "select"}','{"appData":{"pageId":"tableSyncConfig","actionId":"selectItemList","orderBy":[{"column":"operationAt","order":"desc"}],"appId":"data_repository","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36","actionData":{}},"packageId":"1677255785249_5540097","packageType":"httpRequest"}','{"packageId":"1677255785249_5540097","packageType":"httpResponse","status":"success","timestamp":"2023-02-25T00:23:05+08:00","appData":{"resultData":{"rows":[{"id":206,"sourceDatabase":"{\\"host\\":\\"127.0.0.1\\",\\"port\\":3306,\\"user\\":\\"root\\",\\"password\\":\\"123456\\",\\"database\\":\\"vvv\\",\\"name\\":\\"outsideDatabase\\"}","sourceTable":"_user","syncTimeSlot":"5","syncDesc":"【数据库连接】外部连接失败;Error: ER_BAD_DB_ERROR: Unknown database ''vvv''","lastSyncTime":"2023-02-24T23:50:38+08:00","operation":"update","operationByUserId":"admin","operationByUser":"系统管理员","operationAt":"2023-02-24T23:50:38+08:00"},{"id":202,"sourceDatabase":"jianghujs_enterprise_user_app_management","sourceTable":"_user_app","syncTimeSlot":"5","syncDesc":"正常","lastSyncTime":"2023-02-24T23:30:16+08:00","operation":"update","operationByUserId":"admin","operationByUser":"系统管理员","operationAt":"2023-02-24T23:30:17+08:00"},{"id":203,"sourceDatabase":"jianghujs_enterprise_user_app_management","sourceTable":"_app","syncTimeSlot":"5","syncDesc":"正常","lastSyncTime":"2023-02-24T23:30:16+08:00","operation":"update","operationByUserId":"admin","operationByUser":"系统管理员","operationAt":"2023-02-24T23:30:17+08:00"},{"id":204,"sourceDatabase":"jianghujs_enterprise_user_app_management","sourceTable":"_user","syncTimeSlot":"5","syncDesc":"正常","lastSyncTime":"2023-02-24T23:30:16+08:00","operation":"update","operationByUserId":"admin","operationByUser":"系统管理员","operationAt":"2023-02-24T23:30:17+08:00"},{"id":205,"sourceDatabase":"jianghujs_enterprise_user_app_management","sourceTable":"_test_case","syncTimeSlot":"5","syncDesc":"正常","lastSyncTime":"2023-02-24T23:30:16+08:00","operation":"update","operationByUserId":"admin","operationByUser":"系统管理员","operationAt":"2023-02-24T23:30:17+08:00"}]},"appId":"data_repository","pageId":"tableSyncConfig","actionId":"selectItemList"}}','update',NULL,NULL,'2023-02-25T00:23:05+08:00');
INSERT INTO `_resource` (`id`, `accessControlTable`, `resourceHook`, `pageId`, `actionId`, `desc`, `resourceType`, `appDataSchema`, `resourceData`, `requestDemo`, `responseDemo`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (407, NULL, NULL, 'tableSyncConfig', 'syncTable', '✅数据库管理页-手动同步表', 'service', NULL, '{\"service\": \"tableSync\", \"serviceFunction\": \"syncTable\"}', '{\"appData\":{\"pageId\":\"tableSyncConfig\",\"actionId\":\"syncTable\",\"actionData\":{\"sourceDatabase\":\"{\\\"host\\\":\\\"127.0.0.1\\\",\\\"port\\\":3306,\\\"user\\\":\\\"root\\\",\\\"password\\\":\\\"123456\\\",\\\"database\\\":\\\"vvv\\\",\\\"name\\\":\\\"outsideDatabase\\\"}\",\"sourceTable\":\"_user\"},\"appId\":\"data_repository\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677253838710_4094675\",\"packageType\":\"httpRequest\"}', '{\"packageId\":\"1677253838710_4094675\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-24T23:50:38+08:00\",\"appData\":{\"appId\":\"data_repository\",\"pageId\":\"tableSyncConfig\",\"actionId\":\"syncTable\"}}', 'update', NULL, NULL, '2023-02-24T23:50:38+08:00');
INSERT INTO `_resource` (accessControlTable,resourceHook,pageId,actionId,`desc`,resourceType,appDataSchema,resourceData,requestDemo,responseDemo,operation,operationByUserId,operationByUser,operationAt) VALUES (NULL,NULL,'tableSyncLog','selectItemList','✅获取同步日志','sql','{"type":"object","required":["orderBy"],"properties":{"orderBy":{"type":"array","minItems":1,"items":{"type":"object","required":["column","order"],"properties":{"column":{"type":"string"},"order":{"type":"string"}}}}},"additionalProperties":true}','{"table": "_table_sync_log", "operation": "select"}','{"appData":{"pageId":"tableSyncLog","actionId":"selectItemList","orderBy":[{"column":"operationAt","order":"desc"}],"appId":"data_repository","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36","actionData":{}},"packageId":"1677255779327_9322934","packageType":"httpRequest"}','{"packageId":"1677255779327_9322934","packageType":"httpResponse","status":"success","timestamp":"2023-02-25T00:22:59+08:00"}','update',NULL,NULL,'2023-02-25T00:22:59+08:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='角色表; 软删除未启用;';

-- ----------------------------
-- Records of _role
-- ----------------------------
BEGIN;
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'appAdmin', '系统管理员', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (4, 'teacher', '老师', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (5, 'student', '学生', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (6, 'appManager', '管理员', NULL, 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for _table_sync_config
-- ----------------------------
DROP TABLE IF EXISTS `_table_sync_config`;
CREATE TABLE `_table_sync_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sourceDatabase` varchar(255) DEFAULT NULL,
  `sourceTable` varchar(255) DEFAULT NULL,
  `syncTimeSlot` varchar(255) DEFAULT NULL,
  `syncDesc` varchar(255) DEFAULT NULL COMMENT '同步状态,  正常, 源表不存在; 目标表不存在;,源表不存在; 目标表存在; ',
  `lastSyncTime` varchar(255) DEFAULT NULL COMMENT '最后一次触发同步的时间',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of _table_sync_config
-- ----------------------------
BEGIN;
INSERT INTO `_table_sync_config` (`id`, `sourceDatabase`, `sourceTable`, `syncTimeSlot`, `syncDesc`, `lastSyncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (202, 'jianghujs_enterprise_user_app_management', '_user_app', '5', '正常', '2023-03-01T20:48:36+08:00', 'update', 'admin', '系统管理员', '2023-03-01T20:48:44+08:00');
INSERT INTO `_table_sync_config` (`id`, `sourceDatabase`, `sourceTable`, `syncTimeSlot`, `syncDesc`, `lastSyncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (203, 'jianghujs_enterprise_user_app_management', '_app', '5', '正常', '2023-03-01T20:48:36+08:00', 'update', 'admin', '系统管理员', '2023-03-01T20:48:44+08:00');
INSERT INTO `_table_sync_config` (`id`, `sourceDatabase`, `sourceTable`, `syncTimeSlot`, `syncDesc`, `lastSyncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (204, 'jianghujs_enterprise_user_app_management', '_user', '5', '正常', '2023-03-01T20:48:36+08:00', 'update', 'admin', '系统管理员', '2023-03-01T20:48:44+08:00');
INSERT INTO `_table_sync_config` (`id`, `sourceDatabase`, `sourceTable`, `syncTimeSlot`, `syncDesc`, `lastSyncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (205, 'jianghujs_enterprise_user_app_management', '_test_case', '5', '正常', '2023-03-01T20:48:36+08:00', 'update', 'admin', '系统管理员', '2023-03-01T20:48:44+08:00');
INSERT INTO `_table_sync_config` (`id`, `sourceDatabase`, `sourceTable`, `syncTimeSlot`, `syncDesc`, `lastSyncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (206, '{\"host\":\"127.0.0.1\",\"port\":3306,\"user\":\"root\",\"password\":\"123456\",\"database\":\"vvv\",\"name\":\"outsideDatabase\"}', '_user', '5', '【数据库连接】外部连接失败;Error: ER_BAD_DB_ERROR: Unknown database \'vvv\'', '2023-03-01T20:48:36+08:00', 'update', 'admin', '系统管理员', '2023-03-01T20:48:37+08:00');
COMMIT;

-- ----------------------------
-- Table structure for _table_sync_log
-- ----------------------------
DROP TABLE IF EXISTS `_table_sync_log`;
CREATE TABLE `_table_sync_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sourceDatabase` varchar(255) DEFAULT NULL,
  `sourceTable` varchar(255) DEFAULT NULL,
  `syncAction` varchar(255) DEFAULT NULL COMMENT '同步动作',
  `syncDesc` varchar(255) DEFAULT NULL COMMENT '同步描述',
  `syncTime` varchar(255) DEFAULT NULL COMMENT '同步触发时间',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of _table_sync_log
-- ----------------------------
BEGIN;
INSERT INTO `_table_sync_log` (`id`, `sourceDatabase`, `sourceTable`, `syncAction`, `syncDesc`, `syncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, 'jianghujs_enterprise_user_app_management', '_test_case', '仓库表覆盖', '【表覆盖】结构不一致; 触发覆盖仓库表逻辑;', '2022-12-09T13:47:23+08:00', 'insert', NULL, NULL, '2022-12-09T13:47:23+08:00');
INSERT INTO `_table_sync_log` (`id`, `sourceDatabase`, `sourceTable`, `syncAction`, `syncDesc`, `syncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, 'jianghujs_enterprise_user_app_management', '_test_case', '触发器覆盖', 'insert 触发器覆盖', '2022-12-09T13:47:23+08:00', 'insert', NULL, NULL, '2022-12-09T13:47:23+08:00');
INSERT INTO `_table_sync_log` (`id`, `sourceDatabase`, `sourceTable`, `syncAction`, `syncDesc`, `syncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'jianghujs_enterprise_user_app_management', '_test_case', '触发器覆盖', 'insert 触发器覆盖', '2022-12-09T13:47:24+08:00', 'insert', NULL, NULL, '2022-12-09T13:47:24+08:00');
INSERT INTO `_table_sync_log` (`id`, `sourceDatabase`, `sourceTable`, `syncAction`, `syncDesc`, `syncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (4, 'jianghujs_enterprise_user_app_management', '_test_case', '触发器覆盖', 'delete 触发器覆盖', '2022-12-09T13:47:24+08:00', 'insert', NULL, NULL, '2022-12-09T13:47:24+08:00');
INSERT INTO `_table_sync_log` (`id`, `sourceDatabase`, `sourceTable`, `syncAction`, `syncDesc`, `syncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (5, '{\"host\":\"127.0.0.1\",\"port\":3306,\"user\":\"root\",\"password\":\"123456\",\"database\":\"vvv\",\"name\":\"outsideDatabase\"}', '_user', '外部库不触发仓库表覆盖', '【表覆盖】结构不一致; 由于外部库，未触发覆盖仓库表逻辑;', '2023-02-02T23:32:31+08:00', 'insert', NULL, NULL, '2023-02-02T23:32:31+08:00');
INSERT INTO `_table_sync_log` (`id`, `sourceDatabase`, `sourceTable`, `syncAction`, `syncDesc`, `syncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (6, '{\"host\":\"127.0.0.1\",\"port\":3306,\"user\":\"root\",\"password\":\"123456\",\"database\":\"vvv\",\"name\":\"outsideDatabase\"}', '_user', '外部库不触发仓库表覆盖', '【表覆盖】结构不一致; 由于外部库，未触发覆盖仓库表逻辑;', '2023-02-02T23:34:44+08:00', 'insert', NULL, NULL, '2023-02-02T23:34:44+08:00');
INSERT INTO `_table_sync_log` (`id`, `sourceDatabase`, `sourceTable`, `syncAction`, `syncDesc`, `syncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (7, '{\"host\":\"127.0.0.1\",\"port\":3306,\"user\":\"root\",\"password\":\"123456\",\"database\":\"vvv\",\"name\":\"outsideDatabase\"}', '_user', '外部库不触发仓库表覆盖', '【表覆盖】结构不一致; 由于外部库，未触发覆盖仓库表逻辑;', '2023-02-02T23:36:12+08:00', 'insert', NULL, NULL, '2023-02-02T23:36:12+08:00');
INSERT INTO `_table_sync_log` (`id`, `sourceDatabase`, `sourceTable`, `syncAction`, `syncDesc`, `syncTime`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (8, '{\"host\":\"127.0.0.1\",\"port\":3306,\"user\":\"root\",\"password\":\"123456\",\"database\":\"vvv\",\"name\":\"outsideDatabase\"}', '_user', '数据同步', '【数据同步】数据不一致; 触发数据同步逻辑;', '2023-02-02T23:45:03+08:00', 'insert', NULL, NULL, '2023-02-02T23:45:03+08:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- ----------------------------
-- Records of _user
-- ----------------------------
BEGIN;
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (42, '111', 'admin', '系统管理员', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', 'common', NULL, 'update', NULL, NULL, '2022-02-19T15:02:24+08:00');
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (43, NULL, 'W00001', '张三丰2', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', 'teacher', NULL, 'jhUpdate', 'admin', '系统管理员', '2022-09-08T14:44:40+08:00');
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (44, NULL, 'W00002', '张无忌', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'update', 'admin', '系统管理员', '2022-02-19T15:45:14+08:00');
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (45, NULL, 'G00001', '洪七公', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', 'student', NULL, 'jhUpdate', 'admin', '系统管理员', '2022-09-09T16:02:56+08:00');
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (46, NULL, 'G00002', '郭靖', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (47, NULL, 'H00001', '岳不群', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (48, NULL, 'H00002', '令狐冲', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', 'student', NULL, 'jhUpdate', 'admin', '系统管理员', '2022-09-09T16:02:51+08:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=585 DEFAULT CHARSET=utf8mb4 COMMENT='用户群组角色关联表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (568, 'admin', 'authorization', 'appManager', 'jhUpdate', 'admin', '系统管理员', '2022-09-08T14:45:30+08:00');
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (569, 'T66661G', 'authorization', 'teacher', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (580, 'T66662G', 'authorization', 'teacher', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (581, 'T66663G', 'authorization', 'teacher', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (582, 'W00001', 'authorization', 'student', 'jhInsert', 'admin', '系统管理员', '2022-04-29T14:11:31+08:00');
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (583, 'W00001', 'authorization', 'teacher', 'jhInsert', 'admin', '系统管理员', '2022-04-29T14:13:21+08:00');
INSERT INTO `_user_group_role` (`id`, `userId`, `groupId`, `roleId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (584, 'G00001', 'authorization', 'teacher', 'jhInsert', 'admin', '系统管理员', '2022-09-08T14:45:01+08:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='用户session表; deviceId 维度;软删除未启用;';

-- ----------------------------
-- Records of _user_session
-- ----------------------------
BEGIN;
INSERT INTO `_user_session` (`id`, `userId`, `userIp`, `userIpRegion`, `userAgent`, `deviceId`, `deviceType`, `socketStatus`, `authToken`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, 'admin', '127.0.0.1', '', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/107.0.1418', '127.0.0.1:7005_Windows.10.0_26a04874_chrome', 'web', 'offline', '6Mq7ivrmuOK2UX-awUKB25ROQA4t_9VME9YA', 'jhInsert', NULL, NULL, '2022-11-04T11:44:47+08:00');
INSERT INTO `_user_session` (`id`, `userId`, `userIp`, `userIpRegion`, `userAgent`, `deviceId`, `deviceType`, `socketStatus`, `authToken`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (2, 'admin', '127.0.0.1', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', '127.0.0.1:7005_Mac.10.15.7_a8a8389a_chrome', 'web', 'offline', 'jIReMXlr9c5eUEand4NCUkewbMM9uePfS606', 'jhInsert', NULL, NULL, '2022-12-09T13:44:49+08:00');
INSERT INTO `_user_session` (`id`, `userId`, `userIp`, `userIpRegion`, `userAgent`, `deviceId`, `deviceType`, `socketStatus`, `authToken`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'admin', '127.0.0.1', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36', '127.0.0.1:7005_Mac.10.15.7_e2863ca2_chrome', 'web', 'offline', 'U-Bo6B-f-ZGKPhScwgSrvjxxlfJ5wU_JiouH', 'jhUpdate', 'admin', '系统管理员', '2023-02-25T00:23:04+08:00');
INSERT INTO `_user_session` (`id`, `userId`, `userIp`, `userIpRegion`, `userAgent`, `deviceId`, `deviceType`, `socketStatus`, `authToken`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (4, 'admin', '127.0.0.1', '', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36', '127.0.0.1:7005_Mac.10.15.7_07ce59bd_chrome', 'web', 'offline', 'KTMgTZ3e-sKOdCyNz6MNVb-6gU6nlCYNAtwF', 'jhInsert', NULL, NULL, '2023-03-01T20:49:49+08:00');
COMMIT;

-- ----------------------------
-- Table structure for jianghujs_enterprise_user_app_management___app
-- ----------------------------
DROP TABLE IF EXISTS `jianghujs_enterprise_user_app_management___app`;
CREATE TABLE `jianghujs_enterprise_user_app_management___app` (
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
-- Records of jianghujs_enterprise_user_app_management___app
-- ----------------------------
BEGIN;
INSERT INTO `jianghujs_enterprise_user_app_management___app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (12, 'user_app_management', 'base', '账号权限管理', NULL, NULL, NULL, 'internal', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (13, 'data_repository', 'base', '数据中心管理', NULL, NULL, NULL, 'internal', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (14, 'directory', 'base', 'APP目录', NULL, NULL, NULL, 'internal', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (18, '1table-crud', NULL, '小APPDemo项目', NULL, NULL, NULL, 'internal', 'jhInsert', 'admin', '系统管理员', '2022-02-24T20:18:14+08:00', NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (19, 'test', NULL, 'uiAction23', NULL, NULL, NULL, 'internal', 'jhUpdate', 'admin', '系统管理员', '2022-09-08T15:13:22+08:00', NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (20, NULL, NULL, '0908', NULL, NULL, NULL, 'internal', 'jhUpdate', 'admin', '系统管理员', '2022-09-08T14:54:51+08:00', NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (21, 'test', NULL, '123456', NULL, NULL, NULL, 'external', 'jhInsert', 'admin', '系统管理员', '2022-09-08T14:55:07+08:00', NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___app` (`id`, `appId`, `appGroup`, `appName`, `appDesc`, `appUrl`, `appMenu`, `appType`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `sort`) VALUES (22, '090909', NULL, '090909', NULL, NULL, NULL, 'internal', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:26:10+08:00', NULL);
COMMIT;

-- ----------------------------
-- Table structure for jianghujs_enterprise_user_app_management___test_case
-- ----------------------------
DROP TABLE IF EXISTS `jianghujs_enterprise_user_app_management___test_case`;
CREATE TABLE `jianghujs_enterprise_user_app_management___test_case` (
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
-- Records of jianghujs_enterprise_user_app_management___test_case
-- ----------------------------
BEGIN;
INSERT INTO `jianghujs_enterprise_user_app_management___test_case` (`id`, `pageId`, `testId`, `testName`, `uiActionIdList`, `testOpeartion`, `expectedResult`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (197, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for jianghujs_enterprise_user_app_management___user
-- ----------------------------
DROP TABLE IF EXISTS `jianghujs_enterprise_user_app_management___user`;
CREATE TABLE `jianghujs_enterprise_user_app_management___user` (
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
-- Records of jianghujs_enterprise_user_app_management___user
-- ----------------------------
BEGIN;
INSERT INTO `jianghujs_enterprise_user_app_management___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (42, '111', 'admin', '系统管理员', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', 'common', NULL, 'update', NULL, NULL, '2022-02-19T15:02:24+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (43, NULL, 'W00001', '张三丰', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'update', 'admin', '系统管理员', '2022-02-19T15:18:42+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (44, NULL, 'W00002', '张无忌', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'update', 'admin', '系统管理员', '2022-02-19T15:45:14+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (45, NULL, 'G00001', '洪七公', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (46, NULL, 'G00002', '郭靖', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'update', 'admin', '系统管理员', '2022-05-03T13:45:14+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (47, NULL, 'H00001', '岳不群', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (48, NULL, 'H00002', '令狐冲', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (58, '112', 'U223P', 'uiaction123', '12345678', '31166f44402dedbf27c9b2d4bcfa90cb', 'ajGTYtmy4cNH', 'banned', 'common', NULL, 'update', 'admin', '系统管理员', '2022-09-09T16:03:56+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `userConfig`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (59, '113', 'U224R', '0909', '123456', '8146695749e5e774d1904e6c5bc21e74', 'rYnxj8ABbbCd', 'active', 'common', NULL, 'insert', 'admin', '系统管理员', '2022-09-09T16:21:39+08:00');
COMMIT;

-- ----------------------------
-- Table structure for jianghujs_enterprise_user_app_management___user_app
-- ----------------------------
DROP TABLE IF EXISTS `jianghujs_enterprise_user_app_management___user_app`;
CREATE TABLE `jianghujs_enterprise_user_app_management___user_app` (
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
-- Records of jianghujs_enterprise_user_app_management___user_app
-- ----------------------------
BEGIN;
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (62, 'admin', 'data_repository', 'insert', NULL, NULL, NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (63, 'admin', 'directory', 'insert', NULL, NULL, NULL);
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (68, '0', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:53:46+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (69, '1', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:53:47+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (70, '2', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:53:49+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (71, '0', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:55:10+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (72, '1', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:55:12+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (73, '2', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:55:13+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (74, '0', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:56:34+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (75, '1', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:56:35+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (76, '2', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:56:36+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (77, '0', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:57:51+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (78, '1', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:57:52+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (79, '2', 'test', 'jhInsert', 'admin', '系统管理员', '2022-04-28T22:57:53+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (109, 'admin', '1table-crud', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:13:16+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (133, 'admin', 'test', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:24:08+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (135, 'W00002', 'null', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:25:18+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (139, 'W00002', 'null', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:25:35+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (141, 'admin', 'null', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:25:35+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (148, 'admin', '090909', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:26:27+08:00');
INSERT INTO `jianghujs_enterprise_user_app_management___user_app` (`id`, `userId`, `appId`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (152, 'U224R', '090909', 'jhInsert', 'admin', '系统管理员', '2022-09-09T16:27:03+08:00');
COMMIT;

-- ----------------------------
-- Table structure for outsidedatabase___user
-- ----------------------------
DROP TABLE IF EXISTS `outsidedatabase___user`;
CREATE TABLE `outsidedatabase___user` (
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
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `username_index` (`username`) USING BTREE,
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户表';

-- ----------------------------
-- Records of outsidedatabase___user
-- ----------------------------
BEGIN;
INSERT INTO `outsidedatabase___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (42, NULL, 'admin', '系统管理员', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `outsidedatabase___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (43, NULL, 'W00001', '张三丰', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `outsidedatabase___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (44, NULL, 'W00002', '张无忌', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `outsidedatabase___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (45, NULL, 'G00001', '洪七公', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `outsidedatabase___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (46, NULL, 'G00002', '郭靖', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `outsidedatabase___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (47, NULL, 'H00001', '岳不群', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `outsidedatabase___user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (48, NULL, 'H00002', '令狐冲', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- View structure for _view01_user
-- ----------------------------
DROP VIEW IF EXISTS `_view01_user`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `_view01_user` AS select `_user`.`id` AS `id`,`_user`.`idSequence` AS `idSequence`,`_user`.`userId` AS `userId`,`_user`.`username` AS `username`,`_user`.`clearTextPassword` AS `clearTextPassword`,`_user`.`password` AS `password`,`_user`.`md5Salt` AS `md5Salt`,`_user`.`userStatus` AS `userStatus`,`_user`.`userType` AS `userType`,`_user`.`userConfig` AS `userConfig`,`_user`.`operation` AS `operation`,`_user`.`operationByUserId` AS `operationByUserId`,`_user`.`operationByUser` AS `operationByUser`,`_user`.`operationAt` AS `operationAt` from `_user`;

SET FOREIGN_KEY_CHECKS = 1;
