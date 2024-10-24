## Enterprise2



- DataRepository  数据仓库（Base）✅

- Directory  门户（Base）✅

- System     系统（Base）

    - 应用管理/列表✅

    - 用户组织架构【user userOrg 聚合管理appRole✅】// 参考: fs_issue-account-staff_v1

        - 主部门

        - 附属部门s

        - 直属上级

        - 应用角色s // 有应用角色才有应用权限     

    - 企业安全设置3️⃣

        - 密码规则 

        - 登出设置  // 是否允许多设备登录

        - 水印设置

    - 系统日志2️⃣

        - 用户操作日志

        - 登陆日志

        - 系统设置操作日志

        - 数据导入导出日志

- Task（Base）

    - 任务【业务任务、普通任务】1️⃣

        - 我的任务

        - 下属的任务

    - 审批1️⃣

        - 审批申请 // 选择模版

        - 待我审批

        - 归档【已close的审批】

        - 报表【审计统计】

    - 日志2️⃣

    - 通知1️⃣ 

    - 应用设置1️⃣

        - 审批模版设置

        - 日志模版设置

        - ...

- HRM     人力资源管理（CustomApp）

    - System.企业组织架构【user userOrg appRole】// 登陆、页面权限

    - Common.审批1️⃣

    - Common.通知1️⃣

    - Common.日程3️⃣

    - BI页面

    - HR招聘✅

    - HR员工组织架构【member memberOrg】✅

    - HR员工社保✅

    - 应用设置✅

        - 社保方案管理

        - 业务审批流设置

        - 审批模版

        - ...

- CRM     客户关系管理（CustomApp）

- BI      数据分析（CustomApp）