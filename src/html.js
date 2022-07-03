import React from 'react'
import PropTypes from 'prop-types'

export default class HTML extends React.Component {
  render() {
    return (
      <html {...this.props.htmlAttributes}>
        <head>
          {this.props.headComponents}
          <script
            dangerouslySetInnerHTML={{
              __html: `       
          var theme = 'light'
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
    `,
            }}
          />
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          />
          <meta
            name="google-site-verification"
            content="ebowurt3yvxVX2IhEbMGgmpbNBQIHYxRwVNbxuIx58s"
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
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </head>
        <body {...this.props.bodyAttributes}>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
}
