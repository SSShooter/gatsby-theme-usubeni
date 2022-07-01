import React from 'react'
import PropTypes from 'prop-types'

export default class HTML extends React.Component {
  render() {
    return (
      <html {...this.props.htmlAttributes}>
        <head>
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
          <script
            dangerouslySetInnerHTML={{
              __html: `
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?f0d372f52ceca5460b4187225904d16a";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
        `,
            }}
          />
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
          {this.props.headComponents}
        </head>
        {/* <div className="mask" /> */}
        <body {...this.props.bodyAttributes}>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
        <link rel="preconnect" href="https://fonts.gstatic.com"></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500&display=swap"
          rel="stylesheet"
        ></link>
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

// 被去掉的谷歌广告
/* <script
async
src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
/> */
// (adsbygoogle = window.adsbygoogle || []).push({
//   google_ad_client: "ca-pub-5174204966769125",
//   enable_page_level_ads: true
// });
