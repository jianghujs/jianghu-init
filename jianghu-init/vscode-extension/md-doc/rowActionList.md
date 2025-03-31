# rowActionList 行操作列表

`rowActionList` 用于定义表格中每一行的操作按钮列表，支持简写和完整配置两种方式，并且支持 PC 和移动端的自适应显示。

## 基本结构

```javascript
rowActionList: [
  {
    text: '操作名称',      // 按钮文本
    icon: '图标名称',      // 按钮图标
    color: '颜色',        // 按钮颜色
    click: '点击事件',     // 点击事件处理函数
    attrs: {},           // 按钮属性
    show: '显示条件'      // 显示条件
  }
]
```

## 简写方式

支持简写配置，自动适配 PC 和移动端：

```javascript
rowActionList: [
  { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
  { text: '删除', icon: 'mdi-delete', color: 'error', click: 'doUiAction("startDeleteItem", item)' }
]
```

## 完整配置

```javascript
rowActionList: [
  {
    text: '编辑',
    icon: 'mdi-note-edit-outline',
    color: 'success',
    click: 'doUiAction("startUpdateItem", item)',
    attrs: {
      small: true,
      class: 'mr-2'
    },
    show: 'item.statusType === "active"'
  }
]
```

## 属性说明

1. **基础属性**
   - `text`: 按钮显示的文本
   - `icon`: 按钮图标名称（Material Design Icons）
   - `color`: 按钮颜色主题
   - `click`: 点击事件处理函数

2. **扩展属性**
   - `attrs`: 按钮的额外属性配置
   - `show`: 按钮显示条件
   - `tooltip`: 按钮提示文本
   - `confirm`: 确认对话框配置

3. **移动端适配**
   - 自动折叠为图标按钮
   - 支持下拉菜单显示
   - 保持操作可访问性

## 示例

1. **基础操作按钮**
   ```javascript
   rowActionList: [
     { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
     { text: '删除', icon: 'mdi-delete', color: 'error', click: 'doUiAction("startDeleteItem", item)' }
   ]
   ```

2. **带确认的操作按钮**
   ```javascript
   rowActionList: [
     {
       text: '删除',
       icon: 'mdi-delete',
       color: 'error',
       click: 'doUiAction("startDeleteItem", item)',
       confirm: {
         title: '确认删除',
         content: '确定要删除这条记录吗？'
       }
     }
   ]
   ```

3. **条件显示的操作按钮**
   ```javascript
   rowActionList: [
     {
       text: '编辑',
       icon: 'mdi-note-edit-outline',
       color: 'success',
       click: 'doUiAction("startUpdateItem", item)',
       show: 'item.statusType === "active" && item.canEdit'
     }
   ]
   ```

4. **带提示的操作按钮**
   ```javascript
   rowActionList: [
     {
       text: '查看',
       icon: 'mdi-eye',
       color: 'info',
       click: 'doUiAction("viewItem", item)',
       tooltip: '查看详细信息'
     }
   ]
   ```

## 最佳实践

1. **按钮组织**
   - 按重要性排序
   - 保持操作一致性
   - 避免过多按钮

2. **交互设计**
   - 提供清晰反馈
   - 危险操作需确认
   - 保持操作可撤销

3. **移动端适配**
   - 优先显示重要操作
   - 保持操作可访问
   - 优化触摸区域

## 注意事项

1. **性能考虑**
   - 避免过多按钮
   - 优化条件判断
   - 注意事件处理

2. **安全性**
   - 权限控制
   - 数据验证
   - 操作确认

3. **用户体验**
   - 操作反馈
   - 状态提示
   - 错误处理

## 常见问题

1. **显示问题**
   - 条件判断不生效
   - 图标显示异常
   - 样式不一致

2. **交互问题**
   - 事件不触发
   - 确认框异常
   - 移动端适配问题

3. **权限问题**
   - 权限判断
   - 操作限制
   - 数据访问控制 