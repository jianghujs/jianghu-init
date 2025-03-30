/* eslint-disable */
const content = {
  pageType: "jh-page", pageId: "reportRecordManagement", table: "report_record", pageName: "[汇报]汇报记录", template: "jhTemplateV4", version: 'v3',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "view01_report_record", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      // resourceHook: { before: [{service:"common",serviceFunction:"generateBizIdOfBeforeHook"}] },
      desc: "✅添加",
      resourceData: { table: "report_record", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新",
      resourceData: { table: "report_record", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除",
      resourceData: { table: "report_record", operation: "jhDelete" }
    },
    {
      actionId: "insertItemComment",
      resourceType: "service",
      desc: "✅添加",
      resourceData: { service: "reportComment", serviceFunction: "insertItemComment" }
    },
    {
      actionId: "getReportTaskList",
      resourceType: "sql",
      desc: "✅获取汇报任务列表",
      resourceData: { table: "report_task", operation: "select" }
    },
    {
      actionId: "insertReviewRecord",
      resourceType: "sql",
      desc: "✅添加审阅记录",
      resourceData: { table: "report_review_record", operation: "jhInsert" }
    },
    {
      actionId: "selectReviewRecordList",
      resourceType: "sql",
      desc: "✅获取审阅记录列表",
      resourceData: { table: "report_review_record", operation: "select" }
    },
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "汇报记录", attrs: { cols: 12, sm: 6, md: 4 }, helpBtn: true, slot: [] },

    { tag: 'v-spacer' },
    {
      tag: 'jh-search',
      attrs: { cols: 12, sm: 6, md: 8 },
      searchBtn: false,
      value: [
        // { tag: "v-text-field", model: "serverSearchWhereLike.className", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '前缀'} },
      ],
      data: {
        keyword: '', // 特殊搜索变量，支持多字段模糊搜索
        keywordFieldList: [], // 模糊字段列表
        serverSearchWhereLike: {},
      }
    },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {
        ':items': 'tableDataFromBackend'
      },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', attrs: { color: 'primary', small: true, '@click': 'isCreatorShown = true' }, value: '新增' },
        { tag: 'v-spacer' },
        /*html*/`
        <!-- 添加过滤按钮组 -->
        <v-btn-toggle v-model="filterType" mandatory class="mr-2 elevation-0">
          <v-btn small value="all">全部</v-btn>
          <v-btn small value="reviewer_pending">待我审阅的</v-btn>
          <v-btn small value="reviewer_reviewed">我已审阅的</v-btn>
          <v-btn small value="cc">抄送我的</v-btn>
          <v-btn small value="submitter">我汇报的</v-btn>
          <v-btn small value="viewer">我查看的</v-btn>
          <v-btn small value="tagged">@我的</v-btn>
        </v-btn-toggle>
        
        <v-col cols="12" sm="6" md="3" xs="8" class="pa-0">
          <v-text-field prefix="筛选" v-model="searchInput" class="jh-v-input" dense filled single-line></v-text-field>
        </v-col>
        `
      ],
      headers: [
        { text: "汇报记录ID", value: "reportRecordId", width: 80, sortable: true },
        { text: "汇报任务ID", value: "reportTaskId", width: 80, sortable: true },
        { text: "周期类型", value: "periodType", width: 80, sortable: true },
        { text: "提交人ID", value: "submitterId", width: 80, sortable: true },
        { text: "提交人姓名", value: "submitterName", width: 80, sortable: true },
        { text: "周期值", value: "periodValue", width: 80, sortable: true },
        { text: "提交时间", value: "submitTime", width: 80, sortable: true },
        { text: "是否逾期提交", value: "isOverdue", width: 80, sortable: true },
        { text: "审阅状态", value: "reviewStatus", width: 80, sortable: true },
        { text: "总批示内容", value: "generalComment", width: 80, sortable: true },
        { text: "总批示时间", value: "generalCommentAt", width: 80, sortable: true },
        { text: "总批示人", value: "generalCommentBy", width: 80, sortable: true },
        // { text: "是否锁定", value: "isLocked", width: 80, sortable: true },
        { text: "审阅人ID列表", value: "reviewerIds", width: 80, sortable: true },
        { text: "抄送人ID列表", value: "ccUserIds", width: 80, sortable: true },
        { text: "查看人ID列表", value: "viewerIds", width: 80, sortable: true },
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 200', align: "center", class: "fixed", cellClass: "fixed" },
      ],
      value: /*html*/`
      <template v-slot:item.reviewStatus="{item}">
        {{ item.reviewStatus | parseConstantText('reportReviewStatus') }}
      </template>
      <template v-slot:item.isOverdue="{item}">
        {{ item.isOverdue | parseConstantText('reportOverdue') }}
      </template>
      <template v-slot:item.isLocked="{item}">
        {{ item.isLocked | parseConstantText('reportLock') }}
      </template>
      <template v-slot:item.reviewerIds="{item}">
      {{ formatUserNames(item.reviewerIds, userList) }}
      </template> 
      <template v-slot:item.ccUserIds="{item}">
      {{ formatUserNames(item.ccUserIds, userList) }}
      </template>
      <template v-slot:item.viewerIds="{item}">
      {{ formatUserNames(item.viewerIds, userList) }}
      </template>
      
      `,
      rowActionList: [
        // 简写支持 pc 和 移动端折叠
        { text: '修改', attrs: { 'v-if': 'getReviewType(item) == "submitter" && item.reviewStatus == "pending" || isAdmin' }, icon: 'mdi-note-edit-outline', color: 'success', click: 'openReportPeriodItemDialog(item)' },
        { text: '审阅', attrs: { 'v-if': 'getReviewType(item) == "reviewer" || isAdmin' }, icon: 'mdi-book-open', color: 'success', click: 'openReportPeriodItemDialog(item)' },
        { text: '抄送', attrs: { 'v-if': 'getReviewType(item) == "cc"' }, icon: 'mdi-send-outline', color: 'success', click: 'openReportPeriodItemDialog(item)' },
        { text: '查看', attrs: { 'v-if': 'getReviewType(item) == "view" || getReviewType(item) == "submitter" && item.reviewStatus != "pending" && !isAdmin' }, icon: 'mdi-eye-outline', color: 'success', click: 'openReportPeriodItemDialog(item)' },
        { text: '删除', attrs: { 'v-if': 'isTimeReached(item) && item.reviewStatus == "pending" || isAdmin' }, icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' }
      ],
    }
  ],
  actionContent: [

  ],
  includeList: [
    "{% include 'component/userSelector.html' %}",
    "{% include 'common/constantUtil.html' %}",
    "{% include 'common/timeUtil.html' %}",
    "{% include 'common/dateUtil.html' %}",
    "{% include 'common/mixin/userNameMixin.html' %}",
    "{% include 'component/atMentionTextarea.html' %}",
    { type: 'html', path: 'component/reportRecordCreator.html', includeType: 'auto', attrs: {
      ref: 'reportRecordCreator',
      'v-model': 'isCreatorShown',
      ':user-list': 'userList',
      '@created': 'getTableData()'
    }},
    {
      type: 'html', path: 'component/reportPeriodItemEditor.html', includeType: 'auto', attrs: {
        ref: 'reportPeriodItemEditor',
        'v-model': 'isEditorShown',
        ':review-type': 'reviewType',
        ':report-record': 'currentRecord',
        ':user-list': 'userList'
      }
    },

  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: {
    mixins: '[userNameMixin]',
    data: {
      constantObj: {
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      filterMap: {}, // 结果筛选条件

      filterType: 'all',

      isReportPeriodItemDialogShown: false,
      periodItemHeaders: [
        { text: "类别", value: "category", width: 150 },
        { text: "工作项目", value: "workItem", width: 200 },
        { text: "责任人", value: "responsiblePerson", width: 150 },
        { text: "协作人", value: "collaborators", width: 150 },
        { text: "是否完成", value: "isCompleted", width: 100 },
        { text: "进度描述", value: "progressDesc", width: 150 },
        { text: "纠正措施", value: "correctiveMeasures", width: 150 },
        { text: "计划完成时间", value: "plannedCompletionTime", width: 150 },
        { text: "实际完成时间", value: "actualCompletionTime", width: 150 },
        { text: "备注", value: "remark", width: 150 },
        { text: "完成方法", value: "completionMethod", width: 150 },
        { text: "操作", value: "action", width: 100, align: "center", class: "fixed", cellClass: "fixed" }
      ],
      previousPeriodItems: [],
      currentPeriodItems: [],
      currentReportRecord: null,
      itemsToDelete: [],

      isEditorShown: false,
      currentRecord: {},
      reviewType: 'submitter', // 或 'reviewer' 或 'cc'
      userList: [],
      reportTaskList: [],

      isCreatorShown: false,
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式

    watch: {
      filterType: {
        handler(val) {
          this.doUiAction('getTableData')
        },
        immediate: true
      }
    },

    computed: {
      isAdmin() {
        return window.userInfo.userGroupRoleList.some(item => item.groupId === "超级管理员");
      },
    },
    async created() {
      this.fetchAvailableUsers();
      this.doUiAction('getReportTaskList');
    },
    doUiAction: {
      getReportTaskList: ['getReportTaskList'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      prepareTableParams() {
        switch (this.filterType) {
          case 'all':
              this.tableParams.whereOrOptions = this.isAdmin ? [] : [
                ['reviewerIds', 'like', '%' + window.userInfo.userId + '%'],
                ['ccUserIds', 'like', '%' + window.userInfo.userId + '%'],
                ['submitterId', '=', window.userInfo.userId],
                ['viewerIds', 'like', '%' + window.userInfo.userId + '%'],
              ];
              break;
          case 'reviewer_pending':
              this.tableParams.whereOptions = [['reviewerIds', 'like', '%' + window.userInfo.userId + '%'], ['reviewStatus', '=', 'pending']];
              break;
          case 'reviewer_reviewed':
              this.tableParams.whereOptions = [['reviewerIds', 'like', '%' + window.userInfo.userId + '%'], ['reviewStatus', '=', 'reviewed']];
              break;
          case 'cc':
              this.tableParams.whereOptions = [['ccUserIds', 'like', '%' + window.userInfo.userId + '%']];
              break;
          case 'submitter':
              this.tableParams.whereOptions = [['submitterId', '=', window.userInfo.userId]];
              break;
          case 'viewer':
              this.tableParams.whereOptions = [['viewerIds', 'like', '%' + window.userInfo.userId + '%']];
              break;
          case 'tagged':
              this.tableParams.whereOptions = [['combined_taggedUsers', 'like', '%' + window.userInfo.userId + '%']];
              break;
        }
      },
      // 获取表格数据
      isTimeReached(item) {
        // 获取对应 task的deadlineTime
        const task = this.reportTaskList.find(t => t.reportTaskId === item.reportTaskId);
        if (!task || !task.deadlineTime) {
          return true; // 如果没有设置提醒时间，默认可以提交
        }
        return !window.timeUtil.isTimeReached(task.deadlineTime, item.periodType, item.periodValue);
      },
      async openReportPeriodItemDialog(item) {
        this.currentRecord = _.cloneDeep(item);

        // 根据当前用户角色设置reviewType
        this.reviewType = this.getReviewType(item);

        console.log('Setting reviewType:', this.reviewType);
        this.isEditorShown = true;
      },

      async getReportTaskList() {
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'reportRecordManagement',
              actionId: 'getReportTaskList',
              actionData: {},
              whereOptions: this.isAdmin ? [] : [
                ['reporterIds', 'like', `%${window.userInfo.userId}%`],
                ['reviewerIds', 'like', `%${window.userInfo.userId}%`],
                ['ccUserIds', 'like', `%${window.userInfo.userId}%`],
                ['viewerIds', 'like', `%${window.userInfo.userId}%`],
                ['combined_taggedUsers', 'like', `%${window.userInfo.userId}%`],
              ]
            }
          }
        });
        console.log('Report task list:', result.data.appData.resultData);
        this.reportTaskList = result.data.appData.resultData.rows || [];
      },

      // 在 methods 中添加
      getReviewType(item) {
        if (item.submitterId === window.userInfo.userId) {
          return 'submitter';
        } else if (item.reviewerIds && item.reviewerIds.includes(window.userInfo.userId)) {
          return 'reviewer';
        } else if (item.ccUserIds && item.ccUserIds.includes(window.userInfo.userId)) {
          return 'cc';
        } else if (item.viewerIds && item.viewerIds.includes(window.userInfo.userId)) {
          return 'view';
        }
      },


      addPeriodItem(periodType) {
        const newItem = {
          periodItemType: periodType,
          reportRecordId: this.currentRecord.reportRecordId,
          category: '',
          workItem: '',
          responsiblePerson: '',
          collaborators: '',
          isCompleted: false,
          progressDesc: '',
          correctiveMeasures: '',
          plannedCompletionTime: '',
          actualCompletionTime: '',
          remark: '',
          completionMethod: '',
          itemSort: periodType === 'previousPeriod'
            ? this.previousPeriodItems.length
            : this.currentPeriodItems.length,
          plannedCompletionTimeMenu: false,
          actualCompletionTimeMenu: false,
          isNew: true
        };

        if (periodType === 'previousPeriod') {
          this.previousPeriodItems.push(newItem);
        } else {
          this.currentPeriodItems.push(newItem);
        }
      },

      async deletePeriodItem(periodType, item) {
        if (await window.confirmDialog({ title: "删除", content: "确定删除该计划项吗？" }) === false) {
          return;
        }

        if (periodType === 'previousPeriod') {
          const index = this.previousPeriodItems.findIndex(i => i === item);
          if (index !== -1) {
            if (!item.isNew && item.periodItemId) {
              this.itemsToDelete.push(item.periodItemId);
            }
            this.previousPeriodItems.splice(index, 1);
          }
        } else {
          const index = this.currentPeriodItems.findIndex(i => i === item);
          if (index !== -1) {
            if (!item.isNew && item.periodItemId) {
              this.itemsToDelete.push(item.periodItemId);
            }
            this.currentPeriodItems.splice(index, 1);
          }
        }
      },

      async saveReportPeriodItems() {
        let isValid = true;

        for (const item of this.previousPeriodItems) {
          if (!item.workItem) {
            window.vtoast.error('上期项的工作事项不能为空');
            isValid = false;
            break;
          }
        }

        if (isValid) {
          for (const item of this.currentPeriodItems) {
            if (!item.workItem) {
              window.vtoast.error('本期项的工作事项不能为空');
              isValid = false;
              break;
            }
          }
        }

        if (!isValid) return;

        if (await window.confirmDialog({ title: "保存", content: "确定保存所有计划项吗？" }) === false) {
          return;
        }

        await window.jhMask.show();
        await window.vtoast.loading("保存数据中");

        try {
          const itemsToCreate = [];
          const itemsToUpdate = [];

          [...this.previousPeriodItems, ...this.currentPeriodItems].forEach(item => {
            const { plannedCompletionTimeMenu, actualCompletionTimeMenu, isNew, ...data } = item;

            if (isNew) {
              itemsToCreate.push(data);
            } else if (item.periodItemId) {
              itemsToUpdate.push(data);
            }
          });

          await window.jianghuAxios({
            data: {
              appData: {
                pageId: 'reportRecordManagement',
                actionId: 'saveReportPeriodItems',
                actionData: {
                  itemsToCreate,
                  itemsToUpdate,
                  itemsToDelete: this.itemsToDelete || []
                }
              }
            }
          });

          await window.vtoast.success("保存成功");
          this.closeReportPeriodItemDialog();
        } catch (error) {
          console.error('保存计划项失败', error);
          await window.vtoast.error('保存计划项失败');
        } finally {
          await window.jhMask.hide();
        }
      },

      async closeReportPeriodItemDialog() {
        const hasChanges = this.previousPeriodItems.some(item => item.isNew) ||
          this.currentPeriodItems.some(item => item.isNew) ||
          this.itemsToDelete?.length > 0;

        if (hasChanges) {
          if (await window.confirmDialog({ title: "关闭", content: "有未保存的更改，确定关闭吗？" }) === false) {
            return;
          }
        }

        this.isReportPeriodItemDialogShown = false;
      },
      async fetchAvailableUsers() {
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

        this.userList = rows || [];

      },
    }
  },

};

module.exports = content;