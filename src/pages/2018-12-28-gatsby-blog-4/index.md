---
path: '/gatsby-blog-4'
date: '2018-12-28T08:43:39.412Z'
title: '使用 Gatsby.js 搭建静态博客 4 标签系统'
tags: ['coding', 'gatsby']
---

官方自带标签系统教程，英语过关可以直接阅读[官方教程](https://www.gatsbyjs.org/docs/adding-tags-and-categories-to-blog-posts/)。

以下说一下重点：

**提示：以下所有查询都可以在 `localhost:8000/___graphql` 测试**

建立标签系统只需要以下步骤：

## 在 md 文件添加 tags

```
---
title: "A Trip To the Zoo"
tags: ["animals", "Chicago", "zoos"]
---
```

## 用 graphQL 查询文章标签

```javascript
{
  allMarkdownRemark(
    sort: { order: DESC, fields: [frontmatter___date] }
    limit: 1000
  ) {
    edges {
      node {
        frontmatter {
          path
          tags // 也就添加了这部分
        }
      }
    }
  }
}
```

## 制作标签页面模板（`/tags/{tag}`）

标签页面结构不难，与之前的文章页面差不多，区别在于标签的查询：

```javascript
// 注意 filter
export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            path
          }
        }
      }
    }
  }
`
```
## 修改 `gatsby-node.js`，渲染标签页模板

```javascript
const path = require("path")
const _ = require("lodash")

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve("src/templates/blog.js")
  const tagTemplate = path.resolve("src/templates/tags.js")

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 2000
      ) {
        edges {
          node {
            frontmatter {
              path
              tags
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: blogPostTemplate,
      })
    })

    let tags = []
    // 获取所有文章的 `tags`
    _.each(posts, edge => {
      if (_.get(edge, "node.frontmatter.tags")) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
    })
    // 去重
    tags = _.uniq(tags)

    // 创建标签页
    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag)}/`,
        component: tagTemplate,
        context: {
          tag,
        },
      })
    })
  })
}
```

如果你要把标签页也分页，多加一个循环就行，道理跟主页分页都是一样的：

```javascript
tags.forEach(tag => {
    const total = tag.totalCount
    const numPages = Math.ceil(total / postsPerPage)
    Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
        path:
        i === 0
            ? `/tag/${tag.fieldValue}`
            : `/tag/${tag.fieldValue}/${i + 1}`,
        component: tagTemplate,
        context: {
        tag: tag.fieldValue,
        currentPage: i + 1,
        totalPage: numPages,
        limit: postsPerPage,
        skip: i * postsPerPage,
        },
    })
    })
})
```

这里仅仅是把查询到的文章的所有标签都抽取出来，用以生成标签页，但是标签具体内容的获取依赖于**标签页本身的查询**。


## 制作 `/tags` 页面展示所有标签

重点同样是查询部分：

```javascript
export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      filter: { frontmatter: { published: { ne: false } } }
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
```

`fieldValue` 是标签名，`totalCount` 是包含该标签的文章总数。

## 在之前写好的文章页渲染标签

就是查询的时候多一个标签字段，然后渲染上，完事。

## 下一步

再次提醒，对于数据结构模糊的话直接在 `localhost:8000/___graphql` 查一下就很清晰了。现在这个 blog 已经越来越完善，接下来添加的功能可以说都是非必须的了，下一步先说说页面部署。