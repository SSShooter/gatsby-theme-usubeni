---
path: '/computer-graphics'
date: '2022-01-15T16:21:25.935Z'
title: 'computer-graphics'
tags: ['tag']
released: false
---

GPU 优势：矢量计算，并行计算

mesh = material + geometry

点线面组成 geometry，注意正反面

material 包含 texture

UV 轴，为了避免和表示位置的 XY 混淆

texture mapping

material 也可以由 shader 实现

shader 是人类和显卡交流的比较直接的语言

渲染管线 mesh -> 屏幕显示

displacement

Vertex shader

Each time a shape is rendered, the vertex shader is run for each vertex in the shape. Its job is to transform the input vertex from its original coordinate system into the clip space coordinate system used by WebGL, in which each axis has a range from -1.0 to 1.0, regardless of aspect ratio, actual size, or any other factors.

Fragment shader

The fragment shader is called once for every pixel on each shape to be drawn, after the shape's vertices have been processed by the vertex shader. Its job is to determine the color of that pixel by figuring out which texel (that is, the pixel from within the shape's texture) to apply to the pixel, getting that texel's color, then applying the appropriate lighting to the color. The color is then returned to the WebGL layer by storing it in the special variable gl_FragColor. That color is then drawn to the screen in the correct position for the shape's corresponding pixel.

Attributes receive values from buffers. Each iteration of the vertex shader receives the next value from the buffer assigned to that attribute. Uniforms are similar to JavaScript global variables. They stay the same value for all iterations of a shader.

In WebGL objects are built using sets of vertices, each of which has a position and a color. By default, all other pixels' colors (and all its other attributes, including position) are computed using interpolation, automatically creating smooth gradients.


一个点一个色，可以用 varying 插值

一切在屏幕看到的东西都依赖 fragment shader

https://www.bilibili.com/video/BV1X7411F744/