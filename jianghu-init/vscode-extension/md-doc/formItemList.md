# formItemList 表单项目列表

`formItemList` 是一个用于定义表单中各个表单项的配置数组，它允许你详细配置每个表单项的属性、验证规则和布局。

## 基本结构

```javascript
formItemList: [
  {
    label: "标签名",
    labelClass: "label 类名", 
    model: "数据模型名",
    tag: "组件标签名",
    rules: "验证规则",
    attrs: {}, // 组件属性
    colAttrs: {}, // 布局属性
    default: "默认值",
    idGenerate: { prefix: "S", startValue: 10001, bizId: "schoolId" }, // 业务id(仅新增表单生效)
  }
]
```

注：idGenerate 生效需要有 insert resourceHook

```js
resourceHook: { 
  before: [
    {service:"common",serviceFunction:"generateBizIdOfBeforeHook"}  // 默认创建 common service
  ], 
},
```

## 配置项说明

1. **基础属性**

   - `label`: 表单项的标签文本
   - `model`: 绑定的数据模型名称
   - `tag`: 使用的组件标签名（如 v-text-field, v-select 等）
   - `default`: 默认值 仅支持字符串
2. **布局属性**

   - `colAttrs`: 栅格布局配置
     ```javascript
     colAttrs: { 
       cols: 12,  // 列宽
       md: 6,     // 中等屏幕下的列宽
       sm: 12     // 小屏幕下的列宽
     }
     ```
3. **组件属性**

   - `attrs`: 组件的具体属性配置
     ```javascript
     attrs: {
       placeholder: "请输入",
       dense: true,
       filled: true
     }
     ```
4. **验证规则**

   - `rules`: 表单验证规则
     ```javascript
     rules: "validationRules.requireRules"
     ```

## 示例

```javascript
formItemList: [
  {
    label: "任务名",
    model: "taskName",
    tag: "v-text-field",
    rules: "validationRules.requireRules"
  },
  {
    label: "周期",
    model: "periodType",
    tag: "v-select",
    attrs: { 
      items: "constantObj.reportPeriodType" 
    },
    default: "week",
    rules: "validationRules.requireRules"
  },
  {
    label: "备注",
    model: "taskDesc",
    tag: "v-textarea",
    attrs: { 
      placeholder: "请输入备注" 
    },
    colAttrs: { 
      md: 12 
    }
  }
]
```

## 支持的组件类型

1. **基础输入组件**

   - `v-text-field`: 文本输入框
   - `v-textarea`: 多行文本输入框
   - `v-select`: 下拉选择框
   - `v-switch`: 开关
   - `v-checkbox`: 复选框
   - `v-radio`: 单选框
2. **自定义组件**

   - `user-selector`: 用户选择器
   - `period-selector`: 周期选择器
   - 其他自定义组件

## 最佳实践

1. **布局建议**

   - 合理使用栅格系统
   - 保持表单布局的一致性
   - 考虑响应式设计
2. **验证规则**

   - 为必填项添加验证规则
   - 使用统一的验证规则管理
   - 提供清晰的错误提示
3. **组件选择**

   - 根据数据类型选择合适的组件
   - 考虑用户体验
   - 保持界面风格统一

## 注意事项

1. **数据绑定**

   - 确保 model 名称正确
   - 注意数据类型的匹配
   - 处理默认值的情况
2. **性能考虑**

   - 避免过多的表单项
   - 合理使用验证规则
   - 注意大表单的渲染性能
3. **兼容性**

   - 考虑不同浏览器的兼容性
   - 注意移动端的适配
   - 处理特殊字符和编码

