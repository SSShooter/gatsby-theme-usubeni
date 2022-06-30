import React from 'react'
import { Link } from 'gatsby'
import Bio from './Bio'
import Menu from './Menu'
// import startSakura from '../sakura.TRHX.js'
import '../css/global.scss'

let footerStyle = {
  marginBottom: '1rem',
}

let theme = 'light'
let localTheme = localStorage.getItem('theme')
if (localTheme) {
  if (localTheme === 'dark') {
    theme = 'dark'
  } else {
    theme = 'light'
  }
} else if (window.matchMedia) {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark'
  } else {
    theme = 'light'
  }
} else {
  // default light
  theme = 'light'
}
document.documentElement.className = theme + '-theme'
class Layout extends React.Component {
  state = {
    menuState: false, // false for close, true for open
    keyword: '',
    animation: [],
    year: '',
    days: '',
    theme,
    flowerDance: false,
  }
  componentDidMount() {
    // avoid flash
    // document.documentElement.style.display = 'none'
    this.setState({
      year: new Date().getFullYear(),
      days: this.formatTime(new Date() - new Date('2018-12-05 14:13:38')),
    })
    let localFlowerDance = localStorage.getItem('flowerDance')
    if (!localFlowerDance) {
      this.setFlowerDance(0)
    } else {
      this.setFlowerDance(localFlowerDance)
    }

    // document.documentElement.style.display = 'block'
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
    console.log('setFlowerDance', n, sakuraCanvas)
    if (n == 1 && !sakuraCanvas) {
      // 假如本来就是 1 也不用担心 opacity 设置不了，因为本来初始化就是显示的啊
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
  formatTime = (msTime) => {
    const time = msTime / 1000
    const day = Math.floor(time / 60 / 60 / 24)
    // const hour = Math.floor(time / 60 / 60) % 24
    // const minute = Math.floor(time / 60) % 60
    // const second = Math.floor(time) % 60
    return ` ${day} 天`
  }
  handleEnter = (e) => {
    if (e.keyCode === 13) {
      this.search()
    }
  }
  render() {
    const { menuState, days, year, theme, flowerDance } = this.state
    const { pageName, pageDescript, title, children, aside, className } =
      this.props
    // const rootPath = `${__PATH_PREFIX__}/`

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
          {/* <img className="logo-mobile" src="/logo.mobile.png" /> */}
          <span className="logo-mobile">{title}</span>
          <img className="logo" src="/logo.png" />
        </Link>
        {pageName ? (
          <div className="page-name">
            <i className="iconfont">&#xe654;</i>
            {' ' + pageName}
          </div>
        ) : null}
      </div>
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
                  __html: aside,
                }}
              //  '<div class="box-title">TOC</div>' +
              />
            ) : (
              <React.Fragment>
                {/* <Bio className="css-bio" /> */}
                <Menu direction="column" />
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <input
                    placeholder="关键字，然后 Enter"
                    onChange={this.change}
                    onKeyUp={this.handleEnter}
                  />
                  <br />
                  {/* <button onClick={this.search}>搜索</button> */}
                </div>
              </React.Fragment>
            )}
          </aside>
        </div>
        <footer>
          <div className="social-media" style={footerStyle}>
            <a target="_blank" href="https://weibo.com/ariaqua">
              <i className="iconfont">&#xe883;</i>
            </a>
            <a target="_blank" href="https://twitter.com/zhoudejie">
              <i className="iconfont">&#xe882;</i>
            </a>
            <a target="_blank" href="https://github.com/ssshooter">
              <i className="iconfont">&#xe885;</i>
            </a>
            <a target="_blank" href="https://www.zhihu.com/people/ssshooter">
              <i className="iconfont">&#xe87c;</i>
            </a>
            <a target="_blank" href="https://ssshooter.com/rss.xml">
              <i className="iconfont">&#xe604;</i>
            </a>
          </div>
          <div style={footerStyle}>
            © 2018-{year} SSShooter • theme{' '}
            <span className="usubeni">UsubeniFantasy</span> • powered by{' '}
            <a style={{ boxShadow: 'none' }} href="https://www.gatsbyjs.org/">
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
