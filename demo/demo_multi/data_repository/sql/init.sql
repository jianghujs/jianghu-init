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
) ENGINE = InnoDB AUTO_INCREMENT = 9 COMMENT = '缓存表';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _file
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_file`;
CREATE TABLE `_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fileId` varchar(255) DEFAULT NULL COMMENT 'fileId',
  `fileDirectory` varchar(255) DEFAULT NULL COMMENT '文件保存路径;',
  `filename` varchar(255) DEFAULT NULL COMMENT '文件名;',
  `filenameStorage` varchar(255) DEFAULT NULL COMMENT '文件保存名',
  `downloadPath` varchar(255) DEFAULT NULL COMMENT '文件下载路径',
  `fileType` varchar(255) DEFAULT NULL COMMENT '文件类型;(预留字段)',
  `fileDesc` varchar(255) DEFAULT NULL COMMENT '文件描述',
  `binarySize` varchar(255) DEFAULT NULL COMMENT '文件二进制大小',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `fileId_index` (`fileId`) USING BTREE
) ENGINE = InnoDB COMMENT = '文件表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _file
# ------------------------------------------------------------




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
) ENGINE = InnoDB AUTO_INCREMENT = 2 COMMENT = '群组表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _group
# ------------------------------------------------------------

INSERT INTO `_group` (`id`,`groupId`,`groupName`,`groupDesc`,`groupAvatar`,`groupExtend`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'adminGroup','权限组',NULL,NULL,'{}','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _page
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_page`;
CREATE TABLE `_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pageId` varchar(255) DEFAULT NULL COMMENT 'pageId',
  `pageName` varchar(255) DEFAULT NULL COMMENT 'page name',
  `pageType` varchar(255) DEFAULT NULL COMMENT '页面类型; showInMenu, dynamicInMenu',
  `sort` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 36 COMMENT = '页面表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _page
# ------------------------------------------------------------

INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'help','帮助','dynamicInMenu','0','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'login','登陆',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'manual','操作手册','showInMenu','0','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (8,'tableSyncConfig','数据同步表管理','showInMenu','1','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (12,'tableSyncLog','数据表同步日志','showInMenu','2','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (35,'userGroupRoleManagement','用户、组织、角色','showInMenu','3','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _record_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_record_history`;
CREATE TABLE `_record_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(255) DEFAULT NULL COMMENT '表',
  `recordId` int(11) DEFAULT NULL COMMENT '数据在table中的主键id; recordContent.id',
  `recordContent` text DEFAULT NULL COMMENT '数据JSON',
  `packageContent` text DEFAULT NULL COMMENT '当时请求的 package JSON',
  `operation` varchar(255) DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `index_record_id` (`recordId`),
  KEY `index_table_action` (`table`, `operation`)
) ENGINE = InnoDB AUTO_INCREMENT = 18 COMMENT = '数据历史表';




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
  `appDataSchema` text DEFAULT NULL COMMENT 'appData 参数校验',
  `resourceData` text DEFAULT NULL COMMENT 'resource 数据; { "service": "auth", "serviceFunction": "passwordLogin" } or  { "table": "${tableName}", "action": "select", "whereCondition": ".where(function() {this.whereNot( { recordStatus: \\"active\\" })})" }',
  `requestDemo` text DEFAULT NULL COMMENT '请求Demo',
  `responseDemo` text DEFAULT NULL COMMENT '响应Demo',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 467 COMMENT = '请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _resource
# ------------------------------------------------------------

INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (231,NULL,NULL,'login','passwordLogin','✅登陆','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"passwordLogin\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"login\", \"actionId\": \"passwordLogin\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {\"userId\": \"admin\", \"deviceId\": \"127.0.0.1:7005_Windows.10.0_567d29b2_chrome\", \"password\": \"123456\"}}, \"packageId\": \"1651505242434_8096707\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"appId\": \"data_repository\", \"pageId\": \"login\", \"userId\": \"admin\", \"actionId\": \"passwordLogin\", \"deviceId\": \"127.0.0.1:7005_Windows.10.0_567d29b2_chrome\", \"authToken\": \"5APrV19H3zthGIpCIFk8TJ33pR7uRhcCA2b2\", \"resultData\": {\"userId\": \"admin\", \"deviceId\": \"127.0.0.1:7005_Windows.10.0_567d29b2_chrome\", \"authToken\": \"5APrV19H3zthGIpCIFk8TJ33pR7uRhcCA2b2\"}}, \"packageId\": \"1651505242434_8096707\", \"timestamp\": \"2022-05-02T23:27:23+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T23:27:23+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (251,NULL,NULL,'allPage','logout','✅登出','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"logout\"}','{}','{}','update',NULL,NULL,'2022-02-19T21:55:49+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (252,NULL,NULL,'allPage','refreshToken','✅刷新authToken','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"refreshToken\"}','{}','{}','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (253,NULL,NULL,'allPage','userInfo','✅获取用户信息','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"userInfo\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"allPage\", \"actionId\": \"userInfo\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {}}, \"packageId\": \"1651505339666_7224574\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"packageId\": \"1651505339666_7224574\", \"timestamp\": \"2022-05-02T23:29:00+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T23:29:00+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (256,NULL,NULL,'allPage','uploadByStream','✅文件上传(文件流)','service',NULL,'{\"service\": \"file\", \"serviceFunction\": \"uploadByBase64\"}','{}','{}','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (257,NULL,NULL,'allPage','uploadByBase64','✅文件上传(base64)','service',NULL,'{\"service\": \"file\", \"serviceFunction\": \"downlaodBase64ByFileId\"}','{}','{}','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (395,NULL,NULL,'tableSyncConfig','selectSourceDatabase','✅数据库管理页-查询源数据库列表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"selectSourceDatabase\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"actionId\": \"selectSourceDatabase\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {}}, \"packageId\": \"1651505339666_2388111\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"packageId\": \"1651505339666_2388111\", \"timestamp\": \"2022-05-02T23:29:00+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T23:29:00+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (396,NULL,NULL,'tableSyncConfig','selectSourceTable','✅数据库管理页-查询源数据库中的table列表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"selectSourceTable\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"orderBy\": [{\"order\": \"desc\", \"column\": \"operationAt\"}], \"actionId\": \"selectSourceTable\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {\"sourceDatabase\": \"mysql\"}}, \"packageId\": \"1651504976334_4186402\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"packageId\": \"1651504976334_4186402\", \"timestamp\": \"2022-05-02T23:22:57+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T23:22:57+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (397,NULL,NULL,'tableSyncConfig','insertTable','✅数据库管理页-创建同步表','sql',NULL,'{\"table\": \"_table_sync_config\", \"operation\": \"insert\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"actionId\": \"insertTable\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {\"sourceTable\": \"student\", \"syncTimeSlot\": \"10\", \"sourceDatabase\": \"jianghujs_demo_basic_3table\"}}, \"packageId\": \"1651212152534_2256170\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"rows\": [226], \"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"actionId\": \"insertTable\", \"resultData\": {\"rows\": [226]}}, \"packageId\": \"1651212152534_2256170\", \"timestamp\": \"2022-04-29T14:02:33+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-04-29T14:02:33+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (398,NULL,NULL,'tableSyncConfig','deleteTable','✅数据库管理页-删除同步表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"deleteTableSyncConfig\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"actionId\": \"deleteTable\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {\"id\": 226}}, \"packageId\": \"1651212235291_7442127\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"actionId\": \"deleteTable\"}, \"packageId\": \"1651212235291_7442127\", \"timestamp\": \"2022-04-29T14:03:56+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-04-29T14:03:56+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (399,NULL,NULL,'tableSyncConfig','updateTable','✅数据库管理页-更新同步表','sql',NULL,'{\"table\": \"_table_sync_config\", \"operation\": \"update\"}','{\"appData\": {\"appId\": \"data_repository\", \"where\": {\"id\": 200}, \"pageId\": \"tableSyncConfig\", \"actionId\": \"updateTable\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {\"syncDesc\": \"æ­£å¸¸\", \"operation\": \"update\", \"operationAt\": \"2022-02-26T18:34:37+08:00\", \"sourceTable\": \"_app\", \"lastSyncTime\": \"2022-02-26T18:34:33+08:00\", \"syncTimeSlot\": \"6\", \"sourceDatabase\": \"{{dbPrefix}}user_app_management\", \"operationByUser\": \"ç³»ç»ç®¡çå\", \"operationByUserId\": \"admin\"}}, \"packageId\": \"1651212106318_9525159\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"rows\": 1, \"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"actionId\": \"updateTable\", \"resultData\": {\"rows\": 1}}, \"packageId\": \"1651212106318_9525159\", \"timestamp\": \"2022-04-29T14:01:46+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-04-29T14:01:46+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (400,NULL,NULL,'tableSyncConfig','selectItemList','✅数据库管理页-查询同步表','sql',NULL,'{\"table\": \"_table_sync_config\", \"operation\": \"select\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"orderBy\": [{\"order\": \"desc\", \"column\": \"operationAt\"}], \"actionId\": \"selectItemList\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {}}, \"packageId\": \"1651505339666_5442357\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"rows\": [{\"id\": 200, \"syncDesc\": \"æ­£å¸¸\", \"operation\": \"update\", \"operationAt\": \"2022-05-02T23:27:40+08:00\", \"sourceTable\": \"_app\", \"lastSyncTime\": \"2022-05-02T23:27:37+08:00\", \"syncTimeSlot\": \"6\", \"sourceDatabase\": \"{{dbPrefix}}user_app_management\", \"operationByUser\": \"ç³»ç»ç®¡çå\", \"operationByUserId\": \"admin\"}, {\"id\": 201, \"syncDesc\": \"æ­£å¸¸\", \"operation\": \"update\", \"operationAt\": \"2022-05-02T23:27:40+08:00\", \"sourceTable\": \"_user_app\", \"lastSyncTime\": \"2022-05-02T23:27:37+08:00\", \"syncTimeSlot\": \"5\", \"sourceDatabase\": \"{{dbPrefix}}user_app_management\", \"operationByUser\": \"ç³»ç»ç®¡çå\", \"operationByUserId\": \"admin\"}, {\"id\": 202, \"syncDesc\": \"æ­£å¸¸\", \"operation\": \"update\", \"operationAt\": \"2022-05-02T23:27:40+08:00\", \"sourceTable\": \"_user\", \"lastSyncTime\": \"2022-05-02T23:27:37+08:00\", \"syncTimeSlot\": \"1\", \"sourceDatabase\": \"{{dbPrefix}}user_app_management\", \"operationByUser\": \"ç³»ç»ç®¡çå\", \"operationByUserId\": \"admin\"}], \"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"actionId\": \"selectItemList\", \"resultData\": {\"rows\": [{\"id\": 200, \"syncDesc\": \"æ­£å¸¸\", \"operation\": \"update\", \"operationAt\": \"2022-05-02T23:27:40+08:00\", \"sourceTable\": \"_app\", \"lastSyncTime\": \"2022-05-02T23:27:37+08:00\", \"syncTimeSlot\": \"6\", \"sourceDatabase\": \"{{dbPrefix}}user_app_management\", \"operationByUser\": \"ç³»ç»ç®¡çå\", \"operationByUserId\": \"admin\"}, {\"id\": 201, \"syncDesc\": \"æ­£å¸¸\", \"operation\": \"update\", \"operationAt\": \"2022-05-02T23:27:40+08:00\", \"sourceTable\": \"_user_app\", \"lastSyncTime\": \"2022-05-02T23:27:37+08:00\", \"syncTimeSlot\": \"5\", \"sourceDatabase\": \"{{dbPrefix}}user_app_management\", \"operationByUser\": \"ç³»ç»ç®¡çå\", \"operationByUserId\": \"admin\"}, {\"id\": 202, \"syncDesc\": \"æ­£å¸¸\", \"operation\": \"update\", \"operationAt\": \"2022-05-02T23:27:40+08:00\", \"sourceTable\": \"_user\", \"lastSyncTime\": \"2022-05-02T23:27:37+08:00\", \"syncTimeSlot\": \"1\", \"sourceDatabase\": \"{{dbPrefix}}user_app_management\", \"operationByUser\": \"ç³»ç»ç®¡çå\", \"operationByUserId\": \"admin\"}]}}, \"packageId\": \"1651505339666_5442357\", \"timestamp\": \"2022-05-02T23:29:00+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T23:29:01+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (407,NULL,NULL,'tableSyncConfig','syncTable','✅数据库管理页-手动同步表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"syncTable\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"actionId\": \"syncTable\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {}}, \"packageId\": \"1651505257137_7418472\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"appId\": \"data_repository\", \"pageId\": \"tableSyncConfig\", \"actionId\": \"syncTable\"}, \"packageId\": \"1651505257137_7418472\", \"timestamp\": \"2022-05-02T23:27:40+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T23:27:40+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (411,NULL,NULL,'tableSyncLog','selectItemList','✅获取同步日志','sql',NULL,'{\"table\": \"_table_sync_log\", \"operation\": \"select\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"tableSyncLog\", \"orderBy\": [{\"order\": \"desc\", \"column\": \"operationAt\"}], \"actionId\": \"selectItemList\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {}}, \"packageId\": \"1651477866122_3530179\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"packageId\": \"1651477866122_3530179\", \"timestamp\": \"2022-05-02T15:51:06+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T15:51:06+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (451,NULL,NULL,'userGroupRoleManagement','selectItemList','✅权限管理页-查询已配置权限列表','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"select\"}','{\"appData\": {\"appId\": \"data_repository\", \"where\": {\"userId\": \"admin\"}, \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"selectItemList\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {}}, \"packageId\": \"1651477989239_7613481\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"rows\": [{\"id\": 568, \"roleId\": \"adminGroup\", \"userId\": \"admin\", \"groupId\": \"adminGroup\", \"operation\": \"insert\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}], \"appId\": \"data_repository\", \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"selectItemList\", \"resultData\": {\"rows\": [{\"id\": 568, \"roleId\": \"adminGroup\", \"userId\": \"admin\", \"groupId\": \"adminGroup\", \"operation\": \"insert\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}]}}, \"packageId\": \"1651477989239_7613481\", \"timestamp\": \"2022-05-02T15:53:11+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T15:53:11+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (452,NULL,NULL,'userGroupRoleManagement','selectUser','✅权限管理页-查询用户','sql',NULL,'{\"table\": \"_view01_user\", \"operation\": \"select\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"selectUser\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {}}, \"packageId\": \"1651477987456_5740757\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"packageId\": \"1651477987456_5740757\", \"timestamp\": \"2022-05-02T15:53:08+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T15:53:09+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (453,NULL,NULL,'userGroupRoleManagement','selectGroup','✅权限管理页-查询群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"select\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"selectGroup\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {}}, \"packageId\": \"1651477991651_6968845\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"rows\": [{\"id\": 1, \"groupId\": \"adminGroup\", \"groupDesc\": null, \"groupName\": \"æéç»\", \"operation\": \"insert\", \"groupAvatar\": null, \"groupExtend\": \"{}\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}], \"appId\": \"data_repository\", \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"selectGroup\", \"resultData\": {\"rows\": [{\"id\": 1, \"groupId\": \"adminGroup\", \"groupDesc\": null, \"groupName\": \"æéç»\", \"operation\": \"insert\", \"groupAvatar\": null, \"groupExtend\": \"{}\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}]}}, \"packageId\": \"1651477991651_6968845\", \"timestamp\": \"2022-05-02T15:53:14+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T15:53:14+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (454,NULL,NULL,'userGroupRoleManagement','insertItem','✅权限管理页-创建权限配置','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"jhInsert\", \"whereCondition\": \"\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"insertItem\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {\"roleId\": \"teacher\", \"userId\": \"W00001\", \"groupId\": \"adminGroup\"}}, \"packageId\": \"1651212801318_8088889\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"rows\": [583], \"appId\": \"data_repository\", \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"insertItem\", \"resultData\": {\"rows\": [583]}}, \"packageId\": \"1651212801318_8088889\", \"timestamp\": \"2022-04-29T14:13:21+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-04-29T14:13:21+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (455,NULL,NULL,'userGroupRoleManagement','updateItem','✅权限管理页-更新权限配置','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"jhUpdate\", \"whereParamsCondition\": \".where(function() {this.where(whereParams)})\"}','{}','{}','update',NULL,NULL,'2022-02-18T12:09:29+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (456,NULL,NULL,'userGroupRoleManagement','deleteItem','✅权限管理页-删除权限配置','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"jhDelete\", \"whereParamsCondition\": \".where(function() {this.where(whereParams)})\"}','{}','{}','update',NULL,NULL,'2022-02-18T21:03:41+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (457,NULL,NULL,'userGroupRoleManagement','selectRole','✅权限管理页-查询角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"select\"}','{\"appData\": {\"appId\": \"data_repository\", \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"selectRole\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {}}, \"packageId\": \"1651477991651_3217963\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"rows\": [{\"id\": 3, \"roleId\": \"appAdmin\", \"roleDesc\": \"\", \"roleName\": \"ç³»ç»ç®¡çå\", \"operation\": \"insert\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}, {\"id\": 4, \"roleId\": \"teacher\", \"roleDesc\": \"\", \"roleName\": \"èå¸\", \"operation\": \"insert\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}, {\"id\": 5, \"roleId\": \"student\", \"roleDesc\": \"\", \"roleName\": \"å­¦ç\", \"operation\": \"insert\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}, {\"id\": 6, \"roleId\": \"adminGroup\", \"roleDesc\": null, \"roleName\": \"ç®¡çå\", \"operation\": \"insert\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}], \"appId\": \"data_repository\", \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"selectRole\", \"resultData\": {\"rows\": [{\"id\": 3, \"roleId\": \"appAdmin\", \"roleDesc\": \"\", \"roleName\": \"ç³»ç»ç®¡çå\", \"operation\": \"insert\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}, {\"id\": 4, \"roleId\": \"teacher\", \"roleDesc\": \"\", \"roleName\": \"èå¸\", \"operation\": \"insert\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}, {\"id\": 5, \"roleId\": \"student\", \"roleDesc\": \"\", \"roleName\": \"å­¦ç\", \"operation\": \"insert\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}, {\"id\": 6, \"roleId\": \"adminGroup\", \"roleDesc\": null, \"roleName\": \"ç®¡çå\", \"operation\": \"insert\", \"operationAt\": null, \"operationByUser\": null, \"operationByUserId\": null}]}}, \"packageId\": \"1651477991651_3217963\", \"timestamp\": \"2022-05-02T15:53:13+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-05-02T15:53:13+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (458,NULL,NULL,'userGroupRoleManagement','insertUser','✅权限管理页-添加用户','service',NULL,'{\"service\": \"userGroupRoleManagement\", \"serviceFunction\": \"addUser\"}','{}','{}','update',NULL,NULL,'2022-02-19T22:34:22+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (459,NULL,NULL,'userGroupRoleManagement','insertGroup','✅权限管理页-添加群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"jhInsert\"}','{}','{}','update',NULL,NULL,'2022-02-18T19:55:57+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (460,NULL,NULL,'userGroupRoleManagement','insertRole','✅权限管理页-添加角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"jhInsert\"}','{}','{}','update',NULL,NULL,'2022-02-18T20:00:37+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (461,NULL,'{ \"before\": [], \"after\": [{ \"service\": \"userGroupRoleManagement\", \"serviceFunction\": \"deleteUserGroupRole\" }] }','userGroupRoleManagement','deleteUser','✅权限管理页-删除用户','sql',NULL,'{\"table\": \"_view01_user\", \"operation\": \"jhDelete\"}','{\"appData\": {\"appId\": \"data_repository\", \"where\": {\"userId\": \"111\"}, \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"deleteUser\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {}}, \"packageId\": \"1651212670582_1609363\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"rows\": 1, \"appId\": \"data_repository\", \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"deleteUser\", \"resultData\": {\"rows\": 1}}, \"packageId\": \"1651212670582_1609363\", \"timestamp\": \"2022-04-29T14:11:11+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-04-29T14:11:11+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (462,NULL,'{ \"before\": [], \"after\": [{ \"service\": \"userGroupRoleManagement\", \"serviceFunction\": \"deleteUserGroupRole\" }] }','userGroupRoleManagement','deleteGroup','✅权限管理页-删除群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"jhDelete\"}','{}','{}','update',NULL,NULL,'2022-02-18T19:56:11+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (463,NULL,'{ \"before\": [], \"after\": [{ \"service\": \"userGroupRoleManagement\", \"serviceFunction\": \"deleteUserGroupRole\" }] }','userGroupRoleManagement','deleteRole','✅权限管理页-删除角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"jhDelete\"}','{}','{}','update',NULL,NULL,'2022-02-18T20:04:23+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (464,NULL,NULL,'userGroupRoleManagement','updateUser','✅权限管理页-更新用户','sql',NULL,'{\"table\": \"_view01_user\", \"operation\": \"jhUpdate\"}','{\"appData\": {\"appId\": \"data_repository\", \"where\": {\"id\": 43}, \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"updateUser\", \"userAgent\": \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36\", \"actionData\": {\"userId\": \"W00001\", \"md5Salt\": \"Xs4JSZnhiwsR\", \"password\": \"38d61d315e62546fe7f1013e31d42f57\", \"userType\": \"staff\", \"username\": \"å¼ ä¸ä¸°2\", \"operation\": \"update\", \"idSequence\": null, \"userConfig\": null, \"userStatus\": \"active\", \"operationAt\": \"2022-02-19T15:18:42+08:00\", \"operationByUser\": \"ç³»ç»ç®¡çå\", \"clearTextPassword\": \"123456\", \"operationByUserId\": \"admin\"}}, \"packageId\": \"1651212659256_8610617\", \"packageType\": \"httpRequest\"}','{\"status\": \"success\", \"appData\": {\"rows\": 1, \"appId\": \"data_repository\", \"pageId\": \"userGroupRoleManagement\", \"actionId\": \"updateUser\", \"resultData\": {\"rows\": 1}}, \"packageId\": \"1651212659256_8610617\", \"timestamp\": \"2022-04-29T14:10:59+08:00\", \"packageType\": \"httpResponse\"}','update',NULL,NULL,'2022-04-29T14:10:59+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (465,NULL,NULL,'userGroupRoleManagement','updateGroup','✅权限管理页-更新群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"jhUpdate\"}','{}','{}','update',NULL,NULL,'2022-02-18T20:45:26+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (466,NULL,NULL,'userGroupRoleManagement','updateRole','✅权限管理页-更新角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"jhUpdate\"}','{}','{}','update',NULL,NULL,'2022-02-18T19:56:37+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _resource_request_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_resource_request_log`;
CREATE TABLE `_resource_request_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resourceId` varchar(255) DEFAULT NULL COMMENT 'resource id;',
  `packageId` varchar(255) DEFAULT NULL COMMENT 'resource package id',
  `userIp` varchar(255) DEFAULT NULL COMMENT '用户ip;',
  `userAgent` varchar(255) DEFAULT NULL COMMENT '设备信息',
  `deviceId` varchar(255) DEFAULT NULL COMMENT '设备id',
  `userIpRegion` varchar(255) DEFAULT NULL COMMENT '用户Ip区域',
  `executeSql` varchar(255) DEFAULT NULL COMMENT '执行的sql',
  `requestBody` text DEFAULT NULL COMMENT '请求body',
  `responseBody` text DEFAULT NULL COMMENT '响应body',
  `responseStatus` varchar(255) DEFAULT NULL COMMENT '执行的结果;  success, fail',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `resourceId_index` (`resourceId`) USING BTREE,
  KEY `packageId_index` (`packageId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1940 COMMENT = '文件表; 软删除未启用;';




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
) ENGINE = InnoDB AUTO_INCREMENT = 7 COMMENT = '角色表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _role
# ------------------------------------------------------------

INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (3, 'administrator', '系统管理员', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (4, 'teacher', '老师', '', 'insert', NULL, NULL, NULL);
INSERT INTO `_role` (`id`, `roleId`, `roleName`, `roleDesc`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (5, 'student', '学生', '', 'insert', NULL, NULL, NULL);


# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _table_sync_config
# ------------------------------------------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 227;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _table_sync_config
# ------------------------------------------------------------

INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`syncTimeSlot`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (200,'{{dbPrefix}}user_app_management','_app','6','正常','2022-05-02T23:27:37+08:00','update','admin','系统管理员','2022-05-02T23:27:40+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`syncTimeSlot`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (201,'{{dbPrefix}}user_app_management','_user_app','5','正常','2022-05-02T23:27:37+08:00','update','admin','系统管理员','2022-05-02T23:27:40+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`syncTimeSlot`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (202,'{{dbPrefix}}user_app_management','_user','1','正常','2022-05-02T23:27:37+08:00','update','admin','系统管理员','2022-05-02T23:27:40+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _table_sync_log
# ------------------------------------------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 4124;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _table_sync_log
# ------------------------------------------------------------

INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4108,'{{dbPrefix}}directory','test','表覆盖','【表覆盖】数据不一致; 触发覆盖目标表逻辑;','2022-02-20T20:59:14+08:00','insert',NULL,NULL,NULL);
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4109,'{{dbPrefix}}directory','test','触发器覆盖','delete 触发器覆盖','2022-02-20T20:59:14+08:00','insert',NULL,NULL,NULL);
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4110,'{{dbPrefix}}directory','test','触发器覆盖','insert 触发器覆盖','2022-02-20T20:59:15+08:00','insert',NULL,NULL,NULL);
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4111,'{{dbPrefix}}directory','test','触发器覆盖','insert 触发器覆盖','2022-02-20T20:59:15+08:00','insert',NULL,NULL,NULL);
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4112,'{{dbPrefix}}user_app_management','_app','触发器覆盖','insert 触发器覆盖','2022-02-26T18:34:35+08:00','insert',NULL,NULL,'2022-02-26T18:34:35+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4113,'{{dbPrefix}}user_app_management','_app','触发器覆盖','delete 触发器覆盖','2022-02-26T18:34:35+08:00','insert',NULL,NULL,'2022-02-26T18:34:35+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4114,'{{dbPrefix}}user_app_management','_user_app','触发器覆盖','insert 触发器覆盖','2022-02-26T18:34:35+08:00','insert',NULL,NULL,'2022-02-26T18:34:35+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4115,'{{dbPrefix}}user_app_management','_user_app','触发器覆盖','insert 触发器覆盖','2022-02-26T18:34:35+08:00','insert',NULL,NULL,'2022-02-26T18:34:35+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4116,'{{dbPrefix}}user_app_management','_user_app','触发器覆盖','delete 触发器覆盖','2022-02-26T18:34:36+08:00','insert',NULL,NULL,'2022-02-26T18:34:36+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4117,'{{dbPrefix}}user_app_management','_user','触发器覆盖','insert 触发器覆盖','2022-02-26T18:34:36+08:00','insert',NULL,NULL,'2022-02-26T18:34:36+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4118,'{{dbPrefix}}user_app_management','_user','触发器覆盖','insert 触发器覆盖','2022-02-26T18:34:36+08:00','insert',NULL,NULL,'2022-02-26T18:34:36+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4119,'{{dbPrefix}}user_app_management','_user','触发器覆盖','delete 触发器覆盖','2022-02-26T18:34:36+08:00','insert',NULL,NULL,'2022-02-26T18:34:36+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4120,'jianghujs_demo_basic_3table','student','表覆盖','【表覆盖】数据不一致; 触发覆盖目标表逻辑;','2022-04-29T14:02:46+08:00','insert',NULL,NULL,'2022-04-29T14:02:46+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4121,'jianghujs_demo_basic_3table','student','触发器覆盖','insert 触发器覆盖','2022-04-29T14:02:46+08:00','insert',NULL,NULL,'2022-04-29T14:02:46+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4122,'jianghujs_demo_basic_3table','student','触发器覆盖','insert 触发器覆盖','2022-04-29T14:02:47+08:00','insert',NULL,NULL,'2022-04-29T14:02:47+08:00');
INSERT INTO `_table_sync_log` (`id`,`sourceDatabase`,`sourceTable`,`syncAction`,`syncDesc`,`syncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4123,'jianghujs_demo_basic_3table','student','触发器覆盖','delete 触发器覆盖','2022-04-29T14:02:47+08:00','insert',NULL,NULL,'2022-04-29T14:02:47+08:00');



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
  `appDataSchema` text DEFAULT NULL COMMENT 'ui 校验数据',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 82 COMMENT = 'ui 施工方案';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _ui
# ------------------------------------------------------------

INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'tableSyncLog','ui','refreshTableData','✅获取表格数据','{\"main\": [{\"function\": \"refreshTableData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (10,'tableSyncConfig','ui','refreshTableData','✅获取表格数据','{\"main\": [{\"function\": \"refreshTableData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (12,'tableSyncConfig','ui','startCreateItem','✅打开创建数据抽屉','{\"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateItemDialog\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (13,'tableSyncConfig','ui','createItem','✅创建数据','{\"before\": [{\"function\": \"prepareValidate\"}, {\"function\": \"confirmCreateItemDialog\"}], \"main\": [{\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (14,'tableSyncConfig','ui','startUpdateItem','✅打开更新数据抽屉','{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (15,'tableSyncConfig','ui','updateItem','✅更新数据','{\"before\": [{\"function\": \"prepareValidate\"}, {\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (16,'tableSyncConfig','ui','deleteItem','✅删除数据','{\"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (17,'tableSyncConfig','ui','manualSyncOneTable','✅同步单张表数据','{\"before\": [{\"function\": \"confirmSyncOneTableDialog\"}], \"main\": [{\"function\": \"doManualSyncOneTable\"}, {\"function\": \"refreshTableData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (18,'tableSyncConfig','ui','manualSyncAll','✅同步所有表数据','{\"before\": [{\"function\": \"confirmManualSyncAllDialog\"}], \"main\": [{\"function\": \"doManualSyncAll\"}, {\"function\": \"refreshTableData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (19,'tableSyncConfig','ui','resetSourceTable','✅同步所有表数据','{\"main\": [{\"function\": \"doResetSourceTable\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (20,'tableSyncConfig','ui','getAllApp','✅同步所有表数据','{\"main\": [{\"function\": \"doGetAllApp\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (30,'userGroupRoleManagement','ui','refreshTableData','✅获取表格数据','{\"main\": [{\"function\": \"refreshTableData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (31,'userGroupRoleManagement','ui','startCreateItem','✅打开创建数据抽屉','{\"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateItemDialog\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (32,'userGroupRoleManagement','ui','createItem','✅创建数据','{\"before\": [{\"function\": \"confirmCreateItemDialog\"}], \"main\": [{\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (33,'userGroupRoleManagement','ui','startUpdateItem','✅打开更新数据抽屉','{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateItemDialog\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (34,'userGroupRoleManagement','ui','updateItem','✅更新数据','{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (35,'userGroupRoleManagement','ui','deleteItem','✅删除数据','{\"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (36,'userGroupRoleManagement','ui','startCreateLeftItem','✅打开创建数据抽屉','{\"main\": [{\"function\": \"openFormDialog\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (37,'userGroupRoleManagement','ui','createLeftItem','✅创建数据','{\"main\": [{\"function\": \"addNewItem\"}, {\"function\": \"reGetLeftData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (38,'userGroupRoleManagement','ui','updateLeftItem','✅更新数据','{\"main\": [{\"function\": \"updateLeftItem\"}, {\"function\": \"reGetLeftData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (39,'userGroupRoleManagement','ui','deleteLeftItem','✅删除数据','{\"main\": [{\"function\": \"deleteLeftItem\"}, {\"function\": \"reGetLeftData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (40,'userGroupRoleManagement','ui','initOptions','✅获取表格数据','{\"main\": [{\"function\": \"selectUser\"}, {\"function\": \"refreshTableData\"}, {\"function\": \"initOptions\"}]}',NULL,'insert',NULL,NULL,NULL);



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
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_index` (`username`),
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 59 COMMENT = '用户表';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _user
# ------------------------------------------------------------

INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (42,'111','admin','系统管理员','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','common',NULL,'update',NULL,NULL,'2022-02-19T15:02:24+08:00');
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (43,NULL,'W00001','张三丰2','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','staff',NULL,'jhUpdate','admin','系统管理员','2022-04-29T14:10:59+08:00');
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (44,NULL,'W00002','张无忌','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'update','admin','系统管理员','2022-02-19T15:45:14+08:00');
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (45,NULL,'G00001','洪七公','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (46,NULL,'G00002','郭靖','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (47,NULL,'H00001','岳不群','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (48,NULL,'H00002','令狐冲','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);



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
) ENGINE = InnoDB AUTO_INCREMENT = 584 COMMENT = '用户群组角色关联表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _user_group_role
# ------------------------------------------------------------

INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (568,'admin','adminGroup','administrator','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (569,'T66661G','adminGroup','teacher','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (580,'T66662G','adminGroup','teacher','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (581,'T66663G','adminGroup','teacher','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (582,'W00001','adminGroup','student','jhInsert','admin','系统管理员','2022-04-29T14:11:31+08:00');
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (583,'W00001','adminGroup','teacher','jhInsert','admin','系统管理员','2022-04-29T14:13:21+08:00');



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
) ENGINE = InnoDB AUTO_INCREMENT = 22 COMMENT = '用户群组角色 - 页面 映射表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _user_group_role_page
# ------------------------------------------------------------

INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (17,'*','public','*','login','allow','登陆页; 开放给所有用户;','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (18,'*','login','*','manual','allow','操作手册页; 开放给登陆用户;','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (19,'*','login','*','help','allow','帮助页; 开放给登陆用户;','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (21,'*','adminGroup','administrator','*','allow','所有页面; 开放给应用管理者;','insert',NULL,NULL,NULL);



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
) ENGINE = InnoDB AUTO_INCREMENT = 53 COMMENT = '用户群组角色 - 请求资源 映射表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _user_group_role_resource
# ------------------------------------------------------------

INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'*','public','*','login.passwordLogin','allow','登陆resource, 开放给所有用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (11,'*','public','*','allPage.getConstantList','allow','查询常量resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (31,'*','login','*','allPage.logout','allow','登出resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (32,'*','login','*','allPage.refreshToken','allow','刷新authToken resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (33,'*','login','*','allPage.userInfo','allow','用户个人信息resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (34,'*','login','*','allPage.uploadByBase64','allow','上传文件resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (35,'*','login','*','allPage.uploadByStream','allow','上传文件resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (51,'*','adminGroup','administrator','*','allow','应用管理者, 赋予所有resource权限','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (52,'*','adminGroup','administrator','userGroupRole.*','allow','应用管理者, 赋予所有resource权限','insert',NULL,NULL,NULL);



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
) ENGINE = InnoDB AUTO_INCREMENT = 10 COMMENT = '用户session表; deviceId 维度;软删除未启用;';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: jianghujs_demo_basic_3table__student
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jianghujs_demo_basic_3table__student`;
CREATE TABLE `jianghujs_demo_basic_3table__student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) DEFAULT NULL COMMENT '学生ID',
  `menPaiId` varchar(255) DEFAULT NULL COMMENT '门派ID',
  `menPaiName` varchar(255) DEFAULT NULL COMMENT '门派名',
  `name` varchar(255) DEFAULT NULL COMMENT '学生名字',
  `gender` varchar(255) DEFAULT NULL COMMENT '性别',
  `dateOfBirth` varchar(255) DEFAULT NULL COMMENT '出生日期',
  `bodyHeight` varchar(255) DEFAULT NULL COMMENT '身高',
  `studentStatus` varchar(255) DEFAULT NULL COMMENT '学生状态',
  `remarks` mediumtext COMMENT '备注',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `studentId` (`studentId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 95;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: jianghujs_demo_basic_3table__student
# ------------------------------------------------------------

INSERT INTO `jianghujs_demo_basic_3table__student` (`id`,`studentId`,`menPaiId`,`menPaiName`,`name`,`gender`,`dateOfBirth`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (13,'E00001',NULL,NULL,'张三丰','male',NULL,NULL,NULL,NULL,'jhUpdate','W00001','张三丰','2022-04-27T19:39:54+08:00');
INSERT INTO `jianghujs_demo_basic_3table__student` (`id`,`studentId`,`menPaiId`,`menPaiName`,`name`,`gender`,`dateOfBirth`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (19,'W00001',NULL,NULL,'学生2',NULL,NULL,NULL,'正常',NULL,'jhUpdate','W00001','张三丰','2022-04-27T19:40:26+08:00');
INSERT INTO `jianghujs_demo_basic_3table__student` (`id`,`studentId`,`menPaiId`,`menPaiName`,`name`,`gender`,`dateOfBirth`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (20,'C00002',NULL,NULL,'测试',NULL,NULL,NULL,NULL,NULL,'jhUpdate','W00001','张三丰','2022-04-27T19:43:49+08:00');
INSERT INTO `jianghujs_demo_basic_3table__student` (`id`,`studentId`,`menPaiId`,`menPaiName`,`name`,`gender`,`dateOfBirth`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (22,'C00003',NULL,NULL,'测试',NULL,NULL,NULL,NULL,NULL,'jhUpdate','W00001','张三丰','2022-04-27T19:43:56+08:00');
INSERT INTO `jianghujs_demo_basic_3table__student` (`id`,`studentId`,`menPaiId`,`menPaiName`,`name`,`gender`,`dateOfBirth`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (46,'C00004',NULL,NULL,'测试',NULL,NULL,NULL,NULL,NULL,'jhUpdate','W00001','张三丰','2022-04-27T19:44:02+08:00');
INSERT INTO `jianghujs_demo_basic_3table__student` (`id`,`studentId`,`menPaiId`,`menPaiName`,`name`,`gender`,`dateOfBirth`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (48,'H00001',NULL,NULL,'测试',NULL,NULL,NULL,NULL,NULL,'jhUpdate','W00001','张三丰','2022-04-27T19:44:15+08:00');
INSERT INTO `jianghujs_demo_basic_3table__student` (`id`,`studentId`,`menPaiId`,`menPaiName`,`name`,`gender`,`dateOfBirth`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (49,'D00001',NULL,NULL,'测试',NULL,NULL,NULL,NULL,NULL,'jhUpdate','W00001','张三丰','2022-04-27T19:44:20+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: {{dbPrefix}}user_app_management___app
# ------------------------------------------------------------

DROP TABLE IF EXISTS `{{dbPrefix}}user_app_management___app`;
CREATE TABLE `{{dbPrefix}}user_app_management___app` (
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
  PRIMARY KEY (`id`),
  KEY `appId` (`appId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: {{dbPrefix}}user_app_management___app
# ------------------------------------------------------------

INSERT INTO `{{dbPrefix}}user_app_management___app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (12,'user_app_management','base','账号权限管理',NULL,NULL,NULL,'internal','insert',NULL,NULL,NULL,NULL);
INSERT INTO `{{dbPrefix}}user_app_management___app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (13,'data_repository','base','数据中心管理',NULL,NULL,NULL,'internal','insert',NULL,NULL,NULL,NULL);
INSERT INTO `{{dbPrefix}}user_app_management___app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (14,'directory','base','APP目录',NULL,NULL,NULL,'internal','insert',NULL,NULL,NULL,NULL);
INSERT INTO `{{dbPrefix}}user_app_management___app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (18,'demo_xiaoapp',NULL,'小APPDemo项目',NULL,NULL,NULL,'internal','jhInsert','admin','系统管理员','2022-02-24T20:18:14+08:00',NULL);
INSERT INTO `{{dbPrefix}}user_app_management___app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (19,'test',NULL,'uiAction test123',NULL,NULL,NULL,'internal','jhUpdate','admin','系统管理员','2022-04-28T21:58:09+08:00',NULL);
INSERT INTO `{{dbPrefix}}user_app_management___app` (`id`,`appId`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (20,NULL,NULL,'123',NULL,NULL,NULL,'internal','jhInsert','admin','系统管理员','2022-05-03T16:21:36+08:00',NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: {{dbPrefix}}user_app_management___user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `{{dbPrefix}}user_app_management___user`;
CREATE TABLE `{{dbPrefix}}user_app_management___user` (
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_index` (`username`),
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 59 COMMENT = '用户表';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: {{dbPrefix}}user_app_management___user
# ------------------------------------------------------------

INSERT INTO `{{dbPrefix}}user_app_management___user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (42,'111','admin','系统管理员','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','common',NULL,'update',NULL,NULL,'2022-02-19T15:02:24+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (43,NULL,'W00001','张三丰','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'update','admin','系统管理员','2022-02-19T15:18:42+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (44,NULL,'W00002','张无忌','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'update','admin','系统管理员','2022-02-19T15:45:14+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (45,NULL,'G00001','洪七公','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `{{dbPrefix}}user_app_management___user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (46,NULL,'G00002','郭靖','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'update','admin','系统管理员','2022-05-03T13:45:14+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (47,NULL,'H00001','岳不群','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `{{dbPrefix}}user_app_management___user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (48,NULL,'H00002','令狐冲','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `{{dbPrefix}}user_app_management___user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`userConfig`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (58,'112','U223P','uiaction123','12345678','31166f44402dedbf27c9b2d4bcfa90cb','ajGTYtmy4cNH','active','common',NULL,'update','admin','系统管理员','2022-05-03T16:00:16+08:00');



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: {{dbPrefix}}user_app_management___user_app
# ------------------------------------------------------------

DROP TABLE IF EXISTS `{{dbPrefix}}user_app_management___user_app`;
CREATE TABLE `{{dbPrefix}}user_app_management___user_app` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) DEFAULT NULL COMMENT '用户id',
  `appId` varchar(255) DEFAULT NULL COMMENT 'appId',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 90;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: {{dbPrefix}}user_app_management___user_app
# ------------------------------------------------------------

INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (55,'W00001','test','jhInsert','admin','系统管理员','2022-04-28T22:18:16+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (56,'U223P','demo_xiaoapp','jhInsert','admin','系统管理员','2022-04-28T22:34:42+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (62,'admin','data_repository','insert',NULL,NULL,NULL);
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (63,'admin','directory','insert',NULL,NULL,NULL);
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (64,'admin','user_app_management','insert',NULL,NULL,NULL);
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (68,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:53:46+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (69,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:53:47+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (70,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:53:49+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (71,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:55:10+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (72,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:55:12+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (73,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:55:13+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (74,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:56:34+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (75,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:56:35+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (76,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:56:36+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (77,'0','test','jhInsert','admin','系统管理员','2022-04-28T22:57:51+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (78,'1','test','jhInsert','admin','系统管理员','2022-04-28T22:57:52+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (79,'2','test','jhInsert','admin','系统管理员','2022-04-28T22:57:53+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (80,'admin','test','jhInsert','admin','系统管理员','2022-04-28T22:58:44+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (83,'U223P','user_app_management','jhInsert','admin','系统管理员','2022-04-28T23:04:25+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (86,'G00002','test','jhInsert','admin','系统管理员','2022-04-28T23:05:54+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (87,'H00001','test','jhInsert','admin','系统管理员','2022-04-28T23:05:55+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (88,'admin','demo_xiaoapp','jhInsert','admin','系统管理员','2022-04-28T23:26:04+08:00');
INSERT INTO `{{dbPrefix}}user_app_management___user_app` (`id`,`userId`,`appId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (89,'U223P','test','jhInsert','admin','系统管理员','2022-05-03T16:26:16+08:00');



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





