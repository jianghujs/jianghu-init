const Service = require('egg').Service;
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const { BizError, errorInfoEnum } = require('../constant/error');
const { tableEnum } = require('../constant/constant');
const _ = require('lodash');
const dayjs = require('dayjs');

const actionDataScheme = Object.freeze({
  handleTicketApply: {
    type: 'object',
    additionalProperties: true,
    required: ['taskId', 'remark', 'status'],
    properties: {
      taskId: { type: 'string' },
      remark: { type: 'string' },
      status: { type: 'string' },
    },
  }
});
class TicketService extends Service {
  async handleTicketApply(actionData) {
    validateUtil.validate(actionDataScheme.handleTicketApply, actionData);

    const { jianghuKnex } = this.app;
    const { userId, username } = this.ctx.userInfo;
    const { taskId, remark, status } = actionData;

    const task = await jianghuKnex(tableEnum.task).where({ taskId }).first();

    let auditedUsers = task.taskAuditedUserIdList ? task.taskAuditedUserIdList.split(',') : [];

    if (!auditedUsers.includes(userId)) {
      auditedUsers.push(userId);
    }
    const auditConfig = JSON.parse(task.taskAuditConfig);
    const noticeConfig = JSON.parse(task.taskNoticeConfig);
    const userAudit = auditConfig.find(item => item.userId === userId && !item.status);
    if (userAudit) {
      userAudit.username = username;
      userAudit.status = status;
      userAudit.remark = remark;
      userAudit.operationAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
    }
    const updateTaskData = {}

    // 只要有一个拒绝,就更新task状态
    const isAnyRefuse = auditConfig.some(item => item.status === '拒绝');
    if (isAnyRefuse) {
      updateTaskData.taskStatus = '已拒绝';
    }

    // 判断是否所有人都已经审核,并且status都是同意
    const isAllAudited = auditConfig.every(item => item.status === '同意');
    if (isAllAudited) {
      updateTaskData.taskStatus = '已完成';
    }

    // 使用事务更新
    await jianghuKnex.transaction(async trx => {
      // 通知下申请人
      // await this.ctx.service.notice.addNotice({
      //   taskMemberIdList: [task.taskManagerId],
      //   taskTitle: `审批进度提醒`,
      //   taskDesc: `${username} ${userAudit.status}了您<a>《${task.taskTitle}》</a>，请知晓`,
      // })

      // 更新task
      await jianghuKnex(tableEnum.task).where({ taskId }).update({
        taskAuditedUserIdList: auditedUsers.join(','),
        taskAuditConfig: JSON.stringify(auditConfig),
        ...updateTaskData,
      });

      // TODO:taskStatus为已完成，将给所有抄送人发通知,noticeConfig
      await this.ctx.service.notice.addApprovalNotice({
        ...task,
        ...updateTaskData,
        taskAuditConfig: JSON.stringify(auditConfig)
      })
    })
  }
}

module.exports = TicketService;