---
path: '/vim-ycm'
date: '2020-01-22T10:54:26.088Z'
title: 'vim8 及 YouCompleteMe 安装'
tags: ['coding', 'vim']
---

整个过程不难，只是对 linux 系统很陌生的我，在编译安装的时候有点云里雾里。不过装完之后觉得如果不深究其中原理的话其实还是不难的，就是很普通地用编译器把配置好的源码编译好，然后运行程序而已，实际上自己也不需要做什么高难度操作。

## vim 8 安装

事实上，吃瘪的 centOS 7.5 用户根本没有直接安装 vim 8 这个选项，虽然可以百度到一个换仓库然后 yum 的方案，但是很遗憾，那个仓库已经 404 了。

因此，只能老实用源码 `make` 了。

首先拉一下 vim 官方仓库：https://github.com/vim/vim

插话：这里有一个非常火大的地方是腾讯云 clone github 仓库简直是龟速，我不得已曲线救国的方案是在 gitee 先拉一次 github 仓库，然后 clone gitee 仓库，但是这也不是万能的，因为有的情况是在一个库里再另外拉其他库代码，这就没办法一个一个拉过来了，更加麻烦。

假设已经拉好仓库，进入仓库的 src 文件夹：

```
cd src
```

然后对安装进行配置，**不配这个用不了 YouCompleteMe**（我的破机用的是 py2.7 也不想折腾更新了，所以就直接用 2.7）

没有配置的情况大概会弹出这样的提示，`YouCompleteMe unavailable: requires Vim compiled with Python ...`，别问我怎么知道的……

```
./configure --enable-pythoninterp --with-python-config-dir=/usr/lib/python2.7/config
```

**这里应该要注意 python-config-dir 的地址对不对。**配置完之后你可能还需要先安装编译器 `yum install gcc-c++`（搜索引擎找到的方案可能会包括其他什么东西，不行的话再安装吧），接着运行：

```
make && make install
```

编译成功之后直接在 `src` 目录运行 `vim` 就能打开最新版本的 vim。觉得不方便的话可以在 `$PATH` **加一下环境变量**。

接着是安装插件管理器（VimPlug 等）和编辑配置文件 vimrc，难度不高，这里就不展开了。

## YouCompleteMe 安装

这里用 VimPlug 为例安装 YouCompleteMe。

第一步与普通插件无异：

```
Plug 'valloric/youcompleteme'
```

配置后在 vim 中运行 PlugInstall。

第二步，因为这个**插件也需要编译才能使用**，所以还要装一个 `cmake` 编译器。

第三步是打开 youcompleteme 所在文件夹（用 VimPlug 的话应该都在 `~/.vim/plugged/youcompleteme`）运行 `./install.py`。

插话：install 运行需要先拉若干个依赖项目，这些项目理所当然地储存在 github，上面也说了腾讯云拉 github 仓库真的慢如龟，所以这一步也折腾很久。

至此 youcompleteme 就能正常使用了，不过你仍然可以通过配置把这个插件优化到你最顺手的样子。

就 JavaScript 用户来说可以看看 [YouCompleteMe#javascript-and-typescript-semantic-completion](https://github.com/ycm-core/YouCompleteMe#javascript-and-typescript-semantic-completion)

最后推荐一个找插件的地方：[vimawesome](https://vimawesome.com/)
