import React from 'react'
import { Link, graphql } from 'gatsby'
import SEO from '../components/Seo'
import Layout from '../components/Layout'
import Info from '../components/PostInfo'
import Pagination from '../components/Pagination'
/**
 * Blog list of specific Tag
 */
class BlogIndex extends React.Component {
  render() {
    const { data, location } = this.props
    const posts = data.allMarkdownRemark.edges
    const { totalPage, currentPage, tag } = this.props.pageContext
    const tagDescriptionMap = {
      diary: '生活分享（自言自语）',
      coding: '技术分享与踩坑经验，前端为主，安利跨平台框架',
    }
    return (
      <Layout pageName={tag} pageDescript={tagDescriptionMap[tag]}>
        <SEO
          title={tag}
          pathname={location.pathname}
          description={tagDescriptionMap[tag]}
        />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div className="list-item" key={node.fields.slug}>
              <div className="list-title">
                <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                  {title}
                </Link>
              </div>
              <Info date={node.frontmatter.date} tags={node.frontmatter.tags} />
              <p className="list-excerpt">
                {node.frontmatter.description || node.excerpt}
              </p>
            </div>
          )
        })}
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          prefix={`/tag/${tag}/`}
        />
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query ($tag: String!, $skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: {frontmatter: {date: DESC}}
      filter: {frontmatter: {tags: {in: [$tag]}, released: {ne: false}, hidden: {ne: true}}}
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt(truncate: true, pruneLength: 100)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY-MM-DD")
            title
            tags
            description
          }
        }
      }
    }
  }
`
