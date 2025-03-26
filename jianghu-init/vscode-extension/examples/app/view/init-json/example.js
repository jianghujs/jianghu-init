/**
 * 江湖初始化助手 - JSON文件示例
 * 
 * 此文件演示了如何使用江湖初始化助手的文档查看功能
 * 在编辑此文件时，您可以看到属性旁边的问号"?"，点击可查看相关文档
 */

// 创建一个内容对象，用于定义页面模板
const content = {
  pageType: "jh-page",
  pageId: "demoPage",
  pageName: "示例页面",
  
  // 资源列表
  resourceList: [
    {
      actionId: "selectItemList",
      resourceType: "sql",
      resourceHook: {},
      desc: "查询列表",
      resourceData: {
        table: "table_name",
        operation: "select"
      }
    }
  ],
  
  // 页面数据 
  pageData: {
    // 页面配置
  }
};

// 公共方法
const common = {
  data() {
    return {
      // 数据
    };
  },
  
  methods: {
    // 准备创建数据方法
    prepareDoCreateItem() {
      const {id, ...data} = this.createItem;
      this.createActionData = {
        // 创建数据
      };
    }
  }
};

// 导出内容对象
module.exports = {
  content,
  common
}; 