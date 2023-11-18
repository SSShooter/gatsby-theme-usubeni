# Usubeni

[Usubeni](https://github.com/ssshooter/gatsby-theme-usubeni) is based on [Gatsby.js v5](https://www.gatsbyjs.com/), with example pages available at: https://ssshooter.com/tag/coding/

Gatsby has a slightly higher learning curve compared to Hexo, but it offers greater flexibility in return. Some of the related issues are explained in the [blog](https://ssshooter.com/tag/gatsby/).

P.S. Gatsby.js v4 version is available [here](https://github.com/ssshooter/gatsby-theme-usubeni/tree/V4)

## Usage

Fork or clone this project, install the dependencies, and it is recommended to use **yarn**. Then:

- Modify `gatsby-config.js`
- Modify `src\settings.js`
- The iconfont folder is `src\css\icon`, please replace it if necessary, but be sure to modify the icon name in the configuration file to avoid display issues
- Replace the theme image `src\assets\yozakura.jpg`
- Replace the logo `static\logo.png`
- It is recommended to write blog posts on the master branch, keep the theme branch for theme updates (you can also submit a PR), and then merge it into the master branch
- Add new articles in the `pages` folder, or create them using `node createPost post-title` or `node createPost post-title 2017-07-26`

The features of this theme include:

- Fast (Lighthouse performance score of 90)
- Gatsby-related dependencies are mostly up to date
- Integrated code highlighting (prismjs)
- Integrated LaTeX (katex)
- Configured `.npmrc` to alleviate the pain of installing dependencies
- Added TOC (Table of Contents)
- Built-in image library and tag library
- Built-in (useless) emoji library
- SEO optimization

Advantages of Gatsby:

- High degree of freedom for customizing pages
- One of the few opportunities to experience GraphQL

Disadvantages of Gatsby:

- Steep learning curve
- Has multiple dependencies, but not too many, only about 500m 😂

## Create Post

```
node .\createPost.js -t title -d 2023-11-18 -f
```

`-d` is optional. Use `-f` if you want create only a markdown file (it will create a folder by default).

## Development

```
npm start
```

## Deployment

```
npm run build
```

Optional services such as Gatsby's own cloud, Vercel, or Netlify.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fssshooter%2Fgatsby-theme-usubeni.git&demo-title=Usubeni%20Fantasy&demo-description=Gatsby%20Theme%20For%20Blog&demo-url=gatsby-theme-usubeni.vercel.app)

## Front Matter

```yaml
---
slug: '/first-post'
date: '2022-07-03T21:00:00.171Z'
title: 'Title'
tags: ['coding']
description: 'This is a test page'
released: true
hidden: false
---
```

## Avoid Similarity

Modify the color variables in the `src\css\global.scss` folder to use your favorite colors! This is the simplest way to personalize the theme! (We also welcome PRs for attractive color schemes)

Other typesetting optimizations can refer to [Typography.js](https://github.com/kyleamathews/typography.js/)

## Comment System

The theme comes with a comment rendering and publishing component (`src\components\Comment.js`), but the backend is not open source. Experienced developers can make some modifications to integrate their own comment system.

Other systems that can be integrated include:

- Static solution, Staticman
- Self-controlled data, [valine](https://valine.js.org/), waline, [twikoo](https://github.com/imaegoo/twikoo)
- Third-party, Disqus

## PWA

This template does not enable PWA. Although you can easily enable PWA functionality through `gatsby-plugin-manifest` and `gatsby-plugin-offline`, it is not necessary for personal blogs. Moreover, after enabling PWA, the pre-rendered pages become useless, seemingly due to conflicts between PWA's caching mechanism and multi-page rendering.

## Notes

1. `/archive/` is the full article list, `/tag/xxx/` is the single tag list.

```
released: true
hidden: false
```

2. The `released` field in the article information means that it will not be included in page generation, while `hidden` means that the page will be generated but will not appear in any lists.

3. Make sure that at least one article has complete `frontmatter`, otherwise the build process will be abnormal.

## Acknowledgements

- [The Great Gatsby](https://www.gatsbyjs.com/)
- [Cover image from Pixiv#18073647](https://www.pixiv.net/member_illust.php?mode=medium&illust_id=18073647)
- [You can copy some styles here](https://saruwakakun.com/html-css/reference/css-sample#section1)
