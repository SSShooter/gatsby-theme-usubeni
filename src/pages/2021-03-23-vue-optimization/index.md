---
path: '/vue-optimization'
date: '2021-03-23T09:53:29.360Z'
title: 'Vue 优化自查'
tags: ['coding']
released: false
---

## 拆分子组件

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

实践可知，在 dialog 的输入框修改数据时，会触发整个组件的渲染函数，而在 dialog2 输入时则不会。在对话框所在组件的数据量少的话确实差别不大，但是量大的时候在对话框输入的时候会有可感知的卡顿。（对话框自成一个组件，更新不影响父组件）

不止如此，反过来说，父组件更新的时候会渲染 dialog1 而不会渲染 dialog2，实在是一举两得。（父组件更新时不改变没有数据变化的子组件）

即使这个组件不复用，也可以把对话框用到的方法分离到单独文件，不用和主页面的方法混到一起。如果一个 dialog 有一大堆逻辑的话，分离到单独文件绝对是一个不错的方法。

不过缺点当然也有：

首先，数据交互有点不方便，不过总能活用 `$parent` 和 Vuex 等方式解决。

第二个问题是修改 `dialogData.visible` 时会报错 `Unexpected mutation of "dialogData" prop. (vue/no-mutating-props)`。

作为 Vue 的最佳实践，父给子的 prop 不得由子直接修改。我的观点是如果你知道自己在做什么，而且副作用不强的话……这样做大概也无妨，不知道大家的意见如何呢？

如果坚持最佳实践，有两个方案：

### sync

可以使用 `sync`，老实地用 on 和 emit，多些几句代码：

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

## 减少使用重型组件

很多 UI 框架十分完善，但就是因为太完善，各种功能相互作用可能会让你运行过慢或者不好 debug。

直接改原有框架当然可以，但是理解成本也不低，而且改完了，更新之后要合并代码更是难受，所以我更倾向于自己做一个。

造轮子听得多，但是对我来说，我不愿意做一个全世界都适用的轮子。

因为每个人的需求都是不同的，如果要做一个满足所有人的要求的轮子，这个轮子就会变得很重，我个人不太愿意看到……

所以我希望做的“轮子”是一个轻量化的，满足最小功能要求的“框架”，这样大家修改也方便，同时也不必担心随着不断更新越来越重。

例如 v-vld

## 单向绑定甚至完全不绑定

[MDN Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

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

## 拆分组件

上面说了

另外，某些情况可以用 computed 解决这个问题。

## 使用本地变量

简单来说就是要注意 watch 和 render 里面每一次 this 取值的代价都包含依赖收集的代码。

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

补充链接：https://mp.weixin.qq.com/s/wuNneeWA6yrVpYRteTJxkw

## v-show 重用 DOM

v-show 固然可以加快组件显示速度，但是 v-show 和 v-if 的平衡也要掌握好。v-if 可以用于首屏加载速度优化。

## KeepAlive

众所周知

## 分批渲染

## 分片

分批设置响应式数据，从而减少每次渲染的时间，提高用户感知到的流畅度。

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

## 虚拟滚动

原理其实和 Vue 没什么关系，算是一种懒加载。
