---
path: '/iterate-performance'
date: '2020-06-09T14:48:53.203Z'
title: 'JavaScript 对象迭代方法与性能比较'
tags: ['coding']
---

原文地址：[Iterating Over JavaScript Object Entries and their Performance - 5 Techniques](https://hackernoon.com/5-techniques-to-iterate-over-javascript-object-entries-and-their-performance-6602dcb708a8)

## Object.entries

返回对象所有**可枚举**的键值对，**不会**追寻原型链上的 key

```javascript
let obj = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3',
}

Object.entries(obj).forEach(entry => {
  let key = entry[0]
  let value = entry[1]
  // entry 会是这样 ["key1", "value1"]
})
```

## Object.keys

返回对象所有**可枚举**的键

```javascript
let obj = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3',
}

Object.keys(obj).forEach(key => {
  let value = obj[key]
})
```

## Object.values

返回对象所有**可枚举**的值

```javascript
let obj = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3',
}

Object.values(obj).forEach(value => {
  // 只能使用 value
})
```

## for…in loop

迭代**可枚举**属性，会顺着原型链找下去

```javascript
let obj = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3',
}

for (const key in obj) {
  let value = obj[key]

  if (obj.hasOwnProperty(key)) {
    // 本身的
  } else {
    // 来自原型链的
  }
}
```

## Object.getOwnPropertyNames

返回对象所有（**包括**不可枚举）的键（原文说会找原型链是错的）

```javascript
let obj = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3',
}

Object.getOwnPropertyNames(obj).forEach(key => {
  let value = obj[key]
})
```

## 性能比较

下面的代码用上面的几种方法遍历有 1000000 个属性的对象，循环 10 次

```javascript
const { PerformanceObserver, performance } = require('perf_hooks')

let objectSize = 1000000
let iterations = 10

console.log(
  'Starting performance test with %d object size and %d iterations',
  objectSize,
  iterations
)

let values = {
  ENTRIES: 0,
  KEYS: 0,
  VALUES: 0,
  FORIN: 0,
  GETOWP: 0,
}

const obs = new PerformanceObserver(items => {
  let entry = items.getEntries()[0]
  console.log(entry.name, entry.duration)
  values[entry.name] += entry.duration
  performance.clearMarks()
})
obs.observe({ entryTypes: ['measure'] })

function generateObject() {
  let obj = {}
  for (let i = 0; i < objectSize; i++) {
    obj['key' + Math.random()] = 'val' + Math.random()
  }
  return obj
}

for (let i = 0; i < iterations; i++) {
  let obj = generateObject()

  //Object.entries
  performance.mark('A')
  Object.entries(obj).forEach(entry => {
    let key = entry[0]
    let value = entry[1]
  })
  performance.mark('B')
  performance.measure('ENTRIES', 'A', 'B')

  //Object.Keys
  performance.mark('A')
  Object.keys(obj).forEach(key => {
    let value = obj[key]
  })
  performance.mark('B')
  performance.measure('KEYS', 'A', 'B')

  //Object.Values
  performance.mark('A')
  Object.values(obj).forEach(value => {})
  performance.mark('B')
  performance.measure('VALUES', 'A', 'B')

  //For In
  performance.mark('A')
  for (const key in obj) {
    let value = obj[key]
  }
  performance.mark('B')
  performance.measure('FORIN', 'A', 'B')

  //Object.getOwnPropertyNames
  performance.mark('A')
  Object.getOwnPropertyNames(obj).forEach(key => {
    let value = obj[key]
  })
  performance.mark('B')
  performance.measure('GETOWP', 'A', 'B')
}

console.log(
  Object.entries(values).sort((a, b) => {
    return a[1] - b[1]
  })
)
```

下面的结果是我自己跑的，顺序的是指赋值的时候直接用 index，随机则是键值对都插入随机数，得到的性能排序是和作者一样的，也因为 node.js 和 chrome 都是 V8，所以这个应该也是代表在浏览器上的性能排序。

```javascript
// 顺序
;[
  ['FORIN', 4677.321499],
  ['KEYS', 4812.776572],
  ['GETOWP', 8610.906197],
  ['VALUES', 9914.674390999999],
  ['ENTRIES', 19338.083694],
]

// 随机
;[
  ['KEYS', 4502.579589],
  ['FORIN', 4678.013548000001],
  ['GETOWP', 8880.325031999999],
  ['VALUES', 10104.106962],
  ['ENTRIES', 17089.637588999998],
]
```

之前听说引擎会猜测下一个值让运行速度更快，看数据似乎没有太大影响。

也算是一点干货，快点来[原文](https://hackernoon.com/5-techniques-to-iterate-over-javascript-object-entries-and-their-performance-6602dcb708a8)给作者鼓鼓掌吧 👏
