import React, { Component } from 'react'
import { menu } from '../settings'

export default class Menu extends Component {
  render() {
    return (
      <div
        className={
          'css-menu ' + (this.props.direction === 'column' ? 'column' : 'row')
        }
      >
        {menu.map((item) => (
          <a target={item.target} href={item.href} key={item.name}>
            <i
              className="iconfont"
              dangerouslySetInnerHTML={{
                __html: item.icon,
              }}
            />
            {' ' + item.name}
          </a>
        ))}
      </div>
    )
  }
}
