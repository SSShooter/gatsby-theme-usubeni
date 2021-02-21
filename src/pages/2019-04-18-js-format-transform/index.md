---
path: '/js-format-transform'
date: '2019-04-18T14:47:01.153Z'
title: '有趣的 JavaScript 格式转换'
tags: ['coding']
---

之前做文件上传和 canvas 修图时接触到几个格式，这里打算整理一下他们的关系

## Blob

```html
<input type="file" id="avatar" name="avatar" accept="image/png, image/jpeg" />
```

使用 input 获取文件时，你拿到的就是 `file` 对象，而 `file` 继承于 `blob`，所以直接讲比较陌生的 blob 吧。

BLOB (binary large object)，二进制大对象，是一个可以存储二进制文件的“容器”。

### Blob 有什么用

使用 Blob 可以让你在浏览器生成一个**临时文件**，使用 `URL.createObjectURL()` 获取他的链接，你就能像服务器文件一样使用他。

```javascript
let temp = new Blob(['hello fantasy'])
URL.createObjectURL(temp)
// 返回 "blob:https://ssshooter.com/1bf84bba-b53a-4155-8348-33a487e8ab7e"
```

返回的 url 前面是主机，后面是一个唯一识别码。

在创建这个临时文件后，只要不关闭当前页面，这个文件就会一直存在于内存，你需要主动运行 `URL.revokeObjectURL(url)` 删除引用。

### 从 Blob 中提取数据

在控制台打出 blob 你根本不知道里面是啥，那么怎么读取 blob 呢？

**借助 FileReader，你可以把 Blob 读取为 Buffer。**

> FileReader 对象允许 Web 应用程序异步读取存储在用户计算机上的文件（或原始数据缓冲区）的内容，使用 File 或 Blob 对象指定要读取的文件或数据。

```javascript
var reader = new FileReader()
reader.addEventListener('loadend', function() {
  // reader.result 包含转化为类型数组的blob
})
reader.readAsArrayBuffer(blob)
```

## ArrayBuffer

经过 FileReader 的读取，你能看到计算机储存数据的本质 —— 二进制数据。

### ArrayBuffer 的编辑

ArrayBuffer 类似数组，每一格放入 1Byte（8bit）数据，也就是八位的 0 或 1，所以换成十进制一格最大是 255.

例如：

![](newbuffer.png)

**ArrayBuffer 不能直接操作**，而是要通过类型数组对象（下面列出来的）或 DataView 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

- Int8Array：8 位有符号整数，长度 1 个字节，溢出处理为 数值%（取模）255。
- Uint8Array：8 位无符号整数，长度 1 个字节。
- Uint8ClampedArray：8 位无符号整数，长度 1 个字节，溢出处理为 255（最大值）。
- Int16Array：16 位有符号整数，长度 2 个字节。
- Uint16Array：16 位无符号整数，长度 2 个字节。
- Int32Array：32 位有符号整数，长度 4 个字节。
- Uint32Array：32 位无符号整数，长度 4 个字节。
- Float32Array：32 位浮点数，长度 4 个字节。
- Float64Array：64 位浮点数，长度 8 个字节。

对应视图的转换还很神奇的，ArrayBuffer 是一个格子 8 位，也就是跟 xx8Array 是一样的，自然不用转换，而 16 之后的都是把每几个格子合成一个。

```javascript
// 创建 buffer
ab = new ArrayBuffer(4)
// 创建视图
a = new Uint8Array(ab)
// 通过视图操作 buffer
a[0] = 2
a[1] = 25
a[2] = 31
a[2] = 233
```

打印 ab 会输出：

![](buffer.png)

为了方便理解他们如何转换，我把他转为 2 进制：

```javascript
// Int16Array
;['1100100000010', '11101001']
// Int32Array
;['111010010001100100000010']
// Uint8Array
;['10', '11001', '11101001', '0']
```

可能还没能看出来？那再在前面补 0：

```javascript
// Int16Array
;['0001100100000010', '0000000011101001']
// Int32Array
;['00000000111010010001100100000010']
// Uint8Array
;['00000010', '00011001', '11101001', '00000000']
```

这就很明显能看出：要转换就要在分组之后把同一组数据**从右到左**拼接。

不过我自觉一般不太会用到这么细致的 bit 操作（

### canvas 与 buffer

另外，canvas 可以通过 ctx.createImageData() 得到 `ImageData`。

`ImageData.data` 就是一个 `Uint8ClampedArray`，里面顺序放着图片每一个像素的 rgba 值。你可以对这个 `Uint8ClampedArray` 进行一系列操作，再用 `canvas.toBlob` 这个 buffer 变回 Blob，就完成了图片编辑的操作。

通过这个操作，再结合一些卷积核相关知识，就能完成类似这个[卷积核图片修改器](https://github.com/ssshooter/canvas-img-process)的功能。

## Data Url

Data Url 是一个前缀为 `data:` 的**协议**，你可以借助这个协议在文档中**嵌入一些小文件**（最常见就是内联图片了），数据格式如下：

```javascript
data:[<mediatype>][;base64],<data>
```

mediatype 填入[MIME 类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)，MIME 也用于服务器返回数据时指定数据类型；base64 是一种编码方式；后面接着就是数据本体。

几个例子：

- 普通文字：`data:,Hello%2C%20World!`
- base64 处理的文字：`data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D`
- html 文档：`data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E`
- 执行 script 的 html 文档：`data:text/html,<script>alert('hi');</script>`

### base64

上面提到的 base64 不算是一种加密算法，它只是简单地将每 3 个 8bit 字符转换为 4 个 6Bit 字符（base64 只有 2^6 = 64 种字符，因此得名），这样保证了传输中必定使用 ASCII 中可见字符，不会出奇怪的空白字符或是功能性标志 。

由于是 3 个字符变 4 个，那么很明显了，base64 编码后，编码对象的**体积会变成原来的 4/3 倍**。

特别要注意的是如果 bit 数不能被 3 整除，需要在末尾添加 1 或 2 个 byte（8 或 16bit），**并且末尾的 0 不使用 A 而使用 =**，这就是为什么 base64 有的编码结果后面会有一或两个等号。

喜闻乐见的举例时间：

前置知识点：[utf8 与 unicode 的关系](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)

你可以使用 charCodeAt() 获取一个字符的 unicode 编码（0 到 65535 之间的整数），但是 unicode 只是一个码表，并不是一个具体的编码方式，utf8 才是。所以你拿到的英文字母编码前后一样的，但是汉字（等字符）就不同了。

为了直接得到汉字的 utf8 码，使用 `TextEncoder`（其实还可以选择使用 `encodeURIComponent` 处理汉字，但是英文又不能正常转换了）。

下面用 JavaScript 简单写个 base64 转换流程：

```javascript
var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
Array.from(new TextEncoder().encode('碧蓝幻想'))
  .map(val => val.toString(2).padStart(8, 0)) // 转二进制，补充到八位
  .join('')
  .replace(/([10]{6})/g, '$1,') // 每六位插个逗号用于拆分
  .split(',') // 拆分为每 6 位一组
  .map(val => parseInt(val.padEnd(6, 0), 2)) // 补充后面的 0（但是没有补够）
  .map(val => b64[val])
  .join('')
```

**结果基本是对的，但是后面的 `=` 还是用了普通的 `A` 而且位数没有加够，所以上面转换出来的不是标准 base64，仅供参考**

[base64 算法参考](http://fm4dd.com/programming/base64/base64_algorithm.htm)

PS：不包含汉字的话可以直接用浏览器的 btoa 和 atob，a 和 b 分别代表 ASCII 和二进制。

## blob url 与 Data Url 对比

blob url

- 不需要做编码，省了运算资源
- 大小也不会改变
- 在不使用时需要手动删除引用
- 关闭页面链接自动废弃

Data Url

- 需要编码，且体积变大 1.3 倍
- 容易删除
- 链接不变，可以保存下来以后使用

## 参考

- [mdn Blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)
- [mdn FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)
- [mdn HTMLCanvasElement](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement)
- [阮一峰 ES6 arraybuffer](http://es6.ruanyifeng.com/#docs/arraybuffer)
- [进阶 FileAPI 实现标准](https://www.w3.org/TR/2018/WD-FileAPI-20181106/#readOperation)
- [javascript info - blob](https://javascript.info/blob)

## 附录

### N 进制数的表示方法

```javascript
// 10
var a = 10
// 8
var b = 0o1234567
// 或直接在前面加0，如果后面数字都小于8就自动变成8进制
var c = 01234567
// 2
var d = 0b1010101110101
// 16
var e = 0xe87a90
```

### N 进制数转 10 进制

```javascript
parseInt(0o1234567, 8)
parseInt(0b1010101110101, 2)
parseInt(0xe87a90, 16)
```

### 10 进制数转 N 进制

```javascript
;(123456).toString(2)
;(123456).toString(8)
;(123456).toString(16)
```
