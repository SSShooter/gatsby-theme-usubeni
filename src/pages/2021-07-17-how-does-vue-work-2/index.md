---
path: '/how-does-vue-work-2'
date: '2021-07-17T10:47:11.017Z'
title: 'how-does-vue-work-2'
tags: ['coding']
released: false
---

调度器

## 异步更新

为什么需要异步更新？

想想嘛，总不能你每次更新数据都立即给你刷新一次页面，如果接口返回了十几个数据，每次赋值都更新，那不是会卡得不行吗？

这篇文章主要介绍的就是 Vue 异步更新相关的原理。

本篇的核心理解起来没有响应式原理难，重点就是两个字**队列**。

## 用到的变量

在正式分析队列原理之前，先看看实现队列使用的这些变量：

```javascript
var circular = {} // 开发环境检测循环引用
var queue = []
var activatedChildren = []
var has = {} // 是否已经加入队列
var waiting = false // 可以理解为是否在等待 flushing
var flushing = false // 是否已经开始处理队列
var index = 0 // 队列当前运行到哪里
```

你也许十分好奇，为什么会有 waiting 和 flushing 这么相似的两个变量呢？

开始我也很疑惑，是否正在 flushing，是否等待 flushing（waiting），完全可以只用 flushing 解决……吗？

其实还是有细微的区别：

- 在 waiting 时，异步任务未开始
- 在 flushing 时，已经确定开始队列任务

说回队列，这个系统存在着**两条队列**。既然上篇说到 queueWatcher 会将需要更新的 watcher 放入队列，下次一并更新。现在就先讲 watcher 的队列，现在具体分析 queueWatcher 到底进行了怎样的操作。

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

<!-- 最后的 `nextTick(flushSchedulerQueue)` 就是把运行 **watcher 队列**放入 **nextTick 队列中**。 -->

最后的 `nextTick(flushSchedulerQueue)` 蕴含两个重点。flushSchedulerQueue 是处理 watcher 队列的核心，而 nextTick 是 Vue 异步渲染的核心。

## flushSchedulerQueue

根据官方注释，对队列进行排序，是为了保证：

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

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    id = watcher.id
    has[id] = null // 已经处理的 watcher 从 has 去除
    watcher.run()
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice()
  var updatedQueue = queue.slice()

  resetSchedulerState()

  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)
}
```

## nextTick

nextTick 是什么？从代码中看到这是一个立即执行函数，返回一个 queueNextTick 函数。

所以实际上我们使用的是 `queueNextTick(cb, ctx)`

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

> An asynchronous deferring mechanism. In pre 2.4, we used to use microtasks (Promise/MutationObserver) but microtasks actually has too high a priority and fires in between supposedly sequential events (e.g. #4521, #6690) or even between bubbling of the same event (#6566). Technically setImmediate should be the ideal choice, but it's not available everywhere; and the only polyfill that consistently queues the callback after all DOM events triggered in the same loop is by using MessageChannel.

最开始 Vue 使用 Promise 等微任务更新队列，但是发现更新得太不是时候，在不该插入的时间点插入更新，后来进行了修改。

这里 Vue 提供了 4 种制造异步调用的方式：

- setImmediate
- MessageChannel
- Promise
- setTimeout 0

在给 queueNextTick 传入 cb 时，在 `nextTick(flushSchedulerQueue)` 情况下，flushSchedulerQueue 就是回调函数 cb。

- 首先 cb 会被推入 callbacks，这是异步运行的队列，和 watcher 队列不是一回事
- 根据 `!pending` 的条件，pending 时会直接跳过 timerFunc 运行，直至上一次 nextTickHandler 完成

## 总结

两个队列：

- queueWatcher 的 queue
- nextTick 的 callbacks

queue 是比较自由的，方便在更新组件时及时新增需要修改的组件；而 callbacks 则是限定地一波一波进行处理。