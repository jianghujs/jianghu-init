const content = {
  pageType: "jh-page", pageId: "reportTaskManagement", table: "report_task", pageName: "[汇报]汇报任务", template: "jhTemplateV4", version: 'v4',

  idGenerate: {
    prefix: 'RW',
    type: 'idSequence',
    bizId: 'reportTaskId',
    tableName: 'report_task',
    startValue: 1000,
  },
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "report_task", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "service",
      resourceHook: {},
      desc: "✅添加",
      resourceData: { service: "report", serviceFunction: "addReportTask" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新", 
      resourceData: { table: "report_task", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除",
      resourceData: { table: "report_task", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "汇报任务", attrs: { cols: 12, sm: 6, md: 4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    {
      tag: 'v-btn-toggle',
      attrs: {
        "v-model": "filterType",
      },
      value: [
        { tag: 'v-btn', attrs: {small: true, value: 'all'}, value: '全部'},
        { tag: 'v-btn', attrs: {small: true, value: 'reporter'}, value: '我汇报的'},
        { tag: 'v-btn', attrs: {small: true, value: 'reviewer'}, value: '我收到的'},
      ]
    },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {},
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")' }, quickAttrs: ['small'] },
        { tag: 'v-spacer' },
        /*html*/`
        <v-col cols="12" sm="6" md="3" xs="8" class="pa-0">
          <v-text-field prefix="筛选" v-model="searchInput" class="jh-v-input" dense filled single-line></v-text-field>
        </v-col>
        `
      ],
      headers: [
        { text: "任务编号", value: "reportTaskId", width: 80, sortable: true },
        { text: "任务名称", value: "taskName", width: 150, sortable: true },
        { text: "提交人", value: "reporterIds", width: 200, sortable: true },
        { text: "审阅人", value: "reviewerIds", width: 200, sortable: true },
        { text: "抄送人", value: "ccUserIds", width: 200, sortable: true },
        { text: "查看人", value: "viewUserIds", width: 200, sortable: true },
        { text: "汇报周期", value: "periodType", width: 80, sortable: true },
        { text: "汇报次数", value: "submitCount", width: 80, sortable: true },
        { text: "提醒时间", value: "reminderTimes", width: 200, sortable: true },
        { text: "状态", value: "statusType", width: 100, sortable: true },
        { text: "备注", value: "taskDesc", width: 80, sortable: true },
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 120', align: "center", class: "fixed", cellClass: "fixed" },
      ],
      value: /*html*/`
      <template v-slot:item.periodType="{item}">
        {{ item.periodType | parseConstantText('reportPeriodType') }}
      </template>
      <template v-slot:item.statusType="{item}">
        <div class="d-flex align-center">
          <v-switch
            v-model="item.statusActive"
            :color="constantUtil.parseConstantText(item.statusType, 'reportStatusType', 'color')"
            dense
            hide-details
            class="mt-0 pt-0"
            :label="item.statusType | parseConstantText('reportStatusType')"
            @change="changeItemStatus(item)"
          ></v-switch>
        </div>
      </template>
      <template v-slot:item.reporterIds="{item}">
      {{ formatUserNames(item.reporterIds, userList) }}
      </template>
      <template v-slot:item.reviewerIds="{item}">
      {{ formatUserNames(item.reviewerIds, userList) }}
      </template>
      <template v-slot:item.ccUserIds="{item}">
      {{ formatUserNames(item.ccUserIds, userList) }}
      </template>
      <template v-slot:item.viewUserIds="{item}">
      {{ formatUserNames(item.viewUserIds, userList) }}
      </template>
      <template v-slot:item.reminderTimes="{item}">
        <span small v-for="time in item.reminderTimes" :key="time">
          {{ time }}
        </span>
      </template>
      `,
      rowActionList: [
        // 简写支持 pc 和 移动端折叠
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
        { text: '删除', icon: 'mdi-delete', color: 'error', click: 'doUiAction("startDeleteItem", item)' },
      ],
    }
  ],
  actionContent: [
    {
      tag: 'jh-create-drawer',
      key: "create",
      attrs: {},
      title: '新增任务设置',
      isCheckFormBeforeClose: true,
      onCheckFormConfirm: "doUiAction('createItem')",
      headSlot: [
        { tag: 'v-spacer' }
      ],
      
      contentList: [
        {
          label: "新增",
          type: "form",
          formItemList: [
            /**
            * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
            * attrs: {} // 表单项属性
            */
            { label: "任务名", model: "taskName", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "周期", model: "periodType", tag: "v-select", attrs: { items: "constantObj.reportPeriodType" }, default: "week", rules: "validationRules.requireRules" },
            { label: "状态", model: "statusType", tag: "v-select", attrs: { items: "constantObj.reportStatusType" }, default: "active", rules: "validationRules.requireRules" },

            { label: "汇报截止时间", model: "deadlineTime", tag: "period-selector", colAttrs: { md: 12 },attrs: { ":periodType": "createItem.periodType", multiple: false }, rules: "validationRules.requireRules" },
            { label: "选择填写提醒时间(可多选)", model: "reminderTimes", tag: "period-selector", colAttrs: { md: 12 },attrs: { ":periodType": "createItem.periodType", multiple: true }, rules: "validationRules.requireRules" },
            { label: "选择提醒审阅提醒时间(可多选)", model: "reviewReminderTimes", tag: "period-selector", colAttrs: { md: 12 },attrs: { ":periodType": "createItem.periodType", multiple: true }, rules: "validationRules.requireRules"},
            { label: "备注", model: "taskDesc", tag: "v-textarea", attrs: { placeholder: "请输入备注" }, colAttrs: { md: 12 }}, 

            { label: "汇报人列表", model: "reporterIds", colAttrs: { md: 12 }, tag: "user-selector", attrs: { multiple: true, border: true, ':userList': 'userList' }, rules: "validationRules.requireRules" },
            { label: "审阅人列表", model: "reviewerIds", colAttrs: { md: 12 }, tag: "user-selector", attrs: { multiple: true, border: true, ':userList': 'userList' }, rules: "validationRules.requireRules" },
            { label: "抄送人列表", model: "ccUserIds", colAttrs: { md: 12 }, tag: "user-selector", attrs: { multiple: true, border: true, ':userList': 'userList' } },
            { label: "查看人列表", model: "viewUserIds", colAttrs: { md: 12 }, tag: "user-selector", attrs: { multiple: true, border: true, disabled: true, ':userList': 'userList' } },
          ],
          action: [{
            tag: "v-btn",
            value: "保存",
            attrs: {
              color: "success",
              class: 'ml-2',
              ':small': true,
              '@click': "doUiAction('createItem')"
            }
          }],
        },
      ]
    },
    {
      tag: 'jh-update-drawer',
      key: "update",
      attrs: {},
      title: '编辑任务设置',
      isCheckFormBeforeClose: true,
      onCheckFormConfirm: "doUiAction('updateItem')",
      headSlot: [
        { tag: 'v-spacer' }
      ],
      contentList: [
        {
          label: "详情",
          type: "form",
          formItemList: [
            /**
            * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
            * attrs: {} // 表单项属性
            */

            { label: "任务名", model: "taskName", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "周期", model: "periodType", tag: "v-select", attrs: { items: "constantObj.reportPeriodType" }, default: "week", rules: "validationRules.requireRules" },
            { label: "状态", model: "statusType", tag: "v-select", attrs: { items: "constantObj.reportStatusType" }, default: "active", rules: "validationRules.requireRules" },

            { label: "汇报截止时间", model: "deadlineTime", tag: "period-selector", colAttrs: { md: 12 },attrs: { ":periodType": "updateItem.periodType", multiple: false }, rules: "validationRules.requireRules" },
            { label: "选择填写提醒时间(可多选)", model: "reminderTimes", tag: "period-selector", colAttrs: { md: 12 },attrs: { ":periodType": "updateItem.periodType", multiple: true }, rules: "validationRules.requireRules" },
            { label: "选择提醒审阅提醒时间(可多选)", model: "reviewReminderTimes", tag: "period-selector", colAttrs: { md: 12 },attrs: { ":periodType": "updateItem.periodType", multiple: true }, rules: "validationRules.requireRules"},
            { label: "备注", model: "taskDesc", tag: "v-textarea", attrs: { placeholder: "请输入备注" }, colAttrs: { md: 12 }}, 

            { label: "汇报人列表", model: "reporterIds", colAttrs: { md: 12 }, tag: "user-selector", attrs: { multiple: true, border: true, ':userList': 'userList' } },
            { label: "审阅人列表", model: "reviewerIds", colAttrs: { md: 12 }, tag: "user-selector", attrs: { multiple: true, border: true, ':userList': 'userList' } },
            { label: "抄送人列表", model: "ccUserIds", colAttrs: { md: 12 }, tag: "user-selector", attrs: { multiple: true, border: true, ':userList': 'userList' } },
            { label: "查看人列表", model: "viewUserIds", colAttrs: { md: 12 }, tag: "user-selector", attrs: { multiple: true, border: true, ':userList': 'userList' } },
          ],
          action: [{
            tag: "v-btn",
            value: "保存",
            attrs: {
              color: "success",
              class: 'ml-2',
              ':small': true,
              '@click': "doUiAction('updateItem')"
            }
          }],
        },

      ]
    }
  ],
  includeList: [
    "{% include 'component/userSelector.html' %}",
    "{% include 'common/constantUtil.html' %}",
    "{% include 'common/mixin/userNameMixin.html' %}",
    "{% include 'component/periodSelect.html' %}"
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: {
    mixins: '[userNameMixin]',
    data: {
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      filterMap: {}, // 结果筛选条件
      selectedUser: [],
      isAddNodeUserDialogShown: false,
      isSelectReporterIdDialogShown: false,
      isSelectReviewerIdsDialogShown: false,
      isSelectCcUserIdsDialogShown: false,
      filterType: 'all',
      userList: [],
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500',
      constantObj: 'window.constantObj'
    }, // data 表达式
    computed: {

    },
    async created() {
      this.doUiAction('getTableData');
      this.fetchUsers();
    },
    doUiAction: {
      startDeleteItem: ['startDeleteItem']
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      async startDeleteItem(item) {
        if (await window.confirmDialog({ title: "删除任务", content: `确定删除任务"${item.taskName}"吗？` }) === false) {
          return;
        }
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'reportTaskManagement',
              actionId: 'deleteItem',
              actionData: {},
              where: { id: item.id }
            }
          }
        });
        window.vtoast.success('删除任务成功');
        this.doUiAction('getTableData');
      },
      async fetchUsers() {
        this.isLoading = true;
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'allPage',
              actionId: 'getUserListBySingleGroup',
              actionData: {},
              whereOptions: [["userId", "<>", "admin"]],
            }
          }
        });

        const { rows } = result.data.appData.resultData;
        this.userList = rows;
      },
      formatTableData() {
        let tableData = this.tableDataFromBackend.map(row => {
          row.operationAt = row.operationAt ? dayjs(row.operationAt).format('YYYY-MM-DD HH:mm:ss') : '';
          row.statusActive = row.statusType == 'active';

          row.deadlineTime = row.deadlineTime?.split(',');
          row.reminderTimes = row.reminderTimes?.split(','); 
          row.reviewReminderTimes = row.reviewReminderTimes?.split(',');
          row.reporterIds = row.reporterIds?.split(',');
          row.reviewerIds = row.reviewerIds?.split(',');
          row.ccUserIds = row.ccUserIds?.split(',');
          row.viewUserIds = row.viewUserIds?.split(',');
          return row;
        });
        this.tableData = tableData;
      },
      prepareDoCreateItem() { 
        const { id, ...data } = this.createItem;

        if (!data.reporterIds || data.reporterIds.length === 0) {
          window.vtoast.fail("汇报人不能为空");
          return;
        }

        if (!data.deadlineTime || data.deadlineTime.length === 0) {
          window.vtoast.fail("汇报截止时间不能为空");
          return;
        }

        if (!data.reminderTimes || data.reminderTimes.length === 0) {
          window.vtoast.fail("填写提醒时间不能为空");
          return;
        }

        if (!data.reviewReminderTimes || data.reviewReminderTimes.length === 0) {
          window.vtoast.fail("提醒审阅提醒时间不能为空");
          return;
        }

        this.createActionData = {
          taskName: data.taskName,
          taskDesc: data.taskDesc,
          periodType: data.periodType,
          deadlineTime: data.deadlineTime,
          reminderTimes: data.reminderTimes.join(','),
          reviewReminderTimes: data.reviewReminderTimes.join(','),
          statusType: data.statusType,
          reporterIds: typeof data.reporterIds === 'string' ? data.reporterIds : data.reporterIds?.map(item => typeof item === 'string' ? item : item.userId)?.join(','),
          reviewerIds: typeof data.reviewerIds === 'string' ? data.reviewerIds : data.reviewerIds?.map(item => typeof item === 'string' ? item : item.userId)?.join(','),
          ccUserIds: typeof data.ccUserIds === 'string' ? data.ccUserIds : data.ccUserIds?.map(item => typeof item === 'string' ? item : item.userId)?.join(','),
          viewUserIds: typeof data.viewUserIds === 'string' ? data.viewUserIds : data.viewUserIds?.map(item => typeof item === 'string' ? item : item.userId)?.join(','),
        };
      },
      async prepareDoUpdateItem() {
        const {id, ...data} = this.updateItem;
        this.updateItemId = id;
        if (!data.deadlineTime || data.deadlineTime.length === 0) {
          window.vtoast.fail("汇报截止时间不能为空");
          return;
        }

        if (!data.reminderTimes || data.reminderTimes.length === 0) {
          window.vtoast.fail("填写提醒时间不能为空");
          return;
        }

        if (!data.reviewReminderTimes || data.reviewReminderTimes.length === 0) {
          window.vtoast.fail("提醒审阅提醒时间不能为空");
          return;
        }

        console.log("data.viewUserIds", data.reporterIds);

        this.updateActionData = {
          taskName: data.taskName,
          taskDesc: data.taskDesc,
          periodType: data.periodType,
          deadlineTime: data.deadlineTime,
          reminderTimes: data.reminderTimes?.join(','),
          reviewReminderTimes: data.reviewReminderTimes?.join(','),
          statusType: data.statusType,
          reporterIds: typeof data.reporterIds === 'string' ? data.reporterIds : data.reporterIds?.map(item => typeof item === 'string' ? item : item.userId)?.join(','),
          reviewerIds: typeof data.reviewerIds === 'string' ? data.reviewerIds : data.reviewerIds?.map(item => typeof item === 'string' ? item : item.userId)?.join(','),
          ccUserIds: typeof data.ccUserIds === 'string' ? data.ccUserIds : data.ccUserIds?.map(item => typeof item === 'string' ? item : item.userId)?.join(','),
          viewUserIds: typeof data.viewUserIds === 'string' ? data.viewUserIds : data.viewUserIds?.map(item => typeof item === 'string' ? item : item.userId)?.join(','),
        };
      },

      async changeItemStatus(item) {
        const newStatus = item.statusActive ? 'active' : 'inactive';

        if (await window.confirmDialog({ title: "修改状态", content: `确定将状态修改为"${constantUtil.parseConstantText(newStatus, 'reportStatusType')}"吗？` }) === false) {
          item.statusActive = !item.statusActive;
          return;
        }

        await window.jhMask.show();
        await window.vtoast.loading("修改状态");
        try {
          await window.jianghuAxios({
            data: {
              appData: {
                pageId: 'reportTaskManagement',
                actionId: 'updateItem',
                actionData: { statusType: newStatus },
                where: { id: item.id }
              }
            }
          });

          item.statusType = newStatus;

          await window.vtoast.success("修改状态成功");
        } catch (error) {
          console.error(error);
          item.statusActive = !item.statusActive;
          await window.vtoast.error("修改状态失败");
        } finally {
          await window.jhMask.hide();
        }
      },
    }
  },

};

module.exports = content;