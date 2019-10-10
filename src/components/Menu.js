import React, { Component } from 'react'

export default class Menu extends Component {
  render() {
    return (
      <div
        className={
          'css-menu ' + (this.props.direction === 'column' ? 'column' : 'row')
        }
      >
        <a href="/tag/coding/">
          <i className="iconfont">&#xe7d7;</i> 技术
        </a>
        <a href="/tag/diary/">
          <i className="iconfont">&#xe7b3;</i> 生活
        </a>
        <a href="/tags">
          <i className="iconfont">&#xe7e5;</i> 标签
        </a>
        <a href="/gallery">
          <i className="iconfont">&#xe7de;</i> 相册
        </a>
        <a href="/archive">
          <i className="iconfont">&#xe608;</i> 归档
        </a>
        {/* <a href="/meme">
          <i className="iconfont">&#xe780;</i> 表情
        </a> */}
        <a href="/links">
          <i className="iconfont">&#xe7e2;</i> 链接
        </a>
        <a href="/about">
          <i className="iconfont">&#xe7ae;</i> 关于
        </a>
      </div>
    )
  }
}
