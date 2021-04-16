---
path: '/front-end-checklist'
date: '2021-03-11T14:26:35.250Z'
title: '非正常前端学习清单'
tags: [coding]
# released: false
hidden: true
---

## 真·前端

### JavaScript

- 基本语法
- 原型链
- 事件循环机制，异步回调的基础，了解回调函数的运行时机是 JavaScript 的必修课
- ajax
- 熟悉 [DOM 操作](https://itnext.io/using-the-dom-like-a-pro-163a6c552eba)
- [编写清晰易懂的代码](https://github.com/ryanmcdermott/clean-code-javascript)
- [自文档 Javascript](https://www.sitepoint.com/self-documenting-javascript/)

优先度低一点的两个知识点：

- canvas
- 正则表达式，强推神器 [regexr.com](https://regexr.com/)，但凡有一点点基础，借他之力都能写出漂亮的正则表达式
- 跨域，前后端分离盛行后，这是一个很常见的问题，但是要完整理解和解决跨域并不容易，而且也不仅靠前端就能实现

### CSS

- 优先级
- 基础，常见布局，了解一些坑
- 新手必学：[元素居中](https://web.dev/centering-in-css/)
- 浮动对布局的破坏
- 进阶，各种魔幻特效

### HTML

HTML 入门……似乎真的没什么难度，了解主流 HTML 标签和这些标签的特性就可以了（虽然不推荐，但是你甚至可以全部用 div）

需要特别注意的大概是元标签吧。

- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name

### git

git 的基础是理解 git 分支、本地仓库、远程仓库的概念，然后熟悉 add、commit、push、pull 等操作，基本是随便百度都能搜到的内容。

基础学习完，下个 [Sourcetree](https://www.sourcetreeapp.com/) 其实就能用起来了。不过仍想深入学习 git 的话，可以阅读 [Pro Git](https://git-scm.com/book/en/v2)。

在团队合作中，使用[语义化 Commit](https://ssshooter.com/2020-09-30-commit-message/) 十分必要。

https://dev.to/lydiahallie/cs-visualized-useful-git-commands-37p1

### 优化

## 网络

### 网络协议

#### TCP/IP

一串平平无奇的数字，构成了奇妙的网络世界

- [互联网协议入门](https://www.ruanyifeng.com/blog/2012/05/internet_protocol_suite_part_i.html)
- [如果让你来设计网络](https://mp.weixin.qq.com/s/jiPMUk6zUdOY6eKxAjNDbQ)
- [图解 | 你管这破玩意儿叫 TCP？](https://mp.weixin.qq.com/s/Uf42QEL6WUSHOwJ403FwOA)

互联网号码分配局（IANA）

#### HTTP

同样，一串约定俗成的字符串构筑了网络的桥梁

[MDN HTTP 教程](https://developer.mozilla.org/en-US/docs/Web/HTTP)

可以通过 node 后端实践深入理解 HTTP 相关知识

如果要再学一门后端语言的话，我选的是 go，原因是 go 十分容易上手，而且久仰其互联网时代 C 语言的大名，将来如果 WASM 盛行也可以直接用 go 代码编译为 WASM。

你可以用 Wireshark 看看在网络世界里飞来飞去的“包”到底是怎样的东西，也能看到高频考点三次握手和四次挥手。

[HTTP 缓存相关传送门](/2020-09-18-http-caching/)

#### HTTPS

#### 其他

web-rtc、socket 等

### 网络安全

- [前端网络安全必修 1 SOP、CSRF 和 CORS](https://ssshooter.com/2019-11-08-csrf-n-cors/)
- [前端网络安全必修 2 XSS 和 CSP](https://ssshooter.com/2019-11-10-csp-n-xss/)
- [前后端接口鉴权全解](https://ssshooter.com/2021-02-21-auth/)

## Node.js

stream、buffer

## 算法

[javascript-algorithms](https://github.com/trekhleb/javascript-algorithms)

## 设计模式

- [Refactoring.Guru](https://refactoringguru.cn/design-patterns/catalog)
- [Learning JavaScript Design Patterns](https://addyosmani.com/resources/essentialjsdesignpatterns/book/)

## 测试

## MISC

### debug 技巧

也算是很久以前了，我写过[这样的](https://segmentfault.com/a/1190000015758071)小总结，现在看来很多都已经是刻到 DNA 的基本知识了，但对于当时的我来说仍是难以理解或者记忆的。

但是现在回看，居然也有这么多的赞……只能说，大家还是把坑记下来吧，无论何时，总有像当年的自己那样刚上路的新手程序员。

### PWA

### 跨平台

主要 RN 和 flutter

### 编码

计算机基础、编码

### V8

### WASM

### web GL

### serverless

### 外语

### 成长

- 拥抱变化，也要审视、质疑变化
- 可以以轻松更换框架为目标对代码进行优化拆分
- 了解需求是写好业务代码的前提
- 技术选型考虑因素：稳定性、性能、生态、文档、社区活跃度、学习曲线、开发团队、GitHub 信息、迁移成本、关注 breaking changes

## 推荐阅读

- https://github.com/mqyqingfeng/Blog
- https://www.yuque.com/iscott/fe/kvokg4
- https://betterprogramming.pub/4-mistakes-i-made-as-a-programmer-but-i-had-to-become-a-cto-to-see-them-19a41ba70411