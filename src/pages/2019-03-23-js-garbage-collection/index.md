---
path: '/js-garbage-collection'
date: '2019-03-23T10:56:07.811Z'
title: 'JavaScript 垃圾回收入门（复盘校对版）'
tags: ['coding', '翻译']
---

> 来源于 [现代 JavaScript 教程](https://github.com/iliakan/javascript-tutorial-en)  
> [垃圾回收章节](https://javascript.info/garbage-collection)

<div class="balloon2-left">虽然在 JavaScript 中不用自己管理内存，但是了解原理可以在关键时候快速搜索到解决办法，毕竟很多时候遇到问题是连搜索什么关键词都想不起来呀 😂</div>

JavaScript 内存管理于我们来说是自动的、不可见的。我们创建的原始类型、对象、函数等等，都会占用内存。

当这些数据不被需要后会发生什么？JavaScript 引擎如何发现并清除他们？

## 可触及（Reachability）

JavaScript 内存管理的关键概念是**可触及（Reachability）**。

简单来说，“可触及”的值就是可访问的，可用的，他们被安全储存在内存。

1. 以下是一些必定“可触及”的值，不管出于任何原因，都不能删除：

   - 当前函数的局部变量和参数。
   - 当前调用链（current chain of nested calls）中所有函数的局部变量和参数。
   - 全局变量。
   - （以及其他内部变量）

   这些值都称为 **root**。

2. 其他值是否可触及视乎它是否被 root 及其引用链引用。

   假设有一个对象存在于局部变量，它的值引用了另一个对象，如果这个对象是可触及的，则它引用的对象也是可触及的，后面会有详细例子。

JavaScript 引擎有一个[垃圾回收](<https://en.wikipedia.org/wiki/Garbage_collection_(computer_science)>)后台进程，监控着所有对象，当对象不可触及时会将其删除。

## 一个简单例子

```js
// user 引用了一个对象
let user = {
  name: 'John',
}
```

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/memory-user-john.png)

箭头代表的是对象引用。全局变量 `"user"` 引用了对象 `{name: "John"}`（简称此对象为 John）。John 的 `"name"` 属性储存的是一个原始值，所以无其他引用。

如果覆盖 `user`，对 John 的引用就丢失了：

```js
user = null
```

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/memory-user-john-lost.png)

现在 John 变得不可触及，垃圾回收机制会将其删除并释放内存。

## 两个引用

如果我们从 `user` 复制引用到 `admin`：

```js
// user 引用了一个对象
let user = {
  name: 'John',
}

let admin = user
```

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/memory-user-john-admin.png)

如果重复一次这个操作：

```js
user = null
```

……这个对象是依然可以通过 `admin` 访问，所以它依然存在于内存。如果我们把 `admin` 也覆盖为 `null`，那它就会被删除了。

## 相互引用的对象

这个例子比较复杂：

```js
function marry(man, woman) {
  woman.husband = man
  man.wife = woman

  return {
    father: man,
    mother: woman,
  }
}

let family = marry(
  {
    name: 'John',
  },
  {
    name: 'Ann',
  }
)
```

`marry` 函数让两个参数对象互相引用，返回一个包含两者的新对象，结构如下：

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/family.png)

暂时所有对象都是可触及的，但我们现在决定移除两个引用：

```js
delete family.father
delete family.mother.husband
```

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/family-delete-refs.png)

只删除一个引用不会有什么影响，但是两个引用同时删除，我们可以看到 John 已经不被任何对象引用了：

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/family-no-father.png)

即使 John 还在引用别人，但是他不被别人引用，所以 John 现在已经不可触及，将会被移除。

垃圾回收后：

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/family-no-father-2.png)

## 孤岛（Unreachable island)

也可能有一大堆互相引用的对象整块（像个孤岛）都不可触及了。

对上面的对象进行操作：

```js
family = null
```

内存中的情况如下：

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/family-no-family.png)

这个例子展示了“可触及”这个概念的重要性。

尽管 John 和 Ann 互相依赖，但这仍不足够。

`"family"` 对象整个已经切断了与 root 的连接，没有任何东西引用到这里，所以这个孤岛遥不可及，只能等待被清除。

## 内部算法

基础的垃圾回收算法被称为“标记-清除算法”（"mark-and-sweep"）：

- 垃圾回收器获取并标记 root。
- 然后访问并标记来自他们的所有引用。
- 访问被标记的对象，标记**他们的**引用。所有被访问过的对象都会被记录，以后将不会重复访问同一对象。
- ……直到只剩下未访问的引用。
- 所有未被标记的对象都会被移除。

举个例子，假设对象结构如下：

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/garbage-collection-1.png)

很明显右侧有一个“孤岛”，现在使用“标记-清除”的方法处理它。

首先，标记 root：

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/garbage-collection-2.png)

然后标记他们的引用：

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/garbage-collection-3.png)

……标记他们引用的引用：

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/garbage-collection-4.png)

现在没有被访问过的对象会被认为是不可触及，他们将会被删除：

![](https://raw.githubusercontent.com/ssshooter/translation/master/jsinfo/garbage-collection/garbage-collection-5.png)

这就是垃圾回收的工作原理。

JavaScript 引擎在不影响执行的情况下做了很多优化，使这个过程的垃圾回收效率更高：

- **分代收集** -- 对象会被分为“新生代”和“老生代”。很多对象完成任务后很快就不再需要了，所以对于他们的清理可以很频繁。而在清理中留下的称为“老生代”一员。
- **增量收集** -- 如果对象很多，很难一次标记完所有对象，这个过程甚至对程序执行产生了明显的延迟。所以引擎会尝试把这个操作分割成多份，每次执行一份。这样做要记录额外的数据，但是可以有效降低延迟对用户体验的影响。
- **闲时收集** -- 垃圾回收器尽量只在 CPU 空闲时运行，减少对程序执行的影响。

除此以外还有很多对垃圾回收的优化，在此就不详细说了，各个引擎有自己的调整和技术，而且这个东西一直随着引擎的更新换代在改变，如果不是有实在的需求，不值得挖太深。不过如果你真的对此有浓厚的兴趣，下面会为你提供一些拓展链接。

## 总结

重点：

- 垃圾回收自动进行，我们不能强制或阻止其进行。
- 可触及的对象会被保留在内存中。
- 被引用不一定是可触及的（从 root）：相互引用的对象可能整块都是不可触及的。

《The Garbage Collection Handbook: The Art of Automatic Memory Management》（R. Jones 等）一书中提及了现代引擎实现的加强版垃圾回收算法。

如果你熟悉底层编程，可以阅读 [A tour of V8: Garbage Collection](http://jayconrod.com/posts/55/a-tour-of-v8-garbage-collection) 了解更多关于 V8 垃圾回收的细节。

[V8 blog](http://v8project.blogspot.com/) 也会经常发布一些关于内存管理的文章。学习垃圾回收算法最好还是先学习 V8 的实现，阅读 [Vyacheslav Egorov（V8 工程师之一）的博客](http://mrale.ph)。这里提及 V8 是因为在互联网上关于 V8 的文章比较多。对于其他引擎，很多实现都是相似的，但是垃圾回收算法上区别不小。

对引擎的深入理解在做底层优化的时候很有帮助。在你熟悉一门语言之后，这是一个明智的研究方向。
