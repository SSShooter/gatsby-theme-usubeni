import 'katex/dist/katex.min.css'
import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'

import Comment from '../components/Comment'
import Layout from '../components/Layout'
import Info from '../components/PostInfo'

class BlogPostTemplate extends React.Component {
  componentDidMount = () => {
    let pre = location.hash || ''
    if (pre)
      document.querySelector(`.css-toc a[href*="${pre}"]`).className = 'active'
    let all = document.querySelectorAll(`.css-toc a`)
    for (let item of Array.from(all)) {
      item.addEventListener('click', (e) => {
        if (pre) {
          let menuItem = document.querySelector(`.css-toc a[href*="${pre}"]`)
          menuItem.className = ''
        }
        item.className = 'active'
        pre = item.hash
      })
    }
    document.addEventListener('scroll', () => {
      let list = Array.from(document.querySelectorAll('h2,h3,h4,h5,h6'))
      if (list.length === 0) return
      let passedList = []
      for (let item of list) {
        let top = item.getBoundingClientRect().top
        if (top <= 50) passedList.push(item)
      }
      if (!passedList.length) return // 第一条的情况
      let last = passedList[passedList.length - 1]
      if (pre !== last.hash) {
        if (pre) {
          let preItem = document.querySelector(`.css-toc a[href*="${pre}"]`)
          if (preItem) preItem.className = ''
        }
        let menuItem = document.querySelector(
          `.css-toc a[href*="${encodeURIComponent(last.id)}"]`
        )
        menuItem.className = 'active'
        pre = menuItem.hash
      }
    })
  }
  render() {
    const post = this.props.data.markdownRemark
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
          meta={[
            {
              name: 'description',
              content: post.frontmatter.description || siteDescription,
            },
          ]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />
        <h1>{post.frontmatter.title}</h1>
        <Info date={post.frontmatter.date} tags={post.frontmatter.tags} />
        <div
          className="css-post-main"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        <hr />
        <Comment slug={slug} />
        <ul className="button-wrapper">
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(truncate: true, pruneLength: 100)
      html
      tableOfContents
      frontmatter {
        title
        tags
        description
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`
