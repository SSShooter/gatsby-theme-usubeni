---
path: '/github-api-commit'
date: '2019-01-09T08:24:42.000Z'
title: '使用 Github API 更新仓库'
tags: ['coding', 'github', 'git']
---

## 0. 总览

本文为大家提供一种使用 GitHub API 生成 Commit 的方法。通常我们会使用 Git 客户端 Commit 然后 Push 到 GitHub，但 GitHub 为我们提供了相关 API，可以直接通过 API 更新仓库。

要搞清楚整个更新流程，需要先理解 Git 的数据结构。如下图所示，Git 会使用 Ref、Commit、Tree、Blob 等单位管理 Commit 和文件。
![](https://cdn.nlark.com/yuque/0/2019/png/196955/1547024344082-e04117d4-f97d-4bdc-aec8-1d17fe336835.png#align=left&display=inline&height=555&linkTarget=_blank&originHeight=595&originWidth=800&size=0&width=746)
所以要生成一个新的 Commit，需要从树状结构的叶到根按顺序生成，换句话说就是：Blob→Tree→Commit→Ref。

使用 GitHub API 提交文件有以下步骤。虽然对于第一次接触的新手来说可能会有点复杂，但是理清关系之后思路便会很清晰了。

1. 获取 Ref：Ref 指 [Git 的引用](https://git-scm.com/book/zh/v2/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-Git-%E5%BC%95%E7%94%A8)。如果要发起 Commit，必须知道你的 Commit 要提交到什么地方去（Commit 是一个接一个的链状关系，所以需要知道上一个 Commit 的信息），这一步做的就是这件事。
1. 获取 Commit：用于获取当前 Commit 的 tree 的 sha。
1. 生成 Blob：相当于正常本地提交的 add 操作。
1. 生成 Tree：构建一个新的 tree。这里需要用到的参数 base_tree 就是来自第二步的 Commit 信息。
1. 生成 Commit：提交你的 tree。至此已经完成提交。
1. 更新 Ref：使 master 的指针指到你最新提交的版本。

注意：访问 POST 方法的接口必须带 token，虽然 GET 可以不带，但是会限制访问频率，所以建议都带上。相关文档：[https://developer.github.com/v3/#authentication](https://developer.github.com/v3/#authentication)

## 1. 获取 Ref

### 1.1 文档地址

[https://developer.github.com/v3/git/refs/#get-a-reference](https://developer.github.com/v3/git/refs/#get-a-reference)

### 1.2 请求地址

`GET https://api.github.com/repos/ssshooter/test/git/refs/heads/master`

### 1.3 返回数据

```json
{
  "ref": "refs/heads/master",
  "node_id": "MDM6UmVmMTY0Nzk4NDczOm1hc3Rlcg==",
  "url": "https://api.github.com/repos/ssshooter/test/git/refs/heads/master",
  "object": {
    "sha": "cda66de943082033f4b761639df77728d7bca4f0",
    "type": "commit",
    "url": "https://api.github.com/repos/ssshooter/test/git/commits/cda66de943082033f4b761639df77728d7bca4f0"
  }
}
```

## 2. 获取 Commit

### 2.1 文档地址

[https://developer.github.com/v3/git/commits/#get-a-commit](https://developer.github.com/v3/git/commits/#get-a-commit)

### 2.2 请求地址

`GET https://api.github.com/repos/ssshooter/test/git/commits/cda66de943082033f4b761639df77728d7bca4f0`

### 2.3 返回数据

```json
{
  "sha": "cda66de943082033f4b761639df77728d7bca4f0",
  "node_id": "MDY6Q29tbWl0MTY0Nzk4NDczOmNkYTY2ZGU5NDMwODIwMzNmNGI3NjE2MzlkZjc3NzI4ZDdiY2E0ZjA=",
  "url": "https://api.github.com/repos/ssshooter/test/git/commits/cda66de943082033f4b761639df77728d7bca4f0",
  "html_url": "https://github.com/ssshooter/test/commit/cda66de943082033f4b761639df77728d7bca4f0",
  "author": {
    "name": "DeJavuJo",
    "email": "ssshooterx@gmail.com",
    "date": "2019-01-09T06:02:07Z"
  },
  "committer": {
    "name": "GitHub",
    "email": "noreply@github.com",
    "date": "2019-01-09T06:02:07Z"
  },
  "tree": {
    "sha": "d7a57d28ace0db12773c7d70675f94a48da6421f",
    "url": "https://api.github.com/repos/ssshooter/test/git/trees/d7a57d28ace0db12773c7d70675f94a48da6421f"
  },
  "message": "Create readme.md",
  "parents": [],
  "verification": {
    "verified": true,
    "reason": "valid",
    "signature": "-----BEGIN PGP SIGNATURE-----\n\nwsBcBAABCAAQBQJcNY5fCRBK7hj4Ov3rIwAAdHIIABh8I89hATqg1mSYtpx1aY\nJt/woDobMO7FGE5qXO0NNrCMqwF6mdPJOMMMZvVWF1ULTm8ZJ52GAh5xAnPMZEnQ\n8tTjj/Qc0eZCm5B1xO66rgx+7eKkeGUPJj5bX7Lf0i9Se70Ff0jaCdH94RgiSL2d\nclDLhNyM4u6AH//k7S3Ud1O6ezXd4+99381Xa331PDLhJttUAbRFRCThszbcxRUT\nPvyhPNvXB5ug4J+tAMaZJvZEaED0c1k2Yx1+TYkLvPjOlqXvqaDVpMZieluD5l+f\nu13NAoCnLfBe0Skak/8MxRDbMcJYNW78ll60HAa6jJtElD8Vkek8WoVAZ8p3iIE=\n=xI87\n-----END PGP SIGNATURE-----\n",
    "payload": "tree d7a57d28ace0db12773c7d70675f94a48da6421f\nauthor DeJavuJo  1547013727 +0800\ncommitter GitHub  1547013727 +0800\n\nCreate readme.md"
  }
}
```

## 3. 生成 Blob

### 3.1 文档地址

[https://developer.github.com/v3/git/blobs/#create-a-blob](https://developer.github.com/v3/git/blobs/#create-a-blob)

### 3.2 请求地址

`POST https://api.github.com/repos/ssshooter/test/git/blobs`

### 3.3 请求参数

```
{
  "content": "Content of the blob",
  "encoding": "utf-8"
}
```

### 3.4 返回数据

```
{
    "sha": "929246f65aab4d636cb229c790f966afc332c124",
    "url": "https://api.github.com/repos/ssshooter/test/git/blobs/929246f65aab4d636cb229c790f966afc332c124"
}
```

## 4. 生成 tree

### 4.1 文档地址

[https://developer.github.com/v3/git/trees/#create-a-tree](https://developer.github.com/v3/git/trees/#create-a-tree)

### 4.2 请求地址

`POST https://api.github.com/repos/ssshooter/test/git/trees`

### 4.3 请求参数

注意：tree.path 可以写深层目录，如  deep/deep/newFile.md（前面不用写斜杠）

```javascript
{
  "base_tree": "d7a57d28ace0db12773c7d70675f94a48da6421f", // commit tree 的 sha
  "tree": [
    {
      "path": "apiCommitFile.md", // 文件路径
      "mode": "100644", // 类型，详情看文档
      "type": "blob",
      "sha": "929246f65aab4d636cb229c790f966afc332c124" // 刚才生成的 blob 的 sha
    }
  ]
}
```

### 4.4 返回数据

```
{
    "sha": "2b3a65095ceb7cf4425f52d59ca5974d826cff80",
    "url": "https://api.github.com/repos/ssshooter/test/git/trees/2b3a65095ceb7cf4425f52d59ca5974d826cff80",
    "tree": [
        {
            "path": "readme.md",
            "mode": "100644",
            "type": "blob",
            "sha": "b1b716105590454bfc4c0247f193a04088f39c7f",
            "size": 5,
            "url": "https://api.github.com/repos/ssshooter/test/git/blobs/b1b716105590454bfc4c0247f193a04088f39c7f"
        },
        {
            "path": "tree",
            "mode": "040000",
            "type": "tree",
            "sha": "91d8d59147e395effaeacd01c9d8553b37cf77c5",
            "url": "https://api.github.com/repos/ssshooter/test/git/trees/91d8d59147e395effaeacd01c9d8553b37cf77c5"
        }
    ],
    "truncated": false
}
```

## 5. 生成 Commit

### 5.1 文档地址

[https://developer.github.com/v3/git/commits/#create-a-commit](https://developer.github.com/v3/git/commits/#create-a-commit)

### 5.2 请求地址

```
POST https://api.github.com/repos/ssshooter/test/git/commits
```

### 5.3 请求参数

```
{
  "message": "a Commit with GitHub api",
  "parents": [
    "cda66de943082033f4b761639df77728d7bca4f0"
  ],
  "tree": "2b3a65095ceb7cf4425f52d59ca5974d826cff80"
}
```

### 5.4 返回数据

```
{
    "sha": "45c58a9358b67fc81e4034cb36c5196d791686ef",
    "node_id": "MDY6Q29tbWl0MTY0Nzk4NDczOjQ1YzU4YTkzNThiNjdmYzgxZTQwMzRjYjM2YzUxOTZkNzkxNjg2ZWY=",
    "url": "https://api.github.com/repos/ssshooter/test/git/commits/45c58a9358b67fc81e4034cb36c5196d791686ef",
    "html_url": "https://github.com/ssshooter/test/commit/45c58a9358b67fc81e4034cb36c5196d791686ef",
    "author": {
        "name": "ssshooter",
        "email": "ssshooterx@gmail.com",
        "date": "2019-01-09T10:24:10Z"
    },
    "committer": {
        "name": "ssshooter",
        "email": "ssshooterx@gmail.com",
        "date": "2019-01-09T10:24:10Z"
    },
    "tree": {
        "sha": "2b3a65095ceb7cf4425f52d59ca5974d826cff80",
        "url": "https://api.github.com/repos/ssshooter/test/git/trees/2b3a65095ceb7cf4425f52d59ca5974d826cff80"
    },
    "message": "a Commit with GitHub api",
    "parents": [
        {
            "sha": "cda66de943082033f4b761639df77728d7bca4f0",
            "url": "https://api.github.com/repos/ssshooter/test/git/commits/cda66de943082033f4b761639df77728d7bca4f0",
            "html_url": "https://github.com/ssshooter/test/commit/cda66de943082033f4b761639df77728d7bca4f0"
        }
    ],
    "verification": {
        "verified": false,
        "reason": "unsigned",
        "signature": null,
        "payload": null
    }
}
```

## 6. 更新 Ref

### 6.1 文档地址

[https://developer.github.com/v3/git/refs/#update-a-reference](https://developer.github.com/v3/git/refs/#update-a-reference)

### 6.2 请求地址

`https://api.github.com/repos/ssshooter/test/git/refs/heads/master`

### 6.3 请求参数

```
{
	"sha":"45c58a9358b67fc81e4034cb36c5196d791686ef",
	"force":true
}
```

### 6.4 返回数据

```
{
    "ref": "refs/heads/master",
    "node_id": "MDM6UmVmMTY0Nzk4NDczOm1hc3Rlcg==",
    "url": "https://api.github.com/repos/ssshooter/test/git/refs/heads/master",
    "object": {
        "sha": "45c58a9358b67fc81e4034cb36c5196d791686ef",
        "type": "commit",
        "url": "https://api.github.com/repos/ssshooter/test/git/commits/45c58a9358b67fc81e4034cb36c5196d791686ef"
    }
}
```

## 7. node.js 实践代码

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

var createCommit = function (parentCommitSha, tree, message = 'update post') {
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

## 参考文献

- [GitHub の Git Data API でコミットを作成する](https://int128.hatenablog.com/entry/2017/09/05/161641)
- [马蹄疾 | 2018(农历年)封山之作，和我一起嚼烂 Git(两万字长文)](https://juejin.im/post/5c33f49de51d45523070f7bb)
- [Git 内部原理 - Git 引用](https://git-scm.com/book/zh/v2/Git-%E5%86%85%E9%83%A8%E5%8E%9F%E7%90%86-Git-%E5%BC%95%E7%94%A8)
