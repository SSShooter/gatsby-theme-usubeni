import React from 'react'
import Layout from '../components/Layout'
import PropTypes from 'prop-types'
import SEO from '../components/Seo'

import { Link, graphql } from 'gatsby'

const TagsPage = ({
  location: { pathname },
  data: {
    allMarkdownRemark: { group },
  },
}) => (
  <Layout pageName="标签库">
    <SEO title="标签库" pathname={pathname} />
    <ul className="css-tags">
      {group.map((tag) => (
        <li key={tag.fieldValue} className="css-tag">
          <Link to={`/tag/${tag.fieldValue}/`}>
            #{tag.fieldValue} <sup>{tag.totalCount}</sup>
          </Link>
        </li>
      ))}
    </ul>
  </Layout>
)

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: {frontmatter: {released: {ne: false}, hidden: {ne: true}}}
      limit: 2000
    ) {
      group(field: {frontmatter: {tags: SELECT}}) {
        fieldValue
        totalCount
      }
    }
  }
`
