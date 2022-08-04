'use strict';

// ========================================常用 require start===========================================
const Service = require('egg').Service;
const { BizError, errorInfoEnum } = require('../constant/error');
const validateUtil = require('@jianghujs/jianghu/app/common/validateUtil');
const idGenerateUtil = require('@jianghujs/jianghu/app/common/idGenerateUtil');
const { tableEnum } = require('../constant/constant');
// ========================================常用 require end=============================================
const _ = require('lodash');
const md5 = require('md5-node');
const actionDataScheme = Object.freeze({
  addUser: {
    type: 'object',
    additionalProperties: true,
    required: [ 'username', 'clearTextPassword' ],
    properties: {
      clearTextPassword: { type: 'string' },
      username: { type: 'string' },
      userAvatar: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      contactNumber: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      gender: { anyOf: [{ type: 'string', enum: [ 'male', 'female' ] }, { type: 'null' }] },
      birthday: { anyOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }] },
      signature: { anyOf: [{ type: 'string' }, { type: 'null' }] },
      email: { anyOf: [{ type: 'string' }, { type: 'null' }] },
    },
  },
  initUserPassword: {
    type: 'object',
    additionalProperties: true,
    required: [ 'userId', 'clearTextPassword' ],
    properties: {
      userId: { type: 'string' },
      clearTextPassword: { type: 'string' },
    },
  },
});

function generateIdByIdSequence({ prefix, idSequence }) {
  const idMapArray = [];
  idSequence += '';
  for (let i = 0; i < idSequence.length; i++) {
    let charInt = parseInt(idSequence[i]);
    charInt = (charInt + 1) % 10;
    idMapArray.push(charInt);
  }
  const encodeIdValue = idMapArray.join('');
  const mIdCube = Math.pow(encodeIdValue, 3);
  const mIdCubeRt = Math.sqrt(mIdCube);
  const roundMid = Math.round(mIdCubeRt);
  const remainder = roundMid % 21;
  const charList = [ 'A', 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'V', 'W', 'X', 'Y' ];
  const checkSum = charList[remainder];
  const id = prefix + encodeIdValue + checkSum;
  return id;
};

class UserManagementService extends Service {

  async addUser() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.addUser, actionData);
    const { clearTextPassword } = actionData;
    const md5Salt = idGenerateUtil.randomString(12);
    const password = md5(`${clearTextPassword}_${md5Salt}`);
    const idSequence = await this.getNextIdByTableAndField({ table: '_user', field: 'idSequence' });
    const userId = generateIdByIdSequence({ prefix: 'U', idSequence });
    const userExistCountResult = await jianghuKnex(tableEnum._user, this.ctx).where({ userId }).count('*', {as: 'count'});
    const userExistCount = userExistCountResult[0].count;
    if (userExistCount > 0) {
      throw new BizError(errorInfoEnum.user_id_exist);
    }
    const insertParams = _.pick(actionData, [ 'username', 'userType', 'userStatus', 'userAvatar' ]);
    await jianghuKnex(tableEnum._user, this.ctx).insert({ ...insertParams, idSequence, userId, password, clearTextPassword, md5Salt });
    return {};
  }

  async resetUserPassword() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.initUserPassword, actionData);
    const { userId, clearTextPassword } = actionData;
    const userExistCountResult = await jianghuKnex(tableEnum._user, this.ctx).where({ userId }).count('*', {as: 'count'});
    const userExistCount = userExistCountResult[0].count;
    if (userExistCount === 0) {
      throw new BizError(errorInfoEnum.user_not_exist);
    }
    const md5Salt = idGenerateUtil.randomString(12);
    const password = md5(`${clearTextPassword}_${md5Salt}`);
    await jianghuKnex(tableEnum._user, this.ctx).where({userId}).update({ password, clearTextPassword, md5Salt });
    return {};
  }

  async getNextIdByTableAndField({ table, field }) {
    const knex = this.app.knex;
    const rows = await knex(table).max(`${field} as maxValue`);
    let maxValue = null;
    if (rows.length > 0 && rows[0].maxValue) {
      maxValue = parseInt(rows[0].maxValue) + 1;
    } else {
      maxValue = 26260000;
    }
    return maxValue;
  }
}

module.exports.generateIdByIdSequence = ({ prefix, idSequence }) => {
  const idMapArray = [];
  idSequence += '';
  for (let i = 0; i < idSequence.length; i++) {
    let charInt = parseInt(idSequence[i]);
    charInt = (charInt + 1) % 10;
    idMapArray.push(charInt);
  }
  const encodeIdValue = idMapArray.join('');
  const mIdCube = Math.pow(encodeIdValue, 3);
  const mIdCubeRt = Math.sqrt(mIdCube);
  const roundMid = Math.round(mIdCubeRt);
  const remainder = roundMid % 21;
  const charList = [ 'A', 'B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'T', 'U', 'V', 'W', 'X', 'Y' ];
  const checkSum = charList[remainder];
  const id = prefix + encodeIdValue + checkSum;
  return id;
};

module.exports = UserManagementService;
