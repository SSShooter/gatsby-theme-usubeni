---
path: '/optimization-checklist'
date: '2021-03-23T16:19:51.218Z'
title: '前端项目优化自查'
tags: ['coding']
# released: false
hiden: true
---

程度需要把握，把阴阳平衡铭刻于心

## 连接

- [域名分片](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Connection_management_in_HTTP_1.x)，增加可同时进行的请求
- base64 内嵌图片，可以减少请求，但是 base64 比原数据大
- iconfont 代替单个图标文件图标，大幅减少请求
- 使用 HTTP 协议的缓存功能（服务器负责），相关传送门 [HTTP 缓存简析](https://ssshooter.com/2020-09-18-http-caching/)
- 启用 keep-alive（服务器负责）
- 代码合并，减少代码文件数量
- 使用 CDN
- 减少 cookie 体积（JWT 尤其注意）
- 负载均衡等手段（正常来说，不归前端管）
- 开启 gzip 甚至 Brotli（服务器负责）

## 静态数据体积

- 使用 [tinypng](https://tinypng.com/) 等工具压缩图片
- [高级图片优化](https://images.guide/)，权衡加载速度和用户体验

## 代码层面

### HTML

- 默认情况 HTML 文件 parse 到 JavaScript 会停下来下载、然后运行，然后继续 parse
- 使用 defer 属性：下载时 parse 不停止，下载完立即运行
- 使用 async 属性：下载时 parse 不停止，下载完等待 HTML parse 完成再运行
- 善用 `<link>` 标签的 preload 等属性
- 减少 DOM 复杂度
- 无障碍优化（Accessibility）

### JavaScript

- 老掉牙的事件委托问题
- 调整 webpack 配置，根据现实需求压缩代码、实现代码合并
- 使用两个 storage 缓存 ajax 数据，需要小心数据过时
- 使用 service worker 缓存文件（PWA 解决方案）
- 内存泄漏问题，参考文章：[Beyond Memory Leaks in JavaScript](https://medium.com/outsystems-experts/beyond-memory-leaks-in-javascript-d27fd48ae67e)
- 代码拆分，这似乎与减少连接数的合并互斥，其实也不是，这个拆分是把现在不需要用的代码延后加载，在 SPA 中十分有效
- 减少 DOM 操作可能引起的重排与重绘
- SSR，以新的技术栈回到服务器渲染的初心
- 抽离关键代码用于首屏渲染

### CSS

- [CSS 渲染原理以及优化策略](http://jartto.wang/2019/10/23/css-theory-and-optimization/)
- CSS 硬件加速
- 少用通配符
- [编写高效 CSS](https://csswizardry.com/2011/09/writing-efficient-css-selectors/)
- 使用 font-display 优化大型字体文件加载前的显示

## 性能检测方式

- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- dev-tools performance
- [webpagetest](https://www.webpagetest.org/)，使用提示：https://www.debugbear.com/blog/performant-front-end-architecture

## 虽然不可能但不失为一个方法

- 要求用户升级客户端

## 其他参考站点

- 网络性能相关规范——[Web Performance Working Group](https://www.w3.org/webperf/)
- [csswizardry](https://csswizardry.com/)