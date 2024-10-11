'use strict';
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');


// 1table-page / 1table-component 共用方法
const mixin = {
  getResourceList(pageType, pageId, table, otherResourceList = [], componentName = '', primaryField) {
    const templatePath = `${path.join(__dirname, '../../../')}page-template-json/${pageType}`;
    const defaultResource = JSON.parse(fs.readFileSync(`${templatePath}/resource.json`));
    for (const resource of defaultResource) {
      if ((resource.actionId === 'insertItem' || resource.actionId.includes('-insertItem')) && primaryField) {
        resource.resourceHook = {
          before: [{ service: 'common', serviceFunction: 'generateBizIdOfBeforeHook' }],
        };
      }
    }
    defaultResource.push(...otherResourceList);
    return this.customStringify(defaultResource, pageId, table, componentName);
  },
  getContent(table, pageId, pageType, fields, pageName, updateDrawerComponent = '', primaryField) {
    let tableStr = '';
    let columnStr = '';
    let space = '';
    let actionSpace = '';
    let pageContent = '';
    let actionContent = '';
    let headContent = '[]';
    if (table) {
      let createItemListStr = '';
      let updateItemListStr = '';
      let detailItemListStr = '';
      tableStr = `table: "${table}",`;
      const { excludeColumn = [] } = this.argv || {};
      fields.forEach((field, index) => {
        const fieldKey = field.COLUMN_NAME;
        const fieldName = field.COLUMN_COMMENT;
        if (excludeColumn.includes(fieldKey)) return;
        if (fieldKey === 'idSequence') return;
        if (index === 0) columnStr += space + `{ text: "${fieldName}", value: "${fieldKey}", width: 80, sortable: true, class: "fixed", cellClass: "fixed" },\n`;
        if (index !== 0) columnStr += space + `{ text: "${fieldName}", value: "${fieldKey}", width: 80, sortable: true },\n`;
        if (fieldKey === primaryField) {
          createItemListStr += actionSpace + `{ label: "${fieldName}", model: "${fieldKey}", tag: "v-text-field", idGenerate: { prefix: "T", startValue: 10001, bizId: "${primaryField}" }, quickAttrs: ['disabled'] },\n`;
        } else {
          createItemListStr += actionSpace + `{ label: "${fieldName}", model: "${fieldKey}", tag: "v-text-field", rules: "validationRules.requireRules" },\n`;
        }

        if (fieldKey === primaryField) {
          updateItemListStr += actionSpace + `{ label: "${fieldName}", model: "${fieldKey}", tag: "v-text-field", quickAttrs: ['disabled'] },\n`;
        } else {
          updateItemListStr += actionSpace + `{ label: "${fieldName}", model: "${fieldKey}", tag: "v-text-field", rules: "validationRules.requireRules" },\n`;
        }
        detailItemListStr += actionSpace + `{ label: "${fieldName}", tag: "span", colAttrs: { class: 'border-b pb-2 flex justify-between' }, value: "{{detailItem.${fieldKey}}}"  },\n`;
        space = ' '.repeat(8);
        actionSpace = ' '.repeat(12);
      });

      columnStr += space + '{ text: "操作", value: "action", type: "action", width: \'window.innerWidth < 500 ? 70 : 120\', align: "center", class: "fixed", cellClass: "fixed" },\n';
      pageContent = `[
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
        ${columnStr}
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
  ]`;
      if (pageType === 'jh-mobile-page') {
        pageContent = `[
    {
      tag: 'jh-list',
      props: {
        limit: 10,
        rightArrowText: '指派跟进人',
      },
      attrs: { cols: 12, class: 'p-0 pb-7', style: 'height: calc(100vh - 140px); overflow-y: auto;overscroll-behavior: contain' },
      headers: [
        ${columnStr}
        // width 表达式需要使用字符串包裹 
        // 是否是标题 isTitle: true 
        // 简单模式 isSimpleMode: true
      ],
      rowActionList: [
        { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
        { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
      ],
    }
  ]`;
      }
      actionContent = `actionContent: [
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
            ${createItemListStr}
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
            ${updateItemListStr}
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
        { label: "操作记录", type: "component", componentPath: "recordHistory", attrs: { table: '${table}', pageId: '${pageId}', ':id': 'updateItem.id' } },
        ${updateDrawerComponent}
      ]
    },
    ${pageType === 'jh-mobile-page' ? `{
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
              ${detailItemListStr}
            ], 
            action: [{
              tag: "v-btn",
              value: "编辑",
              attrs: {
                color: "success",
                ':small': true,
                '@click': "doUiAction('startUpdateItem', detailItem); closeDetailDrawer()"
              }
            }],
          },
        ]
      }` : ''}
  ]`;

    } else {
      pageContent = `[
    {
      tag: 'v-row',
      attrs: { justify: 'center', ':no-gutters': true },
      value: [
        { tag: 'v-col', attrs: { cols: '12', sm: '12', md: '12', lg: '12', xl: '12' }, value: '自定义容器内容' },
      ]
    }
  ]`;
    }
    if (pageType !== 'jh-component') {
      headContent = `[
    { tag: 'jh-page-title', value: "${pageName}", attrs: { cols: 12, sm: 6, md:4 }, helpBtn: true, slot: [] },

    { 
      tag: 'jh-search', 
      attrs: { cols: 12, sm: 6, md:8 },
      searchList: [
        { tag: "v-text-field", model: "serverSearchWhereLike.className", colAttrs: { cols: 12, md: 3 }, attrs: {prefix: '前缀'} },
      ], 
    },
    { tag: 'v-spacer'},
    { tag: 'jh-mode', title: '简单模式', icon: 'mdi-view-carousel-outline', model: 'viewMode', items: 'constantObj.viewModeList' },
  ]
      `;
    }
    return { pageContent, actionContent, tableStr, headContent };
  },
  async getFields(table) {
    const knex = await this.getKnex();
    const result = await knex.select('COLUMN_NAME', 'COLUMN_COMMENT').from('INFORMATION_SCHEMA.COLUMNS').where({
      TABLE_SCHEMA: this.dbSetting.database,
      TABLE_NAME: table,
    });

    const defaultColumn = [ 'operation', 'operationByUserId', 'operationByUser', 'operationAt' ];
    for (const column of defaultColumn) {
      await knex.schema.hasColumn(table, column).then(exists => {
        if (!exists) {
          return knex.schema.table(table, t => {
            this.info(`创建依赖字段：${column}`);
            t.string(column);
          });
        }
      });
    }

    return result.filter(column => {
      return ![ ...defaultColumn, 'id' ].includes(column.COLUMN_NAME);
    }).map(column => {
      return {
        COLUMN_NAME: column.COLUMN_NAME,
        COLUMN_COMMENT: (column.COLUMN_COMMENT || column.COLUMN_NAME || '').split(';')[0].split('；')[0].split(':')[0],
      };
    });
  },
  customStringify(obj, pageId, table, componentName) {
    for (const item of obj) {
      for (const key in item) {
        if (key === 'resourceHook' || key === 'resourceData') {
          if (Object.keys(item[key]).length === 0) {
            delete item[key];
          }
        }
      }
    }
    return JSON.stringify(obj, (key, value) => {
      if (key === 'resourceHook' || key === 'resourceData') {
        // 如果是 resourceHook 或 resourceData，则将其内容压缩成单行
        if (Object.keys(value).length === 0) {
          return {}; // 空对象
        } else {
          // 将内部的 key-value 对象格式化为单行
          const formattedEntries = Object.entries(value)
            .map(([ k, v ]) => `${k}: ${JSON.stringify(v)}`) // 使用 JSON.stringify 保持字符串引号
            .join(', ');
          return `{ ${formattedEntries} }`; // 保持花括号

        }
      }
      return value;
    }, 2)
      // 进行模板替换
      .replace(/\{\{pageId}}/g, pageId)
      .replace(/\{\{table}}/g, table)
      .replace(/\{\{filename}}/g, componentName.split('/').pop())
      .replace(/"([^"]+)":/g, '$1:') // 移除属性名的引号
      .replace(/\\/g, '') // 移除属性名的引号
      .replace(/"{/g, '{') // 移除被 JSON.stringify 添加的引号
      .replace(/}"/g, '}')
      .replace(/\n/g, '\n  '); // 移除结尾的引号
  },
};
module.exports = mixin;
