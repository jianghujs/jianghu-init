# prepareDoCreateItem 方法文档

## 简介

`prepareDoCreateItem` 是江湖JS框架中用于在创建数据前处理表单数据的钩子方法。当用户点击表单的提交按钮时，系统会先调用此方法处理表单数据，然后再发送到后端。

## 功能

- 处理创建表单的数据
- 格式化数据字段
- 添加额外字段
- 转换数据类型
- 执行表单数据的前置验证

## 典型用例

```javascript
prepareDoCreateItem() {
  const {id, ...data} = this.createItem;
  this.createActionData = {
    // 基本字段
    name: data.name,
    type: data.type,
    status: data.status,
    
    // 处理特殊格式
    config: JSON.stringify(data.config),
    
    // 处理日期
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    
    // 添加固定值
    createdBy: this.userInfo.username
  };
}
```

## 参数说明

| 变量 | 描述 |
|---|---|
| `this.createItem` | 表单收集的原始数据对象 |
| `this.createActionData` | 处理后将发送到后端的数据对象 |

## 注意事项

- 此方法必须设置 `this.createActionData` 值
- JSON 类型的字段需要使用 `JSON.stringify()` 转换
- 复杂对象或数组需要特殊处理
- 可以在此方法中添加额外的前端验证逻辑
- 如果字段名包含点号（.）或方括号（[]），需要特殊处理

## 相关方法

- `prepareCreateItem`: 打开创建表单前准备数据
- `prepareDoUpdateItem`: 处理更新表单数据 