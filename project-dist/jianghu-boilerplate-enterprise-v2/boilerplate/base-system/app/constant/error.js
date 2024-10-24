'use strict';

class BizError extends Error {
  constructor({ errorCode, errorReason, errorReasonSupplement }) {
    super(JSON.stringify({ errorCode, errorReason, errorReasonSupplement }));
    this.name = 'BizError';
    this.errorCode = errorCode;
    this.errorReason = errorReason;
    this.errorReasonSupplement = errorReasonSupplement;
  }
}

module.exports = {
  BizError,
  errorInfoEnum: {
    user_id_exist: { errorCode: 'user_id_exist', errorReason: '用户ID已存在' },
    user_not_exist: { errorCode: 'user_not_exist', errorReason: '用户不存在' },
    resource_not_found: { errorCode: 'resource_not_found', errorReason: 'resource不存在' },
  },
};
