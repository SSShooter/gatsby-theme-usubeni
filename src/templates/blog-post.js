import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql, navigate } from 'gatsby'

import Bio from '../components/Bio'
import CommentSubmit from '../components/CommentSubmit'
import CommentDisplay from '../components/CommentDisplay'
import Layout from '../components/Layout'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const comments = this.props.data.allCommentsYaml
      ? this.props.data.allCommentsYaml.edges
      : []
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
        <div className="css-info">
          {post.frontmatter.date}
          {post.frontmatter.tags ? (
            <React.Fragment>
              <span className="css-tag">Tags:</span>
              {post.frontmatter.tags.map((tag, index) => (
                <span
                  key={tag}
                  onClick={() => navigate(`/tag/${tag.toLowerCase()}`)}
                  className="css-tag"
                >
                  {tag}
                  {index + 1 === post.frontmatter.tags.length ? null : ','}
                </span>
              ))}
            </React.Fragment>
          ) : null}
        </div>
        {post.tableOfContents ? (
          <div
            className="css-toc"
            dangerouslySetInnerHTML={{
              __html: '<div>目录</div>' + post.tableOfContents,
            }}
          />
        ) : null}
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            margin: '3rem 0',
          }}
        />
        {/* 谷歌广告 */}
        {/*<ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-5174204966769125"
          data-ad-slot="5098541959"
        />*/}
        {comments.map(comment => (
          <CommentDisplay key={comment.node.id} data={comment.node} />
        ))}
        <CommentSubmit url={slug} />
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
    allCommentsYaml(filter: { url: { eq: $slug } }) {
      edges {
        node {
          id
          name
          message
          date
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      tableOfContents
      frontmatter {
        title
        tags
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
