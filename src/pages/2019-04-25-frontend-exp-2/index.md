---
path: '/frontend-exp-2'
date: '2019-07-21T09:21:08.667Z'
title: '前端的一些坑，一些记录，一些冷知识 2'
tags: ['coding']
---

> 距离同系列[上一篇](https://github.com/ssshooter/Front-End-EXP/blob/master/README.md)已经一年了...还是要惊叹时间过得是如此之快。在对前端开发熟悉之后，对“坑”的定义也发生了变化，所以记录的反而少了，留下的都是些比较实用的方法。现在看回来，今年踏出的不寻常的一步是接触了 RN。RN 这个东西...我对他的心情还是挺复杂的。他确实给前端工程师提供了一个方便编写安卓、iOS 应用的方法，但是对于一些奇葩需求还是需要自己对接原生模块。而且我刚进坑拉下来的第一个版本就连最简单的 button 组件（没记错的话）都是有 bug 的 😂。至于未来，多了 flutter 这个竞争者，希望可以和 RN 进行一下良性竞争？

## node

- 检查项目依赖更新的方法 1：npm-check 检查包的升级状况，可以自选更新
- 检查项目依赖更新的方法 2：
  ```
  npm i -g npm-check-updates
  ncu -u --packageFile package.json
  ```
- [nvm](https://github.com/creationix/nvm) 可安装多个 node 版本，自由切换，维护旧项目必备。
- 使用 [nrm](https://www.npmjs.com/package/nrm) 可以更方便地更换 npm 源
- `apt-get` 会安装假的 nodejs，真·安装方法：https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
- npx 会自动全局安装所需 npm 包，运行后**自动删除**该包，是一种用完即走的方法（存在意义是你会发现很多全局库只用一次之后就没再使用过了）
- npm 依赖可以来自 git 仓库链接：
  ```
  git+ssh://git@github.com:npm/cli.git#v1.0.27
  git+ssh://git@github.com:npm/cli#semver:^5.0
  git+https://isaacs@github.com/npm/cli.git
  git://github.com/npm/cli.git#v1.0.27
  ```
  参考：https://docs.npmjs.com/files/package.json#git-urls-as-dependencies
- 其实 npm 脚本也是有钩子的，依赖这样写，它被安装的时候就会自动构建啦，参考官方文档：https://docs.npmjs.com/misc/scripts
  ```
  "scripts": {
      "install": "gulp build",
      "test": "mocha --require babel-core/register ./test/**/*.js",
      "lint": "eslint src/**/*.js"
    },
  ```
- cross-env 的作用：跨平台设置环境变量

## html

- 点击穿透（类似的还有滑动穿透）问题的成因以及解决方案：https://segmentfault.com/a/1190000003848737
- `<a href="download.url" download="filename">下载</a>` 为 a 加上 download 属性浏览器就会下载链接的文件而不是在新页面打开。
- X-Frame-Options 响应头用于控制是否允许页面在 `<iframe>` 等标记中展现。
- 一个下拉选框默认无选择的方法
  ```html
  <select>
    <option value="" selected disabled hidden>请选择</option>
    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
    <option>5</option>
  </select>
  ```

## JavaScript

- 必须在 SVG 名称空间中创建 SVG 元素,因此不能由 createElement 创建,而必须使用 createElementNS 将 SVG 名称空间作为第一个参数
- 抽取 object 中**个别**属性
  `const picked = (({ a, c }) => ({ a, c }))(object);`
- 不能在 forEach 使用 await，forEach 要求同步函数。机制：async 函数返回一个 promise，最终是调用者处理这个 promise。然而，Array#forEach 不会处理回调函数返回的 promise，只是简单无视了他。

  如果你需要顺序执行，可以这样

  ```js
  async function printFiles() {
    const files = await getFilePaths()

    for (const file of files) {
      const contents = await fs.readFile(file, 'utf8')
      console.log(contents)
    }
  }
  ```

  ```js
  // 如果你需要并行执行，可以这样
  async function printFiles() {
    const files = await getFilePaths()

    await Promise.all(
      files.map(async file => {
        const contents = await fs.readFile(file, 'utf8')
        console.log(contents)
      })
    )
  }
  ```

- for/of 是遍历数组最可靠的方式，它比 for 循环简洁，并且没有 for/in 和 forEach()那么多奇怪的特例。for/of 的缺点是我们取索引值不方便，而且不能这样链式调用 forEach().forEach()。[来源](https://zhuanlan.zhihu.com/p/58881052)

- `encodeURIComponent` 不处理
  ```
  A-Z a-z 0-9 - _ . ! ~ * ' ( )
  ```
  `encodeURI` 不处理
  ```
  A-Z a-z 0-9 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) #
  ```
- `2011-10-05T14:48:00.000Z` 这个格式很常见，这是 **ISO 8601 标准**，规定日期和时间中间用 T 连接，hh:mm:ss.sss 和 hh:mm:ss 都正确。JS 获取此格式可以使用 `Date.prototype.toISOString()`。然而，转换得来的是 0 时区的时间，如果要得到中国（+8）时间需要`new Date(+new Date() + 8 * 60 * 60 * 1000).toISOString()`
- 这是一个隐性坑：使用 `x||y` 一定要注意前面如果是 `0` 的情况：因为你获取数据成功，但是得到的数据 x 若刚好是 0 就会变成用后面的 y 了。
- 一句话解决一个经典入门难题：匿名函数的 this 指向 window，如果不是匿名，this 关键字永远都**指向函数(方法)的所有者**，如果使用了箭头函数，是外层函数的 this
- ES7 语法 `::foo.bar` 等于 `foo.bar.bind(foo)`
- `const noop = () => {};` 空操作函数，需要回调但无操作时使用
- chrome 控制台有一个 `copy()` 方法，可以用于把数据复制到剪贴板，十分有用，知道以后就不用拿 node 写数据流了。对于对象可以这么写 `copy(JSON.stringify(temp6))`
- babel 会把 es6 `import` 转为 commmonjs，启用 tree shaking 必须 es6，所以需要使用 tree shaking 时必须关闭 babel 的模块语法转换。
- 节流防抖的定义：
  - 函数节流（throttle）：函数必须相隔一段时间才能再调用，可以用于滚动监听函数的性能优化
  - 函数防抖（debounce）：一段时间内无调用才真正执行函数，可以用于搜索框输入完整信息再搜索的情况
- `naturalWidth` 和 `naturalHeight` 属性可以直接获取图片节点的原始宽高，且浏览器普遍支持。
- 数组也可以用 `__proto__` 继承
  ```javascript
  a = []
  a.__proto__ = [2, 1, 2, 3, 3, 322]
  a[1]
  // 返回 1
  ```
- `>>` 的使用：n 右移 1 位等于 n/2，右移两位等于 n/4，类推；左移则是相反；同时左右移可以用于**去除小数**

## vue

- `keep-alive` 组件的 include 和 exclude 用的 name 是组件 name 而非路由 name。

## git

- github 爽快 PR 的方法，upstream 设定到 PR 目标，直接建一条新分支拉最新代码，然后把自己改好的文件单独 checkout 到该分支，然后 PR 新建分支，就能精准修改某些文件，而且不用拉到别人的修改。**这个方法是避免其他文件的 merge，如果你需要提交的文件被修改过，请一定要注意合并**

## react native

- 如果你的 App 希望向用户展示流畅的动画效果，那么**绝对不要使用 react native**。（iOS 还算能忍受，animated 在安卓就是水土不服，nativedriver 未支持所有属性）
- 尽管不是所有属性都支持，但是 `Animated` 在安卓尽可能添加 `useNativeDriver`
  ```javascript
  Animated.timing(this.state.animatedValue, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true, // <-- Add this
  }).start()
  ```
- RN 字体相关样式无继承，样式的继承只存在于 Text 元素内的 Text 元素
- react native 无文字竖排，只能 Array.from()
  拆分句子为一个个字再用 flexbox 竖排
- 引起 The development server returned response error code: 500 错误的原因：1⃣️ 引入文件路径错误 2⃣️ 重复引入
- attempt to assign to readonly property 在使用了动画的情况下是因为组件没有用动画组件
- RN 的 View 默认 border-box
- 启动不了但是没报错，是有可能没 link 好
- 与 web 不同，Text 组件宽度自适应需要添加 `alignSelf: 'flex-start'`
- 按平台引入文件可以在文件名后跟上对应平台，引入时会自动引入对应文件。
  ```javascript
  // 定义
  BigButton.ios.js
  BigButton.android.js
  // 引入时
  import BigButton from './BigButton'
  ```

## CSS

- 关于**表格的圆角**：分开的话设置 tr td 的 radius 会导致每个 td 都圆角
  并且有间隔很难看
  border-collapse: collapse;
  设置边框合并默认合并边框，详细看 mdn
  但是合并边框之后所有边框的 borderradius 都会失效
  所以只能用 box shadow 模拟边框
  然后用选择器去掉四周的边框（不去掉的话 boxshadow 内面还是直角）
- :active pseudo-class doesn't work in mobile safari https://stackoverflow.com/questions/3885018/active-pseudo-class-doesnt-work-in-mobile-safari
- 使用 transition 时不固定一些属性可能会产生初始动画，例如用了 scale 后不设定 size。
- position sticky 必须有 top left right bottom 其中一个属性，并且**父元素要发生滚动**，因为 sticky 相对于父元素吸附

## 微信小程序

- 小程序页面背景色
  ```css
  page {
      background-color: #f5f5f5;
  }
  ```
  而不是 json 里的 `backgroundColor`
- `<text>` 标签的换行符会如实反映，看起来像多了 padding

## 其他

- 我遇到过不止一次，页面样式不如预期，无论怎么调整，都与理论不相符，例如两个组建使用同一组样式，表现却不同。在这个情况可以试试**重启工程**，样式就恢复了。再强调一次，这个情况真的不止遇到过一次 😂
- 如果不小心把环境变量清空了，可以通过 `export PATH=/usr/bin:/usr/sbin:/bin:/sbin:/usr/X11R6/bin` 拯救命令丢失
- 时区不对会导致导致证书无效，https 网页不能登入（macOS）
- 项目中没用的文件尽早删掉，不然后来看回来会被无用文件迷惑，增加理解成本
