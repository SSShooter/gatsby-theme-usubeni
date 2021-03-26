---
path: '/vue-validate'
date: '2021-03-10T09:25:33.524Z'
title: 'Vue 2 表单校验完整解决方案'
tags: ['Vue']
released: false
---

现成的校验库大多很重，修改也不容易，之前使用 [vee-validate](https://github.com/logaretm/vee-validate) 这个库，也不知道是我写得有问题还是它本身机制问题，校验子组件的时候会牵涉到父组件渲染，导致校验看起来十分卡顿。

那何不自己造一个？这很麻烦吗？不！也就一百多行 js 的事情！本文就带你自己造！（嗯？结果这是 Vue 插件教程？）

不建议直接使用我写的插件，因为“过度定制化”，有很多配置都是没有考虑到的，大家可以修改到自己最合手的状态。至于为什么不在 option 整一堆配置，原因自然是既然是一个自用的小工具，当然是越精简越好，而且这样的精简并不会影响未来拓展性。

## 插件结构

照搬[官网](https://cn.vuejs.org/v2/guide/plugins.html)例子：

```javascript
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或 property
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

上面的代码看起来应该不难理解，但是有一些值得注意的地方——

1. 全局方法和实例方法分别绑定在 Vue 和 Vue 实例的原型链上，所以占用的内存很少，但是 `mixin` 会混入**每一个**实例（一个组件一个实例），所以个人认为这里应该尽量精简。

2. 自定义指令的钩子，同样参考[官网](https://cn.vuejs.org/v2/guide/custom-directive.html)

- bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。
- componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- unbind：只调用一次，指令与元素解绑时调用。

正常来说 bind 只会调用一次，但是如果你的代码里很多 `v-if` 每次 toggle 都会触发，不过这个问题不大，**bind 和 unbind 是成对的，只要在 unbind 中正确处理 bind 的副作用即可**。

3. 钩子可以获取的数据

- el：指令所绑定的元素，可以用来直接操作 DOM
- binding： 一个包含指令信息的对象
- vnode：Vue 编译生成的虚拟节点
- oldVnode：上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用

便携校验插件使用到的信息主要有以下几个：

- `vnode.componentInstance` 获取绑定了指令的 Vue 实例
- `vnode.elm` 获取绑定了指令的元素（当你绑定指令的目标不是 Vue 组件就要使用这个属性）
- `vnode.context` 获取绑定的上下文，可以理解为你把指令写入的那个组件
- `binding.value` 指令的内容，如 `v-mydirective="'test'"` 的 test 字符串

## 实现的效果

```
<input v-vld="'required'" scope="tech" :name="'名称'" v-model.lazy="test" />
<span class="error-message">{{
    errList('名称')
}}</span>
```

插入 `v-vld` 指令，设置为 `'required'`（或其他要求），在输入框失焦时会校验 `test` 变量是否为空，若为空，在 `errList` 插入一条关联其名称的错误信息，响应式展示到页面上。

## 实现校验

实现校验的第一步当然是事前准备，是先用 mixin 混入一个 errList，未来用于放置校验错误信息，再整一个自定义指令：

```javascript
Vue.directive('vld', {
  bind() {
    // ...
  },
})
Vue.mixin({
  data: function() {
    return {
      errList: {},
    }
  },
})
```

将精简进行到底，这个校验指令就叫 vld 吧，在使用的时候在组件加入 v-vld 即可。

接着实现 bind 的功能，指令绑定到组件时会运行此函数：（注意看注释）

```javascript
// 新建一个对象存放已经注册的输入框
let vldList = {}
// 获取信息的工具函数
const getInfo = (binding, vnode) => {
  const vm = vnode.componentInstance
  const elm = vnode.elm
  const ctx = vnode.context
  let name, id, scope
  // 如果绑定在 vue 组件，如 <MyComponent v-vld="'required'" v-model="v">，就会有 vm
  // 绑定在 dom 元素则没有，<input v-vld v-model="v">，所以要分两种情况处理
  // 后面的分情况处理都是这个情况，不多赘述
  if (vm) {
    // name 用于显示或寻找元素
    name = vm.$props.name || vm.$attrs.name
    // scope 用于限制校验范围
    scope = vm.$props.scope || vm.$attrs.scope
    // id 用于区分一个元素，是 Vue 实例的话直接使用唯一的 uid
    id = vm._uid
  } else {
    name = elm.getAttribute('name')
    scope = elm.getAttribute('scope')
    id = name
    // 这里尤其注意，原生 dom 元素自己可没有 uid，如果 name 重复的话会出现意想不到的错误，
    // 如果你的代码里有出现重复 name 且绑定指令的是原生 dom 元素，需要根据自己情况修改这里
  }
  return { id, vm, elm, ctx, scope, name, vld: binding.value }
}
//  省略部分代码
{
  bind(el, binding, vnode, oldVnode) {
    // 不熟悉 bind 的参数可以直接打印出来观察一下
    console.log('bind', el, binding, vnode, oldVnode)
    // 最上面的 getInfo 函数
    // 使用 binding 和 vnode 这两个参数获取
    // id, vm, ctx, name, elm 等关键变量
    const data = getInfo(binding, vnode)
    const { id, vm, ctx, name, elm } = data
    // 在 vldList 集中管理已注册组件
    vldList[id] = data
    ctx.$delete(ctx.errList, name)
    if (vm) {
      // 监听实例 value 的变化
      // 当然，value 是 v-model 的默认监听属性，如果是其他的情况请自行修改
      vm.$watch('value', function(val) {
        // 在 watch 时使用 data.vld 而不是直接使用 vld 是借用对象的地址储存功能更新 vld 的信息，毕竟 vld 在更新时是可以改变的
        if (!data.vld) return
        // 获取校验函数
        let validate = vldType[data.vld] || df
        // 获取校验失败时显示的信息
        let msg = vldMsg[data.vld] || dfMsg
        if (validate(val)) {
          // 校验成功，删掉 errList 对应的错误信息
          ctx.$delete(ctx.errList, name)
        } else {
          // 校验失败，在 errList 添加对应的错误信息
          ctx.$set(ctx.errList, name, msg(name))
        }
      })
    } else {
      // 没有 vm 直接用 EventListener
      elm.addEventListener('change', e => {
        const val = e.target.value
        if (!data.vld) return
        let validate = vldType[data.vld] || df
        let msg = vldMsg[data.vld] || dfMsg
        if (validate(val)) {
          ctx.$delete(ctx.errList, name)
        } else {
          ctx.$set(ctx.errList, name, msg(name))
        }
      })
    }
  }
}
```

接下来要考虑的就是跟 bind 成双成对的 unbind，基本上你在 bind 里添加了什么，在 unbind 就要清除什么。

换言之 unbind 就是 bind 的反向操作，删除掉之前的错误记录，删除在 vldList 中的信息。

```javascript
    unbind: function(el, binding, vnode, oldVnode) {
      console.log('unbind')
      const { id, ctx, name } = getInfo(binding, vnode)
      ctx.$delete(ctx.errList, name) // 清除现有的错误记录
      delete vldList[id]
    }
```

这个更新的处理用于处理 vld 改变的情况，毕竟 `v-vld="var"` var 可以是一个变量，如果 var 本来是校验，后来又改成不校验了，就必须更新这个值。

我们可以通过对象里的 vld 在不重新 watch 的情况下更新 vld，所以处理起来很简单：

```javascript
    componentUpdated: function(el, binding, vnode) {
      console.log('componentUpdated')
      const { id, ctx, name } = getInfo(binding, vnode)
      let data = vldList[id]
      //   不知道为什么会在没 bind 的情况下先运行 componentUpdated，所以没有找到 data
      if (data && binding.value !== data.vld) {
        data.vld = binding.value
        ctx.$delete(ctx.errList, name)
      }
    }
```

指令的基本功能到此已经实现，不难对吧？

下面再加上一个常用的“提交前校验”功能，作用是批量校验一部分信息，不通过时阻止提交。

```javascript
Vue.prototype.$vld = function(curScope) {
  for (const id in vldList) {
    const { vm, elm, ctx, name, vld, scope } = vldList[id]
    // 可以用 this 和 ctx 对比筛选不在当前上下文的输入框
    // if (ctx !== this) continue
    if (scope && scope !== curScope) continue
    let val
    if (vm) {
      val = vm.value
    } else {
      val = elm.value
    }
    if (!vld) {
      ctx.$delete(ctx.errList, name)
      continue
    }
    let validate = vldType[vld] || df
    let msg = vldMsg[vld] || dfMsg
    if (validate(val)) {
      ctx.$delete(ctx.errList, name)
    } else {
      ctx.$set(ctx.errList, name, msg(name))
    }
  }
  return Object.keys(this.errList).map(errName => {
    return {
      field: errName,
      msg: this.errList[errName],
    }
  })
}
```

然后你就可以通过 `this.$vld(scope)` 批量校验特定的一部分输入框。返回的错误格式为：

```javascript
{
    field:String,
    msg:String
}
```

## 错误定位

一开始你就为你的输入框设置了一个 name 属性，那么定位就完全不成问题。

借助校验错误返回的 `field` 字段（也就是输入框的 name），你可以通过

```javascript
document.querySelector(`[name*="${name}"]`).scrollIntoView()
```

自动滚动到该输入框位置。

至此，表单校验的大部分功能已经实现，细节就请根据项目情况慢慢完善吧。

PS. 校验可不是最痛的，做修改日志才是。能否想象一份表单，里面有多层嵌套，数组结构，有自定义模板，这么一套东西下来，记录用户的修改日志是多么的难受。