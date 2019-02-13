import Typography from 'typography'
import Wordpress2016 from 'typography-theme-wordpress-2016'

let $backgroundColor = '#ffffff'
let $fontColor = '#533D5B'
let $titleColor = '#e87a90'

Wordpress2016.overrideThemeStyles = () => ({
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
})

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
