---
path: '/commit-message'
date: '2020-10-13T10:00:23.853Z'
title: '理解语义化 Commit'
tags: ['coding', '翻译', 'git']
---

> 原文地址：[Understanding Semantic Commit Messages Using Git and Angular](https://nitayneeman.com/posts/understanding-semantic-commit-messages-using-git-and-angular)

很多项目都会选择定下这样那样的 commit 提交约定，这不是什么新鲜的设定，只不过在近年来越来越多地被应用起来，很可能你已经遇到过使用着某种约定的项目。

最初提出 commit 约定的项目之一是 AngularJS。团队建立了详尽的文档说明成员们应该如何进行 commit。后来，commit 约定火起来了，或者大家接触到他们是在 Karma 的指引中。另外 jQuery、JSHint、Ember、Angular（AngularJS 约定的增强版）等，都有着各自不同的约定。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/conventions-diagram.png)

上面可以清晰看到各种 commit 约定的形式，这些约定中都包含了一个合适的 commit 原因。[Conventional Commits](https://www.conventionalcommits.org/) 就是这么一种规范，简化了 Angular 约定并简单说明了一些基础的 commit 约定。

本文会介绍 Semantic Commits 背后的思路，并借助 Git 和 Angular 约定举例说明，但是我们只是为了厘清这个概念，最终选择什么版本控制工具和具体的约定规则，还是由你自己决定。

那么开始啦！

## 动机

先解释一下这个名词：

> Semantic Commits 是指人类和机器都可读的 commit 信息，这些 commit 符合特定的约定

- 提交信息是语义化的（semantic），因为要分类为有意义的“类型”，标志着这条 commit 的本质
- 提交信息是约定好的（conventional），因为格式是固定的，类型是常用的，对开发者和开发工具都是如此

这些语义化的 commit 让我们十分方便：

1. 维护者和开发者都可以很容易看清楚这个项目的历史，和一些提交的本质内容，也可以通过 commit 类型忽略一些不重要的提交
2. 限制 commit 的格式，鼓励更小颗粒度的提交
3. 直入主题，减少无用措辞
4. 根据 commit 类型自动更新版本号
5. 自动生成 CHANGELOG 和发布日志

总结来说，语义化 commit 可以给我们带来**更高可读性和更快的速度，以及自动化**。

接下来会讲到 Angular 的 commit 约定和其带来的好处。

## 提交格式

Angular 约定要求一个 commit 包含下面的结构：

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/commit-message-format-by-angular.png)

上图把 commit 信息分为 header、body、footer 三部分，下面我们详细说明。

### Header

Header 是**必填的**，这一行需要简单描述这次提交的修改，最大 100 字符。

Header 本身也包含三个部分：

- Type - 一个短小的前缀，说明更改的**类型**
- Scope - 可选，说明更改的**上下文**
- Subject - 本次修改的简洁描述

对于 Git 这只是 commit 信息的第一行：

```
git commit -m "fix(core): remove deprecated and defunct wtf* apis"
```

看看这条单行信息，以 `:` 分为两部分，左边的我们称为“前缀”，`fix` 和 `core`（影响的包）分别是 type 和 scope，而右边就是本次提交的主题（Subject）。

简单来说这条提交的意思就是：这次修改修复了一个 core 包里的 bug，具体操作是 remove deprecated and defunct wtf\* apis。

### Body

Body，非必填，描述着此次修改的原因，或者是关于这次修改的细节。

```
git commit -m "fix(core): remove deprecated and defunct wtf* apis" -m "These apis have been deprecated in v8, so they should stick around till v10, but since they are defunct we are removing them early so that they don't take up payload size."
```

现在我们有多个句子描述这次提交的细节，注意：

- 我们使用多个 `-m` 分段，而不只是一行写完
- header 和 body 中间应有空行（上述做法自带空行）

**注意：**虽然分行不只有这种方法，但是我们后面为了方便会继续使用 `-m`（同时这样做肯定适配各种 shell）。

### Footer

footer 也是非必填的。这一行描述的是这次提交的“后续效果”，例如：表明这次修改是 breaking change、关闭 issue、提及贡献者等等。

```
git commit -m "fix(core): remove deprecated and defunct wtf* apis" -m "These apis have been deprecated in v8, so they should stick around till v10, but since they are defunct we are removing them early so that they don't take up payload size." -m "PR Close #33949"
```

最后，看看提交记录：

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/final-commit-message.png)

如你所想，这条 [commit](https://github.com/angular/angular/commit/cf420194ed91076afb66d9179245b9dbaabc4fd4) 出自 Angular 仓库。

## 常用类型

不止定义了 commit 信息的格式，Angular 还约定了一系列实用的类型。

在继续之前，我们先区分他们为两个大类：

- 开发类 - 维护用的类型，面向开发者，实际上不影响生产代码，但是会影响开发坏境和开发工作流
- 生产类 - 增强用的类型，面向用户，影响生产代码

下面开始介绍这些实用类型。

**注意：**下面的例子都直接使用 Angular 仓库的 commit。

### 👷 build

`build`（也常称为 `chore`），**开发类**，这些修改常包含构建系统（引入脚本、配置、工具）和依赖。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-build-type.png)

### 💚 ci

`ci`，**开发类**，持续集成和部署脚本、设置或工具相关。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-ci-type.png)

### 📝 docs

`docs`，**开发类**，项目文档相关，包括面向用户或内部开发者的文档。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-docs-type.png)

### ✨ feat

`feat`，**生产类**，向下兼容的新功能。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-feat-type.png)

### 🐛 fix

`fix`，**生产类**，向下兼容的 bug 修复。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-fix-type.png)

### ⚡️ perf

`perf`，**生产类**，向下兼容的性能提升

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-perf-type.png)

### ♻️ refactor

`refactor`，**开发类**，修改代码库，但不是添加新功能或修复 bug，而是移除多余代码、简化代码、重命名变量等操作。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-refactor-type.png)

### 🎨 style

**开发类**，代码格式化相关

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-style-type.png)

### ✅ test

**开发类**，重构测试或新增测试

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-test-type.png)

## 好处

约定基本都清楚了，下面说说这么做的两个好处。

### 历史浏览

git 为我们提供了浏览提交历史的功能，因此我们可以查询到每条提交发生了什么，提交人是谁等信息。

我们看看上面的约定如何让我们更方便地浏览记录：

```
git log --oneline --grep "^feat\|^fix\|^perf"
```

上例使用 commit 信息类型过滤信息，只显示生产类的修改（类型为 `feat`、`fix` 和 `perf`）。

另一个例子：

```
git log --oneline --grep "^feat" | wc -l
```

打印 `feat` 类型提交的总数。

我想说的是，约定的提交格式是十分结构化的，我们可以高效地浏览和过滤提交历史。

总之，非常地快！💪🏻

### 自动发布

commit 信息的格式在发布的自动步骤中也非常有用。

借助 commit 约定和 [Standard Version](https://github.com/conventional-changelog/standard-version) 和 [Semantic Release](https://github.com/semantic-release/semantic-release) 等严格遵循 [语义化版本号](https://semver.org/) 的工具，语义化发布。
未完成！！

so，根据 commit 信息（尤其是其中的类型字段），语义化发布可以做到：

- 自动确定下次发布的版本（fix 对应 patch，feat & perf 对应 minor，breaking change 对应 major）
- 生成本次发布的 CHANGELOG 文件和发布信息
- 为新版本创建 Git tag
- 发布到 npm 仓库

是不是很 cool？

例如，Ionic 的 [angular-toolkit](https://github.com/ionic-team/angular-toolkit) 就集成了自动发布流程：

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/example-of-release-note.png)

## 杂项

顺便看看其他让语义化 commit 更物尽其用的玩意。

### 使用 Emoji

使用 Emoji 可以进一步提升可读性，可以更快速地在 commit 历史中分辨各个 commit 类型。

查看以下链接：

- [gitmoji](https://gitmoji.carloscuesta.me/)
- [Commit Message Emoji 👋](https://github.com/dannyfritz/commit-message-emoji)

### CLI 工具

[Commitizen](https://github.com/commitizen/cz-cli) 强制使用 commit 格式的命令行工具。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/commitlint-example.png)

### Linter

[commitlint](https://github.com/conventional-changelog/commitlint) 是一个保证 commit 信息格式的工具。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/commitizen-example.png)

### VSCode 插件

![](https://github.com/nitayneeman/vscode-git-semantic-commit/blob/master/images/examples/preview.gif?raw=true)

## 总结

通过 Angular commit 约定的例子，我们介绍了语义化 Commit，解析了提交信息的结构。

总结起来有这些点：

- 语义化 commit 是依照某种约定填写的“有意义的” commit 信息，开发者可以轻易理解这些信息，开发工具也可以利用这种约定方便查找信息
- 语义化 commit 有更高可读性，更高效，更自动
- 约定 commit 遵循轻量的约定
- Angular 的指引
  - 信息包括 header、body 和 footer
  - 修改类型涉及生产类和开发类
- 约定后，我们可以更方便地浏览 commit 历史
- 约定后，我们可以更方便地处理发布信息

最后，无论你是否选择应用这种约定，你也可能在不知道什么地方偶然遇到这种操作，所以，记下上面的重点吧 😉
