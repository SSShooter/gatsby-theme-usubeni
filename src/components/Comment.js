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
      }
    }
    let data = {
      fields: {
        url: this.props.url,
        name: this.name.value,
        email: this.email.value,
        comment: this.comment.value,
      },
    }
    console.log(data)
    xhr.send(data)
  }
  render() {
    return (
      <div>
        <h3>Add a comment</h3>
        <form>
          <input
            ref={input => (this.name = input)}
            type="text"
            placeholder="Name"
            required
          />
          <input
            ref={input => (this.email = input)}
            type="email"
            placeholder="Email"
            required
          />
          <textarea
            ref={input => (this.comment = input)}
            placeholder="Comment"
            required
          />
          <button onClick={this.submit}>Submit Comment</button>
        </form>
      </div>
    )
  }
}
