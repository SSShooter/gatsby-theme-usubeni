---
path: '/complete-guide-table-element'
date: '2021-03-23T15:28:46.976Z'
title: '关于 table 元素你要懂的全在这'
tags: ['tag']
released: false
---

https://css-tricks.com/complete-guide-table-element

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

表格里的每个格子总是 `<td>` 或 `<th>` 两个元素的其中之一，它们是格子的本质。`<th>` 代表 tabular headers，`<td>` 代表 tabular data。

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

把 table 当布局工具就是一个不适当的用法。有点反直觉，毕竟 table 看起来是理想的布局方法：容易控制、有严谨的逻辑、可预测性、元素联系紧密。

但用 table 当布局还是几个大问题。首先 HTML 标签自己是有含义的。之前提到，table 标签语义上就是展示表格数据，用在其他地方就是违反他的语义。

语义这东西不是三言两语能说清楚（），这里就谈几个共识（）：网站必须是易用的（accessible）。易用（accessibility）的一部分就是屏幕阅读器。屏幕阅读器从上到下、从左到右阅读表格。你的网站会以表格的形式描述出来，虽然视觉上看起来挺正常，但是易用性上非常有问题。更不必说这么做有可能读出一些完全没用的元素。

## 让其他元素 table 化

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

```html
display: table /*
<table>
  */ display: table-cell /*
  <td>
    */ display: table-row /*
    <tr>
      */ display: table-column /*
      <col />
      */ display: table-column-group /*
      <colgroup>
        */ display: table-footer-group /*
        <tfoot>
          */ display: table-header-group /*
          <thead>
            */
          </thead>
        </tfoot>
      </colgroup>
    </tr>
  </td>
</table>
```
