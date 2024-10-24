const content = {
  pageType: "jh-page", pageId: "studentListOfOneClass", table: "student", pageName: "班级的学生列表", template: "jhTemplateV4", version: 'v2', 
  resourceList: [

    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅班级的学生列表-查询当前班级下的学生列表",
      resourceData: { table: "student", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      desc: "✅班级的学生列表-建立关系",
      resourceData: { table: "student", operation: "jhInsert" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅班级的学生列表-删除信息",
      resourceData: { table: "student", operation: "jhDelete" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅班级的学生列表-更新信息",
      resourceData: { table: "student", operation: "jhUpdate" }
    },
    {
      actionId: "selectAllList",
      resourceType: "sql",
      desc: "✅班级的学生列表-查询所有学生",
      resourceData: { table: "student", operation: "select" }
    },

  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "班级的学生列表", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [], backBtn: {
      '@click': 'doUiAction("redirect")'
    } },

    { tag: 'v-spacer'},
    { 
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      value: [
        // { tag: "v-text-field", model: "keyword", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '标题', ':disabled': 'keywordFieldList.length == 0', ':placeholder': "!keywordFieldList.length ? '未设置搜索字段' : ''"} },
        // { tag: "v-text-field", model: "serverSearchWhereLike.className", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '前缀'} },
      ], 
      // searchBtn: true
      
    },
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")' }, quickAttrs: ['small'] },
        { tag: 'v-btn', value: '分配学生', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("viewAllot")' }, quickAttrs: ['small'] },
        { tag: 'v-spacer' },
        /*html*/`
        <v-col cols="12" sm="6" md="3" xs="8" class="pa-0">
          <v-text-field prefix="筛选" v-model="searchInput" class="jh-v-input" dense filled single-line></v-text-field>
        </v-col>
        `
      ],
      headers: [
        { text: "学生ID", value: "studentId", width: 80, sortable: true },
        { text: "学生名字", value: "name", width: 80, sortable: true },
        { text: "性别", value: "gender", width: 80, sortable: true },
        { text: "出生日期", value: "dateOfBirth", width: 80, sortable: true },
        { text: "班级ID", value: "classId", width: 80, sortable: true },
        { text: "年级", value: "level", width: 80, sortable: true },
        { text: "身高", value: "bodyHeight", width: 80, sortable: true },
        { text: "学生状态", value: "studentStatus", width: 80, sortable: true },
        { text: "备注", value: "remark", width: 80, sortable: true },
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 120', align: "center", class: "fixed", cellClass: "fixed" },
      ],
      value: [],
      rowActionList: [
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
      ],
    }
  ],
  actionContent: [
    {
      tag: 'jh-create-drawer',
      key: "create",
      attrs: {},
      title: '新增',
      headSlot: [
        { tag: 'v-spacer'}
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
            { label: "学生ID", model: "studentId", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "学生名字", model: "name", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "性别", model: "gender", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "出生日期", model: "dateOfBirth", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "班级ID", model: "classId", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "年级", model: "level", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "身高", model: "bodyHeight", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "学生状态", model: "studentStatus", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "备注", model: "remark", tag: "v-text-field", rules: "validationRules.requireRules" },
          ], 
          action: [{
            tag: "v-btn",
            value: "新增",
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
      title: '详情',
      headSlot: [
        { tag: 'v-spacer'}
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
            { label: "学生ID", model: "studentId", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "学生名字", model: "name", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "性别", model: "gender", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "出生日期", model: "dateOfBirth", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "班级ID", model: "classId", tag: "v-text-field", rules: "validationRules.requireRules", quickAttrs: ['disabled'] },
            { label: "年级", model: "level", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "身高", model: "bodyHeight", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "学生状态", model: "studentStatus", tag: "v-text-field", rules: "validationRules.requireRules" },
            { label: "备注", model: "remark", tag: "v-text-field", rules: "validationRules.requireRules" },
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
    },
    {
      tag: 'jh-drawer',
      key: "allot",
      attrs: {},
      title: '分配学生',
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

      title: '',
      classId: '', // 班级ID

      keyword: '', // 搜索关键字
      keywordFieldList: [], // 搜索关键字对应字段
      
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    computed: {
      tableDataComputed() {
        let data = this.tableData.filter(e => e.classId === this.classId);
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
        return this.tableData.filter(e => e.classId != this.classId);
      },
    },
    async created() {
      await this.doUiAction('prepareUrlObj');
      await this.doUiAction('getTableData');
    },
    doUiAction: {
      prepareUrlObj: ['prepareUrlObj'],
      redirect: ['redirectToClassList'],
      allotItem: ['confirmAllotItemDialog', 'doAllotItem', 'clearAllotItemData', 'closeAllotDrawer', 'doUiAction.getTableData'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      
      // ---------- 校验url传参 uiAction >>>>>>>>>> --------
      async prepareUrlObj() {
        const urlObj = new URLSearchParams(location.search);
        const classId = urlObj.get('classId');
        const title = urlObj.get('title');
        if (classId && title) {
          this.classId = classId;
          this.title = title;
        } else {
          setTimeout(() => {
            window.vtoast.fail('请从"班级列表"点击"学生"进入');
          }, 1000);
          return;
        }
      },
      // ---------- <<<<<<<<<<< 校验url传参 uiAction  --------

      async prepareCreateFormData() {
        this.createItem = {
          classId: this.classId,
        };
        this.createItemOrigin = _.cloneDeep(this.createItem);
      },
      async confirmAllotItemDialog() {
        if (await window.confirmDialog({ title: "确定将班级分配给此学生吗", content: "确定分配吗？" }) === false) {
          throw new Error("[confirmAllotItemDialog] 否");
        }
      },
      async prepareDoBuildRelation(funObj) {
        this.allotItemId = funObj.id;
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
              pageId: 'classListSinglePage',
              actionId: 'studentList-updateItem',
              actionData: { classId: this.classId },
              where: { id: this.allotItemId }
            }
          }
        });
      },
      async clearAllotItemData() {
        this.allotTableSelected = [];
        this.allotItemId = null;
      },
      // ---------- 班级列表 uiAction >>>>>>>>>>>> --------
      async redirectToClassList(funObj) {
        window.location.href = `/${window.appInfo.appId}/page/classList`
      },
      // ---------- <<<<<<<<<<< 班级列表 uiAction  --------
      tableItemSelected({ item, value }) {
        if (value) {
          this.allotTableSelected.push(item);
        } else {
          this.allotTableSelected = _.reject(this.allotTableSelected, ['classId', item.classId]);
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