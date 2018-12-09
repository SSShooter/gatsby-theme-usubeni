import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'gatsby'
import Img from 'gatsby-image'

class IndexPage extends React.Component {
  render() {
    return (
      <div style={{
        maxWidth:'900px',
        margin:'auto'
      }}>
      <Img
        fluid={this.props.data.file.childImageSharp.fluid}
      />
        <Layout location={this.props.location} title="Usubeni Fantasy">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <a style={{ fontSize: '1.5rem' }} href="/tag/coding/">
              技术
            </a>
            <a style={{ fontSize: '1.5rem' }} href="/tag/diary/">
              生活
            </a>
            <a style={{ fontSize: '1.5rem' }} href="/tags">
              标签
            </a>
            <a style={{ fontSize: '1.5rem' }} href="/gallery">
              摄影
            </a>
            <a style={{ fontSize: '1.5rem' }} href="/meme">
              表情
            </a>
            <a style={{ fontSize: '1.5rem' }} href="/about">
              关于
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
    file(relativePath: { eq: "yozakura.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid_noBase64
        }
      }
    }
  }
`
