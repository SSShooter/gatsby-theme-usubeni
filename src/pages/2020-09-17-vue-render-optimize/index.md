---
path: '/vue-render-optimize'
date: '2020-09-18T14:39:55.162Z'
title: '水* vue 渲染优化'
tags: ['水系列', 'Vue']
---

事情起因：单个页面请求了二三十个接口，数据多时展示得很慢

前置知识：[事件循环](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

Vue 不能像 React 一样通过 `setState` 触发页面重新渲染，每当你对被页面监听的值赋值，Vue 都会把修改的值记下来，运行完**宏任务（task）**后渲染页面。

正常来说，同一个宏任务内不管赋值多少遍，最后都会归作一次渲染。

但是请求接口时，写在回调函数里的，都是将要运行在另一个宏任务的代码。

于是，如果每个接口都写一遍 then 的话，页面就会频繁重新渲染，而且 Vue 只能强制渲染，而不能阻止渲染。

**注意：Vue 和 React 等框架重新渲染前都会先 diff dom 修改情况，从而最小化重新渲染的成本，所以不到你觉得特别卡的时候其实没有必要过早优化。**

所以为了减少渲染触发，可以结合以下两种方法：

- 使用 `Promise.all`
- 在请求完成前将页面屏蔽

```javascript
// 产生多个宏任务
axios.post('...').then(res => {
  this.a = res
})
axios.post('...').then(res => {
  this.b = res
})
// 等待全部完成后再赋值
Promise.all([axios.post('...'), axios.post('...')]).then([a,b] => {
  this.a = a
  this.b = b
})
```

至于写在 if else 里的请求就没有什么办法了，只能被拆分开两次任务。

下面顺便说说 `await`

```javascript
this.a = await axios.post('...')
this.b = await axios.post('...')
```

然而这看起来是同步运行的代码，本质上还是异步，所以即使这么写，依然是被拆分到两次任务。

这时候就说到第二点了，我们可以先屏蔽需要渲染的组件。

```html
<div v-if="show">{{a}} {{b}}</div>
```

```javascript
this.show = false
this.a = await axios.post('...')
this.b = await axios.post('...')
this.show = true
```

这样写的话，在任务完成前，因为 `v-if` 为 false，所以不会渲染包含 a 和 b 的部分，当然也不会触发重新渲染。不过这么做如果渲染时间过长，需要另外写一个骨架屏避免页面长时间空白。

水毕。
