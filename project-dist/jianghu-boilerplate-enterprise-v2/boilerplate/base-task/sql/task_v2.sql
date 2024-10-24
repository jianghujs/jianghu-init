
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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` int(11) DEFAULT NULL COMMENT '自增ID, 10001++',
  `ticketId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单ID; T10001',
  `ticketBizId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '业务ID; 采购订单ID、销售订单ID',
  `ticketType` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单类型; 采购付款、销售收款、采购入库、采购资产入库、资产入库、销售出库',
  `ticketDesc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '工单描述;',
  `ticketContentRequest` text COLLATE utf8mb4_bin COMMENT '申请内容; {}',
  `ticketContent` text COLLATE utf8mb4_bin COMMENT '完成内容; {}',
  `ticketCommentList` text COLLATE utf8mb4_bin COMMENT '评论列表; [{}, {}] (后期再做)',
  `ticketRequestAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '申请时间; E.g: 2021-05-28T10:24:54+08:00',
  `ticketRequestByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '申请人Id',
  `ticketRequestByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '申请人',
  `ticketStatus` varchar(255) COLLATE utf8mb4_bin DEFAULT '申请' COMMENT '工单状态; 申请、处理中、完成、拒绝、忽略(可以拓展审批状态)',
  `ticketStatusAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '处理时间; E.g: 2021-05-28T10:24:54+08:00',
  `ticketStatusDesc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '处理描述; 拒绝描述',
  `ticketStatusByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '处理人Id',
  `ticketStatusByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '处理人',

   `ticketAuditUserIdList` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '审核用户ID列表; 多个用英文逗号分隔',
  `ticketAuditedUserIdList` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '已审核用户ID列表; 多个用英文逗号分隔',
  `ticketAuditConfig` text COLLATE utf8mb4_bin COMMENT '审核配置; { "ticketAuditUserIdList": ["xxx", "xxx"], "ticketAuditedUserIdList": ["xxx", "xxx"] }',

  `operation` varchar(255) COLLATE utf8mb4_bin DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC COMMENT='工单表;';

CREATE TABLE `workflow` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idSequence` int(11) DEFAULT NULL COMMENT '自增ID, 1001++',
  `workflowId` varchar(255) DEFAULT NULL COMMENT '流程ID',
  `workflowName` varchar(255) DEFAULT NULL COMMENT '流程名',
  `workflowForm` text COMMENT 'form表单',
  `workflowConfig` text COMMENT '流程线路节点',
  `workflowCategory` varchar(255) DEFAULT NULL COMMENT '分类ID',
  `workflowRemark` varchar(1024) DEFAULT NULL COMMENT '备注',
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作: insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC COMMENT='工单流程表;';

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

CREATE TABLE `notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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