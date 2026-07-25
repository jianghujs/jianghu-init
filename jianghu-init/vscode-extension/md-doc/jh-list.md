## jh-list

列表组件，用于在用户界面中展示数据列表（移动端卡片式）。

### 示例
```javascript
{
  tag: 'jh-list',
  props: {
    limit: 10, // 每页显示条数 默认10000
    rightArrowText: '', // 右侧箭头文本 默认空
    rightArrow: true, // 是否显示右侧箭头 默认true
    /**
     * mobileItemAction：item 整行点击（移动端专用）
     *   省略或 'sheet' → 内置 ActionSheet 预设（非 doUiAction case）
     *   false / 'none' → 整行点击不响应
     *   其他字符串     → doUiAction 方法名
     */
    mobileItemAction: false,
  },
  // 可自定义html容器属性
  attrs: { cols: 12, ':style': '`height: calc(100vh - 140px); overflow-y: auto;overscroll-behavior: contain`' },
  headers: [
    /**
     * 表头配置
     * text: 表头文本
     * value: 表头值
     * width: 表头宽度
     * isSimpleMode: 是否为简略模式列
     * isTitle: 是否为主标题
     * slot: 列内容插槽
     * formatter: 列渲染格式化
     */
    {text: "学生Id", value: "studentId", width: 80, isSimpleMode: true},
    {text: "姓名", value: "name", width: 90, isTitle: true,
      slot: [`
      <div v-if="item.isMonitor" class="ml-1">
        <jh-icon name="shield-star" :size="16" style="color:#fb8c00"></jh-icon>
        <span>干部</span>
      </div>
    `]},
  ],
  rowActionList: [
    // icon 使用 tabler 图标名（jh-icon），不使用 mdi-xxx
    { text: '编辑', icon: 'pencil', color: 'success', click: 'doUiAction("startUpdateItem", item)' },
    { text: '删除', icon: 'trash', color: 'error', click: 'doUiAction("deleteItem", item)' },
  ],
},
```
