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

const errorInfoEnum = {
  data_not_found: { errorCode: 'data_not_found', errorReason: '数据不存在' },
};

module.exports = {
  BizError,
  errorInfoEnum,
};
