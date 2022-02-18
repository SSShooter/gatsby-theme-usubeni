import 'katex/dist/katex.min.css'
import React from 'react'
import Helmet from 'react-helmet'
import { Link, graphql } from 'gatsby'
import { apiUrl } from '../const'

import CommentSubmit from '../components/CommentSubmit'
// import CommentDisplay from '../components/CommentDisplay'
import Layout from '../components/Layout'
import Info from '../components/PostInfo'
import axios from 'axios'

class BlogPostTemplate extends React.Component {
  state = {
    comments: [],
    parentId: null,
    to: null,
  }
  componentDidMount = () => {
    let pre = location.hash || ''
    if (pre)
      document.querySelector(`.css-toc a[href*="${pre}"]`).className = 'active'
    let all = document.querySelectorAll(`.css-toc a`)
    for (let item of Array.from(all)) {
      item.addEventListener('click', e => {
        if (pre) {
          let menuItem = document.querySelector(`.css-toc a[href*="${pre}"]`)
          menuItem.className = ''
        }
        item.className = 'active'
        pre = item.hash
      })
    }
    document.addEventListener('scroll', e => {
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
    this.getComment()
  }
  getComment = () => {
    axios
      .get(apiUrl + '/api/comment/' + this.props.pageContext.slug.slice(1, -1))
      .then(({ data }) => {
        this.setState({
          comments: data.data,
        })
      })
  }
  cancelReply = () => {
    this.setState({
      parentId: null,
      to: null,
    })
  }
  reply = (parentId, to) => () => {
    document.querySelector('#comment-input').scrollIntoView()
    this.setState({
      parentId,
      to,
    })
  }
  dateFormat = date => {
    date = new Date(date)
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    return `${date.getFullYear()}-${m}-${d}`
  }
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const siteDescription = post.excerpt
    const { slug, previous, next } = this.props.pageContext
    // const isCoding = post.frontmatter.tags.includes('coding')
    return (
      <Layout
        location={this.props.location}
        title={siteTitle}
        aside={post.tableOfContents}
        // className={isCoding?'night':null}
      >
        <Helmet
          htmlAttributes={{ lang: 'zh' }}
          meta={[{ name: 'description', content: siteDescription }]}
          title={`${post.frontmatter.title} | ${siteTitle}`}
        />
        <h1>{post.frontmatter.title}</h1>
        <Info date={post.frontmatter.date} tags={post.frontmatter.tags} />
        <div
          className="css-post-main"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
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
        {this.state.comments.length > 0
          ? this.state.comments.map(comment => {
              const dateFormat = this.dateFormat(comment.date)
              return (
                <React.Fragment>
                  <div className="css-comment-display" key={comment._id}>
                    <div className="name">
                      {comment.site ? (
                        <a target="_blank" href={comment.site}>
                          {comment.author}
                        </a>
                      ) : (
                        <span>{comment.author}</span>
                      )}
                      <span className="date">{dateFormat}</span>
                      <span
                        className="inline-button css-reply"
                        onClick={this.reply(comment._id, comment.author)}
                      >
                        回复
                      </span>
                    </div>
                    <div className="message">{comment.content}</div>
                  </div>
                  {comment.replies.length > 0
                    ? comment.replies.map(commentChild => {
                        const dateFormat = this.dateFormat(comment.date)
                        return (
                          <div
                            className="css-child-comment-display"
                            key={commentChild._id}
                          >
                            <div className="name">
                              {commentChild.site ? (
                                <a target="_blank" href={commentChild.site}>
                                  {commentChild.author}
                                </a>
                              ) : (
                                <span>{commentChild.author}</span>
                              )}
                              {' -> ' + commentChild.to}
                              <span className="date">{dateFormat}</span>
                              <span
                                className="inline-button css-reply"
                                onClick={this.reply(
                                  comment._id,
                                  commentChild.author
                                )}
                              >
                                回复
                              </span>
                            </div>
                            <div className="message">
                              {commentChild.content}
                            </div>
                          </div>
                        )
                      })
                    : null}
                </React.Fragment>
              )
            })
          : '暂时没有留言，要抢沙发吗？'}
        <CommentSubmit
          url={slug}
          parent={this.state.parentId}
          to={this.state.to}
          onCancel={this.cancelReply}
          onSuccess={this.getComment}
        />
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
      excerpt(truncate: true, pruneLength: 100)
      html
      tableOfContents
      frontmatter {
        title
        tags
        date(formatString: "YYYY-MM-DD")
      }
    }
  }
`
