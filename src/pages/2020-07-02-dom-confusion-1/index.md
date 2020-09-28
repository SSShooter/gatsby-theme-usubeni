---
path: '/dom-confusion-1'
date: '2020-07-02T10:07:02.902Z'
title: 'DOM 那些让人迷惑的属性'
tags: ['coding', 'DOM']
---

## clientTop

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientTop)

虽然叫 **client** **Top**，拿到的却是**顶边宽度**，叫人十分迷惑

相当于 `.getComputedStyle()` 的 "border-top-width"

同理可得 clientLeft

## clientHeight

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight)

还是不懂所谓 **client** 是什么意思，死记硬背吧

clientHeight = 本身高度 + padding - 滚动条宽度（如果有）

另外，一个特殊情况，clientHeight 作用在 `<html>` 时返回 viewport 高度（无视滚动条）

![clientHeight](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/Dimensions-client.png)


## offsetTop

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop)

比较好理解，元素顶部到 `offsetParent` 顶部的距离

至于 `offsetParent` 就是最近一个定义了 position 祖先节点，形象点说就是绝对定位的时候相对于的那个元素。直接用 `element.offsetParent` 也可以取到。

## offsetHeight

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight)

这里的“offset”又跟 offsetTop 的不一样了，跟祖先节点一点关系都没有，叫人十分迷惑

offsetHeight = 本身高度 + padding + border + 滚动条宽度（如果有）

display 为 none 的元素会返回 0

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/Dimensions-offset.png)


## scrollTop

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop)

以上都是只可读，scrollTop 可写，设置后元素会滚动到设置的位置

返回了滚动了多少像素

## scrollHeight

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight)

整个元素本身的高度，看下图就很形象

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/ScrollHeight.png)

## 其他相关

### 事件属性

MouseEvent.screenX/Y **屏幕**坐标系，也！包！含！滚！动！

MouseEvent.clientX/Y **视窗**坐标系，无论如何滚动，视窗的左上角就是(0,0)（注意 iframe 的特殊情况），这个值就是相对于客户端（终于有一个 client 是代表客户端了）窗口大小的数值

MouseEvent.pageX/Y **视窗**坐标系，相对于整个页面（包括滚动）的坐标，在没有滚动的情况下，client 和 page 是一样的

MouseEvent.offsetX/Y 鼠标与 target node 的填充边的距离

MouseEvent.movementX currentEvent.movementX = currentEvent.screenX - previousEvent.screenX

UIEvent.layerX/Y 非标准

### getComputedStyle

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)

### getBoundingClientRect

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)

- 相对于 **viewport**
- height = 本身高度 + padding + border（**没有滚动条**）
- left/x，top/y 等价

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/element-box-diagram.png)

### IntersectionObserver

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

### elementFromPoint

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/elementsFromPoint)

输入 xy 坐标，返回该位置最顶层元素