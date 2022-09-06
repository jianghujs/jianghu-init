# {{database}}

## 配置

1. npm install
2. 复制 `config.local.example.js` 为 `config.local.js`
3. 并且修改数据库配置为自己的数据库, 例如：
   ```
   host: '127.0.0.1',
   port: 3306,
   user: '{{database}}',
   password: '123456',
   database: '{{database}}'
   ```
3. 修改duoxing机器人的配置, 例如：
   ```
   duoxingBot: {
      server: "http://127.0.0.1:8083",
      userId: "G00001",
      password: "123456",
      serverAppId: "duoxing",
      deviceType: "bot_xiaochengxu", // bot_databot, bot_chatbot bot_xiaochengxu
      appLibHost: "http://127.0.0.1:8083/duoxing",
   },
   ```   
4. 启动 npm run dev
   
## 数据库

```sql
# 数据库初始化
create database `{{database}}` default character set utf8mb4 collate utf8mb4_bin;
use {{database}};
# 运行 sql/init 文件
```
