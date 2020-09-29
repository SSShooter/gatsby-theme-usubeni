import React from 'react'
import { Link } from 'gatsby'
import Bio from './Bio'
import Menu from './Menu'
import startSakura from '../sakura.TRHX.js'
import '../css/global.scss'

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
    theme: 'light',
    flowerDance: false,
  }
  componentDidMount() {
    // avoid flash
    document.documentElement.style.display = 'none'
    startSakura()
    this.setState({
      year: new Date().getFullYear(),
      days: this.formatTime(new Date() - new Date('2018-12-05 14:13:38')),
    })
    let localFlowerDance = localStorage.getItem('flowerDance')
    if(!localFlowerDance){
      this.setFlowerDance(0)
    }else{
      this.setFlowerDance(localFlowerDance)
    }
    let localTheme = localStorage.getItem('theme')
    if (localTheme) {
      if (localTheme === 'dark') {
        this.setTheme('dark')
      } else {
        this.setTheme('light')
      }
    } else if (window.matchMedia) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setTheme('dark')
      } else {
        this.setTheme('light')
      }
    } else {
      // default light
      this.setTheme('light')
    }
    document.documentElement.style.display = 'block'
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkModeMediaQuery.addListener(e => {
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
  setTheme = themeName => {
    localStorage.setItem('theme', themeName)
    document.documentElement.className = themeName + '-theme'
    this.setState({
      theme: themeName,
    })
  }
  setFlowerDance = n => {
    localStorage.setItem('flowerDance', n)
    document.querySelector('#canvas_sakura').style.opacity = Number(n)
    this.setState({
      flowerDance: n,
    })
  }
  toggleMenuState = () => {
    this.setState({
      menuState: !this.state.menuState,
    })
  }
  change = e => {
    this.setState({
      keyword: e.target.value,
    })
  }
  search = () => {
    window.open(
      'https://www.google.co.jp/search?q=site%3Assshooter.com+' +
        this.state.keyword
    )
  }
  slowMotion = () => {
    for (let i = 0; i < this.state.animation.length; i++) {
      this.state.animation[i].playbackRate = 0.4
    }
  }
  backNormal = () => {
    for (let i = 0; i < this.state.animation.length; i++) {
      this.state.animation[i].playbackRate = 1
    }
  }
  formatTime = msTime => {
    let time = msTime / 1000
    let day = Math.floor(time / 60 / 60 / 24)
    let hour = Math.floor(time / 60 / 60) % 24
    let minute = Math.floor(time / 60) % 60
    let second = Math.floor(time) % 60
    return ` ${day} 天`
  }
  handleEnter = e => {
    if (e.keyCode === 13) {
      this.search()
    }
  }
  render() {
    const { menuState, days, year, theme, flowerDance } = this.state
    const {
      pageName,
      pageDescript,
      title,
      children,
      aside,
      className,
    } = this.props
    // const rootPath = `${__PATH_PREFIX__}/`

    const websiteName = (
      <React.Fragment>
        <Link
          style={{
            boxShadow: 'none',
            textDecoration: 'none',
            fontWeight: 200,
          }}
          className="usubeni"
          to={'/tag/coding/'}
        >
          {/* <img className="logo-mobile" src="/logo.mobile.png" /> */}
          <span className="logo-mobile">{title}</span>
          <img className="logo" src="/logo.png" />
        </Link>
        {pageName ? <div className="page-name">{'# ' + pageName}</div> : null}
      </React.Fragment>
    )
    const descript = <div className="page-description">{pageDescript}</div>
    return (
      <div className={className}>
        {/* <div className="sakura-box">
          {Array(12)
            .fill(0)
            .map((v, i) => (
              <div key={i} className="petal" />
            ))}
        </div> */}
        <div className="css-main">
          <article className="css-post">{children}</article>
          <aside className={'css-aside ' + (menuState ? 'open' : 'close')}>
            <header className="css-header">
              {websiteName}
              {/* {pageDescript ? descript : null} */}
              <div className="menu-button" onClick={this.toggleMenuState}>
                <span
                  className="iconfont"
                  dangerouslySetInnerHTML={{
                    __html: menuState ? '&#xe7fc;' : '&#xe7f4;',
                  }}
                />
              </div>
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
                <Menu direction="column" />
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <input onChange={this.change} onKeyUp={this.handleEnter} />
                  <br />
                  <button onClick={this.search}>搜索</button>
                </div>
              </React.Fragment>
            )}
          </aside>
        </div>
        <footer>
          <div style={footerStyle}>
            theme <span className="usubeni">UsubeniFantasy</span>
          </div>
          <div style={footerStyle}>© 2018-{year} SSShooter</div>
          <div style={footerStyle}>
            一转眼 已是
            {days}
          </div>
          <div style={footerStyle}>
            powered by{' '}
            <a
              style={{ color: 'rgb(102, 51, 153)', boxShadow: 'none' }}
              href="https://www.gatsbyjs.org/"
            >
              Gatsbyjs
            </a>
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
