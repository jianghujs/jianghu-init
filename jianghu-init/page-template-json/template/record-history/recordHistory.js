/* eslint-disable */
const content = {
  pageType: "jh-page", pageId: "recordHistoryManagement", table: '_user', pageName: "数据历史", version: 'v3',
  resourceList: [
    {
      actionId: "selectOnUseItemListByTable",
      resourceType: "service",
      desc: "✅获取指定表的使用中的数据列表",
      resourceData: {service: "recordHistory", serviceFunction: "selectOnUseItemListByTable"}
    },
    {
      actionId: "selectDeletedItemListByTable",
      resourceType: "service",
      desc: "✅获取指定表的已删除的数据列表",
      resourceData: {service: "recordHistory", serviceFunction: "selectDeletedItemListByTable"}
    },
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅获取数据历史表",
      resourceData: {table: "_record_history", operation: "select"}
    },
    {
      actionId: "restoreRecordByRecordHistory",
      resourceType: "service",
      desc: "✅还原数据",
      resourceData: {service: "recordHistory", serviceFunction: "restoreRecordByRecordHistory"}
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "数据历史", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    {
      tag: 'jh-search',
      value: [
        /**
         * <v-col cols="12" xs="12" sm="6" md="4" xl="3" class="pa-0 pr-0 pr-sm-2">
              <v-select v-model="serverSearchInput.table" color="success" prefix="数据表：" class="jh-v-input bg-white" :items="constantObj.table" dense filled single-line hide-details></v-select>
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="4" xl="3" class="pa-0 pr-0 pr-md-2 pt-2 pt-sm-0">
              <v-select v-model="serverSearchInput.dataType" color="success" prefix="数据类型：" class="jh-v-input bg-white" :items="constantObj.dataType" dense filled single-line hide-details></v-select>
            </v-col>
            <div class="jh-backend-search-btn">
              <v-btn class="elevation-0 float-right mt-2 mt-md-0" color="success" small @click="doUiAction('getTableData')">
                查询
              </v-btn>
            </div>
         */
        { tag: 'v-select', model: 'serverSearchInput.table', attrs: { prefix: '数据表：', class: 'jh-v-input bg-white', ':items': 'constantObj.table' } },
        { tag: 'v-select', model: 'serverSearchInput.dataType', attrs: { prefix: '数据类型：', class: 'jh-v-input bg-white', ':items': 'constantObj.dataType' } },
      ],
      searchBtn: true,
      data: {
        serverSearchInput: {
          table: '_user',
          dataType: 'onUse'
        },
      }
    }
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-spacer' },
        // 默认筛选
        {
          tag: 'v-col',
          attrs: { cols: '12', sm: '6', md: '3', xs: 8, class: 'pa-0' },
          value: [
            { tag: 'v-text-field', attrs: {prefix: '筛选', 'v-model': 'searchInput', class: 'jh-v-input', ':dense': true, ':filled': true, ':single-line': true} },
          ],
        }
      ],
      headers: [
      ],
      value: [
        // vuetify table custom slot
      ],
      rowActionList: [
        { text: '查看数据版本<span v-if="item.count > 0" class="success--text">({{item.count}})</span>', icon: 'mdi-eye-outline', color: 'success', click: 'doUiAction("viewRecordHistory", item)' },
      ],
    }
  ],
  actionContent: [
    {
      tag: 'jh-drawer',
      key: 'historyDetail',
      title: '数据历史详情',
      contentList: [
        {
          tag: 'div',
          attrs: { class: 'pa-4' },
          value: `
          <v-data-table
            :search="searchInputDrawer"
            fixed-header
            checkbox-color="success"
            :headers="headers"
            :loading="isDrawerTableLoading"
            :items="recordHistoryDetailList"
            item-key="classId"
            :footer-props="{ itemsPerPageOptions: [20, 50, -1], itemsPerPageText: '每页行数', itemsPerPageAllText: '所有'}"
            :items-per-page="20"
            :data-bottom="-100"
            mobile-breakpoint="0"
            class="jh-fixed-table-height elevation-0 mt-0 mb-xs-4 zebraLine"
          >
            <!-- 表格操作按钮 -->
            <template v-slot:item.action="{ item }">
              <span role="button" class="success--text font-weight-medium font-size-2 text-no-wrap" @click="doUiAction('restoreRecordByRecordHistory', item)">
                <v-icon size="16" class="success--text">mdi-history</v-icon>还原数据
              </span>
            </template>
            <!-- 操作时间 -->
            <template v-slot:item.operationAt="{ item }">
              {{ item.operationAt && dayjs(item.operationAt).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <!--没有数据-->
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
        }
      ]
    }
  ],
  includeList: [], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件

      // 可操作数据表
      constantObj: {
        table: ["_user"],
        dataType: [
          {"value": "onUse", "text": "使用中的数据"},
          {"value": "deleted", "text": "已删除的数据"},
        ],
      },
      recordHistoryActionId: null,
      currentTable: null,

      defaultHeaders: [
        {text: "数据ID", value: "id", width: 80},
        {text: "操作类型", value: "operation", width: 120},
        {text: "操作人", value: "operationByUser", width: 120},
        {text: "操作时间", value: "operationAt", width: 180},
      ],
      headers: [],
      // 历史数据详情相关变量
      currentRecordId: null,
      isDrawerTableLoading: true,
      isHistoryDetailDrawerShow: false,
      recordHistoryDetailListBackend: [],
      recordHistoryDetailList: [],
      restoreId: null,
      searchInputDrawer: null
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    watch: {},
    computed: {
      tableDataComputed() {
        if(this.filterMap) {
          return this.tableData.filter(row => {
            for (const key in this.filterMap) {
              if (this.filterMap[key] && row[key] !== this.filterMap[key]) {
                return false;
              }
            }
            return true;
          });
        } else {
          return this.tableData;
        }
      },
    },
    async created() {
      this.doUiAction('initTableData');
    },
    doUiAction: {
      initTableData: ['doUiAction.getTableData', 'setSearchSummary', 'computeHeader'],
      viewRecordHistory: ['prepareRecordHistoryItem', 'doUiAction.viewHistoryDetail', 'doGetRecordHistoryDetail', 'decodeRecordHistoryDetail'],
      restoreRecordByRecordHistory: ['prepareRestoreItem', 'doRestoreRecordByRecordHistory', 'doGetRecordHistoryDetail', 'decodeRecordHistoryDetail', 'prepareGetTableData', 'doUiAction.initTableData', 'computeHeader'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      //   --------------- 获取数据 uiAction >>>>>>>>>>  ---------------
      prepareTableParams() {
        // TODO 增加自定义复杂判断条件
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
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'recordHistoryManagement',
              actionId: this.recordHistoryActionId,
              actionData: {
                table: this.currentTable
              }
            }
          }
        });
        this.tableDataFromBackend = result.data.appData.resultData.rows;
        this.isTableLoading = false;
      },
      setSearchSummary(){
        const conditions = [];
        if (this.serverSearchInput.table) {
          conditions.push(`数据表为【${getDisplayText({displayObj: this.constantObj.table, displayValue: this.serverSearchInput.table})}】`);
        }
        if (this.serverSearchInput.dataType) {
          conditions.push(`数据类型为【${getDisplayText({displayObj: this.constantObj.dataType, displayValue: this.serverSearchInput.dataType})}】`);
        }
        this.searchSummary = conditions.length > 0  ? `${conditions.join('，')}，共${this.tableData.length}条记录` : `共${this.tableData.length}条记录`;
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
          headers.push({text: '操作', value: 'action', align: 'left', sortable: false, width: 140, class: 'fixed', cellClass: 'fixed'});
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

      async doGetRecordHistoryDetail() {
        this.isDrawerTableLoading = true;
        this.recordHistoryDetailListBackend = (await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'recordHistoryManagement',
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
              pageId: 'recordHistoryManagement',
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
    }
  },
  
};

module.exports = content;