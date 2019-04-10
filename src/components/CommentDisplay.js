import React, { Component } from 'react'

export default class Comment extends Component {
  render() {
    const date = new Date(this.props.data.date)
    const dateFormat = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    return (
      <div className="css-comment-display">
        <div className="name">{this.props.data.author}<span className="date">{dateFormat}</span></div>
        <div className="message">{this.props.data.content}</div>
      </div>
    )
  }
}
