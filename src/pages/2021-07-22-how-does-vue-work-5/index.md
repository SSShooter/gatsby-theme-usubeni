---
path: '/how-does-vue-work-5'
date: '2021-07-22T09:29:46.703Z'
title: 'how-does-vue-work-5'
tags: ['tag']
released: false
---

## 组件创建

### 注册

```javascript
function initAssetRegisters(Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function(type) {
    Vue[type] = function(id, definition) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          definition = this.options._base.extend(definition) // <- 看这里
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
```

`this.options._base.extend` 其实就等于 Vue.extend，运行得到的是一个组件类（或者说构造函数/Ctor 吧）。

`_createElement` -> `createComponent`

注册组件后就能在 `_createElement` -> `Ctor = resolveAsset(context.$options, 'components', tag)` 中找到 Ctor。

resolveAsset 可以找到 initAssetRegisters 里 `this.options[type + 's'][id] = definition` 的值

生成 VNode

```javascript
var vnode = new VNode(
  'vue-component-' + Ctor.cid + (name ? '-' + name : ''),
  data,
  undefined,
  undefined,
  undefined,
  context,
  {
    Ctor: Ctor,
    propsData: propsData,
    listeners: listeners,
    tag: tag,
    children: children,
  },
  asyncFactory
)
```

## 从父组件到子组件，挂载的时候发生了什么事？

mountComponent

componentVNodeHooks

我们来看 `patch` 函数（节选，有删减）

```javascript
if (!isRealElement && sameVnode(oldVnode, vnode)) {
  // patch existing root node
  patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly, true)
} else {
  if (isRealElement) {
    // mounting to a real element
    // check if this is server-rendered content and if we can perform
    // a successful hydration.
    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
      oldVnode.removeAttribute(SSR_ATTR)
      hydrating = true
    }
    if (isTrue(hydrating)) {
      if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
        invokeInsertHook(vnode, insertedVnodeQueue, true)
        return oldVnode
      }
    }
    // either not server-rendered, or hydration failed.
    // create an empty node and replace it
    oldVnode = emptyNodeAt(oldVnode)
  }
  // replacing existing element
  var oldElm = oldVnode.elm
  var parentElm$1 = nodeOps.parentNode(oldElm)
  createElm(
    vnode,
    insertedVnodeQueue,
    // extremely rare edge case: do not insert if old element is in a
    // leaving transition. Only happens when combining transition +
    // keep-alive + HOCs. (#4590)
    oldElm._leaveCb ? null : parentElm$1,
    nodeOps.nextSibling(oldElm)
  )
  // …………后面省略
}
```

当 `patch` 来到 `if (!isRealElement && sameVnode(oldVnode, vnode))`，判定为 false，证明未初始化，不会直接 `patchVnode`。而是继续往下走通过 `createElm` 建立 DOM 结构。

在 `createElm` 还会继续深入到子元素 `createChildren`。


## 为什么父组件更新，子组件没影响？

```javascript
function anonymous() {
  with (this) {
    return _c(
      'div',
      {
        attrs: {
          id: 'app',
        },
      },
      [
        _v('\n        ' + _s(message) + '\n        '),
        _c('div', [
          _c('input', {
            directives: [
              {
                name: 'model',
                rawName: 'v-model',
                value: message,
                expression: 'message',
              },
            ],
            domProps: {
              value: message,
            },
            on: {
              input: function($event) {
                if ($event.target.composing) return
                message = $event.target.value
              },
            },
          }),
        ]),
        _v(' '),
        _c('button-counter'),
      ],
      1
    )
  }
}
```

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

到了 `patchVnode` 两个子组件会被判断为一致，就不会进行更新。

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
