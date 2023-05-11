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
) ENGINE = InnoDB AUTO_INCREMENT = 57 COMMENT = '常量表; 软删除未启用;';



INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'version','object','版本','{ \"version\": \"1.0.5\", \"title\": \"1.0.5版本发布\", \"note\": \"新版本特性\"  }','insert',NULL,NULL,NULL);
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'gender','select','性别','[{\"value\": \"male\", \"text\": \"男\"}, {\"value\": \"female\", \"text\": \"女\"}]','insert',NULL,NULL,NULL);
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (14,'classId','select','班号','[{\"value\": \"2021-01级-01班\", \"text\": \"2021-01级-01班\"}, {\"value\": \"2021-01级-02班\", \"text\": \"2021-01级-02班\"},\n {\"value\": \"2021-02级-01班\", \"text\": \"2021-02级-01班\"}, {\"value\": \"2021-02级-02班\", \"text\": \"2021-02级-02班\"},\n {\"value\": \"2021-03级-01班\", \"text\": \"2021-03级-01班\"}, {\"value\": \"2021-03级-02班\", \"text\": \"2021-03级-02班\"}]','insert',NULL,NULL,NULL);
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (15,'level','select','年级','[{\"value\": \"01\", \"text\": \"一年级\"}, {\"value\": \"02\", \"text\": \"二年级\"}, {\"value\": \"03\", \"text\": \"三年级\"}]','insert',NULL,NULL,NULL);
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (52,'icType','select','证件类型','[{\"value\": \"身份证\", \"text\": \"身份证\"}, {\"value\": \"护照\", \"text\": \"护照\"}]','insert',NULL,NULL,NULL);
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (53,'enrollmentType','select','入学方式','[{\"value\": \"正常升学\", \"text\": \"正常升学\"}, {\"value\": \"借读\", \"text\": \"借读\"}]','insert',NULL,NULL,NULL);
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (54,'studentStatus','select','学生状态','[{\"value\": \"正常\", \"text\": \"正常\"}, {\"value\": \"退学\", \"text\": \"退学\"}]','insert',NULL,NULL,NULL);
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (55,'classStatus','select','班级状态','[{\"value\": \"正常\", \"text\": \"正常\"}, {\"value\": \"毕业班\", \"text\": \"毕业班\"}]','insert',NULL,NULL,NULL);
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (56,'classType','select','班级类型','[{\"value\": \"特长班\", \"text\": \"特长班\"}, {\"value\": \"义务班\", \"text\": \"义务班\"}]','insert',NULL,NULL,NULL);


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
) ENGINE = InnoDB AUTO_INCREMENT = 2 COMMENT = '群组表; 软删除未启用;';



INSERT INTO `_group` (`id`,`groupId`,`groupName`,`groupDesc`,`groupAvatar`,`groupExtend`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'adminGroup','管理员组','管理员',NULL,'{}','jhInsert','admin','管理员','2023-01-31T23:45:21+08:00');


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
  `passcode` varchar(255) DEFAULT NULL COMMENT '页面二次认证; passcode ',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  `pageHook` text,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 43 COMMENT = '页面表; 软删除未启用;';



INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'help','帮助','helpV4','common',NULL,NULL,'jhUpdate','admin','adminName','2022-05-02T15:08:43+08:00');
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'login','登陆','loginV4','common',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4,'resourcePageManagement','页面、接口',NULL,'showInMenu','2',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (5,'userManagement','用户管理',NULL,'showInMenu','6',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'userGroupRolePageOrResourceManagement','权限规则管理',NULL,'showInMenu','4',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (7,'userGroupRoleManagement','用户、组织、角色',NULL,'showInMenu','3',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (8,'recordHistoryManagement','数据历史',NULL,'showInMenu','1',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (9,'resetUserPassword','修改密码',NULL,'showInMenu','7',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (10,'studentManagement','1page_2table_示例1',NULL,'showInMenu','8',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (39,'studentcontactManagement','studentcontactManagement页面',NULL,'dynamicInMenu','5',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (40,'studentTaskManagement','1page_2table_示例2',NULL,'dynamicInMenu','9',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (41,'pagePasscodeDemo','二次认证',NULL,'showInMenu','5','123456','insert','',NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`sort`,`passcode`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (42,'pageLog','页面访问日志',NULL,'showInMenu','10',NULL,'insert',NULL,NULL,NULL);


# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _record_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_record_history`;
CREATE TABLE `_record_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(255) DEFAULT NULL COMMENT '表',
  `recordId` int(11) DEFAULT NULL COMMENT '数据在table中的主键id; recordContent.id',
  `recordContent` text NOT NULL COMMENT '数据JSON',
  `packageContent` text NOT NULL COMMENT '当时请求的 package JSON',
  `operation` varchar(255) DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `index_record_id` (`recordId`),
  KEY `index_table_action` (`table`, `operation`)
) ENGINE = InnoDB AUTO_INCREMENT = 134 COMMENT = '数据历史表';



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
) ENGINE = InnoDB AUTO_INCREMENT = 518 COMMENT = '请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';



INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (101,NULL,NULL,'allPage','getChunkInfo','✅ 文件分片下载-获取分片信息','service','{}','{\"service\": \"file\", \"serviceFunction\": \"getChunkInfo\"}','','','jhUpdate','admin','adminName','2022-05-03T12:46:39+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (102,NULL,NULL,'allPage','uploadFileDone','✅ 文件分片上传-所有分片上传完毕','service','{}','{\"service\": \"file\", \"serviceFunction\": \"uploadFileDone\"}','','','update',NULL,NULL,'2022-08-26T21:59:32+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (105,NULL,NULL,'allPage','httpUploadByStream','✅ 文件分片上传-http文件流','service','{}','{\"service\": \"file\", \"serviceFunction\": \"uploadFileChunkByStream\"}','','','update',NULL,NULL,'2022-08-26T21:59:30+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (106,NULL,NULL,'allPage','httpUploadByBase64','✅ 文件分片上传-http base64','service','{}','{\"service\": \"file\", \"serviceFunction\": \"uploadFileChunkByBase64\"}','','','update',NULL,NULL,'2022-04-28T14:43:10+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (112,NULL,NULL,'allPage','httpDownloadByBase64','✅ 文件分片下载-http base64','service','{}','{\"service\": \"file\", \"serviceFunction\": \"downloadFileChunkByBase64\"}','','','update',NULL,NULL,'2022-04-30T14:52:38+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (231,NULL,NULL,'login','passwordLogin','✅登陆','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"passwordLogin\"}','{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7003_Mac.10.15.7_73e61fc2_chrome\"},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\"},\"packageId\":\"1676531704620_6508525\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676531704620_6508525\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:15:06+08:00\",\"appData\":{\"resultData\":{\"authToken\":\"pyzRnWk2RfaRjQx6MdAsOA_wk6xCnvBZAi1g\",\"deviceId\":\"127.0.0.1:7003_Mac.10.15.7_73e61fc2_chrome\",\"userId\":\"admin\"},\"appId\":\"{{name}}\",\"pageId\":\"login\",\"actionId\":\"passwordLogin\"}}','update',NULL,NULL,'2023-02-16T15:15:06+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (251,NULL,NULL,'allPage','logout','✅登出','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"logout\"}','','','update',NULL,NULL,'2022-08-26T18:06:33+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (252,NULL,NULL,'allPage','refreshToken','✅刷新authToken','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"refreshToken\"}','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (253,NULL,NULL,'allPage','userInfo','✅获取用户信息','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"userInfo\"}','{\"appData\":{\"pageId\":\"allPage\",\"actionId\":\"userInfo\",\"actionData\":{},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1674915445781_6083083\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1674915445781_6083083\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-28T22:17:27+08:00\"}','update',NULL,NULL,'2023-01-28T22:17:27+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (254,NULL,NULL,'resetUserPassword','resetPassword','✅重置密码','service',NULL,'{\"service\": \"user\", \"serviceFunction\": \"resetPassword\"}','','','update',NULL,NULL,'2022-04-25T15:31:12+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (256,NULL,NULL,'allPage','uploadByStream','✅文件上传(文件流)','service',NULL,'{\"service\": \"file\", \"serviceFunction\": \"uploadFileChunkByStream\"}','','','update',NULL,NULL,'2022-02-22T19:36:33+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (257,NULL,NULL,'allPage','uploadByBase64','✅文件上传(base64)','service',NULL,'{\"service\": \"file\", \"serviceFunction\": \"uploadFileChunkByBase64\"}','','','update',NULL,NULL,'2022-02-22T18:59:14+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (280,NULL,NULL,'resourcePageManagement','selectItemListOfResource','✅resource管理-查询成员','sql',NULL,'{\"table\": \"_resource\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"resourcePageManagement\",\"actionId\":\"selectItemListOfResource\",\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1676533468116_4970394\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533468116_4970394\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:44:29+08:00\"}','update',NULL,NULL,'2023-02-16T15:44:29+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (281,NULL,NULL,'resourcePageManagement','insertItemOfResource','✅resource管理-新增成员','sql',NULL,'{\"table\": \"_resource\", \"operation\": \"jhInsert\"}','','','update',NULL,NULL,'2022-08-24T14:02:22+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (282,NULL,NULL,'resourcePageManagement','deleteItemOfResource','✅resource管理-删除成员','sql',NULL,'{\"table\": \"_resource\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-08-24T14:02:55+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (283,NULL,NULL,'resourcePageManagement','updateItemOfResource','✅resource管理-更新成员','sql',NULL,'{\"table\": \"_resource\", \"operation\": \"jhUpdate\"}','','','update',NULL,NULL,'2022-08-24T14:02:47+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (322,NULL,NULL,'resourcePageManagement','selectItemListOfPage','✅page管理-查询成员','sql',NULL,'{\"table\": \"_page\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"resourcePageManagement\",\"actionId\":\"selectItemListOfPage\",\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1676532834118_2898073\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676532834118_2898073\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:33:55+08:00\"}','update',NULL,NULL,'2023-02-16T15:33:55+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (323,NULL,NULL,'resourcePageManagement','insertItemOfPage','✅page管理-新增成员','sql',NULL,'{\"table\": \"_page\", \"operation\": \"jhInsert\"}','','','update',NULL,NULL,'2022-02-18T21:03:15+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (324,NULL,NULL,'resourcePageManagement','deleteItemOfPage','✅page管理-删除成员','sql',NULL,'{\"table\": \"_page\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-04-28T20:04:40+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (325,NULL,NULL,'resourcePageManagement','updateItemOfPage','✅page管理-更新成员','sql',NULL,'{\"table\": \"_page\", \"operation\": \"jhUpdate\"}','','','update',NULL,NULL,'2022-09-17T21:21:22+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (335,NULL,NULL,'userGroupRolePageOrResourceManagement','insertItemOfResource','✅权限规则-协议管理-插入信息','sql',NULL,'{\"table\": \"_user_group_role_resource\", \"operation\": \"jhInsert\"}','','','update',NULL,NULL,'2022-10-18T16:23:35+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (336,NULL,NULL,'userGroupRolePageOrResourceManagement','selectItemListOfResource','✅权限规则-协议管理-查询数据列表','sql',NULL,'{\"table\": \"_user_group_role_resource\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"userGroupRolePageOrResourceManagement\",\"actionId\":\"selectItemListOfResource\",\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1676533573081_6860126\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533573081_6860126\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:46:14+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":2,\"user\":\"*\",\"group\":\"login\",\"role\":\"*\",\"resource\":\"allPage.*\",\"allowOrDeny\":\"allow\",\"desc\":\"工具类resource, 开放给所有登陆成功的用户\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":3,\"user\":\"*\",\"group\":\"login\",\"role\":\"*\",\"resource\":\"*\",\"allowOrDeny\":\"allow\",\"desc\":\"所有resource, 开放给所有登陆成功的用户\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":4,\"user\":\"*\",\"group\":\"public\",\"role\":\"*\",\"resource\":\"login.passwordLogin\",\"allowOrDeny\":\"allow\",\"desc\":\"登陆resource, 开放给所有用户\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null}]},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRolePageOrResourceManagement\",\"actionId\":\"selectItemListOfResource\"}}','update',NULL,NULL,'2023-02-16T15:46:14+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (337,NULL,NULL,'userGroupRolePageOrResourceManagement','updateItemOfResource','✅权限规则-协议管理-更新数据','sql',NULL,'{\"table\": \"_user_group_role_resource\", \"operation\": \"jhUpdate\"}','','','update',NULL,NULL,'2022-10-18T21:14:25+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (338,NULL,NULL,'userGroupRolePageOrResourceManagement','deleteItemOfResource','✅权限规则-协议管理-删除数据','sql',NULL,'{\"table\": \"_user_group_role_resource\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-08-24T15:53:40+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (339,NULL,NULL,'userGroupRolePageOrResourceManagement','insertItemOfPage','✅权限规则-页面管理-插入信息','sql',NULL,'{\"table\": \"_user_group_role_page\", \"operation\": \"jhInsert\"}','','','update',NULL,NULL,'2022-02-18T20:42:26+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (340,NULL,NULL,'userGroupRolePageOrResourceManagement','selectItemListOfPage','✅权限规则-页面管理-查询数据列表','sql',NULL,'{\"table\": \"_user_group_role_page\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"userGroupRolePageOrResourceManagement\",\"actionId\":\"selectItemListOfPage\",\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148\",\"actionData\":{}},\"packageId\":\"1676533553089_3842368\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533553089_3842368\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:45:54+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":1,\"user\":\"*\",\"group\":\"public\",\"role\":\"*\",\"page\":\"login\",\"allowOrDeny\":\"allow\",\"desc\":\"登陆页面; 开放所有用户;\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":2,\"user\":\"*\",\"group\":\"login\",\"role\":\"*\",\"page\":\"help,manual\",\"allowOrDeny\":\"allow\",\"desc\":\"工具页; 开放给登陆用户;\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":3,\"user\":\"*\",\"group\":\"login\",\"role\":\"*\",\"page\":\"*\",\"allowOrDeny\":\"allow\",\"desc\":\"所有页面; 开放给登陆用户;\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null}]},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRolePageOrResourceManagement\",\"actionId\":\"selectItemListOfPage\"}}','update',NULL,NULL,'2023-02-16T15:45:54+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (341,NULL,NULL,'userGroupRolePageOrResourceManagement','updateItemOfPage','✅权限规则-页面管理-更新数据','sql',NULL,'{\"table\": \"_user_group_role_page\", \"operation\": \"jhUpdate\"}','','','update',NULL,NULL,'2022-02-18T20:42:44+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (342,NULL,NULL,'userGroupRolePageOrResourceManagement','deleteItemOfPage','✅权限规则-页面管理-删除数据','sql',NULL,'{\"table\": \"_user_group_role_page\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-02-18T20:42:49+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (343,NULL,NULL,'userManagement','resetUserPassword','✅用户管理-修改密码','service',NULL,'{\"service\": \"userManagement\", \"serviceFunction\": \"resetUserPassword\"}','{\"appData\":{\"pageId\":\"userManagement\",\"actionId\":\"resetUserPassword\",\"actionData\":{\"userId\":\"001\",\"clearTextPassword\":\"123456\"},\"where\":{},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1675068758931_2257237\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1675068758931_2257237\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-30T16:52:40+08:00\",\"appData\":{\"resultData\":{},\"appId\":\"{{name}}\",\"pageId\":\"userManagement\",\"actionId\":\"resetUserPassword\"}}','update',NULL,NULL,'2023-01-30T16:52:40+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (344,NULL,NULL,'userManagement','updateItem','✅用户管理-更新用户','sql',NULL,'{\"table\": \"_user\", \"operation\": \"jhUpdate\"}','{\"appData\":{\"pageId\":\"userManagement\",\"actionId\":\"updateItem\",\"actionData\":{\"userStatus\":\"active\"},\"where\":{\"userId\":\"002\"},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1675086739500_8240763\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1675086739500_8240763\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-30T21:52:21+08:00\",\"appData\":{\"resultData\":{\"rows\":1},\"appId\":\"{{name}}\",\"pageId\":\"userManagement\",\"actionId\":\"updateItem\"}}','update',NULL,NULL,'2023-01-30T21:52:21+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (346,NULL,'','recordHistoryManagement','selectOnUseItemListByTable','✅获取指定表的使用中的数据列表','service',NULL,'{\"service\": \"recordHistory\", \"serviceFunction\": \"selectOnUseItemListByTable\"}','{\"appData\":{\"pageId\":\"recordHistoryManagement\",\"actionId\":\"selectOnUseItemListByTable\",\"actionData\":{\"table\":\"_user\"},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148\"},\"packageId\":\"1676533330459_9612148\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533330459_9612148\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:42:11+08:00\"}','update',NULL,NULL,'2023-02-16T15:42:11+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (347,NULL,NULL,'recordHistoryManagement','selectDeletedItemListByTable','✅获取指定表的已删除的数据列表','service',NULL,'{\"service\": \"recordHistory\", \"serviceFunction\": \"selectDeletedItemListByTable\"}','','','update',NULL,NULL,'2022-10-06T10:14:37+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (348,NULL,NULL,'recordHistoryManagement','selectItemList','✅获取数据历史表','sql',NULL,'{\"table\": \"_record_history\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"recordHistoryManagement\",\"actionId\":\"selectItemList\",\"where\":{\"recordId\":1,\"table\":\"_user\"},\"orderBy\":[{\"column\":\"id\",\"order\":\"desc\"}],\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148\",\"actionData\":{}},\"packageId\":\"1676533333238_9456598\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533333238_9456598\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:42:15+08:00\"}','update',NULL,NULL,'2023-02-16T15:42:15+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (351,NULL,NULL,'recordHistoryManagement','restoreRecordByRecordHistory','✅还原数据','service',NULL,'{\"service\": \"recordHistory\", \"serviceFunction\": \"restoreRecordByRecordHistory\"}','{\"appData\":{\"pageId\":\"recordHistoryManagement\",\"actionId\":\"restoreRecordByRecordHistory\",\"actionData\":{\"recordHistoryId\":106},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1674897386639_7264266\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1674897386639_7264266\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-28T17:16:28+08:00\",\"appData\":{\"appId\":\"{{name}}\",\"pageId\":\"recordHistoryManagement\",\"actionId\":\"restoreRecordByRecordHistory\"}}','update',NULL,NULL,'2023-01-28T17:16:28+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (352,NULL,NULL,'userGroupRolePageOrResourceManagement','selectGroup','✅权限规则管理-查询群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-04-28T15:57:34+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (353,NULL,NULL,'userGroupRolePageOrResourceManagement','selectRole','✅权限规则管理-查询角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-04-28T15:57:34+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (354,NULL,NULL,'userManagement','selectItemList','✅用户管理-查询信息','sql',NULL,'{\"table\": \"_user\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"userManagement\",\"actionId\":\"selectItemList\",\"actionData\":{},\"where\":{},\"orderBy\":[{\"column\":\"operationAt\",\"order\":\"desc\"}],\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\"},\"packageId\":\"1676533364975_3507741\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533364975_3507741\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:42:46+08:00\"}','update',NULL,NULL,'2023-02-16T15:42:46+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (355,NULL,NULL,'userManagement','insertItem','✅用户管理-查询信息','service',NULL,'{\"service\": \"userManagement\", \"serviceFunction\": \"addUser\"}','{\"appData\":{\"pageId\":\"userManagement\",\"actionId\":\"insertItem\",\"actionData\":{\"userId\":\"005\",\"username\":\"令狐冲\",\"userType\":\"student\",\"userStatus\":\"active\",\"clearTextPassword\":\"123456\"},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1674812877320_1099490\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1674812877320_1099490\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-27T17:47:58+08:00\",\"appData\":{\"resultData\":{},\"appId\":\"{{name}}\",\"pageId\":\"userManagement\",\"actionId\":\"insertItem\"}}','update',NULL,NULL,'2023-01-27T17:47:58+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (356,NULL,NULL,'userManagement','resetUserPassword','✅用户管理-修改密码','service',NULL,'{\"service\": \"userManagement\", \"serviceFunction\": \"resetUserPassword\"}','{\"appData\":{\"pageId\":\"userManagement\",\"actionId\":\"resetUserPassword\",\"actionData\":{\"userId\":\"001\",\"clearTextPassword\":\"123456\"},\"where\":{},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1675068758931_2257237\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1675068758931_2257237\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-30T16:52:40+08:00\",\"appData\":{\"resultData\":{},\"appId\":\"{{name}}\",\"pageId\":\"userManagement\",\"actionId\":\"resetUserPassword\"}}','update',NULL,NULL,'2023-01-30T16:52:40+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (357,NULL,NULL,'userManagement','updateItem','✅用户管理-更新用户','sql',NULL,'{\"table\": \"_user\", \"operation\": \"jhUpdate\"}','{\"appData\":{\"pageId\":\"userManagement\",\"actionId\":\"updateItem\",\"actionData\":{\"userStatus\":\"active\"},\"where\":{\"userId\":\"002\"},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1675086739500_8240763\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1675086739500_8240763\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-30T21:52:21+08:00\",\"appData\":{\"resultData\":{\"rows\":1},\"appId\":\"{{name}}\",\"pageId\":\"userManagement\",\"actionId\":\"updateItem\"}}','update',NULL,NULL,'2023-01-30T21:52:21+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (367,NULL,NULL,'userGroupRolePageOrResourceManagement','selectResourceList','✅权限规则-查询协议列表','sql',NULL,'{\"table\": \"_resource\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-04-28T15:57:34+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (368,NULL,NULL,'userGroupRolePageOrResourceManagement','selectPageList','✅权限规则-查询页面列表','sql',NULL,'{\"table\": \"_page\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-04-28T15:57:34+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (451,NULL,NULL,'userGroupRoleManagement','selectItemList','✅权限管理页-查询已配置权限列表','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"selectItemList\",\"where\":{\"userId\":\"admin\"},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1676533479006_5300414\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533479006_5300414\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:44:40+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":568,\"userId\":\"admin\",\"groupId\":\"adminGroup\",\"roleId\":\"appAdmin\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null}]},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"selectItemList\"}}','update',NULL,NULL,'2023-02-16T15:44:40+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (452,NULL,NULL,'userGroupRoleManagement','selectUser','✅权限管理页-查询用户','sql',NULL,'{\"table\": \"_user\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"selectUser\",\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1676533474204_1624580\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533474204_1624580\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:44:35+08:00\"}','update',NULL,NULL,'2023-02-16T15:44:35+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (453,NULL,NULL,'userGroupRoleManagement','selectGroup','✅权限管理页-查询群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"selectGroup\",\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1676533475566_3428978\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533475566_3428978\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:44:36+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":1,\"groupId\":\"adminGroup\",\"groupName\":\"管理员组\",\"groupDesc\":\"管理员\",\"groupAvatar\":null,\"groupExtend\":\"{}\",\"operation\":\"jhInsert\",\"operationByUserId\":\"admin\",\"operationByUser\":\"管理员\",\"operationAt\":\"2023-01-31T23:45:21+08:00\"}]},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"selectGroup\"}}','update',NULL,NULL,'2023-02-16T15:44:36+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (454,NULL,NULL,'userGroupRoleManagement','insertItem','✅权限管理页-创建权限配置','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"jhInsert\", \"whereCondition\": \"\"}','{\"appData\":{\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"insertItem\",\"actionData\":{\"userId\":\"007\",\"groupId\":\"adminGroup\",\"roleId\":\"appAdmin\"},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1675180048913_7668306\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1675180048913_7668306\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-31T23:47:30+08:00\",\"appData\":{\"resultData\":{\"rows\":[601]},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"insertItem\"}}','update',NULL,NULL,'2023-01-31T23:47:30+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (455,NULL,NULL,'userGroupRoleManagement','updateItem','✅权限管理页-更新权限配置','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"jhUpdate\", \"whereParamsCondition\": \".where(function() {this.where(whereParams)})\"}','','','update',NULL,NULL,'2022-09-17T21:22:18+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (456,NULL,NULL,'userGroupRoleManagement','deleteItem','✅权限管理页-删除权限配置','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"jhDelete\", \"whereParamsCondition\": \".where(function() {this.where(whereParams)})\"}','','','update',NULL,NULL,'2022-09-17T21:23:26+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (457,NULL,NULL,'userGroupRoleManagement','selectRole','✅权限管理页-查询角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"selectRole\",\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1676533477020_4306594\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533477020_4306594\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:44:38+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":1,\"roleId\":\"appAdmin\",\"roleName\":\"系统管理员\",\"roleDesc\":\"12\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"管理员\",\"operationAt\":\"2023-01-31T23:41:02+08:00\"},{\"id\":2,\"roleId\":\"teacher\",\"roleName\":\"老师\",\"roleDesc\":null,\"operation\":null,\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":3,\"roleId\":\"student\",\"roleName\":\"学生\",\"roleDesc\":null,\"operation\":null,\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null}]},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"selectRole\"}}','update',NULL,NULL,'2023-02-16T15:44:38+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (458,NULL,NULL,'userGroupRoleManagement','insertUser','✅权限管理页-添加用户','service',NULL,'{\"service\": \"userManagement\", \"serviceFunction\": \"addUser\"}','{\"appData\":{\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"insertUser\",\"actionData\":{\"userId\":\"007\",\"username\":\"张三丰\",\"userStatus\":\"active\",\"userType\":\"common\",\"clearTextPassword\":\"123456\"},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1675179782293_6572348\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1675179782293_6572348\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-31T23:43:03+08:00\",\"appData\":{\"resultData\":{},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"insertUser\"}}','update',NULL,NULL,'2023-01-31T23:43:03+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (459,NULL,NULL,'userGroupRoleManagement','insertGroup','✅权限管理页-添加群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"jhInsert\"}','{\"appData\":{\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"insertGroup\",\"actionData\":{\"groupId\":\"adminGroup\",\"groupName\":\"管理员组\",\"groupDesc\":\"管理员\"},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1675179920822_1153757\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1675179920822_1153757\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-31T23:45:22+08:00\",\"appData\":{\"resultData\":{\"rows\":[1]},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"insertGroup\"}}','update',NULL,NULL,'2023-01-31T23:45:22+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (460,NULL,NULL,'userGroupRoleManagement','insertRole','✅权限管理页-添加角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"jhInsert\"}','','','update',NULL,NULL,'2022-02-18T20:00:37+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (461,NULL,'{ \"before\": [], \"after\": [{ \"service\": \"userGroupRoleManagement\", \"serviceFunction\": \"deleteUserGroupRole\" }] }','userGroupRoleManagement','deleteUser','✅权限管理页-删除用户','sql',NULL,'{\"table\": \"_user\", \"operation\": \"jhDelete\"}','{\"appData\":{\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"deleteUser\",\"where\":{\"userId\":\"004\"},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1675180183227_5800264\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1675180183227_5800264\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-31T23:49:45+08:00\",\"appData\":{\"resultData\":{\"rows\":1},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"deleteUser\"}}','update',NULL,NULL,'2023-01-31T23:49:45+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (462,NULL,'{ \"before\": [], \"after\": [{ \"service\": \"userGroupRoleManagement\", \"serviceFunction\": \"deleteUserGroupRole\" }] }','userGroupRoleManagement','deleteGroup','✅权限管理页-删除群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-02-18T19:56:11+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (463,NULL,'{ \"before\": [], \"after\": [{ \"service\": \"userGroupRoleManagement\", \"serviceFunction\": \"deleteUserGroupRole\" }] }','userGroupRoleManagement','deleteRole','✅权限管理页-删除角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-02-18T20:04:23+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (464,NULL,NULL,'userGroupRoleManagement','updateUser','✅权限管理页-更新用户','sql',NULL,'{\"table\": \"_user\", \"operation\": \"jhUpdate\"}','{\"appData\":{\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"updateUser\",\"actionData\":{\"idSequence\":\"10000000\",\"username\":\"管理员\",\"clearTextPassword\":\"123456\",\"password\":\"f0cc7a42ef0c399737c024202b1aaa3f\",\"md5Salt\":\"9PMF7J7VPsUy\",\"userStatus\":\"active\",\"userType\":\"common\",\"config\":null,\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"管理员\",\"operationAt\":\"2023-01-28T22:06:34+08:00\",\"initPassword\":null},\"where\":{\"id\":1},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148\"},\"packageId\":\"1675221217910_5997681\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1675221217910_5997681\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-01T11:13:39+08:00\",\"appData\":{\"resultData\":{\"rows\":1},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"updateUser\"}}','update',NULL,NULL,'2023-02-01T11:13:39+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (465,NULL,NULL,'userGroupRoleManagement','updateGroup','✅权限管理页-更新群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"jhUpdate\"}','','','update',NULL,NULL,'2022-02-18T20:45:26+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (466,NULL,NULL,'userGroupRoleManagement','updateRole','✅权限管理页-更新角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"jhUpdate\"}','{\"appData\":{\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"updateRole\",\"actionData\":{\"roleId\":\"appAdmin\",\"roleName\":\"系统管理员\",\"roleDesc\":\"12\",\"operation\":null,\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},\"where\":{\"id\":1},\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1675179661074_2928810\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1675179661074_2928810\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-01-31T23:41:03+08:00\",\"appData\":{\"resultData\":{\"rows\":1},\"appId\":\"{{name}}\",\"pageId\":\"userGroupRoleManagement\",\"actionId\":\"updateRole\"}}','update',NULL,NULL,'2023-01-31T23:41:03+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (467,NULL,NULL,'classManagement','selectItemList','✅class查询-查询列表','sql','{}','{\"table\": \"class\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-09-12T13:48:17+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (468,NULL,NULL,'classManagement','insertItem','✅class查询-添加成员','sql','{}','{\"table\": \"class\", \"operation\": \"jhInsert\"}','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (469,NULL,NULL,'classManagement','updateItem','✅class查询-更新成员','sql','{}','{\"table\": \"class\", \"operation\": \"jhUpdate\"}','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (470,NULL,NULL,'classManagement','deleteItem','✅class查询-删除信息','sql','{}','{\"table\": \"class\", \"operation\": \"jhDelete\"}','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (471,NULL,NULL,'studentManagementOfOneClass','selectCurrentList','✅class的student管理-查询当前student下的class列表','sql','{}','{\"table\": \"student\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-09-12T13:54:08+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (472,NULL,NULL,'studentManagementOfOneClass','insertItem','✅class的student管理-建立关系','sql','{}','{\"table\": \"student\", \"operation\": \"jhInsert\"}','','','update',NULL,NULL,'2022-09-12T13:49:10+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (473,NULL,NULL,'studentManagementOfOneClass','updateItem','✅class的student管理-更新数据','sql','{}','{\"table\": \"student\", \"operation\": \"jhUpdate\"}','','','update',NULL,NULL,'2022-09-12T13:54:04+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (474,NULL,NULL,'studentManagementOfOneClass','deleteItem','✅class的student管理-删除信息','sql','{}','{\"table\": \"student\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-09-12T13:54:07+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (475,NULL,NULL,'studentManagementOfOneClass','selectAllList','✅class查询-查询列表','sql','{}','{\"table\": \"student\", \"operation\": \"select\"}','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (476,NULL,NULL,'studentManagement','selectItemList','✅student查询-查询列表','sql','{}','{\"table\": \"student\", \"operation\": \"select\"}','{\"appData\":{\"pageId\":\"studentManagement\",\"actionId\":\"selectItemList\",\"actionData\":{},\"where\":{},\"orderBy\":[{\"column\":\"operationAt\",\"order\":\"desc\"}],\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148\"},\"packageId\":\"1676534163074_3253878\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676534163074_3253878\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:56:04+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":1,\"studentId\":\"A00001\",\"name\":\"无涯子\",\"gender\":\"女\",\"dateOfBirth\":\"2000-02-09\",\"classId\":\"2班\",\"level\":\"2年级\",\"bodyHeight\":\"130\",\"studentStatus\":\"正常\",\"remarks\":null,\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T11:23:19+08:00\"},{\"id\":2,\"studentId\":\"A00002\",\"name\":\"丁春秋\",\"gender\":\"男\",\"dateOfBirth\":\"2000-02-09\",\"classId\":\"2班\",\"level\":\"2年级\",\"bodyHeight\":\"140\",\"studentStatus\":\"正常\",\"remarks\":null,\"operation\":\"jhInsert\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T10:40:29+08:00\"},{\"id\":3,\"studentId\":\"A00003\",\"name\":\"王语嫣\",\"gender\":\"男\",\"dateOfBirth\":\"2000-02-09\",\"classId\":\"2班\",\"level\":\"2年级\",\"bodyHeight\":\"150\",\"studentStatus\":\"正常\",\"remarks\":null,\"operation\":\"jhInsert\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T10:40:29+08:00\"},{\"id\":4,\"studentId\":\"A00004\",\"name\":\"司马林\",\"gender\":\"男\",\"dateOfBirth\":\"2000-02-09\",\"classId\":\"2班\",\"level\":\"2年级\",\"bodyHeight\":\"160\",\"studentStatus\":\"正常\",\"remarks\":null,\"operation\":\"jhInsert\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T10:40:29+08:00\"}]},\"appId\":\"{{name}}\",\"pageId\":\"studentManagement\",\"actionId\":\"selectItemList\"}}','update',NULL,NULL,'2023-02-16T15:56:04+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (477,NULL,NULL,'studentManagement','insertItem','✅student查询-添加成员','sql','{}','{\"table\": \"student\", \"operation\": \"jhInsert\"}','','','update',NULL,NULL,'2022-10-06T10:40:29+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (478,NULL,NULL,'studentManagement','updateItem','✅student查询-更新成员','sql','{}','{\"table\": \"student\", \"operation\": \"jhUpdate\"}','','','update',NULL,NULL,'2022-10-06T11:23:19+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (479,NULL,NULL,'studentManagement','deleteItem','✅student查询-删除信息','sql','{}','{\"table\": \"student\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-09-12T13:56:46+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (480,NULL,NULL,'classManagementOfOneStudent','selectCurrentList','✅student的class管理-查询当前class下的student列表','sql','{}','{\"table\": \"student\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-09-12T14:31:04+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (481,NULL,NULL,'classManagementOfOneStudent','insertItem','✅student的class管理-建立关系','sql','{}','{\"table\": \"student\", \"operation\": \"jhInsert\"}','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (482,NULL,NULL,'classManagementOfOneStudent','updateItem','✅student的class管理-更新数据','sql','{}','{\"table\": \"student\", \"operation\": \"jhUpdate\"}','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (483,NULL,NULL,'classManagementOfOneStudent','deleteItem','✅student的class管理-删除信息','sql','{}','{\"table\": \"student\", \"operation\": \"jhDelete\"}','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (484,NULL,NULL,'classManagementOfOneStudent','selectAllList','✅student查询-查询列表','sql','{}','{\"table\": \"student\", \"operation\": \"select\"}','','','jhInsert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (485,NULL,NULL,'userGroupRole','selectItemList','✅权限管理页-查询已配置权限列表','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-09-12T14:38:04+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (486,NULL,NULL,'userGroupRole','selectUser','✅权限管理页-查询用户','sql',NULL,'{\"table\": \"_user\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-09-12T14:38:04+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (487,NULL,NULL,'userGroupRole','selectGroup','✅权限管理页-查询群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-09-12T14:38:05+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (488,NULL,NULL,'userGroupRole','insertItem','✅权限管理页-创建权限配置','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"jhInsert\", \"whereCondition\": \"\"}','','','update',NULL,NULL,'2022-09-12T14:33:29+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (489,NULL,NULL,'userGroupRole','updateItem','✅权限管理页-更新权限配置','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"jhUpdate\", \"whereParamsCondition\": \".where(function() {this.where(whereParams)})\"}','','','update',NULL,NULL,'2022-02-18T12:09:29+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (490,NULL,NULL,'userGroupRole','deleteItem','✅权限管理页-删除权限配置','sql',NULL,'{\"table\": \"_user_group_role\", \"operation\": \"jhDelete\", \"whereParamsCondition\": \".where(function() {this.where(whereParams)})\"}','','','update',NULL,NULL,'2022-09-12T14:34:02+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (491,NULL,NULL,'userGroupRole','selectRole','✅权限管理页-查询角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"select\"}','','','update',NULL,NULL,'2022-09-12T14:38:05+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (492,NULL,NULL,'userGroupRole','insertUser','✅权限管理页-添加用户','service',NULL,'{\"service\": \"userManagement\", \"serviceFunction\": \"addUser\"}','','','update',NULL,NULL,'2022-04-28T20:35:24+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (493,NULL,NULL,'userGroupRole','insertGroup','✅权限管理页-添加群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"jhInsert\"}','','','update',NULL,NULL,'2022-02-18T19:55:57+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (494,NULL,NULL,'userGroupRole','insertRole','✅权限管理页-添加角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"jhInsert\"}','','','update',NULL,NULL,'2022-02-18T20:00:37+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (495,NULL,'{ \"before\": [], \"after\": [{ \"service\": \"userGroupRole\", \"serviceFunction\": \"deleteUserGroupRole\" }] }','userGroupRole','deleteUser','✅权限管理页-删除用户','sql',NULL,'{\"table\": \"_user\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-04-28T20:36:24+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (496,NULL,'{ \"before\": [], \"after\": [{ \"service\": \"userGroupRole\", \"serviceFunction\": \"deleteUserGroupRole\" }] }','userGroupRole','deleteGroup','✅权限管理页-删除群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-02-18T19:56:11+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (497,NULL,'{ \"before\": [], \"after\": [{ \"service\": \"userGroupRole\", \"serviceFunction\": \"deleteUserGroupRole\" }] }','userGroupRole','deleteRole','✅权限管理页-删除角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"jhDelete\"}','','','update',NULL,NULL,'2022-02-18T20:04:23+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (498,NULL,NULL,'userGroupRole','updateUser','✅权限管理页-更新用户','sql',NULL,'{\"table\": \"_user\", \"operation\": \"jhUpdate\"}','','','update',NULL,NULL,'2022-05-02T15:23:57+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (499,NULL,NULL,'userGroupRole','updateGroup','✅权限管理页-更新群组','sql',NULL,'{\"table\": \"_group\", \"operation\": \"jhUpdate\"}','','','update',NULL,NULL,'2022-02-18T20:45:26+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (500,NULL,NULL,'userGroupRole','updateRole','✅权限管理页-更新角色','sql',NULL,'{\"table\": \"_role\", \"operation\": \"jhUpdate\"}','','','update',NULL,NULL,'2022-02-18T19:56:37+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (501,NULL,NULL,'studentcontactManagement','selectItemList','✅查询列表','sql','{}','{ \"table\": \"studentcontact\", \"operation\": \"select\" }','{\"appData\":{\"pageId\":\"studentcontactManagement\",\"actionId\":\"selectItemList\",\"actionData\":{},\"where\":{\"studentId\":\"A00002\"},\"orderBy\":[{\"column\":\"operationAt\",\"order\":\"desc\"}],\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148\"},\"packageId\":\"1676534165943_1985392\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676534165943_1985392\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:56:07+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":2,\"studentId\":\"A00002\",\"contactName\":\"丁春秋\",\"contactRole\":\"父亲\",\"contactNumber\":\"17712341234\",\"remarks\":\"座机：123456\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T11:56:07+08:00\"}]},\"appId\":\"{{name}}\",\"pageId\":\"studentcontactManagement\",\"actionId\":\"selectItemList\"}}','update',NULL,NULL,'2023-02-16T15:56:07+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (502,NULL,NULL,'studentcontactManagement','insertItem','✅添加','sql','{}','{ \"table\": \"studentcontact\", \"operation\": \"insert\" }','','','update',NULL,NULL,'2022-10-06T13:32:30+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (503,NULL,NULL,'studentcontactManagement','updateItem','✅更新','sql','{}','{ \"table\": \"studentcontact\", \"operation\": \"jhUpdate\" }','','','update',NULL,NULL,'2022-10-06T11:56:07+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (504,NULL,NULL,'studentcontactManagement','deleteItem','✅删除','sql','{}','{ \"table\": \"studentcontact\", \"operation\": \"jhDelete\" }','','','update',NULL,NULL,'2022-10-06T13:32:32+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (505,NULL,NULL,'taskOfStudent','selectItemList','✅查询列表','sql','{}','{ \"table\": \"studenttask\", \"operation\": \"select\" }','{\"appData\":{\"pageId\":\"taskOfStudent\",\"actionId\":\"selectItemList\",\"actionData\":{},\"where\":{\"studentId\":\"A00001\"},\"orderBy\":[{\"column\":\"operationAt\",\"order\":\"desc\"}],\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\"},\"packageId\":\"1676534061628_8559557\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676534061628_8559557\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:54:22+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":12,\"studentId\":\"A00001\",\"taskName\":\"擦黑板\",\"taskComment\":\"特别及时5颗星\",\"operation\":\"insert\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T13:23:04+08:00\"},{\"id\":5,\"studentId\":\"A00001\",\"taskName\":\"整理图书\",\"taskComment\":\"不错\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T11:23:31+08:00\"},{\"id\":1,\"studentId\":\"A00001\",\"taskName\":\"剪草\",\"taskComment\":\"不错，五颗星\",\"operation\":\"jhInsert\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T10:40:29+08:00\"}]},\"appId\":\"{{name}}\",\"pageId\":\"taskOfStudent\",\"actionId\":\"selectItemList\"}}','update',NULL,NULL,'2023-02-16T15:54:22+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (506,NULL,NULL,'taskOfStudent','insertItem','✅添加','sql','{}','{ \"table\": \"studenttask\", \"operation\": \"insert\" }','','','update',NULL,NULL,'2022-10-06T13:23:04+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (507,NULL,NULL,'taskOfStudent','updateItem','✅更新','sql','{}','{ \"table\": \"studenttask\", \"operation\": \"jhUpdate\" }','','','update',NULL,NULL,'2022-10-06T13:25:20+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (508,NULL,NULL,'taskOfStudent','deleteItem','✅删除','sql','{}','{ \"table\": \"studenttask\", \"operation\": \"jhDelete\" }','','','update',NULL,NULL,'2022-10-06T13:22:21+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (511,NULL,NULL,'pagePasscodeDemo','selectItemList','✅查询列表','sql','{}','{ \"table\": \"student\", \"operation\": \"select\" }','{\"appData\":{\"pageId\":\"pagePasscodeDemo\",\"actionId\":\"selectItemList\",\"actionData\":{},\"where\":{},\"orderBy\":[{\"column\":\"operationAt\",\"order\":\"desc\"}],\"appId\":\"{{name}}\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36\"},\"packageId\":\"1676533639525_6349241\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1676533639525_6349241\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-16T15:47:20+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":1,\"studentId\":\"A00001\",\"name\":\"无涯子\",\"gender\":\"女\",\"dateOfBirth\":\"2000-02-09\",\"classId\":\"2班\",\"level\":\"2年级\",\"bodyHeight\":\"130\",\"studentStatus\":\"正常\",\"remarks\":null,\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T11:23:19+08:00\"},{\"id\":2,\"studentId\":\"A00002\",\"name\":\"丁春秋\",\"gender\":\"男\",\"dateOfBirth\":\"2000-02-09\",\"classId\":\"2班\",\"level\":\"2年级\",\"bodyHeight\":\"140\",\"studentStatus\":\"正常\",\"remarks\":null,\"operation\":\"jhInsert\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T10:40:29+08:00\"},{\"id\":3,\"studentId\":\"A00003\",\"name\":\"王语嫣\",\"gender\":\"男\",\"dateOfBirth\":\"2000-02-09\",\"classId\":\"2班\",\"level\":\"2年级\",\"bodyHeight\":\"150\",\"studentStatus\":\"正常\",\"remarks\":null,\"operation\":\"jhInsert\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T10:40:29+08:00\"},{\"id\":4,\"studentId\":\"A00004\",\"name\":\"司马林\",\"gender\":\"男\",\"dateOfBirth\":\"2000-02-09\",\"classId\":\"2班\",\"level\":\"2年级\",\"bodyHeight\":\"160\",\"studentStatus\":\"正常\",\"remarks\":null,\"operation\":\"jhInsert\",\"operationByUserId\":\"admin\",\"operationByUser\":\"adminName\",\"operationAt\":\"2022-10-06T10:40:29+08:00\"}]},\"appId\":\"{{name}}\",\"pageId\":\"pagePasscodeDemo\",\"actionId\":\"selectItemList\"}}','update',NULL,NULL,'2023-02-16T15:47:20+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (512,NULL,NULL,'pagePasscodeDemo','insertItem','✅添加','sql','{}','{ \"table\": \"student\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (513,NULL,NULL,'pagePasscodeDemo','updateItem','✅更新','sql','{}','{ \"table\": \"student\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (514,NULL,NULL,'pagePasscodeDemo','deleteItem','✅删除','sql','{}','{ \"table\": \"student\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (515,NULL,NULL,'allPage','htmlErrorLogRecord','✅前端错误日志收集','service','{}','{\"service\": \"error\", \"serviceFunction\": \"htmlErrorLogRecord\"}','','','update',NULL,NULL,'2022-02-22T18:59:14+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (516,NULL,NULL,'pageLog','selectLogFileList','✅查看page log 文件列表','service','{}','{\"service\": \"pageLog\", \"serviceFunction\": \"selectLogFileList\"}',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (517,NULL,NULL,'pageLog','selectItemListFromLogFile','✅查看page log 内容','service','{}','{\"service\": \"pageLog\", \"serviceFunction\": \"selectItemListFromLogFile\"}',NULL,NULL,'insert',NULL,NULL,NULL);


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
) ENGINE = InnoDB AUTO_INCREMENT = 4 COMMENT = '角色表; 软删除未启用;';



INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'appAdmin','系统管理员','12','jhUpdate','admin','管理员','2023-01-31T23:41:02+08:00');
INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'teacher','老师',NULL,NULL,NULL,NULL,NULL);
INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'student','学生',NULL,NULL,NULL,NULL,NULL);


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
) ENGINE = InnoDB COMMENT = '测试用例表';





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
  `config` mediumtext COMMENT '配置信息',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  `initPassword` varchar(255) DEFAULT NULL COMMENT '测试用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 77 COMMENT = '用户表';


INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `initPassword`) VALUES (1, '10000000', 'admin', '管理员', '123456', 'f0cc7a42ef0c399737c024202b1aaa3f', '9PMF7J7VPsUy', 'active', 'common', NULL, 'jhUpdate', 'admin', '管理员', '2023-02-01T11:13:38+08:00', NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `initPassword`) VALUES (68, '26260000', '001', '无涯子', '123456', '48cbd93f4e8a952bc32a90726e7c1a2d', 'ctHQk1ZENmsp', 'active', 'common', NULL, 'update', 'admin', '管理员', '2023-01-30T16:52:39+08:00', NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `initPassword`) VALUES (69, '26260001', '002', '丁春秋', '123456', '4ad13cfbb7d34e37b168272076adab78', '4xFnAjzF3RG5', 'active', 'common', NULL, 'jhUpdate', 'admin', '管理员', '2023-01-30T21:52:20+08:00', NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `initPassword`) VALUES (70, '26260002', '003', '王语嫣', '123456', 'e1f46f41711a8f24ed83a83cdb0e1d00', 'jYkdEdN5SKy8', 'active', 'staff', NULL, 'jhUpdate', 'admin', '管理员', '2022-10-18T14:48:18+08:00', NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `initPassword`) VALUES (74, '26260004', '005', '令狐冲', '123456', '51c539b8a942b47fec31d4dcebc78b77', '5ftenGYJ3DMM', 'active', 'student', NULL, 'insert', 'admin', '管理员', '2023-01-27T17:47:58+08:00', NULL);
INSERT INTO `_user` (`id`, `idSequence`, `userId`, `username`, `clearTextPassword`, `password`, `md5Salt`, `userStatus`, `userType`, `config`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`, `initPassword`) VALUES (76, '26260006', '007', '张三丰', '123456', '97207158f4ae8cbafbfef01c82ca8e0d', 'JTRPpwb4WbJp', 'active', 'common', NULL, 'jhUpdate', 'admin', '管理员', '2023-02-01T11:12:47+08:00', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 602 COMMENT = '用户群组角色关联表; 软删除未启用;';



INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (568,'admin','adminGroup','appAdmin','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (601,'007','adminGroup','appAdmin','jhInsert','admin','管理员','2023-01-31T23:47:30+08:00');


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
) ENGINE = InnoDB AUTO_INCREMENT = 5 COMMENT = '用户群组角色 - 请求资源 映射表; 软删除未启用;';



INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'*','login','*','allPage.*','allow','工具类resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'*','login','*','*','allow','所有resource, 开放给所有登陆成功的用户','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4,'*','public','*','login.passwordLogin','allow','登陆resource, 开放给所有用户','insert',NULL,NULL,NULL);


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
  `authToken` varchar(2048) DEFAULT NULL COMMENT 'auth token',
  `refreshToken` varchar(2048) DEFAULT NULL COMMENT 'refresh token',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `userId_index` (`userId`)
) ENGINE = InnoDB AUTO_INCREMENT = 16 COMMENT = '用户session表; deviceId 维度;软删除未启用;';



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: class
# ------------------------------------------------------------

DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classId` varchar(255) DEFAULT NULL COMMENT '班级ID',
  `className` varchar(255) DEFAULT NULL COMMENT '学生状态',
  `remarks` mediumtext COMMENT '备注',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 175;



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
) ENGINE = InnoDB AUTO_INCREMENT = 5;



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: studentcontact
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studentcontact`;
CREATE TABLE `studentcontact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) DEFAULT NULL COMMENT '学生ID',
  `contactName` varchar(255) DEFAULT NULL COMMENT '联系人名字',
  `contactRole` varchar(255) DEFAULT NULL COMMENT '联系人角色',
  `contactNumber` varchar(255) DEFAULT NULL COMMENT '联系人电话',
  `remarks` mediumtext COMMENT '备注',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `studentId` (`studentId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5;



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: studenttask
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studenttask`;
CREATE TABLE `studenttask` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` varchar(255) DEFAULT NULL COMMENT '学生ID',
  `taskName` varchar(255) DEFAULT NULL COMMENT '联系人名字',
  `taskComment` varchar(255) DEFAULT NULL COMMENT '联系人角色',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `studentId` (`studentId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13;



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _view01_user
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `_view01_user` AS
select
  `_user`.`id` AS `id`,
  `_user`.`idSequence` AS `idSequence`,
  `_user`.`userId` AS `userId`,
  `_user`.`username` AS `username`,
  `_user`.`password` AS `password`,
  `_user`.`md5Salt` AS `md5Salt`,
  `_user`.`userStatus` AS `userStatus`,
  `_user`.`userType` AS `userType`,
  `_user`.`config` AS `config`,
  `_user`.`operation` AS `operation`,
  `_user`.`operationByUserId` AS `operationByUserId`,
  `_user`.`operationByUser` AS `operationByUser`,
  `_user`.`operationAt` AS `operationAt`,
  `_user`.`initPassword` AS `initPassword`
from
  `_user`;




