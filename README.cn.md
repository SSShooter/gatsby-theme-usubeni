# Usubeni

[Usubeni](https://github.com/ssshooter/gatsby-theme-usubeni) 基于 [Gatsby.js v5](https://www.gatsbyjs.com/)，示例页面：https://ssshooter.com/tag/coding/

Gatsby 相对于 hexo 上手有一点门槛，不过这个代价换来的是比较大的自由度。使用相关问题在[博客里](https://ssshooter.com/tag/gatsby/)解释了一部分。

P.S. Gatsby.js v4 版 在[这里](https://github.com/ssshooter/gatsby-theme-usubeni/tree/V4)

## 使用

fork 或 clone 本项目，安装依赖，推荐使用 **yarn**。然后：

- 修改 `gatsby-config.js`
- 修改 `src\settings.js`
- iconfont 文件夹为 `src\css\icon`，必要时请自行替换，但注意同步修改配置文件中的 icon 名称避免显示异常
- 更换主题图 `src\assets\yozakura.jpg`
- 更换 logo `static\logo.png`
- 建议使用 master 分支写博客，保留 theme 分支更新主题后（同时可以提 PR），再合并到 master 分支
- 在 `pages` 文件夹添加新文章，也可以通过 `node createPost post-title` 或 `node createPost post-title 2017-07-26` 创建

本主题特性包括：

- 快（Lighthouse performance 评分 90）
- Gatsby 相关依赖基本更新到最新
- 已集成 代码高亮（prismjs）
- 已集成 LaTeX（katex）
- 已配置 `.npmrc` 减轻安装依赖的痛苦
- 已添加 TOC
- 自带图库、标签库
- 自带（没什么用的）表情库
- SEO 优化

Gatsby 的优点：

- 高自由度页面自定义
- 为数不多的体验 graphQL 的机会

Gatsby 的缺点：

- 有一定学习成本
- 依赖多，但是也不是非常多，也就 500m（滑稽）

## 开发

```
npm start
```

## 发布

```
npm run build
```

可选如 Gatsby 自家的 cloud、 Vercel 或 Netlify 等服务。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fssshooter%2Fgatsby-theme-usubeni.git&demo-title=Usubeni%20Fantasy&demo-description=Gatsby%20Theme%20For%20Blog&demo-url=gatsby-theme-usubeni.vercel.app)

## Front Matter

```yaml
---
path: '/first-post'
slug: '/first-post' # 不写的话默认文件名，写了会变成真正的 path
date: '2022-07-03T21:00:00.171Z'
title: '这是一个标题'
tags: ['coding'] # 标签
description: '一个测试页'
released: true # 是否发布
hidden: false # 隐藏页面（不出现在归档和 site map）
---
```

## 拒绝雷同

修改 `src\css\global.scss` 文件夹的配色变量，用上自己喜欢的颜色！这是个性化主题最简单的方法！（也欢迎大家 PR 好看的配色）

其他排版优化可以参考 [Typography.js](https://github.com/kyleamathews/typography.js/)

## 评论系统

自带了评论渲染和发布组件（`src\components\Comment.js`），但是后端未开源，能干的大佬们可以小改一下接入自己的评论系统。

也可以接其他系统例如：

- 静态方案，Staticman
- 自己掌控数据，[valine](https://valine.js.org/)、waline、[twikoo](https://github.com/imaegoo/twikoo)
- 第三方，disqus

## PWA

本模板没有启用 PWA，尽管你可以通过 `gatsby-plugin-manifest` 和 `gatsby-plugin-offline` 简单地启用 PWA 功能，但是对个人博客来说 PWA 确实没有太大的必要，而且启用 PWA 之后，预渲染的页面就废了，似乎因为 PWA 的缓存机制跟多页面冲突。

## 注意事项

1. `/archive/` 为全文章列表，`/tag/xxx/` 单标签列表

```
released: true
hidden: false
```

2. 文章信息的 `released` 代表完全不加入页面生成，`hidden` 代表生成页面但不出现在任何列表中。

3. 要保证至少有一篇文章有完整的 `frontmatter`，否则会构建异常。

## 感谢

- [了不起的 Gatsby](https://www.gatsbyjs.com/)
- [封面图 P 站#18073647](https://www.pixiv.net/member_illust.php?mode=medium&illust_id=18073647)
- [可以在这里抄一下样式](https://saruwakakun.com/html-css/reference/css-sample#section1)
