# pageContent 页面内容

`pageContent` 是一个用于定义页面主体内容的配置数组，它支持灵活的组件嵌套和 HTML 模板混合使用。

## 基本结构

```javascript
pageContent: [
  {
    tag: '组件标签',        // 组件标签名
    attrs: {},            // 组件属性
    colAttrs: {},         // 栅格布局属性
    cardAttrs: {},        // 卡片属性
    value: '内容',         // 组件内容
    slots: []             // 插槽内容
  }
]
```

## 属性说明

1. **基础属性**
   - `tag`: 组件标签名，如 'jh-table', 'v-card' 等
   - `attrs`: 组件的属性配置对象
   - `colAttrs`: 栅格布局配置，如 `{ cols: 12, md: 6 }`
   - `cardAttrs`: 卡片组件的属性配置

2. **布局属性**
   ```javascript
   colAttrs: {
     cols: 12,    // 默认列宽
     sm: 6,       // 小屏幕列宽
     md: 4,       // 中等屏幕列宽
     lg: 3        // 大屏幕列宽
   }
   ```

3. **样式属性**
   ```javascript
   cardAttrs: {
     class: 'rounded-lg elevation-0',
     style: 'background-color: #f5f5f5'
   }
   ```

## value 内容扩展

1. **组件嵌套**
   ```javascript
   {
     tag: 'v-card',
     value: {
       tag: 'v-row',
       value: {
         tag: 'v-col',
         value: '内容'
       }
     }
   }
   ```

2. **HTML 模板**
   ```javascript
   {
     tag: 'v-card',
     value: /*html*/`
       <div class="d-flex align-center">
         <v-btn color="primary">按钮</v-btn>
         <v-spacer></v-spacer>
         <v-text-field label="搜索"></v-text-field>
       </div>
     `
   }
   ```

3. **混合使用**
   ```javascript
   {
     tag: 'v-card',
     value: [
       /*html*/`
         <div class="header">
           <h2>标题</h2>
         </div>
       `,
       {
         tag: 'v-row',
         value: {
           tag: 'v-col',
           value: '内容'
         }
       }
     ]
   }
   ```

## 示例

1. **表格组件**
   ```javascript
   {
     tag: 'jh-table',
     attrs: {},
     colAttrs: { clos: 12 },
     cardAttrs: { class: 'rounded-lg elevation-0' },
     headActionList: [
       { tag: 'v-btn', value: '新增', attrs: { color: 'success' } }
     ],
     headers: [
       { text: "任务编号", value: "reportTaskId", width: 80 }
     ],
     value: /*html*/`
       <template v-slot:item.statusType="{item}">
         <v-switch
           v-model="item.statusActive"
           :color="constantUtil.parseConstantText(item.statusType, 'reportStatusType', 'color')"
           dense
           hide-details
           class="mt-0 pt-0"
           :label="item.statusType | parseConstantText('reportStatusType')"
           @change="changeItemStatus(item)"
         ></v-switch>
       </template>
     `
   }
   ```

2. **表单组件**
   ```javascript
   {
     tag: 'v-form',
     attrs: { ref: 'form' },
     value: [
       {
         tag: 'v-text-field',
         attrs: {
           label: '用户名',
           rules: 'validationRules.requireRules'
         }
       },
       /*html*/`
         <v-btn color="primary" @click="submitForm">
           提交
         </v-btn>
       `
     ]
   }
   ```

## 最佳实践

1. **组件组织**
   - 合理使用组件嵌套
   - 保持结构清晰
   - 避免过度嵌套

2. **模板使用**
   - 合理使用 HTML 模板
   - 保持模板简洁
   - 注意模板性能

3. **属性管理**
   - 统一管理样式属性
   - 合理使用布局属性
   - 保持属性一致性

## 注意事项

1. **性能考虑**
   - 避免过深的组件嵌套
   - 合理使用模板
   - 注意渲染性能

2. **维护性**
   - 保持结构清晰
   - 合理组织代码
   - 及时清理无用代码

3. **兼容性**
   - 注意组件兼容性
   - 处理响应式布局
   - 考虑浏览器兼容性

## 常见问题

1. **渲染问题**
   - 处理动态渲染
   - 处理条件渲染
   - 处理列表渲染

2. **样式问题**
   - 处理样式冲突
   - 处理样式继承
   - 处理响应式样式

3. **交互问题**
   - 处理事件绑定
   - 处理数据同步
   - 处理状态管理
