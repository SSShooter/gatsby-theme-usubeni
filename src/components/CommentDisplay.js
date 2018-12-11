import React, { Component } from 'react'

export default class Comment extends Component {
  render() {
    return (
      <div>
        <div>{this.props.data.name}</div>
        <div>{this.props.data.message}</div>
        <div>{this.props.data.date}</div>
      </div>
    )
  }
}
