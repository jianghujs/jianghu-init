const content = {
  "pageType": "jh-page",
  "pageId": "fileManager",
  "table": "_file",
  "pageName": "文件管理",
  "pageHook": {
    "beforeHook":[
      {"field": "constantUiMap", "service": "constantUi", "serviceFunc": "getConstantUiMap"}
    ]
  },
  "resourceList": [
   
  ],
  "includeList": [
    "{% include 'component/fileBrowser/fileBrowser.html' %}"
  ],
  headContent: [
  ],

  "pageContent": [
    {
      tag: 'v-col',
      attrs: { md: 12, sm: 12, xs: 12 },
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
  "actionContent": [

  ],
  "common": {
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