# Jianghu 配置 Schema 文档

本文档详细说明了 Jianghu 配置文件的 JSON Schema 结构。该 schema 用于验证js内的格式定义规范：

1. js文件的两种写法
```javascript
// 格式1
module.exports = {
  // 配置内容
}

// 格式2
const content = {
  // 配置内容
};
module.exports = content;
```

2. 验证内容：

- 对读取到的 {} 内的所有 js json格式的字符串进行验证

验证规则如下：

## 基本结构

配置对象字段检查：

| 属性 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| pageType | string | ✅ | 页面类型，可选值为jh-page、jh-mobile-page、jh-component、 |
| pageId | string | ✅ | 页面唯一标识 |
| template | string | 否 | 模版 |
| version | string | 否 | 版本 (目前支持设定v2、v3) |
| resourceList | array | 否 |  |
| headContent | array | ✅ | 面包屑 |
| pageContent | array | ✅ | 页面主体内容 |
| actionContent | array | ✅ | 触发内容（抽屉、弹窗、遮罩层等） |
| includeList | array | ✅ | 页面引入资源 { type, path } |
| common | object | ✅ | 变量、方法 |
| style | string | 否 | 、 |


## 字段说明

### 1. pageType
- **类型**: string
- **必需**: 是
- **枚举值**:
  - `jh-page`: 普通页面
  - `jh-mobile-page`: 移动端页面
  - `jh-component`: 组件
- **描述**: 指定页面的类型

### 2. pageId
- **类型**: string
- **必需**: 是
- **格式**: 必须以字母开头，只能包含字母、数字和下划线
- **示例**: `userList`, `orderDetail`
- **描述**: 页面的唯一标识符

### 3. template
- **类型**: string
- **必需**: 否
- **描述**: 页面使用的模板
- **示例**: `jhTemplateV4`

### 4. version
- **类型**: string
- **必需**: 否
- **描述**: 版本号，目前支持设定v2、v3
- **枚举值**: `v2`, `v3`, `v4`

### 5. resourceList
- **类型**: array
- **必需**: 否
- **元素类型**: resource 对象

#### 5.1 资源对象 (resource)
- **必需字段**:
  - `actionId`: 操作ID（格式同 pageId）
  - `resourceType`: 资源类型
    - 可选值: `sql`, `service`
  - `resourceData`: 
    - resourceType `sql`: 
      - `table`: 表名（最小长度1）
      - `operation`: 操作类型
        - 可选值: `select`, `jhInsert`, `jhUpdate`, `jhDelete`, `insert`, `update`, `delete`
    - resourceType `service`: 
      - `service`: 服务名称（最小长度1）
      - `serviceFunction`: 服务方法（最小长度1）

### 6. headContent
- **类型**: array
- **必需**: 是
- **元素类型**: headContent 对象
- **描述**: 页面头部内容，通常包含面包屑导航

### 7. pageContent
- **类型**: array
- **必需**: 是
- **描述**: 页面主体内容

### 8. actionContent
- **类型**: array
- **必需**: 是
- **描述**: 触发内容，包括抽屉、弹窗、遮罩层等

### 9. includeList
- **类型**: array
- **必需**: 是
- **元素类型**: include 对象
- **描述**: 页面引入的资源列表

#### 9.1 引入资源对象 (include)
- **必需字段**:
  - `type`: 资源类型
  - `path`: 资源路径

### 10. common
- **类型**: object
- **必需**: 是
- **描述**: 页面中使用的变量和方法

### 11. style
- **类型**: string
- **必需**: 否
- **描述**: 页面样式定义

