const content = {
  pageType: "jh-component", pageId: "studentListSinglePage", table: "class", pageName: "学生列表", template: "jhTemplateV4", version: 'v2', componentPath: 'classList',
  resourceList: [
    {
      actionId: "classList-selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "view01_student_class", operation: "select" }
    },
    {
      actionId: "classList-selectAllotList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "class", operation: "select" }
    },
    {
      actionId: "classList-insertItem",
      resourceType: "sql",
      // resourceHook: { before: [{service:"common",serviceFunction:"generateBizIdOfBeforeHook"}] },
      desc: "✅添加",
      resourceData: { table: "student_class", operation: "jhInsert" }
    },
    {
      actionId: "classList-deleteItem",
      resourceType: "sql",
      desc: "✅删除",
      resourceData: { table: "student_class", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0 pt-4' },
      headActionList: [
        { tag: 'v-btn', value: '分配班级管理', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("viewAllot")' }, quickAttrs: ['small'] },
        { tag: 'v-spacer' },
        /*html*/`
        <v-col cols="12" sm="6" md="3" xs="8" class="pa-0">
          <v-text-field prefix="筛选" v-model="searchInput" class="jh-v-input" dense filled single-line></v-text-field>
        </v-col>
        `
      ],
      headers: [
        { text: "班级ID", value: "classId", width: 80, sortable: true },
        { text: "班级名称", value: "className", width: 80, sortable: true },
        { text: "班级状态", value: "classStatus", width: 80, sortable: true },
        { text: "备注", value: "remark", width: 80, sortable: true },
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 120', align: "center", class: "fixed", cellClass: "fixed" },
      ],
      value: [],
      rowActionList: [
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
      ],
    }
  ],
  actionContent: [
    {
      tag: 'jh-drawer',
      key: "allot",
      attrs: {},
      title: '分配班级管理',
      contentList: [
        {
          tag: 'div',
          value: /*html*/`
            <v-row class="ma-0 pa-4">
              <!-- 新增按钮 -->
              <v-btn class="success elevation-0 mr-2" small :disabled="allotTableSelected.length === 0" @click="doUiAction('allotItem')">批量新增</v-btn>
              <v-spacer></v-spacer>
              <!-- 搜索过滤 -->
              <v-col cols="12" xs="8" sm="4" md="3" xl="2" class="pa-0">
                <v-text-field color="success" v-model="searchInputDrawer" prefix="搜索：" class="jh-v-input" dense
                    filled single-line></v-text-field>
              </v-col>
            </v-row>
    
            <!-- 表格 -->
            <v-data-table :headers="headers" :items="tableDataAllot" :search="searchInputDrawer"
              fixed-header :loading="isAllotTableLoading" mobile-breakpoint="0"
              :items-per-page="-1" :footer-props="{ itemsPerPageOptions: [20, 50, -1], itemsPerPageText: '每页行数', itemsPerPageAllText: '所有'}"
              class="jh-fixed-table-height elevation-0 mt-0 mb-xs-4 zebraLine px-4"
              checkbox-color="success" show-select item-key="studentId" v-model="allotTableSelected" @item-selected="tableItemSelected" @toggle-select-all="tableToggleSelectAll">
              <template v-slot:item.action="{ item }">
                <!-- <span role="button" class="success--text font-weight-medium font-size-2"
                  @click="doUiAction('buildRelation', item)">
                  <v-icon size="16" class="success--text">mdi-plus-box-outline</v-icon>新增
                </span> -->
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
                <span>{{pagination.pageStart}}-{{pagination.pageStop}}</span>
                <span class="ml-1">共{{pagination.itemsLength}}条</span>
              </template>
            </v-data-table>
          `,
        },
        
      ]
    }
  ],
  includeList: [
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    props: { studentId: { type: String, required: true } },
    data: {
      constantObj: {
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件

      // 分配抽屉变量
      allotTableData: [], // 分配表格数据
      isAllotTableLoading: false,
      allotTableSelected: [], // 分配表格选中项
      searchInputDrawer: '', // 搜索关键字

      keyword: '', // 搜索关键字
      keywordFieldList: [], // 搜索关键字对应字段
      
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    computed: {
      tableDataComputed() {
        let data = this.tableData.filter(e => e.studentId === this.studentId);
        if(this.filterMap) {
          return data.filter(row => {
            for (const key in this.filterMap) {
              if (this.filterMap[key] && row[key] !== this.filterMap[key]) {
                return false;
              }
            }
            return true;
          });
        } else {
          return data;
        }
      },
      tableDataAllot() {
        return this.allotTableData.filter(e => !this.tableData.some(a => a.classId == e.classId));
      },
    },
    async created() {
      await this.doUiAction('getTableData');
    },
    doUiAction: {
      /**
       * 
            await this.prepareAllotData(uiActionData);
            await this.openAllotDrawer(uiActionData);
       */
      viewAllot: ['prepareAllotData', 'openAllotDrawer', 'getAllotTableData'],
      allotItem: ['confirmAllotItemDialog', 'doAllotItem', 'clearAllotItemData', 'closeAllotDrawer', 'doUiAction.getTableData'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      // 获取表格数据
      async getAllotTableData() {
        this.isAllotTableLoading = true;

        const result = await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'studentListSinglePage',
              actionId: "classList-selectAllotList",
              actionData: {},
            }
          }
        });
        const { rows, count } = result.data.appData.resultData;
        
        this.allotTableData = rows;
        this.isAllotTableLoading = false;
      },
      
      async prepareCreateFormData() {
        this.createItem = {
          studentId: this.studentId,
        };
        this.createItemOrigin = _.cloneDeep(this.createItem);
      },
      async confirmAllotItemDialog() {
        if (await window.confirmDialog({ title: "确定将班级分配给此班级管理吗", content: "确定分配吗？" }) === false) {
          throw new Error("[confirmAllotItemDialog] 否");
        }
      },
      async prepareDoBuildRelation(funObj) {
        this.allotItemId = funObj.classId;
      },
      async doAllotItem() {
        await window.jhMask.show();
        for (let i = 0; i < this.allotTableSelected.length; i++) {
          window.vtoast.loading(`正在新增 第${i + 1}个`);
          await this.prepareDoBuildRelation(this.allotTableSelected[i]);
          await this.buildRelationImpl();
        }
        await window.jhMask.hide();
        await window.vtoast.success("批量新增成功");
      },
      async doBuildRelation() {
        await window.jhMask.show();
        await window.vtoast.loading("正在新增");
        await this.buildRelationImpl();
        await window.jhMask.hide();
        await window.vtoast.success("新增成功");
      },
      async buildRelationImpl() {
        await window.jianghuAxios({
          data: {
            appData: {
              pageId: 'studentListSinglePage',
              actionId: 'classList-insertItem',
              actionData: { studentId: this.studentId, classId: this.allotItemId },
            }
          }
        });
      },
      async clearAllotItemData() {
        this.allotTableSelected = [];
        this.allotItemId = null;
      },
      tableItemSelected({ item, value }) {
        if (value) {
          this.allotTableSelected.push(item);
        } else {
          this.allotTableSelected = _.reject(this.allotTableSelected, ['studentId', item.studentId]);
        }
      },
      tableToggleSelectAll({ items, value }) {
        if (value) {
          this.allotTableSelected = items;
        } else {
          this.allotTableSelected = [];
        }
      },
    }
  },
  
};

module.exports = content;