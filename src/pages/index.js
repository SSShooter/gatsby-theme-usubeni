import React from 'react'
import Layout from '../components/Layout'
import Img from 'gatsby-image'
import { graphql } from 'gatsby'

class IndexPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location} title="Usubeni Fantasy">
        <Img
          style={{
            marginTop: '30px',
          }}
          fluid={this.props.data.file.childImageSharp.fluid}
        />
      </Layout>
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
