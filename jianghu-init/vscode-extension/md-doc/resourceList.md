# resourceList 资源列表

> ⚠️ **重要警告**
> 
> 此配置会覆盖数据库中的配置，因此：
> - 不要在数据库中手动修改这些配置
> - 所有修改都应该通过此配置文件进行
> - 数据库中的配置会被此配置覆盖

`resourceList` 是一个用于定义页面资源操作的配置数组，它允许你配置各种资源操作，包括 SQL 操作、服务调用等。

## 基本结构

```javascript
resourceList: [
  {
    actionId: "操作ID",           // 操作的唯一标识
    resourceType: "资源类型",      // 资源类型（sql/service）
    desc: "操作描述",             // 操作描述
    resourceData: {},            // 资源数据
    resourceHook: {}             // 资源钩子（可选）
  }
]
```

## 资源类型

1. **SQL 操作 (sql)**
   ```javascript
   {
     actionId: "selectItemList",
     resourceType: "sql",
     desc: "✅查询列表",
     resourceData: { 
       table: "表名", 
       operation: "操作类型" 
     }
   }
   ```

2. **服务调用 (service)**
   ```javascript
   {
     actionId: "insertItem",
     resourceType: "service",
     resourceHook: {},
     desc: "✅添加",
     resourceData: { 
       service: "服务名", 
       serviceFunction: "服务方法" 
     }
   }
   ```

## 示例

```javascript
resourceList: [
  {
    actionId: "selectItemList",
    resourceType: "sql",
    desc: "✅查询列表",
    resourceData: { 
      table: "report_task", 
      operation: "select" 
    }
  },
  {
    actionId: "insertItem",
    resourceType: "service",
    resourceHook: {},
    desc: "✅添加",
    resourceData: { 
      service: "report", 
      serviceFunction: "addReportTask" 
    }
  },
  {
    actionId: "updateItem",
    resourceType: "sql",
    desc: "✅更新", 
    resourceData: { 
      table: "report_task", 
      operation: "jhUpdate" 
    }
  },
  {
    actionId: "deleteItem",
    resourceType: "sql",
    desc: "✅删除",
    resourceData: { 
      table: "report_task", 
      operation: "jhDelete" 
    }
  }
]
```

## 配置项说明

1. **actionId**
   - 操作的唯一标识符
   - 用于在代码中引用该操作
   - 建议使用有意义的名称

2. **resourceType**
   - `sql`: SQL 数据库操作
   - `service`: 服务方法调用
   - 其他自定义类型

3. **desc**
   - 操作的描述信息
   - 用于显示和文档说明
   - 建议使用清晰的中文描述

4. **resourceData**
   - SQL 操作配置
     ```javascript
     {
       table: "表名",
       operation: "操作类型"  // select/insert/update/delete
     }
     ```
   - 服务调用配置
     ```javascript
     {
       service: "服务名",
       serviceFunction: "服务方法"
     }
     ```

5. **resourceHook**
   - 资源操作的钩子函数
   - 用于自定义处理逻辑
   - 可选配置项

## 最佳实践

1. **命名规范**
   - 使用清晰的 actionId
   - 保持命名的一致性
   - 使用有意义的描述

2. **资源组织**
   - 按功能模块组织资源
   - 保持资源列表的整洁
   - 避免重复配置

3. **错误处理**
   - 合理使用 resourceHook
   - 处理异常情况
   - 提供错误反馈

## 注意事项

1. **SQL 操作**
   - 确保表名正确
   - 注意操作权限
   - 处理数据安全

2. **服务调用**
   - 确保服务存在
   - 注意方法参数
   - 处理调用异常

3. **性能考虑**
   - 优化查询性能
   - 合理使用缓存
   - 避免频繁调用

## 常见问题

1. **权限问题**
   - 处理操作权限
   - 处理数据权限
   - 处理访问控制

2. **数据同步**
   - 处理数据一致性
   - 处理并发操作
   - 处理事务管理

3. **错误处理**
   - 处理网络错误
   - 处理业务错误
   - 处理系统错误
