import React from 'react'
import Menu from '../components/Menu'
import { Link, graphql } from 'gatsby'
import Masonry from 'react-masonry-component'
import Helmet from 'react-helmet'

import '../css/global.scss'

class Gallery extends React.Component {
  render() {
    const { data } = this.props
    const gallery = data.allFile.edges

    return (
      <div className="css-gallery">
        <Helmet
          htmlAttributes={{ lang: 'zh' }}
          meta={[{ name: 'description', content: '定格的生活' }]}
          title={'Usubeni Fantasy | 定格的生活'}
        />
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
          <div>定格的生活</div>
        </header>
        <Menu direaction="row" />
        <Masonry
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          {gallery.map(({ node }) => {
            const exifData = node.fields ? node.fields.exifData : {}
            return (
              <a
                className="img-box"
                href={node.publicURL}
                key={node.relativePath}
              >
                <div className="overlay">
                  <div>
                    {exifData.Make} {exifData.Model}
                  </div>
                  <div>{exifData.Software}</div>
                  <div>
                    {exifData.FocalLength}&nbsp;&nbsp;&nbsp;&nbsp;
                    {exifData.FNumber}
                  </div>
                  <div>
                    {exifData.ExposureTime}&nbsp;&nbsp;&nbsp;&nbsp;
                    {exifData.ISO}
                  </div>
                  <div style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                    {node.name}
                  </div>
                </div>
                <img style={{ width: '100%' }} src={node.publicURL} />
              </a>
            )
          })}
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
