import React from 'react'
import Layout from '../components/Layout'
import { Link } from 'gatsby'
import Img from 'gatsby-image'
import { graphql } from 'gatsby'

class IndexPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location} title="Usubeni Fantasy"  pageName="关于我" pageDescript="小小的我">
        <div>
          一个 web 前端开发工程师，机缘巧合接触到
          RN，现在已经不知为何开始研究起了 iOS 和 android
          原生...是不是走错路了啊 😭
        </div>
        <div>GitHub: https://github.com/ssshooter</div>
        <div>segmentfault: https://segmentfault.com/u/ssshooter</div>
        <div>twitter: https://twitter.com/zhoudejie</div>
        <div>
          新人骑空士，在爆肝的路上渐行渐远，和程序员这个职业结合起来，简直头发再见
        </div>
        <div>在这里当然要私心放出链接 http://game.granbluefantasy.jp/</div>
        <h1 className="css-page-name">work</h1>
        <h2>canvas-img-process</h2>
        https://github.com/ssshooter/canvas-img-process
      </Layout>
    )
  }
}

export default IndexPage

export const query = graphql`
  query {
    allFile(filter: { relativePath: { regex: "/work/" } }) {
      edges {
        node {
          publicURL
        }
      }
    }
  }
`
