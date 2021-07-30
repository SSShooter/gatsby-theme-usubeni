---
path: '/how-does-vue-work-3'
date: '2021-07-19T18:05:07.928Z'
title: 'how-does-vue-work-3'
tags: ['tag']
released: false
---

这次的主题也是一个有趣的问题，render 函数到底怎么把模板变成 dom？数据更新的时候又做了什么？

## 流程

templete -> AST -> render -> VNode

## parse

```javascript
/**
 * Convert HTML string to AST.
 */
function parse (
  template,
  options
){
  // ……
}
```

这里就不细讲 HTML 到 AST 的过程，不难但是细节不少 😂

```javascript
var createCompiler = createCompilerCreator(function baseCompile(
  template,
  options
) {
  var ast = parse(template.trim(), options)
  optimize(ast, options)
  var code = generate(ast, options)
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  }
})
```

`parse` 把模板处理为 AST，为了更好理解什么是 AST，直接给一个例子：

```json
{
  "type": 1,
  "tag": "button",
  "attrsList": [
    {
      "name": "v-on:click",
      "value": "count++"
    }
  ],
  "attrsMap": {
    "v-on:click": "count++"
  },
  "children": [
    {
      "type": 2,
      "expression": "_s(testprop)+\" You clicked me \"+_s(count)+\" times.\"",
      "text": "{{ testprop }} You clicked me {{ count }} times.",
      "static": false
    }
  ],
  "plain": false,
  "hasBindings": true,
  "events": {
    "click": {
      "value": "count++"
    }
  },
  "static": false,
  "staticRoot": false
}
```

## generate

接着 `generate` 把 AST 处理为渲染函数，而渲染函数长这样：

```javascript
function anonymous() {
  with (this) {
    return _c(
      'button',
      {
        on: {
          click: function($event) {
            count++
          },
        },
      },
      [_v(_s(testprop) + ' You clicked me ' + _s(count) + ' times.')]
    )
  }
}
```

另外，你可以通过 `vm.$options.render` 访问渲染函数。

你在用脚手架的时候有见过 runtime 和 runtime + compiler 两个选项吗？说到这里你或许已经有点明白。

compiler 就用于把模板处理成渲染函数，而在 webpack 构建 Vue 项目时，在项目编译时就把模板处理成渲染函数了，因此前端可以不带 compiler。

## render

```javascript
vnode = render.call(vm._renderProxy, vm.$createElement)
```

使用上面的 render 函数与 Vue 实例的数据，组合起来便是我们耳熟能详的 VNode。

```javascript
{
    asyncFactory: undefined
    asyncMeta: undefined
    children: [VNode]
    componentInstance: undefined
    componentOptions: undefined
    context: VueComponent {_uid: 1, _isVue: true, $options: {…}, _renderProxy: Proxy, _self: VueComponent, …}
    data: {on: {…}}
    elm: button
    functionalContext: undefined
    functionalOptions: undefined
    functionalScopeId: undefined
    isAsyncPlaceholder: false
    isCloned: false
    isComment: false
    isOnce: false
    isRootInsert: true
    isStatic: false
    key: undefined
    ns: undefined
    parent: VNode {tag: "vue-component-1-button-counter", data: {…}, children: undefined, text: undefined, elm: button, …}
    raw: false
    tag: "button"
    text: undefined
    child: (...)
}
```

## patch

patch 是 Vue 视图更新的核心，在 patch 中传入新旧两个 VNode，通过 diff 算法，就能检查出两者区别，根据这些区别，我们只对特定修改过的地方进行 DOM 操作更新视图。

早在第一篇提到，数据修改时，触发 `_update` 函数自动会更新视图

```javascript
vm._watcher = new Watcher(vm, updateComponent, noop);
vm._update(vm._render(), hydrating);
```

而 patch 就是 `_update` 的重要一步

diff 算法是一个不简单的东西

## 总结


调用了 render 函数生成 Vnode，而旧的 Vnode 自然是当前的 Vnode，进行二者对比。

在这里对响应式更新流程作补充吧！

正确顺序是：

在初始化时——模板 -> AST -> render

在更新时——运行 `vm._render()` -> 用得到的新 VNode 与旧 VNode 进行 diff -> 对修改地方进行真实的 DOM 操作

## 参考链接

- https://vuejs.org/v2/guide/render-function.html
