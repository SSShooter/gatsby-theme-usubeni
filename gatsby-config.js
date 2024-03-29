const gatsbyFeedConfig = require('./gatsby-feed-config.js')
const gatsbyMarkdownConfig = require('./gatsby-markdown-config.js')
module.exports = {
  siteMetadata: {
    title: 'Usubeni Fantasy',
    author: 'ssshooter',
    description: '次の千年へ　夢を紡いで',
    siteUrl: 'https://ssshooter.com',
    keywords: ['编程', '生活'],
  },
  jsxRuntime: 'automatic',
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `meme`,
        path: `${__dirname}/src/meme/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `gallery`,
        path: `${__dirname}/src/gallery/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `assets`,
        path: `${__dirname}/src/assets/`,
      },
    },
    gatsbyFeedConfig,
    gatsbyMarkdownConfig,
    'gatsby-transformer-yaml',
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          // Google Analytics / GA
          // "AW-CONVERSION_ID", // Google Ads / Adwords / AW
          // "DC-FLOODIGHT_ID", // Marketing Platform advertising products
        ],
      },
    },
  ],
}
