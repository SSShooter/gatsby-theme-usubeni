---
path: '/csrf-n-cors'
date: '2019-11-08T10:30:40.839Z'
title: 'csrf-n-cors'
tags: ['coding']
---

本文主要涉及三个关键词：

- 同源政策（Same-origin_policy，简称 SOP）
- 跨站请求伪造（Cross-site request forgery，简称 CSRF）
- 跨域资源共享（Cross-Origin Resource Sharing，简称 CORS）

## 同源政策

### 同源是什么

协议、域名、端口都一样，就是同源。

| url                              | 同源 |
| -------------------------------- | ---- |
| https://niconico.com             | 基准 |
| https://niconico.com/spirit      | o    |
| https://sub.niconico.com/spirit  | x    |
| http://niconico.com/spirit       | x    |
| https://niconico.com:8080/spirit | x    |

### 限制了什么

如果你说 SOP 就是限制非同源资源的获取，这不对，最简单的例子是引用图片、css、js 文件等资源的时候就允许跨域。

如果你说 SOP 就是禁止跨域请求，这也不对，本质上 SOP 并不是禁止跨域请求，而是在请求后拦截了请求的回应。**这就就会引起后面说到的 CSRF**

先说三个我在实际应用中遇到的 3 种情况：

- 使用 ajax 请求其他跨域 API，最常见的情况，前端新手噩梦
- iframe 与父页面交流，出现率比较低，而且解决方法也好懂
- 对跨域图片（例如来源于 `<img>` ）进行操作，例如出现在 canvas 操作图片的时候

这就对应 2 种同源限制，没错，SOP 不是单一的定义，而是在不同情况下有不同的解释。

- 限制 cookies、DOM 和 Javascript 的命名区域
- 限制 iframe、图片等各种资源的内容读取
- 限制 ajax 请求（其实这跟上一条类似，因为你获取到 ajax 结果就可以使用、修改他）

### 同源政策到底为了什么？

- 你用 iframe 包着一个银行网站，如果没有了 SOP，你可以肆意读取网站的内容，用户只要登陆了，可以说他就完蛋了。

- 通过在 cookie 或 html 中设置 token 防止 CSRF。

### 带来不便怎么办？

篇幅所限，并且网上也很多相关文章，所以不在这里展开如何解决跨域的方案，下面推荐一篇掘金点赞较高的文章：

[前端常见跨域解决方案](https://juejin.im/entry/59b8fb276fb9a00a42474a6f)

## CSRF

CSRF（Cross-site request forgery）跨站请求伪造，是一种常见的攻击方式。是指 A 网站正常登陆后，cookie 正常保存，其他网站 B 通过某种方式调用 A 网站接口进行操作，A 的接口在请求时会自动带上 cookie。

上面说了，SOP 可以通过 html tag 加载资源，而且 SOP 不阻止接口请求而是拦截请求结果，CSRF 恰恰占了这两个便宜。

**所以同源政策不能作为防范 CSRF 的方法**。

对于 GET 请求，直接放到`<img>`就能神不知鬼不觉地请求跨域接口。

对于 POST 请求，很多例子都使用 form 提交：

```html
<form action="<nowiki>http://bank.com/transfer.do</nowiki>" method="POST">
  <input type="hidden" name="acct" value="MARIA" />
  <input type="hidden" name="amount" value="100000" />
  <input type="submit" value="View my pictures" />
</form>
```

但是其实使用 ajax 也是能**成功请求**的。

### SOP 与 ajax

之所以说是成功请求是因为**执行响应拦截的是浏览器**而不是后端程序。事实上你的**请求已经发到服务器**并返回了结果，但是迫于安全策略，浏览器不允许你**继续进行 JS 操作**，所以报出你熟悉的 `blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`。

> 非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为"预检"请求（preflight）。

但也不是全部 ajax 都能行得通，根据阮老师的[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)，只有**简单请求**能做到上面的效果，而**非简单请求**的预检如果不通过（例如发出请求的域名不属于 CORS 的目标），正式请求不会发起。

例如使用 json 传参的 POST 请求就是非简单请求，会在预检中被拦截。

### CSRF 对策

SOP 被 CSRF 占了便宜，那真的是一无是处吗？

不是！是否记得 SOP 限制了 cookie 的命名区域，虽然请求会自动带上 cookies，但是攻击者无论如何还是无法获取 cookie 本身的。

所以同时把一个 token 写到 cookie 里，在发起请求时再带上这个 token。请求到达服务器，核对这个 token，如果正确，那一定是能看到 cookie 的本域发送的请求，CSRF 则做不到这一点。

## CORS

正是因为浏览器会把本来跨域的请求发送到服务器，服务器才能判断发送请求的域名，被配到 CORS 允许的地址时，一切会正常。

与同域不同，用于跨域的 CORS 请求默认不发送 Cookie 和 HTTP 认证信息。

这就是为什么在进行 CORS 请求时 axios 需要设置 `withCredentials: true`

[Whitepaper: The Definitive Guide to Same-origin Policy](https://www.netsparker.com/whitepaper-same-origin-policy/)

[CSRF owasp](<https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)>)

[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

[浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
