
-- 简单版本办公模块数据表设计

CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `taskId` varchar(255) DEFAULT NULL COMMENT '任务ID',
  `taskTitle` varchar(255) DEFAULT NULL COMMENT '任务名称',
  `taskDesc` varchar(255) DEFAULT NULL COMMENT '任务描述',
  `taskLevel` varchar(255) DEFAULT NULL COMMENT '任务优先级',
  `taskStartAt` varchar(255) DEFAULT NULL COMMENT '任务开始时间',
  `taskEndAt` varchar(255) DEFAULT NULL COMMENT '任务结束时间',
  `taskManagerId` varchar(255) DEFAULT NULL COMMENT '负责人id;只能一个',
  `taskMemberIdList` varchar(255) DEFAULT NULL COMMENT '参与人id;可能多个',
  `taskTag` varchar(255) DEFAULT NULL COMMENT '任务标签',
  `taskRelationList` text COLLATE utf8mb4_bin COMMENT '任务关联的信息列表',
  `taskFileList` text COLLATE utf8mb4_bin COMMENT '任务关联的附件列表',
  `taskChildList` text COLLATE utf8mb4_bin COMMENT '子任务列表todo',
  `taskStatus` varchar(255) DEFAULT '进行中' COMMENT '任务状态：进行中,已完成',
  
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作: insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='任务表';

CREATE TABLE `ticket` (
  `id` int(11) NOT NULL,
  `idSequence` int(11) DEFAULT NULL COMMENT '自增ID, 10001++',
  `ticketId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单ID; T10001',
  `ticketFormInput` text COLLATE utf8mb4_bin COMMENT '工单表单配置; ',
  `ticketApprovalConfig` text COLLATE utf8mb4_bin COMMENT '工单审批配置; ',
  `ticketStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单状态; 申请、处理中、完成、拒绝、忽略(可以拓展审批状态)',
 
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC COMMENT='工单表;';

CREATE TABLE `ticket_template` (
  `id` int(11) NOT NULL,
  `idSequence` int(11) DEFAULT NULL COMMENT '自增ID, 10001++',
  `ticketTplId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单ID; T10001',
  `ticketTplName` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单模板名称; ',
  `ticketTplIcon` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单模板icon; ',
  `ticketTplGroup` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单模板分析icon; ',
  `ticketTplManagerId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单流程管理员id; ',
  `ticketTplDesc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单模板描述; ',
  `ticketApprovalConfig` text COLLATE utf8mb4_bin COMMENT '工单审批配置; ',
 
  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC COMMENT='工单模板表;';

CREATE TABLE `journal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalId` varchar(255) DEFAULT NULL COMMENT '日志ID',
  `journalId` varchar(255) DEFAULT NULL COMMENT '日志ID',
  `journalFormInput` text COLLATE utf8mb4_bin COMMENT '日志表单',
  `journalRelationList` text COLLATE utf8mb4_bin COMMENT '日志关联的信息列表',
  `journalFileList` text COLLATE utf8mb4_bin COMMENT '日志关联的附件列表',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作: insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='日志表';

CREATE TABLE `journal_template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `journalTplId` varchar(255) DEFAULT NULL COMMENT '日志模板ID',
  `journalTplName` varchar(255) DEFAULT NULL COMMENT '日志模板名称',
  `journalTplIcon` varchar(255) DEFAULT NULL COMMENT '日志模板图标',
  `journalTplIcon` varchar(255) DEFAULT NULL COMMENT '日志模板图标',
  `journalTplDesc` varchar(255) DEFAULT NULL COMMENT '日志模板描述',
  `journalTplFormInput` varchar(255) DEFAULT NULL COMMENT '日志模板表单配置',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作: insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='日志模板表';

CREATE TABLE `notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `noticeId` varchar(255) DEFAULT NULL COMMENT '通知ID',
  `noticeTitle` varchar(255) DEFAULT NULL COMMENT '通知标题',
  `noticeDesc` varchar(255) DEFAULT NULL COMMENT '通知描述',
  `noticeStatus` varchar(255) DEFAULT NULL COMMENT '通知状态;已读,未读',
  `noticeCreateAt` varchar(255) DEFAULT NULL COMMENT '通知创建时间',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作: insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='通知表';