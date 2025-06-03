# doUiAction UI 操作处理

`doUiAction` 是一个用于处理 UI 操作的方法配置对象，它允许你定义和配置各种 UI 操作的处理逻辑。

## 基本结构

```javascript
doUiAction: {
  // 普通示例
  actionName: ['method1', 'method2'],
  // doUiAction 调用简写
  actionName: ['doUiAction.method1'],
  // 异步示例
  actionName: ['async.prepareMethod', 'async.doUiAction.actionName']
}
```

## 配置说明

1. **普通示例**
   ```javascript
   doUiAction: {
     startCreateItem: ['prepareDoCreateItem', 'doUiAction("startCreateItem")']
   }
   ```

2. **异步示例**
   ```javascript
   doUiAction: {
     updateItem: ['prepareDoUpdateItem', 'async.doUiAction.updateItem']
   }
   ```

## 使用示例

1. **删除操作**
   ```javascript
   doUiAction: {
     startDeleteItem: ['startDeleteItem']
   },
   methods: {
     async startDeleteItem(item) {
       if (await window.confirmDialog({ 
         title: "删除任务", 
         content: `确定删除任务"${item.taskName}"吗？` 
       }) === false) {
         return;
       }
       const result = await window.jianghuAxios({
         data: {
           appData: {
             pageId: 'reportTaskManagement',
             actionId: 'deleteItem',
             actionData: {},
             where: { id: item.id }
           }
         }
       });
       window.vtoast.success('删除任务成功');
       this.doUiAction('getTableData');
     }
   }
   ```

2. **创建操作**
   ```javascript
   doUiAction: {
     startCreateItem: ['prepareDoCreateItem', 'doUiAction("startCreateItem")']
   },
   methods: {
     prepareDoCreateItem() {
       const { id, ...data } = this.createItem;
       // 数据验证
       if (!data.reporterIds || data.reporterIds.length === 0) {
         window.vtoast.fail("汇报人不能为空");
         return;
       }
       // 准备数据
       this.createActionData = {
         taskName: data.taskName,
         taskDesc: data.taskDesc,
         // ... 其他数据
       };
     }
   }
   ```

3. **更新操作**
   ```javascript
   doUiAction: {
     updateItem: ['prepareDoUpdateItem', 'doUiAction("updateItem")']
   },
   methods: {
     async prepareDoUpdateItem() {
       const {id, ...data} = this.updateItem;
       this.updateItemId = id;
       // 数据验证
       if (!data.deadlineTime || data.deadlineTime.length === 0) {
         window.vtoast.fail("汇报截止时间不能为空");
         return;
       }
       // 准备数据
       this.updateActionData = {
         taskName: data.taskName,
         taskDesc: data.taskDesc,
         // ... 其他数据
       };
     }
   }
   ```