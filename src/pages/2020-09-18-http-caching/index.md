---
path: '/http-caching'
date: '2020-11-04T22:11:06.804Z'
title: 'HTTP 缓存简析'
tags: ['coding', '前端优化']
---

## 概述

**HTTP 缓存的核心是 header 的 Cache-Control 属性。**

这个属性请求和响应都可用，不过请求头的 Cache-Control 一般只用于阻止代理（proxy）缓存（[相关问题](https://stackoverflow.com/questions/14541077/why-is-cache-control-attribute-sent-in-request-header-client-to-server)），因此我们可以重点关注响应头。

其中代理（proxy）是指客户端到服务器中间的可能经过的地方，有可能用于数据转发和缓存。

![](/blog-image/Client-server-chain.png)

**HTTP 缓存有两个关键字：新鲜度（Freshness），校验（Validation）**

**新鲜度**是指缓存是否依然生效，在过期前，他就是新鲜的，过期后，则被称为 stale。

而**校验**是指客户端向服务器校验缓存是否依然有效。一个挺迷惑的设定，因为校验不一定是过期后的行为，根据特定的设定，校验可以发生在每次请求。

## 可选选项

完整的选项可以看[这里](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)，本文只讲一些常用选项：

```
Cache-Control: no-cache
Cache-Control: no-store
Cache-Control: public
Cache-Control: private
Cache-Control: must-revalidate
Cache-Control: max-age=<seconds>
```

- 当你不需要缓存时，使用 `no-store`（而不是 `no-cache`，不要问为什么，起名字的人就是鬼才）
- 在使用 `no-cache` 时，则会表现为：**缓存**该请求，每次使用缓存前都先**校验**，如果资源没有过期返回 304（虽然也向服务器请求，但占用流量更少），过期则重新下载
- `public` 缓存请求（包括代理和浏览器）
- `private` 仅在浏览起缓存请求
- `must-revalidate` 这个设置的出现率似乎比上面的低，而且功能和普通缓存其实是重叠的，在设置 `must-revalidate` 后，**在缓存过期后**，必须校验（而 `no-cache` 是不论是否过期）。但是疑问在于，难道不设置 `must-revalidate` 浏览器会在缓存过期的时候依然用旧的缓存？答案是，部分浏览器在请求失败时会使用旧资源，但存在 `must-revalidate` 时就不能这么做了，直接返回 504
- `max-age=<seconds>` max-age 是**保持缓存新鲜的秒数**

说了这么多的选项，但是如果服务器根本没有设置任何 Cache-Control 怎么办呢？

答案是浏览器会根据 last-modified 推测请求的新鲜度，自动缓存（[相关问题](https://webmasters.stackexchange.com/questions/111298/what-happens-if-you-dont-set-cache-control-header)）。

上面说的只是特例的其中之一，Cache-Control 的**多种属性组合使用**会产生很多意外的效果，不同浏览器存在不同的实现，但是应该大同小异。本文不会详细讲组合效果和在各个浏览器的表现。

![flowchart](/blog-image/2020-09-18-http-caching-flowchart.png)

借助上图，可以根据你的需求简单判断 Cache-Control 的设置，来源于：https://web.dev/http-cache/

## 校验

除了 max-age，我们也能使用 [Expires](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Expires) 和 [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) **校验**缓存是否过期。

一个 Expires 属性可能长这样：`Expires: Wed, 21 Oct 2015 07:28:00 GMT`，如果当前时间超过 Expires 提供的日期，缓存被视为不新鲜。另外，在提供了 `max-age` 的情况下，**Expires 无效**。

```
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
ETag: W/"0815"
```

ETag 属性是请求指向的资源的**指纹**，如果资源被修改，那么 ETag 就一定会变化，所以在校验时可以通过 ETag 判断资源是否过期。

要问校验是如何操作的，就要说到以下两个属性：

**响应头**存在 ETag 时，在下次校验该资源时，**请求头**就会自动带上 `If-None-Match` 属性，值为该资源的 Etag。

当不存在 ETag 时，**请求头**自动带上 `If-Modified-Since`，值为**响应头**的 `Last-Modified` 属性的值。

再顺便重复一遍，校验是要请求服务器的，校验后如果得知资源与上次请求相同，会返回 `304 Not Modified`，不返回资源内容本身，节省了流量；校验后发现资源已经被修改过时，就是正常的 200，资源重新下载。

## 实际情况

下面随便打开一个网页看看 HTTP 缓存的实际效果。

![dev tool](/blog-image/2020-09-18-http-caching-devtool.png)

第一条是网页文件请求，`cache-control` 设置为 `public, max-age=0, s-maxage=300`，说明了：

- public：文件可以被代理和浏览器缓存，
- max-age=0：浏览器在 0 秒后把资源判断为过期，其实就等于 `no-cache`，每次使用缓存前都先校验
- s-maxage=300：代理在 300 秒后把资源判断为过期

同时看到请求状态是 304，说明校验结果是资源新鲜，可使用缓存的内容。

接着看后面一大堆请求的 Size 列都标明 disk cache 或者 memory cache，这种就是完全没有检验直接使用缓存的情况。

它们的 `max-age` 都是一个较大的数字甚至是 `immutable`（意味着永远不会过期），并且没有 `no-cache`。

## 实践

对于前端开发人员，可能会遇到的问题是版本发布后刷新但依然是旧数据的问题，重点有两个：

第一，进入页面的请求本身必须不缓存或每次都校验，这样入口文件的依赖就是最新的

第二，依赖的 JavaScript 和 css 文件设置长时间的 `max-age`，且不校验。但是不校验怎么更新版本呢？我们可以在**文件名上带上哈希值**（一般依赖内容由构建工具生成，不用手动地加哈希值），这样每次版本更新后，请求的都**不是同一个文件**

通过上面两个设置的配合，就能同时实现长时间缓存和版本更新。

## 附录

![](/blog-image/serverToClientFlowchart.png)

上图来源于 [Server to Client](https://alistapart.com/article/server-to-client/) 这篇文章，看不清请右键新建页面浏览图片。

此图清晰说明了客户端输入地址后，整个获取资源的流程。值得注意的是，Service Worker 在此占有一席之地，说明我们可以借助他的力量代替传统的缓存操作，不过相关问题，就留到下次再做研究了。

## 其他参考文章

- [Caching best practices & max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/)
- [Server to Client](https://alistapart.com/article/server-to-client/)
