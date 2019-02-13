import React, { Component } from 'react'

export default class Bio extends Component {
  render() {
    return (
      <div className="css-bio">
        <img src="https://avatars3.githubusercontent.com/u/13051472?s=460&v=4" />
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
    )
  }
}
