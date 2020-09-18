---
path: '/div-fucus'
date: '2019-06-18T22:07:04.875Z'
title: '水* 怎么在 div 上应用 onkeydown？'
tags: ['水系列']
---

最近写思维导图忙成狗，这个问题也是做思维导图的时候遇到的：

在 input 框上谁都知道可以绑定 keydown，但是对于一个不是编辑状态的 div 怎么办呢？直接绑在 document？

不行，在 document 绑定 keydown 会对普通输入造成麻烦，也有可能会干扰其他库，那么怎么在某个 div 上应用 keydown 呢？

```html
<div id="myDiv" tabindex="0">Press me and start typing</div>
```

答案是：只要加上 `tabindex="0"`，这个 div 就会变成“可 focus”的状态。

```css
#myDiv {
  outline: none;
}
```

选中时的外边框可以通过 css 隐藏。

水完，继续肝代码。

解决方案来源：https://stackoverflow.com/questions/3149362/capture-key-press-or-keydown-event-on-div-element
