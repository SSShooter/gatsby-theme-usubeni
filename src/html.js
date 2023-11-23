import React from 'react'
import PropTypes from 'prop-types'

const HTML = (props) => {
  return (
    <html lang="zh-CN" {...props.htmlAttributes}>
      <head>
        {props.headComponents}
        <script
          dangerouslySetInnerHTML={{
            __html: `       
            var theme = 'light' 
            var setTheme = function(name) {
              theme = name
              localStorage.setItem('theme', name)
              document.documentElement.className = name + '-theme'
            }
            let localTheme = localStorage.getItem('theme')
            if (localTheme) {
              setTheme(localTheme)
            } else if (window.matchMedia) {
              const mql = window.matchMedia('(prefers-color-scheme: dark)')
              function handleColorSchemeChange(e) {
                if (e.matches) {
                  setTheme('dark')
                } else {
                  setTheme('light')
                }
              }
              handleColorSchemeChange(mql)
              mql.addEventListener('change', handleColorSchemeChange)
            } else {
              setTheme('light')
            }
            `,
          }}
        />
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta
          name="format-detection"
          content="email=no,telephone=no,address=no"
        />
        <meta name="baidu-site-verification" content="rVEuQMP8C6" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css"
          integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0"
          crossOrigin="anonymous"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

export default HTML

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
