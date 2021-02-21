---
path: '/auth'
date: '2021-02-21T11:29:07.785Z'
title: '接口权限认证'
tags: ['tag']
released: false
---

众所周知，http 是无状态协议，浏览器和服务器不可能凭协议的实现辨别任何连接。

于是 cookie 登场，既然协议本身不能分辨链接，那就在头部手动带上可以识别的暗号吧。

举个例子，以前去旅游的时候，到了景区可能会需要存放行李，被大包小包压着，旅游也不开心啦。在存放行李后，服务员会给你一个牌子，上面写着你的行李放在哪个格子，离开时，你就能凭这个牌子和上面的数字成功取回行李。

cookie 做的正是这么一件事，旅客就像客户端，寄存处就像服务器，凭着写着数字的牌子，寄存处（服务器）就能分辨出不同旅客（客户端）。（你会不会想到，如果牌子被偷了怎么办，cookie 也会被偷吗？确实会，这就是一个很常被提到的网络安全问题了）

cookie 以前会用于存放一些用户数据，但现在前端拥有两个 storage，两种数据库，根本不愁存放问题，所以现在基本上 100% 都是在连接上**证明客户端的身份**。例如登陆之后，服务器给你一个标志，就存在 cookie 里，之后再连接时，都会**自动**带上 cookie，服务器便分清谁是谁。另外，cookie 还可以用于跟踪一个用户，这就产生了隐私问题，于是也就有了“禁用 cookie”这个选项（然而现在这个时代禁用 cookie 是挺麻烦的事情）。

说到证明身份，终于引出了现在十分常见的登陆问题。

Authentication 就是验证身份的意思，是网络技术上比较常见的一个词。读完上面的大家都想到啦，验证身份不就是用 cookie 嘛！对（其中一个方法）就是这样，下面来粗略看看实现——

## session

为什么说到 session 呢，因为 session 才是真正的“信息”，cookie 是容器。

session 信息可以储存在客户端，如 [cookie-session](https://github.com/expressjs/cookie-session)。

也可以储存在服务器，如 [express-session](https://github.com/expressjs/session)。

对于 cookie-session 库，其实就是把所有信息加密后塞到 cookie 里，然后下次请求原样带回来。其中涉及到 [cookies](https://github.com/pillarjs/cookies/blob/master/index.js) 库。在设置 session 时其实就是调用 cookies.set，把信息写到 set-cookie 里，再返回浏览器。

浏览器在看到 set-cookie 头后就会把信息写到 cookie 里。（一般来说 cookie 都是依靠 set-cookie 头设置，且不允许 JavaScript 设置）

## token

session 说完了，那么 token 是什么？

## Basic Auth

直接传用户名密码 base64？

内存挤爆了怎么办？


## JWT

适合 serverless

## 参考

- [wikipedia HTTP_cookie](https://en.wikipedia.org/wiki/HTTP_cookie)
- [cookie-session](https://github.com/expressjs/cookie-session)
- [express-session](https://github.com/expressjs/session)
