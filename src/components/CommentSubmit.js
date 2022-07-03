import React, { Component } from 'react'
import axios from 'axios'
import { apiUrl } from '../settings'
export default class Comment extends Component {
  state = {
    submitState: '发送留言',
  }
  submit = () => {
    const author = this.name.value
    const mail = this.email.value
    const site = this.site.value || null
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
        site,
        path: window.location.pathname,
      }
    } else {
      data = {
        url: url.slice(1, -1),
        author,
        mail,
        content,
        site,
        path: window.location.pathname,
      }
    }
    axios
      .post(apiUrl + '/api/comment', data)
      .then((res) => {
        localStorage.name = author
        localStorage.email = mail
        localStorage.site = site
        this.message.value = ''
        onSuccess()
        this.setState({
          submitState: '已发送',
        })
      })
      .catch((err) => {
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
        <div className="title">留言</div>
        {parent && (
          <div>
            回复 {to}
            <span className="inline-button" onClick={onCancel}>
              取消回复
            </span>
          </div>
        )}
        <input
          ref={(input) => {
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
          ref={(input) => {
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
          ref={(input) => {
            this.site = input
            if (this.site && localStorage.site) {
              this.site.value = localStorage.site
            }
          }}
          placeholder="选填 输入你的博客地址 带上 http(s)"
          required
        />
        <textarea
          id="comment-textarea"
          ref={(input) => (this.message = input)}
          placeholder="必填 请输入留言内容"
          required
        />
        <button ref={(button) => (this.button = button)} onClick={this.submit}>
          {this.state.submitState}
        </button>
      </div>
    )
  }
}
