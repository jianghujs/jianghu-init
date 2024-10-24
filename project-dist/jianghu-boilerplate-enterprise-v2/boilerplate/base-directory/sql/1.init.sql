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
# SCHEMA DUMP FOR TABLE: _constant
# ------------------------------------------------------------

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
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_bin ROW_FORMAT = DYNAMIC COMMENT = '常量表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _constant
# ------------------------------------------------------------

INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'directoryConfig',NULL,NULL,'[{\"name\":\"江湖System\",\"children\":[{\"name\":\"系统管理\",\"icon\":\"/upload/appIcon/1703261181766_144941_Frame33.svg\",\"children\":[{\"name\":\"用户管理\",\"appId\":\"system\",\"pageId\":\"userManagement\",\"type\":\"page\"},{\"name\":\"应用管理\",\"appId\":\"system\",\"pageId\":\"appManagement\",\"type\":\"page\"},{\"name\":\"[组织权限]组织管理\",\"appId\":\"system\",\"pageId\":\"groupManagement\",\"type\":\"page\"},{\"name\":\"[组织权限]组织权限分配\",\"appId\":\"system\",\"pageId\":\"groupAuthorityManagement\",\"type\":\"page\"},{\"name\":\"[组织权限]组织人员\",\"appId\":\"system\",\"pageId\":\"groupUserManagement\",\"type\":\"page\"}]},{\"name\":\"数据中心管理\",\"icon\":\"/upload/appIcon/1703261188096_942772_Frame32.svg\",\"children\":[{\"name\":\"同步表管理\",\"appId\":\"data-repository\",\"pageId\":\"tableSyncConfig\",\"type\":\"page\"},{\"name\":\"合并表管理\",\"appId\":\"data-repository\",\"pageId\":\"tableMergeConfig\",\"type\":\"page\"},{\"name\":\"同步日志\",\"appId\":\"data-repository\",\"pageId\":\"tableSyncLog\",\"type\":\"page\"},{\"name\":\"MYSQL触发器\",\"appId\":\"data-repository\",\"pageId\":\"mysqlTrigger\",\"type\":\"page\"}]}]},{\"name\":\"江湖CRM\",\"children\":[{\"name\":\"CRM-线索\",\"icon\":\"/upload/appIcon/1703317583337_102720_Frame.svg\",\"children\":[{\"name\":\"[线索]线索管理\",\"appId\":\"jianghu-crm\",\"pageId\":\"leads\",\"type\":\"page\"},{\"name\":\"[线索]线索池\",\"appId\":\"jianghu-crm\",\"pageId\":\"leadsSeas\",\"type\":\"page\"}]},{\"name\":\"CRM-客户\",\"icon\":\"/upload/appIcon/1703317590595_435618_Frame.svg\",\"children\":[{\"name\":\"[客户]客户公海\",\"appId\":\"jianghu-crm\",\"pageId\":\"customerSeas\",\"type\":\"page\"},{\"name\":\"[客户]客户管理\",\"appId\":\"jianghu-crm\",\"pageId\":\"customer\",\"type\":\"page\"},{\"name\":\"联系人\",\"appId\":\"jianghu-crm\",\"pageId\":\"contacts\",\"type\":\"page\"},{\"name\":\"回访\",\"appId\":\"jianghu-crm\",\"pageId\":\"visit\",\"type\":\"page\"}]},{\"name\":\"CRM-商机\",\"icon\":\"/upload/appIcon/1703261343244_300526_Frame.svg\",\"children\":[{\"name\":\"商机\",\"appId\":\"jianghu-crm\",\"pageId\":\"business\",\"type\":\"page\"},{\"name\":\"合同\",\"appId\":\"jianghu-crm\",\"pageId\":\"contract\",\"type\":\"page\"},{\"name\":\"[回款]回款管理\",\"appId\":\"jianghu-crm\",\"pageId\":\"receivables\",\"type\":\"page\"},{\"name\":\"发票\",\"appId\":\"jianghu-crm\",\"pageId\":\"invoice\",\"type\":\"page\"},{\"name\":\"产品\",\"appId\":\"jianghu-crm\",\"pageId\":\"product\",\"type\":\"page\"},{\"name\":\"营销\",\"appId\":\"jianghu-crm\",\"pageId\":\"marketing\",\"type\":\"page\"}]}]},{\"name\":\"江湖ERP\",\"children\":[{\"name\":\"进销存-采购\",\"icon\":\"/upload/appIcon/1703257733458_888968_Frame.svg\",\"children\":[{\"name\":\"[采购]供货商列表\",\"appId\":\"jianghu-erp\",\"pageId\":\"supplierManagement\",\"type\":\"page\"},{\"name\":\"[采购]采购订单\",\"appId\":\"jianghu-erp\",\"pageId\":\"purchaseOrderManagement\",\"type\":\"page\"},{\"name\":\"[采购]采购退货订单\",\"appId\":\"jianghu-erp\",\"pageId\":\"purchaseReturnOrderManagement\",\"type\":\"page\"}]},{\"name\":\"进销存-销售\",\"icon\":\"/upload/appIcon/1703257725194_856355_Frame.svg\",\"children\":[{\"name\":\"[销售]客户列表\",\"appId\":\"jianghu-erp\",\"pageId\":\"customerManagement\",\"type\":\"page\"},{\"name\":\"[销售]销售退货订单\",\"appId\":\"jianghu-erp\",\"pageId\":\"salesReturnOrderManagement\",\"type\":\"page\"},{\"name\":\"[销售]销售订单\",\"appId\":\"jianghu-erp\",\"pageId\":\"saleOrderManagement\",\"type\":\"page\"}]},{\"name\":\"进销存-库存仓库\",\"icon\":\"/upload/appIcon/1703257738330_892661_Frame.svg\",\"children\":[{\"name\":\"[库存仓库]库存管理\",\"appId\":\"jianghu-erp\",\"pageId\":\"warehouseInventoryManagement\",\"type\":\"page\"},{\"name\":\"[库存仓库]仓库管理\",\"appId\":\"jianghu-erp\",\"pageId\":\"warehouseManagement\",\"type\":\"page\"},{\"name\":\"[库存仓库]申请单\",\"appId\":\"jianghu-erp\",\"pageId\":\"warehouseTicketRequest\",\"type\":\"page\"},{\"name\":\"[库存仓库]出入库单【打印】\",\"appId\":\"jianghu-erp\",\"pageId\":\"warehouseInventoryRecordOfOrder\",\"type\":\"page\"},{\"name\":\"[库存仓库]出入库记录\",\"appId\":\"jianghu-erp\",\"pageId\":\"warehouseInventoryRecordOfProduct\",\"type\":\"page\"}]},{\"name\":\"进销存-资产仓库\",\"icon\":\"/upload/appIcon/1703257743399_390030_Frame.svg\",\"children\":[{\"name\":\"[资产仓库]资产管理\",\"appId\":\"jianghu-erp\",\"pageId\":\"warehouseAssetManagement\",\"type\":\"page\"},{\"name\":\"[资产仓库]资产记录\",\"appId\":\"jianghu-erp\",\"pageId\":\"warehouseAssetRecord\",\"type\":\"page\"},{\"name\":\"[资产仓库]申请单\",\"appId\":\"jianghu-erp\",\"pageId\":\"assetTicketRequest\",\"type\":\"page\"}]},{\"name\":\"进销存-财务凭证\",\"icon\":\"/upload/appIcon/1703257709266_597029_Frame107.svg\",\"children\":[{\"name\":\"[财务凭证]资产价值管理\",\"appId\":\"jianghu-erp\",\"pageId\":\"assetFinanceManagement\",\"type\":\"page\"},{\"name\":\"[财务凭证]凭证生成\",\"appId\":\"jianghu-erp\",\"pageId\":\"voucherGenerate\",\"type\":\"page\"},{\"name\":\"[财务凭证]资产折旧明细表\",\"appId\":\"jianghu-erp\",\"pageId\":\"assetRecord\",\"type\":\"page\"},{\"name\":\"[财务凭证]资产汇总\",\"appId\":\"jianghu-erp\",\"pageId\":\"assetSummary\",\"type\":\"page\"},{\"name\":\"[财务凭证]资产核对总账\",\"appId\":\"jianghu-erp\",\"pageId\":\"assetCheck\",\"type\":\"page\"},{\"name\":\"[财务凭证]资产类别管理\",\"appId\":\"jianghu-erp\",\"pageId\":\"assetTypeManagement\",\"type\":\"page\"},{\"name\":\"[财务凭证]资产报废\",\"appId\":\"jianghu-erp\",\"pageId\":\"assetScrapped\",\"type\":\"page\"}]},{\"name\":\"进销存-财务收付款\",\"icon\":\"/upload/appIcon/1703257747702_877435_Frame.svg\",\"children\":[{\"name\":\"[财务收款付款]收款管理\",\"appId\":\"jianghu-erp\",\"pageId\":\"paymentOfReceipt\",\"type\":\"page\"},{\"name\":\"[财务收款付款]付款管理\",\"appId\":\"jianghu-erp\",\"pageId\":\"paymentOfPay\",\"type\":\"page\"},{\"name\":\"[财务收款付款]申请单\",\"appId\":\"jianghu-erp\",\"pageId\":\"paymentTicketRequest\",\"type\":\"page\"}]}]},{\"name\":\"江湖Finance\",\"children\":[{\"name\":\"财务-凭证\",\"icon\":\"/upload/appIcon/1703260995452_354002_Frame108.svg\",\"children\":[{\"name\":\"凭证\",\"appId\":\"jh-finance\",\"pageId\":\"voucher-voucherManagement\",\"type\":\"page\"},{\"name\":\"结账\",\"appId\":\"jh-finance\",\"pageId\":\"checkout-periodCheckout\",\"type\":\"page\"},{\"name\":\"发票\",\"appId\":\"jh-finance\",\"pageId\":\"invoice-invoiceManagement\",\"type\":\"page\"}]},{\"name\":\"财务-账簿\",\"icon\":\"/upload/appIcon/1703261000247_747653_Frame.svg\",\"children\":[{\"name\":\"[账薄]总账\",\"appId\":\"jh-finance\",\"pageId\":\"account-generalLedger\",\"type\":\"page\"},{\"name\":\"[账薄]序时账\",\"appId\":\"jh-finance\",\"pageId\":\"account-chronological\",\"type\":\"page\"},{\"name\":\"[账薄]科目汇总\",\"appId\":\"jh-finance\",\"pageId\":\"account-subjectSummary\",\"type\":\"page\"},{\"name\":\"[账薄]核算项目明细账\",\"appId\":\"jh-finance\",\"pageId\":\"account-auxiliaryDetailedLedger\",\"type\":\"page\"},{\"name\":\"[账薄]核算项目余额\",\"appId\":\"jh-finance\",\"pageId\":\"account-auxiliaryBalanceSheet\",\"type\":\"page\"},{\"name\":\"[账薄]多栏明细账\",\"appId\":\"jh-finance\",\"pageId\":\"account-multicolumnLedger\",\"type\":\"page\"},{\"name\":\"[账薄]科目余额\",\"appId\":\"jh-finance\",\"pageId\":\"account-subjectBalance\",\"type\":\"page\"},{\"name\":\"[账薄]明细账\",\"appId\":\"jh-finance\",\"pageId\":\"account-subjectDetail\",\"type\":\"page\"}]},{\"name\":\"财务-报表\",\"icon\":\"/upload/appIcon/1703260983947_449744_Frame102.svg\",\"children\":[{\"name\":\"[报表]资产负债\",\"appId\":\"jh-finance\",\"pageId\":\"report-assetLiability\",\"type\":\"page\"},{\"name\":\"[报表]利润\",\"appId\":\"jh-finance\",\"pageId\":\"report-profit\",\"type\":\"page\"},{\"name\":\"[报表]利润季报\",\"appId\":\"jh-finance\",\"pageId\":\"report-profitQuarter\",\"type\":\"page\"},{\"name\":\"[报表]现金流量季报\",\"appId\":\"jh-finance\",\"pageId\":\"report-cashFlowQuarter\",\"type\":\"page\"},{\"name\":\"[报表]附-去年凭证\",\"appId\":\"jh-finance\",\"pageId\":\"report-subjectBalanceYearStartAdjust\",\"type\":\"page\"},{\"name\":\"[报表]财务概要信息\",\"appId\":\"jh-finance\",\"pageId\":\"report-summary\",\"type\":\"page\"},{\"name\":\"[报表]部门利润表\",\"appId\":\"jh-finance\",\"pageId\":\"report-profitDept\",\"type\":\"page\"},{\"name\":\"[报表]项目利润表\",\"appId\":\"jh-finance\",\"pageId\":\"report-profitProject\",\"type\":\"page\"},{\"name\":\"[报表]现金流量\",\"appId\":\"jh-finance\",\"pageId\":\"report-cashFlow3\",\"type\":\"page\"}]},{\"name\":\"财务-工资\",\"icon\":\"/upload/appIcon/1703318818602_597150_Frame222.svg\",\"children\":[{\"name\":\"[工资]员工管理\",\"appId\":\"jh-finance\",\"pageId\":\"salary-employeeManagement\",\"type\":\"page\"},{\"name\":\"[工资]工资管理\",\"appId\":\"jh-finance\",\"pageId\":\"salary-salaryManagement\",\"type\":\"page\"},{\"name\":\"[工资]五险一金配置\",\"appId\":\"jh-finance\",\"pageId\":\"salary-insuranceConfigManagement\",\"type\":\"page\"}]},{\"name\":\"财务-资金\",\"icon\":\"/upload/appIcon/1703260973401_410194_Frame.svg\",\"children\":[{\"name\":\"[资金]账户设置\",\"appId\":\"jh-finance\",\"pageId\":\"fundAccountManagement\",\"type\":\"page\"},{\"name\":\"[资金]账户日记帐\",\"appId\":\"jh-finance\",\"pageId\":\"fundAccountEntryManagement\",\"type\":\"page\"},{\"name\":\"[资金]内部转账\",\"appId\":\"jh-finance\",\"pageId\":\"fundAccountTransferEntryManagement\",\"type\":\"page\"},{\"name\":\"[资金]资金报表\",\"appId\":\"jh-finance\",\"pageId\":\"fundStatementManagement\",\"type\":\"page\"},{\"name\":\"[资金]核对总账\",\"appId\":\"jh-finance\",\"pageId\":\"fundLedgerManagement\",\"type\":\"page\"}]}]},{\"name\":\"江湖审计\",\"children\":[{\"name\":\"审计\",\"icon\":\"/upload/appIcon/1703260973401_410194_Frame.svg\",\"children\":[{\"name\":\"下载Window版审计软件\",\"type\":\"page\",\"link\":\"https://demo.jianghujs.org/jianghu-audit/public/appPackage/JiangHu审计软件.exe\"},{\"name\":\"下载Mac版审计软件\",\"type\":\"page\",\"link\":\"https://demo.jianghujs.org/jianghu-audit/public/appPackage/JiangHu审计软件.dmg\"}]}]},{\"name\":\"江湖HR\",\"children\":[{\"name\":\"人资-组织员工\",\"icon\":\"/upload/appIcon/1703261246451_578154_affiliate-marketing1.svg\",\"children\":[{\"name\":\"[员工组织]员工管理\",\"appId\":\"jianghu-hr\",\"pageId\":\"employeeManagement\",\"type\":\"page\"},{\"name\":\"[员工组织]员工组织管理\",\"appId\":\"jianghu-hr\",\"pageId\":\"memberOrgRoleManagement\",\"type\":\"page\"},{\"name\":\"[员工组织]员工离职批准\",\"appId\":\"jianghu-hr\",\"pageId\":\"employeeDepartApproved\",\"type\":\"page\"},{\"name\":\"工作台\",\"appId\":\"jianghu-hr\",\"pageId\":\"workbench\",\"type\":\"page\"}]},{\"name\":\"人资-薪资\",\"icon\":\"/upload/appIcon/1703261242449_865685_Frame.svg\",\"children\":[{\"name\":\"[薪资]薪资组\",\"appId\":\"jianghu-hr\",\"pageId\":\"salaryGroupManagement\",\"type\":\"page\"},{\"name\":\"[薪资]计薪规则\",\"appId\":\"jianghu-hr\",\"pageId\":\"salaryTaxRuleManagement\",\"type\":\"page\"},{\"name\":\"[薪资]薪资档案\",\"appId\":\"jianghu-hr\",\"pageId\":\"archivesManagement\",\"type\":\"page\"},{\"name\":\"[薪资]薪资管理\",\"appId\":\"jianghu-hr\",\"pageId\":\"monthEmpRecord\",\"type\":\"page\"},{\"name\":\"[薪资]历史工资\",\"appId\":\"jianghu-hr\",\"pageId\":\"slipRecordManagement\",\"type\":\"page\"},{\"name\":\"[薪资]发放记录2\",\"appId\":\"jianghu-hr\",\"pageId\":\"salarySlipManagement\",\"type\":\"page\"},{\"name\":\"[薪资]历史工资明细\",\"appId\":\"jianghu-hr\",\"pageId\":\"monthEmpHistory\",\"type\":\"page\"},{\"name\":\"[薪资]薪资导入\",\"appId\":\"jianghu-hr\",\"pageId\":\"salaryImport\",\"type\":\"page\"}]},{\"name\":\"人资-绩效\",\"icon\":\"/upload/appIcon/1703261238174_918265_Frame.svg\",\"children\":[{\"name\":\"[绩效]考核管理(开发中)\",\"appId\":\"jianghu-hr\",\"pageId\":\"performanceManagement\",\"type\":\"page\"},{\"name\":\"[绩效]绩效档案(开发中)\",\"appId\":\"jianghu-hr\",\"pageId\":\"archivesSetup\",\"type\":\"page\"},{\"name\":\"[绩效]考核打分\",\"appId\":\"jianghu-hr\",\"pageId\":\"performanceEmployeeRateManagement\",\"type\":\"page\"},{\"name\":\"[绩效]考勤管理(开发中)\",\"appId\":\"jianghu-hr\",\"pageId\":\"clockManagement\",\"type\":\"page\"},{\"name\":\"[绩效]考核模板\",\"appId\":\"jianghu-hr\",\"pageId\":\"performanceTemplate\",\"type\":\"page\"},{\"name\":\"[绩效]考核计划 (开发中)\",\"appId\":\"jianghu-hr\",\"pageId\":\"appraisalPlanManagement\",\"type\":\"page\"}]},{\"name\":\"人资-招聘\",\"icon\":\"/upload/appIcon/1703261234347_613283_Frame.svg\",\"children\":[{\"name\":\"[招聘]投递简历列表\",\"appId\":\"jianghu-hr\",\"pageId\":\"jobResumeManagement\",\"type\":\"page\"},{\"name\":\"[招聘]岗位详情-web\",\"appId\":\"jianghu-hr\",\"pageId\":\"detail\",\"type\":\"page\"},{\"name\":\"[招聘]招聘列表-web\",\"appId\":\"jianghu-hr\",\"pageId\":\"jobs\",\"type\":\"page\"},{\"name\":\"[招聘]填写简历-web\",\"appId\":\"jianghu-hr\",\"pageId\":\"form\",\"type\":\"page\"},{\"name\":\"[招聘]招聘职位的候选人\",\"appId\":\"jianghu-hr\",\"pageId\":\"jobResumeOfJobPosition\",\"type\":\"page\"},{\"name\":\"简历预览\",\"appId\":\"jianghu-hr\",\"pageId\":\"jobResumePreview\",\"type\":\"page\"},{\"name\":\"[招聘]招聘职位管理\",\"appId\":\"jianghu-hr\",\"pageId\":\"jobPostingsManagement\",\"type\":\"page\"}]},{\"name\":\"人资-社保\",\"icon\":\"/upload/appIcon/1703261230192_358855_Frame.svg\",\"children\":[{\"name\":\"[社保]社保方案\",\"appId\":\"jianghu-hr\",\"pageId\":\"insuranceSchemeSetup\",\"type\":\"page\"},{\"name\":\"[社保]月社保详情\",\"appId\":\"jianghu-hr\",\"pageId\":\"insuranceSchemeDetail\",\"type\":\"page\"},{\"name\":\"[社保]社保管理\",\"appId\":\"jianghu-hr\",\"pageId\":\"insuranceSchemeManagement\",\"type\":\"page\"}]}]},{\"name\":\"江湖BI\",\"children\":[{\"name\":\"仪表盘\",\"icon\":\"/upload/appIcon/1703261060813_230915_Frame110.svg\",\"children\":[{\"name\":\"仪表盘\",\"appId\":\"jianghu-bi\",\"pageId\":\"workbench\",\"type\":\"page\"},{\"name\":\"[办公分析]日志分析\",\"appId\":\"jianghu-bi\",\"pageId\":\"workLog\",\"type\":\"page\"},{\"name\":\"[办公分析]审批分析\",\"appId\":\"jianghu-bi\",\"pageId\":\"workApproval\",\"type\":\"page\"},{\"name\":\"[排行榜]合同金额排行\",\"appId\":\"jianghu-bi\",\"pageId\":\"topContractMoney\",\"type\":\"page\"},{\"name\":\"[排行榜]回款金额排行\",\"appId\":\"jianghu-bi\",\"pageId\":\"topReturnedMoney\",\"type\":\"page\"}]},{\"name\":\"员工分析\",\"icon\":\"/upload/appIcon/1703261060813_230915_Frame110.svg\",\"children\":[{\"name\":\"[员工客户分析]客户问题分析\",\"appId\":\"jianghu-bi\",\"pageId\":\"customerGross\",\"type\":\"page\"},{\"name\":\"[员工客户分析]客户转化率分析\",\"appId\":\"jianghu-bi\",\"pageId\":\"customerCvr\",\"type\":\"page\"},{\"name\":\"[员工业绩分析]合同数量分析\",\"appId\":\"jianghu-bi\",\"pageId\":\"staffContractNum\",\"type\":\"page\"},{\"name\":\"[员工业绩分析]发票统计分析\",\"appId\":\"jianghu-bi\",\"pageId\":\"staffInvoice\",\"type\":\"page\"}]},{\"name\":\"销售分析\",\"icon\":\"/upload/appIcon/1703261060813_230915_Frame110.svg\",\"children\":[{\"name\":\"[销售漏斗分析]新增商机分析\",\"appId\":\"jianghu-bi\",\"pageId\":\"sellBusiness\",\"type\":\"page\"},{\"name\":\"[销售漏斗分析]销售漏斗\",\"appId\":\"jianghu-bi\",\"pageId\":\"sellFunnel\",\"type\":\"page\"},{\"name\":\"[客户画像分析]客户行业分析\",\"appId\":\"jianghu-bi\",\"pageId\":\"customerIndustry\",\"type\":\"page\"},{\"name\":\"[客户画像分析]客户来源分析\",\"appId\":\"jianghu-bi\",\"pageId\":\"customerSource\",\"type\":\"page\"},{\"name\":\"[产品分析]产品销售情况统计\",\"appId\":\"jianghu-bi\",\"pageId\":\"productSell\",\"type\":\"page\"},{\"name\":\"[产品分析]产品分类销量统计\",\"appId\":\"jianghu-bi\",\"pageId\":\"productCategory\",\"type\":\"page\"}]}]},{\"name\":\"江湖PM\",\"children\":[{\"name\":\"江湖PM\",\"icon\":\"/upload/appIcon/1703261347662_795539_Frame.svg\",\"children\":[{\"name\":\"工作台\",\"appId\":\"jianghu-pm\",\"pageId\":\"workbenchManagement\",\"type\":\"page\"},{\"name\":\"项目\",\"appId\":\"jianghu-pm\",\"pageId\":\"projectManagement\",\"type\":\"page\"},{\"name\":\"回收站\",\"appId\":\"jianghu-pm\",\"pageId\":\"projectRecycledManagement\",\"type\":\"page\"},{\"name\":\"归档项目\",\"appId\":\"jianghu-pm\",\"pageId\":\"projectArchiveManagement\",\"type\":\"page\"}]}]},{\"name\":\"江湖OA\",\"children\":[{\"name\":\"办公管理\",\"icon\":\"/upload/appIcon/1703261184705_824498_Frame31.svg\",\"children\":[{\"name\":\"任务\",\"appId\":\"jianghu-oa\",\"pageId\":\"taskManagement\",\"type\":\"page\"},{\"name\":\"[审批]全部审批\",\"appId\":\"jianghu-oa\",\"pageId\":\"ticketManagement\",\"type\":\"page\"},{\"name\":\"日志\",\"appId\":\"jianghu-oa\",\"pageId\":\"journalManagement\",\"type\":\"page\"},{\"name\":\"通知\",\"appId\":\"jianghu-oa\",\"pageId\":\"noticeManagement\",\"type\":\"page\"}]}]},{\"name\":\"江湖Doc\",\"children\":[{\"name\":\"用户端\",\"icon\":\"/upload/appIcon/1703261184705_824498_Frame31.svg\",\"children\":[{\"name\":\"首页\",\"type\":\"page\",\"link\":\"https://demo.jianghujs.org/jianghu-doc/page/xfArticle/5719\"}]},{\"name\":\"管理端\",\"icon\":\"/upload/appIcon/1703261184705_824498_Frame31.svg\",\"children\":[{\"name\":\"文章管理\",\"appId\":\"jianghu-doc-admin\",\"pageId\":\"articleManagement\",\"type\":\"page\"},{\"name\":\"素材管理\",\"appId\":\"jianghu-doc-admin\",\"pageId\":\"materialManagement\",\"type\":\"page\"}]}]},{\"name\":\"暴风-在线教学\",\"children\":[{\"name\":\"暴风-课程管理\",\"icon\":\"/upload/appIcon/1703748304268_924657_Frame.svg\",\"children\":[{\"name\":\"课程列表\",\"appId\":\"baofeng-course-mgmt\",\"pageId\":\"courseList\",\"type\":\"page\"},{\"name\":\"文章列表\",\"appId\":\"baofeng-course-mgmt\",\"pageId\":\"articleList\",\"type\":\"page\"},{\"name\":\"考卷列表\",\"appId\":\"baofeng-course-mgmt\",\"pageId\":\"examList\",\"type\":\"page\"},{\"name\":\"素材库\",\"appId\":\"baofeng-course-mgmt\",\"pageId\":\"mediaLibrary\",\"type\":\"page\"}]},{\"name\":\"暴风-学生端\",\"icon\":\"/upload/appIcon/1703261137115_652191_Frame.svg\",\"children\":[{\"name\":\"课程列表\",\"appId\":\"baofeng-student\",\"pageId\":\"courseList\",\"type\":\"page\"},{\"name\":\"课程列表\",\"appId\":\"baofeng-student\",\"pageId\":\"courseList\",\"type\":\"page\"},{\"name\":\"学习内容\",\"appId\":\"baofeng-student\",\"pageId\":\"courseArticleList\",\"type\":\"page\"},{\"name\":\"学习记录\",\"appId\":\"baofeng-student\",\"pageId\":\"my/studyRecord\",\"type\":\"page\"}]},{\"name\":\"暴风-系统管理\",\"icon\":\"/upload/appIcon/1703261148618_256511_Frame109.svg\",\"children\":[{\"name\":\"用户管理\",\"appId\":\"baofeng-sys-admin\",\"pageId\":\"userManagement\",\"type\":\"page\"},{\"name\":\"成员管理\",\"appId\":\"baofeng-sys-admin\",\"pageId\":\"memberManagement\",\"type\":\"page\"},{\"name\":\"课程管理\",\"appId\":\"baofeng-sys-admin\",\"pageId\":\"courseSeriesManagement\",\"type\":\"page\"},{\"name\":\"班级管理\",\"appId\":\"baofeng-sys-admin\",\"pageId\":\"courseClassManagement\",\"type\":\"page\"}]},{\"name\":\"暴风-老师端\",\"icon\":\"/upload/appIcon/1703261106539_404456_Frame.svg\",\"children\":[{\"name\":\"出勤记录\",\"appId\":\"baofeng-teacher\",\"pageId\":\"attendanceRecord\",\"type\":\"page\"},{\"name\":\"我的学员\",\"appId\":\"baofeng-teacher\",\"pageId\":\"myStudentList\",\"type\":\"page\"},{\"name\":\"学员提醒\",\"appId\":\"baofeng-teacher\",\"pageId\":\"studentWarn\",\"type\":\"page\"},{\"name\":\"教师提醒\",\"appId\":\"baofeng-teacher\",\"pageId\":\"teacherWarn\",\"type\":\"page\"},{\"name\":\"批改笔记\",\"appId\":\"baofeng-teacher\",\"pageId\":\"noteManagement\",\"type\":\"page\"},{\"name\":\"批改考试\",\"appId\":\"baofeng-teacher\",\"pageId\":\"examManagement\",\"type\":\"page\"},{\"name\":\"批改作业\",\"appId\":\"baofeng-teacher\",\"pageId\":\"assignmentManagement\",\"type\":\"page\"}]}]},{\"name\":\"飓风-知识付费\",\"children\":[{\"name\":\"飓风-课程管理-审核\",\"icon\":\"/upload/appIcon/1703260754759_136114_Frame.svg\",\"children\":[{\"name\":\"[审核管理]资料审核\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"audit-materialManagement\",\"type\":\"page\"},{\"name\":\"[审核管理]新闻审核\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"audit-newsManagement\",\"type\":\"page\"},{\"name\":\"[审核管理]练习审核\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"audit-assignmentManagement\",\"type\":\"page\"},{\"name\":\"[审核管理]课程审核\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"audit-courseManagement\",\"type\":\"page\"},{\"name\":\"[审核管理]文章审核\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"audit-articleManagement\",\"type\":\"page\"},{\"name\":\"[审核管理]考试审核\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"audit-examManagement\",\"type\":\"page\"}]},{\"name\":\"飓风-课程管理-课程\",\"icon\":\"/upload/appIcon/1703260775861_127309_Frame.svg\",\"children\":[{\"name\":\"课程分类\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"courseCategoryManagement\",\"type\":\"page\"},{\"name\":\"[商品管理]分类列表\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"store-categoryList\",\"type\":\"page\"},{\"name\":\"[商品管理]商品列表\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"store-goodsList\",\"type\":\"page\"}]},{\"name\":\"飓风-课程管理-运营\",\"icon\":\"/upload/appIcon/1703260772790_669360_Frame.svg\",\"children\":[{\"name\":\"[运营配置]首页\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"config-homeRecommend\",\"type\":\"page\"},{\"name\":\"[运营配置]其他\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"config-constantUI\",\"type\":\"page\"},{\"name\":\"商品编辑页\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"goodsEdit\",\"type\":\"page\"},{\"name\":\"[商品管理]评论列表\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"store-goodsCommentList\",\"type\":\"page\"}]},{\"name\":\"飓风-课程管理-订单\",\"icon\":\"/upload/appIcon/1703260780804_969956_Frame.svg\",\"children\":[{\"name\":\"[订单查询]课程订单\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"order-courseOrderManagement\",\"type\":\"page\"},{\"name\":\"[订单查询]考试订单\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"order-examOrderManagement\",\"type\":\"page\"},{\"name\":\"[订单查询]资料订单\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"order-meterialOrderManagement\",\"type\":\"page\"},{\"name\":\"[订单查询]商品订单\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"order-productOrderManagement\",\"type\":\"page\"},{\"name\":\"[订单查询]售后订单\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"order-afterSaleOrderManagement\",\"type\":\"page\"},{\"name\":\"订单详情\",\"appId\":\"jufeng-mgmt\",\"pageId\":\"orderDetail\",\"type\":\"page\"}]},{\"name\":\"飓风-学生端-我的\",\"icon\":\"/upload/appIcon/1703260822901_277052_Frame.svg\",\"children\":[{\"name\":\"我的\",\"appId\":\"jufeng-student\",\"pageId\":\"my/index\",\"type\":\"page\"},{\"name\":\"我的课程\",\"appId\":\"jufeng-student\",\"pageId\":\"my/course\",\"type\":\"page\"},{\"name\":\"我的收藏\",\"appId\":\"jufeng-student\",\"pageId\":\"my/collect\",\"type\":\"page\"},{\"name\":\"地址列表\",\"appId\":\"jufeng-student\",\"pageId\":\"my/address\",\"type\":\"page\"}]},{\"name\":\"飓风-学生端-首页\",\"icon\":\"/upload/appIcon/1703260826707_119915_Frame.svg\",\"children\":[{\"name\":\"首页\",\"appId\":\"jufeng-student\",\"pageId\":\"index/index\",\"type\":\"page\"},{\"name\":\"课程列表\",\"appId\":\"jufeng-student\",\"pageId\":\"course/list\",\"type\":\"page\"},{\"name\":\"课程\",\"appId\":\"jufeng-student\",\"pageId\":\"special/special_cate\",\"type\":\"page\"},{\"name\":\"学习记录\",\"appId\":\"jufeng-student\",\"pageId\":\"my/studyRecord\",\"type\":\"page\"}]},{\"name\":\"飓风-学生端-商城\",\"icon\":\"/upload/appIcon/1703260830913_205102_Frame.svg\",\"children\":[{\"name\":\"商城\",\"appId\":\"jufeng-student\",\"pageId\":\"store/index\",\"type\":\"page\"},{\"name\":\"我的订单\",\"appId\":\"jufeng-student\",\"pageId\":\"my/order\",\"type\":\"page\"}]},{\"name\":\"飓风-学生端\",\"icon\":\"/upload/appIcon/1703260834513_805785_Frame.svg\",\"children\":[]},{\"name\":\"飓风-教师端-教学\",\"icon\":\"/upload/appIcon/1703260847179_493304_Frame.svg\",\"children\":[{\"name\":\"出勤记录\",\"appId\":\"jufeng-teacher\",\"pageId\":\"attendanceRecord\",\"type\":\"page\"},{\"name\":\"我的学员\",\"appId\":\"jufeng-teacher\",\"pageId\":\"myStudentList\",\"type\":\"page\"},{\"name\":\"学员提醒\",\"appId\":\"jufeng-teacher\",\"pageId\":\"studentWarn\",\"type\":\"page\"},{\"name\":\"教师提醒\",\"appId\":\"jufeng-teacher\",\"pageId\":\"teacherWarn\",\"type\":\"page\"}]},{\"name\":\"飓风-教师端-内容\",\"icon\":\"/upload/appIcon/1703260859545_455960_Frame.svg\",\"children\":[{\"name\":\"[内容管理]文章列表\",\"appId\":\"jufeng-teacher\",\"pageId\":\"article-articleList\",\"type\":\"page\"},{\"name\":\"[内容管理]考卷列表\",\"appId\":\"jufeng-teacher\",\"pageId\":\"article-examList\",\"type\":\"page\"},{\"name\":\"[内容管理]作业列表\",\"appId\":\"jufeng-teacher\",\"pageId\":\"article-assignmentList\",\"type\":\"page\"},{\"name\":\"[内容管理]资料列表\",\"appId\":\"jufeng-teacher\",\"pageId\":\"article-materialList\",\"type\":\"page\"},{\"name\":\"[内容管理]新闻列表\",\"appId\":\"jufeng-teacher\",\"pageId\":\"article-newsList\",\"type\":\"page\"}]},{\"name\":\"飓风-教师端-课程\",\"icon\":\"/upload/appIcon/1703260864585_588493_Frame.svg\",\"children\":[{\"name\":\"课程列表\",\"appId\":\"jufeng-teacher\",\"pageId\":\"courseManagement\",\"type\":\"page\"},{\"name\":\"课程文章列表\",\"appId\":\"jufeng-teacher\",\"pageId\":\"articleListByCourse\",\"type\":\"page\"},{\"name\":\"素材库\",\"appId\":\"jufeng-teacher\",\"pageId\":\"mediaLibrary\",\"type\":\"page\"},{\"name\":\"课程评论\",\"appId\":\"jufeng-teacher\",\"pageId\":\"courseCommentList\",\"type\":\"page\"}]},{\"name\":\"飓风-教师端-批改\",\"icon\":\"/upload/appIcon/1703260868480_408295_Frame.svg\",\"children\":[{\"name\":\"[内容批改]批改作业\",\"appId\":\"jufeng-teacher\",\"pageId\":\"review-assignmentList\",\"type\":\"page\"},{\"name\":\"[内容批改]批改笔记\",\"appId\":\"jufeng-teacher\",\"pageId\":\"review-noteList\",\"type\":\"page\"},{\"name\":\"[内容批改]批改考试\",\"appId\":\"jufeng-teacher\",\"pageId\":\"review-examList\",\"type\":\"page\"}]}]},{\"name\":\"客服-企业客服\",\"children\":[{\"name\":\"飞鸽-客服\",\"icon\":\"/upload/appIcon/1703318171323_529717_Frame101.svg\",\"children\":[{\"name\":\"聊天\",\"appId\":\"feige\",\"pageId\":\"index\",\"type\":\"page\"},{\"name\":\"客服管理\",\"appId\":\"feige\",\"pageId\":\"agentManagement\",\"type\":\"page\"},{\"name\":\"留言管理\",\"appId\":\"feige\",\"pageId\":\"visitorTicketManagement\",\"type\":\"page\"},{\"name\":\"访客资料\",\"appId\":\"feige\",\"pageId\":\"visitorManagement\",\"type\":\"page\"}]}]},{\"name\":\"军师-流量分析\",\"children\":[{\"name\":\"军师\",\"icon\":\"/upload/appIcon/1703261379432_922888_Frame86.svg\",\"children\":[{\"name\":\"网站管理\",\"appId\":\"junshi\",\"pageId\":\"websiteManagement\",\"type\":\"page\"}]}]}]','jhUpdate','admin','超级管理员','2024-03-19T23:20:02+08:00');
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'directoryList',NULL,NULL,'[]','insert',NULL,NULL,'2023-12-19T23:28:59+08:00');
INSERT INTO `_constant` (`id`,`constantKey`,`constantType`,`desc`,`constantValue`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4,'directoryUrl',NULL,NULL,'https://demo.jianghujs.org','insert',NULL,NULL,NULL);

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
  `pageHook` varchar(255) DEFAULT NULL,
  `sort` varchar(255) DEFAULT NULL,
  `operation` varchar(255) DEFAULT 'insert' COMMENT '操作; insert, update, jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 50 DEFAULT CHARSET = utf8mb4 COMMENT = '页面表; 软删除未启用;';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _page
# ------------------------------------------------------------

INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`pageHook`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (2,'help','帮助','helpV4',NULL,NULL,NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`pageHook`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (3,'login','登陆','loginV4',NULL,NULL,'{\r\n  \"beforeHook\":[\r\n    {\"field\": \"qyOauthUrl\", \"service\": \"wecom\", \"serviceFunc\": \"getOauthUrl\"}\r\n\t]\r\n}',NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`pageHook`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (6,'manual','操作手册',NULL,NULL,NULL,NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`pageHook`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (8,'directory','目录',NULL,'showInMenu',NULL,'{\"beforeHook\": [{\"service\": \"constant\", \"serviceFunc\": \"getConstantObj\", \"field\": \"constantObj\"}]}','1','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`pageHook`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (9,'changePassword','修改密码',NULL,'showInAvatarMenu',NULL,NULL,'3','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`pageHook`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (11,'directoryEditor','目录设置',NULL,'showInAvatarMenu',NULL,'{\"beforeHook\": [{\"service\": \"constant\", \"serviceFunc\": \"getConstantObj\", \"field\": \"constantObj\"}]}','2','insert',NULL,NULL,NULL);
INSERT INTO `_page` (`id`,`pageId`,`pageName`,`pageFile`,`pageType`,`pageIcon`,`pageHook`,`sort`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (49,'https://demo.jianghujs.org/task/page/noticeManagement','通知/待办',NULL,'showInRightMenu','<svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"> <g id=\"Frame 19\"> <path id=\"Vector\" d=\"M14 0C6.2695 0 0 6.2695 0 14C0 21.7305 6.2695 28 14 28C21.7305 28 28 21.7305 28 14C28 6.2695 21.7305 0 14 0Z\" fill=\"#5DB55F\"/> <g id=\"Frame\"> <path id=\"Vector_2\" d=\"M15.2698 19.44L15.307 19.4419C15.5022 19.4633 15.6398 19.6499 15.5895 19.8403L15.57 19.9088C15.3646 20.5638 14.7393 21.04 14.0001 21.04L13.9239 21.0384C13.193 21.0057 12.5866 20.5075 12.4103 19.8403L12.4033 19.8048C12.3758 19.6153 12.5284 19.44 12.7303 19.44H15.2698ZM14.0001 6.95996C14.1274 6.95996 14.2495 7.01053 14.3395 7.10055C14.4295 7.19057 14.4801 7.31266 14.4801 7.43996V7.94364C16.9402 8.191 18.8001 10.3545 18.8001 12.8556V16.24L18.802 16.288C18.8141 16.4489 18.8866 16.5994 19.0049 16.7091C19.1232 16.8189 19.2787 16.8799 19.4401 16.88H19.5543L19.6087 16.8816C20.0055 16.9065 20.3562 17.1993 20.3959 17.5974L20.3994 17.6486C20.4037 17.7562 20.3861 17.8635 20.3479 17.9642C20.3096 18.0648 20.2514 18.1567 20.1768 18.2343C20.1022 18.312 20.0127 18.3737 19.9137 18.4159C19.8146 18.4581 19.7081 18.4799 19.6004 18.48H8.44583L8.39143 18.4784C7.99463 18.4534 7.64391 18.1606 7.60423 17.7625L7.60071 17.7113C7.59649 17.6037 7.61404 17.4964 7.65231 17.3957C7.69058 17.295 7.74878 17.2031 7.82342 17.1255C7.89807 17.0479 7.98762 16.9861 8.0867 16.9439C8.18579 16.9017 8.29238 16.88 8.40007 16.88H8.56007L8.60807 16.8784C8.76908 16.8663 8.91956 16.7937 9.02935 16.6753C9.13914 16.5569 9.20012 16.4014 9.20007 16.24V12.72C9.20007 10.231 11.0945 8.1846 13.5201 7.94364V7.43996C13.5201 7.31266 13.5706 7.19057 13.6607 7.10055C13.7507 7.01053 13.8728 6.95996 14.0001 6.95996Z\" fill=\"white\"/> </g> </g> </svg>',NULL,NULL,'insert',NULL,NULL,NULL);

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _record_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `_record_history`;
CREATE TABLE `_record_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table` varchar(255) DEFAULT NULL COMMENT '表',
  `recordId` int(11) DEFAULT NULL COMMENT '数据在table中的主键id; recordContent.id',
  `recordContent` json NOT NULL COMMENT '数据JSON',
  `packageContent` json NOT NULL COMMENT '当时请求的 package JSON',
  `operation` varchar(255) DEFAULT NULL COMMENT '操作; jhInsert, jhUpdate, jhDelete jhRestore',
  `operationByUserId` varchar(255) DEFAULT NULL COMMENT '操作者userId; recordContent.operationByUserId',
  `operationByUser` varchar(255) DEFAULT NULL COMMENT '操作者用户名; recordContent.operationByUser',
  `operationAt` varchar(255) DEFAULT NULL COMMENT '操作时间; recordContent.operationAt; E.g: 2021-05-28T10:24:54+08:00 ',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `index_record_id` (`recordId`) USING BTREE,
  KEY `index_table_action` (`table`, `operation`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 730 DEFAULT CHARSET = utf8mb4 COMMENT = '数据历史表';


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
) ENGINE = InnoDB AUTO_INCREMENT = 268 DEFAULT CHARSET = utf8mb4 COMMENT = '请求资源表; 软删除未启用; resourceId=`${appId}.${pageId}.${actionId}`';


# ------------------------------------------------------------
# DATA DUMP FOR TABLE: _resource
# ------------------------------------------------------------

INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (4,NULL,NULL,'allPage','getConstantList','✅查询常量','sql','{}','{\"table\": \"_constant\", \"operation\": \"select\"}',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (10,NULL,'','login','wecomLogin','✅企微登陆','service','{}','{ \"service\": \"wecom\", \"serviceFunction\": \"login\" }','','','insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (105,NULL,NULL,'allPage','uploadFileDone','✅ 文件分片上传-所有分片上传完毕','service','{}','{ \"service\": \"file\", \"serviceFunction\": \"uploadFileDone\" }',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (106,NULL,NULL,'allPage','httpUploadByStream','✅ 文件分片上传-http文件流','service','{}','{ \"service\": \"file\", \"serviceFunction\": \"uploadFileChunkByStream\" }',NULL,NULL,'update',NULL,NULL,'2022-03-10T22:27:32+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (231,NULL,NULL,'login','passwordLogin','✅登陆','service',NULL,'{ \"service\": \"user\", \"serviceFunction\": \"passwordLogin\" }','{\"appData\":{\"pageId\":\"login\",\"actionId\":\"passwordLogin\",\"actionData\":{\"userId\":\"admin\",\"password\":\"123456\",\"deviceId\":\"127.0.0.1:7007_Mac.10.15.7_fbae8120_chrome\"},\"appId\":\"directory\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\"},\"packageId\":\"1677218075598_2695287\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1677218075598_2695287\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-24T13:54:35+08:00\",\"appData\":{\"authToken\":\"AUxhx6Z48Vgas6teOIqijUo-I5qpBikMIHu_\",\"deviceId\":\"127.0.0.1:7007_Mac.10.15.7_fbae8120_chrome\",\"userId\":\"admin\",\"resultData\":{\"authToken\":\"AUxhx6Z48Vgas6teOIqijUo-I5qpBikMIHu_\",\"deviceId\":\"127.0.0.1:7007_Mac.10.15.7_fbae8120_chrome\",\"userId\":\"admin\"},\"appId\":\"directory\",\"pageId\":\"login\",\"actionId\":\"passwordLogin\"}}','update',NULL,NULL,'2023-02-24T13:54:35+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (251,NULL,NULL,'allPage','logout','✅登出','service',NULL,'{ \"service\": \"user\", \"serviceFunction\": \"logout\" }','','','update',NULL,NULL,'2022-02-23T23:08:31+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (253,NULL,NULL,'allPage','userInfo','✅获取用户信息','service',NULL,'{ \"service\": \"user\", \"serviceFunction\": \"userInfo\" }','','','update',NULL,NULL,'2022-11-04T11:49:34+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (263,NULL,NULL,'directory','selectItemList','✅查询目录','service',NULL,'{ \"service\": \"directory\", \"serviceFunction\": \"getDirectoryList\" }','{\"appData\":{\"pageId\":\"directory\",\"actionId\":\"selectItemList\",\"orderBy\":[{\"column\":\"operationAt\",\"order\":\"desc\"}],\"appId\":\"directory\",\"userAgent\":\"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36\",\"actionData\":{}},\"packageId\":\"1677218143168_8084229\",\"packageType\":\"httpRequest\"}','{\"packageId\":\"1677218143168_8084229\",\"packageType\":\"httpResponse\",\"status\":\"success\",\"timestamp\":\"2023-02-24T13:55:43+08:00\",\"appData\":{\"resultData\":{\"rows\":[{\"id\":13,\"appId\":\"zhihu\",\"appName\":\"知乎\",\"appGroupName\":\"搜索\",\"appGroupNumber\":\"10\",\"appGroupItemSort\":\"01\",\"url\":\"https://www.zhihu.com/\",\"displayName\":\"有问题就会有答案\",\"description\":null,\"accessType\":\"public\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":14,\"appId\":\"baidu\",\"appName\":\"百度\",\"appGroupName\":\"搜索\",\"appGroupNumber\":\"10\",\"appGroupItemSort\":\"02\",\"url\":\"https://www.baidu.com\",\"displayName\":\"百度一下, 你就知道\",\"description\":null,\"accessType\":\"public\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":15,\"appId\":\"360\",\"appName\":\"360\",\"appGroupName\":\"搜索\",\"appGroupNumber\":\"10\",\"appGroupItemSort\":\"03\",\"url\":\"https://www.so.com/\",\"displayName\":\"最安全的搜索引擎\",\"description\":null,\"accessType\":\"public\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":16,\"appId\":\"sougou\",\"appName\":\"搜狗\",\"appGroupName\":\"搜索\",\"appGroupNumber\":\"10\",\"appGroupItemSort\":\"04\",\"url\":\"https://www.sogou.com/\",\"displayName\":\"上网从搜狗开始\",\"description\":null,\"accessType\":\"public\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null},{\"id\":53,\"appId\":\"data_repository\",\"appName\":\"数据中心管理\",\"appGroupName\":\"系统管理\",\"appGroupNumber\":\"20\",\"appGroupItemSort\":\"03\",\"url\":\"http://127.0.0.1:7005/data_repository/page/tableSyncConfig\",\"displayName\":\"数据同步表管理\",\"description\":null,\"accessType\":\"app\",\"operation\":\"insert\",\"operationByUserId\":null,\"operationByUser\":null,\"operationAt\":null}]},\"appId\":\"directory\",\"pageId\":\"directory\",\"actionId\":\"selectItemList\"}}','update',NULL,NULL,'2023-02-24T13:55:43+08:00');
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (264,NULL,NULL,'directoryEditor','selectAppList','✅查询app','sql',NULL,'{ \"table\": \"enterprise_app\", \"operation\": \"select\" }',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (265,NULL,NULL,'directoryEditor','saveDirectoryConfig','✅查询app','sql',NULL,'{\"table\": \"_constant\", \"operation\": \"jhUpdate\"}',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (266,NULL,NULL,'directoryEditor','insertDirectoryConfig','✅查询app','sql',NULL,'{\"table\": \"_constant\", \"operation\": \"jhInsert\"}',NULL,NULL,'insert',NULL,NULL,NULL);
INSERT INTO `_resource` (`id`,`accessControlTable`,`resourceHook`,`pageId`,`actionId`,`desc`,`resourceType`,`appDataSchema`,`resourceData`,`requestDemo`,`responseDemo`,`operation`,`operationByUserId`,`operationByUser`,`operationAt`) VALUES (267,NULL,'{ \"before\": [{ \"service\": \"changePassword\", \"serviceFunction\": \"appendPasswordToParams\" }], \"after\": [] }','changePassword','changePassword','✅修改密码','sql',NULL,'{\"table\": \"_system_user\", \"operation\": \"jhUpdate\"}',NULL,NULL,'insert',NULL,NULL,NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 63 DEFAULT CHARSET = utf8mb4 COMMENT = '用户session表; deviceId 维度;软删除未启用;';


# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: _view01_user_group_role
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `_view01_user_group_role` AS
select
  `{{dbPrefix}}data_repository`.`enterprise_user_group_role`.`id` AS `id`,
  `{{dbPrefix}}data_repository`.`enterprise_user_group_role`.`userId` AS `userId`,
  `{{dbPrefix}}data_repository`.`enterprise_user_group_role`.`groupId` AS `groupId`,
  `group`.`groupPath` AS `groupPath`,
  `group`.`groupName` AS `groupName`,
  `group`.`groupAllName` AS `groupAllName`,
  `{{dbPrefix}}data_repository`.`enterprise_user_group_role`.`roleId` AS `roleId`,
  `{{dbPrefix}}data_repository`.`enterprise_role`.`roleName` AS `roleName`,
  `{{dbPrefix}}data_repository`.`enterprise_role`.`roleType` AS `roleType`,
  `{{dbPrefix}}data_repository`.`enterprise_user_group_role`.`roleDeadline` AS `roleDeadline`
from
  (
  (
    `{{dbPrefix}}data_repository`.`enterprise_user_group_role`
    left join `{{dbPrefix}}data_repository`.`enterprise_role` on(
    (
      `{{dbPrefix}}data_repository`.`enterprise_user_group_role`.`roleId` = `{{dbPrefix}}data_repository`.`enterprise_role`.`roleId`
    )
    )
  )
  left join `{{dbPrefix}}data_repository`.`enterprise_group` `group` on(
    (
    `{{dbPrefix}}data_repository`.`enterprise_user_group_role`.`groupId` = `group`.`groupId`
    )
  )
  );



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterpirse_user_group_role_page
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `enterpirse_user_group_role_page` AS
select
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`id` AS `id`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`appId` AS `appId`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`user` AS `user`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`group` AS `group`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`role` AS `role`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`page` AS `page`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`allowOrDeny` AS `allowOrDeny`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`desc` AS `desc`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`operation` AS `operation`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`operationByUserId` AS `operationByUserId`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`operationByUser` AS `operationByUser`,
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`.`operationAt` AS `operationAt`
from
  `{{dbPrefix}}base_system`.`enterprise_user_group_role_page`;



# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: enterprise_app
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `enterprise_app` AS
select
  `{{dbPrefix}}base_system`.`enterprise_app`.`id` AS `id`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`appId` AS `appId`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`appDatabase` AS `appDatabase`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`appPageList` AS `appPageList`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`appPageDirectoryList` AS `appPageDirectoryList`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`appGroup` AS `appGroup`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`appName` AS `appName`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`appDesc` AS `appDesc`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`appUrl` AS `appUrl`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`appMenu` AS `appMenu`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`appType` AS `appType`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`operation` AS `operation`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`operationByUserId` AS `operationByUserId`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`operationByUser` AS `operationByUser`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`operationAt` AS `operationAt`,
  `{{dbPrefix}}base_system`.`enterprise_app`.`sort` AS `sort`
from
  `{{dbPrefix}}base_system`.`enterprise_app`;



