---
path: '/node-version-management'
date: '2021-05-28T15:47:34.279Z'
title: 'node-version-management'
tags: ['tag']
released: false
---

前提是这样的，公司有个神奇的项目，立项用的是 32 位 electron，所以 npm i 的时候要用 32 位 node。

那么是不是装个 32 位 node 就可以呢？也不是。

运行的时候如果用 32 位，保存后更新又会报错，说内存不足之类的。

所以必须这么做：

- 用 32 位 `npm i`
- 用 64 位运行 `npm run dev`
- 然后发现 32 位 node-sass 在 64 位下不能用，要 `npm rebuild node-sass`
- 然后成功运行

开始以为这操作不多，我就一直是保留 32 和 64 两个安装包，反正安装的时候自动覆盖，后来发现，不行……

我 npm i 一个新依赖，项目就不能运行了，有时候真的不知道 npm i 到底干了什么，大概是依赖的依赖产生了冲突然后导致什么东西修改了吧，总之我又要重装一遍依赖。

这情况以后肯定还会频繁出现，所以两个安装包的方法不太行，于是找回以前在服务器用过的 nvm 吧！

结果……以前抱怨过 window 开发难用，现在又来了。

Linux 服务器里用的好好 nvm，windows 用不了，然后一番搜索，找到一个方法：

```
npm install --arch=ia32 electron
```

然而整个项目不止 electron 一个区分 arch 的依赖，因此之在这里控制 32 位不足够。

[类似的方法](https://stackoverflow.com/questions/22448885/how-do-i-build-32-bit-binaries-on-a-64-bit-system-using-npm)还有：

```
npm set npm_config_arch ia32
npm clean-install --arch=ia32
```

但是，没有用啊！npm 文档里根本都没这参数……

结果还是用回类似 nvm 的方案吧……经过一番折腾找到两个 Windows 的 alternative

[nvs](https://github.com/jasongin/nvs) 和 [nvm-windows](https://github.com/coreybutler/nvm-windows)

我用的是 nvs，git bash 输入 nvs 回车，打不开，但是用 cmd 可以，shell 不一样嘛，函数也不一样，大概可以理解。

但是我不知道为什么 vscode 下面的 terminal 运行的 powershell 也跑不了 nvs。

一查，powershell 有[安全策略](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.1)，要先设置 `Set-ExecutionPolicy Unrestricted -Scope CurrentUser` 才能跑脚本。

而且设置 nvs 之后关掉窗口就要重新设置。

```
PS F:\usubeni-fantasy> nvs
PATH -= C:\Program Files\nodejs
PATH += $env:LOCALAPPDATA\nvs\node\14.16.0\x64
```

果然还是要深入了解下底层知识，不过，哎，还是觉得 windows 好麻烦，就感觉 win 和命令行势不两立一样……
