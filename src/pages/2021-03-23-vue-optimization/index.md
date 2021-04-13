---
path: '/vue-optimization'
date: '2021-03-23T09:53:29.360Z'
title: 'Vue 优化自查'
tags: ['coding']
# released: false
hiden: true
---

## 速览

组件角度优化

- 拆分组件，利用组件级别的更新粒度优化更新速度
- 慎用重型组件或插件，有必要时自己造
- 使用函数式组件（低优先）

处理响应式的副作用

- 利用响应式的反模式
- 减少在依赖收集时使用 this

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

## 拆分组件

我也曾以为，拆分子组件是用于抽象，但实践告诉我，拆分子组件是提升性能的一种方式（特定情况）。

在我的实际工作中遇到这么个问题，有一个很大的表格，里面有多个新增条目的对话框，当数据很多的时候，填写新增数据都会变卡。

原因就是，在一个组件里，修改值会造成整个组件的数据检查和 diff。但是明知道大表单什么都没改，我还要浪费时间检查个啥呢？

为了解决这个问题，把对话框单独抽出来就成了十分有效的优化方法。

在子组件更新时，默认是不会触发父组件更新的，除非子组件改变了父组件的数据。

我就以 element UI 的 dialog 举例吧：

[打开此链接](https://codesandbox.io/s/child-component-optimization-q8m1c?file=/src/components/HelloWorld.vue)直接打开可运行事例

写一个页面，里面包含两个 dialog，一个是直接写到页面中，另一个抽象为组件。

```html
<template>
  <div>
    <el-button type="text" @click="dialogVisible = true"
      >点击打开 Dialog</el-button
    >
    <el-button type="text" @click="dialogData.visible = true"
      >点击打开 Dialog2</el-button
    >
    <div>{{ renderAfter() }}</div>
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
    <my-dialog :dialogData="dialogData" />
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
        dialogData: {
          visible: false,
        },
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
    },
  }
</script>
```

以下是 dialog 组件的内容：

```html
<template>
  <el-dialog
    :append-to-body="true"
    title="提示"
    :visible.sync="dialogData.visible"
    width="30%"
  >
    <el-input v-model="xxx" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogData.visible = false">取 消</el-button>
      <el-button type="primary" @click="dialogData.visible = false"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: ['dialogData'],
    data() {
      return {
        xxx: '',
      }
    },
  }
</script>
```

实践可知，在 dialog 打开关闭、以及输入框修改数据时，会触发整个组件的渲染函数，而在 dialog2 无论打开关闭或输入时都不会触发父组件更新。在对话框所在组件的数据量少的话确实差别不大，但是量大的时候在对话框输入的时候会有可感知的卡顿。（一句话：对话框自成一个组件，内部更新不影响父组件）

不止如此，反过来说，父组件更新的时候会渲染 dialog1 而不会渲染 dialog2，实在是一举两得。（一句话：父组件更新时不改变没有数据变化的子组件）

即使这个组件不复用，也可以把对话框用到的方法分离到单独文件，不用和主页面的方法混到一起。如果一个 dialog 有一大堆逻辑的话，分离到单独文件绝对是一个不错的方法。

不过缺点当然也有：

首先，数据交互有点不方便，不过总能活用 `$parent` 和 Vuex 等方式解决。

第二个问题是修改 `dialogData.visible` 时会报错 `Unexpected mutation of "dialogData" prop. (vue/no-mutating-props)`。

作为 Vue 的最佳实践，父给子的 prop 不得由子直接修改。我的观点是如果你知道自己在做什么，而且副作用不强的话……这样做大概也无妨，不知道大家的意见如何呢？

如果坚持最佳实践，有两个方案：

### emit

老实地用 on 和 emit，多些几句代码：

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

这么写等于：

```html
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

然后再在子组件通过 `this.$emit('update:title', newTitle)` 更新父组件。

### 用引用操作值

可见性由 dialog 自己控制，在父组件通过 refs 设置 dialog 的可见性：

```javascript
this.$refs.child.visible = true
```

反过来呢？你也可以在子里修改父（这就不算是修改 prop 了，奇技淫巧）

```javascript
this.$parent.visible = true
```

关于更新粒度更详细的解释可以看这里：[Vue 和 React 对于组件的更新粒度有什么区别](https://github.com/sl1673495/blogs/issues/38)

PS：另外有一个隐藏结论，一个组件用了 slot 的话，子组件是会随着父组件重新渲染的

## computed

经过官方文档的强调，可以说是众所周知，computed 可以缓存计算结果，减少计算消耗时间。

## 减少使用重型组件和插件

很多 UI 框架十分完善，但就是因为太完善，各种功能相互作用可能会让你运行过慢或者不好 debug。

直接改原有框架当然可以，但是理解成本也不低，而且改完了，更新之后要合并代码更是难受，所以我更倾向于自己做一个。

造轮子听得多，但是对我来说，我不愿意做一个全世界都适用的轮子。

因为每个人的需求都是不同的，如果要做一个满足所有人的要求的轮子，这个轮子就会变得很重，我个人不太愿意看到……

所以我希望做的“轮子”是一个轻量化的，满足最小功能要求的“框架”，这样大家修改也方便，同时也不必担心随着不断更新越来越重。

例如 v-vld 和 tbl

## 单向绑定甚至完全不绑定

[MDN Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

单向绑定是指数据使用 `defineProperty` 把 `configurable` 设置成 `false`，这样使数据相应化的 defineReactive 会跳过响应式设置：

```javascript
Object.defineProperty(data, key, {
  configurable: false,
})
```

但是你仍然可以通过 v-model 向绑定的目标赋值，只是赋值后界面不会更新。

完全不绑定就是官网写的 `Object.freeze` 一个对象再赋值，这么做对象内部的值（第一层）就直接不能改了，可以应用于纯展示的数据。

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
    // ......
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

https://juejin.cn/post/6922641008106668045

## 函数式组件

```html
<template functional>
  <div class="cell">
    <div v-if="props.value" class="on"></div>
    <section v-else class="off"></section>
  </div>
</template>
```

PS：函数式组件因为没有实例化，所以每次使用都会重新渲染，想要完全静态要用 `v-once`

PS2：在 Vue3 中，functional 和普通组件速度[差别几乎可以忽略](https://v3.vuejs.org/guide/migration/functional-components.html#overview)

## 减少使用 this

简单来说就是要注意 computed、watch 和 render 里面每一次 this 取值的代价都包含依赖收集的代码，实际上这些代码只要运行一次就足够了。

```javascript
{
  computed: {
    base () {
      return 42
    },
    result ({ base, start }) {
      let result = start
      for (let i = 0; i < 1000; i++) {
        result += Math.sqrt(Math.cos(Math.sin(base))) + base * base + base + base * 2 + base * 3
      }
      return result
    },
  },
}
```

想要更详细了解这个问题，可以看这里：https://mp.weixin.qq.com/s/wuNneeWA6yrVpYRteTJxkw

## v-show 重用 DOM

v-show 固然可以加快组件显示速度，但是 v-show 和 v-if 的平衡也要掌握好。v-if 可以用于首屏加载速度优化。

## KeepAlive

众所周知

## 分片

- 分批赋值响应式数据，从而减少每次渲染的时间，提高用户感知到的流畅度。
- 重型组件使用 `v-if` 延后展示
- 可以借助 `requestAnimationFrame`

PS：个人体验，如果多个 ajax 牵扯到相同的一堆数据，分片渲染的速度恐怕并不会快，我会选择用 Promise.all 合并渲染

## 非响应式数据

defineReactive 会递归让 data 里的数据相应化，通过阻断这一操作提高复杂（深度大）对象的赋值效率。

```javascript
const data = items.map(item => optimizeItem(item))

function optimizeItem(item) {
  const itemData = {
    id: uid++,
    vote: 0,
  }
  Object.defineProperty(itemData, 'data', {
    // Mark as non-reactive
    configurable: false,
    value: item,
  })
  return itemData
}
```

PS：数据扁平化也可以缓解这个问题

## 虚拟滚动

原理其实和 Vue 没什么关系，算是一种懒加载。
