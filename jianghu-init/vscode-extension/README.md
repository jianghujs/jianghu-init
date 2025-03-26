# 江湖初始化助手 VSCode 扩展

这是一个 VSCode 扩展，用于辅助使用 jianghu-init 并显示帮助文字。

## 功能

- 自动检查并安装 @jianghujs/jianghu-init
- 提供江湖项目创建向导
- 提供 CRUD 页面生成向导
- 在活动栏中提供江湖助手面板
- 在状态栏中提供快速访问按钮
- 提供详细的帮助文档
- 提供代码补全建议
- 提供代码片段
- 提供悬停提示
- **新功能：JSON模板文件代码补全和悬停提示**
- **新功能：项目中JSON文件属性文档查看**
- **新功能：从江湖官方网站加载最新文档**

## 安装

### 通过 npm 安装

如果你已经安装了 @jianghujs/jianghu-init，可以通过以下命令安装 VSCode 扩展：

```bash
# 全局安装
npm install -g @jianghujs/jianghu-init

# 安装 VSCode 扩展
npm run vscode:install -g @jianghujs/jianghu-init
```

### 从 VSCode 扩展市场安装

1. 打开 VSCode
2. 点击扩展图标或按下 `Ctrl+Shift+X`
3. 搜索 "江湖初始化助手"
4. 点击安装

### 手动安装

1. 下载最新的 `.vsix` 文件
2. 在 VSCode 中，点击扩展图标或按下 `Ctrl+Shift+X`
3. 点击 "..." 按钮，选择 "从 VSIX 安装..."
4. 选择下载的 `.vsix` 文件

## 使用方法

### 创建新项目

1. 点击活动栏中的江湖助手图标
2. 在命令面板中选择 "创建江湖项目"
3. 按照向导完成项目创建

### 生成 CRUD 页面

1. 打开一个江湖项目
2. 点击活动栏中的江湖助手图标
3. 在命令面板中选择 "生成 CRUD 页面"
4. 按照向导完成 CRUD 页面生成

### 查看帮助

1. 点击活动栏中的江湖助手图标
2. 在命令面板中选择 "显示江湖初始化助手帮助"
3. 或者点击状态栏中的江湖助手按钮

### 使用代码补全

1. 在 JavaScript 或 TypeScript 文件中输入 `jianghu.`
2. VSCode 会自动显示可用的方法，如 `createProject`、`generateCrud` 等
3. 选择需要的方法，按 Tab 或 Enter 键插入

### 使用代码片段

1. 在 JavaScript 或 TypeScript 文件中输入以下前缀之一：
   - `jianghu-project`：插入创建江湖项目的代码片段
   - `jianghu-crud`：插入生成 CRUD 页面的代码片段
   - `jianghu-import`：插入导入江湖初始化模块的代码片段
2. 按 Tab 键插入代码片段
3. 使用 Tab 键在代码片段中的占位符之间切换

### 使用悬停提示

1. 将鼠标悬停在以下关键词上，会显示相关的帮助信息：
   - `jianghu` 或 `jianghujs`
   - `jianghu-init`
   - `createProject`
   - `generateCrud`

### 使用JSON模板代码补全和悬停提示

在 `page-template-json` 或 `init-json` 目录下的 JavaScript 文件中，可以使用以下功能：

1. **代码补全**：
   - 在定义 `content` 对象时，会自动提示可用的预设key
   - 在 `resourceList` 数组中，会提示资源项的属性
   - 在 `resourceData` 对象中，会提示资源数据的属性
   - 在 `pageData` 对象中，会提示页面数据的属性
   - 在列配置对象中，会提示列的属性
   - 在文件开头，可以插入完整的CRUD模板

2. **悬停提示**：
   - 将鼠标悬停在预设key上，会显示相关说明
   - 支持的key包括：`pageType`、`pageId`、`pageName`、`resourceList`、`pageData`、`actionId`、`resourceType`、`resourceHook`、`desc`、`resourceData`、`table`、`operation`、`listColumnList`、`formColumnList`、`searchFormColumnList`、`title`、`dataIndex`、`componentType`、`formatType`等

3. **示例**：
   - 查看 `examples/template-example.js` 文件，了解如何使用这些功能

### 使用JSON文件属性文档查看

在使用该扩展的江湖项目中，您可以获取关于JSON属性的详细文档：

1. **行尾问号图标**：
   - 在 `/app/view/init-json/` 目录下的JS文件中
   - 属性名称旁边会显示一个问号"?"图标
   - 点击问号图标可以打开该属性的详细文档

2. **文档内容来源**：
   - **在线文档**：对于关键属性（如`pageType`、`resourceList`等），会从江湖官方网站加载最新的文档
   - **本地文档**：对于其他属性，会显示本地Markdown文档内容

3. **文档界面**：
   - 文档在单独的面板中显示，不影响代码编辑
   - 对于在线文档，提供"在浏览器中打开完整文档"链接
   - 支持所有标准Markdown格式和HTML内容

4. **示例**：
   - 查看 `examples/app/view/init-json/example.js` 文件，体验本地文档查看功能
   - 查看 `examples/app/view/init-json/jianghu-doc-example.js` 文件，体验在线文档查看功能

## 开发

### 构建扩展

```bash
cd vscode-extension
npm install
npm run compile
```

### 打包扩展

```bash
cd vscode-extension
npm install -g @vscode/vsce
vsce package
```

## 许可证

MIT