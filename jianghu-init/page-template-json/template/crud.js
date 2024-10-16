/* eslint-disable */
const content = {
  pageType: "<=$ pageType $=>", pageId: "<=$ pageId $=>", table: "<=$ table $=>", pageName: "<=$ pageName $=>", template: "jhMobileTemplateV4", version: 'v2',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表-classManagement",
      resourceData: { table: "<=$ table $=>", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      resourceHook: { before: [{service:"common",serviceFunction:"generateBizIdOfBeforeHook"}] },
      desc: "✅添加-classManagement",
      resourceData: { table: "<=$ table $=>", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新-classManagement",
      resourceData: { table: "<=$ table $=>", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除-classManagement",
      resourceData: { table: "<=$ table $=>", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "<=$ pageName $=>页面", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },

    { tag: 'v-spacer'},
    { 
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      value: [
        { tag: "v-text-field", model: "keyword", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '标题', ':disabled': 'keywordFieldList.length == 0', ':placeholder': "!keywordFieldList.length ? '未设置搜索字段' : ''"} },
        // { tag: "v-text-field", model: "serverSearchWhereLike.className", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '前缀'} },
      ], 
      searchBtn: true
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
        // 简写支持 pc 和 移动端折叠
        //===// <=$ jhTableRowAction | safe $=>
        { text: '详情', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' }
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
            { label: "<=$ field.COLUMN_COMMENT $=>", model: "<=$ field.COLUMN_NAME $=>", tag: "v-text-field", rules: "validationRules.requireRules" },
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
        //===// <=$ updateDrawerComponent | safe $=>
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

      keyword: '', // 搜索关键字
      keywordFieldList: [], // 搜索关键字对应字段
      //===// <=$ commonDataStr $=>
    },
    dataExpression: {
      isMobile: 'window.innerWidth < 500'
    }, // data 表达式
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
      await this.doUiAction('getTableData');
    },
    doUiAction: {
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
      //===// <=$ methodItemStr | safe $=>
    }
  },
  //===// <=$ style | safe $=>
};

module.exports = content;