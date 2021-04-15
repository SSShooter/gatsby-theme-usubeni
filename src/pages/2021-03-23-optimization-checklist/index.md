---
path: '/optimization-checklist'
date: '2021-03-23T16:19:51.218Z'
title: '前端项目优化自查'
tags: ['coding']
# released: false
hidden: true
---

- 高速度的加载是抓住用户的利器，无论内容做得多好，用户因为等待时间太长而离开就没有意义了
- 程度需要把握，把阴阳平衡铭刻于心
- 优化时应使用浏览器的匿名模式防止插件干扰

## 加载优化

### 连接

- [域名分片](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Connection_management_in_HTTP_1.x)，增加可同时进行的请求
- base64 内嵌图片，可以减少请求，但是 base64 比原数据大
- iconfont 代替单个图标文件图标，大幅减少请求
- 使用 HTTP 协议的缓存功能（服务器负责），相关传送门 [HTTP 缓存简析](https://ssshooter.com/2020-09-18-http-caching/)
- 使用两个 storage 缓存 ajax 数据，需要小心数据过时
- 使用 service worker 缓存文件（PWA 解决方案）
- 启用 keep-alive（服务器负责）
- 代码合并，减少代码文件数量
- 使用 CDN
- 减少 cookie 体积（JWT 尤其注意）
- 负载均衡等手段（正常来说，不归前端管）
- 开启 gzip 甚至 Brotli（服务器负责）

### HTML

- 明白 [critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path) 的概念
- 默认情况 HTML 文件 parse 到 JavaScript 会停下来下载、然后运行，然后继续 parse
- 使用 defer 属性：下载时 parse 不停止，下载完等待 HTML parse 完成再运行
- 使用 async 属性：下载时 parse 不停止，下载完立即运行
- 善用 `<link>` 标签的 preload 等属性

defer 和 async：可以理解为 defer 是 defer（延迟）到文档加载完成，用于强调运行顺序或需要整个 DOM 的脚本；async 就是在 parse html 的同时异步加载，下载完立即运行，适用于广告和统计之类的功能。

### CSS

- 不要使用 `@import`，因为从 css 里下载会阻塞当前 css 解释，从而会阻塞渲染进程
- 使用 font-display 优化大型字体文件加载前的显示
- 使用 devtools 的 Coverage 鉴别关键 CSS
- 用 `media` 属性条件加载 CSS

### 代码拆分

- 代码拆分，这似乎与减少连接数的合并互斥，其实也不是，这个拆分是把现在不需要用的代码延后加载，在 SPA 中十分有效
- 调整 webpack 配置，根据现实需求压缩代码、实现代码合并
- 抽离关键代码用于首屏渲染

### 静态数据体积

- 使用 [tinypng](https://tinypng.com/) 等工具压缩图片
- [高级图片优化](https://images.guide/)，权衡加载速度和用户体验

## 运行优化

### HTML

- 减少 DOM 复杂度（如高频使用开源重型组件，考虑自己实现最简化的替代品）
- 无障碍优化（Accessibility）

### JavaScript

- 老掉牙的事件委托问题
- 内存泄漏问题，参考文章：[Beyond Memory Leaks in JavaScript](https://medium.com/outsystems-experts/beyond-memory-leaks-in-javascript-d27fd48ae67e)
- 减少 DOM 操作可能引起的重排与重绘
- SSR，以新的技术栈回到服务器渲染的初心
- 运行大型任务时如果需要保持页面流畅，可以把任务拆分成 16.7 ms 内完成的多个任务，然后使用 `requestAnimationFrame` 运行，保证页面不卡顿

![帧的组成](./anatomy-of-a-frame.svg)

图片来自 [aerotwist](https://aerotwist.com/blog/the-anatomy-of-a-frame/)

### CSS

- [CSS 渲染原理以及优化策略](http://jartto.wang/2019/10/23/css-theory-and-optimization/)
- CSS 硬件加速
- 少用通配符
- [编写高效 CSS](https://csswizardry.com/2011/09/writing-efficient-css-selectors/)
- 理解 Recalculate Styles、回流（reflow）和重绘（repaint）

可以在 [csstriggers](https://csstriggers.com/) 查看 CSS 属性是否触发回流或重绘

## 代码可读性

- 使用固定 ESlint 为团队统一代码风格（自带不少最佳实践）
- 保持变量名准确描述变量信息
- 把小黄鸭调试法用在写代码中，思考别人在看代码时会有什么疑惑，并记下
- 在 workaround 写下注释，避免之后不解，甚至是自己都不解
- 在可以优化的地方打上标记，如 `// TODO: `
- 减少嵌套，拆分大型表达式
- 把变量控制在最小范围的作用域里

## 性能检测方式

- [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
- dev-tools performance
- [webpagetest](https://www.webpagetest.org/)，使用提示：https://www.debugbear.com/blog/performant-front-end-architecture

## 虽然不可能但不失为一个方法

- 要求用户升级客户端

## 其他参考站点

- 网络性能相关规范——[Web Performance Working Group](https://www.w3.org/webperf/)
- [csswizardry](https://csswizardry.com/)
