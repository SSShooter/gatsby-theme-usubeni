---
path: '/how-does-vue-work-1'
date: '2021-07-25T11:45:28.847Z'
title: 'Vue 响应式原理解析'
tags: ['coding', 'Vue']
---

几年来看了不少 Vue 原理的文章，在这些文章的帮助下，我也多次尝试自己理解 Vue 的源码，终于，我觉得是时候自己输出一下内容了，希望可以从不同于其他文章的角度带大家熟悉 Vue。

这个专题自然是分多个部分讲解 Vue 源码，第一篇就先讲最最经典的 Vue 响应式原理吧！

在正式讲原理之前，我觉得应该首先讲明白下面几个概念 ↓

## Dep

```javascript
var Dep = function Dep() {
  this.id = uid++
  this.subs = []
}
```

Dep 的含义，自然就是 dependency（也就是**依赖**，一个计算机领域的名词）。

就像编写 node.js 程序，常会使用 npm 仓库的依赖。在 Vue 中，依赖具体指的是**响应式处理后的数据**。后面会提到，响应式处理的关键函数之一是在很多 Vue 原理文章都会提到的 `defineReactive`。

Dep 与每个响应式数据绑定后，该响应式数据就会成为一个依赖（名词），下面介绍 Watcher 时会提到，响应式数据可能被 watch、computed、在模板中使用 3 种情况依赖（动词）。

### subs

Dep 对象下有一个 subs 属性，是一个数组，很容易猜出，就是 subscriber（订阅者）列表的意思咯。订阅者可能是 watch 函数、computed 函数、视图更新函数。

## Watcher

Watcher 是 Dep 里提到的**订阅者**（不要和后面的 Observer 观察者搞混）。

因为 Watcher 的功能在于及时响应 Dep 的更新，就像一些 App 的订阅推送，你（Watcher）订阅了某些资讯（Dep），资讯更新时会提醒你阅读。

### deps

与 Dep 拥有 subs 属性类似，Watcher 对象也有 deps 属性。这样构成了 Watcher 和 Dep 就是一个多对多的关系，互相记录的原因是当一方被清除的时候可以及时更新相关对象。

### Watcher 如何产生

上面多次提到的 watch、computed、渲染模板产生 Watcher，在 Vue 源码里都有简明易懂的体现：

- `mountComponent` 的 `vm._watcher = new Watcher(vm, updateComponent, noop);`
- `initComputed` 的 `watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions)`
- `$watcher` 的 `var watcher = new Watcher(vm, expOrFn, cb, options);`

## Observer

Observer 是观察者，他**负责递归地观察（或者说是处理）响应式对象（或数组）**。在打印出的实例里，可以注意到响应式的对象都会带着一个 `__ob__`，这是已经被观察的证明。观察者没有上面的 Dep 和 Watcher 重要，稍微了解下就可以了。

### walk

`Observer.prototype.walk` 是 Observer 初始化时递归处理的核心方法，不过此方法用于处理对象，另外还有 `Observer.prototype.observeArray` 处理数组。

## 核心流程

按照上面几个概念的关系，如何搭配，该如何实现数据响应式更新？

首先定下我们的目标：自然是在数据更新时，自动刷新视图，显示最新的数据。

这就是上面提到的 Dep 和 Watcher 的关系，数据是 Dep，而 Watcher 触发的是页面渲染函数（这是最重要的 watcher）。

但是新问题随之而来，Dep 怎么知道有什么 Watcher 依赖于他？

Vue 采用了一个很有意思的方法：

- 在运行 Watcher 的回调函数前，先记下当前 Watcher 是什么（通过 Dep.target）
- 运行回调函数中用到响应式数据，那么**必然会调用响应式数据的 getter 函数**
- 在响应式数据的 **getter 函数中就能记下当前的 Watcher**，建立 Dep 和 Watcher 的关系
- 之后，在响应式数据更新时，必然会**调用响应式数据的 setter 函数**
- 基于之前建立的关系，在 setter 函数中就能触发对应 Watcher 的回调函数了

## 代码

上述逻辑就在 `defineReactive` 函数中。这个函数入口不少，这里先讲比较重要的 `observe` 函数。

在 `observe` 函数中会 new Observer 对象，其中使用 `Observer.prototype.walk` 对对象中的值进行逐个响应式处理，使用的就是 `defineReactive` 函数。

因为 `defineReactive` 函数太重要了，而且也不长，所以直接贴到这边讲比较方便。

```javascript
function defineReactive(obj, key, val, customSetter, shallow) {
  var dep = new Dep()
  depsArray.push({ dep, obj, key })
  var property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get
  var setter = property && property.set

  var childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      var value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter(newVal) {
      var value = getter ? getter.call(obj) : val
      // 后半部分诡异的条件是用于判断新旧值都是 NaN 的情况
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      // customSetter 用于提醒你设置的值可能存在问题
      if ('development' !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    },
  })
}
```

首先每个响应式的值都是一个“依赖"，所以第一步我们先借闭包的能力给每个值造一个 Dep。（到 Vue 3 就不需要闭包啦）

接着看核心的三个参数：

- obj 当前需要响应式处理的值所在的对象
- key 值的 key
- val 当前的值

这个值还可能之前就定义了自己的 getter、setter，所以在做 Vue 的响应式处理时先处理原本的 getter、setter。

上面在核心流程中提到在 getter 函数会建立 Dep 和 Watcher 的关系，具体来说依靠的是 `dep.depend()`。

下面贴一下 `Dep` 和 `Watcher` 互相调用的几个方法：

```javascript
Dep.prototype.depend = function depend() {
  if (Dep.target) {
    Dep.target.addDep(this)
  }
}
Watcher.prototype.addDep = function addDep(dep) {
  var id = dep.id
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id)
    this.newDeps.push(dep)
    if (!this.depIds.has(id)) {
      dep.addSub(this)
    }
  }
}
Dep.prototype.addSub = function addSub(sub) {
  this.subs.push(sub)
}
```

通过这几个函数，可以领略到了 `Dep` 和 `Watcher` 错综复杂的关系……不过看起来迂回，简单来说，其实做的就是上面说的互相添加到多对多列表。

你可以在 Dep 的 subs 找到所有订阅同一个 Dep 的 Watcher，也可以在 Watcher 的 deps 找到所有该 Watcher 订阅的所有 Dep。

但是里面还有一个隐藏问题，就是 `Dep.target` 怎么来呢？先放一放，后会作出解答。先接着看看 setter 函数，其中的关键是 `dep.notify()`。

```javascript
Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice()
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}
```

不难理解，就是 Dep 提醒他的订阅者列表（subs）里的所有人更新，所谓订阅者都是 Watcher，`subs[i].update()` 调用的也就是 `Watcher.prototype.update`。

那么来看一下 Watcher 的 `update` 做了什么——

```javascript
Watcher.prototype.update = function update() {
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }
}
```

在这里我觉得有两个点比较值得展开，所以挖点坑 😂

- 坑 1：这里如果不是同步更新的话会跑到 queueWatcher，之后再来讲异步更新，同时也降低了这里的理解难度，总之知道 queueWatcher 在一顿操作之后还是会运行 run 就好了
- 坑 2：Watcher 的 cb 函数可能会处理 watch、computed 和**组件更新函数**。尤其重要的是组件更新函数，也正在这里进行 Vue 页面更新，所以这里也值得展开，为降低理解难度，只要知道更新在这里触发即可，更新方法后面再说
- 坑 3：可以看到 lazy 时其实没有运行下面的步骤只会标记数据更新过，在下次取值再计算新的值

```javascript
Watcher.prototype.run = function run() {
  if (this.active) {
    var value = this.get()
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value
      this.value = value
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue)
        } catch (e) {
          handleError(
            e,
            this.vm,
            'callback for watcher "' + this.expression + '"'
          )
        }
      } else {
        this.cb.call(this.vm, value, oldValue)
      }
    }
  }
}
```

这段代码的重点在于需要**现在 get 方法中对 Dep.target 进行了设置**。

因为只有 `Dep.target` 存在，之后在回调函数 cb（例如页面渲染函数就是一个典型的 Watcher cb）调用时，`Dep.prototype.depend` 才能真正生效。再之后的逻辑，就回到使用响应式数据的取值，一切都连起来了！形成闭环（滑稽）！这就是上面 `depend()` 遗留问题的答案。

## 总结

- Dep 与数据关联，代表数据可以成为依赖
- Watcher 与 watch、computed、渲染函数关联，代表这些函数可以成为依赖的订阅者
- Observer 算是一个处理 Dep 的入口，递归处理响应式数据
- Watcher 的回调函数在使用响应式数据时，会先设置 `Dep.target`
- 响应式数据在 getter 函数中通过 `Dep.target` 得知调用者，并与调用者建立订阅者和依赖的关系
- 响应式数据在 setter 函数中遍历 subs 通知所有订阅者该数据更新
- 当订阅者为视图更新函数（`updateComponent` -> `_update`）时，用户就能在响应式数据更新时看到页面更新，从而实现响应式更新效果

虽说粗略来说这个算法并不难理解，但实际上还有许多其他机制与这个算法一起协作，组成完整的 Vue。例如上面挖的坑：更新队列和组件更新的函数本身的实现，都值得学习。

另外还有代码里还有更多小细节，这就留下感兴趣的大家自己研究啦。

PS. 因为我的表达能力实在不算好，再加上知识的诅咒，不确定这篇文字是否能真的讲清楚 Vue 响应式原理，如果有什么看不懂的地方请在评论区提出，谢谢大家 💡

唯一参考链接：[Vue.js](https://github1s.com/vuejs/vue/blob/HEAD/dist/vue.js)