---
path: '/ieee-754'
date: '2020-09-22T11:04:11.232Z'
title: 'ieee-754'
tags: ['coding']
released: false
---

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/1180px-Float_example.svg.png)

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/IEEE_754_Double_Floating_Point_Format.svg.png)

上图来自维基百科，黑夜模式会导致文字看不清楚，麻烦大家使用日间模式阅读啦。

IEEE-754 标准是一个浮点数标准，存在 32、64、128 bit 三种格式（上面两幅图分别是 32 bit 和 64 bit 的情况，结构是一致的），JavaScript 使用的是 64 位，也就是常说的“双精度”，本文将以 64 位举例讲解 IEEE-754 标准。

（至于“浮点数”为什么叫“浮点数”，后面会有解释）

从图中可知，IEEE-754 标准将 64 位分为三部分：

- sign，1 bit 的标识位，0 为正数，1 为负数
- exponent，指数，11 bit
- fraction，小数部分，52 bit

为了举例方便，我们使用下面这串数字介绍 IEEE-754 标准

0100000001101101001000000000000000000000000000000000000000000000

不多不少 64 位，不信的数一数（doge）

## fraction

之所以说 0 到 51 位（总共 52 位）是 **“fraction（小数）”**，是因为这段数字在处理时会置于 `1.`（会有特例，后面会说）之后。

例如上面的那串数字，属于 fraction 的 52 位是：

`1101001000000000000000000000000000000000000000000000`

那么在解释时，会是：

`1.1101001000000000000000000000000000000000000000000000`

没有为什么，就是这么规定的，名副其实的“小数” 😂

但是拿到这一长串 1.f（f 代指 fraction） 要怎么用呢？就得结合 exponent 部分。

## exponent

为更清晰地说明 **exponent（指数）**从二进制到十进制的转换，借用[此文](https://2ality.com/2012/04/number-encoding.html)的一个“表格”：

```
%00000000000     0  →  −1023  (lowest number)
%01111111111  1023  →      0
%11111111111  2047  →   1024  (highest number)

%10000000000  1024  →      1
%01111111110  1022  →     −1
```

请特别注意，01111111111 代表的是 0，往上是正数，往下是负数

抽离出上面例子的 52 到 62 位，得到：`10000000110`，再转为十进制数 1030，因为 1023 才是 0，所以减去 1023 算出真正结果，即是 7。

要使用这个 exponent（指数，下面用字母 e 指代指数），我们将上面得到的 1.f 乘上 2 的 7 次方(为了节省位置，省略掉后面的 0)：

1.f × 2<sup>e−1023</sup> = 1.1101001 × 2<sup>7</sup> = 11101001

（**注意了，这是二！进！制！**类比成十进制就是类似：1.3828171 × 10<sup>7</sup> = 13828171）

在组合“fraction（小数）”和“exponent（指数）”得到 11101001 后，转为十进制即可，再加上没什么好解释的正负号 sign（标志位）（0 即为正数）

所以例子的

0100000001101101001000000000000000000000000000000000000000000000，

其实就是以 IEEE-754 标准储存的 `233`

## 特殊情况

当 exponent（指数）为 -1023（也就是最小值，二进制表示为 7 个 0）时，是一种名为 denormalized 的特殊情况。

其表现为当前值的计算公式改为：

0.f × 2<sup>−1022</sup>

这种情况用于表达极小的数字。

## 总结

[这位大佬](https://2ality.com/2012/04/number-encoding.html)的总结过于精辟：

| 表达式                 | 取值                       |
| ---------------------- | -------------------------- |
| (−1)s × %1.f × 2e−1023 | normalized, 0 < e < 2047   |
| (−1)s × %0.f × 2e−1022 | denormalized, e = 0, f > 0 |
| (−1)s × 0              | e = 0, f = 0               |
| NaN                    | e = 2047, f > 0            |
| (−1)s × ∞ (infinity)   | e = 2047, f = 0            |

## 动手转换 IEEE-754



## 为什么算不准

程序员们因为精度丢失苦不堪言，那么到底为什么会算不准呢？

[相关问题](https://stackoverflow.com/questions/1458633/how-to-deal-with-floating-point-number-precision-in-javascript)

### 情况一

先说最常见的一种情况：

```
0.1 + 0.2
1 - 0.9
0.0532 * 100
(0.28 * 100 + 0.14 * 100) / 100
```

https://javascript.info/number

加减乘除无一幸免

原因是：除 不 尽

### 情况二

实在太大了

## 实用链接

[十进制转 IEEE-754](https://babbage.cs.qc.cuny.edu/IEEE-754/)

[IEEE-754 转十进制](https://www.h-schmidt.net/FloatConverter/IEEE754.html)

[自己动手的十进制转 IEEE-754](https://www.wikihow.com/Convert-a-Number-from-Decimal-to-IEEE-754-Floating-Point-Representation)
