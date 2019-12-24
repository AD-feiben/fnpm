# fnpm

This is a tool for private npm

私服 npm 的工具

根据私服 npm 地址修改 `lib/config.js` 中 `fnpmRegistry`、`fnpmHostedRegistry` 对应的地址即可


安装 fnpm
---

```shell
npm install fnpm --registry=http://localhost:8081/repository/npm-group/ -g
```

从私服安装 npm 包
---

```shell
fnpm install vue -S
```


发布 npm 包到私服
---

1. 登录私服(已登录可以跳过该步骤)

```shell
fnpm login
# or
npm login --registry=http://localhost:8081/repository/npm-hosted/
```

2. 发布

```shell
fnpm publish
# or
npm publish --registry=http://localhost:8081/repository/npm-hosted/
```
