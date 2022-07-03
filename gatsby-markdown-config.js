module.exports ={
  resolve: `gatsby-transformer-remark`,
  options: {
    plugins: [
      {
        resolve: 'gatsby-remark-prismjs-title',
        options: {
          className: 'code-title',
        },
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
      {
        resolve: `gatsby-remark-katex`,
        options: {
          // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
          strict: `ignore`,
        },
      },
    ],
  },
}