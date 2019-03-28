---
path: '/nodejs-module'
date: '2019-03-28T13:31:32.058Z'
title: '快速理解 nodejs 模块'
tags: ['coding']
---

这个小短文用于快速理解 nodejs 模块（也就是 CommonJS 规范）。

## 本质

`module.exports` 用于暴露一个值，这个值默认是对象，也可以覆盖为原始值。

尝试在一个文件中直接 log 出 module 的值，可以得到：

```javascript
{
  id: '.',
  exports: {}, // 默认空对象
  parent: null,
  filename: '/Users/a10.12/webpack-learning/src/module.js',
  loaded: false,
  children: [],
  paths:
   [ '...' ]
}
```

你需要通过修改 module 的 exports 属性来输出你需要输出的东西，而 `require` 用于导入一个模块，`module.exports` 的值是什么，`require` 拿到的就是什么。

## 使用

例如有 module.js

```javascript
module.exports = {
  s: 2,
}
```

在 index.js 中引入

```javascript
let v = require('./module.js')

console.log(v) // 输出为 { s: 2 }
```

原始值的情况也一样

```javascript
module.exports = 2

let v = require('./module.js')

console.log(v) // 输出为 2
```

因为 module.exports 默认是个对象，在输出对象的时候自然有这么一种写法：

```javascript
module.exports.s = 2
```

这样 require 得到的也是`{ s: 2 }`。

## 简写

大概是大佬们觉得 module.exports 写起来太长，于是把 exports 引用到了 module.exports，所以检查这两个东西是否相等时，返回 `true`:

```javascript
console.log(exports === module.exports) // true
```

有了这个特性，在导出对象时能很方便地这么写：

```javascript
exports.s = 2

let v = require('./module.js')

console.log(v) // 输出为 2
```

但是你却不能这么写：

```javascript
// 这样
exports = 2
// 或这样
exports = {
  s: 2,
}
// 都是不可以的

let v = require('./module.js')

console.log(v) // 输出为 {}
```

原因正如上面所说，exports 本来就只是一个对 module.exports 的引用，你可以对这个引用的对象添加属性，但是一旦用上面两种方法覆盖了 exports 对 module.exports 的引用，exports 就等于无效了。

最后提醒，如果前面说的看不懂，可能需要加深对 ECMAScript 引用值和原始值的理解...
