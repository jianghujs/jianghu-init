# dataExpression 数据表达式

`dataExpression` 是一个用于定义动态数据表达式的配置对象，它允许你在页面中定义一些需要动态计算的数据属性。

## 基本结构

```javascript
dataExpression: {
  // 键值对形式，key 是属性名，value 是表达式字符串
  propertyName: 'expression'
}
```

## 示例

```javascript
dataExpression: {
  isMobile: 'window.innerWidth < 500',
  constantObj: 'window.constantObj'
}
```

## 使用说明

1. **表达式格式**
   - 表达式必须是有效的 JavaScript 表达式字符串
   - 表达式会在运行时被求值
   - 可以使用全局对象（如 `window`）和全局变量

2. **常见用途**
   - 响应式数据计算
   - 全局对象引用
   - 条件判断
   - 动态属性计算

3. **注意事项**
   - 表达式应该是安全的，避免使用可能造成副作用的代码
   - 表达式应该返回预期的数据类型
   - 建议使用简单的表达式，复杂的逻辑应该在 methods 中处理

## 实际应用示例

1. **响应式布局判断**
```javascript
dataExpression: {
  isMobile: 'window.innerWidth < 500'
}
```

2. **全局常量引用**
```javascript
dataExpression: {
  constantObj: 'window.constantObj'
}
```

3. **动态计算属性**
```javascript
dataExpression: {
  fullName: 'firstName + " " + lastName',
  isActive: 'status === "active"'
}
```

## 最佳实践

1. 保持表达式简单清晰
2. 避免在表达式中进行复杂计算
3. 优先使用 Vue 的 computed 属性处理复杂逻辑
4. 确保表达式中使用的变量和对象都是可用的
5. 注意表达式的性能影响

## 与 computed 的区别

- `dataExpression` 主要用于简单的动态数据绑定
- `computed` 用于更复杂的计算逻辑和响应式数据处理
- `dataExpression` 的表达式是字符串，而 `computed` 是函数
- `computed` 支持缓存，而 `dataExpression` 每次访问都会重新计算 