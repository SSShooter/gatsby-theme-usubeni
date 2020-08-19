---
path: '/html-encode'
date: '2020-08-19T18:27:39.444Z'
title: '字符编码与在 Web 前端的应用'
tags: ['coding']
---

阅读本文前，请先熟悉各进制间的转换，否则看起来会有点懵 😂

## Unicode

相关：[UCS](https://en.wikipedia.org/wiki/Universal_Coded_Character_Set)（Universal Character Set）原本标准不同，但现在已经与 Unicode 统一

[Unicode](https://en.wikipedia.org/wiki/Unicode) 就是一种世界统一的字符编码集合，在这个集合里，世界上每一个字符——任何语言的文字、符号甚至 emoji，都有自己的编号，称为 **code point（码点）**。这样的编号从 0000 开始，到 10FFFF，可以容纳大于一百万个不重复的字符。

<table class="wikitable navbox mw-collapsible mw-made-collapsible" style="table-layout:fixed;">
<tbody>
<tr style="">
<th colspan="2" style="background:#efefef; padding:1px; border:#B2BEB5 2px solid; border-width:0px 0px 4px">Basic
</th>
<th colspan="8" style="background:#f7f7f7; padding:1px; border:#B2BEB5 2px solid; border-width:0px 0px 4px">Supplementary
</th></tr>
<tr style="">
<th colspan="2" style="background:#efefef; padding:1px">Plane 0
</th>
<th colspan="2" style="background:#f7f7f7; padding:1px">Plane 1
</th>
<th colspan="2" style="background:#efefef; padding:1px">Plane 2
</th>
<th colspan="1" style="background:#f7f7f7; padding:1px">Plane 3
</th>
<th colspan="1" style="background:#efefef; padding:1px">Planes 4–13
</th>
<th colspan="1" style="background:#f7f7f7; padding:1px">Plane 14
</th>
<th colspan="1" style="background:#efefef; padding:1px">Planes 15–16
</th></tr>
<tr style="">
<th colspan="2" style="background:#efefef; padding:1px">0000–&#8203;FFFF
</th>
<th colspan="2" style="background:#f7f7f7; padding:1px">10000–&#8203;1FFFF
</th>
<th colspan="2" style="background:#efefef; padding:1px">20000–&#8203;2FFFF
</th>
<th colspan="1" style="background:#f7f7f7; padding:1px">30000–&#8203;3FFFF
</th>
<th colspan="1" style="background:#efefef; padding:1px">40000–&#8203;DFFFF
</th>
<th colspan="1" style="background:#f7f7f7; padding:1px">E0000–&#8203;EFFFF
</th>
<th colspan="1" style="background:#efefef; padding:1px">F0000–&#8203;10FFFF
</th></tr>
<tr style="vertical-align: top;">
<th colspan="2" style="background:#efefef; padding:1px"><a href="/wiki/Plane_(Unicode)#Basic_Multilingual_Plane" title="Plane (Unicode)">Basic Multilingual Plane</a>
</th>
<th colspan="2" style="background:#f7f7f7; padding:1px"><a href="/wiki/Plane_(Unicode)#Supplementary_Multilingual_Plane" title="Plane (Unicode)">Supplementary Multilingual Plane</a>
</th>
<th colspan="2" style="background:#efefef; padding:1px"><a href="/wiki/Plane_(Unicode)#Supplementary_Ideographic_Plane" title="Plane (Unicode)">Supplementary Ideographic Plane</a>
</th>
<th colspan="1" style="background:#f7f7f7; padding:1px"><a href="/wiki/Plane_(Unicode)#Tertiary_Ideographic_Plane" title="Plane (Unicode)">Tertiary Ideographic Plane</a>
</th>
<th colspan="1" style="background:#efefef; padding:1px"><i>unassigned</i>
</th>
<th colspan="1" style="background:#f7f7f7; padding:1px"><a href="/wiki/Supplementary_Special-purpose_Plane" class="mw-redirect" title="Supplementary Special-purpose Plane">Supplement&shy;ary Special-purpose Plane</a>
</th>
<th colspan="1" style="background:#efefef; padding:1px">Supplement&shy;ary <a href="/wiki/Private_Use_(Unicode)#Private_Use_Areas" class="mw-redirect" title="Private Use (Unicode)">Private Use Area</a> planes
</th></tr>
<tr style="vertical-align: top;">
<th colspan="2" style="background:#efefef; padding:1px">BMP
</th>
<th colspan="2" style="background:#f7f7f7; padding:1px">SMP
</th>
<th colspan="2" style="background:#efefef; padding:1px">SIP
</th>
<th colspan="1" style="background:#f7f7f7; padding:1px">TIP
</th>
<th colspan="1" style="background:#efefef; padding:1px">—
</th>
<th colspan="1" style="background:#f7f7f7; padding:1px">SSP
</th>
<th colspan="1" style="background:#efefef; padding:1px">SPUA-A/B
</th></tr>
<tr style="vertical-align: top;">
<td style="background:#efefef;">
<p><a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/0000-0FFF" class="extiw" title="wikibooks:Unicode/Character reference/0000-0FFF">0000–&#8203;0FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/1000-1FFF" class="extiw" title="wikibooks:Unicode/Character reference/1000-1FFF">1000–&#8203;1FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/2000-2FFF" class="extiw" title="wikibooks:Unicode/Character reference/2000-2FFF">2000–&#8203;2FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/3000-3FFF" class="extiw" title="wikibooks:Unicode/Character reference/3000-3FFF">3000–&#8203;3FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/4000-4FFF" class="extiw" title="wikibooks:Unicode/Character reference/4000-4FFF">4000–&#8203;4FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/5000-5FFF" class="extiw" title="wikibooks:Unicode/Character reference/5000-5FFF">5000–&#8203;5FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/6000-6FFF" class="extiw" title="wikibooks:Unicode/Character reference/6000-6FFF">6000–&#8203;6FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/7000-7FFF" class="extiw" title="wikibooks:Unicode/Character reference/7000-7FFF">7000–&#8203;7FFF</a>
</p>
</td>
<td style="background:#efefef;">
<p><a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/8000-8FFF" class="extiw" title="wikibooks:Unicode/Character reference/8000-8FFF">8000–&#8203;8FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/9000-9FFF" class="extiw" title="wikibooks:Unicode/Character reference/9000-9FFF">9000–&#8203;9FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/A000-AFFF" class="extiw" title="wikibooks:Unicode/Character reference/A000-AFFF">A000–&#8203;AFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/B000-BFFF" class="extiw" title="wikibooks:Unicode/Character reference/B000-BFFF">B000–&#8203;BFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/C000-CFFF" class="extiw" title="wikibooks:Unicode/Character reference/C000-CFFF">C000–&#8203;CFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/D000-DFFF" class="extiw" title="wikibooks:Unicode/Character reference/D000-DFFF">D000–&#8203;DFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/E000-EFFF" class="extiw" title="wikibooks:Unicode/Character reference/E000-EFFF">E000–&#8203;EFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/F000-FFFF" class="extiw" title="wikibooks:Unicode/Character reference/F000-FFFF">F000–&#8203;FFFF</a>
</p>
</td>
<td style="background:#f7f7f7;">
<p><a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/10000-10FFF" class="extiw" title="wikibooks:Unicode/Character reference/10000-10FFF">10000–&#8203;10FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/11000-11FFF" class="extiw" title="wikibooks:Unicode/Character reference/11000-11FFF">11000–&#8203;11FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/12000-12FFF" class="extiw" title="wikibooks:Unicode/Character reference/12000-12FFF">12000–&#8203;12FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/13000-13FFF" class="extiw" title="wikibooks:Unicode/Character reference/13000-13FFF">13000–&#8203;13FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/14000-14FFF" class="extiw" title="wikibooks:Unicode/Character reference/14000-14FFF">14000–&#8203;14FFF</a><br>
<br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/16000-16FFF" class="extiw" title="wikibooks:Unicode/Character reference/16000-16FFF">16000–&#8203;16FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/17000-17FFF" class="extiw" title="wikibooks:Unicode/Character reference/17000-17FFF">17000–&#8203;17FFF</a>
</p>
</td>
<td style="background:#f7f7f7;">
<p><a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/18000-18FFF" class="extiw" title="wikibooks:Unicode/Character reference/18000-18FFF">18000–&#8203;18FFF</a><br>
<br>
<br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/1B000-1BFFF" class="extiw" title="wikibooks:Unicode/Character reference/1B000-1BFFF">1B000–&#8203;1BFFF</a><br>
<br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/1D000-1DFFF" class="extiw" title="wikibooks:Unicode/Character reference/1D000-1DFFF">1D000–&#8203;1DFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/1E000-1EFFF" class="extiw" title="wikibooks:Unicode/Character reference/1E000-1EFFF">1E000–&#8203;1EFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/1F000-1FFFF" class="extiw" title="wikibooks:Unicode/Character reference/1F000-1FFFF">1F000–&#8203;1FFFF</a>
</p>
</td>
<td style="background:#efefef;">
<p><a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/20000-20FFF" class="extiw" title="wikibooks:Unicode/Character reference/20000-20FFF">20000–&#8203;20FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/21000-21FFF" class="extiw" title="wikibooks:Unicode/Character reference/21000-21FFF">21000–&#8203;21FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/22000-22FFF" class="extiw" title="wikibooks:Unicode/Character reference/22000-22FFF">22000–&#8203;22FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/23000-23FFF" class="extiw" title="wikibooks:Unicode/Character reference/23000-23FFF">23000–&#8203;23FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/24000-24FFF" class="extiw" title="wikibooks:Unicode/Character reference/24000-24FFF">24000–&#8203;24FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/25000-25FFF" class="extiw" title="wikibooks:Unicode/Character reference/25000-25FFF">25000–&#8203;25FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/26000-26FFF" class="extiw" title="wikibooks:Unicode/Character reference/26000-26FFF">26000–&#8203;26FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/27000-27FFF" class="extiw" title="wikibooks:Unicode/Character reference/27000-27FFF">27000–&#8203;27FFF</a>
</p>
</td>
<td style="background:#efefef;">
<p><a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/28000-28FFF" class="extiw" title="wikibooks:Unicode/Character reference/28000-28FFF">28000–&#8203;28FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/29000-29FFF" class="extiw" title="wikibooks:Unicode/Character reference/29000-29FFF">29000–&#8203;29FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/2A000-2AFFF" class="extiw" title="wikibooks:Unicode/Character reference/2A000-2AFFF">2A000–&#8203;2AFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/2B000-2BFFF" class="extiw" title="wikibooks:Unicode/Character reference/2B000-2BFFF">2B000–&#8203;2BFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/2C000-2CFFF" class="extiw" title="wikibooks:Unicode/Character reference/2C000-2CFFF">2C000–&#8203;2CFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/2D000-2DFFF" class="extiw" title="wikibooks:Unicode/Character reference/2D000-2DFFF">2D000–&#8203;2DFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/2E000-2EFFF" class="extiw" title="wikibooks:Unicode/Character reference/2E000-2EFFF">2E000–&#8203;2EFFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/2F000-2FFFF" class="extiw" title="wikibooks:Unicode/Character reference/2F000-2FFFF">2F000–&#8203;2FFFF</a>
</p>
</td>
<td style="background:#f7f7f7;">
<p><a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/30000-30FFF" class="extiw" title="wikibooks:Unicode/Character reference/30000-30FFF">30000–&#8203;30FFF</a><br>
<a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/31000-31FFF" class="extiw" title="wikibooks:Unicode/Character reference/31000-31FFF">31000–&#8203;31FFF</a><br>
</p>
</td>
<td style="background:#efefef;">
</td>
<td style="background:#f7f7f7;">
<p><a href="https://en.wikibooks.org/wiki/Unicode/Character_reference/E0000-E0FFF" class="extiw" title="wikibooks:Unicode/Character reference/E0000-E0FFF">E0000–&#8203;E0FFF</a>
</p>
</td>
<td style="background:#efefef; padding:0px;">
<p><i>15: SPUA-A</i><br>
F0000–&#8203;FFFFF<br>
<br>
<i>16: SPUA-B</i><br>100000–&#8203;10FFFF
</p>
</td></tr></tbody></table>

点击表中链接可以查看某段位置包含的字符。其中，从 0000 到 ffff 是最常用是平面 0，也称作 **Basic Multilingual Plane（BMP）**，大多数常用汉字都包含在其中。

我们用 Unicode 表示一个字符，约定俗成地 `U+` 加上这个字的 16 进制码点，例如“汉”就是 `U+6C49`。

但是 Unicode 虽然给字符编码了，但是在数据传输时，仅仅是给数据一个号码是不够的，还要想出一种让计算机看懂这个号码的方法，这就引出了 UTF（Unicode Transformation Format），也就是 Unicode 的传输格式。

在 Unicode 维基页的 Mapping and encodings 一节，可以看到多种编码方式，现在常见的 UTF 有 UTF-8、UTF-16、UTF-32，三种格式各有特色。

其中最容易理解的反倒是最不常用的 UTF-32，所以下面会先用 UTF-32 举例——但在此之前，现说一下 code unit（码元）

> The minimal bit combination that can represent a unit of encoded text for processing or interchange. The Unicode Standard uses 8-bit code units in the UTF-8 encoding form, 16-bit code units in the UTF-16 encoding form, and 32-bit code units in the UTF-32 encoding form.

上面是 [Unicode Consortium](https://unicode.org/glossary/#code_unit) 给出的定义，粗略翻译过来就是编码一个字符的最小单元。对于 UTF-8 码元是 8-bit，UTF-16 码元是 16-bit，UTF-32 码元是 32-bit。

### UTF-32

UTF-32（UCS-4）是一种空间效率极低、长度不变的编码方式，码元长度为 32-bit，意思就是编码一个字符至少要 32 位，举个例子：

`a` 的 UTF-32 编码是 `00000061`（16 进制）`0000 0000 0000 0000 0000 0000 0110 0001`（2 进制，为了方便阅读，添加了空格）

同理可得 `ab` 就是 `0000 0000 0000 0000 0000 0000 0110 0001 0000 0000 0000 0000 0000 0000 0110 0010`

那么就很明显可以看出来了，前面的一大堆 0 就是浪费空间的元凶。

看到这里可能会有人提出，把前面的 0 都删掉不就好了吗？

还是上面的例子，`ab` 删掉 0 之后是 `0110 0001 0110 0010`。

问题就来了，谁知道你相邻的 byte 是单个字符还是分别是几个字符呢？`0110 0001 0110 0010` 不只可以是 `ab` 也可以是编号为 24930 的那个字符。

所以我们还必须**加上一些标志**，不能简单地删除前面的 0 了事，当然，加标志就是其他的编码方法了，我们来看看广泛使用的 UTF-8。

### UTF-8

UTF-8（8-bit Unicode Transformation Format）是一种特别广泛使用的格式，码元长度为 8-bit，是一种可变长度的编码方式，它的特点是兼容 ASCII。

对于 BMP 的字符，UTF-8 会将其编码为 1 到 3 个码元，非 BMP 编码为 4 个码元。

这就是上面说到的“加标志”，让计算机看懂前后码元到底是一个字符还是多个码元组成一个字符：

- 0 开头，单独一个码元（这部分兼容 ASCII）
- 110 开头，与后面 1 个码元一起组成一个字符
- 1110 开头，与后面 2 个码元一起组成一个字符
- 11110 开头，与后面 3 个码元一起组成一个字符

<table class="wikitable">
<tbody><tr>
<th>Number<br>of bytes</th>
<th>First<br>code point</th>
<th>Last<br>code point</th>
<th>Byte 1</th>
<th>Byte 2</th>
<th>Byte 3</th>
<th>Byte 4
</th></tr>
<tr>
<td style="text-align: center;">1
</td>
<td style="text-align: right;">U+0000
</td>
<td style="text-align: right;">U+007F
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">0xxxxxxx</span>
</td>
<td style="background: darkgray;" colspan="3">
</td></tr>
<tr>
<td style="text-align: center;">2
</td>
<td style="text-align: right;">U+0080
</td>
<td style="text-align: right;">U+07FF
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">110xxxxx</span></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">10xxxxxx</span>
</td>
<td style="background: darkgray;" colspan="2">
</td></tr>
<tr>
<td style="text-align: center;">3
</td>
<td style="text-align: right;">U+0800
</td>
<td style="text-align: right;">U+FFFF
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">1110xxxx</span></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">10xxxxxx</span></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">10xxxxxx</span>
</td>
<td style="background: darkgray;">
</td></tr>
<tr>
<td style="text-align: center;">4
</td>
<td style="text-align: right;">U+10000
</td>
<td style="text-align: right;">U+10FFFF
</td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">11110xxx</span></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">10xxxxxx</span></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">10xxxxxx</span></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">10xxxxxx</span>
</td></tr></tbody></table>

下面是具体的编码例子，基本套路就是：

1. 写成二进制
2. 在特定的位置拆分开（表中紫、蓝、绿、红数字）
3. 添加标志拼接起来（表中黑色数字）

<table class="wikitable">
<tbody><tr>
<th colspan="2" rowspan="2">Character
</th>
<th colspan="2">Code point
</th>
<th colspan="3">UTF-8
</th></tr>
<tr>
<th>Octal
</th>
<th>Binary
</th>
<th>Binary
</th>
<th>Octal
</th>
<th>Hexadecimal
</th></tr>
<tr>
<td><a href="/wiki/$" class="mw-redirect" title="$">$</a></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">U+0024</span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:red;">044</span></span>
</td>
<td align="right"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:red;">010 0100</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">0<span style="color:red;">0100100</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:red;">044</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:red;">24</span></span>
</td></tr>
<tr>
<td><a href="/wiki/%C2%A2" class="mw-redirect" title="¢">¢</a></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">U+00A2</span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:green;">02</span><span style="color:red;">42</span></span>
</td>
<td align="right"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:green;">000 10</span><span style="color:red;">10 0010</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">110<span style="color:green;">00010</span> 10<span style="color:red;">100010</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">3<span style="color:green;">02</span> 2<span style="color:red;">42</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:green;">C2</span> <span style="color:red;">A2</span></span>
</td></tr>
<tr>
<td><a href="/wiki/Devanagari_(Unicode_block)" title="Devanagari (Unicode block)">ह</a></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">U+0939</span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:blue;">00</span><span style="color:green;">44</span><span style="color:red;">71</span></span>
</td>
<td align="right"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:blue;">0000</span> <span style="color:green;">1001 00</span><span style="color:red;">11 1001</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">1110<span style="color:blue;">0000</span> 10<span style="color:green;">100100</span> 10<span style="color:red;">111001</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">34<span style="color:blue;">0</span> 2<span style="color:green;">44</span> 2<span style="color:red;">71</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:blue;">E0</span> <span style="color:green;">A4</span> <span style="color:red;">B9</span></span>
</td></tr>
<tr>
<td><a href="/wiki/Euro_sign" title="Euro sign">€</a></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">U+20AC</span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:blue;">02</span><span style="color:green;">02</span><span style="color:red;">54</span></span>
</td>
<td align="right"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:blue;">0010</span> <span style="color:green;">0000 10</span><span style="color:red;">10 1100</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">1110<span style="color:blue;">0010</span> 10<span style="color:green;">000010</span> 10<span style="color:red;">101100</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">34<span style="color:blue;">2</span> 2<span style="color:green;">02</span> 2<span style="color:red;">54</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:blue;">E2</span> <span style="color:green;">82</span> <span style="color:red;">AC</span></span>
</td></tr>
<tr>
<td><a href="/wiki/Hangul_Syllables" title="Hangul Syllables">한</a></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">U+D55C</span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:blue;">15</span><span style="color:green;">25</span><span style="color:red;">34</span></span>
</td>
<td align="right"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:blue;">1101</span> <span style="color:green;">0101 01</span><span style="color:red;">01 1100</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">1110<span style="color:blue;">1101</span> 10<span style="color:green;">010101</span> 10<span style="color:red;">011100</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">35<span style="color:blue;">5</span> 2<span style="color:green;">25</span> 2<span style="color:red;">34</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color:blue;">ED</span> <span style="color:green;">95</span> <span style="color:red;">9C</span></span>
</td></tr>
<tr>
<td><a href="/wiki/Hwair" title="Hwair">𐍈</a></td>
<td><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">U+10348</span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color: #C000C0;">0</span><span style="color:blue;">20</span><span style="color:green;">15</span><span style="color:red;">10</span></span>
</td>
<td align="right"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color: #C000C0;">0 00</span><span style="color:blue;">01 0000</span> <span style="color:green;">0011 01</span><span style="color:red;">00 1000</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">11110<span style="color: #C000C0;">000</span> 10<span style="color:blue;">010000</span> 10<span style="color:green;">001101</span> 10<span style="color:red;">001000</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced">36<span style="color: #C000C0;">0</span> 2<span style="color:blue;">20</span> 2<span style="color:green;">15</span> 2<span style="color:red;">10</span></span>
</td>
<td align="left"><link rel="mw-deduplicated-inline-style" href="mw-data:TemplateStyles:r886049734"><span class="monospaced"><span style="color: #C000C0;">F0</span> <span style="color:blue;">90</span> <span style="color:green;">8D</span> <span style="color:red;">88</span></span>
</td></tr></tbody></table>

### UTF-16

UTF-16（UCS-2）即便没有 UTF-8 使用得广泛，仍是一个比较常用的编码方式。

以 UTF-16 16-bit 的码元长度，BMP 字符可以统一用一个码元表示，但是这样 `a` 就会被编码为 `0000 0000 0110 0001`，因此不兼容 ASCII。

但是对于 BMP 后排大户——汉字，UTF-8 会将 U+0800 到 U+FFFF 字符编码为 3 byte，UTF-16 则是稳定的 2 byte，所以如果文件内包含大量中文文本，编码为 UTF-16 会比 UTF-8 的体积会显著缩小。

下表是 UTF-16 的编码方式，可以说与 UTF-8 大同小异。BMP 以外的字符分割后分别添加 `110110` 和 `110111` 提示计算机两个码元组成一个字符。

<table class="wikitable">
<tbody><tr>
<th colspan="2">Character
</th>
<th>Binary code point
</th>
<th>Binary UTF-16
</th>
<th>UTF-16 hex<br>code units
</th>
<th>UTF-16BE<br>hex bytes
</th>
<th>UTF-16LE<br>hex bytes
</th></tr>
<tr>
<td><a href="/wiki/$" class="mw-redirect" title="$">$</a></td>
<td><code>U+0024</code>
</td>
<td align="right"><code><span style="color: #000092;">0000 0000 0010 0100</span></code>
</td>
<td align="right"><code><span style="color: #000092;">0000 0000 0010 0100</span></code>
</td>
<td align="right"><code><span style="color: #000092;">0024</span></code>
</td>
<td align="right"><code><span style="color: #000092;">00 24</span></code>
</td>
<td align="right"><code><span style="color: #000092;">24 00</span></code>
</td></tr>
<tr>
<td><a href="/wiki/Euro_sign" title="Euro sign">€</a></td>
<td><code>U+20AC</code>
</td>
<td align="right"><code><span style="color: #000092;">0010 0000 1010 1100</span></code>
</td>
<td align="right"><code><span style="color: #000092;">0010 0000 1010 1100</span></code>
</td>
<td align="right"><code><span style="color: #000092;">20AC</span></code>
</td>
<td align="right"><code><span style="color: #000092;">20 AC</span></code>
</td>
<td align="right"><code><span style="color: #000092;">AC 20</span></code>
</td></tr>
<tr>
<td><a href="/wiki/%F0%90%90%8F" class="mw-redirect" title="𐐏">𐐷</a></td>
<td><code>U+10437</code>
</td>
<td align="right"><code><span style="color: #920000;">0001 0000 01</span><span style="color: #000092;">00 0011 0111</span></code>
</td>
<td align="right"><code>1101 10<span style="color: #920000;">00 0000 0001</span> 1101 11<span style="color: #000092;">00 0011 0111</span></code>
</td>
<td align="right"><code><span style="color: #920000;">D801</span> <span style="color: #000092;">DC37</span></code>
</td>
<td align="right"><code><span style="color: #920000;">D8 01</span> <span style="color: #000092;">DC 37</span></code>
</td>
<td align="right"><code><span style="color: #920000;">01 D8</span> <span style="color: #000092;">37 DC</span></code>
</td></tr>
<tr>
<td><a href="https://en.wiktionary.org/wiki/%F0%A4%AD%A2" class="extiw" title="wikt:𤭢">𤭢</a></td>
<td><code>U+24B62</code>
</td>
<td align="right"><code><span style="color: #920000;">0010 0100 10</span><span style="color: #000092;">11 0110 0010</span></code>
</td>
<td align="right"><code>1101 10<span style="color: #920000;">00 0101 0010</span> 1101 11<span style="color: #000092;">11 0110 0010</span></code>
</td>
<td align="right"><code><span style="color: #920000;">D852</span> <span style="color: #000092;">DF62</span></code>
</td>
<td align="right"><code><span style="color: #920000;">D8 52</span> <span style="color: #000092;">DF 62</span></code>
</td>
<td align="right"><code><span style="color: #920000;">52 D8</span> <span style="color: #000092;">62 DF</span></code>
</td></tr></tbody></table>

## html

| 格式       | 描述               |
| ---------- | ------------------ |
| `&#x20AC;` | &#x + 十六进制 + ; |
| `&#8364;`  | &# + 十进制 + ;    |
| `&euro;`   | & + 名称 + ;       |

转义标志是 `&`，不管你的 html 文件使用何种编码方式（例如这里写成 `<meta http-equiv="Content-Type" content="text/html; charset=shift_jis">`），转义使用的都是**Unicode 码点**。

使用名称的话可以看这个[可以转义的名称列表](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references)。

这样的 html 文档内的转义常用于代替空格、`<`、`>`、`&`、`"` 等 html 里有功能的字符，但是当然不止如此。

iconfont 应该是前端开发者很熟悉的一个平台，这个平台可以把图标做成字体，引入这个字体，然后每个图标有一个特定的 Unicode 码位，只要使用转义字符，就能顺利显示该图标。

利用同样的原理，你也可以[在 React Native 使用阿里 iconfont 图标](https://ssshooter.com/2020-08-19-react-native-iconfont/)。

https://en.wikipedia.org/wiki/Numeric_character_reference

[Character entity references in HTML](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references)

## CSS

| 格式      | 描述                                   |
| --------- | -------------------------------------- |
| `\20AC`   | 如果下一位是十六进制可用字符必须加空格 |
| `\0020AC` | 必须六位，后面可以不加空格             |

例如 css 选择器本不可以以数字开头，但是使用转义字符就能选择 class 123

`.\31 23 { ... }` 或 `.\00003123 { ... }`

转义标志是 \

## 字符串

大家熟悉字符串转义应该有这些：处理字符串引号冲突的 `\'` `\"` 换行和拉开距离的 `\n` `\t`。

下面是使用 Unicode 码点转义成字符的四种方法（使用场景一般也是上面提到的插入 iconfont）：

| 格式                   | 描述                                                                       |
| ---------------------- | -------------------------------------------------------------------------- |
| `\XXX`                 | 仅限 ISO-8859-1 范围（Unicode U+0000 到 U+00FF），1~3 位奇葩的**八进制**数 |
| `\uXXXX`               | Unicode U+0000 到 U+FFFF（BMP），4 位十六进制                              |
| `\u{X} ... \u{XXXXXX}` | Unicode U+0000 到 U+10FFFF，1 到 6 位十六进制                              |
| `\xXX`                 | 仅限 ISO-8859-1 范围（Unicode U+0000 到 U+00FF），2 位十六进制             |

```javascript
console.log('\121')
// => Q
console.log('\u9e6b')
// => 鹫
console.log('\u{1f602}')
// => 😂
console.log('\xea')
// => ê
```

说到 JavaScript 便顺带一提 codePointAt() 和 charCodeAt()的区别：

```javascript
console.log('吉'.charCodeAt().toString(2))
console.log('吉'.codePointAt().toString(2))
// => 101010000001001
```

在 **BMP** 内，`charCodeAt` 和 `codePointAt` 返回的结果相等。

```javascript
console.log('𠮷'.charCodeAt(0).toString(2))
// => 1101100001000010
console.log('𠮷'.charCodeAt(1).toString(2))
// => 1101111110110111
console.log('𠮷'.codePointAt(0).toString(2))
// => 100000101110110111
console.log('𠮷'.codePointAt(1).toString(2))
// => 1101111110110111
```

在 **BMP** 外，字符被分成两块，`charCodeAt` 的两个结果中明显看到 `110110` 和 `110111`，便能推测出这是 UTF-16。

而 `codePointAt` 如其名，拿到的直接就是 Unicode 码点，也不用分两位来取了，`codePointAt(1)` 是没有意义的。

还原方法如下：

```javascript
console.log('\ud842\udfb7') //𠮷,
console.log('\u{20bb7}') //𠮷
```

## 参考与拓展

[Using character escapes in markup and CSS](https://www.w3.org/International/questions/qa-escapes)

[MDN String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

[Difference between codePointAt and charCodeAt](https://stackoverflow.com/questions/36527642/difference-between-codepointat-and-charcodeat)

[字符编码 wikipedia](https://en.wikipedia.org/wiki/Character_encoding#Terminology)

[What's the difference between a character, a code point, a glyph and a grapheme?](https://stackoverflow.com/questions/27331819/whats-the-difference-between-a-character-a-code-point-a-glyph-and-a-grapheme)

<style>
.wikitable{
    font-size: 12px;
    background-color: #f8f9fa;
    color: #202122;
    margin: 1em 0;
    border: 1px solid #a2a9b1;
    border-collapse: collapse;
}
.wikitable > tr > th, .wikitable > tr > td, .wikitable > * > tr > th, .wikitable > * > tr > td {
    border: 1px solid #a2a9b1;
    padding: 0.2em 0.4em;
}
</style>
