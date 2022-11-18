import React from 'react'
import Layout from '../components/Layout'
import Comment from '../components/Comment'
import { recommend, friends } from '../settings'
import SEO from '../components/Seo'

const placeholder = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path fill="gray" d="M819.2 729.088V757.76c0 33.792-27.648 61.44-61.44 61.44H266.24c-33.792 0-61.44-27.648-61.44-61.44v-28.672c0-74.752 87.04-119.808 168.96-155.648 3.072-1.024 5.12-2.048 8.192-4.096 6.144-3.072 13.312-3.072 19.456 1.024C434.176 591.872 472.064 604.16 512 604.16c39.936 0 77.824-12.288 110.592-32.768 6.144-4.096 13.312-4.096 19.456-1.024 3.072 1.024 5.12 2.048 8.192 4.096 81.92 34.816 168.96 79.872 168.96 154.624z" p-id="6295"></path><path fill="gray" d="M359.424 373.76a168.96 152.576 90 1 0 305.152 0 168.96 152.576 90 1 0-305.152 0Z"></path></svg>`

const LinkList = ({ list }) => (
  <div className="link-card-wrapper">
    {list.map((link) => (
      <a
        key={link.title}
        className="link-card "
        target="_blank"
        href={link.href}
      >
        {link.img ? (
          <img
            src={link.img}
            onError={({ currentTarget }) => {
              currentTarget.src = 'data:image/svg+xml;utf8,' + placeholder
            }}
          />
        ) : (
          <div className="noimage">{link.title[0]}</div>
        )}
        <div className="info">
          <div className="title">{link.title}</div>
          <div className="description">{link.description}</div>
        </div>
      </a>
    ))}
  </div>
)

const Links = ({ location: { pathname } }) => (
  <Layout pageName="链接库">
    <SEO title="链接库" pathname={pathname} />
    <h2>推荐</h2>
    <LinkList list={recommend} />
    <h2>友链</h2>
    <LinkList list={friends} />
    <Comment slug={'/links/'} />
    <h2>交换友链</h2>
    留言或发送相关信息到邮箱：ssshooterx@gmail.com
    <ul>
      <li>网站名称</li>
      <li>头像/印象图（非必要）</li>
      <li>简介（非必要）</li>
      <li>网站地址</li>
    </ul>
    <h3>我的信息</h3>
    <ul>
      <li>名称：UsubeniFantasy</li>
      <li>头像：https://ssshooter.com/logo.png</li>
      <li>简介：Write like you're running out of time.</li>
      <li>网址：https://ssshooter.com</li>
    </ul>
  </Layout>
)

export default Links
