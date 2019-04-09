import React, { Component } from 'react'
import axios from 'axios'
export default class Comment extends Component {
  state = {
    submitState: '发送留言',
  }
  submit = () => {
    let data = {
      url: this.props.url,
      author: this.name.value,
      mail: this.email.value,
      content: this.message.value,
    }
    axios
      .post('http://localhost:7001/api/comment', data)
      .then(res => {
        localStorage.name = this.name.value
        localStorage.email = this.email.value
        this.message.value = ''
        alert('留言已发送，将在数分钟后显示')
        this.setState({
          submitState: '已发送',
        })
      })
      .catch(err => {
        alert(err)
        this.button.disabled = false
        this.setState({
          submitState: '发送留言',
        })
      })
    this.setState({
      submitState: '发送中',
    })
    this.button.disabled = true
  }
  render() {
    return (
      <div className="css-comment-submit">
        <span className="box-title">
          留言（受<a href="/2019-01-18-gatsby-blog-6/">实现原理</a>
          所限，留言将在数分钟后显示）
        </span>
        <input
          ref={input => {
            this.name = input
            if (this.name && localStorage.name) {
              this.name.value = localStorage.name
            }
          }}
          type="text"
          placeholder="必填 请输入你的昵称"
          required
        />
        <input
          ref={input => {
            this.email = input
            if (this.email && localStorage.email) {
              this.email.value = localStorage.email
            }
          }}
          type="email"
          placeholder="非必填 请输入你的联系方式"
        />
        <input
          ref={input => (this.message = input)}
          placeholder="必填 请输入留言内容"
          required
        />
        <button ref={button => (this.button = button)} onClick={this.submit}>
          {this.state.submitState}
        </button>
      </div>
    )
  }
}
