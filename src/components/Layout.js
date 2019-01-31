import React from 'react'
import { Link } from 'gatsby'
import 'prismjs/themes/prism-coy.css'

import './global.scss'

class Layout extends React.Component {
  render() {
    const { pageName, pageDescript, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    
    const websiteName = (
      <div>
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            color: 'inherit',
            fontSize: '2rem',
            fontWeight: 200,
            paddingRight: '0.2rem',
          }}
          to={'/'}
        >
          {title}
        </Link>
        {pageName ? (
          <span
            style={{
              verticalAlign: 'top',
            }}
          >
            {'# ' + pageName}
          </span>
        ) : null}
      </div>
    )
    const descript = (
      <div
        style={{
          marginBottom: '3rem',
        }}
      >
        {pageDescript}
      </div>
    )
    return (
      <div
        style={{
          margin: 'auto',
          maxWidth: '672px',
          padding: '1.2rem 3rem',
        }}
      >
        {websiteName}
        {pageDescript ? descript : null}
        {children}
      </div>
      // TODO: add footer
    )
  }
}

export default Layout
