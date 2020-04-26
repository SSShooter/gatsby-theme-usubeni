---
path: '/vue-scoped'
date: '2019-12-12T16:36:19.816Z'
title: 'Vue 单文件 scoped 样式简析'
tags: ['coding', 'Vue']
---

## 如何使用

```html
<style scoped>
  .klass {
    /* style */
  }
</style>
```

`scoped` 是一个极其常用的 `<style>` 标签属性，使用后这一块样式能“神奇地”只应用在当前单文件组件，不会干扰到其父子组件。

其原理其实很简单，**只要加上了 `scoped`，当前文件所有元素（不包括调用的其他组件）都会加上一串识别码，样式只作用于带码的元素。**

举个简单例子：

```html
<template>
  <div>
    <div></div>
    <input class="money" />
    <ChildComponent class="child" />
  </div>
</template>
<style scoped>
  .money {
    width: 90px;
  }
</style>
```

如上面所说，加上了 `scoped` 后，渲染时这个组件所有元素都会加上 `data-v-xxxxx` 这样的属性。Vue 用户应该经常会在调试的时候见到类似这样的结构：

```html
<div data-v-9bfd234a class="money"></div>
```

然后在 style 也会加上对应的**属性选择器**：

```css
.money[data-v-9bfd234a] {
  width: 90px;
}
```

这样结果就很明确了，加了 scoped 之后所有选择器后面都加上一个属性选择器来限制选择，结果就是只应用在当前组件。

```html
<div data-v-9bfd234a class="child"><div class="childclass"></div></div>
```

如果是子组件的话就会是上面的情况，子组件里面的元素不会被打上 `9bfd234a` 标志，但是当然，如果子组件本身也用了 scoped，当然会有另一个 `data-v-` 标签，不过随机生成的 id 是不同的，所以不会互相干扰。

## 穿透方法

总有那么一些情况，你需要修改外部引入的子组件的样式来配合自己的页面。

如果你用了 `scoped`，你所写的所有样式都会被限制在 `data-v-` 属性选择器中。

要解决这个最简单的是：不要使用 `scoped`。

实际上你要做到 `scoped` 这种“自治”的效果，只要在模板最外层加一个 id，然后所有样式都写在这个 id 之下就好了。不过这依赖 css 预处理器，不然写起来会很麻烦。

```html
<template>
  <div id="thispage">
    <div></div>
    <input class="money" />
    <ChildComponent class="child" />
  </div>
</template>
<style lang="scss" scoped>
  #thispage {
    .money {
      width: 90px;
    }
  }
</style>
```

如果你仍需要使用 `scoped`，可以选择使用 `/deep/`（关于 `>>>`，直接使用 css 也可以用，不过一些 css 预处理器无法处理 `>>>`）。

继续使用上面的例子，如果父组件希望改变 `childclass` 的样式，可以这么写：

```html
<style scoped>
  /deep/ .childclass {
    color: red;
  }
</style>
```

（虽然看着很奇葩，但确实是这么写）实际运行的效果是：

```css
[data-v-9bfd234a] .childclass {
  color: red;
}
```

以前我会以为 `/deep/` 干了什么，“穿透了”父子组件。其实并不是，在 `scoped` 的前提下 `/deep/` 做的是减法，而不是加法。

**换句话说 `/deep/` 的效果就是让 deep 后面的选择器不被加上 `data-v-` 选择器。**

关于 `scoped` 的重点就这么多，文比较短，本来打算记着就算了，但是觉得写出来思路会更清晰，也方便以后忘了可以查看。