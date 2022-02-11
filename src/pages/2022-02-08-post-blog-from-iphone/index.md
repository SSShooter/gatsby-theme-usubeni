---
path: '/post-blog-from-iphone'
date: '2022-02-11T17:38:54.406Z'
title: '用 iPhone 发布静态博客'
tags: ['coding']
---

## 先打脸

[之前写的通过语雀发布博客](https://ssshooter.com/2019-01-18-gatsby-blog-ex/)根本没什么用，然后在拿到 iPhone 13 pm 之后想起 iOS 似乎有一个很厉害的效率应用 Shortcuts（拿着锤子容易看到钉子？），于是整了这么一个活，不需要写 iOS 客户端，直接用 iPhone 发布静态博客。

## 前置知识

### 用 API 更新 GitHub 仓库

实现这个流程首先必须知道怎么用 API 更新 GitHub 仓库，这个问题[之前也提过](https://ssshooter.com/2019-01-09-github-api-commit/)，更新一个文件还是挺好理解的。

这里再来复习一遍吧，这个步骤跟之前的文章写的差不多不过改进了一下：

1. 获取 Ref：Ref 指 [Git 的引用](https://git-scm.com/book/zh/v2/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-Git-%E5%BC%95%E7%94%A8)，Ref 指向一个 commit 会让你更容易找到这个 commit，否则你就要用它的 SHA-1 值来寻找。例如 `heads/master` 就是一个 Ref，这样你就可以用这个 Ref 找到 master 最新的提交，而不是记一串哈希值。换言之获取 Ref 这一步做的就是获取 最新 commit 的哈希值。
2. 获取 Commit 信息：用于获取当前 Commit 的 tree 的 sha，在第 5 步生成 tree 的时候需要用到老 tree 的信息。
3. 生成 Blob：相当于正常本地提交的 add 操作。
4. 生成 Tree：构建一个新的 tree。这里需要用到的参数 base_tree 就是来自第 2 步的 Commit 信息。（其实 `/git/trees` 接口允许你在这一步直接传入 content，系统会自动帮你生成 blob，也就是少调第 3 步的一个接口）
5. 生成 Commit：用新的 tree 创建 commit，至此已经完成提交。
6. 更新 Ref：使 master 的 Ref 指到你刚刚提交的版本。

核心代码（函数都是调接口）差不多是这样的：

```javascript
const updateGitHubRes = async function ({
  blob,
  encoding,
  path,
  commitMessage,
}) {
  const ref = await getRef()
  const commitSha = ref.object.sha
  const commitInfo = await getCommitInfo(commitSha)
  const commitTreeSha = commitInfo.tree.sha
  const blob = await createBlob(blob, encoding)
  const tree = await createTree(commitTreeSha, path, blob.sha)
  const newCommit = await createCommit(commitSha, tree.sha, commitMessage)
  await updataRef(newCommit.sha)
}
```

以前的 GitHub api 文档里面更新仓库的步骤是分开多个页面的，现在看是聚合到了[单个页面](https://docs.github.com/en/rest/reference/git)，更方便查阅。另外提一下，调接口需要一个 [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)，然后在请求头加上 `Authorization: 'token ' + process.env.GH_TOKEN`。

### 偷懒的方式

后来我才在[文档](https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents)中找到了更方便的更新接口——`/repos/{owner}/{repo}/contents/{path}`

用这个接口可以不管 git 提交原理直接更新 GitHub 仓库，图方便可以用这个。

### Serverless Function

Serverless 简单来说就是写个函数挂在某个地址，这个地址被访问的时候就会跑对应的函数，在这个函数中可以获取到请求的各种信息，处理完数据返回即可，就是一个轻量化的接口。

在这个场景中，Serverless 简直不能再完美了，因为用 personal access token 不需要登录系统，不存在状态问题；而且涉及到 GitHub 的接口，用国外的服务总比自己在国内开服务器要快。

提供 Serverless Function 的厂商很多，我还是选比较熟悉的 [vercel](https://vercel.com/docs/concepts/functions/serverless-functions)吧，每月有白嫖额度，毕竟正常这个需求也不会用到收费的量（除非疯狂上传图片）。

### 快捷指令

![shortcuts-icon](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/shortcuts-icon.webp)

原名 Workflow，后来成为 iOS 自带 App，算是一个可视化的脚本工具吧。不难懂，但是需要一定时间熟悉操作（而且在 iPhone 操作有点别扭，而且经常触发页面抽搐 bug，感觉 iPad 会舒服多了）。

实现发布功能的核心是里面的 `Get contents of URL` 步骤，基本等同于一个 Ajax 请求，可以随意请求网络接口，有了这个东西，玩法可以说无限多了。

除了请求网络接口，也可以运用 url-scheme 直达本机程序藏得比较深的入口，例如可以做到一键打开健康码、支付码、扫一扫等功能。

## 指令 3 则

下面正式分享 3 条直接在 iPhone 发博的指令，需要的 App 除了自带的快捷指令（shortcuts）和图库，还有 markdown 编辑器 [Taio](https://docs.taio.app/#/cn/integration/shortcuts)，不需要订阅（如果你要用记事本来写 markdown 的话 Taio 也不需要安装）。

### 新建 markdown

本着追求高效的精神，建文件必不可能是手动的，通过下面 5 步可以简单做到：

1. 询问文件名
2. 准备一个文件模板
3. 用 Taio 创建文件（可用其他编辑工具替换）
4. decode 一个 url（这一步必须备注一下，不知道是 bug 还是咋地，不 decode 直接用 url 的话会提示第一步拿到的文件名不能放到 url 里，我就纳闷了，那个文件名明明就是个 text 而且都是英文，咋就不行了）
5. 使用 decode 的 url 通过 Taio 打开刚创建的文件，然后完善一下信息直接开写就可以了

![shortcuts3](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/Shortcuts3.jpg)

### 上传 markdown

1. 输入来源是 share sheet，也就是分享功能（需要在右上角选项里勾上在 share sheet 展示的选项）
2. 填入你的发布接口地址
3. `Get contents of URL` 实际就是发 ajax 请求，数据自己决定，我是用了当前时间、文件内容、文件路径 3 个数据
4. 最后是展示接口返回结果，这步也是可以没有，因为请求报错的话上一步就会停下来并提示你

![shortcuts2](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/Shortcuts2.jpg)

其实还有一点可以改进，上传的时候可以动态修改文章信息的 date，刷新文章更新时间，稍微用一点正则知识就可以了。

### 上传图片

有人要问了，那图片怎么办？有了上面的积累，这还不简单？

在 PC 大家都很常使用 PicGo 加 jsdelivr 当图床，在 iOS 也是一样的。上面都已经说明了传文件的原理，用这个接口传图片也是完全没问题的，在 `createBlob` 的时候可以选择 base64 即可。

流程如下：

1. 在图库选择图片
2. 询问文件名
3. 压缩成 jpg（不压的话文件非常大，而且 heic 文件可能会有的应用打不开？）
4. jpg 转 base64 传到接口
5. 填入你的发布接口地址
6. 发布 base64，创建 blob 时 encoding 记得选 base64
7. 展示接口返回结果

![shortcuts1](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/Shortcuts1.jpg)

## 安卓呢

在用安卓的时候确实没有想过这个问题，但是似乎 [Shortcut Maker](https://play.google.com/store/apps/details?id=rk.android.app.shortcutmaker&hl=en_US&gl=US) 可以做到部分功能。但是跟其他 App 的联动自由度估计受限。

或者直接用 [github.dev](https://github.dev/)，不过缺点是要科学上网，而且编辑区域窄了一点点。

## 写在最后

其实我明白，这只是整活，说不定以后这也是跟语雀发布一样被打脸，根本用不上。

直接用手机更新的场景真的多吗？在手机上写一大段文字的需求确实不多，但是写短的，又感觉没有必要发“博客”，充其量就是个“微博”。

那么要不要在这个静态博客里再加一个微博功能呢（其实看到很多个人博客都有这个功能）？要实现功能简单，但是总觉得静态页面发一句话就跑一次构建性价比有点低，要不要直接内嵌新浪微博页面就算了呢？

类似的还有分享图片的问题，这个静态博客的图区已经几百年没更新了，就是觉得更新体验有点欠缺，而且缺乏图片和文字的联动。要不要也另外找个图博解决这个问题？为此注册了 [Flickr](https://www.flickr.com) 和 [500px](https://500px.com/)，发现免费用户上传图片都有数量限制，虽然事实上也不一定能用完额度，但总觉得收到束缚。最完美的选择——Instagram 也有唯一致命缺点，需要科学上网，哎，难受。

再花点时间想想吧，以前想用自己的评论系统，现在觉得用第三方的说不定更方便；以前觉得图片都集中放在同一个项目里管理方便，后来觉得打包浪费时间不如图床；现在想要在博客里做微博、把图片放到其他社区，未来就真的不会打脸吗？真的不知道，老是黑产品经理需求时时变，其实自己就是这么善变。

<style>
img[alt=shortcuts1],
img[alt=shortcuts2],
img[alt=shortcuts3]{
    width:400px;
    margin-left: 50%;
    transform: translateX(-50%);
}
img[alt=shortcuts-icon]{
    width:100px;
    margin-left: 50%;
    transform: translateX(-50%);
}
</style>
