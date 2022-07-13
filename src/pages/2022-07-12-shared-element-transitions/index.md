---
path: '/shared-element-transitions'
date: '2022-07-12T10:04:41.193Z'
title: '你没有用过的船新版本——跨页面共享元素动画'
tags: ['coding', 'Web 前端', 'createDocumentTransition', '共享元素动画']
description: '作为 Web 前端开发者，你是否很羡慕安卓和 iOS 的动效设计，同一个元素穿梭于两个页面，无比流畅。但是！2022 年，浏览器也可以实现跨页面共享元素动画啦！'
---

- 本文主要参考 [GitHub shared-element-transitions](https://github.com/WICG/shared-element-transitions)
- 无法访问 GitHub 可以使用 [Gitee 镜像](https://gitee.com/mirrors_WICG/shared-element-transitions)
- 共享元素动画使用要求，版本 101 后，开启 `chrome://flags/#document-transition`
- 过渡接口不一定稳定，可能有变

## 效果示例

**视频来源于 GitHub，存在无法播放的情况**

<video controls style="width:100%;" src="https://user-images.githubusercontent.com/93594/140955654-fa944c4d-530e-4d3c-8286-50864d59bb0d.mp4"></video>

<video controls style="width:100%;" src="https://user-images.githubusercontent.com/93594/141100217-ba1fa157-cd79-4a9d-b3b4-67484d3c7dbf.mp4"></video>

## 原理浅析

跨页面共享元素动画实现的方法其实并非真的操作 DOM 移动，而是先把需要移动的页面或者元素**存为图片**，然后再通过对图片添加动画实现跨页面“共享元素”动画。未来还会更新加强版：computed style + 图片，可以更精细地控制 CSS 样式而不是只操作一张图片。也正因为动的是截图，整个画面在过渡时**不会响应任何点击事件**，一定程度上减少了极限操作造成的 bug。

值得注意的是，基于跨页面过渡的原理，我们可以推测，在动画执行的时候，目标页面其实已经渲染好了（才会有目标图片），所以使用跨页面过渡动画有一个缺点，那就是有一定延迟。

```html
<top-layer>
  <container(root)>
    <image-wrapper(root)>
      <outgoing-image(root) />
      <incoming-image(root) />
    </image-wrapper(root)>
  </container(root)>
</top-layer>
```

可以想象过渡过程中，在画面顶层会有这么一组元素覆盖着原本的元素，所以你无法点击原来画面上的元素。默认情况下 `outgoing-image` 和 `incoming-image` 的过渡是一个淡入淡出动画，我们可以通过下面这些 CSS 选择器控制这两个图片的动画：

```
container(root) - ::page-transition-container(root)
image-wrapper(root) - ::page-transition-image-wrapper(root)
outgoing-image(root) - ::page-transition-outgoing-image(root)
incoming-image(root) - ::page-transition-incoming-image(root)
```

例如把动画延长到 5 秒：

```css
::page-transition-outgoing-image(root),
::page-transition-incoming-image(root) {
  animation-duration: 5s;
}
```

再例如把淡入淡出改为其他动画：

```css
@keyframes slide-to-left {
  to {
    transform: translateX(-100%);
  }
}

@keyframes slide-from-right {
  from {
    transform: translateX(100%);
  }
}

::page-transition-outgoing-image(root) {
  animation: 500ms ease-out both slide-to-left;
}

::page-transition-incoming-image(root) {
  animation: 500ms ease-out both slide-from-right;
}
```

## 多元素参与过渡

上面的代码仅仅是对整个页面（root）添加过渡动画，然而更常见的需求肯定是对某个元素的过渡。为此我们需要把某个元素指定为过渡使用元素：

```css
.site-header {
  page-transition-tag: side-header;
  /* Paint containment is required */
  contain: paint;
}
```

P.S. `break-inside: avoid;` 和 `contain: paint;` 是实现跨页过渡的重要属性

设置后，过渡用的“图片”结构会像这样：

```html
<top-layer>
  <container(root)>
    <image-wrapper(root)>
      <outgoing-image(root) />
      <incoming-image(root) />
    </image-wrapper(root)>
  </container(root)>

  <container(site-header)>
    <image-wrapper(site-header)>
      <outgoing-image(site-header) />
      <incoming-image(site-header) />
    </image-wrapper(site-header)>
  </container(site-header)>
</top-layer>
```

对过渡动画的操作与 root 别无二致，仅仅是把 root 换成对应的 tag 就可以了：`::page-transition-outgoing-image(site-header)`

## 调用过渡 API

仅配置 CSS 无法实现过渡，还需要调用 `document.createDocumentTransition` 告诉浏览器执行过渡操作：

```javascript
async function spaNavigate(data) {
  // Fallback
  if (!document.createDocumentTransition) {
    await updateTheDOMSomehow(data)
    return
  }

  // With a transition
  const transition = document.createDocumentTransition()
  await transition.start(async () => {
    // Once this callback has called, the browser has captured the page similar to a screenshot.
    // This screenshot is now being displayed rather than the real DOM.
    // Any animated content on the page (e.g. CSS animations, videos, GIFs) will now appear frozen.
    await updateTheDOMSomehow()
    // The DOM has now updated, but the user is still looking at the captured state.
    // Once this async function returns, the transition will begin.
  })
  // The transition is now complete, and the captured state is removed to reveal
  // the real DOM underneath.
}
```

这个过程步骤如下：

- 在 `start` 的 callback 运行时，浏览器已经获取当前截图，并且整个页面被截图覆盖，所以从用户角度看，整个画面都是静止无响应的
- 在 callback 中对 DOM 进行操作，因为当前画面仍是截图，所以即使 DOM 操作完成，用户也依然看到旧画面
- callback 运行结束后，拿到新的页面截图，过渡才正式开始
- `await start` 后，过渡动画完成，移除过渡用的截图，新页面可操作

还可以通过修改 `el.style.pageTransitionTag` 临时调整过渡方式：

```javascript
async function animate(direction) {
  // Fallback
  if (!document.createDocumentTransition) {
    await mutate()
    return
  }

  // With a transition
  const transition = document.createDocumentTransition()
  document.querySelector('#title').style.pageTransitionTag =
    'site-title-' + direction
  await transition.start(() => mutate())
  document.querySelector('#title').style.pageTransitionTag = ''
  console.log('Transition complete!')
}
```

## 多页面过渡

上述操作仅限单页面应用，虽然这个 API 的目标是使多页面应用也能进行共享元素过渡，但是浏览器暂时未支持，只能通过代码来预习一下，基本概念不变，跨页面的重点是在页面隐藏和新页面展示前对元素进行操作：

```javascript
document.addEventListener("pagehide", (event) => {
  if (!event.transition) return;
  document.getElementById("foo").style.pageTransitionTag = "foo";
  event.transition.setData({ … });
});
```

```javascript
document.addEventListener('beforepageshow', async (event) => {
  if (!event.transition) return
  document.querySelector('.header').style.pageTransitionTag = 'header'

  await event.transition.ready

  // The pseudo-elements are now accessible and can be animated:
  document.documentElement.animate(keyframes, {
    ...animationOptions,
    pseudoElement: '::page-transition-container(header)',
  })
})
```

## 来试试

初步了解跨页面过渡接口和 CSS 配置后，应该可以理解这个简单的例子啦！大家赶紧打开 `chrome://flags/#document-transition` ，试试通过修改这个例子更深入理解共享元素动画吧！

https://codepen.io/ssshooter/pen/GRxjGXJ
