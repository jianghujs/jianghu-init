# Jianghu init

Jianghu init 是[江湖 js](https://openjianghu.org/)的代码初始化工具。

## 安装 jianghu-init

```shell
# install
$ npm i -g jianghu-init
# upgrade
$ npm update -g jianghu-init
```

## 主要功能说明

- `jianghu-init project`：创建项目，使用 type 指定不同类型的项目，支持独立应用、多应用项目
- `jianghu-init crud`：在应用目录下执行，根据数据库已有表，生成并注册 crud 样例页面

## 示例一：创建一个独立应用项目

```shell
$ jianghu-init project --type=stand-alone my-jh-project
? project name my-jh-project
? project description My stand-alone jianghu project
...
```

根据输入配置好基本信息、数据库信息之后，便会自动初始化项目、数据库。

之后就可以进入项目目录进行后续操作。

```shell
$ cd my-jh-project
$ npm i
$ npm run dev
```

## 示例二：根据数据库已有表生成 CRUD 页面

```shell
# 生成 CRUD 页面
$ jianghu-init crud
✔ 初始化数据库连接成功
ℹ 开始生成 CRUD
? 请选择你要生成 crud 的表 (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ class
❯◯ student
```

选择你要生成 CRUD 的表即可。

## 示例三：创建一个多应用项目

```shell
# 创建一个多应用
$ jianghu-init project --type=multi my-jh-project
? project name my-jh-project
? project description My multi jianghu project
...
```

同样需要根据输入配置好基本信息、数据库信息，之后就可以进入项目目录对每个子应用进行操作。

```shell
$ cd my-jh-project
$ ls
data_repository  directory  simple_demo  ua_arm
$ cd simple_demo
$ npm i
$ npm run dev
```

## 示例四：在一个多应用下创建一个新应用


```shell
# 进入已有的多应用项目
$ cd my-jh-project
# 创建新应用
$ jianghu-init project --type=single biz-app
? project name biz-app
? project description Biz app
...
```

同样需要根据输入配置好基本信息、数据库信息即可创建一个新的子应用。

## 多应用项目说明

多应用项目，项目下的每个目录是一个应用，包括一些基础应用和自己的创建的业务应用，具体关联和概念可看[江湖JS文档](https://openjianghu.org/)。
