import React from 'react'
import Menu from '../components/Menu'
import { Link, graphql } from 'gatsby'
import Masonry from 'react-masonry-component'

import '../css/global.scss'

class Gallery extends React.Component {
  render() {
    const { data } = this.props
    const gallery = data.allFile.edges
    
    return (
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
        <Menu direaction="row" />
        <Masonry
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          {gallery.map(img => (
            <a
              className="img-box"
              href={img.node.publicURL}
              key={img.node.relativePath}
            >
              <div className="overlay">
                {img.node.name}
                {img.node.fields
                  ? Object.keys(img.node.fields.exifData).map((keyName, i) => (
                      <div key={i}>{img.node.fields.exifData[keyName]}</div>
                    ))
                  : null}
              </div>
              <img style={{ width: '100%' }} src={img.node.publicURL} />
            </a>
          ))}
        </Masonry>
      </div>
    )
  }
}

export default Gallery

export const query = graphql`
  query {
    allFile(
      sort: { fields: [birthTime], order: DESC }
      filter: { sourceInstanceName: { eq: "gallery" } }
    ) {
      edges {
        node {
          id
          name
          relativePath
          relativeDirectory
          publicURL
          sourceInstanceName
          fields {
            exifData {
              Make
              Model
              Software
              ModifyDate
              FocalLength
              ISO
              FNumber
              ExposureTime
            }
          }
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
