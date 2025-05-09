## jh-search

搜索组件，用于在用户界面中服务端搜索。

### 示例
```javascript
{ 
  tag: 'jh-search',
  searchList: [ // pc:value mobile:searchList
    { label: "搜索", model: "keyword", tag: "v-text-field", attrs: { prefix: '搜索：' } },
  ],
  searchBtn: true, // 仅pc
  data: {
    keyword: '', // 特殊搜索变量，支持多字段模糊搜索
    keywordFieldList: ['employeeName', 'contactNumber'], // 模糊字段列表
  }
},
```
