'use strict';

class ValidateError extends Error {
  constructor({ errorCode, errorReason, errorReasonSupplement }) {
    super(JSON.stringify({ errorCode, errorReason, errorReasonSupplement }));
    this.name = 'ValidateError';
    this.errorCode = errorCode;
    this.errorReason = errorReason;
    this.errorReasonSupplement = errorReasonSupplement;
  }
}

class BizError extends Error {
  constructor({ errorCode, errorReason, errorReasonSupplement }) {
    super(JSON.stringify({ errorCode, errorReason, errorReasonSupplement }));
    this.name = 'BizError';
    this.errorCode = errorCode;
    this.errorReason = errorReason;
    this.errorReasonSupplement = errorReasonSupplement;
  }
}

const errorInfoEnum = Object.freeze({
  data_dont_exists: {
    errorCode: "data_dont_exists",
    errorReason: "数据表不存在",
  },
  data_expection: {
    errorCode: "data_expection",
    errorReason: "数据异常",
  },
  album_queryType_error: {
    errorCode: "album_queryType_error",
    errorReason: "查询类型不匹配",
  },
  article_not_found: {
    errorCode: "article_not_found",
    errorReason: "文章找不到",
  },
  material_is_not_file: {
    errorCode: "material_is_not_file",
    errorReason: "所选素材不是文件类型",
  },
  path_invalid: {
    errorCode: "path_invalid",
    errorReason: "无效的路径",
  },
  target_file_not_exist: {
    errorCode: "target_file_not_exist",
    errorReason: "文件不存在",
  },
  target_folder_invalid: {
    errorCode: "target_folder_invalid",
    errorReason: "粘贴目录不存在",
  },
  design_article_not_exist: {
    errorCode: "design_article_not_exist",
    errorReason: "三稿不存在",
  },
  salary_change_record_exist: {
    errorCode: "salary_change_record_exist",
    errorReason: "员工当前存在正在进行中的调薪任务，无法再次新增调薪任务!",
  },
  salary_config_not_exist: {
    errorCode: "salary_config_not_exist",
    errorReason: "无薪资配置信息",
  },
  insurance_month_record_not_exist: {
    errorCode: "insurance_month_record_not_exist",
    errorReason: "社保数据未生成",
  },
});

module.exports = {
  ValidateError,
  BizError,
  errorInfoEnum,
};
