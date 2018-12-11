import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql, navigate } from 'gatsby'

import Bio from '../components/Bio'
import Comment from '../components/Comment'
import Layout from '../components/Layout'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt
    const { slug, previous, next } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Helmet
          htmlAttributes={{ lang: 'zh' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />
        <h1 className="css-title">{post.frontmatter.title}</h1>
        <div className="css-date">{post.frontmatter.date}</div>
        {post.frontmatter.tags ? (
          <div className="css-tags">
            {post.frontmatter.tags.map(tag => (
              <div
                key={tag}
                onClick={() => navigate(`/tags/${tag.toLowerCase()}`)}
                className="css-tag"
              >
                {tag}
              </div>
            ))}
          </div>
        ) : null}
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: '1rem',
          }}
        />
        <Comment url={slug} />
        {/* <Bio /> */}
        <div id="commento" />
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            listStyle: 'none',
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        tags
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
