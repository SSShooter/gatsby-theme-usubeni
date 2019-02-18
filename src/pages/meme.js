import React from 'react'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import { graphql } from 'gatsby'

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props
    const meme = data.allFile.edges
    return (
      <Layout
        location={this.props.location}
        title="Usubeni Fantasy"
        pageName="沙雕表情库"
        pageDescript="点击图片，大图带走"
      >
        <div className="css-meme">
          {meme.map(img => (
            <a
              href={img.node.publicURL}
              key={img.node.relativePath}
              style={{
                boxShadow: 'none',
              }}
            >
              <Img
                style={{
                  margin: '12px',
                }}
                fixed={img.node.childImageSharp.fixed}
              />
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
    allFile(filter: { sourceInstanceName: { eq: "meme" } }) {
      edges {
        node {
          id
          relativePath
          relativeDirectory
          publicURL
          sourceInstanceName
          childImageSharp {
            # Specify the image processing specifications right in the query.
            # Makes it trivial to update as your page's design changes.
            fixed(width: 125, height: 125) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`
