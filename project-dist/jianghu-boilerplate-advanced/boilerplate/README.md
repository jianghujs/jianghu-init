# jianghu_demo_advanced

## Start

1. npm install
   ```bash
   npm i
   ```
2. 复制 `config.local.example.js` 为 `config.local.js`
3. 并且修改数据库配置为自己的数据库, 例如：
   ```bash
   host: '127.0.0.1',
   port: 3306,
   user: 'root',
   password: '123456',
   database: '{{name}}'
   ```
4. 启动 npm run dev

## 数据库

```sql
# 数据库初始化
create database `{{name}}` default character set utf8mb4 collate utf8mb4_bin;
use {{name}};
# 运行 sql/init.sql 文件
```

## 端口

7002

## 测试账号 & 测试环境

- admin/123456

## jianghu_demo_advanced

1. 操作手册 @汗蒸 https://docsify.js.org/#/zh-cn/quickstart
2. 应用协议：service演示 生成id ✅
3. hook 生成id ✅
4. resource & page resourcePageManagement ✅
5. 动态数据  ✅ 参考oa_directory 只能看班级数据 { "table": "_view01_cgg_member_app_directory", "action": "select", "where": { "loginId": "ctx.userInfo.user.userId" } } 
6. 数据历史&操作历史 ✅ 默认：active  点击按钮（查看历史） -》所有数据（deleted && active）
7. 数据权限 ✅ 参考 oa_congregation _resource accessControlTable (_access_control_a000 _access_control_c000 _access_control_z000)
8. 用户管理 ✅ userManagement (inAvatarMenu)
9. 文件管理 ✅ egg-jianghu-demo01有
10. 权限规则管理✅，_user_group_role_resource/_user_group_role_page crud Tab切换子页面
11. 用户、组织、角色：三列 左（三个tab:用户、组织、角色）-中：（用户、组织、角色）的详情，可操作（增加/删除） - 右：（用户、组织、角色）基本信息 可修改
