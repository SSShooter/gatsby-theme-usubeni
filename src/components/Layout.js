import React from 'react'
import { Link } from 'gatsby'
import Bio from './Bio'
import Menu from './Menu'
import 'prismjs/themes/prism.css'

import '../css/global.scss'

const randomGen = (min, max) => {
  return Math.random() * (max - min) + min
}
const keyframesGen = () => [
  {
    transform: 'translateY(0) translateX(0) translateZ(0) rotate3d(0, 0, 0, 0)',
  },
  {
    transform: `translateY(${randomGen(
      0,
      400
    )}px) translateX(2560px) translateZ(${randomGen(
      0,
      200
    )}px) rotate3d(${randomGen(0, 1)}, ${randomGen(0, 1)}, ${randomGen(
      0,
      1
    )}, ${randomGen(-2, 2)}turn)`,
  },
]

const optionGen = () => ({
  iterations: Infinity,
  delay: randomGen(-4000, 4000),
  duration: randomGen(14000, 22000),
})

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
  componentDidMount() {
    if (!document.body.animate) {
      console.log('load animate css')
      require('../css/sakura.animate.scss')
      return
    }
    let petal = document.querySelectorAll('.petal')
    for (let i = 0; i < petal.length; i++) {
      this.state.animation[i] = petal[i].animate(keyframesGen(), optionGen())
    }
    let a = document.querySelectorAll('a')

    for (let i = 0; i < a.length; i++) {
      a[i].onmouseenter = this.slowMotion
      a[i].onmouseleave = this.backNormal
      // 移动端用 touchstart touchend
    }
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
        <div className="sakura-box">
          {Array(12)
            .fill(0)
            .map((v, i) => (
              <div key={i} className="petal" />
            ))}
        </div>
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
