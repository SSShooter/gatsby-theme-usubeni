---
path: '/felist-a1'
date: '2019-04-29T14:00:00.718Z'
title: 'felist-a1'
tags: ['废弃']
---

## 一、JavaScript 基础

### 变量和类型

- 1.`JavaScript`规定了几种语言类型

  （应该是指数据类型吧）

  来自 [ecma-262](http://www.ecma-international.org/ecma-262/9.0/index.html#sec-ecmascript-language-types) 的标准答案：

  - `Undefined`
  - `Null`
  - `Boolean`
  - `String`
  - `Symbol`
  - `Number`
  - `Object`

- 2.`JavaScript`对象的底层数据结构是什么

  这里定义了一个obj的变量，obj是一个指针，它是一个局部变量，是放在栈里面的。而大括号{}实例化了一个Object，这个Object需要占用的空间是在堆里申请的内存，obj指向了这个内存所在的位置。

- 3.`Symbol`类型在实际开发中的应用、可手动实现一个简单的`Symbol`

* 4.`JavaScript`中的变量在内存中的具体存储形式

* 5.基本类型对应的内置对象，以及他们之间的装箱拆箱操作

* 6.理解值类型和引用类型

* 7.`null`和`undefined`的区别

* 8.至少可以说出三种判断`JavaScript`数据类型的方式，以及他们的优缺点，如何准确的判断数组类型

* 9.可能发生隐式类型转换的场景以及转换原则，应如何避免或巧妙应用

* 10.出现小数精度丢失的原因，`JavaScript`可以存储的最大数字、最大安全数字，`JavaScript`处理大数字的方法、避免精度丢失的方法
