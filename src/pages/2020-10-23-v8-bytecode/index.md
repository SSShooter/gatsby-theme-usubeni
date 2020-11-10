---
path: '/computing-dictionary'
date: '2020-10-23T18:34:26.022Z'
title: '自用计算机词典（前端方向）'
tags: ['coding']
# released: false
---

**未完成，长期更新**

## Runtime

常指 Runtime system（区别于程序生命周期的 Runtime），也叫作 runtime environment。

> Most programming languages have some form of runtime system that provides an environment in which programs run. This environment may address a number of issues including the management of application memory, how the program accesses variables, mechanisms for passing parameters between procedures, interfacing with the operating system, and otherwise. The compiler makes assumptions depending on the specific runtime system to generate correct code. Typically the runtime system will have some responsibility for setting up and managing the stack and heap, and may include features such as garbage collection, threads or other dynamic features built into the language.

- 浏览器提供的 window 对象，DOM API
- Node.js 提供系统和网络访问能力
- Electron 提供 UI 相关 API
- setTimeout 等函数由运行时提供

## V8

JavaScript 引擎，用于 Chrome，但与浏览器引擎区别的是 JavaScript 引擎只专注于 JavaScript，他不理解任何 DOM 相关概念。

- SpiderMonkey —— Firefox
- Nitro（JavaScriptCore） —— Safari
- Chakra —— Edge

2017 年 5 月 15 日，V8 团队发布 [Launching Ignition and TurboFan](https://v8.dev/blog/launching-ignition-and-turbofan)，宣布新 pipeline 更换为 [Ignition](https://v8.dev/docs/ignition)(interpreter) 和 [TurboFan](https://v8.dev/docs/turbofan)(compiler)

[JavaScript 引擎、虚拟机、运行时环境是一回事儿吗？](https://www.zhihu.com/question/39499036)

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
- 后端：根据 CPU 再次优化 IR，生成**目标架构可运行的代码**

### 编译策略

#### AOT

Ahead-of-time compilation，提前将高级语言（如 C）或 IR（如 Java bytecode）**根据架构**编译为可运行代码。（不需要 Interpreter）

#### JIT

Just-in-time compilation（也称为 dynamic translation 或 run-time compilations），是 **ahead-of-time compilation (AOT) 和 interpretation 的组合**。（可以看出 JIT 和 Interpreter 的奇妙关系）

在运行时（而不是执行之前）编译，这个过程包括把源代码或 bytecode 转换成机器码并立即运行。JIT 会造成 overhead，但 compile 和 recompile 带来的速度提升可以弥补 overhead。

[V8 会缓存多次使用的代码的编译结果](https://v8.dev/blog/code-caching)

## Interpreter

interpreter 可以直接执行脚本语言或编程语言而不用事先编译。

三种 interpreter：

- parse 源码，并运行
- translate 源码为 IR，并运行
- interpreter 内部依然有一个 compiler。只不过流程连贯了起来，compiler 生成代码后，interpreter 立即执行。

## Compiler 和 Interpreter 的区别

相对于 compile 的原意是编撰，compiler 就是编撰者；

interpret 是口译，interpreter 就是口译者；

在计算机领域 compiler 是编译器，interpreter 是解释器，这两者的区别用原意解释到更容易理解：

- compiler 把源信息**编撰**为更好懂的信息，**等待**其他人阅读
- interpreter 一边接收信息，同时转换信息的“语言”，**口译**给正在听的人

一般来说：

- compiler 做的是：源代码 -> 机器码 字节码
- interpreter 做的是：源代码 字节码 -> 机器码，并运行

一种语言是编译型或解释型的定义由官方实现决定，事实上一种语言是编译型或是解释型不是绝对的。

## Intermediate representation

compiler 或 virtual machine 使用的一种数据结构或代码。

V8 的 IR 是 Sea-of-Nodes。

## Virtual Machine

分为系统虚拟机和进程虚拟机，系统虚拟机模拟整个计算机，此处主要讨论进程虚拟机。

进程虚拟机也叫 application virtual machine 或 Managed Runtime Environment (MRE)（重点，运行时环境）。

进程虚拟机建立在真实系统上，为高级语言提供运行环境，例如 JVM。

> A process VM provides a high-level abstraction – that of a high-level programming language (compared to the low-level ISA abstraction of the system VM). Process VMs are implemented using an interpreter; performance comparable to compiled programming languages can be achieved by the use of just-in-time compilation.

## Assembly Code

汇编语言是 CPU 的母语，的人类可读版本。assembler 可以将汇编语言编译为 Machine Code。

## WebAssembly

## Bytecode

字节码，虽然和机器码一样都是处理成一堆 0 和 1，但是 CPU 根本看不懂，不过，虚拟机倒是懂。

例如 Java class 文件、JavaScript 的 bytecode

## Machine Code

一堆 0 和 1，计算机真正的母语，可以直接运行每一条指令，例如 store、load、jump、ALU 操作。

- [The JavaScript runtime environment](http://dolszewski.com/javascript/javascript-runtime-environment/)
- [What is the difference between JavaScript Engine and JavaScript Runtime Environment](https://stackoverflow.com/questions/29027845/- what-is-the-difference-between-javascript-engine-and-javascript-runtime-environm)
- [The Javascript Runtime Environment](https://medium.com/@olinations/the-javascript-runtime-environment-d58fa2e60dd0)
- [Machine code vs. Byte code vs. Object code vs. Source code vs. Assembly code vs. Executable code](https://medium.com/@rahul77349/machine-code-vs-byte-code-vs-object-code-vs-source-code-vs-assembly-code-812c9780f24c)
- [Ignition 指令注释](https://github.com/v8/v8/blob/master/src/interpreter/interpreter-generator.cc)
