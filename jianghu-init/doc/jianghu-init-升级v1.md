## page template config

### 协议设计v1

{
    "pageId": "studentManagement",                      // 可选，如果不填写则默认为`${table}Management`
    "pageType": "1table-page",                          // 必选，页面类型
    "table": "student",                                 // 必选，数据库表名
    "basicConfig": {                                    // 可选，基础配置
        "pageTitle": "页面标题",
        "helpPageEnable": true,
        "defaultSortField": {
            "field": "ID",
            "type": "desc"
        },

        "create": true,
        "update": true,
        "delete": true,
        
        // 支持两种风格
        "headSearch": ['id', 'name'],
        "headSearch": [
            {
                "field": "id",
                "name": "唯一标识"
            },
            {
                "field": "name",
                "name": "名称"
            }
        ],
    },
    fieldConfig: {                                       // 可选，字段配置
        tableIgnoreField: ['id', 'name', 'desc'],
        tableEnableField: ['id', 'name'],
        createFormIgnoreField: ['name'],
        updateFormIgnoreField: ['name'],

        customFieldList: [{
            "name": "ID",
            "field": "id",
            "backendSearch": false,
            "sort": false,
            "placeholder": "输入框提示语",
            "type": "v-text-field",
            "required": true,
            "rules": [
                v => !!v || '此项必填',
                v => !!v != 2 || '此项必须===2',
            ],
            "originProps": {
                rows: 1,
            },
        },
        {
            "name": "ID",
            "field": "id",
            "backendSearch": false,
            "sort": false,
            "placeholder": "输入框提示语",
            "type": "v-textarea",
            "required": true,
            "rules": [
                v => !!v || '此项必填',
                v => !!v != 2 || '此项必须===2',
            ],
            "originProps": {
                rows: 1,
            },
        },
        {
            "field": "id",
            "type": "v-select",
            "backendSearch": false,
            "sort": false,
            "clearable": false,
            "items": [{
                "text": "显示文本",
                "value": "值",
            }],
            "itemsApi": {
                pageId: 'appraisalPlanManagement',
                actionId: 'selectItemList',
                actionData: {},
                where: {},
                whereOrOptions: {},
            },
            "required": true,
            "rules": [
                v => !!v || '此项必填',
                v => !!v != 2 || '此项必须===2',
            ],
            "originProps": {
                rows: 1,
            },
        }],
    }
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







