---
path: '/js-to-glsl'
date: '2022-01-21T17:57:55.878Z'
title: '数据怎么从 JavaScript 送到 GLSL'
tags: ['coding', 'webGL']
---

本文用例来自 mdn webGL 教程的 [sample5](https://github.com/mdn/webgl-examples/tree/gh-pages/tutorial/sample5) 和 [sample6](https://github.com/mdn/webgl-examples/tree/gh-pages/tutorial/sample6)

数据怎么从 JavaScript 送到 GLSL，是一个十分简单，但是初见又有点绕的问题。解析这个问题需要把传入的数据分为 attribute 和 uniform 两个类型。

先非常简单地提一下两种类型的区别：

- attribute 是只能 vertex shader 接收的数据，运行每个点都会传入不同的数据
- uniform 是从外部传入的固定数据，每个点都是一样的

另外还有 varying，可以把数据从 vertex shader 输出到 fragment shader，具体区别和举例再开别的坑，总之本文先聚焦到如何从 JavaScript 传值到 GLSL，下面先讲 attribute 的传入方式。

## 传入 attribute

```javascript
// 首先要在 JavaScript 里存在这个数据（废话）
const positions = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0]
// 创建一个 buffer，返回 buffer id
const positionBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
```

`bindBuffer` 会将一个 buffer 绑定到一个 target，也就是 `gl.ARRAY_BUFFER`，它专门用于储存 vertex shader 的 attribute。

为了更容易理解，可以把它当成一个激活的标志，同一个 target 仅能有一个在激活状态。`bindBuffer` 就意味着当前的 `ARRAY_BUFFER` 就是刚 bind 的那个 buffer，然后就可以使用 `bufferData` 往当前激活的 buffer 写入数据（复制到显存）。

至此，成功将 JavaScript 的数据写入到显存，但仍有问题，shader 里的变量如何关联到这段数据？

```javascript
const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
  },
}
```

通过 `getAttribLocation` 可以获得一个 shader 程序的某个 attribute 的地址，当然 uniform 同理。

```javascript
gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
// 把 buffer 真正放到 aVertexPosition
gl.vertexAttribPointer(
  programInfo.attribLocations.vertexPosition,
  numComponents,
  type,
  normalize,
  stride, // 每组长度
  offset // 每组偏移
)
gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
```

接着就跟上面思路差不多，通过 `bindBuffer` 把 `buffers.position` 设为当前激活 buffer。然后使用 `vertexAttribPointer` 把当前激活的 `gl.ARRAY_BUFFER` 塞到上一步获取的 attribute 地址。最后的 `enableVertexAttribArray` 用于启用某个地址的 attribute，因为默认所有 attribute 都是未启用的，都需要通过这个接口启用，另外启用不必一定放在最后，拿到地址就能直接启用。

最后简单总结一下 attribute 如何从 JavaScript 传到 vertex shader：

- `createBuffer` 创建 buffer
- `bindBuffer` 把 buffer 地址设置为当前激活的 `ARRAY_BUFFER`
- `bufferData` 向当前激活 buffer 写入数据（通过 JavaScript ArrayBuffer）
- `getAttribLocation` 获取某个需要注入数据的 attribute 的地址
- 因为运行过程中容易激活其他 buffer，所以在赋值之前重新激活特定 buffer
- `vertexAttribPointer` 把当前激活的 `ARRAY_BUFFER` 注入某个 attribute 地址
- `enableVertexAttribArray` 启用 attribute

其实最绕的就是 `bindBuffer`，只要明白这是一个“激活”的动作，那么一切就自然简单明了。

`bindBuffer` 的 target 还可以传入 `ELEMENT_ARRAY_BUFFER`，设置当前激活的 indexBuffer，这种数据用于规定**点如何组成面**。

## 传入 uniform

至于传入 uniform，就简单得多了，在这个例子中，关键就一个 `uniformMatrix[234]fv`，向 vertex shader 传入 mat4 可以这么写：

```javascript
gl.uniformMatrix4fv(
  programInfo.uniformLocations.projectionMatrix,
  false,
  projectionMatrix
)
```

也就是传入 `Float32Array` 到 `getUniformLocation` 得到的地址即可。

类似的方法还有 `uniform[1234][fi][v]` 这么一堆，都用于向 shader 传入其他类型的 uniform 数据。

## 特殊的 sampler

最后是初见最懵逼的 sampler2D 传值，仅看代码是一头雾水：

```javascript
const texture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture)
gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image)

gl.activeTexture(gl.TEXTURE0)
gl.bindTexture(gl.TEXTURE_2D, texture)
gl.uniform1i(programInfo.uniformLocations.uSampler, 0)
```

为什么又 active 又 bind 的呢？我们首先要理解这个过程中涉及到两个名词：

- texture unit，用于处理 texture 映射，GPU 至少要有 8 个 texture unit，当然正常会有更多，可以通过 `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)` 获取具体数量
- texture object，储存 texture 数据的对象，跟 buffer object 类似，但更为复杂

下面再分解动作解析上面的代码：

```javascript
const texture = gl.createTexture()
gl.bindTexture(gl.TEXTURE_2D, texture)
gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image)
```

这三步和 attribute 类似，创建 texture object，激活，然后塞数据。

```javascript
gl.activeTexture(gl.TEXTURE0)
gl.bindTexture(gl.TEXTURE_2D, texture)
```

`activeTexture` 指的是激活 texture unit，设为 `gl.TEXTURE0` 当前激活的 texture unit 就是 0。然后再 `bindTexture` 可以让当前 texture object 绑定到当前 texture unit（这里我无法理解，为什么激活 object 会附带绑定功能，求懂的大佬们补充）。

```javascript
gl.uniform1i(programInfo.uniformLocations.uSampler, 0)
// 然后就能使用 uniform sampler2D uSampler
```

虽然一直在说 sampler2D，但其实变量类型归根到底还是 uniform，所以最后还是通过 `uniform1i` 传入到 shader。特殊的是传给他的值是一个 texture unit 地址，官方规范说明，加载 sampler 仅能用 glUniform1i 和 glUniform1iv。

```
glUniform1i and glUniform1iv are the only two functions that may be used to load uniform variables defined as sampler types. Loading samplers with any other function will result in a GL_INVALID_OPERATION error.
```

## 参考资料

- [WebGLRenderingContext - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext)
- [5.3 - A Primer on Buffer Objects — LearnWebGL](http://learnwebgl.brown37.net/rendering/buffer_object_primer.html)
- [10.4 - Texture Mapping Using Images — LearnWebGL](http://learnwebgl.brown37.net/10_surface_properties/texture_mapping_images.html)
