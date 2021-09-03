---
path: '/how-does-vue-work-2'
date: '2021-09-03T10:47:11.017Z'
title: 'Vue 的异步更新机制'
tags: ['coding', 'Vue']
---

这篇文章主要介绍的就是 Vue 异步更新相关的原理。本篇的核心理解起来没有响应式原理难，重点就是两个字**队列**。

## 异步更新

为什么需要异步更新？

```javascript
this.a = 1
this.b = 2
this.c = 3
this.a = 5
this.a = 6
```

想想嘛，根据前一篇解析的 Vue 响应式原理，响应式数据在赋值时运行 setter，会触发视图更新，但是就像上面例子中连续赋值的场景可以说十分常见了，在 React 倒是可以写在一个 `setState` 里，但是 Vue 没有这种方法。

总不能每次更新数据都立即给你刷新一次页面，如果每次赋值都跑一趟 `render`、`patch`，那整个页面不是卡得不行吗？

解决这个问题的关键就是先把需要运行的更新函数都存入队列（而且，在加入队列时，相同的函数不会重复加入），再异步运行队列。

## 相关变量

在正式分析 Vue 的异步队列原理之前，先看看实现队列使用的这些变量：

```javascript
var circular = {} // 开发环境检测循环引用
var queue = [] // watcher 队列
var activatedChildren = []
var has = {} // 是否已经加入队列
var waiting = false // 可以理解为是否在等待 flushing
var flushing = false // 是否已经开始处理队列
var index = 0 // 队列当前运行到哪里
```

你也许十分好奇，为什么会有 waiting 和 flushing 这么相似的两个变量呢？

开始我也很疑惑，是否正在 flushing，是否等待 flushing（waiting），虽然还是有细微的区别：

- 在 waiting 时，异步任务未开始
- 在 flushing 时，已经确定开始队列任务

开始时间有细微不同，但是他们重置的时机（`resetSchedulerState`）是一致的，似乎是没有分两个变量的必要，所以我暂时把这理解成可以让代码更自文档吧。

说回队列，这个系统存在着**两条队列**。既然[上篇](https://ssshooter.com/2021-07-15-how-does-vue-work-1/)说到 `queueWatcher` 会将需要更新的 watcher 放入队列，下次一并更新。现在就先讲 watcher 的队列，具体分析 `queueWatcher` 到底进行了怎样的操作。

## queueWatcher

```javascript
function queueWatcher(watcher) {
  var id = watcher.id
  if (has[id] == null) {
    has[id] = true // 标记 watcher 已添加到队列
    if (!flushing) {
      // 队列还没开始更新，直接推入队列即可
      queue.push(watcher)
    } else {
      // 队列正在处理中时，Vue 的做法是直接把新的 watcher 插到运行到的最新位置
      // 这蕴含着隐藏逻辑
      // 已经在前面运行过的 watcher 这时候会立即再在下一个运行
      var i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```

最后的 `nextTick(flushSchedulerQueue)` 就是把运行 **watcher 队列**放入 **nextTick 队列中**（虽然没有传参，但是 `flushSchedulerQueue` 可以读取 `queueWatcher` 处理的 `queue`）。

短短的这一句函数调用，连接了两个重点：`flushSchedulerQueue` 是处理 watcher 队列的核心，而 `nextTick` 是 Vue 异步渲染的核心。

## flushSchedulerQueue

根据官方注释，`queue.sort` 对队列进行排序，是为了保证：

- 父组件先于子组件
- 用户定义的 watcher 函数先于渲染 watcher
- 如果组件在父组件被 destroy，可以跳过这个 watcher（通过 watcher 的 active 属性）

```javascript
function flushSchedulerQueue() {
  flushing = true
  var watcher, id

  queue.sort(function(a, b) {
    return a.id - b.id
  })

  // queue 可变长，queue.length 不能缓存
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null // 已经处理的 watcher 从 has 去除
    watcher.run()
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice()
  var updatedQueue = queue.slice()

  resetSchedulerState() // 重置队列相关变量

  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)
}
```

简单来说 `flushSchedulerQueue` 就是用于处理 `queueWatcher` 编排好的 `queue`。

这里提出一个简单的实践问题，在 watch 某个值的回调函数中，可以访问最新的 DOM 吗？

答案就藏在上面的代码中：在 `flushSchedulerQueue` 函数对 `queue` 的循环处理中，`queue` 仍然会接受 `queueWatcher` push 的 watcher，这主要用于用户自定的 watch 函数或组件间触发的更新，就不安排到下一个循环了，直接插入 `queue` 按顺序更新。

所以，大家不要以为 watch 一个值的变化，在回调函数里就能拿到最新的 DOM，因为他们是运行在同一 tick 的（而且组件渲染函数因为 sort 总运行在最后）。

## nextTick

```javascript
var nextTick = (function() {
  var callbacks = []
  var pending = false
  var timerFunc

  function nextTickHandler() {
    pending = false
    var copies = callbacks.slice(0)
    callbacks.length = 0
    for (var i = 0; i < copies.length; i++) {
      copies[i]()
    }
  }

  if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    timerFunc = function() {
      setImmediate(nextTickHandler)
    }
  } else if (
    typeof MessageChannel !== 'undefined' &&
    (isNative(MessageChannel) ||
      // PhantomJS
      MessageChannel.toString() === '[object MessageChannelConstructor]')
  ) {
    var channel = new MessageChannel()
    var port = channel.port2
    channel.port1.onmessage = nextTickHandler
    timerFunc = function() {
      port.postMessage(1)
    }
  } else if (typeof Promise !== 'undefined' && isNative(Promise)) {
    // use microtask in non-DOM environments, e.g. Weex
    var p = Promise.resolve()
    timerFunc = function() {
      p.then(nextTickHandler)
    }
  } else {
    // fallback to setTimeout
    timerFunc = function() {
      setTimeout(nextTickHandler, 0)
    }
  }

  return function queueNextTick(cb, ctx) {
    var _resolve
    callbacks.push(function() {
      if (cb) {
        try {
          cb.call(ctx)
        } catch (e) {
          handleError(e, ctx, 'nextTick')
        }
      } else if (_resolve) {
        _resolve(ctx)
      }
    })
    if (!pending) {
      pending = true
      timerFunc()
    }
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function(resolve, reject) {
        _resolve = resolve
      })
    }
  }
})()
```

先解释一下 Vue 制造异步运行的方法吧——

> An asynchronous deferring mechanism. In pre 2.4, we used to use microtasks (Promise/MutationObserver) but microtasks actually has too high a priority and fires in between supposedly sequential events (e.g. #4521, #6690) or even between bubbling of the same event (#6566). Technically setImmediate should be the ideal choice, but it's not available everywhere; and the only polyfill that consistently queues the callback after all DOM events triggered in the same loop is by using MessageChannel.

根据官方注释，最开始 Vue 使用 Promise 等微任务更新队列，但是发现更新时机不太对，在不该插入的时间点插入更新，后来进行了修改。

这里 Vue 提供了 4 种制造异步调用的方式：

- setImmediate
- MessageChannel，IE 10 或以上均可使用，十分意外，不查不知道，MessageChannel 的可用范围居然比 Promise 还大
- Promise，注释写用于 Weex
- setTimeout 0，IE 10 以下

看回整个 `nextTick` 归根到底是什么？

从代码中看到这是一个立即执行函数，并返回一个 `queueNextTick` 函数。所以实际上我们使用的是 `queueNextTick(cb, ctx)`。（不过其实我也不是很懂为什么这里要用闭包包裹 `callbacks`、`timerFunc` 等变量而不直接放到外面）

在 `nextTick(flushSchedulerQueue)` 情况下，`flushSchedulerQueue` 就是回调函数 cb。

- 首先 cb 会被推入 callbacks，这是异步运行的队列，和 watcher 队列不是一回事
- 根据 `!pending` 的条件，pending 时会直接跳过 timerFunc 运行，直至上一次 nextTickHandler 完成

再顺带一提，我们平常用的 `$nextTick` 其实跟 `nextTick` 函数就是一个东西：

```javascript
Vue.prototype.$nextTick = function(fn) {
  return nextTick(fn, this)
}
```

## 总结

两个队列：

- queueWatcher 的 queue
- nextTick 的 callbacks

queue 是比较自由的，方便在更新组件时及时新增需要修改的组件。

虽然 `callbacks` 看起来是个队列，也是个数组，但是在 `waiting` 为 `true` 时并不会往 `callbacks` 塞东西，`callbacks` 应该是一直保持只有一个函数在排队的状态。（原理上应该是这样，但是不知道如何验证，如果有错误请指正）

流程：

- 异步更新的作用是防止重复运行更新函数，使运行更流畅
- setter 触发 watcher 后，回调函数不会立即运行，而是通过 `queueWatcher` 函数把 watcher 加入队列 `queue`
- 在空闲时，`queueWatcher` 函数运行 `nextTick(flushSchedulerQueue)`，把 `queue` 放到下一个 tick 运行
- `flushSchedulerQueue` 函数运行 watcher 队列的函数
- `nextTick` 就跟平常用的 `$nextTick` 一样，就是把队列运行放到下一 tick
- Vue 制造 next tick 的方法有 4 种：setImmediate、MessageChannel、Promise、setTimeout
