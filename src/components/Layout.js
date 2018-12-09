import React from 'react'
import { Link } from 'gatsby'
import 'prismjs/themes/prism-twilight.css'

import './global.scss'

class Layout extends React.Component {
  render() {
    console.log(this.props)
    const { pageName,pageDescript, title, children } = this.props
    const rootPath = `${__PATH_PREFIX__}/`
    // This is the website name
    const websiteName = (
      <h1>
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
      </h1>
    )
    const name = <h2>{pageName}</h2>
    const descript = <h3 style={{
      marginBottom:'3rem'
    }}>{pageDescript}</h3>
    return (
      // TODO add page name
      <div
        style={{
          margin: 'auto',
          maxWidth: '672px',
          padding: '1.2rem 1.1rem',
        }}
      >
        {websiteName}
        {name}
        {descript}
        {children}
      </div>
    )
  }
}

export default Layout
