import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import SEO from '../components/Seo'

function IndexPage({ data }) {
  return (
    <Layout>
      <GatsbyImage
        alt={data.file.name}
        style={{
          marginTop: '30px',
        }}
        image={data.file.childImageSharp.gatsbyImageData}
      />
    </Layout>
  )
}

export default IndexPage

export const Head = ({ location }) => (
  <SEO title="主页" pathname={location.pathname} />
)

export const query = graphql`
  query {
    file(relativePath: { eq: "yozakura.jpg" }) {
      name
      childImageSharp {
        gatsbyImageData(layout: FULL_WIDTH)
      }
    }
  }
`
