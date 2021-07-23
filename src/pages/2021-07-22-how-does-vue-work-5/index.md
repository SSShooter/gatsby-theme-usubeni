---
path: '/how-does-vue-work-5'
date: '2021-07-22T09:29:46.703Z'
title: 'how-does-vue-work-5'
tags: ['tag']
released: false
---

从父组件到子组件，挂载的时候发生了什么事？

mountComponent

componentVNodeHooks

## 为什么父组件更新，子组件没影响？

当 `patch` 来到 `if (!isRealElement && sameVnode(oldVnode, vnode))`，如果判定为 `true`，那就是已经初始化过了，直接走 `patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly, true)`。

否则，根据 Vnode 重新创建元素（通过 `createElm`）。

而就在 `createElm` 的时候，会运行 `createChildren` 所以只有在初始化时才会处理子组件创建，接着在 `createComponent` 运行组件 init。

```
Vue._render
updateComponent
get
Watcher
mountComponent
Vue$3.$mount
Vue$3.$mount
init
createComponent
createElm
createChildren
createElm
patch
Vue._update
updateComponent
get
Watcher
mountComponent
Vue$3.$mount
Vue$3.$mount
Vue._init
Vue$3
```

这是一个子组件创建（直到子组件 `_render`）的调用栈，顺序是由下到上运行。

首先获取 Vnode 的时候，遇到现有子组件，

确实会调用 `_createElement`，生成 Vnode，但是不会继续往深层运行

父组件这么走：updateComponent -> `_render`

子组件这么走：updateComponent -> `_update`

在下次更新时子组件不会运行 `createElm`

不会渲染，然后在 `__patch__` 时，非必要时不会处理子组件。

`_createElement`

`_c`
`_v`

## 为什么加了 slot 又有影响了？

`patchVnode` prepatch updateChildComponent

```javascript
if (hasChildren) {
  vm.$slots = resolveSlots(renderChildren, parentVnode.context)
  vm.$forceUpdate()
}
```
