---
path: '/node-version-management'
date: '2021-05-28T15:47:34.279Z'
title: 'windows 下 electron 开发的一点“趣事”'
tags: ['coding']
---

前提是这样的，公司有个神奇的项目，立项用的是 32 位 electron，所以 `npm i` 的时候要用 32 位 node。

那么是不是装个 32 位 node 就一劳永逸呢？也不是。

运行的时候如果用 32 位，保存后热更新又会报错，说内存不足之类的。

所以必须这么做：

- 用 32 位 `npm i`
- 用 64 位运行 `npm run dev`
- 然后发现 32 位 node-sass 在 64 位下不能用，要 `npm rebuild node-sass`
- 然后成功运行

开始以为这操作不多，我就一直是保留 32 和 64 两个安装包，反正安装的时候自动覆盖，后来发现，不行——

每 `npm i` 一个新依赖，项目就不能运行了，有时候真的不知道 `npm i` 到底干了什么，大概是依赖的依赖产生了冲突然后导致什么东西修改了吧，总而言之我又要重装一遍依赖。

这情况以后肯定还会频繁出现，所以两个安装包的方法不太行，于是找回以前在服务器用过的 nvm 吧！

结果……以前抱怨过 [windows 开发挺麻烦的](https://ssshooter.com/2020-04-18-windows-docker/)，现在又来了。

Linux 服务器里用的好好 nvm，windows 用不了，翻阅 electron 文档找到一个方法：

```
npm install --arch=ia32 electron
```

然而整个项目不止 electron 一个区分 arch 的依赖，因此之在这里控制 32 位不足够。

[类似的方法](https://stackoverflow.com/questions/22448885/how-do-i-build-32-bit-binaries-on-a-64-bit-system-using-npm)还有：

```
npm set npm_config_arch ia32
npm clean-install --arch=ia32
```

但是，实测没有用，而且 npm 文档里根本都没这参数……

结果还是用回类似 nvm 的方案吧……经过一番折腾找到两个 Windows 的 alternative：[nvs](https://github.com/jasongin/nvs) 和 [nvm-windows](https://github.com/coreybutler/nvm-windows)

我用的是 nvs，在 git bash 输入 nvs 回车，打不开，但是用 cmd 可以，shell 不一样嘛，函数也不一样，大概可以理解。

但是我不知道为什么 vscode 下面的 terminal 运行的 powershell 也跑不了 nvs。

一查，powershell 有[安全策略](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.1)，要先设置 `Set-ExecutionPolicy Unrestricted -Scope CurrentUser` 才能跑脚本。

```
PS F:\usubeni-fantasy> nvs
PATH -= C:\Program Files\nodejs
PATH += $env:LOCALAPPDATA\nvs\node\14.16.0\x64
```

总算是可以切 node 版本了，不过注意每次打开 terminal 都要设置一次 nvs。

每每发生这种事就觉得，果然还是要深入了解下命令行的底层知识、以及 Windows 和 Linux 在命令行使用上的差别，先占个坑吧，下次有机会一定写！

P.S.最后还是觉得 Windows 和命令行的有点不可兼得的感觉，这就是 GUI 常年发展的副作用吧。
