# pageType 属性文档

## 简介

`pageType` 是江湖JS框架中定义页面类型的关键属性，它决定了页面的基本渲染方式和行为模式。

## 可选值

| 值 | 描述 |
|---|---|
| `jh-page` | 标准PC端页面，适用于桌面Web应用 |
| `jh-mobile-page` | 移动端页面，适用于手机浏览器和微信等环境 |
| `jh-component` | 组件页面，可被其他页面引用的可复用组件 |

## 使用示例

```javascript
const content = {
  pageType: "jh-page",
  pageId: "demoPage",
  pageName: "示例页面",
  // ... 其他属性
};
```

## 注意事项

- 不同的 `pageType` 对应不同的前端模板和渲染逻辑
- 设置正确的 `pageType` 对确保页面正常渲染至关重要
- 移动端页面（`jh-mobile-page`）通常需要搭配适合移动端的UI组件使用 