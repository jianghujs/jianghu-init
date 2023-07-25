# 思路
- 按照jianghu-init现有的页面布局，通过json树结构来描述页面布局，支持每一块组件可配置
- 页面的每一模块都用相同的数据协议type、data、body来标识
  - type: 用于标识当前模块的类型
    - 自定义type, 比如整个页面的type为page、自定义模板为tpl、table
      ```
      "type": "page",
      "data": {
        "name": "张三",
      },
      "body": {
        "type": "tpl",
        "data": {
          "name": "张三",
        },
        "tpl": "my name is ${name}"
      }
      ```
      ```
      "type": "tpl",
      "data": {
        "name": "张三",
      },
      "tpl": "my name is ${name}"
      ```
      ```
      "type": "table",
      "columns": [{
        "name": "id",
        "type": "v-text-field",
        "label": "唯一标识",
        "originalProps": {
          "value": "id",
          "readonly": true,
          "sortable": true,
          "searchable": true,
        }
      }],
      ```
    - vuetify的type, 比如v-text-field、v-select、v-button等
      ```
      "type": "v-text-field",
      "name": "id",
      "className": "success--text",
      "label": "唯一标识",
      "readonly": true,
      ```
  - data: 用于标识当前模块的数据，例如：pageId、pageType、table等
  - body: 用于标识当前模块的子模块，例如：pageHeader、bulkActions、headerToolbar、footerToolbar、columns等
    - 各个子模块都使用相同的数据协议type、data、body来标识

# pageTree(page Json树结构)
- type(见下方nodeType)
- data(页面data, 可以被body中的节点使用${pageId} 或者 this引用, 合并到页面的vueData中)
  - pageId
  - pageType
  - table
  - ...
- body(页面body, 用于渲染页面)
  - pageHeader[] (用于页面头部面包屑、后端搜索)
    - type（tpl）
    - data
    - body
      - 
  - bulkActions[] (用于批量操作)
    - type (v-button, 例如批量新增、批量删除)
    - data
    - body
  - headerToolbar[] (用于header上的按钮、前端搜索)
    - type (v-button, 例如新增操作)
    - data
    - body
  - table (用于table的列配置)
    - type (table)
    - columns[] (用于table的列配置)
      - name
      - type (v-text-field、v-select、v-checkbox、v-radio、v-button)
      - rules[]
      - label
      - sortable
      - searchable
  - footerToolbar[] (用于分页、统计)
    - type (v-pagination, 例如分页)
    - data
    - body
  - ……

# nodeType(节点类型)
## type（分为两种，1：自定义类型 2：vuetify类型）
  - 自定义类型
    - tpl(自定义模板)
    - page
  - vuetify类型
    - v-text-field
    - v-textarea
    - v-select
    - v-checkbox
    - v-radio
    - v-button
    - ...
## data（自定义字段）
  - pageId
  - pageType
  - table
  - ...

## body(预计支持)
  - pageHeader
  - bulkActions
  - headerToolbar
  - footerToolbar
  - columns (table的列配置)
  - ...

# 使用文档