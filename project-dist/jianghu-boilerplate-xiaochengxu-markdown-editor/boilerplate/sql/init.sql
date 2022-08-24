/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50736
 Source Host           : localhost:3306
 Source Schema         : {{name}}

 Target Server Type    : MySQL
 Target Server Version : 50736
 File Encoding         : 65001

 Date: 23/08/2022 22:13:42
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
-- Table structure for _constant_ui
-- ----------------------------
DROP TABLE IF EXISTS `_constant_ui`;
CREATE TABLE `_constant_ui` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `constantKey` varchar(255) DEFAULT NULL,
  `constantType` varchar(255) DEFAULT NULL COMMENT '常量类型; object, array',
  `pageId` varchar(255) DEFAULT 'all' COMMENT '页面id',
  `desc` varchar(255) DEFAULT NULL COMMENT '描述',
  `en` text COMMENT '常量内容; object, array',
  `zh` text COMMENT '常量内容; object, array',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `pageId_constantKey_unique` (`constantKey`,`pageId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COMMENT='常量表;';

-- ----------------------------
-- Records of _constant_ui
-- ----------------------------
BEGIN;
INSERT INTO `_constant_ui` VALUES (1, 'btn', 'object', 'all', '按钮', '{\"upload\":\"upload\", \"createFolder\":\"create folder\",\"material\":\"material\",\"materialManagement\":\"material management\",\"logout\":\"logout\",\"logoutSuccess\":\"logout succeeded\",\"fileName\":\"file name\",\"rename\":\"rename\",\"cancel\":\"cancel\",\"paste\":\"paste\",\"create\":\"create\",\"fileName\":\"file name\",\"use\":\"use\",\"selectFile\":\"Please select a folder or file\",\"file\":\"file\",\"fileNotFound\":\"File or folder not found\",\"folderEmpty\":\"folder is empty\",\"enterFileName\":\"Please enter a file name\",\"fileRename\":\"file rename\",\"renamedSuccess\":\"File renamed successfully\",\"uploadProgress\":\"upload progress\",\"movedSuccess\":\"File moved successfully\",\"uploadTo\":\"upload to\",\"maxFileSize\":\"Max file size\",\"maxFilesCount\":\"Max files count\",\"delete\":\"delete\",\"sureDelete\":\"Are you sure you want to delete this\",\"yes\":\"yes\",\"folder\":\"folder\"}', '{\"upload\":\"上传\", \"createFolder\":\"创建文件夹\",\"material\":\"素材\",\"materialManagement\":\"素材管理\",\"logout\":\"退出登录\",\"logoutSuccess\":\"退出登录成功\",\"rename\":\"重命名\",\"cancel\":\"取消\",\"paste\":\"粘贴\",\"create\":\"创建\",\"fileName\":\"文件名\",\"use\":\"使用\",\"selectFile\":\"请选择一个文件夹或文件\",\"file\":\"文件\",\"fileNotFound\":\"找不到文件或文件夹\",\"folderEmpty\":\"文件夹为空\",\"enterFileName\":\"请输入文件名\",\"fileRename\":\"文件重命名\",\"renamedSuccess\":\"文件重命名成功\",\"uploadProgress\":\"上传进度\",\"movedSuccess\":\"文件移动成功\",\"uploadTo\":\"上传至\",\"maxFileSize\":\"最大文件大小\",\"maxFilesCount\":\"最大文件数\",\"delete\":\"删除\",\"sureDelete\":\"确定你想要删除这个\",\"yes\":\"是的\",\"folder\":\"文件夹\"}', 'insert', NULL, NULL, NULL);
INSERT INTO `_constant_ui` VALUES (2, 'article', 'object', 'all', '文章', '{\n\"recyclingConfirmation\":\"Are you sure you want to move the article to the trash\",\n\"numberOfQueryResults\":\"For the first time, only the latest 200 records are queried, a total of \",\n\"record\":\" records\",\n\"queryResultFiltering\":\"Query result filtering\",\n\"articleID\":\"Article ID\",\n\"articleTitle\":\"article title\",\n\"releaseTime\":\"release time\",\n\"audioURL\":\"Audio URL\",\n\"videoURL\":\"Video URL\",\n\"editor\":\"editor\",\n\"updateTime\":\"update time\",\n\"creator\":\"creator\",\n\"creationTime\":\"creation time\",\n\"recoverArticle\":\"recover article\",\n\"recyclingArticles\":\"Recycling Articles\",\n\"recyclingArticlesSuccess\":\"Recycling Articles Success\",\n\"restoreArticleConfirm\":\"Are you sure you want to restore the article\",\n\"recoverArticlesSuccessfully\":\"Recover articles successfully\"\n}', '{\n\"recyclingConfirmation\":\"确定将文章移到回收站吗\",\n\"numberOfQueryResults\":\"首次仅查询最新的200条，共\",\n\"record\":\"条记录\",\n\"queryResultFiltering\":\"查询结果过滤\",\n\"articleID\":\"文章ID\",\n\"articleTitle\":\"文章标题\",\n\"releaseTime\":\"发布时间\",\n\"audioURL\":\"音频URL\",\n\"videoURL\":\"视频URL\",\n\"editor\":\"修改者\",\n\"updateTime\":\"修改时间\",\n\"creator\":\"创建者\",\n\"creationTime\":\"创建时间\",\n\"recoverArticle\":\"恢复文章\",\n\"recyclingArticles\":\"回收文章\",\n\"recyclingArticlesSuccess\":\"回收文章成功\",\n\"restoreArticleConfirm\":\"确定将文章恢复吗\",\n\"recoverArticlesSuccessfully\":\"恢复文章成功\"\n}', 'insert', NULL, NULL, NULL);
INSERT INTO `_constant_ui` VALUES (3, 'common', 'color', 'all', '公共', '{\n\"add\":\"add\",\n\"view\":\"view\",\n\"modify\":\"modify\",\n\"delete\":\"delete\",\n\"recycle\":\"recycle\",\n\"recover\":\"recover\",\n\"cancel\":\"cancel\",\n\"sure\":\"sure\",\n\"manage\":\"manage\",\n\"save\":\"save\",\n\"saveAndPreview\":\"saveAndPreview\",\n\"moveToRecycleBin\":\"move to recycle bin\",\n\"operate\":\"operate\"\n}', '{\n\"add\":\"新增\",\n\"view\":\"查看\",\n\"modify\":\"修改\",\n\"delete\":\"删除\",\n\"recycle\":\"回收站\",\n\"recover\":\"恢复\",\n\"cancel\":\"取消\",\n\"sure\":\"确定\",\n\"manage\":\"管理\",\n\"save\":\"保存\",\n\"saveAndPreview\":\"保存并预览\",\n\"moveToRecycleBin\":\"移到回收站\",\n\"operate\":\"操作\"\n}', 'insert', NULL, NULL, NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='群组表; 软删除未启用;';

-- ----------------------------
-- Records of _group
-- ----------------------------
BEGIN;
INSERT INTO `_group` VALUES (1, 'adminGroup', '管理组', '管理组', NULL, '{}', 'insert', NULL, NULL, NULL);
INSERT INTO `_group` VALUES (2, 'secondGroup', '二稿组', '二稿组', NULL, '{}', 'insert', NULL, NULL, NULL);
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
  `pageHook` text CHARACTER SET utf8mb4,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='页面表; 软删除未启用;';

-- ----------------------------
-- Records of _page
-- ----------------------------
BEGIN;
INSERT INTO `_page` VALUES (2, 'help', '帮助', 'dynamicInMenu', '11', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `_page` VALUES (30, 'categoryManagement', '分类管理', 'showInMenu', '1', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `_page` VALUES (40, 'article', '文章预览', 'dynamicInMenu', '7', 'insert', NULL, NULL, NULL, '{\n  \"beforeHook\":[\n    {\"field\": \"article\", \"service\": \"article\", \"serviceFunc\": \"getArticleAndFillArticles\"},\n		{\"field\": \"constantUiMap\", \"service\": \"constantUi\", \"serviceFunc\": \"getConstantUiMap\"}\n  ]\n}');
INSERT INTO `_page` VALUES (42, 'articleEdit', '文章编辑', 'dynamicInMenu', '7', 'insert', NULL, NULL, NULL, NULL);
INSERT INTO `_page` VALUES (44, 'firstDraftManagement', '一稿管理', 'showInMenu', '3', 'insert', NULL, NULL, NULL, '{\n  \"beforeHook\":[\r\n    {\"field\": \"constantUiMap\", \"service\": \"constantUi\", \"serviceFunc\": \"getConstantUiMap\"}\n  ]\n}');
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
) ENGINE=InnoDB AUTO_INCREMENT=2260 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='数据历史表';

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
) ENGINE=InnoDB AUTO_INCREMENT=440 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';

-- ----------------------------
-- Records of _resource
-- ----------------------------
BEGIN;
INSERT INTO `_resource` VALUES (1, NULL, NULL, 'login', 'passwordLogin', '✅登陆', 'service', '{}', '{\"service\": \"user\", \"serviceFunction\": \"passwordLogin\"}', '', '', 'update', NULL, NULL, '2022-04-27T15:32:57+08:00');
INSERT INTO `_resource` VALUES (2, NULL, NULL, 'allPage', 'logout', '✅登出', 'service', '{}', '{\"service\": \"user\", \"serviceFunction\": \"logout\"}', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (3, NULL, NULL, 'allPage', 'userInfo', '✅获取用户信息', 'service', '{}', '{\"service\": \"user\", \"serviceFunction\": \"userInfo\"}', '', '', 'update', NULL, NULL, '2022-04-27T15:37:21+08:00');
INSERT INTO `_resource` VALUES (4, NULL, NULL, 'allPage', 'getConstantList', '✅查询常量', 'sql', '{}', '{\"table\": \"_constant\", \"operation\": \"select\"}', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (5, NULL, NULL, 'xiaochengxu', 'getView', '✅小程序：获取前端页面', 'service', '{}', '{ \"service\": \"xiaochengxu\", \"serviceFunction\": \"getView\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (6, NULL, NULL, 'articleEdit', 'selectArticleWithCategory', '✅文章编辑-查询带文集信息的文章', 'service', '{}', '{ \"service\": \"article\", \"serviceFunction\": \"getArticleAndFillArticles\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (7, NULL, NULL, 'articleEdit', 'useMaterial', '✅文章编辑-使用素材', 'service', '{}', '{ \"service\": \"material\", \"serviceFunction\": \"useMaterial\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (8, NULL, NULL, 'articleEdit', 'selectCategoryList', '✅文章编辑-查询列表', 'sql', '{}', '{ \"table\": \"view01_category\", \"operation\": \"select\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (9, NULL, '{ \"before\": [\n{\"service\": \"article\", \"serviceFunction\": \"fillInsertItemParamsBeforeHook\"}\n], \"after\": [\n{\"service\": \"article\", \"serviceFunction\": \"articleHistoryRecordAfterHook\"}\n] }', 'articleEdit', 'jhInsertItem', '✅文章编辑-添加成员', 'sql', '{}', '{ \"table\": \"article\", \"operation\": \"jhInsert\" }', '', '', 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (10, NULL, NULL, 'articleEdit', 'selectItemList', '✅文章编辑-查询文章列表', 'sql', '{}', '{ \"table\": \"article\", \"operation\": \"select\" }', '', '', 'jhInsert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (11, NULL, '{ \"before\": [\n{\"service\": \"article\", \"serviceFunction\": \"fillUpdateItemParamsBeforeHook\"}\n], \"after\": [\n{\"service\": \"article\", \"serviceFunction\": \"articleHistoryRecordAfterHook\"}\n] }', 'articleEdit', 'jhUpdateItem', '✅文章编辑-更新成员', 'sql', '{}', '{ \"table\": \"article\", \"operation\": \"jhUpdate\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (12, NULL, '', 'articleEdit', 'deletedArticle', '✅文章编辑-将文章移至回收站', 'service', '{}', '{ \"service\": \"article\", \"serviceFunction\": \"deletedArticle\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (13, NULL, NULL, 'articleEdit', 'restoreArticle', '✅文章编辑-文章恢复', 'service', '{}', '{ \"service\": \"article\", \"serviceFunction\": \"restoreArticle\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (14, NULL, NULL, 'categoryManagement', 'selectItemList', '✅分类管理-查询列表', 'sql', '{}', '{ \"table\": \"view01_category\", \"operation\": \"select\" }', '', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (15, NULL, '{ \"before\": [\n{\"service\": \"category\", \"serviceFunction\": \"fillInsertItemParamsBeforeHook\"}\n]}', 'categoryManagement', 'insertItem', '✅分类管理-添加分类', 'sql', '{}', '{ \"table\": \"category\", \"operation\": \"insert\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (16, NULL, '{\n	\"before\": [{\n		\"service\": \"category\",\n		\"serviceFunction\": \"fillUpdateItemParamsBeforeHook\"\n	}]\n}', 'categoryManagement', 'updateItem', '✅分类管理-更新分类信息', 'sql', '{}', '{ \"table\": \"category\", \"operation\": \"jhUpdate\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (17, NULL, NULL, 'categoryManagement', 'deleteItem', '✅分类管理-删除分类', 'sql', '{}', '{ \"table\": \"category\", \"operation\": \"jhDelete\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (18, NULL, NULL, 'firstDraftManagement', 'selectItemList', '✅一稿管理-查询列表', 'sql', '{}', '{ \"table\": \"view01_article\", \"operation\": \"select\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (19, NULL, NULL, 'firstDraftManagement', 'selectCategoryList', '✅一稿管理-查询分类列表', 'sql', '{}', '{ \"table\": \"view01_category\", \"operation\": \"select\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_resource` VALUES (20, NULL, NULL, 'firstDraftManagement', 'updateItem', '✅一稿管理-更新文章信息', 'sql', '{}', '{ \"table\": \"article\", \"operation\": \"jhUpdate\" }', NULL, NULL, 'insert', NULL, NULL, NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=5944 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='文件表; 软删除未启用;';

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
INSERT INTO `_role` VALUES (1, 'administrator', '系统管理员', '系统管理员', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` VALUES (2, 'secondGroupRole', '小组长', '小组长', 'insert', NULL, NULL, NULL);
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
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='测试用例表';

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
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='ui 施工方案';

-- ----------------------------
-- Records of _ui
-- ----------------------------
BEGIN;
INSERT INTO `_ui` VALUES (1, 'firstDraftManagement', 'ui', 'refreshTableData', '✅获取文章列表', '{\"main\": [{\"function\": \"refreshTableData\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:22+08:00');
INSERT INTO `_ui` VALUES (2, 'firstDraftManagement', 'ui', 'startUpdateItem', '✅打开更新抽屉', '{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:22+08:00');
INSERT INTO `_ui` VALUES (3, 'firstDraftManagement', 'ui', 'updateItem', '✅更新发布状态', '{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:23+08:00');
INSERT INTO `_ui` VALUES (4, 'firstDraftManagement', 'ui', 'goToXiaochengxuPage', '✅打开文章编辑页', '{\"main\":[{\"function\":\"goToXiaochengxuPage\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:23+08:00');
INSERT INTO `_ui` VALUES (5, 'secondDraftManagement', 'ui', 'refreshTableData', '✅获取文章列表', '{\"main\": [{\"function\": \"refreshTableData\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:22+08:00');
INSERT INTO `_ui` VALUES (6, 'secondDraftManagement', 'ui', 'startUpdateItem', '✅打开更新抽屉', '{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:22+08:00');
INSERT INTO `_ui` VALUES (7, 'secondDraftManagement', 'ui', 'updateItem', '✅更新发布状态', '{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:23+08:00');
INSERT INTO `_ui` VALUES (8, 'secondDraftManagement', 'ui', 'goToXiaochengxuPage', '✅打开文章编辑页', '{\"main\":[{\"function\":\"goToXiaochengxuPage\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:23+08:00');
INSERT INTO `_ui` VALUES (9, 'thirdDraftManagement', 'ui', 'refreshTableData', '✅获取表格数据', '{\"main\": [{\"function\": \"refreshTableData\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:22+08:00');
INSERT INTO `_ui` VALUES (10, 'thirdDraftManagement', 'ui', 'startUpdateItem', '✅打开更新抽屉', '{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:22+08:00');
INSERT INTO `_ui` VALUES (11, 'thirdDraftManagement', 'ui', 'updateItem', '✅更新发布状态', '{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:23+08:00');
INSERT INTO `_ui` VALUES (12, 'thirdDraftManagement', 'ui', 'goToXiaochengxuPage', '✅打开文章编辑页', '{\"main\":[{\"function\":\"goToXiaochengxuPage\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-27T15:43:23+08:00');
INSERT INTO `_ui` VALUES (13, 'categoryManagement', 'ui', 'refreshTableData', '✅获取分类列表', '{\"main\": [{\"function\": \"refreshTableData\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-26T22:36:49+08:00');
INSERT INTO `_ui` VALUES (14, 'categoryManagement', 'ui', 'startCreateItem', '✅打开新增抽屉', '{\"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateItemDialog\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-26T22:36:49+08:00');
INSERT INTO `_ui` VALUES (15, 'categoryManagement', 'ui', 'createItem', '✅新增分类', '{\"before\": [{\"function\": \"confirmCreateItemDialog\"}], \"main\": [{\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-26T22:36:49+08:00');
INSERT INTO `_ui` VALUES (16, 'categoryManagement', 'ui', 'startUpdateItem', '✅打开更新抽屉', '{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-26T22:36:50+08:00');
INSERT INTO `_ui` VALUES (17, 'categoryManagement', 'ui', 'updateItem', '✅更新分类信息', '{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-26T22:36:50+08:00');
INSERT INTO `_ui` VALUES (18, 'categoryManagement', 'ui', 'deleteItem', '✅删除分类', '{\"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-26T22:36:50+08:00');
INSERT INTO `_ui` VALUES (19, 'categoryManagement', 'ui', 'goToDraftManagementPage', '✅进入X稿管理页面', '{\"main\":[{\"function\":\"goToDraftManagementPage\"}]}', NULL, 'insert', 'vscode', 'vscode', '2022-07-26T22:36:50+08:00');
INSERT INTO `_ui` VALUES (20, 'articleEdit', 'ui', 'deletedArticle', '✅文章编辑-将文章移至回收站', '{\"main\":[{\"function\":\"deletedArticle\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-29T10:20:46+08:00');
INSERT INTO `_ui` VALUES (21, 'articleEdit', 'ui', 'restoreArticle', '✅文章编辑-文章恢复', '{\"main\":[{\"function\":\"restoreArticle\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-29T10:20:46+08:00');
INSERT INTO `_ui` VALUES (22, 'articleEdit', 'ui', 'saveInfo', '✅文章编辑-文章保存', '{\"main\":[{\"function\":\"saveInfo\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-29T10:20:46+08:00');
INSERT INTO `_ui` VALUES (23, 'articleEdit', 'ui', 'saveInfoAndPreview', '✅文章编辑-文章保存并预览', '{\"main\":[{\"function\":\"saveInfoAndPreview\"}]}', NULL, 'update', 'vscode', 'vscode', '2022-07-29T10:20:46+08:00');
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
INSERT INTO `_user` VALUES (42, NULL, 'admin', '系统管理员', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` VALUES (43, NULL, 'W00001', '张三丰', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` VALUES (44, NULL, 'W00002', '张无忌', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` VALUES (45, NULL, 'G00001', '洪七公', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` VALUES (46, NULL, 'G00002', '郭靖', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` VALUES (47, NULL, 'H00001', '岳不群', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` VALUES (48, NULL, 'H00002', '令狐冲', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
INSERT INTO `_user` VALUES (49, NULL, 'G00003', '汪剑通', '123456', '38d61d315e62546fe7f1013e31d42f57', 'Xs4JSZnhiwsR', 'active', NULL, NULL, 'insert', NULL, NULL, NULL);
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
INSERT INTO `_user_group_role` VALUES (1, '100062Y', 'adminGroup', 'administrator', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` VALUES (2, '100013V', 'secondGroup', 'secondGroupRole', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` VALUES (3, '100003K', 'adminGroup', 'administrator', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role` VALUES (4, '532960I', 'adminGroup', 'administrator', 'insert', NULL, NULL, NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户群组角色 - 页面 映射表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role_page
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role_page` VALUES (1, '*', 'adminGroup', '*', '*', 'allow', '所有页面，开放给管理员', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` VALUES (2, '*', 'login', '*', 'article', 'allow', '文章页面，开放给登陆用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` VALUES (3, '*', 'public', '*', 'login', 'allow', '登陆页; 开放给所有用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` VALUES (4, '*', 'login', '*', 'manual', 'allow', '操作手册页; 开放给登陆用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` VALUES (5, '*', 'login', '*', 'help', 'allow', '帮助页; 开放给登陆用户;', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` VALUES (6, '*', 'login', '*', 'firstDraftManagement', 'allow', '一稿页面，开放给登陆用户；', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` VALUES (7, '*', 'login', '*', 'categoryManagement', 'allow', '分类管理页面，开放给登陆用户；', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` VALUES (8, '*', 'login', '*', 'articleEdit', 'allow', '文章编辑页面，开放给登陆用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_page` VALUES (9, '*', 'secondGroup', '*', 'secondDraftManagement', 'allow', '二稿页面，开放给小组长', 'insert', NULL, NULL, NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户群组角色 - 请求资源 映射表; 软删除未启用;';

-- ----------------------------
-- Records of _user_group_role_resource
-- ----------------------------
BEGIN;
INSERT INTO `_user_group_role_resource` VALUES (1, '*', 'public', '*', 'login.passwordLogin', 'allow', '登陆resource, 开放给所有用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` VALUES (2, '*', 'public', '*', 'allPage.getConstantList', 'allow', '查询常量resource, 开放给所有登陆成功的用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` VALUES (4, '*', 'login', '*', 'categoryManagement.*', 'allow', '分类管理resource, 开放给登陆用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` VALUES (5, '*', 'login', '*', 'firstDraftManagement.*', 'allow', '一稿管理resource, 开放给登陆用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` VALUES (6, '*', 'adminGroup', '*', '*', 'allow', 'allPage reourse, 开放给管理员', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` VALUES (7, '*', 'login', '*', 'article.*', 'allow', 'article页面，开放给登陆用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` VALUES (8, '*', 'login', '*', 'articleEdit.*', 'allow', 'article编辑页面，开放给登陆用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` VALUES (9, '*', 'login', '*', 'xiaochengxu.getView', 'allow', '获取小程序页面', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` VALUES (10, '*', 'login', '*', 'allPage.userInfo', 'allow', '用户个人信息resource，开放给登陆用户', 'insert', NULL, NULL, NULL);
INSERT INTO `_user_group_role_resource` VALUES (11, '*', 'secondGroup', '*', 'secondDraftManagement.*', 'allow', '二稿管理resource, 开放给二稿用户', 'insert', NULL, NULL, NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户session表; deviceId 维度;软删除未启用;';

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
COMMIT;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `articleId` bigint(20) DEFAULT NULL COMMENT '文章id; 10000 ++',
  `articleStatus` varchar(255) DEFAULT NULL COMMENT '文章状态; firstDraft: 一稿; secondDraft: 二稿;  thirdDraft:三稿',
  `categoryId` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '分类id',
  `articleGroupName` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '文章所属分组名',
  `articleTagList` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci COMMENT '标签; 用, 拼接',
  `articlePublishStatus` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '文章发布状态; public, login, draft, deleted',
  `articlePublishTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT '文章发布时间',
  `articleTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT '标题',
  `articleCoverImage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT '封面',
  `articleContent` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci COMMENT '编辑的内容',
  `articleContentForSeo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci COMMENT 'HTML 用于渲染',
  `articleAssignmentList` text COMMENT '文章作业 [{ }]',
  `articleAssignmentListWithAnswer` text COMMENT '文章作业答案 [{ }]',
  `articleAudioUrl` varchar(1023) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT '默认音频URL唯一的',
  `articleVideoUrl` varchar(1023) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '默认视频URL',
  `articleCreateTime` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT NULL COMMENT '创建时间',
  `articleCreateUserId` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '创建者用户ID',
  `articleCreateUsername` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '创建者用户名',
  `articleUpdateTime` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '更新时间',
  `articleUpdateUserId` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '更新者用户ID',
  `articleUpdateUsername` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '更新者用户名',
  `operation` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '操作: insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '操作者userId',
  `operationByUser` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '操作者用户名',
  `operationAt` varchar(255) CHARACTER SET utf8mb4 DEFAULT '' COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `article_unique` (`articleId`) USING BTREE,
  KEY `categoryId_index` (`categoryId`) USING BTREE,
  KEY `articlePublishTime` (`articlePublishTime`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1600 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for article_history
-- ----------------------------
DROP TABLE IF EXISTS `article_history`;
CREATE TABLE `article_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `articleId` bigint(20) DEFAULT NULL COMMENT '文章id, 10000 ++',
  `articleStatus` varchar(255) DEFAULT NULL COMMENT '文章类型; firstDraft: 一稿; secondDraft: 二稿;  thirdDraft:三稿',
  `categoryId` varchar(255) DEFAULT NULL COMMENT '分类id',
  `articleGroupName` varchar(255) DEFAULT NULL COMMENT '文章所属分组名',
  `articleTagList` varchar(255) DEFAULT NULL COMMENT '标签; 用, 拼接',
  `articlePublishStatus` varchar(255) DEFAULT 'login' COMMENT '文章类型(状态)：public, login, draft, deleted',
  `articlePublishTime` varchar(255) DEFAULT NULL COMMENT '文章发布时间',
  `articleTitle` varchar(255) DEFAULT NULL COMMENT '标题',
  `articleCoverImage` varchar(255) DEFAULT NULL COMMENT '封面',
  `articleContent` longtext COMMENT '编辑的内容',
  `articleContentForSeo` longtext COMMENT 'HTML 用于渲染',
  `articleAssignmentList` text COMMENT '文章作业 [{ }]',
  `articleAssignmentListWithAnswer` text COMMENT '文章作业答案 [{ }]',
  `articleAudioUrl` varchar(255) DEFAULT NULL COMMENT '默认音频URL唯一的',
  `articleVideoUrl` varchar(255) DEFAULT NULL COMMENT '默认视频URL',
  `articleCreateTime` varchar(255) DEFAULT NULL COMMENT '创建时间',
  `articleCreateUserId` varchar(255) DEFAULT NULL COMMENT '创建者用户ID',
  `articleCreateUsername` varchar(255) DEFAULT NULL COMMENT '创建者用户名',
  `articleUpdateTime` varchar(255) DEFAULT NULL COMMENT '更新时间',
  `articleUpdateUserId` varchar(255) DEFAULT NULL COMMENT '更新者用户ID',
  `articleUpdateUsername` varchar(255) DEFAULT NULL COMMENT '更新者用户名',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作: insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1224 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of article_history
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryId` bigint(255) DEFAULT NULL COMMENT '分类ID',
  `categoryName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci DEFAULT '' COMMENT '分类名称',
  `categoryGroup` varchar(255) DEFAULT NULL COMMENT '分类分组',
  `categoryGroupSort` varchar(255) DEFAULT NULL COMMENT '分类分组排序',
  `categoryArticleIgnoreTiltle` varchar(255) DEFAULT NULL COMMENT '分类目录中需要省略的文字',
  `categoryIntro` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci COMMENT '分类简介',
  `categoryPublishStatus` varchar(255) DEFAULT '' COMMENT '发布状态',
  `categoryCreateTime` varchar(255) DEFAULT '' COMMENT '创建时间',
  `categoryCreateUserId` varchar(255) DEFAULT '' COMMENT '创建者UserId',
  `categoryCreateUsername` varchar(255) DEFAULT '' COMMENT '创建者',
  `categoryUpdateTime` varchar(255) DEFAULT '' COMMENT '修改时间',
  `categoryUpdateUserId` varchar(255) DEFAULT '' COMMENT '修改者UserId',
  `categoryUpdateUsername` varchar(255) DEFAULT '' COMMENT '修改者',
  `operation` varchar(255) DEFAULT '',
  `operationByUserId` varchar(255) DEFAULT '',
  `operationByUser` varchar(255) DEFAULT '',
  `operationAt` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `categoryId_unique` (`categoryId`) USING BTREE,
  KEY `categoryName_unique` (`categoryName`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of category
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- View structure for view01_article
-- ----------------------------
DROP VIEW IF EXISTS `view01_article`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view01_article` AS select `article`.`id` AS `id`,`article`.`articleId` AS `articleId`,`article`.`articleStatus` AS `articleStatus`,`article`.`categoryId` AS `categoryId`,`article`.`articleGroupName` AS `articleGroupName`,`article`.`articleTagList` AS `articleTagList`,`article`.`articlePublishStatus` AS `articlePublishStatus`,`article`.`articlePublishTime` AS `articlePublishTime`,`article`.`articleTitle` AS `articleTitle`,`article`.`articleCoverImage` AS `articleCoverImage`,`article`.`articleAudioUrl` AS `articleAudioUrl`,`article`.`articleVideoUrl` AS `articleVideoUrl`,`article`.`articleCreateTime` AS `articleCreateTime`,`article`.`articleCreateUserId` AS `articleCreateUserId`,`article`.`articleCreateUsername` AS `articleCreateUsername`,`article`.`articleUpdateTime` AS `articleUpdateTime`,`article`.`articleUpdateUserId` AS `articleUpdateUserId`,`article`.`articleUpdateUsername` AS `articleUpdateUsername`,`article`.`operation` AS `operation`,`article`.`operationByUserId` AS `operationByUserId`,`article`.`operationByUser` AS `operationByUser`,`article`.`operationAt` AS `operationAt`,`category`.`categoryName` AS `categoryName`,`category`.`categoryIntro` AS `categoryIntro`,`category`.`categoryGroup` AS `categoryGroup`,`category`.`categoryGroupSort` AS `categoryGroupSort` from (`article` left join `category` on((`article`.`categoryId` = `category`.`categoryId`)));

-- ----------------------------
-- View structure for view01_category
-- ----------------------------
DROP VIEW IF EXISTS `view01_category`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `view01_category` AS select `{{name}}`.`category`.`id` AS `id`,ifnull(`article_category`.`articleCount`,0) AS `articleCount`,`{{name}}`.`category`.`categoryId` AS `categoryId`,`{{name}}`.`category`.`categoryName` AS `categoryName`,`{{name}}`.`category`.`categoryArticleIgnoreTiltle` AS `categoryArticleIgnoreTiltle`,`{{name}}`.`category`.`categoryGroup` AS `categoryGroup`,`{{name}}`.`category`.`categoryGroupSort` AS `categoryGroupSort`,concat('<',`{{name}}`.`category`.`categoryGroup`,`{{name}}`.`category`.`categoryGroupSort`,'>') AS `categoryGroupConcat`,`{{name}}`.`category`.`categoryIntro` AS `categoryIntro`,`{{name}}`.`category`.`categoryPublishStatus` AS `categoryPublishStatus`,`{{name}}`.`category`.`categoryCreateTime` AS `categoryCreateTime`,`{{name}}`.`category`.`categoryCreateUserId` AS `categoryCreateUserId`,`{{name}}`.`category`.`categoryCreateUsername` AS `categoryCreateUsername`,`{{name}}`.`category`.`categoryUpdateTime` AS `categoryUpdateTime`,`{{name}}`.`category`.`categoryUpdateUserId` AS `categoryUpdateUserId`,`{{name}}`.`category`.`categoryUpdateUsername` AS `categoryUpdateUsername`,`{{name}}`.`category`.`operation` AS `operation`,`{{name}}`.`category`.`operationByUserId` AS `operationByUserId`,`{{name}}`.`category`.`operationByUser` AS `operationByUser`,`{{name}}`.`category`.`operationAt` AS `operationAt` from (`{{name}}`.`category` left join (select `{{name}}`.`article`.`categoryId` AS `categoryId`,count(`{{name}}`.`article`.`categoryId`) AS `articleCount` from `{{name}}`.`article` group by `{{name}}`.`article`.`categoryId`) `article_category` on((`{{name}}`.`category`.`categoryId` = `article_category`.`categoryId`)));

-- ----------------------------
-- View structure for _view01_user
-- ----------------------------
DROP VIEW IF EXISTS `_view01_user`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `_view01_user` AS select `_user`.`id` AS `id`,`_user`.`idSequence` AS `idSequence`,`_user`.`userId` AS `userId`,`_user`.`username` AS `username`,`_user`.`clearTextPassword` AS `clearTextPassword`,`_user`.`password` AS `password`,`_user`.`md5Salt` AS `md5Salt`,`_user`.`userStatus` AS `userStatus`,`_user`.`userType` AS `userType`,`_user`.`config` AS `config`,`_user`.`operation` AS `operation`,`_user`.`operationByUserId` AS `operationByUserId`,`_user`.`operationByUser` AS `operationByUser`,`_user`.`operationAt` AS `operationAt` from `_user`;

SET FOREIGN_KEY_CHECKS = 1;
