import { useState } from 'react'
import { Link } from 'gatsby'
import Menu from './Menu'
import { siteName } from '../settings'
import Footer from './Footer'
import FlowerToggle from './FlowerToggle'
import ThemeToggle from './ThemeToggle'

const handleEnter = (e) => {
  if (e.keyCode === 13) {
    window.open(
      'https://cn.bing.com/search?q=site%3Assshooter.com%20' + e.target.value
    )
  }
}

const Layout = ({ pageName, pageDescript, children, aside }) => {
  const [menuState, setMenuState] = useState(false)
  const websiteName = (
    <>
      <Link
        style={{
          boxShadow: 'none',
          textDecoration: 'none',
          fontWeight: 200,
        }}
        className="usubeni"
        to={'/tag/coding/'}
      >
        <img className="logo-mobile" alt="Usubeni-Fantasy Logo Mobile" src="/logo-mobile.png" />
        <img className="logo" alt="Usubeni-Fantasy Logo" src="/logo.png" />
      </Link>
      {pageName ? (
        <div className="page-name">
          <i className="iconfont icon-hash"></i>
          {' ' + pageName}
        </div>
      ) : null}
    </>
  )
  const descript = <div className="page-description">{pageDescript}</div>

  const toggleMenuState = () => {
    setMenuState(!menuState)
  }

  return (
    <>
      <div className="css-main">
        <article className="css-post">{children}</article>
        <aside className={'css-aside ' + (menuState ? 'open' : 'close')}>
          <header className="css-header">
            {websiteName}
            <div className="menu-button" onClick={toggleMenuState}>
              <i
                className={'iconfont icon-' + (menuState ? 'close1' : 'menu1')}
              />
            </div>
          </header>
          {aside ? (
            <div
              className="css-toc"
              onClick={toggleMenuState}
              dangerouslySetInnerHTML={{
                __html: aside,
              }}
            />
          ) : (
            <>
              <Menu direction="column" />
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <input placeholder="关键字，然后 Enter" onKeyUp={handleEnter} />
              </div>
            </>
          )}
        </aside>
      </div>
      <Footer />
      <FlowerToggle />
      <ThemeToggle />
    </>
  )
}

export default Layout
