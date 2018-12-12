import React, { Component } from 'react'

export default class Comment extends Component {
  submit = () => {
    var xhr = new XMLHttpRequest()
    xhr.open(
      'POST',
      'https://ufb-comment.herokuapp.com/v2/entry/ssshooter/usubeni-fantasy/master/comments',
      true
    )
    // 添加http头，发送信息至服务器时内容编码类型
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 304)) {
        console.log(xhr.responseText)
        this.name.value = ''
        this.email.value = ''
        this.message.value = ''
        alert('留言已发送，将在数分钟后显示')
      }
    }
    let data = {
      fields: {
        url: this.props.url,
        name: this.name.value,
        email: this.email.value,
        message: this.message.value,
      },
    }
    xhr.send(JSON.stringify(data))
  }
  render() {
    return (
      <div className="css-comment-submit">
        <h3>
          留言<span>（将在数分钟后显示）</span>
        </h3>
        <p>昵称</p>
        <input
          ref={input => (this.name = input)}
          type="text"
          placeholder="必填 请输入你的昵称"
          required
        />
        <p>联系方式</p>
        <input
          ref={input => (this.email = input)}
          type="email"
          placeholder="非必填 请输入你的联系方式"
        />
        <p>留言内容</p>
        <textarea
          ref={input => (this.message = input)}
          placeholder="必填 请输入留言内容"
          required
        />
        <button onClick={this.submit}>发送留言</button>
      </div>
    )
  }
}
