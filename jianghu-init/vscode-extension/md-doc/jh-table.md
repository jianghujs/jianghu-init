## jh-table

列表组件，用于在用户界面中展示数据列表。

### 示例
```javascript
{
  tag: 'jh-table',
  props: {
    serverPagination: true  // 开启服务端分页、服务端分页默认 limit 50
  },
  attrs: {},  // 自定义 v-data-table 容器属性
  colAttrs: { class: 'rounded-lg elevation-0' }, // 容器 v-col 属性
  cardAttrs: { class: 'rounded-lg elevation-0' }, // 父容器 v-card 属性
  headActionList: [ // 头部操作按钮配置
    { tag: 'v-btn', value: '新增', attrs: { color: 'success', class: 'mr-2', '@click': 'doUiAction("startCreateItem")', small: true } },
    { tag: 'v-spacer' }
  ],
  headers: [ // headers 配置
    { text: "id", value: "id", width: 80, sortable: true, class: "fixed", cellClass: "fixed" },
    { text: "班级ID", value: "classId", width: 80, sortable: true },
  ],
  value: [ // v-table插槽
    // { tag: 'template', attrs: {'slot': 'body', 'slot-scope': "item"}, value: "<div>测试插槽</div>" },
    // { tag: 'template', attrs: {'slot': 'item.className', 'slot-scope': "{item, index}"}, value: "<div>{{item.className}}</div>" },
  ],
  showTableColumnSettingBtn: false, // 是否显示列设置按钮
  rowActionList: [
    { text: '编辑', icon: 'mdi-note-edit-outline', color: 'success', click: 'doUiAction("startUpdateItem", item)' }, // 简写支持 pc 和 移动端折叠
    { text: '删除', icon: 'mdi-trash-can-outline', color: 'error', click: 'doUiAction("deleteItem", item)' } // 简写支持 pc 和 移动端折叠
  ],
}

// showTableColumnSettingBtn 为 true 时，需要配置 columnSettingGroup 配置
common: {
  data: {
    columnSettingGroup: {
      '01模式': [
        "netName",
        "stage",
        "followUpDate",
      ],
      '02模式': [
        "netName",
        "stage",
        "duoxingRoomName",
      ],
      '03模式': [
        "netName",
        "orgId",
        "orgName",
      ],
    },
  }
}
```