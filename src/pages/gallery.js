import React from 'react'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import { graphql } from 'gatsby'

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props
    console.log(data)
    const gallery = data.allFile.edges
    return (
      <Layout location={this.props.location} title="Usubeni Fantasy"  pageName="Gallery" pageDescript="试验性摄影区">
        <div className="masonry">
          {gallery.map(img => (
            <a
              href={img.node.publicURL}
              key={img.node.relativePath}
              style={{
                display: 'block',
                boxShadow: 'none',
                width: '100%',
                marginBottom:'10px'
              }}
            >
              <img style={{width:'100%'}} src={img.node.publicURL} />
            </a>
          ))}
        </div>
      </Layout>
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
