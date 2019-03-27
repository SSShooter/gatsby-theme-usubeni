---
path: '/babel-enlightenment'
date: '2019-03-26T10:48:33.936Z'
title: 'babel 启蒙'
tags: ['coding', 'babel']
---

> 人类想到达天堂，建起了巴别通天塔。但是神得知此事，创造了不同的语言，打乱他们的交流……通天计划失败告终

但是！2014 年！babel 通过编译的方式，统一了前端在浏览器兼容的问题，前端巴别塔建起来啦！

## babel 是什么

**babel 是一个编译器，**它可以把 ECMAScript 2015+ 代码转换为大部分浏览器都兼容的版本。

你可以这么理解：

```javascript
const babel = code => compile(code)
```

babel 输入原始代码，输出编译后的代码。无论是在浏览器、CLI 或是 webpack 中使用 babel，都是这个原理。

你可以在[这里](https://babeljs.io/repl)输入 ECMAScript 2015+，直接看到 babel 的编译结果。

一个例子 🌰：

```javascript
// 输入
let b = a => a

// 转换后
;('use strict')

var b = function b(a) {
  return a
}
```

## babel 预设与插件

**预设是插件的集合**

### 插件

假如不使用插件，babel 就是这个操作：

```javascript
const babel = code => code
```

没错，babel 什么都不会做。因为 babel 对代码的处理都是基于插件的。

### 预设

loose 模式

重点预设 1：**@babel/preset-react**

重点预设 2：**@babel/preset-env**

useBuiltIns 要求安装Polyfill

这个预设会根据你配置的**“环境”**自动给你匹配插件。

所谓环境主要来自 [.browserslistrc](https://github.com/browserslist/browserslist)。

[broswerlist 详解](https://github.com/browserslist/browserslist#queries)

[输入配置直接显示筛选结果](https://browserl.ist/)

## 配置方法

## Polyfill

babel 本身只转换语法，一些新版本的内置对象比如 Promise 和 WeakMap 在老版本的浏览器依然不能运行，这个时候需要使用 Polyfill，它会在全局变量中模拟新的方法和对象。

Polyfill 是一个相对独立的东西，不涉及到 babel 设置，你只需要确保你的代码运行之前运行 babel-polyfill。

安装：

```
npm install --save babel-polyfill
```

在你的应用入口使用 polyfill:

```javascript
import 'babel-polyfill'
```

幸运的是，正如上面提到的，对于我们来说，我们使用的是 env preset，其中有一个 "useBuiltIns" 选项，当设置为 "usage" 时，实际上将应用上面提到的最后一个优化，只包括你需要的 polyfill。使用此新选项，配置更改如下：

## transform-runtime

babel 在把新标准转换为老标准时会借助一些辅助函数：

```javascript
let a = { [name]: 'Faye' }

// after
;('use strict')

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = value
  }
  return obj
}

var a = _defineProperty({}, name, 'Faye')
```

可以看到编译结果活生生多了一大个函数，在模块化的时候如果每个模块都使用到这个新特性，则每个模块都会被添加辅助函数，体积骤然增大。

在使用 `@babel/plugin-transform-runtime` 后，编译结果会变成：

```javascript
'use strict'

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')

var _defineProperty2 = _interopRequireDefault(
  require('@babel/runtime/helpers/defineProperty')
)

var a = (0, _defineProperty2.default)({}, name, 'Faye')
```
