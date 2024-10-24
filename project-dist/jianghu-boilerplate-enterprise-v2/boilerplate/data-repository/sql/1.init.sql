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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = '缓存表';


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
  `pageIcon` text,
  `sort` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 51 DEFAULT CHARSET = utf8mb4 COMMENT = '页面表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _page
# ------------------------------------------------------------

INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'help','帮助','helpV4','dynamicInMenu',NULL,'0','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'login','登陆','loginV4',NULL,NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (8,'tableSyncConfig','同步表管理',NULL,'showInMenu',NULL,'1','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (9,'tableMergeConfig','合并表管理',NULL,'showInMenu',NULL,'2','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (12,'tableSyncLog','同步日志',NULL,'showInMenu',NULL,'3','update','vscode','vscode','2022-06-06T23:46:28+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (13,'mysqlTrigger','MYSQL触发器',NULL,'showInMenu',NULL,'4','update','vscode','vscode','2022-06-06T23:46:28+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (50,'https://demo.jianghujs.org/task/page/noticeManagement','通知/待办',NULL,'showInRightMenu','<svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <g id=\"Frame 19\"> <path id=\"Vector\" d=\"M14 0C6.2695 0 0 6.2695 0 14C0 21.7305 6.2695 28 14 28C21.7305 28 28 21.7305 28 14C28 6.2695 21.7305 0 14 0Z\" fill=\"#5DB55F\"/> <g id=\"Frame\"> <path id=\"Vector_2\" d=\"M15.2698 19.44L15.307 19.4419C15.5022 19.4633 15.6398 19.6499 15.5895 19.8403L15.57 19.9088C15.3646 20.5638 14.7393 21.04 14.0001 21.04L13.9239 21.0384C13.193 21.0057 12.5866 20.5075 12.4103 19.8403L12.4033 19.8048C12.3758 19.6153 12.5284 19.44 12.7303 19.44H15.2698ZM14.0001 6.95996C14.1274 6.95996 14.2495 7.01053 14.3395 7.10055C14.4295 7.19057 14.4801 7.31266 14.4801 7.43996V7.94364C16.9402 8.191 18.8001 10.3545 18.8001 12.8556V16.24L18.802 16.288C18.8141 16.4489 18.8866 16.5994 19.0049 16.7091C19.1232 16.8189 19.2787 16.8799 19.4401 16.88H19.5543L19.6087 16.8816C20.0055 16.9065 20.3562 17.1993 20.3959 17.5974L20.3994 17.6486C20.4037 17.7562 20.3861 17.8635 20.3479 17.9642C20.3096 18.0648 20.2514 18.1567 20.1768 18.2343C20.1022 18.312 20.0127 18.3737 19.9137 18.4159C19.8146 18.4581 19.7081 18.4799 19.6004 18.48H8.44583L8.39143 18.4784C7.99463 18.4534 7.64391 18.1606 7.60423 17.7625L7.60071 17.7113C7.59649 17.6037 7.61404 17.4964 7.65231 17.3957C7.69058 17.295 7.74878 17.2031 7.82342 17.1255C7.89807 17.0479 7.98762 16.9861 8.0867 16.9439C8.18579 16.9017 8.29238 16.88 8.40007 16.88H8.56007L8.60807 16.8784C8.76908 16.8663 8.91956 16.7937 9.02935 16.6753C9.13914 16.5569 9.20012 16.4014 9.20007 16.24V12.72C9.20007 10.231 11.0945 8.1846 13.5201 7.94364V7.43996C13.5201 7.31266 13.5706 7.19057 13.6607 7.10055C13.7507 7.01053 13.8728 6.95996 14.0001 6.95996Z\" fill=\"white\"/> </g> </g> </svg>',NULL,'insert',NULL,NULL,NULL);

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _record_history
# ------------------------------------------------------------

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
  KEY `index_table_action` (`table`, `operation`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 37 DEFAULT CHARSET = utf8mb4 COMMENT = '数据历史表';


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
) ENGINE = InnoDB AUTO_INCREMENT = 422 DEFAULT CHARSET = utf8mb4 COMMENT = '请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _resource
# ------------------------------------------------------------

INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (231,NULL,NULL,'login','passwordLogin','✅登陆','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"passwordLogin\"}',NULL,NULL,'update',NULL,NULL,'2023-02-25T00:23:04+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (251,NULL,NULL,'allPage','logout','✅登出','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"logout\"}',NULL,NULL,'update',NULL,NULL,'2022-09-10T15:10:06+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (252,NULL,NULL,'allPage','refreshToken','✅刷新authToken','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"refreshToken\"}',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (253,NULL,NULL,'allPage','userInfo','✅获取用户信息','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"userInfo\"}',NULL,NULL,'update',NULL,NULL,'2022-12-09T13:44:52+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (256,NULL,NULL,'allPage','uploadByStream','✅文件上传(文件流)','service',NULL,'{\"service\": \"file\", \"serviceFunction\": \"uploadByBase64\"}',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (257,NULL,NULL,'allPage','uploadByBase64','✅文件上传(base64)','service',NULL,'{\"service\": \"file\", \"serviceFunction\": \"downlaodBase64ByFileId\"}',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (395,NULL,NULL,'tableSyncConfig','selectSourceDatabase','✅数据库管理页-查询源数据库列表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"selectSourceDatabase\"}',NULL,NULL,'update',NULL,NULL,'2023-02-25T00:23:05+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (396,NULL,NULL,'tableSyncConfig','selectSourceTable','✅数据库管理页-查询源数据库中的table列表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"selectSourceTable\"}',NULL,NULL,'update',NULL,NULL,'2023-02-24T23:46:25+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (398,NULL,NULL,'tableSyncConfig','deleteTable','✅数据库管理页-删除同步表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"deleteTableSyncConfig\"}',NULL,NULL,'update',NULL,NULL,'2022-08-31T10:07:07+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (400,NULL,NULL,'tableSyncConfig','selectItemList','✅数据库管理页-查询同步表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"selectItemList\"}',NULL,NULL,'update',NULL,NULL,'2023-02-25T00:23:05+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (407,NULL,NULL,'tableSyncConfig','syncTable','✅数据库管理页-手动同步表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"syncTable\"}',NULL,NULL,'update',NULL,NULL,'2023-02-24T23:50:38+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (411,NULL,NULL,'tableSyncLog','selectItemList','✅获取同步日志','sql',NULL,'{\"table\": \"_table_sync_log\", \"operation\": \"select\"}',NULL,NULL,'update',NULL,NULL,'2023-02-25T00:22:59+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (412,NULL,NULL,'tableSyncConfig','insertTable','✅数据库管理页-创建同步表','sql',NULL,'{\"table\": \"_table_sync_config\", \"operation\": \"insert\"}',NULL,NULL,'update',NULL,NULL,'2022-12-09T13:47:05+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (413,NULL,NULL,'tableSyncConfig','updateTable','✅数据库管理页-更新同步表','sql',NULL,'{\"table\": \"_table_sync_config\", \"operation\": \"update\"}',NULL,NULL,'update',NULL,NULL,'2022-09-10T14:19:10+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (414,NULL,NULL,'tableMergeConfig','selectSourceDatabase','✅数据库管理页-查询源数据库列表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"selectSourceDatabase\"}',NULL,NULL,'update',NULL,NULL,'2023-02-25T00:23:05+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (415,NULL,NULL,'tableMergeConfig','selectSourceTable','✅数据库管理页-查询源数据库中的table列表','service',NULL,'{\"service\": \"tableSync\", \"serviceFunction\": \"selectSourceTable\"}',NULL,NULL,'update',NULL,NULL,'2023-02-24T23:46:25+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (416,NULL,NULL,'tableMergeConfig','deleteTable','✅数据库管理页-删除同步表','service',NULL,'{\"service\": \"tableMergeAll\", \"serviceFunction\": \"deleteTableMergeAllConfig\"}',NULL,NULL,'update',NULL,NULL,'2022-08-31T10:07:07+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (417,NULL,NULL,'tableMergeConfig','selectItemList','✅数据库管理页-查询同步表','sql',NULL,'{\"table\": \"_table_merge_config\", \"operation\": \"select\"}',NULL,NULL,'update',NULL,NULL,'2023-02-25T00:23:05+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (418,NULL,NULL,'tableMergeConfig','doTableMerge','✅数据库管理页-手动同步表','service',NULL,'{\"service\": \"tableMerge\", \"serviceFunction\": \"doTableMerge\"}',NULL,NULL,'update',NULL,NULL,'2023-02-24T23:50:38+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (419,NULL,NULL,'tableMergeConfig','insertTable','✅数据库管理页-创建同步表','sql',NULL,'{\"table\": \"_table_merge_config\", \"operation\": \"insert\"}',NULL,NULL,'update',NULL,NULL,'2022-12-09T13:47:05+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (420,NULL,NULL,'tableMergeConfig','updateTable','✅数据库管理页-更新同步表','sql',NULL,'{\"table\": \"_table_merge_config\", \"operation\": \"update\"}',NULL,NULL,'update',NULL,NULL,'2022-09-10T14:19:10+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (421,NULL,NULL,'mysqlTrigger','selectItemList','✅mysql触发器-查询列表','sql',NULL,'{\"table\": \"information_schema.triggers\", \"operation\": \"select\"}',NULL,NULL,'update',NULL,NULL,'2023-02-25T00:23:05+08:00');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _table_merge_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_table_merge_config`;
CREATE TABLE `_table_merge_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sourceList` text,
  `targetDatabase` varchar(255) DEFAULT NULL,
  `targetTable` varchar(255) DEFAULT NULL,
  `mergeDesc` varchar(255) DEFAULT NULL COMMENT '同步状态,  正常, 源表不存在; 目标表不存在;,源表不存在; 目标表存在; ',
  `lastMergeTime` varchar(255) DEFAULT NULL COMMENT '最后一次触发同步的时间',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 212 DEFAULT CHARSET = utf8mb4;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _table_merge_config
# ------------------------------------------------------------

INSERT INTO `_table_merge_config` (`id`,`sourceList`,`targetDatabase`,`targetTable`,`mergeDesc`,`lastMergeTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (211,'[{\"database\":\"{{dbPrefix}}base_task\",\"appId\":\"task\",\"tableName\":\"task\"},{\"database\":\"{{dbPrefix}}base_system\",\"tableName\":\"task\",\"appId\":\"system\"}]','{{dbPrefix}}base_task','all_task','正常','2024-03-20T22:20:01+08:00','update','admin','超级管理员','2024-03-14T14:39:02+08:00');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _table_sync_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_table_sync_config`;
CREATE TABLE `_table_sync_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sourceDatabase` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `sourceTable` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `targetDatabase` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `targetTable` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `syncTimeSlot` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `enableMysqlTrigger` varchar(255) COLLATE utf8mb4_bin DEFAULT '开启' COMMENT '开启Mysql Trigger; 开启、关闭',
  `syncDesc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '同步状态,  正常, 源表不存在; 目标表不存在;,源表不存在; 目标表存在; ',
  `lastSyncTime` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '最后一次触发同步的时间',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 298 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_bin;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _table_sync_config
# ------------------------------------------------------------

INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (279,'{{dbPrefix}}base_system','enterprise_user_group_role_page','{{dbPrefix}}data_repository','enterprise_user_group_role_page','2','开启','正常','2024-03-20T13:56:02+08:00','update','admin','系统管理员','2024-03-20T13:56:03+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (280,'{{dbPrefix}}base_system','enterprise_user_group_role_resource','{{dbPrefix}}data_repository','enterprise_user_group_role_resource','2','开启','正常','2024-03-20T13:56:02+08:00','update','admin','系统管理员','2024-03-20T13:56:03+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (281,'{{dbPrefix}}base_system','enterprise_user_group_role','{{dbPrefix}}data_repository','enterprise_user_group_role','2','开启','正常','2024-03-20T13:56:02+08:00','update','admin','系统管理员','2024-03-20T13:56:03+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (283,'{{dbPrefix}}base_system','enterprise_app','{{dbPrefix}}data_repository','enterprise_app','2','开启','正常','2024-03-20T13:56:02+08:00','update','admin03','超级管理员03','2024-03-20T13:56:03+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (285,'{{dbPrefix}}base_system','enterprise_role','{{dbPrefix}}data_repository','enterprise_role','2','开启','正常','2024-03-20T13:56:02+08:00','update','admin','系统管理员','2024-03-20T13:56:03+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (287,'{{dbPrefix}}base_directory','_user_session','{{dbPrefix}}data_repository','enterprise_directory_user_session','5','开启','正常','2024-03-20T13:55:02+08:00','update','admin','超级管理员','2024-03-20T13:55:02+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (289,'{{dbPrefix}}base_system','_user','{{dbPrefix}}data_repository','enterprise_view01_user','2','开启','正常','2024-03-20T13:56:02+08:00','update','F00992','刘计','2024-03-20T13:56:03+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (290,'{{dbPrefix}}base_system','_view02_user_app','{{dbPrefix}}data_repository','enterprise_view02_user_app','2','关闭','正常','2024-03-20T13:56:02+08:00','update','admin','超级管理员','2024-03-20T13:56:03+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (291,'{{dbPrefix}}base_system','enterprise_user','{{dbPrefix}}data_repository','enterprise_user','2','开启','正常','2024-03-20T13:56:02+08:00','update','admin','超级管理员','2024-03-20T13:56:03+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (292,'{{dbPrefix}}base_system','enterprise_group','{{dbPrefix}}data_repository','enterprise_group','2','开启','正常','2024-03-20T13:56:02+08:00','update','admin','超级管理员','2024-03-20T13:56:03+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (296,'jianghu_hr','repo_hr_user_org','{{dbPrefix}}base_system','repo_hr_user_org','2','开启','正常','2024-03-20T13:56:02+08:00','update','admin','超级管理员','2024-03-20T13:56:03+08:00');
INSERT INTO `_table_sync_config` (`id`,`sourceDatabase`,`sourceTable`,`targetDatabase`,`targetTable`,`syncTimeSlot`,`enableMysqlTrigger`,`syncDesc`,`lastSyncTime`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (297,'jianghu_hr','employee','{{dbPrefix}}data_repository','jianghu_hr__employee','5','开启','正常','2024-03-20T13:55:02+08:00','update','admin','超级管理员','2024-03-20T13:55:02+08:00');

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
) ENGINE = InnoDB AUTO_INCREMENT = 91748 DEFAULT CHARSET = utf8mb4;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _table_sync_log
# ------------------------------------------------------------


# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _test_case
# ------------------------------------------------------------

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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_bin COMMENT = '测试用例表';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _test_case
# ------------------------------------------------------------


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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT = 'ui 施工方案';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _ui
# ------------------------------------------------------------


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
) ENGINE = InnoDB AUTO_INCREMENT = 19 DEFAULT CHARSET = utf8mb4 COMMENT = '用户session表; deviceId 维度;软删除未启用;';


# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_app
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_app`;
CREATE TABLE `enterprise_app` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appId` varchar(255) DEFAULT NULL COMMENT 'appId',
  `appDatabase` varchar(255) DEFAULT NULL COMMENT 'database',
  `appJhId` varchar(255) DEFAULT NULL,
  `appPageList` text,
  `appPageDirectoryList` text COMMENT '展示在应用目录的页面列表, pageId数组',
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
  UNIQUE KEY `appId` (`appId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 108 DEFAULT CHARSET = utf8mb4;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_app
# ------------------------------------------------------------

INSERT INTO `enterprise_app` (`id`,`appId`,`appDatabase`,`appJhId`,`appPageList`,`appPageDirectoryList`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (12,'system','{{dbPrefix}}base_system',NULL,'[{\"pageId\":\"userManagement\",\"pageName\":\"用户管理\",\"pageType\":\"showInMenu\",\"sort\":\"3\"},{\"pageId\":\"userManagement2\",\"pageName\":\"用户管理2\",\"pageType\":\"showInMenu\",\"sort\":\"3\"},{\"pageId\":\"appManagement\",\"pageName\":\"应用管理\",\"pageType\":\"showInMenu\",\"sort\":\"2\"},{\"pageId\":\"appDirectoryManagement\",\"pageName\":\"应用目录管理【临时】\",\"pageType\":\"dynamicInMenu\",\"sort\":\"5\"},{\"pageId\":\"appManagementOfOneUser\",\"pageName\":\"用户的App权限\",\"pageType\":\"dynamicInMenu\",\"sort\":\"4\"},{\"pageId\":\"userManagementOfOneApp\",\"pageName\":\"App的用户权限\",\"pageType\":\"dynamicInMenu\",\"sort\":\"6\"},{\"pageId\":\"bindWx\",\"pageName\":\"绑定微信\",\"pageType\":\"dynamicInMenu\",\"sort\":null},{\"pageId\":\"appSetting\",\"pageName\":\"应用设置\",\"pageType\":\"showInAvatarMenu\",\"sort\":\"0\"},{\"pageId\":\"groupManagement\",\"pageName\":\"[组织权限]组织管理\",\"pageType\":\"showInMenu\",\"sort\":\"5\"},{\"pageId\":\"groupAuthorityManagement\",\"pageName\":\"[组织权限]组织权限分配\",\"pageType\":\"showInMenu\",\"sort\":\"5\"},{\"pageId\":\"groupUserManagement\",\"pageName\":\"[组织权限]组织人员\",\"pageType\":\"showInMenu\",\"sort\":\"5\"}]','[\"userManagement\",\"appManagement\",\"enterpriseGroup\"]',NULL,'系统管理',NULL,'https://demo.jianghujs.org/system',NULL,'系统应用','update','admin','超级管理员','2024-03-18T14:29:43+08:00',NULL);
INSERT INTO `enterprise_app` (`id`,`appId`,`appDatabase`,`appJhId`,`appPageList`,`appPageDirectoryList`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (13,'data-repository','{{dbPrefix}}data_repository',NULL,'[{\"pageId\":\"tableSyncConfig\",\"pageName\":\"同步表管理\",\"pageType\":\"showInMenu\",\"sort\":\"1\"},{\"pageId\":\"tableMergeConfig\",\"pageName\":\"合并表管理\",\"pageType\":\"showInMenu\",\"sort\":\"2\"},{\"pageId\":\"tableSyncLog\",\"pageName\":\"同步日志\",\"pageType\":\"showInMenu\",\"sort\":\"3\"},{\"pageId\":\"mysqlTrigger\",\"pageName\":\"MYSQL触发器\",\"pageType\":\"showInMenu\",\"sort\":\"4\"}]','[\"tableSyncConfig\",\"tableMergeConfig\",\"tableSyncLog\",\"mysqlTrigger\",\"https://demo.jianghujs.org/task/page/noticeManagement\"]',NULL,'数据中心管理',NULL,'https://demo.jianghujs.org/data-repository',NULL,'系统应用','update','admin','超级管理员','2024-03-15T09:05:18+08:00',NULL);
INSERT INTO `enterprise_app` (`id`,`appId`,`appDatabase`,`appJhId`,`appPageList`,`appPageDirectoryList`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (14,'directory','{{dbPrefix}}base_directory',NULL,'[{\"pageId\":\"directory\",\"pageName\":\"目录\",\"pageType\":\"showInMenu\",\"sort\":\"1\"},{\"pageId\":\"changePassword\",\"pageName\":\"修改密码\",\"pageType\":\"showInAvatarMenu\",\"sort\":\"3\"},{\"pageId\":\"directoryEditor\",\"pageName\":\"目录设置\",\"pageType\":\"showInAvatarMenu\",\"sort\":\"2\"}]','[\"\",\"http://127.0.0.1:7274/task/page/noticeManagement\"]',NULL,'应用目录',NULL,'https://demo.jianghujs.org/directory',NULL,'系统应用','update','admin','超级管理员','2024-03-15T09:05:18+08:00',NULL);
INSERT INTO `enterprise_app` (`id`,`appId`,`appDatabase`,`appJhId`,`appPageList`,`appPageDirectoryList`,`appGroup`,`appName`,`appDesc`,`appUrl`,`appMenu`,`appType`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`,`sort`) VALUES (27,'task','{{dbPrefix}}base_task',NULL,'[{\"pageId\":\"taskManagement\",\"pageName\":\"任务\",\"pageType\":\"showInMenu\",\"sort\":\"1\"},{\"pageId\":\"ticketManagement\",\"pageName\":\"[审批]我收到的\",\"pageType\":\"showInMenu\",\"sort\":\"12\"},{\"pageId\":\"journalManagement\",\"pageName\":\"[日志]我收到的\",\"pageType\":\"showInMenu\",\"sort\":\"33\"},{\"pageId\":\"noticeManagement\",\"pageName\":\"通知\",\"pageType\":\"showInMenu\",\"sort\":\"40\"},{\"pageId\":\"taskTemplateManagement\",\"pageName\":\"[审批]审批模板\",\"pageType\":\"showInMenu\",\"sort\":\"50\"},{\"pageId\":\"workbench\",\"pageName\":\"工作台\",\"pageType\":\"showInMenu\",\"sort\":\"0\"},{\"pageId\":\"calendarManagement\",\"pageName\":\"日历\",\"pageType\":\"showInMenu\",\"sort\":\"0\"},{\"pageId\":\"ticketIndex\",\"pageName\":\"[审批]审批首页\",\"pageType\":\"\",\"sort\":\"10\"},{\"pageId\":\"ticketReport\",\"pageName\":\"[审批]审批报表\",\"pageType\":\"\",\"sort\":\"13\"},{\"pageId\":\"ticketStartApply\",\"pageName\":\"[审批]发起申请\",\"pageType\":\"showInMenu\",\"sort\":\"10\"},{\"pageId\":\"ticketSubmitManagement\",\"pageName\":\"[审批]我提交的\",\"pageType\":\"showInMenu\",\"sort\":\"13\"},{\"pageId\":\"afficheManagement\",\"pageName\":\"公告\",\"pageType\":\"showInMenu\",\"sort\":\"30\"},{\"pageId\":\"afficheViewer\",\"pageName\":\"公告预览\",\"pageType\":\"\",\"sort\":\"30\"},{\"pageId\":\"journalTemplateManagement\",\"pageName\":\"[日志]日志模板\",\"pageType\":\"showInMenu\",\"sort\":\"34\"},{\"pageId\":\"journalStartAdd\",\"pageName\":\"[日志]新建日志\",\"pageType\":\"showInMenu\",\"sort\":\"30\"},{\"pageId\":\"journalSubmitManagement\",\"pageName\":\"[日志]我发出的\",\"pageType\":\"showInMenu\",\"sort\":\"32\"}]','[\"taskManagement\",\"ticketManagement\",\"journalManagement\",\"noticeManagement\"]',NULL,'办公管理',NULL,'https://demo.jianghujs.org/task',NULL,'系统应用','update','admin','超级管理员','2024-03-15T17:10:32+08:00',NULL);

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_directory_user_session
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_directory_user_session`;
CREATE TABLE `enterprise_directory_user_session` (
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
) ENGINE = InnoDB AUTO_INCREMENT = 63 DEFAULT CHARSET = utf8mb4 COMMENT = '用户session表; deviceId 维度;软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_directory_user_session
# ------------------------------------------------------------

INSERT INTO `enterprise_directory_user_session` (`id`,`userId`,`userIp`,`userIpRegion`,`userAgent`,`deviceId`,`deviceType`,`socketStatus`,`authToken`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4,'admin','127.0.0.1','','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36','127.0.0.1:7007_Mac.10.15.7_304a4b92_chrome','web','offline','EI4zFZ7OSe763qJmEqX9uaO7nTGE5LxOww9R','jhInsert',NULL,NULL,'2023-07-04T21:59:40+08:00');
INSERT INTO `enterprise_directory_user_session` (`id`,`userId`,`userIp`,`userIpRegion`,`userAgent`,`deviceId`,`deviceType`,`socketStatus`,`authToken`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (5,'admin','127.0.0.1','','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36','127.0.0.1:7007_Mac.10.15.7_656400ec_chrome','web','offline','Gdomf8jtKtiu_vRoSAxo7BW-pPARiSXaUC_f','jhUpdate','admin','系统管理员','2023-09-23T22:15:06+08:00');
INSERT INTO `enterprise_directory_user_session` (`id`,`userId`,`userIp`,`userIpRegion`,`userAgent`,`deviceId`,`deviceType`,`socketStatus`,`authToken`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'admin','193.110.202.15',NULL,'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148','init.jianghujs.org_Iphone.Unknown_488b198e_safari','web','offline','5g8xMcAb2MjIkGsFlfrsRwHDLySqKgYfjJRw','jhInsert',NULL,NULL,'2023-10-06T21:26:23+08:00');
INSERT INTO `enterprise_directory_user_session` (`id`,`userId`,`userIp`,`userIpRegion`,`userAgent`,`deviceId`,`deviceType`,`socketStatus`,`authToken`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (7,'admin','127.0.0.1',NULL,'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36','127.0.0.1:7262_Mac.10.15.7_05139cce_chrome','web','offline','kXPVIxANefLdmi3GjIb4lsyUqSFDqvkrKOHi','jhInsert',NULL,NULL,'2023-10-09T22:42:14+08:00');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_group`;
CREATE TABLE `enterprise_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupId` varchar(511) CHARACTER SET utf8mb4 DEFAULT NULL,
  `groupLastId` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT 'groupId',
  `groupPath` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `groupName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '群组简称',
  `groupDeptName` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '群组全称',
  `groupAllName` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '路径全名',
  `principalId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '组织负责人',
  `headId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '部门主管',
  `leadId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '分管领导; 未启用',
  `groupDesc` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '群组描述',
  `operation` varchar(255) CHARACTER SET utf8mb4 DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 44 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_bin;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_group
# ------------------------------------------------------------

INSERT INTO `enterprise_group` (`id`,`groupId`,`groupLastId`,`groupPath`,`groupName`,`groupDeptName`,`groupAllName`,`principalId`,`headId`,`leadId`,`groupDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'超级管理员','超级管理员',NULL,'超级管理员','超级管理员','超级管理员',NULL,NULL,NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `enterprise_group` (`id`,`groupId`,`groupLastId`,`groupPath`,`groupName`,`groupDeptName`,`groupAllName`,`principalId`,`headId`,`leadId`,`groupDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (27,'总公司','总公司',NULL,'总公司','总公司','总公司',NULL,NULL,NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `enterprise_group` (`id`,`groupId`,`groupLastId`,`groupPath`,`groupName`,`groupDeptName`,`groupAllName`,`principalId`,`headId`,`leadId`,`groupDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (28,'总公司-ZB','ZB','总公司','集团总部','集团总部','总公司-集团总部',NULL,NULL,NULL,NULL,'insert','admin','超级管理员','2024-03-18T14:43:29+08:00');
INSERT INTO `enterprise_group` (`id`,`groupId`,`groupLastId`,`groupPath`,`groupName`,`groupDeptName`,`groupAllName`,`principalId`,`headId`,`leadId`,`groupDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (30,'总公司-K12','K12','总公司','K12教育','K12教育','总公司-K12教育',NULL,NULL,NULL,NULL,'jhUpdate','admin','超级管理员','2024-03-18T21:52:17+08:00');
INSERT INTO `enterprise_group` (`id`,`groupId`,`groupLastId`,`groupPath`,`groupName`,`groupDeptName`,`groupAllName`,`principalId`,`headId`,`leadId`,`groupDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (31,'总公司-YF','YF','总公司','研发生产公司','研发生产公司','总公司-研发生产公司',NULL,NULL,NULL,NULL,'insert','admin','超级管理员','2024-03-18T14:44:43+08:00');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_role`;
CREATE TABLE `enterprise_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleId` varchar(255) DEFAULT NULL COMMENT 'roleId',
  `roleName` varchar(255) DEFAULT NULL COMMENT 'role name',
  `roleType` varchar(255) DEFAULT NULL COMMENT '职务类型; 正式职务, 临时职务',
  `roleDesc` varchar(255) DEFAULT NULL COMMENT 'role desc',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uniq_roleId` (`roleId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 75 DEFAULT CHARSET = utf8mb4 COMMENT = '角色表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_role
# ------------------------------------------------------------

INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (62,'总公司-ZB-FD|财务总监','财务总监','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T18:50:30+08:00');
INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (63,'总公司-ZB-FD|会计','会计','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T18:50:52+08:00');
INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (64,'总公司-ZB-FD|出纳','出纳','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T18:50:58+08:00');
INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (65,'总公司-ZB-FD|财务经理','财务经理','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T18:51:06+08:00');
INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (66,'总公司-ZB-SYS|研发经理','研发经理','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T18:51:30+08:00');
INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (67,'总公司-ZB-SYS|研发','研发','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T18:51:50+08:00');
INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (68,'总公司-ZB-SYS|测试','测试','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T18:51:58+08:00');
INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (69,'总公司-ZB-SYS|产品经理','产品经理','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T18:52:08+08:00');
INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (70,'总公司-ZB-HR|人事经理','人事经理','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T18:52:25+08:00');
INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (73,'总公司-ZB-HR|人事招聘员','人事招聘员','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T20:38:27+08:00');
INSERT INTO `enterprise_role` (`id`,`roleId`,`roleName`,`roleType`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (74,'总公司-ZB-HR|人事资料员','人事资料员','正式角色',NULL,'insert','admin','超级管理员','2024-03-19T20:38:35+08:00');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_user`;
CREATE TABLE `enterprise_user` (
  `id` int(11) NOT NULL,
  `idSequence` varchar(255) DEFAULT NULL COMMENT '自增id; 用于生成userId',
  `userId` varchar(255) DEFAULT NULL COMMENT '主键id',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名(登陆)',
  `userStatus` varchar(255) DEFAULT NULL COMMENT '用户账号状态：活跃或关闭',
  `memberId` varchar(255) DEFAULT NULL COMMENT '主键id',
  `groupRoleList` text,
  `hrOrgRoleList` text,
  `qiweiId` varchar(255) DEFAULT NULL COMMENT '企微ID_mega\r',
  `phoneNumber` varchar(255) DEFAULT NULL COMMENT '电话',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `groupId` varchar(255) DEFAULT NULL COMMENT '群组Id',
  `roleId` varchar(255) DEFAULT NULL COMMENT '角色Id',
  `groupName` varchar(255) DEFAULT NULL COMMENT '群组简称',
  `groupAllName` varchar(255) DEFAULT NULL COMMENT '路径全名',
  `roleName` varchar(255) DEFAULT NULL COMMENT 'role name'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_user
# ------------------------------------------------------------

INSERT INTO `enterprise_user` (`id`,`idSequence`,`userId`,`username`,`userStatus`,`memberId`,`groupRoleList`,`hrOrgRoleList`,`qiweiId`,`phoneNumber`,`email`,`groupId`,`roleId`,`groupName`,`groupAllName`,`roleName`) VALUES (21,'','admin','超级管理员','active','admin',NULL,NULL,NULL,'','','超级管理员',NULL,'超级管理员','超级管理员',NULL);
INSERT INTO `enterprise_user` (`id`,`idSequence`,`userId`,`username`,`userStatus`,`memberId`,`groupRoleList`,`hrOrgRoleList`,`qiweiId`,`phoneNumber`,`email`,`groupId`,`roleId`,`groupName`,`groupAllName`,`roleName`) VALUES (22,'','admin01','超级管理员01','active','admin01',NULL,NULL,NULL,NULL,NULL,'超级管理员',NULL,'超级管理员','超级管理员',NULL);
INSERT INTO `enterprise_user` (`id`,`idSequence`,`userId`,`username`,`userStatus`,`memberId`,`groupRoleList`,`hrOrgRoleList`,`qiweiId`,`phoneNumber`,`email`,`groupId`,`roleId`,`groupName`,`groupAllName`,`roleName`) VALUES (23,'','admin02','超级管理员02','active','admin02',NULL,NULL,NULL,NULL,NULL,'超级管理员',NULL,'超级管理员','超级管理员',NULL);
INSERT INTO `enterprise_user` (`id`,`idSequence`,`userId`,`username`,`userStatus`,`memberId`,`groupRoleList`,`hrOrgRoleList`,`qiweiId`,`phoneNumber`,`email`,`groupId`,`roleId`,`groupName`,`groupAllName`,`roleName`) VALUES (24,'','admin03','超级管理员03','active','admin03',NULL,NULL,NULL,NULL,NULL,'超级管理员',NULL,'超级管理员','超级管理员',NULL);
INSERT INTO `enterprise_user` (`id`,`idSequence`,`userId`,`username`,`userStatus`,`memberId`,`groupRoleList`,`hrOrgRoleList`,`qiweiId`,`phoneNumber`,`email`,`groupId`,`roleId`,`groupName`,`groupAllName`,`roleName`) VALUES (231,NULL,'E41000X','成功','active','E41000X','总公司-集团总部-财务部|财务总监','财务部|财务总监',NULL,'13576609533',NULL,'总公司-ZB-FD','总公司-ZB-FD|财务总监','财务部','总公司-集团总部-财务部','财务总监');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_user_app
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_user_app`;
CREATE TABLE `enterprise_user_app` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `groupId` varchar(255) DEFAULT NULL COMMENT '组织ID\n',
  `roleId` varchar(255) DEFAULT NULL COMMENT '角色ID',
  `userId` varchar(255) DEFAULT NULL COMMENT '用户id',
  `appId` varchar(255) DEFAULT NULL COMMENT 'appId',
  `source` varchar(255) DEFAULT NULL COMMENT '数据来源; 手动录入, 通用权限',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 834 DEFAULT CHARSET = utf8mb4;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_user_app
# ------------------------------------------------------------

INSERT INTO `enterprise_user_app` (`id`,`groupId`,`roleId`,`userId`,`appId`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (171,NULL,NULL,'W10002','hr',NULL,'jhInsert',NULL,NULL,'2023-12-16T15:06:21+08:00');
INSERT INTO `enterprise_user_app` (`id`,`groupId`,`roleId`,`userId`,`appId`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (332,NULL,NULL,'admin','system',NULL,'jhInsert',NULL,NULL,'2023-12-17T14:42:44+08:00');
INSERT INTO `enterprise_user_app` (`id`,`groupId`,`roleId`,`userId`,`appId`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (333,NULL,NULL,'admin','data-repository',NULL,'jhInsert',NULL,NULL,'2023-12-17T14:42:44+08:00');
INSERT INTO `enterprise_user_app` (`id`,`groupId`,`roleId`,`userId`,`appId`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (364,NULL,NULL,'admin','jianghu-erp',NULL,'jhInsert',NULL,NULL,'2023-12-17T14:42:44+08:00');
INSERT INTO `enterprise_user_app` (`id`,`groupId`,`roleId`,`userId`,`appId`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (366,NULL,NULL,'admin','feige',NULL,'jhInsert',NULL,NULL,'2023-12-17T14:42:44+08:00');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_user_group_role
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_user_group_role`;
CREATE TABLE `enterprise_user_group_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` varchar(255) NOT NULL COMMENT '用户id',
  `groupId` varchar(255) NOT NULL COMMENT '群组Id',
  `roleId` varchar(255) DEFAULT NULL COMMENT '角色Id',
  `roleDeadline` varchar(255) DEFAULT NULL COMMENT '权限期限日期',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `groupId_index` (`groupId`) USING BTREE,
  KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 710 DEFAULT CHARSET = utf8mb4 COMMENT = '用户群组角色关联表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_user_group_role
# ------------------------------------------------------------

INSERT INTO `enterprise_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`roleDeadline`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (654,'admin03','超级管理员',NULL,'-1','insert','admin','超级管理员','2024-03-15T11:40:05+08:00');
INSERT INTO `enterprise_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`roleDeadline`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (656,'admin','超级管理员',NULL,'-1','insert','admin','超级管理员','2024-03-15T11:40:14+08:00');
INSERT INTO `enterprise_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`roleDeadline`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (658,'admin01','超级管理员',NULL,'-1','insert','admin','超级管理员','2024-03-15T11:40:22+08:00');
INSERT INTO `enterprise_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`roleDeadline`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (660,'admin02','超级管理员',NULL,'-1','insert','admin','超级管理员','2024-03-15T11:40:53+08:00');
INSERT INTO `enterprise_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`roleDeadline`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (691,'E41000X','总公司-ZB-FD','总公司-ZB-FD|财务总监','-1','insert','admin','超级管理员','2024-03-19T18:53:12+08:00');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_user_group_role_page
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_user_group_role_page`;
CREATE TABLE `enterprise_user_group_role_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appId` varchar(255) DEFAULT NULL,
  `user` text COMMENT 'userId 或者 通配符; 通配符: *',
  `group` varchar(255) DEFAULT NULL COMMENT 'groupId 或者 通配符; 通配符: *',
  `role` varchar(255) DEFAULT NULL COMMENT 'roleId 或者 通配符; 通配符: *',
  `page` longtext COMMENT 'pageId id',
  `allowOrDeny` varchar(255) DEFAULT NULL COMMENT '用户群组角色 匹配后 执行动作; allow、deny',
  `desc` varchar(255) DEFAULT NULL COMMENT '映射描述',
  `source` varchar(255) DEFAULT NULL COMMENT '数据来源; 手动录入, 通用权限',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 340 DEFAULT CHARSET = utf8mb4 COMMENT = '用户群组角色 - 页面 映射表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_user_group_role_page
# ------------------------------------------------------------

INSERT INTO `enterprise_user_group_role_page` (`id`,`appId`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'*','*','public','*','login','allow','登陆页面; 开放所有用户;',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `enterprise_user_group_role_page` (`id`,`appId`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'*','*','login','*','help,manual','allow','工具页; 开放给登陆用户;',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `enterprise_user_group_role_page` (`id`,`appId`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (64,'*','*','超级管理员','*','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2023-12-17T14:42:44+08:00');
INSERT INTO `enterprise_user_group_role_page` (`id`,`appId`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (308,'directory','*','login','*','directory,changePassword','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-15T09:10:03+08:00');
INSERT INTO `enterprise_user_group_role_page` (`id`,`appId`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (309,'task','*','login','*','*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-15T09:10:03+08:00');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_user_group_role_resource
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_user_group_role_resource`;
CREATE TABLE `enterprise_user_group_role_resource` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appId` varchar(255) DEFAULT NULL,
  `user` text COMMENT 'userId 或者 通配符; 通配符: *',
  `group` varchar(255) DEFAULT NULL COMMENT 'groupId 或者 通配符; 通配符: *',
  `role` varchar(255) DEFAULT NULL COMMENT 'roleId 或者 通配符; 通配符: *',
  `resource` mediumtext COMMENT 'resourceId 或者 通配符; 通配符: *, !resourceId',
  `allowOrDeny` varchar(255) DEFAULT NULL COMMENT '用户群组角色 匹配后 执行动作; allow、deny',
  `desc` varchar(255) DEFAULT NULL COMMENT '映射描述',
  `source` varchar(255) DEFAULT NULL COMMENT '数据来源; 手动录入, 通用权限',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 237 DEFAULT CHARSET = utf8mb4 COMMENT = '用户群组角色 - 请求资源 映射表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_user_group_role_resource
# ------------------------------------------------------------

INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'*','*','public','*','login.passwordLogin','allow','登陆resource, 开放给所有用户',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'*','*','login','*','allPage.*','allow','工具类resource, 开放给所有登陆成功的用户',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (64,'*','*','超级管理员','*','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2023-12-17T14:42:44+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (205,'task','*','login','*','*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-15T09:27:42+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (206,'directory','*','login','*','directory.*,changePassword.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-15T09:30:05+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (207,'jh-finance','*','总公司-ZB-FD','*','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-18T20:46:10+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (208,'jh-finance','*','总公司-ZB-FD','总公司-ZB-FD|会计角色','checkout-periodCheckout.*,account-chronological.*,account-subjectDetail.*,account-subjectBalance.*,account-auxiliaryBalanceSheet.*,account-multicolumnLedger.*,account-subjectSummary.*,account-auxiliaryDetailedLedger.*,account-generalLedger.*,voucher-voucherManagement.*,appAccountManagement.*,setting-assistManagement.*,setting-subjectManagement.*,setting-voucherTemplateManagement.*,setting-currencyManagement.*,setting-subjectBalanceStart.*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-18T20:47:25+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (210,'jh-finance','*','总公司-ZB-FD','总公司-ZB-FD|出纳角色','voucher-voucherManagement.*,invoice-invoiceManagement.*,fundAccountTransferEntryManagement.*,fundStatementManagement.*,fundAccountManagement.*,fundAccountEntryManagement.*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-18T20:48:19+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (211,'jianghu-hr','*','总公司-ZB-HR','*','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-18T20:48:37+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (212,'jianghu-hr','*','总公司-ZB-HR','总公司-ZB-HR|招聘角色','jobResumePreview.*,detail.*,form.*,jobResumeOfJobPosition.*,jobs.*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-18T20:49:00+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (213,'jianghu-hr','*','总公司-ZB-HR','总公司-ZB-HR|资料员角色','memberOrgRoleManagement.*,employeeManagement.*,insuranceSchemeDetail.*,insuranceSchemeManagement.*,workbench.*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-18T20:49:52+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (214,'system','*','总公司-ZB-SYS','*','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-18T20:50:15+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (215,'data-repository','*','总公司-ZB-SYS','*','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-18T20:50:15+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (216,'directory','*','总公司-ZB-SYS','*','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-18T20:50:15+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (217,'task','*','总公司-ZB-SYS','*','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-18T20:50:15+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (218,'jh-finance','*','总公司-ZB-FD','总公司-ZB-FD|会计','setting-voucherTemplateManagement.*,setting-currencyManagement.*,setting-subjectManagement.*,setting-assistManagement.*,voucher-voucherManagement.*,setting-subjectBalanceStart.*,checkout-periodCheckout.*,invoice-invoiceManagement.*,fundAccountTransferEntryManagement.*,fundStatementManagement.*,fundAccountEntryManagement.*,fundAccountManagement.*,fundLedgerManagement.*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-19T20:43:10+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (219,'jh-finance','*','总公司-ZB-FD','总公司-ZB-FD|出纳','invoice-invoiceManagement.*,fundAccountTransferEntryManagement.*,fundStatementManagement.*,salary-salaryManagement.*,fundAccountEntryManagement.*,fundAccountManagement.*,fundLedgerManagement.*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-19T20:43:33+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (220,'jh-finance','*','总公司-ZB-FD','总公司-ZB-FD|财务经理','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-19T20:43:40+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (221,'data-repository','*','总公司-ZB-SYS','总公司-ZB-SYS|研发','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-19T20:44:02+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (222,'directory','*','总公司-ZB-SYS','总公司-ZB-SYS|研发','*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-19T20:44:02+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (225,'jianghu-hr','*','总公司-ZB-HR','总公司-ZB-HR|人事资料员','employeeManagement.*,memberOrgRoleManagement.*,workbench.*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-19T20:45:33+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (226,'jianghu-hr','*','总公司-ZB-HR','总公司-ZB-HR|人事招聘员','jobResumePreview.*,jobPostingsManagement.*,jobResumeManagement.*,jobs.*,detail.*,form.*,jobResumeOfJobPosition.*,workbench.*','allow',NULL,NULL,'jhInsert',NULL,NULL,'2024-03-19T20:45:43+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (227,'student_admin','*','login','*','enrollment.*,workflowPrintPreview.*,logisticsAssignment.*,updatePaymentStatus.*,classManagement.*,studentManagementOfOneClass.*,classManagementOfOneStudent.*,enrollmentApproved.*,approvalAcknowledgementPrintPreview.*,studentUpgrade.*,quitApproved.*,studentManagement.*,quitRequest.*,changeLevelRequest.*,approvalChangeLevel.*,quitAssignment.*,quitPayment.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-20T12:00:00+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (228,'mentor','*','login','*','studentList.*,studentNewStructureList.*,studentContactList.*,studentEducationBackgroundList.*,studentFinancialAidList.*,studentGuardianList.*,studentHometownList.*,studentLogisticsList.*,studentCommentList.*,appraisalStudentManagementOfOneAppraisal.*,appraisalView.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-20T12:00:00+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (229,'recruitment','*','login','*','followUpStudent.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-20T12:00:00+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (230,'recruitment','*','public','*','studentRecruitment.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-20T12:00:00+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (231,'notice','*','public','*','bindStudent.*,messageList.*,otherBrowser.*,noticeTemplate/*.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-20T12:00:00+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (232,'calendar','*','public','*','calendarEventView.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-20T12:00:00+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (233,'work_order','*','login','*','workflowEditor.*,createTask.*,todo.*,taskHistory.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-20T12:00:00+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (234,'hostel','*','login','*','studentHostelManagement.*,studentBedAllocation.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-20T12:00:00+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (235,'restaurant','*','public','*','restaurantManagement.*,oneBatchStudentAllocation.*,twoBatchStudentAllocation.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-20T12:00:00+08:00');
INSERT INTO `enterprise_user_group_role_resource` (`id`,`appId`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`source`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (236,'public_hygiene','*','login','*','areaView.*,areaMonth.*,classMonth.*','allow',NULL,'通用权限','insert',NULL,NULL,'2024-03-20T12:00:00+08:00');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_view01_user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_view01_user`;
CREATE TABLE `enterprise_view01_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` varchar(255) DEFAULT NULL COMMENT '自增id; 用于生成userId',
  `userId` varchar(255) DEFAULT NULL COMMENT '主键id',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名(登陆)',
  `phoneNumber` varchar(255) DEFAULT NULL COMMENT '电话',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `userStatus` varchar(255) DEFAULT 'active' COMMENT '用户账号状态：活跃或关闭',
  `hrOrgRoleList` varchar(255) DEFAULT NULL COMMENT '职位',
  `qiweiId` varchar(255) DEFAULT NULL COMMENT '企微ID_mega\r\n',
  `wechatId` varchar(255) DEFAULT NULL COMMENT '微信ID',
  `userConfig` text COMMENT '配置信息',
  `password` varchar(255) DEFAULT NULL COMMENT '密码',
  `md5Salt` varchar(255) DEFAULT NULL COMMENT 'md5Salt',
  `clearTextPassword` varchar(255) DEFAULT NULL COMMENT '明文密码',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 274 DEFAULT CHARSET = utf8mb4 COMMENT = '用户表';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_view01_user
# ------------------------------------------------------------

INSERT INTO `enterprise_view01_user` (`id`,`idSequence`,`userId`,`username`,`phoneNumber`,`email`,`userStatus`,`hrOrgRoleList`,`qiweiId`,`wechatId`,`userConfig`,`password`,`md5Salt`,`clearTextPassword`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (21,'','admin','超级管理员','','','active',NULL,NULL,NULL,NULL,'38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','123456','update','admin','超级管理员','2024-03-19T16:15:21+08:00');
INSERT INTO `enterprise_view01_user` (`id`,`idSequence`,`userId`,`username`,`phoneNumber`,`email`,`userStatus`,`hrOrgRoleList`,`qiweiId`,`wechatId`,`userConfig`,`password`,`md5Salt`,`clearTextPassword`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (22,'','admin01','超级管理员01',NULL,NULL,'active',NULL,NULL,NULL,NULL,'38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','123456','update',NULL,NULL,'2022-02-19T15:02:24+08:00');
INSERT INTO `enterprise_view01_user` (`id`,`idSequence`,`userId`,`username`,`phoneNumber`,`email`,`userStatus`,`hrOrgRoleList`,`qiweiId`,`wechatId`,`userConfig`,`password`,`md5Salt`,`clearTextPassword`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (23,'','admin02','超级管理员02',NULL,NULL,'active',NULL,NULL,NULL,NULL,'38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','123456','update',NULL,NULL,'2022-02-19T15:02:24+08:00');
INSERT INTO `enterprise_view01_user` (`id`,`idSequence`,`userId`,`username`,`phoneNumber`,`email`,`userStatus`,`hrOrgRoleList`,`qiweiId`,`wechatId`,`userConfig`,`password`,`md5Salt`,`clearTextPassword`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (24,'','admin03','超级管理员03',NULL,NULL,'active',NULL,NULL,NULL,NULL,'38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','123456','update',NULL,NULL,'2022-02-19T15:02:24+08:00');
INSERT INTO `enterprise_view01_user` (`id`,`idSequence`,`userId`,`username`,`phoneNumber`,`email`,`userStatus`,`hrOrgRoleList`,`qiweiId`,`wechatId`,`userConfig`,`password`,`md5Salt`,`clearTextPassword`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (231,NULL,'E41000X','成功','13576609533',NULL,'active',NULL,NULL,NULL,NULL,'b567ec69ff554f1509cc7dda831034c5','JSFwK8JjrMGE','ZA6nSj','jhInsert','admin','超级管理员','2024-03-18T20:41:02+08:00');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_view02_user_app
# ------------------------------------------------------------

DROP TABLE IF EXISTS `enterprise_view02_user_app`;
CREATE TABLE `enterprise_view02_user_app` (
  `id` int(11) NOT NULL,
  `userId` varchar(255) DEFAULT NULL COMMENT '用户id',
  `appId` varchar(255) DEFAULT NULL COMMENT 'appId'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: enterprise_view02_user_app
# ------------------------------------------------------------

INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (834,'admin','directory');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (835,'admin01','directory');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (836,'admin02','directory');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (837,'admin03','directory');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (850,'admin','task');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (851,'admin01','task');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (852,'admin02','task');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (853,'admin03','task');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (866,'admin','system');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (867,'admin01','system');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (868,'admin02','system');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (869,'admin03','system');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (870,'admin','data-repository');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (871,'admin01','data-repository');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (872,'admin02','data-repository');
INSERT INTO `enterprise_view02_user_app` (`id`,`userId`,`appId`) VALUES (873,'admin03','data-repository');

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: jianghu_hr__employee
# ------------------------------------------------------------

DROP TABLE IF EXISTS `jianghu_hr__employee`;
CREATE TABLE `jianghu_hr__employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employeeId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '员工id',
  `employeeName` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '员工姓名',
  `idSequence` int(11) DEFAULT NULL COMMENT '员工序号',
  `sex` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '员工性别',
  `age` int(11) DEFAULT NULL COMMENT '员工年龄',
  `contactNumber` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '联系电话',
  `emergencyContactNumber` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '紧急联系电话',
  `post` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '岗位1',
  `post2` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '岗位2',
  `post3` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '岗位3',
  `politicalBackground` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '政治面貌',
  `icNumber` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '身份证号码',
  `dateOfBirth` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '出生日期',
  `institution` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '毕业学校',
  `major` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '专业',
  `highestEducation` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '学历层次',
  `teacherQualification` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '教师资格证类别',
  `teacherQualificationLeaver` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '教师资格证学段',
  `teacherQualificationSubject` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '教师资格证学科',
  `teacherCertificationNumber` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '教师资格证编号',
  `teachingLevel` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '任教学段',
  `teachingSubject` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '任教学科',
  `residentialAddress` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '家庭地址',
  `province` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '省',
  `city` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '市',
  `county` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '县',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `dateOfEntry` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '入职',
  `dateOfContractExpiration` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '到期',
  `leaveRequestStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '申请离职状态',
  `cardNumber` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '建设银行卡卡号',
  `licensePlateNumber` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '车牌号',
  `employmentForms` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '聘用形式',
  `probationPeriod` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '试用期',
  `entryStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '在职状态',
  `status` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '员工状态',
  `remarks` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '备注',
  `contactPerson` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '联系人',
  `educationExperience` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '教育经历',
  `certificate` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '证书',
  `salaryCard` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '薪资卡信息',
  `socialSecurity` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '社保卡信息',
  `trainingExperience` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '培训经历',
  `workExperience` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工作经历',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 646 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_bin;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: jianghu_hr__employee
# ------------------------------------------------------------

INSERT INTO `jianghu_hr__employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`probationPeriod`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (1,'E41000X','成功',41000,'男',64,'13576609533','13576609533',NULL,NULL,NULL,NULL,'362430195908070014','1959-08-07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'北安省辛集市繁华县','\r',NULL,NULL,'2023-03-02T10:45:13+08:00','\r',NULL,NULL,NULL,NULL,'正式',NULL,'在职','全职',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','admin','系统管理员');
INSERT INTO `jianghu_hr__employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`probationPeriod`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (2,'E41001Q','冯正',41001,'女',39,'18616333333','18616333333',NULL,NULL,NULL,NULL,'36243019840727002X\r','1984-07-27','复旦大学','哲学','博士',NULL,NULL,NULL,NULL,NULL,NULL,'北安省辛集市繁华县','\r',NULL,NULL,'2023-03-02T10:18:49+08:00','\r',NULL,NULL,NULL,NULL,'正式',NULL,'在职','全职',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','admin','系统管理员');
INSERT INTO `jianghu_hr__employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`probationPeriod`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (3,'E41002S','龙志平',41002,'男',61,'13879661218','13879661218',NULL,NULL,NULL,NULL,'362430196205240018\r','1962-05-24',NULL,NULL,'本科',NULL,NULL,NULL,NULL,NULL,NULL,'北安省辛集市繁华县','北安省\r','辛集市','繁华县','2023-03-02T10:25:26+08:00','2021-09',NULL,NULL,NULL,NULL,'正式',NULL,'在职','全职',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','admin','系统管理员');
INSERT INTO `jianghu_hr__employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`probationPeriod`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (4,'H00002','张娜',1,'女',NULL,'13634567890',NULL,NULL,NULL,NULL,NULL,'110108197703151234',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-10-06T21:19:24+08:00',NULL,NULL,'已批准',NULL,NULL,NULL,NULL,'在职',NULL,'家庭原因【admin系统管理员】2023-03-17T14:08:17+08:00\n',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','admin','系统管理员');
INSERT INTO `jianghu_hr__employee` (`id`,`employeeId`,`employeeName`,`idSequence`,`sex`,`age`,`contactNumber`,`emergencyContactNumber`,`post`,`post2`,`post3`,`politicalBackground`,`icNumber`,`dateOfBirth`,`institution`,`major`,`highestEducation`,`teacherQualification`,`teacherQualificationLeaver`,`teacherQualificationSubject`,`teacherCertificationNumber`,`teachingLevel`,`teachingSubject`,`residentialAddress`,`province`,`city`,`county`,`operationAt`,`dateOfEntry`,`dateOfContractExpiration`,`leaveRequestStatus`,`cardNumber`,`licensePlateNumber`,`employmentForms`,`probationPeriod`,`entryStatus`,`status`,`remarks`,`contactPerson`,`educationExperience`,`certificate`,`salaryCard`,`socialSecurity`,`trainingExperience`,`workExperience`,`operation`,`operationByUserId`,`operationByUser`) VALUES (5,'H00001','李四',2,'男',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-05-18T10:56:56+08:00',NULL,NULL,'审核中',NULL,NULL,NULL,NULL,'已离职',NULL,'离职【G00001洪七公】2023-05-18T10:56:56+08:00\n不错【admin系统管理员】2023-03-17T09:34:12+08:00不错【admin系统管理员】Fri Mar 17 2023 09:32:34 GMT+0800 (中国标准时间)表现良好【admin系统管理员】Fri Mar 17 2023 09:32:25 GMT+0800 (中国标准时间)',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'jhUpdate','G00001','洪七公');
