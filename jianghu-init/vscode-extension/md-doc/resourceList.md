# resourceList

## 描述
页面资源列表，包含 actionId、resourceType、resourceData 等配置。格式：
```json
{ actionId: '', resourceType: '', resourceData: {}, resourceHook: {}, desc: '' }
resourceHook: {before: 前置方法, after: 后置方法}
```
## 示例
```javascript
{
  "resourceList": [
    {
      "actionId": "selectItemList",
      "resourceType": "sql",
      "desc": "✅查询列表",
      "resourceData": { "table": "data_table", "operation": "select" },
      "resourceHook": { 
        "before": [{ "service": " serviceFile", "serviceFunction": "serviceMethod" }], 
        "after": [{"service": " serviceFile", "serviceFunction": "serviceMethod"}] 
      }
    },
    {
      "actionId": "insertItem",
      "resourceType": "service",
      "resourceHook": {},
      "desc": "✅功能说明",
      "resourceData": { "service": "serviceFile", "serviceFunction": "serviceMethod" }
    },
  ]
}
```

## 注意事项
- 确保 resourceList 的值符合规范
- 参考示例正确配置
- 注意与其他属性的关联性
