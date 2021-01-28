---
path: '/prototype-chain'
date: '2021-01-28T10:48:31.619Z'
title: '老生常谈的 JavaScript 原型链'
tags: ['coding', '原型链']
---

用了这么多年的 JavaScript，对于原型链这东西自觉是理解了，但是日常工作中很少使用的“继承”部分最近突然想起来竟觉得有点陌生，所以在这里稍微理一下思路。

本文**90%**不能让不懂原型链的人看懂原型链，但是可能可以给懂一点原型链的人一点提示，不过如果本文让你更混乱的话，请在评论区提出疑问 😂

## prototype

只有函数有 prototype，对象没有。

```javascript
// 函数
function A(){}
A.prototype
// 会输出类似下面的东西
{
    constructor: A,
    __proto__: Object
}
// 对象
a = {}
a.prototype // 输出 undefined
// 而如果你给一个对象赋予 prototype，效果不过是多了一个 prototype 属性
```

## proto

`__proto__` 可以看成一种“连接”，所到之处的属性（property）都可以访问。刚进坑的时候听说 `__proto__` 不是标准的属性，可能会有不同的实现，但这么多年过来了似乎也就只用 `__proto__`。

```javascript
a = { c: 1 }
a.hasOwnProperty('c') // 输出 true
```

a 显然没有 hasOwnProperty 这个属性，于是他会往 `__proto__` 找，在 Object.prototype 下找到 `hasOwnProperty` 并使用。

一般，一个 `__proto__` 会被连接到一个 prototype，但你仍可以直接定义 `__proto__`

```javascript
a.__proto__ = { b: 'b' }
a.b // 输出 b
```

所谓的原型链就是由 `__proto__` 串成。

```
例如一只猫
let mona = new Feliscatus()

     __proto__                   __proto__                     __proto__
mona -----------> Cat.prototype -----------> Felis.prototype -----------> Felinae.prototype
|                  |                           |                             |
| 实例自己的属性      | constructor Cat           | constructor Felis           | constructor Felinae
                    | 其他绑定在 prototype 的属性  | 其他绑定在 prototype 的属性   | 其他绑定在 prototype 的属性

上一层找不到的东西就沿着 __proto__ 往下找，直到尽头，找不到就是 undefined 了
```

`__proto__` 也可以直接连接到一个对象（换句话就是，继承一个对象的属性）：

```javascript
const person = {
  isHuman: false,
  printIntroduction: function() {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`)
  },
}
let me1 = {}
me1.__proto__ = person
// 这样 me1 就能使用 printIntroduction
// 不过还有更方便一点的方法，使用 Object.create，这样就不用自己连接
let me2 = Object.create(person)
```

## 实例化

在 `new` 一个对象时，实际上做了什么，如何自己写一个 `new`（据说面试会考，不过我没遇到过）：

```javascript
function Person(name) {
  this.name = name
}
Person.prototype.say = words => words
// 这是一个人类
let person1 = new Person('Lilas')
// 正常用 new 的结果是
// 1. 返回一个对象，
// 2. 这个对象运行了构造函数，
// 3. 这个对象可以使用 Person 的 prototype 的属性

// 知道了这三步，下面写一个自己的 new
function createInstance(klass, ...arg) {
  // 返回一个对象
  let obj = {}
  // 以对象为 this 运行构造函数 klass
  klass.call(obj, ...arg)
  // 为了让 obj 可以使用 Person.prototype 使用 __proto__ 连接
  obj.__proto__ = klass.prototype
  // 返回这个对象
  return obj
}
```

## 继承

上面说过用 `Object.create` 继承一个对象的属性，这里的继承说的是“类”继承。

JavaScript 在 ES6 之前，其实没有类，所谓的继承就是沿着原型链访问父类（准确来说是 constructor）的变量和方法。

（顺带一提，想要了解 ES6 之后的类可以看看 [Class 继承与 super](/2021-01-28-js-class-inheritance)，从这篇文章还可以看出，ES6 的类不是单纯的语法糖）

在 proto 部分说明了原型链的结构，下面讲讲实际上怎么构造原型链。

```javascript
// 上面已经有一个 Person 了，下面继承 Person 写一个 Boxer
function Boxer(name, id) {
  // 在成为格斗者前他得是个人，所以先调用 Person 构造函数，相当于 super()
  Person.call(this, name)
  //   然后为这个格斗者加上自己的格斗者 id
  this.id = id
}
// 添加 Boxer 自己的方法
Boxer.prototype.punch = () => 'punch!'
// 接通到 Person.prototype
Boxer.prototype.__proto__ = Person.prototype
```

无论接着还要继承多少次，总之，记住 `__proto__` 串通了父子的 `prototype` 就好了。
