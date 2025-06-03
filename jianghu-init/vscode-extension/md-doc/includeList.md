# includeList 引入列表

`includeList` 是一个用于引入外部组件、模板和资源的配置数组，它允许你在页面中引入各种类型的依赖项。

## 基本结构

```javascript
includeList: [
  // 对象形式引入示例：
  // @type: {string} 'html' | 'js' | 'css' | 'vueComponent'  // 必填
  // @path: {string} 'path/to/file'  
  // @component {string}
  // @includeType: {string} 'auto' | 'manual'
  // @attrs: {object} {} 
  
  { type: 'html', path: 'component/reportRecordCreator.html', includeType: 'auto', attrs: {} }, // type: html/include
  { type: 'js', path: '/<=$ ctx.app.config.appId $>/public/js/xxx.js' }, // type: js/javascript
  { type: 'vueUse', component: 'Vuetify' }, // cdn 引入后：Vue.use(Vuetify)
  { type: 'vueComponent', name: 's-table', component: '/' }, // cdn 引入后：Vue.component({name}, {component})

  "{% include 'path/to/file.html' %}",  // 原生字符串 njk 引入
  "<script src='/<=$ ctx.app.config.appId $>/public/js/xxx.js'></script>", // 原生 js 标签原生写法
  "<style src='/<=$ ctx.app.config.appId $>/public/css/xxx.css'></style>", // css 原生写法
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
