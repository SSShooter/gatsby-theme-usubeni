import React from 'react'
import Layout from '../components/Layout'
import { graphql } from 'gatsby'
import { siteName } from '../settings'
import { GatsbyImage } from 'gatsby-plugin-image'

function IndexPage({ location, data }) {
  return (
    <Layout location={location} title={siteName}>
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
