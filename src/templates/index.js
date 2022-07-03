import React from 'react'
import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Pagination from '../components/Pagination'

import Layout from '../components/Layout'
/**
 * Archive page
 */
class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allMarkdownRemark.edges
    const { totalPage, currentPage } = this.props.pageContext
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Helmet
          htmlAttributes={{ lang: 'zh' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
        <div className="css-archive">
          {posts.map(({ node }, index) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              // show year if it's different from the previous one
              <React.Fragment key={node.fields.slug}>
                {(index === 0 ||
                  (index > 0 &&
                    posts[index - 1].node.frontmatter.year !==
                      node.frontmatter.year)) && (
                  <div
                    style={{
                      fontSize: '1.8em',
                      marginTop: index === 0 ? '0rem' : '2rem',
                      marginBottom: '1.2rem',
                    }}
                  >
                    {node.frontmatter.year}
                  </div>
                )}
                <div className="item">
                  <span className="date">{node.frontmatter.date}</span>
                  <Link className="title" to={node.fields.slug}>
                    {title}
                  </Link>
                </div>
              </React.Fragment>
            )
          })}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          prefix={'/archive/'}
        />
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { released: { ne: false }, hidden: { ne: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt(truncate: true)
          fields {
            slug
          }
          frontmatter {
            year: date(formatString: "YYYY")
            date(formatString: "MM-DD")
            title
          }
        }
      }
    }
  }
`
