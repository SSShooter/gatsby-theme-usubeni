import React from 'react'
import { useEffect } from 'react'
import { Link, graphql } from 'gatsby'

import Comment from '../components/Comment'
import Layout from '../components/Layout'
import Info from '../components/PostInfo'
import SEO from '../components/Seo'

const BlogPostTemplate = (props) => {
  useEffect(() => {
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
  })
  const post = props.data.markdownRemark
  const { slug, prev, next } = props.pageContext
  return (
    <Layout aside={post.tableOfContents}>
      <div className="css-post-main">
        <h1>{post.frontmatter.title}</h1>
        <Info
          date={post.frontmatter.date}
          tags={post.frontmatter.tags}
          multiLang={post.frontmatter.multiLang}
          slug={post.frontmatter.slug}
          timeToRead={post.timeToRead}
        />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
      <div className="button-wrapper">
        {prev && (
          <Link to={prev.fields.slug} rel="prev">
            <button>Prev: {prev.frontmatter.title}</button>
          </Link>
        )}
        {next && (
          <Link to={next.fields.slug} rel="next">
            <button>Next: {next.frontmatter.title}</button>
          </Link>
        )}
      </div>
      <hr />
      <Comment slug={slug} />
    </Layout>
  )
}

export default BlogPostTemplate

export const Head = ({ data, location }) => {
  const post = data.markdownRemark
  const lang = post.fields.lang
  const pathname = location.pathname
  const siteDescription = post.frontmatter.description || post.excerpt
  return (
    <SEO
      title={post.frontmatter.title}
      description={siteDescription}
      keywords={post.frontmatter.tags}
      pathname={pathname}
      lang={lang}
    />
  )
}

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
      timeToRead
      frontmatter {
        title
        tags
        description
        date(formatString: "YYYY-MM-DD")
        multiLang
        slug
      }
      fields {
        lang
      }
    }
  }
`
