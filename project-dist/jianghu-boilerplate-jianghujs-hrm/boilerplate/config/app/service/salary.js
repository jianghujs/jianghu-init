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

  async beforeInsertSalaryGroupHook() {
    const { userId } = this.ctx.userInfo;
    this.ctx.request.body.appData.actionData.groupId = idGenerateUtil.uuid();
    this.ctx.request.body.appData.actionData.createTime = new Date();
    this.ctx.request.body.appData.actionData.createUserId = userId;
  }

  async afterSchemeAppendProjectHook() {
    const { jianghuKnex } = this.app;
    const projectList = await jianghuKnex(tableEnum.insurance_project).select();
    this.ctx.body.appData.resultData.rows.forEach((row) => {
      row.projectList = projectList.filter((project) => project.schemeId === row.schemeId);
    });
  }

  async updateScheme() {
    const { jianghuKnex } = this.app;
    let { id, schemeName, city, schemeType, projectList, isDel, schemeId } = this.ctx.request.body.appData.actionData;
    if (id) {
      await jianghuKnex(tableEnum.insurance_scheme).where({ id }).update({city, schemeType, schemeName, isDel});
    } else {
      schemeId = idGenerateUtil.uuid();
      await jianghuKnex(tableEnum.insurance_scheme).insert({city, schemeType, schemeName, isDel, schemeId, createTime: dayjs().format("YYYY-MM-DD HH:mm:ss")});
    }
    const existProjectList = await jianghuKnex(tableEnum.insurance_project).where({ schemeId }).select();
    // 判断被删除的project
    const delProjectIdList = existProjectList.filter((existProject) => !projectList.some((project) => project.id == existProject.id)).map((project) => project.id);
    // 删除被删除的project
    if (delProjectIdList.length > 0) {
      await jianghuKnex(tableEnum.insurance_project).whereIn("id", delProjectIdList).delete();
    }

    for (const project of projectList) {
      const { 
        id, 
        type,
        schemeId: projectSchemeId,
        projectName,
        defaultAmount,
        corporateProportion,
        personalProportion,
        corporateAmount,
        personalAmount,
        isDel 
      } = project;
      if (id) {
        await jianghuKnex(tableEnum.insurance_project).where({ id }).update({
          type,
          defaultAmount,
          corporateProportion,
          personalProportion,
          corporateAmount,
          personalAmount,
          isDel
        });
      } else {
        const projectId = idGenerateUtil.uuid();
        await jianghuKnex(tableEnum.insurance_project).insert({
          type,
          schemeId: projectSchemeId || schemeId,
          projectId, 
          projectName, 
          defaultAmount,
          corporateProportion,
          personalProportion,
          corporateAmount,
          personalAmount,
          isDel 
        });
      }
    }
  }
}

module.exports = InsuranceService;
