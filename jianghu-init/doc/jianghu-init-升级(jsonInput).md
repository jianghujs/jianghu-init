## page template config

```html
{
    table: 'student',
    targetPageFile: 'studentManagement.html',

    type: '1table-page',
    description: 'crud description',
    basicConfig: {
        tableFields: [], tableIgnoreFields: [],tableSortFields: [],
        headSearch: [
            { type: 'input', vueDataItem: 'search.garde', width: '120px', label: '年纪' },
            { type: 'search', text: '查询' }
        ]
    },
    featureList: [
        { name: 'insert', enable: false, description: 'insert description' },
        { name: 'update', enable: false, description: 'update description' },
        { name: 'delete', enable: false, description: 'delete description' },
    ]    
}
```

## html 结构

- html
    - 基础html
        - 新增按钮
        - 修改按钮
        - 删除按钮
    - 新增html
    - 编辑html
    - 删除html
- vueData
    - 基础vueData
    - 新增vueData
    - 编辑vueData
    - 删除vueData
- vueMethod
    - doUiAction
        - 基础uiAction
        - 新增uiAction
        - 编辑uiAction
        - 删除uiAction
    - 基础uiActionFunc 
    - 新增uiActionFunc
    - 编辑uiActionFunc
    - 删除uiActionFunc
    
## feature 实现方案


> 以crud为例
- basicFeature
    - 决定了基础html排版
- featureList
    - 是否开启某些特性







