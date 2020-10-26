---
path: '/v8-bytecode'
date: '2020-10-23T18:34:26.022Z'
title: 'v8-bytecode'
tags: ['tag']
released: false
---

## engine

处理代码的机器，V8 就是一个 JavaScript 引擎。

## runtime

运行环境，如：

- 浏览器提供的 window 对象，DOM API
- NodeJS 提供系统和网络访问能力
- Electron 提供 UI 相关 API


## V8

JavaScript 引擎，用于 Chrome，但与浏览器引擎区别的是 JavaScript 引擎只专注于 JavaScript，他不理解任何 DOM 相关概念。

- SpiderMonkey —— Firefox
- Nitro（JavaScriptCore） —— Safari
- Chakra —— Edge

## WebKit

浏览器引擎之一，包括渲染引擎，统合 JavaScript 引擎。Safari 使用 WebKit，另外还有：

- Firefox —— Gecko
- Chrome/Opera（15 之后） —— Blink（WebKit 的一个 fork）

[How Browsers Work: Behind the scenes of modern web browsers](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#The_rendering_engine)

[WebKit](https://webkit.org/project/)

[Browser Engines… Chromium, V8, Blink? Gecko? WebKit?](https://medium.com/@jonbiro/browser-engines-chromium-v8-blink-gecko-webkit-98d6b0490968)

## compiler

AOT JIT

## interpreter

## ignition

V8 compiler

## turbofan

V8 interpreter

## assembly

汇编语言

## bytecode

字节码

[The JavaScript runtime environment](http://dolszewski.com/javascript/javascript-runtime-environment/)

[What is the difference between JavaScript Engine and JavaScript Runtime Environment](https://stackoverflow.com/questions/29027845/what-is-the-difference-between-javascript-engine-and-javascript-runtime-environm)

[The Javascript Runtime Environment](https://medium.com/@olinations/the-javascript-runtime-environment-d58fa2e60dd0)

[Machine code vs. Byte code vs. Object code vs. Source code vs. Assembly code vs. Executable code](https://medium.com/@rahul77349/machine-code-vs-byte-code-vs-object-code-vs-source-code-vs-assembly-code-812c9780f24c)

[ignition 指令注释](https://github.com/v8/v8/blob/master/src/interpreter/interpreter-generator.cc)
