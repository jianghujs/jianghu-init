## jh-create-drawer

创建抽屉组件，用于在用户界面中创建数据。(vuetify v-navigation-drawer 组件)

### 示例
```javascript
{
  tag: 'jh-create-drawer',  // 组件标签
  key: "create",            // 唯一标识 默认变量：createItem isCreateDrawerShown   
  attrs: {},                // 抽屉 v-navigation-drawer 属性
  title: '标题',            // 抽屉标题
  headSlot: [             // 抽屉标题后插槽
    {tag: 'v-spacer'},
  ],
  contentList: [
    { type: 'form', formItemList: [], action: [] }, // 表单示例
    { type: 'component', componentPath: 'tableHistory', attrs: {} }, // 组件引用示例
    /*html*/`<div>内容</div>`, // 自定义html内容示例
  ]
},
```