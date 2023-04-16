const config = {
    table: 'student',
    targetPageFile: 'studentManagment.html',
    basicFeature: {
        name: 'basic',
        enable: false,
        description: 'basic description',
        searchFields: [],
        // ... other config..
    },
    featureList: [
        {
            name: 'insert',
            enable: false,
            description: 'insert description',
            // ... other config..
        },{
            name: 'update',
            enable: false,
            description: 'update description',
            // ... other config..
        },{
            name: 'delete',
            enable: false,
            description: 'delete description',
            // ... other config..
        }
    ]
}


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
    



