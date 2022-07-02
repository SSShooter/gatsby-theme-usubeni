import React from 'react'
import Layout from '../components/Layout'

const recommend = [
  {
    title: 'ECMA-262, 9th edition',
    description: 'ECMAScript 语言规范',
    href: 'https://www.ecma-international.org/ecma-262/9.0/index.html',
    img: 'https://www.ecma-international.org/ecma-262/9.0/img/ecma-logo.svg',
  },
  {
    title: 'Google Developers Web Updates',
    description: '关注 Chrome 和 V8 最新消息',
    href: 'https://developers.google.com/web/updates/',
    img: 'https://developers.google.cn/web/images/web-fundamentals-icon192x192.png',
  },
  {
    title: 'Web.dev',
    description: `Let's build the future of the web, together`,
    href: 'https://web.dev/blog/',
  },
  {
    title: 'SMASHING MAGAZINE',
    description: 'Web 技术博客',
    href: 'https://www.smashingmagazine.com/',
    img: 'https://www.smashingmagazine.com/images/footer/tablet__left.svg',
  },
  {
    title: 'Webクリエイターボックス',
    description: '日语前端技术资讯站',
    href: 'https://www.webcreatorbox.com/',
  },
  {
    title: '个站商店',
    description: '一个精致的，带社交元素的个人网站发布平台，博客收录网站',
    href: 'https://storeweb.cn/',
  },
]

const friends = [
  {
    title: '毕业后咖啡时间',
    description: '佛系游戏制作组',
    href: 'http://skt-studio.com/',
    img: 'https://tva4.sinaimg.cn/crop.0.0.690.690.180/c1679d2ajw8epdaoxuxtmj20j60j6mzu.jpg',
  },
  {
    title: '猫与向日葵',
    description: '浊以静之徐清，安以动之徐生。',
    href: 'http://imjad.cn/',
    img: 'https://secure.gravatar.com/avatar/1f1b82f7ab1429a50424ac18dce65e37?s=80&r=X&d=',
  },
  {
    title: '萌萌哒の柯基',
    description: '仰望大佬的菜鸡〒▽〒',
    href: 'https://heroyf.club/',
    img: 'https://file.heroyf.club/logo.jpg',
  },
  {
    title: 'FGHRSH 的博客',
    description: '是只可爱的男孩纸呢 ~',
    href: 'https://www.fghrsh.net/',
    img: 'https://gravatar.fghrsh.net/avatar/0c5d77513a08b8c3e38336859b53b027?s=80&d=mm&r=G',
  },
  {
    title: 'daidr.me',
    description: '在迷失中寻找自我',
    href: 'https://daidr.me/',
  },
  {
    title: 'nine-lie.com',
    description: `Lin's blog`,
    href: 'https://nine-lie.com/',
  },
  {
    title: '惊鸿',
    description: `Code a New World`,
    href: 'https://lzyz.fun/',
    img: 'https://lzyz.fun/wp-content/uploads/headImg.jpg',
  },
  {
    title: 'Mashiro',
    description: `樱花庄的白猫`,
    href: 'https://2heng.xin',
    img: 'https://view.moezx.cc/images/2018/03/27/avatar.jpg',
  },
  {
    title: '业余无线电台BD4SUR',
    description: `- 仁者心动 -`,
    href: 'https://bd4sur.com',
    img: 'https://avatars.githubusercontent.com/u/20069428?s=460&u=3ded739ffbd6d3076d43152e3001c1024a6a1ef9&v=4',
  },
  {
    title: '见字如面',
    description: `别再烦我，你别说话`,
    href: 'https://hiwannz.com/',
  },
  {
    title: `Tajoy's blog`,
    description: `一个不会摄影的程序猿, 不是一个好的艺术家`,
    href: 'https://tajoy.net/',
    img: 'https://raw.githubusercontent.com/tajoy/tajoy.github.io/src/static/profile.jpg',
  },
  {
    title: '卡拉搜索',
    description: 'elastic search 替代方案',
    href: 'https://kalasearch.cn/blog',
  },
  {
    title: `Sukka's Blog`,
    description: '童话只美在真实却从不续写',
    href: 'https://blog.skk.moe',
    img: 'https://cdn.jsdelivr.net/npm/skx@0.2.3/avatar/144x144.png',
  },
  {
    title: '刘悦的技术博客',
    description: 'Python 编程实践',
    href: 'https://v3u.cn',
    img: 'https://v3u.cn/v3u/Public/images/logo_dark.png',
  },
  {
    title: 'Go123 的博客',
    description: '告诉你一些好玩软件和网站，纯干货、0水分、快乐多O(∩_∩)O',
    href: 'https://go123.live',
  },
  {
    title: 'FFF 团',
    description: 'ACG 交流论坛',
    href: 'https://www.fffdann.com/index.php',
    img: 'https://i.loli.net/2021/03/18/YSuTaDrLCi7V8PX.jpg',
  },
  {
    title: '欧雷流',
    description:
      '我叫欧雷，是一个出生于上世纪 80 年代的理想主义叛逆青年。喜欢日本，热爱咖啡，善于总结。这里有我对技术和语言的研究，也有对世界和生活的思考',
    href: 'https://ourai.ws/',
    img: 'https://ourai.ws/assets/avatars/ourai-100px-3bcaa1cb0c7fa0547d15622572d74a8bbc98a5f62e4920ecddb72ca95e505d17.jpg',
  },
]

const Links = () => (
  <div>
    <Layout pageName="链接库">
      <h2>推荐</h2>
      <div className="link-card-wrapper">
        {recommend.map((link) => (
          <a className="link-card " target="_blank" href={link.href}>
            {link.img ? (
              <img src={link.img} />
            ) : (
              <div class="noimage">{link.title[0]}</div>
            )}
            <div class="info">
              <div class="title">{link.title}</div>
              <div class="description">{link.description}</div>
            </div>
          </a>
        ))}
      </div>
      <h2>友链</h2>
      <div className="link-card-wrapper">
        {friends.map((link) => (
          <a className="link-card " target="_blank" href={link.href}>
            {link.img ? (
              <img src={link.img} />
            ) : (
              <div class="noimage">{link.title[0]}</div>
            )}
            <div class="info">
              <div class="title">{link.title}</div>
              <div class="description">{link.description}</div>
            </div>
          </a>
        ))}
      </div>
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
  </div>
)

export default Links
