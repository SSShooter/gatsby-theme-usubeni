---
path: '/mind-elixir-open-source'
date: '2019-08-01T13:21:24.492Z'
title: '无框架依赖的思维导图内核 Mind Elixir 开源啦'
tags: ['coding']
---

Github 地址： https://github.com/ssshooter/mind-elixir-core

试用地址： https://mind-elixir.com/

![mindelixir logo](https://raw.githubusercontent.com/ssshooter/mind-elixir-core/master/images/logo.png)

Mind elixir 是一个免费开源的思维导图内核

## 立即试用

![mindelixir](https://raw.githubusercontent.com/ssshooter/mind-elixir-core/master/images/screenshot.png)

https://mind-elixir.com/#/

## 在项目中使用

### 安装

#### NPM

```bash
npm i mind-elixir -S
```

```javascript
import MindElixir, { E } from 'mind-elixir'
```

#### script 标签引入

```html
<script src="https://cdn.jsdelivr.net/npm/mind-elixir@0.6.1/dist/mind-elixir.js"></script>
```

### HTML 结构

```html
<div class="outer"><div id="map"></div></div>
<style>
  .outer {
    position: relative;
    margin: 50px;
  }
  #map {
    height: 500px;
    width: 100%;
    overflow: auto;
  }
</style>
```

### 初始化

```javascript
let mind = new MindElixir({
  el: '#map',
  direction: MindElixir.LEFT,
  data: MindElixir.new('new topic'), // 也可以把 getDataAll 得到的数据初始化
  draggable: true, // 启用拖动 default true
  contextMenu: true, // 启用右键菜单 default true
  toolBar: true, // 启用工具栏 default true
  nodeMenu: true, // 启用节点菜单 default true
  keypress: true, // 启用快捷键 default true
})
mind.init()

// get a node
E('node-id')
```

### Data Export

```javascript
mind.getAllData()
// see src/example.js
```

## 使用提示

### direction 选项

direction 选项可选 `MindElixir.LEFT`、`MindElixir.RIGHT` 和 `MindElixir.SIDE`。

### HTML 结构

挂载的目标需要定宽高，可以是百分百；外层元素建议设置 `position: relative;`，否则菜单位置以视窗为标准分布。

### E 函数

在使用节点操作方法时需要传入的参数可以借助 `E` 函数获得。

```javascript
mind.insertSibling(E('bd4313fbac40284b'))
```

## 文档

https://inspiring-golick-3c01b9.netlify.com/

## 依赖

[hotkeys-js](https://www.npmjs.com/package/hotkeys-js)
