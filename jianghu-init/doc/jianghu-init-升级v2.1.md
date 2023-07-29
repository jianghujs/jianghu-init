# jianghu-init-json协议配置文档

## 页面配置框架
- `pageType`: **页面类型，指示页面的布局类型为 "1table-page"，表示该页面包含一个表格。**
- `tableA`
  - `pageId`: **页面标识符，用于一标识页面: "studentManagement"。**
  - `table`: **表格标识符，指示该表格对应的数据表为 "student"。**
  - `name`: **字段业务属性名 "学生"**
  - `primaryField`: **业务id "studentId"**
  - `pageContent`: **页面布局,继承pageBasicContent**
- `tableB(非必须)`
  - `pageId`: **页面标识符，用于一标识页面: "studentManagement"。**
  - `table`: **表格标识符，指示该表格对应的数据表为 "student"。**
  - `name`: **字段业务属性名 "学生"**
  - `primaryField`: **业务id "studentId"**
  - `pageContent`: **页面布局,继承pageBasicContent**
- `tableABRelation(非必须)`
  - `pageId`: **页面标识符，用于一标识页面: "studentManagement"。**
  - `table`: **表格标识符，指示该表格对应的数据表为 "student"。**
  - `pageContent`: **页面布局,继承pageBasicContent**
- `pageBasicContent`: **页面布局配置。**
  - `pageHeader`: **页面头部。**
  - `tableHeader`: **表格头部。**
  - `tableFooter`: **表格页脚。**
  - `columns`: **表格列。**

## 协议字段配置
### Page
| 属性             | 默认值                                      | 说明                                       |
| ---------------- | ------------------------------------------- | ------------------------------------------ |
| pageType         | 必传                                        | 页面类型 eg: 1table-page                   |
| tableA           | 必传[[Table*](#Table*)]                     | 数据库表A   eg: class                      |
| tableB           | {}[[Table*](#Table*)]                       | 数据库表B eg: student                      |
| tableABRelation  | {}[[Table*](#Table*)]                       | 数据库表A、表B关联关系表 eg: student_class |
| pageBasicContent | 必传[[PageBasicContent](#PageBasicContent)] | 页面内容体                                 |

### Table*
| 属性         | 默认值 | 说明                             |
| ------------ | ------ | -------------------------------- |
| pageId       | 必传   | 页面ID   eg: studentManagement   |
| table        | 必传   | 数据库表名 eg: student           |
| name         | 必传   | 数据库表名 eg: 学生              |
| primaryField | 必传   | 数据库表业务字段名 eg: studentId |


### PageBasicContent
| 属性        | 默认值                                     | 说明         |
| ----------- | ------------------------------------------ | ------------ |
| pageHeader  | Array[[PageHeaderItem](#PageHeaderItem)]   | 页面头部配置 |
| tableHeader | Array[[TableHeaderItem](#TableHeaderItem)] | 表格头部配置 |
| tableFooter | Array[[TableFooterItem](#TableFooterItem)] | 表格页脚配置 |
| columns     | Array[[ColumnsItem](#ColumnsItem)]         | 表格列配置   |


### PageHeaderItem

| 属性  | 默认值 | 说明                |
| ----- | ------ | ------------------- |
| type  | 必传   | vuetify组件名       |
| label | ''     | 组件名label名       |
| align | right  | 对齐方式            |
| props | {}     | 原生vuetify组件属性 |
`面包屑`
```json
{
  "pageHeaderItem": [{
    "type": "v-breadcrumbs",
    "props": {
      "items": ["首页", "学生管理"]
    }
  }]
}
```
`后端搜索`
```json
{
  "pageHeaderItem": [{
    "type": "v-select",
    "label": "性别",
    "align": "right",
    "props": {
      "items": ["全部", "男", "女"]
    }
  }]
}
```

### TableHeaderItem

| 属性  | 默认值 | 说明                |
| ----- | ------ | ------------------- |
| type  | 必传   | vuetify组件名       |
| label | ''     | 组件名label名       |
| align | right  | 对齐方式            |
| props | {}     | 原生vuetify组件属性 |
`操作按钮`
```json
{
  "tableHeaderItem": [{
    "type": "v-btn",
    "label": "新增",
    "props": {
      "class": "v-middle"
    }
  },{
    "type": "v-btn",
    "label": "修改",
    "props": {
      "class": "v-middle"
    }
  }]
}

```
`前端搜索`
```json
{
  "tableHeaderItem": [{
    "type": "v-text-field",
    "label": "搜索",
    "align": "right",
    "props": {
      "placeholder": "请输入搜索内容"
    }
  }]
}
```

### TableFooterItem
`分页`
```json
{
  "tableFooter": [ 
    "pagination" 
  ],
}
```

### ColumnsItem

| 属性         | 默认值                           | 说明               |
| ------------ | -------------------------------- | ------------------ |
| name         | 必传                             | 字段名             |
| label        | 必传                             | 字段标识           |
| type         | 必传                             | vuetify组件类型    |
| width        | 100                              | 列宽度             |
| required     | false                            | 是否必传           |
| enableCreate | false                            | 是否在新增表单显示 |
| enableUpdate | false                            | 是否在修改表单显示 |
| sortable     | false                            | 是否可排序         |
| rules        | Array[[RulesItem]{#RulesItem}]   | 校验规则           |
| actions      | Array[ActionsItem](#ActionsItem) | 操作               |
| props        | {}                               | vuetify原生属性    |

`列配置`
```json
{
  "columns": [{
    "name": "gender",
    "label": "性别",
    "type": "v-text-field",
    "enableCreate": false,
    "enableUpdate": false,
    "required": true,
    "sortable": true,
    "searchable": true,
    "rules": [
      "v => !!v || '此项必填'",
      "v => !!v != 2 || '此项必须===2'"
    ],
    "props": {
      "color": "red"
    }
  },{
    "type": "action",
    "label": "操作",
    "width": 100,
    "actions": [{
      "type": "v-btn",
      "label": "修改"
    },
    {
      "type": "v-btn",
      "label": "删除"
    }]
  }]
}
```

### RulesItem
| 属性  | 默认值 | 说明                |
| ----- | ------ | ------------------- |
| type  | 必传   | vuetify组件名       |
| label | ''     | 组件名label名       |
| align | right  | 对齐方式            |
| props | {}     | 原生vuetify组件属性 |

`字段校验规则`
```json
{
  "rules": [
    "v => !!v || '此项必填'",
    "v => !!v != 2 || '此项必须===2'"
  ]
}
```

### ActionsItem
| 属性  | 默认值 | 说明          |
| ----- | ------ | ------------- |
| type  | 必传   | vuetify组件名 |
| label | ''     | 组件名label名 |

`操作`
```json
{
  "action": [{
    "type": "v-btn",
    "label": "修改"
  }]
}
```
## Todo
- [x] 1table、2table、3table协议设计
  - [ ] review协议设计
- [ ] page-init流程设计
  - [ ] 用户继续使用命令行交互式（支持直接传json文件参数）
  - [ ] 跟据用户输入自动生成对应page-type json配置
  - [ ] 根据json配置生成page
- [ ] 实施
