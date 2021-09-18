---
path: '/how-does-vue-work-3'
date: '2021-07-19T18:05:07.928Z'
title: 'how-does-vue-work-3'
tags: ['tag']
released: false
---

这次的主题也是一个有趣的问题，render 函数到底怎么把模板变成 dom？数据更新的时候又做了什么？

## 流程

先来个大概流程：templete -> AST -> render -> VNode

其中 templete 自然是大家熟知的“模板”，render 指之前多次提到的 render 函数，VNode 也就是老生常谈的“虚拟节点”了。

稍微详细说说 AST，这是在计算机语言解析中很重要的一个概念。

AST 是 abstract syntax tree 的缩写，翻译过来就是抽象语法树。借助抽象语法树，可以比较方便地处理编程语言的功能。

一般得到 AST 的操作称为 parse，在此之前还有 tokenize 这一步，可以翻译为“分词”。

例如解析这么一句简单的代码：`let tips = ['t1'];`，第一步就是把他拆分成 token：

```json
[
  {
    "type": "Keyword",
    "value": "let"
  },
  {
    "type": "Identifier",
    "value": "tips"
  },
  {
    "type": "Punctuator",
    "value": "="
  },
  {
    "type": "Punctuator",
    "value": "["
  },
  {
    "type": "String",
    "value": "'t1'"
  },
  {
    "type": "Punctuator",
    "value": "]"
  },
  {
    "type": "Punctuator",
    "value": ";"
  }
]
```

第二步是通过 parser 把这些 token 组织成 AST，这样就能更方便地对一种语言进行转换（例如 babel 对语言的转换就是借助 AST），或者实现功能。

```json
{
  "type": "VariableDeclaration",
  "declarations": [
    {
      "type": "VariableDeclarator",
      "id": {
        "type": "Identifier",
        "name": "tips"
      },
      "init": {
        "type": "ArrayExpression",
        "elements": [
          {
            "type": "Literal",
            "value": "t1",
            "raw": "'t1'"
          }
        ]
      }
    }
  ],
  "kind": "let"
}
```

如果将来你要写一个领域专用语言（DSL），也可以按这个思路去实现……好吧，说回正题！

## parse

```javascript
var createCompiler = createCompilerCreator(function baseCompile(
  template,
  options
) {
  var ast = parse(template.trim(), options) // Convert HTML string to AST.
  optimize(ast, options)
  var code = generate(ast, options)
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  }
})
```

关键代码如上，这里就不细讲 templete 到 AST 的过程，有点复杂而且细节非常多 😂

`parse` 函数把 templete 处理为 AST，上面虽然解释过 AST 是什么，但是这里可以给一个更直接的例子，一段小 templete 的 AST ：

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

`optimize` 函数可以分析出静态节点，将它们存到常量里，这样可以提高重新渲染的速度。

## generate

接着 `generate` 函数把 AST 处理为渲染函数，而渲染函数长这样：

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
vm._watcher = new Watcher(vm, updateComponent, noop)
vm._update(vm._render(), hydrating)
```

而 patch 就是 `_update` 的重要一步

diff 算法是一个不简单的东西

## 总结

- 可以通过 `vm.$options.render` 访问渲染函数

调用了 render 函数生成 Vnode，而旧的 Vnode 自然是当前的 Vnode，进行二者对比。

在这里对响应式更新流程作补充吧！

正确顺序是：

在初始化时——模板 -> AST -> render

在更新时——运行 `vm._render()` -> 用得到的新 VNode 与旧 VNode 进行 diff -> 对修改地方进行真实的 DOM 操作

## 参考链接

- https://vuejs.org/v2/guide/render-function.html
