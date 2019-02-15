import React from 'react'
import Menu from '../components/Menu'
import { Link, graphql } from 'gatsby'

import '../css/global.scss'

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props
    const gallery = data.allFile.edges
    return (
      // <Layout location={this.props.location} title="Usubeni Fantasy"  pageName="Gallery" pageDescript="试验性摄影区">
      <div className="css-gallery">
        <header>
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
              fontSize: '2rem',
              fontWeight: 200,
            }}
            className="usubeni"
            to={'/tag/coding/'}
          >
            Usubeni Fantasy
          </Link>
          <span>#Gallery</span>
          <div>试验性 修图/摄影区</div>
        </header>
        <Menu direaction="row"/>
        {gallery.map(img => (
          <a
            href={img.node.publicURL}
            key={img.node.relativePath}
            style={{
              display: 'block',
              boxShadow: 'none',
              width: '100%',
              marginBottom: '10px',
            }}
          >
            <img style={{ width: '100%' }} src={img.node.publicURL} />
          </a>
        ))}
      </div>
      // </Layout>
    )
  }
}

export default NotFoundPage

export const query = graphql`
  query {
    allFile(filter: { sourceInstanceName: { eq: "gallery" } }) {
      edges {
        node {
          id
          name
          relativePath
          relativeDirectory
          publicURL
          sourceInstanceName
          childImageSharp {
            # Specify the image processing specifications right in the query.
            # Makes it trivial to update as your page's design changes.
            fluid(maxWidth: 300) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
  }
`
