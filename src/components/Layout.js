import { useEffect, useState } from 'react'
import { Link } from 'gatsby'
import Menu from './Menu'
import { author, siteName, socialMedia } from '../settings'
import FlowerToggle from './FlowerToggle'
import ThemeToggle from './ThemeToggle'

let footerStyle = {
  marginBottom: '1rem',
}
const formatTime = (msTime) => {
  const time = msTime / 1000
  const day = Math.floor(time / 60 / 60 / 24)
  return ` ${day} 天`
}
const handleEnter = (e) => {
  if (e.keyCode === 13) {
    window.open(
      'https://cn.bing.com/search?q=site%3Assshooter.com%20' + e.target.value
    )
  }
}

const Layout = ({ pageName, pageDescript, children, aside }) => {
  const [menuState, setMenuState] = useState(false)
  const [year, setYear] = useState('')
  const [days, setDays] = useState('')
  const websiteName = (
    <div>
      <Link
        style={{
          boxShadow: 'none',
          textDecoration: 'none',
          fontWeight: 200,
        }}
        className="usubeni"
        to={'/tag/coding/'}
      >
        <span className="logo-mobile">{siteName}</span>
        <img className="logo" alt="Usubeni-Fantasy Logo" src="/logo.png" />
      </Link>
      {pageName ? (
        <div className="page-name">
          <i className="iconfont icon-hash"></i>
          {' ' + pageName}
        </div>
      ) : null}
    </div>
  )
  const descript = <div className="page-description">{pageDescript}</div>
  useEffect(() => {
    setDays(formatTime(new Date() - new Date('2018-12-05T14:13:38')))
    setYear(new Date().getFullYear())
  })
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
      <footer>
        <div className="social-media" style={footerStyle}>
          {socialMedia.map((item) => (
            <a key={item.icon} target="_blank" href={item.href}>
              <i className={'iconfont icon-' + item.icon}></i>
            </a>
          ))}
        </div>
        <div style={footerStyle}>
          © 2018-{year} {author} • theme{' '}
          <a
            className="usubeni"
            target="_blank"
            href="https://github.com/ssshooter/gatsby-theme-usubeni"
          >
            usubeni
          </a>{' '}
          • powered by{' '}
          <a
            style={{ boxShadow: 'none' }}
            target="_blank"
            href="https://www.gatsbyjs.org/"
          >
            Gatsbyjs
          </a>
        </div>
        <div style={footerStyle}>
          <a href="https://icp.gov.moe/?keyword=20231368" target="_blank">
            萌ICP备20231368号
          </a>
        </div>
        <div style={footerStyle}>
          一转眼 已是
          {days}
        </div>
      </footer>
      <FlowerToggle />
      <ThemeToggle />
    </>
  )
}

export default Layout
