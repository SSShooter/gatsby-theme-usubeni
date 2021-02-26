---
path: '/array-unique-performance'
date: '2021-02-26T15:04:46.996Z'
title: 'JavaScript 数组去重的 4 种方法及性能比较'
tags: ['coding', '性能比较']
---

## 说明

简单测试下 JavaScript 4 种去重算法的效率。

1. 使用哈希表记录是否重复
2. 用内建 indexOf 函数判断是否重复
3. 组合内建 filter 和内建 indexOf
4. 全新的 new Set()

## 代码

```javascript
var arrayLength = 500
var numberRange = 50
var array = genRandomNumberArray()

function genRandomNumberArray() {
  return Array(arrayLength)
    .fill()
    .map(item => Math.ceil(Math.random() * numberRange))
}

function loop(uniqueFunc, times) {
  let i = 0
  times = times || 500
  while (i < times) {
    uniqueFunc(array)
    i++
  }
}
// 1. 哈希表
function uniqueArray1(arr) {
  var map = {}
  var a = []
  for (let i = 0; i < arr.length; i++) {
    let v = arr[i]
    if (map[v]) continue
    else {
      map[v] = 1
      a.push(arr[i])
    }
  }
  return a
}
// 2. indexOf
function uniqueArray2(arr) {
  var a = []
  for (var i = 0; i < arr.length; i++)
    if (a.indexOf(arr[i]) === -1 && arr[i] !== '') a.push(arr[i])
  return a
}
// 3. indexOf + filter
function uniqueArray3(a) {
  return a.filter(function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
  })
}
// 4. Set
function uniqueArray4(a) {
  return [...new Set(a)]
}

function benchmark() {
  performance.clearMeasures()

  performance.mark('A')
  loop(uniqueArray1)
  performance.mark('B')
  performance.measure('hash map', 'A', 'B')

  performance.mark('A')
  loop(uniqueArray2)
  performance.mark('B')
  performance.measure('indexof + array', 'A', 'B')

  performance.mark('A')
  loop(uniqueArray3)
  performance.mark('B')
  performance.measure('indexof + filter', 'A', 'B')

  performance.mark('A')
  loop(uniqueArray4)
  performance.mark('B')
  performance.measure('new Set', 'A', 'B')

  performance.getEntriesByType('measure').map(item => {
    console.log(item.name, item.duration)
  })
}

benchmark()
```

## 结论

### chrome

可以直接在你的浏览器运行上面的代码，即可得到一下信息：

```
使用 Chrome Version 88.0.4324.182 (Official Build) (x86_64) 测试

hash map 1.9149999716319144
indexof + array 16.110000025946647
indexof + filter 27.620000008028
new Set 6.110000016633421
```

数字代表运行时间，所以对于浏览器，结论是：

哈希表 > Set >> indexof+array >> indexof+filter

indexof 的两种慢得符合直觉，但是 Set 这么快有点意外，但是更意外的还在下面。

### nodejs

（注意上面给出的代码不能直接在 node 运行，需引用 `perf_hooks`，而且 node 和浏览器的 performance 接口存在差异，需要稍微修改一下）

```
使用 node v14.15.0 测试

hash map 7.009304
indexof + array 21.694114
indexof + filter 27.925928
new Set 6.474348
```

哈希表 = Set >> indexof+array > indexof+filter

为什么 node 的哈希表这么慢啊 😂

## 参考

- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [stackoverflow Get all unique values in a JavaScript array (remove duplicates)](https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates)