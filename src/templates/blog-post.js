import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'

import CommentSubmit from '../components/CommentSubmit'
import CommentDisplay from '../components/CommentDisplay'
import Layout from '../components/Layout'
import Info from '../components/PostInfo'

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
      <Layout
        location={this.props.location}
        title={siteTitle}
        aside={post.tableOfContents}
      >
        <Helmet
          htmlAttributes={{ lang: 'zh' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />
        <h1>{post.frontmatter.title}</h1>
        <Info date={post.frontmatter.date} tags={post.frontmatter.tags} />
        <div style={{
          marginTop: '3rem'
        }} dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr />
        {/* 谷歌广告 */}
        {/*<ins
          className="adsbygoogle"
          style={{ display: 'block', textAlign: 'center' }}
          data-ad-layout="in-article"
          data-ad-format="fluid"
          data-ad-client="ca-pub-5174204966769125"
          data-ad-slot="5098541959"
        />*/}
        <CommentSubmit url={slug} />
        {comments.length > 0
          ? comments.map(comment => (
              <CommentDisplay key={comment.node.id} data={comment.node} />
            ))
          : '暂时没有留言，要抢沙发吗？'}
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
                <button>Prev: {previous.frontmatter.title}</button>
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                <button>Next: {next.frontmatter.title}</button>
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
      excerpt(truncate:true,pruneLength:100)
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
