# isCheckFormBeforeClose 表单关闭前检查

`isCheckFormBeforeClose` 是一个用于控制表单关闭前是否需要进行检查的配置项。当设置为 `true` 时，在关闭表单（如抽屉、对话框等）之前会触发检查逻辑。

## 基本用法

```javascript
{
  tag: 'jh-create-drawer',  // 或其他表单组件
  isCheckFormBeforeClose: true,
  onCheckFormConfirm: "doUiAction('createItem')"
}
```

## 功能说明

1. **作用**
   - 防止用户误操作导致表单数据丢失
   - 确保表单数据的完整性和正确性
   - 提供更好的用户体验

2. **工作流程**
   - 当用户尝试关闭表单时
   - 如果 `isCheckFormBeforeClose` 为 `true`
   - 系统会触发 `onCheckFormConfirm` 指定的方法
   - 根据检查结果决定是否允许关闭

3. **使用场景**
   - 创建表单
   - 编辑表单
   - 需要数据验证的表单
   - 包含重要信息的表单

## 示例

```javascript
{
  tag: 'jh-create-drawer',
  key: "create",
  attrs: {},
  title: '新增任务设置',
  isCheckFormBeforeClose: true,
  onCheckFormConfirm: "doUiAction('createItem')",
  contentList: [
    // 表单内容
  ]
}
```

## 注意事项

1. **配置要求**
   - 需要配合 `onCheckFormConfirm` 使用
   - `onCheckFormConfirm` 应该返回一个布尔值或 Promise
   - 返回 `true` 或 Promise resolve 时允许关闭
   - 返回 `false` 或 Promise reject 时阻止关闭

2. **最佳实践**
   - 在重要的表单操作中启用此功能
   - 确保检查逻辑清晰明确
   - 提供适当的用户反馈
   - 避免过于复杂的检查逻辑

3. **常见问题**
   - 检查逻辑执行时间过长可能影响用户体验
   - 需要确保检查逻辑的可靠性
   - 注意处理异步操作的情况

## 与其他配置的关系

- `onCheckFormConfirm`: 指定检查逻辑的执行方法
- `contentList`: 表单的具体内容配置
- `attrs`: 组件的属性配置
