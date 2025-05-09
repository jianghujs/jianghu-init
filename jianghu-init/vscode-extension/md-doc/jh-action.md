## jh-action

操作按钮组件，用于在用户界面中展示浮动操作按钮。

### 示例
```javascript
{
  tag: 'jh-action',
  attrs: { class: 'h-16 w-16 p-2 fixed right-4 bottom-32' },
  actionList: [ 
    // 简写模式
    { tag: 'v-btn', value: '新增', icon: 'mdi-plus', color: 'success', click: "doUiAction('startCreateItem')" },
    // 自定义标签
    { tag: 'v-btn', value: '随机分配跟进人', attrs: {} },
    // html 模式
    /*html*/`<div>内容</div>`,
  ]
}

```
