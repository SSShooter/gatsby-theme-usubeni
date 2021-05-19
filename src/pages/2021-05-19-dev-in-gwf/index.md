---
path: '/dev-in-gwf'
date: '2021-05-19T21:30:24.887Z'
title: '墙内开发者的无奈'
tags: ['coding']
---

## 大大的无奈

GWF 内的开发者，特别是安卓和前端开发者，估计真的对这事很无奈。

说到这里，突然想赞叹一下 [goproxy](https://goproxy.cn/)，感谢他给 Gopher 带来的便利 *★,°*:.☆(￣▽￣)/$:*.°★* 。

说回正事，下个依赖整大半天，幸运的龟速下完，更悲惨的就是直接下不了了。

对此，最简单的解决方案就是借用国内的镜像，借助 [nrm](https://www.npmjs.com/package/nrm) 你可以轻松切换 npm 的源，当然，其中包括大家熟知的淘宝镜像。

但是切换源也没能解决所有问题，因为有一些依赖不完全托管在 npm。这些依赖在安装前后可能会请求寄存在 github 或其他地方的资源。

原本下载 github 的静态资源（`raw.githubusercontent.com`）就很慢，到了近年，直接就墙了。还好你可以安装 cnpm，多数人都知道 cnpm 用的就是淘宝镜像，特快，但不止如此，cnpm 对资源中对 github 的依赖也有一些[应对措施](https://github.com/cnpm/cnpm/blob/bf5d886f1efd10fddbf33c078f0b659257f2195c/origin_npm.js#L88)，对 electron、node-sass 等常用库的资源，cnpm 也进行了镜像。

但是其他的冷门库就没这么幸运了，你需要再想想办法。

其一，改 host，就相当于给你的地址加一个电话本，请求这个地址的时候就直接知道一个可用的 ip。详细做法看[这里](https://zhuanlan.zhihu.com/p/107691233)。

其二，就用些科学的方法下载你的依赖……至于怎么科学，就不在这里展开了，下面直接以科学的 sock 协议为例：

对安卓来说比较简单，有图形界面，直接把 sock5 填到 proxy 就行了。

在 cmd 中需要运行：

```
set http_proxy=socks5://127.0.0.1:1080
set https_proxy=socks5://127.0.0.1:1080
```

然后运行 `echo %http_proxy%` 可知已经修改，接着再来一个 `curl ifconfig.io`，看到 ip 变了，那就是修改成功了。

## 其他参考连接

- https://itectec.com/set-https-proxy-in-windows-command-line-environment/