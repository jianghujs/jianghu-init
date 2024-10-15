const content = {
  "pageType": "jh-page",
  "pageId": "recordHistory",
  "table": "_record_history",
  "pageName": "数据历史",
  "resourceList": [
    {
      "actionId": "selectOnUseItemListByTable",
      "desc": "✅获取指定表的使用中的数据列表",
      "resourceType": "service",
      "resourceData": {
        "service": "recordHistory",
        "serviceFunction": "selectOnUseItemListByTable"
      }
    },
    {
      "actionId": "selectDeletedItemListByTable",
      "desc": "✅获取指定表的已删除的数据列表",
      "resourceType": "service",
      "resourceData": {
        "service": "recordHistory",
        "serviceFunction": "selectDeletedItemListByTable"
      }
    },
    {
      "actionId": "selectItemList",
      "desc": "✅获取数据历史表",
      "resourceType": "sql",
      "resourceData": {
        "table": "_record_history",
        "operation": "select"
      }
    },
    {
      "actionId": "restoreRecordByRecordHistory",
      "desc": "✅还原数据",
      "resourceType": "service",
      "resourceData": {
        "service": "recordHistory",
        "serviceFunction": "restoreRecordByRecordHistory"
      }
    }
  ],
  "includeList": [
    "{% include 'common/jianghuJs/fixedTableHeightV4.html' %}"
  ],
  headContent: [
    { tag: 'jh-page-title', value: "数据历史", attrs: { cols: 12, sm: 6, md: 4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    {
      tag: 'jh-search',
      value: [

      ],
    },
  ],
  "pageContent": [
    {
      tag: 'jh-table',
      attrs: {},
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-spacer' },
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '2', class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: { prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true } },
          ],
        }
      ],
      headers: [
        { text: "用户ID[登陆]", value: "userId", width: 120 },
        { text: "用户名", value: "username", width: 140 },
        { text: "用户类型", value: "userType", width: 120 },
        { text: "用户状态", value: "userStatus", width: 120 },
        { text: "初始密码", value: "clearTextPassword", width: 120 },
        { text: "操作人", value: "operationByUser", width: 90 },
        { text: "操作时间", value: "operationAt", width: 150 },
        { text: '操作', value: 'action', align: 'center', sortable: false, width: 230, class: 'fixed', cellClass: 'fixed' },
      ],
      value: [
         /*html*/`
         <template v-slot:item.operationAt="{ item }">
         {{ item.operationAt && dayjs(item.operationAt).format('YYYY-MM-DD HH:mm:ss') }}
       </template>

         `
      ],
      rowActionList: [
        { text: `查看数据版本<span v-if="item.count > 0" style="color: red">({{item.count}})</span>`, icon: 'mdi-eye-outline', color: 'success', click: 'doUiAction("viewRecordHistory", item)' },
        
      ],
    },
  ],
  "actionContent": [
    {
      tag: 'jh-drawer',
      key: "historyDetail",
      attrs: {},
      title: '数据版本',
      headSlot: [
        { tag: 'v-spacer' }
      ],
      contentList: [
        /*html*/`
        <v-data-table
            fixed-header
            checkbox-color="success"
            :headers="headers"
            :loading="isDrawerTableLoading"
            :items="recordHistoryDetailList"
            item-key="classId"
            :footer-props="{ itemsPerPageOptions: [20, 50, -1], itemsPerPageText: '每页行数', itemsPerPageAllText: '所有'}"
            :class="{'zebraLine': isTableZebraLineShown }"
            :items-per-page="-1"
            :data-bottom="-100"
            mobile-breakpoint="0"
            class="jh-fixed-table-height elevation-0 mt-0 mb-xs-4"
          >
            <!-- 表格操作按钮 -->
            <template v-slot:item.action="{ item }">
              <span role="button" class="success--text font-weight-medium font-size-2 text-no-wrap" @click="doUiAction('restoreRecordByRecordHistory', item)">
                <v-icon size="14" class="success--text">mdi-history</v-icon>还原数据
              </span>
            </template>
            <!-- 操作时间 -->
            <template v-slot:item.operationAt="{ item }">
              {{ item.operationAt && dayjs(item.operationAt).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <!-- 没有数据 -->
            <template v-slot:loading>
              <div class="jh-no-data">数据加载中</div>
            </template>
            <template v-slot:no-data>
              <div class="jh-no-data">暂无数据</div>
            </template>
            <template v-slot:no-results>
              <div class="jh-no-data">暂无数据</div>
            </template>
            <!-- 表格分页 -->
            <template v-slot:footer.page-text="pagination">
              <span>{{ pagination.pageStart }}-{{ pagination.pageStop }}</span>
              <span class="ml-1">共{{ pagination.itemsLength }}条</span>
            </template>
          </v-data-table>
        `
      ]
    },
  ],
  "common": {
    data: {

      breadcrumbs: [
        {text: '首页', disabled: true,},
        {text: '用户管理', disabled: true,}
      ],
      isHelpPageDrawerShown: false,
      // 页面变量
      isTableZebraLineShown: true,
      // 表格相关数据
      validationRules: {
        requireRules: [
          v => !!v || 'This is required',
        ],
      },
      // 可操作数据表
      constantObj: {
        table: ["_user"],
        dataType: [
          {"value": "onUse", "text": "使用中的数据"},
          {"value": "deleted", "text": "已删除的数据"},
        ],
      },
      serverSearchInput: {
        table: '_user',
        dataType: 'onUse'
      },
      recordHistoryActionId: null,
      currentTable: null,
  
      searchInput: null,
      isTableLoading: false,
      tableData: [],
      defaultHeaders: [
        {text: "数据ID", value: "id", width: 120},
        {text: "操作类型", value: "operation", width: 120},
        {text: "操作人", value: "operationByUser", width: 90},
        {text: "操作时间", value: "operationAt", width: 150},
      ],
      headers: [],
      // 历史数据详情相关变量
      currentRecordId: null,
      isDrawerTableLoading: true,
      isHistoryDetailDrawerShow: false,
      recordHistoryDetailListBackend: [],
      recordHistoryDetailList: [],
      restoreId: null
    },
    watch: {},
    async created() {
      this.doUiAction('getTableData')
    },
    methods: {
      async doUiAction(uiActionId, uiActionData) {
        switch (uiActionId) {
          case 'getTableData':
            await this.prepareGetTableData();
            await this.getTableData();
            await this.computeHeader();
            break;
          case 'viewRecordHistory':
            await this.prepareRecordHistoryItem(uiActionData);
            await this.openRecordHistoryDetailDrawer();
            await this.doGetRecordHistoryDetail();
            await this.decodeRecordHistoryDetail();
            break;
          case 'restoreRecordByRecordHistory':
            await this.prepareRestoreItem(uiActionData);
            await this.doRestoreRecordByRecordHistory();
            await this.doGetRecordHistoryDetail();
            await this.decodeRecordHistoryDetail();
  
            await this.prepareGetTableData();
            await this.getTableData();
            await this.computeHeader();
            break;
          default:
            console.error("[doUiAction] uiActionId not find", {uiActionId});
            break;
        }
      },
      //   --------------- 获取数据 uiAction >>>>>>>>>>  ---------------
      async openTableLoading() {
      },
      async prepareGetTableData() {
        const backendSearchData = _.pickBy(this.serverSearchInput, value => !!value && value !== '全部');
        if (backendSearchData.dataType === 'onUse') {
          this.recordHistoryActionId = 'selectOnUseItemListByTable';
        }
        if (backendSearchData.dataType === 'deleted') {
          this.recordHistoryActionId = 'selectDeletedItemListByTable';
        }
        this.currentTable = backendSearchData.table;
      },
      async getTableData() {
        this.isTableLoading = true;
        const rows = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'recordHistory',
              actionId: this.recordHistoryActionId,
              actionData: {
                table: this.currentTable
              }
            }
          }
        })).data.appData.resultData.rows;
  
        rows.forEach(row => {
          row.operationAt = window.dayjs(row.operationAt).format('YYYY-MM-DD HH:mm:ss');
        })
        this.tableData = rows;
        this.isTableLoading = false;
      },
      computeHeader() {
        if (this.tableData.length > 0) {
          const headers = this.defaultHeaders.slice();
          const recordData = this.tableData[0];
          for (const key in recordData) {
            if (['id', 'count', 'recordHistoryId', 'operation', 'operationByUserId', 'operationByUser', 'operationAt'].indexOf(key) > -1) {
              continue;
            }
            headers.push({text: key, value: key, width: 120});
          }
          headers.push({text: '操作', value: 'action', align: 'left', sortable: false, width: 150, class: 'fixed', cellClass: 'fixed'});
          this.headers = headers;
        }
      },
      //   --------------- <<<<<<<<<< 获取数据 uiAction  ---------------
      //   --------------- 查看详情 uiAction >>>>>>>>>>  ---------------
      async prepareRecordHistoryItem(funObj) {
        this.recordHistoryDetailListBackend = [];
        this.recordHistoryDetailList = [];
        this.currentRecordId = funObj.id;
      },
      async openRecordHistoryDetailDrawer() {
        this.isHistoryDetailDrawerShow = true;
      },
  
      async doGetRecordHistoryDetail() {
        this.isDrawerTableLoading = true;
        this.recordHistoryDetailListBackend = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'recordHistory',
              actionId: 'selectItemList',
              where: {
                recordId: this.currentRecordId,
                table: this.currentTable
              },
              orderBy: [{column: 'id', order: 'desc'}]
            }
          }
        })).data.appData.resultData.rows;
      },
      async decodeRecordHistoryDetail() {
        // 数据的格式转换
        const rows = this.recordHistoryDetailListBackend.map(row => {
          const {recordContent, id: recordHistoryId} = row;
          let record = {};
          try {
            record = JSON.parse(recordContent);
          } catch (err) {
            console.error('[JSON pare error]', err);
          }
          record.recordHistoryId = recordHistoryId;
          return record;
        })
        this.recordHistoryDetailList = rows;
        this.isDrawerTableLoading = false;
      },
      //   --------------- <<<<<<<<<< 查看详情 uiAction  ---------------
      //   --------------- 还原数据 uiAction >>>>>>>>>>  ---------------
      async prepareRestoreItem(funObj) {
        this.restoreId = funObj.recordHistoryId;
      },
      async doRestoreRecordByRecordHistory() {
        window.vtoast.loading(`${this.currentTable}【${this.restoreId}】数据还原`);
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'recordHistory',
              actionId: 'restoreRecordByRecordHistory',
              actionData: {
                recordHistoryId: this.restoreId
              }
            }
          }
        });
        window.vtoast.success(`${this.currentTable}【${this.restoreId}】数据还原成功`);
        this.restoreId = null;
      },
      //   --------------- <<<<<<<<<< 还原数据 uiAction  ---------------
    }
  },
}

module.exports = content;