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

![clientHeight](Dimensions-client.png)

## offsetTop

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop)

比较好理解，元素顶部到 `offsetParent` 顶部的距离

至于 `offsetParent` 就是最近一个定义了 position 祖先节点，形象点说就是绝对定位的时候相对于的那个元素。直接用 `element.offsetParent` 也可以取到。

## offsetHeight

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight)

这里的“offset”又跟 offsetTop 的不一样了，跟祖先节点一点关系都没有，叫人十分迷惑

offsetHeight = 本身高度 + padding + border + 滚动条宽度（如果有）

display 为 none 的元素会返回 0

![clientHeight](Dimensions-offset.png)

## scrollTop

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTop)

以上都是只可读，scrollTop 可写，设置后元素会滚动到设置的位置

返回了滚动了多少像素

## scrollHeight

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight)

整个元素本身的高度，看下图就很形象

![](ScrollHeight.png)

## 其他相关

MouseEvent.screenX/Y 相对于整个**屏幕**的坐标

MouseEvent.clientX/Y 相对于目标元素的坐标

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)，上面两个都是左上角为 0

getComputedStyle

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle)

getBoundingClientRect

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)

- 相对于 **viewport**
- height = 本身高度 + padding + border（**没有滚动条**）
- left/x，top/y 等价

![](element-box-diagram.png)

IntersectionObserver

[mdn](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
