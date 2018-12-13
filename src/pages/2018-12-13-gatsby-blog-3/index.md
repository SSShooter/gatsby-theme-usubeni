---
path: "/gatsby-blog-3"
date: "2018-12-13T20:35:11.123Z"
title: "Gatsby Blog 3"
tags: []
---

为了测试样式，随便找一个以前的 md 文件粘贴到 blog 项目中渲染看看效果：

![](./1png)

emmm，问题大了，必备的代码高亮都没有...

![](./2png)

但是当我审查元素时发现，这竟然是已经被分词的状态，又经过一系列的资料搜集，发现 prismjs 已经预装到项目中，那么我们要做仅仅是引入css文件就行了。

`import 'prismjs/themes/prism-TWILIGHT.css'`

![](./3png)

成功添加样式！

大问题解决了然后就按照自己喜好调整样式吧～

我个人来说比较喜欢夜间模式，所以首先把背景调到暗色，因为预想到未来可能需要修改主题，方便起见应该将一些常用颜色存为变量，所以需要先安装 scss 和 gatsby 对应插件：

`npm install --save node-sass gatsby-plugin-sass`

并在插件列表添加插件 `gatsby-plugin-sass`

> 参考 https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-sass

再次运行项目，此时已经可以正常引入 scss 文件。

```scss
$backgroundColor: #434343;
$titleColor: #E87A90;

body {
    background-color: $backgroundColor;
}

.css-title{
    color: $titleColor;
}
```

这里说一下不使用 css in js 的原因——发现 body 等元素难以使用 css in js，而且需要集中变量，所以干脆就直接使用 css + class 控制了。
选择网络字体
css-title这种命名方式或许很不主流，我的目的是区分其他title，在特殊情况需要全选修改的时候可以轻松无坑地全选此class

另外，你还可以通过在 `src/utils/typography.js` 中的 `overrideThemeStyles` 覆盖原有的主题样式。

https://fonts.adobe.com/