# headContent

## 描述
页面头部配置，用于配置标题、面包屑条、服务端搜索、场景搜索等。

## 示例
```javascript
{
  headContent: [
    // 左侧页面标题
    { 
      tag: 'jh-page-title', 
      value: "我的任务", 
      attrs: { cols: 12, sm: 6, md:4 }, 
      helpBtn: true, 
      slot: [] 
    },
    // 服务端搜索组件
    { 
      tag: 'jh-search',
      searchList: [ // pc:value mobile:searchList
        { label: "搜索", model: "keyword", tag: "v-text-field", attrs: { prefix: '搜索：' } },
      ],
      searchBtn: true, // 仅pc
      data: {
        keyword: '', // 特殊搜索变量，支持多字段模糊搜索
        keywordFieldList: ['employeeName', 'contactNumber', 'institution', 'teachingSubject', 'post'], // 模糊字段列表
      }
    },
    // 场景搜索组件
    {
      tag: 'jh-scene',
      attrs: { ':showActionBtn': false, ':mobile': true },
      // v3 版本新增特性
      data: {
        sceneCreateForm: {}, // 默认创建表单
        currentSceneId: '全部', // 当前场景默认name
        defaultSceneList: [
          { name: "正式班", where: { classType: 'formal' } },
          { name: "过渡班", where: { classType: 'transition' } },
        ],
      }
    }
  ]
}
```

## 注意事项
- 确保 headContent 的值符合规范
- 参考示例正确配置
- 注意与其他属性的关联性
