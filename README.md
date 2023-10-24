# Jianghu init

## 目录结构

- jianghu-init 初始化工具项目，可全局安装               注意：npm install 比较慢; 可以切换成 yarn install。
- jianghu-init-config 保存模板配置的项目，纯配置项目
- demo 本地测试项目，用于生成 boilerplate 模板项目
- boilerplates 保存不同 type 的模板项目，由 demo 生成
- dev-scripts 提供一些开发测试用的脚本
    - generate-boilerplate.js 由 demo 生成 boilerplate 项目的脚本
    - serve-for-develop.js 提供本地临时测试 jianghu-init 的环境

## jianghu-init 工具开发调试说明

### 模板调试

1. 修改 demo 文件夹下的项目
2. 在 dev-scripts 项目下执行 npm run generate-boilerplate 脚本将 demo 项目转成 boilerplate 模板
3. 在 dev-scripts 项目下执行 npm run serve-for-develop 脚本起本地服务，再使用 `--registry=http://localhost:8811` 指定仓库为本地
4. 2 和 3 位置可简化为 npm run dev
5. 本地测试时，使用 `jianghu-init --registry=http://localhost:8811 --type=single`
6. 本地测试时，或使用 `node bin/jianghu-init.js --registry=http://localhost:8811 --type=single`

### 模板发布

_当前的项目生成器依托于 jianghu-init，所以可以选择暂时不将 npm 包发布到 npm 仓库中，而是将打好的包放到自己的服务器中，在使用 egg-init 时指定到私有的 registry 中就可以了。_

- 私有 registry：类似前面「开发调试」部分步骤进行即可
    - `cd /www/wwwroot/jianghu-init/jianghu-init` 进入项目目录
    - `git pull` 更新代码
    - `pm2 restart jh-init-server` 重启服务
- npm registry：将以下项目 publish 到 npm 仓库中：
    - jianghu-init-config
    - jianghu-boilerplate-multi
    - jianghu-boilerplate-single
    - create-jianghu

### 开发调试 jianghu-init

jianghu-init 主要逻辑都在 lib 目录下：

- entry.js 程序入口类
- command_base.js 基础类，实现一些公有的方法
- command_init_project.js 初始化项目
- command_init_crud.js 初始化数据库
- init_boilerplate.js 根据模板初始化框架
- init_table_data.js 根据模板初始化数据库数据
- init_view.js 根据模板初始化数据库视图

调试时：

- 只需要用 `node bin/jianghu-init.js` 执行脚本即可。
- 或者使用 `npm install . -g` 或 `yarn global add file:$PWD` 来将当前目录项目安装到全局中，来体验用户真实的使用情况。

发布新版本：

- 更新 package.json 的版本后，执行 `npm publish`

