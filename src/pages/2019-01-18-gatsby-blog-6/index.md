---
path: "/gatsby-blog-5"
date: "2019-01-18T13:14:00.000Z"
title: "使用 Gatsby.js 搭建静态博客 6 评论系统"
tags: ["coding","gatsby"]
---

## 方案选择

大家都知道 [disqus](https://disqus.com/) 等第三方评论系统的存在。disqus 几年前还是挺好使的，但是现在已经是不存在的网站了。虽然国内也有类似的服务，但是免费档位有可能会有大篇幅的广告。

不过其实最大的问题是：你的评论掌握在别人手上。作为一个博客都自己搭建的程序员，为什么要让数据落在别人手上呢？

掌握自己的评论数据有两个方法：

1. 自建接口，储存评论数据，页面也是动态获取数据。
2. 使用接口在 github 仓库更新评论信息，然后重新生成包含最新评论的静态页面。

[官网推荐](https://www.gatsbyjs.org/blog/2018-04-10-how-to-handle-comments-in-gatsby-blogs/)的是第二种方法，借助一个叫 [staticman](https://staticman.net/) 的开源工具。推荐原因有 3：

- 自己掌控数据
- 服务崩溃时也能展示评论（针对第三方评论系统和上面动态获取评论的方案 1 的问题）
- staticman 集成了 akismet 过滤垃圾评论

所以本文着重说明 staticman 的使用方法（如果想使用第一种方案可以依赖 [strapi](https://strapi.io/) 框架）。因为我之前使用 staticman 本身的服务接口不能调通，但是本地测试可以，所以我决定部署自己的 staticman。

## 部署自己的 staticman
staticman 的原理就是使用 GitHub 接口把评论更新到你静态博客的仓库，触发博客重新部署，在页面生成评论。这样得到的博客页面包括评论部分都是完全静态的。

> 对 GitHub 接口更新仓库感兴趣的话可以参考[使用 Github API 更新仓库](https://segmentfault.com/a/1190000017892958)

首先 clone staticman 的[官方仓库](https://github.com/eduardoboucas/staticman)。你可以先在本地测试运行，也可以直接部署到云端（需要免费服务的话依然推荐 heroku）。

## staticman 部署配置
在生产环境，首先需要一个生产环境的配置文件 `config.production.json`。

可以通过 `cp config.sample.json config.production.json` 生成配置文件。这个[配置文件](https://github.com/eduardoboucas/staticman/blob/master/config.js)里面甚至自带文档，可以很清晰看出每个项目的作用。

其中最重要的是两个配置项：

```javascript
  githubToken: {
    doc: 'Access token to the GitHub account being used to push files with.',
    format: String,
    default: null,
    env: 'GITHUB_TOKEN'
  },
  rsaPrivateKey: {
    doc: 'RSA private key to encrypt sensitive configuration parameters with.',
    docExample: 'rsaPrivateKey: "-----BEGIN RSA PRIVATE KEY-----\\nkey\\n-----END RSA PRIVATE KEY-----"',
    format: String,
    default: null,
    env: 'RSA_PRIVATE_KEY'
  },
```

第一个 githubToken 用于获取修改你的仓库权限的 token，**必须注意**这个 token **不能泄漏**，不然别人就能随便修改的你仓库了。第二个是用于加密留言中的邮箱。

配置完毕推送到 heroku 或本地运行 `npm start`。（运行环境会根据 `NODE_ENV` 判断）

## staticman 应用于你的仓库

发送以下 Get 请求
```
http://your-staticman-url/v2/connect/GITHUB-USERNAME/GITHUB-REPOSITORY
```

## staticman 推送配置

在根目录创建 `staticman.yml` 文件，可以参考：https://github.com/eduardoboucas/staticman/blob/master/staticman.sample.yml

>PS. 如果将配置中的 `moderation` 设为 true，推送到仓库后不会直接合并而是先提出一个 PR。

这个配置的目的是确定你传入到仓库的数据格式，对应的表格应该类似：

```html
<form method="POST" action="https://api.staticman.net/v2/entry/eduardoboucas/staticman/gh-pages/comments">
  <input name="options[redirect]" type="hidden" value="https://my-site.com">
  <!-- e.g. "2016-01-02-this-is-a-post" -->
  <input name="options[slug]" type="hidden" value="{{ page.slug }}">
  <label><input name="fields[name]" type="text">Name</label>
  <label><input name="fields[email]" type="email">E-mail</label>
  <label><textarea name="fields[message]"></textarea>Message</label>
  
  <button type="submit">Go!</button>
</form>
```

更新请求：
```
POST https://api.staticman.net/v2/entry/{GITHUB USERNAME}/{GITHUB REPOSITORY}/{BRANCH}/{PROPERTY (optional)}
```

## 功能完成

至此，成功添加评论功能，整个博客的功能也几乎完善。对比之前被放弃的一个 wordpress 和一个 hexo，这次是我第一次从基本模板开始自己添加功能做出来的静态博客，来之不易，希望珍惜，接下来要做的就是继续优化功能和 UI，坚持更新了。