import React from 'react'
import { Link } from 'gatsby'
import Bio from './Bio'
import Menu from './Menu'
import 'prismjs/themes/prism.css'
// import '../sakura.TRHX.js'
import '../css/global.scss'

class Layout extends React.Component {
  state = {
    menuState: false, // false for close, true for open
    keyword: '',
    animation: [],
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
  render() {
    const { menuState } = this.state
    const { pageName, pageDescript, title, children, aside } = this.props
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
      <div>
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
              {pageDescript ? descript : null}
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
                  <input onChange={this.change} />
                  <br />
                  <button onClick={this.search}>搜索</button>
                </div>
              </React.Fragment>
            )}
          </aside>
        </div>
        <footer>
          <div>
            theme <span className="usubeni">UsubeniFantasy</span>
          </div>
          <div>© 2018-{new Date().getFullYear()} SSShooter</div>
          <div>
            一转眼 已是
            {this.formatTime(new Date() - new Date('2018-12-05 14:13:38'))}
          </div>
          <div>
            powered by{' '}
            <a
              style={{ color: 'rgb(102, 51, 153)', boxShadow: 'none' }}
              href="https://www.gatsbyjs.org/"
            >
              Gatsbyjs
            </a>
          </div>
        </footer>
      </div>
    )
  }
}

export default Layout
