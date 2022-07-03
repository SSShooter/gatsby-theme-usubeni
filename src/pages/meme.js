import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import { siteName } from '../settings'
import { GatsbyImage } from 'gatsby-plugin-image'

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props
    const meme = data.allFile.edges
    return (
      <Layout
        location={this.props.location}
        title={siteName}
        pageName="沙雕表情库"
        pageDescript="点击图片，大图带走"
      >
        <div className="css-meme">
          {meme.map((img) => (
            <a
              href={img.node.publicURL}
              key={img.node.relativePath}
              style={{
                boxShadow: 'none',
              }}
            >
              <GatsbyImage
                alt={img.node.name}
                style={{
                  margin: '12px',
                }}
                height="200px"
                image={img.node.childImageSharp.gatsbyImageData}
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
          name
          publicURL
          sourceInstanceName
          childImageSharp {
            gatsbyImageData(layout: FIXED height:150)
          }
        }
      }
    }
  }
`
