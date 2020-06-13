import React, { Component } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'

class Bio extends Component {
  render() {
    return (
      <StaticQuery
        query={graphql`
          query {
            file(relativePath: { eq: "avatar.png" }) {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid_noBase64
                }
              }
            }
          }
        `}
        render={data => (
          <div className="css-bio">
            <div className="css-avatar">
              <Img fluid={data.file.childImageSharp.fluid} />
            </div>
            <div className="author-wrapper">
              <div className="author">SSShooter</div>
              <div className="social-media">
                <a target="_blank" href="https://weibo.com/ariaqua">
                  <i className="iconfont">&#xe883;</i>
                </a>
                <a target="_blank" href="https://twitter.com/zhoudejie">
                  <i className="iconfont">&#xe882;</i>
                </a>
                <a target="_blank" href="https://github.com/ssshooter">
                  <i className="iconfont">&#xe885;</i>
                </a>
                <a
                  target="_blank"
                  href="https://www.zhihu.com/people/ssshooter"
                >
                  <i className="iconfont">&#xe87c;</i>
                </a>
                <a target="_blank" href="https://ssshooter.com/rss.xml">
                  <i className="iconfont">&#xe604;</i>
                </a>
              </div>
            </div>
          </div>
        )}
      />
    )
  }
}
export default Bio
