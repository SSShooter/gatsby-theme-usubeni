import React from 'react'
import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'

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
        {posts.map(({ node }, index) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div
              style={{
                marginTop: '0.2rem',
              }}
              key={node.fields.slug}
            >
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
              <span
                style={{
                  display: 'inline-block',
                  width: '4em',
                  textAlign: 'left',
                  marginRight: '10px',
                  opacity: 0.6,
                }}
              >
                {node.frontmatter.date}
              </span>
              <Link
                style={{ boxShadow: 'none', fontSize: '1.1em' }}
                to={node.fields.slug}
              >
                {title}
              </Link>
            </div>
          )
        })}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            paddingTop: '30px',
          }}
        >
          <div>
            {currentPage - 1 > 0 && (
              <Link
                to={
                  '/archive/' + (currentPage - 1 === 1 ? '' : currentPage - 1)
                }
                rel="prev"
              >
                <button className="page-button">{'<'} 上一页</button>
              </Link>
            )}
          </div>
          <div>
            {currentPage + 1 <= totalPage && (
              <Link to={'/archive/' + (currentPage + 1)} rel="next">
                <button className="page-button">下一页 {'>'}</button>
              </Link>
            )}
          </div>
        </div>
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
