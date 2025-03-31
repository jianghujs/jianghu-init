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
  
  // 自定义组件
  {
    tag: 'custom-component',  // 自定义组件标签
    attrs: {},               // 组件属性
    content: '内容'          // 组件内容
  },
  
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
         formItemList: []
       }
     ]
   }
   ```

## 自定义组件

1. **基本结构**
   ```javascript
   {
     tag: 'custom-component',
     attrs: {
       prop1: 'value1',
       prop2: 'value2'
     },
     content: '组件内容'
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
     content: '执行操作'
   }
   ```

3. **带插槽的自定义组件**
   ```javascript
   {
     tag: 'custom-card',
     attrs: {
       title: '自定义卡片'
     },
     slots: [
       {
         name: 'header',
         content: '卡片头部'
       },
       {
         name: 'default',
         content: '卡片内容'
       }
     ]
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

## 最佳实践

1. **组件组织**
   - 按功能模块组织组件
   - 保持组件结构清晰
   - 合理使用系统预设组件

2. **自定义组件开发**
   - 遵循组件开发规范
   - 提供完整的属性文档
   - 实现必要的生命周期钩子

3. **性能优化**
   - 合理使用组件缓存
   - 避免不必要的重渲染
   - 优化组件加载顺序

## 注意事项

1. **组件属性**
   - 确保属性名称正确
   - 处理属性值的类型转换
   - 注意属性值的响应式

2. **事件处理**
   - 正确绑定事件处理器
   - 处理事件参数传递
   - 注意事件冒泡和阻止

3. **数据流**
   - 合理使用 props 和 events
   - 处理组件间的数据传递
   - 注意数据同步问题

## 常见问题

1. **组件通信**
   - 处理父子组件通信
   - 处理兄弟组件通信
   - 处理跨层级通信

2. **状态管理**
   - 处理组件状态
   - 处理全局状态
   - 处理状态持久化

3. **样式问题**
   - 处理样式隔离
   - 处理样式覆盖
   - 处理响应式样式
