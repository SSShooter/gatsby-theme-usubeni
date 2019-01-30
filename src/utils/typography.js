import Typography from 'typography'
import Wordpress2016 from 'typography-theme-wordpress-2016'

let $backgroundColor = '#ffffff'
let $fontColor = '#533D5B'
let $titleColor = '#e87a90'

Wordpress2016.overrideThemeStyles = () => ({
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },
  'h1, h2, h3, h4, h5, h6': {
    fontWeight: 100,
  },
  h1: {
    fontSize: '1.5rem',
  },
  blockquote: {
    fontStyle: 'normal',
    color: $fontColor,
    borderLeft: '0.32813rem solid' + $titleColor,
  },
  img: {
    background: '#fff',
    padding: '5px',
  },
  body: {
    backgroundColor: $backgroundColor,
    color: $fontColor,
    fontFamily: 'source-han-sans-simplified-c, sans-serif',
    fontWeight: 400,
    fontStyle: 'normal',
  },
  hr: {
    background: '#000000',
  },
})

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
