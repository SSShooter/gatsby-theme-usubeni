# UsubeniFantasy

## 使用

fork 本项目，在 `pages` 文件夹添加新文章。可以通过 `node createPost post-title` or `node createPost post-title 2017-07-26` 创建新文章。

本模板基于 Gatsby.js，相对于 hexo 上手有一点门槛，不过这个代价换来的是比较大的自由度。使用相关问题在[博客里](https://ssshooter.com/tag/gatsby/)解释了一部分。

- 本模板已集成 LaTeX（katex）

## 开发

```
yarn
npm start
```

## 部署

```
npm run build
```

## 评论系统

自带了评论渲染和发布组件（`src\components\Comment.js`），但是后端未开源，能干的大佬们可以小改一下接入自己的评论系统。

也可以接其他系统例如：

- 静态方案，Staticman
- 自己掌控数据，[valine](https://valine.js.org/)
- 第三方，disqus

## 感谢

- https://www.pixiv.net/member_illust.php?mode=medium&illust_id=18073647
- https://saruwakakun.com/html-css/reference/css-sample#section1
