## jh-list

列表组件，用于在用户界面中展示数据列表。

### 示例
```javascript
{
  tag: 'jh-list',
  props: {
    limit: 10, // 每页显示条数 默认10000
    rightArrowText: '', // 右侧箭头文本 默认空
    rightArrow: true, // 是否显示右侧箭头 默认true
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
        <v-icon color="warning" small>mdi-shield-star</v-icon>
        <span>干部</span>
      </div>
    `]},
  ],
  rowActionList: [ ], // 行操作按钮配置
},
```