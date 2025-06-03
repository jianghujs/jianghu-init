# actionContent 操作内容

`actionContent` 是一个用于定义页面操作内容的配置数组，它允许你配置各种操作组件，包括系统预设的抽屉组件和自定义组件。

## 基本结构

```javascript
actionContent: [
  // 系统预设组件
  {
    tag: 'jh-create-drawer',  // 组件标签
    key: "create",            // 唯一标识
    attrs: {},               // 组件属性
    title: '标题',           // 组件标题
    contentList: []          // 内容列表
  },
  
  // 自定义标签
  {
    tag: 'div',               // 组件标签名
    attrs: { class: 'p-2' },  // 组件属性：{ vIf: 'p-2' } / { 'v-if': 'p-2' }
    quickAttrs: ['small'],    // 简写 attr 如：v-else small readonly
    value: '内容',             // 组件内容
  }
  
  // HTML 模板字符串
  /*html*/`
    <div>
      <v-btn @click="doUiAction('startCreateItem')">新增</v-btn>
    </div>
  `
]
```

## 系统预设组件

1. **创建抽屉 (jh-create-drawer)**
   ```javascript
   {
     tag: 'jh-create-drawer',
     key: "create",
     attrs: {},
     title: '新增任务设置',
     isCheckFormBeforeClose: true,
     onCheckFormConfirm: "doUiAction('createItem')",
     contentList: [
       {
         label: "新增",
         type: "form",
         formItemList: []
       }
     ]
   }
   ```

2. **更新抽屉 (jh-update-drawer)**
   ```javascript
   {
     tag: 'jh-update-drawer',
     key: "update",
     attrs: {},
     title: '编辑任务设置',
     isCheckFormBeforeClose: true,
     onCheckFormConfirm: "doUiAction('updateItem')",
     contentList: [
       {
         label: "详情",
         type: "form",
         formItemList: [],
         action: []
       }
     ]
   }
   ```

## 自定义组件

1. **基本结构**
   ```javascript
    {
      tag: 'div',               // 组件标签名
      attrs: { class: 'p-2' },  // 组件属性：{ vIf: 'p-2' } / { 'v-if': 'p-2' }
      quickAttrs: ['small'],    // 简写 attr 如：v-else small readonly
      value: '内容',             // 组件内容
    }
   ```

2. **带事件处理的自定义组件**
   ```javascript
   {
     tag: 'custom-action-button',
     attrs: {
       color: 'primary',
       '@click': 'handleCustomAction'
     },
     value: '执行操作'
   }
   ```

## HTML 模板字符串

1. **基本按钮**
   ```javascript
   /*html*/`
     <v-btn @click="doUiAction('startCreateItem')">新增</v-btn>
   `
   ```

2. **带样式的组件**
   ```javascript
   /*html*/`
     <div class="d-flex align-center">
       <v-btn color="primary" class="mr-2">按钮1</v-btn>
       <v-btn color="secondary">按钮2</v-btn>
     </div>
   `
   ```

3. **复杂布局**
   ```javascript
   /*html*/`
     <v-card class="pa-4">
       <v-row>
         <v-col cols="6">
           <v-text-field label="输入框"></v-text-field>
         </v-col>
         <v-col cols="6">
           <v-select label="选择框"></v-select>
         </v-col>
       </v-row>
     </v-card>
   `
   ```
