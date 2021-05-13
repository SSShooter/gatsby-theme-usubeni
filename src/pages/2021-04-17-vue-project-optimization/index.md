---
path: '/vue-project-optimization'
date: '2021-04-17T22:55:43.936Z'
title: 'Vue 项目优化'
tags: ['coding']
released: false
---

下面按优化效果由高到低分享几个优化技巧，在最下面会有分类速览，也相当于一个总结。

## 拆分组件

我也曾以为，拆分子组件是用于抽象，但实践告诉我，拆分子组件是提升性能的一种方式（特定情况）。

在我的实际工作中遇到这么个问题，有一个很大的表格，里面有多个新增条目的对话框，当数据很多的时候，**在弹框中**填写新增数据都会变卡。

原因就是，在一个组件里，修改值会触发整个组件的 render 函数和 diff。但是明知道只是弹框填个数字，表单本身什么都没改，我还要浪费时间检查个啥呢？

为了解决这个问题，把对话框单独抽出来就成了**十分有效**的优化方法。

因为 Vue 的更新，是以组件为单位的，子组件更新是不会触发父组件更新的，除非子组件改变了父组件的数据。

以 element UI 的 dialog 举例吧（[打开此链接](https://codesandbox.io/s/child-component-optimization-refs-jwrnw?file=/src/components/HelloWorld.vue)直接打开可运行事例）。

写一个页面，里面包含两个 dialog，一个是直接写到页面中，另一个抽象为组件。

先看组件化的 dialog 吧，十分简单：

```html
<template>
  <el-dialog
    :append-to-body="true"
    title="提示"
    :visible.sync="visible"
    width="30%"
  >
    <el-input v-model="xxx" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="visible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: ['dialogData'],
    data() {
      return {
        xxx: '',
        visible: false,
      }
    },
  }
</script>
```

主页面如下，包含一个 el-dialog 和一个已经抽象的 my-dialog：

```html
<template>
  <div>
    <div>{{ renderAfter() }}</div>
    <el-button type="text" @click="dialogVisible = true"
      >点击打开 Dialog</el-button
    >
    <el-button type="text" @click="showMyDialog">点击打开 Dialog2</el-button>
    <el-dialog
      :append-to-body="true"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-input v-model="xxx" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <my-dialog ref="myDialog" />
  </div>
</template>

<script>
  import MyDialog from './Dialog'
  export default {
    components: { MyDialog },
    name: 'HelloWorld',
    props: {
      msg: String,
    },
    data() {
      return {
        xxx: '',
        dialogVisible: false,
      }
    },
    methods: {
      renderAfter() {
        if (!window.renderCountTech) window.renderCountTech = 1
        else window.renderCountTech++
        console.log(
          '%c渲染函数检测',
          'color:#fff;background:red',
          window.renderCountTech
        )
      },
      showMyDialog() {
        this.$refs.myDialog.visible = true
      },
    },
  }
</script>
```

实践可知，在 el-dialog 打开关闭、以及输入框修改数据时，会触发整个组件的渲染函数，而在 my-dialog 无论打开关闭或输入时都不会触发父组件更新。在对话框所在组件的数据量少的话确实差别不大，但是量大的时候在对话框输入的时候会有可感知的卡顿。（一句话：对话框自成一个组件，内部更新不影响父组件）

不止如此，反过来说，父组件更新的时候会渲染 el-dialog 而不会渲染 my-dialog，实在是一举两得。（一句话：父组件更新时不改变没有数据变化的子组件）

即使这个组件不复用，也可以把对话框用到的方法分离到单独文件，不用和主页面的方法混到一起。如果一个 dialog 有一大堆逻辑的话，分离到单独文件绝对是一个不错的方法。

不过缺点当然也有：数据交互有点不方便，你可以尝试活用 `$refs`、`$parent` 和 Vuex 等方式解决。

如果你不喜欢我上面使用 `this.$refs.myDialog.visible = true;` 的方案，也可以用传统 `$emit` 和 `$on`。

关于更新粒度更详细的解释可以看这里：[Vue 和 React 对于组件的更新粒度有什么区别](https://github.com/sl1673495/blogs/issues/38)

另外你也可以在 [React 渲染优化：diff 与 shouldComponentUpdate](/2019-03-15-react-render/) 中了解到在 React 中如何优化子组件更新的问题。

P.S.另外有一个隐藏结论，一个组件用了 slot 的话，子组件是会随着父组件重新渲染的

## 替换重型组件

开源轮子造福大家，但是满足的人越多，冗余的逻辑就越多。正常来说，它们确实是满足性能要求的，但是如果你在业务中真的遇到要用 v-for 循环几十上百个表格，那冗余逻辑造成的效率影响不容小觑，也会占用更多的内存。

所以尝试为自己造轮子吧，以最最简单的方式实现你的最小要求。我自己的话就是因为表格太多，然后 element UI 的表格组件太复杂，所以自己写了一个表格组件 [cpn-tbl](https://github.com/v-cpn/cpn-tbl)；以及一个仿 vee-validate 的轻量校验插件 [v-vld](https://github.com/v-cpn/v-vld)。

在实现组件时，你可能更需要熟悉 render 函数的使用方法，这样就能更自由更简洁地操纵节点结构。

## v-if

如果你需要首屏尽量快，`v-if` 绝对是你的好帮手。

另外，在 `v-if` 中使用[异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#%E5%BC%82%E6%AD%A5%E7%BB%84%E4%BB%B6)可以延迟部分代码的加载。

```javascript
new Vue({
  // ...
  components: {
    'my-component': () => import('./my-async-component'),
  },
})
```

借助 webpack 的代码拆分特性可以比较轻松实现这样的异步组件，当然，代码拆分也可以用于大型 js 文件（一些重型库）的延后加载。

P.S.说到代码拆分，这是一个无论使用什么框架都必须懂的优化方法，尤其是借助 Webpack 你可以借助简单的语法拆分代码，追求首屏的极致速度。

相反，使用 `v-show` 可以缓存组件增加 toggle 的流畅度。

## 分片渲染

这是一条尤其针对滚动流畅度的优化。大家都知道浏览器渲染和 JavaScript 运行互斥，如果一段代码在浏览器需要渲染的时候运行超过 1000/30 ms 的话，看起来就不足 30 帧了。

相关传送门：[requestAnimationFrame](/2021-03-23-optimization-checklist/#javascript)

## 缓存 ajax 数据

可以封装得像跟普通 axios 的 get 一样，直接替换原来的 axios 对象：

```javascript
import axios from 'axios'
import router from './router'
import { Message } from 'element-ui'
let baseURL = process.env.VUE_APP_BASEURL
let ajax = axios.create({
  baseURL,
  withCredentials: true,
})
let ajaxCache = {}

ajaxCache.get = (...params) => {
  let url = params[0]
  let option = params[1]
  let id = baseURL + url + (option ? JSON.stringify(option.params) : '')
  if (sessionStorage[id]) {
    return Promise.resolve(JSON.parse(sessionStorage[id]))
  }
  return ajax.get(...params)
}

ajax.interceptors.response.use(
  function(response) {
    // 其他处理
    // ……
    if (response.data.code === '20000') {
      let params = response.config.params
      let id = response.config.url + (params ? JSON.stringify(params) : '')
      sessionStorage[id] = JSON.stringify(response.data.data)
      return response.data.data
    }
  },
  function(error) {
    Message.error('连接超时')
    return Promise.reject(error)
  }
)

export default ajaxCache
```

如果实在觉得 `response.config.url + (params ? JSON.stringify(params) : '')` 这样的 id 太长的话，不妨加一个 `hash()` 缩短一下，不过会丧失了可读性。

## 冻结

针对只读表格等不会修改的数据，完全没有必要让数据变得“响应式”。`Object.freeze()` 就是用于这样的场景，阻止赋值到响应式数据，节省掉递归“响应式”的时间。对于大量而且大深度的对象，节省的时间还是挺可观。

## 有 for 必 key

作用：为 diff 算法加速。不过记得不要用单纯的 index 作 key，另外，for 一个 template 的话，每一个子元素都需要不同的 key。

说到这里突然想起，在用 element UI 的时候循环渲染 el-form-item，key 写错了，导致了无限重新渲染，debug 了好久 😂

## 分类速览

组件角度优化

- 拆分组件，利用组件级别的更新粒度优化更新速度
- 慎用重型组件，有必要时自己造，插件同理
- 使用函数式组件（低优先）

处理响应式的副作用

- 利用响应式的反模式
- 减少在依赖收集时使用 this（可优化首屏速度）

降低渲染压力

- v-show 与 v-if 的平衡
- 分片渲染

Vue 自带的缓存

- keepalive
- computed

其他优化

- 数据缓存
- 虚拟滚动
- 去除 console.log
