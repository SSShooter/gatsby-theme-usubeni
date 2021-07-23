---
path: '/how-does-vue-work-1'
date: '2021-07-15T11:45:28.847Z'
title: 'how-does-vue-work-1'
tags: ['coding']
released: false
---

经典的 Vue 响应式原理讲解，首先讲明白几个概念吧。

## Dep

Dep 的含义，自然就是 dependency（依赖）了。

就像编写 node.js 程序，常会使用 npm 仓库的依赖。在 Vue 中，依赖具体指的是**被响应式处理的值**。后面会提到，响应式处理的关键函数之一是大家或许很眼熟的 `defineReactive`。

### subs

Dep 对象下有一个 subs 属性，是一个数组，很容易猜出，就是 subscriber（订阅者）列表的意思咯。

## Watcher

既然 Observer 是观察者，那么 Watcher 是个啥呢？ 没错！就是 Dep 里提到的订阅者。

因为 Watcher 的功能在于及时响应 Dep 的更新，就像一些 App 的订阅推送，你（Watcher）订阅了某些资讯（Dep），资讯更新时会提醒你阅读。

### deps

Watcher 对象也有 deps 属性。Watcher 和 Dep 就是一个多对多的关系，互相记录的原因是当一方被清除的时候可以及时更新相关数据。

### Watcher 如何产生

`mountComponent` 的 `vm._watcher = new Watcher(vm, updateComponent, noop);`

`initComputed` 的 `watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions)`

`$watcher` 的 `var watcher = new Watcher(vm, expOrFn, cb, options);`

## Observer

Observer 是观察者，他**负责递归地观察（或者说是处理）响应式对象（或数组）**。在打印出的实例里，可以注意到响应式的对象都会带着一个 `__ob__`，这是已经被观察的证明。

## 核心

按照上面几个概念的关系，重组一下，该如何实现数据响应式更新？

要做到的最终目标自然是：在数据更新时，自动刷新页面，显示最新的数据。

这就是上面提到的 Dep 和 Watcher 的关系，数据是 Dep，而 Watcher 触发的是页面渲染函数（这是最重要的 watcher）。

但是新问题随之而来，Dep 怎么知道有什么 Watcher 依赖于他？

Vue 采用了一个很有意思的方法：

- 在运行 Watcher 的 cb 之前，先记下当前 Watcher 是什么
- 运行 cb 用到响应式数据，那么必然会调用响应式数据的 getter 函数
- 在响应式数据的 getter 函数中就能记下当前的 Watcher，建立 Dep 和 Watcher 的关系
- 之后，在响应式数据更新时，必然会调用响应式数据的 setter 函数
- 基于之前建立的关系，在 setter 函数中就能触发对应 Watcher 的回调函数了

## 代码

上述逻辑就在 `defineReactive` 函数中。这个函数入口不少，这里先讲比较重要的 observe 函数。

在 observe 函数中会 new Observer 对象，然后使用 walk 对对象中的值进行逐个响应式处理，使用的就是 defineReactive 函数。

因为这个函数太重要了，而且也不长，所以直接贴到这边讲比较方便。

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
      // customSetter 多于提醒你设置的值可能存在问题
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

首先每个响应式的值都是一个“依赖"，所以开头就看到了，我们先借闭包的能力给每个值造一个 Dep。（到 Vue 3 就不需要闭包啦）

接着看核心的三个参数：

- obj 当前需要响应式处理的值所在的对象
- key 值的 key
- val 当前的值

这个值还可能之前就定义了自己的 getter、setting，所以在做 Vue 的响应式处理时先处理原本的 getter、setting。

上面的流程提到 getter 函数建立 Dep 和 Watcher 的关系，具体来说依靠的是 `dep.depend()`。

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

再到函数里一看，领略到了 Dep 和 Watcher 错综复杂的关系……不过简单来说，其实做的就是上面说的互相添加到多对多列表。

但是里面还有一个隐藏问题，就是 `Dep.target` 怎么来呢？先放一放，下面会解答。先接着看看 setting 函数，其中的关键是 `dep.notify()`。

```javascript
Dep.prototype.notify = function notify() {
  // stabilize the subscriber list first
  var subs = this.subs.slice()
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}
```

不难理解，就是 Dep 提醒他的订阅者列表里的所有人更新，所谓订阅者都是 Watcher，那么来看一下 Watcher 的 update 做了什么——

```javascript
Watcher.prototype.update = function update() {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    this.run()
  } else {
    queueWatcher(this)
  }
}
```

在这里我觉得有两个点比较值得展开，所以挖两个坑 😂

- 坑 1：这里如果不是同步更新的话会跑到 queueWatcher，之后再来讲异步更新，同时也降低了这里的理解难度，总之知道 queueWatcher 在一顿操作之后还是会运行 run 就好了。
- 坑 2：Watcher 的 cb 函数可能会处理 watch、computed 和**组件更新函数**。尤其重要的是组件更新函数，也正在这里进行 Vue 页面更新，所以这里也值得展开，为降低理解难度，只要知道更新在这里触发即可，更新方法后面再说。

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

**重点在于 get 方法中对 Dep.target 进行了设置**，之后在 cb（例如页面渲染函数就是一个典型的 Watcher cb）进行调用时，Dep.prototype.depend 才能真正生效。在这里，解决了上面 `depend()` 遗留的问题。

## 总结

虽说粗略来说这个算法并不难理解，但是里面仍有更多细节需要注意，不过这就留下感兴趣的大家自己研究啦~
