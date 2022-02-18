---
path: '/transformation-matrix'
date: '2022-02-18T18:06:52.968Z'
title: '浅谈变换矩阵，以及在前端的应用'
tags: ['coding', 'WebGL']
---

$$
\begin{bmatrix}
x & y
\end{bmatrix}
\begin{bmatrix}
a & c \\
b & d
\end{bmatrix}
$$

## 矩阵乘法

首先复习一下线性代数，矩阵相乘，结果如下 ↓

$$
\begin{bmatrix}
ax+by & cx+dy
\end{bmatrix}
$$

用文字大概可以描述为 A 的第 `n` 行和 B 的第 `m` 列运算（相乘再相加）得出结果矩阵的 `(n,m)` 的值。

感觉也可以描述为一个值与自己同一行的值有一定关系，最后将这些关系映射成新的值。看不懂的话还是先看教科书吧，我也不懂描述数学 🤣，顺便推一个知乎链接：[矩阵乘法的本质是什么？](https://www.zhihu.com/question/21351965)

## 缩放矩阵

在明白矩阵乘法的基础上，可以尝试从结果反推出矩阵。

假设$(x,y)$是一个点的坐标，要以$(0,0)$为中心缩放这个点，自然是$(x_sx,y_sy)$，要得出这个结果，我们改一下上面的例子就能得出：

$$
\begin{bmatrix}
x & y
\end{bmatrix}
\begin{bmatrix}
x_s & 0 \\
0 & y_s
\end{bmatrix}
$$

## 平移矩阵

要平移这个点自然是$(x+x_t,y+y_t)$，但是只以上面为基础是改不出来的，因为相加的另一项总与另一个轴有关，并不是一个常数，怎么办呢……

想不出来不如先看看下面这个式子：

$$
\begin{bmatrix}
x & y & o
\end{bmatrix}
\begin{bmatrix}
a & d & g \\
b & e & h \\
c & f & i \\
\end{bmatrix}
$$

结果是$(ax+by+oc,dx+ey+fo,go+ho+io)$，当 o 是 1 的时候，就是$(ax+by+c,dx+ey+f,g+h+i)$不就每一项都能加个常量了。所以加常量的矩阵长这样：

$$
\begin{bmatrix}
x & y & 1
\end{bmatrix}
\begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
x_t & y_t & 1 \\
\end{bmatrix}
$$

为了处理更方便可以把缩放的矩阵也扩展为 3×3 矩阵：

$$
\begin{bmatrix}
x & y & 1
\end{bmatrix}
\begin{bmatrix}
x_s & 0 & 0 \\
0 & y_s & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

## 旋转矩阵

旋转比上面两种转换要难一点，首先复习一下**两角和**公式：

$$
sin(α+β)=sinαcosβ+cosαsinβ \\
cos(α+β)=cosαcosβ-sinαsinβ
$$

再借**极坐标**转换一下：

$$
x=rcosα \\
y=rsinα \\
x_r=rcos(α+β)=rcosαcosβ-rsinαsinβ=xcosβ-ysinβ \\
y_r=rsin(α+β)=rsinαcosβ+rcosαsinβ=xsinβ+ycosβ
$$

这不就是上面熟悉的形式，立即造个矩阵处理旋转：

$$
\begin{bmatrix}
x & y & 1
\end{bmatrix}
\begin{bmatrix}
cosβ & sinβ & 0 \\
-sinβ & cosβ & 0 \\
0 & 0 & 1 \\
\end{bmatrix}
$$

## 约定

$$
\begin{bmatrix}
1 & 0 & x_t \\
0 & 1 & y_t \\
0 & 0 & 1 \\
\end{bmatrix}
\begin{bmatrix}
x_s & 0 & 0 \\
0 & y_s & 0 \\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
cosβ & -sinβ & 0 \\
sinβ & cosβ & 0 \\
0 & 0 & 1 \\
\end{bmatrix}
\begin{bmatrix}
x \\
y \\
1
\end{bmatrix}
$$

很多文章大家都把 xyz 写成 3 行而不是 3 列，而且是最后乘 xyz 的，只是我一开始觉得横着写比较好理解就那么整了，有点误导人，所以这里补一下约定的写法，不然大家看到这里的矩阵跟其他地方看到的不一样可能会感到疑惑。

## 实战

虽然上面只是说明了某一个点的变换，但是一个图形或图像就是点的集合，对这些点都应用相同的矩阵就能对图片进行变换。

最简单的矩阵变换实战就藏在 CSS 里，就是那个 `transform` 的 `matrix`，是个处理 2D 图像的矩阵。

### 2D

`matrix` 的取值有一点点奇葩，只有 6 个参数，我们需要把 `matrix` 的 6 个参数按下面位置填入矩阵，不过也确实，最后一行没有必要修改。

$$
matrix(a,b,c,d,e,f) \\
\begin{bmatrix}
a & c & e \\
b & d & f \\
0 & 0 & 1
\end{bmatrix}
$$

例如默认的矩阵就是 `a=d=1`，也就是 `transform: matrix(1, 0, 0, 1, 0, 0);`。

对于多次平移、缩放、旋转的组合操作，可以将这些操作矩阵都相乘再与 xy 求值。

例如“放大 3 倍”、“下移 45”、“右移 15”、“旋转 30°”就是：

$$
\begin{bmatrix}
3 & 0 & 0 \\
0 & 3 & 0 \\
0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
1 & 0 & 15 \\
0 & 1 & 45 \\
0 & 0 & 1 \\
\end{bmatrix}
\begin{bmatrix}
cos(\frac{π}{6}) & -sin(\frac{π}{6}) & 0 \\
sin(\frac{π}{6}) & cos(\frac{π}{6}) & 0 \\
0 & 0 & 1 \\
\end{bmatrix}
$$

算出来大概是这样（注意矩阵乘法不符合交换律，所以顺序改变得出的结果是不同的）：

$$
\begin{pmatrix}2.598075&-1.5&45\\ 1.5&2.598075&135\\ 0&0&1\end{pmatrix}
$$

也就是 `matrix(2.6,1.5,-1.5,2.6,45,135)`，可以看出还是有一定规律的（除非用了 skew）。

### 3D

虽然上面并没有提到 3D 的变换矩阵，但是在 2D 基础上理解并不难，尤其是平移和缩放：

$$
\begin{bmatrix}
1 & 0 & 0 & x_t \\
0 & 1 & 0 & y_t \\
0 & 0 & 1 & z_t \\
0 & 0 & 0 & 1 \\
\end{bmatrix}
\begin{bmatrix}
x_s & 0 & 0 & 0 \\
0 & y_s & 0 & 0 \\
0 & 0 & z_s & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

旋转是依然复杂，绕 3 个轴的旋转需要使用 3 个矩阵处理（下面的 s 和 c 代表 sin 和 cos）：

$$
\begin{bmatrix}
c & -s & 0 & 0 \\
s & c & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
c & 0 & s & 0 \\
0 & 1 & 0 & 0 \\
-s & 0 & c & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
\begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & c & -s & 0 \\
0 & s & c & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

第一个矩阵十分熟悉，其实就是 2D 多一个维度，可以说 2D 的旋转其实就是绕 Z 轴旋转，第三个 X 相关的数据是不变的，是绕 X 轴旋转。第二个 Y 相关的数据不变，就是绕 Y 轴旋转，不过需要注意绕 Y 旋转的 sin 正负有点不同。

回到 CSS 的 `matrix3d`，它的参数是完整的 4×4 矩阵，计算方式跟 2D 是一样的，就不再赘述了：

$$
matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4) \\
\begin{bmatrix}
a1&a2&a3&a4 \\
b1&b2&b3&b4 \\
c1&c2&c3&c4 \\
d1&d2&d3&d4
\end{bmatrix}
$$

都拓展到 3D 了，那就不得不说 WebGL 了！

## WebGL

其实很久之前就知道 transform 的 matrix 是这个原理，但是现在要研究 WebGL 才算是顺道把这个原理弄得比较明白。

相对于 CSS 的 transform，转换的是元素的“图像”，WebGL 就真的是纯正的对一大堆**点**进行转换。

```
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 v_color;

void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the color to the fragment shader.
  v_color = a_color;
}
```

在一个 vertex shader 里，所有玄机都可以藏在 `u_matrix` 里，包括模型移动、转向，甚至摄像机参数，都可以通过矩阵处理，例如[这里](https://WebGLfundamentals.org/WebGL/lessons/WebGL-3d-perspective.html)的透视投影矩阵：

$$
\begin{bmatrix}
\frac{f}{aspect} & 0 & 0 & 0 \\
0 & f & 0 & 0 \\
0 & 0 & (near + far)\times rangeInv & -1 \\
0 & 0 & near\times far\times rangeInv\times 2 & 0
\end{bmatrix}
$$

[这里](https://WebGLfundamentals.org/WebGL/lessons/WebGL-3d-camera.html)还有把移动相机的逆矩阵应用到物体造成移动相机效果的操作，不过当然我现在还有一部分不能理解，以后看懂了再展开说吧 🤣

最近看计算机图形相关的资料又找到了学生时代觉得数学十分神奇的感觉，希望以后能慢慢看懂更多算法，先挖个坑，以后一定会写的（鸽子）！
