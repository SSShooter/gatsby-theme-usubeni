---
path: '/auth'
date: '2021-02-21T11:29:07.785Z'
title: '前后端接口鉴权全解'
tags: ['coding', '网络安全']
released: false
---

不知不觉也写出万字长文了，看不完建议收藏夹吃灰哦（

## Cookie

众所周知，http 是无状态协议，浏览器和服务器不可能凭协议的实现辨别任何连接。

于是 cookie 登场，既然协议本身不能分辨链接，那就在头部手动带上可以识别的暗号吧。

举个例子，以前去旅游的时候，到了景区可能会需要存放行李，被大包小包压着，旅游也不开心啦。在存放行李后，服务员会给你一个牌子，上面写着你的行李放在哪个格子，离开时，你就能凭这个牌子和上面的数字成功取回行李。

cookie 做的正是这么一件事，旅客就像客户端，寄存处就像服务器，凭着写着数字的牌子，寄存处（服务器）就能分辨出不同旅客（客户端）。（你会不会想到，如果牌子被偷了怎么办，cookie 也会被偷吗？确实会，这就是一个很常被提到的网络安全问题了）

cookie 以前会用于存放一些用户数据，但现在前端拥有两个 storage，两种数据库，根本不愁存放问题，所以现在基本上 100% 都是在连接上**证明客户端的身份**。例如登陆之后，服务器给你一个标志，就存在 cookie 里，之后再连接时，都会**自动**带上 cookie，服务器便分清谁是谁。另外，cookie 还可以用于跟踪一个用户，这就产生了隐私问题，于是也就有了“禁用 cookie”这个选项（然而现在这个时代禁用 cookie 是挺麻烦的事情）。

说到证明身份，终于引出了现在十分常见的登陆问题。

Authentication 就是验证身份的意思，是网络技术上比较常见的一个词。读完上面的大家都想到啦，验证身份不就是用 cookie 嘛！对（其中一个方法）就是这样，下面来粗略看看实现——

注意 Authentication 和 Authorization 都是 Auth 开头，但不是一个意思，前者是验证，后者是授权。

## Session

为什么说到 session 呢，因为 session 才是真正的“信息”，cookie 是容器。

session 信息可以储存在客户端，如 [cookie-session](https://github.com/expressjs/cookie-session)，也可以储存在服务器，如 [express-session](https://github.com/expressjs/session)。

### 客户端储存

对于 cookie-session 库，比较容易理解，其实就是把所有信息加密后塞到 cookie 里。其中涉及到 [cookies](https://github.com/pillarjs/cookies/blob/master/index.js) 库。在设置 session 时其实就是调用 cookies.set，把信息写到 set-cookie 里，再返回浏览器。

浏览器在看到 set-cookie 头后就会把信息写到 cookie 里。（一般来说 cookie 都是依靠 set-cookie 头设置，且不允许 JavaScript 设置）

在下次发送请求时，信息又通过 cookie 原样带回来，所以服务器什么东西都不用存，连个 id 都不用。

这是一段使用 cookie-session 中间件为连接添加 cookie 的代码：

```javascript
const express = require('express')
var cookieSession = require('cookie-session')
const app = express()
app.use(
  cookieSession({
    name: 'session',
    keys: [
      /* secret keys */
      'key',
    ],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
)
app.get('/', function(req, res) {
  req.session.test = 'hey'
  res.json({
    wow: 'crazy',
  })
})

app.listen(3001)
```

在通过 `app.use(cookieSession())` 使用中间件之前，连接是不会设置 cookie 的，添加后再访问（并且只在设置 req.session 后），就能看到服务器响应头部新增了下面两行：

```
Set-Cookie: session=eyJ0ZXN0IjoiaGV5In0=; path=/; expires=Tue, 23 Feb 2021 01:07:05 GMT; httponly
Set-Cookie: session.sig=QBoXofGvnXbVoA8dDmfD-GMMM6E; path=/; expires=Tue, 23 Feb 2021 01:07:05 GMT; httponly
```

然后你就能在 DevTools 的 Application 标签看到 cookie 成功写入。session 的值 `eyJ0ZXN0IjoiaGV5In0=` 通过 base64 解码即可得到 `{"test":"hey"}`（将 session 信息放到客户端），而 session.sig 是一个 27 字节的 SHA1 签名，用以校验 session 是否被篡改。

不过即使使用签名防止篡改，如果 cookie 泄漏也是很大的问题，就像上面提到的行李寄存例子，就算寄存牌的数字不能被篡改，拿着你的牌子换走行李也是完全可以的。

所以现代浏览器和服务器做了一些约定，例如使用 https、跨域限制、cookie 的 httponly 和 sameSite 配置等，保障了 cookie 安全。

### 服务器储存

既然要储存在服务器，那么 express-session 就需要一个容器 store，它可以是内存、redis、mongoDB 等等等等，内存应该是最快的，但是重启程序就没了，redis 可以作为备选，用数据库存 session 的场景感觉不多。

说回 express-session，它的源码就没 cookie-session 那么简明易懂了，里面有一个非常绕的地方（不关注实现可以跳过这段），`req.session` 到底是怎么插入的？

我们可以从 `.session =` 这个关键词开始找，找到：

- `store.generate` 否决这个，容易看出这个是初始化使用的
- `Store.prototype.createSession` 这个是根据 req 和 sess 参数在 req 中设置 session 属性，没错，就是你了

于是全局搜索 `createSession`，锁定 index 里的 `inflate` （就是填充的意思）函数。

最后寻找 `inflate` 的调用点，是使用 sessionID 为参数的 `store.get` 的回调函数，一切说得通啦——

在监测到客户端送来的 cookie 之后，得到 sessionID 后，再由 id 在 store 中获取 session 信息，挂到 `req.session`，经过这个中间件，你就能顺利地使用 req 中的 session。

那赋值怎么办呢？这就和上面储存在客户端不同了，上面要修改客户端 cookie 信息，但是对于储存在服务器的情况，你修改了 session 那就是“实实在在地修改”了嘛，不用其他花里胡哨的方法，内存中的信息就是修改了，下次获取内存里的对应信息也是修改后的信息。

在一个连接没有 session id 时通过 `store.generate` 创建新的 session，在你写 session 的时候，cookie 可以不改变，只要根据原来的 cookie 访问内存里的 session 信息就可以了。

```javascript
var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')

var app = express()

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  })
)

app.use(function(req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

  next()
})

app.get('/foo', function(req, res, next) {
  res.json({
    session: req.session,
  })
})

app.get('/bar', function(req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})

app.listen(3001)
```

## Token

session 说完了，那么出现频率超高的 token 又是什么？

不妨谷歌搜一下 token 这个词，你可以看到冒出来几个（年纪大的人可能比较熟悉的）图片：密码器。过去网上银行不是只要短信认证就能赚钱，还要经过一个密码器，上面显示着一个变动的密码，在转账时你需要输入密码器中的代码才能转账，这就是 token 现实世界中的例子。凭借一串码或是一个数字证明自己身份，这事情不就和上面提到的行李问题还是一样的吗……

**其实本质上 token 的功能就是和 session id 一模一样。**你把 session id 说成 session token 也没什么问题。

而其中的区别在于，session id 一般存在 cookie 里，自动带上；token 是要你主动放在请求中，例如设置请求头的 `Authorization` 为 `bearer:<access_token>`。

打开 GitHub 进入设置，找到 Settings / Developer settings，你也可以看到 Personal access tokens 选项，生成新的 token 后，你就可以带着它通过 GitHub API，证明“你就是你”。

在 OAuth 系统中也使用了 Access token 这个关键词，写过微信登陆的朋友应该都能感受到 token 是个什么啦。

所以 Token 很重要，不可泄漏，谁拿到 token，谁就是“主人”。所以要做一个 Token 系统，刷新或删除 Token 是必须要的，这样在尽快弥补 token 泄漏的问题。

在理解了三个关键字和两种储存方式之后，下面我们**正式**开始说“用户登陆”相关的知识。在此之前，再说一遍！注意 Authentication 和 Authorization 都是 Auth 开头，但不是一个意思，前者是验证，后者是授权。

## JWT

全称 JSON Web Token（[RFC 7519](https://tools.ietf.org/html/rfc7519)），是的，JWT 就是一个 token。

### 如何使用 JWT？

在验证用户，顺利登陆后，会给用户返回 JWT。因为 JWT 的信息没有加密，所以别往里面放密码。

在用户访问需要授权的连接，可以把 token 放在 cookie，也可以在请求头带上 `Authorization: Bearer <token>`。（手动放在请求头不受 CORS 限制）

这样可以用于自家登陆，也可以用于第三方登陆。

A certain balance between client-side data and database lookups in the backend is necessary.

## HTTP authentication

HTTP authentication 是一种标准化的校验方式，**不会使用 cookie 和 session 相关技术**。请求头带有 `Authorization: <type> <credentials>` 格式的授权字段，有以下几种常用的 type：

- Basic
- Bearer
- Digest
- HOBA
- ……

Basic 是最简单的，其 credentials 就是 Base64 编码的用户名 + `:` + 密码，以后看到 Basic authentication，意识到就是每次请求都带上用户名密码就好了。

Basic authentication 大概比较适合 serverless，毕竟他没有运行着的内存，无法记录 session，直接每次都带上验证就完事了。

Bearer 是 OAuth 2.0 相关，接着往下说。

## OAuth 2.0

OAuth 2.0 也是用 token 登陆的一种。

很多大公司都提供 OAuth 2.0 第三方登陆，这里就拿小聋哥的微信举例吧——

### 准备

一般来说，首先要在登陆平台申请好 AppID 和 AppSecret。

### 获取 code

> 什么是授权临时票据（code）？ 答：第三方通过 code 进行获取 access_token 的时候需要用到，code 的超时时间为 10 分钟，一个 code 只能成功换取一次 access_token 即失效。code 的临时性和一次保障了微信授权登录的安全性。第三方可通过使用 https 和 state 参数，进一步加强自身授权登录的安全性。

https://open.weixin.qq.com/connect/qrconnect?
appid=APPID&
redirect_uri=REDIRECT_URI&
response_type=code&
scope=SCOPE&
state=STATE
#wechat_redirect

成功时，跳转到

redirect_uri?code=CODE&state=STATE

失败时，跳转到

redirect_uri?state=STATE

也就是失败时没 code

### 获取 token

https://api.weixin.qq.com/sns/oauth2/access_token?
appid=APPID&
secret=SECRET&
code=CODE&
grant_type=authorization_code

authorization_code 是其中一种授权模式，微信现在只支持这一种

### 使用 token 调用微信接口

| 授权作用域（scope） | 接口                      | 接口说明                                                  |
| ------------------- | ------------------------- | --------------------------------------------------------- |
| snsapi_base         | /sns/oauth2/access_token  | 通过 code 换取 access_token、refresh_token 和已授权 scope |
| snsapi_base         | /sns/oauth2/refresh_token | 刷新或续期 access_token 使用                              |
| snsapi_base         | /sns/auth                 | 检查 access_token 有效性                                  |
| snsapi_userinfo     | /sns/userinfo             | 获取用户个人信息                                          |

### 后续使用

在使用 token 获取用户个人信息后，你可以接着用微信用户的唯一标志码结合 session 技术实现在自己服务器登陆。

## 参考

- [wikipedia HTTP_cookie](https://en.wikipedia.org/wiki/HTTP_cookie)
- [cookie-session](https://github.com/expressjs/cookie-session)
- [express-session](https://github.com/expressjs/session)
- [OAuth access-token](https://www.oauth.com/oauth2-servers/access-tokens/)
- [MDN HTTP authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
- [JWT introduction](https://jwt.io/introduction)
- [微信 OAuth2.0 登陆](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)
