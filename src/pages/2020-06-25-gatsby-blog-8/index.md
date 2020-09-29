---
path: '/gatsby-blog-8'
date: '2020-06-25T10:47:29.111Z'
title: '使用 Gatsby.js 搭建静态博客 8 黑暗模式'
tags: ['coding', 'gatsby']
---

没想到久违的 Gatsby 系列还能继续写，最近为博客更新了黑暗模式和手动切换功能，顺便记录下来。当然下面的实现方案不限于 Gatsby 使用，对于其他框架，思路都大同小异。

## 方案 1

最初实现的方案是直接使用**媒体查询**和 **CSS 变量**。关键是把区分两个模式的变量抽离出来，分别配置两组变量，核心代码如下：

```css
@media screen and (prefers-color-scheme: dark) {
  :root {
    --linkColor: #ec9bab;
    --fontColor: #ecc3cb;
    --codeBlock: #3c495b;
    --code: #c3c7cb;
    --divider: #3e4b5e;
  }
}
@media screen and (prefers-color-scheme: light) {
  :root {
    --linkColor: #683741;
    --fontColor: hsl(284, 20%, 30%);
    --codeBlock: #3c495b;
    --code: #c3c7cb;
    --divider: #eee;
  }
}
body {
  background-color: var(--backgroundColor);
  color: var(--fontColor);
  transition: all 0.5s ease-in-out;
}
```

（prism 用户还要自己整理一下两个模式的 prism 样式）

CSS 变量除了在 IE 不能用之外其他浏览器的适应性还算不错，如果必须适配 IE 的话需要另外写一份不用变量的样式保底。

## 方案 2

按上面的写法其实已经可以实现根据系统配置转换明亮和黑暗模式，但是要做到直接在网页通过一个切换按钮手动修改还是远远不够，方案 2 登场。

因为现在 JavaScript 不能改变系统级的明暗模式，只能获取和监听模式变化，所以手动操作铁定不能靠 `prefers-color-scheme` 了。

我们需要反过来通过 JavaScript 获取 color-scheme 然后告诉 CSS 明暗模式发生变化，这样的变化包括**系统级的改变**和**用户在网页选择改变**。

首先把两组变量的作用范围改为 class：

```css
.light-theme {
  --linkColor: #ec9bab;
  --fontColor: #ecc3cb;
  --codeBlock: #3c495b;
  --code: #c3c7cb;
  --divider: #3e4b5e;
}
.dark-theme {
  --linkColor: #683741;
  --fontColor: hsl(284, 20%, 30%);
  --codeBlock: #3c495b;
  --code: #c3c7cb;
  --divider: #eee;
}
```

下面这一段代码我写在 Layout.js 的 `componentDidMount` 中，只有这里才是服务器渲染的范围之外。

```javascript
// setTheme 的实现
setTheme = themeName => {
  localStorage.setItem('theme', themeName)
  document.documentElement.className = themeName + '-theme'
  this.setState({
    theme: themeName,
  })
}
// 第一部分
let localTheme = localStorage.getItem('theme')
if (localTheme) {
  if (localTheme === 'dark') {
    this.setTheme('dark')
  } else {
    this.setTheme('light')
  }
} else if (window.matchMedia) {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    this.setTheme('dark')
  } else {
    this.setTheme('light')
  }
} else {
  // default light
  this.setTheme('light')
}
// 第二部分
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
darkModeMediaQuery.addListener(e => {
  const darkModeOn = e.matches
  if (darkModeOn) {
    this.setTheme('dark')
  } else {
    this.setTheme('light')
  }
})
```

先讲 setTheme 的实现：

- 数据持久化
- 实现设置整个文档的 class，然后 CSS 根据 class 配置变量（而不是方案 1 的媒体查询）
- 修改组件状态

第一部分是页面初始化时处理页面主题的逻辑：

- 首先查询有无被保存到 localstorage 的主题，有的话直接使用
- 没有的话使用 JavaScript 查询系统明暗方案，然后按系统配置设定
- 上面两种都不可行的情况下默认使用 light

第二部分是 JavaScript 监听系统明暗方案修改，响应式地改变页面的明暗方案（意味着不需要刷新页面）

剩下的切换按钮就没什么特别的，所以不放代码了。

## hack

最后附带一个处理画面闪烁的方法。

虽然已经在样式添加 transition 属性，但是从 JavaScript 程序知道用户需要的明暗模式前仍然有一段空挡。如果用户选择了黑暗模式，就会造成画面先是明亮模式，然后几百毫秒后变为黑暗模式的尴尬局面。

我的解决方案是先把页面 display 设为 none，在判断并设置完页面 class 之后再将页面设为可见，这样就避免了画面闪烁，但是页面展示时间会慢一点点点点。

```javascript
document.documentElement.style.display = 'none'
// 同步的判断程序
document.documentElement.style.display = 'block'
```
