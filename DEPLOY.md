# 部署说明

## 目前情况

- [x] jianghu-init 独立发布到 npm 仓库
- [ ] jianghu-init-config 用于保存默认有什么 boilerplate 可选，需要发布到 npm 仓库
- [ ] boilerplates 目录下的每个模板，需要分别发布到 npm 仓库

## 部署服务的功能

目前 jianghu-init 已经发布到 npm 上了，但 jianghu-init 执行时，会去拉取 jianghu-init-config 和几个 boilerplate 下载包还没发布到 npm 上。

所以服务器上用 dev-scripts 目录下的工具起了一个 server，提供 jianghu-init-config 和下载包的数据。

## 部署步骤

```shell
cd dev-scripts
npm install
npm run serve
```

然后在 nginx 上将域名映射到 8811 端口：

```nginx
location /
{
    proxy_pass http://127.0.0.1:8811;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header REMOTE-HOST $remote_addr;
}
```

## 未来

以后将 jianghu-init-config 和各个 boilerplate 都发布到 npm 上之后，就不需要这套服务了，请求完全走 npm。
