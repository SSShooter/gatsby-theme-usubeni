---
path: '/webpack-bootstrap'
date: '2019-02-19T15:31:12.015Z'
title: 'webpack 最简打包结果分析'
tags: ['coding', 'webpack']
---

现在的 webpack 不再是入门噩梦,过去 webpack 最让人心塞的莫过于配置文件，而 webpack4 诞生随之而来的是无配置 webpack。

使用 webpack4，至少只需要安装 webpack 和 webpack cli。所以大家完全可以自己打一个最简单的包，还能修改插件对比前后的区别。

`npm i webpack webpack-cli -D` 安装后，因为 webpack4 会默认 src 为入口目录，所以先新建 `src/index.js`。

```javascript
// src/index.js
import { sth } from './shouldImport'
import other from './shouldImport'

let test = 'this is a variable'

export default {
  a: test + ',' + sth,
  other,
}
```

为了更了解 webpack  导入机制所以再新建 `src/shouldImport.js`。

```javascript
// src/shouldImport.js
export let sth = 'something you need'

export default {
  others: '',
}
```

然后运行 `node_modules/.bin/webpack --mode development` 即可在 `dist/main.js` 看到打包后的文件。

但是默认设置中模块文件会被 `eval` 包裹导致不便查看，所以需要再在设置做一点修改，把 devtool 属性改为 `'source-map'`：

```javascript
// 在根目录新建 webpack.config.js 文件
module.exports = mode => {
  if (mode === 'production') {
    return {}
  }

  return {
    devtool: 'source-map',
  }
}
```

然后再打包应该就能看到类似一下的文件结构，开发环境下打包得到的文件自带注释，理解起来不难：

```javascript
;(function(modules) {
  // webpackBootstrap
  // The module cache 模块缓存
  var installedModules = {}

  // The require function 请求函数
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    // 检查模块是否在缓存
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports
    }
    // Create a new module (and put it into the cache)
    // 创建新模块并放进缓存
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {},
    })

    // Execute the module function
    // 执行模块函数（有点不懂为什么 this 要传入 module.exports）
    modules[moduleId].call(
      module.exports, // this
      module, // 模块对象本身
      module.exports, // 模块对象的 exports 属性
      __webpack_require__ // 请求函数最终返回模块输出，传入用于请求其他模块
    )

    // Flag the module as loaded
    // 加载完成标志
    module.l = true

    // Return the exports of the module
    // 返回模块的输出
    return module.exports
  }

  // expose the modules object (__webpack_modules__)
  // 暴露所有模块对象
  __webpack_require__.m = modules

  // expose the module cache
  // 暴露模块缓存
  __webpack_require__.c = installedModules

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  }

  // define getter function for harmony exports
  // 为 ES6 export 定义 getter 函数
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      // 检查属性是否存在
      Object.defineProperty(exports, name, { enumerable: true, get: getter })
    }
  }

  // define __esModule on exports
  // 于 export 定义 __esModule
  __webpack_require__.r = function(exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    }
    Object.defineProperty(exports, '__esModule', { value: true })
  }

  // create a fake namespace object
  // 创建代用命名空间对象
  // mode & 1: value is a module id, require it
  // value 是模块 id，必要
  // mode & 2: merge all properties of value into the ns
  // 合并 value 所有属性到 ns
  // mode & 4: return value when already ns object
  // ns 已经是对象时返回 value
  // mode & 8|1: behave like require
  // 表现如 require
  __webpack_require__.t = function(value, mode) {
    if (mode & 1) value = __webpack_require__(value)
    if (mode & 8) return value
    if (mode & 4 && typeof value === 'object' && value && value.__esModule)
      return value
    var ns = Object.create(null)
    __webpack_require__.r(ns)
    Object.defineProperty(ns, 'default', { enumerable: true, value: value })
    if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key]
          }.bind(null, key)
        )
    return ns
  }

  // getDefaultExport function for compatibility with non-harmony modules
  // 用于兼容非 ES6 模块的 getDefaultExport 函数
  __webpack_require__.n = function(module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module['default']
          }
        : function getModuleExports() {
            return module
          }
    __webpack_require__.d(getter, 'a', getter)
    return getter
  }

  // __webpack_public_path__
  __webpack_require__.p = ''

  // Load entry module and return exports
  // 加载入口模块并返回 export
  return __webpack_require__((__webpack_require__.s = './src/index.js'))
})({
  './src/index.js':
    /*! exports provided: default */
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      __webpack_require__.r(__webpack_exports__) // 于 export 定义 __esModule
      /* harmony import */
      var _shouldImport__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        './src/shouldImport.js'
      )

      let test = 'this is a variable'

      /* harmony default export */

      __webpack_exports__['default'] = {
        a: test + ',' + _shouldImport__WEBPACK_IMPORTED_MODULE_0__['sth'],
        other: _shouldImport__WEBPACK_IMPORTED_MODULE_0__['default'],
      }
    },

  './src/shouldImport.js':
    /*! exports provided: sth, default */
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      __webpack_require__.r(__webpack_exports__)
      /* harmony export (binding) */

      __webpack_require__.d(__webpack_exports__, 'sth', function() {
        return sth
      })
      let sth = 'something you need'

      __webpack_exports__['default'] = {
        others: '',
      }
    },
})
```

源文件中的所有 `import` 和 `export` 都会转换为对应的辅助函数。

- import 对应 `__webpack_require__`
- export 对应 `__webpack_exports__['default']` 直接赋值和 `__webpack_require__.d`。

整理一下整个流程：

1. 定义 `__webpack_require__` 及其辅助函数
2. 使用 `__webpack_require__` 引入入口模块
3. `__webpack_require__` 函数载入模块，将模块放到模块缓存
4. 调用模块
   1. 同样使用 `__webpack_require__` 读取依赖（回到第 3 步）
   2. 运行模块内部功能
   3. 使用 `__webpack_exports__['default']` 直接赋值和 `__webpack_require__.d` 输出
5. 运行结束
