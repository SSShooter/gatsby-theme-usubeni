---
path: '/vue-binding'
date: '2019-09-03T09:31:08.722Z'
title: 'Vue 添加响应式属性的正确姿势'
tags: ['coding', 'Vue']
---

默认此文读者明白简单的 Vue 底层原理，对此陌生的读者可以先看：

- [你不知道的 Vue 响应式原理](https://juejin.im/post/5a734b6cf265da4e70719386)
- [从 vue 源码看观察者模式](https://zhuanlan.zhihu.com/p/33373207)

此文使用的 Vue 版本是 2.0+，在线例子看[这里](https://codesandbox.io/s/v-model-3j96f)，下面顺便也把关键代码贴出来。

```html
<template>
  <div class="hello">
    <button @click="inputvalue.aaaa = 'aaaa is here'">show aaaa</button>
    <button @click="$forceUpdate()">forceupdate</button> {{inputvalue.aaaa}}
    <br />
    cccc {{inputvalue.cccc}}
    <input v-model="inputvalue.cccc" placeholder="with v-model" />
    <input
      @input="inputvalue.cccc = $event.target.value"
      :value="inputvalue.cccc"
      placeholder="with @input"
    />
    <br />
    bbbb {{inputvalue.bbbb}}
    <input v-model="inputvalue.bbbb" placeholder="with v-model" />
    <input
      @input="inputvalue.bbbb = $event.target.value"
      :value="inputvalue.bbbb"
      placeholder="with @input"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        inputvalue: {
          bbbb: '',
        },
      }
    },
  }
</script>
```

## 提出问题

最近的项目大量接触到动态新增的数据，觉得必须要搞清楚到底什么时候 vue 会让视图更新，视图修改数据又会不会反映到数据模型。

于是写了简单几个例子作为对比，结合一年前研究了一下但是现在忘得差不多的 Vue 原理知识，解决了这么个问题 ——

什么情况下动态添加对象属性是安全操作（换句话说就是可以保证数据是响应式的）？

## 直接赋值为什么不可以

首先解释例子中 `inputvalue.aaaa` 不显示的问题。

这要从 Vue 的响应式原理说起。在初始化的时候 Vue 会把 data 的数据递归扫描一遍，设置 setter 和 getter。

**getter 的作用是在数据被读取时记下当前的调用者**，这个调用者也就是这个数据的“订阅者”。

若视图使用了某个数据，处理页面时就会调用该数据，成为该数据的一个订阅者。

**setter 的作用是在数据被赋值时，会提醒他的订阅者该数据已更新**，然后订阅者就知道要运行对应的更新操作，例如视图更新、watch 函数。

设置 getter，setter 常被称为劫持，感觉也挺形象的，下面就简单用**劫持**指代这个行为。

既然在初始化时数据才被劫持，那么你突然的定义 `this.inputvalue.aaaa = 'aaaa is here'` 显然会让 Vue 猝不及防。**这个属性即使有订阅者，但是因为没有走到“劫持”这一步，所以这个属性根本意识不到他有订阅者。**

其实把数据打印出来可以简单地判定这个数据是否已经被劫持。如下图，bb 没有被劫持，aa、cc 都已被劫持。

![](property.png)

## 应对方法是什么

最简单的方法是：直接在 data 写清楚，也就是页面用了什么属性都必须写上。例如对于 `inputvalue.aaaa`，就直接在 data 里面加上 aaaa 属性。

但是...想了想，这大概不算“动态”添加了吧 😂

### 使用 set

> 向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新属性，因为 Vue 无法探测普通的新增属性 (比如 this.myObject.newProperty = 'hi')

`Vue.set` 或者 Vue 实例的 `$set` 都是一样的，总之就是手动触发一次劫持，之后在更新的时候就能触发视图重新渲染啦！

不过，其实 set 在一种情况下会失效，这个后面会提到...

### 使用 forceUpdate

这个方法算是一种曲线救国吧。

如果你不需要双向绑定，在动态新增属性时你可以使用 `$forceUpdate()`。这个函数的作用就如其名，强制更新重新渲染。

上面说过了，**虽然你设置新数据没有通知页面重新渲染，不过数据终究是改了。**所以你只需要强制更新视图，就能看到数据修改后的效果。

### Vue 单向绑定

```html
<input
  :value="myValue.property"
  @input="myValue.property = $event.target.value"
/>
```

你可能从未听过 Vue 单向绑定，但是这样做也算是一个单向绑定了 😂

当你的输入确实地改变了 `myValue.property` 的值，但是不会触发任何关于 `myValue.property` 的更新。真的需要更新的时候 `forceUpdate` 就可以了。

### 数组呢

如果数组里有对象，只要单个对象符合上面操作即可，没有特别需要注意的地方。

但是老调重弹，数组更新方法还是需要注意，你可以通过整个数组重新赋值以及 push()、pop()、shift()、unshift()、splice()、sort()、reverse() 这几个经过包裹的方法触发更新。

## 奇葩情况

### 例子

对比上面 `cccc` 的两个输入框：

```html
<input v-model="inputvalue.cccc" placeholder="with v-model" />
<input
  @input="inputvalue.cccc = $event.target.value"
  :value="inputvalue.cccc"
  placeholder="with @input"
/>
```

进行两种操作：

1. 先在 with v-model 框输入，后在 with @input 框输入
2. 先在 with @input 框输入，后在 with v-model 框输入

**操作一，一切正常；操作二，无法更新。**这就证明坊间流传的 v-model 是 @input 和 :value 的语法糖这个说法至少放在现在肯定是错的（其实我往下试了几个版本，这两个操作表现都是不一致的，觉得很迷惑，但是这不是重点，先不纠结了）。

### 那么 v-model 到底做了什么

在 stackoverflow 上经过大佬指点，上面的情况其实很容易理解，造成这个区别的重点有两个：

1. **v-model 处理对象属性会自动触发 set** -> [相关源码](https://github.com/vuejs/vue/blob/399b53661b167e678e1c740ce788ff6699096734/src/compiler/directives/model.js#L44)
2. **set 对已存在的属性并不会再次让他变为“响应式”** -> [相关源码](https://github.com/vuejs/vue/blob/399b53661b167e678e1c740ce788ff6699096734/src/core/observer/index.js#L212)

所以对于操作一，v-model 帮你把数据 set 了，自然一切正常；操作二，@input 先把属性直接静态添加了，到了 v-model 的时候 set 不会再劫持已经存在的属性。

这就引出了一个需要注意的地方，**若是先直接赋值，即使再用 set 也不能再劫持这个属性了**，这个可怜弱小又的属性已经无法再变成响应式了。

## 参考链接

- [官方文档-set](https://cn.vuejs.org/v2/api/#Vue-set)
- [v-model 干了啥](https://stackoverflow.com/questions/57780626/how-v-model-make-a-property-of-object-reactive)
