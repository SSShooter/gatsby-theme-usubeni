---
path: '/webgl-intro'
date: '2022-10-18T11:31:28.945Z'
title: 'webgl 学习指引'
tags: ['webGL']
---

webGL 发源于 openGL，知识点相似，只是 openGL 用于桌面应用程序渲染，webGL 专供浏览器，有 webGL 和 webGL2 两个版本，实现代码有一定差别。

使用 webGL 必须明白 shader 如何使用。shader 常被翻译为着色器，所以它的功能自然是着色（废话）。shader 分为 Vertex shader 和 Fragment shader（Pixel Shader）两种，Vertex shader 负责定位三角形和主要的颜色，Fragment shader 负责实际给三角形着色。

但是上面的两种 shader 并不是用 JavaScript 编写，而是使用 GLSL。GLSL 全名 Graphics Library Shader Language，是一种类 C 语言。Vertex shader 的侧重点在于点的位置变换，Fragment shader 的侧重点在于位置与颜色的映射。编写 shader 大概是整个步骤最难的一步。

处理 Vertex shader 必须熟悉矩阵变换，即使图形看起来是 3D，实际上还是一堆 2D 的点摆成 3D 的模样，反转、缩放、计算反射光线等操作都依赖于线性代数知识，[GAMES101-现代计算机图形学入门](https://www.bilibili.com/video/BV1X7411F744/)是一个不错的教程。处理 Fragment shader 的关键是明白点的位置和颜色映射关系，两种 shader 通过 varying 变量串通；Fragment shader 本身有很强的绘图能力，我们可以看 [The Book of Shaders](https://thebookofshaders.com/) 深入学习。

[前端圣经 MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)上明明白白摆着一大堆接口。可以说 webGL 的接口设计还是有点冗长，想看到一个简单的三角形如何用 webGL 画出来可以直接点这个[链接](https://webglfundamentals.org/webgl/lessons/webgl-how-it-works.html)看看代码。

webGL 整个知识体系比较好的教程是 [WebGL Fundamentals](https://webglfundamentals.org/)，因为 1 和 2 的接口不一样，所以也直接多开了一个 [webGL2](https://webgl2fundamentals.org/) 的教程。至于现在要学 1 还是 2，个人认为都可以，虽然代码有微小差别，但思路基本一样，更何况实际生产种很少直接对接 webGL api，明白原理基本足够。

在理解 shader 写法之后想在 JavaScript 和 webGL 的数据交流中偷偷懒的话可以使用 [twgl](https://github.com/greggman/twgl.js) 或 [regl](https://github.com/regl-project/regl)。

甚至，你不想直接接触 webGL api 的话，可以直接使用现在很热门的 webGL 库 [three.js](https://threejs.org/)。当然包装到这层了，一些底层概念被淡化，只要放模型、打光就能轻松展示一个简单的场景。

最后放一下 Khronos 的 [webgl reference card](https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf)，可以用于速查 GLSL 的一些基础问题。

最后的最后总结一下参考链接：

- [WebGL Fundamentals](https://webglfundamentals.org/)
- [The Book of Shaders](https://thebookofshaders.com/)
- [WebGL API](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
- [webgl reference card](https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf)