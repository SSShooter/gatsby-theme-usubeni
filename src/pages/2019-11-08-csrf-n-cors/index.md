---
path: '/csrf-n-cors'
date: '2019-11-08T10:30:40.839Z'
title: '前端网络安全必修 1 SOP、CSRF 和 CORS'
tags: ['coding', '网络安全']
---

本文主要涉及三个关键词：

- 同源策略（Same-origin policy，简称 SOP）
- 跨站请求伪造（Cross-site request forgery，简称 CSRF）
- 跨域资源共享（Cross-Origin Resource Sharing，简称 CORS）

## 同源策略 SOP

### 同源

先解释何为同源：协议、域名、端口都一样，就是同源。

| url                              | 同源 |
| -------------------------------- | ---- |
| https://niconico.com             | 基准 |
| https://niconico.com/spirit      | o    |
| https://sub.niconico.com/spirit  | x    |
| http://niconico.com/spirit       | x    |
| https://niconico.com:8080/spirit | x    |

### 限制

你之所以会遇到 **跨域问题**，正是因为 SOP 的各种限制。但是具体来说限制了什么呢？

如果你说 SOP 就是“限制非同源资源的获取”，这不对，最简单的例子是引用图片、css、js 文件等资源的时候就允许跨域。

如果你说 SOP 就是“禁止跨域请求”，这也不对，本质上 SOP 并不是禁止跨域请求，而是在请求后拦截了请求的回应。**这就就会引起后面说到的 CSRF**

其实 **SOP 不是单一的定义**，而是在不同情况下有不同的解释：

- 限制 cookies、DOM 和 Javascript 的命名区域
- 限制 iframe、图片等各种资源的内容操作
- 限制 ajax 请求，准确来说是**限制操作 ajax 响应结果**，本质上跟上一条是一样的

下面是 3 个在实际应用中会遇到的例子：

- 使用 ajax 请求其他跨域 API，最常见的情况，前端新手噩梦
- iframe 与父页面交流，出现率比较低，而且解决方法也好懂
- 对跨域图片（例如来源于 `<img>` ）进行操作，在 canvas 操作图片的时候会遇到这个问题

如果没有了 SOP：

- 一个浏览器打开几个 tab，数据就泄露了
- 你用 iframe 打开一个银行网站，你可以肆意读取网站的内容，就能获取用户输入的内容
- 更加肆意地进行 CSRF

### 绕过跨域

SOP 带来安全，同时也会带来一定程度的麻烦，因为有时候就是有跨域的需求。绕过跨域的方案由于篇幅所限，并且网上也很多相关文章，所以不在这里展开解决跨域的方案，只给出几个关键词：

对于 ajax

- 使用 JSONP
- 后端进行 CORS 配置
- 后端反向代理

对于 iframe

- 使用 location.hash 或 window.name 进行信息交流
- 使用 postMessage

## 跨站请求伪造 CSRF

### 简述

CSRF（Cross-site request forgery）跨站请求伪造，是一种常见的攻击方式。是指 A 网站正常登陆后，cookie 正常保存，其他网站 B 通过某种方式调用 A 网站接口进行操作，A 的接口在请求时会自动带上 cookie。

上面说了，SOP 可以通过 html tag 加载资源，而且 SOP 不阻止接口请求而是拦截请求结果，CSRF 恰恰占了这两个便宜。

**所以 SOP 不能作为防范 CSRF 的方法**。

对于 GET 请求，直接放到 `<img>` 就能神不知鬼不觉地请求跨域接口。

对于 POST 请求，很多例子都使用 form 提交：

```html
<form action="<nowiki>http://bank.com/transfer.do</nowiki>" method="POST">
  <input type="hidden" name="acct" value="MARIA" />
  <input type="hidden" name="amount" value="100000" />
  <input type="submit" value="View my pictures" />
</form>
```

**归根到底，这两个方法不报跨域是因为请求由 html 控制，你无法用 js 直接操作获得的结果。**

### SOP 与 ajax

对于 ajax 请求，在获得数据之后你能肆意进行 js 操作。这时候虽然同源策略会阻止响应，但依然会发出请求。因为**执行响应拦截的是浏览器**而不是后端程序。事实上你的**请求已经发到服务器**并返回了结果，但是迫于安全策略，浏览器不允许你**继续进行 js 操作**，所以报出你熟悉的 `blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`。

**所以再强调一次，同源策略不能作为防范 CSRF 的方法**。

不过**可以防范 CSRF 的例外**还是有的，浏览器并不是让所有请求都发送成功，上述情况仅限于**简单请求**，相关知识会在下面 CORS 一节详细解释。

### CSRF 对策

SOP 被 CSRF 占了便宜，那真的是一无是处吗？

不是！是否记得 SOP 限制了 cookie 的命名区域，虽然请求会自动带上 cookies，但是攻击者无论如何还是无法获取 cookie 的内容本身。

所以应对 CSRF 有这样的思路：同时把一个 token 写到 cookie 里，在发起请求时再**通过 query、body 或者 header 带上这个 token**。请求到达服务器，核对这个 token，如果正确，那一定是能看到 cookie 的本域发送的请求，CSRF 则做不到这一点。（这个方法用于前后端分离，后端渲染则可以直接写入到 dom 中）

示例代码如下：

```javascript
var csrftoken = Cookies.get('csrfToken')

function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method)
}
$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader('x-csrf-token', csrftoken)
    }
  },
})
```

## 跨域资源共享 CORS

跨域是浏览器限制，但是如果服务器设置了 CORS 相关配置，在返回服务器的信息头部会加上 `Access-Control-Allow-Origin`，浏览器看到这个字段的值与当前的源匹配，就会解锁跨域限制。

```
HTTP/1.1 200 OK
Date: Sun, 24 Apr 2016 12:43:39 GMT
Server: Apache
Access-Control-Allow-Origin: http://www.acceptmeplease.com
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: application/xml
Content-Length: 423
```

对于 CORS，请求分两种。

### 简单请求

- 请求方法使用 GET、POST 或 HEAD
- Content-Type 设为 application/x-www-form-urlencoded、multipart/form-data 或 text/plain

符合上面两个条件的都为 CORS 简单请求。简单请求都会直接发到服务器，会造成 CSRF。

### 预检请求

不符合简单请求要求的请求都需要先发送预检请求（Preflight Request）。浏览器会在真正请求前发送 OPTION 方法的请求向服务器询问当前源是否符合 CORS 目标，验证通过后才会发送正式请求。

例如**使用 application/json 传参的 POST 请求**就是非简单请求，会在预检中被拦截。

再例如使用 PUT 方法请求，也会发送预检请求。

上面提到的**可以防范 CSRF 的例外**，就是指预检请求。即使跨域成功请求预检，但真正请求并不能发出去，这就保证了 CSRF 无法成功。

### CORS 与 cookie

与同域不同，用于跨域的 CORS 请求默认不发送 Cookie 和 HTTP 认证信息，前后端都要在配置中设定请求时带上 cookie。

这就是为什么在进行 CORS 请求时 axios 需要设置 `withCredentials: true`。

下面是 node.js 的后台 koa 框架的 CORS 设置：

```
/**
 * CORS middleware
 *
 * @param {Object} [options]
 *  - {String|Function(ctx)} origin `Access-Control-Allow-Origin`, default is request Origin header
 *  - {String|Array} allowMethods `Access-Control-Allow-Methods`, default is 'GET,HEAD,PUT,POST,DELETE,PATCH'
 *  - {String|Array} exposeHeaders `Access-Control-Expose-Headers`
 *  - {String|Array} allowHeaders `Access-Control-Allow-Headers`
 *  - {String|Number} maxAge `Access-Control-Max-Age` in seconds
 *  - {Boolean} credentials `Access-Control-Allow-Credentials`
 *  - {Boolean} keepHeadersOnError Add set headers to `err.header` if an error is thrown
 * @return {Function} cors middleware
 * @api public
 */
```

顺带一提，`Access-Control-Allow-Credentials`设为`true`时，`Access-Control-Allow-Origin` 强制不能设为 `*`，为了安全，也是挺麻烦啊...

## 开坑预告

暂时先说到这，若有疑问请在评论区提出，以后应该会讲讲 XSS、CSP 和 http/https 相关的主题。

2020-02-13 更新 [前端网络安全必修 2 XSS 和 CSP](/2019-11-10-csp-n-xss/)

## 参考

**重点推荐** [Whitepaper: The Definitive Guide to Same-origin Policy](https://www.netsparker.com/whitepaper-same-origin-policy/)

[egg.js 网络安全](https://eggjs.org/zh-cn/core/security.html)

[CSRF owasp](<https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)>)

[跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)

[浏览器同源政策及其规避方法](http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html)
