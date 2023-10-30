const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const fastExif = require('fast-exif')

const blogPost = path.resolve('./src/templates/blog-post.js')
const homePaginate = path.resolve('./src/templates/index.js')
const tagTemplate = path.resolve('./src/templates/tag.js')

const createPosts = (createPage, post, prev, next) => {
  createPage({
    path: post.node.fields.slug,
    component: blogPost,
    context: {
      slug: post.node.fields.slug,
      prev,
      next,
    },
  })
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const result = await graphql(`
    query ArchiveAndGroup {
      allMarkdownRemark(
        filter: {
          frontmatter: { released: { ne: false }, hidden: { ne: true } }
          fields: { lang: { eq: null } }
        }
        sort: { frontmatter: { date: DESC } }
        limit: 1000
      ) {
        group(field: { frontmatter: { tags: SELECT } }) {
          fieldValue
          totalCount
        }
        totalCount
      }
    }
  `)

  const tags = result.data.allMarkdownRemark.group
  const postsCount = result.data.allMarkdownRemark.totalCount

  // Create archive pages
  const postsPerPage = 50
  const numPages = Math.ceil(postsCount / postsPerPage)

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/archive` : `/archive/${i + 1}`,
      component: homePaginate,
      context: {
        currentPage: i + 1,
        totalPage: numPages,
        limit: postsPerPage,
        skip: i * postsPerPage,
      },
    })
  })

  // Create tag pages
  const TagsPostsPerPage = 8
  tags.forEach((tag) => {
    const TagsTotal = tag.totalCount
    const TagsPages = Math.ceil(TagsTotal / TagsPostsPerPage)
    Array.from({ length: TagsPages }).forEach((_, i) => {
      createPage({
        path:
          i === 0
            ? `/tag/${tag.fieldValue}`
            : `/tag/${tag.fieldValue}/${i + 1}`,
        component: tagTemplate,
        context: {
          tag: tag.fieldValue,
          currentPage: i + 1,
          totalPage: TagsPages,
          limit: TagsPostsPerPage,
          skip: i * TagsPostsPerPage,
        },
      })
    })
  })

  // Create blog posts pages.
  const allPosts = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: { released: { ne: false }, hidden: { ne: true } }
          fields: { lang: { eq: null } }
        }
        sort: { frontmatter: { date: DESC } }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
          }
        }
      }
    }
  `)
  const posts = allPosts.data.allMarkdownRemark.edges
  posts.forEach((post, index) => {
    const prev = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node
    createPosts(createPage, post, prev, next)
  })

  const hiddenAndMultiLangPosts = await graphql(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: { released: { ne: false }, hidden: { eq: true } }
          fields: { lang: { ne: null } }
        }
        sort: { frontmatter: { date: DESC } }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)
  hiddenAndMultiLangPosts.data.allMarkdownRemark.edges.forEach((post) => {
    createPosts(createPage, post, null, null)
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    // extract lang from fileAbsolutePath
    // fileAbsolutePath eg: 'D:/usubeni-fantasy/src/pages/2022-07-03-first-post/index.en.md' or 'D:/usubeni-fantasy/src/pages/2022-07-03-first-post/index.md'
    const lang = node.fileAbsolutePath.match(/\.([a-z]{2})\.md$/)?.[1] || null
    const path = node.frontmatter.slug || createFilePath({ node, getNode })
    const slug = lang ? `/${lang}${path}` : path
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
    createNodeField({
      node,
      name: `lang`,
      value: lang,
    })
  }
  // node contain the folder, eliminate it using node.extension
  if (node.extension && node.sourceInstanceName === 'gallery') {
    const absolutePath = node.absolutePath
    fastExif
      .read(absolutePath)
      .catch((err) =>
        console.error(
          '\n--------------\n' +
            absolutePath +
            node.extension +
            '\n--------------\n' +
            err +
            '\n--------------\n'
        )
      )
      .then((exifData) => {
        if (!exifData) {
          return
        }
        const { Make, Model, Software, ModifyDate } = exifData.image
        const { ExposureTime, FNumber, ISO, FocalLength } = exifData.exif
        createNodeField({
          node,
          name: 'exifData',
          value: {
            Make,
            Model,
            Software,
            ModifyDate: ModifyDate ? String(ModifyDate).substr(0, 10) : null,
            FocalLength: `${FocalLength + ' mm'}`,
            ISO: `ISO-${ISO}`,
            FNumber: `f/${FNumber}`,
            ExposureTime: ExposureTime
              ? `1/${(1 / ExposureTime).toFixed(0)} s`
              : null,
          },
        })
      })
      .catch((err) =>
        console.error(
          '\n--------------\n' +
            absolutePath +
            node.extension +
            '\n--------------\n' +
            err +
            '\n--------------\n'
        )
      )
  }
}
