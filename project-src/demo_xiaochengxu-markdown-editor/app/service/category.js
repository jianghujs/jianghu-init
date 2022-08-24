const Service = require('egg').Service;
const dayjs = require("dayjs");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");

const actionDataScheme = Object.freeze({
});

class CategoryService extends Service {

  async fillInsertItemParamsBeforeHook() {
    let { categoryId } = this.ctx.request.body.appData.actionData;
    const { userId, username } = this.ctx.userInfo;
    const time = dayjs().format();
    const tableName = "category";
    const columnName = "categoryId";
    categoryId = await idGenerateUtil.idPlus({
      knex: this.app.jianghuKnex,
      tableName,
      columnName,
    });
    Object.assign(this.ctx.request.body.appData.actionData, {
      categoryId,
      categoryCreateTime: time,
      categoryCreateUserId: userId,
      categoryCreateUsername: username,
      categoryUpdateTime: time,
      categoryUpdateUserId: userId,
      categoryUpdateUsername: username,
    })
  }


  async fillUpdateItemParamsBeforeHook() {
    const { userId, username } = this.ctx.userInfo;
    const time = dayjs().format();
    Object.assign(this.ctx.request.body.appData.actionData, {
      categoryUpdateTime: time,
      categoryUpdateUserId: userId,
      categoryUpdateUsername: username,
    })
  }
}
module.exports = CategoryService;