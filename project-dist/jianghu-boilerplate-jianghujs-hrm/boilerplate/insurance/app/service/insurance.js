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

class InsuranceService extends Service {

  async insertMonthRecord() {
    const { jianghuKnex } = this.app;
    const maxDate = await jianghuKnex(tableEnum.insurance_month_record).max("month as maxMonth").max("year as maxYear").first();
    const maxMonth = maxDate.maxMonth;
    const maxYear = maxDate.maxYear;
    let month = maxMonth + 1;
    let year = maxYear;
    if (maxMonth === 12) {
      month = 1;
      year = maxYear + 1;
    }
    // TODO:: socialSecurityStartMonth 根据用户社保起始月份获取对应列表
    // 员工状态筛选：全职、并且有社保方案
    const employeeList = await jianghuKnex(tableEnum.view01_employee_info).whereIn('status', [1, 2]).where({'employmentForms': 1, entryStatus: 1}).select();
    if (employeeList.length === 0) {
      throw new BizError(errorInfoEnum.noEmployee);
    }
    const iRecordId = idGenerateUtil.uuid();
    const monthRecord = { title: `${month}月社保表`, year, month, num: 0, status: 0, iRecordId };
    await jianghuKnex(tableEnum.insurance_month_record).insert(monthRecord);
    await this.insertEmployeeInsuranceDetail(monthRecord, employeeList)
  }
  async afterDelEmpRecord() {
    const { jianghuKnex } = this.app;
    const actionData = this.ctx.request.body.appData.where;
    // validateUtil.validate(actionData, actionDataScheme.afterDelEmpRecord);
    const { iRecordId } = actionData;
    // 删除empRecord
    await jianghuKnex(tableEnum.insurance_month_emp_record).where({ iRecordId }).delete();
  }
  async beforeCheckDelMonthRecord() {
    const { jianghuKnex } = this.app;
    // 查询 motnhRecord 数量
    const monthRecordCount = await jianghuKnex(tableEnum.insurance_month_record).count("iRecordId as count").first();
    if (monthRecordCount.count === 1) {
      throw new BizError(errorInfoEnum.onlyOneMonthRecord);
    }
  }
  // 手动添加社保员工
  async insertEmployeeRecord() {
    const { jianghuKnex } = this.app;
    const { employeeIdList, iRecordId } = this.ctx.request.body.appData.actionData;

    if (employeeIdList.length === 0) { 
      throw new BizError(errorInfoEnum.noEmployee);
    }
    const monthRecord = await jianghuKnex(tableEnum.insurance_month_record).where({ iRecordId }).first();
    const employeeList = await jianghuKnex(tableEnum.view01_employee_info).whereIn("employeeId", employeeIdList).select();

    await this.insertEmployeeInsuranceDetail(monthRecord, employeeList)
  }
  // 根据 人员信息、社保方案，写入社保详情列表、社保金额明细
  async insertEmployeeInsuranceDetail(monthRecord, employeeList) {
    const { jianghuKnex } = this.app;
    const schemeIdList = employeeList.map((employee) => employee.schemeId);
    const projectList = await jianghuKnex(tableEnum.insurance_project).whereIn('schemeId', schemeIdList).where({isDel: 0}).select();
    const projectListBySchemeId = _.groupBy(projectList, "schemeId");
    const insertMonthEmpRecordList = [];
    let insertMonthEmpProjectRecordList = [];
    employeeList.forEach((employee) => {
      const iEmpRecordId = idGenerateUtil.uuid();
      // 生成 empRecord
      insertMonthEmpRecordList.push({ 
        iRecordId: monthRecord.iRecordId, 
        employeeId: employee.employeeId, 
        schemeId: employee.schemeId, 
        year: monthRecord.year,
        month: monthRecord.month,
        personalInsuranceAmount: employee.personalAmount, 
        corporateInsuranceAmount: employee.corporateAmount, 
        personalProvidentFundAmount: employee.personalProvidentFundAmount, 
        corporateProvidentFundAmount: employee.corporateProvidentFundAmount,
        createTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        iEmpRecordId,
      });
      const currentProjectList = projectListBySchemeId[employee.schemeId];
      // 生成 empProjectRecord
      insertMonthEmpProjectRecordList = _.concat(insertMonthEmpProjectRecordList, this.buildMonthEmpProjectRecordList(iEmpRecordId, currentProjectList));
    });
    await jianghuKnex(tableEnum.insurance_month_emp_record).insert(insertMonthEmpRecordList);
    // 更改 monthRecord 的 num
    await jianghuKnex(tableEnum.insurance_month_record).where({ iRecordId: monthRecord.iRecordId }).update({ num: monthRecord.num + employeeList.length });
    // 写入员工社保详情
    await jianghuKnex(tableEnum.insurance_month_emp_project_record).insert(insertMonthEmpProjectRecordList);
  }
  // 生成 empProjectRecord
  buildMonthEmpProjectRecordList(iEmpRecordId, projectList) {
    const insertMonthEmpProjectRecordList = [];
    projectList.forEach((project) => {
      insertMonthEmpProjectRecordList.push({
        empProjectRecordId: idGenerateUtil.uuid(),
        iEmpRecordId,
        projectId: project.projectId,
        type: project.type,
        projectName: project.projectName,
        defaultAmount: project.defaultAmount,
        corporateProportion: project.corporateProportion,
        personalProportion: project.personalProportion,
        corporateAmount: project.corporateAmount,
        personalAmount: project.personalAmount
      });
    });
    return insertMonthEmpProjectRecordList;
  }

  // 修改员工社保方案信息
  async updateEmpSchemeRecord() {
    const { jianghuKnex } = this.app;
    const { iEmpRecordId, projectList, schemeId, employeeId } = this.ctx.request.body.appData.actionData;
    // validateUtil.validate(actionData, actionDataScheme.updateEmpSchemeRecord);
    // 修改员工社保方案
    await jianghuKnex(tableEnum.employee_social_security_info).where({ employeeId }).update({ schemeId });

    // 修改 empProjectRecord
    await jianghuKnex(tableEnum.insurance_month_emp_project_record).where({ iEmpRecordId }).delete();
    await jianghuKnex(tableEnum.insurance_month_emp_project_record).insert(this.buildMonthEmpProjectRecordList(iEmpRecordId, projectList));

    // 修改 empRecord
    const personalInsuranceAmount = _.sumBy(projectList, "personalAmount");
    const corporateInsuranceAmount = _.sumBy(projectList, "corporateAmount");
    const personalProvidentFundAmount = _.sumBy(projectList, "personalProportion");
    const corporateProvidentFundAmount = _.sumBy(projectList, "corporateProportion");
    return await jianghuKnex(tableEnum.insurance_month_emp_record).where({ iEmpRecordId, employeeId }).update({
      schemeId,
      personalInsuranceAmount,
      corporateInsuranceAmount,
      personalProvidentFundAmount,
      corporateProvidentFundAmount
    });

  }

  async checkNewMonthRecord() {
    const { jianghuKnex } = this.app;
    // 查询最新的月份记录
    const monthRecord = await jianghuKnex(tableEnum.insurance_month_record).orderBy("year", "desc").orderBy("month", "desc").first();
    const { year } = this.ctx.request.body.appData.whereLike;
    if (!monthRecord || monthRecord.year != year) {
      return;
    }
    this.ctx.body.appData.resultData.rows.forEach((row) => {
      if (row.year === monthRecord.year && row.month === monthRecord.month) {
        row.isNew = true;
      }
    });
  }
}

module.exports = InsuranceService;
