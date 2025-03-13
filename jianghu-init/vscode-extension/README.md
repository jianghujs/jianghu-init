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
npm install -g vsce
vsce package
```

## 许可证

MIT 