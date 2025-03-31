# idGenerate 配置说明

用于配置自增ID的生成规则。

## 属性说明

| 属性名 | 类型 | 必填 | 说明 |
|-------|------|------|------|
| prefix | string | 是 | ID前缀，例如 'RW' |
| type | string | 是 | ID生成类型，目前支持 'idSequence' |
| bizId | string | 是 | 业务ID标识，用于区分不同业务 |
| tableName | string | 是 | 关联的数据表名 |
| startValue | number | 否 | 起始值，默认为 1000 |

## 示例

```javascript
idGenerate: {
  prefix: 'RW',
  type: 'idSequence',
  bizId: 'reportTaskId',
  tableName: 'report_task',
  startValue: 1000
}
```

## 说明
- ID生成器会按照配置规则生成唯一的自增ID
- 生成的ID格式为：`${prefix}${自增数字}`
- 自增数字从 startValue 开始递增
- 每个 bizId 都会独立计数 