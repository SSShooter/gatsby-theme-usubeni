import React from 'react'
import { Link } from 'gatsby'
import Bio from './Bio'
import Menu from './Menu'
import 'prismjs/themes/prism.css'

import '../css/global.scss'

class Layout extends React.Component {
  render() {
    const { pageName, pageDescript, title, children, aside } = this.props
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
          }}
          to={'/tag/coding/'}
        >
          {title}
        </Link>
        {pageName ? <div>{'# ' + pageName}</div> : null}
      </div>
    )
    const descript = (
      <div
        style={{
          marginBottom: '2rem',
        }}
      >
        {pageDescript}
      </div>
    )
    return (
      <div>
        <div className="css-main">
          <article className="css-post">{children}</article>
          <aside className="css-aside">
            <header className="css-header">
              {websiteName}
              {pageDescript ? descript : null}
            </header>
            {aside ? (
              <div
                className="css-toc"
                dangerouslySetInnerHTML={{
                  __html: '<div class="box-title">TOC</div>' + aside,
                }}
              />
            ) : (
              <React.Fragment>
                <Bio className="css-bio" />
                <Menu />
              </React.Fragment>
            )}
          </aside>
        </div>
        <footer>
          <div>theme UsubeniFantasy</div>
          <div>
            © 2018-{new Date().getFullYear()} SSShooter, powered by Gatsbyjs
          </div>
        </footer>
      </div>
    )
  }
}

export default Layout
