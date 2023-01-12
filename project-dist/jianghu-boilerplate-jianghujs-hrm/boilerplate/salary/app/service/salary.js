'use strict';
const Service = require('egg').Service;
const { tableEnum, articlePublishStatusEnum } = require("../constant/constant");
const _ = require("lodash");
const fsExtra = require("fs-extra"); 
const path = require("path");

// TODO: 封装一下
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const { BizError, errorInfoEnum } = require("../constant/error");
const actionDataScheme = Object.freeze({
  afterDelEmpRecord: {
    type: "object",
    additionalProperties: true,
    required: ["iRecordId"],
    properties: {
      iRecordId: { anyOf: [{ type: "string" }, { type: "number" }] },
    },
  }
});

class SalaryService extends Service {

  async updateSlipOption() {
    const { jianghuKnex } = this.app;
    let { codeList, templateName, id } = this.ctx.request.body.appData.actionData;
    const templateOptionInsert = [];

    if (id) {
      await jianghuKnex(tableEnum.salary_slip_template).where({ id }).update({ templateName });
      // 删除原有的模板
      await jianghuKnex(tableEnum.salary_slip_template_option).where({ templateId: id }).delete();
      
    } else {
      // 新增 返回id
      const res = await jianghuKnex(tableEnum.salary_slip_template).insert({ templateName });
      if (res) {
        id = res[0]
      }
    }
    codeList.forEach((item) => {
      templateOptionInsert.push({ templateId: id, code: item.code, parentCode: item.parentCode, name: item.name, type: 2 });
    });
    await jianghuKnex(tableEnum.salary_slip_template_option).insert(templateOptionInsert);
  }
  async deleteSlipOption() {
    const { jianghuKnex } = this.app;
    let { id } = this.ctx.request.body.appData.actionData;
    
    await jianghuKnex(tableEnum.salary_slip_template).where({ id }).delete();
    await jianghuKnex(tableEnum.salary_slip_template_option).where({ templateId: id }).delete();
  }
  // 定薪api
  async makeEmployeeArchives() {
    const { jianghuKnex } = this.app;
    const { userId } = this.ctx.userInfo;
    // changType 0 未定薪 1 已定薪 2 已调薪
    // 调薪原因:changeReason (default 0) 1 入职核定 2 转正 3 晋升 4 调动 5 年中调薪 6 年度调薪 7 特别调薪 8 其他
    let {recordType, proSalary: {newSalary: proSalary}, salary: {newSalary: salary}, templateId, remarks, changeReason, enableTime, employeeId, id, employeeStatus} = this.ctx.request.body.appData.actionData;

    const employeeInfo = await jianghuKnex(tableEnum.employee).where({ employeeId }).first();
    // 写入初次调薪变动记录
    const salaryArchivesInsert = {
      employeeId,
      changeType: 1,
      changeDate: dayjs().format("YYYY-MM-DD"),
      changeReason: 0,
      remarks,
    }
    await jianghuKnex(tableEnum.salary_archives).insert(salaryArchivesInsert);
    // 写入 salary_archives_option 调薪金额详情
    const salaryArchivesOptionInsert = [];
    proSalary.forEach((item) => {
      item.value = +item.value;
      salaryArchivesOptionInsert.push({
        employeeId,
        isPro: 1,
        code: item.code,
        name: item.name,
        value: item.value,
      })
    });
    salary.forEach((item) => {
      item.value = +item.value;
      salaryArchivesOptionInsert.push({
        employeeId,
        isPro: 0,
        code: item.code,
        name: item.name,
        value: item.value,
      })
    });
    await jianghuKnex(tableEnum.salary_archives_option).delete({employeeId: employeeId});
    await jianghuKnex(tableEnum.salary_archives_option).insert(salaryArchivesOptionInsert);
    const afterSum = _.sumBy(salary, "value");
    // 写入 salary_change_record 调薪记录
    const salaryChangeRecordInsert = {
      employeeId,
      recordType,
      changeReason,
      enableDate: dayjs().format("YYYY-MM-DD"),
      proBeforeSum: 0,
      proAfterSum: _.sumBy(proSalary, "value"), // 试用状态下可设定
      proSalary: JSON.stringify(proSalary),
      salary: JSON.stringify(salary),
      beforeSum: 0,
      afterSum,
      status: 1,
      employeeStatus: employeeStatus || employeeInfo.status,
      beforeTotal: 0,
      afterTotal: this.checkUserBecomeTime(employeeInfo, afterSum),
      remarks
    }
    // 判断是否从详情记录修改
    if (id) {
      await jianghuKnex(tableEnum.salary_change_record).where({id}).update(salaryChangeRecordInsert);
    } else {
      salaryChangeRecordInsert.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      salaryChangeRecordInsert.createUserId = userId;
      await jianghuKnex(tableEnum.salary_change_record).insert(salaryChangeRecordInsert);
    }
  }
  // 暂时计入工资合计、0的情况待定
  checkUserBecomeTime({employmentForms}, afterSum) {
    return afterSum;
    // 非正式员工写入合计
    if (employmentForms == 2) {
      return afterSum;
    } else {
      return 0;
    }
  }
  
  // 调薪api
  async updateEmployeeArchives() {
    const { jianghuKnex } = this.app;
    const { userId } = this.ctx.userInfo;
    // changType 0 未定薪 1 已定薪 2 已调薪
    // 调薪原因: 1 入职核定 2 转正 3 晋升 4 调动 5 年中调薪 6 年度调薪 7 特别调薪 8 其他
    // salary {newSalary, oldSalary}
    // let { employeeId, remarks, changeReason, enableDate, proSalary, salary } = this.ctx.request.body.appData.actionData;
    
    let {proSalary, salary, remarks, changeReason, enableDate, employeeId, id, employeeStatus} = this.ctx.request.body.appData.actionData;
    const employeeInfo = await jianghuKnex(tableEnum.employee).where({ employeeId }).first();
    // 查询用户是否存在调薪任务、存在则抛出 bizError
    const salaryChangeRecord = await jianghuKnex(tableEnum.salary_change_record).where({ employeeId, status: 0 }).first();
    
    if (salaryChangeRecord && !id) {
      throw new BizError(errorInfoEnum.salary_change_record_exist);
    }

    // 修改初次调薪变动记录
    await jianghuKnex(tableEnum.salary_archives).where({employeeId}).update({changeDate: dayjs().format("YYYY-MM-DD")});
    
    // 写入 salary_archives_option 调薪金额详情
    const salaryArchivesOptionInsert = [];
    proSalary.newSalary.forEach((item) => {
      item.value = +item.value;
      salaryArchivesOptionInsert.push({
        employeeId,
        isPro: 1,
        code: item.code,
        name: item.name,
        value: item.value,
      })
    });
    salary.newSalary.forEach((item) => {
      item.value = +item.value;
      salaryArchivesOptionInsert.push({
        employeeId,
        isPro: 0,
        code: item.code,
        name: item.name,
        value: item.value,
      })
    });
    await jianghuKnex(tableEnum.salary_archives_option).delete({employeeId: employeeId});
    await jianghuKnex(tableEnum.salary_archives_option).insert(salaryArchivesOptionInsert);
    // 调薪还未生效、暂不更改工资明细
    const afterSum = _.sumBy(salary.newSalary, "value");
    // 写入 salary_change_record 调薪记录
    const salaryChangeRecordInsert = {
      employeeId,
      recordType: 2,
      changeReason,
      enableDate: enableDate || dayjs().format("YYYY-MM-DD"),
      proBeforeSum: 0,
      proAfterSum: _.sumBy(proSalary, "value"), // 试用状态下可设定
      proSalary: JSON.stringify(proSalary),
      salary: JSON.stringify(salary),
      beforeSum: _.sumBy(salary.oldSalary, "value"),
      afterSum,
      status: 0,
      employeeStatus: employeeStatus || employeeInfo.status,
      beforeTotal: _.sumBy(salary.oldSalary, "value"),
      afterTotal: this.checkUserBecomeTime(employeeInfo, afterSum),
      remarks
    }
    if (id) {
      await jianghuKnex(tableEnum.salary_change_record).where({id}).update(salaryChangeRecordInsert);
    } else {
      salaryChangeRecordInsert.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      salaryChangeRecordInsert.createUserId = userId;
      await jianghuKnex(tableEnum.salary_change_record).insert(salaryChangeRecordInsert);
    }
  }

  async beforeCreateChangeTmpHook() {
    const { userId } = this.ctx.userInfo;
    this.ctx.request.body.appData.actionData.createTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
    this.ctx.request.body.appData.actionData.createUserId = userId;
  }

  async afterAppendNewChangeRecordHook() {
    const { jianghuKnex } = this.app;
    const { rows } = this.ctx.body.appData.resultData;
    const employeeList = rows.map((item) => item.employeeId);
    // 查询每个员工最新的记录id
    const salaryChangeRecordList = await jianghuKnex(tableEnum.salary_change_record).whereIn("employeeId", employeeList).orderBy("id", "desc").select();
    salaryChangeRecordList.forEach((item) => {
      item.proSalary = JSON.parse(item.proSalary);
      item.salary = JSON.parse(item.salary);
    });
    rows.forEach((item) => {  
      item.changeRecordList = salaryChangeRecordList.filter((record) => record.employeeId == item.employeeId);
    });
  }
  // 薪资管理
  async monthEmpRecord() {
    // 自动查询最新月份的 salary_month_record 的记录
    const { jianghuKnex } = this.app;
    const salaryMonthRecord = await jianghuKnex(tableEnum.salary_month_record).orderBy("year", "desc").orderBy("month", "desc").first();
    const salaryConfig = await jianghuKnex(tableEnum.salary_config).first();
    // 如果没有最新记录、查询 salary_config 配置的最初开始日期
    if (!salaryMonthRecord) {
      if (!salaryConfig) {
        throw new BizError(errorInfoEnum.salary_config_not_exist);
      }
      return { rows: [] };
    }
    
    const {year, month} = salaryMonthRecord;
    return { rows: await this.monthEmpRecordDetail(year, month) };
  }
  async monthEmpRecordByYearMonth() {
    const { jianghuKnex } = this.app;
    const { year, month } = this.ctx.request.body.appData.actionData;
    return { rows: await this.monthEmpRecordDetail(year, month), salaryConfig: await jianghuKnex(tableEnum.salary_option).select() };
  }
  async monthEmpRecordDetail(year, month) {
    const { jianghuKnex } = this.app;
    const salaryMonthEmpRecord = await jianghuKnex(tableEnum.salary_month_emp_record).leftJoin(tableEnum.employee, `${tableEnum.salary_month_emp_record}.employeeId`, `${tableEnum.employee}.employeeId`).where({year, month}).select(tableEnum.salary_month_emp_record + '.*', tableEnum.employee + '.employeeName');
    const sEmpRecordIdList = salaryMonthEmpRecord.map((item) => item.sEmpRecordId);
    const salaryMonthEmpRecordOption = await jianghuKnex(tableEnum.salary_month_option_value).whereIn("sEmpRecordId", sEmpRecordIdList).select();
    salaryMonthEmpRecord.forEach((item) => {
      const optionList = salaryMonthEmpRecordOption.filter((option) => option.sEmpRecordId == item.sEmpRecordId);
      optionList.forEach((option) => {
        item[option.code] = option.value;
      });
    });
    return salaryMonthEmpRecord;
  }
  async getLastConfig() {
    const { jianghuKnex } = this.app;
    const lastMonth = await jianghuKnex(tableEnum.salary_month_record).orderBy('year', 'desc').orderBy('month', 'desc').first();
    let month,year;
    if (!lastMonth) {
      const {salaryStartMonth} = await jianghuKnex(tableEnum.salary_config).first();
      [year, month] = salaryStartMonth.split('-');
    } else {
      month = lastMonth.month;
      year = lastMonth.year;
    }
    // salary_option parentCode > 0
    const salaryOption = await jianghuKnex(tableEnum.salary_option).where('parentCode', '>', 0).select();
    return {month, year, salaryOption};
  }
  // 核算薪资：生成月薪资记录
  async createMonthRecord() {
    const { jianghuKnex } = this.app;
    let { year, month } = this.ctx.request.body.appData.actionData;
    if (!year || !month) {
      const {salaryStartMonth} = await jianghuKnex(tableEnum.salary_config).first();
      [year, month] = salaryStartMonth.split("-").map((item) => parseInt(item));
    }
    if (month > 12) {
      year++;
      month = month - 12;
    }
    await this.makeMonthRecord(year, month);
  }
  async makeMonthRecord(year, month) {
    const { jianghuKnex } = this.app;
    await jianghuKnex(tableEnum.salary_month_emp_record).where({year, month}).delete();
    await jianghuKnex(tableEnum.salary_month_record).where({year, month}).delete();
    

    // 写入薪资月份记录
    const {insertMonthRecord, insuranceMonthEmpRecordList} = await this.buildInsertMonthRecordList(jianghuKnex, year, month);
    await jianghuKnex(tableEnum.salary_month_record).insert(insertMonthRecord);

    // 写入月份内人员信息
    const insertMonthEmpRecord = await this.buildInsertMonthEmpRecordList(jianghuKnex, insuranceMonthEmpRecordList, year, month, insertMonthRecord.sRecordId);
    insertMonthEmpRecord.length && await jianghuKnex(tableEnum.salary_month_emp_record).insert(insertMonthEmpRecord);

    // 写入人员的薪资项明细
    insertMonthEmpRecord.length && await this.buildInsertMonthOptionValue(insertMonthEmpRecord, insuranceMonthEmpRecordList);
  }
  async delMonthRecord() {
    const { jianghuKnex } = this.app;
    const { sRecordId } = this.ctx.request.appData.actionData;
    await jianghuKnex(tableEnum.salary_month_record).where({sRecordId}).delete();
    // 查 sEmpRecordId
    const salaryMonthEmpRecord = await jianghuKnex(tableEnum.salary_month_emp_record).where({sRecordId}).select();
    const sEmpRecordIdList = salaryMonthEmpRecord.map((item) => item.sEmpRecordId);

    await jianghuKnex(tableEnum.salary_month_emp_record).where('sEmpRecordId', sEmpRecordIdList).delete();
    await jianghuKnex(tableEnum.salary_month_option_value).whereIn('sEmpRecordId', sEmpRecordIdList).delete();
  }
  async buildInsertMonthRecordList(jianghuKnex, year, month) {
    const { userId } = this.ctx.userInfo;
    // 对应社保自然月 0-上月 1-当月 2-次月
    const { socialSecurityMonthType } = await jianghuKnex(tableEnum.salary_config).first();
    // 计算对应社保月份、兼容年底跨年
    const cacheMonth = month + (socialSecurityMonthType - 1);
    const insuranceYear = cacheMonth > 12 ? year + 1 : year;
    const insuranceMonth = cacheMonth > 12 ? cacheMonth - 12 : cacheMonth;

    // 查询 insurance_month_emp_record 明细
    const insuranceMonthEmpRecordList = await jianghuKnex(tableEnum.insurance_month_emp_record).where({year: insuranceYear, month: insuranceMonth}).select();
    if (!insuranceMonthEmpRecordList.length) {
      throw new BizError(errorInfoEnum.insurance_month_record_not_exist);
    }
    // personalInsuranceAmount | personalProvidentFundAmount | corporateInsuranceAmount | corporateProvidentFundAmount
    const personalInsuranceAmount = _.sumBy(insuranceMonthEmpRecordList, "personalInsuranceAmount");
    const personalProvidentFundAmount = _.sumBy(insuranceMonthEmpRecordList, "personalProvidentFundAmount");
    const corporateInsuranceAmount = _.sumBy(insuranceMonthEmpRecordList, "corporateInsuranceAmount");
    const corporateProvidentFundAmount = _.sumBy(insuranceMonthEmpRecordList, "corporateProvidentFundAmount");
    return {insertMonthRecord: {
      personalInsuranceAmount,
      personalProvidentFundAmount,
      corporateInsuranceAmount,
      corporateProvidentFundAmount,
      title: month + '月薪资报表',
      year,
      month,
      num: insuranceMonthEmpRecordList.length,
      startTime: `${year}-${month}-01`,
      endTime: `${year}-${month}-${dayjs(`${year}-${month}-01`).daysInMonth()}`,
      checkStatus: 0,
      createUserId: userId,
      createTime: new Date(),
      sRecordId: idGenerateUtil.uuid(),
    }, insuranceMonthEmpRecordList};
  }
  // 核算薪资：生成月薪资记录
  async buildInsertMonthEmpRecordList(jianghuKnex, insuranceMonthEmpRecordList, year, month, sRecordId) {
    // 查询用户所在薪资组 salary_group
    const salaryGroupList = await jianghuKnex(tableEnum.salary_group).select();
    
    const insuranceMonthEmpRecordListFilter = insuranceMonthEmpRecordList.filter((item) => salaryGroupList.some((group) => group.employeeIds.includes(item.employeeId)));
    const insertMonthEmpRecord = insuranceMonthEmpRecordListFilter.map((item) => {
      const salaryGroup = salaryGroupList.find((group) => group.employeeIds.includes(item.employeeId));
      return {
        sEmpRecordId: idGenerateUtil.uuid(),
        sRecordId: sRecordId,
        employeeId: item.employeeId,
        actualWorkDay: salaryGroup.salaryStandard,
        needWorkDay: 0,
        year,
        month,
        createTime: new Date(),
      }
    });
    return insertMonthEmpRecord;
  }
  // 根据人员列表写入具体明细信息
  async buildInsertMonthOptionValue(insertMonthEmpRecord, insuranceMonthEmpRecordList) {
    const { jianghuKnex } = this.app;
    const employeeIdList = insertMonthEmpRecord.map((item) => item.employeeId);
    const archivesOptionListByEmployeeId = await jianghuKnex(tableEnum.salary_archives_option).whereIn("employeeId", employeeIdList).select();
    const employeeList = await jianghuKnex(tableEnum.employee).whereIn("employeeId", employeeIdList).select();
    const insertMonthOptionValue = [];
    // 查询 parentCode > 0 的 salary_option
    const salaryOptionList = await jianghuKnex(tableEnum.salary_option).where("parentCode", ">", 0).select();
    insertMonthEmpRecord.forEach((item) => {
      const employee = employeeList.find((employee) => employee.employeeId === item.employeeId);
      const insurance = insuranceMonthEmpRecordList.find((insurance) => insurance.employeeId === item.employeeId);
      let archivesOptionList = [];
      if (employee.status == 1) {
        archivesOptionList = archivesOptionListByEmployeeId.filter((option) => option.employeeId == item.employeeId && option.isPro == 0);
      } else {
        archivesOptionList = archivesOptionListByEmployeeId.filter((option) => option.employeeId == item.employeeId && option.isPro == 1);
      }
      salaryOptionList.forEach((option) => {
        const archivesOption = archivesOptionList.find((optionItem) => optionItem.code == option.code);
        if (option.code == 210101) {
          insertMonthOptionValue.push({
            sEmpRecordId: item.sEmpRecordId,
            code: option.code,
            value: _.sumBy(insertMonthOptionValue, "value"),
          });
          return true;
        } else if (option.code == 240101) {
          insertMonthOptionValue.push({
            sEmpRecordId: item.sEmpRecordId,
            code: option.code,
            value: insertMonthOptionValue.find((optionItem) => optionItem.code == 210101).value,
          });
          return true;
        }
        if ([100101, 100102, 110101, 120101].includes(option.code)) {
          const codeKey = {
            100101: "personalInsuranceAmount",
            100102: "personalProvidentFundAmount",
            110101: "corporateInsuranceAmount",
            120101: "corporateProvidentFundAmount",
          }
          insertMonthOptionValue.push({
            sEmpRecordId: item.sEmpRecordId,
            code: option.code,
            value: insurance ? +insurance[codeKey[option.code]] : 0,
          })
          return true;
        }
        if (archivesOption) {
          insertMonthOptionValue.push({
            sEmpRecordId: item.sEmpRecordId,
            code: option.code,
            value: +archivesOption.value,
          });
        } else {
          insertMonthOptionValue.push({
            sEmpRecordId: item.sEmpRecordId,
            code: option.code,
            value: 0,
          });
        }
      });
    });
    insertMonthOptionValue.length && await jianghuKnex(tableEnum.salary_month_option_value).insert(insertMonthOptionValue);
  }
  // 发放工资条
  async createSlipRecord() {
    const { jianghuKnex } = this.app;
    const { year, month } = this.ctx.request.body.appData.actionData;
    const {userId} = this.ctx.userInfo;
    // 
    const existSlipRecord = await jianghuKnex(tableEnum.salary_slip_record).where({year, month}).first();
    if (existSlipRecord) {
      // 删除已存在的工资条
      await jianghuKnex(tableEnum.salary_slip_record).where({id: existSlipRecord.id}).delete();
      const slipExist = await jianghuKnex(tableEnum.salary_slip).where({recordId: existSlipRecord.id}).select();
      const slipIdList = slipExist.map((item) => item.id);
      await jianghuKnex(tableEnum.salary_slip_option).whereIn("slipId", slipIdList).delete();
      await jianghuKnex(tableEnum.salary_slip).whereIn("id", slipIdList).delete();
    }

    const monthRecord = await jianghuKnex(tableEnum.salary_month_record).where({year, month}).first();
    const monthEmpRecordList = await jianghuKnex(tableEnum.salary_month_emp_record).where({sRecordId: monthRecord.sRecordId}).select();
    const monthOptionValueList = await jianghuKnex(tableEnum.salary_month_option_value).whereIn("sEmpRecordId", monthEmpRecordList.map((item) => item.sEmpRecordId)).select();
    const optionList = await jianghuKnex(tableEnum.salary_option).where('parentCode', '>', 0).select();
    const optionListByValue = _.keyBy(optionList, "code");
    // insert slip_record
    const insertSlipRecord = {
      sRecordId: monthRecord.sRecordId,
      year,
      month,
      salaryNum: monthRecord.num,
      payNum: monthRecord.num,
      createUserId: monthRecord.createUserId,
      createTime: new Date(),
    };
    const [slipRecordId] = await jianghuKnex(tableEnum.salary_slip_record).insert(insertSlipRecord);
    const insertSlipOption = [];
    for (const item of monthEmpRecordList) {
      const optionValueList = monthOptionValueList.filter((option) => option.sEmpRecordId == item.sEmpRecordId);
      const insertSlip = {
        recordId: slipRecordId,
        sEmpRecordId: item.sEmpRecordId,
        employeeId: item.employeeId,
        year,
        month,
        readStatus: 0,
        realSalary: optionValueList.find(option => option.code == 240101)?.value,
        createUserId: monthRecord.createUserId,
        createTime: new Date(),
      };
      const [slipId] = await jianghuKnex(tableEnum.salary_slip).insert(insertSlip);
      for (const option of monthOptionValueList) {
        insertSlipOption.push({
          slipId,
          code: option.code,
          name: optionListByValue[option.code].name,
          value: option.value,
          type: 2,
          remark: '',
          createTime: new Date(),
          createUserId: userId
        });
      }
      insertSlipOption.length && await jianghuKnex(tableEnum.salary_slip_option).insert(insertSlipOption);
      // 修改 salary_month_record 状态
      await jianghuKnex(tableEnum.salary_month_record).where({sRecordId: monthRecord.sRecordId}).update({checkStatus: 11});
    };
  }
}

module.exports = SalaryService;
