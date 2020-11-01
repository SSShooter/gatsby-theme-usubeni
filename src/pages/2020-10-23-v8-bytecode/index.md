---
path: '/computing-dictionary'
date: '2020-10-23T18:34:26.022Z'
title: '自用计算机词典（前端方向）'
tags: ['coding']
# released: false
---

**未完成，长期更新**

## Engine

处理代码的机器。

- V8 是一个 JavaScript 引擎
- WebKit 是一个浏览器引擎

## Runtime

运行环境，如：

- 浏览器提供的 window 对象，DOM API
- NodeJS 提供系统和网络访问能力
- Electron 提供 UI 相关 API
- setTimeout 等函数由运行时提供

## V8

JavaScript 引擎，用于 Chrome，但与浏览器引擎区别的是 JavaScript 引擎只专注于 JavaScript，他不理解任何 DOM 相关概念。

- SpiderMonkey —— Firefox
- Nitro（JavaScriptCore） —— Safari
- Chakra —— Edge

2017 年 5 月 15 日，V8 团队发布 [Launching Ignition and TurboFan](https://v8.dev/blog/launching-ignition-and-turbofan)，宣布新 pipeline 更换为 [Ignition](https://v8.dev/docs/ignition)(interpreter) 和 [TurboFan](https://v8.dev/docs/turbofan)(compiler)

### Ignition

### TurboFan

## WebKit

浏览器引擎之一，包括渲染引擎，统合 JavaScript 引擎。Safari 使用 WebKit，另外还有：

- Firefox —— Gecko
- Chrome/Opera（15 之后） —— Blink（WebKit 的一个 fork）

下图为 WebKit 主要流程：

![webkit 主要流程](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/webkitflow.png)

- [How Browsers Work: Behind the scenes of modern web browsers](https://www.html5rocks.com/en/tutorials/internals/howbrowserswork/#The_rendering_engine)
- [WebKit](https://webkit.org/project/)
- [Browser Engines… Chromium, V8, Blink? Gecko? WebKit?](https://medium.com/@jonbiro/browser-engines-chromium-v8-blink-gecko-webkit-98d6b0490968)

## Compiler

Compiler 是将一种语言（通常是高等语言）处理为另一种语言（assembly language、object code、machine code）的计算机程序。

它需要做的可能包含：

- 预处理
- 词法分析
- 句法分析
- 转化 IR
- 代码优化
- 代码生成

### 编译器的三级结构

![three-stage-compiler-structure](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/Compiler_design.svg)

- 前端：源代码转换为 intermediate representation(IR)
- 中端：优化 IR
- 后端：根据 CPU 再次优化 IR，生成目标架构可运行的代码

AOT 提前编译，然后运行

JIT 运行前编译，造成 overhead，[V8 会缓存多次使用的代码的编译结果](https://v8.dev/blog/code-caching)

## interpreter

interpreter 可以直接执行脚本语言或编程语言而不用事先编译。

但是事实上，interpreter 内部依然有一个 compiler。只不过流程连贯了起来，compiler 生成代码后，interpreter 立即执行。

## 区别

相对于 compile 的原意是编撰，compiler 就是编撰者；

interpret 是口译，interpreter 就是口译者；

在计算机领域 compiler 是编译器，interpreter 是解释器，这两者的区别用原意解释到更容易理解：

- compiler 把源信息**编撰**为更好懂的信息，**等待**其他人阅读
- interpreter 一边接收信息，同时转换信息的“语言”，**口译**给正在听的人

一般来说：

- compiler 做的是：源代码 -> 机器码 字节码
- interpreter 做的是：字节码 -> 机器码，并运行

## Virtual Machine

虚拟机

## Assembly Code

汇编语言是 CPU 的母语，的人类可读版本。assembler 可以将汇编语言编译为 Machine Code。

## WebAssembly

## bytecode

字节码，虽然也是处理成一堆 0 和 1，但是 CPU 根本看不懂，不过，虚拟机倒是懂。

例如 Java class 文件，JavaScript 的 bytecode

## Machine Code

一堆 0 和 1，计算机真正的母语，可以直接运行。

- [The JavaScript runtime environment](http://dolszewski.com/javascript/javascript-runtime-environment/)
- [What is the difference between JavaScript Engine and JavaScript Runtime Environment](https://stackoverflow.com/questions/29027845/- what-is-the-difference-between-javascript-engine-and-javascript-runtime-environm)
- [The Javascript Runtime Environment](https://medium.com/@olinations/the-javascript-runtime-environment-d58fa2e60dd0)
- [Machine code vs. Byte code vs. Object code vs. Source code vs. Assembly code vs. Executable code](https://medium.com/@rahul77349/machine-code-vs-byte-code-vs-object-code-vs-source-code-vs-assembly-code-812c9780f24c)
- [Ignition 指令注释](https://github.com/v8/v8/blob/master/src/interpreter/interpreter-generator.cc)
