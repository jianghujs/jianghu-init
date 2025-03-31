# contentList 抽屉内容列表

`contentList` 用于定义抽屉（Drawer）组件中的内容列表，支持表单、组件和自定义内容三种类型，并且支持多标签页显示。

## 基本结构

```javascript
contentList: [
  {
    label: '标签页名称',    // 标签页标题
    type: 'form',         // 内容类型：form/component/custom
    formItemList: [],     // 表单项列表（type 为 form 时使用）
    componentPath: '',    // 组件路径（type 为 component 时使用）
    bind: {},            // 组件绑定属性
    action: []           // 操作按钮列表
  }
]
```

## 内容类型

1. **表单类型 (form)**
   ```javascript
   {
     label: "表单",
     type: "form",
     formItemList: [
       {
         label: "字段名",
         model: "fieldName",
         tag: "v-text-field",
         rules: "validationRules.requireRules"
       }
     ],
     action: [{
       tag: "v-btn",
       value: "保存",
       attrs: {
         color: "success",
         '@click': "doUiAction('createItem')"
       }
     }]
   }
   ```

2. **组件类型 (component)**
   ```javascript
   {
     label: "组件",
     type: "component",
     componentPath: 'component/customComponent',
     bind: {
       'v-model': 'componentValue',
       ':props': 'componentProps'
     }
   }
   ```

3. **自定义类型 (custom)**
   ```javascript
   {
     label: "自定义",
     type: "custom",
     value: /*html*/`
       <div class="custom-content">
         <h3>自定义内容</h3>
         <p>这里可以放置任何 HTML 内容</p>
       </div>
     `
   }
   ```

## 表单项配置

1. **基础属性**
   - `label`: 字段标签
   - `model`: 数据模型
   - `tag`: 组件标签
   - `rules`: 验证规则

2. **布局属性**
   ```javascript
   {
     cols: 12,    // 默认列宽
     sm: 6,       // 小屏幕列宽
     md: 4,       // 中等屏幕列宽
     colAttrs: {  // 列属性
       class: 'custom-class'
     }
   }
   ```

3. **特殊组件**
   - `v-date-picker`: 日期选择器
   - `v-time-picker`: 时间选择器
   - `jh-json-editor`: JSON 编辑器

## 示例

1. **多标签页表单**
   ```javascript
   contentList: [
     {
       label: "基本信息",
       type: "form",
       formItemList: [
         { label: "名称", model: "name", tag: "v-text-field", rules: "validationRules.requireRules" },
         { label: "描述", model: "description", tag: "v-textarea" }
       ]
     },
     {
       label: "高级设置",
       type: "form",
       formItemList: [
         { label: "日期", model: "date", tag: "v-date-picker" },
         { label: "时间", model: "time", tag: "v-time-picker" }
       ]
     }
   ]
   ```

2. **混合类型内容**
   ```javascript
   contentList: [
     {
       label: "表单",
       type: "form",
       formItemList: [
         { label: "用户名", model: "username", tag: "v-text-field" }
       ]
     },
     {
       label: "自定义组件",
       type: "component",
       componentPath: 'component/userSelector',
       bind: {
         'v-model': 'selectedUsers'
       }
     },
     {
       label: "自定义内容",
       type: "custom",
       value: /*html*/`
         <div class="custom-section">
           <h3>说明</h3>
           <p>这里是自定义的 HTML 内容</p>
         </div>
       `
     }
   ]
   ```

## 最佳实践

1. **内容组织**
   - 合理划分标签页
   - 相关字段分组
   - 保持结构清晰

2. **表单设计**
   - 必填项标记
   - 合理的验证规则
   - 清晰的字段标签

3. **组件使用**
   - 选择合适的组件
   - 合理配置属性
   - 注意组件性能

## 注意事项

1. **性能考虑**
   - 避免过多标签页
   - 优化表单验证
   - 注意组件加载

2. **用户体验**
   - 合理的表单布局
   - 清晰的错误提示
   - 友好的交互反馈

3. **数据管理**
   - 表单数据同步
   - 组件状态管理
   - 数据验证处理

## 常见问题

1. **表单问题**
   - 验证规则不生效
   - 数据绑定异常
   - 提交处理失败

2. **组件问题**
   - 组件加载失败
   - 属性绑定错误
   - 事件处理异常

3. **布局问题**
   - 响应式显示异常
   - 样式冲突
   - 布局错乱 