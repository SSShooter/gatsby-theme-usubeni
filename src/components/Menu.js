import React from 'react'
import { menu } from '../settings'

const Menu = ({ direction }) => (
  <div className={'css-menu ' + (direction === 'column' ? 'column' : 'row')}>
    {menu.map((item) => (
      <a target={item.target} href={item.href} key={item.name}>
        <i className={'iconfont icon-' + item.icon} />
        {item.name}
      </a>
    ))}
  </div>
)

export default Menu
