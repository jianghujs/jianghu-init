const Service = require('egg').Service;
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const { BizError, errorInfoEnum } = require('../constant/error');
const { tableEnum } = require('../constant/constant');
const _ = require('lodash');
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
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

  // 添加消息通知
  async addNotice(actionData) {
    validateUtil.validate(actionDataScheme.addNotice, actionData);

    const { jianghuKnex, knex } = this.app;
    const { username } = this.ctx.userInfo;
    const { appId } = this.config
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

    let idSequence = await idGenerateUtil.idPlus({
      knex,
      tableName: 'task',
      columnName: 'idSequence',
    })
    idSequence--;


    const insertData = taskMemberIdList.map(item => {

      idSequence++

      const insertItem = {
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

      return insertItem
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

  // 添加消息通知AfterHook
  async addNoticeAfterHook(actionData) {
    const { taskNoticeList } = this.ctx.request.body.appData
    if (!taskNoticeList || taskNoticeList.length == 0) return;

    for (const taskNotice of taskNoticeList) {
      if (!taskNotice.taskDesc) {
        taskNotice.taskDesc = `有一个新通知 <a>《${taskNotice.taskTitle}》</a> ，请及时查看`
      }
      taskNotice.taskTitle += '提醒'
  
      if (!taskNotice.taskContent) {
        taskNotice.taskContent = taskNotice.taskTitle
      }
      await this.addNotice(taskNotice)
    }

  }

}

module.exports = NoticeService;