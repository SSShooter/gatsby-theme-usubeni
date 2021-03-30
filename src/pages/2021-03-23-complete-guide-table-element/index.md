---
path: '/complete-guide-table-element'
date: '2021-03-29T23:28:46.976Z'
title: '关于 table 元素你要懂的全在这'
tags: ['coding', '翻译']
---

本文翻译自 [A Complete Guide to the Table Element](https://css-tricks.com/complete-guide-table-element)，省略了部分小节。因为本文写于 2013 年，部分信息已经过时，我也作了小部分调整。另外，在一些不好理解的地方添加了一点解释。

`<table>` 元素用于 HTML 表格数据展示，就像你在 Excel 里看到的那样。本质上，就是行和列。本文会告诉你如何和何时使用 `<table>`，以及你需要懂的关于他的所有东西。

## 简单例子

这是一个非常简单的表格数据 demo：

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 350px;"><iframe id="cp_embed_xkrGs" src="//codepen.io/anon/embed/xkrGs?height=350&amp;theme-id=1&amp;slug-hash=xkrGs&amp;default-tab=html,result" height="350" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed xkrGs" title="CodePen Embed xkrGs" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

这组数据的优点是，从水平方向你可以清楚看到一个人和他的相关信息，而垂直方向能看到某个数据的不同种类。

## 表头与表体

在简单例子中我们没有语义上表明第一行是表头。第一行不包含任何数据，只是表明列的 title，我们可以把它们放到 `<thead>` 元素（存在多行表头可以把多个 `<tr>` 放进去）。

代码和效果如下：

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 350px;"><iframe id="cp_embed_tzjid" src="//codepen.io/anon/embed/tzjid?height=350&amp;theme-id=1&amp;slug-hash=tzjid&amp;default-tab=html,result" height="350" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed tzjid" title="CodePen Embed tzjid" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

如果你使用了 `<thead>`，就不能直接把 `<tr>` 放到 `<table>`，而是将它们包裹在 `<thead>`、`<tbody>`、`<tfoot>` 中。例子里我们就把其他的行都放进了 `<tbody>`。

## 表脚

与 `<thead>` 和 `<tbody>` 相似，`<tfoot>` 包含的行是表的注脚。和 `<thead>` 一样在语义上表明这不是数据内容而是一些附加信息。

HTML5 **之前**，`<tfoot>` 只可以放在 `<thead>` 和 `<tbody>` **中间**！这很反人类，而在 HTML5 则相反，必须放在 `<tbody>` 后，符合人类习惯。

表脚可以用于超长表格中重复展示表头的内容，可以让你在浏览后面的数据时更方便地看到列的类型。

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 350px;"><iframe id="cp_embed_mIjil" src="//codepen.io/anon/embed/mIjil?height=350&amp;theme-id=1&amp;slug-hash=mIjil&amp;default-tab=html,result" height="350" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed mIjil" title="CodePen Embed mIjil" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

## 格子：td 和 th

表格里的每个格子总是 `<td>` 或 `<th>` 两个元素的其中之一，它们是作为一个表格格子的本质。`<th>` 代表 tabular headers，`<td>` 代表 tabular data。（本文后面提到的“格子”基本都是指这两个元素）

在例子中第一行全是头，后面的都是行数据：

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 350px;"><iframe id="cp_embed_npvAf" src="//codepen.io/anon/embed/npvAf?height=350&amp;theme-id=1&amp;slug-hash=npvAf&amp;default-tab=html,result" height="350" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed npvAf" title="CodePen Embed npvAf" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

`<th>` 不一定要放在 `<thead>` 里，它们简单地表示“头部信息”。你也可以把它用在每行的第一列，后面的例子会提到。

## 基本样式

大多表格用不同颜色和线条来区分表格的不同部分。例如常见的 border，默认所有格子都会和其他格子隔开 2px（user-agent stylesheet 的设定），就像这样：

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 350px;"><iframe id="cp_embed_GmsEc" src="//codepen.io/anon/embed/GmsEc?height=350&amp;theme-id=1&amp;slug-hash=GmsEc&amp;default-tab=css,result" height="350" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed GmsEc" title="CodePen Embed GmsEc" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

格子中间的间隙是 `<thead>` 和 `<tbody>` 自带的 border-spacing，这不是 margin，不会 collapse。你可以这么控制 border-spacing：

```css
table {
  border-spacing: 0.5rem;
}
```

不过更常见的是直接移除这个间隙：

```css
table {
  border-collapse: collapse;
}
```

加上 padding，border，让 `<th>` 元素左对齐，就做好了一个简单的带样式的表格：

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 350px;"><iframe id="cp_embed_kaErt" src="//codepen.io/anon/embed/kaErt?height=350&amp;theme-id=1&amp;slug-hash=kaErt&amp;default-tab=css,result" height="350" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed kaErt" title="CodePen Embed kaErt" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

## 连接格子

`<td>` 和 `<th>` 有两个重要的属性：`colspan`、`rowspan`。这两个属性接受大于等于 2 的正整数。如果一个 td 的 colspan 是 2，它仍是一个格子，但是会占水平两个格子的位置，rowspan 类似，占垂直两个格子的位置。

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 350px;"><iframe id="cp_embed_fixJg" src="//codepen.io/anon/embed/fixJg?height=350&amp;theme-id=1&amp;slug-hash=fixJg&amp;default-tab=html,result" height="350" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed fixJg" title="CodePen Embed fixJg" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

刚开始连接格子的时候你的脑子可能不太适应。colspan 相对简单，正常一个格子“权重”1，加上 colspan 之后就是 colspan 的值，把每行所有格子的“权重”加起来，每行都应该相等，否则，就会出现怪异的情况。（后面的格子会突出去）

Rowspan 也是一个道理，但是因为垂直的所以需要一点空间想象能力。设置了 rowspan 的格子垂直占 N 格，那么他下 N-1 行就等于自动加了一格。

确实有点迂回，但相信聪明的你一定能搞清楚的 😆

通常格子合并用在简单的表头合并：

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 350px;"><iframe id="cp_embed_AlxGt" src="//codepen.io/anon/embed/AlxGt?height=350&amp;theme-id=1&amp;slug-hash=AlxGt&amp;default-tab=html,result" height="350" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed AlxGt" title="CodePen Embed AlxGt" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

## 谈谈宽度

table 元素的宽度有点特别。如果你把一个个表格顺序放在一起，会像块级元素（如 `<div>`）一样换行，但是它们的宽度是自己的最小宽度。

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 450px;"><iframe id="cp_embed_JnLIt" src="//codepen.io/anon/embed/JnLIt?height=450&amp;theme-id=1&amp;slug-hash=JnLIt&amp;default-tab=result" height="450" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed JnLIt" title="CodePen Embed JnLIt" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

如果文本长度最长就 100px，那表格就是 100px 宽，如果文本长度大于它的容器，那么表格的宽度就是容器宽度，文本会自动换行。

然而如果文本设置了禁止换行（如 `white-space: nowrap;`），表格就开开心心地撑爆容器。另外，表格的格子肯定也是不换行的，所以格子太多也会让表格宽度大于容器。

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 450px;"><iframe id="cp_embed_ILrKi" src="//codepen.io/anon/embed/ILrKi?height=450&amp;theme-id=1&amp;slug-hash=ILrKi&amp;default-tab=result" height="450" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed ILrKi" title="CodePen Embed ILrKi" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

## 双轴表格

举例很简单，就是乘法表：

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 450px;"><iframe id="cp_embed_qJBpF" src="//codepen.io/anon/embed/qJBpF?height=450&amp;theme-id=1&amp;slug-hash=qJBpF&amp;default-tab=result" height="450" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed qJBpF" title="CodePen Embed qJBpF" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

这里没用 `<thead>` 是因为觉得水平的“头”也没比垂直的“头”更重要，只给水平的头加上会有点怪，所以就干脆不加了，都用 `<th>` 包裹就好。

## 什么时候用表格

基础讲完，是时候谈谈表格应该什么时候用了。最通常的建议是用于表格数据（就如本文开头所说）。“是不是要看起来像 Excel？”是一个不错的衡量标准。

什么适合表格展示？举些例子：计划、价格表、特性对比、记分板、职员表、财经数据、日历营养成分表，等。

## 什么时候不用表格

因为容易控制、有逻辑、可预测性、非碎片化（对标 float）等原因，table 在本文原文写成的时候还作为一种“布局”方式用在网页布局上（而不是单纯的展示表格），这整一节基本都是从无障碍（accessibility）的角度反对 table 用于页面布局。

但是十多年后的现在，随着 CSS 的进化，尤其是各大浏览器都兼容了 flexbox，未来还有 grid 布局，基本是不可能见到 table 页面布局了，所以就不翻译这一节了，不过本节无障碍（accessibility）相关的内容值得了解，有兴趣可以直达原文：https://css-tricks.com/complete-guide-table-element/#when-not-to-use-tables

## 让其他元素 table 化

CSS 属性可以让任何元素表现得像个 table 元素。你以 table 的结构组合他们，他们就会像 table 一样展示出来。这个做法需要谨慎使用。

不要用行内 CSS，这里只是为了方便理解所以这么写：

```html
<section style="display: table;">
  <header style="display: table-row;">
    <div style="display: table-cell;"></div>
    <div style="display: table-cell;"></div>
    <div style="display: table-cell;"></div>
  </header>
  <div style="display: table-row;">
    <div style="display: table-cell;"></div>
    <div style="display: table-cell;"></div>
    <div style="display: table-cell;"></div>
  </div>
</section>
```

通过 display 改变 table 行为的属性有这些：

```css
display: table                /* <table>     */
display: table-cell           /* <td>        */
display: table-row            /* <tr>        */
display: table-column         /* <col>       */
display: table-column-group   /* <colgroup>  */
display: table-footer-group   /* <tfoot>     */
display: table-header-group   /* <thead>     */
```

注意，没有代表 `<th>` 的属性，因为语义上和 `<td>` 差不多所以就没有另外整一个。

source order dependency

## table 相关元素

还有一些表单元素上面未提及，现在集中说说，你懂的，我们就用表格来做这件事：

| 元素         | 用途                                  |
| ------------ | ------------------------------------- |
| `<table>`    | table 本身                            |
| `<caption>`  | 说明文字，就像 figcaption 之于 figure |
| `<thead>`    | 表头                                  |
| `<tbody>`    | 表体                                  |
| `<tfoot>`    | 表脚                                  |
| `<tr>`       | 行（row）                             |
| `<th>`       | 放标题的格子                          |
| `<td>`       | 放数据的格子                          |
| `<col>`      | 列（无内容元素）                      |
| `<colgroup>` | 一组列                                |

译者补充：`<col>` 可能让你觉得不好理解，其实这个就是**概念上**的列，可用于归类多个列、批量调整几个列的样式，可以看看 [mdn](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col) 的例子。

## table 相关属性

除了 class ID 等通用属性，还有一些的 table 专用属性。以前的话会更多一些，不过因为 CSS 的完善，那些用于样式的属性就被弃用了。

| 属性     | 作用元素 | Found On What it does                                                                           |
| -------- | -------- | ----------------------------------------------------------------------------------------------- |
| colspan  | th, td   | 横向扩大格子                                                                                    |
| rowspan  | th, td   | 纵向扩大格子                                                                                    |
| span     | col      | 让 col 应用于多列                                                                               |
| headers  | td       | 空格分隔的字符串，关联格子相关的 `<th>` 元素的 ID                                               |
| scope    | th       | 可选 row、col、rowgroup、colgroup（默认）用于指定表头的“轴”，默认就是列的头，你可以设置为行的头 |
| sortable | table    | 表明表格可排序，因为缺乏实现而从标准中删除                                                      |

## 已弃用属性

略……既然弃用就忽略吧，有兴趣的朋友可以直达原文本节：https://css-tricks.com/complete-guide-table-element/#deprecated-attributes

## table 的层级

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/table-stack.png)

## table 实用 CSS

这些属性是 table 专属的，或者与 table 组合的效果是与众不同的。

**vertical-align**

对其格子里的内容，对格子元素异常好用，不过有意义的就三个值：top/bottom/middle

**white-space**

文字换行对宽度的影响，上面提过了

**border-collapse**

border 坍塌，可选 collapse 或 separate。如果坍塌后两条边的样式冲突（如颜色），会按以下顺序覆盖 cell、row、row group、column、column group、table

**border-spacing**

`border-collapse` 选了 `separate` 的话这个属性用于指定间隙的宽度

**width**

正常情况下，格子的宽度表现如你所想，不过也有一些要特别注意的情况：例如有三个格子，第一个格子设置了宽度，后面两个没有的话，他们会自动分配空间；如果所有格子的宽度设置得都比表格还宽，它们的空间则会按比例分配。

这里只考虑不换行且纯文字的情况，不然这个问题也够写一篇文章了。

**border**

border 不坍塌的话表现如你所想，但是坍塌之后会变得有点怪，它们会减少一个 border 的宽度。在坍塌的情况下两个格子如果需要取消一条边，就必须相邻两个格子都设置取消边框：`td:nth-child(2) { border-right: 0; } td:nth-child(3) { border-left: 0; }`

译者注：关于坍塌后用哪条边，[mdn](https://developer.mozilla.org/en-US/docs/Web/CSS/border-collapse) 有一个简明易懂的例子

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/border-collapse.png)

以上信息不是很详尽，还有其他不少 CSS 的怪异实现，例如你不可以在格子使用相对定位（译者注：2021 年 3 月，我尝试在 td 或 td 里的元素进行相对、绝对定位设置，发现没有任何问题）。

如果你还发现其他 CSS 怪异现象，请在评论区分享。

## 默认样式

[WebKit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css) 的情况

我也调查过 Chrome 的情况，使用 Blink 实现，样式也是一样的。

## 重置 table 样式

## 让 table 不 table

你可能会突然遇到不想让 table 展示得像个传统 table，做法本质上也是修改 table 元素的 display：

```css
th,
td {
  display: inline;
}
```

为了整个环境更协调我倾向于先把全部 table 相关元素重置一下，避免出现神奇的问题。

```css
table,
thead,
tbody,
tfoot,
tr,
td,
th,
caption {
  display: block;
}
```

这么做通常是用在响应式设计上，例如小屏幕的手机不便展示 PC 端的大表格。后面会有一节解决这个问题。

## 无障碍表格

在 table 在正确的语义下使用时，无障碍相关配置仍有需要注意的地方，请参考这三篇不错的文章：

- WebAIM: [Creating Accessible Tables](http://webaim.org/techniques/tables/)
- Portland Community College: [Examples of Good and Bad Table Layout for Screen Readers](http://www.pcc.edu/resources/instructional-support/access/table-layout-examples.html)
- Web Usability: [Accessible Data Tables](http://usability.com.au/2005/06/accessible-data-tables-2005/)

## 斑马纹

最简单的：

```css
tbody tr:nth-child(odd) {
  background: #eee;
}
```

限制在 tbody 是因为你大概不会想要包含表头和表脚，你也可以把 odd 改成 even。[调查证明](https://alistapart.com/article/zebrastripingmoredataforthecase)斑马纹确实是个不错的注意。

## 高亮

高亮行非常简单，加一个 class 即可：

```html
<tr class="highlight">
  ...
</tr>
```

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 450px;"><iframe id="cp_embed_sbAaf" src="//codepen.io/anon/embed/sbAaf?height=450&amp;theme-id=1&amp;slug-hash=sbAaf&amp;default-tab=result" height="450" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed sbAaf" title="CodePen Embed sbAaf" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

高亮列就有点麻烦。其中一种方法是使用 `<col>` 元素，它可以让你一次控制一整列的样式。不过这东西有点不直观，因为受影响的格子并不是 `<col>` 的子元素，但是浏览器会懂你什么意思。

一个 4 列的表格会有四个 `<col>`：

```html
<table>
  <col>
  <col>
  <col>
  <col>

  <thead>
     ...

</table>
```

你可以这样高亮它：

```css
col:nth-child(3) {
  background: yellow;
}
```

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 450px;"><iframe id="cp_embed_Adtxf" src="//codepen.io/anon/embed/Adtxf?height=450&amp;theme-id=1&amp;slug-hash=Adtxf&amp;default-tab=result" height="450" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed Adtxf" title="CodePen Embed Adtxf" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

这个做法在你设置了格子背景色的时候会无效，因为格子的背景色总是优先于列的背景色，这个时候你可以为格子设置一系列 class 满足下面的选择器：

```css
td:nth-child(2),
th:nth-child(2) {
  background: yellow;
}
```

## hover 高亮

行，一样的简单：

```css
tbody tr:hover {
  background: yellow;
}
```

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 450px;"><iframe id="cp_embed_Kghja" src="//codepen.io/anon/embed/Kghja?height=450&amp;theme-id=1&amp;slug-hash=Kghja&amp;default-tab=result" height="450" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed Kghja" title="CodePen Embed Kghja" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

如果设置了格子样式的话就用 `tr:hover td, tr:hover th { }` 一样简单。

至于列，还是麻烦一点，你没办法设置 `col:hover`，根本没东西给你 hover，所以只能用 JavaScript 了：

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 450px;"><iframe id="cp_embed_pLHBm" src="//codepen.io/anon/embed/pLHBm?height=450&amp;theme-id=1&amp;slug-hash=pLHBm&amp;default-tab=result" height="450" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed pLHBm" title="CodePen Embed pLHBm" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

## 表格设计范例

本节展示了多个设计不错的表格，完整内容略，[点击这里直达原文](https://css-tricks.com/complete-guide-table-element/#nicely-styled-tables)

## 表格搜索

说明如何使用 jQuery 实现表格搜索，完整内容略，[点击这里直达原文](https://css-tricks.com/complete-guide-table-element/#table-search)

## 响应式设计

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/mobile-table-suck.png)

两个 live demo：

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 414px; transition: all 0s ease 0s; width: 764px;"><iframe id="cp_embed_FCBEg" src="//codepen.io/anon/embed/FCBEg?height=450&amp;theme-id=1&amp;slug-hash=FCBEg&amp;default-tab=result" height="450" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed FCBEg" title="CodePen Embed FCBEg" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 450px;"><iframe id="cp_embed_CvFHy" src="//codepen.io/anon/embed/CvFHy?height=450&amp;theme-id=1&amp;slug-hash=CvFHy&amp;default-tab=result" height="450" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed CvFHy" title="CodePen Embed CvFHy" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

## 固定表头的表格

说明如何使用 jQuery 实现固定表头，而现在基本可以放心使用 `position: sticky;`，完整内容略，[点击这里直达原文](https://css-tricks.com/complete-guide-table-element/#fixed-header-tables)

## 用 Emmet 生成表格代码

[Emmet](http://emmet.io/) 是一个不错的代码工具，可以帮你生成庞大但有规律的 HTML 结构，省得自己复制成狗。

完整内容略，[点击这里直达原文](https://css-tricks.com/complete-guide-table-element/#using-emmet-for-creating-table-markup)

## JavaScript 生成表格

JavaScript 通过 `HTMLTableElement` 提供了处理 table 元素的特定方法。Louis Lazaris 最近也写了一篇相关[文章](http://us5.campaign-archive1.com/?u=ea228d7061e8bbfa8639666ad&id=f7212bdeba&e=313c7b398a)。你可以利用 `HTMLTableElement` 更灵活地生成表格，相关文档可以查阅 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement)。

<div class="wp-block-cp-codepen-gutenberg-embed-block cp_embed_wrapper resizable" style="height: 450px;"><iframe id="cp_embed_inosC" src="//codepen.io/anon/embed/inosC?height=450&amp;theme-id=1&amp;slug-hash=inosC&amp;default-tab=result" height="450" scrolling="no" frameborder="0" allowfullscreen="" allowpaymentrequest="" name="CodePen Embed inosC" title="CodePen Embed inosC" class="cp_embed_iframe" style="width: 100%; overflow: hidden; height: 100%;">CodePen Embed Fallback</iframe><div class="win-size-grip" style="touch-action: none;"></div></div>

## 表格排序

## 更多信息

- [HTML 标准文档](https://html.spec.whatwg.org/multipage/tables.html)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table)
