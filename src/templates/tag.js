import React from 'react'
import { Link, graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/Layout'
import Info from '../components/PostInfo'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const siteDescription = data.site.siteMetadata.description
    const posts = data.allMarkdownRemark.edges
    const { totalPage, currentPage, tag } = this.props.pageContext
    const tagMap = {
      diary: '生活分享（自言自语）',
      coding: '技术分享与踩坑经验，前端为主，安利跨平台框架',
    }
    return (
      <Layout
        location={this.props.location}
        title={siteTitle}
        pageName={tag}
        pageDescript={tagMap[tag]}
      >
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={siteTitle}
        />
        {/* <Bio /> */}
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div className="list-item" key={node.fields.slug}>
              <div
                className="list-title"
                style={{
                  marginBottom: '0.24rem',
                }}
              >
                <Link style={{ boxShadow: 'none' }} to={node.fields.slug}>
                  {title}
                </Link>
              </div>
              <Info date={node.frontmatter.date} tags={node.frontmatter.tags} />
              <p
                className="list-excerpt"
                dangerouslySetInnerHTML={{ __html: node.excerpt }}
              />
            </div>
          )
        })}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0,
          }}
        >
          <div>
            {currentPage - 1 > 0 && (
              <Link
                to={
                  `/tag/${tag}/` + (currentPage - 1 === 1 ? '' : currentPage - 1)
                }
                rel="prev"
              >
                <button>{'<'} 上一页</button>
              </Link>
            )}
          </div>
          <div>
            {currentPage + 1 <= totalPage && (
              <Link to={`/tag/${tag}/` + (currentPage + 1)} rel="next">
                <button>下一页 {'>'}</button>
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
  query($tag: String!, $skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } released: { ne: false } } }
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
            date(formatString: "MMMM DD, YYYY")
            title
            tags
          }
        }
      }
    }
  }
`
