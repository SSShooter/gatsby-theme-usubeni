---
path: '/atlassian-confluence-api-guide'
date: '2019-05-20T15:23:55.062Z'
title: 'Atlassian Confluence API 简易指引'
tags: ['coding']
---

下面主要包括一些 confluence 官方 API 的一些简单使用例子，主要参考了：

- 文档本体：https://docs.atlassian.com/ConfluenceServer/rest/6.15.4/
- 另外，感谢 Atlassian 社区

## 前置

直接请求数据的话可能会给你返回 403，或者直接不给你报错，返回空数组。这当然是因为你根本还没登陆，为解决这个问题，需要在 headers 添加 Authorization 字段，值为 Basic，空格，后面接 base64 编码的 `用户名:密码`。

```javascript
headers = {
  Authorization: 'Basic ' + btoa('admin:admin'),
}
```

## 空间（space）相关

获取所有空间，传参可搜索：

GET /rest/api/space

返回某空间所有页面，并且填充了 ancestors 字段，**你可以用这个接口构造一个 space 的结构树**。

GET /rest/api/space/PUBLICSPACE/content?expand=ancestors&limit=999999

**在创建页面的时候必须指定空间**

## 页面（page）相关

### 创建页面

POST /rest/api/content

请求参数：

```json
{
  "title": "create via api",
  "type": "page",
  "space": { "key": "PUBLICSPACE" },
  "body": {
    "storage": {
      "value": "<p>New page data.</p>",
      "representation": "storage"
    }
  }
}
```

`space` 字段为必填项，由上面的 space 列表获取，并且试了一下用 space id 是不能正确提交的，会报 `"Could not create content with type page"` 错误，然而这个错误跟 type 完全没有关系，只是你的 space key 写错了，不知道为什么这个错误直到现在也没有（或者无法）修复。

### 获取页面

使用 id 获取页面：

GET /rest/api/content/{id}?expand=space,body.view,version

**参数 expand 用于扩展返回数据字段**

当然你也可以用搜索的方式获取，返回匹配数组：

GET /rest/api/content?title=yourtitle

返回的数据重点有这些:

- id：可以用于查询和修改，
- body.view：用于展示数据，
- version：更新的必要字段

### 更新页面

PUT /rest/api/content/{id}

请求参数：

```json
{
  "version": {
    "number": 5
  },
  "title": "My new title",
  "type": "page",
  "body": {
    "storage": {
      "value": "<p>New page data.aaa</p>",
      "representation": "storage"
    }
  }
}
```

**version 是必须的**，版本错误会报错，所以必须先获取一次版本信息再更新内容。

## 子页面相关

### 创建子页面

POST /rest/api/content

```json
{
  "title": "create via api111",
  "type": "page",
  "space": {
    "key": "PUBLICSPACE"
  },
  "ancestors": [
    {
      "id": 63680669
    }
  ],
  "body": {
    "storage": {
      "value": "val",
      "representation": "storage"
    }
  }
}
```

与上面创建页面基本一样，就多出了一个 `ancestors` 字段，填上父节点 id 即可。

### 查询子页面

GET /rest/api/content/{id}/child?expand=page.body.VIEW

返回子页面数组

GET /rest/api/content/{id}/child/page?expand=children.page

递归查找子页面

## 评论（comment）相关

### 创建评论

没有看错，接口地址是跟创建页面一样的：

POST /rest/api/content

请求参数：

```json
{
  "body": {
    "storage": {
      "value": "A new comment test",
      "representation": "storage"
    }
  },
  "container": {
    "type": "page",
    "id": "{id}"
  },
  "type": "comment"
}
```

### 获取评论

直接获取评论数组，没什么特别的

/rest/api/content/{id}/child/comment

## 附件（attachment）相关

### 获取附件

GET /rest/api/content/{id}/child/attachment

下载地址在返回数据的 `_links.download`

### 上传附件

上传的例子，接口地址同上

```javascript
var data = new FormData()
data.append('file', files[0])
data.append('comment', 'foobar')
data.append('minorEdit', 'true')
$.ajax({
  type: 'post',
  url: path,
  data,
  processData: false,
  headers: {
    'X-Atlassian-Token': 'nocheck',
  },
  contentType: false,
  cache: false,
  success: function(data, status, response) {
    for (var pair of data.entries()) {
      console.log(pair[0] + ', ' + pair[1])
    }
  },
  error: function(response) {
    console.log(response)
  },
})
```
