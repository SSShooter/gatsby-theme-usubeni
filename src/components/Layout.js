import React from 'react'
import { Link } from 'gatsby'
import 'prismjs/themes/prism-twilight.css'

import './global.scss'

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    const header = (
      <div>
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'inherit',
            fontSize: '2rem',
          }}
          to={'/'}
        >
          {title}
        </Link>
      </div>
    )
    return (
      <div
        style={{
          margin: 'auto',
          maxWidth: '672px',
          padding: '1.2rem 1.1rem',
        }}
      >
        {header}
        {children}
      </div>
    )
  }
}

export default Layout
