---
path: '/qipa-css'
date: '2021-07-09T09:15:26.467Z'
title: 'CSS 奇葩荟萃'
tags: ['coding', 'CSS', '永久更新']
---

其实我后悔了，干了这么多年前端，现在才开始收集，不过现在开始总是最好的，本文**永久更新**（直到我退前端坑 🤔）。

这里不会记录那些罕见但好用的 CSS 属性，而是着重记录那些反直觉的奇葩情况。

## overflow 与绝对定位

`overflow:scroll;` 之后，绝对定位的子元素会撑起父元素。

```html
<div class="parent">
  sssss
  <div class="child"></div>
</div>
<style>
  .parent {
    position: absolute;
    background-color: red;
    height: 300px;
    width: 300px;
    /*  toggle 这个选项，感受神奇的 css  */
    overflow: scroll;
    /*  父元素直接变成绝对定位的子元素的高度  */
  }
  .child {
    position: absolute;
    background-color: blue;
    top: 0;
    height: 220%;
    width: 120%;
    z-index: -1;
  }
</style>
```

打开直接感受的传送门：https://codepen.io/ssshooter/pen/XWMogqW

## overflow x&y

根据 [W3 标准](https://www.w3.org/TR/css-overflow-3/)

> as specified, except with visible/clip computing to auto/hidden (respectively) if one of overflow-x or overflow-y is neither visible nor clip

overflow-x 和 overflow-y 如果你分别设置的话，其中一个是非 visible 的话，那么另一个绝不能是 visible，就算写了 visible 也会被处理为 auto。

[参考链接](https://stackoverflow.com/questions/6421966/css-overflow-x-visible-and-overflow-y-hidden-causing-scrollbar-issue)

## fixed 不 fixed 了

这个十分常见，估计大家都知道了。就是 transform 了的元素，它的所有子元素都不能 fixed（设置之后只能和 absolute 效果一样）。

参考链接：https://stackoverflow.com/questions/36855473/position-fixed-not-working-is-working-like-absolute

## 也不是很过分的 z-index

z-index 可能因为类似“被嵌入图层组”的原因，导致图层排列与 z-index 数值不一致。

https://www.joshwcomeau.com/css/stacking-contexts/

https://ics.media/entry/200609/

## 文字不会撑起父元素高度

```html
<div class="wrapper">
  <div class="item">aaaa</div>
  <div class="item">bbb</div>
  <div class="item">ccc</div>
  <div class="item">dddd</div>
</div>
<style>
  .item {
    height: 1rem;
    /*  不设置height 就没有问题  */
  }
  .wrapper {
    overflow: auto;
  }
</style>
```

上面的结构，如果 `.item` 设置了比文字小的高度，那么父元素只会被 `.item` 设置的高度撑起，但文字的高度比 `.item` 的高度高，这就导致了**父元素会出现滚动条**。

这个“异常”最直接的解决方法当然就是给 `.item` 加一个 `overflow:hidden;`。
