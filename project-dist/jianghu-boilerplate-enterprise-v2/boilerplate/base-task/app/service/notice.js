const Service = require('egg').Service;
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const { BizError, errorInfoEnum } = require('../constant/error');
const { tableEnum } = require('../constant/constant');
const _ = require('lodash');
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const wecomUtil = require('../common/wecomUtil.js')

const dayjs = require('dayjs')

const actionDataScheme = Object.freeze({
  addNotice: {
    type: 'object',
    additionalProperties: true,
    required: ['taskMemberIdList', 'taskTitle'],
    properties: {
      taskMemberIdList: { type: ['string', 'array'], },
      taskTitle: { type: 'string', },
    }
  },
});


class NoticeService extends Service {
  async _sendQiweiMessage(qiweiId, taskTitle, taskDesc, jumpUrl) {
    const { wecom } = this.ctx.app.config
    if (!wecom) return;
    
    try {
      await wecomUtil.sendMessage({
        msgtype: 'textcard',
        touser: qiweiId,
        textcard: {
          title: taskTitle,
          description: `
            <div class="gray">${dayjs().format('YYYY年MM月DD日')}</div><div>${taskDesc}</div>
          `,
          url: jumpUrl,
          btntxt: "详情",
        },
      })
    } catch (error) {
    }
  }
  async _createTask(task) {
    const { jianghuKnex } = this.ctx.app;

    return jianghuKnex(tableEnum.task).jhInsert({
      ...task,
      taskType: '通知',
      taskCreateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
  }
  async _getIdSequence() {
    const { knex } = this.ctx.app;
    return idGenerateUtil.idPlus({
      knex,
      tableName: 'task',
      columnName: 'idSequence',
    });
  }
  async _sendNotice(data) {
    const { taskTitle, taskDesc, taskContent, allUserList, jumpUrl, userId } = data

    let idSequence = await this._getIdSequence()
    const taskId = `TZ${idSequence}`
    let taskBizId = data.taskBizId || taskId

    if (userId) {
      await this._createTask({
        taskBizId,
        taskTitle,
        taskContent,
        taskDesc,
        taskManagerId: userId,
        idSequence,
        taskId,
      })
    }

    const approvalUser = allUserList.find(item => item.userId === userId) || {}
    if (approvalUser.qiweiId) {
      await this._sendQiweiMessage(approvalUser.qiweiId, taskTitle, taskDesc, jumpUrl)
    }
  }
  // 添加审批通知
  async addApprovalNotice(actionData) {
    const { ctx } = this
    const { jianghuKnex, knex } = ctx.app;
    const { wecom, appRootUrl } = ctx.app.config;
    const { username } = ctx.userInfo;
    let { rowId, taskAuditConfig, taskManagerId, taskTitle, taskDesc, taskStatus, taskNoticeConfig } = actionData;
    taskAuditConfig = JSON.parse(taskAuditConfig)

    // 获取所有用户，用于取企微id
    const allUserList = await jianghuKnex('_view01_user').select();

    // 业务id的获取
    let taskBizId = null
    if (rowId) {
      const task = await jianghuKnex(tableEnum.task).where({ id: rowId }).first();
      taskBizId = task.taskId
    }

    // 只通知当前要审批的人
    const currentAuditUser = taskAuditConfig.find(item => !item.status) || {}
    const jumpUrl = `${appRootUrl}/task/page/noticeManagement?taskId=${taskBizId}`

    // 给发起人发通知
    if (taskStatus === '已拒绝') {
      await this._sendNotice({
        userId: taskManagerId,
        taskBizId,
        jumpUrl,
        taskDesc: `你提交的<a>《${taskTitle}》</a>，已被拒绝`,
        taskTitle: '审批拒绝提醒',
        allUserList,
      })
      return;
    }

    await this._sendNotice({
      userId: currentAuditUser.userId,
      taskBizId,
      jumpUrl,
      taskDesc: `${username} 提交了<a>《${taskTitle}》</a>，请及时处理`,
      taskTitle: '待审批提醒',
      allUserList,
    })


    if (taskStatus === '已完成') {
      taskNoticeConfig = JSON.parse(taskNoticeConfig || '[]')
      // 审批完成后，给所有抄送人发通知
      for (let i = 0; i < taskNoticeConfig.length; i++) {
        await this._sendNotice({
          ...taskNoticeConfig[i],
          allUserList,
          jumpUrl,
          taskTitle: '审批完成提醒',
          taskDesc: `${username} 发起的<a>《${taskTitle}》</a>，已经处理完成`,
        })
      }
    }
  }

  // 添加评论通知
  async addCommentNotice(actionData) {
    const { ctx } = this
    const { jianghuKnex } = ctx.app;
    const { appRootUrl } = ctx.app.config;
    const { username } = ctx.userInfo;
    let { taskId, taskAuditConfig, taskManagerId, taskTitle } = actionData;

    // 获取所有用户，用于取企微id
    const allUserList = await jianghuKnex('_view01_user').select();
    const jumpUrl = `${appRootUrl}/task/page/noticeManagement?taskId=${taskId}`

    // 给当前和当前之前的所有审批人发通知，taskAuditConfig都为false，就只通知第一个
    // 如果有status为true的都通知，并且再往后一个也通知
    const currentAuditUser = taskAuditConfig.find(item => !item.status) || {}

    // 只通知当前要审批的人
    await this._sendNotice({
      userId: currentAuditUser.userId,
      taskBizId: taskId,
      jumpUrl,
      taskDesc: `${username} 评论了<a>《${taskTitle}》</a>，请及时处理`,
      taskTitle: '评论提醒',
      allUserList,
    })
  }


  // 添加消息通知
  async addNotice(actionData) {
    validateUtil.validate(actionDataScheme.addNotice, actionData);
    const { ctx } = this
    const { jianghuKnex, knex } = ctx.app;
    const { wecom } = ctx.app.config;
    const { username } = ctx.userInfo;
    let { rowId, taskMemberIdList, taskManagerId, taskTitle, taskContent, taskType, taskDesc } = actionData;

    let taskBizId = null
    // 根据rowId查task的taskId
    if (rowId) {
      const task = await jianghuKnex(tableEnum.task).where({ id: rowId }).first();
      taskBizId = task.taskId
    }

    // 判断taskMemberIdList是否为数组
    if (!_.isArray(taskMemberIdList)) {
      taskMemberIdList = taskMemberIdList.split(',')
    }

    // 如果taskMemberIdList为空，则不执行
    if (!taskMemberIdList.length) {
      return
    }


    // 合并taskMemberIdList和taskManagerId，要去重
    if (taskManagerId) {
      taskMemberIdList = _.union(taskMemberIdList, [taskManagerId])
    }

    let idSequence = await this._getIdSequence()
    idSequence--;

    // 判断taskType类型
    // Tips: 传href就是跳转其他业务页面，不传就是在当前页看

    if (!taskDesc) {
      switch (taskType) {
        case '任务':
          taskDesc = `${username} 邀请您参与<a>《${taskTitle}》</a>任务，请及时查看`;
          taskTitle = '任务邀请提醒';
          break;
        case '审批':
          taskDesc = `${username} 提交了<a>《${taskTitle}》</a>，请及时处理`;
          taskTitle = '待审批提醒';
          break;
        case '日志':
          taskDesc = `${username} 将<a>《${taskTitle}》</a>日志发送给您，请及时查看`;
          taskTitle = '日志邀请提醒';
          break;
        default:
          taskDesc = `有一个新公告 <a>《${taskTitle}》</a> ，请及时查看`;
          taskTitle = '公告提醒';
          break;
      }
    }

    const insertData = taskMemberIdList.map(item => {

      idSequence++
      return {
        taskBizId: taskBizId || `TZ${idSequence}`,
        taskTitle,
        taskContent,
        taskDesc,
        taskManagerId: item,
        idSequence,
        taskType: '通知',
        taskCreateAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        taskId: `TZ${idSequence}`,
      }
    })


    await jianghuKnex(tableEnum.task).jhInsert(insertData)
  }

  // 更新所有未读消息为【已读】
  async updateAllNotReadNotice() {
    const { jianghuKnex, knex } = this.app;
    const { userId } = this.ctx.userInfo;

    await jianghuKnex(tableEnum.task)
      .where({
        taskReadStatus: '否',
        taskManagerId: userId
      })
      .update({
        taskReadStatus: '是',
      })
  }

  // 删除所有已读消息
  async deleteAllReadNotice() {
    const { jianghuKnex, knex } = this.app;
    const { userId } = this.ctx.userInfo;

    await jianghuKnex(tableEnum.task)
      .where({
        taskReadStatus: '是',
        taskManagerId: userId
      })
      .delete()
  }
  // 替换task a标签链接
  async replaceNoticeUrlAfterHook() {
    // 请求enterprise_app表
    const { jianghuKnex, knex } = this.app;
    const { userId } = this.ctx.userInfo;
    const enterpriseAppList = await jianghuKnex(tableEnum.enterprise_app).select()
    const appUrlMap = Object.fromEntries(enterpriseAppList.map(obj => [`__appUrl-${obj.appId}__`, obj.appUrl]));

    const rows = this.ctx.response.body.appData.resultData.rows

    rows.forEach(row => {
      let appItem = enterpriseAppList.find(app => app.appId == row.appId) || {}
      // 如果a标签href包含全路径，http或者https，则不替换
      if (row.taskDesc.includes('http') || row.taskDesc.includes('https')) return;

      if (!row.taskDesc.includes('href')) {
        // 没有路径的话，就默认noticeManagement页面
        let defaultPageId = 'noticeManagement'
        if (row.taskType === '公告') {
          defaultPageId = 'afficheViewer'
        }
        row.taskDesc = row.taskDesc.replace(/<a>/g, `<a href="${appItem.appUrl}/page/${defaultPageId}?taskId=${row.taskBizId}" target="_blank">`)
      } else {
        // 取row.taskDesc中a标签的appId
        const appIdMatch = row.taskDesc.match(/href="\/(.*?)\//)
        if (appIdMatch) {
          appItem = enterpriseAppList.find(app => app.appId == appIdMatch[1]) || {}
        }
        // 有路径的话，加上全路径
        appItem.appUrl = appItem.appUrl.replace(`/${appItem.appId}`, '');
        row.taskDesc = row.taskDesc.replace(/<a href="/g, `<a href="${appItem.appUrl}`)
      }
    })
    this.ctx.response.body.appData.resultData.rows = rows;
  }

  // 测试企微通知
  async testQiWeiNotice() {
    const { wecom } = this.ctx.app.config;
    await wecomUtil.initConfig(wecom);

    await wecomUtil.sendMessage({
      "msgtype": 'textcard',
      "touser": 'ChuBing',
      "textcard": {
        "title": "待审批提醒",
        "description": `
          <div class="gray">2016年9月26日</div><div>超级管理员提交了《xxx申请》</div><div class="highlight">请及时处理！</div>
        `,
        "url": "URL",
        "btntxt": "更多"
      },

    })
  }

}

module.exports = NoticeService;