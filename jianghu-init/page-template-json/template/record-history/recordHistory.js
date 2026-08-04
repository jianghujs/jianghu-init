/* eslint-disable */

const content = {
  version: 'v7',
  mode: 'crud',
  pageType: 'jh-page',
  page: {
    id: 'recordHistoryManagement',
    name: '数据历史',
    targets: 'pc',
  },
  platform: {
    pc: { list: 'Table' },
  },
  resourceList: [
    {
      actionId: 'selectTableList',
      resourceType: 'service',
      desc: '✅获取存在历史记录的数据表',
      resourceData: { service: 'recordHistory', serviceFunction: 'selectTableList' },
    },
    {
      actionId: 'selectOnUseItemListByTable',
      resourceType: 'service',
      desc: '✅获取指定表的使用中的数据列表',
      resourceData: { service: 'recordHistory', serviceFunction: 'selectOnUseItemListByTable' },
    },
    {
      actionId: 'selectDeletedItemListByTable',
      resourceType: 'service',
      desc: '✅获取指定表的已删除数据列表',
      resourceData: { service: 'recordHistory', serviceFunction: 'selectDeletedItemListByTable' },
    },
    {
      actionId: 'selectItemList',
      resourceType: 'service',
      desc: '✅获取指定记录的历史版本',
      resourceData: { service: 'recordHistory', serviceFunction: 'selectItemList' },
    },
    {
      actionId: 'restoreRecordByRecordHistory',
      resourceType: 'service',
      desc: '✅还原指定历史版本',
      resourceData: { service: 'recordHistory', serviceFunction: 'restoreRecordByRecordHistory' },
    },
  ],
  includeList: [
    { type: 'html', path: 'common/jianghuJs/fixedTableHeightV4.html' },
  ],
  fields: {
    id: { label: '数据ID', type: 'text', column: { width: 90 } },
    operation: { label: '操作类型', type: 'text', column: { width: 110 } },
    operationByUser: { label: '操作者', type: 'text', column: { width: 130 } },
    operationAt: { label: '操作时间', type: 'text', column: { width: 175 } },
    count: { label: '版本数', type: 'text', column: { width: 90, align: 'center' } },
  },
  views: {
    list: {
      columnList: ['id', 'operation', 'operationByUser', 'operationAt', 'count'],
      rowActionList: [
        { uiAction: 'viewRecordHistory', label: '查看版本', key: 'history' },
      ],
      serverPagination: false,
      pageSize: 20,
    },
  },
  slots: {
    list: {
      pc: {
        children: [
          /*html*/`<template v-slot:item.operation="{ item }">
            <v-chip x-small label :color="getOperationColor(item.operation)" text-color="white">
              {{ getOperationText(item.operation) }}
            </v-chip>
          </template>
          <template v-slot:item.operationAt="{ item }">
            <span class="text-no-wrap">{{ formatDateTime(item.operationAt) }}</span>
          </template>
          <template v-slot:item.count="{ item }">
            <v-chip x-small outlined color="primary">{{ Number(item.count) || 0 }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <jh-text-btn
              v-permission="'selectItemList'"
              @click="doUiAction('viewRecordHistory', item)"
              icon="history"
              color="primary"
            >
              查看版本<span v-if="Number(item.count)">（{{ Number(item.count) }}）</span>
            </jh-text-btn>
          </template>`,
        ],
      },
    },
  },
  dataSource: {
    table: '_user',
    primaryKey: 'id',
    listResource: 'selectOnUseItemListByTable',
  },
  pc: (views, blocks) => {
    const list = blocks.list ? {
      ...blocks.list,
      props: {
        ...(blocks.list.props || {}),
        headersBinding: 'headers',
        primaryKey: '_rowKey',
      },
      attrs: {
        class: 'rh-main-table w-full',
      },
    } : null;

    return {
      pageContent: {
        component: 'VStack',
        props: { gap: 0 },
        children: [
          {
            component: 'Box',
            children: [/*html*/`
              <div class="record-history-page">
                <div class="jh-page-second-bar rh-page-header">
                  <div>
                    <div class="rh-page-title">数据历史</div>
                    <div class="rh-page-subtitle">按数据表查看当前记录、已删除记录及历史版本，并可恢复指定版本。</div>
                  </div>
                </div>
                <div class="rh-page-body">
                  <div class="rh-filter-form">
                    <div class="grid grid-cols-12 gap-2 items-center">
                      <div class="col-span-12 sm:col-span-6 md:col-span-3">
                        <v-autocomplete
                          v-model="serverSearchInput.table"
                          :items="tableOptionList"
                          item-value="value"
                          item-text="text"
                          label="数据表"
                          placeholder="选择有历史记录的数据表"
                          prepend-inner-icon="mdi-table"
                          class="jh-v-input"
                          dense filled single-line clearable hide-details
                        ></v-autocomplete>
                      </div>
                      <div class="col-span-12 sm:col-span-6 md:col-span-3">
                        <v-select
                          v-model="serverSearchInput.dataType"
                          :items="constantObj.dataType"
                          item-value="value"
                          item-text="text"
                          label="数据范围"
                          prepend-inner-icon="mdi-database-search"
                          class="jh-v-input"
                          dense filled single-line hide-details
                        ></v-select>
                      </div>
                      <div class="col-span-12 sm:col-span-8 md:col-span-4">
                        <v-text-field
                          v-model="filterInput.keyword"
                          label="关键词"
                          placeholder="搜索当前结果中的任意字段"
                          prepend-inner-icon="mdi-magnify"
                          class="jh-v-input"
                          dense filled single-line clearable hide-details
                        ></v-text-field>
                      </div>
                      <div class="col-span-12 sm:col-span-4 md:col-span-2 flex items-center justify-end">
                        <v-btn color="primary" depressed small block @click="doUiAction('queryRecordList')">
                          <v-icon left size="17">mdi-magnify</v-icon>查询
                        </v-btn>
                      </div>
                    </div>
                    <div class="grid grid-cols-12 gap-2 items-center mt-1">
                      <div class="col-span-12 sm:col-span-6 md:col-span-3">
                        <v-select
                          v-model="filterInput.operation"
                          :items="constantObj.operation"
                          item-value="value"
                          item-text="text"
                          label="操作类型"
                          prepend-inner-icon="mdi-source-branch"
                          class="jh-v-input"
                          dense filled single-line clearable hide-details
                        ></v-select>
                      </div>
                      <div class="col-span-12 sm:col-span-6 md:col-span-3">
                        <v-text-field
                          v-model="filterInput.operator"
                          label="操作者"
                          placeholder="姓名或用户ID"
                          prepend-inner-icon="mdi-account-search-outline"
                          class="jh-v-input"
                          dense filled single-line clearable hide-details
                        ></v-text-field>
                      </div>
                      <div class="col-span-12 sm:col-span-6 md:col-span-2">
                        <v-text-field
                          v-model="filterInput.dateStart"
                          type="date"
                          label="开始日期"
                          class="jh-v-input"
                          dense filled single-line clearable hide-details
                        ></v-text-field>
                      </div>
                      <div class="col-span-12 sm:col-span-6 md:col-span-2">
                        <v-text-field
                          v-model="filterInput.dateEnd"
                          type="date"
                          label="结束日期"
                          class="jh-v-input"
                          dense filled single-line clearable hide-details
                        ></v-text-field>
                      </div>
                      <div class="col-span-12 md:col-span-2 flex items-center justify-end">
                        <v-btn text block color="grey darken-1" @click="doUiAction('resetClientFilters')">
                          <v-icon left size="17">mdi-filter-off-outline</v-icon>清空筛选
                        </v-btn>
                      </div>
                    </div>
                    <div v-if="availableFieldOptionList.length" class="grid grid-cols-12 gap-2 mt-1">
                      <div class="col-span-12">
                        <v-autocomplete
                          v-model="selectedFieldList"
                          :items="availableFieldOptionList"
                          item-value="value"
                          item-text="text"
                          label="显示业务字段"
                          prepend-inner-icon="mdi-table-column"
                          class="jh-v-input"
                          multiple small-chips deletable-chips
                          dense filled single-line clearable hide-details
                        ></v-autocomplete>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div class="rh-table-toolbar">
                      <div class="d-flex align-start flex-wrap gap-2">
                        <v-chip small outlined color="primary">{{ currentTable || '未选择数据表' }}</v-chip>
                        <v-chip small outlined>结果 {{ tableDataComputed.length }}</v-chip>
                        <v-chip small outlined>历史版本 {{ totalHistoryVersionCount }}</v-chip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`],
          },
          list,
        ].filter(Boolean),
      },
      actionContent: [
        {
          component: 'Drawer',
          key: 'historyDetail',
          props: {
            title: '数据历史详情',
            width: '92vw',
          },
          attrs: { class: 'rh-history-drawer' },
          children: [/*html*/`
            <div class="d-flex flex-column rh-history-drawer-body jh-drawer-body-scroll px-4">
              <div class="rh-history-summary">
                <div>
                  <div class="font-weight-medium">{{ currentTable }} / 记录 {{ currentRecordId }}</div>
                  <div class="rh-muted-text">共 {{ recordHistoryDetailList.length }} 个历史版本；点击「查看详情」或变化字段行可展开变更前后对比，恢复前请确认该版本内容。</div>
                </div>
                <v-text-field
                  v-model="historyKeyword"
                  placeholder="搜索历史版本"
                  prepend-inner-icon="mdi-magnify"
                  class="jh-v-input rh-history-search"
                  dense filled single-line clearable hide-details
                ></v-text-field>
              </div>
              <v-data-table
                fixed-header
                show-expand
                single-expand
                :expanded.sync="expandedHistoryVersion"
                :headers="historyHeaders"
                :items="filteredHistoryDetailList"
                :loading="isDrawerTableLoading"
                item-key="recordHistoryId"
                :item-class="historyRowClass"
                :footer-props="{ itemsPerPageOptions: [20, 50, -1], itemsPerPageText: '每页行数', itemsPerPageAllText: '所有' }"
                :items-per-page="20"
                mobile-breakpoint="0"
                class="elevation-0 jh-fixed-table-height zebraLine rh-history-table"
                @click:row="handleHistoryRowClick"
              >
                <template v-slot:item.operation="{ item }">
                  <v-chip x-small label :color="getOperationColor(item.operation)" text-color="white">
                    {{ getOperationText(item.operation) }}
                  </v-chip>
                </template>
                <template v-slot:item.changedFieldText="{ item }">
                  <div
                    v-if="item.changedFieldCount"
                    class="rh-change-summary rh-change-summary-clickable"
                    role="button"
                    tabindex="0"
                    :title="'点击查看 ' + item.changedFieldCount + ' 项变动详情'"
                    @click.stop="toggleHistoryVersionExpand(item)"
                    @keydown.enter.stop="toggleHistoryVersionExpand(item)"
                    @keydown.space.prevent.stop="toggleHistoryVersionExpand(item)"
                  >
                    <v-chip x-small outlined color="primary" class="mr-1 flex-shrink-0">{{ item.changedFieldCount }} 项</v-chip>
                    <div class="min-width-0">
                      <div class="rh-muted-text text-truncate" :title="item.changedFieldText">{{ item.changedFieldText }}</div>
                      <div
                        v-if="item.changedFieldDetailList && item.changedFieldDetailList[0]"
                        class="rh-change-preview text-truncate"
                        :title="formatChangePreview(item.changedFieldDetailList[0])"
                      >
                        {{ formatChangePreview(item.changedFieldDetailList[0]) }}
                      </div>
                    </div>
                  </div>
                  <span v-else class="rh-muted-text">无字段变化</span>
                </template>
                <template v-slot:item.changeDetail="{ item }">
                  <jh-text-btn
                    v-if="item.changedFieldCount"
                    @click.stop="toggleHistoryVersionExpand(item)"
                    icon="file-diff"
                    color="primary"
                    class="text-no-wrap"
                  >
                    {{ isHistoryVersionExpanded(item) ? '收起详情' : '查看详情' }}
                  </jh-text-btn>
                  <span v-else class="rh-muted-text">-</span>
                </template>
                <template v-slot:item.data-table-expand="{ item, expand, isExpanded }">
                  <v-btn
                    v-if="item.changedFieldCount"
                    icon
                    x-small
                    :title="isExpanded ? '收起变动详情' : '展开变动详情'"
                    @click.stop="expand(!isExpanded)"
                  >
                    <v-icon size="18">{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </template>
                <template v-slot:expanded-item="{ headers, item }">
                  <td :colspan="headers.length" class="rh-change-detail-cell pa-0">
                    <div class="rh-change-detail-panel">
                      <div v-if="!(item.changedFieldDetailList || []).length" class="rh-muted-text px-4 py-3">
                        暂无变动详情，请确认后端 service 已更新并重启服务。
                      </div>
                      <div v-else class="rh-change-detail-inner">
                        <table class="rh-change-detail-table">
                          <thead>
                            <tr>
                              <th class="rh-change-col-field">字段</th>
                              <th class="rh-change-col-before">变更前</th>
                              <th class="rh-change-col-after">变更后</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="change in (item.changedFieldDetailList || [])"
                              :key="item.recordHistoryId + '-' + change.field"
                            >
                              <td class="rh-change-field-cell">{{ change.field }}</td>
                              <td class="rh-change-value-cell rh-change-before">
                                <pre class="rh-change-value-text">{{ formatChangeValue(change.before, true) }}</pre>
                              </td>
                              <td class="rh-change-value-cell rh-change-after">
                                <pre class="rh-change-value-text">{{ formatChangeValue(change.after, true) }}</pre>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </template>
                <template v-slot:item.operationAt="{ item }">
                  <span class="text-no-wrap">{{ formatDateTime(item.operationAt) }}</span>
                </template>
                <template v-slot:item.action="{ item }">
                  <jh-text-btn
                    v-permission="'restoreRecordByRecordHistory'"
                    @click="doUiAction('restoreRecordByRecordHistory', item)"
                    class="text-no-wrap font-weight-medium"
                    color="warning"
                    icon="restore"
                  >
                    恢复此版本
                  </jh-text-btn>
                </template>
                <template v-slot:loading><div class="jh-no-data">历史版本加载中</div></template>
                <template v-slot:no-data><div class="jh-no-data">暂无历史版本</div></template>
                <template v-slot:no-results><div class="jh-no-data">没有匹配的历史版本</div></template>
              </v-data-table>
            </div>`],
        },
      ],
    };
  },
  common: {
    data: {
      isDrawerTableLoading: false,
      serverSearchInput: {
        table: '',
        dataType: 'onUse',
      },
      filterInput: {
        keyword: '',
        operation: '',
        operator: '',
        dateStart: '',
        dateEnd: '',
      },
      constantObj: {
        dataType: [
          { value: 'onUse', text: '使用中的数据' },
          { value: 'deleted', text: '已删除的数据' },
        ],
        operation: [
          { value: 'jhInsert', text: '新增' },
          { value: 'jhUpdate', text: '修改' },
          { value: 'jhDelete', text: '删除' },
          { value: 'jhRestore', text: '恢复' },
          { value: 'insert', text: '新增（原生）' },
          { value: 'update', text: '修改（原生）' },
          { value: 'delete', text: '删除（原生）' },
        ],
      },
      tableOptionList: [],
      recordHistoryDetailList: [],
      availableFieldOptionList: [],
      selectedFieldList: [],
      currentTable: '',
      currentRecordId: null,
      restoreRecordHistoryId: null,
      historyKeyword: '',
      expandedHistoryVersion: [],
    },
    computed: {
      tableDataComputed() {
        return this.filterRecordList(this.tableData, this.filterInput);
      },
      filteredHistoryDetailList() {
        const keyword = String(this.historyKeyword || '').trim().toLowerCase();
        if (!keyword) return this.recordHistoryDetailList;
        return this.recordHistoryDetailList.filter(item => this.isRowMatchedKeyword(item, keyword));
      },
      totalHistoryVersionCount() {
        return (this.tableData || []).reduce((total, item) => total + (Number(item.count) || 0), 0);
      },
      headers() {
        const fixedValueSet = new Set(['id', 'operation', 'operationByUser', 'operationAt', 'count', 'action']);
        const businessHeaders = this.normalizeSelectedFieldList(this.selectedFieldList)
          .filter(field => !fixedValueSet.has(field))
          .map(field => ({ text: field, value: field, width: 150 }));
        return [
          { text: '数据ID', value: 'id', width: 90 },
          ...businessHeaders,
          { text: '操作类型', value: 'operation', width: 110 },
          { text: '操作者', value: 'operationByUser', width: 130 },
          { text: '操作时间', value: 'operationAt', width: 175 },
          { text: '版本数', value: 'count', width: 90, align: 'center' },
          { text: '操作', value: 'action', width: 130, sortable: false, class: 'fixed', cellClass: 'fixed' },
        ];
      },
      historyHeaders() {
        const fixedValueSet = new Set(['id', 'operation', 'operationByUser', 'operationAt', 'count', 'action', 'changeDetail']);
        const businessHeaders = this.normalizeSelectedFieldList(this.selectedFieldList)
          .filter(field => !fixedValueSet.has(field))
          .map(field => ({ text: field, value: field, width: 150 }));
        return [
          { text: '版本ID', value: 'recordHistoryId', width: 90 },
          { text: '操作类型', value: 'operation', width: 110 },
          { text: '变化字段', value: 'changedFieldText', width: 260 },
          { text: '变动详情', value: 'changeDetail', width: 110, sortable: false },
          ...businessHeaders,
          { text: '操作者', value: 'operationByUser', width: 130 },
          { text: '操作时间', value: 'operationAt', width: 175 },
          { text: '操作', value: 'action', width: 130, sortable: false, class: 'fixed', cellClass: 'fixed' },
        ];
      },
    },
    async created() {
      await this.doUiAction('initRecordHistoryPage');
    },
    doUiAction: {
      initRecordHistoryPage: ['getTableList', 'prepareTableParams', 'getTableData'],
      queryRecordList: ['prepareTableParams', 'getTableData'],
      resetClientFilters: ['resetClientFilters'],
      viewRecordHistory: ['prepareRecordHistoryItem', 'openHistoryDetailDrawer', 'getRecordHistoryDetail'],
      restoreRecordByRecordHistory: [
        'prepareRestoreItem',
        'confirmRestoreRecord',
        'doRestoreRecordByRecordHistory',
        'getRecordHistoryDetail',
        'getTableData',
      ],
    },
    methods: {
      normalizeSelectedFieldList(fieldList) {
        return Array.from(new Set((fieldList || []).map(field => {
          if (field == null) return '';
          if (typeof field === 'object') return String(field.value || field.text || '').trim();
          return String(field).trim();
        }).filter(Boolean)));
      },
      normalizeSearchValue(value) {
        if (value == null) return '';
        if (typeof value === 'object') return String(value.value || value.text || '').trim();
        return String(value).trim();
      },
      async getTableList() {
        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: this.pageId,
              actionId: 'selectTableList',
            },
          },
        });
        const rows = result.data.appData.resultData.rows || [];
        this.tableOptionList = rows.map(item => ({
          value: item.table,
          text: `${item.table}（${Number(item.historyCount) || 0}）`,
        }));
        if (!this.serverSearchInput.table && this.tableOptionList.length) {
          const defaultOption = this.tableOptionList.find(item => item.value === '_user') || this.tableOptionList[0];
          this.serverSearchInput.table = defaultOption.value;
        }
      },
      prepareTableParams() {
        const table = this.normalizeSearchValue(this.serverSearchInput.table);
        if (!table) {
          window.vtoast && window.vtoast.fail('请先选择数据表');
          throw new Error('[prepareTableParams] table required');
        }
        this.currentTable = table;
        this.serverSearchInput.dataType = this.normalizeSearchValue(this.serverSearchInput.dataType) || 'onUse';
      },
      async getTableData() {
        this.isTableLoading = true;
        try {
          const dataType = this.normalizeSearchValue(this.serverSearchInput.dataType) || 'onUse';
          const actionId = dataType === 'deleted'
            ? 'selectDeletedItemListByTable'
            : 'selectOnUseItemListByTable';
          const result = await window.jianghuAxios({
            data: {
              appData: {
                pageId: this.pageId,
                actionId,
                actionData: { table: this.currentTable },
              },
            },
          });
          const rows = result.data.appData.resultData.rows || [];
          this.tableDataFromBackend = rows;
          this.tableData = rows.map((item, index) => {
            const recordId = item.id ?? item.recordId ?? index;
            return {
              ...item,
              id: recordId,
              _rowKey: `${this.currentTable}-${recordId}`,
            };
          });
          this.buildAvailableFieldList(this.tableData);
        } finally {
          this.isTableLoading = false;
        }
      },
      buildAvailableFieldList(rows) {
        const hiddenFieldSet = new Set([
          '_rowKey', 'id', 'recordId', 'recordHistoryId', 'count', 'operation',
          'operationByUserId', 'operationByUser', 'operationAt',
          'changedFieldList', 'changedFieldCount', 'changedFieldText',
        ]);
        const fieldList = Array.from(new Set((rows || []).flatMap(item => Object.keys(item || {}))))
          .filter(field => !hiddenFieldSet.has(field));
        this.availableFieldOptionList = fieldList.map(field => ({ value: field, text: field }));
        const selectedFieldSet = new Set(this.normalizeSelectedFieldList(this.selectedFieldList));
        const retainedFieldList = fieldList.filter(field => selectedFieldSet.has(field));
        this.selectedFieldList = retainedFieldList.length ? retainedFieldList : fieldList.slice(0, 8);
      },
      filterRecordList(rows, filterInput) {
        const keyword = String(filterInput.keyword || '').trim().toLowerCase();
        const operator = String(filterInput.operator || '').trim().toLowerCase();
        const operationFilter = this.normalizeSearchValue(filterInput.operation);
        return (rows || []).filter(item => {
          if (keyword && !this.isRowMatchedKeyword(item, keyword)) return false;
          if (
            operationFilter
            && !String(item.operation || '').startsWith(operationFilter)
          ) return false;
          if (operator) {
            const operatorText = `${item.operationByUser || ''} ${item.operationByUserId || ''}`.toLowerCase();
            if (!operatorText.includes(operator)) return false;
          }
          const operationDate = String(item.operationAt || '').slice(0, 10);
          if (filterInput.dateStart && (!operationDate || operationDate < filterInput.dateStart)) return false;
          if (filterInput.dateEnd && (!operationDate || operationDate > filterInput.dateEnd)) return false;
          return true;
        });
      },
      isRowMatchedKeyword(item, keyword) {
        return Object.entries(item || {}).some(([key, value]) => {
          if (key === '_rowKey' || value == null) return false;
          const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
          return text.toLowerCase().includes(keyword);
        });
      },
      resetClientFilters() {
        this.filterInput = {
          keyword: '',
          operation: '',
          operator: '',
          dateStart: '',
          dateEnd: '',
        };
      },
      async prepareRecordHistoryItem(item) {
        this.currentRecordId = item.id ?? item.recordId;
        this.historyKeyword = '';
        this.recordHistoryDetailList = [];
        this.expandedHistoryVersion = [];
      },
      async openHistoryDetailDrawer() {
        this.isHistoryDetailDrawerShown = true;
        this.$nextTick(() => {
          resetTableMaxHeight()
        });
      },
      async getRecordHistoryDetail() {
        this.isDrawerTableLoading = true;
        try {
          const result = await window.jianghuAxios({
            data: {
              appData: {
                pageId: this.pageId,
                actionId: 'selectItemList',
                actionData: {
                  table: this.currentTable,
                  recordId: this.currentRecordId,
                },
              },
            },
          });
          const rows = result.data.appData.resultData.rows || [];
          const baseRows = rows.map(row => this.parseRecordHistoryBaseRow(row));
          this.recordHistoryDetailList = baseRows.map((row, index) => {
            if (Array.isArray(row.changedFieldDetailList) && row.changedFieldDetailList.length) {
              return row;
            }
            return this.attachHistoryChangeDetail(row, baseRows[index + 1] || null);
          });
          this.expandedHistoryVersion = [];
        } finally {
          this.isDrawerTableLoading = false;
        }
      },
      parseRecordHistoryBaseRow(row) {
        if (!row || typeof row !== 'object') return row;
        if (!row.recordContent) return { ...row };
        let record = {};
        try {
          record = JSON.parse(row.recordContent);
        } catch (err) {
          console.error('[parseRecordHistoryBaseRow] JSON.parse error', err);
        }
        return {
          ...record,
          recordHistoryId: row.recordHistoryId ?? row.id ?? null,
          operation: row.operation ?? record.operation,
          operationByUserId: row.operationByUserId ?? record.operationByUserId,
          operationByUser: row.operationByUser ?? record.operationByUser,
          operationAt: row.operationAt ?? record.operationAt,
        };
      },
      isHistoryFieldValueEqual(left, right) {
        if (typeof _ !== 'undefined' && typeof _.isEqual === 'function') {
          return _.isEqual(left, right);
        }
        try {
          return JSON.stringify(left) === JSON.stringify(right);
        } catch (err) {
          return left === right;
        }
      },
      isHistoryVersionExpanded(item) {
        const expandedItem = (this.expandedHistoryVersion || [])[0];
        return !!(expandedItem && expandedItem.recordHistoryId === item.recordHistoryId);
      },
      toggleHistoryVersionExpand(item) {
        if (!item || !item.changedFieldCount) return;
        if (this.isHistoryVersionExpanded(item)) {
          this.expandedHistoryVersion = [];
          return;
        }
        this.expandedHistoryVersion = [item];
      },
      handleHistoryRowClick(item, slot) {
        if (!item || !item.changedFieldCount) return;
        if (slot && typeof slot.expand === 'function') {
          slot.expand(!slot.isExpanded);
          return;
        }
        this.toggleHistoryVersionExpand(item);
      },
      historyRowClass(item) {
        return item && item.changedFieldCount ? 'rh-history-row-expandable' : '';
      },
      formatChangePreview(change) {
        if (!change) return '';
        return `${change.field}: ${this.formatChangeValue(change.before)} → ${this.formatChangeValue(change.after)}`;
      },
      attachHistoryChangeDetail(record, previousRecord) {
        const ignoredFieldSet = new Set([
          'operation', 'operationByUserId', 'operationByUser', 'operationAt',
          'recordHistoryId', 'changedFieldList', 'changedFieldCount', 'changedFieldText',
          'changedFieldDetailList', 'changedFieldDetailText', 'recordContent',
        ]);
        const previous = previousRecord || {};
        const changedFieldList = Array.from(new Set([
          ...Object.keys(record || {}),
          ...Object.keys(previous),
        ])).filter(field => (
          !ignoredFieldSet.has(field)
          && !this.isHistoryFieldValueEqual(record[field], previous[field])
        ));
        const changedFieldDetailList = changedFieldList.map(field => ({
          field,
          before: previous[field],
          after: record[field],
        }));
        return {
          ...record,
          changedFieldList,
          changedFieldCount: changedFieldList.length,
          changedFieldText: changedFieldList.join(', '),
          changedFieldDetailList,
          changedFieldDetailText: changedFieldDetailList
            .map(item => `${item.field}:${this.formatChangeValue(item.before)}->${this.formatChangeValue(item.after)}`)
            .join(' | '),
        };
      },
      async prepareRestoreItem(item) {
        this.restoreRecordHistoryId = item.recordHistoryId;
      },
      async confirmRestoreRecord() {
        const confirmed = await window.confirmDialog({
          title: '确认恢复该历史版本？',
          content: `数据表 ${this.currentTable} 的记录 ${this.currentRecordId} 将恢复到版本 ${this.restoreRecordHistoryId}。`,
        });
        if (confirmed === false) {
          throw new Error('[confirmRestoreRecord] cancelled');
        }
      },
      async doRestoreRecordByRecordHistory() {
        window.vtoast.loading(`正在恢复版本 ${this.restoreRecordHistoryId}`);
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: this.pageId,
              actionId: 'restoreRecordByRecordHistory',
              actionData: { recordHistoryId: this.restoreRecordHistoryId },
            },
          },
        });
        window.vtoast.success('数据恢复成功');
      },
      getOperationText(operation) {
        const normalizedOperation = String(operation || '').split(':')[0];
        const item = this.constantObj.operation.find(option => option.value === normalizedOperation);
        return item ? item.text : (operation || '未知');
      },
      getOperationColor(operation) {
        const colorMap = {
          insert: 'success',
          jhInsert: 'success',
          update: 'primary',
          jhUpdate: 'primary',
          delete: 'error',
          jhDelete: 'error',
          jhRestore: 'warning',
        };
        const normalizedOperation = String(operation || '').split(':')[0];
        return colorMap[normalizedOperation] || 'grey';
      },
      formatChangeValue(value, multiline) {
        if (value == null || value === '') return '（空）';
        let text = value;
        if (typeof value === 'object') {
          try {
            text = JSON.stringify(value, null, multiline ? 2 : 0);
          } catch (err) {
            text = String(value);
          }
        } else {
          text = String(value);
        }
        if (!multiline && text.length > 160) {
          return `${text.slice(0, 160)}…`;
        }
        return text;
      },
      formatDateTime(value) {
        const dayjsFn = window.dayjs || dayjs;
        return value && dayjsFn(value).isValid() ? dayjsFn(value).format('YYYY-MM-DD HH:mm:ss') : (value || '-');
      },
    },
  },
  style: /*css*/`
    .record-history-page {
      min-width: 0;
    }
    .rh-main-table {
      width: 100%;
    }
    .rh-main-table.jh-table-v6-root {
      min-width: 0;
    }
    .rh-page-header {
      padding: 16px 0;
    }
    .rh-page-title {
      font-size: 18px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
    }
    .rh-page-subtitle,
    .rh-muted-text {
      margin-top: 3px;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
    }
    .rh-page-body {
      padding: 0;
    }
    .rh-filter-card,
    .rh-table-card {
      border: 1px solid #edf0f3;
      background: #fff;
    }
    .rh-filter-card {
      padding: 0;
    }
    .rh-table-toolbar,
    .rh-history-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 0;
    }
    .rh-data-table,
    .rh-history-table {
      border-top: 1px solid #f0f2f5;
    }
    .rh-history-drawer-body {
      height: calc(100vh - 52px);
      min-height: 0;
    }
    .rh-history-search {
      flex: 0 1 320px;
      max-width: 320px;
    }
    .rh-history-table {
      flex: 1;
      min-height: 0;
    }
    .rh-change-summary {
      display: flex;
      align-items: flex-start;
      min-width: 0;
    }
    .rh-change-summary-clickable {
      cursor: pointer;
      border-radius: 6px;
      padding: 2px 4px;
      margin: -2px -4px;
    }
    .rh-change-summary-clickable:hover {
      background: rgba(25, 118, 210, 0.06);
    }
    .rh-change-preview {
      margin-top: 2px;
      font-size: 11px;
      line-height: 1.4;
      color: rgba(0, 0, 0, 0.55);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .rh-history-row-expandable {
      cursor: pointer;
    }
    .rh-change-detail-cell {
      background: #fafbfc;
      border-top: 1px solid #edf0f3;
    }
    .rh-change-detail-panel {
      padding: 12px 16px;
    }
    .rh-change-detail-inner {
      width: min(760px, calc(100vw - 64px));
      max-width: 760px;
      position: sticky;
      left: 16px;
      z-index: 1;
    }
    .rh-change-detail-table {
      width: 100%;
      table-layout: fixed;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #e6eaf0;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
    }
    .rh-change-detail-table thead th {
      padding: 8px 10px;
      font-size: 12px;
      font-weight: 600;
      text-align: left;
      color: rgba(0, 0, 0, 0.62);
      background: #f3f5f8;
      border-bottom: 1px solid #e6eaf0;
    }
    .rh-change-detail-table tbody td {
      vertical-align: top;
      border-bottom: 1px solid #edf0f3;
    }
    .rh-change-detail-table tbody tr:last-child td {
      border-bottom: none;
    }
    .rh-change-col-field {
      width: 120px;
    }
    .rh-change-col-before,
    .rh-change-col-after {
      width: calc((100% - 120px) / 2);
    }
    .rh-change-field-cell {
      padding: 10px;
      font-size: 12px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.78);
      word-break: break-word;
      background: #fafbfc;
    }
    .rh-change-value-cell {
      padding: 0;
    }
    .rh-change-value-cell.rh-change-before {
      background: #fff8f8;
      border-left: 3px solid #ffcdd2;
    }
    .rh-change-value-cell.rh-change-after {
      background: #f7fff8;
      border-left: 3px solid #c8e6c9;
    }
    .rh-change-value-text {
      margin: 0;
      padding: 10px;
      max-height: 220px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 12px;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.82);
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    @media (max-width: 600px) {
      .rh-page-header,
      .rh-page-body {
        padding-left: 12px;
        padding-right: 12px;
      }
      .rh-history-summary {
        align-items: stretch;
        flex-direction: column;
      }
      .rh-history-search {
        max-width: none;
      }
    }
  `,
};

module.exports = content;
