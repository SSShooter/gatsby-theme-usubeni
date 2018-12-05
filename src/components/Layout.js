import React from 'react'
import { Link } from 'gatsby'

import { rhythm, scale } from '../utils/typography'
import 'prismjs/themes/prism-twilight.css'

import '../global.scss'

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    let header

    header = (
      <div
        style={{
          marginTop: 0,
          marginBottom: rhythm(-1),
        }}
      >
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'inherit',
            fontSize:  rhythm(1)
          }}
          to={'/blog'}
        >
          {title}
        </Link>
      </div>
    )
    return (
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        {header}
        {children}
      </div>
    )
  }
}

export default Layout
