---
path: '/game-programming-pattern'
date: '2021-04-28T10:59:31.662Z'
title: 'game-programming-pattern'
tags: ['tag']
---

- GOF 的几种设计模式
- 作者总结的游戏设计模式
- 主要讲述代码如何组织而不是如何写代码

> For me, good design means that when I make a change, it’s as if the entire program was crafted in anticipation of it. I can solve a task with just a few choice function calls that slot in perfectly, leaving not the slightest ripple on the placid surface of the code.

解耦，很多设计模式都是为了解决这个问题。它要做到的是：

> minimize the amount of knowledge you need to have in-cranium before you can make progress.

[传送](https://gameprogrammingpatterns.com/architecture-performance-and-games.html#how-can-decoupling-help)，在作出一项修改时，你要加载到大脑的模块应当越少越好，实际作出修改的模块越少越好。

但是过分的解耦和抽象会让代码复杂、迂回，在逻辑中反复横跳的成本不亚于原来耦合着。

个人感悟：所以还是那句话，在编程中把握“度”是十分重要的，用英语来说就是 trade-off。至于如何尽量好地把握，应该是依靠经验吧。不过谁也无法预料新加的需求对原来的解耦会不会造成毁灭打击。

在制作原型时速度要紧，不必过于认真，如果在这步直接解耦，很可能是属于“过早优化”。

>  if you want to make something fun, have fun making it