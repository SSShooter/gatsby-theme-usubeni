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
            <Img fluid={data.file.childImageSharp.fluid} />
            <div className="author">ssshooter</div>
            <div className="social-media">
              <a href="https://weibo.com/ariaqua">
                <i className="iconfont">&#xe883;</i>
              </a>
              <a href="https://twitter.com/zhoudejie">
                <i className="iconfont">&#xe882;</i>
              </a>
              <a href="https://github.com/ssshooter">
                <i className="iconfont">&#xe885;</i>
              </a>
              <a href="https://www.zhihu.com/people/ssshooter">
                <i className="iconfont">&#xe87c;</i>
              </a>
              <a href="https://www.linkedin.com/in/%E5%BE%B7%E6%9D%B0-%E5%91%A8-469458bb/">
                <i className="iconfont">&#xe87d;</i>
              </a>
            </div>
          </div>
        )}
      />
    )
  }
}
export default Bio
