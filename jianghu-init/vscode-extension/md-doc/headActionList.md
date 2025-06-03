# headActionList

表格头部操作按钮列表配置。用于在表格上方添加操作按钮、搜索框等控件。

## 配置格式

```javascript
// 容器 v-row
headActionList: [
  // custom tag
  { tag: 'v-btn', value: '按钮文本', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("actionName")' }, quickAttrs: ['small'] },
  
  // 分隔符
  { tag: 'v-spacer' },
  
  // HTML 字符串
  /*html*/`
    <v-col cols="12" sm="6" md="3" xs="8" class="pa-0">
      <v-text-field prefix="筛选" v-model="searchInput" dense filled single-line></v-text-field>
    </v-col>
  `
]
```

## 支持的配置项

### 按钮配置
- `tag`: 组件标签名称，如 'v-btn'
- `value`: 按钮显示的文本
- `attrs`: 按钮属性对象
  - `color`: 按钮颜色，支持 'success'、'error'、'warning' 等
  - `class`: CSS类名
  - `@click`: 点击事件处理函数
- `quickAttrs`: 快速属性数组，用于设置常用属性

### 分隔符
使用 `{ tag: 'v-spacer' }` 在按钮之间添加弹性间距

### HTML模板
可以直接使用HTML模板字符串，支持所有Vuetify组件

## 示例

```javascript
headActionList: [
  // 新增按钮
  { 
    tag: 'v-btn', 
    value: '新增', 
    attrs: { 
      color: 'success', 
      class: 'mr-2',
      '@click': 'doUiAction("startCreateItem")'
    },
    quickAttrs: ['small']
  },
  
  // 间距
  { tag: 'v-spacer' },
  
  // 搜索框
  /*html*/`
  <v-col cols="12" sm="6" md="3" xs="8" class="pa-0">
    <v-text-field 
      prefix="筛选" 
      v-model="searchInput" 
      class="jh-v-input" 
      dense 
      filled 
      single-line
    ></v-text-field>
  </v-col>
  `
]
``` 