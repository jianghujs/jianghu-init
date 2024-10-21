'use strict';
const yargs = require('yargs');
const InitPageStatic = require('./page/init_page_static');
const CommandBase = require('./command_base');
const inquirer = require('inquirer');

const pageTypes = [
  {
    type: 'page',
    value: 'record-history-page',
    name: 'record-history-page - generate pages from record-history',
    pageId: 'recordHistory',
    path: 'template/record-history/',
  },
  {
    type: 'page',
    value: 'user-management-page',
    name: 'user-management-page - generate pages from user-management',
    pageId: 'userManagement',
    path: 'template/user-management/',
  },
  {
    type: 'page',
    value: 'user-group-role-page',
    name: 'user-group-role-page - generate pages from user-group-role',
    pageId: 'userGroupRole',
    path: 'template/user-group-role/',
  },
  {
    type: 'page',
    value: 'user-page-resource-page',
    name: 'user-page-resource-page - generate pages from user-page-resource',
    pageId: 'userPageResource',
    path: 'template/user-page-resource/',
  },
  {
    type: 'component',
    value: 'json-editor-component',
    name: 'json-editor-component - generate component from json-editor',
    pageId: 'vueJsonEditor',
    path: 'template/json-editor/',
    queryPageId: false,
    demo: `model 变量支持 String Object Array 
        <vue-json-editor v-model="updateItem.config" mode="code" height="calc(100vh - 240px)"></vue-json-editor>
    `,
  },
  {
    type: 'component',
    value: 'table-attachment-component',
    name: 'table-attachment-component - generate component from table-attachment',
    pageId: '',
    filename: 'tableAttachment',
    path: 'template/table-attachment/',
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
    value: 'table-record-history-component',
    name: 'table-record-history-component - generate component from table-record-history',
    pageId: '',
    filename: 'tableRecordHistory',
    path: 'template/table-record-history/',
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
    value: 'all',
    name: 'all - generate all above pages',
  }];


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
        await new InitPageStatic().run(process.cwd(), page);
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

      await new InitPageStatic().run(process.cwd(), page);
      this.success('jianghu init tool is success');
    }
  }

  /**
   * get argv parser
   * @return {Object} yargs instance
   */
  getParser() {
    return yargs
      .usage('init jianghu tool .\nUsage: $0 page')
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
