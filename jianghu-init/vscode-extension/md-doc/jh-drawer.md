## jh-drawer 

自定义抽屉组件，用于在用户界面中展示自定义内容。(vuetify v-navigation-drawer 组件)

### 示例
```javascript
{
  tag: 'jh-drawer',  // 组件标签
  key: "custom",            // 唯一标识 默认变量：customItem isCustomDrawerShown   
  attrs: {},                // 抽屉 v-navigation-drawer 属性
  title: '标题',            // 抽屉标题
  headSlot: [             // 抽屉标题后插槽
    {tag: 'v-spacer'},
  ],
  contentList: [
    // label 多抽屉标签名
    { label: '抽屉1', type: 'form', formItemList: [], action: [] }, // 表单示例
    { label: '抽屉2', type: 'component', componentPath: 'tableHistory', attrs: {} }, // 组件引用示例
    /*html*/`<div>内容</div>`, // 自定义html内容示例
  ]
},
```