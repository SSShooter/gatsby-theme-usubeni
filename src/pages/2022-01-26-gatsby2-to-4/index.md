---
path: '/gatsby2-to-4'
date: '2022-01-26T11:17:12.822Z'
title: 'Gatsby 2.x 升级 4.x'
tags: ['本站历史','gatsby']
---

before：

```json
{
  "dependencies": {
    "axios": "0.21.1",
    "fast-exif": "^1.0.1",
    "gatsby": "^2.1.4",
    "gatsby-image": "^2.0.22",
    "gatsby-plugin-feed": "^2.0.8",
    "gatsby-plugin-google-analytics": "^2.0.8",
    "gatsby-plugin-manifest": "^2.0.5",
    "gatsby-plugin-offline": "^2.0.5",
    "gatsby-plugin-react-helmet": "^3.0.0",
    "gatsby-plugin-sass": "^2.0.5",
    "gatsby-plugin-sharp": "^2.0.20",
    "gatsby-plugin-sitemap": "^2.0.3",
    "gatsby-plugin-typography": "^2.2.0",
    "gatsby-remark-autolink-headers": "^2.0.12",
    "gatsby-remark-copy-linked-files": "^2.0.5",
    "gatsby-remark-images": "^2.0.4",
    "gatsby-remark-prismjs": "^3.0.0",
    "gatsby-remark-responsive-iframe": "^2.0.5",
    "gatsby-remark-smartypants": "^2.0.5",
    "gatsby-source-filesystem": "^2.0.20",
    "gatsby-transformer-remark": "^2.1.6",
    "gatsby-transformer-sharp": "^2.1.3",
    "gatsby-transformer-yaml": "^2.1.6",
    "node-sass": "^4.10.0",
    "prismjs": "^1.15.0",
    "react": "^16.5.1",
    "react-dom": "^16.5.1",
    "react-helmet": "^5.2.0",
    "react-masonry-component": "^6.2.1",
    "react-typography": "^0.16.13",
    "typeface-merriweather": "0.0.43",
    "typeface-montserrat": "0.0.43",
    "typography": "^0.16.17",
    "typography-theme-wordpress-2016": "^0.15.10",
    "postcss": "^8.2.1"
  },
  "devDependencies": {
    "eslint": "^4.19.1",
    "eslint-plugin-react": "^7.11.1",
    "gatsby-remark-prismjs-title": "^1.0.0",
    "gh-pages": "^1.2.0",
    "prettier": "^1.14.2"
  }
}
```

after：

```json
{
  "dependencies": {
    "axios": "0.25.0",
    "fast-exif": "^1.0.1",
    "gatsby": "^4.6.0",
    "gatsby-image": "^3.11.0",
    "gatsby-plugin-feed": "^4.6.0",
    "gatsby-plugin-google-analytics": "^4.6.0",
    "gatsby-plugin-manifest": "^4.6.0",
    "gatsby-plugin-offline": "^5.6.0",
    "gatsby-plugin-react-helmet": "^5.6.0",
    "gatsby-plugin-sass": "^5.6.0",
    "gatsby-plugin-sharp": "^4.6.0",
    "gatsby-plugin-sitemap": "^5.6.0",
    "gatsby-plugin-typography": "^4.6.0",
    "gatsby-remark-autolink-headers": "^5.6.0",
    "gatsby-remark-copy-linked-files": "^5.6.0",
    "gatsby-remark-images": "^6.6.0",
    "gatsby-remark-prismjs": "^6.6.0",
    "gatsby-remark-responsive-iframe": "^5.6.0",
    "gatsby-remark-smartypants": "^5.6.0",
    "gatsby-source-filesystem": "^4.6.0",
    "gatsby-transformer-remark": "^5.6.0",
    "gatsby-transformer-sharp": "^4.6.0",
    "gatsby-transformer-yaml": "^4.6.0",
    "node-sass": "^6.0.0",
    "postcss": "^8.2.1",
    "prismjs": "^1.15.0",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-helmet": "^6.1.0",
    "react-masonry-component": "^6.2.1",
    "react-typography": "^0.16.13",
    "typeface-merriweather": "1.1.13",
    "typeface-montserrat": "1.1.13",
    "typography": "^0.16.17",
    "typography-theme-wordpress-2016": "^0.15.10"
  },
  "devDependencies": {
    "eslint": "^8.7.0",
    "eslint-plugin-react": "^7.11.1",
    "gatsby-remark-prismjs-title": "^1.0.0",
    "gh-pages": "^1.2.0",
    "prettier": "^2.5.1"
  },
}
```

`yarn upgrade-interactive --latest` 一把梭！批量更新没毛病，实在惊人，真的没想到 Gatsby 2 到 4 跨两个大版本，基本上把依赖更新一遍就跑起来了，赞美 yarn！

除了 `gatsby-plugin-feed` 的配置有一点改变以及 `node-sass` 的版本更得太新，其他基本没啥问题，可能是因为这个小破站用到的功能就非常少吧。虽然还有 `gatsby-image` 到 `gatsby-plugin-image` 的迁移，不过这个也不是强制的，按需求来吧。

升级之后 graphQL 的查询页面好用多了，至于速度快没快嘛……开发是变快了，因为延后了一些页面的生成，但是生产，估计也就差不多的速度，不过也在这呼吁大家，如果自己的 Gatsby 静态博客不复杂的话，请**勇敢升级**，完全不会花很多时间~

PS. 最麻烦的果然还是下载资源，请灵活运用 `npm config set proxy`