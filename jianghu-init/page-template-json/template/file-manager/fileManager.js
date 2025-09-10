/* eslint-disable */
const content = {
  pageType: "jh-page", pageId: "fileManager", table: "_file", pageName: "文件管理",
  pageHook: {
    beforeHook:[
      {field: "constantUiMap", service: "constantUi", serviceFunc: "getConstantUiMap"}
    ]
  },
  resourceList: [
    
  ],
  includeList: [
    { type: 'html', path: 'component/fileBrowser/fileBrowser.html' },
  ],
  headContent: [
    { tag: 'jh-page-title', value: "文件管理", attrs: { cols: 12, sm: 6, md: 4 }, helpBtn: true, slot: [] },
    { tag: 'v-spacer' },
    {
      tag: 'jh-search',
      value: [
      ],
    },
  ],
  pageContent: [
    {
      tag: 'v-col',
      attrs: { md: 12, sm: 12, xs: 12, class: 'pa-0' },
      value: [
        /*html*/`
          <file-browser 
          :operation-option="operationOption"
          :pageId="pageId"
          path="/"
          />
        `
      ]
    }
  ],
  common: {
    data: {
      pageId: 'allPage',
      operationOption: {
        delete: true,
        copy: true,
        recycle: true,
        renameFile: true
      },

    },
    watch: {
    },
    computed: {
    },
    async created() {
    },
    mounted() { },
    methods: {
    }
  },
  style: `
   
  `
}

module.exports = content;