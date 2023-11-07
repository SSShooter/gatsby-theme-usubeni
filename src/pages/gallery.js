import React from 'react'
import Menu from '../components/Menu'
import { Link, graphql } from 'gatsby'
import { siteName } from '../settings'
import SEO from '../components/Seo'

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
            {siteName}
          </Link>
          <span>#Gallery</span>
          <div>定格的生活</div>
        </header>
        <Menu direaction="row" />
        <div>
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
                <img style={{ width: '100%' }} alt={node.name} src={node.publicURL} />
              </a>
            )
          })}
        </div>
      </div>
    )
  }
}

export default Gallery

export const Head = ({ location }) => (
  <SEO
    title="定格的生活"
    pathname={location.pathname}
    description="定格的生活"
  />
)

export const query = graphql`
  query {
    allFile(sort: {birthTime: DESC}, filter: {sourceInstanceName: {eq: "gallery"}}) {
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
            fluid(maxWidth: 300) {
              ...GatsbyImageSharpFluid_noBase64
            }
          }
        }
      }
    }
  }
`
