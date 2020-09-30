---
path: '/commit-message'
date: '2020-09-30T15:34:23.853Z'
title: '理解语义化 Commit'
tags: ['coding', '翻译']
released: false
---

https://nitayneeman.com/posts/understanding-semantic-commit-messages-using-git-and-angular/#benefits

很多项目都会选择订立这样那样的 commit 提交约定，这不是什么新鲜的设定，只不过在近年来越来越多地被应用起来，很可能你已经遇到过使用着某种约定的项目。

最初提出 commit 约定的项目之一是 AngularJS。团队建立了详尽的文档说明成员们应该如何进行 commit。后来，commit 约定火起来了，或者大家接触到他们是在 Karma 的指引中。另外 jQuery、JSHint、Ember、Angular（AngularJS 约定的增强版）等，都有着各自不同的约定。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/conventions-diagram.png)

上面可以清晰看到各种 commit 约定的形式，这些约定中都包含了一个提交的合适原因。[Conventional Commits](https://www.conventionalcommits.org/) 就是这么一种规范，简化了 Angular 约定并简单说明了一些基础的 commit 约定。

本文会介绍 Semantic Commits 背后的思路，并借助 Git 和 Angular 约定举例说明，但是我们只是为了厘清这个概念，最终选择什么版本控制工具和具体的约定规则，还是由你自己决定。

那么开始啦！

## 动机

先解释一下这个名词：

> Semantic Commits 是指人类和机器都可读的 commit 信息，这些 commit 符合特定的约定

- 提交信息是语义的（semantic），因为要分类为有意义的“类型”，标志着这条 commit 的本质
- 提交信息是约定好的（conventional），因为格式是固定的，类型是常用的，对开发者和开发工具都是如此

这些语义化的 commit 让我们十分方便：

1. 维护者和开发者都可以很容易看清楚这个项目的历史，和一些提交的本质内容，也可以通过 commit 类型忽略一些不重要的提交
2. 限制 commit 的格式，鼓励更小颗粒度的提交
3. 直入主题，减少无用措辞
4. Bump the package version automatically, based on commit message types
5. 自动生成 CHANGELOG 和发布日志

总结来说，语义化 commit 可以让我们达到更高可读性和更快的速度，以及自动化。

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

```
git commit -m "fix(core): remove deprecated and defunct wtf* apis"
```

看看这条单行信息，以 `:` 分为两部分，左边的我们称为“前缀”，`fix` 和 `core`（影响的包）分别是 type 和 scope，而右边就是 Subject。

简单来说这条提交的意思就是：这次修改修复了一个 core 包里的 bug，具体操作是 remove deprecated and defunct wtf\* apis。

### Body

Body 非必填，其描述着此次修改的原因，或者是关于这次修改的细节。

```
git commit -m "fix(core): remove deprecated and defunct wtf* apis" -m "These apis have been deprecated in v8, so they should stick around till v10, but since they are defunct we are removing them early so that they don't take up payload size."
```

- 我们使用多个 `-m` 分段，而不是单行信息
- header 和 body 中间应有空行（上述做法自带空行）

注意：虽然分行不只有这种方法，但是我们后面为了方便会继续使用 `-m`（同时这样做肯定适配各种 shell）。

### Footer

footer 也是非必填的。这一行描述的是这次提交的“后续效果”，例如：表明这次修改是 breaking change、关闭 issue、提及贡献者等等。

```
git commit -m "fix(core): remove deprecated and defunct wtf* apis" -m "These apis have been deprecated in v8, so they should stick around till v10, but since they are defunct we are removing them early so that they don't take up payload size." -m "PR Close #33949"
```

最后，看看提交记录：

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/final-commit-message.png)

如你所想，这条 [commit](https://github.com/angular/angular/commit/cf420194ed91076afb66d9179245b9dbaabc4fd4) 出自 Angular 仓库。

## 常用类型

### 👷 build

`build`（也常称为 `chore`）是**开发**修改，这些修改常包含构建系统（引入脚本、配置、工具）和依赖。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-build-type.png)

### 💚 ci

`ci` 是**开发**修改，持续集成相关。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-ci-type.png)

### 📝 docs

`docs` 是项目文档修改，包括面向用户和开发者的文档。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-docs-type.png)

### ✨ feat

`feat` 是生产修改，是一些向后兼容的新功能。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-feat-type.png)

### 🐛 fix

`fix` 是生产修改，是一些向后兼容的 bug 修复。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-fix-type.png)

### ⚡️ perf

生产，向后兼容的性能提升

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-perf-type.png)

### ♻️ refactor

开发，修改代码库，但不是添加新功能或修复 bug，而是移除多余代码、简化代码、重命名变量等操作。

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-refactor-type.png)

### 🎨 style

开发，代码格式化相关

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-style-type.png)

### ✅ test

开发，重构测试或新增测试

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/examples-of-test-type.png)

## 好处

约定基本都清楚了，下面说说这么做的两个好处

### 历史浏览

```
git log --oneline --grep "^feat\|^fix\|^perf"
```

```
git log --oneline --grep "^feat" | wc -l
```

### 自动发布

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/example-of-release-note.png)

## 杂项

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/commitlint-example.png)

![](https://cdn.jsdelivr.net/gh/ssshooter/photoshop/commitizen-example.png)

## 总结

通过 Angular commit 约定的例子，我们介绍了语义化 Commit，解析了提交信息的结构。

总结起来有这些点：

- 