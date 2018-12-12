import React, { Component } from 'react'

export default class Comment extends Component {
  state = {
    submitState: '发送留言',
  }
  submit = () => {
    var xhr = new XMLHttpRequest()
    xhr.open(
      'POST',
      'https://ufb-comment.herokuapp.com/v2/entry/ssshooter/usubeni-fantasy/master/comments',
      true
    )
    // 添加http头，发送信息至服务器时内容编码类型
    xhr.setRequestHeader('Content-Type', 'application/json')
    // onreadystatechange change 次数研究
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status == 200 || xhr.status == 304) {
          console.log(xhr.responseText)
          this.name.value = ''
          this.email.value = ''
          this.message.value = ''
          alert('留言已发送，将在数分钟后显示')
          this.setState({
            submitState: '已发送',
          })
        } else {
          const response = JSON.parse(xhr.responseText)
          if (response.errorCode) alert(response.errorCode)
          this.button.disabled = false
          this.setState({
            submitState: '发送留言',
          })
        }
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
    this.setState({
      submitState: '发送中',
    })
    this.button.disabled = true
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
        <button ref={button => (this.button = button)} onClick={this.submit}>{this.state.submitState}</button>
      </div>
    )
  }
}
