/* eslint-disable */
const content = {
  pageType: "<=$ pageType $=>", pageId: "<=$ pageId $=>", table: "<=$ table $=>", pageName: "<=$ pageName $=>", template: "<=% if pageType == 'jh-mobile-page' %=>jhMobileTemplateV4<=% else %=>jhTemplateV4<=% endif %=>", version: 'v3',
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "<=$ table $=>", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      // resourceHook: { before: [{service:"common",serviceFunction:"generateBizIdOfBeforeHook"}] },
      desc: "✅添加",
      resourceData: { table: "<=$ table $=>", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新",
      resourceData: { table: "<=$ table $=>", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除",
      resourceData: { table: "<=$ table $=>", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "<=$ pageName $=>", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },

    { 
      tag: 'jh-order',
      data: {
        tableDataOrder: [ { column: "operationAt", order: "desc" } ],
        tableDataOrderList: [
          { text: "更新时间↓", value: [ { column: "operationAt", order: "desc" } ] },
        ],
      }
    },
    { 
      tag: 'jh-search', 
      searchList: [
        { tag: "v-text-field", model: "keyword", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '标题', ':disabled': 'keywordFieldList.length == 0', ':placeholder': "!keywordFieldList.length ? '未设置搜索字段' : ''"} },
        // { tag: "v-text-field", model: "serverSearchWhereLike.className", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '前缀'} },
      ],
      data: {
        keyword: '', // 特殊搜索变量，支持多字段模糊搜索
        keywordFieldList: [], // 模糊字段列表
        serverSearchWhereLike: { },
      }
    },
    { tag: 'v-spacer'},
    { tag: 'jh-mode', data: { viewMode: 'simple'} },
  ],
  pageContent: [
    {
      tag: 'jh-list',
      props: {
        limit: 10,
        rightArrowText: '指派跟进人',
      },
      attrs: {  },
      attrs: { cols: 12, class: 'p-0 pb-7', style: 'height: calc(100dvh - 140px); overflow-y: auto;overscroll-behavior: contain' },
      headers: [
        //===//<=%- for field in fields %=>
        { text: "<=$ field.COLUMN_COMMENT $=>", value: "<=$ field.COLUMN_NAME $=>", width: 80, sortable: true },
        //===//<=%- endfor %=>
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 120', align: "center", class: "fixed", cellClass: "fixed" },
        // width 表达式需要使用字符串包裹 
        // 是否是标题 isTitle: true 
        // 简单模式 isSimpleMode: true
      ],
      value: [],
      rowActionList: [
        // 简写支持 pc 和 移动端折叠
        //===// <=$ jhTableRowAction | safe $=>
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' }
      ],
    },
    {
      tag: 'jh-action',
      attrs: { class: 'h-16 w-16 p-2 fixed right-4 bottom-32' },
      actionList: [
        { tag: 'v-btn', value: '新增', attrs: { color: 'primary', class: 'elevation-0', '@click': "doUiAction('startCreateItem'); isPageActionDrawerShown = false"  }, quickAttrs: ['block'] },
      ]
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
              '@click': "doUiAction('updateItem')"
            }
          }],
        },
        //===// <=$ updateDrawerComponent | safe $=>
      ]
    },
    {
      tag: 'jh-detail-drawer',
      key: "detail",
      attrs: {},
      title: '编辑',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "编辑", 
          type: "preview", 
          formItemList: [
            //===//<=%- for field in fields %=>
            //===//<=%- if field.COLUMN_NAME != 'id' %=>
            { label: "<=$ field.COLUMN_COMMENT $=>", tag: "span", colAttrs: { class: 'border-b pb-2 flex justify-between' }, value: "{{detailItem.<=$ field.COLUMN_NAME $=>}}"  },
            //===//<=%- endif %=>
            //===//<=%- endfor %=>
          ], 
          action: [{
            tag: "v-btn",
            value: "编辑",
            attrs: {
              color: "success",
              '@click': "doUiAction('startUpdateItem', detailItem); closeDetailDrawer()"
            }
          }],
        },
      ]
    }
  ],
  includeList: [
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    //===// <=$ propsStr $=>
    data: {
      constantObj: {
      },
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      filterMap: {}, // 结果筛选条件

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