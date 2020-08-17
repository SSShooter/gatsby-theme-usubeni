---
path: '/html-encode'
date: '2020-08-12T18:27:39.444Z'
title: 'html-encode'
tags: ['coding']
released: false
---

字符集
字符集是书写系统字母与符号的集合。例如，ASCII 字符集包括英语字母、符号；ISO-8859-6 字符集包括许多基于阿拉伯语言文字的字母、符号；Unicode 字符集涵盖世界上多数活语言文字字符。

UCS

https://en.wikipedia.org/wiki/Universal_Coded_Character_Set

## unicode

U+

> The convention to refer to a character in Unicode is to start with 'U+' followed by the codepoint value in hexadecimal.

为什么要编码

https://en.wikipedia.org/wiki/Character_encoding#Terminology

code point

code unit

> All code points in the BMP are accessed as a single code unit in UTF-16 encoding and can be encoded in one, two or three bytes in UTF-8.

> A code unit is the unit of storage of a part of an encoded code point. In UTF-8 this means 8-bits, in UTF-16 this means 16-bits. A single code unit may represent a full code point, or part of a code point.

https://stackoverflow.com/questions/27331819/whats-the-difference-between-a-character-a-code-point-a-glyph-and-a-grapheme

https://en.wikipedia.org/wiki/Unicode

https://deliciousbrains.com/how-unicode-works/

codePointAt()

## html

| 格式       | 描述     |
| ---------- | -------- |
| `&#x20AC;` | 十六进制 |
| `&#8364;`  | 十进制   |
| `&euro;`   | 名称     |

转义标志是 &，**用的是 Unicode 码点位置**

用于代替 < > & " 等 html 里有功能的字符

https://www.w3.org/International/questions/qa-escapes

https://en.wikipedia.org/wiki/Numeric_character_reference
https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references

## CSS

| 格式      | 描述                                   |
| --------- | -------------------------------------- |
| `\20AC`   | 如果下一位是十六进制可用字符必须加空格 |
| `\0020AC` | 必须六位，后面可以不加空格             |

例如 css 选择器本不可以以数字开头，但是使用转义字符就能选择 class 123

`.\31 23 { ... }` 或 `.\00003123 { ... }`

转义标志是 \

## 字符串

字符串转移大家都很熟悉了，最常用的有 `\'` `\"` `\n` `\t` 等

其他的通用的转义还有

| 格式                   | 描述                                                                |
| ---------------------- | ------------------------------------------------------------------- |
| `\XXX`                 | ISO-8859-1 character / Unicode code point between U+0000 and U+00FF |
| `\uXXXX`               | 必须六位，后面可以不加空格                                          |
| `\u{X} ... \u{XXXXXX}` | 必须六位，后面可以不加空格                                          |
| `\xXX`                 | 必须六位，后面可以不加空格                                          |

字符串的'u\xxxx' '\351' 八进制
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String

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

<style>
.wikitable{
    font-size: 12px;
}

</style>
