'use strict';
const yargs = require('yargs');
const InitComponentStatic = require('./component/init_component_static');
const CommandBase = require('./command_base');
const inquirer = require('inquirer');

const pageTypes = [
  {
    type: 'component',
    value: 'json-editor',
    name: 'json-editor - generate component from json-editor',
    pageId: 'vueJsonEditor',
    path: 'json-editor/',
    queryPageId: false,
    demo: `model 变量支持 String Object Array 
        <vue-json-editor v-model="updateItem.config" mode="code" height="calc(100vh - 240px)"></vue-json-editor>
    `,
  },
  {
    type: 'component',
    value: 'table-attachment',
    name: 'table-attachment - generate component from table-attachment',
    pageId: '',
    filename: 'tableAttachment',
    path: 'table-attachment/',
    demo: `/**
         * crud 附件上传组件
         * target-table {String} 关联表名
         * target-id    {String} 关联表id
         * fileType     {Array}  文件分类
         * fileSubtype  {Array}  文件子类型
         * imageCompression {Boolean} 是否压缩图片 - 需要引入 image-compression 资源
         * imageCompressionOptions {Object} 压缩图片配置 { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true }
         */
        <table-attachment target-table="class" pageId="pageId" :target-id="updateItem.id" :file-type="['分类']" :file-subtype="['子类型']" />
        { label: "附件", type: "component", componentPath: "jhTableAttachment" }
    `,
  },
  {
    type: 'component',
    value: 'table-record-history',
    name: 'table-record-history - generate component from table-record-history',
    pageId: '',
    filename: 'tableRecordHistory',
    path: 'table-record-history/',
    demo: `/**
         * crud 操作记录组件
         * table  {String} 关联表名
         * pageId {String} pageId
         * id     {String} 关联表id
         */
        <table-record-history table="class" :pageId="pageId" :id="updateItem.id" />
        { label: "操作记录", type: "component", componentPath: "jhTableRecordHistory" }
    `,
  },
  {
    type: 'component',
    value: 'vue-markdown',
    name: 'vue-markdown - generate component from vue-markdown',
    pageId: '',
    filename: 'vueMarkdown',
    path: 'vue-markdown/',
    demo: `/**
         * crud 操作记录组件
         * table  {String} 关联表名
         * pageId {String} pageId
         * id     {String} 关联表id
         */
        <vue-markdown v-model="value" />
    `,
  },
  {
    type: 'component',
    value: 'vue-swiper',
    name: 'vue-swiper - generate a carousel component',
    pageId: '',
    filename: 'vueSwiper',
    path: 'vue-swiper/',
    demo: `/**
         * 轮播图组件
         * slides {Array} 轮播图数据
         * options {Object} Swiper配置选项
         * pagination {Boolean} 是否显示分页器
         * navigation {Boolean} 是否显示导航按钮
         * scrollbar {Boolean} 是否显示滚动条
         */
        <vue-swiper :slides="slides" :options="options" :pagination="true" :navigation="true" />
    `,
  },
  {
    type: 'component',
    value: 'file-preview',
    name: 'file-preview - generate the file preview component',
    pageId: '',
    filename: 'filePreview',
    path: 'file-preview/',
    demo: `/**
         * 文件预览组件
         * 支持图片、音频、视频、PDF、Excel、Word等文件类型的预览
         */
        <file-preview ref="filePreview" />
        // 在需要预览文件的地方调用
        this.$refs.filePreview.open(filePath)
    `,
  },
  {
    type: 'component',
    value: 'vue-draggable',
    name: 'vue-draggable - generate drag and drop components',
    pageId: '',
    filename: 'vueDraggable',
    path: 'vue-draggable/',
    demo: `/**
         * 拖拽组件
         * 支持从左侧组件列表拖拽到右侧设计区域
         */
        <vue-draggable />
    `,
  },

];


/**
 * 生成页面
 */
module.exports = class InitToolCommand extends CommandBase {

  async run(cwd, args) {
    this.argv = this.getParser().parse(args || []);
    this.cwd = cwd;

    let pageType = '';
    if (this.argv.type) {
      if (pageTypes.find(o => o.value === this.argv.type)) {
        pageType = this.argv.type;
      }
    }
    if (this.argv.type === 'all' || args[0] === 'all') {
      for (const page of pageTypes) {
        if (page.value === 'all') {
          continue;
        }
        page.queryPageId = false;
        await new InitComponentStatic().run(process.cwd(), page);
      }
      this.success('jianghu init tool is success');
    } else {
      if (!pageType) {
        pageType = await this.askForPageType();
      }
      const page = pageTypes.find(o => o.value === pageType);
      if (this.argv.pageId) {
        page.queryPageId = false;
        page.pageId = this.argv.pageId;
      }
      page.y = this.argv.y;

      await new InitComponentStatic().run(process.cwd(), page);
      this.success('jianghu init tool is success');
    }
  }

  /**
   * get argv parser
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('🚀 init init-json tool .\n🔧 Usage: jianghu-init tool')
      .options(this.getParserOptions())
      .alias('h', 'help')
      .help();
  }

  /**
   * get yargs options
   * @return {Object} opts
   */
  getParserOptions() {
    return {
      type: {
        type: 'string',
        description: 'page type',
      },
    };
  }

  async askForPageType() {
    const answer = await inquirer.prompt({
      name: 'pageType',
      type: 'list',
      message: 'Please select a page type',
      choices: pageTypes,
      pageSize: pageTypes.length + 1,
    });
    return answer.pageType;
  }

};