const content = {
  pageType: "jh-page", pageId: "constant", pageName: "常量管理", 
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表-constant",
      resourceData: { table: "_constant", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      desc: "✅添加-constant",
      resourceData: { table: "_constant", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新-constant",
      resourceData: { table: "_constant", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除-constant",
      resourceData: { table: "_constant", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }

  headContent: [
    { tag: 'jh-page-title', value: "常量管理", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    
  ],
  pageContent: [
    {
      tag: 'jh-table',
      attrs: {  },
      colAttrs: { clos: 12 },
      cardAttrs: { class: 'rounded-lg elevation-0' },
      headActionList: [
        { tag: 'v-btn', value: '新增', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")', small: true } },
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
        { text: "id", value: "id", width: 80, sortable: true, class: "fixed", cellClass: "fixed" },
        { text: "constantKey", value: "constantKey", width: 80, sortable: true },
        { text: "常量类型", value: "constantType", width: 80, sortable: true },
        { text: "描述", value: "desc", width: 80, sortable: true },
        { text: "常量内容", md: 12, value: "constantValue", width: 80, sortable: true },
        { text: "操作", value: "operation", width: 80, sortable: true },
        { text: "操作者userId", value: "operationByUserId", width: 80, sortable: true },
        { text: "操作者用户名", value: "operationByUser", width: 80, sortable: true },
        { text: "操作时间", value: "operationAt", width: 80, sortable: true },
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 120', align: "center", class: "fixed", cellClass: "fixed" },

        // width 表达式需要使用字符串包裹
      ],
      value: [
        // vuetify table custom slot
      ],
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
            { label: "id", model: "id", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "constantKey", model: "constantKey", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "常量类型", model: "constantType", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "描述", model: "desc", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "常量内容", colAttrs: { md: 12 }, model: "constantValue", tag: "jh-json-editor", rules: "validationRules.requireRules",   },

          ], 
          action: [{
            tag: "v-btn",
            value: "新增",
            attrs: {
              color: "success",
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
      title: '编辑',
      headSlot: [
        { tag: 'v-spacer'}
      ],
      contentList: [
        { 
          label: "编辑", 
          type: "form", 
          formItemList: [
            /**
             * colAtts: { cols: 12, md: 3 } // 表单父容器栅格设置
             * attrs: {} // 表单项属性
             */
            { label: "id", model: "id", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "constantKey", model: "constantKey", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "常量类型", model: "constantType", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "描述", model: "desc", tag: "v-text-field", rules: "validationRules.requireRules",   },
            { label: "常量内容", colAttrs: { md: 12 }, model: "constantValue", tag: "jh-json-editor", rules: "validationRules.requireRules",   },

          ], 
          action: [{
            tag: "v-btn",
            value: "编辑",
            attrs: {
              color: "success",
              ':small': true,
              '@click': "doUiAction('updateItem')"
            }
          }],
        },
        { label: "操作记录", type: "component", componentPath: "recordHistory", attrs: { table: '_constant', pageId: 'constant', ':id': 'updateItem.id' } },
      ]
    },
    
  ],
  includeList: [
    '<link href="/<$ ctx.app.config.appId $>/public/plugin/jsoneditor/jsoneditor.css" rel="stylesheet">',
    '<script src="/<$ ctx.app.config.appId $>/public/plugin/jsoneditor/jsoneditor.js"></script>',
  ], // { type: < js | css | html | vueComponent >, path: ''}
  common: { 
    
    data: {
      constantObj: {},
      validationRules: {
        requireRules: [
          v => !!v || '必填',
        ],
      },
      serverSearchWhereLike: { className: '' }, // 服务端like查询
      serverSearchWhere: { }, // 服务端查询
      serverSearchWhereIn: { }, // 服务端 in 查询
      filterMap: {}, // 结果筛选条件
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
    doUiAction: {}, // 额外uiAction { [key]: [action1, action2]}
    methods: {}
  },
  
};

module.exports = content;
