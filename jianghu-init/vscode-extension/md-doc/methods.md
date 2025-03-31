# methods 方法配置

`methods` 是一个用于定义页面方法的配置对象，它允许你定义各种业务逻辑处理方法。在系统中，你可以通过定义同名方法来覆盖预设的方法。

## 方法覆盖机制

1. **基本说明**
   - 系统预设了一些基础方法
   - 可以通过定义同名方法来覆盖预设方法
   - 覆盖后的方法会优先执行

2. **覆盖示例**
   ```javascript
   methods: {
     // 覆盖预设的 getTableData 方法
     async getTableData() {
       // 自定义的数据获取逻辑
       const result = await window.jianghuAxios({
         data: {
           appData: {
             pageId: 'reportTaskManagement',
             actionId: 'selectItemList',
             actionData: {}
           }
         }
       });
       this.tableDataFromBackend = result.data.appData.resultData.rows;
       this.formatTableData();
     }
   }
   ```

3. **注意事项**
   - 确保覆盖方法时保持原有的功能
   - 注意处理异步操作
   - 保持方法命名的一致性

## 常见可覆盖的方法

1. **数据操作相关**
   - `getTableData`: 获取表格数据
   - `formatTableData`: 格式化表格数据
   - `prepareDoCreateItem`: 准备创建数据
   - `prepareDoUpdateItem`: 准备更新数据

2. **UI 操作相关**
   - `startDeleteItem`: 开始删除操作
   - `startCreateItem`: 开始创建操作
   - `updateItem`: 更新操作
   - `changeItemStatus`: 修改项目状态

3. **工具方法**
   - `fetchUsers`: 获取用户列表
   - `formatUserNames`: 格式化用户名
   - `handleCustomAction`: 处理自定义操作 