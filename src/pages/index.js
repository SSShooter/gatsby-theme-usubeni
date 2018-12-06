import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'gatsby'

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location} title="Usubeni Fantasy">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Link to="/blog">blog</Link>
          <Link to="/meme">meme</Link>
          <Link to="/tags">tags</Link>
        </div>
      </Layout>
    )
  }
}

export default NotFoundPage
