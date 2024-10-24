-- 把任务，审批，日志，通知使用一个表来做

CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` int(11) DEFAULT NULL COMMENT '自增ID, 1001++',
  `taskId` varchar(255) DEFAULT NULL COMMENT '任务ID',
  `taskTitle` varchar(255) DEFAULT NULL COMMENT '任务名称',
  `taskDesc` varchar(255) DEFAULT NULL COMMENT '任务描述',
  `taskLevel` varchar(255) DEFAULT NULL COMMENT '任务优先级',
  `taskTag` varchar(255) DEFAULT NULL COMMENT '任务标签',
  `taskStatus` varchar(255) DEFAULT '进行中' COMMENT '任务状态：进行中,已完成,已拒绝',
  `taskType` varchar(255) DEFAULT NULL COMMENT '任务类型: 任务,审批,日志',

  `taskContent` text COLLATE utf8mb4_bin COMMENT '任务内容;任务,审批,日志表单内容',

  `taskStartAt` varchar(255) DEFAULT NULL COMMENT '任务开始时间',
  `taskEndAt` varchar(255) DEFAULT NULL COMMENT '任务结束时间',

  `taskManagerId` varchar(255) DEFAULT NULL COMMENT '负责人id;只能一个',
  `taskMemberIdList` varchar(255) DEFAULT NULL COMMENT '参与人id;可能多个',

  `taskRelationList` text COLLATE utf8mb4_bin COMMENT '任务关联的信息列表',
  `taskFileList` text COLLATE utf8mb4_bin COMMENT '任务关联的附件列表',
  `taskChildList` text COLLATE utf8mb4_bin COMMENT '子任务列表todo',
  
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作: insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='任务表';

CREATE TABLE `notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` int(11) DEFAULT NULL COMMENT '自增ID, 1001++',
  `noticeId` varchar(255) DEFAULT NULL COMMENT '通知ID',
  `noticeTitle` varchar(255) DEFAULT NULL COMMENT '通知标题',
  `noticeType` varchar(255) DEFAULT NULL COMMENT '通知类型;erp,finace',
  `noticeUrl` varchar(255) DEFAULT NULL COMMENT '业务系统的跳转',
  `noticeDesc` varchar(255) DEFAULT NULL COMMENT '通知描述',
  `noticeStatus` varchar(255) DEFAULT NULL COMMENT '通知状态;已读,未读',
  `noticeCreateAt` varchar(255) DEFAULT NULL COMMENT '通知创建时间',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作: insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='通知表';


CREATE TABLE `task_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` int(11) DEFAULT NULL COMMENT '自增ID;1001++',
  `taskTemplateId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '任务模板ID;',
  `taskTemplateName` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '任务模板名称;',
  `taskTemplateForm` text COLLATE utf8mb4_bin COMMENT 'form表单;',
  `taskTemplatePersonList` text COLLATE utf8mb4_bin COMMENT '审批人列表;',
  `taskTemplateCreateAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '任务模板创建时间;',
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作: insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC COMMENT='任务模板表;';