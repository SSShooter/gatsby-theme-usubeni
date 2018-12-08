import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

class IndexPage extends React.Component {
  render() {
    return (
      <div>
        <Img style={{
          height:'80vh'
        }}
         fluid={this.props.data.file.childImageSharp.fluid} />
        <Layout location={this.props.location} title="Usubeni Fantasy">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <a style={{ fontSize: '1.5rem' }} href="/blog">
              blog
            </a>
            <a style={{ fontSize: '1.5rem' }} href="/gallery">
              gallery
            </a>
            <a style={{ fontSize: '1.5rem' }} href="/meme">
              meme
            </a>
            <a style={{ fontSize: '1.5rem' }} href="/about">
              about
            </a>
            <a style={{ fontSize: '1.5rem' }} href="/tags">
              tags
            </a>
          </div>
        </Layout>
      </div>
    )
  }
}

export default IndexPage

export const query = graphql`
  query {
    file(relativePath: { eq: "yozakura.png" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_noBase64
        }
      }
    }
  }
`
