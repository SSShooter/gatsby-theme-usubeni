---
path: '/gatsby-blog-ex'
date: '2019-01-18T01:38:40.000Z'
title: '使用 Gatsby.js 搭建静态博客 EX 使用语雀发布到博客'
tags: ['coding', 'gatsby']
---

偶然看到通过语雀 webhook 发布文章到 Hexo 静态博客，很方便，实现过程也很有意思。同样的原理可以运用到 Gatsby.js 博客上。
因为使用了 netlify，自动部署的事情就不用自己担心了，本文讲述的有一下两点：

1. 熟悉语雀 webhook
1. 使用 GitHub api 更新 GitHub 仓库（更新仓库后 netlify 自动部署）

除了以上两个重点，整个流程是：
在语雀发布文章 -> 触发语雀 webhook -> express（node.js）接收到文章推送 -> 请求信息中抽取文章内容和必要信息 -> 调用 GitHub api 更新仓库 -> netlify 自动部署 -> 文章在博客发布

## 语雀 webhook

[语雀 webhook 文档](https://www.yuque.com/yuque/developer/doc-webhook) 自带完整指引，以下讲讲关键步骤。

### 在知识库页面配置订阅地址

![](/blog-image/yuque1.png)

### 本地测试

官方推荐使用 [ngrok](https://ngrok.com)，ngrok 能让你的本地服务暴露到外网，方便测试。我的配置：

![](/blog-image/yuque2.png)

### express 接收 webhook 推送

```javascript
app.post('/yuque/webhook', function (req, res) {
  console.log(req.body.data)
})
```

此时在语雀发布文章，接口就会收到推送的文章信息。

## GitHub api 更新仓库

### 原理

使用 api 更新 GitHub 仓库的方法可以参考：[使用 Github API 更新仓库](https://segmentfault.com/a/1190000017892958?_ea=6285613)

### 主要代码

```javascript
var updateGitHubRes = function (blob, path) {
  var commitSha
  var commitTreeSha
  return getRef()
    .then(({ data }) => {
      commitSha = data.object.sha
      return getCommit(commitSha)
    })
    .then(({ data }) => {
      commitTreeSha = data.tree.sha
      return createBlob(blob)
    })
    .then(({ data }) => {
      var blobSha = data.sha
      return createTree(commitTreeSha, path, blobSha)
    })
    .then(({ data }) => {
      var treeSha = data.sha
      return createCommit(commitSha, treeSha)
    })
    .then(({ data }) => {
      var newCommitSha = data.sha
      return updataRef(newCommitSha)
    })
    .catch((err) => {
      console.log(err)
    })
}
var getRef = function () {
  return axios.get(`/${owner}/${repo}/git/refs/heads/master`)
}
var getCommit = function (commitSha) {
  return axios.get(`/${owner}/${repo}/git/commits/${commitSha}`)
}
var createBlob = function (content) {
  return axios.post(`/${owner}/${repo}/git/blobs`, {
    content,
    encoding: 'utf-8',
  })
}
var createTree = function (base_tree, path, sha) {
  return axios.post(`/${owner}/${repo}/git/trees`, {
    base_tree, // commit tree 的 sha
    tree: [
      {
        path, // 文件路径
        mode: '100644', // 类型，详情看文档
        type: 'blob',
        sha, // 刚才生成的 blob 的 sha
      },
    ],
  })
}
var createCommit = function (
  parentCommitSha,
  tree,
  message = ':memo: update post'
) {
  return axios.post(`/${owner}/${repo}/git/commits`, {
    message,
    parents: [parentCommitSha],
    tree,
  })
}
var updataRef = function (newCommitSha) {
  return axios.post(`/${owner}/${repo}/git/refs/heads/master`, {
    sha: newCommitSha,
    force: true,
  })
}
```

## 组合

把接受 webhook 请求的功能和 GitHub 更新流程组合起来，有如下代码：

```javascript
app.post('/yuque/webhook', function(req, res) {
  console.log('web hook')
  var postData = req.body.data
  if (!postData) {
    console.log('nothing append')
    return res.json({
      msg: 'nothing append'
    })
  }
  var title = postData.title
  var date = postData.created_at
  var content = postData.body
  var tagsReg = new RegExp(/(?<=).*(?=<\/tags>)/)
  var removeTagsReg = new RegExp(/.*<\/tags>/)
  var pathReg = new RegExp(/(?<=).*(?=<\/path>)/)
  var removePathReg = new RegExp(/.*<\/path>/)
  var replaceBrReg = new RegExp(/
/g)
  var tags = content.match(tagsReg)
  content = content.replace(removeTagsReg, '')
  var postPath = content.match(pathReg)
  content = content.replace(removePathReg, '')
  content = content.replace(replaceBrReg, '\n')
  tags = tags && tags[0]
  postPath = postPath && postPath[0]
  var tagsString = JSON.stringify(tags.split(','))
  var contentHeader = `---
path: "${postPath}"
date: "${date}"
title: "${title}"
tags: ${tagsString}
---
`
  updateGitHubRes(
    contentHeader + content,
    `src/pages/${date.substring(0, 10)}-${postPath.substring(1)}/index.md`
  ).then(({ data }) => {
    console.log('finish')
    return res.json({
      msg: 'finish'
    })
  })
})
```

因为语雀没有 tag 之类的选项，只能自己用特定标记写到文章里再在后端提取，并且添加信息头部。内容组合好调用更新 api 即可完成整个流程。

## 功能部署

如果你自己有服务器，正常部署即可，若没有，可以使用 **Heroku**。Heroku 可以为你提供免费的程序部署服务。你可以先把上面写好的功能上传到 GitHub，然后从选择从 GitHub 拉取仓库。拉取仓库后 Heroku 会自动运行 `npm start`。
`npm start` 映射到 `node index.js` 就可以了。
值得注意的是，heroku 的端口是系统分配的，所以需要使用环境变量提供的端口：

```javascript
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Our app is running on port ${PORT}`)
})
```

## 大功告成

在语雀发布文章即可在博客同时发布，这确实比手写 md 再 push 发布只方便了一点，但是更让人期待的是语雀移动端的上线！那么之后就能直接在手机更新静态博客了！不过有点地方还是想吐槽，语雀的 md 编辑器有时候会语法失效，而且不能直接看到 md 代码，总觉得对格式有种不能完全控制源码的束缚感。

## 2022.2.8 更新

1. 语雀返回的数据长这样：

```
"wow, it's a test file!\n" +
'<a name="jvKnj"></a>\n' +
'## 试一试 h2\n' +
'**试一试加粗**<br />**按钮的加粗**<br />_斜体_\n' +
'> 引用\n' +
'\n',
```

在编辑器长这样：

![](/blog-image/yuque3.png)

洁癖人估计是受不了，包括我，所以一直以来也都没有再使用这种方法更新，特地回来打自己脸。

2. 现在图片有防盗链

要加一行 meta 隐藏 referrer 才能正常看图

```html
<meta name="referrer" content="no-referrer" />
```
