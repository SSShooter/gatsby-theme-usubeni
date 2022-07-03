# UsubeniFantasy

## 使用

fork 本项目，修改 `gatsby-config.js` 和 `src\settings.js` 中的配置。推荐使用 yarn 安装依赖。

在 `pages` 文件夹添加新文章。可以通过 `node createPost post-title` or `node createPost post-title 2017-07-26` 创建新文章。

本模板基于 Gatsby.js v4，相对于 hexo 上手有一点门槛，不过这个代价换来的是比较大的自由度。使用相关问题在[博客里](https://ssshooter.com/tag/gatsby/)解释了一部分。

- 本模板已集成 LaTeX（katex）
- 已配置 `.npmrc` 减轻安装依赖的痛苦

优点：

- 高自由
- 体验 graphQL

缺点：

- 有一定学习成本
- 依赖多，但是也不是非常多，也就 500m

## 开发

```
yarn
npm start
```

## 发布

```
npm run build
```

可选如 Vercel 或 Netlify 等服务。

## 评论系统

自带了评论渲染和发布组件（`src\components\Comment.js`），但是后端未开源，能干的大佬们可以小改一下接入自己的评论系统。

也可以接其他系统例如：

- 静态方案，Staticman
- 自己掌控数据，[valine](https://valine.js.org/)、waline
- 第三方，disqus

## PWA

本模板没有启用 PWA，尽管你可以通过 `gatsby-plugin-manifest` 和 `gatsby-plugin-offline` 简单地启用 PWA 功能，但是对个人博客来说 PWA 确实没有太大的必要，而且启用 PWA 之后，预渲染的页面就废了，似乎因为 PWA 的缓存机制跟多页面冲突。

## 感谢

- https://www.pixiv.net/member_illust.php?mode=medium&illust_id=18073647
- https://saruwakakun.com/html-css/reference/css-sample#section1
