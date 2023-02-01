import React from 'react'
import { Link, graphql } from 'gatsby'
import Pagination from '../components/Pagination'
import SEO from '../components/Seo'

import Layout from '../components/Layout'
/**
 * Archive page
 */
class BlogIndex extends React.Component {
  render() {
    const { data, location } = this.props
    const posts = data.allMarkdownRemark.edges
    const { totalPage, currentPage } = this.props.pageContext
    return (
      <Layout>
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

export const Head = ({ location }) => (
  <SEO
    title="归档"
    pathname={location.pathname}
    description="一步一步，走出自己的轨迹"
  />
)

export const pageQuery = graphql`
  query ($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      filter: {frontmatter: {released: {ne: false}, hidden: {ne: true}}}
      sort: {frontmatter: {date: DESC}}
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
