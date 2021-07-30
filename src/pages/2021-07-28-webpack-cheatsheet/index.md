---
path: '/webpack-cheatsheet'
date: '2021-07-28T15:39:43.217Z'
title: 'webpack-cheatsheet'
tags: ['tag']
released: false
---

## 入口

常见多为但入口 SPA

## loader

等于一条流水线，文件被引用时通过匹配文件名称和类型选择需要用的 loader，loader 处理呈流水线状，一个处理完传递给下一个。

处理原理多是转换为 AST，再根据要求操作 AST，最后还原为字符串。

## plugin

loader 用于处理文件，而 plugin 兼顾全局操作，可以做批量的文件处理，也可以介入编译流程改变编译方法（如 HappyPack）。

依赖 tapable，其实就是一个发布订阅机制，可以在实践中使用 compiler 等对象。

compiler hook 参考链接：https://webpack.js.org/api/compiler-hooks/