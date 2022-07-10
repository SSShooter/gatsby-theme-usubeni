---
path: '/interview-report'
date: '2021-08-03T20:26:11.661Z'
title: 'interview-report'
tags: ['tag']
released: false
---

## map and set

ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别。

首先，WeakSet 的成员只能是对象，而不能是其他类型的值。

其次，WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。

ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应，是一种更完善的 Hash 结构实现。如果你需要“键值对”的数据结构，Map 比 Object 更合适。

## 301 and 302

301 和 302 状态码都表示重定向，就是说浏览器在拿到服务器返回的这个状态码后会自动跳转到一个新的 URL 地址，这个地址可以从响应的 Location 首部中获取（用户看到的效果就是他输入的地址 A 瞬间变成了另一个地址 B）——这是它们的共同点。

他们的不同在于。301 表示旧地址 A 的资源已经被永久地移除了（这个资源不可访问了），搜索引擎在抓取新内容的同时也将旧的网址交换为重定向之后的网址；

302 表示旧地址 A 的资源还在（仍然可以访问），这个重定向只是临时地从旧地址 A 跳转到地址 B，搜索引擎会抓取新的内容而保存旧的网址。 SEO302 好于 301

相关 **http 请求头**：Location 首部指定的是需要将页面重新定向至的地址。一般在响应码为 3xx 的响应中才会有意义。

## TLS 握手

http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html

## 拷贝

```
var A2 = Object.assign({}, A1);
var A3 = {...A1};  // Spread Syntax
JSON.parse(JSON.stringify(obj))
// 手动递归
```

## 柯里化

```
const createCurry = (fn, ...args) => {
    let all = args || [];
    let length = fn.length;

    return (...rest) => {
        let _allArgs = all.slice(0);
        _allArgs.push(...rest);
        if (rest.length > 0 || _allArgs.length < length) {
            // 调用时参数不为空或存储的参数不满足原始函数参数数量时，返回curry函数
            return createCurry.call(this, fn, ..._allArgs);
        } else {
            // 调用参数为空(),且参数数量满足时，触发执行
            return fn.apply(this, _allArgs);
        }
    }
}
```

## CDN

https://www.zhihu.com/question/36514327

区域负载均衡设备会为用户选择一台合适的缓存服务器提供服务，选择的依据包括：根据用户 IP 地址，判断哪一台服务器距用户最近；根据用户所请求的 URL 中携带的内容名称，判断哪一台服务器上有用户所需内容；查询各个服务器当前的负载情况，判断哪一台服务器尚有服务能力。基于以上这些条件的综合分析之后，区域负载均衡设备会向全局负载均衡设备返回一台缓存服务器的 IP 地址。

## react hook

- 让 ui 和逻辑分开，利于逻辑服用
- 可以让函数式组件使用 state
- 方便解除副作用

## HTTP2

- https://http2-explained.haxx.se/zh/part5
- https://sookocheff.com/post/networking/how-does-http-2-work/
- https://www.upwork.com/resources/the-http-2-protocol-its-pros-cons-and-how-to-start-using-it

## 前端抓包

- Fiddler https://www.telerik.com/fiddler
- whistle
- Charles https://www.charlesproxy.com/
- Wireshark

## Vue 与 React 的区别

React 原理 https://react.iamkasong.com/

## Vue 3.0

## 广州地铁

- 地铁数据 https://webapi.amap.com/subway/data/4401_drw_guangzhou.json
- 绘图方法
- svg 动画

- https://sspai.com/post/38934
- https://www.zhihu.com/question/45957865

## 未来目标

- 打包新思路 Vite
- React 原理
- 低代码平台
- 优化大规模项目迭代
- three.js 或 webGL 方向
- 机器学习
- 区块链
