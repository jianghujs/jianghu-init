# includeList 引入列表

`includeList` 是一个用于引入外部组件、模板和资源的配置数组，它允许你在页面中引入各种类型的依赖项。

## 基本结构

```javascript
includeList: [
  // 原生 njk 引入
  "{% include 'path/to/file.html' %}",
  // js 原生写法
  "<script src='/<=$ ctx.app.config.appId $>/public/js/xxx.js'></script>",
  // css 原生写法
  "<style src='/<=$ ctx.app.config.appId $>/public/css/xxx.css'></style>",
  
  // 对象形式引入
  {
    type: 'html',           // 资源类型 html/js/css/vueComponent
    path: 'path/to/file',   // 文件路径
    includeType: 'auto',    // 引入类型
    attrs: {}              // 组件属性
  }
]
```

## 配置项说明

1. **字符串形式**
   - 使用模板语法直接引入文件
   - 适用于简单的模板引入
   - 格式：`"{% include 'path/to/file.html' %}"`

2. **对象形式**
   - `type`: 资源类型
     - `html`: HTML 模板
     - `js`: JavaScript 文件
     - `css`: CSS 样式文件
     - `vueComponent`: Vue 组件
   
   - `path`: 文件路径
     - 相对于项目根目录的路径
     - 支持相对路径和绝对路径
   
   - `includeType`: 引入类型
     - `auto`: 自动引入
     - `manual`: 手动引入
   
   - `attrs`: 组件属性
     - 当引入 Vue 组件时配置组件属性
     - 支持 Vue 的所有属性配置

## 示例

```javascript
includeList: [
  // njk 原生写法
  "{% include 'component/userSelector.html' %}",
  
  // js 原生写法
  "<script src='/<=$ ctx.app.config.appId $>/public/js/xxx.js'></script>",
  
  // css 原生写法
  "<style src='/<=$ ctx.app.config.appId $>/public/css/xxx.css'></style>",
  
  
  // 引入报告记录创建器组件
  {
    type: 'html',
    path: 'component/reportRecordCreator.html',
    includeType: 'auto',
    attrs: {
      ref: 'reportRecordCreator',
      'v-model': 'isCreatorShown',
      ':user-list': 'userList',
      '@created': 'getTableData()'
    }
  },
  
  // 引入报告周期项目编辑器组件
  {
    type: 'html',
    path: 'component/reportPeriodItemEditor.html',
    includeType: 'auto',
    attrs: {
      ref: 'reportPeriodItemEditor',
      'v-model': 'isEditorShown',
      ':review-type': 'reviewType',
      ':report-record': 'currentRecord',
      ':user-list': 'userList'
    }
  }
]
```

## 常见引入类型

1. **组件引入**
   - 自定义组件
   - 第三方组件
   - 业务组件

2. **工具引入**
   - 工具函数
   - 常量定义
   - 混入（Mixins）

3. **样式引入**
   - CSS 文件
   - SCSS 文件
   - 样式模块

## 最佳实践

1. **组织管理**
   - 按功能模块组织引入文件
   - 保持引入顺序的一致性
   - 避免重复引入

2. **性能优化**
   - 按需引入组件
   - 合理使用异步加载
   - 避免引入不必要的资源

3. **维护建议**
   - 使用清晰的命名规范
   - 保持文件结构清晰
   - 及时清理未使用的引入

## 注意事项

1. **路径处理**
   - 确保路径正确
   - 注意路径大小写
   - 处理相对路径和绝对路径

2. **依赖关系**
   - 注意引入顺序
   - 处理循环依赖
   - 确保依赖完整性

3. **组件属性**
   - 正确配置组件属性
   - 处理数据绑定
   - 注意事件处理

## 常见问题

1. **加载问题**
   - 处理文件不存在的情况
   - 处理加载失败的情况
   - 处理异步加载超时

2. **冲突处理**
   - 处理命名冲突
   - 处理样式冲突
   - 处理全局变量冲突

3. **性能问题**
   - 处理大量引入的性能影响
   - 优化加载顺序
   - 处理缓存策略
