'use strict';
const Service = require('egg').Service;
const { tableEnum } = require("../constant/constant");
const _ = require("lodash");
const path = require("path");
const fileUtil = require('@jianghujs/jianghu/app/common/fileUtil');
const xlsx = require('node-xlsx');

// TODO: 封装一下
const dayjs = require("dayjs");
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)

const idGenerateUtil = require("@jianghujs/jianghu/app/common/idGenerateUtil");
const validateUtil = require("@jianghujs/jianghu/app/common/validateUtil");
const { BizError, errorInfoEnum } = require("../constant/error");
const fs = require("fs"),
    fsPromises = require("fs").promises,
    rename = fsPromises.rename,
    util = require("util"),
    rimraf = util.promisify(require("rimraf")),
    exists = util.promisify(fs.exists);
const actionDataScheme = Object.freeze({
  uploadItem: {
    type: 'object',
    additionalProperties: true,
    required: [ 'data' ],
    properties: {
      data: { type: 'array' },
    },
  },
});

class EmployeeService extends Service {
  // 状态统计
  async getStatusCount(){
    const { jianghuKnex, knex } = this.app;
    const { actionData } = this.ctx.request.body.appData;

    const table = `${tableEnum.view01_employee} as employee`
    const status = await jianghuKnex(table).groupBy('status').select(`employee.status`, knex.raw('COUNT(*) AS count'));
    const employmentForms = await jianghuKnex(table).groupBy('employmentForms').select(`employee.employmentForms`, knex.raw('COUNT(*) AS count'));
    const entryStatus = await jianghuKnex(table).groupBy('entryStatus').select(`employee.entryStatus`, knex.raw('COUNT(*) AS count'));

    return { rows: { status, employmentForms, entryStatus } }
  }
  // ================ 离职相关 =====================
  // 离职BeforeHook
  async quitInsertBeforeHook() {
    Object.assign(this.ctx.request.body.appData.actionData, {
      quitInfoId: idGenerateUtil.uuid(),
      createTime: dayjs().format('YYYY-MM-DD-HH-mm-ss')
    })
  }
  // 离职AfterHook
  async quitAfterHook() {
    const { employeeId } = this.ctx.request.body.appData.actionData;
    if (employeeId) {
      // 更新员工在职状态
      await this.app.jianghuKnex(tableEnum.employee).where({employeeId}).jhUpdate({ entryStatus: 3});
    }
  }
  // ================ 调整岗位/部门、晋升/降级 相关 =====================
  // BeforeHook
  async changeInsertBeforeHook() {
    const { userId } = this.ctx.userInfo;
    Object.assign(this.ctx.request.body.appData.actionData, {
      recordId: idGenerateUtil.uuid(),
      createUserId: userId,
      createTime: dayjs().format('YYYY-MM-DD-HH-mm-ss')
    })
  }
  // AfterHook
  async changeAfterHook() {
    const { employeeId, newDept, newPost, newPostLevel, newWorkAddress } = this.ctx.request.body.appData.actionData;
    const params = { deptId: newDept, post: newPost, postLevel: newPostLevel, workAddress: newWorkAddress}
    if (employeeId) {
      // 更新员工相关
      await this.app.jianghuKnex(tableEnum.employee).where({employeeId}).jhUpdate(params);
    }
  }
  // ================ 新建员工相关 =====================
  // BeforeHook
  async addEmployeeInsertBeforeHook() {
    const { userId } = this.ctx.userInfo;
    Object.assign(this.ctx.request.body.appData.actionData, {
      employeeId: idGenerateUtil.uuid(),
      createUserId: userId,
      createTime: dayjs().format('YYYY-MM-DD-HH-mm-ss')
    })
  }
  // ================ 导入相关 =====================
  async uploadItem(){
    const { userId } = this.ctx.userInfo;
    const actionData = this.ctx.request.body.appData.actionData;
    validateUtil.validate(actionDataScheme.uploadItem, actionData);
    const { data } = actionData;
    const { jianghuKnex } = this.app;

    const params = _.map(data, (user, key) => {
      return {
        ...user,
        employeeId: idGenerateUtil.uuid(),
        createUserId: userId,
        createTime: dayjs().format('YYYY-MM-DD-HH-mm-ss')
      }
    })

    await jianghuKnex(tableEnum.employee).insert(params);
    return { rows: {} };
  }
  // ================ 导出相关 =====================
  async getExcelData() {
    const app = this.app;
    const { config, jianghuKnex } = app;
    const { uploadDir, downloadBasePath } = config;
    const { where, whereLike, limit, orderBy } = this.ctx.request.body.appData;

    const employeeData = await jianghuKnex(tableEnum.employee)
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .select();

    // 设定excel 列名
    const fieldList = ['employeeName', 'jobNumber', 'mobile', 'post', 'employmentForms', 'status', 'entryTime', 'idType', 'idNumber'];
    const nameList = ['姓名', '工号', '手机号', '岗位', '聘用形式', '员工状态', '入职日期', '证件类型', '证件号码'];
    // 组装excel data数据
    const dataList = [];
    employeeData.forEach(e => {
      dataList.push(fieldList.map(field => {
        return field === 'entryTime' ? dayjs(e[field]).format('YYYY-MM-DD') : e[field] || '';
      }));
    })
    const data = [
      nameList,
      ...dataList
    ];

    const buffer = xlsx.build([{name: 'mySheetName', data: data}]); // Returns a buffer
    const excelDirectory = 'excelTemp';
    const excelName = 'tempExcel.xlsx';
    const fileUploadPath = path.join(uploadDir, excelDirectory);
    const filePath = path.join(fileUploadPath, excelName);
    const isFileExists = await fileUtil.exists(fileUploadPath);
    if (!isFileExists) {
      await fileUtil.checkAndPrepareFilePath(fileUploadPath);
    }
    await fileUtil.writeFile(filePath, buffer);
    return {
      filePath: '/excelTemp/' + excelName
    }
  }
}

module.exports = EmployeeService;
