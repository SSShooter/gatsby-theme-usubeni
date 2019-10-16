import React, { Component } from 'react'
import axios from 'axios'
export default class Comment extends Component {
  state = {
    submitState: '发送留言',
  }
  submit = () => {
    const author = this.name.value
    const mail = this.email.value
    const content = this.message.value
    if (!author || !mail || !content) return
    const { parent, to, url, onSuccess } = this.props
    let data = undefined
    if (parent) {
      data = {
        to,
        parent: parent,
        author,
        mail,
        content,
        path: window.location.pathname,
      }
    } else {
      data = {
        url: url.slice(1, -1),
        author,
        mail,
        content,
        path: window.location.pathname,
      }
    }
    axios
      .post('https://comment-sys.herokuapp.com/api/comment', data)
      .then(res => {
        localStorage.name = author
        localStorage.email = mail
        this.message.value = ''
        onSuccess()
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
    const { parent, to, onCancel } = this.props
    return (
      <div className="css-comment-submit">
        <span className="box-title">
          留言（不再受<a href="/2019-01-18-gatsby-blog-6/">实现原理</a>
          所限，立即更新！回复功能现在可用，但邮箱提醒未完成，急需回复的提问请直接邮件联系）
        </span>
        {parent && (
          <div>
            回复 {to}
            <span className="inline-button" onClick={onCancel}>
              取消回复
            </span>
          </div>
        )}
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
          placeholder="必填 请输入你邮箱，收到回复时推送提醒"
        />
        <input
          id="comment-input"
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
