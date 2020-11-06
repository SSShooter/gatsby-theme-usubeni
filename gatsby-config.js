module.exports = {
  siteMetadata: {
    title: 'Usubeni Fantasy',
    author: 'ssshooter',
    description: '次の千年へ　夢を紡いで',
    siteUrl: 'https://ssshooter.com',
  },
  pathPrefix: '/gatsby-starter-blog',
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
    'gatsby-transformer-yaml',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/_data/comments`,
        name: 'comments',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-prismjs-title',
            options: {
              className: 'code-title'
            }
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-autolink-headers`,
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        useMozJpeg: false,
        stripMetadata: true,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-130598883-1`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        // Override if you want to manually specify the RSS "generator" tag.
        generator: "GatsbyJS",
        // Run a default query to gather some information about the site.
        query: "\n    {\n      site {\n        siteMetadata {\n          title\n          description\n          siteUrl\n          site_url: siteUrl\n        }\n      }\n    }\n  ",
        // Create a default RSS feed. Others may be added by using the format below.
        feeds: [{
          query: "\n      {\n        allMarkdownRemark(\n          limit: 8,\n filter:{ frontmatter: { released: { ne: false } } }\n         sort: {\n            order: DESC,\n            fields: [frontmatter___date]\n          }\n        ) {\n          edges {\n            node {\n              frontmatter {\n                title\n                date\n              }\n              fields {\n                slug\n              }\n              excerpt\n              html\n            }\n          }\n        }\n      }\n    ",
          // Where we will save the feed generated by this query.
          output: "rss.xml",
          // Use a title when reference a RSS feed in Link element.
          title: 'usubeni fanstay'
        }]
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `UsubeniFantasy`,
        short_name: `UF`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#663399`,
        display: `UsubeniFantasy`,
        icon: `static/mstile-150x150.png`,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-sitemap`,
  ],
}
