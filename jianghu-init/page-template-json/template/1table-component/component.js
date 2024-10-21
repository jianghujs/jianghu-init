/* eslint-disable */
const content = {
  pageType: "<=$ pageType $=>", pageId: "<=$ pageId $=>", table: "<=$ table $=>", pageName: "<=$ pageName $=>", template: "jhMobileTemplateV4", version: 'v2', componentPath: '<=$ componentName $=>',
  resourceList: [
    {
      actionId: "<=$ actionIdPrefix $=>-selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "<=$ table $=>", operation: "select" }
    },
    {
      actionId: "<=$ actionIdPrefix $=>-insertItem",
      resourceType: "sql",
      // resourceHook: { before: [{service:"common",serviceFunction:"generateBizIdOfBeforeHook"}] },
      desc: "✅添加",
      resourceData: { table: "<=$ table $=>", operation: "jhInsert" }
    },
    {
      actionId: "<=$ actionIdPrefix $=>-updateItem",
      resourceType: "sql",
      desc: "✅更新",
      resourceData: { table: "<=$ table $=>", operation: "jhUpdate" }
    },
    {
      actionId: "<=$ actionIdPrefix $=>-deleteItem",
      resourceType: "sql",
      desc: "✅删除",
      resourceData: { table: "<=$ table $=>", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0 pt-4' },
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
        //===//<=%- for field in fields %=>
        { text: "<=$ field.COLUMN_COMMENT $=>", value: "<=$ field.COLUMN_NAME $=>", width: 80, sortable: true },
        //===//<=%- endfor %=>
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
            //===//<=%- for field in fields %=>
            //===//<=%- if field.COLUMN_NAME != 'id' %=>
            { label: "<=$ field.COLUMN_COMMENT $=>", model: "<=$ field.COLUMN_NAME $=>", tag: "v-text-field", rules: "validationRules.requireRules" },
            //===//<=%- endif %=>
            //===//<=%- endfor %=>
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
            //===//<=%- for field in fields %=>
            //===//<=%- if field.COLUMN_NAME != 'id' %=>
            //===//<=%- if field.COLUMN_NAME == primaryFieldA %=>
            { label: "<=$ field.COLUMN_COMMENT $=>", model: "<=$ field.COLUMN_NAME $=>", tag: "v-text-field", rules: "validationRules.requireRules", quickAttrs: ['disabled'] },
            //===//<=%- else %=>
            { label: "<=$ field.COLUMN_COMMENT $=>", model: "<=$ field.COLUMN_NAME $=>", tag: "v-text-field", rules: "validationRules.requireRules" },
            //===//<=%- endif %=>
            //===//<=%- endif %=>
            //===//<=%- endfor %=>
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
  ],
  includeList: [
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    //===// <=%- if primaryFieldA %=>
    //===// props: { <=$ primaryFieldA $=>: { type: String, required: true } },
    //===// <=%- endif %=>
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
      //===// <=$ commonDataStr $=>
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
    computed: {
      tableDataComputed() {
        //===// <=%- if primaryFieldA %=>
        //===// let data = this.tableData.filter(e => e.<=$ primaryFieldA $=> === this.<=$ primaryFieldA $=>);
        //===// <=%- endif %=>
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
    },
    async created() {
      await this.doUiAction('getTableData');
    },
    doUiAction: {
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
    }
  },
  //===// <=$ style | safe $=>
};

module.exports = content;