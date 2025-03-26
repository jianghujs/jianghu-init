# resourceList 属性文档

## 简介

`resourceList` 是江湖JS框架中定义页面资源的核心属性，它包含了页面所需的所有数据资源和操作。通过resourceList，页面可以与后端API进行交互，获取和提交数据。

## 格式

`resourceList` 是一个数组，每个元素定义一个资源项，具有以下结构：

```javascript
{
  actionId: "操作ID",
  resourceType: "资源类型",
  resourceHook: {
    // 钩子函数
  },
  desc: "操作描述",
  resourceData: {
    // 资源具体数据
  }
}
```

## 常用属性说明

| 属性 | 描述 |
|---|---|
| `actionId` | 操作的唯一标识符，前端通过此ID调用后端接口 |
| `resourceType` | 资源类型，如 'sql'（数据库操作）、'service'（服务调用）等 |
| `resourceHook` | 资源的前置和后置处理钩子函数 |
| `desc` | 资源的描述信息，便于开发和维护 |
| `resourceData` | 资源的具体数据配置，如表名、操作类型等 |

## 常见资源类型

### SQL 类型资源

```javascript
{
  actionId: "selectItemList",
  resourceType: "sql",
  resourceHook: {},
  desc: "查询列表",
  resourceData: {
    table: "table_name",
    operation: "select"
  }
}
```

### 服务类型资源

```javascript
{
  actionId: "callService",
  resourceType: "service",
  resourceHook: {},
  desc: "调用服务",
  resourceData: {
    serviceName: "demoService",
    serviceFunction: "demoFunction",
    functionParams: {}
  }
}
```

## 注意事项

- `actionId` 在同一个页面中必须唯一
- 合理组织 `resourceList`，避免过于冗长
- 使用有意义的 `desc` 描述资源的用途，便于团队协作
- 根据业务需求选择合适的 `resourceType` 