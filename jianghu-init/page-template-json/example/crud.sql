-- 创建 班级表
DROP TABLE IF EXISTS `example_class`;
CREATE TABLE `example_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` int(11) DEFAULT NULL,
  `classId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '班级ID',
  `className` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '班级名称',
  `classType` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '班级类型',
  `classBalance` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '班费余额',
  `remarks` mediumtext COLLATE utf8mb4_bin COMMENT '备注',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作:insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间:E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `studentId` (`classId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
-- 创建 班级
INSERT INTO `example_class` (`id`, `idSequence`, `classId`, `className`, `classType`, `classBalance`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, 10001, 'C10001', '测试班级1', '普通班', NULL, NULL, 'jhInsert', 'admin', '系统管理员', '2024-01-01T17:25:52+08:00');
-- 创建 学生表
DROP TABLE IF EXISTS `example_student`;
CREATE TABLE `example_student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` int(11) DEFAULT NULL,
  `studentId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '学生ID',
  `name` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '学生名字',
  `gender` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '性别',
  `dateOfBirth` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '出生日期',
  `classId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '班级ID',
  `level` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '年级',
  `bodyHeight` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '身高',
  `studentStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '学生状态',
  `remarks` mediumtext COLLATE utf8mb4_bin COMMENT '备注',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作:insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间:E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `studentId` (`studentId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
-- 创建 学生
INSERT INTO `example_student` (`id`, `idSequence`, `studentId`, `name`, `gender`, `dateOfBirth`, `classId`, `level`, `bodyHeight`, `studentStatus`, `remarks`, `operation`, `operationByUserId`, `operationByUser`, `operationAt`) VALUES (1, '10001', 'S10001', '测试学生1', '男', '2021-05-28', 'C10001', '一年级', '100', '在读', NULL, 'jhInsert', 'admin', '系统管理员', '2024-01-01T17:25:52+08:00');
-- 创建 page
INSERT INTO `_page` (`pageId`,`pageName`,`pageType`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) SELECT 'exampleClass','演示-班级','showInMenu','5','jhInsert','jianghu-init',NULL,NULL FROM DUAL WHERE NOT EXISTS (SELECT `pageId` FROM `_page` WHERE `pageId`='exampleClass');
-- 删除 resource
DELETE FROM `_resource` WHERE `pageId`='exampleClass';
-- 创建 resource
INSERT INTO `_resource` (`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) SELECT NULL,NULL,'exampleClass','selectItemList','✅查询列表','sql','{}','{ \"table\": \"example_class\", \"operation\": \"select\" }',NULL,NULL,'jhInsert','jianghu-init',NULL,NULL FROM DUAL WHERE NOT EXISTS (SELECT `pageId` FROM `_resource` WHERE `pageId`='exampleClass' AND `actionId`='selectItemList');
INSERT INTO `_resource` (`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) SELECT NULL,'{"before": [{"service": "common", "serviceFunction": "generateBizIdOfBeforeHook"}]}','exampleClass','insertItem','✅添加','sql','{}','{ \"table\": \"example_class\", \"operation\": \"jhInsert\" }',NULL,NULL,'jhInsert','jianghu-init',NULL,NULL FROM DUAL WHERE NOT EXISTS (SELECT `pageId` FROM `_resource` WHERE `pageId`='exampleClass' AND `actionId`='insertItem');
INSERT INTO `_resource` (`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) SELECT NULL,NULL,'exampleClass','updateItem','✅更新','sql','{}','{ \"table\": \"example_class\", \"operation\": \"jhUpdate\" }',NULL,NULL,'jhInsert','jianghu-init',NULL,NULL FROM DUAL WHERE NOT EXISTS (SELECT `pageId` FROM `_resource` WHERE `pageId`='exampleClass' AND `actionId`='updateItem');
INSERT INTO `_resource` (`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) SELECT NULL,NULL,'exampleClass','deleteItem','✅删除','sql','{}','{ \"table\": \"example_class\", \"operation\": \"jhDelete\" }',NULL,NULL,'jhInsert','jianghu-init',NULL,NULL FROM DUAL WHERE NOT EXISTS (SELECT `pageId` FROM `_resource` WHERE `pageId`='exampleClass' AND `actionId`='deleteItem');
-- 创建 组件resource
INSERT INTO `_resource` (`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) SELECT NULL,NULL,'exampleClass','studentOfClass-selectItemList','✅查询当前班级下的学生列表','sql','{}','{ \"table\": \"example_student\", \"operation\": \"select\" }',NULL,NULL,'jhInsert','jianghu-init',NULL,NULL FROM DUAL WHERE NOT EXISTS (SELECT `pageId` FROM `_resource` WHERE `pageId`='exampleClass' AND `actionId`='studentOfClass-selectItemList');
INSERT INTO `_resource` (`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) SELECT NULL,'{"before": [{"service": "common", "serviceFunction": "generateBizIdOfBeforeHook"}]}','exampleClass','studentOfClass-insertItem','✅建立关系','sql','{}','{ \"table\": \"example_student\", \"operation\": \"jhInsert\" }',NULL,NULL,'jhInsert','jianghu-init',NULL,NULL FROM DUAL WHERE NOT EXISTS (SELECT `pageId` FROM `_resource` WHERE `pageId`='exampleClass' AND `actionId`='studentOfClass-insertItem');
INSERT INTO `_resource` (`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) SELECT NULL,NULL,'exampleClass','studentOfClass-updateItem','✅更新数据','sql','{}','{ \"table\": \"example_student\", \"operation\": \"jhUpdate\" }',NULL,NULL,'jhInsert','jianghu-init',NULL,NULL FROM DUAL WHERE NOT EXISTS (SELECT `pageId` FROM `_resource` WHERE `pageId`='exampleClass' AND `actionId`='studentOfClass-updateItem');
INSERT INTO `_resource` (`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) SELECT NULL,NULL,'exampleClass','studentOfClass-deleteItem','✅删除信息','sql','{}','{ \"table\": \"example_student\", \"operation\": \"jhDelete\" }',NULL,NULL,'jhInsert','jianghu-init',NULL,NULL FROM DUAL WHERE NOT EXISTS (SELECT `pageId` FROM `_resource` WHERE `pageId`='exampleClass' AND `actionId`='studentOfClass-deleteItem');