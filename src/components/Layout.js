import React from 'react'
import { Link } from 'gatsby'
import Menu from './Menu'
import { author, siteName, socialMedia } from '../settings'

let footerStyle = {
  marginBottom: '1rem',
}

class Layout extends React.Component {
  state = {
    menuState: false, // false for close, true for open
    keyword: '',
    animation: [],
    year: '',
    days: '',
    theme: null,
    flowerDance: false,
  }
  componentDidMount() {
    this.setState({
      theme: window.theme,
      year: new Date().getFullYear(),
      days: this.formatTime(new Date() - new Date('2018-12-05T14:13:38')),
    })
    let localFlowerDance = localStorage.getItem('flowerDance')
    if (!localFlowerDance) {
      this.setFlowerDance(0)
    } else {
      this.setFlowerDance(localFlowerDance)
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkModeMediaQuery.addListener((e) => {
      const darkModeOn = e.matches
      if (darkModeOn) {
        this.setTheme('dark')
      } else {
        this.setTheme('light')
      }
    })
  }
  toggleTheme = () => {
    if (this.state.theme === 'light') {
      this.setTheme('dark')
    } else {
      this.setTheme('light')
    }
  }
  toggleFlowerDance = () => {
    if (this.state.flowerDance == 1) this.setFlowerDance(0)
    else this.setFlowerDance(1)
  }
  setTheme = (themeName) => {
    localStorage.setItem('theme', themeName)
    document.documentElement.className = themeName + '-theme'
    this.setState({
      theme: themeName,
    })
  }
  setFlowerDance = (n) => {
    const sakuraCanvas = document.querySelector('#canvas_sakura')
    if (n == 1 && !sakuraCanvas) {
      import('../sakura.TRHX.js').then((code) => {
        code.default()
      })
    }
    if (sakuraCanvas) sakuraCanvas.style.opacity = Number(n)
    localStorage.setItem('flowerDance', n)
    this.setState({
      flowerDance: n,
    })
  }
  toggleMenuState = () => {
    this.setState({
      menuState: !this.state.menuState,
    })
  }
  change = (e) => {
    this.setState({
      keyword: e.target.value,
    })
  }
  search = () => {
    window.open(
      'https://cn.bing.com/search?q=site%3Assshooter.com%20' +
        this.state.keyword
    )
  }
  formatTime = (msTime) => {
    const time = msTime / 1000
    const day = Math.floor(time / 60 / 60 / 24)
    return ` ${day} 天`
  }
  handleEnter = (e) => {
    if (e.keyCode === 13) {
      this.search()
    }
  }
  render() {
    const { menuState, days, year, theme, flowerDance } = this.state
    const { pageName, pageDescript, children, aside, className } = this.props

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
    return (
      <div className={className}>
        <div className="css-main">
          <article className="css-post">{children}</article>
          <aside className={'css-aside ' + (menuState ? 'open' : 'close')}>
            <header className="css-header">
              {websiteName}
              <div className="menu-button" onClick={this.toggleMenuState}>
                <i
                  className={
                    'iconfont icon-' + (menuState ? 'close1' : 'menu1')
                  }
                />
              </div>
            </header>
            {aside ? (
              <div
                className="css-toc"
                onClick={this.toggleMenuState}
                dangerouslySetInnerHTML={{
                  __html: aside,
                }}
              />
            ) : (
              <React.Fragment>
                <Menu direction="column" />
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <input
                    placeholder="关键字，然后 Enter"
                    onChange={this.change}
                    onKeyUp={this.handleEnter}
                  />
                </div>
              </React.Fragment>
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
            一转眼 已是
            {days}
          </div>
        </footer>
        <div className="flower-toggle" onClick={this.toggleFlowerDance}>
          {flowerDance == 0 ? '隐' : '樱'}
        </div>
        <div className="theme-toggle" onClick={this.toggleTheme}>
          {theme === 'light' ? '日' : '夜'}
        </div>
      </div>
    )
  }
}

export default Layout
