---
path: "/gatsby-blog-7"
date: "2019-01-30T17:51:39.952Z"
title: "使用 Gatsby.js 搭建静态博客 7 添加目录"
tags: ["coding","gatsby"]
---

前面说过基本功能已经添加完了，但是生成目录依然是我 TODO 的头号问题。今天终于把这个问题解决了，本来以为要自己解释 md 文件，没想到自带的插件就有这个功能我却没发现。

## 生成目录

### 获取目录数据

生成目录首先要获取目录数据，此功能由插件 `gatsby-transformer-remark` 提供，请务必先安装。

安装后在你需要获取目录的页面的 graphQL 查询代码中添加 `tableOfContents`。`tableOfContents` 后面的 pathToSlugField 用于生成锚点链接地址，默认值为当前文章的 `slug`。在例子中就把地址的前缀改成 md 文件提供的 path 了。这个位置就看你本来的地址怎么配置，如果本来就是 slug 则不用修改，直接写 tableOfContents 不用后面括号的部分。(不过我在实践中发现改了之后地址也不会变，原因未明，谷歌也搜索不到类似的情况)


```javascript
  {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      tableOfContents(pathToSlugField: "frontmatter.path")
      frontmatter {
        title
        tags
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
```

接着你就能得到像这样的目录字符串：

```javascript
"<ul>
<li><a href="/2019-01-08-understand-mvvm/#%E5%89%8D%E8%A8%80">前言</a></li>
<li><a href="/2019-01-08-understand-mvvm/#mvvm-%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF">MVVM 基本信息</a></li>
<li><a href="/2019-01-08-understand-mvvm/#mvvm-%E7%BB%93%E6%9E%84%E5%88%9D%E8%A7%81">MVVM 结构初见</a></li>
<li>
<p><a href="/2019-01-08-understand-mvvm/#mvvm-%E4%B8%8E-mvc-%E7%9A%84%E5%AF%B9%E6%AF%94">MVVM 与 MVC 的对比</a></p>
<ul>
<li><a href="/2019-01-08-understand-mvvm/#vue-%E7%9A%84-mvvm">Vue 的 MVVM</a></li>
<li><a href="/2019-01-08-understand-mvvm/#%E5%89%8D%E7%AB%AF-mvc">前端 MVC</a></li>
</ul>
</li>
<li><a href="/2019-01-08-understand-mvvm/#%E6%8B%93%E5%B1%95%EF%BC%9Areact-%E5%8F%AA%E6%98%AF-mvc-%E7%9A%84-v%EF%BC%9F">拓展：React 只是 MVC 的 V？</a></li>
<li><a href="/2019-01-08-understand-mvvm/#%E7%90%86%E8%A7%A3%E3%80%81%E4%BA%A4%E6%B5%81">理解、交流</a></li>
</ul>"
```

参考链接：https://www.gatsbyjs.org/packages/gatsby-transformer-remark/


## 注入锚点

你可能觉得上面的字符串塞到网页就大功告成……嗯我当时也这么想。

现在你即使有这么一个带 url 的目录，点击缺不会跳转到对应位置。因为 markdown 转换到 html 之后并没有注入锚点。为解决这个问题要引入一个新插件 gatsby-remark-autolink-headers。

```bash
npm install --save gatsby-remark-autolink-headers
```

安装后进行如下配置

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-autolink-headers`],
      },
    },
  ],
}
```

如果是看过之前的教程的话一定知道我的事例项目用了 prismjs，prismjs 插件与 autolink 有迷之冲突，一定要把 autolink 放前，prismjs 放后：

```javascript
// good
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      `gatsby-remark-autolink-headers`,
      `gatsby-remark-prismjs`,
    ],
  },
}

// bad
{
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      `gatsby-remark-prismjs`, // should be placed after `gatsby-remark-autolink-headers`
      `gatsby-remark-autolink-headers`,
    ],
  },
}
```

添加成功后由 md 文件转换得到的 html 字符串里的标题就会都带上 id，这样锚链接就能正常使用啦！

参考链接：https://www.gatsbyjs.org/packages/gatsby-remark-autolink-headers/

## 调整样式

以下是我的样式代码，因为框架的全局样式对 ul 和 li 的影响挺大的，所以不少代码是用于修复的。另外是用媒体查询在大屏时把目录固定到左下角。

```sass
.css-toc {
  color: $titleColor;
  padding: 15px;
  background: #fcfaf2;
  margin-bottom: 25px;
  > ul {
    padding-left: 16px;
  }
  ul {
    list-style-type: square;
    list-style-position: outside;
    margin-bottom: 0;
    p {
      vertical-align: top;
      display: inline-block;
    }
  }
  li {
    margin-bottom: 0;
  }
  li > p {
    margin-bottom: 0;
  }
  li > ul {
    margin-top: 0;
  }
}

@media screen and (min-width: 1045px) {
  .css-toc {
    position: fixed;
    bottom: 0;
    right: 0;
    width: 200px;
    max-height: 400px;
    overflow: scroll;
    font-size: 14px;
    li > ul {
      margin-left: 1rem;
    }
  }
}

```

## 完成效果图

![预览图](https://image-static.segmentfault.com/140/257/1402578571-5c524b4437146)
