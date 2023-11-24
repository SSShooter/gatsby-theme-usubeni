import { useEffect, useState } from 'react'
import { author, socialMedia } from '../settings'

let footerStyle = {
  marginBottom: '1rem',
}
const formatTime = (msTime) => {
  const time = msTime / 1000
  const day = Math.floor(time / 60 / 60 / 24)
  return ` ${day} 天`
}
const Footer = () => {
  const [year, setYear] = useState('')
  const [days, setDays] = useState('')
  useEffect(() => {
    setDays(formatTime(new Date() - new Date('2018-12-05T14:13:38')))
    setYear(new Date().getFullYear())
  })
  return (
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
  )
}

export default Footer