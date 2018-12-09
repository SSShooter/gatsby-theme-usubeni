const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const _ = require('lodash')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    const homePaginate = path.resolve('./src/templates/index.js')
    const tagTemplate = path.resolve('./src/templates/tag.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
              group(field: frontmatter___tags) {
                fieldValue
                totalCount
              }
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                    tags
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }
        const tags = result.data.allMarkdownRemark.group
        const posts = result.data.allMarkdownRemark.edges

        // create homepage pagination
        const postsPerPage = 8
        // const numPages = Math.ceil(posts.length / postsPerPage)

        // Array.from({ length: numPages }).forEach((_, i) => {
        //   createPage({
        //     path: i === 0 ? `/blog` : `/blog/${i + 1}`,
        //     component: homePaginate,
        //     context: {
        //       currentPage: i + 1,
        //       totalPage: numPages,
        //       limit: postsPerPage,
        //       skip: i * postsPerPage,
        //     },
        //   })
        // })

        // Make tag pages
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

        // Create blog posts pages.
        posts.forEach((post, index) => {
          const previous =
            index === posts.length - 1 ? null : posts[index + 1].node
          const next = index === 0 ? null : posts[index - 1].node

          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
