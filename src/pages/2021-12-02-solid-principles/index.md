---
path: '/solid-principles'
date: '2021-12-02T14:15:01.816Z'
title: '个人理解版 Typescript SOLID 原则'
tags: ['coding']
---

## 阅读提示

1. 因为小前端我很久没有面向对象地编程了，但是 SOLID 本身是针对面向对象的建议，以下内容结合了自己对 typescript 肤浅的理解来解析 SOLID，不保证完全正确
2. 引用的英文句子为 SOLID 提出者 Robert C. Martin 对各个原则的定义

## Single-responsiblity Principle

> THERE SHOULD NEVER BE MORE THAN ONE REASON FOR A CLASS TO CHANGE.

如果你把多个功能写到 1 个类里，未来你在修改的时候有可能因为调整一个功能影响另一个。**单一责任原则（SRP）**就是避免上述情况的发生。

不只是类，函数、模块大体也应该遵循单一责任的原则，只是这个责任范围大了一层而已，就像生物分类的种属科目。

对于 JavaScript 玩家，比 SRP 更常听到的一句话是“一个函数只做一件事”，意思也基本一致，这么做**不仅保证了代码的可读性，还保证了代码的可维护性**。具体来说，当你把一个大函数拆分成若干个小函数，使用自文档的方式编写函数，每个函数名字基本可以清晰描述函数的职责，在修改其中一个函数的时候，也不容易影响其他函数。

## Open-closed Principle

> SOFTWARE ENTITIES (CLASSES, MODULES, FUNCTIONS, ETC.) SHOULD BE OPEN FOR EXTENSION, BUT CLOSED FOR MODIFICATION.

**开闭原则（OCP）**中的开和闭，分别代表的是对新增功能（这里的“功能”包括类、模块、函数等）开放，但拒绝修改原来的功能。（想吐槽一句，其实 OCP 得有一个前提，就是在新增功能时，不修改原来的功能，不然需求就是要修改功能还能不改么）

在计划赶不上变化的今天，我觉得这条绝对是最最重要的原则，大大巩固了程序的可维护性，下面以函数来举例，大多数不符合 OCP 的代码有一个特点，就是会带有一大堆 `if else`，例如：

```javascript
function getSound(animal) {
  if (animal === 'cat') {
    return 'meow'
  } else if (animal === 'dog') {
    return 'woof'
  } else {
    return null
  }
}
```

很好懂，就是一个返回动物叫声的函数，但是这么写的话，要加一个牛叫怎么办？

```javascript
function getSound(animal) {
  if (animal === 'cat') {
    return 'meow'
  } else if (animal === 'dog') {
    return 'woof'
  } else if (animal === 'cow') {
    return 'moo'
  } else {
    return null
  }
}
```

而且在实际工作中，如果不遵循 OCP 造成的后果大多不止一堆 `if else`，而是很多分布在不同模块的 `if else`：

```javascript
// 在发声模块，你会用
function getSound(animal) {
  if (animal === 'cat') {
    return 'meow'
  } else if (animal === 'dog') {
    return 'woof'
  } else if (animal === 'cow') {
    return 'moo'
  } else {
    return null
  }
}
// 在展示模块，你会用
function get3DModel(animal) {
  // if else if else if else if else
}
// 显示不了 3d 回退到 2d
function get2DModel(animal) {
  // if else if else if else if else
}
// 等等
```

上面的例子中，我们**修改了函数**，违反了 OCP。至于怎么才能不违反，相信大家都看过很多优化 js 代码的文章，都会告诉你如何优化一连串 `if else`，没错，就是你想的那样：

```javascript
let animalList = {
  cat: 'meow',
  dog: 'woof',
  cow: 'moo',
}

function getSound(animal) {
  return animalList[animal] || null
}
```

这么一番操作，新增动物就不需要修改函数，其实这种 OCP 实践有更具体的名字，就是后面会提到的 SOLID 的 D——**DIP（依赖反转原则）**。

做到 OCP 的另一个方法是遵循 SRP，新增新方法时不影响其他方法，自然就是“对修改关闭”了。当然总会有迫不得已的时候，即使低耦合，也总会有一点耦合的地方，只能说尽量做到吧。这里经验就会占比较大的比重，随着业务代码经验的增加，就能做到写到某些位置下意识知道未来需要新增，然后有相应的策略使得未来修改更优雅。

有经验的老程序员甚至敏锐的新人程序员其实没听说过这些原则，也会悟出相似的优化方法，但是将这种做法概括成 OCP/DIP，可以加深你对该优化方法的印象，也更容易传授给不懂的人。

## Liskov Substitution Principle

**里氏替换原则（LSP）**最早是 Barbara Liskov 女士提出，Barbara 女士的原文差不多是这样的：Let Φ(x) be a property provable about objects x of type T. Then Φ(y) should be true for objects y of type S where S is a subtype of T.

Hmmmm，十分学术，还是看 Robert C. Martin 的转述版吧：

> FUNCTIONS THAT USE POINTERS OR REFERENCES TO BASE CLASSES MUST BE ABLE TO USE OBJECTS OF DERIVED CLASSES WITHOUT KNOWING IT.

有点绕，翻译一下就是：里氏替换原则（LSP）要求使用一个父类的地方，使用这个父类的任意子类都能完美运行。

因为 JavaScript 根本不存在抽象类和接口，这里用 typescript 稍微解释一下这两个概念。

我们常常接触的后端 API，就是一种 Interface，后端给你的接口就是一个约定好格式（形状）的、抽象的、给你消费的东西。

说回语言上的 Interface，广义上它们是一样的，也是一个约定好格式（形状）的、抽象的、给你消费的东西，Interface 不会给你任何实现，只会告诉你这个东西包含什么，具体内容需要你主动 `implements`。

```typescript
interface Base {
  getName(): string
  printName(): void
}
class A implements Base {
  // ...
}
```

抽象类与 Interface 不同的是可以包含了一部分“实现”，和部分抽象方法要求使用者自己实现。抽象类不能直接实例化，必须 `extends` 才能正常使用。

```typescript
abstract class Base {
  abstract getName(): string

  printName() {
    console.log('Hello, ' + this.getName())
  }
}

class Derived extends Base {
  getName() {
    return 'world'
  }
}

const d: Base = new Derived()
d.printName()
```

如果子类重写父类的方法，并且实现逻辑差很远的话就算是违反 LSP。对于 JavaScript 玩家，LSP 建议你不要随便覆盖原型链上的方法，必须要覆盖的时候尽量减少与原方法的差异。

单看子类可以代替父类这个特点，好像感受这个原则带来的好处，其实 LSP 本身存在就是为了代码复用，并且 LSP 也助力了 ISP 和 DIP（后面会说）实现。

## Interface Segregation Principle

> CLIENTS SHOULD NOT BE FORCED TO DEPEND UPON INTERFACES THAT THEY DO NOT USE

**接口隔离原则（ISP）**字面意思就是拆分接口，其含义是不应强迫用户使用他们不用的接口。其实最初认识到接口隔离原则的时候，光看名字会觉得和单一责任原则很像，因为接口隔离做到的效果也是单一职责，但是稍微思考一下他们的定义，SRP 是简单的高内聚概念，ISP 更多是从用户角度出发，而且在实践 LSP 的时候你很可能就自动想到 ISP 了。

还是用 ts 举例吧：

```typescript
interface Bird {
  name: string
  fly(): void
}

class Egret implements Bird {
  name = 'Egret'
  fly() {
    console.log('fly')
  }
}
```

一看这接口，没毛病，符合 SRP，“单一责任”就是整一只会飞的鸟，然而没过一会你突然发现，不是所有鸟都会飞啊，鸵鸟怎么办？

```typescript
class Ostrich implements Bird {
  name = 'Ostrich'
  fly() {
    new Error("can't fly")
  }
}
```

`fly` 函数的表现有异于该接口的其他类，这样算是违反 LSP 了吧，可能会让一些可以用 `Bird` 的地方出现异常，而优化的方法可以是这样：

```typescript
interface IBird {
  name: string
}
interface IFlyable {
  fly(): void
}

class Egret implements IBird, IFlyable {
  name = 'Egret'
  fly() {
    console.log('fly')
  }
}
class Ostrich implements IBird {
  name = 'Ostrich'
}
```

一个接口分离成两个了，在写鸵鸟的时候不强迫用户实现 `fly`，这不就是接口隔离咯。

## Dependency Inversion Principle

> A. HIGH LEVEL MODULES SHOULD NOT DEPEND UPON LOW LEVEL MODULES. BOTH SHOULD DEPEND UPON ABSTRACTIONS.
> <br>B. ABSTRACTIONS SHOULD NOT DEPEND UPON DETAILS. DETAILS SHOULD DEPEND UPON ABSTRACTIONS.

**依赖反转原则（DIP）**有两层含义：高层模块不应依赖底层模块，都应依赖抽象；抽象不应依赖具体，具体应依赖抽象。为什么说是反转呢，因为传统软件开发都是高层依赖底层，抽象依赖具体。

简单来说**抽象就是类、函数，具体就是实例、对象**，下面的例子是告诉你“函数不应依赖实例，应该依赖一个类”

上面就说了 DIP 就是一种遵循 OCP 的方法，所以依然使用上面的连续 `if else` 举例，但是具体内容改一下，让例子和 DIP 更贴切：

```typescript
function getSound(animal: string) {
  if (animal === 'cat') {
    const cc: Cat = new Cat()
    cc.say()
  } else if (animal === 'dog') {
    const dd: Dog = new Dog()
    dd.say()
  } else if (animal === 'cow') {
    const oo: Cow = new Cow()
    oo.say()
  } else {
    return ''
  }
}
```

这就是抽象依赖**具体**，具体指的就是实例化的小动物们。那么怎么“依赖抽象”？就跟 OCP 里提到的差不多。

```typescript
function getSound(animal: Animal) {
  animal.say()
}
```

把 `animal` 传入的这一动作，也有一个响亮的名字——**依赖注入（Dependency Injection）**，缩写也是 DI。

这样就只需要注入一个**抽象**的 `animal` 而不是依赖 Cat、Dog、Cow 一大堆实体。可以看到，遵循 DIP 后，代码非常简洁，完全符合 OCP，以后新增小动物不再需要修改 `getSound` 函数。所以，DIP 就是 OCP 的一个实现方式。

我们可以想想，DIP 还和原则有关系？为什么可以用一个 animal 代替掉 Cat、Dog、Cow，可以说是因为遵循了 LSP。

## Takeaway

SRP 单一责任原则

1. 一个类、函数、模块只做一件事
2. SRP 做好了，OCP 自然就来了

OCP 开闭原则

1. 看到一堆 `if else` 你的雷达就该响了，优化方法是 DI
2. 新增函数时不用修改其他函数，服从 SRP

LSP 里氏替换原则

1. 处理父类的方法可以处理所有子类，提高代码复用能力
2. 助力 DIP 的实现

ISP 接口隔离原则

1. 不强迫用户使用不需要的接口
2. 助力 LSP 的实现

DIP 依赖反转原则

1. 具体依赖抽象
2. 遵循 LSP 才好 DI
3. 是一个实现 OCP 的具体方法

SOLID 5 个原则之间的关系实质错综复杂，你中有我我中有你，所以应该结合起来理解。其实很多“原则”和“设计模式”的中心思想都是一致的。之前看过一篇[文章](https://mp.weixin.qq.com/s/qRjn_4xZdmuUPQFoWMBQ4Q)提到：**找到变化，封装变化**是设计模式的核心，觉得十分精辟。除此之外还有耳熟能详的高内聚和低耦合（[High cohesion, Loose coupling](<https://en.wikipedia.org/wiki/Cohesion_(computer_science)>)两者是二位一体的，也是编程的重要中心思想。

![Coupling Vs Cohesion](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/CouplingVsCohesion.svg.png)

总结完了，这么看来，SOLID 是不是也很简单呢，但是，每个人都会、也应该有一套自己对 SOLID 的理解，在理解后**有选择地**应用于工作中才是最重要的，毕竟某些原则在一定环境下反而是违背了更好，不要死脑筋，原则不是真理，但当你处于编程困境时，这些原则或许能给你一些绝妙的灵感。

## 参考

- [Single Responsibility Principle](https://web.archive.org/web/20150202200348/http://www.objectmentor.com/resources/articles/srp.pdf)
- [Open/Closed Principle](https://web.archive.org/web/20150905081105/http://www.objectmentor.com/resources/articles/ocp.pdf)
- [Liskov Substitution Principle](https://web.archive.org/web/20150905081111/http://www.objectmentor.com/resources/articles/lsp.pdf)
- [Interface Segregation Principle](https://web.archive.org/web/20150905081110/http://www.objectmentor.com/resources/articles/isp.pdf)
- [Dependency Inversion Principle](https://web.archive.org/web/20150905081103/http://www.objectmentor.com/resources/articles/dip.pdf)
- [S.O.L.I.D. Principles Around You](https://dev.to/trekhleb/s-o-l-i-d-principles-around-you-1o17)
