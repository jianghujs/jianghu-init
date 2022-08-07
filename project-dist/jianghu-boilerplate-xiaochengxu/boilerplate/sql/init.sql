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
# DATA DUMP FOR TABLE: _constant
# ------------------------------------------------------------




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
  PRIMARY KEY (`id`),
  KEY `fileId_index` (`fileId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 COMMENT = '文件表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _file
# ------------------------------------------------------------

INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (13,'1648028906069_532573','testFile','1.mp4','1648028906069_532573_1.mp4','/testFile/1648028906069_532573_1.mp4',NULL,'1111','1.39MB','jhInsert','G00001','洪七公','2022-03-23T17:48:26+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (15,'1648029043261_211799','testFile','1111.txt','1648029043261_211799_1111.txt','/testFile/1648029043261_211799_1111.txt',NULL,NULL,'22.90MB','jhInsert','G00001','洪七公','2022-03-23T17:50:43+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (16,'1648029148968_839460','testFile','1111.txt','1648029148968_839460_1111.txt','/testFile/1648029148968_839460_1111.txt',NULL,NULL,'22.90MB','jhInsert','G00001','洪七公','2022-03-23T17:52:29+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (17,'1648029175287_994532','testFile','1.mp4','1648029175287_994532_1.mp4','/testFile/1648029175287_994532_1.mp4',NULL,NULL,'1.39MB','jhInsert','G00001','洪七公','2022-03-23T17:52:55+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (18,'1648029329230_524918','testFile','1111 (1).txt','1648029329230_524918_1111 (1).txt','/testFile/1648029329230_524918_1111 (1).txt',NULL,'111','22.90MB','jhInsert','G00001','洪七公','2022-03-23T17:55:29+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (19,'1648029497337_708722','testFile','1.mp4','1648029497337_708722_1.mp4','/testFile/1648029497337_708722_1.mp4',NULL,'1111','1.39MB','jhInsert','G00001','洪七公','2022-03-23T17:58:17+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (20,'1648029664201_172333','testFile','1111 (1).txt','1648029664201_172333_1111 (1).txt','/testFile/1648029664201_172333_1111 (1).txt',NULL,'1111','22.90MB','jhInsert','G00001','洪七公','2022-03-23T18:01:04+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (21,'1648029707872_618832','testFile','2.mp4','1648029707872_618832_2.mp4','/testFile/1648029707872_618832_2.mp4',NULL,'111','3.40MB','jhInsert','G00001','洪七公','2022-03-23T18:01:47+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (22,'1648029757616_758126','testFile','1.mp4','1648029757616_758126_1.mp4','/testFile/1648029757616_758126_1.mp4',NULL,'1111','1.39MB','jhInsert','G00001','洪七公','2022-03-23T18:02:37+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (23,'1648029815416_962691','testFile','1.mp4','1648029815416_962691_1.mp4','/testFile/1648029815416_962691_1.mp4',NULL,NULL,'1.39MB','jhInsert','G00001','洪七公','2022-03-23T18:03:35+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (24,'1648029840208_918281','testFile','1.mp4','1648029840208_918281_1.mp4','/testFile/1648029840208_918281_1.mp4',NULL,NULL,'1.39MB','jhInsert','G00001','洪七公','2022-03-23T18:04:00+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (25,'1648029886212_966076','testFile','1.mp4','1648029886212_966076_1.mp4','/testFile/1648029886212_966076_1.mp4',NULL,'111','1.39MB','jhInsert','G00001','洪七公','2022-03-23T18:04:46+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (26,'1648029953244_586317','testFile','1.mp4','1648029953244_586317_1.mp4','/testFile/1648029953244_586317_1.mp4',NULL,'111','1.39MB','jhInsert','G00001','洪七公','2022-03-23T18:05:53+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (27,'1648036510584_331325','testFile','1111 (1).txt','1648036510584_331325_1111 (1).txt','/testFile/1648036510584_331325_1111 (1).txt',NULL,NULL,'22.90MB','jhInsert','G00001','洪七公','2022-03-23T19:55:10+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (28,'1648097388052_573247','testFile','1 (2).mp4','1648097388052_573247_1 (2).mp4','/testFile/1648097388052_573247_1 (2).mp4',NULL,'1','1.39MB','jhInsert','G00001','洪七公','2022-03-24T12:49:48+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (29,'1648097400327_819062','testFile','2.mp4','1648097400327_819062_2.mp4','/testFile/1648097400327_819062_2.mp4',NULL,NULL,'3.40MB','jhInsert','G00001','洪七公','2022-03-24T12:50:00+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (30,'1648117553566_345682','testFile','1.mp4','1648117553566_345682_1.mp4','/testFile/1648117553566_345682_1.mp4',NULL,NULL,'1.39MB','jhInsert','G00001','洪七公','2022-03-24T18:25:53+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (31,'1648118464231_957371','testFile','1 (1).mp4','1648118464231_957371_1 (1).mp4','/testFile/1648118464231_957371_1 (1).mp4',NULL,NULL,'1.39MB','jhInsert','G00001','洪七公','2022-03-24T18:41:04+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (32,'1648127801816_957034','testFile','11.jpeg','1648127801816_957034_11.jpeg','/testFile/1648127801816_957034_11.jpeg',NULL,'1234','54.19KB','jhInsert','W00001','张三丰','2022-03-24T21:16:41+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (33,'1648128805987_347367','testFile','PMBOK指南第6版-中文-new (2).pdf','1648128805987_347367_PMBOK指南第6版-中文-new (2).pdf','/testFile/1648128805987_347367_PMBOK指南第6版-中文-new (2).pdf',NULL,'12341234','19.84MB','jhInsert','admin01','admin01','2022-03-24T21:33:26+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (34,'1648128949513_957037','testFile','11 (1).jpeg','1648128949513_957037_11 (1).jpeg','/testFile/1648128949513_957037_11 (1).jpeg',NULL,'12341234','54.19KB','jhInsert','W00001','张三丰','2022-03-24T21:35:49+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (35,'1648132198718_368236','testFile','11 (1) (1).jpeg','1648132198718_368236_11 (1) (1).jpeg','/testFile/1648132198718_368236_11 (1) (1).jpeg',NULL,'12354','54.19KB','jhInsert','W00001','张三丰','2022-03-24T22:29:58+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (36,'1648194548077_688181','testFile','2.mp4','1648194548077_688181_2.mp4','/testFile/1648194548077_688181_2.mp4',NULL,NULL,'3.40MB','jhInsert','G00001','洪七公','2022-03-25T15:49:08+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (39,'1648216481397_334747','testFile','1.mp4','1648216481397_334747_1.mp4','/testFile/1648216481397_334747_1.mp4',NULL,NULL,'1.39MB','jhInsert','G00001','洪七公','2022-03-25T21:54:41+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (40,'1648217442131_510888','testFile','11.jpeg','1648217442131_510888_11.jpeg','/testFile/1648217442131_510888_11.jpeg',NULL,'1234','54.19KB','jhInsert','W00001','张三丰','2022-03-25T22:10:42+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (41,'1648217634745_290277','testFile','PMBOK指南第6版-中文-new.pdf','1648217634745_290277_PMBOK指南第6版-中文-new.pdf','/testFile/1648217634745_290277_PMBOK指南第6版-中文-new.pdf',NULL,'1234','19.84MB','jhInsert','W00001','张三丰','2022-03-25T22:13:54+08:00');
INSERT INTO `_file` (`id`,`fileId`,`fileDirectory`,`filename`,`filenameStorage`,`downloadPath`,`fileType`,`fileDesc`,`binarySize`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (42,'1658241846226_104790','testFile','1002.png','1658241846226_104790_1002.png','/testFile/1658241846226_104790_1002.png',NULL,NULL,'56.01KB','jhInsert','G00002','郭靖','2022-07-19T22:44:06+08:00');



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
) ENGINE = InnoDB AUTO_INCREMENT = 9 COMMENT = '群组表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _group
# ------------------------------------------------------------

INSERT INTO `_group` (`id`,`groupId`,`groupName`,`groupDesc`,`groupAvatar`,`groupExtend`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'adminGroup','管理组','管理组',NULL,'{}','insert',NULL,NULL,NULL);
INSERT INTO `_group` (`id`,`groupId`,`groupName`,`groupDesc`,`groupAvatar`,`groupExtend`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'wudang','武当','武当',NULL,'{}','insert',NULL,NULL,NULL);
INSERT INTO `_group` (`id`,`groupId`,`groupName`,`groupDesc`,`groupAvatar`,`groupExtend`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (7,'gaibang','丐帮','丐帮',NULL,'{}','insert',NULL,NULL,NULL);
INSERT INTO `_group` (`id`,`groupId`,`groupName`,`groupDesc`,`groupAvatar`,`groupExtend`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (8,'huashan','华山派','华山派',NULL,'{}','insert',NULL,NULL,NULL);



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
  PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 35 COMMENT = '页面表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _page
# ------------------------------------------------------------

INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'help','帮助','dynamicInMenu','11','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'login','登陆','','','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'manual','操作手册','showInMenu','0','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (31,'index','首页','showInMenu','1','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (32,'xiaochengxuInfo','小程序信息','showInMenu','2','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (33,'fileManagement','文件管理','showInMenu','3','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (34,'uiActionDemo','uiAction Demo','showInMenu','1','insert',NULL,NULL,NULL);



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
) ENGINE = InnoDB AUTO_INCREMENT = 6 COMMENT = '数据历史表';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _record_history
# ------------------------------------------------------------

INSERT INTO `_record_history` (`id`,`table`,`recordId`,`recordContent`,`packageContent`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (1,'_user_session',1,'{\"id\":1,\"userId\":\"admin01\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\",\"deviceId\":\"Mac.10.15.7_2b028cf2_127.0.0.1:9801_chrome\",\"deviceType\":\"user\",\"socketStatus\":\"offline\",\"authToken\":\"8dUS_vofyM_hKcjGu8jOO_jL-V3zmkXXR4Ww\",\"operation\":\"jhInsert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":\"2022-07-19T14:49:58+08:00\"}','{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin01\",\"password\":\"123456\",\"deviceId\":\"Mac.10.15.7_2b028cf2_127.0.0.1:9801_chrome\"},\"appId\":\"md_duoxing_bot_xiaochengxu_demo\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\"},\"packageId\":\"1658213397462_7477788\",\"packageType\":\"httpRequest\"}','jhInsert',NULL,NULL,'2022-07-19T14:49:58+08:00');
INSERT INTO `_record_history` (`id`,`table`,`recordId`,`recordContent`,`packageContent`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'_user_session',1,'{\"id\":1,\"userId\":\"admin01\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\",\"deviceId\":\"Mac.10.15.7_2b028cf2_127.0.0.1:9801_chrome\",\"deviceType\":\"user\",\"socketStatus\":\"offline\",\"authToken\":\"QhsPC4wffldGtEAtEMaSOh4WhDFbErK4hlT3\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin01\",\"operationByUser\":\"admin01\",\"operationAt\":\"2022-07-19T14:50:01+08:00\"}','{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin01\",\"password\":\"123456\",\"deviceId\":\"Mac.10.15.7_2b028cf2_127.0.0.1:9801_chrome\"},\"appId\":\"md_duoxing_bot_xiaochengxu_demo\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\"},\"packageId\":\"1658213400735_5525344\",\"packageType\":\"httpRequest\"}','jhUpdate','admin01','admin01','2022-07-19T14:50:01+08:00');
INSERT INTO `_record_history` (`id`,`table`,`recordId`,`recordContent`,`packageContent`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'_user_session',1,'{\"id\":1,\"userId\":\"admin01\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\",\"deviceId\":\"Mac.10.15.7_2b028cf2_127.0.0.1:9801_chrome\",\"deviceType\":\"user\",\"socketStatus\":\"offline\",\"authToken\":\"vAYa-OdyCgfOad1NKEjMQEBeEa_5oWU_gWVD\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin01\",\"operationByUser\":\"admin01\",\"operationAt\":\"2022-07-19T14:50:04+08:00\"}','{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin01\",\"password\":\"123456\",\"deviceId\":\"Mac.10.15.7_2b028cf2_127.0.0.1:9801_chrome\"},\"appId\":\"md_duoxing_bot_xiaochengxu_demo\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\"},\"packageId\":\"1658213403660_8766037\",\"packageType\":\"httpRequest\"}','jhUpdate','admin01','admin01','2022-07-19T14:50:04+08:00');
INSERT INTO `_record_history` (`id`,`table`,`recordId`,`recordContent`,`packageContent`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4,'_user_session',1,'{\"id\":1,\"userId\":\"admin01\",\"userIp\":\"127.0.0.1\",\"userIpRegion\":\"\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\",\"deviceId\":\"Mac.10.15.7_2b028cf2_127.0.0.1:9801_chrome\",\"deviceType\":\"user\",\"socketStatus\":\"offline\",\"authToken\":\"T6jBFzSl_mv0IpmB3nWw2z9eZ1on9jKsERSG\",\"operation\":\"jhUpdate\",\"operationByUserId\":\"admin01\",\"operationByUser\":\"admin01\",\"operationAt\":\"2022-07-19T14:50:17+08:00\"}','{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin01\",\"password\":\"123456\",\"deviceId\":\"Mac.10.15.7_2b028cf2_127.0.0.1:9801_chrome\"},\"appId\":\"md_duoxing_bot_xiaochengxu_demo\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36\"},\"packageId\":\"1658213416760_8296664\",\"packageType\":\"httpRequest\"}','jhUpdate','admin01','admin01','2022-07-19T14:50:17+08:00');
INSERT INTO `_record_history` (`id`,`table`,`recordId`,`recordContent`,`packageContent`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (5,'_file',42,'{\"id\":42,\"fileId\":\"1658241846226_104790\",\"fileDirectory\":\"testFile\",\"filename\":\"1002.png\",\"filenameStorage\":\"1658241846226_104790_1002.png\",\"downloadPath\":\"/testFile/1658241846226_104790_1002.png\",\"fileType\":null,\"fileDesc\":null,\"binarySize\":\"56.01KB\",\"operation\":\"jhInsert\",\"operationByUserId\":\"G00002\",\"operationByUser\":\"郭靖\",\"operationAt\":\"2022-07-19T22:44:06+08:00\"}','{\"packageId\":\"1658241843507_6416442\",\"packageType\":\"socketRequest\",\"deviceId\":\"duoxing-v5.openjianghu.org_Mac.10.15.7_a205dcde_chrome\",\"timestamp\":\"2022-07-19T14:44:03.507Z\",\"appData\":{\"appId\":\"md_duoxing_bot_xiaochengxu_demo\",\"pageId\":\"allPage\",\"actionId\":\"uploadFileDone\",\"actionData\":{\"hash\":\"20ed39ed53648bb9fab6dfa401b85740\",\"total\":1,\"chunkSize\":3145728,\"filename\":\"1002.png\",\"fileDirectory\":\"testFile\"}}}','jhInsert','G00002','郭靖','2022-07-19T22:44:06+08:00');



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
) ENGINE = InnoDB AUTO_INCREMENT = 332 COMMENT = '请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _resource
# ------------------------------------------------------------

INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (101,NULL,NULL,'allPage','getChunkInfo','✅ 文件分片下载-获取分片信息','service','{}','{ \"service\": \"file\", \"serviceFunction\": \"getChunkInfo\" }','','','update',NULL,NULL,'2022-03-10T22:27:32+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (102,NULL,NULL,'allPage','uploadFileDone','✅ 文件分片上传-所有分片上传完毕','service','{}','{ \"service\": \"file\", \"serviceFunction\": \"uploadFileDone\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (108,NULL,NULL,'allPage','socketUploadByBase64','✅ 文件分片上传-socket base64','service','{}','{ \"service\": \"file\", \"serviceFunction\": \"uploadFileChunkByBase64\" }','','','update',NULL,NULL,'2022-03-10T22:27:32+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (114,NULL,NULL,'allPage','socketDownloadByBase64','✅ 文件分片下载-socket base64','service','{}','{ \"service\": \"file\", \"serviceFunction\": \"downloadFileChunkByBase64\" }','','','update',NULL,NULL,'2022-03-10T22:27:32+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (231,NULL,NULL,'login','passwordLogin','✅登陆','service','{}','{ \"service\": \"user\", \"serviceFunction\": \"passwordLogin\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (251,NULL,NULL,'allPage','logout','✅登出','service','{}','{ \"service\": \"user\", \"serviceFunction\": \"logout\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (253,NULL,NULL,'allPage','userInfo','✅获取用户信息','service','{}','{ \"service\": \"user\", \"serviceFunction\": \"userInfo\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (258,NULL,NULL,'allPage','getConstantList','✅查询常量','sql','{}','{ \"table\": \"_constant\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (259,NULL,NULL,'allPage','getXiaochengxuInfo','✅查询小程序信息','service','{}','{ \"service\": \"xiaochengxu\", \"serviceFunction\": \"getXiaochengxuInfo\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (273,NULL,NULL,'fileManagement','selectItemList','✅文件管理-查询列表','sql',NULL,'{ \"table\": \"_file\", \"operation\": \"select\" }','','','update',NULL,NULL,'2022-02-22T22:03:18+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (275,NULL,NULL,'fileManagement','updateItem','✅文件管理-更新成员','sql',NULL,'{ \"table\": \"_file\", \"operation\": \"jhUpdate\" }','','','update',NULL,NULL,'2022-02-21T00:19:06+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (276,NULL,NULL,'fileManagement','deleteItem','✅文件管理-删除信息','sql',NULL,'{ \"table\": \"_file\", \"operation\": \"jhDelete\" }','','','update',NULL,NULL,'2022-02-20T22:15:05+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (316,'access_control_student_basic',NULL,'index','selectItemListUseAccessControl','✅服务端查询-查询列表(使用accsee control)','sql','{}','{ \"table\": \"student_basic\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (317,'access_control_student_basic',NULL,'index','selectItemList','✅服务端查询-查询列表','sql','{}','{ \"table\": \"student_basic\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (318,NULL,NULL,'index','insertItem','✅服务端查询-添加成员','sql','{}','{ \"table\": \"student_basic\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (319,NULL,NULL,'index','updateItem','✅服务端查询-更新成员','sql','{}','{ \"table\": \"student_basic\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (320,NULL,NULL,'index','deleteItem','✅服务端查询-删除信息','sql','{}','{ \"table\": \"student_basic\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (327,NULL,NULL,'xiaochengxu','getView','✅小程序：获取前端页面','service','{}','{ \"service\": \"xiaochengxu\", \"serviceFunction\": \"getView\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (328,NULL,NULL,'uiActionDemo','selectItemList','✅uiActionDemo查询-查询列表','sql','{}','{ \"table\": \"student_basic\", \"operation\": \"select\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (329,NULL,NULL,'uiActionDemo','insertItem','✅uiActionDemo查询-添加成员','sql','{}','{ \"table\": \"student_basic\", \"operation\": \"insert\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (330,NULL,NULL,'uiActionDemo','updateItem','✅uiActionDemo查询-更新成员','sql','{}','{ \"table\": \"student_basic\", \"operation\": \"jhUpdate\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (331,NULL,NULL,'uiActionDemo','deleteItem','✅uiActionDemo查询-删除信息','sql','{}','{ \"table\": \"student_basic\", \"operation\": \"jhDelete\" }','','','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _resource_request_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_resource_request_log`;
CREATE TABLE `_resource_request_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resourceId` varchar(255) DEFAULT NULL COMMENT 'resource id;',
  `packageId` varchar(255) DEFAULT NULL COMMENT 'resource package id',
  `userIp` varchar(255) DEFAULT NULL COMMENT '用户ip;',
  `userAgent` text COMMENT '设备信息',
  `userId` varchar(255) DEFAULT NULL COMMENT '用户ID',
  `deviceId` varchar(255) DEFAULT NULL COMMENT '设备id',
  `userIpRegion` varchar(255) DEFAULT NULL COMMENT '用户Ip区域',
  `executeSql` varchar(255) DEFAULT NULL COMMENT '执行的sql',
  `requestBody` mediumtext COMMENT '请求body',
  `responseBody` mediumtext COMMENT '响应body',
  `responseStatus` varchar(255) DEFAULT NULL COMMENT '执行的结果;  success, fail',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `resourceId_index` (`resourceId`),
  KEY `packageId_index` (`packageId`)
) ENGINE = InnoDB AUTO_INCREMENT = 269 COMMENT = '文件表; 软删除未启用;';




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


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _role
# ------------------------------------------------------------

INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'appAdmin','系统管理员','','insert',NULL,NULL,NULL);
INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'boss','掌门','','insert',NULL,NULL,NULL);
INSERT INTO `_role` (`id`,`roleId`,`roleName`,`roleDesc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (7,'disciple','门徒','','insert',NULL,NULL,NULL);



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
) ENGINE = InnoDB AUTO_INCREMENT = 77 COMMENT = 'ui 施工方案';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _ui
# ------------------------------------------------------------

INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (71,'uiActionDemo','ui','refreshTableData','✅获取表格数据','{\"main\": [{\"function\": \"refreshTableData\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (72,'uiActionDemo','ui','startCreateItem','✅获取表格数据','{\"main\": [{\"function\": \"clearItemData\"}, {\"function\": \"openCreateItemDialog\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (73,'uiActionDemo','ui','createItem','✅获取表格数据','{\"before\": [{\"function\": \"confirmCreateItemDialog\"}], \"main\": [{\"function\": \"doCreateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (74,'uiActionDemo','ui','startUpdateItem','✅获取表格数据','{\"main\": [{\"function\": \"prepareItemData\"}, {\"function\": \"openUpdateDialog\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (75,'uiActionDemo','ui','updateItem','✅获取表格数据','{\"before\": [{\"function\": \"confirmUpdateItemDialog\"}], \"main\": [{\"function\": \"doUpdateItem\"}, {\"function\": \"refreshTableData\"}], \"after\": [{\"function\": \"closeDrawerShow\"}]}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_ui` (`id`,`pageId`,`uiActionType`,`uiActionId`,`desc`,`uiActionConfig`,`appDataSchema`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (76,'uiActionDemo','ui','deleteItem','✅获取表格数据','{\"before\": [{\"function\": \"confirmDeleteItemDialog\"}], \"main\": [{\"function\": \"doDeleteItem\"}, {\"function\": \"refreshTableData\"}]}',NULL,'insert',NULL,NULL,NULL);



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
) ENGINE = InnoDB AUTO_INCREMENT = 130 COMMENT = '用户表';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _user
# ------------------------------------------------------------

INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (86,NULL,'admin01','admin01','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (87,NULL,'xiaochengxu01','小程序机器人1','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (88,NULL,'xiaochengxu02','小程序机器人2','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (89,NULL,'chatbot01','聊天机器人1','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (90,NULL,'chatbot02','聊天机器人2','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (91,NULL,'100001X','撒母耳JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (92,NULL,'100004Q','伽勒JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (93,NULL,'100002D','王番JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (94,NULL,'100007J','波拉JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (95,NULL,'100003K','友妮JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (96,NULL,'100013V','SuniJH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (97,NULL,'532960I','张多加WZ','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (98,NULL,'100006D','宁静JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (99,NULL,'100080M','贝贝JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (100,NULL,'100011J','茉莉JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (101,NULL,'100046Z','吕底亚JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (102,NULL,'100062Y','雅飒JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (103,NULL,'100089S','迪亚JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (104,NULL,'100005W','安宁JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (105,NULL,'100060L','沐昀JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (106,NULL,'539914N','佳音李JY','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (107,NULL,'100054Z','萝以JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (108,NULL,'531433P','吴路得JH','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (109,NULL,'534498D','居上家居定制DS','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (110,NULL,'m3464C','WilliamWZ','123456','9d868aad4af212de6a26e39efbdd86ee','4ThJGJbAPe5m','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (123,NULL,'W00001','张三丰','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (124,NULL,'W00002','张无忌','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (125,NULL,'G00001','洪七公','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (126,NULL,'G00002','郭靖','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (127,NULL,'H00001','岳不群','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (128,NULL,'H00002','令狐冲','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','common',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_user` (`id`,`idSequence`,`userId`,`username`,`clearTextPassword`,`password`,`md5Salt`,`userStatus`,`userType`,`config`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (129,NULL,'G00003','汪剑通','123456','38d61d315e62546fe7f1013e31d42f57','Xs4JSZnhiwsR','active','common',NULL,'insert',NULL,NULL,NULL);



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


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _user_group_role
# ------------------------------------------------------------

INSERT INTO `_user_group_role` (`id`,`userId`,`groupId`,`roleId`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (568,'admin01','adminGroup','appAdmin','insert',NULL,NULL,NULL);
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
) ENGINE = InnoDB AUTO_INCREMENT = 22 COMMENT = '用户群组角色 - 页面 映射表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _user_group_role_page
# ------------------------------------------------------------

INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (17,'*','public','*','login','allow','登陆页; 开放给所有用户;','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (18,'*','login','*','manual','allow','操作手册页; 开放给登陆用户;','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (19,'*','login','*','help','allow','帮助页; 开放给登陆用户;','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_page` (`id`,`user`,`group`,`role`,`page`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (21,'*','*','*','*','allow','所有页面; 开放给所有人;','insert',NULL,NULL,NULL);



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
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (51,'*','*','*','xiaochengxu.*','allow','所有用户, 赋予所有xiaochengxu 接口访问权限','insert',NULL,NULL,NULL);
INSERT INTO `_user_group_role_resource` (`id`,`user`,`group`,`role`,`resource`,`allowOrDeny`,`desc`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (52,'*','login','*','*','allow','登录用户, 赋予所有resource权限','insert',NULL,NULL,NULL);



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
  `deviceType` varchar(255) DEFAULT 'user' COMMENT '设备类型; user, xiaochengxu',
  `socketStatus` varchar(255) DEFAULT 'offline' COMMENT 'socket状态',
  `authToken` varchar(255) DEFAULT NULL COMMENT 'auth token',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`),
  KEY `userId_index` (`userId`),
  KEY `userId_deviceId_unique` (`userId`, `deviceId`) USING BTREE,
  KEY `authToken_unique` (`authToken`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 COMMENT = '用户session表; deviceId 维度;软删除未启用;';




# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: access_control_student_basic
# ------------------------------------------------------------

DROP TABLE IF EXISTS `access_control_student_basic`;
CREATE TABLE `access_control_student_basic` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `userId` varchar(255) DEFAULT NULL COMMENT '用户id',
  `username` varchar(255) DEFAULT NULL COMMENT '用户名',
  `resourceData` varchar(255) DEFAULT NULL COMMENT '覆盖 _resource.resourceData; { "table": "student_basic", "operation": "select", "where": { "level": "02" }, name: ["张三丰", "张无忌"] }',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `userId_index` (`userId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 53 COMMENT = '学生表的 accessControl 表';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: access_control_student_basic
# ------------------------------------------------------------

INSERT INTO `access_control_student_basic` (`id`,`userId`,`username`,`resourceData`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (50,'G00001','洪七公','{ \"where\": {\"name\": \"222\"} }','insert',NULL,NULL,NULL);
INSERT INTO `access_control_student_basic` (`id`,`userId`,`username`,`resourceData`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (51,'Gxxxxx','xxx','{ \"table\": \"student_basic\", \"operation\": \"select\", \"whereOrOptions\": [[\"classId\", \"like\", \"%2021-01级-02班%\"],[\"bodyHeight\", \">\", 172]]\n}','insert',NULL,NULL,NULL);
INSERT INTO `access_control_student_basic` (`id`,`userId`,`username`,`resourceData`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (52,'Gxxxxxxx','xxxx','{ \"table\": \"student_basic\", \"operation\": \"select\", \"where\": {\"name\": \"222\"}\n}','insert',NULL,NULL,NULL);



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: student_basic
# ------------------------------------------------------------

DROP TABLE IF EXISTS `student_basic`;
CREATE TABLE `student_basic` (
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
) ENGINE = InnoDB AUTO_INCREMENT = 135;


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: student_basic
# ------------------------------------------------------------

INSERT INTO `student_basic` (`id`,`studentId`,`name`,`gender`,`dateOfBirth`,`classId`,`level`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (127,'111','11','female','2022-03-23','2021-01级-02班','02','170','正常',NULL,'insert','G00001','洪七公','2022-03-23T20:08:41+08:00');
INSERT INTO `student_basic` (`id`,`studentId`,`name`,`gender`,`dateOfBirth`,`classId`,`level`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (133,'222','222','female','2022-03-23','2021-01级-02班','02','175','正常',NULL,'insert','G00001','洪七公','2022-03-23T20:08:41+08:00');
INSERT INTO `student_basic` (`id`,`studentId`,`name`,`gender`,`dateOfBirth`,`classId`,`level`,`bodyHeight`,`studentStatus`,`remarks`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (134,'333','333','female','2022-03-23','2021-01级-02班','02','178','正常',NULL,'insert','G00001','洪七公','2022-03-23T20:08:41+08:00');



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





