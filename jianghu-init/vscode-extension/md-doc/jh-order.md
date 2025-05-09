## jh-order

排序组件，用于在用户界面中排序。

### 示例
```javascript
{ 
  tag: 'jh-order',  // 仅 jh-mobile-page 使用
  data: {           // v3+ 版本新增特性
    tableDataOrder: [],
    tableDataOrderList: [],
  }
} 

// only v3+ default data
const defaultData = {
  tableDataOrder: [{ column: 'operationAt', order: 'desc' }],
  tableDataOrderList: [
    { text: '最新更新↓', value: [{ column: 'operationAt', order: 'desc' }] },
  ],
};
```
