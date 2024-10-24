const content = {
  pageType: "jh-page", pageId: "studentFileManagement", table: "student_file", pageName: "studentFileManagement页面", template: "jhTemplateV4", version: 'v2', 
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      desc: "✅查询列表",
      resourceData: { table: "student_file", operation: "select" }
    },
    {
      actionId: "insertItem",
      resourceType: "sql",
      // resourceHook: { before: [{service:"common",serviceFunction:"generateBizIdOfBeforeHook"}] },
      desc: "✅添加",
      resourceData: { table: "student_file", operation: "jhInsert" }
    },
    {
      actionId: "updateItem",
      resourceType: "sql",
      desc: "✅更新",
      resourceData: { table: "student_file", operation: "jhUpdate" }
    },
    {
      actionId: "deleteItem",
      resourceType: "sql",
      desc: "✅删除",
      resourceData: { table: "student_file", operation: "jhDelete" }
    }
  ], // { actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
  headContent: [
    { tag: 'jh-page-title', value: "studentFileManagement页面页面", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },

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
        { text: "学生ID", value: "studentId", width: 80, sortable: true },
        { text: "文件路径", value: "filePath", width: 80, sortable: true },
        { text: "操作", value: "action", type: "action", width: 'window.innerWidth < 500 ? 70 : 160', align: "center", class: "fixed", cellClass: "fixed" },
      ],
      value: [],
      rowActionList: [
        { text: '预览或下载', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("filePreview", item)' }, // 简写支持 pc 和 移动端折叠
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
            { label: "文件路径", model: "file", md: 3, tag: "v-file-input", rules: "validationRules.requireRules" },
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
            { label: "文件路径", model: "file", md: 3, tag: "v-file-input", rules: "validationRules.requireRules" },
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
    /*html*/`<!-- 文件预览 -->
    <v-overlay :value="previewOverlay" @click="previewOverlay = false" :opacity="0.85" style="z-index: 9999;">
      <v-icon style="position: fixed; right: 10px; top: 5px; z-index: 50000; background-color: black;" large color="white"
        @click="previewOverlay = false">
        mdi-close-circle
      </v-icon>
      <v-icon style="position: fixed; right: 50px; top: 5px; z-index: 50000; background-color: black;" large color="white"
        @click="doUiAction('downloadFileByStream', {item: updateItem})">
        mdi-download
      </v-icon>
      <iframe v-if="previewFileType === 'pdf'"
        :src="'/<$ ctx.app.config.appId $>/public/pdf/web/viewer.html?file=' + previewFileUrl" frameborder="0"
        style="width: 90vw; height: 90vh; padding: 50px 0 0 0;"></iframe>
      <v-img v-if="previewFileType === 'img'" max-height="90vh" max-width="90vw" style="margin: 0 auto" contain :src="previewFileUrl"></v-img>
    </v-overlay>`
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

      downloadPrefix: `$\{window.location.origin}/<$ ctx.app.config.appId $>/upload`,
      previewPrefix: `/<$ ctx.app.config.appId $>/upload`,
      previewOverlay: false,
      previewFileUrl: null,
      previewFileBase64: '',
      previewFilename: '',
      previewFileType: '',
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
     
    doUiAction: {
      downloadFileByStream: ['downloadFileByStream'],
      filePreview: ['filePreview'],
      createItem: ['prepareCreateValidate', 'confirmCreateItemDialog', 'prepareDoCreateItem', 'doUploadItemFile("createActionData")', 'doCreateItem', 'closeCreateDrawer', 'doUiAction.getTableData'],
      updateItem: ['prepareUpdateValidate', 'confirmUpdateItemDialog', 'prepareDoUpdateItem', 'doUploadItemFile("updateActionData")', 'doUpdateItem', 'closeUpdateDrawer', 'doUiAction.getTableData'],
    }, // 额外uiAction { [key]: [action1, action2]}
    methods: {
       

      async prepareUpdateFormData(funObj) {
        const item = _.cloneDeep(funObj);
         item.file = { name: (item.filePath || '').split('/').pop() };
        this.updateItem = _.cloneDeep(item);
        this.updateItemOrigin = _.cloneDeep(item);
      },
      async filePreview(item) {
        this.updateItem = item;
         if (!item.filePath) return;
         const { filePath } = item;
         const filename = filePath.split('/').pop();
        this.previewFileType = null;
        if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filename)) {
          this.previewFileType = 'img';
           this.previewFileUrl = this.previewPrefix + item.filePath;
        }
        if (/\.(pdf|PDF)$/.test(filename)) {
          this.previewFileType = 'pdf';
           this.previewFileUrl = encodeURIComponent(this.previewPrefix + item.filePath);
        }
        if (['img', 'pdf'].includes(this.previewFileType)) {
          this.previewOverlay = true;
        } else {
          await this.downloadFileByStream({ item });
        }
      },

      async downloadFileByStream({ item }) {
         const downloadPath = item.filePath
         const filename = item.filePath.split('/').pop();
        window.vtoast.loading(`${filename} 下载进度: 0%`);
        const buffer = await window.jianghuAxios.httpDownloadByStream({
          downloadPath,
          filename,
          onProgress: (total, loaded) => {
            const progress = Number((loaded * 100 / total).toFixed(2));
            window.vtoast.loading(`${filename} 下载进度: ${progress}%`);
            if (total === loaded) {
              window.vtoast.success("下载完成");
            }
          }
        })
        window.jianghuAxios.downloadBufferToChrome({ buffer, filename });
      },

      async doUploadItemFile(key) {
        const { file: fileObj } = this[key];
        const fileList = _.isArray(fileObj) ? fileObj : [fileObj];
        const attachment = this[key].attachment || [];
        for (const file of fileList) {
          if (file && file.size) {
            await window.vtoast.loading("文件上传");
  
            // 压缩文件
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true
            };
            let compressedFile;
            try {
              console.log(file);
              compressedFile = await imageCompression(file, options);
              // 处理压缩后的文件...
            } catch (e) {
              // window.vtoast.fail("图片压缩失败，请检查格式是否符合要求");
              compressedFile = file;
            }
  
            const result = await window.jianghuAxios.httpUploadByStream({ file: compressedFile, fileDirectory: 'testFile',
              onProgress: (total, loaded) => {
                let progress = Number((loaded * 100 / total).toFixed(2))
                window.vtoast.loading(`文件上传进度${progress}%`);
                if (progress === 100) {
                  window.vtoast.success('文件上传成功');
                }
              }
            });
  
            if (result.data.status === 'success') {
              delete this[key].file;
              this[key]['filePath'] = result.data.appData.resultData.downloadPath
              // this[key].binarySize = result.data.appData.resultData.binarySize
              // this[key].filename = result.data.appData.resultData.filename
            } else {
              await window.vtoast.fail("文件上传失败");
              throw new Error("文件上传失败");
            }
          }
        }

        delete this[key].file;
      },
    }
  },
   
};

module.exports = content;